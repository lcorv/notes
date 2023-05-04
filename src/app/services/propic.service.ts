
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/compat/firestore';
import { UserInfo } from '@firebase/auth';
import { updateProfile } from "firebase/auth";

import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class PropicService {

  constructor(
    private auth:AuthenticationService,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth,
  ) { }
  getPropics(){
    return this.afs.collection('propic').valueChanges();
  }
  updatePropic(url: string) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        updateProfile(user, {
          photoURL: url
        })
      }
    })
  }
}