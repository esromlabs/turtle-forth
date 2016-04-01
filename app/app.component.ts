import {Component} from 'angular2/core';

class Forth {
  ds = [];
  ps = [];
  heap = {};
  funcDef = false;
  funcName = '';
  tokens = [];
  parse(text) {
    this.tokens = text.split(' ');
  }
  arrayCopy(a) {
    var i;
    var b = [];
    for (i = 0; i < a.length; i+=1) {
      b[i] = a[i];
    }
    return b;
  }
  go() {
    var thisToken;
    this.funcDef = false;
    this.funcName = '';
    while (this.tokens.length) {
      // consume this token
      thisToken = this.tokens.shift();
      if (this.funcDef) {
        if (!this.funcName) { this.funcName = thisToken; }
        else if (thisToken !== ';') {this.ps.push(thisToken);}
        else {
          this.funcDef = false;
          this.heap[this.funcName] = this.arrayCopy(this.ps);
          this.heap_ele.innerHTML = JSON.stringify(this.heap, null, '');
          this.ps = [];
          this.funcName = '';
          //this.input_ele.value = '';
        }
      }
      else if (this.isJsonData(thisToken)) {
        this.ds.push(JSON.parse(thisToken));
      }
      else if (this.isNumeric(thisToken)) {
        this.ds.push(+thisToken);
      }
      else {
        this.execute(thisToken);
      }
    }
  }
  isJsonData(str) {
    // simple integer
    var dataPattern = new RegExp('^(\\{.*\\}|\\[.*\\]|\\".*\\")$');
    return dataPattern.test(''+str);
  }
  isNumeric(str) {
    // simple integer
    var dataPattern = new RegExp('^-?([0-9]|\\.)+$');
    return dataPattern.test(''+str);
  }
  execute(instruction) {
    let a, b;
    switch(instruction) {
      case ":":
        this.funcDef = true;
      break;
      case "+":
        a = this.ds.pop();
        b = this.ds.pop();
        this.ds.push(a+b);
      break;
      case "-":
        a = this.ds.pop();
        b = this.ds.pop();
        this.ds.push(a-b);
      break;
      case "*":
        a = this.ds.pop();
        b = this.ds.pop();
        this.ds.push(a*b);
      break;
      case "/":
        a = this.ds.pop();
        b = this.ds.pop();
        this.ds.push(a/b);
      break;
      case "%":
        a = +this.ds.pop();
        b = +this.ds.pop();
        this.ds.push(a%b);
      break;
      case "pen":
        a = this.ds.pop();
        if (a) {yurt.pd();} else {yurt.pu();}
      break;
      case "cs":
        yurt.cs();
      break;
      case "fd":
        a = this.ds.pop();
        yurt.fd(a);
      break;
      case "tn":
        a = this.ds.pop();
        yurt.rt(a);
      break;
      case "hm":
        yurt.home();
      break;
      case "dup":
        this.ds.push(this.ds[this.ds.length-1]);
      break;
      case "swap":
        a = this.ds.pop();
        b = this.ds.pop();
        this.ds.push(a);
        this.ds.push(b);
      break;
      case ".s":
        this.ds_ele.innerHTML += JSON.stringify(this.ds);
      break;
      case ".":
        this.ds_ele.innerHTML += JSON.stringify(this.ds);
        this.ds = [];
      break;
      default:
        if (instruction[0] === '@') {
          a = this.ds.pop();
          this.heap[instruction.substr(1)] = [a];
          this.heap_ele.innerHTML = JSON.stringify(this.heap, null, '');
        }
        else if (this.heap[instruction]) {
          this.tokens = this.heap[instruction].concat(this.tokens);
        }
        else {
          a = this.ds.pop();
          this.ds.push(eval(instruction + '('+ a +');'));
        }
      break;
    }
  }
  displayHeap() {

  }
  // testing

  //ds_ele = document.getElementById('ds');
  heap_ele = document.getElementById('heap');
  //input_ele = document.getElementById('tf-code-input');
  //parse('[3, -6, "+", ".s"]');
  //parse('3 -6 + .s');
  //parse('16 Math.sqrt .s');
  //parse('4 dup * Math.sqrt .s');
  //parse('4 3 swap .s');
  //parse('4 3 dup * swap dup * + Math.sqrt .s');
  //parse('20 fd 72 tn 20 fd 108 tn 20 fd 72 tn 20 fd 108 tn .s');
  //parse(': times2 2 * ; 4 times2 .s');
  // a 3 + @a a fd 0.61803 360 * tn
  //go();


}


@Component({
    selector: 'my-app',
    template: `
    <h1>turtle-FORTH</h1><pre>{{forth.ds}}</pre>
    <form (ngSubmit)="enterKey()">
      <input [(ngModel)]="code" placeholder="Forth code goes here... or check out help" type="text" style="width:698px;"/>
      <input class="btn-primary" type="submit" value="go">
    </form>
    `
})
export class AppComponent {
  forth = new Forth();
  code: string;

  enterKey(event) {
    this.forth.parse(this.code);
    this.forth.go();
  }

}
