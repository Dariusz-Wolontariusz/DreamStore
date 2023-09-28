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
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../slices/cartSlice'

const CartScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }))
  }

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id))
  }

  // if user isn't logged in, navigates to login page, if yes redirects to shipping page
  const checkoutHandler = () => navigate('/login?redirect=/shipping')

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>YOUR SHOPPING CART</h1>

        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go back</Link>
          </Message>
        ) : (
          <>
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroupItem key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fluid
                        rounded
                      ></Image>
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>€ {item.price}</Col>
                    <Col md={2}>
                      <FormControl
                        as='select'
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
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
                        onClick={(e) => removeFromCartHandler(item._id)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          </>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup>
            <ListGroupItem>
              <h2>
                Subtotal: (
                {cartItems.reduce((total, item) => total + item.qty, 0)}) items
              </h2>
              €{' '}
              {cartItems
                .reduce((total, item) => total + item.price * item.qty, 0)
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

export default CartScreen
