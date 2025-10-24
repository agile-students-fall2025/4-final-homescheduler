import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './MyCalender.css'
import { MyCalendar } from './MyCalender';
import { FamilySchedule } from './FamilySchedule';
import { Login } from './Login';
import { Signup } from './Signup';
import { HomePage } from './Homepage';
import { Settings } from './Settings';
import { Manage_Acc } from './Manage_Acc';


function App() {
  return (
   <div>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/myschedule" element={<MyCalendar />} />
        <Route path="/familyschedule" element={<FamilySchedule />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/manage-account" element={<Manage_Acc />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
