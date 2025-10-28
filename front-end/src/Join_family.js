import React, { useState} from 'react';
import logo from './logo.png';
import './Join_family.css'

export function Join_family(){

    const [joinFam, setjoinCode] = useState('');
    const [famName, setfamCode] = useState('')
    const [create, setcreateCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className = 'join-fam'>
            <img src = {logo} alt="App Logo" className='app-logo' />
            <h1 className = "join-title">
                Join or Create Family Schedule
            </h1>
            <form onSubmit={handleSubmit} className="code-form">
                <label>Join existing Family Schedule </label>
                <input
                type="text"
                placeholder="family code"
                value={joinFam}
                onChange={(e) => setjoinCode(e.target.value)}
                />

                <button type="submit" className="create-button">
                join
                </button>

                <p className="or-text">or</p>

                <label>Create a new Family Schedule</label>
                <input
                type="text"
                placeholder="family name"
                value={famName}
                onChange={(e) => setfamCode(e.target.value)}
                />

                <input
                type="text"
                placeholder="family code"
                value={create}
                onChange={(e) => setcreateCode(e.target.value)}
                />

                <button type="submit" className="create-button">
                create
                </button>
            </form>
        </div>
        
    )
}
