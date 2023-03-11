import React, { useContext, useState, useEffect } from 'react'
import NoteContext from '../context/notes/NoteContext'
const AddMessage = (props) => {
  const context = useContext(NoteContext)
  const { addMsg, emails, fetchEmails } = context
  const [msg, setMsg] = useState({ suser: localStorage.getItem('user'), ruser: "", description: "" })
  const addmsg = (e) => {
    e.preventDefault();

    addMsg(msg.suser, msg.ruser, msg.description);        // calling addMsg from context to add the messages
    props.showAlert("The message has been sent", "success")

  }
  const onChange = (e) => {
    setMsg({ ...msg, [e.target.name]: e.target.value })
  }
  useEffect(() => {
    fetchEmails()
    // eslint-disable-next-line
  }, [])

  let emailslist = emails.length > 0 && emails.map((item, i) => {
    return (
      <option className=' btn btn-success' key={i} >{item}</option>
    )
  }, this);

  return (
    <>
      <div className='container'>
        <h3>Send a Message</h3><form className='my-1'>

          Select Email to send message

          <select className='btn btn-secondary mx-2' id="ruser" name="ruser" onChange={onChange} defaultValue={localStorage.getItem('user')}>
            {emailslist}
          </select>
          <div className="form-group my-2">
            <label htmlFor="title">Your Email</label>
            <input type="text" className="form-control" onChange={onChange} id="suser" name="suser" disabled value={localStorage.getItem('user')} />
          </div>
          <div className="form-group my-2">
            <label htmlFor="description">Description</label>
            <textarea className="form-control" id="description" name="description" required={true} rows="3" onChange={onChange}></textarea>
          </div>
          <button type="submit" className="btn btn-primary" onClick={addmsg}>Send Message</button>
        </form> </div>
    </>
  )
}

export default AddMessage