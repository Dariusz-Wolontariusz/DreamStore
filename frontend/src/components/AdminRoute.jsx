import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminRoute = () => {
  // get user info from global state
  const { userInfo } = useSelector((state) => state.auth)

  // outlet shows private route if logged in, otherwise navigate redirets to login page
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace />
  )
}

export default AdminRoute
