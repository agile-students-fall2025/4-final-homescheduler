import React, { useState } from 'react';
import logo from './logo.png';
import './ChangePassword.css'
import { useNavigate } from 'react-router-dom';

export function ChangePassword(){
    const [currpassword, setcurrPassword] = useState('');
    const [newpassword, setnewPassword] = useState('');
    const [confpassword, setConfPassword] = useState('');
    const navigate = useNavigate();

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currpassword || !newpassword || !confpassword) {
            alert("Please fill in all fields");
            return;
        }
        if (newpassword !== confpassword){
            alert("New password does not match")
            return;
        }

        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const email = userData?.email; 

            if (!email) {
                alert("No user email found. Please log in again.");
                return;
            }

            const res = await fetch("/api/password/change_password", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({email, currpassword, newpassword }),
            });
            const data = await res.json();
            if (!res.ok){
                alert(data.message || "Failed to update password")
            }
            alert("Password updated succesfully")
            navigate('/manage-account');
        }catch(err){
            console.error("Error:", err);
            alert('An error occurred while changing the password.');
        }
    };
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