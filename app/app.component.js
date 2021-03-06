System.register(['angular2/core', 'angular2/src/facade/lang', './tf.stack'], function(exports_1, context_1) {
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
    var core_1, lang_1, tf_stack_1;
    var Forth, AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (lang_1_1) {
                lang_1 = lang_1_1;
            },
            function (tf_stack_1_1) {
                tf_stack_1 = tf_stack_1_1;
            }],
        execute: function() {
            Forth = (function () {
                function Forth() {
                    this.ds = [];
                    this.ps = [];
                    this.heap = {
                        "pen": function () {
                            var a = this.ds.pop();
                            if (a) {
                                yurt.pd();
                            }
                            else {
                                yurt.pu();
                            }
                        },
                        "cs": function () {
                            yurt.cs();
                        },
                        "fd": function () {
                            var a = this.ds.pop();
                            yurt.fd(a);
                        },
                        "tn": function () {
                            var a = this.ds.pop();
                            yurt.rt(a);
                        },
                        "hm": function () {
                            yurt.home();
                        },
                        "dash": [0, "pen", 3, "fd", 1, "pen", 3, "fd"],
                        "repeat": function () {
                            var lim = this.ds.pop();
                            var i = 0;
                            var inst;
                            inst = this.tokens.pop();
                            for (i = 0; i < lim; i += 1) {
                                this.tokens.unshift(inst);
                            }
                        }
                    };
                    this.funcDef = false;
                    this.funcName = '';
                    this.tokens = [];
                    this.heap_ele = document.getElementById('heap');
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
                    var dataPattern = new RegExp('^[-+]?[0-9]+\.?[0-9]*$');
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
                            this.ds.push(b + a);
                            break;
                        case "-":
                            a = this.ds.pop();
                            b = this.ds.pop();
                            this.ds.push(b - a);
                            break;
                        case "*":
                            a = this.ds.pop();
                            b = this.ds.pop();
                            this.ds.push(b * a);
                            break;
                        case "/":
                            a = this.ds.pop();
                            b = this.ds.pop();
                            this.ds.push(b / a);
                            break;
                        case "%":
                            a = +this.ds.pop();
                            b = +this.ds.pop();
                            this.ds.push(b % a);
                            break;
                        case "&&":
                            a = +this.ds.pop();
                            b = +this.ds.pop();
                            this.ds.push(b && a);
                            break;
                        case "||":
                            a = +this.ds.pop();
                            b = +this.ds.pop();
                            this.ds.push(b || a);
                            break;
                        case "dup":
                            this.ds.push(this.ds[this.ds.length - 1]);
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
                            break;
                        case ".":
                            this.ds = [];
                            break;
                        case "?":
                            a = this.ds.pop();
                            if (!a) {
                                if (this.tokens.length > 0) {
                                    this.tokens.pop();
                                }
                            }
                            break;
                        case "!?":
                            a = this.ds.pop();
                            if (a) {
                                if (this.tokens.length > 0) {
                                    this.tokens.pop();
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
                                if (lang_1.isFunction(this.heap[instruction])) {
                                    this.heap[instruction].apply(this);
                                }
                                else {
                                    this.tokens = this.heap[instruction].concat(this.tokens);
                                }
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
                    this.logBook = [];
                    this.logPointer = 0;
                }
                AppComponent.prototype.enterKey = function (event) {
                    this.forth.parse(event);
                    this.forth.go();
                    if (this.logBook[this.logBook.length - 1] !== event) {
                        this.logBook.push(event);
                    }
                    this.logPointer = this.logBook.length;
                };
                AppComponent.prototype.displayHash = function () {
                    var top_level = [];
                    for (var key in this.forth.heap) {
                        top_level.push(key + ":" + this.forth.heap[key]);
                    }
                    return top_level;
                };
                AppComponent.prototype.arrow = function ($event) {
                    if ($event.direction == 'up') {
                        if (this.logPointer > 0) {
                            this.logPointer -= 1;
                        }
                    }
                    else if ($event.direction == 'down') {
                        if (this.logPointer < this.logBook.length) {
                            this.logPointer += 1;
                        }
                    }
                };
                AppComponent.prototype.scrollBottom = function ($event) {
                    var element = $event.element;
                    element.scrollTop = element.scrollHeight;
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'tf-app',
                        template: "\n    <h1>turtle-FORTH</h1>\n    <div class=\"data-stack-container\">\n      <div *ngFor=\"#item of displayHash()\" class=\"data-stack-item\">{{item}}</div>\n    </div>\n    <div class=\"logbook-container\" ng-change=\"scrollBottom($event)\">\n      <div *ngFor=\"#item of logBook\" class=\"logbook-item\">{{item}}</div>\n    </div>\n    <tf-keyed-input (newCode)=\"enterKey($event)\" (arrowEvent)=\"arrow($event)\"></tf-keyed-input>\n    <form (ngSubmit)=\"enterKey()\">\n      <input [(ngModel)]=\"code\" (keydown)=\"arrow($event)\" placeholder=\"Forth code goes here... or check out help\" type=\"text\" style=\"width:698px;\"/>\n      <input class=\"btn-primary\" type=\"submit\" value=\"enter\">\n    </form>\n    <tf-stackview  [stack]=\"forth.ds\">\n    </tf-stackview>",
                        directives: [tf_stack_1.TFStackView]
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