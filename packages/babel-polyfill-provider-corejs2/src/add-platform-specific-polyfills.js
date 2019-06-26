const webPolyfills = {
  "web.timers": {},
  "web.immediate": {},
  "web.dom.iterable": {},
};

const purePolyfills = {
  "es6.parse-float": {},
  "es6.parse-int": {},
  "es7.string.at": {},
};

export default function(targets, method, polyfills) {
  const targetNames = Object.keys(targets);
  const isAnyTarget = !targetNames.length;
  const isWebTarget = targetNames.some(name => name !== "node");

  return {
    ...polyfills,
    ...(method === "usage-pure" ? purePolyfills : null),
    ...(isAnyTarget || isWebTarget ? webPolyfills : null),
  };
}
