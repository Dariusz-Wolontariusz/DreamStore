import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { addToCart, removeFromCart } from '../actions/cartActions'
import {
  Col,
  Row,
  Image,
  ListGroup,
  Card,
  Button,
  ListGroupItem,
  FormControl,
} from 'react-bootstrap'

const Cart = () => {
  const productId = useParams()

  const navigate = useNavigate()

  const location = useLocation();

  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (productId.id) {
      dispatch(addToCart(productId.id, qty))
    }
    // console.log('This are my new params:', productId);
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping')
  }

  return (
    <Row>
      <Col md={8}>
        <h1>YOUR SHOPPING CART</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'> Go back</Link>
          </Message>
        ) : (
          <ListGroupItem variant='flush'></ListGroupItem>
        )}
      </Col>
      <ListGroup>
        {cartItems.map((item) => (
          <ListGroupItem key={item.product}>
            <Row>
              <Col md={2}>
                <Image src={item.image} alt={item.image} fluid rounded></Image>
              </Col>
              <Col md={3}>
                <Link to={`/product/${item.product}`}>{item.name}</Link>
              </Col>
              <Col md={2}>$ {item.price}</Col>
              <Col md={2}>
                <FormControl
                  as='select'
                  value={item.qty}
                  onChange={(e) =>
                    dispatch(addToCart(item.product, Number(e.target.value)))
                  }
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </FormControl>
              </Col>
              <Col md={2}>
                <Button
                  type='button'
                  variant='light'
                  onClick={() => removeFromCartHandler(item.product)}
                >
                  <i className='fas fa-trash'></i>
                </Button>
              </Col>
            </Row>
          </ListGroupItem>
        ))}
      </ListGroup>
      <Col md={5}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>
                Subtotal: ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroupItem>
            <ListGroupItem>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to checkout
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default Cart
