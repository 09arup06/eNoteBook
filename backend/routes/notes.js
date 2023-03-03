const express = require ('express')
const router = express.Router()
const Note= require('../models/Note')
const { body, validationResult } = require('express-validator');
var fetchuser = require('../middleware/fetchuser')

// Route 1: To fetch all notes by authentication token that you get by loggin in
router.get('/fetchnotes',fetchuser,async (req,res)=>{
try {
    const notes = await Note.find({user:req.id})
    res.json(notes)
} catch (error) {
    console.log(error.message);
    res.status(500).send("Internal error Occured")
}

})

//Route 2: To add notes corresponding to userid Login required
router.post('/addnote',fetchuser,[
    body('title','Enter a title that has more than 3 letters').isLength({min:3},
        body('description','Description should be more than5 characters long')).isLength({midn:5}),], 
        async (req,res)=>{                              //Incase validation errors occurs then create an error array and show them to users
    try {
      const  {title,description,tag} = req.body;
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
      }                                                         
      const note = new Note({
        title,description,tag,user:req.id                   //Creating a new note using thses attributes and save it
      })
      const savednotes = await note.save()
      res.json(savednotes)
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error from authentication")
    }
  })

  //Route 3: To update notes by Noteid ,Login required 
router.put('/updatenote/:id',fetchuser,[
    body('title','Enter a title that has more than 3 letters'),
        body('description','Description should be more than 5 characters long'),], 
        async (req,res)=>{                              //Incase validation errors occurs then create an error array and show them to users
    try {
        const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
      }

      const  {title,description,tag} = req.body;
      const newNote={}
      if(title){newNote.title=title}
      if(description){newNote.description=description}
      if(tag){newNote.tag=tag}
      
      let note =await Note.findById(req.params.id);
      if (!note){return res.status(401).send("Note not found")}
      if(note.user.toString()!=req.id){return res.status(501).send("Authorization Failed")}
      note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
      res.json(note)
    }
catch(errors){
    console.log(errors.message);
    res.status(500).send("Internal Server Error from Notes")
}})

  //Route 4: To delete notes by Noteid ,Login required 
  router.delete('/deletenote/:id',fetchuser,async (req,res)=>{                              //Incase validation errors occurs then create an error array and show them to users
    try {
     let note = await Note.findById(req.params.id);
     if(!note){res.status(501).send("The note you are looking doesn't exist")}
     if(note.user.toString()!=req.id){return res.status(501).send("Authorization Failed")}
     note = await Note.findByIdAndDelete(req.params.id)
     return res.json("Deleted Bro")
    }
    catch(error){
      console.log(error.message);
      res.status(500);
}}
  );

module.exports= router