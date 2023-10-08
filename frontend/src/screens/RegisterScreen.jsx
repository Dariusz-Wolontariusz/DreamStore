import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useRegisterMutation } from '../slices/usersApiSlice'
import Loader from '../components/Loader'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [register, { isLoading }] = useRegisterMutation()

  // get userInfo with is a part of state
  const { userInfo } = useSelector((state) => state.auth)

  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect' || '/')

  // fires when userInfo has changed
  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const submitHandler = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
    } else {
      try {
        const res = await register({ name, email, password })
        dispatch(setCredentials({ ...res }))
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return (
    <FormContainer>
      <h1>Sign up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='my-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          className='mt-2'
          disabled={isLoading}
        >
          Register
        </Button>
        {isLoading && <Loader />}
        <Row>
          <Col>
            Already have an account?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
              Login
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}

export default RegisterScreen
