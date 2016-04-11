import {Component, Input} from 'angular2/core';

@Component({
  selector: 'tf-stackview',
  template: `
  <div class="data-stack-container">
    <div *ngFor="#item of stack" class="data-stack-item">{{item}}</div>
  </div>
  `
})
export class TFStackView {
  @Input() stack: number[];
}
