import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import LoadingSpinner from '../../../components/LoadingSpinner'

function Protected({children}) {

    const { loading, user } = useAuth()
    if(loading){
        return <LoadingSpinner size="medium" message="Authenticating..." />
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
  return children
}

export default Protected
