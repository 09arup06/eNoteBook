import React from 'react'

const Alert = (props) => {
 
    return (//Alert for logging in , register , adding,deleting,updating notes and sending messages
        <div>
    {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
    <strong>{props.alert.msg}</strong> 
    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>}
  </div>
       
    )
}

export default Alert