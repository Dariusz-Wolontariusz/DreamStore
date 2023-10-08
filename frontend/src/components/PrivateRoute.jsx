import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = () => {
  // get user info from global state
  const { userInfo } = useSelector((state) => state.auth)

  // outlet shows private route if logged in, otherwise navigate redirets to login page
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />
}

export default PrivateRoute
