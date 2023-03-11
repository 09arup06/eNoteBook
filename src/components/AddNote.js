import React,{useContext} from 'react'
import { useState } from 'react';
import NoteContext from '../context/notes/NoteContext';
const AddNote = (props) => {
    const context = useContext(NoteContext)
    const {addNote} = context;
    const [note, setNote] = useState({title:"",description:"",tag:"general"})
    const additem=(e)=>{
        e.preventDefault();
            addNote(note.title,note.tag,note.description,);       //calling addnote function from context tooo add the notes
            props.showAlert("Note Added Successfully","success")
    }
    const onChange=(e)=>{
        setNote({...note,[e.target.name]:e.target.value})
    }
  return (
    <div>
        <form className='container my-1'>
  <div className="form-group my-2">
    <label htmlFor="title">Title</label>
    <input type="text" className="form-control" onChange={onChange} id="title" name="title" required={true} placeholder="Enter title of your note"/>
  </div>
  <div className="form-group my-2">
    <label htmlFor="tag">Tag</label>
    <input type="text" className="form-control" onChange={onChange} id="tag" name="tag" placeholder="GENERAL"/>
  </div>

<div className="form-group my-2">
    <label htmlFor="description">Description</label>
    <textarea className="form-control" id="description" name = "description" required={true} rows="3" onChange={onChange}></textarea>
  </div>
  <button type="submit" disabled={note.title.length<=3 || note.description.length<=5} className="btn btn-primary" onClick={additem}>Add Note</button>
  </form>
  </div>

  )
}

export default AddNote