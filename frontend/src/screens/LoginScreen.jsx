import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'

import { useLoginMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // login will invoke useLoginMutation()
  const [login, { isLoading }] = useLoginMutation()

  // get userInfo with is a part of state
  const { userInfo } = useSelector((state) => state.auth)

  // redirect is the place to go after login / checks if there's redirect parameter if not '/'
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  // fires when userInfo has changed
  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const submitHandler = async (e) => {
    e.preventDefault()

    // unwrap is used to extract data from res obj in REDUX toolkit
    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setCredentials({ ...res }))
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <FormContainer>
      <h1>Sign in</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          className='mt-2'
          disabled={isLoading}
        >
          Sign In
        </Button>
        {isLoading && <Loader />}
        <Row className='py-3'>
          <Col>
            Not registered yet?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
            >
              Create an account
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}

export default LoginScreen
