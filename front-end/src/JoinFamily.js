import React, { useState} from 'react';
import logo from './logo.png';
import './JoinFamily.css'
import { useNavigate } from 'react-router-dom';

export function JoinFamily(){

    const [joinFam, setjoinCode] = useState('');
    const [famName, setfamName] = useState('')
    const [famCode, setfamCode] = useState('');
    const navigate = useNavigate();

    const generateCode = () => {
        const arr = new Uint8Array(4);  // 4 random bytes
        window.crypto.getRandomValues(arr);

        const hex = Array.from(arr)
            .map(b => b.toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase();
            // Example: "3FA94D21"
        setfamCode(hex);
        return hex;
    };


    const handleJoin = async (e) => {
        e.preventDefault();

        if (!joinFam){
            alert("Enter a family code to join");
            return;
        }
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("/api/family/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ familyCode: joinFam })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Something went wrong. Please try again.");
                return;
            }

            alert(`Joined family: ${data.familyName}`);
            navigate("/home");

        } catch (err) {
            console.error(err);
            alert("Server error joining family");
        }
        console.log("Joining Family:", joinFam);
    };
    const handleCreate = async (e) => {
        e.preventDefault();

        if (!famName){
            alert("Provide a family name");
            return;
        }
        const newCode = generateCode();

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/family", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    familyName: famName,
                    familyCode: newCode
                }),
            });
            const data = await res.json();
            if (!res.ok){
                alert(data.message);
                return; 
            }
            const stored = JSON.parse(localStorage.getItem("user"));
            stored.family = data.familyId;        
            localStorage.setItem("user", JSON.stringify(stored));
            
            alert(`Family created! Your invite code is: ${data.familyCode}`);
        }catch(err){
            console.error(err);
            alert("Server error");
        }
    };


    return (
        <div className='join-fam'>
            <img src={logo} alt="App Logo" className='app-logo' />

            <h1 className="join-title">Join or Create Family Schedule</h1>

            <form className="code-form">

                {/* JOIN SECTION */}
                <label>Join existing Family Schedule</label>

                <input
                    type="text"
                    placeholder="family code"
                    value={joinFam}
                    onChange={(e) => setjoinCode(e.target.value)}
                />

                <button type="button" className="create-button" onClick={handleJoin}>
                    join
                </button>

                <p className="or-text">or</p>

                {/* CREATE SECTION */}
                <label>Create a new Family Schedule</label>

                <input
                    type="text"
                    placeholder="family name"
                    value={famName}
                    onChange={(e) => setfamName(e.target.value)}
                />
                <div className='code-input-wrapper'>
                    <input
                        type="text"
                        placeholder="family code"
                        value={famCode}
                        readOnly
                    />
                    <button type="button" className="generate-icon" onClick={generateCode} title="Generate Code">
                        🔁
                    </button>
                </div>
                <button
                    type="button"
                    className="create-button"
                    onClick={handleCreate}
                >
                    Create
                </button>
            </form>
        </div>
    );
}
