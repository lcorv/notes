import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/compat/firestore';
import { Note } from '../shared/note';
import { UserInfo } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  userUid:string|null=null;
  user:UserInfo|null;

  constructor(
    private auth:  AuthenticationService,
    private afs: AngularFirestore
  ) {
    
   }
   getNotes():Observable<Note[]>{
    this.auth.activeUser.subscribe((user)=>{
      if(user){
      this.userUid=user.uid
      this.user=user;
      }else{
        this.userUid=null;
        this.user=null;
      }
    })
    
    if(this.userUid){
      console.log("getting notes of user: ", this.userUid)
      return this.afs.collection<Note>('notes',ref => ref.where("user","==",this.userUid)).valueChanges();
   }
   else{
    return throwError(new Error('No User Logged In!'));
   }
  }
  updateNotes(nota:Note){
    nota.timestampUpdated=(new Date().getTime()).toString();
    this.afs.collection('notes').doc(nota.id).update({ content: nota.content, zIndex:nota.zIndex, title:nota.title, color:nota.color,timestampUpdated:nota.timestampUpdated })
  }
  updateZ(nota:Note){
    this.afs.collection('notes').doc(nota.id).update({ zIndex:nota.zIndex })
  }
  like(nota:Note){
    this.afs.collection('notes').doc(nota.id).update({ pref:nota.pref })
  }
  savePosition(id:string,left,top){
    this.afs.collection('notes').doc(id).update({top:top,left:left})
  }
  postNote(nota:Note){
    let newId = this.afs.createId();
    nota.timestampCreated=(new Date().getTime()).toString();
    nota.timestampUpdated=(new Date().getTime()).toString();
    nota.id=newId;
    this.afs.collection('notes').doc(newId).set(nota);
  }
  deleteNote(note:Note){
    let id=note.id;
    this.afs.collection('notes').doc(id).delete();

  }
}
