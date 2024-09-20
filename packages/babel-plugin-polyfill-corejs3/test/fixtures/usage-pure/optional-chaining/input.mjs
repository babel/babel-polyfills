a.toSorted(x);
a.toSorted?.(x);
a.b.toSorted?.(x);
a.b.toSorted?.(x).c;
a.b.toSorted?.(x)?.c;

a?.toSorted(x);
a?.b.toSorted(x).c;
a.b?.toSorted(x).c;
a?.b.toSorted(x)?.c;
a.b?.toSorted(x)?.c;

a.b.c.toSorted?.d.e;
a.b?.c.toSorted.d.e;
a.b?.c.toSorted?.d.e;

Array.from(x);
Array.from?.(x);
Array.from?.(x).c;
Array.from?.(x)?.c;

Array?.from(x);
Array?.from(x).c;
Array?.from(x)?.c;
Array?.from?.(x);
Array?.from?.(x).c;
Array?.from?.(x)?.c;

Array?.from;
Array?.from.x.y;
Array.from?.x.y;
Array?.from?.x.y;

