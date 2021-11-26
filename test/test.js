function outer() {
  // only inner() is in scope here
  // because only functions are forward-referenced

  var a = 1;

  //now 'a' and inner() are in scope

  function inner() {
    var b = 2;

    if (a == 1) {
      var c = 3;
    }

    // 'c' is still in scope because JavaScript doesn't care
    // about the end of the 'if' block, only function inner()
  }

  // now b and c are out of scope
  // a and inner() are still in scope
}
