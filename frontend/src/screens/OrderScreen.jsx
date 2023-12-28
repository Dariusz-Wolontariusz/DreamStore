import { useParams, Link } from 'react-router-dom'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Col, Row, Button, ListGroup, Image, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice'

const OrderScreen = () => {
  // rename id got prom query to orderID
  const { id: orderId } = useParams()

  // refetch f. refetches data to do not stuck with old data
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId)

  const { userInfo } = useSelector((state) => state.auth)

  // had to rename isLoading because it exists already in above query

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation()

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation()

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery()

  // all comes from PayPal docs
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'EUR',
          },
        })
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
      }
      // if it's not paid
      if (order && !order.isPaid) {
        // if it's not loaded, then load with
        if (!window.paypal) {
          loadPayPalScript()
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch])

  const onApprove = (data, actions) => {
    // comes from PayPal documentation
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details })
        // after its paid refetch will reload data and change message 'not paid'
        refetch()
        toast.success('Payment successful')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    })
  }

  // use for a test button, remove while refactoring
  // const onApproveTest = async () => {
  //   // bc it's a test, there's no data from PayPal, that's why datails comes with payer empty object
  //   await payOrder({ orderId, details: { payer: {} } })
  //   // after its paid refetch will reload data and change message 'not paid'
  //   refetch()
  //   toast.success('Payment successful')
  // }

  const deliverHandler = async (e) => {
    e.preventDefault()

    try {
      await deliverOrder(orderId)
      refetch()
      toast.success('Order marked as delivered')
    } catch (err) {
      toast.error(err?.data?.message || err.message)
    }
  }

  const onError = (err) => {
    toast.error(err.message)
  }

  const createOrder = (data, actions) => {
    return (
      actions.order
        .create({
          purchase_units: [
            {
              amount: { value: order.totalPrice },
            },
          ],
        })
        // it returns a promise
        .then((orderId) => {
          return orderId
        })
    )
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger' />
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address},{' '}
                {order.shippingAddress.postalCode} {order.shippingAddress.city},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              {/* item instead of group creates list in a list */}
              <h2>Ordered items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x {item.price} € = {item.qty * item.price} €
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <h2>Order summary</h2>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>{order.itemsPrice} €</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>{order.shippingPrice} €</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>{order.taxPrice} €</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>{order.totalPrice} €</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
            {!order.isPaid && (
              <ListGroup.Item>
                {loadingPay && <Loader />}

                {isPending ? (
                  <Loader />
                ) : (
                  <div>
                    {/* Button used for testing the changes after payment */}
                    {/* <Button
                      onClick={onApproveTest}
                      style={{ marginBottom: '10px', marginTop: '10px' }}
                    >
                      Test pay order
                    </Button> */}
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  </div>
                )}
              </ListGroup.Item>
            )}

            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && !order.isDelivered && (
              <ListGroup.Item>
                <Button
                  className='btn btn-block'
                  style={{ marginBottom: '10px', marginTop: '10px' }}
                  onClick={deliverHandler}
                >
                  Mark as delivered
                </Button>
              </ListGroup.Item>
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
