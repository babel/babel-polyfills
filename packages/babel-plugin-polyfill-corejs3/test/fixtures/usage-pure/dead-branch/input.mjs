Reflect.construct || err;
!Reflect.construct || ok;


Reflect.construct ? ok : err;
!Reflect.construct ? err : ok;

if (Reflect.construct) {
  ok;
} else {
  err;
}
if (!Reflect.construct) {
  err;
} else {
  ok;
}


Symbol.dispose || err;
!Symbol.dispose || ok;


Symbol.dispose ? ok : err;
!Symbol.dispose ? err : ok;

if (Symbol.dispose) {
  ok;
} else {
  err;
}
if (!Symbol.dispose) {
  err;
} else {
  ok;
}


a.padStart || err;
!a.padStart || ok;


a.padStart ? ok : err;
!a.padStart ? err : ok;

if (a.padStart) {
  ok;
} else {
  err;
}
if (!a.padStart) {
  err;
} else {
  ok;
}
