import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import Login from './Login';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../../../components/LoadingSpinner';

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {loading, handleRegister} = useAuth()
    


    const handleSubmit = async (e) =>{
        e.preventDefault();
        await handleRegister({username, email, password})
        navigate("/")
    }

    if (loading) {
        return <LoadingSpinner size="medium" message="Signing you in..." />
    }
  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="text">UserName: </label>
                    <input onChange={(e)=>{setUsername(e.target.value)}} type="text" name="text" id="text" placeholder='Enter your Username...' />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email: </label>
                    <input onChange={(e)=>{setEmail(e.target.value)}} type="email" name="email" id="email" placeholder='Enter your Email...' />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password: </label>
                    <input onChange={(e)=>{setPassword(e.target.value)}} type="password" name="password" id="password" placeholder='Enter your Password...' />
                </div>
                <button className='button primary-button'>Register</button>
            </form>
            <p>Already have an account? <Link to={"/login"}>Login</Link></p>
        </div>
    </main>
  )
}

export default Register
