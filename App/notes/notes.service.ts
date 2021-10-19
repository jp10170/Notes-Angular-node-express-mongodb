import { Injectable } from '@angular/core';
import { Note } from './notes.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class NotesService{

 private notes: Note[] = [];
 private notesUpdated = new Subject<{notes: Note[], noteCount: number}>();

 constructor(private http: HttpClient, private router: Router) {}

 getNotes(notesPerPage: number, currentPage: number) {
   const queryParams = `?pageSize=${notesPerPage}&page=${currentPage}`;
   this.http
    .get<{message: string, notes: any, maxNotes: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(
      map(noteData => {
        return { notes: noteData.notes.map(note => {
          return {
            title: note.title,
            content: note.content,
            id: note._id,
            imagePath: note.imagePath,
            creator: note.creator
          };
        }), maxNotes: noteData.maxNotes};
      })
    )
    .subscribe((transformedNotesData) => {
      console.log(transformedNotesData);
      this.notes = transformedNotesData.notes;
      this.notesUpdated.next({
        notes: [...this.notes],
        noteCount: transformedNotesData.maxNotes
      });
    });

 }

 getNoteUpdateListener() {
   return this.notesUpdated.asObservable();
 }

 getNote(id: string) {
   return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>
   ('http://localhost:3000/api/posts/' + id);
 }

 addNote(title: string , content: string, image: File){
   const noteData = new FormData();
   noteData.append("title", title);
   noteData.append("content", content);
   noteData.append("image", image, title)
   this.http
    .post<{message: string, note: Note}>(
      'http://localhost:3000/api/posts',
       noteData
    )
    .subscribe((responseData) =>{
      this.router.navigate(["/"]);
    });
 }

 updateNote(id: string, title: string, content: string , image: File | string){
   let noteData: Note | FormData;
    if(typeof(image) === 'object'){
      noteData = new FormData();
      noteData.append("id", id);
      noteData.append("title", title);
      noteData.append("content", content);
      noteData.append("image", image, title)
    } else {
      noteData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, noteData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
 }

 deleteNote(noteId : String){
   return this.http.delete("http://localhost:3000/api/posts/" + noteId);
  }
}
