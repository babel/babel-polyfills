String.prototype.padStart || err;
!String.prototype.padStart || ok;


String.prototype.padStart ? ok : err;
!String.prototype.padStart ? err : ok;

if (String.prototype.padStart) {
  ok;
} else {
  err;
}
if (!String.prototype.padStart) {
  err;
} else {
  ok;
}
