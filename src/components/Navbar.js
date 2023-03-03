import React from 'react'
import { useLocation } from 'react-router-dom';
import {
    Link
  } from "react-router-dom";
const Navbar = (props) => {
    let location = useLocation();
    const logout=()=>[
      localStorage.removeItem('logintoken'),
      props.showAlert("Successfully Logged Out","warning")     
    ]
  return (
    <div>
       <nav className={`navbar navbar-expand-lg navbar-dark bg-dark`}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Cloud NoteBook</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname==='/'?'active':''}`} aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname==='/about'?'active':''}`} to="/about">About</Link>
            </li>       
          </ul>
          {!localStorage.getItem('logintoken')?<div>
                  <Link className="btn btn-primary mx-2" to="/login" role="button">Login</Link>
                  <Link className="btn btn-primary mx-2" to="/register" role="button">Register</Link>
          </div>:<Link className="btn btn-primary mx-2" to="/login" onClick={logout} role="button">Logout</Link>}
          
        </div>
      </div>
    </nav>
    </div>
  )
}

export default Navbar
