import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './MyCalender.css'
import { MyCalendar } from './MyCalender';
import { EventModal } from './EventMod';
import { FamilySchedule } from './FamilySchedule';
import { Login } from './Login';
import { Signup } from './Signup';
import { HomePage } from './Homepage';
import { Settings } from './Settings';
import { ManageAcc } from './ManageAcc';
import { ChangePassword } from './ChangePassword';
import Reminder from './Reminder';
import { JoinFamily } from './JoinFamily';


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
        <Route path="/manage-account" element={<ManageAcc />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path="/join_fam" element={<JoinFamily />} />
        <Route path='/Reminders' element = {<Reminder />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
