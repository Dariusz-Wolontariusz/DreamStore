import React, { useEffect } from 'react'
import {
  Col,
  Row,
  Image,
  ListGroup,
  Card,
  Button,
  ListGroupItem,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { listProductDetails } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Rating from '../components/Rating'

const ProductScreen = ({ match }) => {
  // const product = products.find((p) => p._id === match.params.id) // pierwsza wersja
  // druga wersja gdzie fetch bezposrednio sie sciagalo dane z serwera, nie przez redux
  // const [product, setProduct] = useState({})

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     const { data } = await axios.get(`/api/products/${match.params.id}`)

  //     setProduct(data)
  //   }

  //   fetchProduct()
  // }, [match])

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(listProductDetails(match.params.id))
  }, [dispatch, match])

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  return (
    <>
      <Link className='btn btn-dark py-3' to='/'>
        Go back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroup.Item variant='flush'>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: £{product.price} </ListGroup.Item>
              <ListGroup.Item>{product.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>£{product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? 'In stock' : 'Out of stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    className='btn-block'
                    type='button'
                    disabled={product.countInStock === 0}
                  >
                    Add to cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}

export default ProductScreen
