import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './MyCalender.css'
import { MyCalendar } from './MyCalender';
import { Login } from './Login';
import { HomePage } from './Homepage';


function App() {
  return (
   <div>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/myschedule" element={<MyCalendar />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
