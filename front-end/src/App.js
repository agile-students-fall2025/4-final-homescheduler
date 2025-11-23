import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './MyCalender.css'
import { MyCalendar } from './MyCalender';
import { EventModal } from './EventMod';
import { FamilySchedule } from './FamilySchedule';
import { CombinedSchedule } from './CombinedSchedule';
import { Login } from './Login';
import { Signup } from './Signup';
import { HomePage } from './Homepage';
import { Settings } from './Settings';
import { ManageAcc } from './ManageAcc';
import { ChangePassword } from './ChangePassword';
import Reminder from './Reminder';
import { JoinFamily } from './JoinFamily';
import ProtectedRoute from "./ProtectedRoute";


function App() {
  return (
   <div>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/myschedule" element={<ProtectedRoute><MyCalendar /></ProtectedRoute>} />
        <Route path="/familyschedule" element={<ProtectedRoute><FamilySchedule /></ProtectedRoute>} />
        <Route path="/combinedschedule" element={<ProtectedRoute><CombinedSchedule /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/manage-account" element={<ProtectedRoute><ManageAcc /></ProtectedRoute>} />
        <Route path="/change_password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/join_fam" element={<ProtectedRoute><JoinFamily /></ProtectedRoute>} />
        <Route path='/Reminders' element = {<ProtectedRoute><Reminder /></ProtectedRoute>} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
