var _object, _object2, _object3, _object4, _object5, _object6, _object7, _object8, _object9, _object10, _object11, _object12, _object13, _object14, _object15, _object16, _object17, _object18, _object19, _object20, _object21, _object22, _object23, _object24, _object25, _object26, _object27, _object28, _object29, _object30, _object31, _object32, _object33, _object34, _object35, _object36, _object37, _object38, _object39, _object40, _object41, _object42, _object43, _object44, _object45, _object46, _object47, _object48, _object49, _object50, _object51, _object52, _object53, _object54, _object55, _object56, _object57, _object58, _object59, _object60, _object61, _object62, _date, _date2;

import _ArrayPrototypeEntries from "array.prototype.entries";
import _ArrayPrototypeEvery from "array.prototype.every";
import _ArrayPrototypeFilter from "array.prototype.filter";
import _ArrayPrototypeFind from "array.prototype.find";
import _ArrayPrototypeFindIndex from "array.prototype.findindex";
import _RegExpPrototypeFlags from "regexp.prototype.flags";
import _ArrayPrototypeFlatMap from "array.prototype.flatmap";
import _ArrayPrototypeFlat from "array.prototype.flat";
import _ArrayPrototypeIncludes from "array-includes";
import _StringPrototypeIncludes from "string.prototype.includes";
import _ArrayPrototypeIndexOf from "array.prototype.indexof";
import _ArrayPrototypeKeys from "array.prototype.keys";
import _ArrayPrototypeLastIndexOf from "array.prototype.lastindexof";
import _ArrayPrototypeMap from "array.prototype.map";
import _StringPrototypeMatchAll from "string.prototype.matchall";
import _StringPrototypePadEnd from "string.prototype.padend";
import _StringPrototypePadStart from "string.prototype.padstart";
import _ArrayPrototypeReduce from "array.prototype.reduce";
import _ArrayPrototypeReduceRight from "array.prototype.reduceright";
import _StringPrototypeRepeat from "string.prototype.repeat";
import _StringPrototypeReplaceAll from "string.prototype.replaceall";
import _ArrayPrototypeSome from "array.prototype.some";
import _ArrayPrototypeSplice from "array.prototype.splice";
import _StringPrototypeStartsWith from "string.prototype.startswith";
import _StringPrototypeTrim from "string.prototype.trim";
import _StringPrototypeTrimEnd from "string.prototype.trimend";
import _StringPrototypeTrimLeft from "string.prototype.trimleft";
import _StringPrototypeTrimRight from "string.prototype.trimright";
import _StringPrototypeTrimStart from "string.prototype.trimstart";
import _ArrayPrototypeValues from "array.prototype.values";
import _ArrayPrototypeAt from "array.prototype.at";
import _StringPrototypeAt from "string.prototype.at";
import _ArrayPrototypeConcat from "array.prototype.concat";
import _ArrayPrototypeCopyWithin from "array.prototype.copywithin";
import _StringPrototypeEndsWith from "string.prototype.endswith";
import _DatePrototypeToISOString from "date/Date.prototype.toISOString";
import _DatePrototypeToJSON from "date/Date.prototype.toJSON";
_object = object, Array.isArray(_object) ? _ArrayPrototypeEntries.getPolyfill() : _object.entries;
_object2 = object, Array.isArray(_object2) ? _ArrayPrototypeEvery.getPolyfill() : _object2.every;
object.fill;
_object3 = object, Array.isArray(_object3) ? _ArrayPrototypeFilter.getPolyfill() : _object3.filter;
_object4 = object, Array.isArray(_object4) ? _ArrayPrototypeFind.getPolyfill() : _object4.find;
_object5 = object, Array.isArray(_object5) ? _ArrayPrototypeFindIndex.getPolyfill() : _object5.findIndex;
_object6 = object, _object6 instanceof RegExp ? _RegExpPrototypeFlags(_object6) : _object6.flags;
_object7 = object, Array.isArray(_object7) ? _ArrayPrototypeFlatMap.getPolyfill() : _object7.flatMap;
_object8 = object, Array.isArray(_object8) ? _ArrayPrototypeFlat.getPolyfill() : _object8.flat;
object.forEach;
_object9 = object, typeof _object9 === "string" ? _StringPrototypeIncludes.getPolyfill() : Array.isArray(_object9) ? _ArrayPrototypeIncludes.getPolyfill() : _object9.includes;
_object10 = object, Array.isArray(_object10) ? _ArrayPrototypeIndexOf.getPolyfill() : _object10.indexOf;
_object11 = object, Array.isArray(_object11) ? _ArrayPrototypeKeys.getPolyfill() : _object11.keys;
_object12 = object, Array.isArray(_object12) ? _ArrayPrototypeLastIndexOf.getPolyfill() : _object12.lastIndexOf;
_object13 = object, Array.isArray(_object13) ? _ArrayPrototypeMap.getPolyfill() : _object13.map;
_object14 = object, typeof _object14 === "string" ? _StringPrototypeMatchAll.getPolyfill() : _object14.matchAll;
_object15 = object, typeof _object15 === "string" ? _StringPrototypePadEnd.getPolyfill() : _object15.padEnd;
_object16 = object, typeof _object16 === "string" ? _StringPrototypePadStart.getPolyfill() : _object16.padStart;
_object17 = object, Array.isArray(_object17) ? _ArrayPrototypeReduce.getPolyfill() : _object17.reduce;
_object18 = object, Array.isArray(_object18) ? _ArrayPrototypeReduceRight.getPolyfill() : _object18.reduceRight;
_object19 = object, typeof _object19 === "string" ? _StringPrototypeRepeat.getPolyfill() : _object19.repeat;
_object20 = object, typeof _object20 === "string" ? _StringPrototypeReplaceAll.getPolyfill() : _object20.replaceAll;
object.reverse;
object.slice;
_object21 = object, Array.isArray(_object21) ? _ArrayPrototypeSome.getPolyfill() : _object21.some;
object.sort;
_object22 = object, Array.isArray(_object22) ? _ArrayPrototypeSplice.getPolyfill() : _object22.splice;
_object23 = object, typeof _object23 === "string" ? _StringPrototypeStartsWith.getPolyfill() : _object23.startsWith;
_object24 = object, typeof _object24 === "string" ? _StringPrototypeTrim.getPolyfill() : _object24.trim;
_object25 = object, typeof _object25 === "string" ? _StringPrototypeTrimEnd.getPolyfill() : _object25.trimEnd;
_object26 = object, typeof _object26 === "string" ? _StringPrototypeTrimLeft.getPolyfill() : _object26.trimLeft;
_object27 = object, typeof _object27 === "string" ? _StringPrototypeTrimRight.getPolyfill() : _object27.trimRight;
_object28 = object, typeof _object28 === "string" ? _StringPrototypeTrimStart.getPolyfill() : _object28.trimStart;
_object29 = object, Array.isArray(_object29) ? _ArrayPrototypeValues.getPolyfill() : _object29.values;
object.something;
(_object30 = object, typeof _object30 === "string" ? _StringPrototypeAt : Array.isArray(_object30) ? _ArrayPrototypeAt : Function.call.bind(_object30.at))(_object30, arg);
object.bind(arg);
object.codePointAt(arg);
object.codePoints(arg);
(_object31 = object, Array.isArray(_object31) ? _ArrayPrototypeConcat : Function.call.bind(_object31.concat))(_object31, arg);
(_object32 = object, Array.isArray(_object32) ? _ArrayPrototypeCopyWithin : Function.call.bind(_object32.copyWithin))(_object32, arg);
(_object33 = object, typeof _object33 === "string" ? _StringPrototypeEndsWith : Function.call.bind(_object33.endsWith))(_object33, arg);
(_object34 = object, Array.isArray(_object34) ? _ArrayPrototypeEntries : Function.call.bind(_object34.entries))(_object34, arg);
(_object35 = object, Array.isArray(_object35) ? _ArrayPrototypeEvery : Function.call.bind(_object35.every))(_object35, arg);
object.fill(arg);
(_object36 = object, Array.isArray(_object36) ? _ArrayPrototypeFilter : Function.call.bind(_object36.filter))(_object36, arg);
(_object37 = object, Array.isArray(_object37) ? _ArrayPrototypeFind : Function.call.bind(_object37.find))(_object37, arg);
(_object38 = object, Array.isArray(_object38) ? _ArrayPrototypeFindIndex : Function.call.bind(_object38.findIndex))(_object38, arg);
(_object39 = object, _object39 instanceof RegExp ? _RegExpPrototypeFlags(_object39) : _object39.flags)(arg);
(_object40 = object, Array.isArray(_object40) ? _ArrayPrototypeFlatMap : Function.call.bind(_object40.flatMap))(_object40, arg);
(_object41 = object, Array.isArray(_object41) ? _ArrayPrototypeFlat : Function.call.bind(_object41.flat))(_object41, arg);
object.forEach(arg);
(_object42 = object, typeof _object42 === "string" ? _StringPrototypeIncludes : Array.isArray(_object42) ? _ArrayPrototypeIncludes : Function.call.bind(_object42.includes))(_object42, arg);
(_object43 = object, Array.isArray(_object43) ? _ArrayPrototypeIndexOf : Function.call.bind(_object43.indexOf))(_object43, arg);
(_object44 = object, Array.isArray(_object44) ? _ArrayPrototypeKeys : Function.call.bind(_object44.keys))(_object44, arg);
(_object45 = object, Array.isArray(_object45) ? _ArrayPrototypeLastIndexOf : Function.call.bind(_object45.lastIndexOf))(_object45, arg);
(_object46 = object, Array.isArray(_object46) ? _ArrayPrototypeMap : Function.call.bind(_object46.map))(_object46, arg);
(_object47 = object, typeof _object47 === "string" ? _StringPrototypeMatchAll : Function.call.bind(_object47.matchAll))(_object47, arg);
(_object48 = object, typeof _object48 === "string" ? _StringPrototypePadEnd : Function.call.bind(_object48.padEnd))(_object48, arg);
(_object49 = object, typeof _object49 === "string" ? _StringPrototypePadStart : Function.call.bind(_object49.padStart))(_object49, arg);
(_object50 = object, Array.isArray(_object50) ? _ArrayPrototypeReduce : Function.call.bind(_object50.reduce))(_object50, arg);
(_object51 = object, Array.isArray(_object51) ? _ArrayPrototypeReduceRight : Function.call.bind(_object51.reduceRight))(_object51, arg);
(_object52 = object, typeof _object52 === "string" ? _StringPrototypeRepeat : Function.call.bind(_object52.repeat))(_object52, arg);
(_object53 = object, typeof _object53 === "string" ? _StringPrototypeReplaceAll : Function.call.bind(_object53.replaceAll))(_object53, arg);
object.reverse(arg);
object.slice(arg);
(_object54 = object, Array.isArray(_object54) ? _ArrayPrototypeSome : Function.call.bind(_object54.some))(_object54, arg);
object.sort(arg);
(_object55 = object, Array.isArray(_object55) ? _ArrayPrototypeSplice : Function.call.bind(_object55.splice))(_object55, arg);
(_object56 = object, typeof _object56 === "string" ? _StringPrototypeStartsWith : Function.call.bind(_object56.startsWith))(_object56, arg);
(_object57 = object, typeof _object57 === "string" ? _StringPrototypeTrim : Function.call.bind(_object57.trim))(_object57, arg);
(_object58 = object, typeof _object58 === "string" ? _StringPrototypeTrimEnd : Function.call.bind(_object58.trimEnd))(_object58, arg);
(_object59 = object, typeof _object59 === "string" ? _StringPrototypeTrimLeft : Function.call.bind(_object59.trimLeft))(_object59, arg);
(_object60 = object, typeof _object60 === "string" ? _StringPrototypeTrimRight : Function.call.bind(_object60.trimRight))(_object60, arg);
(_object61 = object, typeof _object61 === "string" ? _StringPrototypeTrimStart : Function.call.bind(_object61.trimStart))(_object61, arg);
(_object62 = object, Array.isArray(_object62) ? _ArrayPrototypeValues : Function.call.bind(_object62.values))(_object62, arg);
(_date = date, _date instanceof Date ? _DatePrototypeToISOString : Function.call.bind(_date.toISOString))(_date);
(_date2 = date, _date2 instanceof Date ? _DatePrototypeToJSON : Function.call.bind(_date2.toJSON))(_date2);
Function.bind;
object.something(arg);
