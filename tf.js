(function(yurt) {
  var ds = [];
  var ps = [];
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
  function go() {
    var thisToken;
    while (tokens.length) {
      // consume this token
      thisToken = tokens.shift();
      if (isData(thisToken)) {
        ds.push(+thisToken);
      }
      else {
        execute(thisToken);
      }
    }
  }
  function isData(str) {
    // simple integer
    var dataPattern = new RegExp("-?[0-9]+");
    return dataPattern.test(''+str);
  }
  function execute(instruction) {
    var a, b;
    switch(instruction) {
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
      default:
        a = ds.pop();
        ds.push(eval(instruction + '('+ a +');'));
    }
  }
  // testing

  var ds_ele = document.getElementById('ds');
  //parse('[3, -6, "+", ".s"]');
  //parse('3 -6 + .s');
  //parse('16 Math.sqrt .s');
  //parse('4 dup * Math.sqrt .s');
  //parse('4 3 swap .s');
  //parse('4 3 dup * swap dup * + Math.sqrt .s');
  parse('20 fd 72 tn 20 fd 108 tn 20 fd 72 tn 20 fd 108 tn .s');
  go();
})(yurt);
