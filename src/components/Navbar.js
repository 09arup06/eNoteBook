import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import "./Home.module.css";
import '../App.css';

import {
  Link
} from "react-router-dom";

const Navbar = (props) => {
  let location = useLocation();
  let navigate = useNavigate()

  const logout = () => [    //Front end Logout function 
    localStorage.removeItem('logintoken'),
    localStorage.removeItem('user'),
    props.showAlert("Successfully Logged Out", "warning")
  ]
  const fetch = () => {
    navigate('/userdashboard');
  }
  return (
    //Basic navbar
    <>
      <div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Cloud NoteBook</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/message">Message</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/about">About</Link>
                </li>
              </ul>
              <form className="d-flex" role="search">
                {!localStorage.getItem('logintoken') ? <div>
                  <Link className="btn btn-primary mx-2" to="/login" role="button">Login</Link>
                  <Link className="btn btn-primary mx-2" to="/register" role="button">Register</Link>
                </div> :
                  <Link className="btn btn-primary mx-2" to="/login" onClick={logout} role="button">Logout</Link>}
              </form>
              <div className='mx-2'>
                {localStorage.getItem('user') && localStorage.getItem('logintoken') ?
                  <span style={{ color: "Mediumslateblue" }}>
                    <i className="fa-solid fa-user-tie" onClick={fetch}></i></span> : ""}
              </div>
              {localStorage.getItem('user') && localStorage.getItem('logintoken') ? <div>

                <span className='nav-item' style={{ color: "red" }}>{localStorage.getItem('user')} </span>
              </div> : ""}
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

export default Navbar
