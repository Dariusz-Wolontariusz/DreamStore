import React from 'react'
import { Col, Row } from 'react-bootstrap'
import products from '../products'
import Product from '../components/Product'

const HomeScreenn = () => {
  return (
    <>
      <h1>All your dreams in one place</h1>
      <Row>
        {products.map((product) => (
          <Col sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default HomeScreenn
