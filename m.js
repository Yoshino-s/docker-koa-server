function add(n){
  const fn = function(x) {
    return add(n + x);
  };
  
  fn.valueOf = () => n;
  
  return fn;
}

console.log(add(1)(2).toString());