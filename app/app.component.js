System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var Forth, AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            Forth = (function () {
                function Forth() {
                    this.ds = [];
                    this.ps = [];
                    this.heap = {};
                    this.funcDef = false;
                    this.funcName = '';
                    this.tokens = [];
                    this.ds_ele = document.getElementById('ds');
                    this.heap_ele = document.getElementById('heap');
                    this.input_ele = document.getElementById('tf-code-input');
                }
                Forth.prototype.parse = function (text) {
                    this.tokens = text.split(' ');
                };
                Forth.prototype.arrayCopy = function (a) {
                    var i;
                    var b = [];
                    for (i = 0; i < a.length; i += 1) {
                        b[i] = a[i];
                    }
                    return b;
                };
                Forth.prototype.go = function () {
                    var thisToken;
                    this.funcDef = false;
                    this.funcName = '';
                    while (this.tokens.length) {
                        thisToken = this.tokens.shift();
                        if (this.funcDef) {
                            if (!this.funcName) {
                                this.funcName = thisToken;
                            }
                            else if (thisToken !== ';') {
                                this.ps.push(thisToken);
                            }
                            else {
                                this.funcDef = false;
                                this.heap[this.funcName] = this.arrayCopy(this.ps);
                                this.heap_ele.innerHTML = JSON.stringify(this.heap, null, '');
                                this.ps = [];
                                this.funcName = '';
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
                };
                Forth.prototype.isJsonData = function (str) {
                    var dataPattern = new RegExp('^(\\{.*\\}|\\[.*\\]|\\".*\\")$');
                    return dataPattern.test('' + str);
                };
                Forth.prototype.isNumeric = function (str) {
                    var dataPattern = new RegExp('^-?([0-9]|\\.)+$');
                    return dataPattern.test('' + str);
                };
                Forth.prototype.execute = function (instruction) {
                    var a, b;
                    switch (instruction) {
                        case ":":
                            this.funcDef = true;
                            break;
                        case "+":
                            a = this.ds.pop();
                            b = this.ds.pop();
                            this.ds.push(a + b);
                            break;
                        case "-":
                            a = this.ds.pop();
                            b = this.ds.pop();
                            this.ds.push(a - b);
                            break;
                        case "*":
                            a = this.ds.pop();
                            b = this.ds.pop();
                            this.ds.push(a * b);
                            break;
                        case "/":
                            a = this.ds.pop();
                            b = this.ds.pop();
                            this.ds.push(a / b);
                            break;
                        case "%":
                            a = this.ds.pop();
                            b = this.ds.pop();
                            this.ds.push(a % b);
                            break;
                        case "pen":
                            a = this.ds.pop();
                            if (a) {
                                yurt.pd();
                            }
                            else {
                                yurt.pu();
                            }
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
                        case "dup":
                            this.ds.push(this.ds[this.ds.length - 1]);
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
                                this.ds.push(eval(instruction + '(' + a + ');'));
                            }
                            break;
                    }
                };
                Forth.prototype.displayHeap = function () {
                };
                return Forth;
            }());
            AppComponent = (function () {
                function AppComponent() {
                    this.forth = new Forth();
                }
                AppComponent.prototype.enterKey = function (event) {
                    this.forth.parse(this.code);
                    this.forth.go();
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n    <h1>turtle-FORTH</h1><pre>{{forth.ds}}</pre>\n    <form (ngSubmit)=\"enterKey()\">\n      <input [(ngModel)]=\"code\" placeholder=\"Forth code goes here... or check out help\" type=\"text\" style=\"width:698px;\"/>\n      <input class=\"btn-primary\" type=\"submit\" value=\"go\">\n    </form>\n    "
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map