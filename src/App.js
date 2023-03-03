
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
    <NoteState>
    <Router>
       <Navbar showAlert={showAlert}/>
       <Alert alert={alert}/>
    <div className="container app"> 
       <Routes>
        <Route exact path="/about"  element = {<About showAlert={showAlert}/>}/>    
        <Route exact path="/" element = {<Home showAlert={showAlert}/>}/>
        <Route exact path="/login" element = {<Login showAlert={showAlert}/>}/>
        <Route exact path="/register" element = {<Register showAlert={showAlert}/>}/>
        <Route exact path = "https://09arup06.github.io/eNoteBook/" element={<Home showAlert={showAlert}/>}/>
        </Routes>
        </div>
    </Router>
    </NoteState>
  );
}

export default App;
