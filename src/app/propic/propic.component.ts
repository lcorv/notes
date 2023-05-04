import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog,  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropicService } from '../services/propic.service';

@Component({
  selector: 'app-propic',
  templateUrl: './propic.component.html',
  styleUrls: ['./propic.component.scss']
})
export class PropicComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public pics,
    public dialogRef:MatDialogRef<PropicComponent>,
    private propic:PropicService,
  ) { }

  ngOnInit(): void {
  }
  updatePropic(url){
    this.propic.updatePropic(url)
    this.dialogRef.close()
  }
}
