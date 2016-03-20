(function() {
  var ds = [];
  var ps = [];
  var tokens = [];
  function parse(text) {
    tokens = JSON.parse(text);
  }
  function go() {
    var thisToken;
    while (tokens[0].length) {
      // consume this token
      thisToken = tokens.shift();
      if (isData(thisToken)) {
        ds.push(thisToken);
      }
      else {
        execute(thisToken);
      }
    }
  }
  function isData(str) {
    // simple integer
    var dataPattern = new RegExp("-?[0-9]+");
    return dataPattern.test(str);
  }
  function execute(instruction) {
    var a, b;
    switch(istruction) {
      case "+":
        a = ds.pop();
        b = ds.pop();
        ds.push(a+b);
        break;
      case ".s":
        return ds;
        break;
    }
  }
  // testing
  parse('[3, -6, "+", ".s"]');
  go();
  // expect ds is now [-3]

})();
