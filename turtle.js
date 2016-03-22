var T3D;
(function (T3D) {
    var Heading = (function () {
        function Heading() {
            this.rad = Math.PI * 1.5;
        }
        Heading.prototype.set = function (degrees) {
            this.rad = degrees * 0.0174532925;
        };
        Heading.prototype.add = function (degrees) {
            this.rad += degrees * 0.0174532925;
        };
        return Heading;
    })();
    var Vector3 = (function () {
        function Vector3(v) {
            if (v === void 0) { v = null; }
            this.v = [];
            if (v) {
                this.v[0] = v[0];
                this.v[1] = v[1];
                this.v[2] = v[2];
            }
            else {
                this.v = [0, 0, 0];
            }
        }
        return Vector3;
    })();
    var Turtle = (function () {
        function Turtle(ctx, domEle) {
            this.ctx = ctx;
            this.pos = new Vector3();
            this.pos.v[0] = ctx.canvas.width / 2;
            this.pos.v[1] = ctx.canvas.height / 2;
            this.last = new Vector3();
            this.last.v[0] = -1;
            this.last.v[1] = -1;
            this.h = new Heading();
            this.pen_down = true;
            var undashed_array = this.ctx.getLineDash();
            this.dashed = { i: 0, arr: [undashed_array, [2, 4]] };
        }
        Turtle.prototype.fd = function (dist, rise) {
            if (rise === void 0) { rise = 0; }
            var pt_a = new Vector3(this.pos.v);
            var pt_b;
            this.pos.v[0] = this.pos.v[0] + dist * Math.cos(this.h.rad);
            this.pos.v[1] = this.pos.v[1] + dist * Math.sin(this.h.rad);
            this.pos.v[2] = this.pos.v[2] + rise;
            pt_b = new Vector3(this.pos.v);
            if (this.pen_down) {
                pt_b = new Vector3(this.pos.v);
                this.ctx.beginPath();
                this.ctx.moveTo(pt_a.v[0], pt_a.v[1]);
                this.ctx.lineTo(pt_b.v[0], pt_b.v[1]);
                this.ctx.stroke();
                if (dist > 0) {
                    this.last.v[0] = pt_b.v[0];
                    this.last.v[1] = pt_b.v[1];
                    this.last.v[2] = pt_b.v[2];
                }
                else {
                    this.last.v[0] = this.pos.v[0];
                    this.last.v[1] = this.pos.v[1];
                    this.last.v[2] = this.pos.v[2];
                }
            }
            else {
                this.ctx.moveTo(this.pos.v[0], this.pos.v[1]);
            }
            return this;
        };
        Turtle.prototype.bk = function (dist, rise) {
            if (rise === void 0) { rise = 0; }
            return this.fd(-dist, -rise);
        };
        Turtle.prototype.rt = function (turn) {
            this.h.add(turn);
            return this;
        };
        Turtle.prototype.lt = function (turn) {
            this.h.add(-turn);
            return this;
        };
        Turtle.prototype.pu = function () {
            this.pen_down = false;
            return this;
        };
        Turtle.prototype.pd = function () {
            this.pen_down = true;
            return this;
        };
        Turtle.prototype.dash = function (i) {
            this.dashed.i = i;
            this.ctx.setLineDash(this.dashed.arr[this.dashed.i]);
        };
        Turtle.prototype.home = function () {
            this.last = new Vector3();
            this.last.v[0] = -1;
            this.last.v[1] = -1;
            this.pos.v[0] = this.ctx.canvas.width / 2;
            this.pos.v[1] = this.ctx.canvas.height / 2;
            this.pos.v[2] = 0;
            this.h = new Heading();
            return this;
        };
        Turtle.prototype.cs = function () {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            return this;
        };
        return Turtle;
    })();
    T3D.Turtle = Turtle;
})(T3D || (T3D = {}));
var domCanvaseElement = document.getElementById('tf-drawing');
var canvasContext = domCanvaseElement.getContext("2d");
var yurt = new T3D.Turtle(canvasContext, domCanvaseElement);
