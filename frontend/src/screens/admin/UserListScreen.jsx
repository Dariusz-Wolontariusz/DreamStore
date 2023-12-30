import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { FaEdit, FaTimes, FaTrash, FaCheck } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useGetUsersQuery } from '../../slices/usersApiSlice'
import Message from '../../components/Message'
import Loader from '../../components/Loader'

const UserListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery()

  const deleteHandler = async (id) => {
    console.log('delete user', id)
  }

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Users</h1>
        </Col>
      </Row>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <td>ID</td>
              <td>NAME</td>
              <td>EMAIL</td>
              <td>ADMIN</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: 'green' }} />
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/user/${user._id}/edit`}>
                      <Button className='btn-sm mx-2' variant='dark'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      className='btn-sm'
                      variant='danger'
                      onClick={() => deleteHandler(user._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen
