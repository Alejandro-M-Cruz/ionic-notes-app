import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";

const redirectUnauthenticatedUserToSignIn = redirectUnauthorizedTo(['/sign-in'])
const redirectLoggedInToProfile = redirectLoggedInTo(['/profile'])

const routes: Routes = [
  {
    title: 'Notes',
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    title: 'Sign in',
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule),
  },
  {
    title: 'Sign up',
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule),
  },
  {
    title: 'Profile',
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
  },
  {
    path: 'note-editor',
    loadChildren: () => import('./pages/note-editor/note-editor.module').then( m => m.NoteEditorPageModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
