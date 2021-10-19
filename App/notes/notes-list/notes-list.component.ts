import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import {Note} from "../notes.model";
import { NotesService } from "../notes.service";

@Component({

  selector: 'app-note-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],

})
export class NotesListComponent implements OnInit, OnDestroy{
  notes : Note[] = ([] as any[]);
  private notesSub: Subscription = new Subscription;
  isLoading = false;
  currentPage = 1;
  totalNotes = 0;
  notesPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  userId: string;
  private authStatusSub: Subscription;
  public userIsAuthenticated = false;

  constructor(public notesService: NotesService, private authService: AuthService) {}

  ngOnInit(){
    this.isLoading = true;
    this.notesService.getNotes(this.notesPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.notesSub = this.notesService.getNoteUpdateListener()
      .subscribe((noteData: {notes: Note[], noteCount: number}) => {
        this.isLoading = false;
        this.totalNotes = noteData.noteCount;
        this.notes = noteData.notes;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getOnStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.notesPerPage = pageData.pageSize;
    this.notesService.getNotes(this.notesPerPage, this.currentPage);

  };

  onDelete(noteId : string){
    this.notesService.deleteNote(noteId).subscribe(() => {
      this.notesService.getNotes(this.notesPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.notesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
