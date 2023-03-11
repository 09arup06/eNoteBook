import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", phone_number: "", city: "" })
  let navigate = useNavigate();
  const handleClick = async (e) => {
    //to stop the page from reloading
    e.preventDefault();
    // callingg backend api to register a user using basic details
    const response = await fetch(`http://localhost:5000/api/auth/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password, phone_number: credentials.phone_number, city: credentials.city })
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem('token', json.logintoken)
      navigate("/")
      props.showAlert("Successfully Registered", "success")
    }
    else {
      props.showAlert("Invalid Credentials", "danger")

    }

  }
  const onChange = (e) => {
    //changing the state of credentials
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (

    <div className="container my-5">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                    <form className="mx-1 mx-md-4" onSubmit={handleClick} >

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <label className="form-label" htmlFor="form3Example1c">Your Name</label>
                          <input type="text" id="name" className="form-control" onChange={onChange} name="name"
                            placeholder="Enter Full Name" />
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <label className="form-label" htmlFor="form3Example3c">Your Email</label>
                          <input type="email" id="email" className="form-control" name="email" onChange={onChange} placeholder="Enter E-mail" />
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <label className="form-label" htmlFor="form3Example4c">Password</label>
                          <input type="password" id="password" className="form-control" autoComplete="on" minLength={5} onChange={onChange} name="password"
                            placeholder="Enter password" required />
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-solid fa-mobile-button fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <label className="form-label" htmlFor="form3Example4cd">Phone Number</label>
                          <input type="number" id="phone_number" className="form-control" onChange={onChange} name="phone_number"
                            placeholder="Enter Mobile Number" />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <label className="form-label" htmlFor="form3Example1c">Your City</label>
                          <input type="text" id="city" className="form-control" onChange={onChange} name="city"
                            placeholder="Enter where you reside" />
                        </div>
                      </div>

                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="submit" className="btn btn-primary btn-lg">Register </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid" alt="" />


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Register