
import './App.css';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import About from './components/About';
import Home from './components/Home';
import Navbar from './components/Navbar';
import NoteState from './context/notes/NoteState';
import Login from './components/Login';
import Register from './components/Register';
import Alert from './components/Alert';
import UserDashboard from './components/UserDashboard';
import Messages from './components/Messages';
import Notes from './components/Notes';

function App() {
  const [alert, setAlert] = useState()
  const showAlert=(msg,type)=>{
    setAlert({
      msg: msg,
      type:type
    })
    setTimeout(() => {
      setAlert();
    }, 2500);
  }
  return (
    //Defining different routes and make context available to every routes by making it parent element
    <>
    
    <NoteState>
    <Router>
       <Navbar showAlert={showAlert}/>
       <Alert alert={alert}/>
    <div className="app container"> 
       <Routes>
        <Route exact path="/about"  element = {<About showAlert={showAlert}/>}/>    
        <Route path="/home" element = {<Home showAlert={showAlert}/>}/>
        <Route path="/*" element = {<Home showAlert={showAlert}/>}/>
        <Route exact path="/login" element = {<Login showAlert={showAlert}/>}/>
        <Route exact path="/register" element = {<Register showAlert={showAlert}/>}/>
        <Route exact path="https://09arup06.github.io/eNoteBook/"
         element={ <Home showAlert={showAlert} />}
          />
        <Route path="/userdashboard" element = {<UserDashboard showAlert={showAlert}/>}/>
        <Route path="/message" element = {<Messages showAlert={showAlert}/>}/>
        <Route path="/notes" element = {<Notes showAlert={showAlert}/>}/>
     
        </Routes>
        </div>
    </Router>
    </NoteState>
    </>
  );
}

export default App;
