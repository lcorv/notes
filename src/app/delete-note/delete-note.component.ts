import { Component, OnInit , Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import { NoteService } from '../services/note.service';
import { Note } from '../shared/note';
@Component({
  selector: 'app-delete-note',
  templateUrl: './delete-note.component.html',
  styleUrls: ['./delete-note.component.scss']
})
export class DeleteNoteComponent implements OnInit {
nota:Note;
  constructor(
    private noteService:NoteService,
    public dialogRef:MatDialogRef<DeleteNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { 
    this.nota=data
  }

  ngOnInit(): void {
  }
  delete() {
    this.noteService.deleteNote(this.nota);
    this.dialogRef.close()
  }
}
