import React,{useContext} from 'react'
import NoteContext from '../context/notes/NoteContext';
const NoteItem = (props) => {
    const {note,updateNote} = props
    const context = useContext(NoteContext)
    const {deleteNote} = context
    const del = ()=>{
      deleteNote(note._id)                        // deletenote using a note id to delete
      props.showAlert("Deleted Successfully","danger")
    }
  return (
    // Bootstrap Card code for displaying the notes and user can delete and update own notes
    <>
    <div className='col-md-3'>
    <div className="card my-3 mx-2" style={{width: "18rem"}}>
  <div className="card-body">
    <h5 className="card-title">Title: {note.title}</h5>
    <p className="card-text">Tag: {note.tag}</p>
    <p className="card-text"> {note.description}</p>
    
    <span style={{color: "Mediumslateblue"}}>
    <i className="fa-solid fa-trash"onClick={del}></i>
    <i className="fa-regular fa-pen-to-square mx-3"onClick={()=>{updateNote(note)}}></i>
    </span>
  
    
  </div>
</div>

</div>

</>
  )
}

export default NoteItem