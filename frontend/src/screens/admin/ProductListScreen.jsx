import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice'
import Message from '../../components/Message'
import Loader from '../../components/Loader'

const ProductListScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery()

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation()

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation()

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
        refetch()
        toast.success('Product successfully deleted.')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to add a new product?')) {
      try {
        await createProduct()
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaEdit className='mx-2' />
            Add product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <td>ID</td>
                <td>NAME</td>
                <td>PRICE</td>
                <td>CATEGORY</td>
                <td>BRAND</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price} €</td>

                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button className='btn-sm mx-2' variant='dark'>
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        //used a fn in here because of need to pass the id to the handler
                        onClick={() => deleteHandler(product._id)}
                        variant='danger'
                        className='btn-sm'
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  )
}

export default ProductListScreen
