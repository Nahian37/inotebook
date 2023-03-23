const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all the notes: GET "/api/note/fetchallnotes". login required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    } 
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

//ROUTE 2: Add new note: POST "/api/note/add". login required
router.post('/add',fetchuser,[
    body('title','Title must be at least 3 characters.').isLength({ min: 3 }),
    body('description','Description must be at least 5 characters.').isLength({ min: 5 })
],async (req,res)=>{
    try {
        const {title, description, tag} = req.body;
        // If there are errors, return Bad Request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description,tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } 
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

//ROUTE 3: Update an existing note: PUT "/api/note/update". login required
router.put('/update/:id',fetchuser,[
    body('title','Title must be at least 3 characters.').isLength({ min: 3 }),
    body('description','Description must be at least 5 characters.').isLength({ min: 5 })
],async (req,res)=>{
    try {
        // If there are errors, return Bad Request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {title, description, tag} = req.body;
        //Create new note object
        let newNote ={};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        //Find the note
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not found")};
        //Check if the user owns the note
        if(note.user.toString()!== req.user.id){
            res.status(401).send("Not Allowed")
        }
        //Find the note by Id and update it
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
        res.json({note});
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 4: Delete a note: DELETE "/api/note/delete". login required
router.delete('/delete/:id',fetchuser,async (req,res)=>{
    try {
        //Find the note
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not found")};
        //Check if the user owns the note
        if(note.user.toString()!== req.user.id){
            res.status(401).send("Not Allowed")
        }
        //Find the note by Id and delete it
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted", note: note});
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router