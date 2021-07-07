// obscuring instance type
let tmp;
switch (Math.floor(Math.random() * 3)) {
    case 0: tmp = ""; break;
    case 1: tmp = []; break;
    case 2: tmp = new Int8Array(1); break;
}
tmp.at(-1);