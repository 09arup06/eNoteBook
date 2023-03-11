
import noteContext from "./NoteContext";
import { useState } from "react";
const NoteState=(props)=>{
  const host = "http://localhost:5000/api"
  const notesInitial=[]
  const msgInitial = []
  const emailInitial = []
  const gmsgInitial = []
  const userInitial = []
  const [notes, setNotes] = useState(notesInitial)
  const [messages, setMsg] = useState(msgInitial)
  const [gmsg, setgmsg] = useState(gmsgInitial)
  const [emails, setEmails] = useState(emailInitial)
  const [user, setUser] = useState(userInitial)

  //fetching user information
      const fetchuser= async()=>{
          const response = await fetch(`${host}/auth/fetchuser`,{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
              'logintoken':localStorage.getItem('logintoken')
            }
          })
          const json = await response.json()
          setUser(json)
          
      }
      //Fetch all Notes
      const fetchNote= async ()=>{
        
        const response = await fetch(`${host}/notes/fetchnotes`,{
          method: 'GET',
          headers:{
            'Content-Type':'application/json',
            'logintoken':localStorage.getItem('logintoken')
          },
        });
        const json = await response.json()
      
      setNotes(json)
    }
      //Add a Note
      const addNote= async (title, tag, description)=>{
        const response = await fetch(`${host}/notes/addnote`,{
          method: 'POST',
          headers:{
            'Content-Type':'application/json',
            'logintoken':localStorage.getItem('logintoken')
          },
          body:JSON.stringify({title,description,tag})
        });
        
        const note = await response.json();
        setNotes(notes.concat(note))
      }
      //Delete a Note
      const deleteNote=async(id)=>{
        const response = await fetch(`${host}/notes/deletenote/${id}`,{
          method: 'DELETE',
          headers:{
            'Content-Type':'application/json',
            'logintoken':localStorage.getItem('logintoken')
          },
        });
        const json = await response.json()
        setNotes(json)
        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)
      }

      //Edit a Note
      const  editNote= async(id,title,description,tag)=>{
        //Api Calling
        // eslint-disable-next-line 
        const response = await fetch(`${host}/notes/updatenote/${id}`,{
         
          method: 'PUT',
          headers:{
            'Content-Type':'application/json',
            'logintoken':localStorage.getItem('logintoken')
          },
          body:JSON.stringify({title,description,tag})
    
        });  
      let newNotes = JSON.parse(JSON.stringify(notes))   
      
         for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if(element._id===id){
            newNotes[index].title = title;
            newNotes[index].description= description;
            newNotes[index].tag = tag;
            break;
          }
        }
        setNotes(newNotes);
       
      }

    // Send a message
    const addMsg= async (suser,ruser,description)=>{
      const response = await fetch(`${host}/notes/message`,{
        method: 'POST',
        headers:{
          'Content-Type':'application/json',
          'logintoken':localStorage.getItem('logintoken')
        },
        body:JSON.stringify({suser,ruser,description})
      });
      
      const msg1 = await response.json();
      setMsg(messages.concat(msg1))
    }

    //Fetching Message that has been sent 
    const sentMessage= async ()=>{    
      const response = await fetch(`${host}/notes/sentmessage`,{
        method: 'GET',
        headers:{
          'Content-Type':'application/json',
          'logintoken':localStorage.getItem('logintoken')
        },
      });
      const msg = await response.json()
      setMsg(msg)
  
  }

  //Fetching message that has been sent by other to this user
    const getMessage= async(email)=>{
      const response = await fetch(`${host}/notes/getmessage/${email}`,{
        method: 'GET',
        headers:{
          'Content-Type':'application/json',
          'logintoken':localStorage.getItem('logintoken')
        },
      });
      const json= await response.json()
      setgmsg(json)
    }

    //Get all registered Emails 
    const fetchEmails = async() => {
      const response = await fetch(`${host}/auth/fetchemail`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'logintoken':localStorage.getItem('logintoken')
        }  
      })
      const em = await response.json()
      setEmails(em)
    }

    
    //Exporting functions and variables to access througgh context
    return ( 
    <noteContext.Provider value={{notes,user,messages,gmsg,emails,setNotes,addNote,deleteNote,editNote,fetchNote,addMsg,sentMessage,getMessage,fetchEmails,fetchuser}}>
        {props.children}
    </noteContext.Provider>)
}

export default NoteState;