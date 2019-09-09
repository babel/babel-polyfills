var a = new globalThis.Promise(resolve => {
  resolve(Number.isNaN(2));
}).finally(x => {
  console.log(x);
});
