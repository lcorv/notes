import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appContrast]'
})
export class ContrastDirective {

  constructor(
    private el:ElementRef
  ) {
    
     }
ngOnInit(){
  this.el.nativeElement.style.color=this.setColor(this.el)
}
setColor(el:ElementRef){
  let bgColor=el.nativeElement.style.backgroundColor;
  bgColor=bgColor.substr(4, bgColor.length-5)
  let colors=bgColor.split(", ")
  
  var r = parseInt(colors[0]);
	var g = parseInt(colors[1]);
	var b = parseInt(colors[2]);
	var yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? '#222' : 'white';
}
}
