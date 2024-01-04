import  { useState } from 'react';
import Navbar from '../../components/navbar/Navbar'
import loginpageicon from '../../assets/loginpageicon.png'
import { useNavigate } from 'react-router-dom';

import './login.css'
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleEmailChange = (event) => {
    setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    }
    const handleSubmit = (event) => {
    event.preventDefault();
    if(email && password) { 
    fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.message === 'created' || data.message === 'valid') {
            navigate('/room');
        } else if (data.message === 'invalid') {
            alert('Invalid password');
        }
        })
    .catch((error) => {
        console.error('Error:', error);
    });
    }
}

    return (
        <div className="login-body" >
            <Navbar/>
            <div className='login-container'>
                <div className='login-sider'>
                    <img src ={loginpageicon} />
                    <div>Welcome to</div>
                    <div>Goodspace Communication</div>
                </div>
                <form className='login-form'>
                    <div className='login-form-header'>
                        Signup/Login
                    </div>
                    <div className='login-form-body'>
                        <div className='login-form-user'>
                            <div className='login-form-text'>
                                Your Email Id
                            </div>
                            <input className='login-form-input' type="text" placeholder="" onChange ={handleEmailChange} value = {email} required/>
                            
                        </div>
                        <div className='login-form-password'>
                            <div className='login-form-text'>
                                Password
                            </div>
                            
                            <input className='login-form-input' type="password" placeholder="" value={password} autoComplete="section-red shipping postal-code" onChange={handlePasswordChange} required />
                            
                        </div>
                    </div>
                    <button className = "login-button" onClick={handleSubmit}>Lets Go!!</button>
                </form>
            </div>
        </div>
    )
}
export default Login