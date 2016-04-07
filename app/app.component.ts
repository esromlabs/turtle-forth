import {Component} from 'angular2/core';
import {isFunction} from 'angular2/src/facade/lang';

class Forth {
  f = this;
  ds = [];
  ps = [];
  heap = {
    "pen": function() {
      var a = this.ds.pop();
      if (a) {yurt.pd();} else {yurt.pu();}
    },
    "cs": function() {
      yurt.cs();
    },
    "fd": function() {
      var a = this.ds.pop();
      yurt.fd(a);
    },
    "tn": function() {
      var a = this.ds.pop();
      yurt.rt(a);
    },
    "hm": function() {
      yurt.home();
    },
    "dash": [0, "pen", 3, "fd", 1, "pen", 3, "fd"],
    "repeat": function() {
      var lim = this.ds.pop();
      var i = 0;
      var inst;
      inst = this.tokens.pop(); // to be executed lim times
      for(i = 0; i < lim; i += 1) {
        this.tokens.unshift(inst);
      }
    }

  };
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
    var dataPattern = new RegExp('^[-+]?[0-9]+\.?[0-9]*$');
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
      case "dup":
        this.ds.push(this.ds[this.ds.length-1]);
      break;
      case "drop":
        this.ds.pop();
      break;
      case "swap":
        a = this.ds.pop();
        b = this.ds.pop();
        this.ds.push(a);
        this.ds.push(b);
      break;
      case ".s":
        //this.ds_ele.innerHTML += JSON.stringify(this.ds);
      break;
      case ".":
        //this.ds_ele.innerHTML += JSON.stringify(this.ds);
        this.ds = [];
      break;
      case "?":
        a = this.ds.pop();
        if (!a) {
          // drop the next instuction on the token
          if (this.tokens.length > 0 ) {
            this.tokens.pop(); //discard this instruction
          }
        }
      break;
      case "!?":
        a = this.ds.pop();
        if (a) {
          // drop the next instuction on the token
          if (this.tokens.length > 0 ) {
            this.tokens.pop(); //discard this instruction
          }
        }
      break;
      default:
        if (instruction[0] === '@') {
          a = this.ds.pop();
          this.heap[instruction.substr(1)] = [a];
          this.heap_ele.innerHTML = JSON.stringify(this.heap, null, '');
        }
        else if (this.heap[instruction]) {
          if (isFunction(this.heap[instruction])) {
            //a = this.ds.splice(-this.heap[instruction].arg_c);
            this.heap[instruction].apply(this);
          }
          else {
            this.tokens = this.heap[instruction].concat(this.tokens);
          }
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
    <h1>turtle-FORTH</h1>
    <div class="data-stack-container">
      <div *ngFor="#item of displayHash()" class="data-stack-item">{{item}}</div>
    </div>
    <div class="logbook-container">
      <div *ngFor="#item of logBook" class="logbook-item">{{item}}</div>
    </div>
    <form (ngSubmit)="enterKey()">
      <input [(ngModel)]="code" (keydown)="arrow($event)" placeholder="Forth code goes here... or check out help" type="text" style="width:698px;"/>
      <input class="btn-primary" type="submit" value="enter">
    </form>
    <div class="data-stack-container">
    <div *ngFor="#item of forth.ds" class="data-stack-item">{{item}}</div>
    </div>`
})

export class AppComponent {
  forth = new Forth();
  code: string;
  logBook = [];
  logPointer: number = 0;

  enterKey(event) {
    this.forth.parse(this.code);
    this.forth.go();
    if (this.logBook[this.logBook.length -1 ] !== this.code) {
      this.logBook.push(this.code);
    }
    this.logPointer = this.logBook.length;
    this.code = '';
  }
  displayHash() {
    let top_level = [];
    for(var key in this.forth.heap) {
      top_level.push(key + ":" + this.forth.heap[key]);
    }
    return top_level; //JSON.stringify(this.forth.heap);
  }
  arrow($event) {
    if ($event.keyCode == 38) {
      // up arrow
      if (this.logPointer > 0) {
        this.logPointer -= 1;
      }
      this.code = this.logBook[this.logPointer];
    }
    else if ($event.keyCode == 40) {
      // down arrow
      if (this.logPointer < this.logBook.length) {
        this.logPointer += 1;
      }
      this.code = this.logBook[this.logPointer];
    }
  }
}
