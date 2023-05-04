import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { icons } from '../shared/icons';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditNoteComponent } from '../edit-note/edit-note.component';
import { DeleteNoteComponent } from '../delete-note/delete-note.component';
import { Note } from '../shared/note';
import { NoteService } from '../services/note.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/compat/firestore';
import { Dialog } from '@angular/cdk/dialog';
import { PropicService } from '../services/propic.service';
import { IconStyle } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Input('editNote') noteDialog: any;
  @Input('deleteNote') deleteDialog:any;
  user: any = '';
  userUid: string | null = '';
  triggerX: string;
  triggerY: string;
  loginError: Error | null;
  notes: Note[] | any;
  noteSubscription: Subscription;
  faEdit = icons.faEdit;
  faStar= icons.faStar;
  icons=icons;
  showPreferred=false;
  regStar= icons.regStar;
  color: "rgb(255, 255, 161)";
  pics;
  // notesDoc: AngularFirestoreDocument<any>;
  nota: any = "";
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;
  constructor(
    private auth: AuthenticationService,
    private afs: AngularFirestore,
    private noteService: NoteService,
    private el: ElementRef,
    public dialog: MatDialog,
    private propic:PropicService,
  ) {
  }
  ngOnInit() {
      this.propic.getPropics().subscribe((pics)=>{
        this.pics=(pics);
      })
      this.user=null;
      this.userUid=null;
      this.auth.isLoggedIn;
      this.auth.actualError.subscribe((err) => {
        if (err != null) {
          this.loginError = err;
        }
        else {
          this.loginError = null;
        }
      })
      this.auth.activeUser.subscribe((user) => {
        if (user != null) {
          this.notes=null;
          this.user = user;
          this.userUid = user.uid;
          this.noteSubscription=this.noteService.getNotes().subscribe((notes) => {
            this.notes = notes;
            this.notes.sort((a:Note, b:Note) => (a.timestampCreated < b.timestampCreated) ? 1 : ((b.timestampCreated < a.timestampCreated) ? -1 : 0));
  
          })
        }
        else {
          this.user = null;
          this.notes = null;
          console.log("notes deleted")
        }   
      })
      if(this.noteSubscription){
        this.noteSubscription.unsubscribe();
      }
    //this.auth.updateUser("Luca Corvino")
  }
  edit(nota: Note) {
    this.nota = this.notes.find((note: Note) =>
      note.id === nota.id
    )
    this.dialog.open(EditNoteComponent, { panelClass:"editDialog", width: 'fit-content', height: 'fit-content', data: this.nota });
  }

  createNote() {
    let top = window.scrollY + window.innerHeight/2-150;
    console.log(window.innerWidth/2-150)
    let left = (window.innerWidth/2-150)*100/window.innerWidth;
    if (this.notes[0] && this.userUid) {
      let newNote: Note = {
        timestampCreated : '0',
        content: '',
        top:top,
        left:left,
        title: '',
        color: 'rgb(255, 255, 161)',
        user: this.userUid,
        zIndex: this.notes[ this.notes.length - 1 ].zIndex + 1
      }
      this.noteService.postNote(newNote);
    } else {
      if( this.userUid ){
        let newNote: Note = {
          timestampCreated: '0',
          content: '',
          title: '',
          color: 'rgb(255, 255, 161)',
          user: this.userUid,
          zIndex: 100
        }
        this.noteService.postNote(newNote);
      }
    }
   

  }
  deleteNote(nota:Note) {
    this.dialog.open(DeleteNoteComponent, { panelClass:"deleteDialog", width: '500px', height: '500px', data: nota });
  }
  like(note:Note){
    if(note.pref){
      note.pref=!note.pref;
      this.noteService.like(note)
    }
    else{
      note.pref=true;
      this.noteService.like(note)
    }

  }
  showPref(){
    this.showPreferred=!this.showPreferred
  }
  openMenu(e: MouseEvent, trigger, menu) {
    e.preventDefault()
    trigger.openMenu()
  }
  foreground(note) {
    this.notes.sort((a:Note, b:Note) => (a.zIndex > b.zIndex) ? 1 : ((b.zIndex > a.zIndex) ? -1 : 0));
    note.zIndex = parseInt(this.notes[this.notes.length - 1].zIndex) + 1;
    if (isNaN(note.zIndex)) {
      note.zIndex = 100;
    }
    this.noteService.updateZ(note);
  }
  background(note) {
    this.notes.sort((a:Note, b:Note) => (a.zIndex > b.zIndex) ? 1 : ((b.zIndex > a.zIndex) ? -1 : 0));
    note.zIndex = this.notes[0].zIndex - 1;
    if (isNaN(note.zIndex)) {
      note.zIndex = 100;
    }
    this.noteService.updateZ(note);
  }
  moveUp(note) {
    note.zIndex = note.zIndex + 1;
    if (isNaN(note.zIndex)) {
      note.zIndex = 100;
    }
    this.noteService.updateZ(note);
  }
  moveDown(note) {
    note.zIndex = note.zIndex - 1;
    if (isNaN(note.zIndex)) {
      note.zIndex = 100;
    }
    this.noteService.updateZ(note);
  }
}
