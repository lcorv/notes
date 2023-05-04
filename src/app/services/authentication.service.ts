import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, updateProfile, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Observable, BehaviorSubject } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { NoteService } from '../services/note.service';
import { Note } from '../shared/note';
import { UserInfo } from 'firebase/auth';

interface AuthResponse {
  status: string;
  success: string;
  token: string;
}

interface JWTResponse {
  status: string;
  success: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;
  loginError: BehaviorSubject<Error | null> = new BehaviorSubject<Error | null>(null);
  actualError: Observable<Error | null> = this.loginError.asObservable();
  user: BehaviorSubject<UserInfo | null> = new BehaviorSubject<UserInfo | null>(null)
  activeUser: Observable<UserInfo | null> = this.user.asObservable();

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        console.log("user:",user.displayName)
        this.user.next(user)
      } else {

      }
    })
  }
  switchErr(err){
    switch (err.code){
      case 'auth/user-not-found':
        return "User not found";
        break;
      case 'auth/wrong-password':
        return "Wrong password";
        break;
      default:
        return 'Login Error'
    }
  }
  login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(()=>this.loginError.next(null))
      .catch((err) => { 
        let newErr= new Error(this.switchErr(err))
        this.loginError.next(newErr)
       })
  }
  get isLoggedIn() {
    return this.afAuth.authState;
  }
  async logout() {
    this.afAuth.signOut()
    .then(()=>{
    this.user.next(null);
    console.log("logged-out")
    window.location.reload()
    })

  }
  updateUser(name: string) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        updateProfile(user, {
          displayName: name
        })
      }
    })
  }

  signUp(email: string, password: string, name: string) {
     this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.login(email, password)
        .then(()=>{
          this.updateUser(name);
            if (user != null) {
              let newId = this.afs.createId();
              const nota:Note={
              user : user.user?.uid||'',
              content : "Welcome "+name+"! Grab your sticky notes! Double click to edit text and color",
              timestampCreated : (new Date().getTime()).toString(),
              timestampUpdated : (new Date().getTime()).toString(),
              title:"Welcome!",
              color: 'rgb(255, 255, 161)',
              zIndex:100,
              id : newId
              }
              this.afs.collection('notes').doc(newId).set(nota);
              
            }
        })
      })

  }
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: UserInfo = user;
    return userRef.set(userData, {
      merge: true,
    });
  }
}