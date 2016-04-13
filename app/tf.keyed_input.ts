import {Component, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'tf-keyed-input',
  template: `
  <form (ngSubmit)="enterCode()">
       <input type="text" [(ngModel)]="code" (keydown)="keyDown($event)" size="30"
              placeholder="type forth code here">
       <input class="btn-primary" type="submit" value="enter">
  </form>`
 })
 export class TFKeyedInput {
   @Output() newCode = new EventEmitter<string>();
   @Output() arrowEvent = new EventEmitter<string>();
   code: string = '';
   
   enterCode() {
     if (this.code) {
       this.newCode.next(this.code);
     }
     this.code = '';
   }

   keyDown($event) {
     if ($event.keyCode == 38) {
       // up arrow
       this.arrowEvent.next({direction:'up', code:this.code});
       //this.code = this.logBook[this.logPointer];
     }
     else if ($event.keyCode == 40) {
       // down arrow
       this.arrowEvent.next({direction:'down', code:this.code});
       //this.code = this.logBook[this.logPointer];
     }

   }

 }
