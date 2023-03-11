import React from 'react'
const MessageItem = (props) => {
  const { msg } = props
 return (
    // display messages same as noteitem
    <>
      <div className='col-md-3'>
        <div className="card my-3 mx-2" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">Message</h5>
            <p className="card-text"> From: {msg.suser} </p>
            <p className="card-text"> Message: {msg.description}</p>
            <p className="card-text"> To: {msg.ruser}  </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default MessageItem