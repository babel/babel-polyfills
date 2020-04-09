let some = Array.prototype.some;

Array.prototype.some.call(arguments, () => true);

[].some(2);

[].some.apply(obj, args);

Array.prototype.some.bind(arguments);

[].some;

foo.some(2);

foo.some.call(bar, () => false);

foo.some;
