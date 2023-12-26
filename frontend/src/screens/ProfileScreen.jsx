import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FaTimes } from 'react-icons/fa'
import { useProfileMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import Loader from '../components/Loader'

const ProfileScreen = () => {
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name)
      setEmail(userInfo.email)
    }
  }, [userInfo.name, userInfo.email, userInfo])

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation()

  const { data: orders, isLoading, error } = useGetMyOrdersQuery()

  const submitHandler = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Password do not match')
    }

    try {
      const res = await updateProfile({ name, email, password }).unwrap()

      dispatch(setCredentials(res))
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <Row>
      <Col md={3}>
        <h1>User Profile</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name' className='my-2'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder={`Enter new name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='email' className='my-2'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder={'Enter new email address'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password' className='my-2'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter new password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='confirmPassword' className='my-2'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary'>
            Update Profile
          </Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <h1>My Orders</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice} €</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen
