import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Note } from '../notes.model';
import { NotesService } from '../notes.service';
import {mimeType} from './mime-type.validator';

@Component({
  selector: 'app-notes-create',
  templateUrl: './notes-create.component.html',
  styleUrls: ['./notes-create.component.css'],
})

export class NotesCreateComponent implements OnInit{

  enteredTitle='';
  enteredContent='';
  private mode = 'create';
  private noteId: string;
  note: Note;
  isloading = false;
  form: FormGroup;
  imagePreview: string;

  constructor(public notesService: NotesService, public route: ActivatedRoute) {}

  ngOnInit(){
    this.form = new FormGroup({
      'title': new FormControl(null,
         {validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('noteId')){
        this.mode ='edit';
        this.noteId = paramMap.get('noteId');
        this.isloading = true;
        this.notesService.getNote(this.noteId).subscribe(noteData => {
          this.isloading = false;
          this.note = {
            id: noteData._id,
            title: noteData.title,
            content: noteData.content,
            imagePath: noteData.imagePath,
            creator: noteData.creator
          };
          this.form.setValue({
            title: this.note.title,
            content: this.note.content,
            image: this.note.imagePath
          });
        });
      } else {
        this.mode ='create';
        this.noteId = null;
      }
    });
  }

  onSaveNote() {

    if(this.form.invalid){
      return;
    }
    this.isloading = true;
    if( this.mode === 'create'){
      this.notesService.addNote(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }else{
      this.notesService.updateNote(
        this.noteId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }
}

