import { Row, Col, Container } from 'react-bootstrap'

const FormContainer = ({ children }) => {
  return (
    <Container className='d-flex justify-content-md-center'>
      <Col xs={12} md={6}>
        <Row>{children}</Row>
      </Col>
    </Container>
  )
}

export default FormContainer
