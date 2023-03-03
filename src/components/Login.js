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
        <div><form className='container my-1'>
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
    )
}

export default Login