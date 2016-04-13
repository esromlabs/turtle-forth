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
    var TFKeyedInput;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            TFKeyedInput = (function () {
                function TFKeyedInput() {
                    this.newCode = new core_1.EventEmitter();
                    this.arrowEvent = new core_1.EventEmitter();
                    this.code = '';
                }
                TFKeyedInput.prototype.enterCode = function () {
                    if (this.code) {
                        this.newCode.next(this.code);
                    }
                    this.code = '';
                };
                TFKeyedInput.prototype.keyDown = function ($event) {
                    if ($event.keyCode == 38) {
                        this.arrowEvent.next({ direction: 'up', code: this.code });
                    }
                    else if ($event.keyCode == 40) {
                        this.arrowEvent.next({ direction: 'down', code: this.code });
                    }
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TFKeyedInput.prototype, "newCode", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TFKeyedInput.prototype, "arrowEvent", void 0);
                TFKeyedInput = __decorate([
                    core_1.Component({
                        selector: 'tf-keyed-input',
                        template: "\n  <form (ngSubmit)=\"enterCode()\">\n       <input type=\"text\" [(ngModel)]=\"code\" (keydown)=\"keyDown($event)\" size=\"30\"\n              placeholder=\"type forth code here\">\n       <input class=\"btn-primary\" type=\"submit\" value=\"enter\">\n  </form>"
                    }), 
                    __metadata('design:paramtypes', [])
                ], TFKeyedInput);
                return TFKeyedInput;
            }());
            exports_1("TFKeyedInput", TFKeyedInput);
        }
    }
});
//# sourceMappingURL=tf.keyed_input.js.map