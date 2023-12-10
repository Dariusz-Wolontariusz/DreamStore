import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { PayPalButton, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
} from '../slices/ordersApiSlice'
import {
  Col,
  Row,
  Button,
  ListGroup,
  Image,
  Form,
  Card,
  ListGroupItem,
} from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'

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

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

  // const [{ data: paypal, isLoading: loadingPayPal, error: errorPayPal }] =
  //   useGetPayPalClientIdQuery()

  // all comes from PayPal docs
  // useEffect(() => {
  //   // console.log('errorPayPal:', errorPayPal)
  //   // console.log('loadingPayPal:', loadingPayPal)
  //   // console.log('paypal:', clientId)
  //   if (!errorPayPal && !loadingPayPal && paypal.clientId) {
  //     const loadPayPalScript = async () => {
  //       paypalDispatch({
  //         type: 'resetOptions',
  //         value: {
  //           clientId: paypal.clientId,
  //           currency: 'EUR',
  //         },
  //       })
  //       paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
  //     }
  //     // if it's not paid
  //     if (order && !order.isPaid) {
  //       // if it's not loaded, then load with
  //       if (!window.paypal) {
  //         loadPayPalScript()
  //       }
  //     }
  //   }
  // }, [order, paypal, paypalDispatch, errorPayPal, loadingPayPal])

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
            <ListGroupItem>
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
            </ListGroupItem>
            <ListGroupItem>
              <h2>Payment method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not paid</Message>
              )}
            </ListGroupItem>
            <ListGroupItem>
              {/* item instead of group creates list in a list */}
              <h2>Ordered items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroupItem key={index}>
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
                </ListGroupItem>
              ))}
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroupItem>
                <Row>
                  <h2>Order summary</h2>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Items:</Col>
                  <Col>{order.itemsPrice} €</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>{order.shippingPrice} €</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Tax:</Col>
                  <Col>{order.taxPrice} €</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Total:</Col>
                  <Col>{order.totalPrice} €</Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
