(function(yurt) {
  var ds = [];
  var ps = [];
  var heap = {};
  var funcDef = false, funcName = '';
  var tokens = [];
  function parse(text) {
    var first_char = text[0];
    switch (first_char) {
      case '[':
      case '{':
      case '"':
        tokens = JSON.parse(text);
        break;
      default:
        tokens = text.split(" ");
    }
  }
  function arrayCopy(a) {
    var i;
    var b = [];
    for (i = 0; i < a.length; i+=1) {
      b[i] = a[i];
    }
    return b;
  }
  function go() {
    var thisToken;
    funcDef = false;
    funcName = '';
    while (tokens.length) {
      // consume this token
      thisToken = tokens.shift();
      if (funcDef) {
        if (!funcName) { funcName = thisToken; }
        else if (thisToken !== ';') {ps.push(thisToken);}
        else {
          funcDef = false;
          heap[funcName] = arrayCopy(ps);
          ps = [];
          funcName = '';
          funcDef = false;
        }
      }
      else if (isData(thisToken)) {
        ds.push(+thisToken);
      }
      else {
        execute(thisToken);
      }
    }
  }
  function isData(str) {
    // simple integer
    var dataPattern = new RegExp("^-?[0-9]+$");
    return dataPattern.test(''+str);
  }
  function execute(instruction) {
    var a, b;
    switch(instruction) {
      case ":":
        funcDef = true;
      break;
      case "+":
        a = ds.pop();
        b = ds.pop();
        ds.push(a+b);
        break;
      case "-":
        a = ds.pop();
        b = ds.pop();
        ds.push(a-b);
        break;
      case "*":
        a = ds.pop();
        b = ds.pop();
        ds.push(a*b);
        break;
      case "/":
        a = ds.pop();
        b = ds.pop();
        ds.push(a/b);
        break;
      case "%":
        a = ds.pop();
        b = ds.pop();
        ds.push(a%b);
        break;
      case "fd":
        a = ds.pop();
        yurt.fd(a);
        break;
      case "tn":
        a = ds.pop();
        yurt.rt(a);
        break;
      case "dup":
        ds.push(ds[ds.length-1]);
        break;
      case "swap":
        a = ds.pop();
        b = ds.pop();
        ds.push(a);
        ds.push(b);
      break;
      case ".s":
        ds_ele.innerHTML += JSON.stringify(ds);
      break;
      case ".":
        ds_ele.innerHTML += JSON.stringify(ds);
        ds = [];
      break;
      default:
        if (heap[instruction]) {
          tokens = heap[instruction].concat(tokens);
        }
        else {
          a = ds.pop();
          ds.push(eval(instruction + '('+ a +');'));
        }

    }
  }
  // expose the interface
  tf = {
    'run': function(tf_code, options) {
      //clean
      ds_ele.innerHTML = '';
      // parse
      parse(tf_code);
      go();
    }
  };

  // testing

  var ds_ele = document.getElementById('ds');
  //parse('[3, -6, "+", ".s"]');
  //parse('3 -6 + .s');
  //parse('16 Math.sqrt .s');
  //parse('4 dup * Math.sqrt .s');
  //parse('4 3 swap .s');
  //parse('4 3 dup * swap dup * + Math.sqrt .s');
  //parse('20 fd 72 tn 20 fd 108 tn 20 fd 72 tn 20 fd 108 tn .s');
  //parse(': times2 2 * ; 4 times2 .s');
  //go();
})(yurt);

function enterKey(event) {
  if (event.keyCode == 13) {
    go();
  }
}
function go() {
  var code = document.getElementById('tf-code-input').value;
  tf.run(code);
}
