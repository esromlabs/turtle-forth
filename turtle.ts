// http://www.typescriptlang.org/Playground
// a heading class to track the heading of a turtle.
module T3D {
    class Heading {
        rad: number;

				constructor() { this.rad = Math.PI * 1.5; }

        set(degrees: number) {
            this.rad = degrees * 0.0174532925;
        }
        add(degrees: number) {
            this.rad += degrees * 0.0174532925;
        }
    }
		//T3D.Heading = Heading;
    // classes for projection from 3D to 2D screen.
    class Vector3 {
      v = [];
      constructor(v = null) {
        if (v) {
          this.v[0] = v[0];
          this.v[1] = v[1];
          this.v[2] = v[2];
        }
        else {
          this.v = [0,0,0];
        }
      }
    }

class Dashed {
  i:number;
  arr = [];
}
    // Main Turtle Class
    class Turtle {
        ctx: CanvasRenderingContext2D;
        pos: Vector3;
        last: Vector3;
        text_path: string;
        h: Heading; // heading in radians
        pen_down: boolean;
        dashed:Dashed;

        constructor(ctx: CanvasRenderingContext2D, domEle) {
            this.ctx = ctx;
            this.pos = new Vector3();
            this.pos.v[0] = ctx.canvas.width / 2;
            this.pos.v[1] = ctx.canvas.height / 2;
            this.last = new Vector3();
            this.last.v[0] = -1;
            this.last.v[1] = -1;
            this.h = new Heading();
            this.pen_down = true;
            let undashed_array = this.ctx.getLineDash();
            this.dashed = {i:0, arr:[undashed_array, [2,4]] };
        }
        fd(dist: number, rise: number = 0) {
          let pt_a: Vector3 = new Vector3(this.pos.v);
          let pt_b: Vector3;
          this.pos.v[0] = this.pos.v[0] + dist * Math.cos(this.h.rad);
          this.pos.v[1] = this.pos.v[1] + dist * Math.sin(this.h.rad);
          this.pos.v[2] = this.pos.v[2] + rise;
          pt_b = new Vector3(this.pos.v);
          if (this.pen_down) {
            // start a path output to either svg and/or JSON
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
        }
        bk(dist: number, rise: number = 0) {
            return this.fd(-dist, -rise);
        }
        rt(turn: number) {
            this.h.add(turn);
            return this;
        }
        lt(turn: number) {
            this.h.add(-turn);
            return this;
        }
        pu() {
            this.pen_down = false;
            return this;
        }
        pd() {
            this.pen_down = true;
            return this;
        }
        dash(i:number) {
            this.dashed.i = i;
            this.ctx.setLineDash(this.dashed.arr[this.dashed.i]);
        }
        home() {
          this.last = new Vector3();
          this.last.v[0] = -1;
          this.last.v[1] = -1;
          this.pos.v[0] = this.ctx.canvas.width / 2;
          this.pos.v[1] = this.ctx.canvas.height / 2;
          this.pos.v[2] = 0;
          this.h = new Heading();
          return this;
        }
        cs() {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            return this;
        }
    }
		T3D.Turtle = Turtle;
}
var domCanvaseElement = document.getElementById('tf-drawing');
var canvasContext = domCanvaseElement.getContext("2d");
var yurt = new T3D.Turtle(canvasContext, domCanvaseElement);
