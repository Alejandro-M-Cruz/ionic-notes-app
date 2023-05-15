import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";

const redirectUnauthenticatedToSignIn = () => redirectUnauthorizedTo(['/sign-in'])
const redirectUnauthenticatedToHome = () => redirectUnauthorizedTo(['/sign-in'])
const redirectLoggedInToProfile = () => redirectLoggedInTo(['/profile'])
const redirectLoggedInToNotes = () => redirectLoggedInTo(['/notes'])

const routes: Routes = [
  {
    title: 'Home',
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToNotes }
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    title: 'Notes',
    path: 'notes',
    loadChildren: () => import('./pages/notes/notes.module').then( m => m.NotesPageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthenticatedToHome }
  },
  {
    title: 'Log in',
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToProfile }
  },
  {
    title: 'Sign up',
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToProfile }
  },
  {
    title: 'Profile',
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthenticatedToSignIn }
  },
  {
    path: 'note-editor',
    loadChildren: () => import('./pages/note-editor/note-editor.module').then( m => m.NoteEditorPageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthenticatedToSignIn }
  },
  {
    path: '**',
    redirectTo: 'home'
  },  {
    path: 'no-connection',
    loadChildren: () => import('./pages/no-connection/no-connection.module').then( m => m.NoConnectionPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
