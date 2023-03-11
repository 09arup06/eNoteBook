import React, { useContext, useEffect } from 'react'
import NoteContext from '../context/notes/NoteContext'

const UserDashboard = () => {
    const context = useContext(NoteContext)
    const {user , fetchuser} = context
    useEffect(() => {
      fetchuser()
      // eslint-disable-next-line
    }, [])
    
  return (
    // User Dashboard to view user basic information
    <>
    
    <div className="container my-5">
    <div className="container h-100">
      <div className="row d-flex justify-content-center align-items-center h-200">
        <div className="col-lg-12 col-xl-15">
          <div className="card text-black" style={{borderRadius: "25px"}}>
            <div className="card-body p-md-5">
              <div className="row justify-content-center">
                <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
  
                  <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Personal Information</p>
                 
                  <form className="mx-1 mx-md-4" >
                   
                    <div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label fw-bold" htmlFor="form3Example1c">Name: </label>
                        <>  {user.name}</>
                      </div>
                    </div>
  
                    <div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label fw-bold" htmlFor="form3Example3c">Email:</label>
                        <>  {user.email}</>
                      </div>
                    </div>
  
                    <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-solid fa-mobile-button fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label fw-bold" htmlFor="form3Example4cd">Phone Number</label>
                        <>  {user.phone_number}</>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label fw-bold" htmlFor="form3Example1c">Your City</label>
                        <> {user.city}</>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
  
                  <img src="https://images.unsplash.com/photo-1495610379499-a1f03b4732a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                    className="img-fluid" alt=""/>
                    
  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
   
  )
}

export default UserDashboard