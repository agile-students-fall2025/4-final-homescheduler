import React, { useState } from 'react';
import logo from './logo.png';
import './ChangePassword.css'

export function ChangePassword(){
    const [currpassword, setcurrPassword] = useState('');
    const [newpassword, setnewPassword] = useState('');
    const [confpassword, setConfPassword] = useState('');

    
    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className = 'manage-password'>
            <img src={logo} alt="App Logo" className='app-logo' />
            <h1 className = "password-title">
                Update Password
            </h1>

            <form onSubmit={handleSubmit} className='new-password'>
                <input
                    type = 'password'
                    placeholder = "current password"
                    value ={currpassword}
                    onChange={(e) => setcurrPassword(e.target.value)}
                />
                <input
                    type = 'password'
                    placeholder = "new password"
                    value ={newpassword}
                    onChange={(e) => setnewPassword(e.target.value)}
                />
                <input
                    type = 'password'
                    placeholder = "confirm password"
                    value ={confpassword}
                    onChange={(e) => setConfPassword(e.target.value)}
                />
                <button type='submit' className="update_password_button">
                    update password
                </button>
            </form>
        </div>
    )
}