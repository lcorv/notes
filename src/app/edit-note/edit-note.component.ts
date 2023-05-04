import { Component, OnInit , Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import { NoteService } from '../services/note.service';
import { Note } from '../shared/note';
 
@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss']
})
export class EditNoteComponent implements OnInit {
editNota: Note|null;
editTitle:boolean=false;
  constructor(
    private noteService:NoteService,
    public dialogRef:MatDialogRef<EditNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { 
    this.editNota=data
  }

  ngOnInit(): void {
  }
  close(){
    this.dialogRef.close()
    this.editNota=null;
    
  }
  update(nota: any) {
    this.noteService.updateNotes(nota);
    this.dialogRef.close()
  }
}
