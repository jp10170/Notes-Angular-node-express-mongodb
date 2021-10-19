const Note = require("../models/note");

exports.createNote = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  note.save().then(createdNote => {
    res.status(201).json({
      message: 'Note added succesfully',
      note: {
        ...createdNote,
        id: createdNote._id,
      }
    });
  });
}

exports.updateNote = (req, res, next)=>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const note = new Note ({
    _id : req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Note.updateOne({_id: req.params.id, creator: req.userData.userId}, note).then(result => {
    console.log(result);
    if(result.matchedCount > 0) {
      res.status(200).json({message: "update succesfull!"});
    }
    else{
      res.status(401).json({message: "not authorized!"});
    }
  });
}

exports.getNotes = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const noteQuery = Note.find();
  let fetchedNotes;
  if(pageSize && currentPage){
    noteQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  noteQuery
    .then(documents => {
      fetchedNotes = documents;
      return Note.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'notes fetched succesfully',
        notes: fetchedNotes,
        maxNotes: count
      });
    });
};

exports.getNote = (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if(note){
      res.status(200).json(note);
    }else{
      res.status(404).json({message: "note not found!"})
    }
  })
};

exports.deleteNote = (req, res, next) => {
  Note.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if(result.deletedCount > 0) {
      res.status(200).json({message: "update succesfull!"});
    }
    else{
      res.status(401).json({message: "not authorized!"});
    }
  })
};

