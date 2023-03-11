import React, { useContext, useEffect} from 'react'
import MessageItem from './MessageItem';
import { useNavigate } from 'react-router-dom';
import NoteContext from '../context/notes/NoteContext';
import AddMessage from './AddMessage'

const Messages = (props) => {
  const context = useContext(NoteContext)
  const {messages, gmsg, sentMessage ,getMessage} = context;
  
  let navigate = useNavigate()
  useEffect(() => {
    if (localStorage.getItem('logintoken')) {       //calling functions from context to fetch messages that has been sent or recieved 
      sentMessage()
      getMessage(localStorage.getItem('user'))          
    }
    else {
      navigate("/login")
    }

    // eslint-disable-next-line
  }, [])
  return (
    //Pass all the information to messageitem to display
    <>
    <AddMessage showAlert={props.showAlert}/>
    <div className='row my-3 container'>
      <h2>Sent Messages</h2>
      <div className='container'>
      {messages.length < 1 && "You havent send any Messagges"}</div>
        {messages.map((msg) => {
          return <MessageItem key={msg._id} msg={msg} showAlert={props.showAlert}  />
        })}
        </div> 
        <div className='row my-3 container'>
      <h2>Inbox</h2>
      <div className='container'>
      {gmsg.length < 1 && "You have no Messagges"}</div>
        {gmsg.map((msg) => {
          return <MessageItem key={msg._id} msg={msg} showAlert={props.showAlert}  />
        })}
        </div> 
      </>
  )
}

export default Messages