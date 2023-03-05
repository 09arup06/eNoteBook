import React,{useState} from 'react'

import { useNavigate} from "react-router-dom";


const Login = (props) => {
    const [credentials, setCredentials] = useState({email:"",password:""})
    let navigate= useNavigate();
    const handleClick =async (e) => {
        e.preventDefault();
        
            const response = await fetch(`http://localhost:5000/api/auth/login`,{
              method: 'POST',
              headers:{
                'Content-Type':'application/json',
              },
              body:JSON.stringify({email:credentials.email,password:credentials.password})
            });
            const json = await response.json();
            if(json.success){
                    localStorage.setItem('logintoken',json.token);
                    navigate("/")
                    props.showAlert("Successfully Logged in","success")
            }
            else{
                props.showAlert("Invalid Credentials","danger")
            }
    }
    const onChange = (e) => {
        setCredentials({...credentials,[e.target.name]: e.target.value })
    }
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