import React, { useContext, useEffect, useRef, useState } from 'react'
import NoteContext from '../context/notes/NoteContext';
import AddNote from './AddNote';
import NoteItem from "./NoteItem"
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
  const context = useContext(NoteContext)
  const { notes, fetchNote, editNote } = context;
  let navigate = useNavigate();
  
  const [note, setNote] = useState({id:"",title:"",description:"",tag:""})

  useEffect(() => {
    if(localStorage.getItem('logintoken')){
    fetchNote()}
    else {
      navigate("/login")
    }
    
    // eslint-disable-next-line
  }, [])
  const ref = useRef(null)
  const refClose = useRef(null)
  const updateNote = (currentnote) => {
    ref.current.click();
    setNote({id:currentnote._id,title:currentnote.title,description:currentnote.description,tag:currentnote.tag})
    
  }
  const handleClick = (e)=>{
    editNote(note.id, note.title, note.description, note.tag)
    props.showAlert("Updates Successfully","success")
    refClose.current.click();
    props.showAlert("Note Updated Successfully","success")
}
const onChange=(e)=>{
    setNote({...note,[e.target.name]:e.target.value})
}

  return (
    <>
      <AddNote showAlert={props.showAlert}/>

      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModalCenter">
        Launch demo modal
      </button>


      <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Edit This Note</h5>
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form className='container my-1'>
                <div className="form-group my-2">
                  <label htmlFor="title">Title</label>
                  <input type="text" className="form-control" onChange={onChange} id="title" name="title" placeholder={note.title} />
                </div>
                <div className="form-group my-2">
                  <label htmlFor="tag">Tag</label>
                  <input type="text" className="form-control" onChange={onChange} id="tag" name="tag"  placeholder={note.tag} />
                </div>

                <div className="form-group my-2">
                  <label htmlFor="description">Description</label>
                  <textarea className="form-control" id="description" name="description" rows="3" placeholder={note.description} onChange={onChange}></textarea>
                </div>
                
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" disabled={note.title.length<=3 || note.description.length<=5} className="btn btn-primary"onClick={handleClick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className='row my-3 container'>
        <h2>Your Notes</h2>
        <div className='container'>
        {notes.length<1 &&"You dont have any notes"}</div>
        {notes.map((note) => {
          return <NoteItem key={note._id} note={note} showAlert={props.showAlert} updateNote={updateNote} />

        })}</div>
    </>
  )

}

export default Notes