import logo from './logo.svg';
import './App.css';
import './MyCalender.css'
import { MyCalendar } from './MyCalender';
import { EventButton } from './AddEvent';
import { EventModal } from './EventMod';
function App() {
  return (
   <div>
      <MyCalendar></MyCalendar>
    </div>
  );
}

export default App;
