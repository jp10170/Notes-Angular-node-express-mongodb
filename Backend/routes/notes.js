const express = require('express');
const multer = require('multer');

const NotesController = require("../controllers/notes");

const app = require('../app');

const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const user = require('../models/user');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid mime type");
    if (isValid){
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({storage: storage}).single('image'),
  NotesController.createNote
);

router.put(
  "/:id", checkAuth,
  multer({storage: storage}).single('image'),
  NotesController.updateNote
);

router.get("", NotesController.getNotes);

router.get("/:id", NotesController.getNote);

router.delete("/:id", checkAuth, NotesController.deleteNote);

module.exports = router;
