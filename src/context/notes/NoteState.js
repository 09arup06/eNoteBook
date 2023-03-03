
import noteContext from "./NoteContext";
import { useState } from "react";
const NoteState=(props)=>{
  const host = "http://localhost:5000/api"
  const notesInitial=[]
  const [notes, setNotes] = useState(notesInitial)

      //Fetch all Notes
      const fetchNote= async ()=>{
        
        const response = await fetch(`${host}/notes/fetchnotes`,{
          method: 'GET',
          headers:{
            'Content-Type':'application/json',
            //'logintoken':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmNkOGUzMTg0OWY5M2UwZmMxZmQ5ZCIsImlhdCI6MTY3Nzg0NjA4N30.UtyRBBB8kfUGXhdUradYd3ajXXsQGuqK20yPMXK_s5c"
            'logintoken':localStorage.getItem('logintoken')
          },
        });
        const json = await response.json()
      
      setNotes(json)
    }
      //Add a Note
      const addNote= async (title, tag, description)=>{
        console.log("Added a new Note");
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
      console.log(json)
      setNotes(json)
        console.log("Deleted with id: "+id)
        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)
      }

      //Edit a Note
      const  editNote= async(id,title,description,tag)=>{
        //Api Calling
        const response = await fetch(`${host}/notes/updatenote/${id}`,{
          method: 'PUT',
          headers:{
            'Content-Type':'application/json',
            'logintoken':localStorage.getItem('logintoken')
          },
          body:JSON.stringify({title,description,tag})
        });
        const json = await response.json()
      console.log(json)
      
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
    
    return ( 
    <noteContext.Provider value={{notes,setNotes,addNote,deleteNote,editNote,fetchNote}}>
        {props.children}
    </noteContext.Provider>)
}

export default NoteState;