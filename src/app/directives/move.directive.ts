import { Directive, ElementRef, Renderer2, HostListener, ViewChild } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { NoteService } from '../services/note.service';
@Directive({
  selector: '[appMove]'
})
export class MoveDirective {
  move = false;
  pos1 = 0;
  pos2 = 0;
  pos3 = 0;
  pos4 = 0;
  left = 0;
  top = 0;
  elmnt: any;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private noteService:NoteService,
  ) { }
  @HostListener("mousedown") dragMouseDown(e: MouseEvent) {
    this.move = true;
    e = e || window.event;
    e.preventDefault();
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    this.elmnt = this.el.nativeElement.id;
    
  }
  @HostListener("document:pointerup") close(e: MouseEvent) {
    e = e || window.event;
    e.preventDefault();
    if( this.elmnt && this.left && this.top){
    this.noteService.savePosition( this.elmnt, this.left, this.top );
    }
    this.move = false;
  }
  @HostListener( "document:pointermove" ) drag( e: MouseEvent ) {
    e = e || window.event;
    
    if (this.move) {
      e.preventDefault();
      this.pos1 = this.pos3 - e.clientX;
      this.pos2 = this.pos4 - e.clientY;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      let element = this.el.nativeElement;
      element.style.position = "absolute";
      //element.style.zIndex = "999";
      element.style.cursor = "grabbing";
      this.top = ( element.offsetTop - this.pos2 - 25 );
      this.left = ( element.offsetLeft - this.pos1 ) * 100 / window.innerWidth;
      element.style.top = this.top + 'px';
      element.style.left = this.left + 'vw';
      
    }
  }
}
