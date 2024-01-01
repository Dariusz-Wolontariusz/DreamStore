import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import {
  useUpdateUserMutation,
  useGetUserQuery,
} from '../../slices/usersApiSlice'

const UserEditScreen = () => {
  const { id: userId } = useParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const navigate = useNavigate()

  const { data: user, isLoading, error, refetch } = useGetUserQuery(userId)

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
    }
  }, [user])

  const submitHandler = async (e) => {
    e.preventDefault()

    const updatedUser = {
      userId,
      name,
      email,
      isAdmin,
    }
    try {
      await updateUser(updatedUser).unwrap()
      toast.success('User updated successfully')
      refetch()
      navigate('/admin/userlist')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
      <Link className='btn btn-dark my-3' to='/admin/userlist'>
        Go back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {isLoading && <Loader />}
        {loadingUpdate ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-2'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='email' className='my-2'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='isAdmin' className='my-2'>
              <Form.Label>Admin</Form.Label>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                value={isAdmin}
                onChange={(e) => setIsAdmin(e.target.check)}
              ></Form.Check>
            </Form.Group>
            <Button className='my-2' type='submit' variant='dark'>
              Update user
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default UserEditScreen
