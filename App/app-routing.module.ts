import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NotesCreateComponent } from './notes/notes-create/notes-create.component';
import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: '', component: NotesListComponent},
  {path: 'create', component: NotesCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:noteId', component: NotesCreateComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
