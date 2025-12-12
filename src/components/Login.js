import React,{useContext, useState} from 'react'

import { useNavigate} from "react-router-dom";
import NoteContext from '../context/notes/NoteContext';


const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();
  const context = useContext(NoteContext);
  const { fetchuser } = context;

  const API_BASE = process.env.REACT_APP_API_URL;

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const body = {
        operation: "login",
        payload: { email: credentials.email, password: credentials.password },
      };

      const response = await fetch(`${API_BASE}/Users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const text = await response.text();

      // Try to parse whatever we received (robust to wrapper or direct JSON)
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch (e) {
        console.warn("Could not parse raw response text as JSON:", e);
        try {
          // maybe response.json() works (rare if text was not JSON)
          json = await response.json();
        } catch (e2) {
          json = {};
        }
      }

      // If API returned the Lambda proxy wrapper, the actual payload is in json.body (a string)
      if (json && typeof json.body === "string") {
        try {
          const inner = JSON.parse(json.body);
          // merge top-level with inner so inner keys win
          json = { ...json, ...inner };
        } catch (e) {
          console.warn("Could not parse wrapper body:", e);
        }
      }


      if (!response.ok) {
        const err = json.error || json.message || "Login failed";
        props.showAlert(err, "danger");
        return;
      }

      if (json && json.token) {
        // store token under logintoken (your other code reads this)
        localStorage.setItem("logintoken", json.token);
        // store minimal user
        localStorage.setItem("user", JSON.stringify(json.user || { email: credentials.email }));
        try { await fetchuser(); } catch (ferr) { console.error("fetchuser error:", ferr); }
        navigate("/");
        props.showAlert("Successfully Logged in", "success");
      } else {
        const err = json.error || json.message || "Invalid Credentials";
        props.showAlert(err, "danger");
      }
    } catch (err) {
      console.error("Login error:", err);
      props.showAlert(err.message || "Network error", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

    
    return (
        
        <div className="container my-5">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{borderRadius: "25px"}}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
    
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Log In</p>
            
            <form className='container mx-1 mx-md-4 my-1'>
            <div className="form-group my-2">
                <label htmlFor="email">Email</label>
                <input type="text" className="form-control" onChange={onChange} id="email" name="email" value={credentials.email} placeholder="email" />
            </div>
            <div className="form-group my-2">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" autoComplete="on" onChange={onChange} id="password" name="password" value={credentials.password} placeholder="password" />
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleClick}>Login</button>
        </form></div>
        </div>
                <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
  
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                    className="img-fluid" alt=""/>
                    
  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
 
  
    )
}

export default Login
