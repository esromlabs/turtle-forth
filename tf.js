(function() {
  var ds = [];
  var ps = [];
  var tokens = [];
  function parse(text) {
    tokens = JSON.parse(text);
  }
  function go() {
    var thisToken;
    while (tokens.length) {
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
      case ".s":
        return ds;
        break;
    }
  }
  // testing

  var ds_ele = document.getElementById('ds');
  parse('[3, -6, "+", ".s"]');
  go();
  ds_ele.innerHTML = JSON.stringify(ds);
  // expect ds is now [-3]

})();
