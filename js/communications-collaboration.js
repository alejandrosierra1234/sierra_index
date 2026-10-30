(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all2) => {
    for (var name in all2)
      __defProp(target, name, { get: all2[name], enumerable: true });
  };

  // node_modules/yjs/dist/yjs.mjs
  var yjs_exports = {};
  __export(yjs_exports, {
    AbsolutePosition: () => AbsolutePosition,
    AbstractConnector: () => AbstractConnector,
    AbstractStruct: () => AbstractStruct,
    AbstractType: () => AbstractType,
    Array: () => YArray,
    ContentAny: () => ContentAny,
    ContentBinary: () => ContentBinary,
    ContentDeleted: () => ContentDeleted,
    ContentDoc: () => ContentDoc,
    ContentEmbed: () => ContentEmbed,
    ContentFormat: () => ContentFormat,
    ContentJSON: () => ContentJSON,
    ContentString: () => ContentString,
    ContentType: () => ContentType,
    Doc: () => Doc,
    GC: () => GC,
    ID: () => ID,
    Item: () => Item,
    Map: () => YMap,
    PermanentUserData: () => PermanentUserData,
    RelativePosition: () => RelativePosition,
    Skip: () => Skip,
    Snapshot: () => Snapshot,
    Text: () => YText,
    Transaction: () => Transaction,
    UndoManager: () => UndoManager,
    UpdateDecoderV1: () => UpdateDecoderV1,
    UpdateDecoderV2: () => UpdateDecoderV2,
    UpdateEncoderV1: () => UpdateEncoderV1,
    UpdateEncoderV2: () => UpdateEncoderV2,
    XmlElement: () => YXmlElement,
    XmlFragment: () => YXmlFragment,
    XmlHook: () => YXmlHook,
    XmlText: () => YXmlText,
    YArrayEvent: () => YArrayEvent,
    YEvent: () => YEvent,
    YMapEvent: () => YMapEvent,
    YTextEvent: () => YTextEvent,
    YXmlEvent: () => YXmlEvent,
    applyUpdate: () => applyUpdate,
    applyUpdateV2: () => applyUpdateV2,
    cleanupYTextFormatting: () => cleanupYTextFormatting,
    compareIDs: () => compareIDs,
    compareRelativePositions: () => compareRelativePositions,
    convertUpdateFormatV1ToV2: () => convertUpdateFormatV1ToV2,
    convertUpdateFormatV2ToV1: () => convertUpdateFormatV2ToV1,
    createAbsolutePositionFromRelativePosition: () => createAbsolutePositionFromRelativePosition,
    createDeleteSet: () => createDeleteSet,
    createDeleteSetFromStructStore: () => createDeleteSetFromStructStore,
    createDocFromSnapshot: () => createDocFromSnapshot,
    createID: () => createID,
    createRelativePositionFromJSON: () => createRelativePositionFromJSON,
    createRelativePositionFromTypeIndex: () => createRelativePositionFromTypeIndex,
    createSnapshot: () => createSnapshot,
    decodeRelativePosition: () => decodeRelativePosition,
    decodeSnapshot: () => decodeSnapshot,
    decodeSnapshotV2: () => decodeSnapshotV2,
    decodeStateVector: () => decodeStateVector,
    decodeUpdate: () => decodeUpdate,
    decodeUpdateV2: () => decodeUpdateV2,
    diffUpdate: () => diffUpdate,
    diffUpdateV2: () => diffUpdateV2,
    emptySnapshot: () => emptySnapshot,
    encodeRelativePosition: () => encodeRelativePosition,
    encodeSnapshot: () => encodeSnapshot,
    encodeSnapshotV2: () => encodeSnapshotV2,
    encodeStateAsUpdate: () => encodeStateAsUpdate,
    encodeStateAsUpdateV2: () => encodeStateAsUpdateV2,
    encodeStateVector: () => encodeStateVector,
    encodeStateVectorFromUpdate: () => encodeStateVectorFromUpdate,
    encodeStateVectorFromUpdateV2: () => encodeStateVectorFromUpdateV2,
    equalDeleteSets: () => equalDeleteSets,
    equalSnapshots: () => equalSnapshots,
    findIndexSS: () => findIndexSS,
    findRootTypeKey: () => findRootTypeKey,
    getItem: () => getItem,
    getItemCleanEnd: () => getItemCleanEnd,
    getItemCleanStart: () => getItemCleanStart,
    getState: () => getState,
    getTypeChildren: () => getTypeChildren,
    isDeleted: () => isDeleted,
    isParentOf: () => isParentOf,
    iterateDeletedStructs: () => iterateDeletedStructs,
    logType: () => logType,
    logUpdate: () => logUpdate,
    logUpdateV2: () => logUpdateV2,
    mergeDeleteSets: () => mergeDeleteSets,
    mergeUpdates: () => mergeUpdates,
    mergeUpdatesV2: () => mergeUpdatesV2,
    obfuscateUpdate: () => obfuscateUpdate,
    obfuscateUpdateV2: () => obfuscateUpdateV2,
    parseUpdateMeta: () => parseUpdateMeta,
    parseUpdateMetaV2: () => parseUpdateMetaV2,
    readUpdate: () => readUpdate,
    readUpdateV2: () => readUpdateV2,
    relativePositionToJSON: () => relativePositionToJSON,
    snapshot: () => snapshot,
    snapshotContainsUpdate: () => snapshotContainsUpdate,
    transact: () => transact,
    tryGc: () => tryGc,
    typeListToArraySnapshot: () => typeListToArraySnapshot,
    typeMapGetAllSnapshot: () => typeMapGetAllSnapshot,
    typeMapGetSnapshot: () => typeMapGetSnapshot
  });

  // node_modules/lib0/map.js
  var create = () => /* @__PURE__ */ new Map();
  var copy = (m) => {
    const r = create();
    m.forEach((v, k) => {
      r.set(k, v);
    });
    return r;
  };
  var setIfUndefined = (map2, key, createT) => {
    let set = map2.get(key);
    if (set === void 0) {
      map2.set(key, set = createT());
    }
    return set;
  };
  var map = (m, f) => {
    const res = [];
    for (const [key, value] of m) {
      res.push(f(value, key));
    }
    return res;
  };
  var any = (m, f) => {
    for (const [key, value] of m) {
      if (f(value, key)) {
        return true;
      }
    }
    return false;
  };

  // node_modules/lib0/set.js
  var create2 = () => /* @__PURE__ */ new Set();

  // node_modules/lib0/array.js
  var last = (arr) => arr[arr.length - 1];
  var appendTo = (dest, src) => {
    for (let i = 0; i < src.length; i++) {
      dest.push(src[i]);
    }
  };
  var from = Array.from;
  var every = (arr, f) => {
    for (let i = 0; i < arr.length; i++) {
      if (!f(arr[i], i, arr)) {
        return false;
      }
    }
    return true;
  };
  var some = (arr, f) => {
    for (let i = 0; i < arr.length; i++) {
      if (f(arr[i], i, arr)) {
        return true;
      }
    }
    return false;
  };
  var unfold = (len, f) => {
    const array = new Array(len);
    for (let i = 0; i < len; i++) {
      array[i] = f(i, array);
    }
    return array;
  };
  var isArray = Array.isArray;

  // node_modules/lib0/observable.js
  var ObservableV2 = class {
    constructor() {
      this._observers = create();
    }
    /**
     * @template {keyof EVENTS & string} NAME
     * @param {NAME} name
     * @param {EVENTS[NAME]} f
     */
    on(name, f) {
      setIfUndefined(
        this._observers,
        /** @type {string} */
        name,
        create2
      ).add(f);
      return f;
    }
    /**
     * @template {keyof EVENTS & string} NAME
     * @param {NAME} name
     * @param {EVENTS[NAME]} f
     */
    once(name, f) {
      const _f = (...args2) => {
        this.off(
          name,
          /** @type {any} */
          _f
        );
        f(...args2);
      };
      this.on(
        name,
        /** @type {any} */
        _f
      );
    }
    /**
     * @template {keyof EVENTS & string} NAME
     * @param {NAME} name
     * @param {EVENTS[NAME]} f
     */
    off(name, f) {
      const observers = this._observers.get(name);
      if (observers !== void 0) {
        observers.delete(f);
        if (observers.size === 0) {
          this._observers.delete(name);
        }
      }
    }
    /**
     * Emit a named event. All registered event listeners that listen to the
     * specified name will receive the event.
     *
     * @todo This should catch exceptions
     *
     * @template {keyof EVENTS & string} NAME
     * @param {NAME} name The event name.
     * @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
     */
    emit(name, args2) {
      return from((this._observers.get(name) || create()).values()).forEach((f) => f(...args2));
    }
    destroy() {
      this._observers = create();
    }
  };
  var Observable = class {
    constructor() {
      this._observers = create();
    }
    /**
     * @param {N} name
     * @param {function} f
     */
    on(name, f) {
      setIfUndefined(this._observers, name, create2).add(f);
    }
    /**
     * @param {N} name
     * @param {function} f
     */
    once(name, f) {
      const _f = (...args2) => {
        this.off(name, _f);
        f(...args2);
      };
      this.on(name, _f);
    }
    /**
     * @param {N} name
     * @param {function} f
     */
    off(name, f) {
      const observers = this._observers.get(name);
      if (observers !== void 0) {
        observers.delete(f);
        if (observers.size === 0) {
          this._observers.delete(name);
        }
      }
    }
    /**
     * Emit a named event. All registered event listeners that listen to the
     * specified name will receive the event.
     *
     * @todo This should catch exceptions
     *
     * @param {N} name The event name.
     * @param {Array<any>} args The arguments that are applied to the event listener.
     */
    emit(name, args2) {
      return from((this._observers.get(name) || create()).values()).forEach((f) => f(...args2));
    }
    destroy() {
      this._observers = create();
    }
  };

  // node_modules/lib0/math.js
  var floor = Math.floor;
  var abs = Math.abs;
  var min = (a, b) => a < b ? a : b;
  var max = (a, b) => a > b ? a : b;
  var isNaN = Number.isNaN;
  var isNegativeZero = (n) => n !== 0 ? n < 0 : 1 / n < 0;

  // node_modules/lib0/binary.js
  var BIT1 = 1;
  var BIT2 = 2;
  var BIT3 = 4;
  var BIT4 = 8;
  var BIT6 = 32;
  var BIT7 = 64;
  var BIT8 = 128;
  var BIT18 = 1 << 17;
  var BIT19 = 1 << 18;
  var BIT20 = 1 << 19;
  var BIT21 = 1 << 20;
  var BIT22 = 1 << 21;
  var BIT23 = 1 << 22;
  var BIT24 = 1 << 23;
  var BIT25 = 1 << 24;
  var BIT26 = 1 << 25;
  var BIT27 = 1 << 26;
  var BIT28 = 1 << 27;
  var BIT29 = 1 << 28;
  var BIT30 = 1 << 29;
  var BIT31 = 1 << 30;
  var BIT32 = 1 << 31;
  var BITS5 = 31;
  var BITS6 = 63;
  var BITS7 = 127;
  var BITS17 = BIT18 - 1;
  var BITS18 = BIT19 - 1;
  var BITS19 = BIT20 - 1;
  var BITS20 = BIT21 - 1;
  var BITS21 = BIT22 - 1;
  var BITS22 = BIT23 - 1;
  var BITS23 = BIT24 - 1;
  var BITS24 = BIT25 - 1;
  var BITS25 = BIT26 - 1;
  var BITS26 = BIT27 - 1;
  var BITS27 = BIT28 - 1;
  var BITS28 = BIT29 - 1;
  var BITS29 = BIT30 - 1;
  var BITS30 = BIT31 - 1;
  var BITS31 = 2147483647;

  // node_modules/lib0/number.js
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
  var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
  var LOWEST_INT32 = 1 << 31;
  var isInteger = Number.isInteger || ((num) => typeof num === "number" && isFinite(num) && floor(num) === num);
  var isNaN2 = Number.isNaN;
  var parseInt2 = Number.parseInt;

  // node_modules/lib0/string.js
  var fromCharCode = String.fromCharCode;
  var fromCodePoint = String.fromCodePoint;
  var MAX_UTF16_CHARACTER = fromCharCode(65535);
  var toLowerCase = (s) => s.toLowerCase();
  var trimLeftRegex = /^\s*/g;
  var trimLeft = (s) => s.replace(trimLeftRegex, "");
  var fromCamelCaseRegex = /([A-Z])/g;
  var fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, (match2) => `${separator}${toLowerCase(match2)}`));
  var _encodeUtf8Polyfill = (str) => {
    const encodedString = unescape(encodeURIComponent(str));
    const len = encodedString.length;
    const buf = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      buf[i] = /** @type {number} */
      encodedString.codePointAt(i);
    }
    return buf;
  };
  var utf8TextEncoder = (
    /** @type {TextEncoder} */
    typeof TextEncoder !== "undefined" ? new TextEncoder() : null
  );
  var _encodeUtf8Native = (str) => utf8TextEncoder.encode(str);
  var encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill;
  var utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
  if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
    utf8TextDecoder = null;
  }
  var repeat = (source, n) => unfold(n, () => source).join("");

  // node_modules/lib0/encoding.js
  var Encoder = class {
    constructor() {
      this.cpos = 0;
      this.cbuf = new Uint8Array(100);
      this.bufs = [];
    }
  };
  var createEncoder = () => new Encoder();
  var encode = (f) => {
    const encoder = createEncoder();
    f(encoder);
    return toUint8Array(encoder);
  };
  var length = (encoder) => {
    let len = encoder.cpos;
    for (let i = 0; i < encoder.bufs.length; i++) {
      len += encoder.bufs[i].length;
    }
    return len;
  };
  var toUint8Array = (encoder) => {
    const uint8arr = new Uint8Array(length(encoder));
    let curPos = 0;
    for (let i = 0; i < encoder.bufs.length; i++) {
      const d = encoder.bufs[i];
      uint8arr.set(d, curPos);
      curPos += d.length;
    }
    uint8arr.set(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
    return uint8arr;
  };
  var verifyLen = (encoder, len) => {
    const bufferLen = encoder.cbuf.length;
    if (bufferLen - encoder.cpos < len) {
      encoder.bufs.push(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos));
      encoder.cbuf = new Uint8Array(max(bufferLen, len) * 2);
      encoder.cpos = 0;
    }
  };
  var write = (encoder, num) => {
    const bufferLen = encoder.cbuf.length;
    if (encoder.cpos === bufferLen) {
      encoder.bufs.push(encoder.cbuf);
      encoder.cbuf = new Uint8Array(bufferLen * 2);
      encoder.cpos = 0;
    }
    encoder.cbuf[encoder.cpos++] = num;
  };
  var writeUint8 = write;
  var writeVarUint = (encoder, num) => {
    while (num > BITS7) {
      write(encoder, BIT8 | BITS7 & num);
      num = floor(num / 128);
    }
    write(encoder, BITS7 & num);
  };
  var writeVarInt = (encoder, num) => {
    const isNegative = isNegativeZero(num);
    if (isNegative) {
      num = -num;
    }
    write(encoder, (num > BITS6 ? BIT8 : 0) | (isNegative ? BIT7 : 0) | BITS6 & num);
    num = floor(num / 64);
    while (num > 0) {
      write(encoder, (num > BITS7 ? BIT8 : 0) | BITS7 & num);
      num = floor(num / 128);
    }
  };
  var _strBuffer = new Uint8Array(3e4);
  var _maxStrBSize = _strBuffer.length / 3;
  var _writeVarStringNative = (encoder, str) => {
    if (str.length < _maxStrBSize) {
      const written = utf8TextEncoder.encodeInto(str, _strBuffer).written || 0;
      writeVarUint(encoder, written);
      for (let i = 0; i < written; i++) {
        write(encoder, _strBuffer[i]);
      }
    } else {
      writeVarUint8Array(encoder, encodeUtf8(str));
    }
  };
  var _writeVarStringPolyfill = (encoder, str) => {
    const encodedString = unescape(encodeURIComponent(str));
    const len = encodedString.length;
    writeVarUint(encoder, len);
    for (let i = 0; i < len; i++) {
      write(
        encoder,
        /** @type {number} */
        encodedString.codePointAt(i)
      );
    }
  };
  var writeVarString = utf8TextEncoder && /** @type {any} */
  utf8TextEncoder.encodeInto ? _writeVarStringNative : _writeVarStringPolyfill;
  var writeBinaryEncoder = (encoder, append2) => writeUint8Array(encoder, toUint8Array(append2));
  var writeUint8Array = (encoder, uint8Array) => {
    const bufferLen = encoder.cbuf.length;
    const cpos = encoder.cpos;
    const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
    const rightCopyLen = uint8Array.length - leftCopyLen;
    encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
    encoder.cpos += leftCopyLen;
    if (rightCopyLen > 0) {
      encoder.bufs.push(encoder.cbuf);
      encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
      encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
      encoder.cpos = rightCopyLen;
    }
  };
  var writeVarUint8Array = (encoder, uint8Array) => {
    writeVarUint(encoder, uint8Array.byteLength);
    writeUint8Array(encoder, uint8Array);
  };
  var writeOnDataView = (encoder, len) => {
    verifyLen(encoder, len);
    const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
    encoder.cpos += len;
    return dview;
  };
  var writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num, false);
  var writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num, false);
  var writeBigInt64 = (encoder, num) => (
    /** @type {any} */
    writeOnDataView(encoder, 8).setBigInt64(0, num, false)
  );
  var floatTestBed = new DataView(new ArrayBuffer(4));
  var isFloat32 = (num) => {
    floatTestBed.setFloat32(0, num);
    return floatTestBed.getFloat32(0) === num;
  };
  var writeAny = (encoder, data) => {
    switch (typeof data) {
      case "string":
        write(encoder, 119);
        writeVarString(encoder, data);
        break;
      case "number":
        if (isInteger(data) && abs(data) <= BITS31) {
          write(encoder, 125);
          writeVarInt(encoder, data);
        } else if (isFloat32(data)) {
          write(encoder, 124);
          writeFloat32(encoder, data);
        } else {
          write(encoder, 123);
          writeFloat64(encoder, data);
        }
        break;
      case "bigint":
        write(encoder, 122);
        writeBigInt64(encoder, data);
        break;
      case "object":
        if (data === null) {
          write(encoder, 126);
        } else if (isArray(data)) {
          write(encoder, 117);
          writeVarUint(encoder, data.length);
          for (let i = 0; i < data.length; i++) {
            writeAny(encoder, data[i]);
          }
        } else if (data instanceof Uint8Array) {
          write(encoder, 116);
          writeVarUint8Array(encoder, data);
        } else {
          write(encoder, 118);
          const keys3 = Object.keys(data);
          writeVarUint(encoder, keys3.length);
          for (let i = 0; i < keys3.length; i++) {
            const key = keys3[i];
            writeVarString(encoder, key);
            writeAny(encoder, data[key]);
          }
        }
        break;
      case "boolean":
        write(encoder, data ? 120 : 121);
        break;
      default:
        write(encoder, 127);
    }
  };
  var RleEncoder = class extends Encoder {
    /**
     * @param {function(Encoder, T):void} writer
     */
    constructor(writer) {
      super();
      this.w = writer;
      this.s = null;
      this.count = 0;
    }
    /**
     * @param {T} v
     */
    write(v) {
      if (this.s === v) {
        this.count++;
      } else {
        if (this.count > 0) {
          writeVarUint(this, this.count - 1);
        }
        this.count = 1;
        this.w(this, v);
        this.s = v;
      }
    }
  };
  var flushUintOptRleEncoder = (encoder) => {
    if (encoder.count > 0) {
      writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
      if (encoder.count > 1) {
        writeVarUint(encoder.encoder, encoder.count - 2);
      }
    }
  };
  var UintOptRleEncoder = class {
    constructor() {
      this.encoder = new Encoder();
      this.s = 0;
      this.count = 0;
    }
    /**
     * @param {number} v
     */
    write(v) {
      if (this.s === v) {
        this.count++;
      } else {
        flushUintOptRleEncoder(this);
        this.count = 1;
        this.s = v;
      }
    }
    /**
     * Flush the encoded state and transform this to a Uint8Array.
     *
     * Note that this should only be called once.
     */
    toUint8Array() {
      flushUintOptRleEncoder(this);
      return toUint8Array(this.encoder);
    }
  };
  var flushIntDiffOptRleEncoder = (encoder) => {
    if (encoder.count > 0) {
      const encodedDiff = encoder.diff * 2 + (encoder.count === 1 ? 0 : 1);
      writeVarInt(encoder.encoder, encodedDiff);
      if (encoder.count > 1) {
        writeVarUint(encoder.encoder, encoder.count - 2);
      }
    }
  };
  var IntDiffOptRleEncoder = class {
    constructor() {
      this.encoder = new Encoder();
      this.s = 0;
      this.count = 0;
      this.diff = 0;
    }
    /**
     * @param {number} v
     */
    write(v) {
      if (this.diff === v - this.s) {
        this.s = v;
        this.count++;
      } else {
        flushIntDiffOptRleEncoder(this);
        this.count = 1;
        this.diff = v - this.s;
        this.s = v;
      }
    }
    /**
     * Flush the encoded state and transform this to a Uint8Array.
     *
     * Note that this should only be called once.
     */
    toUint8Array() {
      flushIntDiffOptRleEncoder(this);
      return toUint8Array(this.encoder);
    }
  };
  var StringEncoder = class {
    constructor() {
      this.sarr = [];
      this.s = "";
      this.lensE = new UintOptRleEncoder();
    }
    /**
     * @param {string} string
     */
    write(string) {
      this.s += string;
      if (this.s.length > 19) {
        this.sarr.push(this.s);
        this.s = "";
      }
      this.lensE.write(string.length);
    }
    toUint8Array() {
      const encoder = new Encoder();
      this.sarr.push(this.s);
      this.s = "";
      writeVarString(encoder, this.sarr.join(""));
      writeUint8Array(encoder, this.lensE.toUint8Array());
      return toUint8Array(encoder);
    }
  };

  // node_modules/lib0/error.js
  var create3 = (s) => new Error(s);
  var methodUnimplemented = () => {
    throw create3("Method unimplemented");
  };
  var unexpectedCase = () => {
    throw create3("Unexpected case");
  };

  // node_modules/lib0/decoding.js
  var errorUnexpectedEndOfArray = create3("Unexpected end of array");
  var errorIntegerOutOfRange = create3("Integer out of Range");
  var Decoder = class {
    /**
     * @param {Uint8Array<Buf>} uint8Array Binary data to decode
     */
    constructor(uint8Array) {
      this.arr = uint8Array;
      this.pos = 0;
    }
  };
  var createDecoder = (uint8Array) => new Decoder(uint8Array);
  var hasContent = (decoder) => decoder.pos !== decoder.arr.length;
  var readUint8Array = (decoder, len) => {
    const view = new Uint8Array(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
    decoder.pos += len;
    return view;
  };
  var readVarUint8Array = (decoder) => readUint8Array(decoder, readVarUint(decoder));
  var readUint8 = (decoder) => decoder.arr[decoder.pos++];
  var readVarUint = (decoder) => {
    let num = 0;
    let mult = 1;
    const len = decoder.arr.length;
    while (decoder.pos < len) {
      const r = decoder.arr[decoder.pos++];
      num = num + (r & BITS7) * mult;
      mult *= 128;
      if (r < BIT8) {
        return num;
      }
      if (num > MAX_SAFE_INTEGER) {
        throw errorIntegerOutOfRange;
      }
    }
    throw errorUnexpectedEndOfArray;
  };
  var readVarInt = (decoder) => {
    let r = decoder.arr[decoder.pos++];
    let num = r & BITS6;
    let mult = 64;
    const sign = (r & BIT7) > 0 ? -1 : 1;
    if ((r & BIT8) === 0) {
      return sign * num;
    }
    const len = decoder.arr.length;
    while (decoder.pos < len) {
      r = decoder.arr[decoder.pos++];
      num = num + (r & BITS7) * mult;
      mult *= 128;
      if (r < BIT8) {
        return sign * num;
      }
      if (num > MAX_SAFE_INTEGER) {
        throw errorIntegerOutOfRange;
      }
    }
    throw errorUnexpectedEndOfArray;
  };
  var _readVarStringPolyfill = (decoder) => {
    let remainingLen = readVarUint(decoder);
    if (remainingLen === 0) {
      return "";
    } else {
      let encodedString = String.fromCodePoint(readUint8(decoder));
      if (--remainingLen < 100) {
        while (remainingLen--) {
          encodedString += String.fromCodePoint(readUint8(decoder));
        }
      } else {
        while (remainingLen > 0) {
          const nextLen = remainingLen < 1e4 ? remainingLen : 1e4;
          const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
          decoder.pos += nextLen;
          encodedString += String.fromCodePoint.apply(
            null,
            /** @type {any} */
            bytes
          );
          remainingLen -= nextLen;
        }
      }
      return decodeURIComponent(escape(encodedString));
    }
  };
  var _readVarStringNative = (decoder) => (
    /** @type any */
    utf8TextDecoder.decode(readVarUint8Array(decoder))
  );
  var readVarString = utf8TextDecoder ? _readVarStringNative : _readVarStringPolyfill;
  var readFromDataView = (decoder, len) => {
    const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
    decoder.pos += len;
    return dv;
  };
  var readFloat32 = (decoder) => readFromDataView(decoder, 4).getFloat32(0, false);
  var readFloat64 = (decoder) => readFromDataView(decoder, 8).getFloat64(0, false);
  var readBigInt64 = (decoder) => (
    /** @type {any} */
    readFromDataView(decoder, 8).getBigInt64(0, false)
  );
  var readAnyLookupTable = [
    (decoder) => void 0,
    // CASE 127: undefined
    (decoder) => null,
    // CASE 126: null
    readVarInt,
    // CASE 125: integer
    readFloat32,
    // CASE 124: float32
    readFloat64,
    // CASE 123: float64
    readBigInt64,
    // CASE 122: bigint
    (decoder) => false,
    // CASE 121: boolean (false)
    (decoder) => true,
    // CASE 120: boolean (true)
    readVarString,
    // CASE 119: string
    (decoder) => {
      const len = readVarUint(decoder);
      const obj = {};
      for (let i = 0; i < len; i++) {
        const key = readVarString(decoder);
        obj[key] = readAny(decoder);
      }
      return obj;
    },
    (decoder) => {
      const len = readVarUint(decoder);
      const arr = [];
      for (let i = 0; i < len; i++) {
        arr.push(readAny(decoder));
      }
      return arr;
    },
    readVarUint8Array
    // CASE 116: Uint8Array
  ];
  var readAny = (decoder) => readAnyLookupTable[127 - readUint8(decoder)](decoder);
  var RleDecoder = class extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     * @param {function(Decoder):T} reader
     */
    constructor(uint8Array, reader) {
      super(uint8Array);
      this.reader = reader;
      this.s = null;
      this.count = 0;
    }
    read() {
      if (this.count === 0) {
        this.s = this.reader(this);
        if (hasContent(this)) {
          this.count = readVarUint(this) + 1;
        } else {
          this.count = -1;
        }
      }
      this.count--;
      return (
        /** @type {T} */
        this.s
      );
    }
  };
  var UintOptRleDecoder = class extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     */
    constructor(uint8Array) {
      super(uint8Array);
      this.s = 0;
      this.count = 0;
    }
    read() {
      if (this.count === 0) {
        this.s = readVarInt(this);
        const isNegative = isNegativeZero(this.s);
        this.count = 1;
        if (isNegative) {
          this.s = -this.s;
          this.count = readVarUint(this) + 2;
        }
      }
      this.count--;
      return (
        /** @type {number} */
        this.s
      );
    }
  };
  var IntDiffOptRleDecoder = class extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     */
    constructor(uint8Array) {
      super(uint8Array);
      this.s = 0;
      this.count = 0;
      this.diff = 0;
    }
    /**
     * @return {number}
     */
    read() {
      if (this.count === 0) {
        const diff = readVarInt(this);
        const hasCount = diff & 1;
        this.diff = floor(diff / 2);
        this.count = 1;
        if (hasCount) {
          this.count = readVarUint(this) + 2;
        }
      }
      this.s += this.diff;
      this.count--;
      return this.s;
    }
  };
  var StringDecoder = class {
    /**
     * @param {Uint8Array} uint8Array
     */
    constructor(uint8Array) {
      this.decoder = new UintOptRleDecoder(uint8Array);
      this.str = readVarString(this.decoder);
      this.spos = 0;
    }
    /**
     * @return {string}
     */
    read() {
      const end = this.spos + this.decoder.read();
      const res = this.str.slice(this.spos, end);
      this.spos = end;
      return res;
    }
  };

  // node_modules/lib0/webcrypto.js
  var subtle = crypto.subtle;
  var getRandomValues = crypto.getRandomValues.bind(crypto);

  // node_modules/lib0/random.js
  var rand = Math.random;
  var uint32 = () => getRandomValues(new Uint32Array(1))[0];
  var oneOf = (arr) => arr[floor(rand() * arr.length)];
  var uuidv4Template = "10000000-1000-4000-8000" + -1e11;
  var uuidv4 = () => uuidv4Template.replace(
    /[018]/g,
    /** @param {number} c */
    (c) => (c ^ uint32() & 15 >> c / 4).toString(16)
  );

  // node_modules/lib0/time.js
  var getUnixTime = Date.now;

  // node_modules/lib0/promise.js
  var create4 = (f) => (
    /** @type {Promise<T>} */
    new Promise(f)
  );
  var all = Promise.all.bind(Promise);

  // node_modules/lib0/conditions.js
  var undefinedToNull = (v) => v === void 0 ? null : v;

  // node_modules/lib0/storage.js
  var VarStoragePolyfill = class {
    constructor() {
      this.map = /* @__PURE__ */ new Map();
    }
    /**
     * @param {string} key
     * @param {any} newValue
     */
    setItem(key, newValue) {
      this.map.set(key, newValue);
    }
    /**
     * @param {string} key
     */
    getItem(key) {
      return this.map.get(key);
    }
  };
  var _localStorage = new VarStoragePolyfill();
  var usePolyfill = true;
  try {
    if (typeof localStorage !== "undefined" && localStorage) {
      _localStorage = localStorage;
      usePolyfill = false;
    }
  } catch (e) {
  }
  var varStorage = _localStorage;

  // node_modules/lib0/trait/equality.js
  var EqualityTraitSymbol = Symbol("Equality");
  var equals = (a, b) => a === b || !!a?.[EqualityTraitSymbol]?.(b) || false;

  // node_modules/lib0/object.js
  var isObject = (o) => typeof o === "object";
  var assign = Object.assign;
  var keys = Object.keys;
  var forEach = (obj, f) => {
    for (const key in obj) {
      f(obj[key], key);
    }
  };
  var size = (obj) => keys(obj).length;
  var isEmpty = (obj) => {
    for (const _k in obj) {
      return false;
    }
    return true;
  };
  var every2 = (obj, f) => {
    for (const key in obj) {
      if (!f(obj[key], key)) {
        return false;
      }
    }
    return true;
  };
  var hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  var equalFlat = (a, b) => a === b || size(a) === size(b) && every2(a, (val, key) => (val !== void 0 || hasProperty(b, key)) && equals(b[key], val));
  var freeze = Object.freeze;
  var deepFreeze = (o) => {
    for (const key in o) {
      const c = o[key];
      if (typeof c === "object" || typeof c === "function") {
        deepFreeze(o[key]);
      }
    }
    return freeze(o);
  };

  // node_modules/lib0/function.js
  var callAll = (fs, args2, i = 0) => {
    try {
      for (; i < fs.length; i++) {
        fs[i](...args2);
      }
    } finally {
      if (i < fs.length) {
        callAll(fs, args2, i + 1);
      }
    }
  };
  var id = (a) => a;
  var equalityDeep = (a, b) => {
    if (a === b) {
      return true;
    }
    if (a == null || b == null || a.constructor !== b.constructor && (a.constructor || Object) !== (b.constructor || Object)) {
      return false;
    }
    if (a[EqualityTraitSymbol] != null) {
      return a[EqualityTraitSymbol](b);
    }
    switch (a.constructor) {
      case ArrayBuffer:
        a = new Uint8Array(a);
        b = new Uint8Array(b);
      // eslint-disable-next-line no-fallthrough
      case Uint8Array: {
        if (a.byteLength !== b.byteLength) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return false;
          }
        }
        break;
      }
      case Set: {
        if (a.size !== b.size) {
          return false;
        }
        for (const value of a) {
          if (!b.has(value)) {
            return false;
          }
        }
        break;
      }
      case Map: {
        if (a.size !== b.size) {
          return false;
        }
        for (const key of a.keys()) {
          if (!b.has(key) || !equalityDeep(a.get(key), b.get(key))) {
            return false;
          }
        }
        break;
      }
      case void 0:
      case Object:
        if (size(a) !== size(b)) {
          return false;
        }
        for (const key in a) {
          if (!hasProperty(a, key) || !equalityDeep(a[key], b[key])) {
            return false;
          }
        }
        break;
      case Array:
        if (a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (!equalityDeep(a[i], b[i])) {
            return false;
          }
        }
        break;
      default:
        return false;
    }
    return true;
  };
  var isOneOf = (value, options) => options.includes(value);

  // node_modules/lib0/environment.js
  var isNode = typeof process !== "undefined" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
  var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && !isNode;
  var isMac = typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
  var params;
  var args = [];
  var computeParams = () => {
    if (params === void 0) {
      if (isNode) {
        params = create();
        const pargs = process.argv;
        let currParamName = null;
        for (let i = 0; i < pargs.length; i++) {
          const parg = pargs[i];
          if (parg[0] === "-") {
            if (currParamName !== null) {
              params.set(currParamName, "");
            }
            currParamName = parg;
          } else {
            if (currParamName !== null) {
              params.set(currParamName, parg);
              currParamName = null;
            } else {
              args.push(parg);
            }
          }
        }
        if (currParamName !== null) {
          params.set(currParamName, "");
        }
      } else if (typeof location === "object") {
        params = create();
        (location.search || "?").slice(1).split("&").forEach((kv) => {
          if (kv.length !== 0) {
            const [key, value] = kv.split("=");
            params.set(`--${fromCamelCase(key, "-")}`, value);
            params.set(`-${fromCamelCase(key, "-")}`, value);
          }
        });
      } else {
        params = create();
      }
    }
    return params;
  };
  var hasParam = (name) => computeParams().has(name);
  var getVariable = (name) => isNode ? undefinedToNull(process.env[name.toUpperCase().replaceAll("-", "_")]) : undefinedToNull(varStorage.getItem(name));
  var hasConf = (name) => hasParam("--" + name) || getVariable(name) !== null;
  var production = hasConf("production");
  var forceColor = isNode && isOneOf(process.env.FORCE_COLOR, ["true", "1", "2"]);
  var supportsColor = forceColor || !hasParam("--no-colors") && // @todo deprecate --no-colors
  !hasConf("no-color") && (!isNode || process.stdout.isTTY) && (!isNode || hasParam("--color") || getVariable("COLORTERM") !== null || (getVariable("TERM") || "").includes("color"));

  // node_modules/lib0/buffer.js
  var createUint8ArrayFromLen = (len) => new Uint8Array(len);
  var toBase64Browser = (bytes) => {
    let s = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      s += fromCharCode(bytes[i]);
    }
    return btoa(s);
  };
  var toBase64Node = (bytes) => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64");
  var toBase64 = isBrowser ? toBase64Browser : toBase64Node;
  var copyUint8Array = (uint8Array) => {
    const newBuf = createUint8ArrayFromLen(uint8Array.byteLength);
    newBuf.set(uint8Array);
    return newBuf;
  };
  var encodeAny = (data) => encode((encoder) => writeAny(encoder, data));

  // node_modules/lib0/pair.js
  var Pair = class {
    /**
     * @param {L} left
     * @param {R} right
     */
    constructor(left, right) {
      this.left = left;
      this.right = right;
    }
  };
  var create5 = (left, right) => new Pair(left, right);

  // node_modules/lib0/prng.js
  var bool = (gen) => gen.next() >= 0.5;
  var int53 = (gen, min2, max2) => floor(gen.next() * (max2 + 1 - min2) + min2);
  var int32 = (gen, min2, max2) => floor(gen.next() * (max2 + 1 - min2) + min2);
  var int31 = (gen, min2, max2) => int32(gen, min2, max2);
  var letter = (gen) => fromCharCode(int31(gen, 97, 122));
  var word = (gen, minLen = 0, maxLen = 20) => {
    const len = int31(gen, minLen, maxLen);
    let str = "";
    for (let i = 0; i < len; i++) {
      str += letter(gen);
    }
    return str;
  };
  var oneOf2 = (gen, array) => array[int31(gen, 0, array.length - 1)];

  // node_modules/lib0/schema.js
  var schemaSymbol = Symbol("0schema");
  var ValidationError = class {
    constructor() {
      this._rerrs = [];
    }
    /**
     * @param {string?} path
     * @param {string} expected
     * @param {string} has
     * @param {string?} message
     */
    extend(path, expected, has, message2 = null) {
      this._rerrs.push({ path, expected, has, message: message2 });
    }
    toString() {
      const s = [];
      for (let i = this._rerrs.length - 1; i > 0; i--) {
        const r = this._rerrs[i];
        s.push(repeat(" ", (this._rerrs.length - i) * 2) + `${r.path != null ? `[${r.path}] ` : ""}${r.has} doesn't match ${r.expected}. ${r.message}`);
      }
      return s.join("\n");
    }
  };
  var shapeExtends = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null || a.constructor !== b.constructor) return false;
    if (a[EqualityTraitSymbol]) return equals(a, b);
    if (isArray(a)) {
      return every(
        a,
        (aitem) => some(b, (bitem) => shapeExtends(aitem, bitem))
      );
    } else if (isObject(a)) {
      return every2(
        a,
        (aitem, akey) => shapeExtends(aitem, b[akey])
      );
    }
    return false;
  };
  var Schema = class {
    // this.shape must not be defined on Schema. Otherwise typecheck on metatypes (e.g. $$object) won't work as expected anymore
    /**
     * If true, the more things are added to the shape the more objects this schema will accept (e.g.
     * union). By default, the more objects are added, the the fewer objects this schema will accept.
     * @protected
     */
    static _dilutes = false;
    /**
     * @param {Schema<any>} other
     */
    extends(other) {
      let [a, b] = [
        /** @type {any} */
        this.shape,
        /** @type {any} */
        other.shape
      ];
      if (
        /** @type {typeof Schema<any>} */
        this.constructor._dilutes
      ) [b, a] = [a, b];
      return shapeExtends(a, b);
    }
    /**
     * Overwrite this when necessary. By default, we only check the `shape` property which every shape
     * should have.
     * @param {Schema<any>} other
     */
    equals(other) {
      return this.constructor === other.constructor && equalityDeep(this.shape, other.shape);
    }
    [schemaSymbol]() {
      return true;
    }
    /**
     * @param {object} other
     */
    [EqualityTraitSymbol](other) {
      return this.equals(
        /** @type {any} */
        other
      );
    }
    /**
     * Use `schema.validate(obj)` with a typed parameter that is already of typed to be an instance of
     * Schema. Validate will check the structure of the parameter and return true iff the instance
     * really is an instance of Schema.
     *
     * @param {T} o
     * @return {boolean}
     */
    validate(o) {
      return this.check(o);
    }
    /* c8 ignore start */
    /**
     * Similar to validate, but this method accepts untyped parameters.
     *
     * @param {any} _o
     * @param {ValidationError} [_err]
     * @return {_o is T}
     */
    check(_o, _err) {
      methodUnimplemented();
    }
    /* c8 ignore stop */
    /**
     * @type {Schema<T?>}
     */
    get nullable() {
      return $union(this, $null);
    }
    /**
     * @type {$Optional<Schema<T>>}
     */
    get optional() {
      return new $Optional(
        /** @type {Schema<T>} */
        this
      );
    }
    /**
     * Cast a variable to a specific type. Returns the casted value, or throws an exception otherwise.
     * Use this if you know that the type is of a specific type and you just want to convince the type
     * system.
     *
     * **Do not rely on these error messages!**
     * Performs an assertion check only if not in a production environment.
     *
     * @template OO
     * @param {OO} o
     * @return {Extract<OO, T> extends never ? T : (OO extends Array<never> ? T : Extract<OO,T>)}
     */
    cast(o) {
      assert(o, this);
      return (
        /** @type {any} */
        o
      );
    }
    /**
     * EXPECTO PATRONUM!! ðŸª„
     * This function protects against type errors. Though it may not work in the real world.
     *
     * "After all this time?"
     * "Always." - Snape, talking about type safety
     *
     * Ensures that a variable is a a specific type. Returns the value, or throws an exception if the assertion check failed.
     * Use this if you know that the type is of a specific type and you just want to convince the type
     * system.
     *
     * Can be useful when defining lambdas: `s.lambda(s.$number, s.$void).expect((n) => n + 1)`
     *
     * **Do not rely on these error messages!**
     * Performs an assertion check if not in a production environment.
     *
     * @param {T} o
     * @return {o extends T ? T : never}
     */
    expect(o) {
      assert(o, this);
      return o;
    }
  };
  var $ConstructedBy = class extends Schema {
    /**
     * @param {C} c
     * @param {((o:Instance<C>)=>boolean)|null} check
     */
    constructor(c, check) {
      super();
      this.shape = c;
      this._c = check;
    }
    /**
     * @param {any} o
     * @param {ValidationError} [err]
     * @return {o is C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)} o
     */
    check(o, err = void 0) {
      const c = o?.constructor === this.shape && (this._c == null || this._c(o));
      !c && err?.extend(null, this.shape.name, o?.constructor.name, o?.constructor !== this.shape ? "Constructor match failed" : "Check failed");
      return c;
    }
  };
  var $constructedBy = (c, check = null) => new $ConstructedBy(c, check);
  var $$constructedBy = $constructedBy($ConstructedBy);
  var $Custom = class extends Schema {
    /**
     * @param {(o:any) => boolean} check
     */
    constructor(check) {
      super();
      this.shape = check;
    }
    /**
     * @param {any} o
     * @param {ValidationError} err
     * @return {o is any}
     */
    check(o, err) {
      const c = this.shape(o);
      !c && err?.extend(null, "custom prop", o?.constructor.name, "failed to check custom prop");
      return c;
    }
  };
  var $custom = (check) => new $Custom(check);
  var $$custom = $constructedBy($Custom);
  var $Literal = class extends Schema {
    /**
     * @param {Array<T>} literals
     */
    constructor(literals) {
      super();
      this.shape = literals;
    }
    /**
     *
     * @param {any} o
     * @param {ValidationError} [err]
     * @return {o is T}
     */
    check(o, err) {
      const c = this.shape.some((a) => a === o);
      !c && err?.extend(null, this.shape.join(" | "), o.toString());
      return c;
    }
  };
  var $literal = (...literals) => new $Literal(literals);
  var $$literal = $constructedBy($Literal);
  var _regexEscape = (
    /** @type {any} */
    RegExp.escape || /** @type {(str:string) => string} */
    ((str) => str.replace(/[().|&,$^[\]]/g, (s) => "\\" + s))
  );
  var _schemaStringTemplateToRegex = (s) => {
    if ($string.check(s)) {
      return [_regexEscape(s)];
    }
    if ($$literal.check(s)) {
      return (
        /** @type {Array<string|number>} */
        s.shape.map((v) => v + "")
      );
    }
    if ($$number.check(s)) {
      return ["[+-]?\\d+.?\\d*"];
    }
    if ($$string.check(s)) {
      return [".*"];
    }
    if ($$union.check(s)) {
      return s.shape.map(_schemaStringTemplateToRegex).flat(1);
    }
    unexpectedCase();
  };
  var $StringTemplate = class extends Schema {
    /**
     * @param {T} shape
     */
    constructor(shape) {
      super();
      this.shape = shape;
      this._r = new RegExp("^" + shape.map(_schemaStringTemplateToRegex).map((opts) => `(${opts.join("|")})`).join("") + "$");
    }
    /**
     * @param {any} o
     * @param {ValidationError} [err]
     * @return {o is CastStringTemplateArgsToTemplate<T>}
     */
    check(o, err) {
      const c = this._r.exec(o) != null;
      !c && err?.extend(null, this._r.toString(), o.toString(), "String doesn't match string template.");
      return c;
    }
  };
  var $$stringTemplate = $constructedBy($StringTemplate);
  var isOptionalSymbol = Symbol("optional");
  var $Optional = class extends Schema {
    /**
     * @param {S} shape
     */
    constructor(shape) {
      super();
      this.shape = shape;
    }
    /**
     * @param {any} o
     * @param {ValidationError} [err]
     * @return {o is (Unwrap<S>|undefined)}
     */
    check(o, err) {
      const c = o === void 0 || this.shape.check(o);
      !c && err?.extend(null, "undefined (optional)", "()");
      return c;
    }
    get [isOptionalSymbol]() {
      return true;
    }
  };
  var $$optional = $constructedBy($Optional);
  var $Never = class extends Schema {
    /**
     * @param {any} _o
     * @param {ValidationError} [err]
     * @return {_o is never}
     */
    check(_o, err) {
      err?.extend(null, "never", typeof _o);
      return false;
    }
  };
  var $never = new $Never();
  var $$never = $constructedBy($Never);
  var $Object = class _$Object extends Schema {
    /**
     * @param {S} shape
     * @param {boolean} partial
     */
    constructor(shape, partial = false) {
      super();
      this.shape = shape;
      this._isPartial = partial;
    }
    static _dilutes = true;
    /**
     * @type {Schema<Partial<$ObjectToType<S>>>}
     */
    get partial() {
      return new _$Object(this.shape, true);
    }
    /**
     * @param {any} o
     * @param {ValidationError} err
     * @return {o is $ObjectToType<S>}
     */
    check(o, err) {
      if (o == null) {
        err?.extend(null, "object", "null");
        return false;
      }
      return every2(this.shape, (vv, vk) => {
        const c = this._isPartial && !hasProperty(o, vk) || vv.check(o[vk], err);
        !c && err?.extend(vk.toString(), vv.toString(), typeof o[vk], "Object property does not match");
        return c;
      });
    }
  };
  var $object = (def) => (
    /** @type {any} */
    new $Object(def)
  );
  var $$object = $constructedBy($Object);
  var $objectAny = $custom((o) => o != null && (o.constructor === Object || o.constructor == null));
  var $Record = class extends Schema {
    /**
     * @param {Keys} keys
     * @param {Values} values
     */
    constructor(keys3, values) {
      super();
      this.shape = {
        keys: keys3,
        values
      };
    }
    /**
     * @param {any} o
     * @param {ValidationError} err
     * @return {o is { [key in Unwrap<Keys>]: Unwrap<Values> }}
     */
    check(o, err) {
      return o != null && every2(o, (vv, vk) => {
        const ck = this.shape.keys.check(vk, err);
        !ck && err?.extend(vk + "", "Record", typeof o, ck ? "Key doesn't match schema" : "Value doesn't match value");
        return ck && this.shape.values.check(vv, err);
      });
    }
  };
  var $record = (keys3, values) => new $Record(keys3, values);
  var $$record = $constructedBy($Record);
  var $Tuple = class extends Schema {
    /**
     * @param {S} shape
     */
    constructor(shape) {
      super();
      this.shape = shape;
    }
    /**
     * @param {any} o
     * @param {ValidationError} err
     * @return {o is { [K in keyof S]: S[K] extends Schema<infer Type> ? Type : never }}
     */
    check(o, err) {
      return o != null && every2(this.shape, (vv, vk) => {
        const c = (
          /** @type {Schema<any>} */
          vv.check(o[vk], err)
        );
        !c && err?.extend(vk.toString(), "Tuple", typeof vv);
        return c;
      });
    }
  };
  var $tuple = (...def) => new $Tuple(def);
  var $$tuple = $constructedBy($Tuple);
  var $Array = class extends Schema {
    /**
     * @param {Array<S>} v
     */
    constructor(v) {
      super();
      this.shape = v.length === 1 ? v[0] : new $Union(v);
    }
    /**
     * @param {any} o
     * @param {ValidationError} [err]
     * @return {o is Array<S extends Schema<infer T> ? T : never>} o
     */
    check(o, err) {
      const c = isArray(o) && every(o, (oi) => this.shape.check(oi));
      !c && err?.extend(null, "Array", "");
      return c;
    }
  };
  var $array = (...def) => new $Array(def);
  var $$array = $constructedBy($Array);
  var $arrayAny = $custom((o) => isArray(o));
  var $InstanceOf = class extends Schema {
    /**
     * @param {new (...args:any) => T} constructor
     * @param {((o:T) => boolean)|null} check
     */
    constructor(constructor, check) {
      super();
      this.shape = constructor;
      this._c = check;
    }
    /**
     * @param {any} o
     * @param {ValidationError} err
     * @return {o is T}
     */
    check(o, err) {
      const c = o instanceof this.shape && (this._c == null || this._c(o));
      !c && err?.extend(null, this.shape.name, o?.constructor.name);
      return c;
    }
  };
  var $instanceOf = (c, check = null) => new $InstanceOf(c, check);
  var $$instanceOf = $constructedBy($InstanceOf);
  var $$schema = $instanceOf(Schema);
  var $Lambda = class extends Schema {
    /**
     * @param {Args} args
     */
    constructor(args2) {
      super();
      this.len = args2.length - 1;
      this.args = $tuple(...args2.slice(-1));
      this.res = args2[this.len];
    }
    /**
     * @param {any} f
     * @param {ValidationError} err
     * @return {f is _LArgsToLambdaDef<Args>}
     */
    check(f, err) {
      const c = f.constructor === Function && f.length <= this.len;
      !c && err?.extend(null, "function", typeof f);
      return c;
    }
  };
  var $$lambda = $constructedBy($Lambda);
  var $function = $custom((o) => typeof o === "function");
  var $Intersection = class extends Schema {
    /**
     * @param {T} v
     */
    constructor(v) {
      super();
      this.shape = v;
    }
    /**
     * @param {any} o
     * @param {ValidationError} [err]
     * @return {o is Intersect<UnwrapArray<T>>}
     */
    check(o, err) {
      const c = every(this.shape, (check) => check.check(o, err));
      !c && err?.extend(null, "Intersectinon", typeof o);
      return c;
    }
  };
  var $$intersect = $constructedBy($Intersection, (o) => o.shape.length > 0);
  var $Union = class extends Schema {
    static _dilutes = true;
    /**
     * @param {Array<Schema<S>>} v
     */
    constructor(v) {
      super();
      this.shape = v;
    }
    /**
     * @param {any} o
     * @param {ValidationError} [err]
     * @return {o is S}
     */
    check(o, err) {
      const c = some(this.shape, (vv) => vv.check(o, err));
      err?.extend(null, "Union", typeof o);
      return c;
    }
  };
  var $union = (...schemas) => schemas.findIndex(($s) => $$union.check($s)) >= 0 ? $union(...schemas.map(($s) => $($s)).map(($s) => $$union.check($s) ? $s.shape : [$s]).flat(1)) : schemas.length === 1 ? schemas[0] : new $Union(schemas);
  var $$union = (
    /** @type {Schema<$Union<any>>} */
    $constructedBy($Union)
  );
  var _t = () => true;
  var $any = $custom(_t);
  var $$any = (
    /** @type {Schema<Schema<any>>} */
    $constructedBy($Custom, (o) => o.shape === _t)
  );
  var $bigint = $custom((o) => typeof o === "bigint");
  var $$bigint = (
    /** @type {Schema<Schema<BigInt>>} */
    $custom((o) => o === $bigint)
  );
  var $symbol = $custom((o) => typeof o === "symbol");
  var $$symbol = (
    /** @type {Schema<Schema<Symbol>>} */
    $custom((o) => o === $symbol)
  );
  var $number = $custom((o) => typeof o === "number");
  var $$number = (
    /** @type {Schema<Schema<number>>} */
    $custom((o) => o === $number)
  );
  var $string = $custom((o) => typeof o === "string");
  var $$string = (
    /** @type {Schema<Schema<string>>} */
    $custom((o) => o === $string)
  );
  var $boolean = $custom((o) => typeof o === "boolean");
  var $$boolean = (
    /** @type {Schema<Schema<Boolean>>} */
    $custom((o) => o === $boolean)
  );
  var $undefined = $literal(void 0);
  var $$undefined = (
    /** @type {Schema<Schema<undefined>>} */
    $constructedBy($Literal, (o) => o.shape.length === 1 && o.shape[0] === void 0)
  );
  var $void = $literal(void 0);
  var $null = $literal(null);
  var $$null = (
    /** @type {Schema<Schema<null>>} */
    $constructedBy($Literal, (o) => o.shape.length === 1 && o.shape[0] === null)
  );
  var $uint8Array = $constructedBy(Uint8Array);
  var $$uint8Array = (
    /** @type {Schema<Schema<Uint8Array>>} */
    $constructedBy($ConstructedBy, (o) => o.shape === Uint8Array)
  );
  var $primitive = $union($number, $string, $null, $undefined, $bigint, $boolean, $symbol);
  var $json = (() => {
    const $jsonArr = (
      /** @type {$Array<$any>} */
      $array($any)
    );
    const $jsonRecord = (
      /** @type {$Record<$string,$any>} */
      $record($string, $any)
    );
    const $json2 = $union($number, $string, $null, $boolean, $jsonArr, $jsonRecord);
    $jsonArr.shape = $json2;
    $jsonRecord.shape.values = $json2;
    return $json2;
  })();
  var $ = (o) => {
    if ($$schema.check(o)) {
      return (
        /** @type {any} */
        o
      );
    } else if ($objectAny.check(o)) {
      const o2 = {};
      for (const k in o) {
        o2[k] = $(o[k]);
      }
      return (
        /** @type {any} */
        $object(o2)
      );
    } else if ($arrayAny.check(o)) {
      return (
        /** @type {any} */
        $union(...o.map($))
      );
    } else if ($primitive.check(o)) {
      return (
        /** @type {any} */
        $literal(o)
      );
    } else if ($function.check(o)) {
      return (
        /** @type {any} */
        $constructedBy(
          /** @type {any} */
          o
        )
      );
    }
    unexpectedCase();
  };
  var assert = production ? () => {
  } : (o, schema2) => {
    const err = new ValidationError();
    if (!schema2.check(o, err)) {
      throw create3(`Expected value to be of type ${schema2.constructor.name}.
${err.toString()}`);
    }
  };
  var PatternMatcher = class {
    /**
     * @param {Schema<State>} [$state]
     */
    constructor($state) {
      this.patterns = [];
      this.$state = $state;
    }
    /**
     * @template P
     * @template R
     * @param {P} pattern
     * @param {(o:NoInfer<Unwrap<ReadSchema<P>>>,s:State)=>R} handler
     * @return {PatternMatcher<State,Patterns|Pattern<Unwrap<ReadSchema<P>>,R>>}
     */
    if(pattern, handler) {
      this.patterns.push({ if: $(pattern), h: handler });
      return this;
    }
    /**
     * @template R
     * @param {(o:any,s:State)=>R} h
     */
    else(h) {
      return this.if($any, h);
    }
    /**
     * @return {State extends undefined
     *   ? <In extends Unwrap<Patterns['if']>>(o:In,state?:undefined)=>PatternMatchResult<Patterns,In>
     *   : <In extends Unwrap<Patterns['if']>>(o:In,state:State)=>PatternMatchResult<Patterns,In>}
     */
    done() {
      return (
        /** @type {any} */
        (o, s) => {
          for (let i = 0; i < this.patterns.length; i++) {
            const p = this.patterns[i];
            if (p.if.check(o)) {
              return p.h(o, s);
            }
          }
          throw create3("Unhandled pattern");
        }
      );
    }
  };
  var match = (state) => new PatternMatcher(
    /** @type {any} */
    state
  );
  var _random = (
    /** @type {any} */
    match(
      /** @type {Schema<prng.PRNG>} */
      $any
    ).if($$number, (_o, gen) => int53(gen, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER)).if($$string, (_o, gen) => word(gen)).if($$boolean, (_o, gen) => bool(gen)).if($$bigint, (_o, gen) => BigInt(int53(gen, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER))).if($$union, (o, gen) => random(gen, oneOf2(gen, o.shape))).if($$object, (o, gen) => {
      const res = {};
      for (const k in o.shape) {
        let prop = o.shape[k];
        if ($$optional.check(prop)) {
          if (bool(gen)) {
            continue;
          }
          prop = prop.shape;
        }
        res[k] = _random(prop, gen);
      }
      return res;
    }).if($$array, (o, gen) => {
      const arr = [];
      const n = int32(gen, 0, 42);
      for (let i = 0; i < n; i++) {
        arr.push(random(gen, o.shape));
      }
      return arr;
    }).if($$literal, (o, gen) => {
      return oneOf2(gen, o.shape);
    }).if($$null, (o, gen) => {
      return null;
    }).if($$lambda, (o, gen) => {
      const res = random(gen, o.res);
      return () => res;
    }).if($$any, (o, gen) => random(gen, oneOf2(gen, [
      $number,
      $string,
      $null,
      $undefined,
      $bigint,
      $boolean,
      $array($number),
      $record($union("a", "b", "c"), $number)
    ]))).if($$record, (o, gen) => {
      const res = {};
      const keysN = int53(gen, 0, 3);
      for (let i = 0; i < keysN; i++) {
        const key = random(gen, o.shape.keys);
        const val = random(gen, o.shape.values);
        res[key] = val;
      }
      return res;
    }).done()
  );
  var random = (gen, schema2) => (
    /** @type {any} */
    _random($(schema2), gen)
  );

  // node_modules/lib0/dom.js
  var doc = (
    /** @type {Document} */
    typeof document !== "undefined" ? document : {}
  );
  var $fragment = $custom((el) => el.nodeType === DOCUMENT_FRAGMENT_NODE);
  var domParser = (
    /** @type {DOMParser} */
    typeof DOMParser !== "undefined" ? new DOMParser() : null
  );
  var $element = $custom((el) => el.nodeType === ELEMENT_NODE);
  var $text = $custom((el) => el.nodeType === TEXT_NODE);
  var mapToStyleString = (m) => map(m, (value, key) => `${key}:${value};`).join("");
  var ELEMENT_NODE = doc.ELEMENT_NODE;
  var TEXT_NODE = doc.TEXT_NODE;
  var CDATA_SECTION_NODE = doc.CDATA_SECTION_NODE;
  var COMMENT_NODE = doc.COMMENT_NODE;
  var DOCUMENT_NODE = doc.DOCUMENT_NODE;
  var DOCUMENT_TYPE_NODE = doc.DOCUMENT_TYPE_NODE;
  var DOCUMENT_FRAGMENT_NODE = doc.DOCUMENT_FRAGMENT_NODE;
  var $node = $custom((el) => el.nodeType === DOCUMENT_NODE);

  // node_modules/lib0/eventloop.js
  var createTimeoutClass = (clearFunction) => class TT {
    /**
     * @param {number} timeoutId
     */
    constructor(timeoutId) {
      this._ = timeoutId;
    }
    destroy() {
      clearFunction(this._);
    }
  };
  var Timeout = createTimeoutClass(clearTimeout);
  var timeout = (timeout2, callback) => new Timeout(setTimeout(callback, timeout2));
  var Interval = createTimeoutClass(clearInterval);
  var Animation = createTimeoutClass((arg) => typeof requestAnimationFrame !== "undefined" && cancelAnimationFrame(arg));
  var Idle = createTimeoutClass((arg) => typeof cancelIdleCallback !== "undefined" && cancelIdleCallback(arg));

  // node_modules/lib0/symbol.js
  var create6 = Symbol;

  // node_modules/lib0/logging.common.js
  var BOLD = create6();
  var UNBOLD = create6();
  var BLUE = create6();
  var GREY = create6();
  var GREEN = create6();
  var RED = create6();
  var PURPLE = create6();
  var ORANGE = create6();
  var UNCOLOR = create6();
  var computeNoColorLoggingArgs = (args2) => {
    if (args2.length === 1 && args2[0]?.constructor === Function) {
      args2 = /** @type {Array<string|Symbol|Object|number>} */
      /** @type {[function]} */
      args2[0]();
    }
    const strBuilder = [];
    const logArgs = [];
    let i = 0;
    for (; i < args2.length; i++) {
      const arg = args2[i];
      if (arg === void 0) {
        break;
      } else if (arg.constructor === String || arg.constructor === Number) {
        strBuilder.push(arg);
      } else if (arg.constructor === Object) {
        break;
      }
    }
    if (i > 0) {
      logArgs.push(strBuilder.join(""));
    }
    for (; i < args2.length; i++) {
      const arg = args2[i];
      if (!(arg instanceof Symbol)) {
        logArgs.push(arg);
      }
    }
    return logArgs;
  };
  var lastLoggingTime = getUnixTime();

  // node_modules/lib0/logging.js
  var _browserStyleMap = {
    [BOLD]: create5("font-weight", "bold"),
    [UNBOLD]: create5("font-weight", "normal"),
    [BLUE]: create5("color", "blue"),
    [GREEN]: create5("color", "green"),
    [GREY]: create5("color", "grey"),
    [RED]: create5("color", "red"),
    [PURPLE]: create5("color", "purple"),
    [ORANGE]: create5("color", "orange"),
    // not well supported in chrome when debugging node with inspector - TODO: deprecate
    [UNCOLOR]: create5("color", "black")
  };
  var computeBrowserLoggingArgs = (args2) => {
    if (args2.length === 1 && args2[0]?.constructor === Function) {
      args2 = /** @type {Array<string|Symbol|Object|number>} */
      /** @type {[function]} */
      args2[0]();
    }
    const strBuilder = [];
    const styles = [];
    const currentStyle = create();
    let logArgs = [];
    let i = 0;
    for (; i < args2.length; i++) {
      const arg = args2[i];
      const style = _browserStyleMap[arg];
      if (style !== void 0) {
        currentStyle.set(style.left, style.right);
      } else {
        if (arg === void 0) {
          break;
        }
        if (arg.constructor === String || arg.constructor === Number) {
          const style2 = mapToStyleString(currentStyle);
          if (i > 0 || style2.length > 0) {
            strBuilder.push("%c" + arg);
            styles.push(style2);
          } else {
            strBuilder.push(arg);
          }
        } else {
          break;
        }
      }
    }
    if (i > 0) {
      logArgs = styles;
      logArgs.unshift(strBuilder.join(""));
    }
    for (; i < args2.length; i++) {
      const arg = args2[i];
      if (!(arg instanceof Symbol)) {
        logArgs.push(arg);
      }
    }
    return logArgs;
  };
  var computeLoggingArgs = supportsColor ? computeBrowserLoggingArgs : computeNoColorLoggingArgs;
  var print = (...args2) => {
    console.log(...computeLoggingArgs(args2));
    vconsoles.forEach((vc) => vc.print(args2));
  };
  var warn = (...args2) => {
    console.warn(...computeLoggingArgs(args2));
    args2.unshift(ORANGE);
    vconsoles.forEach((vc) => vc.print(args2));
  };
  var vconsoles = create2();

  // node_modules/lib0/iterator.js
  var createIterator = (next) => ({
    /**
     * @return {IterableIterator<T>}
     */
    [Symbol.iterator]() {
      return this;
    },
    // @ts-ignore
    next
  });
  var iteratorFilter = (iterator, filter) => createIterator(() => {
    let res;
    do {
      res = iterator.next();
    } while (!res.done && !filter(res.value));
    return res;
  });
  var iteratorMap = (iterator, fmap) => createIterator(() => {
    const { done, value } = iterator.next();
    return { done, value: done ? void 0 : fmap(value) };
  });

  // node_modules/yjs/dist/yjs.mjs
  var AbstractConnector = class extends ObservableV2 {
    /**
     * @param {Doc} ydoc
     * @param {any} awareness
     */
    constructor(ydoc, awareness) {
      super();
      this.doc = ydoc;
      this.awareness = awareness;
    }
  };
  var DeleteItem = class {
    /**
     * @param {number} clock
     * @param {number} len
     */
    constructor(clock, len) {
      this.clock = clock;
      this.len = len;
    }
  };
  var DeleteSet = class {
    constructor() {
      this.clients = /* @__PURE__ */ new Map();
    }
  };
  var iterateDeletedStructs = (transaction, ds, f) => ds.clients.forEach((deletes, clientid) => {
    const structs = (
      /** @type {Array<GC|Item>} */
      transaction.doc.store.clients.get(clientid)
    );
    if (structs != null) {
      const lastStruct = structs[structs.length - 1];
      const clockState = lastStruct.id.clock + lastStruct.length;
      for (let i = 0, del2 = deletes[i]; i < deletes.length && del2.clock < clockState; del2 = deletes[++i]) {
        iterateStructs(transaction, structs, del2.clock, del2.len, f);
      }
    }
  });
  var findIndexDS = (dis, clock) => {
    let left = 0;
    let right = dis.length - 1;
    while (left <= right) {
      const midindex = floor((left + right) / 2);
      const mid = dis[midindex];
      const midclock = mid.clock;
      if (midclock <= clock) {
        if (clock < midclock + mid.len) {
          return midindex;
        }
        left = midindex + 1;
      } else {
        right = midindex - 1;
      }
    }
    return null;
  };
  var isDeleted = (ds, id2) => {
    const dis = ds.clients.get(id2.client);
    return dis !== void 0 && findIndexDS(dis, id2.clock) !== null;
  };
  var sortAndMergeDeleteSet = (ds) => {
    ds.clients.forEach((dels) => {
      dels.sort((a, b) => a.clock - b.clock);
      let i, j;
      for (i = 1, j = 1; i < dels.length; i++) {
        const left = dels[j - 1];
        const right = dels[i];
        if (left.clock + left.len >= right.clock) {
          left.len = max(left.len, right.clock + right.len - left.clock);
        } else {
          if (j < i) {
            dels[j] = right;
          }
          j++;
        }
      }
      dels.length = j;
    });
  };
  var mergeDeleteSets = (dss) => {
    const merged = new DeleteSet();
    for (let dssI = 0; dssI < dss.length; dssI++) {
      dss[dssI].clients.forEach((delsLeft, client) => {
        if (!merged.clients.has(client)) {
          const dels = delsLeft.slice();
          for (let i = dssI + 1; i < dss.length; i++) {
            appendTo(dels, dss[i].clients.get(client) || []);
          }
          merged.clients.set(client, dels);
        }
      });
    }
    sortAndMergeDeleteSet(merged);
    return merged;
  };
  var addToDeleteSet = (ds, client, clock, length2) => {
    setIfUndefined(ds.clients, client, () => (
      /** @type {Array<DeleteItem>} */
      []
    )).push(new DeleteItem(clock, length2));
  };
  var createDeleteSet = () => new DeleteSet();
  var createDeleteSetFromStructStore = (ss) => {
    const ds = createDeleteSet();
    ss.clients.forEach((structs, client) => {
      const dsitems = [];
      for (let i = 0; i < structs.length; i++) {
        const struct = structs[i];
        if (struct.deleted) {
          const clock = struct.id.clock;
          let len = struct.length;
          if (i + 1 < structs.length) {
            for (let next = structs[i + 1]; i + 1 < structs.length && next.deleted; next = structs[++i + 1]) {
              len += next.length;
            }
          }
          dsitems.push(new DeleteItem(clock, len));
        }
      }
      if (dsitems.length > 0) {
        ds.clients.set(client, dsitems);
      }
    });
    return ds;
  };
  var writeDeleteSet = (encoder, ds) => {
    writeVarUint(encoder.restEncoder, ds.clients.size);
    from(ds.clients.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, dsitems]) => {
      encoder.resetDsCurVal();
      writeVarUint(encoder.restEncoder, client);
      const len = dsitems.length;
      writeVarUint(encoder.restEncoder, len);
      for (let i = 0; i < len; i++) {
        const item = dsitems[i];
        encoder.writeDsClock(item.clock);
        encoder.writeDsLen(item.len);
      }
    });
  };
  var readDeleteSet = (decoder) => {
    const ds = new DeleteSet();
    const numClients = readVarUint(decoder.restDecoder);
    for (let i = 0; i < numClients; i++) {
      decoder.resetDsCurVal();
      const client = readVarUint(decoder.restDecoder);
      const numberOfDeletes = readVarUint(decoder.restDecoder);
      if (numberOfDeletes > 0) {
        const dsField = setIfUndefined(ds.clients, client, () => (
          /** @type {Array<DeleteItem>} */
          []
        ));
        for (let i2 = 0; i2 < numberOfDeletes; i2++) {
          dsField.push(new DeleteItem(decoder.readDsClock(), decoder.readDsLen()));
        }
      }
    }
    return ds;
  };
  var readAndApplyDeleteSet = (decoder, transaction, store) => {
    const unappliedDS = new DeleteSet();
    const numClients = readVarUint(decoder.restDecoder);
    for (let i = 0; i < numClients; i++) {
      decoder.resetDsCurVal();
      const client = readVarUint(decoder.restDecoder);
      const numberOfDeletes = readVarUint(decoder.restDecoder);
      const structs = store.clients.get(client) || [];
      const state = getState(store, client);
      for (let i2 = 0; i2 < numberOfDeletes; i2++) {
        const clock = decoder.readDsClock();
        const clockEnd = clock + decoder.readDsLen();
        if (clock < state) {
          if (state < clockEnd) {
            addToDeleteSet(unappliedDS, client, state, clockEnd - state);
          }
          let index = findIndexSS(structs, clock);
          let struct = structs[index];
          if (!struct.deleted && struct.id.clock < clock) {
            structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
            index++;
          }
          while (index < structs.length) {
            struct = structs[index++];
            if (struct.id.clock < clockEnd) {
              if (!struct.deleted) {
                if (clockEnd < struct.id.clock + struct.length) {
                  structs.splice(index, 0, splitItem(transaction, struct, clockEnd - struct.id.clock));
                }
                struct.delete(transaction);
              }
            } else {
              break;
            }
          }
        } else {
          addToDeleteSet(unappliedDS, client, clock, clockEnd - clock);
        }
      }
    }
    if (unappliedDS.clients.size > 0) {
      const ds = new UpdateEncoderV2();
      writeVarUint(ds.restEncoder, 0);
      writeDeleteSet(ds, unappliedDS);
      return ds.toUint8Array();
    }
    return null;
  };
  var equalDeleteSets = (ds1, ds2) => {
    if (ds1.clients.size !== ds2.clients.size) return false;
    for (const [client, deleteItems1] of ds1.clients.entries()) {
      const deleteItems2 = (
        /** @type {Array<import('../internals.js').DeleteItem>} */
        ds2.clients.get(client)
      );
      if (deleteItems2 === void 0 || deleteItems1.length !== deleteItems2.length) return false;
      for (let i = 0; i < deleteItems1.length; i++) {
        const di1 = deleteItems1[i];
        const di2 = deleteItems2[i];
        if (di1.clock !== di2.clock || di1.len !== di2.len) {
          return false;
        }
      }
    }
    return true;
  };
  var generateNewClientId = uint32;
  var Doc = class _Doc extends ObservableV2 {
    /**
     * @param {DocOpts} opts configuration
     */
    constructor({ guid = uuidv4(), collectionid = null, gc = true, gcFilter = () => true, meta = null, autoLoad = false, shouldLoad = true } = {}) {
      super();
      this.gc = gc;
      this.gcFilter = gcFilter;
      this.clientID = generateNewClientId();
      this.guid = guid;
      this.collectionid = collectionid;
      this.share = /* @__PURE__ */ new Map();
      this.store = new StructStore();
      this._transaction = null;
      this._transactionCleanups = [];
      this.subdocs = /* @__PURE__ */ new Set();
      this._item = null;
      this.shouldLoad = shouldLoad;
      this.autoLoad = autoLoad;
      this.meta = meta;
      this.isLoaded = false;
      this.isSynced = false;
      this.isDestroyed = false;
      this.whenLoaded = create4((resolve) => {
        this.on("load", () => {
          this.isLoaded = true;
          resolve(this);
        });
      });
      const provideSyncedPromise = () => create4((resolve) => {
        const eventHandler = (isSynced) => {
          if (isSynced === void 0 || isSynced === true) {
            this.off("sync", eventHandler);
            resolve();
          }
        };
        this.on("sync", eventHandler);
      });
      this.on("sync", (isSynced) => {
        if (isSynced === false && this.isSynced) {
          this.whenSynced = provideSyncedPromise();
        }
        this.isSynced = isSynced === void 0 || isSynced === true;
        if (this.isSynced && !this.isLoaded) {
          this.emit("load", [this]);
        }
      });
      this.whenSynced = provideSyncedPromise();
    }
    /**
     * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
     *
     * `load()` might be used in the future to request any provider to load the most current data.
     *
     * It is safe to call `load()` multiple times.
     */
    load() {
      const item = this._item;
      if (item !== null && !this.shouldLoad) {
        transact(
          /** @type {any} */
          item.parent.doc,
          (transaction) => {
            transaction.subdocsLoaded.add(this);
          },
          null,
          true
        );
      }
      this.shouldLoad = true;
    }
    getSubdocs() {
      return this.subdocs;
    }
    getSubdocGuids() {
      return new Set(from(this.subdocs).map((doc5) => doc5.guid));
    }
    /**
     * Changes that happen inside of a transaction are bundled. This means that
     * the observer fires _after_ the transaction is finished and that all changes
     * that happened inside of the transaction are sent as one message to the
     * other peers.
     *
     * @template T
     * @param {function(Transaction):T} f The function that should be executed as a transaction
     * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
     * @return T
     *
     * @public
     */
    transact(f, origin = null) {
      return transact(this, f, origin);
    }
    /**
     * Define a shared data type.
     *
     * Multiple calls of `ydoc.get(name, TypeConstructor)` yield the same result
     * and do not overwrite each other. I.e.
     * `ydoc.get(name, Y.Array) === ydoc.get(name, Y.Array)`
     *
     * After this method is called, the type is also available on `ydoc.share.get(name)`.
     *
     * *Best Practices:*
     * Define all types right after the Y.Doc instance is created and store them in a separate object.
     * Also use the typed methods `getText(name)`, `getArray(name)`, ..
     *
     * @template {typeof AbstractType<any>} Type
     * @example
     *   const ydoc = new Y.Doc(..)
     *   const appState = {
     *     document: ydoc.getText('document')
     *     comments: ydoc.getArray('comments')
     *   }
     *
     * @param {string} name
     * @param {Type} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
     * @return {InstanceType<Type>} The created type. Constructed with TypeConstructor
     *
     * @public
     */
    get(name, TypeConstructor = (
      /** @type {any} */
      AbstractType
    )) {
      const type = setIfUndefined(this.share, name, () => {
        const t = new TypeConstructor();
        t._integrate(this, null);
        return t;
      });
      const Constr = type.constructor;
      if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
        if (Constr === AbstractType) {
          const t = new TypeConstructor();
          t._map = type._map;
          type._map.forEach(
            /** @param {Item?} n */
            (n) => {
              for (; n !== null; n = n.left) {
                n.parent = t;
              }
            }
          );
          t._start = type._start;
          for (let n = t._start; n !== null; n = n.right) {
            n.parent = t;
          }
          t._length = type._length;
          this.share.set(name, t);
          t._integrate(this, null);
          return (
            /** @type {InstanceType<Type>} */
            t
          );
        } else {
          throw new Error(`Type with the name ${name} has already been defined with a different constructor`);
        }
      }
      return (
        /** @type {InstanceType<Type>} */
        type
      );
    }
    /**
     * @template T
     * @param {string} [name]
     * @return {YArray<T>}
     *
     * @public
     */
    getArray(name = "") {
      return (
        /** @type {YArray<T>} */
        this.get(name, YArray)
      );
    }
    /**
     * @param {string} [name]
     * @return {YText}
     *
     * @public
     */
    getText(name = "") {
      return this.get(name, YText);
    }
    /**
     * @template T
     * @param {string} [name]
     * @return {YMap<T>}
     *
     * @public
     */
    getMap(name = "") {
      return (
        /** @type {YMap<T>} */
        this.get(name, YMap)
      );
    }
    /**
     * @param {string} [name]
     * @return {YXmlElement}
     *
     * @public
     */
    getXmlElement(name = "") {
      return (
        /** @type {YXmlElement<{[key:string]:string}>} */
        this.get(name, YXmlElement)
      );
    }
    /**
     * @param {string} [name]
     * @return {YXmlFragment}
     *
     * @public
     */
    getXmlFragment(name = "") {
      return this.get(name, YXmlFragment);
    }
    /**
     * Converts the entire document into a js object, recursively traversing each yjs type
     * Doesn't log types that have not been defined (using ydoc.getType(..)).
     *
     * @deprecated Do not use this method and rather call toJSON directly on the shared types.
     *
     * @return {Object<string, any>}
     */
    toJSON() {
      const doc5 = {};
      this.share.forEach((value, key) => {
        doc5[key] = value.toJSON();
      });
      return doc5;
    }
    /**
     * Emit `destroy` event and unregister all event handlers.
     */
    destroy() {
      this.isDestroyed = true;
      from(this.subdocs).forEach((subdoc) => subdoc.destroy());
      const item = this._item;
      if (item !== null) {
        this._item = null;
        const content = (
          /** @type {ContentDoc} */
          item.content
        );
        content.doc = new _Doc({ guid: this.guid, ...content.opts, shouldLoad: false });
        content.doc._item = item;
        transact(
          /** @type {any} */
          item.parent.doc,
          (transaction) => {
            const doc5 = content.doc;
            if (!item.deleted) {
              transaction.subdocsAdded.add(doc5);
            }
            transaction.subdocsRemoved.add(this);
          },
          null,
          true
        );
      }
      this.emit("destroyed", [true]);
      this.emit("destroy", [this]);
      super.destroy();
    }
  };
  var DSDecoderV1 = class {
    /**
     * @param {decoding.Decoder} decoder
     */
    constructor(decoder) {
      this.restDecoder = decoder;
    }
    resetDsCurVal() {
    }
    /**
     * @return {number}
     */
    readDsClock() {
      return readVarUint(this.restDecoder);
    }
    /**
     * @return {number}
     */
    readDsLen() {
      return readVarUint(this.restDecoder);
    }
  };
  var UpdateDecoderV1 = class extends DSDecoderV1 {
    /**
     * @return {ID}
     */
    readLeftID() {
      return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
    }
    /**
     * @return {ID}
     */
    readRightID() {
      return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
    }
    /**
     * Read the next client id.
     * Use this in favor of readID whenever possible to reduce the number of objects created.
     */
    readClient() {
      return readVarUint(this.restDecoder);
    }
    /**
     * @return {number} info An unsigned 8-bit integer
     */
    readInfo() {
      return readUint8(this.restDecoder);
    }
    /**
     * @return {string}
     */
    readString() {
      return readVarString(this.restDecoder);
    }
    /**
     * @return {boolean} isKey
     */
    readParentInfo() {
      return readVarUint(this.restDecoder) === 1;
    }
    /**
     * @return {number} info An unsigned 8-bit integer
     */
    readTypeRef() {
      return readVarUint(this.restDecoder);
    }
    /**
     * Write len of a struct - well suited for Opt RLE encoder.
     *
     * @return {number} len
     */
    readLen() {
      return readVarUint(this.restDecoder);
    }
    /**
     * @return {any}
     */
    readAny() {
      return readAny(this.restDecoder);
    }
    /**
     * @return {Uint8Array}
     */
    readBuf() {
      return copyUint8Array(readVarUint8Array(this.restDecoder));
    }
    /**
     * Legacy implementation uses JSON parse. We use any-decoding in v2.
     *
     * @return {any}
     */
    readJSON() {
      return JSON.parse(readVarString(this.restDecoder));
    }
    /**
     * @return {string}
     */
    readKey() {
      return readVarString(this.restDecoder);
    }
  };
  var DSDecoderV2 = class {
    /**
     * @param {decoding.Decoder} decoder
     */
    constructor(decoder) {
      this.dsCurrVal = 0;
      this.restDecoder = decoder;
    }
    resetDsCurVal() {
      this.dsCurrVal = 0;
    }
    /**
     * @return {number}
     */
    readDsClock() {
      this.dsCurrVal += readVarUint(this.restDecoder);
      return this.dsCurrVal;
    }
    /**
     * @return {number}
     */
    readDsLen() {
      const diff = readVarUint(this.restDecoder) + 1;
      this.dsCurrVal += diff;
      return diff;
    }
  };
  var UpdateDecoderV2 = class extends DSDecoderV2 {
    /**
     * @param {decoding.Decoder} decoder
     */
    constructor(decoder) {
      super(decoder);
      this.keys = [];
      readVarUint(decoder);
      this.keyClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
      this.clientDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
      this.leftClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
      this.rightClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
      this.infoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
      this.stringDecoder = new StringDecoder(readVarUint8Array(decoder));
      this.parentInfoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
      this.typeRefDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
      this.lenDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
    }
    /**
     * @return {ID}
     */
    readLeftID() {
      return new ID(this.clientDecoder.read(), this.leftClockDecoder.read());
    }
    /**
     * @return {ID}
     */
    readRightID() {
      return new ID(this.clientDecoder.read(), this.rightClockDecoder.read());
    }
    /**
     * Read the next client id.
     * Use this in favor of readID whenever possible to reduce the number of objects created.
     */
    readClient() {
      return this.clientDecoder.read();
    }
    /**
     * @return {number} info An unsigned 8-bit integer
     */
    readInfo() {
      return (
        /** @type {number} */
        this.infoDecoder.read()
      );
    }
    /**
     * @return {string}
     */
    readString() {
      return this.stringDecoder.read();
    }
    /**
     * @return {boolean}
     */
    readParentInfo() {
      return this.parentInfoDecoder.read() === 1;
    }
    /**
     * @return {number} An unsigned 8-bit integer
     */
    readTypeRef() {
      return this.typeRefDecoder.read();
    }
    /**
     * Write len of a struct - well suited for Opt RLE encoder.
     *
     * @return {number}
     */
    readLen() {
      return this.lenDecoder.read();
    }
    /**
     * @return {any}
     */
    readAny() {
      return readAny(this.restDecoder);
    }
    /**
     * @return {Uint8Array}
     */
    readBuf() {
      return readVarUint8Array(this.restDecoder);
    }
    /**
     * This is mainly here for legacy purposes.
     *
     * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
     *
     * @return {any}
     */
    readJSON() {
      return readAny(this.restDecoder);
    }
    /**
     * @return {string}
     */
    readKey() {
      const keyClock = this.keyClockDecoder.read();
      if (keyClock < this.keys.length) {
        return this.keys[keyClock];
      } else {
        const key = this.stringDecoder.read();
        this.keys.push(key);
        return key;
      }
    }
  };
  var DSEncoderV1 = class {
    constructor() {
      this.restEncoder = createEncoder();
    }
    toUint8Array() {
      return toUint8Array(this.restEncoder);
    }
    resetDsCurVal() {
    }
    /**
     * @param {number} clock
     */
    writeDsClock(clock) {
      writeVarUint(this.restEncoder, clock);
    }
    /**
     * @param {number} len
     */
    writeDsLen(len) {
      writeVarUint(this.restEncoder, len);
    }
  };
  var UpdateEncoderV1 = class extends DSEncoderV1 {
    /**
     * @param {ID} id
     */
    writeLeftID(id2) {
      writeVarUint(this.restEncoder, id2.client);
      writeVarUint(this.restEncoder, id2.clock);
    }
    /**
     * @param {ID} id
     */
    writeRightID(id2) {
      writeVarUint(this.restEncoder, id2.client);
      writeVarUint(this.restEncoder, id2.clock);
    }
    /**
     * Use writeClient and writeClock instead of writeID if possible.
     * @param {number} client
     */
    writeClient(client) {
      writeVarUint(this.restEncoder, client);
    }
    /**
     * @param {number} info An unsigned 8-bit integer
     */
    writeInfo(info) {
      writeUint8(this.restEncoder, info);
    }
    /**
     * @param {string} s
     */
    writeString(s) {
      writeVarString(this.restEncoder, s);
    }
    /**
     * @param {boolean} isYKey
     */
    writeParentInfo(isYKey) {
      writeVarUint(this.restEncoder, isYKey ? 1 : 0);
    }
    /**
     * @param {number} info An unsigned 8-bit integer
     */
    writeTypeRef(info) {
      writeVarUint(this.restEncoder, info);
    }
    /**
     * Write len of a struct - well suited for Opt RLE encoder.
     *
     * @param {number} len
     */
    writeLen(len) {
      writeVarUint(this.restEncoder, len);
    }
    /**
     * @param {any} any
     */
    writeAny(any2) {
      writeAny(this.restEncoder, any2);
    }
    /**
     * @param {Uint8Array} buf
     */
    writeBuf(buf) {
      writeVarUint8Array(this.restEncoder, buf);
    }
    /**
     * @param {any} embed
     */
    writeJSON(embed) {
      writeVarString(this.restEncoder, JSON.stringify(embed));
    }
    /**
     * @param {string} key
     */
    writeKey(key) {
      writeVarString(this.restEncoder, key);
    }
  };
  var DSEncoderV2 = class {
    constructor() {
      this.restEncoder = createEncoder();
      this.dsCurrVal = 0;
    }
    toUint8Array() {
      return toUint8Array(this.restEncoder);
    }
    resetDsCurVal() {
      this.dsCurrVal = 0;
    }
    /**
     * @param {number} clock
     */
    writeDsClock(clock) {
      const diff = clock - this.dsCurrVal;
      this.dsCurrVal = clock;
      writeVarUint(this.restEncoder, diff);
    }
    /**
     * @param {number} len
     */
    writeDsLen(len) {
      if (len === 0) {
        unexpectedCase();
      }
      writeVarUint(this.restEncoder, len - 1);
      this.dsCurrVal += len;
    }
  };
  var UpdateEncoderV2 = class extends DSEncoderV2 {
    constructor() {
      super();
      this.keyMap = /* @__PURE__ */ new Map();
      this.keyClock = 0;
      this.keyClockEncoder = new IntDiffOptRleEncoder();
      this.clientEncoder = new UintOptRleEncoder();
      this.leftClockEncoder = new IntDiffOptRleEncoder();
      this.rightClockEncoder = new IntDiffOptRleEncoder();
      this.infoEncoder = new RleEncoder(writeUint8);
      this.stringEncoder = new StringEncoder();
      this.parentInfoEncoder = new RleEncoder(writeUint8);
      this.typeRefEncoder = new UintOptRleEncoder();
      this.lenEncoder = new UintOptRleEncoder();
    }
    toUint8Array() {
      const encoder = createEncoder();
      writeVarUint(encoder, 0);
      writeVarUint8Array(encoder, this.keyClockEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.clientEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.leftClockEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.rightClockEncoder.toUint8Array());
      writeVarUint8Array(encoder, toUint8Array(this.infoEncoder));
      writeVarUint8Array(encoder, this.stringEncoder.toUint8Array());
      writeVarUint8Array(encoder, toUint8Array(this.parentInfoEncoder));
      writeVarUint8Array(encoder, this.typeRefEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.lenEncoder.toUint8Array());
      writeUint8Array(encoder, toUint8Array(this.restEncoder));
      return toUint8Array(encoder);
    }
    /**
     * @param {ID} id
     */
    writeLeftID(id2) {
      this.clientEncoder.write(id2.client);
      this.leftClockEncoder.write(id2.clock);
    }
    /**
     * @param {ID} id
     */
    writeRightID(id2) {
      this.clientEncoder.write(id2.client);
      this.rightClockEncoder.write(id2.clock);
    }
    /**
     * @param {number} client
     */
    writeClient(client) {
      this.clientEncoder.write(client);
    }
    /**
     * @param {number} info An unsigned 8-bit integer
     */
    writeInfo(info) {
      this.infoEncoder.write(info);
    }
    /**
     * @param {string} s
     */
    writeString(s) {
      this.stringEncoder.write(s);
    }
    /**
     * @param {boolean} isYKey
     */
    writeParentInfo(isYKey) {
      this.parentInfoEncoder.write(isYKey ? 1 : 0);
    }
    /**
     * @param {number} info An unsigned 8-bit integer
     */
    writeTypeRef(info) {
      this.typeRefEncoder.write(info);
    }
    /**
     * Write len of a struct - well suited for Opt RLE encoder.
     *
     * @param {number} len
     */
    writeLen(len) {
      this.lenEncoder.write(len);
    }
    /**
     * @param {any} any
     */
    writeAny(any2) {
      writeAny(this.restEncoder, any2);
    }
    /**
     * @param {Uint8Array} buf
     */
    writeBuf(buf) {
      writeVarUint8Array(this.restEncoder, buf);
    }
    /**
     * This is mainly here for legacy purposes.
     *
     * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
     *
     * @param {any} embed
     */
    writeJSON(embed) {
      writeAny(this.restEncoder, embed);
    }
    /**
     * Property keys are often reused. For example, in y-prosemirror the key `bold` might
     * occur very often. For a 3d application, the key `position` might occur very often.
     *
     * We cache these keys in a Map and refer to them via a unique number.
     *
     * @param {string} key
     */
    writeKey(key) {
      const clock = this.keyMap.get(key);
      if (clock === void 0) {
        this.keyClockEncoder.write(this.keyClock++);
        this.stringEncoder.write(key);
      } else {
        this.keyClockEncoder.write(clock);
      }
    }
  };
  var writeStructs = (encoder, structs, client, clock) => {
    clock = max(clock, structs[0].id.clock);
    const startNewStructs = findIndexSS(structs, clock);
    writeVarUint(encoder.restEncoder, structs.length - startNewStructs);
    encoder.writeClient(client);
    writeVarUint(encoder.restEncoder, clock);
    const firstStruct = structs[startNewStructs];
    firstStruct.write(encoder, clock - firstStruct.id.clock);
    for (let i = startNewStructs + 1; i < structs.length; i++) {
      structs[i].write(encoder, 0);
    }
  };
  var writeClientsStructs = (encoder, store, _sm) => {
    const sm = /* @__PURE__ */ new Map();
    _sm.forEach((clock, client) => {
      if (getState(store, client) > clock) {
        sm.set(client, clock);
      }
    });
    getStateVector(store).forEach((_clock, client) => {
      if (!_sm.has(client)) {
        sm.set(client, 0);
      }
    });
    writeVarUint(encoder.restEncoder, sm.size);
    from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
      writeStructs(
        encoder,
        /** @type {Array<GC|Item>} */
        store.clients.get(client),
        client,
        clock
      );
    });
  };
  var readClientsStructRefs = (decoder, doc5) => {
    const clientRefs = create();
    const numOfStateUpdates = readVarUint(decoder.restDecoder);
    for (let i = 0; i < numOfStateUpdates; i++) {
      const numberOfStructs = readVarUint(decoder.restDecoder);
      const refs = new Array(numberOfStructs);
      const client = decoder.readClient();
      let clock = readVarUint(decoder.restDecoder);
      clientRefs.set(client, { i: 0, refs });
      for (let i2 = 0; i2 < numberOfStructs; i2++) {
        const info = decoder.readInfo();
        switch (BITS5 & info) {
          case 0: {
            const len = decoder.readLen();
            refs[i2] = new GC(createID(client, clock), len);
            clock += len;
            break;
          }
          case 10: {
            const len = readVarUint(decoder.restDecoder);
            refs[i2] = new Skip(createID(client, clock), len);
            clock += len;
            break;
          }
          default: {
            const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
            const struct = new Item(
              createID(client, clock),
              null,
              // left
              (info & BIT8) === BIT8 ? decoder.readLeftID() : null,
              // origin
              null,
              // right
              (info & BIT7) === BIT7 ? decoder.readRightID() : null,
              // right origin
              cantCopyParentInfo ? decoder.readParentInfo() ? doc5.get(decoder.readString()) : decoder.readLeftID() : null,
              // parent
              cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null,
              // parentSub
              readItemContent(decoder, info)
              // item content
            );
            refs[i2] = struct;
            clock += struct.length;
          }
        }
      }
    }
    return clientRefs;
  };
  var integrateStructs = (transaction, store, clientsStructRefs) => {
    const stack = [];
    let clientsStructRefsIds = from(clientsStructRefs.keys()).sort((a, b) => a - b);
    if (clientsStructRefsIds.length === 0) {
      return null;
    }
    const getNextStructTarget = () => {
      if (clientsStructRefsIds.length === 0) {
        return null;
      }
      let nextStructsTarget = (
        /** @type {{i:number,refs:Array<GC|Item>}} */
        clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1])
      );
      while (nextStructsTarget.refs.length === nextStructsTarget.i) {
        clientsStructRefsIds.pop();
        if (clientsStructRefsIds.length > 0) {
          nextStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */
          clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]);
        } else {
          return null;
        }
      }
      return nextStructsTarget;
    };
    let curStructsTarget = getNextStructTarget();
    if (curStructsTarget === null) {
      return null;
    }
    const restStructs = new StructStore();
    const missingSV = /* @__PURE__ */ new Map();
    const updateMissingSv = (client, clock) => {
      const mclock = missingSV.get(client);
      if (mclock == null || mclock > clock) {
        missingSV.set(client, clock);
      }
    };
    let stackHead = (
      /** @type {any} */
      curStructsTarget.refs[
        /** @type {any} */
        curStructsTarget.i++
      ]
    );
    const state = /* @__PURE__ */ new Map();
    const addStackToRestSS = () => {
      for (const item of stack) {
        const client = item.id.client;
        const inapplicableItems = clientsStructRefs.get(client);
        if (inapplicableItems) {
          inapplicableItems.i--;
          restStructs.clients.set(client, inapplicableItems.refs.slice(inapplicableItems.i));
          clientsStructRefs.delete(client);
          inapplicableItems.i = 0;
          inapplicableItems.refs = [];
        } else {
          restStructs.clients.set(client, [item]);
        }
        clientsStructRefsIds = clientsStructRefsIds.filter((c) => c !== client);
      }
      stack.length = 0;
    };
    while (true) {
      if (stackHead.constructor !== Skip) {
        const localClock = setIfUndefined(state, stackHead.id.client, () => getState(store, stackHead.id.client));
        const offset = localClock - stackHead.id.clock;
        if (offset < 0) {
          stack.push(stackHead);
          updateMissingSv(stackHead.id.client, stackHead.id.clock - 1);
          addStackToRestSS();
        } else {
          const missing = stackHead.getMissing(transaction, store);
          if (missing !== null) {
            stack.push(stackHead);
            const structRefs = clientsStructRefs.get(
              /** @type {number} */
              missing
            ) || { refs: [], i: 0 };
            if (structRefs.refs.length === structRefs.i) {
              updateMissingSv(
                /** @type {number} */
                missing,
                getState(store, missing)
              );
              addStackToRestSS();
            } else {
              stackHead = structRefs.refs[structRefs.i++];
              continue;
            }
          } else if (offset === 0 || offset < stackHead.length) {
            stackHead.integrate(transaction, offset);
            state.set(stackHead.id.client, stackHead.id.clock + stackHead.length);
          }
        }
      }
      if (stack.length > 0) {
        stackHead = /** @type {GC|Item} */
        stack.pop();
      } else if (curStructsTarget !== null && curStructsTarget.i < curStructsTarget.refs.length) {
        stackHead = /** @type {GC|Item} */
        curStructsTarget.refs[curStructsTarget.i++];
      } else {
        curStructsTarget = getNextStructTarget();
        if (curStructsTarget === null) {
          break;
        } else {
          stackHead = /** @type {GC|Item} */
          curStructsTarget.refs[curStructsTarget.i++];
        }
      }
    }
    if (restStructs.clients.size > 0) {
      const encoder = new UpdateEncoderV2();
      writeClientsStructs(encoder, restStructs, /* @__PURE__ */ new Map());
      writeVarUint(encoder.restEncoder, 0);
      return { missing: missingSV, update: encoder.toUint8Array() };
    }
    return null;
  };
  var writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);
  var readUpdateV2 = (decoder, ydoc, transactionOrigin, structDecoder = new UpdateDecoderV2(decoder)) => transact(ydoc, (transaction) => {
    transaction.local = false;
    let retry = false;
    const doc5 = transaction.doc;
    const store = doc5.store;
    const ss = readClientsStructRefs(structDecoder, doc5);
    const restStructs = integrateStructs(transaction, store, ss);
    const pending = store.pendingStructs;
    if (pending) {
      for (const [client, clock] of pending.missing) {
        if (clock < getState(store, client)) {
          retry = true;
          break;
        }
      }
      if (restStructs) {
        for (const [client, clock] of restStructs.missing) {
          const mclock = pending.missing.get(client);
          if (mclock == null || mclock > clock) {
            pending.missing.set(client, clock);
          }
        }
        pending.update = mergeUpdatesV2([pending.update, restStructs.update]);
      }
    } else {
      store.pendingStructs = restStructs;
    }
    const dsRest = readAndApplyDeleteSet(structDecoder, transaction, store);
    if (store.pendingDs) {
      const pendingDSUpdate = new UpdateDecoderV2(createDecoder(store.pendingDs));
      readVarUint(pendingDSUpdate.restDecoder);
      const dsRest2 = readAndApplyDeleteSet(pendingDSUpdate, transaction, store);
      if (dsRest && dsRest2) {
        store.pendingDs = mergeUpdatesV2([dsRest, dsRest2]);
      } else {
        store.pendingDs = dsRest || dsRest2;
      }
    } else {
      store.pendingDs = dsRest;
    }
    if (retry) {
      const update = (
        /** @type {{update: Uint8Array}} */
        store.pendingStructs.update
      );
      store.pendingStructs = null;
      applyUpdateV2(transaction.doc, update);
    }
  }, transactionOrigin, false);
  var readUpdate = (decoder, ydoc, transactionOrigin) => readUpdateV2(decoder, ydoc, transactionOrigin, new UpdateDecoderV1(decoder));
  var applyUpdateV2 = (ydoc, update, transactionOrigin, YDecoder = UpdateDecoderV2) => {
    const decoder = createDecoder(update);
    readUpdateV2(decoder, ydoc, transactionOrigin, new YDecoder(decoder));
  };
  var applyUpdate = (ydoc, update, transactionOrigin) => applyUpdateV2(ydoc, update, transactionOrigin, UpdateDecoderV1);
  var writeStateAsUpdate = (encoder, doc5, targetStateVector = /* @__PURE__ */ new Map()) => {
    writeClientsStructs(encoder, doc5.store, targetStateVector);
    writeDeleteSet(encoder, createDeleteSetFromStructStore(doc5.store));
  };
  var encodeStateAsUpdateV2 = (doc5, encodedTargetStateVector = new Uint8Array([0]), encoder = new UpdateEncoderV2()) => {
    const targetStateVector = decodeStateVector(encodedTargetStateVector);
    writeStateAsUpdate(encoder, doc5, targetStateVector);
    const updates = [encoder.toUint8Array()];
    if (doc5.store.pendingDs) {
      updates.push(doc5.store.pendingDs);
    }
    if (doc5.store.pendingStructs) {
      updates.push(diffUpdateV2(doc5.store.pendingStructs.update, encodedTargetStateVector));
    }
    if (updates.length > 1) {
      if (encoder.constructor === UpdateEncoderV1) {
        return mergeUpdates(updates.map((update, i) => i === 0 ? update : convertUpdateFormatV2ToV1(update)));
      } else if (encoder.constructor === UpdateEncoderV2) {
        return mergeUpdatesV2(updates);
      }
    }
    return updates[0];
  };
  var encodeStateAsUpdate = (doc5, encodedTargetStateVector) => encodeStateAsUpdateV2(doc5, encodedTargetStateVector, new UpdateEncoderV1());
  var readStateVector = (decoder) => {
    const ss = /* @__PURE__ */ new Map();
    const ssLength = readVarUint(decoder.restDecoder);
    for (let i = 0; i < ssLength; i++) {
      const client = readVarUint(decoder.restDecoder);
      const clock = readVarUint(decoder.restDecoder);
      ss.set(client, clock);
    }
    return ss;
  };
  var decodeStateVector = (decodedState) => readStateVector(new DSDecoderV1(createDecoder(decodedState)));
  var writeStateVector = (encoder, sv) => {
    writeVarUint(encoder.restEncoder, sv.size);
    from(sv.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
      writeVarUint(encoder.restEncoder, client);
      writeVarUint(encoder.restEncoder, clock);
    });
    return encoder;
  };
  var writeDocumentStateVector = (encoder, doc5) => writeStateVector(encoder, getStateVector(doc5.store));
  var encodeStateVectorV2 = (doc5, encoder = new DSEncoderV2()) => {
    if (doc5 instanceof Map) {
      writeStateVector(encoder, doc5);
    } else {
      writeDocumentStateVector(encoder, doc5);
    }
    return encoder.toUint8Array();
  };
  var encodeStateVector = (doc5) => encodeStateVectorV2(doc5, new DSEncoderV1());
  var EventHandler = class {
    constructor() {
      this.l = [];
    }
  };
  var createEventHandler = () => new EventHandler();
  var addEventHandlerListener = (eventHandler, f) => eventHandler.l.push(f);
  var removeEventHandlerListener = (eventHandler, f) => {
    const l = eventHandler.l;
    const len = l.length;
    eventHandler.l = l.filter((g) => f !== g);
    if (len === eventHandler.l.length) {
      console.error("[yjs] Tried to remove event handler that doesn't exist.");
    }
  };
  var callEventHandlerListeners = (eventHandler, arg0, arg1) => callAll(eventHandler.l, [arg0, arg1]);
  var ID = class {
    /**
     * @param {number} client client id
     * @param {number} clock unique per client id, continuous number
     */
    constructor(client, clock) {
      this.client = client;
      this.clock = clock;
    }
  };
  var compareIDs = (a, b) => a === b || a !== null && b !== null && a.client === b.client && a.clock === b.clock;
  var createID = (client, clock) => new ID(client, clock);
  var writeID = (encoder, id2) => {
    writeVarUint(encoder, id2.client);
    writeVarUint(encoder, id2.clock);
  };
  var readID = (decoder) => createID(readVarUint(decoder), readVarUint(decoder));
  var findRootTypeKey = (type) => {
    for (const [key, value] of type.doc.share.entries()) {
      if (value === type) {
        return key;
      }
    }
    throw unexpectedCase();
  };
  var isParentOf = (parent, child) => {
    while (child !== null) {
      if (child.parent === parent) {
        return true;
      }
      child = /** @type {AbstractType<any>} */
      child.parent._item;
    }
    return false;
  };
  var logType = (type) => {
    const res = [];
    let n = type._start;
    while (n) {
      res.push(n);
      n = n.right;
    }
    console.log("Children: ", res);
    console.log("Children content: ", res.filter((m) => !m.deleted).map((m) => m.content));
  };
  var PermanentUserData = class {
    /**
     * @param {Doc} doc
     * @param {YMap<any>} [storeType]
     */
    constructor(doc5, storeType = doc5.getMap("users")) {
      const dss = /* @__PURE__ */ new Map();
      this.yusers = storeType;
      this.doc = doc5;
      this.clients = /* @__PURE__ */ new Map();
      this.dss = dss;
      const initUser = (user, userDescription) => {
        const ds = user.get("ds");
        const ids = user.get("ids");
        const addClientId = (
          /** @param {number} clientid */
          (clientid) => this.clients.set(clientid, userDescription)
        );
        ds.observe(
          /** @param {YArrayEvent<any>} event */
          (event) => {
            event.changes.added.forEach((item) => {
              item.content.getContent().forEach((encodedDs) => {
                if (encodedDs instanceof Uint8Array) {
                  this.dss.set(userDescription, mergeDeleteSets([this.dss.get(userDescription) || createDeleteSet(), readDeleteSet(new DSDecoderV1(createDecoder(encodedDs)))]));
                }
              });
            });
          }
        );
        this.dss.set(userDescription, mergeDeleteSets(ds.map((encodedDs) => readDeleteSet(new DSDecoderV1(createDecoder(encodedDs))))));
        ids.observe(
          /** @param {YArrayEvent<any>} event */
          (event) => event.changes.added.forEach((item) => item.content.getContent().forEach(addClientId))
        );
        ids.forEach(addClientId);
      };
      storeType.observe((event) => {
        event.keysChanged.forEach(
          (userDescription) => initUser(storeType.get(userDescription), userDescription)
        );
      });
      storeType.forEach(initUser);
    }
    /**
     * @param {Doc} doc
     * @param {number} clientid
     * @param {string} userDescription
     * @param {Object} conf
     * @param {function(Transaction, DeleteSet):boolean} [conf.filter]
     */
    setUserMapping(doc5, clientid, userDescription, { filter = () => true } = {}) {
      const users = this.yusers;
      let user = users.get(userDescription);
      if (!user) {
        user = new YMap();
        user.set("ids", new YArray());
        user.set("ds", new YArray());
        users.set(userDescription, user);
      }
      user.get("ids").push([clientid]);
      users.observe((_event) => {
        setTimeout(() => {
          const userOverwrite = users.get(userDescription);
          if (userOverwrite !== user) {
            user = userOverwrite;
            this.clients.forEach((_userDescription, clientid2) => {
              if (userDescription === _userDescription) {
                user.get("ids").push([clientid2]);
              }
            });
            const encoder = new DSEncoderV1();
            const ds = this.dss.get(userDescription);
            if (ds) {
              writeDeleteSet(encoder, ds);
              user.get("ds").push([encoder.toUint8Array()]);
            }
          }
        }, 0);
      });
      doc5.on(
        "afterTransaction",
        /** @param {Transaction} transaction */
        (transaction) => {
          setTimeout(() => {
            const yds = user.get("ds");
            const ds = transaction.deleteSet;
            if (transaction.local && ds.clients.size > 0 && filter(transaction, ds)) {
              const encoder = new DSEncoderV1();
              writeDeleteSet(encoder, ds);
              yds.push([encoder.toUint8Array()]);
            }
          });
        }
      );
    }
    /**
     * @param {number} clientid
     * @return {any}
     */
    getUserByClientId(clientid) {
      return this.clients.get(clientid) || null;
    }
    /**
     * @param {ID} id
     * @return {string | null}
     */
    getUserByDeletedId(id2) {
      for (const [userDescription, ds] of this.dss.entries()) {
        if (isDeleted(ds, id2)) {
          return userDescription;
        }
      }
      return null;
    }
  };
  var RelativePosition = class {
    /**
     * @param {ID|null} type
     * @param {string|null} tname
     * @param {ID|null} item
     * @param {number} assoc
     */
    constructor(type, tname, item, assoc = 0) {
      this.type = type;
      this.tname = tname;
      this.item = item;
      this.assoc = assoc;
    }
  };
  var relativePositionToJSON = (rpos) => {
    const json = {};
    if (rpos.type) {
      json.type = rpos.type;
    }
    if (rpos.tname) {
      json.tname = rpos.tname;
    }
    if (rpos.item) {
      json.item = rpos.item;
    }
    if (rpos.assoc != null) {
      json.assoc = rpos.assoc;
    }
    return json;
  };
  var createRelativePositionFromJSON = (json) => new RelativePosition(json.type == null ? null : createID(json.type.client, json.type.clock), json.tname ?? null, json.item == null ? null : createID(json.item.client, json.item.clock), json.assoc == null ? 0 : json.assoc);
  var AbsolutePosition = class {
    /**
     * @param {AbstractType<any>} type
     * @param {number} index
     * @param {number} [assoc]
     */
    constructor(type, index, assoc = 0) {
      this.type = type;
      this.index = index;
      this.assoc = assoc;
    }
  };
  var createAbsolutePosition = (type, index, assoc = 0) => new AbsolutePosition(type, index, assoc);
  var createRelativePosition = (type, item, assoc) => {
    let typeid = null;
    let tname = null;
    if (type._item === null) {
      tname = findRootTypeKey(type);
    } else {
      typeid = createID(type._item.id.client, type._item.id.clock);
    }
    return new RelativePosition(typeid, tname, item, assoc);
  };
  var createRelativePositionFromTypeIndex = (type, index, assoc = 0) => {
    let t = type._start;
    if (assoc < 0) {
      if (index === 0) {
        return createRelativePosition(type, null, assoc);
      }
      index--;
    }
    while (t !== null) {
      if (!t.deleted && t.countable) {
        if (t.length > index) {
          return createRelativePosition(type, createID(t.id.client, t.id.clock + index), assoc);
        }
        index -= t.length;
      }
      if (t.right === null && assoc < 0) {
        return createRelativePosition(type, t.lastId, assoc);
      }
      t = t.right;
    }
    return createRelativePosition(type, null, assoc);
  };
  var writeRelativePosition = (encoder, rpos) => {
    const { type, tname, item, assoc } = rpos;
    if (item !== null) {
      writeVarUint(encoder, 0);
      writeID(encoder, item);
    } else if (tname !== null) {
      writeUint8(encoder, 1);
      writeVarString(encoder, tname);
    } else if (type !== null) {
      writeUint8(encoder, 2);
      writeID(encoder, type);
    } else {
      throw unexpectedCase();
    }
    writeVarInt(encoder, assoc);
    return encoder;
  };
  var encodeRelativePosition = (rpos) => {
    const encoder = createEncoder();
    writeRelativePosition(encoder, rpos);
    return toUint8Array(encoder);
  };
  var readRelativePosition = (decoder) => {
    let type = null;
    let tname = null;
    let itemID = null;
    switch (readVarUint(decoder)) {
      case 0:
        itemID = readID(decoder);
        break;
      case 1:
        tname = readVarString(decoder);
        break;
      case 2: {
        type = readID(decoder);
      }
    }
    const assoc = hasContent(decoder) ? readVarInt(decoder) : 0;
    return new RelativePosition(type, tname, itemID, assoc);
  };
  var decodeRelativePosition = (uint8Array) => readRelativePosition(createDecoder(uint8Array));
  var getItemWithOffset = (store, id2) => {
    const item = getItem(store, id2);
    const diff = id2.clock - item.id.clock;
    return {
      item,
      diff
    };
  };
  var createAbsolutePositionFromRelativePosition = (rpos, doc5, followUndoneDeletions = true) => {
    const store = doc5.store;
    const rightID = rpos.item;
    const typeID = rpos.type;
    const tname = rpos.tname;
    const assoc = rpos.assoc;
    let type = null;
    let index = 0;
    if (rightID !== null) {
      if (getState(store, rightID.client) <= rightID.clock) {
        return null;
      }
      const res = followUndoneDeletions ? followRedone(store, rightID) : getItemWithOffset(store, rightID);
      const right = res.item;
      if (!(right instanceof Item)) {
        return null;
      }
      type = /** @type {AbstractType<any>} */
      right.parent;
      if (type._item === null || !type._item.deleted) {
        index = right.deleted || !right.countable ? 0 : res.diff + (assoc >= 0 ? 0 : 1);
        let n = right.left;
        while (n !== null) {
          if (!n.deleted && n.countable) {
            index += n.length;
          }
          n = n.left;
        }
      }
    } else {
      if (tname !== null) {
        type = doc5.get(tname);
      } else if (typeID !== null) {
        if (getState(store, typeID.client) <= typeID.clock) {
          return null;
        }
        const { item } = followUndoneDeletions ? followRedone(store, typeID) : { item: getItem(store, typeID) };
        if (item instanceof Item && item.content instanceof ContentType) {
          type = item.content.type;
        } else {
          return null;
        }
      } else {
        throw unexpectedCase();
      }
      if (assoc >= 0) {
        index = type._length;
      } else {
        index = 0;
      }
    }
    return createAbsolutePosition(type, index, rpos.assoc);
  };
  var compareRelativePositions = (a, b) => a === b || a !== null && b !== null && a.tname === b.tname && compareIDs(a.item, b.item) && compareIDs(a.type, b.type) && a.assoc === b.assoc;
  var Snapshot = class {
    /**
     * @param {DeleteSet} ds
     * @param {Map<number,number>} sv state map
     */
    constructor(ds, sv) {
      this.ds = ds;
      this.sv = sv;
    }
  };
  var equalSnapshots = (snap1, snap2) => {
    const ds1 = snap1.ds.clients;
    const ds2 = snap2.ds.clients;
    const sv1 = snap1.sv;
    const sv2 = snap2.sv;
    if (sv1.size !== sv2.size || ds1.size !== ds2.size) {
      return false;
    }
    for (const [key, value] of sv1.entries()) {
      if (sv2.get(key) !== value) {
        return false;
      }
    }
    for (const [client, dsitems1] of ds1.entries()) {
      const dsitems2 = ds2.get(client) || [];
      if (dsitems1.length !== dsitems2.length) {
        return false;
      }
      for (let i = 0; i < dsitems1.length; i++) {
        const dsitem1 = dsitems1[i];
        const dsitem2 = dsitems2[i];
        if (dsitem1.clock !== dsitem2.clock || dsitem1.len !== dsitem2.len) {
          return false;
        }
      }
    }
    return true;
  };
  var encodeSnapshotV2 = (snapshot2, encoder = new DSEncoderV2()) => {
    writeDeleteSet(encoder, snapshot2.ds);
    writeStateVector(encoder, snapshot2.sv);
    return encoder.toUint8Array();
  };
  var encodeSnapshot = (snapshot2) => encodeSnapshotV2(snapshot2, new DSEncoderV1());
  var decodeSnapshotV2 = (buf, decoder = new DSDecoderV2(createDecoder(buf))) => {
    return new Snapshot(readDeleteSet(decoder), readStateVector(decoder));
  };
  var decodeSnapshot = (buf) => decodeSnapshotV2(buf, new DSDecoderV1(createDecoder(buf)));
  var createSnapshot = (ds, sm) => new Snapshot(ds, sm);
  var emptySnapshot = createSnapshot(createDeleteSet(), /* @__PURE__ */ new Map());
  var snapshot = (doc5) => createSnapshot(createDeleteSetFromStructStore(doc5.store), getStateVector(doc5.store));
  var isVisible = (item, snapshot2) => snapshot2 === void 0 ? !item.deleted : snapshot2.sv.has(item.id.client) && (snapshot2.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot2.ds, item.id);
  var splitSnapshotAffectedStructs = (transaction, snapshot2) => {
    const meta = setIfUndefined(transaction.meta, splitSnapshotAffectedStructs, create2);
    const store = transaction.doc.store;
    if (!meta.has(snapshot2)) {
      snapshot2.sv.forEach((clock, client) => {
        if (clock < getState(store, client)) {
          getItemCleanStart(transaction, createID(client, clock));
        }
      });
      iterateDeletedStructs(transaction, snapshot2.ds, (_item) => {
      });
      meta.add(snapshot2);
    }
  };
  var createDocFromSnapshot = (originDoc, snapshot2, newDoc = new Doc()) => {
    if (originDoc.gc) {
      throw new Error("Garbage-collection must be disabled in `originDoc`!");
    }
    const { sv, ds } = snapshot2;
    const encoder = new UpdateEncoderV2();
    originDoc.transact((transaction) => {
      let size2 = 0;
      sv.forEach((clock) => {
        if (clock > 0) {
          size2++;
        }
      });
      writeVarUint(encoder.restEncoder, size2);
      for (const [client, clock] of sv) {
        if (clock === 0) {
          continue;
        }
        if (clock < getState(originDoc.store, client)) {
          getItemCleanStart(transaction, createID(client, clock));
        }
        const structs = originDoc.store.clients.get(client) || [];
        const lastStructIndex = findIndexSS(structs, clock - 1);
        writeVarUint(encoder.restEncoder, lastStructIndex + 1);
        encoder.writeClient(client);
        writeVarUint(encoder.restEncoder, 0);
        for (let i = 0; i <= lastStructIndex; i++) {
          structs[i].write(encoder, 0);
        }
      }
      writeDeleteSet(encoder, ds);
    });
    applyUpdateV2(newDoc, encoder.toUint8Array(), "snapshot");
    return newDoc;
  };
  var snapshotContainsUpdateV2 = (snapshot2, update, YDecoder = UpdateDecoderV2) => {
    const updateDecoder = new YDecoder(createDecoder(update));
    const lazyDecoder = new LazyStructReader(updateDecoder, false);
    for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
      if ((snapshot2.sv.get(curr.id.client) || 0) < curr.id.clock + curr.length) {
        return false;
      }
    }
    const mergedDS = mergeDeleteSets([snapshot2.ds, readDeleteSet(updateDecoder)]);
    return equalDeleteSets(snapshot2.ds, mergedDS);
  };
  var snapshotContainsUpdate = (snapshot2, update) => snapshotContainsUpdateV2(snapshot2, update, UpdateDecoderV1);
  var StructStore = class {
    constructor() {
      this.clients = /* @__PURE__ */ new Map();
      this.pendingStructs = null;
      this.pendingDs = null;
    }
  };
  var getStateVector = (store) => {
    const sm = /* @__PURE__ */ new Map();
    store.clients.forEach((structs, client) => {
      const struct = structs[structs.length - 1];
      sm.set(client, struct.id.clock + struct.length);
    });
    return sm;
  };
  var getState = (store, client) => {
    const structs = store.clients.get(client);
    if (structs === void 0) {
      return 0;
    }
    const lastStruct = structs[structs.length - 1];
    return lastStruct.id.clock + lastStruct.length;
  };
  var addStruct = (store, struct) => {
    let structs = store.clients.get(struct.id.client);
    if (structs === void 0) {
      structs = [];
      store.clients.set(struct.id.client, structs);
    } else {
      const lastStruct = structs[structs.length - 1];
      if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
        throw unexpectedCase();
      }
    }
    structs.push(struct);
  };
  var findIndexSS = (structs, clock) => {
    let left = 0;
    let right = structs.length - 1;
    let mid = structs[right];
    let midclock = mid.id.clock;
    if (midclock === clock) {
      return right;
    }
    let midindex = floor(clock / (midclock + mid.length - 1) * right);
    while (left <= right) {
      mid = structs[midindex];
      midclock = mid.id.clock;
      if (midclock <= clock) {
        if (clock < midclock + mid.length) {
          return midindex;
        }
        left = midindex + 1;
      } else {
        right = midindex - 1;
      }
      midindex = floor((left + right) / 2);
    }
    throw unexpectedCase();
  };
  var find = (store, id2) => {
    const structs = store.clients.get(id2.client);
    return structs[findIndexSS(structs, id2.clock)];
  };
  var getItem = (
    /** @type {function(StructStore,ID):Item} */
    find
  );
  var findIndexCleanStart = (transaction, structs, clock) => {
    const index = findIndexSS(structs, clock);
    const struct = structs[index];
    if (struct.id.clock < clock && struct instanceof Item) {
      structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
      return index + 1;
    }
    return index;
  };
  var getItemCleanStart = (transaction, id2) => {
    const structs = (
      /** @type {Array<Item>} */
      transaction.doc.store.clients.get(id2.client)
    );
    return structs[findIndexCleanStart(transaction, structs, id2.clock)];
  };
  var getItemCleanEnd = (transaction, store, id2) => {
    const structs = store.clients.get(id2.client);
    const index = findIndexSS(structs, id2.clock);
    const struct = structs[index];
    if (id2.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
      structs.splice(index + 1, 0, splitItem(transaction, struct, id2.clock - struct.id.clock + 1));
    }
    return struct;
  };
  var replaceStruct = (store, struct, newStruct) => {
    const structs = (
      /** @type {Array<GC|Item>} */
      store.clients.get(struct.id.client)
    );
    structs[findIndexSS(structs, struct.id.clock)] = newStruct;
  };
  var iterateStructs = (transaction, structs, clockStart, len, f) => {
    if (len === 0) {
      return;
    }
    const clockEnd = clockStart + len;
    let index = findIndexCleanStart(transaction, structs, clockStart);
    let struct;
    do {
      struct = structs[index++];
      if (clockEnd < struct.id.clock + struct.length) {
        findIndexCleanStart(transaction, structs, clockEnd);
      }
      f(struct);
    } while (index < structs.length && structs[index].id.clock < clockEnd);
  };
  var Transaction = class {
    /**
     * @param {Doc} doc
     * @param {any} origin
     * @param {boolean} local
     */
    constructor(doc5, origin, local) {
      this.doc = doc5;
      this.deleteSet = new DeleteSet();
      this.beforeState = getStateVector(doc5.store);
      this.afterState = /* @__PURE__ */ new Map();
      this.changed = /* @__PURE__ */ new Map();
      this.changedParentTypes = /* @__PURE__ */ new Map();
      this._mergeStructs = [];
      this.origin = origin;
      this.meta = /* @__PURE__ */ new Map();
      this.local = local;
      this.subdocsAdded = /* @__PURE__ */ new Set();
      this.subdocsRemoved = /* @__PURE__ */ new Set();
      this.subdocsLoaded = /* @__PURE__ */ new Set();
      this._needFormattingCleanup = false;
    }
  };
  var writeUpdateMessageFromTransaction = (encoder, transaction) => {
    if (transaction.deleteSet.clients.size === 0 && !any(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
      return false;
    }
    sortAndMergeDeleteSet(transaction.deleteSet);
    writeStructsFromTransaction(encoder, transaction);
    writeDeleteSet(encoder, transaction.deleteSet);
    return true;
  };
  var addChangedTypeToTransaction = (transaction, type, parentSub) => {
    const item = type._item;
    if (item === null || item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted) {
      setIfUndefined(transaction.changed, type, create2).add(parentSub);
    }
  };
  var tryToMergeWithLefts = (structs, pos) => {
    let right = structs[pos];
    let left = structs[pos - 1];
    let i = pos;
    for (; i > 0; right = left, left = structs[--i - 1]) {
      if (left.deleted === right.deleted && left.constructor === right.constructor) {
        if (left.mergeWith(right)) {
          if (right instanceof Item && right.parentSub !== null && /** @type {AbstractType<any>} */
          right.parent._map.get(right.parentSub) === right) {
            right.parent._map.set(
              right.parentSub,
              /** @type {Item} */
              left
            );
          }
          continue;
        }
      }
      break;
    }
    const merged = pos - i;
    if (merged) {
      structs.splice(pos + 1 - merged, merged);
    }
    return merged;
  };
  var tryGcDeleteSet = (ds, store, gcFilter) => {
    for (const [client, deleteItems] of ds.clients.entries()) {
      const structs = (
        /** @type {Array<GC|Item>} */
        store.clients.get(client)
      );
      for (let di = deleteItems.length - 1; di >= 0; di--) {
        const deleteItem = deleteItems[di];
        const endDeleteItemClock = deleteItem.clock + deleteItem.len;
        for (let si = findIndexSS(structs, deleteItem.clock), struct = structs[si]; si < structs.length && struct.id.clock < endDeleteItemClock; struct = structs[++si]) {
          const struct2 = structs[si];
          if (deleteItem.clock + deleteItem.len <= struct2.id.clock) {
            break;
          }
          if (struct2 instanceof Item && struct2.deleted && !struct2.keep && gcFilter(struct2)) {
            struct2.gc(store, false);
          }
        }
      }
    }
  };
  var tryMergeDeleteSet = (ds, store) => {
    ds.clients.forEach((deleteItems, client) => {
      const structs = (
        /** @type {Array<GC|Item>} */
        store.clients.get(client)
      );
      for (let di = deleteItems.length - 1; di >= 0; di--) {
        const deleteItem = deleteItems[di];
        const mostRightIndexToCheck = min(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
        for (let si = mostRightIndexToCheck, struct = structs[si]; si > 0 && struct.id.clock >= deleteItem.clock; struct = structs[si]) {
          si -= 1 + tryToMergeWithLefts(structs, si);
        }
      }
    });
  };
  var tryGc = (ds, store, gcFilter) => {
    tryGcDeleteSet(ds, store, gcFilter);
    tryMergeDeleteSet(ds, store);
  };
  var cleanupTransactions = (transactionCleanups, i) => {
    if (i < transactionCleanups.length) {
      const transaction = transactionCleanups[i];
      const doc5 = transaction.doc;
      const store = doc5.store;
      const ds = transaction.deleteSet;
      const mergeStructs = transaction._mergeStructs;
      try {
        sortAndMergeDeleteSet(ds);
        transaction.afterState = getStateVector(transaction.doc.store);
        doc5.emit("beforeObserverCalls", [transaction, doc5]);
        const fs = [];
        transaction.changed.forEach(
          (subs, itemtype) => fs.push(() => {
            if (itemtype._item === null || !itemtype._item.deleted) {
              itemtype._callObserver(transaction, subs);
            }
          })
        );
        fs.push(() => {
          transaction.changedParentTypes.forEach((events, type) => {
            if (type._dEH.l.length > 0 && (type._item === null || !type._item.deleted)) {
              events = events.filter(
                (event) => event.target._item === null || !event.target._item.deleted
              );
              events.forEach((event) => {
                event.currentTarget = type;
                event._path = null;
              });
              events.sort((event1, event2) => event1.path.length - event2.path.length);
              callEventHandlerListeners(type._dEH, events, transaction);
            }
          });
        });
        fs.push(() => doc5.emit("afterTransaction", [transaction, doc5]));
        callAll(fs, []);
        if (transaction._needFormattingCleanup) {
          cleanupYTextAfterTransaction(transaction);
        }
      } finally {
        if (doc5.gc) {
          tryGcDeleteSet(ds, store, doc5.gcFilter);
        }
        tryMergeDeleteSet(ds, store);
        transaction.afterState.forEach((clock, client) => {
          const beforeClock = transaction.beforeState.get(client) || 0;
          if (beforeClock !== clock) {
            const structs = (
              /** @type {Array<GC|Item>} */
              store.clients.get(client)
            );
            const firstChangePos = max(findIndexSS(structs, beforeClock), 1);
            for (let i2 = structs.length - 1; i2 >= firstChangePos; ) {
              i2 -= 1 + tryToMergeWithLefts(structs, i2);
            }
          }
        });
        for (let i2 = mergeStructs.length - 1; i2 >= 0; i2--) {
          const { client, clock } = mergeStructs[i2].id;
          const structs = (
            /** @type {Array<GC|Item>} */
            store.clients.get(client)
          );
          const replacedStructPos = findIndexSS(structs, clock);
          if (replacedStructPos + 1 < structs.length) {
            if (tryToMergeWithLefts(structs, replacedStructPos + 1) > 1) {
              continue;
            }
          }
          if (replacedStructPos > 0) {
            tryToMergeWithLefts(structs, replacedStructPos);
          }
        }
        if (!transaction.local && transaction.afterState.get(doc5.clientID) !== transaction.beforeState.get(doc5.clientID)) {
          print(ORANGE, BOLD, "[yjs] ", UNBOLD, RED, "Changed the client-id because another client seems to be using it.");
          doc5.clientID = generateNewClientId();
        }
        doc5.emit("afterTransactionCleanup", [transaction, doc5]);
        if (doc5._observers.has("update")) {
          const encoder = new UpdateEncoderV1();
          const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
          if (hasContent2) {
            doc5.emit("update", [encoder.toUint8Array(), transaction.origin, doc5, transaction]);
          }
        }
        if (doc5._observers.has("updateV2")) {
          const encoder = new UpdateEncoderV2();
          const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
          if (hasContent2) {
            doc5.emit("updateV2", [encoder.toUint8Array(), transaction.origin, doc5, transaction]);
          }
        }
        const { subdocsAdded, subdocsLoaded, subdocsRemoved } = transaction;
        if (subdocsAdded.size > 0 || subdocsRemoved.size > 0 || subdocsLoaded.size > 0) {
          subdocsAdded.forEach((subdoc) => {
            subdoc.clientID = doc5.clientID;
            if (subdoc.collectionid == null) {
              subdoc.collectionid = doc5.collectionid;
            }
            doc5.subdocs.add(subdoc);
          });
          subdocsRemoved.forEach((subdoc) => doc5.subdocs.delete(subdoc));
          doc5.emit("subdocs", [{ loaded: subdocsLoaded, added: subdocsAdded, removed: subdocsRemoved }, doc5, transaction]);
          subdocsRemoved.forEach((subdoc) => subdoc.destroy());
        }
        if (transactionCleanups.length <= i + 1) {
          doc5._transactionCleanups = [];
          doc5.emit("afterAllTransactions", [doc5, transactionCleanups]);
        } else {
          cleanupTransactions(transactionCleanups, i + 1);
        }
      }
    }
  };
  var transact = (doc5, f, origin = null, local = true) => {
    const transactionCleanups = doc5._transactionCleanups;
    let initialCall = false;
    let result = null;
    if (doc5._transaction === null) {
      initialCall = true;
      doc5._transaction = new Transaction(doc5, origin, local);
      transactionCleanups.push(doc5._transaction);
      if (transactionCleanups.length === 1) {
        doc5.emit("beforeAllTransactions", [doc5]);
      }
      doc5.emit("beforeTransaction", [doc5._transaction, doc5]);
    }
    try {
      result = f(doc5._transaction);
    } finally {
      if (initialCall) {
        const finishCleanup = doc5._transaction === transactionCleanups[0];
        doc5._transaction = null;
        if (finishCleanup) {
          cleanupTransactions(transactionCleanups, 0);
        }
      }
    }
    return result;
  };
  var StackItem = class {
    /**
     * @param {DeleteSet} deletions
     * @param {DeleteSet} insertions
     */
    constructor(deletions, insertions) {
      this.insertions = insertions;
      this.deletions = deletions;
      this.meta = /* @__PURE__ */ new Map();
    }
  };
  var clearUndoManagerStackItem = (tr, um, stackItem) => {
    iterateDeletedStructs(tr, stackItem.deletions, (item) => {
      if (item instanceof Item && um.scope.some((type) => type === tr.doc || isParentOf(
        /** @type {AbstractType<any>} */
        type,
        item
      ))) {
        keepItem(item, false);
      }
    });
  };
  var popStackItem = (undoManager, stack, eventType) => {
    let _tr = null;
    const doc5 = undoManager.doc;
    const scope = undoManager.scope;
    transact(doc5, (transaction) => {
      while (stack.length > 0 && undoManager.currStackItem === null) {
        const store = doc5.store;
        const stackItem = (
          /** @type {StackItem} */
          stack.pop()
        );
        const itemsToRedo = /* @__PURE__ */ new Set();
        const itemsToDelete = [];
        let performedChange = false;
        iterateDeletedStructs(transaction, stackItem.insertions, (struct) => {
          if (struct instanceof Item) {
            if (struct.redone !== null) {
              let { item, diff } = followRedone(store, struct.id);
              if (diff > 0) {
                item = getItemCleanStart(transaction, createID(item.id.client, item.id.clock + diff));
              }
              struct = item;
            }
            if (!struct.deleted && scope.some((type) => type === transaction.doc || isParentOf(
              /** @type {AbstractType<any>} */
              type,
              /** @type {Item} */
              struct
            ))) {
              itemsToDelete.push(struct);
            }
          }
        });
        iterateDeletedStructs(transaction, stackItem.deletions, (struct) => {
          if (struct instanceof Item && scope.some((type) => type === transaction.doc || isParentOf(
            /** @type {AbstractType<any>} */
            type,
            struct
          )) && // Never redo structs in stackItem.insertions because they were created and deleted in the same capture interval.
          !isDeleted(stackItem.insertions, struct.id)) {
            itemsToRedo.add(struct);
          }
        });
        itemsToRedo.forEach((struct) => {
          performedChange = redoItem(transaction, struct, itemsToRedo, stackItem.insertions, undoManager.ignoreRemoteMapChanges, undoManager) !== null || performedChange;
        });
        for (let i = itemsToDelete.length - 1; i >= 0; i--) {
          const item = itemsToDelete[i];
          if (undoManager.deleteFilter(item)) {
            item.delete(transaction);
            performedChange = true;
          }
        }
        undoManager.currStackItem = performedChange ? stackItem : null;
      }
      transaction.changed.forEach((subProps, type) => {
        if (subProps.has(null) && type._searchMarker) {
          type._searchMarker.length = 0;
        }
      });
      _tr = transaction;
    }, undoManager);
    const res = undoManager.currStackItem;
    if (res != null) {
      const changedParentTypes = _tr.changedParentTypes;
      undoManager.emit("stack-item-popped", [{ stackItem: res, type: eventType, changedParentTypes, origin: undoManager }, undoManager]);
      undoManager.currStackItem = null;
    }
    return res;
  };
  var UndoManager = class extends ObservableV2 {
    /**
     * @param {Doc|AbstractType<any>|Array<AbstractType<any>>} typeScope Limits the scope of the UndoManager. If this is set to a ydoc instance, all changes on that ydoc will be undone. If set to a specific type, only changes on that type or its children will be undone. Also accepts an array of types.
     * @param {UndoManagerOptions} options
     */
    constructor(typeScope, {
      captureTimeout = 500,
      captureTransaction = (_tr) => true,
      deleteFilter = () => true,
      trackedOrigins = /* @__PURE__ */ new Set([null]),
      ignoreRemoteMapChanges = false,
      doc: doc5 = (
        /** @type {Doc} */
        isArray(typeScope) ? typeScope[0].doc : typeScope instanceof Doc ? typeScope : typeScope.doc
      )
    } = {}) {
      super();
      this.scope = [];
      this.doc = doc5;
      this.addToScope(typeScope);
      this.deleteFilter = deleteFilter;
      trackedOrigins.add(this);
      this.trackedOrigins = trackedOrigins;
      this.captureTransaction = captureTransaction;
      this.undoStack = [];
      this.redoStack = [];
      this.undoing = false;
      this.redoing = false;
      this.currStackItem = null;
      this.lastChange = 0;
      this.ignoreRemoteMapChanges = ignoreRemoteMapChanges;
      this.captureTimeout = captureTimeout;
      this.afterTransactionHandler = (transaction) => {
        if (!this.captureTransaction(transaction) || !this.scope.some((type) => transaction.changedParentTypes.has(
          /** @type {AbstractType<any>} */
          type
        ) || type === this.doc) || !this.trackedOrigins.has(transaction.origin) && (!transaction.origin || !this.trackedOrigins.has(transaction.origin.constructor))) {
          return;
        }
        const undoing = this.undoing;
        const redoing = this.redoing;
        const stack = undoing ? this.redoStack : this.undoStack;
        if (undoing) {
          this.stopCapturing();
        } else if (!redoing) {
          this.clear(false, true);
        }
        const insertions = new DeleteSet();
        transaction.afterState.forEach((endClock, client) => {
          const startClock = transaction.beforeState.get(client) || 0;
          const len = endClock - startClock;
          if (len > 0) {
            addToDeleteSet(insertions, client, startClock, len);
          }
        });
        const now = getUnixTime();
        let didAdd = false;
        if (this.lastChange > 0 && now - this.lastChange < this.captureTimeout && stack.length > 0 && !undoing && !redoing) {
          const lastOp = stack[stack.length - 1];
          lastOp.deletions = mergeDeleteSets([lastOp.deletions, transaction.deleteSet]);
          lastOp.insertions = mergeDeleteSets([lastOp.insertions, insertions]);
        } else {
          stack.push(new StackItem(transaction.deleteSet, insertions));
          didAdd = true;
        }
        if (!undoing && !redoing) {
          this.lastChange = now;
        }
        iterateDeletedStructs(
          transaction,
          transaction.deleteSet,
          /** @param {Item|GC} item */
          (item) => {
            if (item instanceof Item && this.scope.some((type) => type === transaction.doc || isParentOf(
              /** @type {AbstractType<any>} */
              type,
              item
            ))) {
              keepItem(item, true);
            }
          }
        );
        const changeEvent = [{ stackItem: stack[stack.length - 1], origin: transaction.origin, type: undoing ? "redo" : "undo", changedParentTypes: transaction.changedParentTypes }, this];
        if (didAdd) {
          this.emit("stack-item-added", changeEvent);
        } else {
          this.emit("stack-item-updated", changeEvent);
        }
      };
      this.doc.on("afterTransaction", this.afterTransactionHandler);
      this.doc.on("destroy", () => {
        this.destroy();
      });
    }
    /**
     * Extend the scope.
     *
     * @param {Array<AbstractType<any> | Doc> | AbstractType<any> | Doc} ytypes
     */
    addToScope(ytypes) {
      const tmpSet = new Set(this.scope);
      ytypes = isArray(ytypes) ? ytypes : [ytypes];
      ytypes.forEach((ytype) => {
        if (!tmpSet.has(ytype)) {
          tmpSet.add(ytype);
          if (ytype instanceof AbstractType ? ytype.doc !== this.doc : ytype !== this.doc) warn("[yjs#509] Not same Y.Doc");
          this.scope.push(ytype);
        }
      });
    }
    /**
     * @param {any} origin
     */
    addTrackedOrigin(origin) {
      this.trackedOrigins.add(origin);
    }
    /**
     * @param {any} origin
     */
    removeTrackedOrigin(origin) {
      this.trackedOrigins.delete(origin);
    }
    clear(clearUndoStack = true, clearRedoStack = true) {
      if (clearUndoStack && this.canUndo() || clearRedoStack && this.canRedo()) {
        this.doc.transact((tr) => {
          if (clearUndoStack) {
            this.undoStack.forEach((item) => clearUndoManagerStackItem(tr, this, item));
            this.undoStack = [];
          }
          if (clearRedoStack) {
            this.redoStack.forEach((item) => clearUndoManagerStackItem(tr, this, item));
            this.redoStack = [];
          }
          this.emit("stack-cleared", [{ undoStackCleared: clearUndoStack, redoStackCleared: clearRedoStack }]);
        });
      }
    }
    /**
     * UndoManager merges Undo-StackItem if they are created within time-gap
     * smaller than `options.captureTimeout`. Call `um.stopCapturing()` so that the next
     * StackItem won't be merged.
     *
     *
     * @example
     *     // without stopCapturing
     *     ytext.insert(0, 'a')
     *     ytext.insert(1, 'b')
     *     um.undo()
     *     ytext.toString() // => '' (note that 'ab' was removed)
     *     // with stopCapturing
     *     ytext.insert(0, 'a')
     *     um.stopCapturing()
     *     ytext.insert(0, 'b')
     *     um.undo()
     *     ytext.toString() // => 'a' (note that only 'b' was removed)
     *
     */
    stopCapturing() {
      this.lastChange = 0;
    }
    /**
     * Undo last changes on type.
     *
     * @return {StackItem?} Returns StackItem if a change was applied
     */
    undo() {
      this.undoing = true;
      let res;
      try {
        res = popStackItem(this, this.undoStack, "undo");
      } finally {
        this.undoing = false;
      }
      return res;
    }
    /**
     * Redo last undo operation.
     *
     * @return {StackItem?} Returns StackItem if a change was applied
     */
    redo() {
      this.redoing = true;
      let res;
      try {
        res = popStackItem(this, this.redoStack, "redo");
      } finally {
        this.redoing = false;
      }
      return res;
    }
    /**
     * Are undo steps available?
     *
     * @return {boolean} `true` if undo is possible
     */
    canUndo() {
      return this.undoStack.length > 0;
    }
    /**
     * Are redo steps available?
     *
     * @return {boolean} `true` if redo is possible
     */
    canRedo() {
      return this.redoStack.length > 0;
    }
    destroy() {
      this.trackedOrigins.delete(this);
      this.doc.off("afterTransaction", this.afterTransactionHandler);
      super.destroy();
    }
  };
  function* lazyStructReaderGenerator(decoder) {
    const numOfStateUpdates = readVarUint(decoder.restDecoder);
    for (let i = 0; i < numOfStateUpdates; i++) {
      const numberOfStructs = readVarUint(decoder.restDecoder);
      const client = decoder.readClient();
      let clock = readVarUint(decoder.restDecoder);
      for (let i2 = 0; i2 < numberOfStructs; i2++) {
        const info = decoder.readInfo();
        if (info === 10) {
          const len = readVarUint(decoder.restDecoder);
          yield new Skip(createID(client, clock), len);
          clock += len;
        } else if ((BITS5 & info) !== 0) {
          const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
          const struct = new Item(
            createID(client, clock),
            null,
            // left
            (info & BIT8) === BIT8 ? decoder.readLeftID() : null,
            // origin
            null,
            // right
            (info & BIT7) === BIT7 ? decoder.readRightID() : null,
            // right origin
            // @ts-ignore Force writing a string here.
            cantCopyParentInfo ? decoder.readParentInfo() ? decoder.readString() : decoder.readLeftID() : null,
            // parent
            cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null,
            // parentSub
            readItemContent(decoder, info)
            // item content
          );
          yield struct;
          clock += struct.length;
        } else {
          const len = decoder.readLen();
          yield new GC(createID(client, clock), len);
          clock += len;
        }
      }
    }
  }
  var LazyStructReader = class {
    /**
     * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
     * @param {boolean} filterSkips
     */
    constructor(decoder, filterSkips) {
      this.gen = lazyStructReaderGenerator(decoder);
      this.curr = null;
      this.done = false;
      this.filterSkips = filterSkips;
      this.next();
    }
    /**
     * @return {Item | GC | Skip |null}
     */
    next() {
      do {
        this.curr = this.gen.next().value || null;
      } while (this.filterSkips && this.curr !== null && this.curr.constructor === Skip);
      return this.curr;
    }
  };
  var logUpdate = (update) => logUpdateV2(update, UpdateDecoderV1);
  var logUpdateV2 = (update, YDecoder = UpdateDecoderV2) => {
    const structs = [];
    const updateDecoder = new YDecoder(createDecoder(update));
    const lazyDecoder = new LazyStructReader(updateDecoder, false);
    for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
      structs.push(curr);
    }
    print("Structs: ", structs);
    const ds = readDeleteSet(updateDecoder);
    print("DeleteSet: ", ds);
  };
  var decodeUpdate = (update) => decodeUpdateV2(update, UpdateDecoderV1);
  var decodeUpdateV2 = (update, YDecoder = UpdateDecoderV2) => {
    const structs = [];
    const updateDecoder = new YDecoder(createDecoder(update));
    const lazyDecoder = new LazyStructReader(updateDecoder, false);
    for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
      structs.push(curr);
    }
    return {
      structs,
      ds: readDeleteSet(updateDecoder)
    };
  };
  var LazyStructWriter = class {
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     */
    constructor(encoder) {
      this.currClient = 0;
      this.startClock = 0;
      this.written = 0;
      this.encoder = encoder;
      this.clientStructs = [];
    }
  };
  var mergeUpdates = (updates) => mergeUpdatesV2(updates, UpdateDecoderV1, UpdateEncoderV1);
  var encodeStateVectorFromUpdateV2 = (update, YEncoder = DSEncoderV2, YDecoder = UpdateDecoderV2) => {
    const encoder = new YEncoder();
    const updateDecoder = new LazyStructReader(new YDecoder(createDecoder(update)), false);
    let curr = updateDecoder.curr;
    if (curr !== null) {
      let size2 = 0;
      let currClient = curr.id.client;
      let stopCounting = curr.id.clock !== 0;
      let currClock = stopCounting ? 0 : curr.id.clock + curr.length;
      for (; curr !== null; curr = updateDecoder.next()) {
        if (currClient !== curr.id.client) {
          if (currClock !== 0) {
            size2++;
            writeVarUint(encoder.restEncoder, currClient);
            writeVarUint(encoder.restEncoder, currClock);
          }
          currClient = curr.id.client;
          currClock = 0;
          stopCounting = curr.id.clock !== 0;
        }
        if (curr.constructor === Skip) {
          stopCounting = true;
        }
        if (!stopCounting) {
          currClock = curr.id.clock + curr.length;
        }
      }
      if (currClock !== 0) {
        size2++;
        writeVarUint(encoder.restEncoder, currClient);
        writeVarUint(encoder.restEncoder, currClock);
      }
      const enc = createEncoder();
      writeVarUint(enc, size2);
      writeBinaryEncoder(enc, encoder.restEncoder);
      encoder.restEncoder = enc;
      return encoder.toUint8Array();
    } else {
      writeVarUint(encoder.restEncoder, 0);
      return encoder.toUint8Array();
    }
  };
  var encodeStateVectorFromUpdate = (update) => encodeStateVectorFromUpdateV2(update, DSEncoderV1, UpdateDecoderV1);
  var parseUpdateMetaV2 = (update, YDecoder = UpdateDecoderV2) => {
    const from2 = /* @__PURE__ */ new Map();
    const to = /* @__PURE__ */ new Map();
    const updateDecoder = new LazyStructReader(new YDecoder(createDecoder(update)), false);
    let curr = updateDecoder.curr;
    if (curr !== null) {
      let currClient = curr.id.client;
      let currClock = curr.id.clock;
      from2.set(currClient, currClock);
      for (; curr !== null; curr = updateDecoder.next()) {
        if (currClient !== curr.id.client) {
          to.set(currClient, currClock);
          from2.set(curr.id.client, curr.id.clock);
          currClient = curr.id.client;
        }
        currClock = curr.id.clock + curr.length;
      }
      to.set(currClient, currClock);
    }
    return { from: from2, to };
  };
  var parseUpdateMeta = (update) => parseUpdateMetaV2(update, UpdateDecoderV1);
  var sliceStruct = (left, diff) => {
    if (left.constructor === GC) {
      const { client, clock } = left.id;
      return new GC(createID(client, clock + diff), left.length - diff);
    } else if (left.constructor === Skip) {
      const { client, clock } = left.id;
      return new Skip(createID(client, clock + diff), left.length - diff);
    } else {
      const leftItem = (
        /** @type {Item} */
        left
      );
      const { client, clock } = leftItem.id;
      return new Item(
        createID(client, clock + diff),
        null,
        createID(client, clock + diff - 1),
        null,
        leftItem.rightOrigin,
        leftItem.parent,
        leftItem.parentSub,
        leftItem.content.splice(diff)
      );
    }
  };
  var mergeUpdatesV2 = (updates, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
    if (updates.length === 1) {
      return updates[0];
    }
    const updateDecoders = updates.map((update) => new YDecoder(createDecoder(update)));
    let lazyStructDecoders = updateDecoders.map((decoder) => new LazyStructReader(decoder, true));
    let currWrite = null;
    const updateEncoder = new YEncoder();
    const lazyStructEncoder = new LazyStructWriter(updateEncoder);
    while (true) {
      lazyStructDecoders = lazyStructDecoders.filter((dec) => dec.curr !== null);
      lazyStructDecoders.sort(
        /** @type {function(any,any):number} */
        (dec1, dec2) => {
          if (dec1.curr.id.client === dec2.curr.id.client) {
            const clockDiff = dec1.curr.id.clock - dec2.curr.id.clock;
            if (clockDiff === 0) {
              return dec1.curr.constructor === dec2.curr.constructor ? 0 : dec1.curr.constructor === Skip ? 1 : -1;
            } else {
              return clockDiff;
            }
          } else {
            return dec2.curr.id.client - dec1.curr.id.client;
          }
        }
      );
      if (lazyStructDecoders.length === 0) {
        break;
      }
      const currDecoder = lazyStructDecoders[0];
      const firstClient = (
        /** @type {Item | GC} */
        currDecoder.curr.id.client
      );
      if (currWrite !== null) {
        let curr = (
          /** @type {Item | GC | null} */
          currDecoder.curr
        );
        let iterated = false;
        while (curr !== null && curr.id.clock + curr.length <= currWrite.struct.id.clock + currWrite.struct.length && curr.id.client >= currWrite.struct.id.client) {
          curr = currDecoder.next();
          iterated = true;
        }
        if (curr === null || // current decoder is empty
        curr.id.client !== firstClient || // check whether there is another decoder that has has updates from `firstClient`
        iterated && curr.id.clock > currWrite.struct.id.clock + currWrite.struct.length) {
          continue;
        }
        if (firstClient !== currWrite.struct.id.client) {
          writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
          currWrite = { struct: curr, offset: 0 };
          currDecoder.next();
        } else {
          if (currWrite.struct.id.clock + currWrite.struct.length < curr.id.clock) {
            if (currWrite.struct.constructor === Skip) {
              currWrite.struct.length = curr.id.clock + curr.length - currWrite.struct.id.clock;
            } else {
              writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
              const diff = curr.id.clock - currWrite.struct.id.clock - currWrite.struct.length;
              const struct = new Skip(createID(firstClient, currWrite.struct.id.clock + currWrite.struct.length), diff);
              currWrite = { struct, offset: 0 };
            }
          } else {
            const diff = currWrite.struct.id.clock + currWrite.struct.length - curr.id.clock;
            if (diff > 0) {
              if (currWrite.struct.constructor === Skip) {
                currWrite.struct.length -= diff;
              } else {
                curr = sliceStruct(curr, diff);
              }
            }
            if (!currWrite.struct.mergeWith(
              /** @type {any} */
              curr
            )) {
              writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
              currWrite = { struct: curr, offset: 0 };
              currDecoder.next();
            }
          }
        }
      } else {
        currWrite = { struct: (
          /** @type {Item | GC} */
          currDecoder.curr
        ), offset: 0 };
        currDecoder.next();
      }
      for (let next = currDecoder.curr; next !== null && next.id.client === firstClient && next.id.clock === currWrite.struct.id.clock + currWrite.struct.length && next.constructor !== Skip; next = currDecoder.next()) {
        writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
        currWrite = { struct: next, offset: 0 };
      }
    }
    if (currWrite !== null) {
      writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
      currWrite = null;
    }
    finishLazyStructWriting(lazyStructEncoder);
    const dss = updateDecoders.map((decoder) => readDeleteSet(decoder));
    const ds = mergeDeleteSets(dss);
    writeDeleteSet(updateEncoder, ds);
    return updateEncoder.toUint8Array();
  };
  var diffUpdateV2 = (update, sv, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
    const state = decodeStateVector(sv);
    const encoder = new YEncoder();
    const lazyStructWriter = new LazyStructWriter(encoder);
    const decoder = new YDecoder(createDecoder(update));
    const reader = new LazyStructReader(decoder, false);
    while (reader.curr) {
      const curr = reader.curr;
      const currClient = curr.id.client;
      const svClock = state.get(currClient) || 0;
      if (reader.curr.constructor === Skip) {
        reader.next();
        continue;
      }
      if (curr.id.clock + curr.length > svClock) {
        writeStructToLazyStructWriter(lazyStructWriter, curr, max(svClock - curr.id.clock, 0));
        reader.next();
        while (reader.curr && reader.curr.id.client === currClient) {
          writeStructToLazyStructWriter(lazyStructWriter, reader.curr, 0);
          reader.next();
        }
      } else {
        while (reader.curr && reader.curr.id.client === currClient && reader.curr.id.clock + reader.curr.length <= svClock) {
          reader.next();
        }
      }
    }
    finishLazyStructWriting(lazyStructWriter);
    const ds = readDeleteSet(decoder);
    writeDeleteSet(encoder, ds);
    return encoder.toUint8Array();
  };
  var diffUpdate = (update, sv) => diffUpdateV2(update, sv, UpdateDecoderV1, UpdateEncoderV1);
  var flushLazyStructWriter = (lazyWriter) => {
    if (lazyWriter.written > 0) {
      lazyWriter.clientStructs.push({ written: lazyWriter.written, restEncoder: toUint8Array(lazyWriter.encoder.restEncoder) });
      lazyWriter.encoder.restEncoder = createEncoder();
      lazyWriter.written = 0;
    }
  };
  var writeStructToLazyStructWriter = (lazyWriter, struct, offset) => {
    if (lazyWriter.written > 0 && lazyWriter.currClient !== struct.id.client) {
      flushLazyStructWriter(lazyWriter);
    }
    if (lazyWriter.written === 0) {
      lazyWriter.currClient = struct.id.client;
      lazyWriter.encoder.writeClient(struct.id.client);
      writeVarUint(lazyWriter.encoder.restEncoder, struct.id.clock + offset);
    }
    struct.write(lazyWriter.encoder, offset);
    lazyWriter.written++;
  };
  var finishLazyStructWriting = (lazyWriter) => {
    flushLazyStructWriter(lazyWriter);
    const restEncoder = lazyWriter.encoder.restEncoder;
    writeVarUint(restEncoder, lazyWriter.clientStructs.length);
    for (let i = 0; i < lazyWriter.clientStructs.length; i++) {
      const partStructs = lazyWriter.clientStructs[i];
      writeVarUint(restEncoder, partStructs.written);
      writeUint8Array(restEncoder, partStructs.restEncoder);
    }
  };
  var convertUpdateFormat = (update, blockTransformer, YDecoder, YEncoder) => {
    const updateDecoder = new YDecoder(createDecoder(update));
    const lazyDecoder = new LazyStructReader(updateDecoder, false);
    const updateEncoder = new YEncoder();
    const lazyWriter = new LazyStructWriter(updateEncoder);
    for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
      writeStructToLazyStructWriter(lazyWriter, blockTransformer(curr), 0);
    }
    finishLazyStructWriting(lazyWriter);
    const ds = readDeleteSet(updateDecoder);
    writeDeleteSet(updateEncoder, ds);
    return updateEncoder.toUint8Array();
  };
  var createObfuscator = ({ formatting = true, subdocs = true, yxml = true } = {}) => {
    let i = 0;
    const mapKeyCache = create();
    const nodeNameCache = create();
    const formattingKeyCache = create();
    const formattingValueCache = create();
    formattingValueCache.set(null, null);
    return (block) => {
      switch (block.constructor) {
        case GC:
        case Skip:
          return block;
        case Item: {
          const item = (
            /** @type {Item} */
            block
          );
          const content = item.content;
          switch (content.constructor) {
            case ContentDeleted:
              break;
            case ContentType: {
              if (yxml) {
                const type = (
                  /** @type {ContentType} */
                  content.type
                );
                if (type instanceof YXmlElement) {
                  type.nodeName = setIfUndefined(nodeNameCache, type.nodeName, () => "node-" + i);
                }
                if (type instanceof YXmlHook) {
                  type.hookName = setIfUndefined(nodeNameCache, type.hookName, () => "hook-" + i);
                }
              }
              break;
            }
            case ContentAny: {
              const c = (
                /** @type {ContentAny} */
                content
              );
              c.arr = c.arr.map(() => i);
              break;
            }
            case ContentBinary: {
              const c = (
                /** @type {ContentBinary} */
                content
              );
              c.content = new Uint8Array([i]);
              break;
            }
            case ContentDoc: {
              const c = (
                /** @type {ContentDoc} */
                content
              );
              if (subdocs) {
                c.opts = {};
                c.doc.guid = i + "";
              }
              break;
            }
            case ContentEmbed: {
              const c = (
                /** @type {ContentEmbed} */
                content
              );
              c.embed = {};
              break;
            }
            case ContentFormat: {
              const c = (
                /** @type {ContentFormat} */
                content
              );
              if (formatting) {
                c.key = setIfUndefined(formattingKeyCache, c.key, () => i + "");
                c.value = setIfUndefined(formattingValueCache, c.value, () => ({ i }));
              }
              break;
            }
            case ContentJSON: {
              const c = (
                /** @type {ContentJSON} */
                content
              );
              c.arr = c.arr.map(() => i);
              break;
            }
            case ContentString: {
              const c = (
                /** @type {ContentString} */
                content
              );
              c.str = repeat(i % 10 + "", c.str.length);
              break;
            }
            default:
              unexpectedCase();
          }
          if (item.parentSub) {
            item.parentSub = setIfUndefined(mapKeyCache, item.parentSub, () => i + "");
          }
          i++;
          return block;
        }
        default:
          unexpectedCase();
      }
    };
  };
  var obfuscateUpdate = (update, opts) => convertUpdateFormat(update, createObfuscator(opts), UpdateDecoderV1, UpdateEncoderV1);
  var obfuscateUpdateV2 = (update, opts) => convertUpdateFormat(update, createObfuscator(opts), UpdateDecoderV2, UpdateEncoderV2);
  var convertUpdateFormatV1ToV2 = (update) => convertUpdateFormat(update, id, UpdateDecoderV1, UpdateEncoderV2);
  var convertUpdateFormatV2ToV1 = (update) => convertUpdateFormat(update, id, UpdateDecoderV2, UpdateEncoderV1);
  var errorComputeChanges = "You must not compute changes after the event-handler fired.";
  var YEvent = class {
    /**
     * @param {T} target The changed type.
     * @param {Transaction} transaction
     */
    constructor(target, transaction) {
      this.target = target;
      this.currentTarget = target;
      this.transaction = transaction;
      this._changes = null;
      this._keys = null;
      this._delta = null;
      this._path = null;
    }
    /**
     * Computes the path from `y` to the changed type.
     *
     * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
     *
     * The following property holds:
     * @example
     *   let type = y
     *   event.path.forEach(dir => {
     *     type = type.get(dir)
     *   })
     *   type === event.target // => true
     */
    get path() {
      return this._path || (this._path = getPathTo(this.currentTarget, this.target));
    }
    /**
     * Check if a struct is deleted by this event.
     *
     * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
     *
     * @param {AbstractStruct} struct
     * @return {boolean}
     */
    deletes(struct) {
      return isDeleted(this.transaction.deleteSet, struct.id);
    }
    /**
     * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any, newValue: any }>}
     */
    get keys() {
      if (this._keys === null) {
        if (this.transaction.doc._transactionCleanups.length === 0) {
          throw create3(errorComputeChanges);
        }
        const keys3 = /* @__PURE__ */ new Map();
        const target = this.target;
        const changed = (
          /** @type Set<string|null> */
          this.transaction.changed.get(target)
        );
        changed.forEach((key) => {
          if (key !== null) {
            const item = (
              /** @type {Item} */
              target._map.get(key)
            );
            let action;
            let oldValue;
            if (this.adds(item)) {
              let prev = item.left;
              while (prev !== null && this.adds(prev)) {
                prev = prev.left;
              }
              if (this.deletes(item)) {
                if (prev !== null && this.deletes(prev)) {
                  action = "delete";
                  oldValue = last(prev.content.getContent());
                } else {
                  return;
                }
              } else {
                if (prev !== null && this.deletes(prev)) {
                  action = "update";
                  oldValue = last(prev.content.getContent());
                } else {
                  action = "add";
                  oldValue = void 0;
                }
              }
            } else {
              if (this.deletes(item)) {
                action = "delete";
                oldValue = last(
                  /** @type {Item} */
                  item.content.getContent()
                );
              } else {
                return;
              }
            }
            keys3.set(key, { action, oldValue });
          }
        });
        this._keys = keys3;
      }
      return this._keys;
    }
    /**
     * This is a computed property. Note that this can only be safely computed during the
     * event call. Computing this property after other changes happened might result in
     * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
     * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
     *
     * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
     */
    get delta() {
      return this.changes.delta;
    }
    /**
     * Check if a struct is added by this event.
     *
     * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
     *
     * @param {AbstractStruct} struct
     * @return {boolean}
     */
    adds(struct) {
      return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0);
    }
    /**
     * This is a computed property. Note that this can only be safely computed during the
     * event call. Computing this property after other changes happened might result in
     * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
     * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
     *
     * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
     */
    get changes() {
      let changes = this._changes;
      if (changes === null) {
        if (this.transaction.doc._transactionCleanups.length === 0) {
          throw create3(errorComputeChanges);
        }
        const target = this.target;
        const added = create2();
        const deleted = create2();
        const delta = [];
        changes = {
          added,
          deleted,
          delta,
          keys: this.keys
        };
        const changed = (
          /** @type Set<string|null> */
          this.transaction.changed.get(target)
        );
        if (changed.has(null)) {
          let lastOp = null;
          const packOp = () => {
            if (lastOp) {
              delta.push(lastOp);
            }
          };
          for (let item = target._start; item !== null; item = item.right) {
            if (item.deleted) {
              if (this.deletes(item) && !this.adds(item)) {
                if (lastOp === null || lastOp.delete === void 0) {
                  packOp();
                  lastOp = { delete: 0 };
                }
                lastOp.delete += item.length;
                deleted.add(item);
              }
            } else {
              if (this.adds(item)) {
                if (lastOp === null || lastOp.insert === void 0) {
                  packOp();
                  lastOp = { insert: [] };
                }
                lastOp.insert = lastOp.insert.concat(item.content.getContent());
                added.add(item);
              } else {
                if (lastOp === null || lastOp.retain === void 0) {
                  packOp();
                  lastOp = { retain: 0 };
                }
                lastOp.retain += item.length;
              }
            }
          }
          if (lastOp !== null && lastOp.retain === void 0) {
            packOp();
          }
        }
        this._changes = changes;
      }
      return (
        /** @type {any} */
        changes
      );
    }
  };
  var getPathTo = (parent, child) => {
    const path = [];
    while (child._item !== null && child !== parent) {
      if (child._item.parentSub !== null) {
        path.unshift(child._item.parentSub);
      } else {
        let i = 0;
        let c = (
          /** @type {AbstractType<any>} */
          child._item.parent._start
        );
        while (c !== child._item && c !== null) {
          if (!c.deleted && c.countable) {
            i += c.length;
          }
          c = c.right;
        }
        path.unshift(i);
      }
      child = /** @type {AbstractType<any>} */
      child._item.parent;
    }
    return path;
  };
  var warnPrematureAccess = () => {
    warn("Invalid access: Add Yjs type to a document before reading data.");
  };
  var maxSearchMarker = 80;
  var globalSearchMarkerTimestamp = 0;
  var ArraySearchMarker = class {
    /**
     * @param {Item} p
     * @param {number} index
     */
    constructor(p, index) {
      p.marker = true;
      this.p = p;
      this.index = index;
      this.timestamp = globalSearchMarkerTimestamp++;
    }
  };
  var refreshMarkerTimestamp = (marker) => {
    marker.timestamp = globalSearchMarkerTimestamp++;
  };
  var overwriteMarker = (marker, p, index) => {
    marker.p.marker = false;
    marker.p = p;
    p.marker = true;
    marker.index = index;
    marker.timestamp = globalSearchMarkerTimestamp++;
  };
  var markPosition = (searchMarker, p, index) => {
    if (searchMarker.length >= maxSearchMarker) {
      const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
      overwriteMarker(marker, p, index);
      return marker;
    } else {
      const pm = new ArraySearchMarker(p, index);
      searchMarker.push(pm);
      return pm;
    }
  };
  var findMarker = (yarray, index) => {
    if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
      return null;
    }
    const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => abs(index - a.index) < abs(index - b.index) ? a : b);
    let p = yarray._start;
    let pindex = 0;
    if (marker !== null) {
      p = marker.p;
      pindex = marker.index;
      refreshMarkerTimestamp(marker);
    }
    while (p.right !== null && pindex < index) {
      if (!p.deleted && p.countable) {
        if (index < pindex + p.length) {
          break;
        }
        pindex += p.length;
      }
      p = p.right;
    }
    while (p.left !== null && pindex > index) {
      p = p.left;
      if (!p.deleted && p.countable) {
        pindex -= p.length;
      }
    }
    while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
      p = p.left;
      if (!p.deleted && p.countable) {
        pindex -= p.length;
      }
    }
    if (marker !== null && abs(marker.index - pindex) < /** @type {YText|YArray<any>} */
    p.parent.length / maxSearchMarker) {
      overwriteMarker(marker, p, pindex);
      return marker;
    } else {
      return markPosition(yarray._searchMarker, p, pindex);
    }
  };
  var updateMarkerChanges = (searchMarker, index, len) => {
    for (let i = searchMarker.length - 1; i >= 0; i--) {
      const m = searchMarker[i];
      if (len > 0) {
        let p = m.p;
        p.marker = false;
        while (p && (p.deleted || !p.countable)) {
          p = p.left;
          if (p && !p.deleted && p.countable) {
            m.index -= p.length;
          }
        }
        if (p === null || p.marker === true) {
          searchMarker.splice(i, 1);
          continue;
        }
        m.p = p;
        p.marker = true;
      }
      if (index < m.index || len > 0 && index === m.index) {
        m.index = max(index, m.index + len);
      }
    }
  };
  var getTypeChildren = (t) => {
    t.doc ?? warnPrematureAccess();
    let s = t._start;
    const arr = [];
    while (s) {
      arr.push(s);
      s = s.right;
    }
    return arr;
  };
  var callTypeObservers = (type, transaction, event) => {
    const changedType = type;
    const changedParentTypes = transaction.changedParentTypes;
    while (true) {
      setIfUndefined(changedParentTypes, type, () => []).push(event);
      if (type._item === null) {
        break;
      }
      type = /** @type {AbstractType<any>} */
      type._item.parent;
    }
    callEventHandlerListeners(changedType._eH, event, transaction);
  };
  var AbstractType = class {
    constructor() {
      this._item = null;
      this._map = /* @__PURE__ */ new Map();
      this._start = null;
      this.doc = null;
      this._length = 0;
      this._eH = createEventHandler();
      this._dEH = createEventHandler();
      this._searchMarker = null;
    }
    /**
     * @return {AbstractType<any>|null}
     */
    get parent() {
      return this._item ? (
        /** @type {AbstractType<any>} */
        this._item.parent
      ) : null;
    }
    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item|null} item
     */
    _integrate(y, item) {
      this.doc = y;
      this._item = item;
    }
    /**
     * @return {AbstractType<EventType>}
     */
    _copy() {
      throw methodUnimplemented();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {AbstractType<EventType>}
     */
    clone() {
      throw methodUnimplemented();
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} _encoder
     */
    _write(_encoder) {
    }
    /**
     * The first non-deleted item
     */
    get _first() {
      let n = this._start;
      while (n !== null && n.deleted) {
        n = n.right;
      }
      return n;
    }
    /**
     * Creates YEvent and calls all type observers.
     * Must be implemented by each type.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} _parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver(transaction, _parentSubs) {
      if (!transaction.local && this._searchMarker) {
        this._searchMarker.length = 0;
      }
    }
    /**
     * Observe all events that are created on this type.
     *
     * @param {function(EventType, Transaction):void} f Observer function
     */
    observe(f) {
      addEventHandlerListener(this._eH, f);
    }
    /**
     * Observe all events that are created by this type and its children.
     *
     * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
     */
    observeDeep(f) {
      addEventHandlerListener(this._dEH, f);
    }
    /**
     * Unregister an observer function.
     *
     * @param {function(EventType,Transaction):void} f Observer function
     */
    unobserve(f) {
      removeEventHandlerListener(this._eH, f);
    }
    /**
     * Unregister an observer function.
     *
     * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
     */
    unobserveDeep(f) {
      removeEventHandlerListener(this._dEH, f);
    }
    /**
     * @abstract
     * @return {any}
     */
    toJSON() {
    }
  };
  var typeListSlice = (type, start, end) => {
    type.doc ?? warnPrematureAccess();
    if (start < 0) {
      start = type._length + start;
    }
    if (end < 0) {
      end = type._length + end;
    }
    let len = end - start;
    const cs = [];
    let n = type._start;
    while (n !== null && len > 0) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        if (c.length <= start) {
          start -= c.length;
        } else {
          for (let i = start; i < c.length && len > 0; i++) {
            cs.push(c[i]);
            len--;
          }
          start = 0;
        }
      }
      n = n.right;
    }
    return cs;
  };
  var typeListToArray = (type) => {
    type.doc ?? warnPrematureAccess();
    const cs = [];
    let n = type._start;
    while (n !== null) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          cs.push(c[i]);
        }
      }
      n = n.right;
    }
    return cs;
  };
  var typeListToArraySnapshot = (type, snapshot2) => {
    const cs = [];
    let n = type._start;
    while (n !== null) {
      if (n.countable && isVisible(n, snapshot2)) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          cs.push(c[i]);
        }
      }
      n = n.right;
    }
    return cs;
  };
  var typeListForEach = (type, f) => {
    let index = 0;
    let n = type._start;
    type.doc ?? warnPrematureAccess();
    while (n !== null) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          f(c[i], index++, type);
        }
      }
      n = n.right;
    }
  };
  var typeListMap = (type, f) => {
    const result = [];
    typeListForEach(type, (c, i) => {
      result.push(f(c, i, type));
    });
    return result;
  };
  var typeListCreateIterator = (type) => {
    let n = type._start;
    let currentContent = null;
    let currentContentIndex = 0;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        if (currentContent === null) {
          while (n !== null && n.deleted) {
            n = n.right;
          }
          if (n === null) {
            return {
              done: true,
              value: void 0
            };
          }
          currentContent = n.content.getContent();
          currentContentIndex = 0;
          n = n.right;
        }
        const value = currentContent[currentContentIndex++];
        if (currentContent.length <= currentContentIndex) {
          currentContent = null;
        }
        return {
          done: false,
          value
        };
      }
    };
  };
  var typeListGet = (type, index) => {
    type.doc ?? warnPrematureAccess();
    const marker = findMarker(type, index);
    let n = type._start;
    if (marker !== null) {
      n = marker.p;
      index -= marker.index;
    }
    for (; n !== null; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index < n.length) {
          return n.content.getContent()[index];
        }
        index -= n.length;
      }
    }
  };
  var typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
    let left = referenceItem;
    const doc5 = transaction.doc;
    const ownClientId = doc5.clientID;
    const store = doc5.store;
    const right = referenceItem === null ? parent._start : referenceItem.right;
    let jsonContent = [];
    const packJsonContent = () => {
      if (jsonContent.length > 0) {
        left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
        left.integrate(transaction, 0);
        jsonContent = [];
      }
    };
    content.forEach((c) => {
      if (c === null) {
        jsonContent.push(c);
      } else {
        switch (c.constructor) {
          case Number:
          case Object:
          case Boolean:
          case Array:
          case String:
            jsonContent.push(c);
            break;
          default:
            packJsonContent();
            switch (c.constructor) {
              case Uint8Array:
              case ArrayBuffer:
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(
                  /** @type {Uint8Array} */
                  c
                )));
                left.integrate(transaction, 0);
                break;
              case Doc:
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc(
                  /** @type {Doc} */
                  c
                ));
                left.integrate(transaction, 0);
                break;
              default:
                if (c instanceof AbstractType) {
                  left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
                  left.integrate(transaction, 0);
                } else {
                  throw new Error("Unexpected content type in insert operation");
                }
            }
        }
      }
    });
    packJsonContent();
  };
  var lengthExceeded = () => create3("Length exceeded!");
  var typeListInsertGenerics = (transaction, parent, index, content) => {
    if (index > parent._length) {
      throw lengthExceeded();
    }
    if (index === 0) {
      if (parent._searchMarker) {
        updateMarkerChanges(parent._searchMarker, index, content.length);
      }
      return typeListInsertGenericsAfter(transaction, parent, null, content);
    }
    const startIndex = index;
    const marker = findMarker(parent, index);
    let n = parent._start;
    if (marker !== null) {
      n = marker.p;
      index -= marker.index;
      if (index === 0) {
        n = n.prev;
        index += n && n.countable && !n.deleted ? n.length : 0;
      }
    }
    for (; n !== null; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index <= n.length) {
          if (index < n.length) {
            getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
          }
          break;
        }
        index -= n.length;
      }
    }
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, startIndex, content.length);
    }
    return typeListInsertGenericsAfter(transaction, parent, n, content);
  };
  var typeListPushGenerics = (transaction, parent, content) => {
    const marker = (parent._searchMarker || []).reduce((maxMarker, currMarker) => currMarker.index > maxMarker.index ? currMarker : maxMarker, { index: 0, p: parent._start });
    let n = marker.p;
    if (n) {
      while (n.right) {
        n = n.right;
      }
    }
    return typeListInsertGenericsAfter(transaction, parent, n, content);
  };
  var typeListDelete = (transaction, parent, index, length2) => {
    if (length2 === 0) {
      return;
    }
    const startIndex = index;
    const startLength = length2;
    const marker = findMarker(parent, index);
    let n = parent._start;
    if (marker !== null) {
      n = marker.p;
      index -= marker.index;
    }
    for (; n !== null && index > 0; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
        }
        index -= n.length;
      }
    }
    while (length2 > 0 && n !== null) {
      if (!n.deleted) {
        if (length2 < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length2));
        }
        n.delete(transaction);
        length2 -= n.length;
      }
      n = n.right;
    }
    if (length2 > 0) {
      throw lengthExceeded();
    }
    if (parent._searchMarker) {
      updateMarkerChanges(
        parent._searchMarker,
        startIndex,
        -startLength + length2
        /* in case we remove the above exception */
      );
    }
  };
  var typeMapDelete = (transaction, parent, key) => {
    const c = parent._map.get(key);
    if (c !== void 0) {
      c.delete(transaction);
    }
  };
  var typeMapSet = (transaction, parent, key, value) => {
    const left = parent._map.get(key) || null;
    const doc5 = transaction.doc;
    const ownClientId = doc5.clientID;
    let content;
    if (value == null) {
      content = new ContentAny([value]);
    } else {
      switch (value.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
        case Date:
        case BigInt:
          content = new ContentAny([value]);
          break;
        case Uint8Array:
          content = new ContentBinary(
            /** @type {Uint8Array} */
            value
          );
          break;
        case Doc:
          content = new ContentDoc(
            /** @type {Doc} */
            value
          );
          break;
        default:
          if (value instanceof AbstractType) {
            content = new ContentType(value);
          } else {
            throw new Error("Unexpected content type");
          }
      }
    }
    new Item(createID(ownClientId, getState(doc5.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
  };
  var typeMapGet = (parent, key) => {
    parent.doc ?? warnPrematureAccess();
    const val = parent._map.get(key);
    return val !== void 0 && !val.deleted ? val.content.getContent()[val.length - 1] : void 0;
  };
  var typeMapGetAll = (parent) => {
    const res = {};
    parent.doc ?? warnPrematureAccess();
    parent._map.forEach((value, key) => {
      if (!value.deleted) {
        res[key] = value.content.getContent()[value.length - 1];
      }
    });
    return res;
  };
  var typeMapHas = (parent, key) => {
    parent.doc ?? warnPrematureAccess();
    const val = parent._map.get(key);
    return val !== void 0 && !val.deleted;
  };
  var typeMapGetSnapshot = (parent, key, snapshot2) => {
    let v = parent._map.get(key) || null;
    while (v !== null && (!snapshot2.sv.has(v.id.client) || v.id.clock >= (snapshot2.sv.get(v.id.client) || 0))) {
      v = v.left;
    }
    return v !== null && isVisible(v, snapshot2) ? v.content.getContent()[v.length - 1] : void 0;
  };
  var typeMapGetAllSnapshot = (parent, snapshot2) => {
    const res = {};
    parent._map.forEach((value, key) => {
      let v = value;
      while (v !== null && (!snapshot2.sv.has(v.id.client) || v.id.clock >= (snapshot2.sv.get(v.id.client) || 0))) {
        v = v.left;
      }
      if (v !== null && isVisible(v, snapshot2)) {
        res[key] = v.content.getContent()[v.length - 1];
      }
    });
    return res;
  };
  var createMapIterator = (type) => {
    type.doc ?? warnPrematureAccess();
    return iteratorFilter(
      type._map.entries(),
      /** @param {any} entry */
      (entry) => !entry[1].deleted
    );
  };
  var YArrayEvent = class extends YEvent {
  };
  var YArray = class _YArray extends AbstractType {
    constructor() {
      super();
      this._prelimContent = [];
      this._searchMarker = [];
    }
    /**
     * Construct a new YArray containing the specified items.
     * @template {Object<string,any>|Array<any>|number|null|string|Uint8Array} T
     * @param {Array<T>} items
     * @return {YArray<T>}
     */
    static from(items) {
      const a = new _YArray();
      a.push(items);
      return a;
    }
    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate(y, item) {
      super._integrate(y, item);
      this.insert(
        0,
        /** @type {Array<any>} */
        this._prelimContent
      );
      this._prelimContent = null;
    }
    /**
     * @return {YArray<T>}
     */
    _copy() {
      return new _YArray();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YArray<T>}
     */
    clone() {
      const arr = new _YArray();
      arr.insert(0, this.toArray().map(
        (el) => el instanceof AbstractType ? (
          /** @type {typeof el} */
          el.clone()
        ) : el
      ));
      return arr;
    }
    get length() {
      this.doc ?? warnPrematureAccess();
      return this._length;
    }
    /**
     * Creates YArrayEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver(transaction, parentSubs) {
      super._callObserver(transaction, parentSubs);
      callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
    }
    /**
     * Inserts new content at an index.
     *
     * Important: This function expects an array of content. Not just a content
     * object. The reason for this "weirdness" is that inserting several elements
     * is very efficient when it is done as a single operation.
     *
     * @example
     *  // Insert character 'a' at position 0
     *  yarray.insert(0, ['a'])
     *  // Insert numbers 1, 2 at position 1
     *  yarray.insert(1, [1, 2])
     *
     * @param {number} index The index to insert content at.
     * @param {Array<T>} content The array of content
     */
    insert(index, content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListInsertGenerics(
            transaction,
            this,
            index,
            /** @type {any} */
            content
          );
        });
      } else {
        this._prelimContent.splice(index, 0, ...content);
      }
    }
    /**
     * Appends content to this YArray.
     *
     * @param {Array<T>} content Array of content to append.
     *
     * @todo Use the following implementation in all types.
     */
    push(content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListPushGenerics(
            transaction,
            this,
            /** @type {any} */
            content
          );
        });
      } else {
        this._prelimContent.push(...content);
      }
    }
    /**
     * Prepends content to this YArray.
     *
     * @param {Array<T>} content Array of content to prepend.
     */
    unshift(content) {
      this.insert(0, content);
    }
    /**
     * Deletes elements starting from an index.
     *
     * @param {number} index Index at which to start deleting elements
     * @param {number} length The number of elements to remove. Defaults to 1.
     */
    delete(index, length2 = 1) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListDelete(transaction, this, index, length2);
        });
      } else {
        this._prelimContent.splice(index, length2);
      }
    }
    /**
     * Returns the i-th element from a YArray.
     *
     * @param {number} index The index of the element to return from the YArray
     * @return {T}
     */
    get(index) {
      return typeListGet(this, index);
    }
    /**
     * Transforms this YArray to a JavaScript Array.
     *
     * @return {Array<T>}
     */
    toArray() {
      return typeListToArray(this);
    }
    /**
     * Returns a portion of this YArray into a JavaScript Array selected
     * from start to end (end not included).
     *
     * @param {number} [start]
     * @param {number} [end]
     * @return {Array<T>}
     */
    slice(start = 0, end = this.length) {
      return typeListSlice(this, start, end);
    }
    /**
     * Transforms this Shared Type to a JSON object.
     *
     * @return {Array<any>}
     */
    toJSON() {
      return this.map((c) => c instanceof AbstractType ? c.toJSON() : c);
    }
    /**
     * Returns an Array with the result of calling a provided function on every
     * element of this YArray.
     *
     * @template M
     * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
     * @return {Array<M>} A new array with each element being the result of the
     *                 callback function
     */
    map(f) {
      return typeListMap(
        this,
        /** @type {any} */
        f
      );
    }
    /**
     * Executes a provided function once on every element of this YArray.
     *
     * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
     */
    forEach(f) {
      typeListForEach(this, f);
    }
    /**
     * @return {IterableIterator<T>}
     */
    [Symbol.iterator]() {
      return typeListCreateIterator(this);
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     */
    _write(encoder) {
      encoder.writeTypeRef(YArrayRefID);
    }
  };
  var readYArray = (_decoder) => new YArray();
  var YMapEvent = class extends YEvent {
    /**
     * @param {YMap<T>} ymap The YArray that changed.
     * @param {Transaction} transaction
     * @param {Set<any>} subs The keys that changed.
     */
    constructor(ymap, transaction, subs) {
      super(ymap, transaction);
      this.keysChanged = subs;
    }
  };
  var YMap = class _YMap extends AbstractType {
    /**
     *
     * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
     */
    constructor(entries) {
      super();
      this._prelimContent = null;
      if (entries === void 0) {
        this._prelimContent = /* @__PURE__ */ new Map();
      } else {
        this._prelimContent = new Map(entries);
      }
    }
    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate(y, item) {
      super._integrate(y, item);
      this._prelimContent.forEach((value, key) => {
        this.set(key, value);
      });
      this._prelimContent = null;
    }
    /**
     * @return {YMap<MapType>}
     */
    _copy() {
      return new _YMap();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YMap<MapType>}
     */
    clone() {
      const map2 = new _YMap();
      this.forEach((value, key) => {
        map2.set(key, value instanceof AbstractType ? (
          /** @type {typeof value} */
          value.clone()
        ) : value);
      });
      return map2;
    }
    /**
     * Creates YMapEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver(transaction, parentSubs) {
      callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
    }
    /**
     * Transforms this Shared Type to a JSON object.
     *
     * @return {Object<string,any>}
     */
    toJSON() {
      this.doc ?? warnPrematureAccess();
      const map2 = {};
      this._map.forEach((item, key) => {
        if (!item.deleted) {
          const v = item.content.getContent()[item.length - 1];
          map2[key] = v instanceof AbstractType ? v.toJSON() : v;
        }
      });
      return map2;
    }
    /**
     * Returns the size of the YMap (count of key/value pairs)
     *
     * @return {number}
     */
    get size() {
      return [...createMapIterator(this)].length;
    }
    /**
     * Returns the keys for each element in the YMap Type.
     *
     * @return {IterableIterator<string>}
     */
    keys() {
      return iteratorMap(
        createMapIterator(this),
        /** @param {any} v */
        (v) => v[0]
      );
    }
    /**
     * Returns the values for each element in the YMap Type.
     *
     * @return {IterableIterator<MapType>}
     */
    values() {
      return iteratorMap(
        createMapIterator(this),
        /** @param {any} v */
        (v) => v[1].content.getContent()[v[1].length - 1]
      );
    }
    /**
     * Returns an Iterator of [key, value] pairs
     *
     * @return {IterableIterator<[string, MapType]>}
     */
    entries() {
      return iteratorMap(
        createMapIterator(this),
        /** @param {any} v */
        (v) => (
          /** @type {any} */
          [v[0], v[1].content.getContent()[v[1].length - 1]]
        )
      );
    }
    /**
     * Executes a provided function on once on every key-value pair.
     *
     * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
     */
    forEach(f) {
      this.doc ?? warnPrematureAccess();
      this._map.forEach((item, key) => {
        if (!item.deleted) {
          f(item.content.getContent()[item.length - 1], key, this);
        }
      });
    }
    /**
     * Returns an Iterator of [key, value] pairs
     *
     * @return {IterableIterator<[string, MapType]>}
     */
    [Symbol.iterator]() {
      return this.entries();
    }
    /**
     * Remove a specified element from this YMap.
     *
     * @param {string} key The key of the element to remove.
     */
    delete(key) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapDelete(transaction, this, key);
        });
      } else {
        this._prelimContent.delete(key);
      }
    }
    /**
     * Adds or updates an element with a specified key and value.
     * @template {MapType} VAL
     *
     * @param {string} key The key of the element to add to this YMap
     * @param {VAL} value The value of the element to add
     * @return {VAL}
     */
    set(key, value) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapSet(
            transaction,
            this,
            key,
            /** @type {any} */
            value
          );
        });
      } else {
        this._prelimContent.set(key, value);
      }
      return value;
    }
    /**
     * Returns a specified element from this YMap.
     *
     * @param {string} key
     * @return {MapType|undefined}
     */
    get(key) {
      return (
        /** @type {any} */
        typeMapGet(this, key)
      );
    }
    /**
     * Returns a boolean indicating whether the specified key exists or not.
     *
     * @param {string} key The key to test.
     * @return {boolean}
     */
    has(key) {
      return typeMapHas(this, key);
    }
    /**
     * Removes all elements from this YMap.
     */
    clear() {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          this.forEach(function(_value, key, map2) {
            typeMapDelete(transaction, map2, key);
          });
        });
      } else {
        this._prelimContent.clear();
      }
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     */
    _write(encoder) {
      encoder.writeTypeRef(YMapRefID);
    }
  };
  var readYMap = (_decoder) => new YMap();
  var equalAttrs = (a, b) => a === b || typeof a === "object" && typeof b === "object" && a && b && equalFlat(a, b);
  var ItemTextListPosition = class {
    /**
     * @param {Item|null} left
     * @param {Item|null} right
     * @param {number} index
     * @param {Map<string,any>} currentAttributes
     */
    constructor(left, right, index, currentAttributes) {
      this.left = left;
      this.right = right;
      this.index = index;
      this.currentAttributes = currentAttributes;
    }
    /**
     * Only call this if you know that this.right is defined
     */
    forward() {
      if (this.right === null) {
        unexpectedCase();
      }
      switch (this.right.content.constructor) {
        case ContentFormat:
          if (!this.right.deleted) {
            updateCurrentAttributes(
              this.currentAttributes,
              /** @type {ContentFormat} */
              this.right.content
            );
          }
          break;
        default:
          if (!this.right.deleted) {
            this.index += this.right.length;
          }
          break;
      }
      this.left = this.right;
      this.right = this.right.right;
    }
  };
  var findNextPosition = (transaction, pos, count) => {
    while (pos.right !== null && count > 0) {
      switch (pos.right.content.constructor) {
        case ContentFormat:
          if (!pos.right.deleted) {
            updateCurrentAttributes(
              pos.currentAttributes,
              /** @type {ContentFormat} */
              pos.right.content
            );
          }
          break;
        default:
          if (!pos.right.deleted) {
            if (count < pos.right.length) {
              getItemCleanStart(transaction, createID(pos.right.id.client, pos.right.id.clock + count));
            }
            pos.index += pos.right.length;
            count -= pos.right.length;
          }
          break;
      }
      pos.left = pos.right;
      pos.right = pos.right.right;
    }
    return pos;
  };
  var findPosition = (transaction, parent, index, useSearchMarker) => {
    const currentAttributes = /* @__PURE__ */ new Map();
    const marker = useSearchMarker ? findMarker(parent, index) : null;
    if (marker) {
      const pos = new ItemTextListPosition(marker.p.left, marker.p, marker.index, currentAttributes);
      return findNextPosition(transaction, pos, index - marker.index);
    } else {
      const pos = new ItemTextListPosition(null, parent._start, 0, currentAttributes);
      return findNextPosition(transaction, pos, index);
    }
  };
  var insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
    while (currPos.right !== null && (currPos.right.deleted === true || currPos.right.content.constructor === ContentFormat && equalAttrs(
      negatedAttributes.get(
        /** @type {ContentFormat} */
        currPos.right.content.key
      ),
      /** @type {ContentFormat} */
      currPos.right.content.value
    ))) {
      if (!currPos.right.deleted) {
        negatedAttributes.delete(
          /** @type {ContentFormat} */
          currPos.right.content.key
        );
      }
      currPos.forward();
    }
    const doc5 = transaction.doc;
    const ownClientId = doc5.clientID;
    negatedAttributes.forEach((val, key) => {
      const left = currPos.left;
      const right = currPos.right;
      const nextFormat = new Item(createID(ownClientId, getState(doc5.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
      nextFormat.integrate(transaction, 0);
      currPos.right = nextFormat;
      currPos.forward();
    });
  };
  var updateCurrentAttributes = (currentAttributes, format) => {
    const { key, value } = format;
    if (value === null) {
      currentAttributes.delete(key);
    } else {
      currentAttributes.set(key, value);
    }
  };
  var minimizeAttributeChanges = (currPos, attributes) => {
    while (true) {
      if (currPos.right === null) {
        break;
      } else if (currPos.right.deleted || currPos.right.content.constructor === ContentFormat && equalAttrs(
        attributes[
          /** @type {ContentFormat} */
          currPos.right.content.key
        ] ?? null,
        /** @type {ContentFormat} */
        currPos.right.content.value
      )) ;
      else {
        break;
      }
      currPos.forward();
    }
  };
  var insertAttributes = (transaction, parent, currPos, attributes) => {
    const doc5 = transaction.doc;
    const ownClientId = doc5.clientID;
    const negatedAttributes = /* @__PURE__ */ new Map();
    for (const key in attributes) {
      const val = attributes[key];
      const currentVal = currPos.currentAttributes.get(key) ?? null;
      if (!equalAttrs(currentVal, val)) {
        negatedAttributes.set(key, currentVal);
        const { left, right } = currPos;
        currPos.right = new Item(createID(ownClientId, getState(doc5.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
        currPos.right.integrate(transaction, 0);
        currPos.forward();
      }
    }
    return negatedAttributes;
  };
  var insertText = (transaction, parent, currPos, text2, attributes) => {
    currPos.currentAttributes.forEach((_val, key) => {
      if (attributes[key] === void 0) {
        attributes[key] = null;
      }
    });
    const doc5 = transaction.doc;
    const ownClientId = doc5.clientID;
    minimizeAttributeChanges(currPos, attributes);
    const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
    const content = text2.constructor === String ? new ContentString(
      /** @type {string} */
      text2
    ) : text2 instanceof AbstractType ? new ContentType(text2) : new ContentEmbed(text2);
    let { left, right, index } = currPos;
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, currPos.index, content.getLength());
    }
    right = new Item(createID(ownClientId, getState(doc5.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
    right.integrate(transaction, 0);
    currPos.right = right;
    currPos.index = index;
    currPos.forward();
    insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
  };
  var formatText = (transaction, parent, currPos, length2, attributes) => {
    const doc5 = transaction.doc;
    const ownClientId = doc5.clientID;
    minimizeAttributeChanges(currPos, attributes);
    const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
    iterationLoop: while (currPos.right !== null && (length2 > 0 || negatedAttributes.size > 0 && (currPos.right.deleted || currPos.right.content.constructor === ContentFormat))) {
      if (!currPos.right.deleted) {
        switch (currPos.right.content.constructor) {
          case ContentFormat: {
            const { key, value } = (
              /** @type {ContentFormat} */
              currPos.right.content
            );
            const attr = attributes[key];
            if (attr !== void 0) {
              if (equalAttrs(attr, value)) {
                negatedAttributes.delete(key);
              } else {
                if (length2 === 0) {
                  break iterationLoop;
                }
                negatedAttributes.set(key, value);
              }
              currPos.right.delete(transaction);
            } else {
              currPos.currentAttributes.set(key, value);
            }
            break;
          }
          default:
            if (length2 < currPos.right.length) {
              getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
            }
            length2 -= currPos.right.length;
            break;
        }
      }
      currPos.forward();
    }
    if (length2 > 0) {
      let newlines = "";
      for (; length2 > 0; length2--) {
        newlines += "\n";
      }
      currPos.right = new Item(createID(ownClientId, getState(doc5.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString(newlines));
      currPos.right.integrate(transaction, 0);
      currPos.forward();
    }
    insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
  };
  var cleanupFormattingGap = (transaction, start, curr, startAttributes, currAttributes) => {
    let end = start;
    const endFormats = create();
    while (end && (!end.countable || end.deleted)) {
      if (!end.deleted && end.content.constructor === ContentFormat) {
        const cf = (
          /** @type {ContentFormat} */
          end.content
        );
        endFormats.set(cf.key, cf);
      }
      end = end.right;
    }
    let cleanups = 0;
    let reachedCurr = false;
    while (start !== end) {
      if (curr === start) {
        reachedCurr = true;
      }
      if (!start.deleted) {
        const content = start.content;
        switch (content.constructor) {
          case ContentFormat: {
            const { key, value } = (
              /** @type {ContentFormat} */
              content
            );
            const startAttrValue = startAttributes.get(key) ?? null;
            if (endFormats.get(key) !== content || startAttrValue === value) {
              start.delete(transaction);
              cleanups++;
              if (!reachedCurr && (currAttributes.get(key) ?? null) === value && startAttrValue !== value) {
                if (startAttrValue === null) {
                  currAttributes.delete(key);
                } else {
                  currAttributes.set(key, startAttrValue);
                }
              }
            }
            if (!reachedCurr && !start.deleted) {
              updateCurrentAttributes(
                currAttributes,
                /** @type {ContentFormat} */
                content
              );
            }
            break;
          }
        }
      }
      start = /** @type {Item} */
      start.right;
    }
    return cleanups;
  };
  var cleanupContextlessFormattingGap = (transaction, item) => {
    while (item && item.right && (item.right.deleted || !item.right.countable)) {
      item = item.right;
    }
    const attrs = /* @__PURE__ */ new Set();
    while (item && (item.deleted || !item.countable)) {
      if (!item.deleted && item.content.constructor === ContentFormat) {
        const key = (
          /** @type {ContentFormat} */
          item.content.key
        );
        if (attrs.has(key)) {
          item.delete(transaction);
        } else {
          attrs.add(key);
        }
      }
      item = item.left;
    }
  };
  var cleanupYTextFormatting = (type) => {
    let res = 0;
    transact(
      /** @type {Doc} */
      type.doc,
      (transaction) => {
        let start = (
          /** @type {Item} */
          type._start
        );
        let end = type._start;
        let startAttributes = create();
        const currentAttributes = copy(startAttributes);
        while (end) {
          if (end.deleted === false) {
            switch (end.content.constructor) {
              case ContentFormat:
                updateCurrentAttributes(
                  currentAttributes,
                  /** @type {ContentFormat} */
                  end.content
                );
                break;
              default:
                res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
                startAttributes = copy(currentAttributes);
                start = end;
                break;
            }
          }
          end = end.right;
        }
      }
    );
    return res;
  };
  var cleanupYTextAfterTransaction = (transaction) => {
    const needFullCleanup = /* @__PURE__ */ new Set();
    const doc5 = transaction.doc;
    for (const [client, afterClock] of transaction.afterState.entries()) {
      const clock = transaction.beforeState.get(client) || 0;
      if (afterClock === clock) {
        continue;
      }
      iterateStructs(
        transaction,
        /** @type {Array<Item|GC>} */
        doc5.store.clients.get(client),
        clock,
        afterClock,
        (item) => {
          if (!item.deleted && /** @type {Item} */
          item.content.constructor === ContentFormat && item.constructor !== GC) {
            needFullCleanup.add(
              /** @type {any} */
              item.parent
            );
          }
        }
      );
    }
    transact(doc5, (t) => {
      iterateDeletedStructs(transaction, transaction.deleteSet, (item) => {
        if (item instanceof GC || !/** @type {YText} */
        item.parent._hasFormatting || needFullCleanup.has(
          /** @type {YText} */
          item.parent
        )) {
          return;
        }
        const parent = (
          /** @type {YText} */
          item.parent
        );
        if (item.content.constructor === ContentFormat) {
          needFullCleanup.add(parent);
        } else {
          cleanupContextlessFormattingGap(t, item);
        }
      });
      for (const yText of needFullCleanup) {
        cleanupYTextFormatting(yText);
      }
    });
  };
  var deleteText = (transaction, currPos, length2) => {
    const startLength = length2;
    const startAttrs = copy(currPos.currentAttributes);
    const start = currPos.right;
    while (length2 > 0 && currPos.right !== null) {
      if (currPos.right.deleted === false) {
        switch (currPos.right.content.constructor) {
          case ContentType:
          case ContentEmbed:
          case ContentString:
            if (length2 < currPos.right.length) {
              getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
            }
            length2 -= currPos.right.length;
            currPos.right.delete(transaction);
            break;
        }
      }
      currPos.forward();
    }
    if (start) {
      cleanupFormattingGap(transaction, start, currPos.right, startAttrs, currPos.currentAttributes);
    }
    const parent = (
      /** @type {AbstractType<any>} */
      /** @type {Item} */
      (currPos.left || currPos.right).parent
    );
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, currPos.index, -startLength + length2);
    }
    return currPos;
  };
  var YTextEvent = class extends YEvent {
    /**
     * @param {YText} ytext
     * @param {Transaction} transaction
     * @param {Set<any>} subs The keys that changed
     */
    constructor(ytext, transaction, subs) {
      super(ytext, transaction);
      this.childListChanged = false;
      this.keysChanged = /* @__PURE__ */ new Set();
      subs.forEach((sub) => {
        if (sub === null) {
          this.childListChanged = true;
        } else {
          this.keysChanged.add(sub);
        }
      });
    }
    /**
     * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
     */
    get changes() {
      if (this._changes === null) {
        const changes = {
          keys: this.keys,
          delta: this.delta,
          added: /* @__PURE__ */ new Set(),
          deleted: /* @__PURE__ */ new Set()
        };
        this._changes = changes;
      }
      return (
        /** @type {any} */
        this._changes
      );
    }
    /**
     * Compute the changes in the delta format.
     * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
     *
     * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
     *
     * @public
     */
    get delta() {
      if (this._delta === null) {
        const y = (
          /** @type {Doc} */
          this.target.doc
        );
        const delta = [];
        transact(y, (transaction) => {
          const currentAttributes = /* @__PURE__ */ new Map();
          const oldAttributes = /* @__PURE__ */ new Map();
          let item = this.target._start;
          let action = null;
          const attributes = {};
          let insert = "";
          let retain = 0;
          let deleteLen = 0;
          const addOp = () => {
            if (action !== null) {
              let op = null;
              switch (action) {
                case "delete":
                  if (deleteLen > 0) {
                    op = { delete: deleteLen };
                  }
                  deleteLen = 0;
                  break;
                case "insert":
                  if (typeof insert === "object" || insert.length > 0) {
                    op = { insert };
                    if (currentAttributes.size > 0) {
                      op.attributes = {};
                      currentAttributes.forEach((value, key) => {
                        if (value !== null) {
                          op.attributes[key] = value;
                        }
                      });
                    }
                  }
                  insert = "";
                  break;
                case "retain":
                  if (retain > 0) {
                    op = { retain };
                    if (!isEmpty(attributes)) {
                      op.attributes = assign({}, attributes);
                    }
                  }
                  retain = 0;
                  break;
              }
              if (op) delta.push(op);
              action = null;
            }
          };
          while (item !== null) {
            switch (item.content.constructor) {
              case ContentType:
              case ContentEmbed:
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    addOp();
                    action = "insert";
                    insert = item.content.getContent()[0];
                    addOp();
                  }
                } else if (this.deletes(item)) {
                  if (action !== "delete") {
                    addOp();
                    action = "delete";
                  }
                  deleteLen += 1;
                } else if (!item.deleted) {
                  if (action !== "retain") {
                    addOp();
                    action = "retain";
                  }
                  retain += 1;
                }
                break;
              case ContentString:
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    if (action !== "insert") {
                      addOp();
                      action = "insert";
                    }
                    insert += /** @type {ContentString} */
                    item.content.str;
                  }
                } else if (this.deletes(item)) {
                  if (action !== "delete") {
                    addOp();
                    action = "delete";
                  }
                  deleteLen += item.length;
                } else if (!item.deleted) {
                  if (action !== "retain") {
                    addOp();
                    action = "retain";
                  }
                  retain += item.length;
                }
                break;
              case ContentFormat: {
                const { key, value } = (
                  /** @type {ContentFormat} */
                  item.content
                );
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    const curVal = currentAttributes.get(key) ?? null;
                    if (!equalAttrs(curVal, value)) {
                      if (action === "retain") {
                        addOp();
                      }
                      if (equalAttrs(value, oldAttributes.get(key) ?? null)) {
                        delete attributes[key];
                      } else {
                        attributes[key] = value;
                      }
                    } else if (value !== null) {
                      item.delete(transaction);
                    }
                  }
                } else if (this.deletes(item)) {
                  oldAttributes.set(key, value);
                  const curVal = currentAttributes.get(key) ?? null;
                  if (!equalAttrs(curVal, value)) {
                    if (action === "retain") {
                      addOp();
                    }
                    attributes[key] = curVal;
                  }
                } else if (!item.deleted) {
                  oldAttributes.set(key, value);
                  const attr = attributes[key];
                  if (attr !== void 0) {
                    if (!equalAttrs(attr, value)) {
                      if (action === "retain") {
                        addOp();
                      }
                      if (value === null) {
                        delete attributes[key];
                      } else {
                        attributes[key] = value;
                      }
                    } else if (attr !== null) {
                      item.delete(transaction);
                    }
                  }
                }
                if (!item.deleted) {
                  if (action === "insert") {
                    addOp();
                  }
                  updateCurrentAttributes(
                    currentAttributes,
                    /** @type {ContentFormat} */
                    item.content
                  );
                }
                break;
              }
            }
            item = item.right;
          }
          addOp();
          while (delta.length > 0) {
            const lastOp = delta[delta.length - 1];
            if (lastOp.retain !== void 0 && lastOp.attributes === void 0) {
              delta.pop();
            } else {
              break;
            }
          }
        });
        this._delta = delta;
      }
      return (
        /** @type {any} */
        this._delta
      );
    }
  };
  var YText = class _YText extends AbstractType {
    /**
     * @param {String} [string] The initial value of the YText.
     */
    constructor(string) {
      super();
      this._pending = string !== void 0 ? [() => this.insert(0, string)] : [];
      this._searchMarker = [];
      this._hasFormatting = false;
    }
    /**
     * Number of characters of this text type.
     *
     * @type {number}
     */
    get length() {
      this.doc ?? warnPrematureAccess();
      return this._length;
    }
    /**
     * @param {Doc} y
     * @param {Item} item
     */
    _integrate(y, item) {
      super._integrate(y, item);
      try {
        this._pending.forEach((f) => f());
      } catch (e) {
        console.error(e);
      }
      this._pending = null;
    }
    _copy() {
      return new _YText();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YText}
     */
    clone() {
      const text2 = new _YText();
      text2.applyDelta(this.toDelta());
      return text2;
    }
    /**
     * Creates YTextEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver(transaction, parentSubs) {
      super._callObserver(transaction, parentSubs);
      const event = new YTextEvent(this, transaction, parentSubs);
      callTypeObservers(this, transaction, event);
      if (!transaction.local && this._hasFormatting) {
        transaction._needFormattingCleanup = true;
      }
    }
    /**
     * Returns the unformatted string representation of this YText type.
     *
     * @public
     */
    toString() {
      this.doc ?? warnPrematureAccess();
      let str = "";
      let n = this._start;
      while (n !== null) {
        if (!n.deleted && n.countable && n.content.constructor === ContentString) {
          str += /** @type {ContentString} */
          n.content.str;
        }
        n = n.right;
      }
      return str;
    }
    /**
     * Returns the unformatted string representation of this YText type.
     *
     * @return {string}
     * @public
     */
    toJSON() {
      return this.toString();
    }
    /**
     * Apply a {@link Delta} on this shared YText type.
     *
     * @param {Array<any>} delta The changes to apply on this element.
     * @param {object}  opts
     * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
     *
     *
     * @public
     */
    applyDelta(delta, { sanitize = true } = {}) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          const currPos = new ItemTextListPosition(null, this._start, 0, /* @__PURE__ */ new Map());
          for (let i = 0; i < delta.length; i++) {
            const op = delta[i];
            if (op.insert !== void 0) {
              const ins = !sanitize && typeof op.insert === "string" && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === "\n" ? op.insert.slice(0, -1) : op.insert;
              if (typeof ins !== "string" || ins.length > 0) {
                insertText(transaction, this, currPos, ins, op.attributes || {});
              }
            } else if (op.retain !== void 0) {
              formatText(transaction, this, currPos, op.retain, op.attributes || {});
            } else if (op.delete !== void 0) {
              deleteText(transaction, currPos, op.delete);
            }
          }
        });
      } else {
        this._pending.push(() => this.applyDelta(delta));
      }
    }
    /**
     * Returns the Delta representation of this YText type.
     *
     * @param {Snapshot} [snapshot]
     * @param {Snapshot} [prevSnapshot]
     * @param {function('removed' | 'added', ID):any} [computeYChange]
     * @return {any} The Delta representation of this type.
     *
     * @public
     */
    toDelta(snapshot2, prevSnapshot, computeYChange) {
      this.doc ?? warnPrematureAccess();
      const ops = [];
      const currentAttributes = /* @__PURE__ */ new Map();
      const doc5 = (
        /** @type {Doc} */
        this.doc
      );
      let str = "";
      let n = this._start;
      function packStr() {
        if (str.length > 0) {
          const attributes = {};
          let addAttributes = false;
          currentAttributes.forEach((value, key) => {
            addAttributes = true;
            attributes[key] = value;
          });
          const op = { insert: str };
          if (addAttributes) {
            op.attributes = attributes;
          }
          ops.push(op);
          str = "";
        }
      }
      const computeDelta = () => {
        while (n !== null) {
          if (isVisible(n, snapshot2) || prevSnapshot !== void 0 && isVisible(n, prevSnapshot)) {
            switch (n.content.constructor) {
              case ContentString: {
                const cur = currentAttributes.get("ychange");
                if (snapshot2 !== void 0 && !isVisible(n, snapshot2)) {
                  if (cur === void 0 || cur.user !== n.id.client || cur.type !== "removed") {
                    packStr();
                    currentAttributes.set("ychange", computeYChange ? computeYChange("removed", n.id) : { type: "removed" });
                  }
                } else if (prevSnapshot !== void 0 && !isVisible(n, prevSnapshot)) {
                  if (cur === void 0 || cur.user !== n.id.client || cur.type !== "added") {
                    packStr();
                    currentAttributes.set("ychange", computeYChange ? computeYChange("added", n.id) : { type: "added" });
                  }
                } else if (cur !== void 0) {
                  packStr();
                  currentAttributes.delete("ychange");
                }
                str += /** @type {ContentString} */
                n.content.str;
                break;
              }
              case ContentType:
              case ContentEmbed: {
                packStr();
                const op = {
                  insert: n.content.getContent()[0]
                };
                if (currentAttributes.size > 0) {
                  const attrs = (
                    /** @type {Object<string,any>} */
                    {}
                  );
                  op.attributes = attrs;
                  currentAttributes.forEach((value, key) => {
                    attrs[key] = value;
                  });
                }
                ops.push(op);
                break;
              }
              case ContentFormat:
                if (isVisible(n, snapshot2)) {
                  packStr();
                  updateCurrentAttributes(
                    currentAttributes,
                    /** @type {ContentFormat} */
                    n.content
                  );
                }
                break;
            }
          }
          n = n.right;
        }
        packStr();
      };
      if (snapshot2 || prevSnapshot) {
        transact(doc5, (transaction) => {
          if (snapshot2) {
            splitSnapshotAffectedStructs(transaction, snapshot2);
          }
          if (prevSnapshot) {
            splitSnapshotAffectedStructs(transaction, prevSnapshot);
          }
          computeDelta();
        }, "cleanup");
      } else {
        computeDelta();
      }
      return ops;
    }
    /**
     * Insert text at a given index.
     *
     * @param {number} index The index at which to start inserting.
     * @param {String} text The text to insert at the specified position.
     * @param {TextAttributes} [attributes] Optionally define some formatting
     *                                    information to apply on the inserted
     *                                    Text.
     * @public
     */
    insert(index, text2, attributes) {
      if (text2.length <= 0) {
        return;
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          const pos = findPosition(transaction, this, index, !attributes);
          if (!attributes) {
            attributes = {};
            pos.currentAttributes.forEach((v, k) => {
              attributes[k] = v;
            });
          }
          insertText(transaction, this, pos, text2, attributes);
        });
      } else {
        this._pending.push(() => this.insert(index, text2, attributes));
      }
    }
    /**
     * Inserts an embed at a index.
     *
     * @param {number} index The index to insert the embed at.
     * @param {Object | AbstractType<any>} embed The Object that represents the embed.
     * @param {TextAttributes} [attributes] Attribute information to apply on the
     *                                    embed
     *
     * @public
     */
    insertEmbed(index, embed, attributes) {
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          const pos = findPosition(transaction, this, index, !attributes);
          insertText(transaction, this, pos, embed, attributes || {});
        });
      } else {
        this._pending.push(() => this.insertEmbed(index, embed, attributes || {}));
      }
    }
    /**
     * Deletes text starting from an index.
     *
     * @param {number} index Index at which to start deleting.
     * @param {number} length The number of characters to remove. Defaults to 1.
     *
     * @public
     */
    delete(index, length2) {
      if (length2 === 0) {
        return;
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          deleteText(transaction, findPosition(transaction, this, index, true), length2);
        });
      } else {
        this._pending.push(() => this.delete(index, length2));
      }
    }
    /**
     * Assigns properties to a range of text.
     *
     * @param {number} index The position where to start formatting.
     * @param {number} length The amount of characters to assign properties to.
     * @param {TextAttributes} attributes Attribute information to apply on the
     *                                    text.
     *
     * @public
     */
    format(index, length2, attributes) {
      if (length2 === 0) {
        return;
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          const pos = findPosition(transaction, this, index, false);
          if (pos.right === null) {
            return;
          }
          formatText(transaction, this, pos, length2, attributes);
        });
      } else {
        this._pending.push(() => this.format(index, length2, attributes));
      }
    }
    /**
     * Removes an attribute.
     *
     * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
     *
     * @param {String} attributeName The attribute name that is to be removed.
     *
     * @public
     */
    removeAttribute(attributeName) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapDelete(transaction, this, attributeName);
        });
      } else {
        this._pending.push(() => this.removeAttribute(attributeName));
      }
    }
    /**
     * Sets or updates an attribute.
     *
     * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
     *
     * @param {String} attributeName The attribute name that is to be set.
     * @param {any} attributeValue The attribute value that is to be set.
     *
     * @public
     */
    setAttribute(attributeName, attributeValue) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapSet(transaction, this, attributeName, attributeValue);
        });
      } else {
        this._pending.push(() => this.setAttribute(attributeName, attributeValue));
      }
    }
    /**
     * Returns an attribute value that belongs to the attribute name.
     *
     * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
     *
     * @param {String} attributeName The attribute name that identifies the
     *                               queried value.
     * @return {any} The queried attribute value.
     *
     * @public
     */
    getAttribute(attributeName) {
      return (
        /** @type {any} */
        typeMapGet(this, attributeName)
      );
    }
    /**
     * Returns all attribute name/value pairs in a JSON Object.
     *
     * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
     *
     * @return {Object<string, any>} A JSON Object that describes the attributes.
     *
     * @public
     */
    getAttributes() {
      return typeMapGetAll(this);
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     */
    _write(encoder) {
      encoder.writeTypeRef(YTextRefID);
    }
  };
  var readYText = (_decoder) => new YText();
  var YXmlTreeWalker = class {
    /**
     * @param {YXmlFragment | YXmlElement} root
     * @param {function(AbstractType<any>):boolean} [f]
     */
    constructor(root, f = () => true) {
      this._filter = f;
      this._root = root;
      this._currentNode = /** @type {Item} */
      root._start;
      this._firstCall = true;
      root.doc ?? warnPrematureAccess();
    }
    [Symbol.iterator]() {
      return this;
    }
    /**
     * Get the next node.
     *
     * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
     *
     * @public
     */
    next() {
      let n = this._currentNode;
      let type = n && n.content && /** @type {any} */
      n.content.type;
      if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) {
        do {
          type = /** @type {any} */
          n.content.type;
          if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
            n = type._start;
          } else {
            while (n !== null) {
              const nxt = n.next;
              if (nxt !== null) {
                n = nxt;
                break;
              } else if (n.parent === this._root) {
                n = null;
              } else {
                n = /** @type {AbstractType<any>} */
                n.parent._item;
              }
            }
          }
        } while (n !== null && (n.deleted || !this._filter(
          /** @type {ContentType} */
          n.content.type
        )));
      }
      this._firstCall = false;
      if (n === null) {
        return { value: void 0, done: true };
      }
      this._currentNode = n;
      return { value: (
        /** @type {any} */
        n.content.type
      ), done: false };
    }
  };
  var YXmlFragment = class _YXmlFragment extends AbstractType {
    constructor() {
      super();
      this._prelimContent = [];
    }
    /**
     * @type {YXmlElement|YXmlText|null}
     */
    get firstChild() {
      const first = this._first;
      return first ? first.content.getContent()[0] : null;
    }
    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate(y, item) {
      super._integrate(y, item);
      this.insert(
        0,
        /** @type {Array<any>} */
        this._prelimContent
      );
      this._prelimContent = null;
    }
    _copy() {
      return new _YXmlFragment();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YXmlFragment}
     */
    clone() {
      const el = new _YXmlFragment();
      el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
      return el;
    }
    get length() {
      this.doc ?? warnPrematureAccess();
      return this._prelimContent === null ? this._length : this._prelimContent.length;
    }
    /**
     * Create a subtree of childNodes.
     *
     * @example
     * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
     * for (let node in walker) {
     *   // `node` is a div node
     *   nop(node)
     * }
     *
     * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
     *                          returns a Boolean indicating whether the child
     *                          is to be included in the subtree.
     * @return {YXmlTreeWalker} A subtree and a position within it.
     *
     * @public
     */
    createTreeWalker(filter) {
      return new YXmlTreeWalker(this, filter);
    }
    /**
     * Returns the first YXmlElement that matches the query.
     * Similar to DOM's {@link querySelector}.
     *
     * Query support:
     *   - tagname
     * TODO:
     *   - id
     *   - attribute
     *
     * @param {CSS_Selector} query The query on the children.
     * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
     *
     * @public
     */
    querySelector(query) {
      query = query.toUpperCase();
      const iterator = new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query);
      const next = iterator.next();
      if (next.done) {
        return null;
      } else {
        return next.value;
      }
    }
    /**
     * Returns all YXmlElements that match the query.
     * Similar to Dom's {@link querySelectorAll}.
     *
     * @todo Does not yet support all queries. Currently only query by tagName.
     *
     * @param {CSS_Selector} query The query on the children
     * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
     *
     * @public
     */
    querySelectorAll(query) {
      query = query.toUpperCase();
      return from(new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query));
    }
    /**
     * Creates YXmlEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver(transaction, parentSubs) {
      callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
    }
    /**
     * Get the string representation of all the children of this YXmlFragment.
     *
     * @return {string} The string representation of all children.
     */
    toString() {
      return typeListMap(this, (xml) => xml.toString()).join("");
    }
    /**
     * @return {string}
     */
    toJSON() {
      return this.toString();
    }
    /**
     * Creates a Dom Element that mirrors this YXmlElement.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type.
     * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM(_document = document, hooks = {}, binding) {
      const fragment = _document.createDocumentFragment();
      if (binding !== void 0) {
        binding._createAssociation(fragment, this);
      }
      typeListForEach(this, (xmlType) => {
        fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
      });
      return fragment;
    }
    /**
     * Inserts new content at an index.
     *
     * @example
     *  // Insert character 'a' at position 0
     *  xml.insert(0, [new Y.XmlText('text')])
     *
     * @param {number} index The index to insert content at
     * @param {Array<YXmlElement|YXmlText>} content The array of content
     */
    insert(index, content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListInsertGenerics(transaction, this, index, content);
        });
      } else {
        this._prelimContent.splice(index, 0, ...content);
      }
    }
    /**
     * Inserts new content at an index.
     *
     * @example
     *  // Insert character 'a' at position 0
     *  xml.insert(0, [new Y.XmlText('text')])
     *
     * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
     * @param {Array<YXmlElement|YXmlText>} content The array of content
     */
    insertAfter(ref, content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          const refItem = ref && ref instanceof AbstractType ? ref._item : ref;
          typeListInsertGenericsAfter(transaction, this, refItem, content);
        });
      } else {
        const pc = (
          /** @type {Array<any>} */
          this._prelimContent
        );
        const index = ref === null ? 0 : pc.findIndex((el) => el === ref) + 1;
        if (index === 0 && ref !== null) {
          throw create3("Reference item not found");
        }
        pc.splice(index, 0, ...content);
      }
    }
    /**
     * Deletes elements starting from an index.
     *
     * @param {number} index Index at which to start deleting elements
     * @param {number} [length=1] The number of elements to remove. Defaults to 1.
     */
    delete(index, length2 = 1) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListDelete(transaction, this, index, length2);
        });
      } else {
        this._prelimContent.splice(index, length2);
      }
    }
    /**
     * Transforms this YArray to a JavaScript Array.
     *
     * @return {Array<YXmlElement|YXmlText|YXmlHook>}
     */
    toArray() {
      return typeListToArray(this);
    }
    /**
     * Appends content to this YArray.
     *
     * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
     */
    push(content) {
      this.insert(this.length, content);
    }
    /**
     * Prepends content to this YArray.
     *
     * @param {Array<YXmlElement|YXmlText>} content Array of content to prepend.
     */
    unshift(content) {
      this.insert(0, content);
    }
    /**
     * Returns the i-th element from a YArray.
     *
     * @param {number} index The index of the element to return from the YArray
     * @return {YXmlElement|YXmlText}
     */
    get(index) {
      return typeListGet(this, index);
    }
    /**
     * Returns a portion of this YXmlFragment into a JavaScript Array selected
     * from start to end (end not included).
     *
     * @param {number} [start]
     * @param {number} [end]
     * @return {Array<YXmlElement|YXmlText>}
     */
    slice(start = 0, end = this.length) {
      return typeListSlice(this, start, end);
    }
    /**
     * Executes a provided function on once on every child element.
     *
     * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
     */
    forEach(f) {
      typeListForEach(this, f);
    }
    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
     */
    _write(encoder) {
      encoder.writeTypeRef(YXmlFragmentRefID);
    }
  };
  var readYXmlFragment = (_decoder) => new YXmlFragment();
  var YXmlElement = class _YXmlElement extends YXmlFragment {
    constructor(nodeName = "UNDEFINED") {
      super();
      this.nodeName = nodeName;
      this._prelimAttrs = /* @__PURE__ */ new Map();
    }
    /**
     * @type {YXmlElement|YXmlText|null}
     */
    get nextSibling() {
      const n = this._item ? this._item.next : null;
      return n ? (
        /** @type {YXmlElement|YXmlText} */
        /** @type {ContentType} */
        n.content.type
      ) : null;
    }
    /**
     * @type {YXmlElement|YXmlText|null}
     */
    get prevSibling() {
      const n = this._item ? this._item.prev : null;
      return n ? (
        /** @type {YXmlElement|YXmlText} */
        /** @type {ContentType} */
        n.content.type
      ) : null;
    }
    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate(y, item) {
      super._integrate(y, item);
      /** @type {Map<string, any>} */
      this._prelimAttrs.forEach((value, key) => {
        this.setAttribute(key, value);
      });
      this._prelimAttrs = null;
    }
    /**
     * Creates an Item with the same effect as this Item (without position effect)
     *
     * @return {YXmlElement}
     */
    _copy() {
      return new _YXmlElement(this.nodeName);
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YXmlElement<KV>}
     */
    clone() {
      const el = new _YXmlElement(this.nodeName);
      const attrs = this.getAttributes();
      forEach(attrs, (value, key) => {
        if (typeof value === "string") {
          el.setAttribute(key, value);
        }
      });
      el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
      return el;
    }
    /**
     * Returns the XML serialization of this YXmlElement.
     * The attributes are ordered by attribute-name, so you can easily use this
     * method to compare YXmlElements
     *
     * @return {string} The string representation of this type.
     *
     * @public
     */
    toString() {
      const attrs = this.getAttributes();
      const stringBuilder = [];
      const keys3 = [];
      for (const key in attrs) {
        keys3.push(key);
      }
      keys3.sort();
      const keysLen = keys3.length;
      for (let i = 0; i < keysLen; i++) {
        const key = keys3[i];
        stringBuilder.push(key + '="' + attrs[key] + '"');
      }
      const nodeName = this.nodeName.toLocaleLowerCase();
      const attrsString = stringBuilder.length > 0 ? " " + stringBuilder.join(" ") : "";
      return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`;
    }
    /**
     * Removes an attribute from this YXmlElement.
     *
     * @param {string} attributeName The attribute name that is to be removed.
     *
     * @public
     */
    removeAttribute(attributeName) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapDelete(transaction, this, attributeName);
        });
      } else {
        this._prelimAttrs.delete(attributeName);
      }
    }
    /**
     * Sets or updates an attribute.
     *
     * @template {keyof KV & string} KEY
     *
     * @param {KEY} attributeName The attribute name that is to be set.
     * @param {KV[KEY]} attributeValue The attribute value that is to be set.
     *
     * @public
     */
    setAttribute(attributeName, attributeValue) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapSet(transaction, this, attributeName, attributeValue);
        });
      } else {
        this._prelimAttrs.set(attributeName, attributeValue);
      }
    }
    /**
     * Returns an attribute value that belongs to the attribute name.
     *
     * @template {keyof KV & string} KEY
     *
     * @param {KEY} attributeName The attribute name that identifies the
     *                               queried value.
     * @return {KV[KEY]|undefined} The queried attribute value.
     *
     * @public
     */
    getAttribute(attributeName) {
      return (
        /** @type {any} */
        typeMapGet(this, attributeName)
      );
    }
    /**
     * Returns whether an attribute exists
     *
     * @param {string} attributeName The attribute name to check for existence.
     * @return {boolean} whether the attribute exists.
     *
     * @public
     */
    hasAttribute(attributeName) {
      return (
        /** @type {any} */
        typeMapHas(this, attributeName)
      );
    }
    /**
     * Returns all attribute name/value pairs in a JSON Object.
     *
     * @param {Snapshot} [snapshot]
     * @return {{ [Key in Extract<keyof KV,string>]?: KV[Key]}} A JSON Object that describes the attributes.
     *
     * @public
     */
    getAttributes(snapshot2) {
      return (
        /** @type {any} */
        snapshot2 ? typeMapGetAllSnapshot(this, snapshot2) : typeMapGetAll(this)
      );
    }
    /**
     * Creates a Dom Element that mirrors this YXmlElement.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type.
     * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM(_document = document, hooks = {}, binding) {
      const dom = _document.createElement(this.nodeName);
      const attrs = this.getAttributes();
      for (const key in attrs) {
        const value = attrs[key];
        if (typeof value === "string") {
          dom.setAttribute(key, value);
        }
      }
      typeListForEach(this, (yxml) => {
        dom.appendChild(yxml.toDOM(_document, hooks, binding));
      });
      if (binding !== void 0) {
        binding._createAssociation(dom, this);
      }
      return dom;
    }
    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
     */
    _write(encoder) {
      encoder.writeTypeRef(YXmlElementRefID);
      encoder.writeKey(this.nodeName);
    }
  };
  var readYXmlElement = (decoder) => new YXmlElement(decoder.readKey());
  var YXmlEvent = class extends YEvent {
    /**
     * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
     * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
     *                   child list changed.
     * @param {Transaction} transaction The transaction instance with which the
     *                                  change was created.
     */
    constructor(target, subs, transaction) {
      super(target, transaction);
      this.childListChanged = false;
      this.attributesChanged = /* @__PURE__ */ new Set();
      subs.forEach((sub) => {
        if (sub === null) {
          this.childListChanged = true;
        } else {
          this.attributesChanged.add(sub);
        }
      });
    }
  };
  var YXmlHook = class _YXmlHook extends YMap {
    /**
     * @param {string} hookName nodeName of the Dom Node.
     */
    constructor(hookName) {
      super();
      this.hookName = hookName;
    }
    /**
     * Creates an Item with the same effect as this Item (without position effect)
     */
    _copy() {
      return new _YXmlHook(this.hookName);
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YXmlHook}
     */
    clone() {
      const el = new _YXmlHook(this.hookName);
      this.forEach((value, key) => {
        el.set(key, value);
      });
      return el;
    }
    /**
     * Creates a Dom Element that mirrors this YXmlElement.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type
     * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM(_document = document, hooks = {}, binding) {
      const hook = hooks[this.hookName];
      let dom;
      if (hook !== void 0) {
        dom = hook.createDom(this);
      } else {
        dom = document.createElement(this.hookName);
      }
      dom.setAttribute("data-yjs-hook", this.hookName);
      if (binding !== void 0) {
        binding._createAssociation(dom, this);
      }
      return dom;
    }
    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
     */
    _write(encoder) {
      encoder.writeTypeRef(YXmlHookRefID);
      encoder.writeKey(this.hookName);
    }
  };
  var readYXmlHook = (decoder) => new YXmlHook(decoder.readKey());
  var YXmlText = class _YXmlText extends YText {
    /**
     * @type {YXmlElement|YXmlText|null}
     */
    get nextSibling() {
      const n = this._item ? this._item.next : null;
      return n ? (
        /** @type {YXmlElement|YXmlText} */
        /** @type {ContentType} */
        n.content.type
      ) : null;
    }
    /**
     * @type {YXmlElement|YXmlText|null}
     */
    get prevSibling() {
      const n = this._item ? this._item.prev : null;
      return n ? (
        /** @type {YXmlElement|YXmlText} */
        /** @type {ContentType} */
        n.content.type
      ) : null;
    }
    _copy() {
      return new _YXmlText();
    }
    /**
     * Makes a copy of this data type that can be included somewhere else.
     *
     * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
     *
     * @return {YXmlText}
     */
    clone() {
      const text2 = new _YXmlText();
      text2.applyDelta(this.toDelta());
      return text2;
    }
    /**
     * Creates a Dom Element that mirrors this YXmlText.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object<string, any>} [hooks] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type.
     * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM(_document = document, hooks, binding) {
      const dom = _document.createTextNode(this.toString());
      if (binding !== void 0) {
        binding._createAssociation(dom, this);
      }
      return dom;
    }
    toString() {
      return this.toDelta().map((delta) => {
        const nestedNodes = [];
        for (const nodeName in delta.attributes) {
          const attrs = [];
          for (const key in delta.attributes[nodeName]) {
            attrs.push({ key, value: delta.attributes[nodeName][key] });
          }
          attrs.sort((a, b) => a.key < b.key ? -1 : 1);
          nestedNodes.push({ nodeName, attrs });
        }
        nestedNodes.sort((a, b) => a.nodeName < b.nodeName ? -1 : 1);
        let str = "";
        for (let i = 0; i < nestedNodes.length; i++) {
          const node = nestedNodes[i];
          str += `<${node.nodeName}`;
          for (let j = 0; j < node.attrs.length; j++) {
            const attr = node.attrs[j];
            str += ` ${attr.key}="${attr.value}"`;
          }
          str += ">";
        }
        str += delta.insert;
        for (let i = nestedNodes.length - 1; i >= 0; i--) {
          str += `</${nestedNodes[i].nodeName}>`;
        }
        return str;
      }).join("");
    }
    /**
     * @return {string}
     */
    toJSON() {
      return this.toString();
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     */
    _write(encoder) {
      encoder.writeTypeRef(YXmlTextRefID);
    }
  };
  var readYXmlText = (decoder) => new YXmlText();
  var AbstractStruct = class {
    /**
     * @param {ID} id
     * @param {number} length
     */
    constructor(id2, length2) {
      this.id = id2;
      this.length = length2;
    }
    /**
     * @type {boolean}
     */
    get deleted() {
      throw methodUnimplemented();
    }
    /**
     * Merge this struct with the item to the right.
     * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
     * Also this method does *not* remove right from StructStore!
     * @param {AbstractStruct} right
     * @return {boolean} whether this merged with right
     */
    mergeWith(right) {
      return false;
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
     * @param {number} offset
     * @param {number} encodingRef
     */
    write(encoder, offset, encodingRef) {
      throw methodUnimplemented();
    }
    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate(transaction, offset) {
      throw methodUnimplemented();
    }
  };
  var structGCRefNumber = 0;
  var GC = class extends AbstractStruct {
    get deleted() {
      return true;
    }
    delete() {
    }
    /**
     * @param {GC} right
     * @return {boolean}
     */
    mergeWith(right) {
      if (this.constructor !== right.constructor) {
        return false;
      }
      this.length += right.length;
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate(transaction, offset) {
      if (offset > 0) {
        this.id.clock += offset;
        this.length -= offset;
      }
      addStruct(transaction.doc.store, this);
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeInfo(structGCRefNumber);
      encoder.writeLen(this.length - offset);
    }
    /**
     * @param {Transaction} transaction
     * @param {StructStore} store
     * @return {null | number}
     */
    getMissing(transaction, store) {
      return null;
    }
  };
  var ContentBinary = class _ContentBinary {
    /**
     * @param {Uint8Array} content
     */
    constructor(content) {
      this.content = content;
    }
    /**
     * @return {number}
     */
    getLength() {
      return 1;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [this.content];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentBinary}
     */
    copy() {
      return new _ContentBinary(this.content);
    }
    /**
     * @param {number} offset
     * @return {ContentBinary}
     */
    splice(offset) {
      throw methodUnimplemented();
    }
    /**
     * @param {ContentBinary} right
     * @return {boolean}
     */
    mergeWith(right) {
      return false;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeBuf(this.content);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 3;
    }
  };
  var readContentBinary = (decoder) => new ContentBinary(decoder.readBuf());
  var ContentDeleted = class _ContentDeleted {
    /**
     * @param {number} len
     */
    constructor(len) {
      this.len = len;
    }
    /**
     * @return {number}
     */
    getLength() {
      return this.len;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return false;
    }
    /**
     * @return {ContentDeleted}
     */
    copy() {
      return new _ContentDeleted(this.len);
    }
    /**
     * @param {number} offset
     * @return {ContentDeleted}
     */
    splice(offset) {
      const right = new _ContentDeleted(this.len - offset);
      this.len = offset;
      return right;
    }
    /**
     * @param {ContentDeleted} right
     * @return {boolean}
     */
    mergeWith(right) {
      this.len += right.len;
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
      addToDeleteSet(transaction.deleteSet, item.id.client, item.id.clock, this.len);
      item.markDeleted();
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeLen(this.len - offset);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 1;
    }
  };
  var readContentDeleted = (decoder) => new ContentDeleted(decoder.readLen());
  var createDocFromOpts = (guid, opts) => new Doc({ guid, ...opts, shouldLoad: opts.shouldLoad || opts.autoLoad || false });
  var ContentDoc = class _ContentDoc {
    /**
     * @param {Doc} doc
     */
    constructor(doc5) {
      if (doc5._item) {
        console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid.");
      }
      this.doc = doc5;
      const opts = {};
      this.opts = opts;
      if (!doc5.gc) {
        opts.gc = false;
      }
      if (doc5.autoLoad) {
        opts.autoLoad = true;
      }
      if (doc5.meta !== null) {
        opts.meta = doc5.meta;
      }
    }
    /**
     * @return {number}
     */
    getLength() {
      return 1;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [this.doc];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentDoc}
     */
    copy() {
      return new _ContentDoc(createDocFromOpts(this.doc.guid, this.opts));
    }
    /**
     * @param {number} offset
     * @return {ContentDoc}
     */
    splice(offset) {
      throw methodUnimplemented();
    }
    /**
     * @param {ContentDoc} right
     * @return {boolean}
     */
    mergeWith(right) {
      return false;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
      this.doc._item = item;
      transaction.subdocsAdded.add(this.doc);
      if (this.doc.shouldLoad) {
        transaction.subdocsLoaded.add(this.doc);
      }
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
      if (transaction.subdocsAdded.has(this.doc)) {
        transaction.subdocsAdded.delete(this.doc);
      } else {
        transaction.subdocsRemoved.add(this.doc);
      }
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeString(this.doc.guid);
      encoder.writeAny(this.opts);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 9;
    }
  };
  var readContentDoc = (decoder) => new ContentDoc(createDocFromOpts(decoder.readString(), decoder.readAny()));
  var ContentEmbed = class _ContentEmbed {
    /**
     * @param {Object} embed
     */
    constructor(embed) {
      this.embed = embed;
    }
    /**
     * @return {number}
     */
    getLength() {
      return 1;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [this.embed];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentEmbed}
     */
    copy() {
      return new _ContentEmbed(this.embed);
    }
    /**
     * @param {number} offset
     * @return {ContentEmbed}
     */
    splice(offset) {
      throw methodUnimplemented();
    }
    /**
     * @param {ContentEmbed} right
     * @return {boolean}
     */
    mergeWith(right) {
      return false;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeJSON(this.embed);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 5;
    }
  };
  var readContentEmbed = (decoder) => new ContentEmbed(decoder.readJSON());
  var ContentFormat = class _ContentFormat {
    /**
     * @param {string} key
     * @param {Object} value
     */
    constructor(key, value) {
      this.key = key;
      this.value = value;
    }
    /**
     * @return {number}
     */
    getLength() {
      return 1;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return false;
    }
    /**
     * @return {ContentFormat}
     */
    copy() {
      return new _ContentFormat(this.key, this.value);
    }
    /**
     * @param {number} _offset
     * @return {ContentFormat}
     */
    splice(_offset) {
      throw methodUnimplemented();
    }
    /**
     * @param {ContentFormat} _right
     * @return {boolean}
     */
    mergeWith(_right) {
      return false;
    }
    /**
     * @param {Transaction} _transaction
     * @param {Item} item
     */
    integrate(_transaction, item) {
      const p = (
        /** @type {YText} */
        item.parent
      );
      p._searchMarker = null;
      p._hasFormatting = true;
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeKey(this.key);
      encoder.writeJSON(this.value);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 6;
    }
  };
  var readContentFormat = (decoder) => new ContentFormat(decoder.readKey(), decoder.readJSON());
  var ContentJSON = class _ContentJSON {
    /**
     * @param {Array<any>} arr
     */
    constructor(arr) {
      this.arr = arr;
    }
    /**
     * @return {number}
     */
    getLength() {
      return this.arr.length;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return this.arr;
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentJSON}
     */
    copy() {
      return new _ContentJSON(this.arr);
    }
    /**
     * @param {number} offset
     * @return {ContentJSON}
     */
    splice(offset) {
      const right = new _ContentJSON(this.arr.slice(offset));
      this.arr = this.arr.slice(0, offset);
      return right;
    }
    /**
     * @param {ContentJSON} right
     * @return {boolean}
     */
    mergeWith(right) {
      this.arr = this.arr.concat(right.arr);
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      const len = this.arr.length;
      encoder.writeLen(len - offset);
      for (let i = offset; i < len; i++) {
        const c = this.arr[i];
        encoder.writeString(c === void 0 ? "undefined" : JSON.stringify(c));
      }
    }
    /**
     * @return {number}
     */
    getRef() {
      return 2;
    }
  };
  var readContentJSON = (decoder) => {
    const len = decoder.readLen();
    const cs = [];
    for (let i = 0; i < len; i++) {
      const c = decoder.readString();
      if (c === "undefined") {
        cs.push(void 0);
      } else {
        cs.push(JSON.parse(c));
      }
    }
    return new ContentJSON(cs);
  };
  var isDevMode = getVariable("node_env") === "development";
  var ContentAny = class _ContentAny {
    /**
     * @param {Array<any>} arr
     */
    constructor(arr) {
      this.arr = arr;
      isDevMode && deepFreeze(arr);
    }
    /**
     * @return {number}
     */
    getLength() {
      return this.arr.length;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return this.arr;
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentAny}
     */
    copy() {
      return new _ContentAny(this.arr);
    }
    /**
     * @param {number} offset
     * @return {ContentAny}
     */
    splice(offset) {
      const right = new _ContentAny(this.arr.slice(offset));
      this.arr = this.arr.slice(0, offset);
      return right;
    }
    /**
     * @param {ContentAny} right
     * @return {boolean}
     */
    mergeWith(right) {
      this.arr = this.arr.concat(right.arr);
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      const len = this.arr.length;
      encoder.writeLen(len - offset);
      for (let i = offset; i < len; i++) {
        const c = this.arr[i];
        encoder.writeAny(c);
      }
    }
    /**
     * @return {number}
     */
    getRef() {
      return 8;
    }
  };
  var readContentAny = (decoder) => {
    const len = decoder.readLen();
    const cs = [];
    for (let i = 0; i < len; i++) {
      cs.push(decoder.readAny());
    }
    return new ContentAny(cs);
  };
  var ContentString = class _ContentString {
    /**
     * @param {string} str
     */
    constructor(str) {
      this.str = str;
    }
    /**
     * @return {number}
     */
    getLength() {
      return this.str.length;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return this.str.split("");
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentString}
     */
    copy() {
      return new _ContentString(this.str);
    }
    /**
     * @param {number} offset
     * @return {ContentString}
     */
    splice(offset) {
      const right = new _ContentString(this.str.slice(offset));
      this.str = this.str.slice(0, offset);
      const firstCharCode = this.str.charCodeAt(offset - 1);
      if (firstCharCode >= 55296 && firstCharCode <= 56319) {
        this.str = this.str.slice(0, offset - 1) + "\uFFFD";
        right.str = "\uFFFD" + right.str.slice(1);
      }
      return right;
    }
    /**
     * @param {ContentString} right
     * @return {boolean}
     */
    mergeWith(right) {
      this.str += right.str;
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
    }
    /**
     * @return {number}
     */
    getRef() {
      return 4;
    }
  };
  var readContentString = (decoder) => new ContentString(decoder.readString());
  var typeRefs = [
    readYArray,
    readYMap,
    readYText,
    readYXmlElement,
    readYXmlFragment,
    readYXmlHook,
    readYXmlText
  ];
  var YArrayRefID = 0;
  var YMapRefID = 1;
  var YTextRefID = 2;
  var YXmlElementRefID = 3;
  var YXmlFragmentRefID = 4;
  var YXmlHookRefID = 5;
  var YXmlTextRefID = 6;
  var ContentType = class _ContentType {
    /**
     * @param {AbstractType<any>} type
     */
    constructor(type) {
      this.type = type;
    }
    /**
     * @return {number}
     */
    getLength() {
      return 1;
    }
    /**
     * @return {Array<any>}
     */
    getContent() {
      return [this.type];
    }
    /**
     * @return {boolean}
     */
    isCountable() {
      return true;
    }
    /**
     * @return {ContentType}
     */
    copy() {
      return new _ContentType(this.type._copy());
    }
    /**
     * @param {number} offset
     * @return {ContentType}
     */
    splice(offset) {
      throw methodUnimplemented();
    }
    /**
     * @param {ContentType} right
     * @return {boolean}
     */
    mergeWith(right) {
      return false;
    }
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction, item) {
      this.type._integrate(transaction.doc, item);
    }
    /**
     * @param {Transaction} transaction
     */
    delete(transaction) {
      let item = this.type._start;
      while (item !== null) {
        if (!item.deleted) {
          item.delete(transaction);
        } else if (item.id.clock < (transaction.beforeState.get(item.id.client) || 0)) {
          transaction._mergeStructs.push(item);
        }
        item = item.right;
      }
      this.type._map.forEach((item2) => {
        if (!item2.deleted) {
          item2.delete(transaction);
        } else if (item2.id.clock < (transaction.beforeState.get(item2.id.client) || 0)) {
          transaction._mergeStructs.push(item2);
        }
      });
      transaction.changed.delete(this.type);
    }
    /**
     * @param {StructStore} store
     */
    gc(store) {
      let item = this.type._start;
      while (item !== null) {
        item.gc(store, true);
        item = item.right;
      }
      this.type._start = null;
      this.type._map.forEach(
        /** @param {Item | null} item */
        (item2) => {
          while (item2 !== null) {
            item2.gc(store, true);
            item2 = item2.left;
          }
        }
      );
      this.type._map = /* @__PURE__ */ new Map();
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      this.type._write(encoder);
    }
    /**
     * @return {number}
     */
    getRef() {
      return 7;
    }
  };
  var readContentType = (decoder) => new ContentType(typeRefs[decoder.readTypeRef()](decoder));
  var followRedone = (store, id2) => {
    let nextID = id2;
    let diff = 0;
    let item;
    do {
      if (diff > 0) {
        nextID = createID(nextID.client, nextID.clock + diff);
      }
      item = getItem(store, nextID);
      diff = nextID.clock - item.id.clock;
      nextID = item.redone;
    } while (nextID !== null && item instanceof Item);
    return {
      item,
      diff
    };
  };
  var keepItem = (item, keep) => {
    while (item !== null && item.keep !== keep) {
      item.keep = keep;
      item = /** @type {AbstractType<any>} */
      item.parent._item;
    }
  };
  var splitItem = (transaction, leftItem, diff) => {
    const { client, clock } = leftItem.id;
    const rightItem = new Item(
      createID(client, clock + diff),
      leftItem,
      createID(client, clock + diff - 1),
      leftItem.right,
      leftItem.rightOrigin,
      leftItem.parent,
      leftItem.parentSub,
      leftItem.content.splice(diff)
    );
    if (leftItem.deleted) {
      rightItem.markDeleted();
    }
    if (leftItem.keep) {
      rightItem.keep = true;
    }
    if (leftItem.redone !== null) {
      rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
    }
    leftItem.right = rightItem;
    if (rightItem.right !== null) {
      rightItem.right.left = rightItem;
    }
    transaction._mergeStructs.push(rightItem);
    if (rightItem.parentSub !== null && rightItem.right === null) {
      rightItem.parent._map.set(rightItem.parentSub, rightItem);
    }
    leftItem.length = diff;
    return rightItem;
  };
  var isDeletedByUndoStack = (stack, id2) => some(
    stack,
    /** @param {StackItem} s */
    (s) => isDeleted(s.deletions, id2)
  );
  var redoItem = (transaction, item, redoitems, itemsToDelete, ignoreRemoteMapChanges, um) => {
    const doc5 = transaction.doc;
    const store = doc5.store;
    const ownClientID = doc5.clientID;
    const redone = item.redone;
    if (redone !== null) {
      return getItemCleanStart(transaction, redone);
    }
    let parentItem = (
      /** @type {AbstractType<any>} */
      item.parent._item
    );
    let left = null;
    let right;
    if (parentItem !== null && parentItem.deleted === true) {
      if (parentItem.redone === null && (!redoitems.has(parentItem) || redoItem(transaction, parentItem, redoitems, itemsToDelete, ignoreRemoteMapChanges, um) === null)) {
        return null;
      }
      while (parentItem.redone !== null) {
        parentItem = getItemCleanStart(transaction, parentItem.redone);
      }
    }
    const parentType = parentItem === null ? (
      /** @type {AbstractType<any>} */
      item.parent
    ) : (
      /** @type {ContentType} */
      parentItem.content.type
    );
    if (item.parentSub === null) {
      left = item.left;
      right = item;
      while (left !== null) {
        let leftTrace = left;
        while (leftTrace !== null && /** @type {AbstractType<any>} */
        leftTrace.parent._item !== parentItem) {
          leftTrace = leftTrace.redone === null ? null : getItemCleanStart(transaction, leftTrace.redone);
        }
        if (leftTrace !== null && /** @type {AbstractType<any>} */
        leftTrace.parent._item === parentItem) {
          left = leftTrace;
          break;
        }
        left = left.left;
      }
      while (right !== null) {
        let rightTrace = right;
        while (rightTrace !== null && /** @type {AbstractType<any>} */
        rightTrace.parent._item !== parentItem) {
          rightTrace = rightTrace.redone === null ? null : getItemCleanStart(transaction, rightTrace.redone);
        }
        if (rightTrace !== null && /** @type {AbstractType<any>} */
        rightTrace.parent._item === parentItem) {
          right = rightTrace;
          break;
        }
        right = right.right;
      }
    } else {
      right = null;
      if (item.right && !ignoreRemoteMapChanges) {
        left = item;
        while (left !== null && left.right !== null && (left.right.redone || isDeleted(itemsToDelete, left.right.id) || isDeletedByUndoStack(um.undoStack, left.right.id) || isDeletedByUndoStack(um.redoStack, left.right.id))) {
          left = left.right;
          while (left.redone) left = getItemCleanStart(transaction, left.redone);
        }
        if (left && left.right !== null) {
          return null;
        }
      } else {
        left = parentType._map.get(item.parentSub) || null;
      }
    }
    const nextClock = getState(store, ownClientID);
    const nextId = createID(ownClientID, nextClock);
    const redoneItem = new Item(
      nextId,
      left,
      left && left.lastId,
      right,
      right && right.id,
      parentType,
      item.parentSub,
      item.content.copy()
    );
    item.redone = nextId;
    keepItem(redoneItem, true);
    redoneItem.integrate(transaction, 0);
    return redoneItem;
  };
  var Item = class _Item extends AbstractStruct {
    /**
     * @param {ID} id
     * @param {Item | null} left
     * @param {ID | null} origin
     * @param {Item | null} right
     * @param {ID | null} rightOrigin
     * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
     * @param {string | null} parentSub
     * @param {AbstractContent} content
     */
    constructor(id2, left, origin, right, rightOrigin, parent, parentSub, content) {
      super(id2, content.getLength());
      this.origin = origin;
      this.left = left;
      this.right = right;
      this.rightOrigin = rightOrigin;
      this.parent = parent;
      this.parentSub = parentSub;
      this.redone = null;
      this.content = content;
      this.info = this.content.isCountable() ? BIT2 : 0;
    }
    /**
     * This is used to mark the item as an indexed fast-search marker
     *
     * @type {boolean}
     */
    set marker(isMarked) {
      if ((this.info & BIT4) > 0 !== isMarked) {
        this.info ^= BIT4;
      }
    }
    get marker() {
      return (this.info & BIT4) > 0;
    }
    /**
     * If true, do not garbage collect this Item.
     */
    get keep() {
      return (this.info & BIT1) > 0;
    }
    set keep(doKeep) {
      if (this.keep !== doKeep) {
        this.info ^= BIT1;
      }
    }
    get countable() {
      return (this.info & BIT2) > 0;
    }
    /**
     * Whether this item was deleted or not.
     * @type {Boolean}
     */
    get deleted() {
      return (this.info & BIT3) > 0;
    }
    set deleted(doDelete) {
      if (this.deleted !== doDelete) {
        this.info ^= BIT3;
      }
    }
    markDeleted() {
      this.info |= BIT3;
    }
    /**
     * Return the creator clientID of the missing op or define missing items and return null.
     *
     * @param {Transaction} transaction
     * @param {StructStore} store
     * @return {null | number}
     */
    getMissing(transaction, store) {
      if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
        return this.origin.client;
      }
      if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
        return this.rightOrigin.client;
      }
      if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
        return this.parent.client;
      }
      if (this.origin) {
        this.left = getItemCleanEnd(transaction, store, this.origin);
        this.origin = this.left.lastId;
      }
      if (this.rightOrigin) {
        this.right = getItemCleanStart(transaction, this.rightOrigin);
        this.rightOrigin = this.right.id;
      }
      if (this.left && this.left.constructor === GC || this.right && this.right.constructor === GC) {
        this.parent = null;
      } else if (!this.parent) {
        if (this.left && this.left.constructor === _Item) {
          this.parent = this.left.parent;
          this.parentSub = this.left.parentSub;
        } else if (this.right && this.right.constructor === _Item) {
          this.parent = this.right.parent;
          this.parentSub = this.right.parentSub;
        }
      } else if (this.parent.constructor === ID) {
        const parentItem = getItem(store, this.parent);
        if (parentItem.constructor === GC) {
          this.parent = null;
        } else {
          this.parent = /** @type {ContentType} */
          parentItem.content.type;
        }
      }
      return null;
    }
    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate(transaction, offset) {
      if (offset > 0) {
        this.id.clock += offset;
        this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
        this.origin = this.left.lastId;
        this.content = this.content.splice(offset);
        this.length -= offset;
      }
      if (this.parent) {
        if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
          let left = this.left;
          let o;
          if (left !== null) {
            o = left.right;
          } else if (this.parentSub !== null) {
            o = /** @type {AbstractType<any>} */
            this.parent._map.get(this.parentSub) || null;
            while (o !== null && o.left !== null) {
              o = o.left;
            }
          } else {
            o = /** @type {AbstractType<any>} */
            this.parent._start;
          }
          const conflictingItems = /* @__PURE__ */ new Set();
          const itemsBeforeOrigin = /* @__PURE__ */ new Set();
          while (o !== null && o !== this.right) {
            itemsBeforeOrigin.add(o);
            conflictingItems.add(o);
            if (compareIDs(this.origin, o.origin)) {
              if (o.id.client < this.id.client) {
                left = o;
                conflictingItems.clear();
              } else if (compareIDs(this.rightOrigin, o.rightOrigin)) {
                break;
              }
            } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) {
              if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
                left = o;
                conflictingItems.clear();
              }
            } else {
              break;
            }
            o = o.right;
          }
          this.left = left;
        }
        if (this.left !== null) {
          const right = this.left.right;
          this.right = right;
          this.left.right = this;
        } else {
          let r;
          if (this.parentSub !== null) {
            r = /** @type {AbstractType<any>} */
            this.parent._map.get(this.parentSub) || null;
            while (r !== null && r.left !== null) {
              r = r.left;
            }
          } else {
            r = /** @type {AbstractType<any>} */
            this.parent._start;
            this.parent._start = this;
          }
          this.right = r;
        }
        if (this.right !== null) {
          this.right.left = this;
        } else if (this.parentSub !== null) {
          this.parent._map.set(this.parentSub, this);
          if (this.left !== null) {
            this.left.delete(transaction);
          }
        }
        if (this.parentSub === null && this.countable && !this.deleted) {
          this.parent._length += this.length;
        }
        addStruct(transaction.doc.store, this);
        this.content.integrate(transaction, this);
        addChangedTypeToTransaction(
          transaction,
          /** @type {AbstractType<any>} */
          this.parent,
          this.parentSub
        );
        if (
          /** @type {AbstractType<any>} */
          this.parent._item !== null && /** @type {AbstractType<any>} */
          this.parent._item.deleted || this.parentSub !== null && this.right !== null
        ) {
          this.delete(transaction);
        }
      } else {
        new GC(this.id, this.length).integrate(transaction, 0);
      }
    }
    /**
     * Returns the next non-deleted item
     */
    get next() {
      let n = this.right;
      while (n !== null && n.deleted) {
        n = n.right;
      }
      return n;
    }
    /**
     * Returns the previous non-deleted item
     */
    get prev() {
      let n = this.left;
      while (n !== null && n.deleted) {
        n = n.left;
      }
      return n;
    }
    /**
     * Computes the last content address of this Item.
     */
    get lastId() {
      return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1);
    }
    /**
     * Try to merge two items
     *
     * @param {Item} right
     * @return {boolean}
     */
    mergeWith(right) {
      if (this.constructor === right.constructor && compareIDs(right.origin, this.lastId) && this.right === right && compareIDs(this.rightOrigin, right.rightOrigin) && this.id.client === right.id.client && this.id.clock + this.length === right.id.clock && this.deleted === right.deleted && this.redone === null && right.redone === null && this.content.constructor === right.content.constructor && this.content.mergeWith(right.content)) {
        const searchMarker = (
          /** @type {AbstractType<any>} */
          this.parent._searchMarker
        );
        if (searchMarker) {
          searchMarker.forEach((marker) => {
            if (marker.p === right) {
              marker.p = this;
              if (!this.deleted && this.countable) {
                marker.index -= this.length;
              }
            }
          });
        }
        if (right.keep) {
          this.keep = true;
        }
        this.right = right.right;
        if (this.right !== null) {
          this.right.left = this;
        }
        this.length += right.length;
        return true;
      }
      return false;
    }
    /**
     * Mark this Item as deleted.
     *
     * @param {Transaction} transaction
     */
    delete(transaction) {
      if (!this.deleted) {
        const parent = (
          /** @type {AbstractType<any>} */
          this.parent
        );
        if (this.countable && this.parentSub === null) {
          parent._length -= this.length;
        }
        this.markDeleted();
        addToDeleteSet(transaction.deleteSet, this.id.client, this.id.clock, this.length);
        addChangedTypeToTransaction(transaction, parent, this.parentSub);
        this.content.delete(transaction);
      }
    }
    /**
     * @param {StructStore} store
     * @param {boolean} parentGCd
     */
    gc(store, parentGCd) {
      if (!this.deleted) {
        throw unexpectedCase();
      }
      this.content.gc(store);
      if (parentGCd) {
        replaceStruct(store, this, new GC(this.id, this.length));
      } else {
        this.content = new ContentDeleted(this.length);
      }
    }
    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
     * @param {number} offset
     */
    write(encoder, offset) {
      const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
      const rightOrigin = this.rightOrigin;
      const parentSub = this.parentSub;
      const info = this.content.getRef() & BITS5 | (origin === null ? 0 : BIT8) | // origin is defined
      (rightOrigin === null ? 0 : BIT7) | // right origin is defined
      (parentSub === null ? 0 : BIT6);
      encoder.writeInfo(info);
      if (origin !== null) {
        encoder.writeLeftID(origin);
      }
      if (rightOrigin !== null) {
        encoder.writeRightID(rightOrigin);
      }
      if (origin === null && rightOrigin === null) {
        const parent = (
          /** @type {AbstractType<any>} */
          this.parent
        );
        if (parent._item !== void 0) {
          const parentItem = parent._item;
          if (parentItem === null) {
            const ykey = findRootTypeKey(parent);
            encoder.writeParentInfo(true);
            encoder.writeString(ykey);
          } else {
            encoder.writeParentInfo(false);
            encoder.writeLeftID(parentItem.id);
          }
        } else if (parent.constructor === String) {
          encoder.writeParentInfo(true);
          encoder.writeString(parent);
        } else if (parent.constructor === ID) {
          encoder.writeParentInfo(false);
          encoder.writeLeftID(parent);
        } else {
          unexpectedCase();
        }
        if (parentSub !== null) {
          encoder.writeString(parentSub);
        }
      }
      this.content.write(encoder, offset);
    }
  };
  var readItemContent = (decoder, info) => contentRefs[info & BITS5](decoder);
  var contentRefs = [
    () => {
      unexpectedCase();
    },
    // GC is not ItemContent
    readContentDeleted,
    // 1
    readContentJSON,
    // 2
    readContentBinary,
    // 3
    readContentString,
    // 4
    readContentEmbed,
    // 5
    readContentFormat,
    // 6
    readContentType,
    // 7
    readContentAny,
    // 8
    readContentDoc,
    // 9
    () => {
      unexpectedCase();
    }
    // 10 - Skip is not ItemContent
  ];
  var structSkipRefNumber = 10;
  var Skip = class extends AbstractStruct {
    get deleted() {
      return true;
    }
    delete() {
    }
    /**
     * @param {Skip} right
     * @return {boolean}
     */
    mergeWith(right) {
      if (this.constructor !== right.constructor) {
        return false;
      }
      this.length += right.length;
      return true;
    }
    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate(transaction, offset) {
      unexpectedCase();
    }
    /**
     * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
     * @param {number} offset
     */
    write(encoder, offset) {
      encoder.writeInfo(structSkipRefNumber);
      writeVarUint(encoder.restEncoder, this.length - offset);
    }
    /**
     * @param {Transaction} transaction
     * @param {StructStore} store
     * @return {null | number}
     */
    getMissing(transaction, store) {
      return null;
    }
  };
  var glo = (
    /** @type {any} */
    typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}
  );
  var importIdentifier = "__ $YJS$ __";
  if (glo[importIdentifier] === true) {
    console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
  }
  glo[importIdentifier] = true;

  // node_modules/fractional-indexing/src/index.js
  var BASE_62_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  function midpoint(a, b, digits) {
    const zero = digits[0];
    if (b != null && a >= b) {
      throw new Error(a + " >= " + b);
    }
    if (a.slice(-1) === zero || b && b.slice(-1) === zero) {
      throw new Error("trailing zero");
    }
    if (b) {
      let n = 0;
      while ((a[n] || zero) === b[n]) {
        n++;
      }
      if (n > 0) {
        return b.slice(0, n) + midpoint(a.slice(n), b.slice(n), digits);
      }
    }
    const digitA = a ? digits.indexOf(a[0]) : 0;
    const digitB = b != null ? digits.indexOf(b[0]) : digits.length;
    if (digitB - digitA > 1) {
      const midDigit = Math.round(0.5 * (digitA + digitB));
      return digits[midDigit];
    } else {
      if (b && b.length > 1) {
        return b.slice(0, 1);
      } else {
        return digits[digitA] + midpoint(a.slice(1), null, digits);
      }
    }
  }
  function validateInteger(int) {
    if (int.length !== getIntegerLength(int[0])) {
      throw new Error("invalid integer part of order key: " + int);
    }
  }
  function getIntegerLength(head) {
    if (head >= "a" && head <= "z") {
      return head.charCodeAt(0) - "a".charCodeAt(0) + 2;
    } else if (head >= "A" && head <= "Z") {
      return "Z".charCodeAt(0) - head.charCodeAt(0) + 2;
    } else {
      throw new Error("invalid order key head: " + head);
    }
  }
  function getIntegerPart(key) {
    const integerPartLength = getIntegerLength(key[0]);
    if (integerPartLength > key.length) {
      throw new Error("invalid order key: " + key);
    }
    return key.slice(0, integerPartLength);
  }
  function validateOrderKey(key, digits) {
    if (key === "A" + digits[0].repeat(26)) {
      throw new Error("invalid order key: " + key);
    }
    const i = getIntegerPart(key);
    const f = key.slice(i.length);
    if (f.slice(-1) === digits[0]) {
      throw new Error("invalid order key: " + key);
    }
  }
  function incrementInteger(x, digits) {
    validateInteger(x);
    const [head, ...digs] = x.split("");
    let carry = true;
    for (let i = digs.length - 1; carry && i >= 0; i--) {
      const d = digits.indexOf(digs[i]) + 1;
      if (d === digits.length) {
        digs[i] = digits[0];
      } else {
        digs[i] = digits[d];
        carry = false;
      }
    }
    if (carry) {
      if (head === "Z") {
        return "a" + digits[0];
      }
      if (head === "z") {
        return null;
      }
      const h = String.fromCharCode(head.charCodeAt(0) + 1);
      if (h > "a") {
        digs.push(digits[0]);
      } else {
        digs.pop();
      }
      return h + digs.join("");
    } else {
      return head + digs.join("");
    }
  }
  function decrementInteger(x, digits) {
    validateInteger(x);
    const [head, ...digs] = x.split("");
    let borrow = true;
    for (let i = digs.length - 1; borrow && i >= 0; i--) {
      const d = digits.indexOf(digs[i]) - 1;
      if (d === -1) {
        digs[i] = digits.slice(-1);
      } else {
        digs[i] = digits[d];
        borrow = false;
      }
    }
    if (borrow) {
      if (head === "a") {
        return "Z" + digits.slice(-1);
      }
      if (head === "A") {
        return null;
      }
      const h = String.fromCharCode(head.charCodeAt(0) - 1);
      if (h < "Z") {
        digs.push(digits.slice(-1));
      } else {
        digs.pop();
      }
      return h + digs.join("");
    } else {
      return head + digs.join("");
    }
  }
  function generateKeyBetween(a, b, digits = BASE_62_DIGITS) {
    if (a != null) {
      validateOrderKey(a, digits);
    }
    if (b != null) {
      validateOrderKey(b, digits);
    }
    if (a != null && b != null && a >= b) {
      throw new Error(a + " >= " + b);
    }
    if (a == null) {
      if (b == null) {
        return "a" + digits[0];
      }
      const ib2 = getIntegerPart(b);
      const fb2 = b.slice(ib2.length);
      if (ib2 === "A" + digits[0].repeat(26)) {
        return ib2 + midpoint("", fb2, digits);
      }
      if (ib2 < b) {
        return ib2;
      }
      const res = decrementInteger(ib2, digits);
      if (res == null) {
        throw new Error("cannot decrement any more");
      }
      return res;
    }
    if (b == null) {
      const ia2 = getIntegerPart(a);
      const fa2 = a.slice(ia2.length);
      const i2 = incrementInteger(ia2, digits);
      return i2 == null ? ia2 + midpoint(fa2, null, digits) : i2;
    }
    const ia = getIntegerPart(a);
    const fa = a.slice(ia.length);
    const ib = getIntegerPart(b);
    const fb = b.slice(ib.length);
    if (ia === ib) {
      return ia + midpoint(fa, fb, digits);
    }
    const i = incrementInteger(ia, digits);
    if (i == null) {
      throw new Error("cannot increment any more");
    }
    if (i < b) {
      return i;
    }
    return ia + midpoint(fa, null, digits);
  }

  // model.js
  var forbidden = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
  var same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  var object = (value) => value && typeof value === "object" && !Array.isArray(value);
  var keyed = (value) => Array.isArray(value) && value.every((item) => object(item) && (item.id || item.uid));
  var identity = (item) => String(item.id || item.uid);
  var textual = (key) => /^(subject|summary|content|text|title|description|name|author|salutation|closing|intro|caption|heroCaption|contactNote)$/.test(key);
  function replaceText(type, before, after) {
    let start = 0;
    while (start < before.length && start < after.length && before[start] === after[start]) start++;
    let end = 0;
    while (end < before.length - start && end < after.length - start && before.at(-end - 1) === after.at(-end - 1)) end++;
    if (before.length - start - end) type.delete(start, before.length - start - end);
    if (after.length - start - end) type.insert(start, after.slice(start, after.length - end));
  }
  function encode2(value, key) {
    if (typeof value === "string" && textual(key)) return new YText(value);
    if (keyed(value)) {
      const result = new YMap(), items = new YMap(), positions = new YMap();
      result.set("_kind", "list");
      result.set("_items", items);
      result.set("_positions", positions);
      let position = null;
      value.forEach((item) => {
        const id2 = identity(item);
        items.set(id2, encode2(item));
        position = generateKeyBetween(position, null);
        positions.set(id2, position);
      });
      return result;
    }
    if (object(value)) {
      const result = new YMap();
      Object.entries(value).forEach(([k, v]) => {
        if (!forbidden.has(k)) result.set(k, encode2(v, k));
      });
      return result;
    }
    return structuredClone(value);
  }
  function decode(value) {
    if (value instanceof YText) return value.toString();
    if (value instanceof YMap) {
      if (value.get("_kind") === "list") {
        const items = value.get("_items"), positions = value.get("_positions");
        return [...items.keys()].sort((a, b) => {
          const x = positions.get(a), y = positions.get(b);
          return x === y ? a < b ? -1 : 1 : x < y ? -1 : 1;
        }).map((id2) => decode(items.get(id2)));
      }
      const result = {};
      value.forEach((v, k) => {
        if (!forbidden.has(k)) result[k] = decode(v);
      });
      return result;
    }
    return structuredClone(value);
  }
  function patch(type, before, after) {
    for (const key of Object.keys(before)) if (!(key in after) && !forbidden.has(key)) type.delete(key);
    for (const [key, value] of Object.entries(after)) {
      if (forbidden.has(key) || same(before[key], value)) continue;
      const current = type.get(key), previous = before[key];
      if (current instanceof YText && typeof previous === "string" && typeof value === "string") {
        replaceText(current, previous, value);
      } else if (current instanceof YMap && current.get("_kind") === "list" && keyed(previous) && keyed(value)) {
        const items = current.get("_items"), positions = current.get("_positions");
        const old = new Map(previous.map((item) => [identity(item), item]));
        const next = new Set(value.map(identity));
        for (const id2 of old.keys()) if (!next.has(id2)) {
          items.delete(id2);
          positions.delete(id2);
        }
        value.forEach((item) => {
          const id2 = identity(item);
          if (!old.has(id2)) items.set(id2, encode2(item));
          else if (items.has(id2)) patch(items.get(id2), old.get(id2), item);
        });
        if (!same(previous.map(identity), value.map(identity))) {
          let left = null;
          value.forEach((item, i) => {
            const id2 = identity(item);
            if (!items.has(id2)) return;
            let position = positions.get(id2);
            const right = value.slice(i + 1).map(identity).map((k) => positions.get(k)).find((p) => p && (!left || p > left));
            if (!position || left && position <= left || right && position >= right) {
              position = generateKeyBetween(left, right || null);
              positions.set(id2, position);
            }
            left = position;
          });
        }
      } else if (current instanceof YMap && object(previous) && object(value)) patch(current, previous, value);
      else type.set(key, encode2(value, key));
    }
  }
  var CommunicationModel = class {
    constructor(doc5 = new Doc()) {
      this.doc = doc5;
      this.root = doc5.getMap("communication");
    }
    seed(value) {
      this.doc.transact(() => patch(this.root, {}, value), "local");
    }
    read() {
      return decode(this.root);
    }
    apply(before, after) {
      this.doc.transact(() => patch(this.root, before, after), "local");
    }
  };
  var toBase642 = (bytes) => {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(binary);
  };
  var fromBase64 = (value) => Uint8Array.from(atob(value.replace(/\s/g, "")), (c) => c.charCodeAt(0));

  // transport.js
  var CommunicationTransport = class {
    constructor({ doc: doc5, rpc, valid, presence, onChange, onStatus }) {
      Object.assign(this, { doc: doc5, rpc, valid, presence, onChange, onStatus });
      this.session = crypto.randomUUID();
      this.revision = -1;
      this.pending = [];
      this.stopped = false;
      this.role = "viewer";
      this.failures = 0;
      this.accessFailures = 0;
      this.writeBlocked = false;
      this.listener = (update, origin) => {
        if (origin !== "remote") this.pending.push(update);
      };
      doc5.on("update", this.listener);
    }
    get dirty() {
      return this.pending.length > 0;
    }
    async sync() {
      if (this.stopped || !this.valid()) return;
      if (this.running) return this.running;
      this.running = this.exchange();
      try {
        await this.running;
      } finally {
        this.running = null;
      }
    }
    async exchange() {
      const count = this.pending.length;
      if (!this.batch && count && !this.writeBlocked) this.batch = { count, nonce: crypto.randomUUID(), update: toBase642(yjs_exports.mergeUpdates(this.pending.slice(0, count))) };
      try {
        const data = await this.rpc("communication_sync", {
          p_after: this.revision,
          p_nonce: this.batch?.nonce || null,
          p_update: this.batch?.update || null,
          p_session: this.session,
          p_awareness: JSON.stringify(this.presence())
        });
        if (this.stopped || !this.valid()) return;
        this.role = data.role;
        if (this.batch) {
          this.pending.splice(0, this.batch.count);
          this.batch = null;
        }
        this.doc.transact(() => {
          if (data.snapshot) yjs_exports.applyUpdate(this.doc, fromBase64(data.snapshot), "remote");
          for (const update of data.updates) yjs_exports.applyUpdate(this.doc, fromBase64(update.payload), "remote");
        }, "remote");
        this.revision = data.revision;
        this.failures = 0;
        this.accessFailures = 0;
        this.onChange(data);
        this.onStatus(this.writeBlocked && this.dirty ? "Solo lectura \xB7 cambios locales sin guardar" : this.dirty ? "Guardando en l\xEDnea\u2026" : "Guardado en l\xEDnea", this.writeBlocked);
        if (!this.dirty && this.role !== "viewer" && this.revision - data.snapshot_revision >= 50) {
          await this.rpc("communication_checkpoint", {
            p_revision: this.revision,
            p_snapshot: toBase642(yjs_exports.encodeStateAsUpdate(this.doc)),
            p_title: String(this.doc.getMap("communication").get("subject") || "Comunicado").slice(0, 500)
          });
        }
      } catch (error) {
        if (this.stopped || !this.valid()) return;
        this.failures++;
        if (error.code === "42501" || error.status === 401 || error.status === 403) {
          this.accessFailures++;
          if (this.batch) {
            this.batch = null;
            this.writeBlocked = true;
            this.role = "viewer";
            this.onStatus("Solo lectura \xB7 cambios locales sin guardar", true);
            return this.exchange();
          }
          if (this.accessFailures < 3) {
            this.onStatus("Verificando acceso\u2026", true);
            await new Promise((resolve) => setTimeout(resolve, 250 * this.accessFailures));
            return this.exchange();
          }
          this.stop();
          this.onStatus("No se pudo verificar el acceso. Vuelve a intentar sin cerrar esta p\xE1gina.", true);
        } else this.onStatus("Sin sincronizar. Conserva esta ventana abierta.", true);
        throw error;
      }
    }
    start() {
      const next = async () => {
        try {
          await this.sync();
        } catch {
        }
        if (!this.stopped && this.valid()) this.timer = setTimeout(next, Math.min(1e4, 650 * 2 ** this.failures));
      };
      next();
    }
    async leave() {
      if (this.stopped || !this.valid()) return;
      try {
        await this.rpc("communication_sync", {
          p_after: this.revision,
          p_nonce: null,
          p_update: null,
          p_session: this.session,
          p_awareness: null
        });
      } finally {
        this.stop();
      }
    }
    stop() {
      this.stopped = true;
      clearTimeout(this.timer);
      this.doc.off("update", this.listener);
    }
  };

  // node_modules/y-protocols/awareness.js
  var outdatedTimeout = 3e4;
  var Awareness = class extends Observable {
    /**
     * @param {Y.Doc} doc
     */
    constructor(doc5) {
      super();
      this.doc = doc5;
      this.clientID = doc5.clientID;
      this.states = /* @__PURE__ */ new Map();
      this.meta = /* @__PURE__ */ new Map();
      this._checkInterval = /** @type {any} */
      setInterval(() => {
        const now = getUnixTime();
        if (this.getLocalState() !== null && outdatedTimeout / 2 <= now - /** @type {{lastUpdated:number}} */
        this.meta.get(this.clientID).lastUpdated) {
          this.setLocalState(this.getLocalState());
        }
        const remove = [];
        this.meta.forEach((meta, clientid) => {
          if (clientid !== this.clientID && outdatedTimeout <= now - meta.lastUpdated && this.states.has(clientid)) {
            remove.push(clientid);
          }
        });
        if (remove.length > 0) {
          removeAwarenessStates(this, remove, "timeout");
        }
      }, floor(outdatedTimeout / 10));
      doc5.on("destroy", () => {
        this.destroy();
      });
      this.setLocalState({});
    }
    destroy() {
      this.emit("destroy", [this]);
      this.setLocalState(null);
      super.destroy();
      clearInterval(this._checkInterval);
    }
    /**
     * @return {Object<string,any>|null}
     */
    getLocalState() {
      return this.states.get(this.clientID) || null;
    }
    /**
     * @param {Object<string,any>|null} state
     */
    setLocalState(state) {
      const clientID = this.clientID;
      const currLocalMeta = this.meta.get(clientID);
      const clock = currLocalMeta === void 0 ? 0 : currLocalMeta.clock + 1;
      const prevState = this.states.get(clientID);
      if (state === null) {
        this.states.delete(clientID);
      } else {
        this.states.set(clientID, state);
      }
      this.meta.set(clientID, {
        clock,
        lastUpdated: getUnixTime()
      });
      const added = [];
      const updated = [];
      const filteredUpdated = [];
      const removed = [];
      if (state === null) {
        removed.push(clientID);
      } else if (prevState == null) {
        if (state != null) {
          added.push(clientID);
        }
      } else {
        updated.push(clientID);
        if (!equalityDeep(prevState, state)) {
          filteredUpdated.push(clientID);
        }
      }
      if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
        this.emit("change", [{ added, updated: filteredUpdated, removed }, "local"]);
      }
      this.emit("update", [{ added, updated, removed }, "local"]);
    }
    /**
     * @param {string} field
     * @param {any} value
     */
    setLocalStateField(field, value) {
      const state = this.getLocalState();
      if (state !== null) {
        this.setLocalState({
          ...state,
          [field]: value
        });
      }
    }
    /**
     * @return {Map<number,Object<string,any>>}
     */
    getStates() {
      return this.states;
    }
  };
  var removeAwarenessStates = (awareness, clients, origin) => {
    const removed = [];
    for (let i = 0; i < clients.length; i++) {
      const clientID = clients[i];
      if (awareness.states.has(clientID)) {
        awareness.states.delete(clientID);
        if (clientID === awareness.clientID) {
          const curMeta = (
            /** @type {MetaClientState} */
            awareness.meta.get(clientID)
          );
          awareness.meta.set(clientID, {
            clock: curMeta.clock + 1,
            lastUpdated: getUnixTime()
          });
        }
        removed.push(clientID);
      }
    }
    if (removed.length > 0) {
      awareness.emit("change", [{ added: [], updated: [], removed }, origin]);
      awareness.emit("update", [{ added: [], updated: [], removed }, origin]);
    }
  };

  // node_modules/orderedmap/dist/index.js
  function OrderedMap(content) {
    this.content = content;
  }
  OrderedMap.prototype = {
    constructor: OrderedMap,
    find: function(key) {
      for (var i = 0; i < this.content.length; i += 2)
        if (this.content[i] === key) return i;
      return -1;
    },
    // :: (string) â†’ ?any
    // Retrieve the value stored under `key`, or return undefined when
    // no such key exists.
    get: function(key) {
      var found3 = this.find(key);
      return found3 == -1 ? void 0 : this.content[found3 + 1];
    },
    // :: (string, any, ?string) â†’ OrderedMap
    // Create a new map by replacing the value of `key` with a new
    // value, or adding a binding to the end of the map. If `newKey` is
    // given, the key of the binding will be replaced with that key.
    update: function(key, value, newKey) {
      var self = newKey && newKey != key ? this.remove(newKey) : this;
      var found3 = self.find(key), content = self.content.slice();
      if (found3 == -1) {
        content.push(newKey || key, value);
      } else {
        content[found3 + 1] = value;
        if (newKey) content[found3] = newKey;
      }
      return new OrderedMap(content);
    },
    // :: (string) â†’ OrderedMap
    // Return a map with the given key removed, if it existed.
    remove: function(key) {
      var found3 = this.find(key);
      if (found3 == -1) return this;
      var content = this.content.slice();
      content.splice(found3, 2);
      return new OrderedMap(content);
    },
    // :: (string, any) â†’ OrderedMap
    // Add a new key to the start of the map.
    addToStart: function(key, value) {
      return new OrderedMap([key, value].concat(this.remove(key).content));
    },
    // :: (string, any) â†’ OrderedMap
    // Add a new key to the end of the map.
    addToEnd: function(key, value) {
      var content = this.remove(key).content.slice();
      content.push(key, value);
      return new OrderedMap(content);
    },
    // :: (string, string, any) â†’ OrderedMap
    // Add a key after the given key. If `place` is not found, the new
    // key is added to the end.
    addBefore: function(place, key, value) {
      var without = this.remove(key), content = without.content.slice();
      var found3 = without.find(place);
      content.splice(found3 == -1 ? content.length : found3, 0, key, value);
      return new OrderedMap(content);
    },
    // :: ((key: string, value: any))
    // Call the given function for each key/value pair in the map, in
    // order.
    forEach: function(f) {
      for (var i = 0; i < this.content.length; i += 2)
        f(this.content[i], this.content[i + 1]);
    },
    // :: (union<Object, OrderedMap>) â†’ OrderedMap
    // Create a new map by prepending the keys in this map that don't
    // appear in `map` before the keys in `map`.
    prepend: function(map2) {
      map2 = OrderedMap.from(map2);
      if (!map2.size) return this;
      return new OrderedMap(map2.content.concat(this.subtract(map2).content));
    },
    // :: (union<Object, OrderedMap>) â†’ OrderedMap
    // Create a new map by appending the keys in this map that don't
    // appear in `map` after the keys in `map`.
    append: function(map2) {
      map2 = OrderedMap.from(map2);
      if (!map2.size) return this;
      return new OrderedMap(this.subtract(map2).content.concat(map2.content));
    },
    // :: (union<Object, OrderedMap>) â†’ OrderedMap
    // Create a map containing all the keys in this map that don't
    // appear in `map`.
    subtract: function(map2) {
      var result = this;
      map2 = OrderedMap.from(map2);
      for (var i = 0; i < map2.content.length; i += 2)
        result = result.remove(map2.content[i]);
      return result;
    },
    // :: () â†’ Object
    // Turn ordered map into a plain object.
    toObject: function() {
      var result = {};
      this.forEach(function(key, value) {
        result[key] = value;
      });
      return result;
    },
    // :: number
    // The amount of keys in this map.
    get size() {
      return this.content.length >> 1;
    }
  };
  OrderedMap.from = function(value) {
    if (value instanceof OrderedMap) return value;
    var content = [];
    if (value) for (var prop in value) content.push(prop, value[prop]);
    return new OrderedMap(content);
  };
  var dist_default = OrderedMap;

  // node_modules/prosemirror-model/dist/index.js
  function findDiffStart(a, b, pos) {
    for (let i = 0; ; i++) {
      if (i == a.childCount || i == b.childCount)
        return a.childCount == b.childCount ? null : pos;
      let childA = a.child(i), childB = b.child(i);
      if (childA == childB) {
        pos += childA.nodeSize;
        continue;
      }
      if (!childA.sameMarkup(childB))
        return pos;
      if (childA.isText && childA.text != childB.text) {
        for (let j = 0; childA.text[j] == childB.text[j]; j++)
          pos++;
        return pos;
      }
      if (childA.content.size || childB.content.size) {
        let inner = findDiffStart(childA.content, childB.content, pos + 1);
        if (inner != null)
          return inner;
      }
      pos += childA.nodeSize;
    }
  }
  function findDiffEnd(a, b, posA, posB) {
    for (let iA = a.childCount, iB = b.childCount; ; ) {
      if (iA == 0 || iB == 0)
        return iA == iB ? null : { a: posA, b: posB };
      let childA = a.child(--iA), childB = b.child(--iB), size2 = childA.nodeSize;
      if (childA == childB) {
        posA -= size2;
        posB -= size2;
        continue;
      }
      if (!childA.sameMarkup(childB))
        return { a: posA, b: posB };
      if (childA.isText && childA.text != childB.text) {
        let same2 = 0, minSize = Math.min(childA.text.length, childB.text.length);
        while (same2 < minSize && childA.text[childA.text.length - same2 - 1] == childB.text[childB.text.length - same2 - 1]) {
          same2++;
          posA--;
          posB--;
        }
        return { a: posA, b: posB };
      }
      if (childA.content.size || childB.content.size) {
        let inner = findDiffEnd(childA.content, childB.content, posA - 1, posB - 1);
        if (inner)
          return inner;
      }
      posA -= size2;
      posB -= size2;
    }
  }
  var Fragment = class _Fragment {
    /**
    @internal
    */
    constructor(content, size2) {
      this.content = content;
      this.size = size2 || 0;
      if (size2 == null)
        for (let i = 0; i < content.length; i++)
          this.size += content[i].nodeSize;
    }
    /**
    Invoke a callback for all descendant nodes between the given two
    positions (relative to start of this fragment). Doesn't descend
    into a node when the callback returns `false`.
    */
    nodesBetween(from2, to, f, nodeStart = 0, parent) {
      for (let i = 0, pos = 0; pos < to; i++) {
        let child = this.content[i], end = pos + child.nodeSize;
        if (end > from2 && f(child, nodeStart + pos, parent || null, i) !== false && child.content.size) {
          let start = pos + 1;
          child.nodesBetween(Math.max(0, from2 - start), Math.min(child.content.size, to - start), f, nodeStart + start);
        }
        pos = end;
      }
    }
    /**
    Call the given callback for every descendant node. `pos` will be
    relative to the start of the fragment. The callback may return
    `false` to prevent traversal of a given node's children.
    */
    descendants(f) {
      this.nodesBetween(0, this.size, f);
    }
    /**
    Extract the text between `from` and `to`. See the same method on
    [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
    */
    textBetween(from2, to, blockSeparator, leafText) {
      let text2 = "", first = true;
      this.nodesBetween(from2, to, (node, pos) => {
        let nodeText = node.isText ? node.text.slice(Math.max(from2, pos) - pos, to - pos) : !node.isLeaf ? "" : leafText ? typeof leafText === "function" ? leafText(node) : leafText : node.type.spec.leafText ? node.type.spec.leafText(node) : "";
        if (node.isBlock && (node.isLeaf && nodeText || node.isTextblock) && blockSeparator) {
          if (first)
            first = false;
          else
            text2 += blockSeparator;
        }
        text2 += nodeText;
      }, 0);
      return text2;
    }
    /**
    Create a new fragment containing the combined content of this
    fragment and the other.
    */
    append(other) {
      if (!other.size)
        return this;
      if (!this.size)
        return other;
      let last2 = this.lastChild, first = other.firstChild, content = this.content.slice(), i = 0;
      if (last2.isText && last2.sameMarkup(first)) {
        content[content.length - 1] = last2.withText(last2.text + first.text);
        i = 1;
      }
      for (; i < other.content.length; i++)
        content.push(other.content[i]);
      return new _Fragment(content, this.size + other.size);
    }
    /**
    Cut out the sub-fragment between the two given positions.
    */
    cut(from2, to = this.size) {
      if (from2 == 0 && to == this.size)
        return this;
      let result = [], size2 = 0;
      if (to > from2)
        for (let i = 0, pos = 0; pos < to; i++) {
          let child = this.content[i], end = pos + child.nodeSize;
          if (end > from2) {
            if (pos < from2 || end > to) {
              if (child.isText)
                child = child.cut(Math.max(0, from2 - pos), Math.min(child.text.length, to - pos));
              else
                child = child.cut(Math.max(0, from2 - pos - 1), Math.min(child.content.size, to - pos - 1));
            }
            result.push(child);
            size2 += child.nodeSize;
          }
          pos = end;
        }
      return new _Fragment(result, size2);
    }
    /**
    @internal
    */
    cutByIndex(from2, to) {
      if (from2 == to)
        return _Fragment.empty;
      if (from2 == 0 && to == this.content.length)
        return this;
      return new _Fragment(this.content.slice(from2, to));
    }
    /**
    Create a new fragment in which the node at the given index is
    replaced by the given node.
    */
    replaceChild(index, node) {
      let current = this.content[index];
      if (current == node)
        return this;
      let copy5 = this.content.slice();
      let size2 = this.size + node.nodeSize - current.nodeSize;
      copy5[index] = node;
      return new _Fragment(copy5, size2);
    }
    /**
    Create a new fragment by prepending the given node to this
    fragment.
    */
    addToStart(node) {
      return new _Fragment([node].concat(this.content), this.size + node.nodeSize);
    }
    /**
    Create a new fragment by appending the given node to this
    fragment.
    */
    addToEnd(node) {
      return new _Fragment(this.content.concat(node), this.size + node.nodeSize);
    }
    /**
    Compare this fragment to another one.
    */
    eq(other) {
      if (this.content.length != other.content.length)
        return false;
      for (let i = 0; i < this.content.length; i++)
        if (!this.content[i].eq(other.content[i]))
          return false;
      return true;
    }
    /**
    The first child of the fragment, or `null` if it is empty.
    */
    get firstChild() {
      return this.content.length ? this.content[0] : null;
    }
    /**
    The last child of the fragment, or `null` if it is empty.
    */
    get lastChild() {
      return this.content.length ? this.content[this.content.length - 1] : null;
    }
    /**
    The number of child nodes in this fragment.
    */
    get childCount() {
      return this.content.length;
    }
    /**
    Get the child node at the given index. Raise an error when the
    index is out of range.
    */
    child(index) {
      let found3 = this.content[index];
      if (!found3)
        throw new RangeError("Index " + index + " out of range for " + this);
      return found3;
    }
    /**
    Get the child node at the given index, if it exists.
    */
    maybeChild(index) {
      return this.content[index] || null;
    }
    /**
    Call `f` for every child node, passing the node, its offset
    into this parent node, and its index.
    */
    forEach(f) {
      for (let i = 0, p = 0; i < this.content.length; i++) {
        let child = this.content[i];
        f(child, p, i);
        p += child.nodeSize;
      }
    }
    /**
    Find the first position at which this fragment and another
    fragment differ, or `null` if they are the same.
    */
    findDiffStart(other, pos = 0) {
      return findDiffStart(this, other, pos);
    }
    /**
    Find the first position, searching from the end, at which this
    fragment and the given fragment differ, or `null` if they are
    the same. Since this position will not be the same in both
    nodes, an object with two separate positions is returned.
    */
    findDiffEnd(other, pos = this.size, otherPos = other.size) {
      return findDiffEnd(this, other, pos, otherPos);
    }
    /**
    Find the index and inner offset corresponding to a given relative
    position in this fragment. The result object will be reused
    (overwritten) the next time the function is called. @internal
    */
    findIndex(pos) {
      if (pos == 0)
        return retIndex(0, pos);
      if (pos == this.size)
        return retIndex(this.content.length, pos);
      if (pos > this.size || pos < 0)
        throw new RangeError(`Position ${pos} outside of fragment (${this})`);
      for (let i = 0, curPos = 0; ; i++) {
        let cur = this.child(i), end = curPos + cur.nodeSize;
        if (end >= pos) {
          if (end == pos)
            return retIndex(i + 1, end);
          return retIndex(i, curPos);
        }
        curPos = end;
      }
    }
    /**
    Return a debugging string that describes this fragment.
    */
    toString() {
      return "<" + this.toStringInner() + ">";
    }
    /**
    @internal
    */
    toStringInner() {
      return this.content.join(", ");
    }
    /**
    Create a JSON-serializeable representation of this fragment.
    */
    toJSON() {
      return this.content.length ? this.content.map((n) => n.toJSON()) : null;
    }
    /**
    Deserialize a fragment from its JSON representation.
    */
    static fromJSON(schema2, value) {
      if (!value)
        return _Fragment.empty;
      if (!Array.isArray(value))
        throw new RangeError("Invalid input for Fragment.fromJSON");
      return new _Fragment(value.map(schema2.nodeFromJSON));
    }
    /**
    Build a fragment from an array of nodes. Ensures that adjacent
    text nodes with the same marks are joined together.
    */
    static fromArray(array) {
      if (!array.length)
        return _Fragment.empty;
      let joined, size2 = 0;
      for (let i = 0; i < array.length; i++) {
        let node = array[i];
        size2 += node.nodeSize;
        if (i && node.isText && array[i - 1].sameMarkup(node)) {
          if (!joined)
            joined = array.slice(0, i);
          joined[joined.length - 1] = node.withText(joined[joined.length - 1].text + node.text);
        } else if (joined) {
          joined.push(node);
        }
      }
      return new _Fragment(joined || array, size2);
    }
    /**
    Create a fragment from something that can be interpreted as a
    set of nodes. For `null`, it returns the empty fragment. For a
    fragment, the fragment itself. For a node or array of nodes, a
    fragment containing those nodes.
    */
    static from(nodes) {
      if (!nodes)
        return _Fragment.empty;
      if (nodes instanceof _Fragment)
        return nodes;
      if (Array.isArray(nodes))
        return this.fromArray(nodes);
      if (nodes.attrs)
        return new _Fragment([nodes], nodes.nodeSize);
      throw new RangeError("Can not convert " + nodes + " to a Fragment" + (nodes.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
    }
  };
  Fragment.empty = new Fragment([], 0);
  var found = { index: 0, offset: 0 };
  function retIndex(index, offset) {
    found.index = index;
    found.offset = offset;
    return found;
  }
  function compareDeep(a, b) {
    if (a === b)
      return true;
    if (!(a && typeof a == "object") || !(b && typeof b == "object"))
      return false;
    let array = Array.isArray(a);
    if (Array.isArray(b) != array)
      return false;
    if (array) {
      if (a.length != b.length)
        return false;
      for (let i = 0; i < a.length; i++)
        if (!compareDeep(a[i], b[i]))
          return false;
    } else {
      for (let p in a)
        if (!(p in b) || !compareDeep(a[p], b[p]))
          return false;
      for (let p in b)
        if (!(p in a))
          return false;
    }
    return true;
  }
  var Mark = class _Mark {
    /**
    @internal
    */
    constructor(type, attrs) {
      this.type = type;
      this.attrs = attrs;
    }
    /**
    Given a set of marks, create a new set which contains this one as
    well, in the right position. If this mark is already in the set,
    the set itself is returned. If any marks that are set to be
    [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
    those are replaced by this one.
    */
    addToSet(set) {
      let copy5, placed = false;
      for (let i = 0; i < set.length; i++) {
        let other = set[i];
        if (this.eq(other))
          return set;
        if (this.type.excludes(other.type)) {
          if (!copy5)
            copy5 = set.slice(0, i);
        } else if (other.type.excludes(this.type)) {
          return set;
        } else {
          if (!placed && other.type.rank > this.type.rank) {
            if (!copy5)
              copy5 = set.slice(0, i);
            copy5.push(this);
            placed = true;
          }
          if (copy5)
            copy5.push(other);
        }
      }
      if (!copy5)
        copy5 = set.slice();
      if (!placed)
        copy5.push(this);
      return copy5;
    }
    /**
    Remove this mark from the given set, returning a new set. If this
    mark is not in the set, the set itself is returned.
    */
    removeFromSet(set) {
      for (let i = 0; i < set.length; i++)
        if (this.eq(set[i]))
          return set.slice(0, i).concat(set.slice(i + 1));
      return set;
    }
    /**
    Test whether this mark is in the given set of marks.
    */
    isInSet(set) {
      for (let i = 0; i < set.length; i++)
        if (this.eq(set[i]))
          return true;
      return false;
    }
    /**
    Test whether this mark has the same type and attributes as
    another mark.
    */
    eq(other) {
      return this == other || this.type == other.type && compareDeep(this.attrs, other.attrs);
    }
    /**
    Convert this mark to a JSON-serializeable representation.
    */
    toJSON() {
      let obj = { type: this.type.name };
      for (let _ in this.attrs) {
        obj.attrs = this.attrs;
        break;
      }
      return obj;
    }
    /**
    Deserialize a mark from JSON.
    */
    static fromJSON(schema2, json) {
      if (!json)
        throw new RangeError("Invalid input for Mark.fromJSON");
      let type = schema2.marks[json.type];
      if (!type)
        throw new RangeError(`There is no mark type ${json.type} in this schema`);
      let mark = type.create(json.attrs);
      type.checkAttrs(mark.attrs);
      return mark;
    }
    /**
    Test whether two sets of marks are identical.
    */
    static sameSet(a, b) {
      if (a == b)
        return true;
      if (a.length != b.length)
        return false;
      for (let i = 0; i < a.length; i++)
        if (!a[i].eq(b[i]))
          return false;
      return true;
    }
    /**
    Create a properly sorted mark set from null, a single mark, or an
    unsorted array of marks.
    */
    static setFrom(marks) {
      if (!marks || Array.isArray(marks) && marks.length == 0)
        return _Mark.none;
      if (marks instanceof _Mark)
        return [marks];
      let copy5 = marks.slice();
      copy5.sort((a, b) => a.type.rank - b.type.rank);
      return copy5;
    }
  };
  Mark.none = [];
  var ReplaceError = class extends Error {
  };
  var Slice = class _Slice {
    /**
    Create a slice. When specifying a non-zero open depth, you must
    make sure that there are nodes of at least that depth at the
    appropriate side of the fragmentâ€”i.e. if the fragment is an
    empty paragraph node, `openStart` and `openEnd` can't be greater
    than 1.
    
    It is not necessary for the content of open nodes to conform to
    the schema's content constraints, though it should be a valid
    start/end/middle for such a node, depending on which sides are
    open.
    */
    constructor(content, openStart, openEnd) {
      this.content = content;
      this.openStart = openStart;
      this.openEnd = openEnd;
    }
    /**
    The size this slice would add when inserted into a document.
    */
    get size() {
      return this.content.size - this.openStart - this.openEnd;
    }
    /**
    @internal
    */
    insertAt(pos, fragment) {
      let content = insertInto(this.content, pos + this.openStart, fragment);
      return content && new _Slice(content, this.openStart, this.openEnd);
    }
    /**
    @internal
    */
    removeBetween(from2, to) {
      return new _Slice(removeRange(this.content, from2 + this.openStart, to + this.openStart), this.openStart, this.openEnd);
    }
    /**
    Tests whether this slice is equal to another slice.
    */
    eq(other) {
      return this.content.eq(other.content) && this.openStart == other.openStart && this.openEnd == other.openEnd;
    }
    /**
    @internal
    */
    toString() {
      return this.content + "(" + this.openStart + "," + this.openEnd + ")";
    }
    /**
    Convert a slice to a JSON-serializable representation.
    */
    toJSON() {
      if (!this.content.size)
        return null;
      let json = { content: this.content.toJSON() };
      if (this.openStart > 0)
        json.openStart = this.openStart;
      if (this.openEnd > 0)
        json.openEnd = this.openEnd;
      return json;
    }
    /**
    Deserialize a slice from its JSON representation.
    */
    static fromJSON(schema2, json) {
      if (!json)
        return _Slice.empty;
      let openStart = json.openStart || 0, openEnd = json.openEnd || 0;
      if (typeof openStart != "number" || typeof openEnd != "number")
        throw new RangeError("Invalid input for Slice.fromJSON");
      return new _Slice(Fragment.fromJSON(schema2, json.content), openStart, openEnd);
    }
    /**
    Create a slice from a fragment by taking the maximum possible
    open value on both side of the fragment.
    */
    static maxOpen(fragment, openIsolating = true) {
      let openStart = 0, openEnd = 0;
      for (let n = fragment.firstChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.firstChild)
        openStart++;
      for (let n = fragment.lastChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.lastChild)
        openEnd++;
      return new _Slice(fragment, openStart, openEnd);
    }
  };
  Slice.empty = new Slice(Fragment.empty, 0, 0);
  function removeRange(content, from2, to) {
    let { index, offset } = content.findIndex(from2), child = content.maybeChild(index);
    let { index: indexTo, offset: offsetTo } = content.findIndex(to);
    if (offset == from2 || child.isText) {
      if (offsetTo != to && !content.child(indexTo).isText)
        throw new RangeError("Removing non-flat range");
      return content.cut(0, from2).append(content.cut(to));
    }
    if (index != indexTo)
      throw new RangeError("Removing non-flat range");
    return content.replaceChild(index, child.copy(removeRange(child.content, from2 - offset - 1, to - offset - 1)));
  }
  function insertInto(content, dist, insert, parent) {
    let { index, offset } = content.findIndex(dist), child = content.maybeChild(index);
    if (offset == dist || child.isText) {
      if (parent && !parent.canReplace(index, index, insert))
        return null;
      return content.cut(0, dist).append(insert).append(content.cut(dist));
    }
    let inner = insertInto(child.content, dist - offset - 1, insert, child);
    return inner && content.replaceChild(index, child.copy(inner));
  }
  function replace($from, $to, slice) {
    if (slice.openStart > $from.depth)
      throw new ReplaceError("Inserted content deeper than insertion position");
    if ($from.depth - slice.openStart != $to.depth - slice.openEnd)
      throw new ReplaceError("Inconsistent open depths");
    return replaceOuter($from, $to, slice, 0);
  }
  function replaceOuter($from, $to, slice, depth) {
    let index = $from.index(depth), node = $from.node(depth);
    if (index == $to.index(depth) && depth < $from.depth - slice.openStart) {
      let inner = replaceOuter($from, $to, slice, depth + 1);
      return node.copy(node.content.replaceChild(index, inner));
    } else if (!slice.content.size) {
      return close(node, replaceTwoWay($from, $to, depth));
    } else if (!slice.openStart && !slice.openEnd && $from.depth == depth && $to.depth == depth) {
      let parent = $from.parent, content = parent.content;
      return close(parent, content.cut(0, $from.parentOffset).append(slice.content).append(content.cut($to.parentOffset)));
    } else {
      let { start, end } = prepareSliceForReplace(slice, $from);
      return close(node, replaceThreeWay($from, start, end, $to, depth));
    }
  }
  function checkJoin(main, sub) {
    if (!sub.type.compatibleContent(main.type))
      throw new ReplaceError("Cannot join " + sub.type.name + " onto " + main.type.name);
  }
  function joinable($before, $after, depth) {
    let node = $before.node(depth);
    checkJoin(node, $after.node(depth));
    return node;
  }
  function addNode(child, target) {
    let last2 = target.length - 1;
    if (last2 >= 0 && child.isText && child.sameMarkup(target[last2]))
      target[last2] = child.withText(target[last2].text + child.text);
    else
      target.push(child);
  }
  function addRange($start, $end, depth, target) {
    let node = ($end || $start).node(depth);
    let startIndex = 0, endIndex = $end ? $end.index(depth) : node.childCount;
    if ($start) {
      startIndex = $start.index(depth);
      if ($start.depth > depth) {
        startIndex++;
      } else if ($start.textOffset) {
        addNode($start.nodeAfter, target);
        startIndex++;
      }
    }
    for (let i = startIndex; i < endIndex; i++)
      addNode(node.child(i), target);
    if ($end && $end.depth == depth && $end.textOffset)
      addNode($end.nodeBefore, target);
  }
  function close(node, content) {
    node.type.checkContent(content);
    return node.copy(content);
  }
  function replaceThreeWay($from, $start, $end, $to, depth) {
    let openStart = $from.depth > depth && joinable($from, $start, depth + 1);
    let openEnd = $to.depth > depth && joinable($end, $to, depth + 1);
    let content = [];
    addRange(null, $from, depth, content);
    if (openStart && openEnd && $start.index(depth) == $end.index(depth)) {
      checkJoin(openStart, openEnd);
      addNode(close(openStart, replaceThreeWay($from, $start, $end, $to, depth + 1)), content);
    } else {
      if (openStart)
        addNode(close(openStart, replaceTwoWay($from, $start, depth + 1)), content);
      addRange($start, $end, depth, content);
      if (openEnd)
        addNode(close(openEnd, replaceTwoWay($end, $to, depth + 1)), content);
    }
    addRange($to, null, depth, content);
    return new Fragment(content);
  }
  function replaceTwoWay($from, $to, depth) {
    let content = [];
    addRange(null, $from, depth, content);
    if ($from.depth > depth) {
      let type = joinable($from, $to, depth + 1);
      addNode(close(type, replaceTwoWay($from, $to, depth + 1)), content);
    }
    addRange($to, null, depth, content);
    return new Fragment(content);
  }
  function prepareSliceForReplace(slice, $along) {
    let extra = $along.depth - slice.openStart, parent = $along.node(extra);
    let node = parent.copy(slice.content);
    for (let i = extra - 1; i >= 0; i--)
      node = $along.node(i).copy(Fragment.from(node));
    return {
      start: node.resolveNoCache(slice.openStart + extra),
      end: node.resolveNoCache(node.content.size - slice.openEnd - extra)
    };
  }
  var ResolvedPos = class _ResolvedPos {
    /**
    @internal
    */
    constructor(pos, path, parentOffset) {
      this.pos = pos;
      this.path = path;
      this.parentOffset = parentOffset;
      this.depth = path.length / 3 - 1;
    }
    /**
    @internal
    */
    resolveDepth(val) {
      if (val == null)
        return this.depth;
      if (val < 0)
        return this.depth + val;
      return val;
    }
    /**
    The parent node that the position points into. Note that even if
    a position points into a text node, that node is not considered
    the parentâ€”text nodes are â€˜flatâ€™ in this model, and have no content.
    */
    get parent() {
      return this.node(this.depth);
    }
    /**
    The root node in which the position was resolved.
    */
    get doc() {
      return this.node(0);
    }
    /**
    The ancestor node at the given level. `p.node(p.depth)` is the
    same as `p.parent`.
    */
    node(depth) {
      return this.path[this.resolveDepth(depth) * 3];
    }
    /**
    The index into the ancestor at the given level. If this points
    at the 3rd node in the 2nd paragraph on the top level, for
    example, `p.index(0)` is 1 and `p.index(1)` is 2.
    */
    index(depth) {
      return this.path[this.resolveDepth(depth) * 3 + 1];
    }
    /**
    The index pointing after this position into the ancestor at the
    given level.
    */
    indexAfter(depth) {
      depth = this.resolveDepth(depth);
      return this.index(depth) + (depth == this.depth && !this.textOffset ? 0 : 1);
    }
    /**
    The (absolute) position at the start of the node at the given
    level.
    */
    start(depth) {
      depth = this.resolveDepth(depth);
      return depth == 0 ? 0 : this.path[depth * 3 - 1] + 1;
    }
    /**
    The (absolute) position at the end of the node at the given
    level.
    */
    end(depth) {
      depth = this.resolveDepth(depth);
      return this.start(depth) + this.node(depth).content.size;
    }
    /**
    The (absolute) position directly before the wrapping node at the
    given level, or, when `depth` is `this.depth + 1`, the original
    position.
    */
    before(depth) {
      depth = this.resolveDepth(depth);
      if (!depth)
        throw new RangeError("There is no position before the top-level node");
      return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1];
    }
    /**
    The (absolute) position directly after the wrapping node at the
    given level, or the original position when `depth` is `this.depth + 1`.
    */
    after(depth) {
      depth = this.resolveDepth(depth);
      if (!depth)
        throw new RangeError("There is no position after the top-level node");
      return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1] + this.path[depth * 3].nodeSize;
    }
    /**
    When this position points into a text node, this returns the
    distance between the position and the start of the text node.
    Will be zero for positions that point between nodes.
    */
    get textOffset() {
      return this.pos - this.path[this.path.length - 1];
    }
    /**
    Get the node directly after the position, if any. If the position
    points into a text node, only the part of that node after the
    position is returned.
    */
    get nodeAfter() {
      let parent = this.parent, index = this.index(this.depth);
      if (index == parent.childCount)
        return null;
      let dOff = this.pos - this.path[this.path.length - 1], child = parent.child(index);
      return dOff ? parent.child(index).cut(dOff) : child;
    }
    /**
    Get the node directly before the position, if any. If the
    position points into a text node, only the part of that node
    before the position is returned.
    */
    get nodeBefore() {
      let index = this.index(this.depth);
      let dOff = this.pos - this.path[this.path.length - 1];
      if (dOff)
        return this.parent.child(index).cut(0, dOff);
      return index == 0 ? null : this.parent.child(index - 1);
    }
    /**
    Get the position at the given index in the parent node at the
    given depth (which defaults to `this.depth`).
    */
    posAtIndex(index, depth) {
      depth = this.resolveDepth(depth);
      let node = this.path[depth * 3], pos = depth == 0 ? 0 : this.path[depth * 3 - 1] + 1;
      for (let i = 0; i < index; i++)
        pos += node.child(i).nodeSize;
      return pos;
    }
    /**
    Get the marks at this position, factoring in the surrounding
    marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
    position is at the start of a non-empty node, the marks of the
    node after it (if any) are returned.
    */
    marks() {
      let parent = this.parent, index = this.index();
      if (parent.content.size == 0)
        return Mark.none;
      if (this.textOffset)
        return parent.child(index).marks;
      let main = parent.maybeChild(index - 1), other = parent.maybeChild(index);
      if (!main) {
        let tmp = main;
        main = other;
        other = tmp;
      }
      let marks = main.marks;
      for (var i = 0; i < marks.length; i++)
        if (marks[i].type.spec.inclusive === false && (!other || !marks[i].isInSet(other.marks)))
          marks = marks[i--].removeFromSet(marks);
      return marks;
    }
    /**
    Get the marks after the current position, if any, except those
    that are non-inclusive and not present at position `$end`. This
    is mostly useful for getting the set of marks to preserve after a
    deletion. Will return `null` if this position is at the end of
    its parent node or its parent node isn't a textblock (in which
    case no marks should be preserved).
    */
    marksAcross($end) {
      let after = this.parent.maybeChild(this.index());
      if (!after || !after.isInline)
        return null;
      let marks = after.marks, next = $end.parent.maybeChild($end.index());
      for (var i = 0; i < marks.length; i++)
        if (marks[i].type.spec.inclusive === false && (!next || !marks[i].isInSet(next.marks)))
          marks = marks[i--].removeFromSet(marks);
      return marks;
    }
    /**
    The depth up to which this position and the given (non-resolved)
    position share the same parent nodes.
    */
    sharedDepth(pos) {
      for (let depth = this.depth; depth > 0; depth--)
        if (this.start(depth) <= pos && this.end(depth) >= pos)
          return depth;
      return 0;
    }
    /**
    Returns a range based on the place where this position and the
    given position diverge around block content. If both point into
    the same textblock, for example, a range around that textblock
    will be returned. If they point into different blocks, the range
    around those blocks in their shared ancestor is returned. You can
    pass in an optional predicate that will be called with a parent
    node to see if a range into that parent is acceptable.
    */
    blockRange(other = this, pred) {
      if (other.pos < this.pos)
        return other.blockRange(this);
      for (let d = this.depth - (this.parent.inlineContent || this.pos == other.pos ? 1 : 0); d >= 0; d--)
        if (other.pos <= this.end(d) && (!pred || pred(this.node(d))))
          return new NodeRange(this, other, d);
      return null;
    }
    /**
    Query whether the given position shares the same parent node.
    */
    sameParent(other) {
      return this.pos - this.parentOffset == other.pos - other.parentOffset;
    }
    /**
    Return the greater of this and the given position.
    */
    max(other) {
      return other.pos > this.pos ? other : this;
    }
    /**
    Return the smaller of this and the given position.
    */
    min(other) {
      return other.pos < this.pos ? other : this;
    }
    /**
    @internal
    */
    toString() {
      let str = "";
      for (let i = 1; i <= this.depth; i++)
        str += (str ? "/" : "") + this.node(i).type.name + "_" + this.index(i - 1);
      return str + ":" + this.parentOffset;
    }
    /**
    @internal
    */
    static resolve(doc5, pos) {
      if (!(pos >= 0 && pos <= doc5.content.size))
        throw new RangeError("Position " + pos + " out of range");
      let path = [];
      let start = 0, parentOffset = pos;
      for (let node = doc5; ; ) {
        let { index, offset } = node.content.findIndex(parentOffset);
        let rem = parentOffset - offset;
        path.push(node, index, start + offset);
        if (!rem)
          break;
        node = node.child(index);
        if (node.isText)
          break;
        parentOffset = rem - 1;
        start += offset + 1;
      }
      return new _ResolvedPos(pos, path, parentOffset);
    }
    /**
    @internal
    */
    static resolveCached(doc5, pos) {
      let cache = resolveCache.get(doc5);
      if (cache) {
        for (let i = 0; i < cache.elts.length; i++) {
          let elt = cache.elts[i];
          if (elt.pos == pos)
            return elt;
        }
      } else {
        resolveCache.set(doc5, cache = new ResolveCache());
      }
      let result = cache.elts[cache.i] = _ResolvedPos.resolve(doc5, pos);
      cache.i = (cache.i + 1) % resolveCacheSize;
      return result;
    }
  };
  var ResolveCache = class {
    constructor() {
      this.elts = [];
      this.i = 0;
    }
  };
  var resolveCacheSize = 12;
  var resolveCache = /* @__PURE__ */ new WeakMap();
  var NodeRange = class {
    /**
    Construct a node range. `$from` and `$to` should point into the
    same node until at least the given `depth`, since a node range
    denotes an adjacent set of nodes in a single parent node.
    */
    constructor($from, $to, depth) {
      this.$from = $from;
      this.$to = $to;
      this.depth = depth;
    }
    /**
    The position at the start of the range.
    */
    get start() {
      return this.$from.before(this.depth + 1);
    }
    /**
    The position at the end of the range.
    */
    get end() {
      return this.$to.after(this.depth + 1);
    }
    /**
    The parent node that the range points into.
    */
    get parent() {
      return this.$from.node(this.depth);
    }
    /**
    The start index of the range in the parent node.
    */
    get startIndex() {
      return this.$from.index(this.depth);
    }
    /**
    The end index of the range in the parent node.
    */
    get endIndex() {
      return this.$to.indexAfter(this.depth);
    }
  };
  var emptyAttrs = /* @__PURE__ */ Object.create(null);
  var Node = class _Node {
    /**
    @internal
    */
    constructor(type, attrs, content, marks = Mark.none) {
      this.type = type;
      this.attrs = attrs;
      this.marks = marks;
      this.content = content || Fragment.empty;
    }
    /**
    The array of this node's child nodes.
    */
    get children() {
      return this.content.content;
    }
    /**
    The size of this node, as defined by the integer-based [indexing
    scheme](https://prosemirror.net/docs/guide/#doc.indexing). For text nodes, this is the
    amount of characters. For other leaf nodes, it is one. For
    non-leaf nodes, it is the size of the content plus two (the
    start and end token).
    */
    get nodeSize() {
      return this.isLeaf ? 1 : 2 + this.content.size;
    }
    /**
    The number of children that the node has.
    */
    get childCount() {
      return this.content.childCount;
    }
    /**
    Get the child node at the given index. Raises an error when the
    index is out of range.
    */
    child(index) {
      return this.content.child(index);
    }
    /**
    Get the child node at the given index, if it exists.
    */
    maybeChild(index) {
      return this.content.maybeChild(index);
    }
    /**
    Call `f` for every child node, passing the node, its offset
    into this parent node, and its index.
    */
    forEach(f) {
      this.content.forEach(f);
    }
    /**
    Invoke a callback for all descendant nodes recursively between
    the given two positions that are relative to start of this
    node's content. The callback is invoked with the node, its
    position relative to the original node (method receiver),
    its parent node, and its child index. When the callback returns
    false for a given node, that node's children will not be
    recursed over. The last parameter can be used to specify a
    starting position to count from.
    */
    nodesBetween(from2, to, f, startPos = 0) {
      this.content.nodesBetween(from2, to, f, startPos, this);
    }
    /**
    Call the given callback for every descendant node. Doesn't
    descend into a node when the callback returns `false`.
    */
    descendants(f) {
      this.nodesBetween(0, this.content.size, f);
    }
    /**
    Concatenates all the text nodes found in this fragment and its
    children.
    */
    get textContent() {
      return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
    }
    /**
    Get all text between positions `from` and `to`. When
    `blockSeparator` is given, it will be inserted to separate text
    from different block nodes. If `leafText` is given, it'll be
    inserted for every non-text leaf node encountered, otherwise
    [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec.leafText) will be used.
    */
    textBetween(from2, to, blockSeparator, leafText) {
      return this.content.textBetween(from2, to, blockSeparator, leafText);
    }
    /**
    Returns this node's first child, or `null` if there are no
    children.
    */
    get firstChild() {
      return this.content.firstChild;
    }
    /**
    Returns this node's last child, or `null` if there are no
    children.
    */
    get lastChild() {
      return this.content.lastChild;
    }
    /**
    Test whether two nodes represent the same piece of document.
    */
    eq(other) {
      return this == other || this.sameMarkup(other) && this.content.eq(other.content);
    }
    /**
    Compare the markup (type, attributes, and marks) of this node to
    those of another. Returns `true` if both have the same markup.
    */
    sameMarkup(other) {
      return this.hasMarkup(other.type, other.attrs, other.marks);
    }
    /**
    Check whether this node's markup correspond to the given type,
    attributes, and marks.
    */
    hasMarkup(type, attrs, marks) {
      return this.type == type && compareDeep(this.attrs, attrs || type.defaultAttrs || emptyAttrs) && Mark.sameSet(this.marks, marks || Mark.none);
    }
    /**
    Create a new node with the same markup as this node, containing
    the given content (or empty, if no content is given).
    */
    copy(content = null) {
      if (content == this.content)
        return this;
      return new _Node(this.type, this.attrs, content, this.marks);
    }
    /**
    Create a copy of this node, with the given set of marks instead
    of the node's own marks.
    */
    mark(marks) {
      return marks == this.marks ? this : new _Node(this.type, this.attrs, this.content, marks);
    }
    /**
    Create a copy of this node with only the content between the
    given positions. If `to` is not given, it defaults to the end of
    the node.
    */
    cut(from2, to = this.content.size) {
      if (from2 == 0 && to == this.content.size)
        return this;
      return this.copy(this.content.cut(from2, to));
    }
    /**
    Cut out the part of the document between the given positions, and
    return it as a `Slice` object.
    */
    slice(from2, to = this.content.size, includeParents = false) {
      if (from2 == to)
        return Slice.empty;
      let $from = this.resolve(from2), $to = this.resolve(to);
      let depth = includeParents ? 0 : $from.sharedDepth(to);
      let start = $from.start(depth), node = $from.node(depth);
      let content = node.content.cut($from.pos - start, $to.pos - start);
      return new Slice(content, $from.depth - depth, $to.depth - depth);
    }
    /**
    Replace the part of the document between the given positions with
    the given slice. The slice must 'fit', meaning its open sides
    must be able to connect to the surrounding content, and its
    content nodes must be valid children for the node they are placed
    into. If any of this is violated, an error of type
    [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
    */
    replace(from2, to, slice) {
      return replace(this.resolve(from2), this.resolve(to), slice);
    }
    /**
    Find the node directly after the given position.
    */
    nodeAt(pos) {
      for (let node = this; ; ) {
        let { index, offset } = node.content.findIndex(pos);
        node = node.maybeChild(index);
        if (!node)
          return null;
        if (offset == pos || node.isText)
          return node;
        pos -= offset + 1;
      }
    }
    /**
    Find the (direct) child node after the given offset, if any,
    and return it along with its index and offset relative to this
    node.
    */
    childAfter(pos) {
      let { index, offset } = this.content.findIndex(pos);
      return { node: this.content.maybeChild(index), index, offset };
    }
    /**
    Find the (direct) child node before the given offset, if any,
    and return it along with its index and offset relative to this
    node.
    */
    childBefore(pos) {
      if (pos == 0)
        return { node: null, index: 0, offset: 0 };
      let { index, offset } = this.content.findIndex(pos);
      if (offset < pos)
        return { node: this.content.child(index), index, offset };
      let node = this.content.child(index - 1);
      return { node, index: index - 1, offset: offset - node.nodeSize };
    }
    /**
    Resolve the given position in the document, returning an
    [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
    */
    resolve(pos) {
      return ResolvedPos.resolveCached(this, pos);
    }
    /**
    @internal
    */
    resolveNoCache(pos) {
      return ResolvedPos.resolve(this, pos);
    }
    /**
    Test whether a given mark or mark type occurs in this document
    between the two given positions.
    */
    rangeHasMark(from2, to, type) {
      let found3 = false;
      if (to > from2)
        this.nodesBetween(from2, to, (node) => {
          if (type.isInSet(node.marks))
            found3 = true;
          return !found3;
        });
      return found3;
    }
    /**
    True when this is a block (non-inline node)
    */
    get isBlock() {
      return this.type.isBlock;
    }
    /**
    True when this is a textblock node, a block node with inline
    content.
    */
    get isTextblock() {
      return this.type.isTextblock;
    }
    /**
    True when this node allows inline content.
    */
    get inlineContent() {
      return this.type.inlineContent;
    }
    /**
    True when this is an inline node (a text node or a node that can
    appear among text).
    */
    get isInline() {
      return this.type.isInline;
    }
    /**
    True when this is a text node.
    */
    get isText() {
      return this.type.isText;
    }
    /**
    True when this is a leaf node.
    */
    get isLeaf() {
      return this.type.isLeaf;
    }
    /**
    True when this is an atom, i.e. when it does not have directly
    editable content. This is usually the same as `isLeaf`, but can
    be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
    on a node's spec (typically used when the node is displayed as
    an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
    */
    get isAtom() {
      return this.type.isAtom;
    }
    /**
    Return a string representation of this node for debugging
    purposes.
    */
    toString() {
      if (this.type.spec.toDebugString)
        return this.type.spec.toDebugString(this);
      let name = this.type.name;
      if (this.content.size)
        name += "(" + this.content.toStringInner() + ")";
      return wrapMarks(this.marks, name);
    }
    /**
    Get the content match in this node at the given index.
    */
    contentMatchAt(index) {
      let match2 = this.type.contentMatch.matchFragment(this.content, 0, index);
      if (!match2)
        throw new Error("Called contentMatchAt on a node with invalid content");
      return match2;
    }
    /**
    Test whether replacing the range between `from` and `to` (by
    child index) with the given replacement fragment (which defaults
    to the empty fragment) would leave the node's content valid. You
    can optionally pass `start` and `end` indices into the
    replacement fragment.
    */
    canReplace(from2, to, replacement = Fragment.empty, start = 0, end = replacement.childCount) {
      let one = this.contentMatchAt(from2).matchFragment(replacement, start, end);
      let two = one && one.matchFragment(this.content, to);
      if (!two || !two.validEnd)
        return false;
      for (let i = start; i < end; i++)
        if (!this.type.allowsMarks(replacement.child(i).marks))
          return false;
      return true;
    }
    /**
    Test whether replacing the range `from` to `to` (by index) with
    a node of the given type would leave the node's content valid.
    */
    canReplaceWith(from2, to, type, marks) {
      if (marks && !this.type.allowsMarks(marks))
        return false;
      let start = this.contentMatchAt(from2).matchType(type);
      let end = start && start.matchFragment(this.content, to);
      return end ? end.validEnd : false;
    }
    /**
    Test whether the given node's content could be appended to this
    node. If that node is empty, this will only return true if there
    is at least one node type that can appear in both nodes (to avoid
    merging completely incompatible nodes).
    */
    canAppend(other) {
      if (other.content.size)
        return this.canReplace(this.childCount, this.childCount, other.content);
      else
        return this.type.compatibleContent(other.type);
    }
    /**
    Check whether this node and its descendants conform to the
    schema, and raise an exception when they do not.
    */
    check() {
      this.type.checkContent(this.content);
      this.type.checkAttrs(this.attrs);
      let copy5 = Mark.none;
      for (let i = 0; i < this.marks.length; i++) {
        let mark = this.marks[i];
        mark.type.checkAttrs(mark.attrs);
        copy5 = mark.addToSet(copy5);
      }
      if (!Mark.sameSet(copy5, this.marks))
        throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((m) => m.type.name)}`);
      this.content.forEach((node) => node.check());
    }
    /**
    Return a JSON-serializeable representation of this node.
    */
    toJSON() {
      let obj = { type: this.type.name };
      for (let _ in this.attrs) {
        obj.attrs = this.attrs;
        break;
      }
      if (this.content.size)
        obj.content = this.content.toJSON();
      if (this.marks.length)
        obj.marks = this.marks.map((n) => n.toJSON());
      return obj;
    }
    /**
    Deserialize a node from its JSON representation.
    */
    static fromJSON(schema2, json) {
      if (!json)
        throw new RangeError("Invalid input for Node.fromJSON");
      let marks = void 0;
      if (json.marks) {
        if (!Array.isArray(json.marks))
          throw new RangeError("Invalid mark data for Node.fromJSON");
        marks = json.marks.map(schema2.markFromJSON);
      }
      if (json.type == "text") {
        if (typeof json.text != "string")
          throw new RangeError("Invalid text node in JSON");
        return schema2.text(json.text, marks);
      }
      let content = Fragment.fromJSON(schema2, json.content);
      let node = schema2.nodeType(json.type).create(json.attrs, content, marks);
      node.type.checkAttrs(node.attrs);
      return node;
    }
  };
  Node.prototype.text = void 0;
  var TextNode = class _TextNode extends Node {
    /**
    @internal
    */
    constructor(type, attrs, content, marks) {
      super(type, attrs, null, marks);
      if (!content)
        throw new RangeError("Empty text nodes are not allowed");
      this.text = content;
    }
    toString() {
      if (this.type.spec.toDebugString)
        return this.type.spec.toDebugString(this);
      return wrapMarks(this.marks, JSON.stringify(this.text));
    }
    get textContent() {
      return this.text;
    }
    textBetween(from2, to) {
      return this.text.slice(from2, to);
    }
    get nodeSize() {
      return this.text.length;
    }
    mark(marks) {
      return marks == this.marks ? this : new _TextNode(this.type, this.attrs, this.text, marks);
    }
    withText(text2) {
      if (text2 == this.text)
        return this;
      return new _TextNode(this.type, this.attrs, text2, this.marks);
    }
    cut(from2 = 0, to = this.text.length) {
      if (from2 == 0 && to == this.text.length)
        return this;
      return this.withText(this.text.slice(from2, to));
    }
    eq(other) {
      return this.sameMarkup(other) && this.text == other.text;
    }
    toJSON() {
      let base2 = super.toJSON();
      base2.text = this.text;
      return base2;
    }
  };
  function wrapMarks(marks, str) {
    for (let i = marks.length - 1; i >= 0; i--)
      str = marks[i].type.name + "(" + str + ")";
    return str;
  }
  var ContentMatch = class _ContentMatch {
    /**
    @internal
    */
    constructor(validEnd) {
      this.validEnd = validEnd;
      this.next = [];
      this.wrapCache = [];
    }
    /**
    @internal
    */
    static parse(string, nodeTypes) {
      let stream = new TokenStream(string, nodeTypes);
      if (stream.next == null)
        return _ContentMatch.empty;
      let expr = parseExpr(stream);
      if (stream.next)
        stream.err("Unexpected trailing text");
      let match2 = dfa(nfa(expr));
      checkForDeadEnds(match2, stream);
      return match2;
    }
    /**
    Match a node type, returning a match after that node if
    successful.
    */
    matchType(type) {
      for (let i = 0; i < this.next.length; i++)
        if (this.next[i].type == type)
          return this.next[i].next;
      return null;
    }
    /**
    Try to match a fragment. Returns the resulting match when
    successful.
    */
    matchFragment(frag, start = 0, end = frag.childCount) {
      let cur = this;
      for (let i = start; cur && i < end; i++)
        cur = cur.matchType(frag.child(i).type);
      return cur;
    }
    /**
    @internal
    */
    get inlineContent() {
      return this.next.length != 0 && this.next[0].type.isInline;
    }
    /**
    Get the first matching node type at this match position that can
    be generated.
    */
    get defaultType() {
      for (let i = 0; i < this.next.length; i++) {
        let { type } = this.next[i];
        if (!(type.isText || type.hasRequiredAttrs()))
          return type;
      }
      return null;
    }
    /**
    @internal
    */
    compatible(other) {
      for (let i = 0; i < this.next.length; i++)
        for (let j = 0; j < other.next.length; j++)
          if (this.next[i].type == other.next[j].type)
            return true;
      return false;
    }
    /**
    Try to match the given fragment, and if that fails, see if it can
    be made to match by inserting nodes in front of it. When
    successful, return a fragment of inserted nodes (which may be
    empty if nothing had to be inserted). When `toEnd` is true, only
    return a fragment if the resulting match goes to the end of the
    content expression.
    */
    fillBefore(after, toEnd = false, startIndex = 0) {
      let seen = [this];
      function search(match2, types) {
        let finished = match2.matchFragment(after, startIndex);
        if (finished && (!toEnd || finished.validEnd))
          return Fragment.from(types.map((tp) => tp.createAndFill()));
        for (let i = 0; i < match2.next.length; i++) {
          let { type, next } = match2.next[i];
          if (!(type.isText || type.hasRequiredAttrs()) && seen.indexOf(next) == -1) {
            seen.push(next);
            let found3 = search(next, types.concat(type));
            if (found3)
              return found3;
          }
        }
        return null;
      }
      return search(this, []);
    }
    /**
    Find a set of wrapping node types that would allow a node of the
    given type to appear at this position. The result may be empty
    (when it fits directly) and will be null when no such wrapping
    exists.
    */
    findWrapping(target) {
      for (let i = 0; i < this.wrapCache.length; i += 2)
        if (this.wrapCache[i] == target)
          return this.wrapCache[i + 1];
      let computed = this.computeWrapping(target);
      this.wrapCache.push(target, computed);
      return computed;
    }
    /**
    @internal
    */
    computeWrapping(target) {
      let seen = /* @__PURE__ */ Object.create(null), active = [{ match: this, type: null, via: null }];
      while (active.length) {
        let current = active.shift(), match2 = current.match;
        if (match2.matchType(target)) {
          let result = [];
          for (let obj = current; obj.type; obj = obj.via)
            result.push(obj.type);
          return result.reverse();
        }
        for (let i = 0; i < match2.next.length; i++) {
          let { type, next } = match2.next[i];
          if (!type.isLeaf && !type.hasRequiredAttrs() && !(type.name in seen) && (!current.type || next.validEnd)) {
            active.push({ match: type.contentMatch, type, via: current });
            seen[type.name] = true;
          }
        }
      }
      return null;
    }
    /**
    The number of outgoing edges this node has in the finite
    automaton that describes the content expression.
    */
    get edgeCount() {
      return this.next.length;
    }
    /**
    Get the _n_â€‹th outgoing edge from this node in the finite
    automaton that describes the content expression.
    */
    edge(n) {
      if (n >= this.next.length)
        throw new RangeError(`There's no ${n}th edge in this content match`);
      return this.next[n];
    }
    /**
    @internal
    */
    toString() {
      let seen = [];
      function scan(m) {
        seen.push(m);
        for (let i = 0; i < m.next.length; i++)
          if (seen.indexOf(m.next[i].next) == -1)
            scan(m.next[i].next);
      }
      scan(this);
      return seen.map((m, i) => {
        let out = i + (m.validEnd ? "*" : " ") + " ";
        for (let i2 = 0; i2 < m.next.length; i2++)
          out += (i2 ? ", " : "") + m.next[i2].type.name + "->" + seen.indexOf(m.next[i2].next);
        return out;
      }).join("\n");
    }
  };
  ContentMatch.empty = new ContentMatch(true);
  var TokenStream = class {
    constructor(string, nodeTypes) {
      this.string = string;
      this.nodeTypes = nodeTypes;
      this.inline = null;
      this.pos = 0;
      this.tokens = string.split(/\s*(?=\b|\W|$)/);
      if (this.tokens[this.tokens.length - 1] == "")
        this.tokens.pop();
      if (this.tokens[0] == "")
        this.tokens.shift();
    }
    get next() {
      return this.tokens[this.pos];
    }
    eat(tok) {
      return this.next == tok && (this.pos++ || true);
    }
    err(str) {
      throw new SyntaxError(str + " (in content expression '" + this.string + "')");
    }
  };
  function parseExpr(stream) {
    let exprs = [];
    do {
      exprs.push(parseExprSeq(stream));
    } while (stream.eat("|"));
    return exprs.length == 1 ? exprs[0] : { type: "choice", exprs };
  }
  function parseExprSeq(stream) {
    let exprs = [];
    do {
      exprs.push(parseExprSubscript(stream));
    } while (stream.next && stream.next != ")" && stream.next != "|");
    return exprs.length == 1 ? exprs[0] : { type: "seq", exprs };
  }
  function parseExprSubscript(stream) {
    let expr = parseExprAtom(stream);
    for (; ; ) {
      if (stream.eat("+"))
        expr = { type: "plus", expr };
      else if (stream.eat("*"))
        expr = { type: "star", expr };
      else if (stream.eat("?"))
        expr = { type: "opt", expr };
      else if (stream.eat("{"))
        expr = parseExprRange(stream, expr);
      else
        break;
    }
    return expr;
  }
  function parseNum(stream) {
    if (/\D/.test(stream.next))
      stream.err("Expected number, got '" + stream.next + "'");
    let result = Number(stream.next);
    stream.pos++;
    return result;
  }
  function parseExprRange(stream, expr) {
    let min2 = parseNum(stream), max2 = min2;
    if (stream.eat(",")) {
      if (stream.next != "}")
        max2 = parseNum(stream);
      else
        max2 = -1;
    }
    if (!stream.eat("}"))
      stream.err("Unclosed braced range");
    return { type: "range", min: min2, max: max2, expr };
  }
  function resolveName(stream, name) {
    let types = stream.nodeTypes, type = types[name];
    if (type)
      return [type];
    let result = [];
    for (let typeName in types) {
      let type2 = types[typeName];
      if (type2.isInGroup(name))
        result.push(type2);
    }
    if (result.length == 0)
      stream.err("No node type or group '" + name + "' found");
    return result;
  }
  function parseExprAtom(stream) {
    if (stream.eat("(")) {
      let expr = parseExpr(stream);
      if (!stream.eat(")"))
        stream.err("Missing closing paren");
      return expr;
    } else if (!/\W/.test(stream.next)) {
      let exprs = resolveName(stream, stream.next).map((type) => {
        if (stream.inline == null)
          stream.inline = type.isInline;
        else if (stream.inline != type.isInline)
          stream.err("Mixing inline and block content");
        return { type: "name", value: type };
      });
      stream.pos++;
      return exprs.length == 1 ? exprs[0] : { type: "choice", exprs };
    } else {
      stream.err("Unexpected token '" + stream.next + "'");
    }
  }
  function nfa(expr) {
    let nfa3 = [[]];
    connect(compile(expr, 0), node());
    return nfa3;
    function node() {
      return nfa3.push([]) - 1;
    }
    function edge(from2, to, term) {
      let edge2 = { term, to };
      nfa3[from2].push(edge2);
      return edge2;
    }
    function connect(edges, to) {
      edges.forEach((edge2) => edge2.to = to);
    }
    function compile(expr2, from2) {
      if (expr2.type == "choice") {
        return expr2.exprs.reduce((out, expr3) => out.concat(compile(expr3, from2)), []);
      } else if (expr2.type == "seq") {
        for (let i = 0; ; i++) {
          let next = compile(expr2.exprs[i], from2);
          if (i == expr2.exprs.length - 1)
            return next;
          connect(next, from2 = node());
        }
      } else if (expr2.type == "star") {
        let loop = node();
        edge(from2, loop);
        connect(compile(expr2.expr, loop), loop);
        return [edge(loop)];
      } else if (expr2.type == "plus") {
        let loop = node();
        connect(compile(expr2.expr, from2), loop);
        connect(compile(expr2.expr, loop), loop);
        return [edge(loop)];
      } else if (expr2.type == "opt") {
        return [edge(from2)].concat(compile(expr2.expr, from2));
      } else if (expr2.type == "range") {
        let cur = from2;
        for (let i = 0; i < expr2.min; i++) {
          let next = node();
          connect(compile(expr2.expr, cur), next);
          cur = next;
        }
        if (expr2.max == -1) {
          connect(compile(expr2.expr, cur), cur);
        } else {
          for (let i = expr2.min; i < expr2.max; i++) {
            let next = node();
            edge(cur, next);
            connect(compile(expr2.expr, cur), next);
            cur = next;
          }
        }
        return [edge(cur)];
      } else if (expr2.type == "name") {
        return [edge(from2, void 0, expr2.value)];
      } else {
        throw new Error("Unknown expr type");
      }
    }
  }
  function cmp(a, b) {
    return b - a;
  }
  function nullFrom(nfa3, node) {
    let result = [];
    scan(node);
    return result.sort(cmp);
    function scan(node2) {
      let edges = nfa3[node2];
      if (edges.length == 1 && !edges[0].term)
        return scan(edges[0].to);
      result.push(node2);
      for (let i = 0; i < edges.length; i++) {
        let { term, to } = edges[i];
        if (!term && result.indexOf(to) == -1)
          scan(to);
      }
    }
  }
  function dfa(nfa3) {
    let labeled = /* @__PURE__ */ Object.create(null);
    return explore(nullFrom(nfa3, 0));
    function explore(states) {
      let out = [];
      states.forEach((node) => {
        nfa3[node].forEach(({ term, to }) => {
          if (!term)
            return;
          let set;
          for (let i = 0; i < out.length; i++)
            if (out[i][0] == term)
              set = out[i][1];
          nullFrom(nfa3, to).forEach((node2) => {
            if (!set)
              out.push([term, set = []]);
            if (set.indexOf(node2) == -1)
              set.push(node2);
          });
        });
      });
      let state = labeled[states.join(",")] = new ContentMatch(states.indexOf(nfa3.length - 1) > -1);
      for (let i = 0; i < out.length; i++) {
        let states2 = out[i][1].sort(cmp);
        state.next.push({ type: out[i][0], next: labeled[states2.join(",")] || explore(states2) });
      }
      return state;
    }
  }
  function checkForDeadEnds(match2, stream) {
    for (let i = 0, work = [match2]; i < work.length; i++) {
      let state = work[i], dead = !state.validEnd, nodes = [];
      for (let j = 0; j < state.next.length; j++) {
        let { type, next } = state.next[j];
        nodes.push(type.name);
        if (dead && !(type.isText || type.hasRequiredAttrs()))
          dead = false;
        if (work.indexOf(next) == -1)
          work.push(next);
      }
      if (dead)
        stream.err("Only non-generatable nodes (" + nodes.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
    }
  }
  function defaultAttrs(attrs) {
    let defaults = /* @__PURE__ */ Object.create(null);
    for (let attrName in attrs) {
      let attr = attrs[attrName];
      if (!attr.hasDefault)
        return null;
      defaults[attrName] = attr.default;
    }
    return defaults;
  }
  function computeAttrs(attrs, value) {
    let built = /* @__PURE__ */ Object.create(null);
    for (let name in attrs) {
      let given = value && value[name];
      if (given === void 0) {
        let attr = attrs[name];
        if (attr.hasDefault)
          given = attr.default;
        else
          throw new RangeError("No value supplied for attribute " + name);
      }
      built[name] = given;
    }
    return built;
  }
  function checkAttrs(attrs, values, type, name) {
    for (let name2 in values)
      if (!(name2 in attrs))
        throw new RangeError(`Unsupported attribute ${name2} for ${type} of type ${name2}`);
    for (let name2 in attrs) {
      let attr = attrs[name2];
      if (attr.validate)
        attr.validate(values[name2]);
    }
  }
  function initAttrs(typeName, attrs) {
    let result = /* @__PURE__ */ Object.create(null);
    if (attrs)
      for (let name in attrs)
        result[name] = new Attribute(typeName, name, attrs[name]);
    return result;
  }
  var NodeType = class _NodeType {
    /**
    @internal
    */
    constructor(name, schema2, spec) {
      this.name = name;
      this.schema = schema2;
      this.spec = spec;
      this.markSet = null;
      this.groups = spec.group ? spec.group.split(" ") : [];
      this.attrs = initAttrs(name, spec.attrs);
      this.defaultAttrs = defaultAttrs(this.attrs);
      this.contentMatch = null;
      this.inlineContent = null;
      this.isBlock = !(spec.inline || name == "text");
      this.isText = name == "text";
    }
    /**
    True if this is an inline type.
    */
    get isInline() {
      return !this.isBlock;
    }
    /**
    True if this is a textblock type, a block that contains inline
    content.
    */
    get isTextblock() {
      return this.isBlock && this.inlineContent;
    }
    /**
    True for node types that allow no content.
    */
    get isLeaf() {
      return this.contentMatch == ContentMatch.empty;
    }
    /**
    True when this node is an atom, i.e. when it does not have
    directly editable content.
    */
    get isAtom() {
      return this.isLeaf || !!this.spec.atom;
    }
    /**
    Return true when this node type is part of the given
    [group](https://prosemirror.net/docs/ref/#model.NodeSpec.group).
    */
    isInGroup(group) {
      return this.groups.indexOf(group) > -1;
    }
    /**
    The node type's [whitespace](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) option.
    */
    get whitespace() {
      return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
    }
    /**
    Tells you whether this node type has any required attributes.
    */
    hasRequiredAttrs() {
      for (let n in this.attrs)
        if (this.attrs[n].isRequired)
          return true;
      return false;
    }
    /**
    Indicates whether this node allows some of the same content as
    the given node type.
    */
    compatibleContent(other) {
      return this == other || this.contentMatch.compatible(other.contentMatch);
    }
    /**
    @internal
    */
    computeAttrs(attrs) {
      if (!attrs && this.defaultAttrs)
        return this.defaultAttrs;
      else
        return computeAttrs(this.attrs, attrs);
    }
    /**
    Create a `Node` of this type. The given attributes are
    checked and defaulted (you can pass `null` to use the type's
    defaults entirely, if no required attributes exist). `content`
    may be a `Fragment`, a node, an array of nodes, or
    `null`. Similarly `marks` may be `null` to default to the empty
    set of marks.
    */
    create(attrs = null, content, marks) {
      if (this.isText)
        throw new Error("NodeType.create can't construct text nodes");
      return new Node(this, this.computeAttrs(attrs), Fragment.from(content), Mark.setFrom(marks));
    }
    /**
    Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
    against the node type's content restrictions, and throw an error
    if it doesn't match.
    */
    createChecked(attrs = null, content, marks) {
      content = Fragment.from(content);
      this.checkContent(content);
      return new Node(this, this.computeAttrs(attrs), content, Mark.setFrom(marks));
    }
    /**
    Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
    necessary to add nodes to the start or end of the given fragment
    to make it fit the node. If no fitting wrapping can be found,
    return null. Note that, due to the fact that required nodes can
    always be created, this will always succeed if you pass null or
    `Fragment.empty` as content.
    */
    createAndFill(attrs = null, content, marks) {
      attrs = this.computeAttrs(attrs);
      content = Fragment.from(content);
      if (content.size) {
        let before = this.contentMatch.fillBefore(content);
        if (!before)
          return null;
        content = before.append(content);
      }
      let matched = this.contentMatch.matchFragment(content);
      let after = matched && matched.fillBefore(Fragment.empty, true);
      if (!after)
        return null;
      return new Node(this, attrs, content.append(after), Mark.setFrom(marks));
    }
    /**
    Returns true if the given fragment is valid content for this node
    type.
    */
    validContent(content) {
      let result = this.contentMatch.matchFragment(content);
      if (!result || !result.validEnd)
        return false;
      for (let i = 0; i < content.childCount; i++)
        if (!this.allowsMarks(content.child(i).marks))
          return false;
      return true;
    }
    /**
    Throws a RangeError if the given fragment is not valid content for this
    node type.
    @internal
    */
    checkContent(content) {
      if (!this.validContent(content))
        throw new RangeError(`Invalid content for node ${this.name}: ${content.toString().slice(0, 50)}`);
    }
    /**
    @internal
    */
    checkAttrs(attrs) {
      checkAttrs(this.attrs, attrs, "node", this.name);
    }
    /**
    Check whether the given mark type is allowed in this node.
    */
    allowsMarkType(markType) {
      return this.markSet == null || this.markSet.indexOf(markType) > -1;
    }
    /**
    Test whether the given set of marks are allowed in this node.
    */
    allowsMarks(marks) {
      if (this.markSet == null)
        return true;
      for (let i = 0; i < marks.length; i++)
        if (!this.allowsMarkType(marks[i].type))
          return false;
      return true;
    }
    /**
    Removes the marks that are not allowed in this node from the given set.
    */
    allowedMarks(marks) {
      if (this.markSet == null)
        return marks;
      let copy5;
      for (let i = 0; i < marks.length; i++) {
        if (!this.allowsMarkType(marks[i].type)) {
          if (!copy5)
            copy5 = marks.slice(0, i);
        } else if (copy5) {
          copy5.push(marks[i]);
        }
      }
      return !copy5 ? marks : copy5.length ? copy5 : Mark.none;
    }
    /**
    @internal
    */
    static compile(nodes, schema2) {
      let result = /* @__PURE__ */ Object.create(null);
      nodes.forEach((name, spec) => result[name] = new _NodeType(name, schema2, spec));
      let topType = schema2.spec.topNode || "doc";
      if (!result[topType])
        throw new RangeError("Schema is missing its top node type ('" + topType + "')");
      if (!result.text)
        throw new RangeError("Every schema needs a 'text' type");
      for (let _ in result.text.attrs)
        throw new RangeError("The text node type should not have attributes");
      return result;
    }
  };
  function validateType(typeName, attrName, type) {
    let types = type.split("|");
    return (value) => {
      let name = value === null ? "null" : typeof value;
      if (types.indexOf(name) < 0)
        throw new RangeError(`Expected value of type ${types} for attribute ${attrName} on type ${typeName}, got ${name}`);
    };
  }
  var Attribute = class {
    constructor(typeName, attrName, options) {
      this.hasDefault = Object.prototype.hasOwnProperty.call(options, "default");
      this.default = options.default;
      this.validate = typeof options.validate == "string" ? validateType(typeName, attrName, options.validate) : options.validate;
    }
    get isRequired() {
      return !this.hasDefault;
    }
  };
  var MarkType = class _MarkType {
    /**
    @internal
    */
    constructor(name, rank, schema2, spec) {
      this.name = name;
      this.rank = rank;
      this.schema = schema2;
      this.spec = spec;
      this.attrs = initAttrs(name, spec.attrs);
      this.excluded = null;
      let defaults = defaultAttrs(this.attrs);
      this.instance = defaults ? new Mark(this, defaults) : null;
    }
    /**
    Create a mark of this type. `attrs` may be `null` or an object
    containing only some of the mark's attributes. The others, if
    they have defaults, will be added.
    */
    create(attrs = null) {
      if (!attrs && this.instance)
        return this.instance;
      return new Mark(this, computeAttrs(this.attrs, attrs));
    }
    /**
    @internal
    */
    static compile(marks, schema2) {
      let result = /* @__PURE__ */ Object.create(null), rank = 0;
      marks.forEach((name, spec) => result[name] = new _MarkType(name, rank++, schema2, spec));
      return result;
    }
    /**
    When there is a mark of this type in the given set, a new set
    without it is returned. Otherwise, the input set is returned.
    */
    removeFromSet(set) {
      for (var i = 0; i < set.length; i++)
        if (set[i].type == this) {
          set = set.slice(0, i).concat(set.slice(i + 1));
          i--;
        }
      return set;
    }
    /**
    Tests whether there is a mark of this type in the given set.
    */
    isInSet(set) {
      for (let i = 0; i < set.length; i++)
        if (set[i].type == this)
          return set[i];
    }
    /**
    @internal
    */
    checkAttrs(attrs) {
      checkAttrs(this.attrs, attrs, "mark", this.name);
    }
    /**
    Queries whether a given mark type is
    [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
    */
    excludes(other) {
      return this.excluded.indexOf(other) > -1;
    }
  };
  var Schema2 = class {
    /**
    Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
    */
    constructor(spec) {
      this.linebreakReplacement = null;
      this.cached = /* @__PURE__ */ Object.create(null);
      let instanceSpec = this.spec = {};
      for (let prop in spec)
        instanceSpec[prop] = spec[prop];
      instanceSpec.nodes = dist_default.from(spec.nodes), instanceSpec.marks = dist_default.from(spec.marks || {}), this.nodes = NodeTypÛ®zç¶òµë(š+myÝ•”¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½Õ¥‘”¼•¹•É…Ñ…‰±”¤ˆ¤ì(€€€ô(€ô(€™Õ¹Ñ¥½¸¥ÍQ…IÕ±”È¡ÉÕ±”¤ì(€€€É•ÑÕÉ¸ÉÕ±”¹Ñ…œ€„ô¹Õ±°ì(€ô(€™Õ¹Ñ¥½¸¥ÍMÑå±•IÕ±”È¡ÉÕ±”¤ì(€€€É•ÑÕÉ¸ÉÕ±”¹ÍÑå±”€„ô¹Õ±°ì(€ô(€Ù…È=5A…ÉÍ•ÈÌ€ô±…ÍÌ}=5A…ÉÍ•Èì(€€€€¼¨¨(€€€É•…Ñ”„Á…ÉÍ•ÈÑ¡…ÐÑ…É•ÑÌÑ¡”¥Ù•¸Í¡•µ„°ÕÍ¥¹œÑ¡”¥Ù•¸(€€€Á…ÉÍ¥¹œÉÕ±•Ì¸(€€€€¨¼(€€€½¹ÍÑÉÕÑ½È¡Í¡•µ„È°ÉÕ±•Ì¤ì(€€€€€Ñ¡¥Ì¹Í¡•µ„€ôÍ¡•µ„Èì(€€€€€Ñ¡¥Ì¹ÉÕ±•Ì€ôÉÕ±•Ìì(€€€€€Ñ¡¥Ì¹Ñ…Ì€ômtì(€€€€€Ñ¡¥Ì¹ÍÑå±•Ì€ômtì(€€€€€±•Ðµ…Ñ¡•‘MÑå±•Ì€ôÑ¡¥Ì¹µ…Ñ¡•‘MÑå±•Ì€ômtì(€€€€€ÉÕ±•Ì¹™½É…  ¡ÉÕ±”¤€ôøì(€€€€€€€¥˜€¡¥ÍQ…IÕ±”È¡ÉÕ±”¤¤ì(€€€€€€€€€Ñ¡¥Ì¹Ñ…Ì¹ÁÕÍ ¡ÉÕ±”¤ì(€€€€€€€ô•±Í”¥˜€¡¥ÍMÑå±•IÕ±”È¡ÉÕ±”¤¤ì(€€€€€€€€€±•ÐÁÉ½À€ô€½mxõt¨¼¹•á•Œ¡ÉÕ±”¹ÍÑå±”¥lÁtì(€€€€€€€€€¥˜€¡µ…Ñ¡•‘MÑå±•Ì¹¥¹‘•á=˜¡ÁÉ½À¤€ð€À¤(€€€€€€€€€€€µ…Ñ¡•‘MÑå±•Ì¹ÁÕÍ ¡ÁÉ½À¤ì(€€€€€€€€€Ñ¡¥Ì¹ÍÑå±•Ì¹ÁÕÍ ¡ÉÕ±”¤ì(€€€€€€€ô(€€€€€ô¤ì(€€€€€Ñ¡¥Ì¹¹½Éµ…±¥é•1¥ÍÑÌ€ô€…Ñ¡¥Ì¹Ñ…Ì¹Í½µ” ¡È¤€ôøì(€€€€€€€¥˜€ „½x¡Õ±ñ½°¥qˆ¼¹Ñ•ÍÐ¡È¹Ñ…œ¤ñð€…È¹¹½‘”¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€±•Ð¹½‘”€ôÍ¡•µ„È¹¹½‘•ÍmÈ¹¹½‘•tì(€€€€€€€É•ÑÕÉ¸¹½‘”¹½¹Ñ•¹Ñ5…Ñ ¹µ…Ñ¡QåÁ”¡¹½‘”¤ì(€€€€€ô¤ì(€€€ô(€€€€¼¨¨(€€€A…ÉÍ”„‘½Õµ•¹Ð™É½´Ñ¡”½¹Ñ•¹Ð½˜„=4¹½‘”¸(€€€€¨¼(€€€Á…ÉÍ”¡‘½´°½ÁÑ¥½¹Ì€ôíô¤ì(€€€€€±•Ð½¹Ñ•áÐ€ô¹•ÜA…ÉÍ•½¹Ñ•áÐÈ¡Ñ¡¥Ì°½ÁÑ¥½¹Ì°™…±Í”¤ì(€€€€€½¹Ñ•áÐ¹…‘‘±°¡‘½´°5…É¬È¹¹½¹”°½ÁÑ¥½¹Ì¹™É½´°½ÁÑ¥½¹Ì¹Ñ¼¤ì(€€€€€É•ÑÕÉ¸½¹Ñ•áÐ¹™¥¹¥Í  ¤ì(€€€ô(€€€€¼¨¨(€€€A…ÉÍ•ÌÑ¡”½¹Ñ•¹Ð½˜Ñ¡”¥Ù•¸=4¹½‘”°±¥­”(€€€mÁ…ÉÍ•t¡¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½É•˜¼µ½‘•°¹=5A…ÉÍ•È¹Á…ÉÍ”¤°…¹Ñ…­•ÌÑ¡”Í…µ”Í•Ð½˜(€€€½ÁÑ¥½¹Ì¸	ÕÐÕ¹±¥­”Ñ¡…Ðµ•Ñ¡½°Ý¡¥ ÁÉ½‘Õ•Ì„Ý¡½±”¹½‘”°(€€€Ñ¡¥Ì½¹”É•ÑÕÉ¹Ì„Í±¥”Ñ¡…Ð¥Ì½Á•¸…ÐÑ¡”Í¥‘•Ì°µ•…¹¥¹œÑ¡…Ð(€€€Ñ¡”Í¡•µ„½¹ÍÑÉ…¥¹ÑÌ…É•¸Ð…ÁÁ±¥•Ñ¼Ñ¡”ÍÑ…ÉÐ½˜¹½‘•ÌÑ¼(€€€Ñ¡”±•™Ð½˜Ñ¡”¥¹ÁÕÐ…¹Ñ¡”•¹½˜¹½‘•Ì…ÐÑ¡”•¹¸(€€€€¨¼(€€€Á…ÉÍ•M±¥”¡‘½´°½ÁÑ¥½¹Ì€ôíô¤ì(€€€€€±•Ð½¹Ñ•áÐ€ô¹•ÜA…ÉÍ•½¹Ñ•áÐÈ¡Ñ¡¥Ì°½ÁÑ¥½¹Ì°ÑÉÕ”¤ì(€€€€€½¹Ñ•áÐ¹…‘‘±°¡‘½´°5…É¬È¹¹½¹”°½ÁÑ¥½¹Ì¹™É½´°½ÁÑ¥½¹Ì¹Ñ¼¤ì(€€€€€É•ÑÕÉ¸M±¥”È¹µ…á=Á•¸¡½¹Ñ•áÐ¹™¥¹¥Í  ¤¤ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€µ…Ñ¡Q…œ¡‘½´°½¹Ñ•áÐ°…™Ñ•È¤ì(€€€€€™½È€¡±•Ð¤€ô…™Ñ•È€üÑ¡¥Ì¹Ñ…Ì¹¥¹‘•á=˜¡…™Ñ•È¤€¬€Ä€è€Àì¤€ðÑ¡¥Ì¹Ñ…Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•ÐÉÕ±”€ôÑ¡¥Ì¹Ñ…Ím¥tì(€€€€€€€¥˜€¡µ…Ñ¡•ÌÈ¡‘½´°ÉÕ±”¹Ñ…œ¤€˜˜€¡ÉÕ±”¹¹…µ•ÍÁ…”€ôôôÙ½¥€Àñð‘½´¹¹…µ•ÍÁ…•UI$€ôôÉÕ±”¹¹…µ•ÍÁ…”¤€˜˜€ …ÉÕ±”¹½¹Ñ•áÐñð½¹Ñ•áÐ¹µ…Ñ¡•Í½¹Ñ•áÐ¡ÉÕ±”¹½¹Ñ•áÐ¤¤¤ì(€€€€€€€€€¥˜€¡ÉÕ±”¹•ÑÑÑÉÌ¤ì(€€€€€€€€€€€±•ÐÉ•ÍÕ±Ð€ôÉÕ±”¹•ÑÑÑÉÌ¡‘½´¤ì(€€€€€€€€€€€¥˜€¡É•ÍÕ±Ð€ôôô™…±Í”¤(€€€€€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€€€€€ÉÕ±”¹…ÑÑÉÌ€ôÉ•ÍÕ±ÐñðÙ½¥€Àì(€€€€€€€€€ô(€€€€€€€€€É•ÑÕÉ¸ÉÕ±”ì(€€€€€€€ô(€€€€€ô(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€µ…Ñ¡MÑå±”¡ÁÉ½À°Ù…±Õ”°½¹Ñ•áÐ°…™Ñ•È¤ì(€€€€€™½È€¡±•Ð¤€ô…™Ñ•È€üÑ¡¥Ì¹ÍÑå±•Ì¹¥¹‘•á=˜¡…™Ñ•È¤€¬€Ä€è€Àì¤€ðÑ¡¥Ì¹ÍÑå±•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•ÐÉÕ±”€ôÑ¡¥Ì¹ÍÑå±•Ím¥t°ÍÑå±”€ôÉÕ±”¹ÍÑå±”ì(€€€€€€€¥˜€¡ÍÑå±”¹¥¹‘•á=˜¡ÁÉ½À¤€„ô€ÀñðÉÕ±”¹½¹Ñ•áÐ€˜˜€…½¹Ñ•áÐ¹µ…Ñ¡•Í½¹Ñ•áÐ¡ÉÕ±”¹½¹Ñ•áÐ¤ñð€¼¼Q•ÍÐÑ¡…ÐÑ¡”ÍÑå±”ÍÑÉ¥¹œ•¥Ñ¡•ÈÁÉ•¥Í•±äµ…Ñ¡•ÌÑ¡”ÁÉ½À°(€€€€€€€€¼¼½È¡…Ì…¸€œôœÍ¥¸…™Ñ•ÈÑ¡”ÁÉ½À°™½±±½Ý•‰äÑ¡”¥Ù•¸(€€€€€€€€¼¼Ù…±Õ”¸(€€€€€€€ÍÑå±”¹±•¹Ñ €øÁÉ½À¹±•¹Ñ €˜˜€¡ÍÑå±”¹¡…É½‘•Ð¡ÁÉ½À¹±•¹Ñ ¤€„ô€ØÄñðÍÑå±”¹Í±¥”¡ÁÉ½À¹±•¹Ñ €¬€Ä¤€„ôÙ…±Õ”¤¤(€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€¥˜€¡ÉÕ±”¹•ÑÑÑÉÌ¤ì(€€€€€€€€€±•ÐÉ•ÍÕ±Ð€ôÉÕ±”¹•ÑÑÑÉÌ¡Ù…±Õ”¤ì(€€€€€€€€€¥˜€¡É•ÍÕ±Ð€ôôô™…±Í”¤(€€€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€€€ÉÕ±”¹…ÑÑÉÌ€ôÉ•ÍÕ±ÐñðÙ½¥€Àì(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸ÉÕ±”ì(€€€€€ô(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€ÍÑ…Ñ¥ŒÍ¡•µ…IÕ±•Ì¡Í¡•µ„È¤ì(€€€€€±•ÐÉ•ÍÕ±Ð€ômtì(€€€€€™Õ¹Ñ¥½¸¥¹Í•ÉÐ¡ÉÕ±”¤ì(€€€€€€€±•ÐÁÉ¥½É¥Ñä€ôÉÕ±”¹ÁÉ¥½É¥Ñä€ôô¹Õ±°€ü€ÔÀ€èÉÕ±”¹ÁÉ¥½É¥Ñä°¤€ô€Àì(€€€€€€€™½È€ ì¤€ðÉ•ÍÕ±Ð¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€±•Ð¹•áÐ€ôÉ•ÍÕ±Ñm¥t°¹•áÑAÉ¥½É¥Ñä€ô¹•áÐ¹ÁÉ¥½É¥Ñä€ôô¹Õ±°€ü€ÔÀ€è¹•áÐ¹ÁÉ¥½É¥Ñäì(€€€€€€€€€¥˜€¡¹•áÑAÉ¥½É¥Ñä€ðÁÉ¥½É¥Ñä¤(€€€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€€€É•ÍÕ±Ð¹ÍÁ±¥”¡¤°€À°ÉÕ±”¤ì(€€€€€ô(€€€€€™½È€¡±•Ð¹…µ”¥¸Í¡•µ„È¹µ…É­Ì¤ì(€€€€€€€±•ÐÉÕ±•Ì€ôÍ¡•µ„È¹µ…É­Ím¹…µ•t¹ÍÁ•Œ¹Á…ÉÍ•=4ì(€€€€€€€¥˜€¡ÉÕ±•Ì¤(€€€€€€€€€ÉÕ±•Ì¹™½É…  ¡ÉÕ±”¤€ôøì(€€€€€€€€€€€¥¹Í•ÉÐ¡ÉÕ±”€ô½ÁäÌ¡ÉÕ±”¤¤ì(€€€€€€€€€€€¥˜€ „¡ÉÕ±”¹µ…É¬ñðÉÕ±”¹¥¹½É”ñðÉÕ±”¹±•…É5…É¬¤¤(€€€€€€€€€€€€€ÉÕ±”¹µ…É¬€ô¹…µ”ì(€€€€€€€€€ô¤ì(€€€€€ô(€€€€€™½È€¡±•Ð¹…µ”¥¸Í¡•µ„È¹¹½‘•Ì¤ì(€€€€€€€±•ÐÉÕ±•Ì€ôÍ¡•µ„È¹¹½‘•Ím¹…µ•t¹ÍÁ•Œ¹Á…ÉÍ•=4ì(€€€€€€€¥˜€¡ÉÕ±•Ì¤(€€€€€€€€€ÉÕ±•Ì¹™½É…  ¡ÉÕ±”¤€ôøì(€€€€€€€€€€€¥¹Í•ÉÐ¡ÉÕ±”€ô½ÁäÌ¡ÉÕ±”¤¤ì(€€€€€€€€€€€¥˜€ „¡ÉÕ±”¹¹½‘”ñðÉÕ±”¹¥¹½É”ñðÉÕ±”¹µ…É¬¤¤(€€€€€€€€€€€€€ÉÕ±”¹¹½‘”€ô¹…µ”ì(€€€€€€€€€ô¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€€€ô(€€€€¼¨¨(€€€½¹ÍÑÉÕÐ„=4Á…ÉÍ•ÈÕÍ¥¹œÑ¡”Á…ÉÍ¥¹œÉÕ±•Ì±¥ÍÑ•¥¸„(€€€Í¡•µ„Ìm¹½‘”ÍÁ•Ít¡¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½É•˜¼µ½‘•°¹9½‘•MÁ•Œ¹Á…ÉÍ•=4¤°É•½É‘•É•‰ä(€€€mÁÉ¥½É¥Ñåt¡¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½É•˜¼µ½‘•°¹•¹•É¥A…ÉÍ•IÕ±”¹ÁÉ¥½É¥Ñä¤¸(€€€€¨¼(€€€ÍÑ…Ñ¥Œ™É½µM¡•µ„¡Í¡•µ„È¤ì(€€€€€É•ÑÕÉ¸Í¡•µ„È¹…¡•¹‘½µA…ÉÍ•Èñð€¡Í¡•µ„È¹…¡•¹‘½µA…ÉÍ•È€ô¹•Ü}=5A…ÉÍ•È¡Í¡•µ„È°}=5A…ÉÍ•È¹Í¡•µ…IÕ±•Ì¡Í¡•µ„È¤¤¤ì(€€€ô(€ôì(€Ù…È‰±½­Q…ÌÈ€ôì(€€€…‘‘É•ÍÌèÑÉÕ”°(€€€…ÉÑ¥±”èÑÉÕ”°(€€€…Í¥‘”èÑÉÕ”°(€€€‰±½­ÅÕ½Ñ”èÑÉÕ”°(€€€‰½‘äèÑÉÕ”°(€€€…¹Ù…ÌèÑÉÕ”°(€€€‘èÑÉÕ”°(€€€‘¥ØèÑÉÕ”°(€€€‘°èÑÉÕ”°(€€€™¥•±‘Í•ÐèÑÉÕ”°(€€€™¥…ÁÑ¥½¸èÑÉÕ”°(€€€™¥ÕÉ”èÑÉÕ”°(€€€™½½Ñ•ÈèÑÉÕ”°(€€€™½É´èÑÉÕ”°(€€€ ÄèÑÉÕ”°(€€€ ÈèÑÉÕ”°(€€€ ÌèÑÉÕ”°(€€€ ÐèÑÉÕ”°(€€€ ÔèÑÉÕ”°(€€€ ØèÑÉÕ”°(€€€¡•…‘•ÈèÑÉÕ”°(€€€¡É½ÕÀèÑÉÕ”°(€€€¡ÈèÑÉÕ”°(€€€±¤èÑÉÕ”°(€€€¹½ÍÉ¥ÁÐèÑÉÕ”°(€€€½°èÑÉÕ”°(€€€½ÕÑÁÕÐèÑÉÕ”°(€€€ÀèÑÉÕ”°(€€€ÁÉ”èÑÉÕ”°(€€€Í•Ñ¥½¸èÑÉÕ”°(€€€Ñ…‰±”èÑÉÕ”°(€€€Ñ™½½ÐèÑÉÕ”°(€€€Õ°èÑÉÕ”(€ôì(€Ù…È¥¹½É•Q…ÌÈ€ôì(€€€¡•…èÑÉÕ”°(€€€¹½ÍÉ¥ÁÐèÑÉÕ”°(€€€½‰©•ÐèÑÉÕ”°(€€€ÍÉ¥ÁÐèÑÉÕ”°(€€€ÍÑå±”èÑÉÕ”°(€€€Ñ¥Ñ±”èÑÉÕ”(€ôì(€Ù…È±¥ÍÑQ…ÌÈ€ôì½°èÑÉÕ”°Õ°èÑÉÕ”ôì(€Ù…È=AQ}AIMIY}]LÈ€ô€Äì(€Ù…È=AQ}AIMIY}]M}U10È€ô€Èì(€Ù…È=AQ}=A9}1PÈ€ô€Ðì(€™Õ¹Ñ¥½¸ÝÍ=ÁÑ¥½¹Í½ÈÈ¡ÑåÁ”°ÁÉ•Í•ÉÙ•]¡¥Ñ•ÍÁ…”°‰…Í”È¤ì(€€€¥˜€¡ÁÉ•Í•ÉÙ•]¡¥Ñ•ÍÁ…”€„ô¹Õ±°¤(€€€€€É•ÑÕÉ¸€¡ÁÉ•Í•ÉÙ•]¡¥Ñ•ÍÁ…”€ü=AQ}AIMIY}]LÈ€è€À¤ð€¡ÁÉ•Í•ÉÙ•]¡¥Ñ•ÍÁ…”€ôôô€‰™Õ±°ˆ€ü=AQ}AIMIY}]M}U10È€è€À¤ì(€€€É•ÑÕÉ¸ÑåÁ”€˜˜ÑåÁ”¹Ý¡¥Ñ•ÍÁ…”€ôô€‰ÁÉ”ˆ€ü=AQ}AIMIY}]LÈð=AQ}AIMIY}]M}U10È€è‰…Í”È€˜ù=AQ}=A9}1PÈì(€ô(€Ù…È9½‘•½¹Ñ•áÐÈ€ô±…ÍÌì(€€€½¹ÍÑÉÕÑ½È¡ÑåÁ”°…ÑÑÉÌ°µ…É­Ì°Í½±¥°µ…Ñ È°½ÁÑ¥½¹Ì¤ì(€€€€€Ñ¡¥Ì¹ÑåÁ”€ôÑåÁ”ì(€€€€€Ñ¡¥Ì¹…ÑÑÉÌ€ô…ÑÑÉÌì(€€€€€Ñ¡¥Ì¹µ…É­Ì€ôµ…É­Ìì(€€€€€Ñ¡¥Ì¹Í½±¥€ôÍ½±¥ì(€€€€€Ñ¡¥Ì¹½ÁÑ¥½¹Ì€ô½ÁÑ¥½¹Ìì(€€€€€Ñ¡¥Ì¹½¹Ñ•¹Ð€ômtì(€€€€€Ñ¡¥Ì¹…Ñ¥Ù•5…É­Ì€ô5…É¬È¹¹½¹”ì(€€€€€Ñ¡¥Ì¹µ…Ñ €ôµ…Ñ Èñð€¡½ÁÑ¥½¹Ì€˜=AQ}=A9}1PÈ€ü¹Õ±°€èÑåÁ”¹½¹Ñ•¹Ñ5…Ñ ¤ì(€€€ô(€€€™¥¹‘]É…ÁÁ¥¹œ¡¹½‘”¤ì(€€€€€¥˜€ …Ñ¡¥Ì¹µ…Ñ ¤ì(€€€€€€€¥˜€ …Ñ¡¥Ì¹ÑåÁ”¤(€€€€€€€€€É•ÑÕÉ¸mtì(€€€€€€€±•Ð™¥±°€ôÑ¡¥Ì¹ÑåÁ”¹½¹Ñ•¹Ñ5…Ñ ¹™¥±±	•™½É”¡É…µ•¹ÐÈ¹™É½´¡¹½‘”¤¤ì(€€€€€€€¥˜€¡™¥±°¤ì(€€€€€€€€€Ñ¡¥Ì¹µ…Ñ €ôÑ¡¥Ì¹ÑåÁ”¹½¹Ñ•¹Ñ5…Ñ ¹µ…Ñ¡É…µ•¹Ð¡™¥±°¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€±•ÐÍÑ…ÉÐ€ôÑ¡¥Ì¹ÑåÁ”¹½¹Ñ•¹Ñ5…Ñ °ÝÉ…ÀÈì(€€€€€€€€€¥˜€¡ÝÉ…ÀÈ€ôÍÑ…ÉÐ¹™¥¹‘]É…ÁÁ¥¹œ¡¹½‘”¹ÑåÁ”¤¤ì(€€€€€€€€€€€Ñ¡¥Ì¹µ…Ñ €ôÍÑ…ÉÐì(€€€€€€€€€€€É•ÑÕÉ¸ÝÉ…ÀÈì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€ô(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹µ…Ñ ¹™¥¹‘]É…ÁÁ¥¹œ¡¹½‘”¹ÑåÁ”¤ì(€€€ô(€€€™¥¹¥Í ¡½Á•¹¹¤ì(€€€€€¥˜€ „¡Ñ¡¥Ì¹½ÁÑ¥½¹Ì€˜=AQ}AIMIY}]LÈ¤¤ì(€€€€€€€±•Ð±…ÍÐÈ€ôÑ¡¥Ì¹½¹Ñ•¹ÑmÑ¡¥Ì¹½¹Ñ•¹Ð¹±•¹Ñ €´€Åt°´ì(€€€€€€€¥˜€¡±…ÍÐÈ€˜˜±…ÍÐÈ¹¥ÍQ•áÐ€˜˜€¡´€ô€½lqÑqÉq¹qÔÀÀÁt¬¼¹•á•Œ¡±…ÍÐÈ¹Ñ•áÐ¤¤¤ì(€€€€€€€€€±•ÐÑ•áÐÈ€ô±…ÍÐÈì(€€€€€€€€€¥˜€¡±…ÍÐÈ¹Ñ•áÐ¹±•¹Ñ €ôôµlÁt¹±•¹Ñ ¤(€€€€€€€€€€€Ñ¡¥Ì¹½¹Ñ•¹Ð¹Á½À ¤ì(€€€€€€€€€•±Í”(€€€€€€€€€€€Ñ¡¥Ì¹½¹Ñ•¹ÑmÑ¡¥Ì¹½¹Ñ•¹Ð¹±•¹Ñ €´€Åt€ôÑ•áÐÈ¹Ý¥Ñ¡Q•áÐ¡Ñ•áÐÈ¹Ñ•áÐ¹Í±¥” À°Ñ•áÐÈ¹Ñ•áÐ¹±•¹Ñ €´µlÁt¹±•¹Ñ ¤¤ì(€€€€€€€ô(€€€€€ô(€€€€€±•Ð½¹Ñ•¹Ð€ôÉ…µ•¹ÐÈ¹™É½´¡Ñ¡¥Ì¹½¹Ñ•¹Ð¤ì(€€€€€¥˜€ …½Á•¹¹€˜˜Ñ¡¥Ì¹µ…Ñ ¤(€€€€€€€½¹Ñ•¹Ð€ô½¹Ñ•¹Ð¹…ÁÁ•¹¡Ñ¡¥Ì¹µ…Ñ ¹™¥±±	•™½É”¡É…µ•¹ÐÈ¹•µÁÑä°ÑÉÕ”¤¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÑåÁ”€üÑ¡¥Ì¹ÑåÁ”¹É•…Ñ”¡Ñ¡¥Ì¹…ÑÑÉÌ°½¹Ñ•¹Ð°Ñ¡¥Ì¹µ…É­Ì¤€è½¹Ñ•¹Ðì(€€€ô(€€€¥¹±¥¹•½¹Ñ•áÐ¡¹½‘”¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹ÑåÁ”¤(€€€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÑåÁ”¹¥¹±¥¹•½¹Ñ•¹Ðì(€€€€€¥˜€¡Ñ¡¥Ì¹½¹Ñ•¹Ð¹±•¹Ñ ¤(€€€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹½¹Ñ•¹ÑlÁt¹¥Í%¹±¥¹”ì(€€€€€É•ÑÕÉ¸¹½‘”¹Á…É•¹Ñ9½‘”€˜˜€…‰±½­Q…ÌÈ¹¡…Í=Ý¹AÉ½Á•ÉÑä¡¹½‘”¹Á…É•¹Ñ9½‘”¹¹½‘•9…µ”¹Ñ½1½Ý•É…Í” ¤¤ì(€€€ô(€ôì(€Ù…ÈA…ÉÍ•½¹Ñ•áÐÈ€ô±…ÍÌì(€€€½¹ÍÑÉÕÑ½È¡Á…ÉÍ•È°½ÁÑ¥½¹Ì°¥Í=Á•¸¤ì(€€€€€Ñ¡¥Ì¹Á…ÉÍ•È€ôÁ…ÉÍ•Èì(€€€€€Ñ¡¥Ì¹½ÁÑ¥½¹Ì€ô½ÁÑ¥½¹Ìì(€€€€€Ñ¡¥Ì¹¥Í=Á•¸€ô¥Í=Á•¸ì(€€€€€Ñ¡¥Ì¹½Á•¸€ô€Àì(€€€€€Ñ¡¥Ì¹±½…±AÉ•Í•ÉÙ•]L€ô™…±Í”ì(€€€€€±•ÐÑ½Á9½‘”€ô½ÁÑ¥½¹Ì¹Ñ½Á9½‘”°Ñ½Á½¹Ñ•áÐì(€€€€€±•ÐÑ½Á=ÁÑ¥½¹Ì€ôÝÍ=ÁÑ¥½¹Í½ÈÈ¡¹Õ±°°½ÁÑ¥½¹Ì¹ÁÉ•Í•ÉÙ•]¡¥Ñ•ÍÁ…”°€À¤ð€¡¥Í=Á•¸€ü=AQ}=A9}1PÈ€è€À¤ì(€€€€€¥˜€¡Ñ½Á9½‘”¤(€€€€€€€Ñ½Á½¹Ñ•áÐ€ô¹•Ü9½‘•½¹Ñ•áÐÈ¡Ñ½Á9½‘”¹ÑåÁ”°Ñ½Á9½‘”¹…ÑÑÉÌ°5…É¬È¹¹½¹”°ÑÉÕ”°½ÁÑ¥½¹Ì¹Ñ½Á5…Ñ ñðÑ½Á9½‘”¹ÑåÁ”¹½¹Ñ•¹Ñ5…Ñ °Ñ½Á=ÁÑ¥½¹Ì¤ì(€€€€€•±Í”¥˜€¡¥Í=Á•¸¤(€€€€€€€Ñ½Á½¹Ñ•áÐ€ô¹•Ü9½‘•½¹Ñ•áÐÈ¡¹Õ±°°¹Õ±°°5…É¬È¹¹½¹”°ÑÉÕ”°¹Õ±°°Ñ½Á=ÁÑ¥½¹Ì¤ì(€€€€€•±Í”(€€€€€€€Ñ½Á½¹Ñ•áÐ€ô¹•Ü9½‘•½¹Ñ•áÐÈ¡Á…ÉÍ•È¹Í¡•µ„¹Ñ½Á9½‘•QåÁ”°¹Õ±°°5…É¬È¹¹½¹”°ÑÉÕ”°¹Õ±°°Ñ½Á=ÁÑ¥½¹Ì¤ì(€€€€€Ñ¡¥Ì¹¹½‘•Ì€ômÑ½Á½¹Ñ•áÑtì(€€€€€Ñ¡¥Ì¹™¥¹€ô½ÁÑ¥½¹Ì¹™¥¹‘A½Í¥Ñ¥½¹Ìì(€€€€€Ñ¡¥Ì¹¹••‘Í	±½¬€ô™…±Í”ì(€€€ô(€€€•ÐÑ½À ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹¹½‘•ÍmÑ¡¥Ì¹½Á•¹tì(€€€ô(€€€€¼¼‘„=4¹½‘”Ñ¼Ñ¡”½¹Ñ•¹Ð¸Q•áÐ¥Ì¥¹Í•ÉÑ•…ÌÑ•áÐ¹½‘”°(€€€€¼¼½Ñ¡•ÉÝ¥Í”°Ñ¡”¹½‘”¥ÌÁ…ÍÍ•Ñ¼…‘‘±•µ•¹Ñ€½È°¥˜¥Ð¡…Ì„(€€€€¼¼ÍÑå±•€…ÑÑÉ¥‰ÕÑ”°…‘‘±•µ•¹Ñ]¥Ñ¡MÑå±•Í€¸(€€€…‘‘=4¡‘½´°µ…É­Ì¤ì(€€€€€¥˜€¡‘½´¹¹½‘•QåÁ”€ôô€Ì¤(€€€€€€€Ñ¡¥Ì¹…‘‘Q•áÑ9½‘”¡‘½´°µ…É­Ì¤ì(€€€€€•±Í”¥˜€¡‘½´¹¹½‘•QåÁ”€ôô€Ä¤(€€€€€€€Ñ¡¥Ì¹…‘‘±•µ•¹Ð¡‘½´°µ…É­Ì¤ì(€€€ô(€€€…‘‘Q•áÑ9½‘”¡‘½´°µ…É­Ì¤ì(€€€€€±•ÐÙ…±Õ”€ô‘½´¹¹½‘•Y…±Õ”ì(€€€€€±•ÐÑ½À€ôÑ¡¥Ì¹Ñ½À°ÁÉ•Í•ÉÙ•]L€ôÑ½À¹½ÁÑ¥½¹Ì€˜=AQ}AIMIY}]M}U10È€ü€‰™Õ±°ˆ€èÑ¡¥Ì¹±½…±AÉ•Í•ÉÙ•]Lñð€¡Ñ½À¹½ÁÑ¥½¹Ì€˜=AQ}AIMIY}]LÈ¤€ø€Àì(€€€€€±•ÐìÍ¡•µ„èÍ¡•µ„Èô€ôÑ¡¥Ì¹Á…ÉÍ•Èì(€€€€€¥˜€¡ÁÉ•Í•ÉÙ•]L€ôôô€‰™Õ±°ˆñðÑ½À¹¥¹±¥¹•½¹Ñ•áÐ¡‘½´¤ñð€½mxqÑqÉq¹qÔÀÀÁt¼¹Ñ•ÍÐ¡Ù…±Õ”¤¤ì(€€€€€€€¥˜€ …ÁÉ•Í•ÉÙ•]L¤ì(€€€€€€€€€Ù…±Õ”€ôÙ…±Õ”¹É•Á±…” ½lqÑqÉq¹qÔÀÀÁt¬½œ°€ˆ€ˆ¤ì(€€€€€€€€€¥˜€ ½ylqÑqÉq¹qÔÀÀÁt¼¹Ñ•ÍÐ¡Ù…±Õ”¤€˜˜Ñ¡¥Ì¹½Á•¸€ôôÑ¡¥Ì¹¹½‘•Ì¹±•¹Ñ €´€Ä¤ì(€€€€€€€€€€€±•Ð¹½‘•	•™½É”€ôÑ½À¹½¹Ñ•¹ÑmÑ½À¹½¹Ñ•¹Ð¹±•¹Ñ €´€Åtì(€€€€€€€€€€€±•Ð‘½µ9½‘•	•™½É”€ô‘½´¹ÁÉ•Ù¥½ÕÍM¥‰±¥¹œì(€€€€€€€€€€€¥˜€ …¹½‘•	•™½É”ñð‘½µ9½‘•	•™½É”€˜˜‘½µ9½‘•	•™½É”¹¹½‘•9…µ”€ôô€‰	Hˆñð¹½‘•	•™½É”¹¥ÍQ•áÐ€˜˜€½lqÑqÉq¹qÔÀÀÁt¼¹Ñ•ÍÐ¡¹½‘•	•™½É”¹Ñ•áÐ¤¤(€€€€€€€€€€€€€Ù…±Õ”€ôÙ…±Õ”¹Í±¥” Ä¤ì(€€€€€€€€€ô(€€€€€€€ô•±Í”¥˜€¡ÁÉ•Í•ÉÙ•]L€ôôô€‰™Õ±°ˆ¤ì(€€€€€€€€€Ù…±Õ”€ôÙ…±Õ”¹É•Á±…” ½qÉq¸ü½œ°€‰q¸ˆ¤ì(€€€€€€€ô•±Í”¥˜€¡Í¡•µ„È¹±¥¹•‰É•…­I•Á±…•µ•¹Ð€˜˜€½mqÉq¹t¼¹Ñ•ÍÐ¡Ù…±Õ”¤€˜˜Ñ¡¥Ì¹Ñ½À¹™¥¹‘]É…ÁÁ¥¹œ¡Í¡•µ„È¹±¥¹•‰É•…­I•Á±…•µ•¹Ð¹É•…Ñ” ¤¤¤ì(€€€€€€€€€±•Ð±¥¹•Ì€ôÙ…±Õ”¹ÍÁ±¥Ð ½qÈýq¹ñqÈ¼¤ì(€€€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð±¥¹•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€€€¥˜€¡¤¤(€€€€€€€€€€€€€Ñ¡¥Ì¹¥¹Í•ÉÑ9½‘”¡Í¡•µ„È¹±¥¹•‰É•…­I•Á±…•µ•¹Ð¹É•…Ñ” ¤°µ…É­Ì°ÑÉÕ”¤ì(€€€€€€€€€€€¥˜€¡±¥¹•Ím¥t¤(€€€€€€€€€€€€€Ñ¡¥Ì¹¥¹Í•ÉÑ9½‘”¡Í¡•µ„È¹Ñ•áÐ¡±¥¹•Ím¥t¤°µ…É­Ì°€„½qL¼¹Ñ•ÍÐ¡±¥¹•Ím¥t¤¤ì(€€€€€€€€€ô(€€€€€€€€€Ù…±Õ”€ô€ˆˆì(€€€€€€€ô•±Í”ì(€€€€€€€€€Ù…±Õ”€ôÙ…±Õ”¹É•Á±…” ½qÈýq¹ñqÈ½œ°€ˆ€ˆ¤ì(€€€€€€€ô(€€€€€€€¥˜€¡Ù…±Õ”¤(€€€€€€€€€Ñ¡¥Ì¹¥¹Í•ÉÑ9½‘”¡Í¡•µ„È¹Ñ•áÐ¡Ù…±Õ”¤°µ…É­Ì°€„½qL¼¹Ñ•ÍÐ¡Ù…±Õ”¤¤ì(€€€€€€€Ñ¡¥Ì¹™¥¹‘%¹Q•áÐ¡‘½´¤ì(€€€€€ô•±Í”ì(€€€€€€€Ñ¡¥Ì¹™¥¹‘%¹Í¥‘”¡‘½´¤ì(€€€€€ô(€€€ô(€€€€¼¼QÉäÑ¼™¥¹„¡…¹‘±•È™½ÈÑ¡”¥Ù•¸Ñ…œ…¹ÕÍ”Ñ¡…ÐÑ¼Á…ÉÍ”¸%˜(€€€€¼¼¹½¹”¥Ì™½Õ¹°Ñ¡”•±•µ•¹ÐÌ½¹Ñ•¹Ð¹½‘•Ì…É”…‘‘•‘¥É•Ñ±ä¸(€€€…‘‘±•µ•¹Ð¡‘½´°µ…É­Ì°µ…Ñ¡™Ñ•È¤ì(€€€€€±•Ð½ÕÑ•É]L€ôÑ¡¥Ì¹±½…±AÉ•Í•ÉÙ•]L°Ñ½À€ôÑ¡¥Ì¹Ñ½Àì(€€€€€¥˜€¡‘½´¹Ñ…9…µ”€ôô€‰AIˆñð€½ÁÉ”¼¹Ñ•ÍÐ¡‘½´¹ÍÑå±”€˜˜‘½´¹ÍÑå±”¹Ý¡¥Ñ•MÁ…”¤¤(€€€€€€€Ñ¡¥Ì¹±½…±AÉ•Í•ÉÙ•]L€ôÑÉÕ”ì(€€€€€±•Ð¹…µ”€ô‘½´¹¹½‘•9…µ”¹Ñ½1½Ý•É…Í” ¤°ÉÕ±•%ì(€€€€€¥˜€¡±¥ÍÑQ…ÌÈ¹¡…Í=Ý¹AÉ½Á•ÉÑä¡¹…µ”¤€˜˜Ñ¡¥Ì¹Á…ÉÍ•È¹¹½Éµ…±¥é•1¥ÍÑÌ¤(€€€€€€€¹½Éµ…±¥é•1¥ÍÐÈ¡‘½´¤ì(€€€€€±•ÐÉÕ±”€ôÑ¡¥Ì¹½ÁÑ¥½¹Ì¹ÉÕ±•É½µ9½‘”€˜˜Ñ¡¥Ì¹½ÁÑ¥½¹Ì¹ÉÕ±•É½µ9½‘”¡‘½´¤ñð€¡ÉÕ±•%€ôÑ¡¥Ì¹Á…ÉÍ•È¹µ…Ñ¡Q…œ¡‘½´°Ñ¡¥Ì°µ…Ñ¡™Ñ•È¤¤ì(€€€€€½ÕÐè¥˜€¡ÉÕ±”€üÉÕ±”¹¥¹½É”€è¥¹½É•Q…ÌÈ¹¡…Í=Ý¹AÉ½Á•ÉÑä¡¹…µ”¤¤ì(€€€€€€€Ñ¡¥Ì¹™¥¹‘%¹Í¥‘”¡‘½´¤ì(€€€€€€€Ñ¡¥Ì¹¥¹½É•…±±‰…¬¡‘½´°µ…É­Ì¤ì(€€€€€ô•±Í”¥˜€ …ÉÕ±”ñðÉÕ±”¹Í­¥ÀñðÉÕ±”¹±½Í•A…É•¹Ð¤ì(€€€€€€€¥˜€¡ÉÕ±”€˜˜ÉÕ±”¹±½Í•A…É•¹Ð¤(€€€€€€€€€Ñ¡¥Ì¹½Á•¸€ô5…Ñ ¹µ…à À°Ñ¡¥Ì¹½Á•¸€´€Ä¤ì(€€€€€€€•±Í”¥˜€¡ÉÕ±”€˜˜ÉÕ±”¹Í­¥À¹¹½‘•QåÁ”¤(€€€€€€€€€‘½´€ôÉÕ±”¹Í­¥Àì(€€€€€€€±•ÐÍå¹Œ°½±‘9••‘Í	±½¬€ôÑ¡¥Ì¹¹••‘Í	±½¬ì(€€€€€€€¥˜€¡‰±½­Q…ÌÈ¹¡…Í=Ý¹AÉ½Á•ÉÑä¡¹…µ”¤¤ì(€€€€€€€€€¥˜€¡Ñ½À¹½¹Ñ•¹Ð¹±•¹Ñ €˜˜Ñ½À¹½¹Ñ•¹ÑlÁt¹¥Í%¹±¥¹”€˜˜Ñ¡¥Ì¹½Á•¸¤ì(€€€€€€€€€€€Ñ¡¥Ì¹½Á•¸´´ì(€€€€€€€€€€€Ñ½À€ôÑ¡¥Ì¹Ñ½Àì(€€€€€€€€€ô(€€€€€€€€€Íå¹Œ€ôÑÉÕ”ì(€€€€€€€€€¥˜€ …Ñ½À¹ÑåÁ”¤(€€€€€€€€€€€Ñ¡¥Ì¹¹••‘Í	±½¬€ôÑÉÕ”ì(€€€€€€€ô•±Í”¥˜€ …‘½´¹™¥ÉÍÑ¡¥±¤ì(€€€€€€€€€Ñ¡¥Ì¹±•…™…±±‰…¬¡‘½´°µ…É­Ì¤ì(€€€€€€€€€‰É•…¬½ÕÐì(€€€€€€€ô(€€€€€€€±•Ð¥¹¹•É5…É­Ì€ôÉÕ±”€˜˜ÉÕ±”¹Í­¥À€üµ…É­Ì€èÑ¡¥Ì¹É•…‘MÑå±•Ì¡‘½´°µ…É­Ì¤ì(€€€€€€€¥˜€¡¥¹¹•É5…É­Ì¤(€€€€€€€€€Ñ¡¥Ì¹…‘‘±°¡‘½´°¥¹¹•É5…É­Ì¤ì(€€€€€€€¥˜€¡Íå¹Œ¤(€€€€€€€€€Ñ¡¥Ì¹Íå¹Œ¡Ñ½À¤ì(€€€€€€€Ñ¡¥Ì¹¹••‘Í	±½¬€ô½±‘9••‘Í	±½¬ì(€€€€€ô•±Í”ì(€€€€€€€±•Ð¥¹¹•É5…É­Ì€ôÑ¡¥Ì¹É•…‘MÑå±•Ì¡‘½´°µ…É­Ì¤ì(€€€€€€€¥˜€¡¥¹¹•É5…É­Ì¤(€€€€€€€€€Ñ¡¥Ì¹…‘‘±•µ•¹Ñ	åIÕ±”¡‘½´°ÉÕ±”°¥¹¹•É5…É­Ì°ÉÕ±”¹½¹ÍÕµ¥¹œ€ôôô™…±Í”€üÉÕ±•%€èÙ½¥€À¤ì(€€€€€ô(€€€€€Ñ¡¥Ì¹±½…±AÉ•Í•ÉÙ•]L€ô½ÕÑ•É]Lì(€€€ô(€€€€¼¼…±±•™½È±•…˜=4¹½‘•ÌÑ¡…ÐÝ½Õ±½Ñ¡•ÉÝ¥Í”‰”¥¹½É•(€€€±•…™…±±‰…¬¡‘½´°µ…É­Ì¤ì(€€€€€¥˜€¡‘½´¹¹½‘•9…µ”€ôô€‰	Hˆ€˜˜Ñ¡¥Ì¹Ñ½À¹ÑåÁ”€˜˜Ñ¡¥Ì¹Ñ½À¹ÑåÁ”¹¥¹±¥¹•½¹Ñ•¹Ð¤(€€€€€€€Ñ¡¥Ì¹…‘‘Q•áÑ9½‘”¡‘½´¹½Ý¹•É½Õµ•¹Ð¹É•…Ñ•Q•áÑ9½‘” ‰q¸ˆ¤°µ…É­Ì¤ì(€€€ô(€€€€¼¼…±±•™½È¥¹½É•¹½‘•Ì(€€€¥¹½É•…±±‰…¬¡‘½´°µ…É­Ì¤ì(€€€€€¥˜€¡‘½´¹¹½‘•9…µ”€ôô€‰	Hˆ€˜˜€ …Ñ¡¥Ì¹Ñ½À¹ÑåÁ”ñð€…Ñ¡¥Ì¹Ñ½À¹ÑåÁ”¹¥¹±¥¹•½¹Ñ•¹Ð¤¤(€€€€€€€Ñ¡¥Ì¹™¥¹‘A±…”¡Ñ¡¥Ì¹Á…ÉÍ•È¹Í¡•µ„¹Ñ•áÐ ˆ´ˆ¤°µ…É­Ì°ÑÉÕ”¤ì(€€€ô(€€€€¼¼IÕ¸…¹äÍÑå±”Á…ÉÍ•È…ÍÍ½¥…Ñ•Ý¥Ñ Ñ¡”¹½‘”ÌÍÑå±•Ì¸¥Ñ¡•È(€€€€¼¼É•ÑÕÉ¸…¸ÕÁ‘…Ñ•…ÉÉ…ä½˜µ…É­Ì°½È¹Õ±°Ñ¼¥¹‘¥…Ñ”Í½µ”½˜Ñ¡”(€€€€¼¼ÍÑå±•Ì¡…„ÉÕ±”Ý¥Ñ ¥¹½É•€Í•Ð¸(€€€É•…‘MÑå±•Ì¡‘½´°µ…É­Ì¤ì(€€€€€±•ÐÍÑå±•Ì€ô‘½´¹ÍÑå±”ì(€€€€€¥˜€¡ÍÑå±•Ì€˜˜ÍÑå±•Ì¹±•¹Ñ ¤(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹Á…ÉÍ•È¹µ…Ñ¡•‘MÑå±•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€±•Ð¹…µ”€ôÑ¡¥Ì¹Á…ÉÍ•È¹µ…Ñ¡•‘MÑå±•Ím¥t°Ù…±Õ”€ôÍÑå±•Ì¹•ÑAÉ½Á•ÉÑåY…±Õ”¡¹…µ”¤ì(€€€€€€€€€¥˜€¡Ù…±Õ”¤(€€€€€€€€€€€™½È€¡±•Ð…™Ñ•È€ôÙ½¥€Àì€ì€¤ì(€€€€€€€€€€€€€±•ÐÉÕ±”€ôÑ¡¥Ì¹Á…ÉÍ•È¹µ…Ñ¡MÑå±”¡¹…µ”°Ù…±Õ”°Ñ¡¥Ì°…™Ñ•È¤ì(€€€€€€€€€€€€€¥˜€ …ÉÕ±”¤(€€€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€€€¥˜€¡ÉÕ±”¹¥¹½É”¤(€€€€€€€€€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€€€€€€€€€¥˜€¡ÉÕ±”¹±•…É5…É¬¤(€€€€€€€€€€€€€€€µ…É­Ì€ôµ…É­Ì¹™¥±Ñ•È ¡´¤€ôø€…ÉÕ±”¹±•…É5…É¬¡´¤¤ì(€€€€€€€€€€€€€•±Í”(€€€€€€€€€€€€€€€µ…É­Ì€ôµ…É­Ì¹½¹…Ð¡Ñ¡¥Ì¹Á…ÉÍ•È¹Í¡•µ„¹µ…É­ÍmÉÕ±”¹µ…É­t¹É•…Ñ”¡ÉÕ±”¹…ÑÑÉÌ¤¤ì(€€€€€€€€€€€€€¥˜€¡ÉÕ±”¹½¹ÍÕµ¥¹œ€ôôô™…±Í”¤(€€€€€€€€€€€€€€€…™Ñ•È€ôÉÕ±”ì(€€€€€€€€€€€€€•±Í”(€€€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€ô(€€€€€€€ô(€€€€€É•ÑÕÉ¸µ…É­Ìì(€€€ô(€€€€¼¼1½½¬ÕÀ„¡…¹‘±•È™½ÈÑ¡”¥Ù•¸¹½‘”¸%˜¹½¹”…É”™½Õ¹°É•ÑÕÉ¸(€€€€¼¼™…±Í”¸=Ñ¡•ÉÝ¥Í”°…ÁÁ±ä¥Ð°ÕÍ”¥ÑÌÉ•ÑÕÉ¸Ù…±Õ”Ñ¼‘É¥Ù”Ñ¡”Ý…ä(€€€€¼¼Ñ¡”¹½‘”Ì½¹Ñ•¹Ð¥ÌÝÉ…ÁÁ•°…¹É•ÑÕÉ¸ÑÉÕ”¸(€€€…‘‘±•µ•¹Ñ	åIÕ±”¡‘½´°ÉÕ±”°µ…É­Ì°½¹Ñ¥¹Õ•™Ñ•È¤ì(€€€€€±•ÐÍå¹Œ°¹½‘•QåÁ”ì(€€€€€¥˜€¡ÉÕ±”¹¹½‘”¤ì(€€€€€€€¹½‘•QåÁ”€ôÑ¡¥Ì¹Á…ÉÍ•È¹Í¡•µ„¹¹½‘•ÍmÉÕ±”¹¹½‘•tì(€€€€€€€¥˜€ …¹½‘•QåÁ”¹¥Í1•…˜¤ì(€€€€€€€€€±•Ð¥¹¹•È€ôÑ¡¥Ì¹•¹Ñ•È¡¹½‘•QåÁ”°ÉÕ±”¹…ÑÑÉÌñð¹Õ±°°µ…É­Ì°ÉÕ±”¹ÁÉ•Í•ÉÙ•]¡¥Ñ•ÍÁ…”¤ì(€€€€€€€€€¥˜€¡¥¹¹•È¤ì(€€€€€€€€€€€Íå¹Œ€ôÑÉÕ”ì(€€€€€€€€€€€µ…É­Ì€ô¥¹¹•Èì(€€€€€€€€€ô(€€€€€€€ô•±Í”¥˜€ …Ñ¡¥Ì¹¥¹Í•ÉÑ9½‘”¡¹½‘•QåÁ”¹É•…Ñ”¡ÉÕ±”¹…ÑÑÉÌ¤°µ…É­Ì°‘½´¹¹½‘•9…µ”€ôô€‰	Hˆ¤¤ì(€€€€€€€€€Ñ¡¥Ì¹±•…™…±±‰…¬¡‘½´°µ…É­Ì¤ì(€€€€€€€ô(€€€€€ô•±Í”ì(€€€€€€€±•Ðµ…É­QåÁ”€ôÑ¡¥Ì¹Á…ÉÍ•È¹Í¡•µ„¹µ…É­ÍmÉÕ±”¹µ…É­tì(€€€€€€€µ…É­Ì€ôµ…É­Ì¹½¹…Ð¡µ…É­QåÁ”¹É•…Ñ”¡ÉÕ±”¹…ÑÑÉÌ¤¤ì(€€€€€ô(€€€€€±•ÐÍÑ…ÉÑ%¸€ôÑ¡¥Ì¹Ñ½Àì(€€€€€¥˜€¡¹½‘•QåÁ”€˜˜¹½‘•QåÁ”¹¥Í1•…˜¤ì(€€€€€€€Ñ¡¥Ì¹™¥¹‘%¹Í¥‘”¡‘½´¤ì(€€€€€ô•±Í”¥˜€¡½¹Ñ¥¹Õ•™Ñ•È¤ì(€€€€€€€Ñ¡¥Ì¹…‘‘±•µ•¹Ð¡‘½´°µ…É­Ì°½¹Ñ¥¹Õ•™Ñ•È¤ì(€€€€€ô•±Í”¥˜€¡ÉÕ±”¹•Ñ½¹Ñ•¹Ð¤ì(€€€€€€€Ñ¡¥Ì¹™¥¹‘%¹Í¥‘”¡‘½´¤ì(€€€€€€€ÉÕ±”¹•Ñ½¹Ñ•¹Ð¡‘½´°Ñ¡¥Ì¹Á…ÉÍ•È¹Í¡•µ„¤¹™½É…  ¡¹½‘”¤€ôøÑ¡¥Ì¹¥¹Í•ÉÑ9½‘”¡¹½‘”°µ…É­Ì°™…±Í”¤¤ì(€€€€€ô•±Í”ì(€€€€€€€±•Ð½¹Ñ•¹Ñ=4€ô‘½´ì(€€€€€€€¥˜€¡ÑåÁ•½˜ÉÕ±”¹½¹Ñ•¹Ñ±•µ•¹Ð€ôô€‰ÍÑÉ¥¹œˆ¤(€€€€€€€€€½¹Ñ•¹Ñ=4€ô‘½´¹ÅÕ•ÉåM•±•Ñ½È¡ÉÕ±”¹½¹Ñ•¹Ñ±•µ•¹Ð¤ì(€€€€€€€•±Í”¥˜€¡ÑåÁ•½˜ÉÕ±”¹½¹Ñ•¹Ñ±•µ•¹Ð€ôô€‰™Õ¹Ñ¥½¸ˆ¤(€€€€€€€€€½¹Ñ•¹Ñ=4€ôÉÕ±”¹½¹Ñ•¹Ñ±•µ•¹Ð¡‘½´¤ì(€€€€€€€•±Í”¥˜€¡ÉÕ±”¹½¹Ñ•¹Ñ±•µ•¹Ð¤(€€€€€€€€€½¹Ñ•¹Ñ=4€ôÉÕ±”¹½¹Ñ•¹Ñ±•µ•¹Ðì(€€€€€€€Ñ¡¥Ì¹™¥¹‘É½Õ¹¡‘½´°½¹Ñ•¹Ñ=4°ÑÉÕ”¤ì(€€€€€€€Ñ¡¥Ì¹…‘‘±°¡½¹Ñ•¹Ñ=4°µ…É­Ì¤ì(€€€€€€€Ñ¡¥Ì¹™¥¹‘É½Õ¹¡‘½´°½¹Ñ•¹Ñ=4°™…±Í”¤ì(€€€€€ô(€€€€€¥˜€¡Íå¹Œ€˜˜Ñ¡¥Ì¹Íå¹Œ¡ÍÑ…ÉÑ%¸¤¤(€€€€€€€Ñ¡¥Ì¹½Á•¸´´ì(€€€ô(€€€€¼¼‘…±°¡¥±¹½‘•Ì‰•ÑÝ••¸ÍÑ…ÉÑ%¹‘•á€…¹•¹‘%¹‘•á€€¡½ÈÑ¡”(€€€€¼¼Ý¡½±”¹½‘”°¥˜¹½Ð¥Ù•¸¤¸%˜Íå¹€¥ÌÁ…ÍÍ•°ÕÍ”¥ÐÑ¼(€€€€¼¼Íå¹¡É½¹¥é”…™Ñ•È•Ù•Éä‰±½¬•±•µ•¹Ð¸(€€€…‘‘±°¡Á…É•¹Ð°µ…É­Ì°ÍÑ…ÉÑ%¹‘•à°•¹‘%¹‘•à¤ì(€€€€€±•Ð¥¹‘•à€ôÍÑ…ÉÑ%¹‘•àñð€Àì(€€€€€™½È€¡±•Ð‘½´€ôÍÑ…ÉÑ%¹‘•à€üÁ…É•¹Ð¹¡¥±‘9½‘•ÍmÍÑ…ÉÑ%¹‘•át€èÁ…É•¹Ð¹™¥ÉÍÑ¡¥±°•¹€ô•¹‘%¹‘•à€ôô¹Õ±°€ü¹Õ±°€èÁ…É•¹Ð¹¡¥±‘9½‘•Ím•¹‘%¹‘•átì‘½´€„ô•¹ì‘½´€ô‘½´¹¹•áÑM¥‰±¥¹œ°€¬­¥¹‘•à¤ì(€€€€€€€Ñ¡¥Ì¹™¥¹‘ÑA½¥¹Ð¡Á…É•¹Ð°¥¹‘•à¤ì(€€€€€€€Ñ¡¥Ì¹…‘‘=4¡‘½´°µ…É­Ì¤ì(€€€€€ô(€€€€€Ñ¡¥Ì¹™¥¹‘ÑA½¥¹Ð¡Á…É•¹Ð°¥¹‘•à¤ì(€€€ô(€€€€¼¼QÉäÑ¼™¥¹„Ý…äÑ¼™¥ÐÑ¡”¥Ù•¸¹½‘”ÑåÁ”¥¹Ñ¼Ñ¡”ÕÉÉ•¹Ð(€€€€¼¼½¹Ñ•áÐ¸5…ä…‘¥¹Ñ•Éµ•‘¥…Ñ”ÝÉ…ÁÁ•ÉÌ…¹½½È±•…Ù”¹½¸µÍ½±¥(€€€€¼¼¹½‘•ÌÑ¡…ÐÝ”É”¥¸¸(€€€™¥¹‘A±…”¡¹½‘”°µ…É­Ì°…ÕÑ¥½ÕÌ¤ì(€€€€€±•ÐÉ½ÕÑ”°Íå¹Œì(€€€€€™½È€¡±•Ð‘•ÁÑ €ôÑ¡¥Ì¹½Á•¸°Á•¹…±Ñä€ô€Àì‘•ÁÑ €øô€Àì‘•ÁÑ ´´¤ì(€€€€€€€±•Ðà€ôÑ¡¥Ì¹¹½‘•Ím‘•ÁÑ¡tì(€€€€€€€±•Ð™½Õ¹Ì€ôà¹™¥¹‘]É…ÁÁ¥¹œ¡¹½‘”¤ì(€€€€€€€¥˜€¡™½Õ¹Ì€˜˜€ …É½ÕÑ”ñðÉ½ÕÑ”¹±•¹Ñ €ø™½Õ¹Ì¹±•¹Ñ €¬Á•¹…±Ñä¤¤ì(€€€€€€€€€É½ÕÑ”€ô™½Õ¹Ìì(€€€€€€€€€Íå¹Œ€ôàì(€€€€€€€€€¥˜€ …™½Õ¹Ì¹±•¹Ñ ¤(€€€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€€€¥˜€¡à¹Í½±¥¤ì(€€€€€€€€€¥˜€¡…ÕÑ¥½ÕÌ¤(€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€Á•¹…±Ñä€¬ô€Èì(€€€€€€€ô(€€€€€ô(€€€€€¥˜€ …É½ÕÑ”¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€Ñ¡¥Ì¹Íå¹Œ¡Íå¹Œ¤ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÉ½ÕÑ”¹±•¹Ñ ì¤¬¬¤(€€€€€€€µ…É­Ì€ôÑ¡¥Ì¹•¹Ñ•É%¹¹•È¡É½ÕÑ•m¥t°¹Õ±°°µ…É­Ì°™…±Í”¤ì(€€€€€É•ÑÕÉ¸µ…É­Ìì(€€€ô(€€€€¼¼QÉäÑ¼¥¹Í•ÉÐÑ¡”¥Ù•¸¹½‘”°…‘©ÕÍÑ¥¹œÑ¡”½¹Ñ•áÐÝ¡•¸¹••‘•¸(€€€¥¹Í•ÉÑ9½‘”¡¹½‘”°µ…É­Ì°…ÕÑ¥½ÕÌ¤ì(€€€€€¥˜€¡¹½‘”¹¥Í%¹±¥¹”€˜˜Ñ¡¥Ì¹¹••‘Í	±½¬€˜˜€…Ñ¡¥Ì¹Ñ½À¹ÑåÁ”¤ì(€€€€€€€±•Ð‰±½¬€ôÑ¡¥Ì¹Ñ•áÑ‰±½­É½µ½¹Ñ•áÐ ¤ì(€€€€€€€¥˜€¡‰±½¬¤(€€€€€€€€€µ…É­Ì€ôÑ¡¥Ì¹•¹Ñ•É%¹¹•È¡‰±½¬°¹Õ±°°µ…É­Ì¤ì(€€€€€ô(€€€€€±•Ð¥¹¹•É5…É­Ì€ôÑ¡¥Ì¹™¥¹‘A±…”¡¹½‘”°µ…É­Ì°…ÕÑ¥½ÕÌ¤ì(€€€€€¥˜€¡¥¹¹•É5…É­Ì¤ì(€€€€€€€Ñ¡¥Ì¹±½Í•áÑÉ„ ¤ì(€€€€€€€±•ÐÑ½À€ôÑ¡¥Ì¹Ñ½Àì(€€€€€€€¥˜€¡Ñ½À¹µ…Ñ ¤(€€€€€€€€€Ñ½À¹µ…Ñ €ôÑ½À¹µ…Ñ ¹µ…Ñ¡QåÁ”¡¹½‘”¹ÑåÁ”¤ì(€€€€€€€±•Ð¹½‘•5…É­Ì€ô5…É¬È¹¹½¹”ì(€€€€€€€™½È€¡±•Ð´½˜¥¹¹•É5…É­Ì¹½¹…Ð¡¹½‘”¹µ…É­Ì¤¤(€€€€€€€€€¥˜€¡Ñ½À¹ÑåÁ”€üÑ½À¹ÑåÁ”¹…±±½ÝÍ5…É­QåÁ”¡´¹ÑåÁ”¤€èµ…É­5…åÁÁ±äÈ¡´¹ÑåÁ”°¹½‘”¹ÑåÁ”¤¤(€€€€€€€€€€€¹½‘•5…É­Ì€ô´¹…‘‘Q½M•Ð¡¹½‘•5…É­Ì¤ì(€€€€€€€Ñ½À¹½¹Ñ•¹Ð¹ÁÕÍ ¡¹½‘”¹µ…É¬¡¹½‘•5…É­Ì¤¤ì(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€€¼¼QÉäÑ¼ÍÑ…ÉÐ„¹½‘”½˜Ñ¡”¥Ù•¸ÑåÁ”°…‘©ÕÍÑ¥¹œÑ¡”½¹Ñ•áÐÝ¡•¸(€€€€¼¼¹••ÍÍ…Éä¸(€€€•¹Ñ•È¡ÑåÁ”°…ÑÑÉÌ°µ…É­Ì°ÁÉ•Í•ÉÙ•]L¤ì(€€€€€±•Ð¥¹¹•É5…É­Ì€ôÑ¡¥Ì¹™¥¹‘A±…”¡ÑåÁ”¹É•…Ñ”¡…ÑÑÉÌ¤°µ…É­Ì°™…±Í”¤ì(€€€€€¥˜€¡¥¹¹•É5…É­Ì¤(€€€€€€€¥¹¹•É5…É­Ì€ôÑ¡¥Ì¹•¹Ñ•É%¹¹•È¡ÑåÁ”°…ÑÑÉÌ°µ…É­Ì°ÑÉÕ”°ÁÉ•Í•ÉÙ•]L¤ì(€€€€€É•ÑÕÉ¸¥¹¹•É5…É­Ìì(€€€ô(€€€€¼¼=Á•¸„¹½‘”½˜Ñ¡”¥Ù•¸ÑåÁ”(€€€•¹Ñ•É%¹¹•È¡ÑåÁ”°…ÑÑÉÌ°µ…É­Ì°Í½±¥€ô™…±Í”°ÁÉ•Í•ÉÙ•]L¤ì(€€€€€Ñ¡¥Ì¹±½Í•áÑÉ„ ¤ì(€€€€€±•ÐÑ½À€ôÑ¡¥Ì¹Ñ½Àì(€€€€€Ñ½À¹µ…Ñ €ôÑ½À¹µ…Ñ €˜˜Ñ½À¹µ…Ñ ¹µ…Ñ¡QåÁ”¡ÑåÁ”¤ì(€€€€€±•Ð½ÁÑ¥½¹Ì€ôÝÍ=ÁÑ¥½¹Í½ÈÈ¡ÑåÁ”°ÁÉ•Í•ÉÙ•]L°Ñ½À¹½ÁÑ¥½¹Ì¤ì(€€€€€¥˜€¡Ñ½À¹½ÁÑ¥½¹Ì€˜=AQ}=A9}1PÈ€˜˜Ñ½À¹½¹Ñ•¹Ð¹±•¹Ñ €ôô€À¤(€€€€€€€½ÁÑ¥½¹Ìðô=AQ}=A9}1PÈì(€€€€€±•Ð…ÁÁ±å5…É­Ì€ô5…É¬È¹¹½¹”ì(€€€€€µ…É­Ì€ôµ…É­Ì¹™¥±Ñ•È ¡´¤€ôøì(€€€€€€€¥˜€¡Ñ½À¹ÑåÁ”€üÑ½À¹ÑåÁ”¹…±±½ÝÍ5…É­QåÁ”¡´¹ÑåÁ”¤€èµ…É­5…åÁÁ±äÈ¡´¹ÑåÁ”°ÑåÁ”¤¤ì(€€€€€€€€€…ÁÁ±å5…É­Ì€ô´¹…‘‘Q½M•Ð¡…ÁÁ±å5…É­Ì¤ì(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô¤ì(€€€€€Ñ¡¥Ì¹¹½‘•Ì¹ÁÕÍ ¡¹•Ü9½‘•½¹Ñ•áÐÈ¡ÑåÁ”°…ÑÑÉÌ°…ÁÁ±å5…É­Ì°Í½±¥°¹Õ±°°½ÁÑ¥½¹Ì¤¤ì(€€€€€Ñ¡¥Ì¹½Á•¸¬¬ì(€€€€€É•ÑÕÉ¸µ…É­Ìì(€€€ô(€€€€¼¼5…­”ÍÕÉ”…±°¹½‘•Ì…‰½Ù”Ñ¡¥Ì¹½Á•¸…É”™¥¹¥Í¡•…¹…‘‘•Ñ¼(€€€€¼¼Ñ¡•¥ÈÁ…É•¹ÑÌ(€€€±½Í•áÑÉ„¡½Á•¹¹€ô™…±Í”¤ì(€€€€€±•Ð¤€ôÑ¡¥Ì¹¹½‘•Ì¹±•¹Ñ €´€Äì(€€€€€¥˜€¡¤€øÑ¡¥Ì¹½Á•¸¤ì(€€€€€€€™½È€ ì¤€øÑ¡¥Ì¹½Á•¸ì¤´´¤(€€€€€€€€€Ñ¡¥Ì¹¹½‘•Ím¤€´€Åt¹½¹Ñ•¹Ð¹ÁÕÍ ¡Ñ¡¥Ì¹¹½‘•Ím¥t¹™¥¹¥Í ¡½Á•¹¹¤¤ì(€€€€€€€Ñ¡¥Ì¹¹½‘•Ì¹±•¹Ñ €ôÑ¡¥Ì¹½Á•¸€¬€Äì(€€€€€ô(€€€ô(€€€™¥¹¥Í  ¤ì(€€€€€Ñ¡¥Ì¹½Á•¸€ô€Àì(€€€€€Ñ¡¥Ì¹±½Í•áÑÉ„¡Ñ¡¥Ì¹¥Í=Á•¸¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹¹½‘•ÍlÁt¹™¥¹¥Í  „„¡Ñ¡¥Ì¹¥Í=Á•¸ñðÑ¡¥Ì¹½ÁÑ¥½¹Ì¹Ñ½Á=Á•¸¤¤ì(€€€ô(€€€Íå¹Œ¡Ñ¼¤ì(€€€€€™½È€¡±•Ð¤€ôÑ¡¥Ì¹½Á•¸ì¤€øô€Àì¤´´¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹¹½‘•Ím¥t€ôôÑ¼¤ì(€€€€€€€€€Ñ¡¥Ì¹½Á•¸€ô¤ì(€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€ô•±Í”¥˜€¡Ñ¡¥Ì¹±½…±AÉ•Í•ÉÙ•]L¤ì(€€€€€€€€€Ñ¡¥Ì¹¹½‘•Ím¥t¹½ÁÑ¥½¹Ìðô=AQ}AIMIY}]LÈì(€€€€€€€ô(€€€€€ô(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€•ÐÕÉÉ•¹ÑA½Ì ¤ì(€€€€€Ñ¡¥Ì¹±½Í•áÑÉ„ ¤ì(€€€€€±•ÐÁ½Ì€ô€Àì(€€€€€™½È€¡±•Ð¤€ôÑ¡¥Ì¹½Á•¸ì¤€øô€Àì¤´´¤ì(€€€€€€€±•Ð½¹Ñ•¹Ð€ôÑ¡¥Ì¹¹½‘•Ím¥t¹½¹Ñ•¹Ðì(€€€€€€€™½È€¡±•Ð¨€ô½¹Ñ•¹Ð¹±•¹Ñ €´€Äì¨€øô€Àì¨´´¤(€€€€€€€€€Á½Ì€¬ô½¹Ñ•¹Ñm©t¹¹½‘•M¥é”ì(€€€€€€€¥˜€¡¤¤(€€€€€€€€€Á½Ì¬¬ì(€€€€€ô(€€€€€É•ÑÕÉ¸Á½Ìì(€€€ô(€€€™¥¹‘ÑA½¥¹Ð¡Á…É•¹Ð°½™™Í•Ð¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹™¥¹¤(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹™¥¹¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€¥˜€¡Ñ¡¥Ì¹™¥¹‘m¥t¹¹½‘”€ôôÁ…É•¹Ð€˜˜Ñ¡¥Ì¹™¥¹‘m¥t¹½™™Í•Ð€ôô½™™Í•Ð¤(€€€€€€€€€€€Ñ¡¥Ì¹™¥¹‘m¥t¹Á½Ì€ôÑ¡¥Ì¹ÕÉÉ•¹ÑA½Ìì(€€€€€€€ô(€€€ô(€€€™¥¹‘%¹Í¥‘”¡Á…É•¹Ð¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹™¥¹¤(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹™¥¹¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€¥˜€¡Ñ¡¥Ì¹™¥¹‘m¥t¹Á½Ì€ôô¹Õ±°€˜˜Á…É•¹Ð¹¹½‘•QåÁ”€ôô€Ä€˜˜Á…É•¹Ð¹½¹Ñ…¥¹Ì¡Ñ¡¥Ì¹™¥¹‘m¥t¹¹½‘”¤¤(€€€€€€€€€€€Ñ¡¥Ì¹™¥¹‘m¥t¹Á½Ì€ôÑ¡¥Ì¹ÕÉÉ•¹ÑA½Ìì(€€€€€€€ô(€€€ô(€€€™¥¹‘É½Õ¹¡Á…É•¹Ð°½¹Ñ•¹Ð°‰•™½É”¤ì(€€€€€¥˜€¡Á…É•¹Ð€„ô½¹Ñ•¹Ð€˜˜Ñ¡¥Ì¹™¥¹¤(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹™¥¹¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€¥˜€¡Ñ¡¥Ì¹™¥¹‘m¥t¹Á½Ì€ôô¹Õ±°€˜˜Á…É•¹Ð¹¹½‘•QåÁ”€ôô€Ä€˜˜Á…É•¹Ð¹½¹Ñ…¥¹Ì¡Ñ¡¥Ì¹™¥¹‘m¥t¹¹½‘”¤¤ì(€€€€€€€€€€€±•ÐÁ½Ì€ô½¹Ñ•¹Ð¹½µÁ…É•½Õµ•¹ÑA½Í¥Ñ¥½¸¡Ñ¡¥Ì¹™¥¹‘m¥t¹¹½‘”¤ì(€€€€€€€€€€€¥˜€¡Á½Ì€˜€¡‰•™½É”€ü€È€è€Ð¤¤(€€€€€€€€€€€€€Ñ¡¥Ì¹™¥¹‘m¥t¹Á½Ì€ôÑ¡¥Ì¹ÕÉÉ•¹ÑA½Ìì(€€€€€€€€€ô(€€€€€€€ô(€€€ô(€€€™¥¹‘%¹Q•áÐ¡Ñ•áÑ9½‘”¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹™¥¹¤(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹™¥¹¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€¥˜€¡Ñ¡¥Ì¹™¥¹‘m¥t¹¹½‘”€ôôÑ•áÑ9½‘”¤(€€€€€€€€€€€Ñ¡¥Ì¹™¥¹‘m¥t¹Á½Ì€ôÑ¡¥Ì¹ÕÉÉ•¹ÑA½Ì€´€¡Ñ•áÑ9½‘”¹¹½‘•Y…±Õ”¹±•¹Ñ €´Ñ¡¥Ì¹™¥¹‘m¥t¹½™™Í•Ð¤ì(€€€€€€€ô(€€€ô(€€€€¼¼•Ñ•Éµ¥¹•ÌÝ¡•Ñ¡•ÈÑ¡”¥Ù•¸½¹Ñ•áÐÍÑÉ¥¹œµ…Ñ¡•ÌÑ¡¥Ì½¹Ñ•áÐ¸(€€€µ…Ñ¡•Í½¹Ñ•áÐ¡½¹Ñ•áÐ¤ì(€€€€€¥˜€¡½¹Ñ•áÐ¹¥¹‘•á=˜ ‰ðˆ¤€ø€´Ä¤(€€€€€€€É•ÑÕÉ¸½¹Ñ•áÐ¹ÍÁ±¥Ð ½qÌ©qñqÌ¨¼¤¹Í½µ”¡Ñ¡¥Ì¹µ…Ñ¡•Í½¹Ñ•áÐ°Ñ¡¥Ì¤ì(€€€€€±•ÐÁ…ÉÑÌ€ô½¹Ñ•áÐ¹ÍÁ±¥Ð ˆ¼ˆ¤ì(€€€€€±•Ð½ÁÑ¥½¸€ôÑ¡¥Ì¹½ÁÑ¥½¹Ì¹½¹Ñ•áÐì(€€€€€±•ÐÕÍ•I½½Ð€ô€…Ñ¡¥Ì¹¥Í=Á•¸€˜˜€ …½ÁÑ¥½¸ñð½ÁÑ¥½¸¹Á…É•¹Ð¹ÑåÁ”€ôôÑ¡¥Ì¹¹½‘•ÍlÁt¹ÑåÁ”¤ì(€€€€€±•Ðµ¥¹•ÁÑ €ô€´¡½ÁÑ¥½¸€ü½ÁÑ¥½¸¹‘•ÁÑ €¬€Ä€è€À¤€¬€¡ÕÍ•I½½Ð€ü€À€è€Ä¤ì(€€€€€±•Ðµ…Ñ È€ô€¡¤°‘•ÁÑ ¤€ôøì(€€€€€€€™½È€ ì¤€øô€Àì¤´´¤ì(€€€€€€€€€±•ÐÁ…ÉÐ€ôÁ…ÉÑÍm¥tì(€€€€€€€€€¥˜€¡Á…ÉÐ€ôô€ˆˆ¤ì(€€€€€€€€€€€¥˜€¡¤€ôôÁ…ÉÑÌ¹±•¹Ñ €´€Äñð¤€ôô€À¤(€€€€€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€€€€€™½È€ ì‘•ÁÑ €øôµ¥¹•ÁÑ ì‘•ÁÑ ´´¤(€€€€€€€€€€€€€¥˜€¡µ…Ñ È¡¤€´€Ä°‘•ÁÑ ¤¤(€€€€€€€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€±•Ð¹•áÐ€ô‘•ÁÑ €ø€Àñð‘•ÁÑ €ôô€À€˜˜ÕÍ•I½½Ð€üÑ¡¥Ì¹¹½‘•Ím‘•ÁÑ¡t¹ÑåÁ”€è½ÁÑ¥½¸€˜˜‘•ÁÑ €øôµ¥¹•ÁÑ €ü½ÁÑ¥½¸¹¹½‘”¡‘•ÁÑ €´µ¥¹•ÁÑ ¤¹ÑåÁ”€è¹Õ±°ì(€€€€€€€€€€€¥˜€ …¹•áÐñð¹•áÐ¹¹…µ”€„ôÁ…ÉÐ€˜˜€…¹•áÐ¹¥Í%¹É½ÕÀ¡Á…ÉÐ¤¤(€€€€€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€€€€€‘•ÁÑ ´´ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ôì(€€€€€É•ÑÕÉ¸µ…Ñ È¡Á…ÉÑÌ¹±•¹Ñ €´€Ä°Ñ¡¥Ì¹½Á•¸¤ì(€€€ô(€€€Ñ•áÑ‰±½­É½µ½¹Ñ•áÐ ¤ì(€€€€€±•Ð€‘½¹Ñ•áÐ€ôÑ¡¥Ì¹½ÁÑ¥½¹Ì¹½¹Ñ•áÐì(€€€€€¥˜€ ‘½¹Ñ•áÐ¤(€€€€€€€™½È€¡±•Ð€ô€‘½¹Ñ•áÐ¹‘•ÁÑ ì€øô€Àì´´¤ì(€€€€€€€€€±•Ð‘•™±Ð€ô€‘½¹Ñ•áÐ¹¹½‘”¡¤¹½¹Ñ•¹Ñ5…Ñ¡Ð ‘½¹Ñ•áÐ¹¥¹‘•á™Ñ•È¡¤¤¹‘•™…Õ±ÑQåÁ”ì(€€€€€€€€€¥˜€¡‘•™±Ð€˜˜‘•™±Ð¹¥ÍQ•áÑ‰±½¬€˜˜‘•™±Ð¹‘•™…Õ±ÑÑÑÉÌ¤(€€€€€€€€€€€É•ÑÕÉ¸‘•™±Ðì(€€€€€€€ô(€€€€€™½È€¡±•Ð¹…µ”¥¸Ñ¡¥Ì¹Á…ÉÍ•È¹Í¡•µ„¹¹½‘•Ì¤ì(€€€€€€€±•ÐÑåÁ”€ôÑ¡¥Ì¹Á…ÉÍ•È¹Í¡•µ„¹¹½‘•Ím¹…µ•tì(€€€€€€€¥˜€¡ÑåÁ”¹¥ÍQ•áÑ‰±½¬€˜˜ÑåÁ”¹‘•™…Õ±ÑÑÑÉÌ¤(€€€€€€€€€É•ÑÕÉ¸ÑåÁ”ì(€€€€€ô(€€€ô(€ôì(€™Õ¹Ñ¥½¸¹½Éµ…±¥é•1¥ÍÐÈ¡‘½´¤ì(€€€™½È€¡±•Ð¡¥±€ô‘½´¹™¥ÉÍÑ¡¥±°ÁÉ•Ù%Ñ•´€ô¹Õ±°ì¡¥±ì¡¥±€ô¡¥±¹¹•áÑM¥‰±¥¹œ¤ì(€€€€€±•Ð¹…µ”€ô¡¥±¹¹½‘•QåÁ”€ôô€Ä€ü¡¥±¹¹½‘•9…µ”¹Ñ½1½Ý•É…Í” ¤€è¹Õ±°ì(€€€€€¥˜€¡¹…µ”€˜˜±¥ÍÑQ…ÌÈ¹¡…Í=Ý¹AÉ½Á•ÉÑä¡¹…µ”¤€˜˜ÁÉ•Ù%Ñ•´¤ì(€€€€€€€ÁÉ•Ù%Ñ•´¹…ÁÁ•¹‘¡¥±¡¡¥±¤ì(€€€€€€€¡¥±€ôÁÉ•Ù%Ñ•´ì(€€€€€ô•±Í”¥˜€¡¹…µ”€ôô€‰±¤ˆ¤ì(€€€€€€€ÁÉ•Ù%Ñ•´€ô¡¥±ì(€€€€€ô•±Í”¥˜€¡¹…µ”¤ì(€€€€€€€ÁÉ•Ù%Ñ•´€ô¹Õ±°ì(€€€€€ô(€€€ô(€ô(€™Õ¹Ñ¥½¸µ…Ñ¡•ÌÈ¡‘½´°Í•±•Ñ½È¤ì(€€€É•ÑÕÉ¸€¡‘½´¹µ…Ñ¡•Ìñð‘½´¹µÍ5…Ñ¡•ÍM•±•Ñ½Èñð‘½´¹Ý•‰­¥Ñ5…Ñ¡•ÍM•±•Ñ½Èñð‘½´¹µ½é5…Ñ¡•ÍM•±•Ñ½È¤¹…±°¡‘½´°Í•±•Ñ½È¤ì(€ô(€™Õ¹Ñ¥½¸½ÁäÌ¡½‰¨¤ì(€€€±•Ð½ÁäÔ€ôíôì(€€€™½È€¡±•ÐÁÉ½À¥¸½‰¨¤(€€€€€½ÁäÕmÁÉ½Át€ô½‰©mÁÉ½Átì(€€€É•ÑÕÉ¸½ÁäÔì(€ô(€™Õ¹Ñ¥½¸µ…É­5…åÁÁ±äÈ¡µ…É­QåÁ”°¹½‘•QåÁ”¤ì(€€€±•Ð¹½‘•Ì€ô¹½‘•QåÁ”¹Í¡•µ„¹¹½‘•Ìì(€€€™½È€¡±•Ð¹…µ”¥¸¹½‘•Ì¤ì(€€€€€±•ÐÁ…É•¹Ð€ô¹½‘•Ím¹…µ•tì(€€€€€¥˜€ …Á…É•¹Ð¹…±±½ÝÍ5…É­QåÁ”¡µ…É­QåÁ”¤¤(€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€±•ÐÍ••¸€ômt°Í…¸€ô€¡µ…Ñ È¤€ôøì(€€€€€€€Í••¸¹ÁÕÍ ¡µ…Ñ È¤ì(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðµ…Ñ È¹•‘•½Õ¹Ðì¤¬¬¤ì(€€€€€€€€€±•ÐìÑåÁ”°¹•áÐô€ôµ…Ñ È¹•‘”¡¤¤ì(€€€€€€€€€¥˜€¡ÑåÁ”€ôô¹½‘•QåÁ”¤(€€€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€€€¥˜€¡Í••¸¹¥¹‘•á=˜¡¹•áÐ¤€ð€À€˜˜Í…¸¡¹•áÐ¤¤(€€€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€ô(€€€€€ôì(€€€€€¥˜€¡Í…¸¡Á…É•¹Ð¹½¹Ñ•¹Ñ5…Ñ ¤¤(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€ô(€Ù…È=5M•É¥…±¥é•ÈÈ€ô±…ÍÌ}=5M•É¥…±¥é•Èì(€€€€¼¨¨(€€€É•…Ñ”„Í•É¥…±¥é•È¸¹½‘•Í€Í¡½Õ±µ…À¹½‘”¹…µ•ÌÑ¼™Õ¹Ñ¥½¹Ì(€€€Ñ¡…ÐÑ…­”„¹½‘”…¹É•ÑÕÉ¸„‘•ÍÉ¥ÁÑ¥½¸½˜Ñ¡”½ÉÉ•ÍÁ½¹‘¥¹œ(€€€=4¸µ…É­Í€‘½•ÌÑ¡”Í…µ”™½Èµ…É¬¹…µ•Ì°‰ÕÐ…±Í¼•ÑÌ…¸(€€€…ÉÕµ•¹ÐÑ¡…ÐÑ•±±Ì¥ÐÝ¡•Ñ¡•ÈÑ¡”µ…É¬Ì½¹Ñ•¹Ð¥Ì‰±½¬½È(€€€¥¹±¥¹”½¹Ñ•¹Ð€¡™½ÈÑåÁ¥…°ÕÍ”°¥Ð±°…±Ý…åÌ‰”¥¹±¥¹”¤¸µ…É¬(€€€Í•É¥…±¥é•Èµ…ä‰”¹Õ±±€Ñ¼¥¹‘¥…Ñ”Ñ¡…Ðµ…É­Ì½˜Ñ¡…ÐÑåÁ”(€€€Í¡½Õ±¹½Ð‰”Í•É¥…±¥é•¸(€€€€¨¼(€€€½¹ÍÑÉÕÑ½È¡¹½‘•Ì°µ…É­Ì¤ì(€€€€€Ñ¡¥Ì¹¹½‘•Ì€ô¹½‘•Ìì(€€€€€Ñ¡¥Ì¹µ…É­Ì€ôµ…É­Ìì(€€€ô(€€€€¼¨¨(€€€M•É¥…±¥é”Ñ¡”½¹Ñ•¹Ð½˜Ñ¡¥Ì™É…µ•¹ÐÑ¼„=4™É…µ•¹Ð¸]¡•¸(€€€¹½Ð¥¸Ñ¡”‰É½ÝÍ•È°Ñ¡”‘½Õµ•¹Ñ€½ÁÑ¥½¸°½¹Ñ…¥¹¥¹œ„=4(€€€‘½Õµ•¹Ð°Í¡½Õ±‰”Á…ÍÍ•Í¼Ñ¡…ÐÑ¡”Í•É¥…±¥é•È…¸É•…Ñ”(€€€¹½‘•Ì¸(€€€€¨¼(€€€Í•É¥…±¥é•É…µ•¹Ð¡™É…µ•¹Ð°½ÁÑ¥½¹Ì€ôíô°Ñ…É•Ð¤ì(€€€€€¥˜€ …Ñ…É•Ð¤(€€€€€€€Ñ…É•Ð€ô‘½ŒÌ¡½ÁÑ¥½¹Ì¤¹É•…Ñ•½Õµ•¹ÑÉ…µ•¹Ð ¤ì(€€€€€±•ÐÑ½À€ôÑ…É•Ð°…Ñ¥Ù”€ômtì(€€€€€™É…µ•¹Ð¹™½É…  ¡¹½‘”¤€ôøì(€€€€€€€¥˜€¡…Ñ¥Ù”¹±•¹Ñ ñð¹½‘”¹µ…É­Ì¹±•¹Ñ ¤ì(€€€€€€€€€±•Ð­••À€ô€À°É•¹‘•É•€ô€Àì(€€€€€€€€€Ý¡¥±”€¡­••À€ð…Ñ¥Ù”¹±•¹Ñ €˜˜É•¹‘•É•€ð¹½‘”¹µ…É­Ì¹±•¹Ñ ¤ì(€€€€€€€€€€€±•Ð¹•áÐ€ô¹½‘”¹µ…É­ÍmÉ•¹‘•É•‘tì(€€€€€€€€€€€¥˜€ …Ñ¡¥Ì¹µ…É­Ím¹•áÐ¹ÑåÁ”¹¹…µ•t¤ì(€€€€€€€€€€€€€É•¹‘•É•¬¬ì(€€€€€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€€€€€ô(€€€€€€€€€€€¥˜€ …¹•áÐ¹•Ä¡…Ñ¥Ù•m­••ÁulÁt¤ñð¹•áÐ¹ÑåÁ”¹ÍÁ•Œ¹ÍÁ…¹¹¥¹œ€ôôô™…±Í”¤(€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€­••À¬¬ì(€€€€€€€€€€€É•¹‘•É•¬¬ì(€€€€€€€€€ô(€€€€€€€€€Ý¡¥±”€¡­••À€ð…Ñ¥Ù”¹±•¹Ñ ¤(€€€€€€€€€€€Ñ½À€ô…Ñ¥Ù”¹Á½À ¥lÅtì(€€€€€€€€€Ý¡¥±”€¡É•¹‘•É•€ð¹½‘”¹µ…É­Ì¹±•¹Ñ ¤ì(€€€€€€€€€€€±•Ð…‘€ô¹½‘”¹µ…É­ÍmÉ•¹‘•É•¬­tì(€€€€€€€€€€€±•Ðµ…É­=4€ôÑ¡¥Ì¹Í•É¥…±¥é•5…É¬¡…‘°¹½‘”¹¥Í%¹±¥¹”°½ÁÑ¥½¹Ì¤ì(€€€€€€€€€€€¥˜€¡µ…É­=4¤ì(€€€€€€€€€€€€€…Ñ¥Ù”¹ÁÕÍ ¡m…‘°Ñ½Át¤ì(€€€€€€€€€€€€€Ñ½À¹…ÁÁ•¹‘¡¥±¡µ…É­=4¹‘½´¤ì(€€€€€€€€€€€€€Ñ½À€ôµ…É­=4¹½¹Ñ•¹Ñ=4ñðµ…É­=4¹‘½´ì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€Ñ½À¹…ÁÁ•¹‘¡¥±¡Ñ¡¥Ì¹Í•É¥…±¥é•9½‘•%¹¹•È¡¹½‘”°½ÁÑ¥½¹Ì¤¤ì(€€€€€ô¤ì(€€€€€É•ÑÕÉ¸Ñ…É•Ðì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€Í•É¥…±¥é•9½‘•%¹¹•È¡¹½‘”°½ÁÑ¥½¹Ì¤ì(€€€€€¥˜€¡¹½‘”¹¥ÍQ•áÐ¤(€€€€€€€É•ÑÕÉ¸‘½ŒÌ¡½ÁÑ¥½¹Ì¤¹É•…Ñ•Q•áÑ9½‘”¡¹½‘”¹Ñ•áÐ¤ì(€€€€€±•Ðì‘½´°½¹Ñ•¹Ñ=4ô€ôÉ•¹‘•ÉMÁ•ŒÈ¡‘½ŒÌ¡½ÁÑ¥½¹Ì¤°Ñ¡¥Ì¹¹½‘•Ím¹½‘”¹ÑåÁ”¹¹…µ•t¡¹½‘”¤°¹Õ±°°¹½‘”¹…ÑÑÉÌ¤ì(€€€€€¥˜€¡½¹Ñ•¹Ñ=4¤ì(€€€€€€€¥˜€¡¹½‘”¹¥Í1•…˜¤(€€€€€€€€€Ñ¡É½Ü¹•ÜI…¹•ÉÉ½È ‰½¹Ñ•¹Ð¡½±”¹½Ð…±±½Ý•¥¸„±•…˜¹½‘”ÍÁ•Œˆ¤ì(€€€€€€€Ñ¡¥Ì¹Í•É¥…±¥é•É…µ•¹Ð¡¹½‘”¹½¹Ñ•¹Ð°½ÁÑ¥½¹Ì°½¹Ñ•¹Ñ=4¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸‘½´ì(€€€ô(€€€€¼¨¨(€€€M•É¥…±¥é”Ñ¡¥Ì¹½‘”Ñ¼„=4¹½‘”¸Q¡¥Ì…¸‰”ÕÍ•™Õ°Ý¡•¸å½Ô(€€€¹••Ñ¼Í•É¥…±¥é”„Á…ÉÐ½˜„‘½Õµ•¹Ð°…Ì½ÁÁ½Í•Ñ¼Ñ¡”Ý¡½±”(€€€‘½Õµ•¹Ð¸Q¼Í•É¥…±¥é”„Ý¡½±”‘½Õµ•¹Ð°ÕÍ”(€€€mÍ•É¥…±¥é•É…µ•¹Ñt¡¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½É•˜¼µ½‘•°¹=5M•É¥…±¥é•È¹Í•É¥…±¥é•É…µ•¹Ð¤½¸(€€€¥ÑÌm½¹Ñ•¹Ñt¡¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½É•˜¼µ½‘•°¹9½‘”¹½¹Ñ•¹Ð¤¸(€€€€¨¼(€€€Í•É¥…±¥é•9½‘”¡¹½‘”°½ÁÑ¥½¹Ì€ôíô¤ì(€€€€€±•Ð‘½´€ôÑ¡¥Ì¹Í•É¥…±¥é•9½‘•%¹¹•È¡¹½‘”°½ÁÑ¥½¹Ì¤ì(€€€€€™½È€¡±•Ð¤€ô¹½‘”¹µ…É­Ì¹±•¹Ñ €´€Äì¤€øô€Àì¤´´¤ì(€€€€€€€±•ÐÝÉ…ÀÈ€ôÑ¡¥Ì¹Í•É¥…±¥é•5…É¬¡¹½‘”¹µ…É­Ím¥t°¹½‘”¹¥Í%¹±¥¹”°½ÁÑ¥½¹Ì¤ì(€€€€€€€¥˜€¡ÝÉ…ÀÈ¤ì(€€€€€€€€€€¡ÝÉ…ÀÈ¹½¹Ñ•¹Ñ=4ñðÝÉ…ÀÈ¹‘½´¤¹…ÁÁ•¹‘¡¥±¡‘½´¤ì(€€€€€€€€€‘½´€ôÝÉ…ÀÈ¹‘½´ì(€€€€€€€ô(€€€€€ô(€€€€€É•ÑÕÉ¸‘½´ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€Í•É¥…±¥é•5…É¬¡µ…É¬°¥¹±¥¹”°½ÁÑ¥½¹Ì€ôíô¤ì(€€€€€±•ÐÑ½=4€ôÑ¡¥Ì¹µ…É­Ímµ…É¬¹ÑåÁ”¹¹…µ•tì(€€€€€É•ÑÕÉ¸Ñ½=4€˜˜É•¹‘•ÉMÁ•ŒÈ¡‘½ŒÌ¡½ÁÑ¥½¹Ì¤°Ñ½=4¡µ…É¬°¥¹±¥¹”¤°¹Õ±°°µ…É¬¹…ÑÑÉÌ¤ì(€€€ô(€€€ÍÑ…Ñ¥ŒÉ•¹‘•ÉMÁ•Œ¡‘½ŒÔ°ÍÑÉÕÑÕÉ”°áµ±9L€ô¹Õ±°°‰±½­ÉÉ…åÍ%¸¤ì(€€€€€¥˜€¡ÑåÁ•½˜ÍÑÉÕÑÕÉ”€ôô€‰ÍÑÉ¥¹œˆ¤(€€€€€€€É•ÑÕÉ¸ì‘½´è‘½ŒÔ¹É•…Ñ•Q•áÑ9½‘”¡ÍÑÉÕÑÕÉ”¤ôì(€€€€€É•ÑÕÉ¸É•¹‘•ÉMÁ•ŒÈ¡‘½ŒÔ°ÍÑÉÕÑÕÉ”°áµ±9L°‰±½­ÉÉ…åÍ%¸¤ì(€€€ô(€€€€¼¨¨(€€€	Õ¥±„Í•É¥…±¥é•ÈÕÍ¥¹œÑ¡”mÑ½=5t¡¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½É•˜¼µ½‘•°¹9½‘•MÁ•Œ¹Ñ½=4¤(€€€ÁÉ½Á•ÉÑ¥•Ì¥¸„Í¡•µ„Ì¹½‘”…¹µ…É¬ÍÁ•Ì¸(€€€€¨¼(€€€ÍÑ…Ñ¥Œ™É½µM¡•µ„¡Í¡•µ„È¤ì(€€€€€É•ÑÕÉ¸Í¡•µ„È¹…¡•¹‘½µM•É¥…±¥é•Èñð€¡Í¡•µ„È¹…¡•¹‘½µM•É¥…±¥é•È€ô¹•Ü}=5M•É¥…±¥é•È¡Ñ¡¥Ì¹¹½‘•ÍÉ½µM¡•µ„¡Í¡•µ„È¤°Ñ¡¥Ì¹µ…É­ÍÉ½µM¡•µ„¡Í¡•µ„È¤¤¤ì(€€€ô(€€€€¼¨¨(€€€…Ñ¡•ÈÑ¡”Í•É¥…±¥é•ÉÌ¥¸„Í¡•µ„Ì¹½‘”ÍÁ•Ì¥¹Ñ¼…¸½‰©•Ð¸(€€€Q¡¥Ì…¸‰”ÕÍ•™Õ°…Ì„‰…Í”Ñ¼‰Õ¥±„ÕÍÑ½´Í•É¥…±¥é•È™É½´¸(€€€€¨¼(€€€ÍÑ…Ñ¥Œ¹½‘•ÍÉ½µM¡•µ„¡Í¡•µ„È¤ì(€€€€€±•ÐÉ•ÍÕ±Ð€ô…Ñ¡•ÉQ½=4È¡Í¡•µ„È¹¹½‘•Ì¤ì(€€€€€¥˜€ …É•ÍÕ±Ð¹Ñ•áÐ¤(€€€€€€€É•ÍÕ±Ð¹Ñ•áÐ€ô€¡¹½‘”¤€ôø¹½‘”¹Ñ•áÐì(€€€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€€€ô(€€€€¼¨¨(€€€…Ñ¡•ÈÑ¡”Í•É¥…±¥é•ÉÌ¥¸„Í¡•µ„Ìµ…É¬ÍÁ•Ì¥¹Ñ¼…¸½‰©•Ð¸(€€€€¨¼(€€€ÍÑ…Ñ¥Œµ…É­ÍÉ½µM¡•µ„¡Í¡•µ„È¤ì(€€€€€É•ÑÕÉ¸…Ñ¡•ÉQ½=4È¡Í¡•µ„È¹µ…É­Ì¤ì(€€€ô(€ôì(€™Õ¹Ñ¥½¸…Ñ¡•ÉQ½=4È¡½‰¨¤ì(€€€±•ÐÉ•ÍÕ±Ð€ôíôì(€€€™½È€¡±•Ð¹…µ”¥¸½‰¨¤ì(€€€€€±•ÐÑ½=4€ô½‰©m¹…µ•t¹ÍÁ•Œ¹Ñ½=4ì(€€€€€¥˜€¡Ñ½=4¤(€€€€€€€É•ÍÕ±Ñm¹…µ•t€ôÑ½=4ì(€€€ô(€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€ô(€™Õ¹Ñ¥½¸‘½ŒÌ¡½ÁÑ¥½¹Ì¤ì(€€€É•ÑÕÉ¸½ÁÑ¥½¹Ì¹‘½Õµ•¹ÐñðÝ¥¹‘½Ü¹‘½Õµ•¹Ðì(€ô(€Ù…ÈÍÕÍÁ¥¥½ÕÍÑÑÉ¥‰ÕÑ•…¡”È€ô€¼¨}}AUI}|€¨¼¹•Ü]•…­5…À ¤ì(€™Õ¹Ñ¥½¸ÍÕÍÁ¥¥½ÕÍÑÑÉ¥‰ÕÑ•ÌÈ¡…ÑÑÉÌ¤ì(€€€±•ÐÙ…±Õ”€ôÍÕÍÁ¥¥½ÕÍÑÑÉ¥‰ÕÑ•…¡”È¹•Ð¡…ÑÑÉÌ¤ì(€€€¥˜€¡Ù…±Õ”€ôôôÙ½¥€À¤(€€€€€ÍÕÍÁ¥¥½ÕÍÑÑÉ¥‰ÕÑ•…¡”È¹Í•Ð¡…ÑÑÉÌ°Ù…±Õ”€ôÍÕÍÁ¥¥½ÕÍÑÑÉ¥‰ÕÑ•Í%¹¹•ÈÈ¡…ÑÑÉÌ¤¤ì(€€€É•ÑÕÉ¸Ù…±Õ”ì(€ô(€™Õ¹Ñ¥½¸ÍÕÍÁ¥¥½ÕÍÑÑÉ¥‰ÕÑ•Í%¹¹•ÈÈ¡…ÑÑÉÌ¤ì(€€€±•ÐÉ•ÍÕ±Ð€ô¹Õ±°ì(€€€™Õ¹Ñ¥½¸Í…¸¡Ù…±Õ”¤ì(€€€€€¥˜€¡Ù…±Õ”€˜˜ÑåÁ•½˜Ù…±Õ”€ôô€‰½‰©•Ðˆ¤ì(€€€€€€€¥˜€¡ÉÉ…ä¹¥ÍÉÉ…ä¡Ù…±Õ”¤¤ì(€€€€€€€€€¥˜€¡ÑåÁ•½˜Ù…±Õ•lÁt€ôô€‰ÍÑÉ¥¹œˆ¤ì(€€€€€€€€€€€¥˜€ …É•ÍÕ±Ð¤(€€€€€€€€€€€€€É•ÍÕ±Ð€ômtì(€€€€€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡Ù…±Õ”¤ì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÙ…±Õ”¹±•¹Ñ ì¤¬¬¤(€€€€€€€€€€€€€Í…¸¡Ù…±Õ•m¥t¤ì(€€€€€€€€€ô(€€€€€€€ô•±Í”ì(€€€€€€€€€™½È€¡±•ÐÁÉ½À¥¸Ù…±Õ”¤(€€€€€€€€€€€Í…¸¡Ù…±Õ•mÁÉ½Át¤ì(€€€€€€€ô(€€€€€ô(€€€ô(€€€Í…¸¡…ÑÑÉÌ¤ì(€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€ô(€™Õ¹Ñ¥½¸É•¹‘•ÉMÁ•ŒÈ¡‘½ŒÔ°ÍÑÉÕÑÕÉ”°áµ±9L°‰±½­ÉÉ…åÍ%¸¤ì(€€€¥˜€¡ÍÑÉÕÑÕÉ”¹¹½‘•QåÁ”€ôô€Ä¤(€€€€€É•ÑÕÉ¸ì‘½´èÍÑÉÕÑÕÉ”ôì(€€€¥˜€¡ÍÑÉÕÑÕÉ”¹‘½´€˜˜ÍÑÉÕÑÕÉ”¹‘½´¹¹½‘•QåÁ”€ôô€Ä¤(€€€€€É•ÑÕÉ¸ÍÑÉÕÑÕÉ”ì(€€€±•ÐÑ…9…µ”€ôÍÑÉÕÑÕÉ•lÁt°ÍÕÍÁ¥¥½ÕÌì(€€€¥˜€¡ÑåÁ•½˜Ñ…9…µ”€„ô€‰ÍÑÉ¥¹œˆ¤(€€€€€Ñ¡É½Ü¹•ÜI…¹•ÉÉ½È ‰%¹Ù…±¥…ÉÉ…äÁ…ÍÍ•Ñ¼É•¹‘•ÉMÁ•Œˆ¤ì(€€€¥˜€¡‰±½­ÉÉ…åÍ%¸€˜˜€¡ÍÕÍÁ¥¥½ÕÌ€ôÍÕÍÁ¥¥½ÕÍÑÑÉ¥‰ÕÑ•ÌÈ¡‰±½­ÉÉ…åÍ%¸¤¤€˜˜ÍÕÍÁ¥¥½ÕÌ¹¥¹‘•á=˜¡ÍÑÉÕÑÕÉ”¤€ø€´Ä¤(€€€€€Ñ¡É½Ü¹•ÜI…¹•ÉÉ½È ‰UÍ¥¹œ…¸…ÉÉ…ä™É½´…¸…ÑÑÉ¥‰ÕÑ”½‰©•Ð…Ì„=4ÍÁ•Œ¸Q¡¥Ìµ…ä‰”…¸…ÑÑ•µÁÑ•É½ÍÌÍ¥Ñ”ÍÉ¥ÁÑ¥¹œ…ÑÑ…¬¸ˆ¤ì(€€€±•ÐÍÁ…”€ôÑ…9…µ”¹¥¹‘•á=˜ ˆ€ˆ¤ì(€€€¥˜€¡ÍÁ…”€ø€À¤ì(€€€€€áµ±9L€ôÑ…9…µ”¹Í±¥” À°ÍÁ…”¤ì(€€€€€Ñ…9…µ”€ôÑ…9…µ”¹Í±¥”¡ÍÁ…”€¬€Ä¤ì(€€€ô(€€€±•Ð½¹Ñ•¹Ñ=4ì(€€€±•Ð‘½´€ôáµ±9L€ü‘½ŒÔ¹É•…Ñ•±•µ•¹Ñ9L¡áµ±9L°Ñ…9…µ”¤€è‘½ŒÔ¹É•…Ñ•±•µ•¹Ð¡Ñ…9…µ”¤ì(€€€±•Ð…ÑÑÉÌ€ôÍÑÉÕÑÕÉ•lÅt°ÍÑ…ÉÐ€ô€Äì(€€€¥˜€¡…ÑÑÉÌ€˜˜ÑåÁ•½˜…ÑÑÉÌ€ôô€‰½‰©•Ðˆ€˜˜…ÑÑÉÌ¹¹½‘•QåÁ”€ôô¹Õ±°€˜˜€…ÉÉ…ä¹¥ÍÉÉ…ä¡…ÑÑÉÌ¤¤ì(€€€€€ÍÑ…ÉÐ€ô€Èì(€€€€€™½È€¡±•Ð¹…µ”¥¸…ÑÑÉÌ¤(€€€€€€€¥˜€¡…ÑÑÉÍm¹…µ•t€„ô¹Õ±°¤ì(€€€€€€€€€±•ÐÍÁ…”È€ô¹…µ”¹¥¹‘•á=˜ ˆ€ˆ¤ì(€€€€€€€€€¥˜€¡ÍÁ…”È€ø€À¤(€€€€€€€€€€€‘½´¹Í•ÑÑÑÉ¥‰ÕÑ•9L¡¹…µ”¹Í±¥” À°ÍÁ…”È¤°¹…µ”¹Í±¥”¡ÍÁ…”È€¬€Ä¤°…ÑÑÉÍm¹…µ•t¤ì(€€€€€€€€€•±Í”¥˜€¡¹…µ”€ôô€‰ÍÑå±”ˆ€˜˜‘½´¹ÍÑå±”¤(€€€€€€€€€€€‘½´¹ÍÑå±”¹ÍÍQ•áÐ€ô…ÑÑÉÍm¹…µ•tì(€€€€€€€€€•±Í”(€€€€€€€€€€€‘½´¹Í•ÑÑÑÉ¥‰ÕÑ”¡¹…µ”°…ÑÑÉÍm¹…µ•t¤ì(€€€€€€€ô(€€€ô(€€€™½È€¡±•Ð¤€ôÍÑ…ÉÐì¤€ðÍÑÉÕÑÕÉ”¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•Ð¡¥±€ôÍÑÉÕÑÕÉ•m¥tì(€€€€€¥˜€¡¡¥±€ôôô€À¤ì(€€€€€€€¥˜€¡¤€ðÍÑÉÕÑÕÉ”¹±•¹Ñ €´€Äñð¤€øÍÑ…ÉÐ¤(€€€€€€€€€Ñ¡É½Ü¹•ÜI…¹•ÉÉ½È ‰½¹Ñ•¹Ð¡½±”µÕÍÐ‰”Ñ¡”½¹±ä¡¥±½˜¥ÑÌÁ…É•¹Ð¹½‘”ˆ¤ì(€€€€€€€É•ÑÕÉ¸ì‘½´°½¹Ñ•¹Ñ=4è‘½´ôì(€€€€€ô•±Í”¥˜€¡ÑåÁ•½˜¡¥±€ôô€‰ÍÑÉ¥¹œˆ¤ì(€€€€€€€‘½´¹…ÁÁ•¹‘¡¥±¡‘½ŒÔ¹É•…Ñ•Q•áÑ9½‘”¡¡¥±¤¤ì(€€€€€ô•±Í”ì(€€€€€€€±•Ðì‘½´è¥¹¹•È°½¹Ñ•¹Ñ=4è¥¹¹•É½¹Ñ•¹Ðô€ôÉ•¹‘•ÉMÁ•ŒÈ¡‘½ŒÔ°¡¥±°áµ±9L°‰±½­ÉÉ…åÍ%¸¤ì(€€€€€€€‘½´¹…ÁÁ•¹‘¡¥±¡¥¹¹•È¤ì(€€€€€€€¥˜€¡¥¹¹•É½¹Ñ•¹Ð¤ì(€€€€€€€€€¥˜€¡½¹Ñ•¹Ñ=4¤(€€€€€€€€€€€Ñ¡É½Ü¹•ÜI…¹•ÉÉ½È ‰5Õ±Ñ¥Á±”½¹Ñ•¹Ð¡½±•Ìˆ¤ì(€€€€€€€€€½¹Ñ•¹Ñ=4€ô¥¹¹•É½¹Ñ•¹Ðì(€€€€€€€ô(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸ì‘½´°½¹Ñ•¹Ñ=4ôì(€ô((€€¼¼¹½‘•}µ½‘Õ±•Ì½ÁÉ½Í•µ¥ÉÉ½ÈµÙ¥•Ü½‘¥ÍÐ½¥¹‘•à¹©Ì(€Ù…È‘½µ%¹‘•à€ô™Õ¹Ñ¥½¸¡¹½‘”¤ì(€€€™½È€¡Ù…È¥¹‘•à€ô€Àì€ì¥¹‘•à¬¬¤ì(€€€€€¹½‘”€ô¹½‘”¹ÁÉ•Ù¥½ÕÍM¥‰±¥¹œì(€€€€€¥˜€ …¹½‘”¤(€€€€€€€É•ÑÕÉ¸¥¹‘•àì(€€€ô(€ôì(€Ù…ÈÁ…É•¹Ñ9½‘”€ô™Õ¹Ñ¥½¸¡¹½‘”¤ì(€€€±•ÐÁ…É•¹Ð€ô¹½‘”¹…ÍÍ¥¹•‘M±½Ðñð¹½‘”¹Á…É•¹Ñ9½‘”ì(€€€É•ÑÕÉ¸Á…É•¹Ð€˜˜Á…É•¹Ð¹¹½‘•QåÁ”€ôô€ÄÄ€üÁ…É•¹Ð¹¡½ÍÐ€èÁ…É•¹Ðì(€ôì(€Ù…ÈÉ•ÕÍ•‘I…¹”€ô¹Õ±°ì(€Ù…ÈÑ•áÑI…¹”€ô™Õ¹Ñ¥½¸¡¹½‘”°™É½´È°Ñ¼¤ì(€€€±•ÐÉ…¹”€ôÉ•ÕÍ•‘I…¹”ñð€¡É•ÕÍ•‘I…¹”€ô‘½Õµ•¹Ð¹É•…Ñ•I…¹” ¤¤ì(€€€É…¹”¹Í•Ñ¹¡¹½‘”°Ñ¼€ôô¹Õ±°€ü¹½‘”¹¹½‘•Y…±Õ”¹±•¹Ñ €èÑ¼¤ì(€€€É…¹”¹Í•ÑMÑ…ÉÐ¡¹½‘”°™É½´Èñð€À¤ì(€€€É•ÑÕÉ¸É…¹”ì(€ôì(€Ù…È±•…ÉI•ÕÍ•‘I…¹”€ô™Õ¹Ñ¥½¸ ¤ì(€€€É•ÕÍ•‘I…¹”€ô¹Õ±°ì(€ôì(€Ù…È¥ÍÅÕ¥Ù…±•¹ÑA½Í¥Ñ¥½¸€ô™Õ¹Ñ¥½¸¡¹½‘”°½™˜°Ñ…É•Ñ9½‘”°Ñ…É•Ñ=™˜¤ì(€€€É•ÑÕÉ¸Ñ…É•Ñ9½‘”€˜˜€¡Í…¹½È¡¹½‘”°½™˜°Ñ…É•Ñ9½‘”°Ñ…É•Ñ=™˜°€´Ä¤ñðÍ…¹½È¡¹½‘”°½™˜°Ñ…É•Ñ9½‘”°Ñ…É•Ñ=™˜°€Ä¤¤ì(€ôì(€Ù…È…Ñ½µ±•µ•¹ÑÌ€ô€½x¡¥µñ‰Éñ¥¹ÁÕÑñÑ•áÑ…É•…ñ¡È¤½¤ì(€™Õ¹Ñ¥½¸Í…¹½È¡¹½‘”°½™˜°Ñ…É•Ñ9½‘”°Ñ…É•Ñ=™˜°‘¥È¤ì(€€€Ù…È}„ì(€€€™½È€ ì€ì€¤ì(€€€€€¥˜€¡¹½‘”€ôôÑ…É•Ñ9½‘”€˜˜½™˜€ôôÑ…É•Ñ=™˜¤(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€¥˜€¡½™˜€ôô€¡‘¥È€ð€À€ü€À€è¹½‘•M¥é”¡¹½‘”¤¤¤ì(€€€€€€€±•ÐÁ…É•¹Ð€ô¹½‘”¹Á…É•¹Ñ9½‘”ì(€€€€€€€¥˜€ …Á…É•¹Ðñð€…¥Í±Ð¡Á…É•¹Ð¤ñð¡…Í	±½­•ÍŒ¡¹½‘”¤ñð…Ñ½µ±•µ•¹ÑÌ¹Ñ•ÍÐ¡¹½‘”¹¹½‘•9…µ”¤ñð¹½‘”¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€½™˜€ô‘½µ%¹‘•à¡¹½‘”¤€¬€¡‘¥È€ð€À€ü€À€è€Ä¤ì(€€€€€€€¹½‘”€ôÁ…É•¹Ðì(€€€€€ô•±Í”¥˜€¡¥Í±Ð¡¹½‘”¤¤ì(€€€€€€€±•Ð¡¥±€ô¹½‘”¹¡¥±‘9½‘•Ím½™˜€¬€¡‘¥È€ð€À€ü€´Ä€è€À¥tì(€€€€€€€¥˜€¡¥Í±Ð¡¡¥±¤€˜˜¡¥±¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤ì(€€€€€€€€€¥˜€ ¡}„€ô¡¥±¹ÁµY¥•Ý•ÍŒ¤€ôôô¹Õ±°ñð}„€ôôôÙ½¥€À€üÙ½¥€À€è}„¹¥¹½É•½ÉM•±•Ñ¥½¸¤(€€€€€€€€€€€½™˜€¬ô‘¥Èì(€€€€€€€€€•±Í”(€€€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€ô•±Í”ì(€€€€€€€€€¹½‘”€ô¡¥±ì(€€€€€€€€€½™˜€ô‘¥È€ð€À€ü¹½‘•M¥é”¡¹½‘”¤€è€Àì(€€€€€€€ô(€€€€€ô•±Í”ì(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€ô(€€€ô(€ô(€™Õ¹Ñ¥½¸¹½‘•M¥é”¡¹½‘”¤ì(€€€É•ÑÕÉ¸¹½‘”¹¹½‘•QåÁ”€ôô€Ì€ü¹½‘”¹¹½‘•Y…±Õ”¹±•¹Ñ €è¹½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ ì(€ô(€™Õ¹Ñ¥½¸¥Í±Ð¡¹½‘”¤ì(€€€É•ÑÕÉ¸¹½‘”¹¹½‘•QåÁ”€ôô€Äì(€ô(€™Õ¹Ñ¥½¸¥ÍQ•áÐ¡¹½‘”¤ì(€€€É•ÑÕÉ¸¹½‘”¹¹½‘•QåÁ”€ôô€Ìì(€ô(€™Õ¹Ñ¥½¸½¹Ñ…¥¹Ì¡Á…É•¹Ð°¡¥±¤ì(€€€É•ÑÕÉ¸¡¥±€üÁ…É•¹Ð¹½¹Ñ…¥¹Ì¡¥Í±Ð¡¡¥±¤€ü¡¥±€è¡¥±¹Á…É•¹Ñ9½‘”¤€è™…±Í”ì(€ô(€™Õ¹Ñ¥½¸Ñ•áÑ9½‘•	•™½É”Ä¡¹½‘”°½™™Í•Ð¤ì(€€€™½È€ ì€ì€¤ì(€€€€€¥˜€¡¥ÍQ•áÐ¡¹½‘”¤€˜˜½™™Í•Ð¤(€€€€€€€É•ÑÕÉ¸¹½‘”ì(€€€€€¥˜€¡¥Í±Ð¡¹½‘”¤€˜˜½™™Í•Ð€ø€À¤ì(€€€€€€€¥˜€¡¹½‘”¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤(€€€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€€€¹½‘”€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ð€´€Åtì(€€€€€€€½™™Í•Ð€ô¹½‘•M¥é”¡¹½‘”¤ì(€€€€€ô•±Í”¥˜€¡¹½‘”¹Á…É•¹Ñ9½‘”€˜˜€…¡…Í	±½­•ÍŒ¡¹½‘”¤¤ì(€€€€€€€½™™Í•Ð€ô‘½µ%¹‘•à¡¹½‘”¤ì(€€€€€€€¹½‘”€ô¹½‘”¹Á…É•¹Ñ9½‘”ì(€€€€€ô•±Í”ì(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€ô(€€€ô(€ô(€™Õ¹Ñ¥½¸Ñ•áÑ9½‘•™Ñ•ÈÄ¡¹½‘”°½™™Í•Ð¤ì(€€€™½È€ ì€ì€¤ì(€€€€€¥˜€¡¥ÍQ•áÐ¡¹½‘”¤€˜˜½™™Í•Ð€ð¹½‘”¹¹½‘•Y…±Õ”¹±•¹Ñ ¤(€€€€€€€É•ÑÕÉ¸¹½‘”ì(€€€€€¥˜€¡¥Í±Ð¡¹½‘”¤€˜˜½™™Í•Ð€ð¹½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ ¤ì(€€€€€€€¥˜€¡¹½‘”¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤(€€€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€€€¹½‘”€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ñtì(€€€€€€€½™™Í•Ð€ô€Àì(€€€€€ô•±Í”¥˜€¡¹½‘”¹Á…É•¹Ñ9½‘”€˜˜€…¡…Í	±½­•ÍŒ¡¹½‘”¤¤ì(€€€€€€€½™™Í•Ð€ô‘½µ%¹‘•à¡¹½‘”¤€¬€Äì(€€€€€€€¹½‘”€ô¹½‘”¹Á…É•¹Ñ9½‘”ì(€€€€€ô•±Í”ì(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€ô(€€€ô(€ô(€™Õ¹Ñ¥½¸¥Í=¹‘”¡¹½‘”°½™™Í•Ð°Á…É•¹Ð¤ì(€€€™½È€¡±•Ð…ÑMÑ…ÉÐ€ô½™™Í•Ð€ôô€À°…Ñ¹€ô½™™Í•Ð€ôô¹½‘•M¥é”¡¹½‘”¤ì…ÑMÑ…ÉÐñð…Ñ¹ì€¤ì(€€€€€¥˜€¡¹½‘”€ôôÁ…É•¹Ð¤(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€±•Ð¥¹‘•à€ô‘½µ%¹‘•à¡¹½‘”¤ì(€€€€€¹½‘”€ô¹½‘”¹Á…É•¹Ñ9½‘”ì(€€€€€¥˜€ …¹½‘”¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€…ÑMÑ…ÉÐ€ô…ÑMÑ…ÉÐ€˜˜¥¹‘•à€ôô€Àì(€€€€€…Ñ¹€ô…Ñ¹€˜˜¥¹‘•à€ôô¹½‘•M¥é”¡¹½‘”¤ì(€€€ô(€ô(€™Õ¹Ñ¥½¸¡…Í	±½­•ÍŒ¡‘½´¤ì(€€€±•Ð‘•ÍŒì(€€€™½È€¡±•ÐÕÈ€ô‘½´ìÕÈìÕÈ€ôÕÈ¹Á…É•¹Ñ9½‘”¤(€€€€€¥˜€¡‘•ÍŒ€ôÕÈ¹ÁµY¥•Ý•ÍŒ¤(€€€€€€€‰É•…¬ì(€€€É•ÑÕÉ¸‘•ÍŒ€˜˜‘•ÍŒ¹¹½‘”€˜˜‘•ÍŒ¹¹½‘”¹¥Í	±½¬€˜˜€¡‘•ÍŒ¹‘½´€ôô‘½´ñð‘•ÍŒ¹½¹Ñ•¹Ñ=4€ôô‘½´¤ì(€ô(€Ù…ÈÍ•±•Ñ¥½¹½±±…ÁÍ•€ô™Õ¹Ñ¥½¸¡‘½µM•°¤ì(€€€É•ÑÕÉ¸‘½µM•°¹™½ÕÍ9½‘”€˜˜¥ÍÅÕ¥Ù…±•¹ÑA½Í¥Ñ¥½¸¡‘½µM•°¹™½ÕÍ9½‘”°‘½µM•°¹™½ÕÍ=™™Í•Ð°‘½µM•°¹…¹¡½É9½‘”°‘½µM•°¹…¹¡½É=™™Í•Ð¤ì(€ôì(€™Õ¹Ñ¥½¸­•åÙ•¹Ð¡­•å½‘”°­•ä¤ì(€€€±•Ð•Ù•¹Ð€ô‘½Õµ•¹Ð¹É•…Ñ•Ù•¹Ð ‰Ù•¹Ðˆ¤ì(€€€•Ù•¹Ð¹¥¹¥ÑÙ•¹Ð ‰­•å‘½Ý¸ˆ°ÑÉÕ”°ÑÉÕ”¤ì(€€€•Ù•¹Ð¹­•å½‘”€ô­•å½‘”ì(€€€•Ù•¹Ð¹­•ä€ô•Ù•¹Ð¹½‘”€ô­•äì(€€€É•ÑÕÉ¸•Ù•¹Ðì(€ô(€™Õ¹Ñ¥½¸‘••ÁÑ¥Ù•±•µ•¹Ð¡‘½ŒÔ¤ì(€€€±•Ð•±Ð€ô‘½ŒÔ¹…Ñ¥Ù•±•µ•¹Ðì(€€€Ý¡¥±”€¡•±Ð€˜˜•±Ð¹Í¡…‘½ÝI½½Ð¤(€€€€€•±Ð€ô•±Ð¹Í¡…‘½ÝI½½Ð¹…Ñ¥Ù•±•µ•¹Ðì(€€€É•ÑÕÉ¸•±Ðì(€ô(€™Õ¹Ñ¥½¸…É•ÑÉ½µA½¥¹Ð¡‘½ŒÔ°à°ä¤ì(€€€¥˜€¡‘½ŒÔ¹…É•ÑA½Í¥Ñ¥½¹É½µA½¥¹Ð¤ì(€€€€€ÑÉäì(€€€€€€€±•ÐÁ½Ì€ô‘½ŒÔ¹…É•ÑA½Í¥Ñ¥½¹É½µA½¥¹Ð¡à°ä¤ì(€€€€€€€¥˜€¡Á½Ì¤(€€€€€€€€€É•ÑÕÉ¸ì¹½‘”èÁ½Ì¹½™™Í•Ñ9½‘”°½™™Í•Ðè5…Ñ ¹µ¥¸¡¹½‘•M¥é”¡Á½Ì¹½™™Í•Ñ9½‘”¤°Á½Ì¹½™™Í•Ð¤ôì(€€€€€ô…Ñ €¡|¤ì(€€€€€ô(€€€ô(€€€¥˜€¡‘½ŒÔ¹…É•ÑI…¹•É½µA½¥¹Ð¤ì(€€€€€±•ÐÉ…¹”€ô‘½ŒÔ¹…É•ÑI…¹•É½µA½¥¹Ð¡à°ä¤ì(€€€€€¥˜€¡É…¹”¤(€€€€€€€É•ÑÕÉ¸ì¹½‘”èÉ…¹”¹ÍÑ…ÉÑ½¹Ñ…¥¹•È°½™™Í•Ðè5…Ñ ¹µ¥¸¡¹½‘•M¥é”¡É…¹”¹ÍÑ…ÉÑ½¹Ñ…¥¹•È¤°É…¹”¹ÍÑ…ÉÑ=™™Í•Ð¤ôì(€€€ô(€ô(€Ù…È¹…Ø€ôÑåÁ•½˜¹…Ù¥…Ñ½È€„ô€‰Õ¹‘•™¥¹•ˆ€ü¹…Ù¥…Ñ½È€è¹Õ±°ì(€Ù…È‘½ŒÐ€ôÑåÁ•½˜‘½Õµ•¹Ð€„ô€‰Õ¹‘•™¥¹•ˆ€ü‘½Õµ•¹Ð€è¹Õ±°ì(€Ù…È…•¹Ð€ô¹…Ø€˜˜¹…Ø¹ÕÍ•É•¹Ðñð€ˆˆì(€Ù…È¥•}•‘”€ô€½‘•p¼¡q¬¤¼¹•á•Œ¡…•¹Ð¤ì(€Ù…È¥•}ÕÁÑ¼ÄÀ€ô€½5M%q¼¹•á•Œ¡…•¹Ð¤ì(€Ù…È¥•|ÄÅÕÀ€ô€½QÉ¥‘•¹Ñp¼ üélÜ´åuñq‘ìÈ±ô¥p¸¸©ÉØè¡q¬¤¼¹•á•Œ¡…•¹Ð¤ì(€Ù…È¥”€ô€„„¡¥•}ÕÁÑ¼ÄÀñð¥•|ÄÅÕÀñð¥•}•‘”¤ì(€Ù…È¥•}Ù•ÉÍ¥½¸€ô¥•}ÕÁÑ¼ÄÀ€ü‘½Õµ•¹Ð¹‘½Õµ•¹Ñ5½‘”€è¥•|ÄÅÕÀ€ü€­¥•|ÄÅÕÁlÅt€è¥•}•‘”€ü€­¥•}•‘•lÅt€è€Àì(€Ù…È•­¼€ô€…¥”€˜˜€½•­½p¼¡q¬¤½¤¹Ñ•ÍÐ¡…•¹Ð¤ì(€•­¼€˜˜€¬ ½¥É•™½áp¼¡q¬¤¼¹•á•Œ¡…•¹Ð¤ñðlÀ°€Át¥lÅtì(€Ù…È}¡É½µ”€ô€…¥”€˜˜€½¡É½µ•p¼¡q¬¤¼¹•á•Œ¡…•¹Ð¤ì(€Ù…È¡É½µ”€ô€„…}¡É½µ”ì(€Ù…È¡É½µ•}Ù•ÉÍ¥½¸€ô}¡É½µ”€ü€­}¡É½µ•lÅt€è€Àì(€Ù…ÈÍ…™…É¤€ô€…¥”€˜˜€„…¹…Ø€˜˜€½ÁÁ±”½µÁÕÑ•È¼¹Ñ•ÍÐ¡¹…Ø¹Ù•¹‘½È¤ì(€Ù…È¥½Ì€ôÍ…™…É¤€˜˜€ ½5½‰¥±•p½qÜ¬¼¹Ñ•ÍÐ¡…•¹Ð¤ñð€„…¹…Ø€˜˜¹…Ø¹µ…áQ½Õ¡A½¥¹ÑÌ€ø€È¤ì(€Ù…Èµ…Œ€ô¥½Ìñð€¡¹…Ø€ü€½5…Œ¼¹Ñ•ÍÐ¡¹…Ø¹Á±…Ñ™½É´¤€è™…±Í”¤ì(€Ù…ÈÝ¥¹‘½ÝÌ€ô¹…Ø€ü€½]¥¸¼¹Ñ•ÍÐ¡¹…Ø¹Á±…Ñ™½É´¤€è™…±Í”ì(€Ù…È…¹‘É½¥€ô€½¹‘É½¥q¼¹Ñ•ÍÐ¡…•¹Ð¤ì(€Ù…ÈÝ•‰­¥Ð€ô€„…‘½ŒÐ€˜˜€‰Ý•‰­¥Ñ½¹ÑMµ½½Ñ¡¥¹œˆ¥¸‘½ŒÐ¹‘½Õµ•¹Ñ±•µ•¹Ð¹ÍÑå±”ì(€Ù…ÈÝ•‰­¥Ñ}Ù•ÉÍ¥½¸€ôÝ•‰­¥Ð€ü€¬ ½q‰ÁÁ±•]•‰-¥Ñp¼¡q¬¤¼¹•á•Œ¡¹…Ù¥…Ñ½È¹ÕÍ•É•¹Ð¤ñðlÀ°€Át¥lÅt€è€Àì(€™Õ¹Ñ¥½¸Ý¥¹‘½ÝI•Ð¡‘½ŒÔ¤ì(€€€±•ÐÙÀ€ô‘½ŒÔ¹‘•™…Õ±ÑY¥•Ü€˜˜‘½ŒÔ¹‘•™…Õ±ÑY¥•Ü¹Ù¥ÍÕ…±Y¥•ÝÁ½ÉÐì(€€€¥˜€¡ÙÀ¤(€€€€€É•ÑÕÉ¸ì(€€€€€€€±•™Ðè€À°(€€€€€€€É¥¡ÐèÙÀ¹Ý¥‘Ñ °(€€€€€€€Ñ½Àè€À°(€€€€€€€‰½ÑÑ½´èÙÀ¹¡•¥¡Ð(€€€€€ôì(€€€É•ÑÕÉ¸ì(€€€€€±•™Ðè€À°(€€€€€É¥¡Ðè‘½ŒÔ¹‘½Õµ•¹Ñ±•µ•¹Ð¹±¥•¹Ñ]¥‘Ñ °(€€€€€Ñ½Àè€À°(€€€€€‰½ÑÑ½´è‘½ŒÔ¹‘½Õµ•¹Ñ±•µ•¹Ð¹±¥•¹Ñ!•¥¡Ð(€€€ôì(€ô(€™Õ¹Ñ¥½¸•ÑM¥‘”¡Ù…±Õ”°Í¥‘”¤ì(€€€É•ÑÕÉ¸ÑåÁ•½˜Ù…±Õ”€ôô€‰¹Õµ‰•Èˆ€üÙ…±Õ”€èÙ…±Õ•mÍ¥‘•tì(€ô(€™Õ¹Ñ¥½¸±¥•¹ÑI•Ð¡¹½‘”¤ì(€€€±•ÐÉ•Ð€ô¹½‘”¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤ì(€€€±•ÐÍ…±•`€ôÉ•Ð¹Ý¥‘Ñ €¼¹½‘”¹½™™Í•Ñ]¥‘Ñ ñð€Äì(€€€±•ÐÍ…±•d€ôÉ•Ð¹¡•¥¡Ð€¼¹½‘”¹½™™Í•Ñ!•¥¡Ðñð€Äì(€€€É•ÑÕÉ¸ì(€€€€€±•™ÐèÉ•Ð¹±•™Ð°(€€€€€É¥¡ÐèÉ•Ð¹±•™Ð€¬¹½‘”¹±¥•¹Ñ]¥‘Ñ €¨Í…±•`°(€€€€€Ñ½ÀèÉ•Ð¹Ñ½À°(€€€€€‰½ÑÑ½´èÉ•Ð¹Ñ½À€¬¹½‘”¹±¥•¹Ñ!•¥¡Ð€¨Í…±•d(€€€ôì(€ô(€™Õ¹Ñ¥½¸ÍÉ½±±I•Ñ%¹Ñ½Y¥•Ü¡Ù¥•Ü°É•Ð°ÍÑ…ÉÑ=4¤ì(€€€¥˜€ …¹½¹i•É¼¡É•Ð¤€˜˜É•Ð¹±•™Ð€ôô€À¤(€€€€€É•ÑÕÉ¸ì(€€€±•ÐÍÉ½±±Q¡É•Í¡½±€ôÙ¥•Ü¹Í½µ•AÉ½À ‰ÍÉ½±±Q¡É•Í¡½±ˆ¤ñð€À°ÍÉ½±±5…É¥¸€ôÙ¥•Ü¹Í½µ•AÉ½À ‰ÍÉ½±±5…É¥¸ˆ¤ñð€Ôì(€€€±•Ð‘½ŒÔ€ôÙ¥•Ü¹‘½´¹½Ý¹•É½Õµ•¹Ðì(€€€™½È€¡±•ÐÁ…É•¹Ð€ôÍÑ…ÉÑ=4ñðÙ¥•Ü¹‘½´ì€ì€¤ì(€€€€€¥˜€ …Á…É•¹Ð¤(€€€€€€€‰É•…¬ì(€€€€€¥˜€ …¥Í±Ð¡Á…É•¹Ð¤¤ì(€€€€€€€Á…É•¹Ð€ôÁ…É•¹Ñ9½‘”¡Á…É•¹Ð¤ì(€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€ô(€€€€€±•Ð…ÑQ½À€ôÁ…É•¹Ð€ôô‘½ŒÔ¹‰½‘äì(€€€€€±•Ð‰½Õ¹‘¥¹œ€ô…ÑQ½À€üÝ¥¹‘½ÝI•Ð¡‘½ŒÔ¤€è±¥•¹ÑI•Ð¡Á…É•¹Ð¤ì(€€€€€±•Ðµ½Ù•`€ô€À°µ½Ù•d€ô€Àì(€€€€€¥˜€¡É•Ð¹Ñ½À€ð‰½Õ¹‘¥¹œ¹Ñ½À€¬•ÑM¥‘”¡ÍÉ½±±Q¡É•Í¡½±°€‰Ñ½Àˆ¤¤(€€€€€€€µ½Ù•d€ô€´¡‰½Õ¹‘¥¹œ¹Ñ½À€´É•Ð¹Ñ½À€¬•ÑM¥‘”¡ÍÉ½±±5…É¥¸°€‰Ñ½Àˆ¤¤ì(€€€€€•±Í”¥˜€¡É•Ð¹‰½ÑÑ½´€ø‰½Õ¹‘¥¹œ¹‰½ÑÑ½´€´•ÑM¥‘”¡ÍÉ½±±Q¡É•Í¡½±°€‰‰½ÑÑ½´ˆ¤¤(€€€€€€€µ½Ù•d€ôÉ•Ð¹‰½ÑÑ½´€´É•Ð¹Ñ½À€ø‰½Õ¹‘¥¹œ¹‰½ÑÑ½´€´‰½Õ¹‘¥¹œ¹Ñ½À€üÉ•Ð¹Ñ½À€¬•ÑM¥‘”¡ÍÉ½±±5…É¥¸°€‰Ñ½Àˆ¤€´‰½Õ¹‘¥¹œ¹Ñ½À€èÉ•Ð¹‰½ÑÑ½´€´‰½Õ¹‘¥¹œ¹‰½ÑÑ½´€¬•ÑM¥‘”¡ÍÉ½±±5…É¥¸°€‰‰½ÑÑ½´ˆ¤ì(€€€€€¥˜€¡É•Ð¹±•™Ð€ð‰½Õ¹‘¥¹œ¹±•™Ð€¬•ÑM¥‘”¡ÍÉ½±±Q¡É•Í¡½±°€‰±•™Ðˆ¤¤(€€€€€€€µ½Ù•`€ô€´¡‰½Õ¹‘¥¹œ¹±•™Ð€´É•Ð¹±•™Ð€¬•ÑM¥‘”¡ÍÉ½±±5…É¥¸°€‰±•™Ðˆ¤¤ì(€€€€€•±Í”¥˜€¡É•Ð¹É¥¡Ð€ø‰½Õ¹‘¥¹œ¹É¥¡Ð€´•ÑM¥‘”¡ÍÉ½±±Q¡É•Í¡½±°€‰É¥¡Ðˆ¤¤(€€€€€€€µ½Ù•`€ôÉ•Ð¹É¥¡Ð€´‰½Õ¹‘¥¹œ¹É¥¡Ð€¬•ÑM¥‘”¡ÍÉ½±±5…É¥¸°€‰É¥¡Ðˆ¤ì(€€€€€¥˜€¡µ½Ù•`ñðµ½Ù•d¤ì(€€€€€€€¥˜€¡…ÑQ½À¤ì(€€€€€€€€€‘½ŒÔ¹‘•™…Õ±ÑY¥•Ü¹ÍÉ½±±	ä¡µ½Ù•`°µ½Ù•d¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€±•ÐÍÑ…ÉÑ`€ôÁ…É•¹Ð¹ÍÉ½±±1•™Ð°ÍÑ…ÉÑd€ôÁ…É•¹Ð¹ÍÉ½±±Q½Àì(€€€€€€€€€¥˜€¡µ½Ù•d¤(€€€€€€€€€€€Á…É•¹Ð¹ÍÉ½±±Q½À€¬ôµ½Ù•dì(€€€€€€€€€¥˜€¡µ½Ù•`¤(€€€€€€€€€€€Á…É•¹Ð¹ÍÉ½±±1•™Ð€¬ôµ½Ù•`ì(€€€€€€€€€±•Ð‘`€ôÁ…É•¹Ð¹ÍÉ½±±1•™Ð€´ÍÑ…ÉÑ`°‘d€ôÁ…É•¹Ð¹ÍÉ½±±Q½À€´ÍÑ…ÉÑdì(€€€€€€€€€É•Ð€ôì±•™ÐèÉ•Ð¹±•™Ð€´‘`°Ñ½ÀèÉ•Ð¹Ñ½À€´‘d°É¥¡ÐèÉ•Ð¹É¥¡Ð€´‘`°‰½ÑÑ½´èÉ•Ð¹‰½ÑÑ½´€´‘dôì(€€€€€€€ô(€€€€€ô(€€€€€±•ÐÁ½Ì€ô…ÑQ½À€ü€‰™¥á•ˆ€è•Ñ½µÁÕÑ•‘MÑå±”¡Á…É•¹Ð¤¹Á½Í¥Ñ¥½¸ì(€€€€€¥˜€ ½x¡™¥á•‘ñÍÑ¥­ä¤¼¹Ñ•ÍÐ¡Á½Ì¤¤(€€€€€€€‰É•…¬ì(€€€€€Á…É•¹Ð€ôÁ½Ì€ôô€‰…‰Í½±ÕÑ”ˆ€üÁ…É•¹Ð¹½™™Í•ÑA…É•¹Ð€èÁ…É•¹Ñ9½‘”¡Á…É•¹Ð¤ì(€€€ô(€ô(€™Õ¹Ñ¥½¸ÍÑ½É•MÉ½±±A½Ì¡Ù¥•Ü¤ì(€€€±•ÐÉ•Ð€ôÙ¥•Ü¹‘½´¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤°ÍÑ…ÉÑd€ô5…Ñ ¹µ…à À°É•Ð¹Ñ½À¤ì(€€€±•ÐÉ•™=4°É•™Q½Àì(€€€™½È€¡±•Ðà€ô€¡É•Ð¹±•™Ð€¬É•Ð¹É¥¡Ð¤€¼€È°ä€ôÍÑ…ÉÑd€¬€Äìä€ð5…Ñ ¹µ¥¸¡¥¹¹•É!•¥¡Ð°É•Ð¹‰½ÑÑ½´¤ìä€¬ô€Ô¤ì(€€€€€±•Ð‘½´€ôÙ¥•Ü¹É½½Ð¹•±•µ•¹ÑÉ½µA½¥¹Ð¡à°ä¤ì(€€€€€¥˜€ …‘½´ñð‘½´€ôôÙ¥•Ü¹‘½´ñð€…Ù¥•Ü¹‘½´¹½¹Ñ…¥¹Ì¡‘½´¤¤(€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€±•Ð±½…±I•Ð€ô‘½´¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤ì(€€€€€¥˜€¡±½…±I•Ð¹Ñ½À€øôÍÑ…ÉÑd€´€ÈÀ¤ì(€€€€€€€É•™=4€ô‘½´ì(€€€€€€€É•™Q½À€ô±½…±I•Ð¹Ñ½Àì(€€€€€€€‰É•…¬ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸ìÉ•™=4°É•™Q½À°ÍÑ…¬èÍÉ½±±MÑ…¬¡Ù¥•Ü¹‘½´¤ôì(€ô(€™Õ¹Ñ¥½¸ÍÉ½±±MÑ…¬¡‘½´¤ì(€€€±•ÐÍÑ…¬€ômt°‘½ŒÔ€ô‘½´¹½Ý¹•É½Õµ•¹Ðì(€€€™½È€¡±•ÐÕÈ€ô‘½´ìÕÈìÕÈ€ôÁ…É•¹Ñ9½‘”¡ÕÈ¤¤ì(€€€€€ÍÑ…¬¹ÁÕÍ ¡ì‘½´èÕÈ°Ñ½ÀèÕÈ¹ÍÉ½±±Q½À°±•™ÐèÕÈ¹ÍÉ½±±1•™Ðô¤ì(€€€€€¥˜€¡‘½´€ôô‘½ŒÔ¤(€€€€€€€‰É•…¬ì(€€€ô(€€€É•ÑÕÉ¸ÍÑ…¬ì(€ô(€™Õ¹Ñ¥½¸É•Í•ÑMÉ½±±A½Ì¡ìÉ•™=4°É•™Q½À°ÍÑ…¬ô¤ì(€€€±•Ð¹•ÝI•™Q½À€ôÉ•™=4€üÉ•™=4¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤¹Ñ½À€è€Àì(€€€É•ÍÑ½É•MÉ½±±MÑ…¬¡ÍÑ…¬°¹•ÝI•™Q½À€ôô€À€ü€À€è¹•ÝI•™Q½À€´É•™Q½À¤ì(€ô(€™Õ¹Ñ¥½¸É•ÍÑ½É•MÉ½±±MÑ…¬¡ÍÑ…¬°‘Q½À¤ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðÍÑ…¬¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•Ðì‘½´°Ñ½À°±•™Ðô€ôÍÑ…­m¥tì(€€€€€¥˜€¡‘½´¹ÍÉ½±±Q½À€„ôÑ½À€¬‘Q½À¤(€€€€€€€‘½´¹ÍÉ½±±Q½À€ôÑ½À€¬‘Q½Àì(€€€€€¥˜€¡‘½´¹ÍÉ½±±1•™Ð€„ô±•™Ð¤(€€€€€€€‘½´¹ÍÉ½±±1•™Ð€ô±•™Ðì(€€€ô(€ô(€Ù…ÈÁÉ•Ù•¹ÑMÉ½±±MÕÁÁ½ÉÑ•€ô¹Õ±°ì(€™Õ¹Ñ¥½¸™½ÕÍAÉ•Ù•¹ÑMÉ½±°¡‘½´¤ì(€€€¥˜€¡‘½´¹Í•ÑÑ¥Ù”¤(€€€€€É•ÑÕÉ¸‘½´¹Í•ÑÑ¥Ù” ¤ì(€€€¥˜€¡ÁÉ•Ù•¹ÑMÉ½±±MÕÁÁ½ÉÑ•¤(€€€€€É•ÑÕÉ¸‘½´¹™½ÕÌ¡ÁÉ•Ù•¹ÑMÉ½±±MÕÁÁ½ÉÑ•¤ì(€€€±•ÐÍÑ½É•€ôÍÉ½±±MÑ…¬¡‘½´¤ì(€€€‘½´¹™½ÕÌ¡ÁÉ•Ù•¹ÑMÉ½±±MÕÁÁ½ÉÑ•€ôô¹Õ±°€üì(€€€€€•ÐÁÉ•Ù•¹ÑMÉ½±° ¤ì(€€€€€€€ÁÉ•Ù•¹ÑMÉ½±±MÕÁÁ½ÉÑ•€ôìÁÉ•Ù•¹ÑMÉ½±°èÑÉÕ”ôì(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô(€€€ô€èÙ½¥€À¤ì(€€€¥˜€ …ÁÉ•Ù•¹ÑMÉ½±±MÕÁÁ½ÉÑ•¤ì(€€€€€ÁÉ•Ù•¹ÑMÉ½±±MÕÁÁ½ÉÑ•€ô™…±Í”ì(€€€€€É•ÍÑ½É•MÉ½±±MÑ…¬¡ÍÑ½É•°€À¤ì(€€€ô(€ô(€™Õ¹Ñ¥½¸™¥¹‘=™™Í•Ñ%¹9½‘”¡¹½‘”°½½É‘Ì¤ì(€€€±•Ð±½Í•ÍÐì(€€€±•Ð‘á±½Í•ÍÐ€ô€É”à°½½É‘Í±½Í•ÍÐ°½™™Í•Ð€ô€Àì(€€€±•ÐÉ½Ý	½Ð€ô½½É‘Ì¹Ñ½À°É½ÝQ½À€ô½½É‘Ì¹Ñ½Àì(€€€±•Ð™¥ÉÍÑ	•±½Ü°½½É‘Í	•±½Üì(€€€™½È€¡±•Ð¡¥±€ô¹½‘”¹™¥ÉÍÑ¡¥±°¡¥±‘%¹‘•à€ô€Àì¡¥±ì¡¥±€ô¡¥±¹¹•áÑM¥‰±¥¹œ°¡¥±‘%¹‘•à¬¬¤ì(€€€€€±•ÐÉ•ÑÌì(€€€€€¥˜€¡¥Í±Ð¡¡¥±¤¤(€€€€€€€É•ÑÌ€ô¡¥±¹•Ñ±¥•¹ÑI•ÑÌ ¤ì(€€€€€•±Í”¥˜€¡¥ÍQ•áÐ¡¡¥±¤¤(€€€€€€€É•ÑÌ€ôÑ•áÑI…¹”¡¡¥±¤¹•Ñ±¥•¹ÑI•ÑÌ ¤ì(€€€€€•±Í”(€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÉ•ÑÌ¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•ÐÉ•Ð€ôÉ•ÑÍm¥tì(€€€€€€€¥˜€¡É•Ð¹Ñ½À€ðôÉ½Ý	½Ð€˜˜É•Ð¹‰½ÑÑ½´€øôÉ½ÝQ½À¤ì(€€€€€€€€€É½Ý	½Ð€ô5…Ñ ¹µ…à¡É•Ð¹‰½ÑÑ½´°É½Ý	½Ð¤ì(€€€€€€€€€É½ÝQ½À€ô5…Ñ ¹µ¥¸¡É•Ð¹Ñ½À°É½ÝQ½À¤ì(€€€€€€€€€±•Ð‘à€ôÉ•Ð¹±•™Ð€ø½½É‘Ì¹±•™Ð€üÉ•Ð¹±•™Ð€´½½É‘Ì¹±•™Ð€èÉ•Ð¹É¥¡Ð€ð½½É‘Ì¹±•™Ð€ü½½É‘Ì¹±•™Ð€´É•Ð¹É¥¡Ð€è€Àì(€€€€€€€€€¥˜€¡‘à€ð‘á±½Í•ÍÐ¤ì(€€€€€€€€€€€±½Í•ÍÐ€ô¡¥±ì(€€€€€€€€€€€‘á±½Í•ÍÐ€ô‘àì(€€€€€€€€€€€½½É‘Í±½Í•ÍÐ€ô‘à€˜˜¥ÍQ•áÐ¡±½Í•ÍÐ¤€üì(€€€€€€€€€€€€€±•™ÐèÉ•Ð¹É¥¡Ð€ð½½É‘Ì¹±•™Ð€üÉ•Ð¹É¥¡Ð€èÉ•Ð¹±•™Ð°(€€€€€€€€€€€€€Ñ½Àè½½É‘Ì¹Ñ½À(€€€€€€€€€€€ô€è½½É‘Ìì(€€€€€€€€€€€¥˜€¡¥Í±Ð¡¡¥±¤€˜˜‘à¤(€€€€€€€€€€€€€½™™Í•Ð€ô¡¥±‘%¹‘•à€¬€¡½½É‘Ì¹±•™Ð€øô€¡É•Ð¹±•™Ð€¬É•Ð¹É¥¡Ð¤€¼€È€ü€Ä€è€À¤ì(€€€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€€€ô(€€€€€€€ô•±Í”¥˜€¡É•Ð¹Ñ½À€ø½½É‘Ì¹Ñ½À€˜˜€…™¥ÉÍÑ	•±½Ü€˜˜É•Ð¹±•™Ð€ðô½½É‘Ì¹±•™Ð€˜˜É•Ð¹É¥¡Ð€øô½½É‘Ì¹±•™Ð¤ì(€€€€€€€€€™¥ÉÍÑ	•±½Ü€ô¡¥±ì(€€€€€€€€€½½É‘Í	•±½Ü€ôì±•™Ðè5…Ñ ¹µ…à¡É•Ð¹±•™Ð°5…Ñ ¹µ¥¸¡É•Ð¹É¥¡Ð°½½É‘Ì¹±•™Ð¤¤°Ñ½ÀèÉ•Ð¹Ñ½Àôì(€€€€€€€ô(€€€€€€€¥˜€ …±½Í•ÍÐ€˜˜€¡½½É‘Ì¹±•™Ð€øôÉ•Ð¹É¥¡Ð€˜˜½½É‘Ì¹Ñ½À€øôÉ•Ð¹Ñ½Àñð½½É‘Ì¹±•™Ð€øôÉ•Ð¹±•™Ð€˜˜½½É‘Ì¹Ñ½À€øôÉ•Ð¹‰½ÑÑ½´¤¤(€€€€€€€€€½™™Í•Ð€ô¡¥±‘%¹‘•à€¬€Äì(€€€€€ô(€€€ô(€€€¥˜€ …±½Í•ÍÐ€˜˜™¥ÉÍÑ	•±½Ü¤ì(€€€€€±½Í•ÍÐ€ô™¥ÉÍÑ	•±½Üì(€€€€€½½É‘Í±½Í•ÍÐ€ô½½É‘Í	•±½Üì(€€€€€‘á±½Í•ÍÐ€ô€Àì(€€€ô(€€€¥˜€¡±½Í•ÍÐ€˜˜¥ÍQ•áÐ¡±½Í•ÍÐ¤¤(€€€€€É•ÑÕÉ¸™¥¹‘=™™Í•Ñ%¹Q•áÐ¡±½Í•ÍÐ°½½É‘Í±½Í•ÍÐ¤ì(€€€¥˜€ …±½Í•ÍÐñð‘á±½Í•ÍÐ¤(€€€€€É•ÑÕÉ¸ì¹½‘”°½™™Í•Ðôì(€€€É•ÑÕÉ¸™¥¹‘=™™Í•Ñ%¹9½‘”¡±½Í•ÍÐ°½½É‘Í±½Í•ÍÐ¤ì(€ô(€™Õ¹Ñ¥½¸™¥¹‘=™™Í•Ñ%¹Q•áÐ¡¹½‘”°½½É‘Ì¤ì(€€€±•Ð±•¸€ô¹½‘”¹¹½‘•Y…±Õ”¹±•¹Ñ ì(€€€±•ÐÉ…¹”€ô‘½Õµ•¹Ð¹É•…Ñ•I…¹” ¤°É•ÍÕ±Ðì(€€€™½È€¡±•Ð¤€ô€Àì¤€ð±•¸ì¤¬¬¤ì(€€€€€É…¹”¹Í•Ñ¹¡¹½‘”°¤€¬€Ä¤ì(€€€€€É…¹”¹Í•ÑMÑ…ÉÐ¡¹½‘”°¤¤ì(€€€€€±•ÐÉ•Ð€ôÍ¥¹±•I•Ð¡É…¹”°€Ä¤ì(€€€€€¥˜€¡É•Ð¹Ñ½À€ôôÉ•Ð¹‰½ÑÑ½´¤(€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€¥˜€¡¥¹I•Ð¡½½É‘Ì°É•Ð¤¤ì(€€€€€€€É•ÍÕ±Ð€ôì¹½‘”°½™™Í•Ðè¤€¬€¡½½É‘Ì¹±•™Ð€øô€¡É•Ð¹±•™Ð€¬É•Ð¹É¥¡Ð¤€¼€È€ü€Ä€è€À¤ôì(€€€€€€€‰É•…¬ì(€€€€€ô(€€€ô(€€€É…¹”¹‘•Ñ…  ¤ì(€€€É•ÑÕÉ¸É•ÍÕ±Ðñðì¹½‘”°½™™Í•Ðè€Àôì(€ô(€™Õ¹Ñ¥½¸¥¹I•Ð¡½½É‘Ì°É•Ð¤ì(€€€É•ÑÕÉ¸½½É‘Ì¹±•™Ð€øôÉ•Ð¹±•™Ð€´€Ä€˜˜½½É‘Ì¹±•™Ð€ðôÉ•Ð¹É¥¡Ð€¬€Ä€˜˜½½É‘Ì¹Ñ½À€øôÉ•Ð¹Ñ½À€´€Ä€˜˜½½É‘Ì¹Ñ½À€ðôÉ•Ð¹‰½ÑÑ½´€¬€Äì(€ô(€™Õ¹Ñ¥½¸Ñ…É•Ñ-±Õ‘”¡‘½´°½½É‘Ì¤ì(€€€±•ÐÁ…É•¹Ð€ô‘½´¹Á…É•¹Ñ9½‘”ì(€€€¥˜€¡Á…É•¹Ð€˜˜€½y±¤½¤¹Ñ•ÍÐ¡Á…É•¹Ð¹¹½‘•9…µ”¤€˜˜½½É‘Ì¹±•™Ð€ð‘½´¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤¹±•™Ð¤(€€€€€É•ÑÕÉ¸Á…É•¹Ðì(€€€É•ÑÕÉ¸‘½´ì(€ô(€™Õ¹Ñ¥½¸Á½ÍÉ½µ±•µ•¹Ð¡Ù¥•Ü°•±Ð°½½É‘Ì¤ì(€€€±•Ðì¹½‘”°½™™Í•Ðô€ô™¥¹‘=™™Í•Ñ%¹9½‘”¡•±Ð°½½É‘Ì¤°‰¥…Ì€ô€´Äì(€€€¥˜€¡¥Í±Ð¡¹½‘”¤€˜˜€…¹½‘”¹™¥ÉÍÑ¡¥±¤ì(€€€€€±•ÐÉ•Ð€ô¹½‘”¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤ì(€€€€€‰¥…Ì€ôÉ•Ð¹±•™Ð€„ôÉ•Ð¹É¥¡Ð€˜˜½½É‘Ì¹±•™Ð€ø€¡É•Ð¹±•™Ð€¬É•Ð¹É¥¡Ð¤€¼€È€ü€Ä€è€´Äì(€€€ô(€€€É•ÑÕÉ¸Ù¥•Ü¹‘½Y¥•Ü¹Á½ÍÉ½µ=4¡¹½‘”°½™™Í•Ð°‰¥…Ì¤ì(€ô(€™Õ¹Ñ¥½¸Á½ÍÉ½µ…É•Ð¡Ù¥•Ü°¹½‘”°½™™Í•Ð°½½É‘Ì¤ì(€€€±•Ð½ÕÑÍ¥‘•	±½¬€ô€´Äì(€€€™½È€¡±•ÐÕÈ€ô¹½‘”°Í…Ý	±½¬€ô™…±Í”ì€ì€¤ì(€€€€€¥˜€¡ÕÈ€ôôÙ¥•Ü¹‘½´¤(€€€€€€€‰É•…¬ì(€€€€€±•Ð‘•ÍŒ€ôÙ¥•Ü¹‘½Y¥•Ü¹¹•…É•ÍÑ•ÍŒ¡ÕÈ°ÑÉÕ”¤°É•Ðì(€€€€€¥˜€ …‘•ÍŒ¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€¥˜€¡¥Í±Ð¡‘•ÍŒ¹‘½´¤€˜˜€¡‘•ÍŒ¹¹½‘”¹¥Í	±½¬€˜˜‘•ÍŒ¹Á…É•¹Ðñð€…‘•ÍŒ¹½¹Ñ•¹Ñ=4¤€˜˜€¼¼%¹½É”•±•µ•¹ÑÌÝ¥Ñ é•É¼µÍ¥é”‰½Õ¹‘¥¹œÉ•Ñ…¹±•Ì(€€€€€€ ¡É•Ð€ô‘•ÍŒ¹‘½´¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤¤¹Ý¥‘Ñ ñðÉ•Ð¹¡•¥¡Ð¤¤ì(€€€€€€€¥˜€¡‘•ÍŒ¹¹½‘”¹¥Í	±½¬€˜˜‘•ÍŒ¹Á…É•¹Ð€˜˜€„½yP¡Iñ	=eñ!ñ==P¤¼¹Ñ•ÍÐ¡‘•ÍŒ¹‘½´¹¹½‘•9…µ”¤¤ì(€€€€€€€€€¥˜€ …Í…Ý	±½¬€˜˜É•Ð¹±•™Ð€ø½½É‘Ì¹±•™ÐñðÉ•Ð¹Ñ½À€ø½½É‘Ì¹Ñ½À¤(€€€€€€€€€€€½ÕÑÍ¥‘•	±½¬€ô‘•ÍŒ¹Á½Í	•™½É”ì(€€€€€€€€€•±Í”¥˜€ …Í…Ý	±½¬€˜˜É•Ð¹É¥¡Ð€ð½½É‘Ì¹±•™ÐñðÉ•Ð¹‰½ÑÑ½´€ð½½É‘Ì¹Ñ½À¤(€€€€€€€€€€€½ÕÑÍ¥‘•	±½¬€ô‘•ÍŒ¹Á½Í™Ñ•Èì(€€€€€€€€€Í…Ý	±½¬€ôÑÉÕ”ì(€€€€€€€ô(€€€€€€€¥˜€ …‘•ÍŒ¹½¹Ñ•¹Ñ=4€˜˜½ÕÑÍ¥‘•	±½¬€ð€À€˜˜€…‘•ÍŒ¹¹½‘”¹¥ÍQ•áÐ¤ì(€€€€€€€€€±•Ð‰•™½É”€ô‘•ÍŒ¹¹½‘”¹¥Í	±½¬€ü½½É‘Ì¹Ñ½À€ð€¡É•Ð¹Ñ½À€¬É•Ð¹‰½ÑÑ½´¤€¼€È€è½½É‘Ì¹±•™Ð€ð€¡É•Ð¹±•™Ð€¬É•Ð¹É¥¡Ð¤€¼€Èì(€€€€€€€€€É•ÑÕÉ¸‰•™½É”€ü‘•ÍŒ¹Á½Í	•™½É”€è‘•ÍŒ¹Á½Í™Ñ•Èì(€€€€€€€ô(€€€€€ô(€€€€€ÕÈ€ô‘•ÍŒ¹‘½´¹Á…É•¹Ñ9½‘”ì(€€€ô(€€€É•ÑÕÉ¸½ÕÑÍ¥‘•	±½¬€ø€´Ä€ü½ÕÑÍ¥‘•	±½¬€èÙ¥•Ü¹‘½Y¥•Ü¹Á½ÍÉ½µ=4¡¹½‘”°½™™Í•Ð°€´Ä¤ì(€ô(€™Õ¹Ñ¥½¸•±•µ•¹ÑÉ½µA½¥¹Ð¡•±•µ•¹ÐÈ°½½É‘Ì°‰½à¤ì(€€€±•Ð±•¸€ô•±•µ•¹ÐÈ¹¡¥±‘9½‘•Ì¹±•¹Ñ ì(€€€¥˜€¡±•¸€˜˜‰½à¹Ñ½À€ð‰½à¹‰½ÑÑ½´¤ì(€€€€€™½È€¡±•ÐÍÑ…ÉÑ$€ô5…Ñ ¹µ…à À°5…Ñ ¹µ¥¸¡±•¸€´€Ä°5…Ñ ¹™±½½È¡±•¸€¨€¡½½É‘Ì¹Ñ½À€´‰½à¹Ñ½À¤€¼€¡‰½à¹‰½ÑÑ½´€´‰½à¹Ñ½À¤¤€´€È¤¤°¤€ôÍÑ…ÉÑ$ì€ì€¤ì(€€€€€€€±•Ð¡¥±€ô•±•µ•¹ÐÈ¹¡¥±‘9½‘•Ím¥tì(€€€€€€€¥˜€¡¥Í±Ð¡¡¥±¤¤ì(€€€€€€€€€±•ÐÉ•ÑÌ€ô¡¥±¹•Ñ±¥•¹ÑI•ÑÌ ¤ì(€€€€€€€€€™½È€¡±•Ð¨€ô€Àì¨€ðÉ•ÑÌ¹±•¹Ñ ì¨¬¬¤ì(€€€€€€€€€€€±•ÐÉ•Ð€ôÉ•ÑÍm©tì(€€€€€€€€€€€¥˜€¡¥¹I•Ð¡½½É‘Ì°É•Ð¤¤(€€€€€€€€€€€€€É•ÑÕÉ¸•±•µ•¹ÑÉ½µA½¥¹Ð¡¡¥±°½½É‘Ì°É•Ð¤ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€¥˜€ ¡¤€ô€¡¤€¬€Ä¤€”±•¸¤€ôôÍÑ…ÉÑ$¤(€€€€€€€€€‰É•…¬ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸•±•µ•¹ÐÈì(€ô(€™Õ¹Ñ¥½¸Á½ÍÑ½½É‘Ì¡Ù¥•Ü°½½É‘Ì¤ì(€€€±•Ð‘½ŒÔ€ôÙ¥•Ü¹‘½´¹½Ý¹•É½Õµ•¹Ð°¹½‘”°½™™Í•Ð€ô€Àì(€€€±•Ð…É•Ð€ô…É•ÑÉ½µA½¥¹Ð¡‘½ŒÔ°½½É‘Ì¹±•™Ð°½½É‘Ì¹Ñ½À¤ì(€€€¥˜€¡…É•Ð¤(€€€€€€¡ì¹½‘”°½™™Í•Ðô€ô…É•Ð¤ì(€€€±•Ð•±Ð€ô€¡Ù¥•Ü¹É½½Ð¹•±•µ•¹ÑÉ½µA½¥¹Ð€üÙ¥•Ü¹É½½Ð€è‘½ŒÔ¤¹•±•µ•¹ÑÉ½µA½¥¹Ð¡½½É‘Ì¹±•™Ð°½½É‘Ì¹Ñ½À¤ì(€€€±•ÐÁ½Ìì(€€€¥˜€ …•±Ðñð€…Ù¥•Ü¹‘½´¹½¹Ñ…¥¹Ì¡•±Ð¤¤ì(€€€€€±•Ð‰½à€ôÙ¥•Ü¹‘½´¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤ì(€€€€€¥˜€ …¥¹I•Ð¡½½É‘Ì°‰½à¤¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€•±Ð€ô•±•µ•¹ÑÉ½µA½¥¹Ð¡Ù¥•Ü¹‘½´°½½É‘Ì°‰½à¤ì(€€€€€¥˜€ …•±Ð¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€ô(€€€¥˜€¡Í…™…É¤¤ì(€€€€€™½È€¡±•ÐÀ€ô•±Ðì¹½‘”€˜˜ÀìÀ€ôÁ…É•¹Ñ9½‘”¡À¤¤(€€€€€€€¥˜€¡À¹‘É……‰±”¤(€€€€€€€€€¹½‘”€ôÙ½¥€Àì(€€€ô(€€€•±Ð€ôÑ…É•Ñ-±Õ‘”¡•±Ð°½½É‘Ì¤ì(€€€¥˜€¡¹½‘”¤ì(€€€€€¥˜€¡•­¼€˜˜¥Í±Ð¡¹½‘”¤¤ì(€€€€€€€½™™Í•Ð€ô5…Ñ ¹µ¥¸¡½™™Í•Ð°¹½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ ¤ì(€€€€€€€¥˜€¡½™™Í•Ð€ð¹½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ ¤ì(€€€€€€€€€±•Ð¹•áÐ€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ñt°‰½àì(€€€€€€€€€¥˜€¡¹•áÐ¹¹½‘•9…µ”€ôô€‰%5ˆ€˜˜€¡‰½à€ô¹•áÐ¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤¤¹É¥¡Ð€ðô½½É‘Ì¹±•™Ð€˜˜‰½à¹‰½ÑÑ½´€ø½½É‘Ì¹Ñ½À¤(€€€€€€€€€€€½™™Í•Ð¬¬ì(€€€€€€€ô(€€€€€ô(€€€€€±•ÐÁÉ•Øì(€€€€€¥˜€¡Ý•‰­¥Ð€˜˜½™™Í•Ð€˜˜¥Í±Ð¡¹½‘”¤€˜˜¥Í±Ð¡ÁÉ•Ø€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ð€´€Åt¤€˜˜ÁÉ•Ø¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ€˜˜ÁÉ•Ø¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤¹Ñ½À€øô½½É‘Ì¹Ñ½À¤(€€€€€€€½™™Í•Ð´´ì(€€€€€¥˜€¡¹½‘”€ôôÙ¥•Ü¹‘½´€˜˜½™™Í•Ð€ôô¹½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ €´€Ä€˜˜¥Í±Ð¡¹½‘”¹±…ÍÑ¡¥±¤€˜˜½½É‘Ì¹Ñ½À€ø¹½‘”¹±…ÍÑ¡¥±¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤¹‰½ÑÑ½´¤(€€€€€€€Á½Ì€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”ì(€€€€€•±Í”¥˜€¡½™™Í•Ð€ôô€Àñð€…¥Í±Ð¡¹½‘”¤ñð¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ð€´€Åt¹¹½‘•9…µ”€„ô€‰	Hˆ¤(€€€€€€€Á½Ì€ôÁ½ÍÉ½µ…É•Ð¡Ù¥•Ü°¹½‘”°½™™Í•Ð°½½É‘Ì¤ì(€€€ô(€€€¥˜€¡Á½Ì€ôô¹Õ±°¤(€€€€€Á½Ì€ôÁ½ÍÉ½µ±•µ•¹Ð¡Ù¥•Ü°•±Ð°½½É‘Ì¤ì(€€€±•Ð‘•ÍŒ€ôÙ¥•Ü¹‘½Y¥•Ü¹¹•…É•ÍÑ•ÍŒ¡•±Ð°ÑÉÕ”¤ì(€€€É•ÑÕÉ¸ìÁ½Ì°¥¹Í¥‘”è‘•ÍŒ€ü‘•ÍŒ¹Á½ÍÑMÑ…ÉÐ€´‘•ÍŒ¹‰½É‘•È€è€´Äôì(€ô(€™Õ¹Ñ¥½¸¹½¹i•É¼¡É•Ð¤ì(€€€É•ÑÕÉ¸É•Ð¹Ñ½À€ðÉ•Ð¹‰½ÑÑ½´ñðÉ•Ð¹±•™Ð€ðÉ•Ð¹É¥¡Ðì(€ô(€™Õ¹Ñ¥½¸Í¥¹±•I•Ð¡Ñ…É•Ð°‰¥…Ì¤ì(€€€±•ÐÉ•ÑÌ€ôÑ…É•Ð¹•Ñ±¥•¹ÑI•ÑÌ ¤ì(€€€¥˜€¡É•ÑÌ¹±•¹Ñ ¤ì(€€€€€±•Ð™¥ÉÍÐ€ôÉ•ÑÍm‰¥…Ì€ð€À€ü€À€èÉ•ÑÌ¹±•¹Ñ €´€Åtì(€€€€€¥˜€¡¹½¹i•É¼¡™¥ÉÍÐ¤¤(€€€€€€€É•ÑÕÉ¸™¥ÉÍÐì(€€€ô(€€€É•ÑÕÉ¸ÉÉ…ä¹ÁÉ½Ñ½ÑåÁ”¹™¥¹¹…±°¡É•ÑÌ°¹½¹i•É¼¤ñðÑ…É•Ð¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤ì(€ô(€Ù…È	%$€ô€½mqÔÀÔäÀµqÔÀÕ˜ÑqÔÀØÀÀµqÔÀÙ™™qÔÀÜÀÀµqÔÀá…t¼ì(€™Õ¹Ñ¥½¸½½É‘ÍÑA½Ì¡Ù¥•Ü°Á½Ì°Í¥‘”¤ì(€€€±•Ðì¹½‘”°½™™Í•Ð°…Ñ½´ô€ôÙ¥•Ü¹‘½Y¥•Ü¹‘½µÉ½µA½Ì¡Á½Ì°Í¥‘”€ð€À€ü€´Ä€è€Ä¤ì(€€€±•ÐÍÕÁÁ½ÉÑµÁÑåI…¹”€ôÝ•‰­¥Ðñð•­¼ì(€€€¥˜€¡¥ÍQ•áÐ¡¹½‘”¤¤ì(€€€€€¥˜€¡ÍÕÁÁ½ÉÑµÁÑåI…¹”€˜˜€¡	%$¹Ñ•ÍÐ¡¹½‘”¹¹½‘•Y…±Õ”¤ñð€¡Í¥‘”€ð€À€ü€…½™™Í•Ð€è½™™Í•Ð€ôô¹½‘”¹¹½‘•Y…±Õ”¹±•¹Ñ ¤¤¤ì(€€€€€€€±•ÐÉ•Ð€ôÍ¥¹±•I•Ð¡Ñ•áÑI…¹”¡¹½‘”°½™™Í•Ð°½™™Í•Ð¤°Í¥‘”¤ì(€€€€€€€¥˜€¡•­¼€˜˜½™™Í•Ð€˜˜€½qÌ¼¹Ñ•ÍÐ¡¹½‘”¹¹½‘•Y…±Õ•m½™™Í•Ð€´€Åt¤€˜˜½™™Í•Ð€ð¹½‘”¹¹½‘•Y…±Õ”¹±•¹Ñ ¤ì(€€€€€€€€€±•ÐÉ•Ñ	•™½É”€ôÍ¥¹±•I•Ð¡Ñ•áÑI…¹”¡¹½‘”°½™™Í•Ð€´€Ä°½™™Í•Ð€´€Ä¤°€´Ä¤ì(€€€€€€€€€¥˜€¡É•Ñ	•™½É”¹Ñ½À€ôôÉ•Ð¹Ñ½À¤ì(€€€€€€€€€€€±•ÐÉ•Ñ™Ñ•È€ôÍ¥¹±•I•Ð¡Ñ•áÑI…¹”¡¹½‘”°½™™Í•Ð°½™™Í•Ð€¬€Ä¤°€´Ä¤ì(€€€€€€€€€€€¥˜€¡É•Ñ™Ñ•È¹Ñ½À€„ôÉ•Ð¹Ñ½À¤(€€€€€€€€€€€€€É•ÑÕÉ¸™±…ÑÑ•¹X¡É•Ñ™Ñ•È°É•Ñ™Ñ•È¹±•™Ð€ðÉ•Ñ	•™½É”¹±•™Ð¤ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸É•Ðì(€€€€€ô•±Í”ì(€€€€€€€±•Ð™É½´È€ô½™™Í•Ð°Ñ¼€ô½™™Í•Ð°Ñ…­•M¥‘”€ôÍ¥‘”€ð€À€ü€Ä€è€´Äì(€€€€€€€¥˜€¡Í¥‘”€ð€À€˜˜€…½™™Í•Ð¤ì(€€€€€€€€€Ñ¼¬¬ì(€€€€€€€€€Ñ…­•M¥‘”€ô€´Äì(€€€€€€€ô•±Í”¥˜€¡Í¥‘”€øô€À€˜˜½™™Í•Ð€ôô¹½‘”¹¹½‘•Y…±Õ”¹±•¹Ñ ¤ì(€€€€€€€€€™É½´È´´ì(€€€€€€€€€Ñ…­•M¥‘”€ô€Äì(€€€€€€€ô•±Í”¥˜€¡Í¥‘”€ð€À¤ì(€€€€€€€€€™É½´È´´ì(€€€€€€€ô•±Í”ì(€€€€€€€€€Ñ¼¬¬ì(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸™±…ÑÑ•¹X¡Í¥¹±•I•Ð¡Ñ•áÑI…¹”¡¹½‘”°™É½´È°Ñ¼¤°Ñ…­•M¥‘”¤°Ñ…­•M¥‘”€ð€À¤ì(€€€€€ô(€€€ô(€€€±•Ð€‘‘½´€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡Á½Ì€´€¡…Ñ½´ñð€À¤¤ì(€€€¥˜€ „‘‘½´¹Á…É•¹Ð¹¥¹±¥¹•½¹Ñ•¹Ð¤ì(€€€€€¥˜€¡…Ñ½´€ôô¹Õ±°€˜˜½™™Í•Ð€˜˜€¡Í¥‘”€ð€Àñð½™™Í•Ð€ôô¹½‘•M¥é”¡¹½‘”¤¤¤ì(€€€€€€€±•Ð‰•™½É”€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ð€´€Åtì(€€€€€€€¥˜€¡¥Í±Ð¡‰•™½É”¤¤(€€€€€€€€€É•ÑÕÉ¸™±…ÑÑ•¹ ¡‰•™½É”¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤°™…±Í”¤ì(€€€€€ô(€€€€€¥˜€¡…Ñ½´€ôô¹Õ±°€˜˜½™™Í•Ð€ð¹½‘•M¥é”¡¹½‘”¤¤ì(€€€€€€€±•Ð…™Ñ•È€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ñtì(€€€€€€€¥˜€¡¥Í±Ð¡…™Ñ•È¤¤(€€€€€€€€€É•ÑÕÉ¸™±…ÑÑ•¹ ¡…™Ñ•È¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤°ÑÉÕ”¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸™±…ÑÑ•¹ ¡¹½‘”¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤°Í¥‘”€øô€À¤ì(€€€ô(€€€¥˜€¡…Ñ½´€ôô¹Õ±°€˜˜½™™Í•Ð€˜˜€¡Í¥‘”€ð€Àñð½™™Í•Ð€ôô¹½‘•M¥é”¡¹½‘”¤¤¤ì(€€€€€±•Ð‰•™½É”€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ð€´€Åtì(€€€€€±•ÐÑ…É•Ð€ô¥ÍQ•áÐ¡‰•™½É”¤€üÑ•áÑI…¹”¡‰•™½É”°¹½‘•M¥é”¡‰•™½É”¤€´€¡ÍÕÁÁ½ÉÑµÁÑåI…¹”€ü€À€è€Ä¤¤€è¥Í±Ð¡‰•™½É”¤€˜˜€¡‰•™½É”¹¹½‘•9…µ”€„ô€‰	Hˆñð€…‰•™½É”¹¹•áÑM¥‰±¥¹œ¤€ü‰•™½É”€è¹Õ±°ì(€€€€€¥˜€¡Ñ…É•Ð¤(€€€€€€€É•ÑÕÉ¸™±…ÑÑ•¹X¡Í¥¹±•I•Ð¡Ñ…É•Ð°€Ä¤°™…±Í”¤ì(€€€ô(€€€¥˜€¡…Ñ½´€ôô¹Õ±°€˜˜½™™Í•Ð€ð¹½‘•M¥é”¡¹½‘”¤¤ì(€€€€€±•Ð…™Ñ•È€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ñtì(€€€€€Ý¡¥±”€¡…™Ñ•È¹ÁµY¥•Ý•ÍŒ€˜˜…™Ñ•È¹ÁµY¥•Ý•ÍŒ¹¥¹½É•½É½½É‘Ì¤(€€€€€€€…™Ñ•È€ô…™Ñ•È¹¹•áÑM¥‰±¥¹œì(€€€€€±•ÐÑ…É•Ð€ô€……™Ñ•È€ü¹Õ±°€è¥ÍQ•áÐ¡…™Ñ•È¤€üÑ•áÑI…¹”¡…™Ñ•È°€À°ÍÕÁÁ½ÉÑµÁÑåI…¹”€ü€À€è€Ä¤€è¥Í±Ð¡…™Ñ•È¤€ü…™Ñ•È€è¹Õ±°ì(€€€€€¥˜€¡Ñ…É•Ð¤(€€€€€€€É•ÑÕÉ¸™±…ÑÑ•¹X¡Í¥¹±•I•Ð¡Ñ…É•Ð°€´Ä¤°ÑÉÕ”¤ì(€€€ô(€€€É•ÑÕÉ¸™±…ÑÑ•¹X¡Í¥¹±•I•Ð¡¥ÍQ•áÐ¡¹½‘”¤€üÑ•áÑI…¹”¡¹½‘”¤€è¹½‘”°€µÍ¥‘”¤°Í¥‘”€øô€À¤ì(€ô(€™Õ¹Ñ¥½¸™±…ÑÑ•¹X¡É•Ð°±•™Ð¤ì(€€€¥˜€¡É•Ð¹Ý¥‘Ñ €ôô€À¤(€€€€€É•ÑÕÉ¸É•Ðì(€€€±•Ðà€ô±•™Ð€üÉ•Ð¹±•™Ð€èÉ•Ð¹É¥¡Ðì(€€€É•ÑÕÉ¸ìÑ½ÀèÉ•Ð¹Ñ½À°‰½ÑÑ½´èÉ•Ð¹‰½ÑÑ½´°±•™Ðèà°É¥¡Ðèàôì(€ô(€™Õ¹Ñ¥½¸™±…ÑÑ•¹ ¡É•Ð°Ñ½À¤ì(€€€¥˜€¡É•Ð¹¡•¥¡Ð€ôô€À¤(€€€€€É•ÑÕÉ¸É•Ðì(€€€±•Ðä€ôÑ½À€üÉ•Ð¹Ñ½À€èÉ•Ð¹‰½ÑÑ½´ì(€€€É•ÑÕÉ¸ìÑ½Àèä°‰½ÑÑ½´èä°±•™ÐèÉ•Ð¹±•™Ð°É¥¡ÐèÉ•Ð¹É¥¡Ðôì(€ô(€™Õ¹Ñ¥½¸Ý¥Ñ¡±ÕÍ¡•‘MÑ…Ñ”¡Ù¥•Ü°ÍÑ…Ñ”°˜¤ì(€€€±•ÐÙ¥•ÝMÑ…Ñ”€ôÙ¥•Ü¹ÍÑ…Ñ”°…Ñ¥Ù”€ôÙ¥•Ü¹É½½Ð¹…Ñ¥Ù•±•µ•¹Ðì(€€€¥˜€¡Ù¥•ÝMÑ…Ñ”€„ôÍÑ…Ñ”¤(€€€€€Ù¥•Ü¹ÕÁ‘…Ñ•MÑ…Ñ”¡ÍÑ…Ñ”¤ì(€€€¥˜€¡…Ñ¥Ù”€„ôÙ¥•Ü¹‘½´¤(€€€€€Ù¥•Ü¹™½ÕÌ ¤ì(€€€ÑÉäì(€€€€€É•ÑÕÉ¸˜ ¤ì(€€€ô™¥¹…±±äì(€€€€€¥˜€¡Ù¥•ÝMÑ…Ñ”€„ôÍÑ…Ñ”¤(€€€€€€€Ù¥•Ü¹ÕÁ‘…Ñ•MÑ…Ñ”¡Ù¥•ÝMÑ…Ñ”¤ì(€€€€€¥˜€¡…Ñ¥Ù”€„ôÙ¥•Ü¹‘½´€˜˜…Ñ¥Ù”¤(€€€€€€€…Ñ¥Ù”¹™½ÕÌ ¤ì(€€€ô(€ô(€™Õ¹Ñ¥½¸•¹‘=™Q•áÑ‰±½­Y•ÉÑ¥…°¡Ù¥•Ü°ÍÑ…Ñ”°‘¥È¤ì(€€€±•ÐÍ•°€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€±•Ð€‘Á½Ì€ô‘¥È€ôô€‰ÕÀˆ€üÍ•°¸‘™É½´€èÍ•°¸‘Ñ¼ì(€€€É•ÑÕÉ¸Ý¥Ñ¡±ÕÍ¡•‘MÑ…Ñ”¡Ù¥•Ü°ÍÑ…Ñ”°€ ¤€ôøì(€€€€€±•Ðì¹½‘”è‘½´ô€ôÙ¥•Ü¹‘½Y¥•Ü¹‘½µÉ½µA½Ì ‘Á½Ì¹Á½Ì°‘¥È€ôô€‰ÕÀˆ€ü€´Ä€è€Ä¤ì(€€€€€™½È€ ì€ì€¤ì(€€€€€€€±•Ð¹•…É•ÍÐ€ôÙ¥•Ü¹‘½Y¥•Ü¹¹•…É•ÍÑ•ÍŒ¡‘½´°ÑÉÕ”¤ì(€€€€€€€¥˜€ …¹•…É•ÍÐ¤(€€€€€€€€€‰É•…¬ì(€€€€€€€¥˜€¡¹•…É•ÍÐ¹¹½‘”¹¥Í	±½¬¤ì(€€€€€€€€€‘½´€ô¹•…É•ÍÐ¹½¹Ñ•¹Ñ=4ñð¹•…É•ÍÐ¹‘½´ì(€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€€€‘½´€ô¹•…É•ÍÐ¹‘½´¹Á…É•¹Ñ9½‘”ì(€€€€€ô(€€€€€±•Ð½½É‘Ì€ô½½É‘ÍÑA½Ì¡Ù¥•Ü°€‘Á½Ì¹Á½Ì°€Ä¤ì(€€€€€™½È€¡±•Ð¡¥±€ô‘½´¹™¥ÉÍÑ¡¥±ì¡¥±ì¡¥±€ô¡¥±¹¹•áÑM¥‰±¥¹œ¤ì(€€€€€€€±•Ð‰½á•Ìì(€€€€€€€¥˜€¡¥Í±Ð¡¡¥±¤¤(€€€€€€€€€‰½á•Ì€ô¡¥±¹•Ñ±¥•¹ÑI•ÑÌ ¤ì(€€€€€€€•±Í”¥˜€¡¥ÍQ•áÐ¡¡¥±¤¤(€€€€€€€€€‰½á•Ì€ôÑ•áÑI…¹”¡¡¥±°€À°¡¥±¹¹½‘•Y…±Õ”¹±•¹Ñ ¤¹•Ñ±¥•¹ÑI•ÑÌ ¤ì(€€€€€€€•±Í”(€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð‰½á•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€±•Ð‰½à€ô‰½á•Ím¥tì(€€€€€€€€€¥˜€¡‰½à¹‰½ÑÑ½´€ø‰½à¹Ñ½À€¬€Ä€˜˜€¡‘¥È€ôô€‰ÕÀˆ€ü½½É‘Ì¹Ñ½À€´‰½à¹Ñ½À€ø€¡‰½à¹‰½ÑÑ½´€´½½É‘Ì¹Ñ½À¤€¨€È€è‰½à¹‰½ÑÑ½´€´½½É‘Ì¹‰½ÑÑ½´€ø€¡½½É‘Ì¹‰½ÑÑ½´€´‰½à¹Ñ½À¤€¨€È¤¤(€€€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€ô(€€€€€ô(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô¤ì(€ô(€Ù…Èµ…å‰•IQ0€ô€½mqÔÀÔäÀµqÔÀá…t¼ì(€™Õ¹Ñ¥½¸•¹‘=™Q•áÑ‰±½­!½É¥é½¹Ñ…°¡Ù¥•Ü°ÍÑ…Ñ”°‘¥È¤ì(€€€±•Ðì€‘¡•…ô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€¥˜€ „‘¡•…¹Á…É•¹Ð¹¥ÍQ•áÑ‰±½¬¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ð½™™Í•Ð€ô€‘¡•…¹Á…É•¹Ñ=™™Í•Ð°…ÑMÑ…ÉÐ€ô€…½™™Í•Ð°…Ñ¹€ô½™™Í•Ð€ôô€‘¡•…¹Á…É•¹Ð¹½¹Ñ•¹Ð¹Í¥é”ì(€€€±•ÐÍ•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¸ ¤ì(€€€¥˜€ …Í•°¤(€€€€€É•ÑÕÉ¸€‘¡•…¹Á½Ì€ôô€‘¡•…¹ÍÑ…ÉÐ ¤ñð€‘¡•…¹Á½Ì€ôô€‘¡•…¹•¹ ¤ì(€€€¥˜€ …µ…å‰•IQ0¹Ñ•ÍÐ ‘¡•…¹Á…É•¹Ð¹Ñ•áÑ½¹Ñ•¹Ð¤ñð€…Í•°¹µ½‘¥™ä¤(€€€€€É•ÑÕÉ¸‘¥È€ôô€‰±•™Ðˆñð‘¥È€ôô€‰‰…­Ý…Éˆ€ü…ÑMÑ…ÉÐ€è…Ñ¹ì(€€€É•ÑÕÉ¸Ý¥Ñ¡±ÕÍ¡•‘MÑ…Ñ”¡Ù¥•Ü°ÍÑ…Ñ”°€ ¤€ôøì(€€€€€±•Ðì™½ÕÍ9½‘”è½±‘9½‘”°™½ÕÍ=™™Í•Ðè½±‘=™˜°…¹¡½É9½‘”°…¹¡½É=™™Í•Ðô€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€€€±•Ð½±‘	¥‘¥1•Ù•°€ôÍ•°¹…É•Ñ	¥‘¥1•Ù•°ì(€€€€€Í•°¹µ½‘¥™ä ‰µ½Ù”ˆ°‘¥È°€‰¡…É…Ñ•Èˆ¤ì(€€€€€±•ÐÁ…É•¹Ñ=4€ô€‘¡•…¹‘•ÁÑ €üÙ¥•Ü¹‘½Y¥•Ü¹‘½µ™Ñ•ÉA½Ì ‘¡•…¹‰•™½É” ¤¤€èÙ¥•Ü¹‘½´ì(€€€€€±•Ðì™½ÕÍ9½‘”è¹•Ý9½‘”°™½ÕÍ=™™Í•Ðè¹•Ý=™˜ô€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€€€±•ÐÉ•ÍÕ±Ð€ô¹•Ý9½‘”€˜˜€…½¹Ñ…¥¹Ì¡Á…É•¹Ñ=4°¹•Ý9½‘”¤ñð½±‘9½‘”€ôô¹•Ý9½‘”€˜˜½±‘=™˜€ôô¹•Ý=™˜ì(€€€€€ÑÉäì(€€€€€€€Í•°¹½±±…ÁÍ”¡…¹¡½É9½‘”°…¹¡½É=™™Í•Ð¤ì(€€€€€€€¥˜€¡½±‘9½‘”€˜˜€¡½±‘9½‘”€„ô…¹¡½É9½‘”ñð½±‘=™˜€„ô…¹¡½É=™™Í•Ð¤€˜˜Í•°¹•áÑ•¹¤(€€€€€€€€€Í•°¹•áÑ•¹¡½±‘9½‘”°½±‘=™˜¤ì(€€€€€ô…Ñ €¡|¤ì(€€€€€ô(€€€€€¥˜€¡½±‘	¥‘¥1•Ù•°€„ô¹Õ±°¤(€€€€€€€Í•°¹…É•Ñ	¥‘¥1•Ù•°€ô½±‘	¥‘¥1•Ù•°ì(€€€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€€€ô¤ì(€ô(€Ù…È…¡•‘MÑ…Ñ”€ô¹Õ±°ì(€Ù…È…¡•‘¥È€ô¹Õ±°ì(€Ù…È…¡•‘I•ÍÕ±Ð€ô™…±Í”ì(€™Õ¹Ñ¥½¸•¹‘=™Q•áÑ‰±½¬¡Ù¥•Ü°ÍÑ…Ñ”°‘¥È¤ì(€€€¥˜€¡…¡•‘MÑ…Ñ”€ôôÍÑ…Ñ”€˜˜…¡•‘¥È€ôô‘¥È¤(€€€€€É•ÑÕÉ¸…¡•‘I•ÍÕ±Ðì(€€€…¡•‘MÑ…Ñ”€ôÍÑ…Ñ”ì(€€€…¡•‘¥È€ô‘¥Èì(€€€É•ÑÕÉ¸…¡•‘I•ÍÕ±Ð€ô‘¥È€ôô€‰ÕÀˆñð‘¥È€ôô€‰‘½Ý¸ˆ€ü•¹‘=™Q•áÑ‰±½­Y•ÉÑ¥…°¡Ù¥•Ü°ÍÑ…Ñ”°‘¥È¤€è•¹‘=™Q•áÑ‰±½­!½É¥é½¹Ñ…°¡Ù¥•Ü°ÍÑ…Ñ”°‘¥È¤ì(€ô(€Ù…È9=Q}%IQd€ô€Àì(€Ù…È!%1}%IQd€ô€Äì(€Ù…È=9Q9Q}%IQd€ô€Èì(€Ù…È9=}%IQd€ô€Ìì(€Ù…ÈY¥•Ý•ÍŒ€ô±…ÍÌì(€€€½¹ÍÑÉÕÑ½È¡Á…É•¹Ð°¡¥±‘É•¸°‘½´°½¹Ñ•¹Ñ=4¤ì(€€€€€Ñ¡¥Ì¹Á…É•¹Ð€ôÁ…É•¹Ðì(€€€€€Ñ¡¥Ì¹¡¥±‘É•¸€ô¡¥±‘É•¸ì(€€€€€Ñ¡¥Ì¹‘½´€ô‘½´ì(€€€€€Ñ¡¥Ì¹½¹Ñ•¹Ñ=4€ô½¹Ñ•¹Ñ=4ì(€€€€€Ñ¡¥Ì¹‘¥ÉÑä€ô9=Q}%IQdì(€€€€€‘½´¹ÁµY¥•Ý•ÍŒ€ôÑ¡¥Ìì(€€€ô(€€€€¼¼UÍ•Ñ¼¡•¬Ý¡•Ñ¡•È„¥Ù•¸‘•ÍÉ¥ÁÑ¥½¸½ÉÉ•ÍÁ½¹‘ÌÑ¼„(€€€€¼¼Ý¥‘•Ð½µ…É¬½¹½‘”¸(€€€µ…Ñ¡•Í]¥‘•Ð¡Ý¥‘•Ð¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€µ…Ñ¡•Í5…É¬¡µ…É¬¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€µ…Ñ¡•Í9½‘”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€µ…Ñ¡•Í!…¬¡¹½‘•9…µ”¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€€¼¼]¡•¸Á…ÉÍ¥¹œ¥¸µ•‘¥Ñ½È½¹Ñ•¹Ð€¡¥¸‘½µ¡…¹”¹©Ì¤°Ý”…±±½Ü(€€€€¼¼‘•ÍÉ¥ÁÑ¥½¹ÌÑ¼‘•Ñ•Éµ¥¹”Ñ¡”Á…ÉÍ”ÉÕ±•ÌÑ¡…ÐÍ¡½Õ±‰”ÕÍ•Ñ¼(€€€€¼¼Á…ÉÍ”Ñ¡•´¸(€€€Á…ÉÍ•IÕ±”¡…‘‘•‘9½‘•Ì¤ì(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€ô(€€€€¼¼UÍ•‰äÑ¡”•‘¥Ñ½ÈÌ•Ù•¹Ð¡…¹‘±•ÈÑ¼¥¹½É”•Ù•¹ÑÌÑ¡…Ð½µ”(€€€€¼¼™É½´•ÉÑ…¥¸‘•ÍÌ¸(€€€ÍÑ½ÁÙ•¹Ð¡•Ù•¹Ð¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€€¼¼Q¡”Í¥é”½˜Ñ¡”½¹Ñ•¹ÐÉ•ÁÉ•Í•¹Ñ•‰äÑ¡¥Ì‘•ÍŒ¸(€€€•ÐÍ¥é” ¤ì(€€€€€±•ÐÍ¥é”È€ô€Àì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ì¤¬¬¤(€€€€€€€Í¥é”È€¬ôÑ¡¥Ì¹¡¥±‘É•¹m¥t¹Í¥é”ì(€€€€€É•ÑÕÉ¸Í¥é”Èì(€€€ô(€€€€¼¼½È‰±½¬¹½‘•Ì°Ñ¡¥ÌÉ•ÁÉ•Í•¹ÑÌÑ¡”ÍÁ…”Ñ…­•¸ÕÀ‰äÑ¡•¥È(€€€€¼¼ÍÑ…ÉÐ½•¹Ñ½­•¹Ì¸(€€€•Ð‰½É‘•È ¤ì(€€€€€É•ÑÕÉ¸€Àì(€€€ô(€€€‘•ÍÑÉ½ä ¤ì(€€€€€Ñ¡¥Ì¹Á…É•¹Ð€ôÙ½¥€Àì(€€€€€¥˜€¡Ñ¡¥Ì¹‘½´¹ÁµY¥•Ý•ÍŒ€ôôÑ¡¥Ì¤(€€€€€€€Ñ¡¥Ì¹‘½´¹ÁµY¥•Ý•ÍŒ€ôÙ½¥€Àì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ì¤¬¬¤(€€€€€€€Ñ¡¥Ì¹¡¥±‘É•¹m¥t¹‘•ÍÑÉ½ä ¤ì(€€€ô(€€€Á½Í	•™½É•¡¥±¡¡¥±¤ì(€€€€€™½È€¡±•Ð¤€ô€À°Á½Ì€ôÑ¡¥Ì¹Á½ÍÑMÑ…ÉÐì€ì¤¬¬¤ì(€€€€€€€±•ÐÕÈ€ôÑ¡¥Ì¹¡¥±‘É•¹m¥tì(€€€€€€€¥˜€¡ÕÈ€ôô¡¥±¤(€€€€€€€€€É•ÑÕÉ¸Á½Ìì(€€€€€€€Á½Ì€¬ôÕÈ¹Í¥é”ì(€€€€€ô(€€€ô(€€€•ÐÁ½Í	•™½É” ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹Á…É•¹Ð¹Á½Í	•™½É•¡¥±¡Ñ¡¥Ì¤ì(€€€ô(€€€•ÐÁ½ÍÑMÑ…ÉÐ ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹Á…É•¹Ð€üÑ¡¥Ì¹Á…É•¹Ð¹Á½Í	•™½É•¡¥±¡Ñ¡¥Ì¤€¬Ñ¡¥Ì¹‰½É‘•È€è€Àì(€€€ô(€€€•ÐÁ½Í™Ñ•È ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹Á½Í	•™½É”€¬Ñ¡¥Ì¹Í¥é”ì(€€€ô(€€€•ÐÁ½ÍÑ¹ ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹Á½ÍÑMÑ…ÉÐ€¬Ñ¡¥Ì¹Í¥é”€´€È€¨Ñ¡¥Ì¹‰½É‘•Èì(€€€ô(€€€±½…±A½ÍÉ½µ=4¡‘½´°½™™Í•Ð°‰¥…Ì¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹½¹Ñ•¹Ñ=4€˜˜½¹Ñ…¥¹Ì¡Ñ¡¥Ì¹½¹Ñ•¹Ñ=4°‘½´¤¤ì(€€€€€€€¥˜€¡‰¥…Ì€ð€À¤ì(€€€€€€€€€±•Ð‘½µ	•™½É”°‘•ÍŒì(€€€€€€€€€¥˜€¡‘½´€ôôÑ¡¥Ì¹½¹Ñ•¹Ñ=4¤ì(€€€€€€€€€€€‘½µ	•™½É”€ô‘½´¹¡¥±‘9½‘•Ím½™™Í•Ð€´€Åtì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€Ý¡¥±”€¡‘½´¹Á…É•¹Ñ9½‘”€„ôÑ¡¥Ì¹½¹Ñ•¹Ñ=4¤(€€€€€€€€€€€€€‘½´€ô‘½´¹Á…É•¹Ñ9½‘”ì(€€€€€€€€€€€‘½µ	•™½É”€ô‘½´¹ÁÉ•Ù¥½ÕÍM¥‰±¥¹œì(€€€€€€€€€ô(€€€€€€€€€Ý¡¥±”€¡‘½µ	•™½É”€˜˜€„ ¡‘•ÍŒ€ô‘½µ	•™½É”¹ÁµY¥•Ý•ÍŒ¤€˜˜‘•ÍŒ¹Á…É•¹Ð€ôôÑ¡¥Ì¤¤(€€€€€€€€€€€‘½µ	•™½É”€ô‘½µ	•™½É”¹ÁÉ•Ù¥½ÕÍM¥‰±¥¹œì(€€€€€€€€€É•ÑÕÉ¸‘½µ	•™½É”€üÑ¡¥Ì¹Á½Í	•™½É•¡¥±¡‘•ÍŒ¤€¬‘•ÍŒ¹Í¥é”€èÑ¡¥Ì¹Á½ÍÑMÑ…ÉÐì(€€€€€€€ô•±Í”ì(€€€€€€€€€±•Ð‘½µ™Ñ•È°‘•ÍŒì(€€€€€€€€€¥˜€¡‘½´€ôôÑ¡¥Ì¹½¹Ñ•¹Ñ=4¤ì(€€€€€€€€€€€‘½µ™Ñ•È€ô‘½´¹¡¥±‘9½‘•Ím½™™Í•Ñtì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€Ý¡¥±”€¡‘½´¹Á…É•¹Ñ9½‘”€„ôÑ¡¥Ì¹½¹Ñ•¹Ñ=4¤(€€€€€€€€€€€€€‘½´€ô‘½´¹Á…É•¹Ñ9½‘”ì(€€€€€€€€€€€‘½µ™Ñ•È€ô‘½´¹¹•áÑM¥‰±¥¹œì(€€€€€€€€€ô(€€€€€€€€€Ý¡¥±”€¡‘½µ™Ñ•È€˜˜€„ ¡‘•ÍŒ€ô‘½µ™Ñ•È¹ÁµY¥•Ý•ÍŒ¤€˜˜‘•ÍŒ¹Á…É•¹Ð€ôôÑ¡¥Ì¤¤(€€€€€€€€€€€‘½µ™Ñ•È€ô‘½µ™Ñ•È¹¹•áÑM¥‰±¥¹œì(€€€€€€€€€É•ÑÕÉ¸‘½µ™Ñ•È€üÑ¡¥Ì¹Á½Í	•™½É•¡¥±¡‘•ÍŒ¤€èÑ¡¥Ì¹Á½ÍÑ¹ì(€€€€€€€ô(€€€€€ô(€€€€€±•Ð…Ñ¹ì(€€€€€¥˜€¡‘½´€ôôÑ¡¥Ì¹‘½´€˜˜Ñ¡¥Ì¹½¹Ñ•¹Ñ=4¤ì(€€€€€€€…Ñ¹€ô½™™Í•Ð€ø‘½µ%¹‘•à¡Ñ¡¥Ì¹½¹Ñ•¹Ñ=4¤ì(€€€€€ô•±Í”¥˜€¡Ñ¡¥Ì¹½¹Ñ•¹Ñ=4€˜˜Ñ¡¥Ì¹½¹Ñ•¹Ñ=4€„ôÑ¡¥Ì¹‘½´€˜˜Ñ¡¥Ì¹‘½´¹½¹Ñ…¥¹Ì¡Ñ¡¥Ì¹½¹Ñ•¹Ñ=4¤¤ì(€€€€€€€…Ñ¹€ô€„„¡‘½´¹½µÁ…É•½Õµ•¹ÑA½Í¥Ñ¥½¸¡Ñ¡¥Ì¹½¹Ñ•¹Ñ=4¤€˜€Ð¤ì(€€€€€ô•±Í”¥˜€¡Ñ¡¥Ì¹‘½´¹™¥ÉÍÑ¡¥±¤ì(€€€€€€€¥˜€¡½™™Í•Ð€ôô€À¤(€€€€€€€€€™½È€¡±•ÐÍ•…É €ô‘½´ì€ìÍ•…É €ôÍ•…É ¹Á…É•¹Ñ9½‘”¤ì(€€€€€€€€€€€¥˜€¡Í•…É €ôôÑ¡¥Ì¹‘½´¤ì(€€€€€€€€€€€€€…Ñ¹€ô™…±Í”ì(€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€ô(€€€€€€€€€€€¥˜€¡Í•…É ¹ÁÉ•Ù¥½ÕÍM¥‰±¥¹œ¤(€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€ô(€€€€€€€¥˜€¡…Ñ¹€ôô¹Õ±°€˜˜½™™Í•Ð€ôô‘½´¹¡¥±‘9½‘•Ì¹±•¹Ñ ¤(€€€€€€€€€™½È€¡±•ÐÍ•…É €ô‘½´ì€ìÍ•…É €ôÍ•…É ¹Á…É•¹Ñ9½‘”¤ì(€€€€€€€€€€€¥˜€¡Í•…É €ôôÑ¡¥Ì¹‘½´¤ì(€€€€€€€€€€€€€…Ñ¹€ôÑÉÕ”ì(€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€ô(€€€€€€€€€€€¥˜€¡Í•…É ¹¹•áÑM¥‰±¥¹œ¤(€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€ô(€€€€€ô(€€€€€É•ÑÕÉ¸€¡…Ñ¹€ôô¹Õ±°€ü‰¥…Ì€ø€À€è…Ñ¹¤€üÑ¡¥Ì¹Á½ÍÑ¹€èÑ¡¥Ì¹Á½ÍÑMÑ…ÉÐì(€€€ô(€€€¹•…É•ÍÑ•ÍŒ¡‘½´°½¹±å9½‘•Ì€ô™…±Í”¤ì(€€€€€™½È€¡±•Ð™¥ÉÍÐ€ôÑÉÕ”°ÕÈ€ô‘½´ìÕÈìÕÈ€ôÕÈ¹Á…É•¹Ñ9½‘”¤ì(€€€€€€€±•Ð‘•ÍŒ€ôÑ¡¥Ì¹•Ñ•ÍŒ¡ÕÈ¤°¹½‘•=4ì(€€€€€€€¥˜€¡‘•ÍŒ€˜˜€ …½¹±å9½‘•Ìñð‘•ÍŒ¹¹½‘”¤¤ì(€€€€€€€€€¥˜€¡™¥ÉÍÐ€˜˜€¡¹½‘•=4€ô‘•ÍŒ¹¹½‘•=4¤€˜˜€„¡¥Í±Ð¡¹½‘•=4¤€ü½¹Ñ…¥¹Ì¡¹½‘•=4°‘½´¤€è¹½‘•=4€ôô‘½´¤¤(€€€€€€€€€€€™¥ÉÍÐ€ô™…±Í”ì(€€€€€€€€€•±Í”(€€€€€€€€€€€É•ÑÕÉ¸‘•ÍŒì(€€€€€€€ô(€€€€€ô(€€€ô(€€€•Ñ•ÍŒ¡‘½´¤ì(€€€€€±•Ð‘•ÍŒ€ô‘½´¹ÁµY¥•Ý•ÍŒì(€€€€€™½È€¡±•ÐÕÈ€ô‘•ÍŒìÕÈìÕÈ€ôÕÈ¹Á…É•¹Ð¤(€€€€€€€¥˜€¡ÕÈ€ôôÑ¡¥Ì¤(€€€€€€€€€É•ÑÕÉ¸‘•ÍŒì(€€€ô(€€€Á½ÍÉ½µ=4¡‘½´°½™™Í•Ð°‰¥…Ì¤ì(€€€€€™½È€¡±•ÐÍ…¸€ô‘½´ìÍ…¸ìÍ…¸€ôÍ…¸¹Á…É•¹Ñ9½‘”¤ì(€€€€€€€±•Ð‘•ÍŒ€ôÑ¡¥Ì¹•Ñ•ÍŒ¡Í…¸¤ì(€€€€€€€¥˜€¡‘•ÍŒ¤(€€€€€€€€€É•ÑÕÉ¸‘•ÍŒ¹±½…±A½ÍÉ½µ=4¡‘½´°½™™Í•Ð°‰¥…Ì¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸€´Äì(€€€ô(€€€€¼¼¥¹Ñ¡”‘•ÍŒ™½ÈÑ¡”¹½‘”…™Ñ•ÈÑ¡”¥Ù•¸Á½Ì°¥˜…¹ä¸€¡]¡•¸„(€€€€¼¼Á…É•¹Ð¹½‘”½Ù•ÉÉ½‘”É•¹‘•É¥¹œ°Ñ¡•É”µ¥¡Ð¹½Ð‰”½¹”¸¤(€€€‘•ÍÐ¡Á½Ì¤ì(€€€€€™½È€¡±•Ð¤€ô€À°½™™Í•Ð€ô€Àì¤€ðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•Ð¡¥±€ôÑ¡¥Ì¹¡¥±‘É•¹m¥t°•¹€ô½™™Í•Ð€¬¡¥±¹Í¥é”ì(€€€€€€€¥˜€¡½™™Í•Ð€ôôÁ½Ì€˜˜•¹€„ô½™™Í•Ð¤ì(€€€€€€€€€Ý¡¥±”€ …¡¥±¹‰½É‘•È€˜˜¡¥±¹¡¥±‘É•¸¹±•¹Ñ ¤ì(€€€€€€€€€€€™½È€¡±•Ð¤È€ô€Àì¤È€ð¡¥±¹¡¥±‘É•¸¹±•¹Ñ ì¤È¬¬¤ì(€€€€€€€€€€€€€±•Ð¥¹¹•È€ô¡¥±¹¡¥±‘É•¹m¤Étì(€€€€€€€€€€€€€¥˜€¡¥¹¹•È¹Í¥é”¤ì(€€€€€€€€€€€€€€€¡¥±€ô¥¹¹•Èì(€€€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€€€ô(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€€€É•ÑÕÉ¸¡¥±ì(€€€€€€€ô(€€€€€€€¥˜€¡Á½Ì€ð•¹¤(€€€€€€€€€É•ÑÕÉ¸¡¥±¹‘•ÍÐ¡Á½Ì€´½™™Í•Ð€´¡¥±¹‰½É‘•È¤ì(€€€€€€€½™™Í•Ð€ô•¹ì(€€€€€ô(€€€ô(€€€‘½µÉ½µA½Ì¡Á½Ì°Í¥‘”¤ì(€€€€€¥˜€ …Ñ¡¥Ì¹½¹Ñ•¹Ñ=4¤(€€€€€€€É•ÑÕÉ¸ì¹½‘”èÑ¡¥Ì¹‘½´°½™™Í•Ðè€À°…Ñ½´èÁ½Ì€¬€Äôì(€€€€€±•Ð¤€ô€À°½™™Í•Ð€ô€Àì(€€€€€™½È€¡±•ÐÕÉA½Ì€ô€Àì¤€ðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•Ð¡¥±€ôÑ¡¥Ì¹¡¥±‘É•¹m¥t°•¹€ôÕÉA½Ì€¬¡¥±¹Í¥é”ì(€€€€€€€¥˜€¡•¹€øÁ½Ì¤ì(€€€€€€€€€½™™Í•Ð€ôÁ½Ì€´ÕÉA½Ìì(€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€€€ÕÉA½Ì€ô•¹ì(€€€€€ô(€€€€€¥˜€¡½™™Í•Ð¤(€€€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹¡¥±‘É•¹m¥t¹‘½µÉ½µA½Ì¡½™™Í•Ð€´Ñ¡¥Ì¹¡¥±‘É•¹m¥t¹‰½É‘•È°Í¥‘”¤ì(€€€€€™½È€ ì¤€ø€Àì¤´´¤ì(€€€€€€€±•ÐÁÉ•Ø€ôÑ¡¥Ì¹¡¥±‘É•¹m¤€´€Åtì(€€€€€€€¥˜€¡ÁÉ•Ø¹Í¥é”ñð€„¡ÁÉ•Ø¥¹ÍÑ…¹•½˜	Õ™™•É!…­Y¥•Ý•ÍŒñðÁÉ•Ø¥¹ÍÑ…¹•½˜]¥‘•ÑY¥•Ý•ÍŒ€˜˜ÁÉ•Ø¹Í¥‘”€øô€À¤¤(€€€€€€€€€‰É•…¬ì(€€€€€ô(€€€€€¥˜€¡Í¥‘”€ðô€À¤ì(€€€€€€€±•ÐÁÉ•Ø°•¹Ñ•È€ôÑÉÕ”ì(€€€€€€€™½È€ ì€ì¤´´°•¹Ñ•È€ô™…±Í”¤ì(€€€€€€€€€ÁÉ•Ø€ô¤€üÑ¡¥Ì¹¡¥±‘É•¹m¤€´€Åt€è¹Õ±°ì(€€€€€€€€€¥˜€ …ÁÉ•ØñðÁÉ•Ø¹‘½´¹Á…É•¹Ñ9½‘”€ôôÑ¡¥Ì¹½¹Ñ•¹Ñ=4¤(€€€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€€€¥˜€¡ÁÉ•Ø€˜˜Í¥‘”€˜˜•¹Ñ•È€˜˜€…ÁÉ•Ø¹‰½É‘•È€˜˜€…ÁÉ•Ø¹‘½µÑ½´¤(€€€€€€€€€É•ÑÕÉ¸ÁÉ•Ø¹‘½µÉ½µA½Ì¡ÁÉ•Ø¹Í¥é”°Í¥‘”¤ì(€€€€€€€É•ÑÕÉ¸ì¹½‘”èÑ¡¥Ì¹½¹Ñ•¹Ñ=4°½™™Í•ÐèÁÉ•Ø€ü‘½µ%¹‘•à¡ÁÉ•Ø¹‘½´¤€¬€Ä€è€Àôì(€€€€€ô•±Í”ì(€€€€€€€±•Ð¹•áÐ°•¹Ñ•È€ôÑÉÕ”ì(€€€€€€€™½È€ ì€ì¤¬¬°•¹Ñ•È€ô™…±Í”¤ì(€€€€€€€€€¹•áÐ€ô¤€ðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ €üÑ¡¥Ì¹¡¥±‘É•¹m¥t€è¹Õ±°ì(€€€€€€€€€¥˜€ …¹•áÐñð¹•áÐ¹‘½´¹Á…É•¹Ñ9½‘”€ôôÑ¡¥Ì¹½¹Ñ•¹Ñ=4¤(€€€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€€€¥˜€¡¹•áÐ€˜˜•¹Ñ•È€˜˜€…¹•áÐ¹‰½É‘•È€˜˜€…¹•áÐ¹‘½µÑ½´¤(€€€€€€€€€É•ÑÕÉ¸¹•áÐ¹‘½µÉ½µA½Ì À°Í¥‘”¤ì(€€€€€€€É•ÑÕÉ¸ì¹½‘”èÑ¡¥Ì¹½¹Ñ•¹Ñ=4°½™™Í•Ðè¹•áÐ€ü‘½µ%¹‘•à¡¹•áÐ¹‘½´¤€èÑ¡¥Ì¹½¹Ñ•¹Ñ=4¹¡¥±‘9½‘•Ì¹±•¹Ñ ôì(€€€€€ô(€€€ô(€€€€¼¼UÍ•Ñ¼™¥¹„=4É…¹”¥¸„Í¥¹±”Á…É•¹Ð™½È„¥Ù•¸¡…¹•(€€€€¼¼É…¹”¸(€€€Á…ÉÍ•I…¹”¡™É½´È°Ñ¼°‰…Í”È€ô€À¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ €ôô€À¤(€€€€€€€É•ÑÕÉ¸ì¹½‘”èÑ¡¥Ì¹½¹Ñ•¹Ñ=4°™É½´è™É½´È°Ñ¼°™É½µ=™™Í•Ðè€À°Ñ½=™™Í•ÐèÑ¡¥Ì¹½¹Ñ•¹Ñ=4¹¡¥±‘9½‘•Ì¹±•¹Ñ ôì(€€€€€±•Ð™É½µ=™™Í•Ð€ô€´Ä°Ñ½=™™Í•Ð€ô€´Äì(€€€€€™½È€¡±•Ð½™™Í•Ð€ô‰…Í”È°¤€ô€Àì€ì¤¬¬¤ì(€€€€€€€±•Ð¡¥±€ôÑ¡¥Ì¹¡¥±‘É•¹m¥t°•¹€ô½™™Í•Ð€¬¡¥±¹Í¥é”ì(€€€€€€€¥˜€¡™É½µ=™™Í•Ð€ôô€´Ä€˜˜™É½´È€ðô•¹¤ì(€€€€€€€€€±•Ð¡¥±‘	…Í”€ô½™™Í•Ð€¬¡¥±¹‰½É‘•Èì(€€€€€€€€€¥˜€¡™É½´È€øô¡¥±‘	…Í”€˜˜Ñ¼€ðô•¹€´¡¥±¹‰½É‘•È€˜˜¡¥±¹¹½‘”€˜˜¡¥±¹½¹Ñ•¹Ñ=4€˜˜Ñ¡¥Ì¹½¹Ñ•¹Ñ=4¹½¹Ñ…¥¹Ì¡¡¥±¹½¹Ñ•¹Ñ=4¤¤(€€€€€€€€€€€É•ÑÕÉ¸¡¥±¹Á…ÉÍ•I…¹”¡™É½´È°Ñ¼°¡¥±‘	…Í”¤ì(€€€€€€€€€™É½´È€ô½™™Í•Ðì(€€€€€€€€€™½È€¡±•Ð¨€ô¤ì¨€ø€Àì¨´´¤ì(€€€€€€€€€€€±•ÐÁÉ•Ø€ôÑ¡¥Ì¹¡¥±‘É•¹m¨€´€Åtì(€€€€€€€€€€€¥˜€¡ÁÉ•Ø¹Í¥é”€˜˜ÁÉ•Ø¹‘½´¹Á…É•¹Ñ9½‘”€ôôÑ¡¥Ì¹½¹Ñ•¹Ñ=4€˜˜€…ÁÉ•Ø¹•µÁÑå¡¥±‘Ð Ä¤¤ì(€€€€€€€€€€€€€™É½µ=™™Í•Ð€ô‘½µ%¹‘•à¡ÁÉ•Ø¹‘½´¤€¬€Äì(€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€ô(€€€€€€€€€€€™É½´È€´ôÁÉ•Ø¹Í¥é”ì(€€€€€€€€€ô(€€€€€€€€€¥˜€¡™É½µ=™™Í•Ð€ôô€´Ä¤(€€€€€€€€€€€™É½µ=™™Í•Ð€ô€Àì(€€€€€€€ô(€€€€€€€¥˜€¡™É½µ=™™Í•Ð€ø€´Ä€˜˜€¡•¹€øÑ¼ñð¤€ôôÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ €´€Ä¤¤ì(€€€€€€€€€Ñ¼€ô•¹ì(€€€€€€€€€™½È€¡±•Ð¨€ô¤€¬€Äì¨€ðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ì¨¬¬¤ì(€€€€€€€€€€€±•Ð¹•áÐ€ôÑ¡¥Ì¹¡¥±‘É•¹m©tì(€€€€€€€€€€€¥˜€¡¹•áÐ¹Í¥é”€˜˜¹•áÐ¹‘½´¹Á…É•¹Ñ9½‘”€ôôÑ¡¥Ì¹½¹Ñ•¹Ñ=4€˜˜€…¹•áÐ¹•µÁÑå¡¥±‘Ð ´Ä¤¤ì(€€€€€€€€€€€€€Ñ½=™™Í•Ð€ô‘½µ%¹‘•à¡¹•áÐ¹‘½´¤ì(€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€ô(€€€€€€€€€€€Ñ¼€¬ô¹•áÐ¹Í¥é”ì(€€€€€€€€€ô(€€€€€€€€€¥˜€¡Ñ½=™™Í•Ð€ôô€´Ä¤(€€€€€€€€€€€Ñ½=™™Í•Ð€ôÑ¡¥Ì¹½¹Ñ•¹Ñ=4¹¡¥±‘9½‘•Ì¹±•¹Ñ ì(€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€€€½™™Í•Ð€ô•¹ì(€€€€€ô(€€€€€É•ÑÕÉ¸ì¹½‘”èÑ¡¥Ì¹½¹Ñ•¹Ñ=4°™É½´è™É½´È°Ñ¼°™É½µ=™™Í•Ð°Ñ½=™™Í•Ðôì(€€€ô(€€€•µÁÑå¡¥±‘Ð¡Í¥‘”¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹‰½É‘•Èñð€…Ñ¡¥Ì¹½¹Ñ•¹Ñ=4ñð€…Ñ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€±•Ð¡¥±€ôÑ¡¥Ì¹¡¥±‘É•¹mÍ¥‘”€ð€À€ü€À€èÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ €´€Åtì(€€€€€É•ÑÕÉ¸¡¥±¹Í¥é”€ôô€Àñð¡¥±¹•µÁÑå¡¥±‘Ð¡Í¥‘”¤ì(€€€ô(€€€‘½µ™Ñ•ÉA½Ì¡Á½Ì¤ì(€€€€€±•Ðì¹½‘”°½™™Í•Ðô€ôÑ¡¥Ì¹‘½µÉ½µA½Ì¡Á½Ì°€À¤ì(€€€€€¥˜€ …¥Í±Ð¡¹½‘”¤ñð½™™Í•Ð€ôô¹½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ ¤(€€€€€€€Ñ¡É½Ü¹•ÜI…¹•ÉÉ½È ‰9¼¹½‘”…™Ñ•ÈÁ½Ì€ˆ€¬Á½Ì¤ì(€€€€€É•ÑÕÉ¸¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ñtì(€€€ô(€€€€¼¼Y¥•Ü‘•ÍÌ…É”É•ÍÁ½¹Í¥‰±”™½ÈÍ•ÑÑ¥¹œ…¹äÍ•±•Ñ¥½¸Ñ¡…Ð™…±±Ì(€€€€¼¼•¹Ñ¥É•±ä¥¹Í¥‘”½˜Ñ¡•´°Í¼Ñ¡…ÐÕÍÑ½´¥µÁ±•µ•¹Ñ…Ñ¥½¹Ì…¸‘¼(€€€€¼¼ÕÍÑ½´Ñ¡¥¹ÌÝ¥Ñ Ñ¡”Í•±•Ñ¥½¸¸9½Ñ”Ñ¡…ÐÑ¡¥Ì™…±±Ì…Á…ÉÐÝ¡•¸(€€€€¼¼„Í•±•Ñ¥½¸ÍÑ…ÉÑÌ¥¸ÍÕ „¹½‘”…¹•¹‘Ì¥¸…¹½Ñ¡•È°¥¸Ý¡¥ (€€€€¼¼…Í”Ý”©ÕÍÐÕÍ”Ý¡…Ñ•Ù•È‘½µÉ½µA½ÌÁÉ½‘Õ•Ì…Ì„‰•ÍÐ•™™½ÉÐ¸(€€€Í•ÑM•±•Ñ¥½¸¡…¹¡½È°¡•…°Ù¥•Ü°™½É”€ô™…±Í”¤ì(€€€€€±•Ð™É½´È€ô5…Ñ ¹µ¥¸¡…¹¡½È°¡•…¤°Ñ¼€ô5…Ñ ¹µ…à¡…¹¡½È°¡•…¤ì(€€€€€™½È€¡±•Ð¤€ô€À°½™™Í•Ð€ô€Àì¤€ðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•Ð¡¥±€ôÑ¡¥Ì¹¡¥±‘É•¹m¥t°•¹€ô½™™Í•Ð€¬¡¥±¹Í¥é”ì(€€€€€€€¥˜€¡™É½´È€ø½™™Í•Ð€˜˜Ñ¼€ð•¹¤(€€€€€€€€€É•ÑÕÉ¸¡¥±¹Í•ÑM•±•Ñ¥½¸¡…¹¡½È€´½™™Í•Ð€´¡¥±¹‰½É‘•È°¡•…€´½™™Í•Ð€´¡¥±¹‰½É‘•È°Ù¥•Ü°™½É”¤ì(€€€€€€€½™™Í•Ð€ô•¹ì(€€€€€ô(€€€€€±•Ð…¹¡½É=4€ôÑ¡¥Ì¹‘½µÉ½µA½Ì¡…¹¡½È°…¹¡½È€ü€´Ä€è€Ä¤ì(€€€€€±•Ð¡•…‘=4€ô¡•…€ôô…¹¡½È€ü…¹¡½É=4€èÑ¡¥Ì¹‘½µÉ½µA½Ì¡¡•…°¡•…€ü€´Ä€è€Ä¤ì(€€€€€±•Ð‘½µM•°€ôÙ¥•Ü¹É½½Ð¹•ÑM•±•Ñ¥½¸ ¤ì(€€€€€±•ÐÍ•±I…¹”€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€€€±•Ð‰É-±Õ‘”€ô™…±Í”ì(€€€€€¥˜€ ¡•­¼ñðÍ…™…É¤¤€˜˜…¹¡½È€ôô¡•…¤ì(€€€€€€€±•Ðì¹½‘”°½™™Í•Ðô€ô…¹¡½É=4ì(€€€€€€€¥˜€¡¥ÍQ•áÐ¡¹½‘”¤¤ì(€€€€€€€€€‰É-±Õ‘”€ô€„„¡½™™Í•Ð€˜˜¹½‘”¹¹½‘•Y…±Õ•m½™™Í•Ð€´€Åt€ôô€‰q¸ˆ¤ì(€€€€€€€€€¥˜€¡‰É-±Õ‘”€˜˜½™™Í•Ð€ôô¹½‘”¹¹½‘•Y…±Õ”¹±•¹Ñ ¤ì(€€€€€€€€€€€™½È€¡±•ÐÍ…¸€ô¹½‘”°…™Ñ•ÈìÍ…¸ìÍ…¸€ôÍ…¸¹Á…É•¹Ñ9½‘”¤ì(€€€€€€€€€€€€€¥˜€¡…™Ñ•È€ôÍ…¸¹¹•áÑM¥‰±¥¹œ¤ì(€€€€€€€€€€€€€€€¥˜€¡…™Ñ•È¹¹½‘•9…µ”€ôô€‰	Hˆ¤(€€€€€€€€€€€€€€€€€…¹¡½É=4€ô¡•…‘=4€ôì¹½‘”è…™Ñ•È¹Á…É•¹Ñ9½‘”°½™™Í•Ðè‘½µ%¹‘•à¡…™Ñ•È¤€¬€Äôì(€€€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€€€ô(€€€€€€€€€€€€€±•Ð‘•ÍŒ€ôÍ…¸¹ÁµY¥•Ý•ÍŒì(€€€€€€€€€€€€€¥˜€¡‘•ÍŒ€˜˜‘•ÍŒ¹¹½‘”€˜˜‘•ÍŒ¹¹½‘”¹¥Í	±½¬¤(€€€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€ô•±Í”ì(€€€€€€€€€±•ÐÁÉ•Ø€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ð€´€Åtì(€€€€€€€€€‰É-±Õ‘”€ôÁÉ•Ø€˜˜€¡ÁÉ•Ø¹¹½‘•9…µ”€ôô€‰	HˆñðÁÉ•Ø¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤ì(€€€€€€€ô(€€€€€ô(€€€€€¥˜€¡•­¼€˜˜Í•±I…¹”¹™½ÕÍ9½‘”€˜˜Í•±I…¹”¹™½ÕÍ9½‘”€„ô¡•…‘=4¹¹½‘”€˜˜¥Í±Ð¡Í•±I…¹”¹™½ÕÍ9½‘”¤¤ì(€€€€€€€±•Ð…™Ñ•È€ôÍ•±I…¹”¹™½ÕÍ9½‘”¹¡¥±‘9½‘•ÍmÍ•±I…¹”¹™½ÕÍ=™™Í•Ñtì(€€€€€€€¥˜€¡…™Ñ•È€˜˜…™Ñ•È¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤(€€€€€€€€€™½É”€ôÑÉÕ”ì(€€€€€ô(€€€€€¥˜€ „¡™½É”ñð‰É-±Õ‘”€˜˜Í…™…É¤¤€˜˜¥ÍÅÕ¥Ù…±•¹ÑA½Í¥Ñ¥½¸¡…¹¡½É=4¹¹½‘”°…¹¡½É=4¹½™™Í•Ð°Í•±I…¹”¹…¹¡½É9½‘”°Í•±I…¹”¹…¹¡½É=™™Í•Ð¤€˜˜¥ÍÅÕ¥Ù…±•¹ÑA½Í¥Ñ¥½¸¡¡•…‘=4¹¹½‘”°¡•…‘=4¹½™™Í•Ð°Í•±I…¹”¹™½ÕÍ9½‘”°Í•±I…¹”¹™½ÕÍ=™™Í•Ð¤¤(€€€€€€€É•ÑÕÉ¸ì(€€€€€±•Ð‘½µM•±áÑ•¹‘•€ô™…±Í”ì(€€€€€¥˜€ ¡‘½µM•°¹•áÑ•¹ñð…¹¡½È€ôô¡•…¤€˜˜€„¡‰É-±Õ‘”€˜˜•­¼¤¤ì(€€€€€€€‘½µM•°¹½±±…ÁÍ”¡…¹¡½É=4¹¹½‘”°…¹¡½É=4¹½™™Í•Ð¤ì(€€€€€€€ÑÉäì(€€€€€€€€€¥˜€¡…¹¡½È€„ô¡•…¤(€€€€€€€€€€€‘½µM•°¹•áÑ•¹¡¡•…‘=4¹¹½‘”°¡•…‘=4¹½™™Í•Ð¤ì(€€€€€€€€€‘½µM•±áÑ•¹‘•€ôÑÉÕ”ì(€€€€€€€ô…Ñ €¡|¤ì(€€€€€€€ô(€€€€€ô(€€€€€¥˜€ …‘½µM•±áÑ•¹‘•¤ì(€€€€€€€¥˜€¡…¹¡½È€ø¡•…¤ì(€€€€€€€€€±•ÐÑµÀ€ô…¹¡½É=4ì(€€€€€€€€€…¹¡½É=4€ô¡•…‘=4ì(€€€€€€€€€¡•…‘=4€ôÑµÀì(€€€€€€€ô(€€€€€€€±•ÐÉ…¹”€ô‘½Õµ•¹Ð¹É•…Ñ•I…¹” ¤ì(€€€€€€€É…¹”¹Í•Ñ¹¡¡•…‘=4¹¹½‘”°¡•…‘=4¹½™™Í•Ð¤ì(€€€€€€€É…¹”¹Í•ÑMÑ…ÉÐ¡…¹¡½É=4¹¹½‘”°…¹¡½É=4¹½™™Í•Ð¤ì(€€€€€€€‘½µM•°¹É•µ½Ù•±±I…¹•Ì ¤ì(€€€€€€€‘½µM•°¹…‘‘I…¹”¡É…¹”¤ì(€€€€€ô(€€€ô(€€€¥¹½É•5ÕÑ…Ñ¥½¸¡µÕÑ…Ñ¥½¸¤ì(€€€€€É•ÑÕÉ¸€…Ñ¡¥Ì¹½¹Ñ•¹Ñ=4€˜˜µÕÑ…Ñ¥½¸¹ÑåÁ”€„ô€‰Í•±•Ñ¥½¸ˆì(€€€ô(€€€•Ð½¹Ñ•¹Ñ1½ÍÐ ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹½¹Ñ•¹Ñ=4€˜˜Ñ¡¥Ì¹½¹Ñ•¹Ñ=4€„ôÑ¡¥Ì¹‘½´€˜˜€…Ñ¡¥Ì¹‘½´¹½¹Ñ…¥¹Ì¡Ñ¡¥Ì¹½¹Ñ•¹Ñ=4¤ì(€€€ô(€€€€¼¼I•µ½Ù”„ÍÕ‰ÑÉ•”½˜Ñ¡”•±•µ•¹ÐÑÉ•”Ñ¡…Ð¡…Ì‰••¸Ñ½Õ¡•(€€€€¼¼‰ä„=4¡…¹”°Í¼Ñ¡…ÐÑ¡”¹•áÐÕÁ‘…Ñ”Ý¥±°É•‘É…Ü¥Ð¸(€€€µ…É­¥ÉÑä¡™É½´È°Ñ¼¤ì(€€€€€™½È€¡±•Ð½™™Í•Ð€ô€À°¤€ô€Àì¤€ðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•Ð¡¥±€ôÑ¡¥Ì¹¡¥±‘É•¹m¥t°•¹€ô½™™Í•Ð€¬¡¥±¹Í¥é”ì(€€€€€€€¥˜€¡½™™Í•Ð€ôô•¹€ü™É½´È€ðô•¹€˜˜Ñ¼€øô½™™Í•Ð€è™É½´È€ð•¹€˜˜Ñ¼€ø½™™Í•Ð¤ì(€€€€€€€€€±•ÐÍÑ…ÉÑ%¹Í¥‘”€ô½™™Í•Ð€¬¡¥±¹‰½É‘•È°•¹‘%¹Í¥‘”€ô•¹€´¡¥±¹‰½É‘•Èì(€€€€€€€€€¥˜€¡™É½´È€øôÍÑ…ÉÑ%¹Í¥‘”€˜˜Ñ¼€ðô•¹‘%¹Í¥‘”¤ì(€€€€€€€€€€€Ñ¡¥Ì¹‘¥ÉÑä€ô™É½´È€ôô½™™Í•ÐñðÑ¼€ôô•¹€ü=9Q9Q}%IQd€è!%1}%IQdì(€€€€€€€€€€€¥˜€¡™É½´È€ôôÍÑ…ÉÑ%¹Í¥‘”€˜˜Ñ¼€ôô•¹‘%¹Í¥‘”€˜˜€¡¡¥±¹½¹Ñ•¹Ñ1½ÍÐñð¡¥±¹‘½´¹Á…É•¹Ñ9½‘”€„ôÑ¡¥Ì¹½¹Ñ•¹Ñ=4¤¤(€€€€€€€€€€€€€¡¥±¹‘¥ÉÑä€ô9=}%IQdì(€€€€€€€€€€€•±Í”(€€€€€€€€€€€€€¡¥±¹µ…É­¥ÉÑä¡™É½´È€´ÍÑ…ÉÑ%¹Í¥‘”°Ñ¼€´ÍÑ…ÉÑ%¹Í¥‘”¤ì(€€€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€¡¥±¹‘¥ÉÑä€ô¡¥±¹‘½´€ôô¡¥±¹½¹Ñ•¹Ñ=4€˜˜¡¥±¹‘½´¹Á…É•¹Ñ9½‘”€ôôÑ¡¥Ì¹½¹Ñ•¹Ñ=4€˜˜€…¡¥±¹¡¥±‘É•¸¹±•¹Ñ €ü=9Q9Q}%IQd€è9=}%IQdì(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€½™™Í•Ð€ô•¹ì(€€€€€ô(€€€€€Ñ¡¥Ì¹‘¥ÉÑä€ô=9Q9Q}%IQdì(€€€ô(€€€µ…É­A…É•¹ÑÍ¥ÉÑä ¤ì(€€€€€±•Ð±•Ù•°€ô€Äì(€€€€€™½È€¡±•Ð¹½‘”€ôÑ¡¥Ì¹Á…É•¹Ðì¹½‘”ì¹½‘”€ô¹½‘”¹Á…É•¹Ð°±•Ù•°¬¬¤ì(€€€€€€€±•Ð‘¥ÉÑä€ô±•Ù•°€ôô€Ä€ü=9Q9Q}%IQd€è!%1}%IQdì(€€€€€€€¥˜€¡¹½‘”¹‘¥ÉÑä€ð‘¥ÉÑä¤(€€€€€€€€€¹½‘”¹‘¥ÉÑä€ô‘¥ÉÑäì(€€€€€ô(€€€ô(€€€•Ð‘½µÑ½´ ¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€•Ð¥¹½É•½É½½É‘Ì ¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€•Ð¥¹½É•½ÉM•±•Ñ¥½¸ ¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€¥ÍQ•áÐ¡Ñ•áÐÈ¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€ôì(€Ù…È]¥‘•ÑY¥•Ý•ÍŒ€ô±…ÍÌ•áÑ•¹‘ÌY¥•Ý•ÍŒì(€€€½¹ÍÑÉÕÑ½È¡Á…É•¹Ð°Ý¥‘•Ð°Ù¥•Ü°Á½Ì¤ì(€€€€€±•ÐÍ•±˜°‘½´€ôÝ¥‘•Ð¹ÑåÁ”¹Ñ½=4ì(€€€€€¥˜€¡ÑåÁ•½˜‘½´€ôô€‰™Õ¹Ñ¥½¸ˆ¤(€€€€€€€‘½´€ô‘½´¡Ù¥•Ü°€ ¤€ôøì(€€€€€€€€€¥˜€ …Í•±˜¤(€€€€€€€€€€€É•ÑÕÉ¸Á½Ìì(€€€€€€€€€¥˜€¡Í•±˜¹Á…É•¹Ð¤(€€€€€€€€€€€É•ÑÕÉ¸Í•±˜¹Á…É•¹Ð¹Á½Í	•™½É•¡¥±¡Í•±˜¤ì(€€€€€€€ô¤ì(€€€€€¥˜€ …Ý¥‘•Ð¹ÑåÁ”¹ÍÁ•Œ¹É…Ü¤ì(€€€€€€€±•Ð•±Ð€ô¥Í±Ð¡‘½´¤€ü‘½´€è‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€€€¥˜€¡•±Ð€„ô‘½´¤(€€€€€€€€€•±Ð¹…ÁÁ•¹‘¡¥±¡‘½´¤ì(€€€€€€€¥˜€ …•±Ð¹¡…ÍÑÑÉ¥‰ÕÑ” ‰½¹Ñ•¹Ñ•‘¥Ñ…‰±”ˆ¤¤(€€€€€€€€€•±Ð¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ô€‰™…±Í”ˆì(€€€€€€€•±Ð¹±…ÍÍ1¥ÍÐ¹…‘ ‰AÉ½Í•5¥ÉÉ½ÈµÝ¥‘•Ðˆ¤ì(€€€€€ô(€€€€€ÍÕÁ•È¡Á…É•¹Ð°mt°‘½´°¹Õ±°¤ì(€€€€€Ñ¡¥Ì¹Ý¥‘•Ð€ôÝ¥‘•Ðì(€€€€€Ñ¡¥Ì¹Ý¥‘•Ð€ôÝ¥‘•Ðì(€€€€€Í•±˜€ôÑ¡¥Ìì(€€€ô(€€€µ…Ñ¡•Í]¥‘•Ð¡Ý¥‘•Ð¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹‘¥ÉÑä€ôô9=Q}%IQd€˜˜Ý¥‘•Ð¹ÑåÁ”¹•Ä¡Ñ¡¥Ì¹Ý¥‘•Ð¹ÑåÁ”¤ì(€€€ô(€€€Á…ÉÍ•IÕ±” ¤ì(€€€€€É•ÑÕÉ¸ì¥¹½É”èÑÉÕ”ôì(€€€ô(€€€ÍÑ½ÁÙ•¹Ð¡•Ù•¹Ð¤ì(€€€€€±•ÐÍÑ½À€ôÑ¡¥Ì¹Ý¥‘•Ð¹ÍÁ•Œ¹ÍÑ½ÁÙ•¹Ðì(€€€€€É•ÑÕÉ¸ÍÑ½À€üÍÑ½À¡•Ù•¹Ð¤€è™…±Í”ì(€€€ô(€€€¥¹½É•5ÕÑ…Ñ¥½¸¡µÕÑ…Ñ¥½¸¤ì(€€€€€É•ÑÕÉ¸µÕÑ…Ñ¥½¸¹ÑåÁ”€„ô€‰Í•±•Ñ¥½¸ˆñðÑ¡¥Ì¹Ý¥‘•Ð¹ÍÁ•Œ¹¥¹½É•M•±•Ñ¥½¸ì(€€€ô(€€€‘•ÍÑÉ½ä ¤ì(€€€€€Ñ¡¥Ì¹Ý¥‘•Ð¹ÑåÁ”¹‘•ÍÑÉ½ä¡Ñ¡¥Ì¹‘½´¤ì(€€€€€ÍÕÁ•È¹‘•ÍÑÉ½ä ¤ì(€€€ô(€€€•Ð‘½µÑ½´ ¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€•Ð¥¹½É•½ÉM•±•Ñ¥½¸ ¤ì(€€€€€É•ÑÕÉ¸€„…Ñ¡¥Ì¹Ý¥‘•Ð¹ÑåÁ”¹ÍÁ•Œ¹É•±…á•‘M¥‘”ì(€€€ô(€€€•ÐÍ¥‘” ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹Ý¥‘•Ð¹ÑåÁ”¹Í¥‘”ì(€€€ô(€ôì(€Ù…È½µÁ½Í¥Ñ¥½¹Y¥•Ý•ÍŒ€ô±…ÍÌ•áÑ•¹‘ÌY¥•Ý•ÍŒì(€€€½¹ÍÑÉÕÑ½È¡Á…É•¹Ð°‘½´°Ñ•áÑ=4°Ñ•áÐÈ¤ì(€€€€€ÍÕÁ•È¡Á…É•¹Ð°mt°‘½´°¹Õ±°¤ì(€€€€€Ñ¡¥Ì¹Ñ•áÑ=4€ôÑ•áÑ=4ì(€€€€€Ñ¡¥Ì¹Ñ•áÐ€ôÑ•áÐÈì(€€€ô(€€€•ÐÍ¥é” ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹Ñ•áÐ¹±•¹Ñ ì(€€€ô(€€€±½…±A½ÍÉ½µ=4¡‘½´°½™™Í•Ð¤ì(€€€€€¥˜€¡‘½´€„ôÑ¡¥Ì¹Ñ•áÑ=4¤(€€€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹Á½ÍÑMÑ…ÉÐ€¬€¡½™™Í•Ð€üÑ¡¥Ì¹Í¥é”€è€À¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹Á½ÍÑMÑ…ÉÐ€¬½™™Í•Ðì(€€€ô(€€€‘½µÉ½µA½Ì¡Á½Ì¤ì(€€€€€É•ÑÕÉ¸ì¹½‘”èÑ¡¥Ì¹Ñ•áÑ=4°½™™Í•ÐèÁ½Ìôì(€€€ô(€€€¥¹½É•5ÕÑ…Ñ¥½¸¡µÕÐ¤ì(€€€€€É•ÑÕÉ¸µÕÐ¹ÑåÁ”€ôôô€‰¡…É…Ñ•É…Ñ„ˆ€˜˜µÕÐ¹Ñ…É•Ð¹¹½‘•Y…±Õ”€ôôµÕÐ¹½±‘Y…±Õ”ì(€€€ô(€ôì(€Ù…È5…É­Y¥•Ý•ÍŒ€ô±…ÍÌ}5…É­Y¥•Ý•ÍŒ•áÑ•¹‘ÌY¥•Ý•ÍŒì(€€€½¹ÍÑÉÕÑ½È¡Á…É•¹Ð°µ…É¬°‘½´°½¹Ñ•¹Ñ=4°ÍÁ•Œ¤ì(€€€€€ÍÕÁ•È¡Á…É•¹Ð°mt°‘½´°½¹Ñ•¹Ñ=4¤ì(€€€€€Ñ¡¥Ì¹µ…É¬€ôµ…É¬ì(€€€€€Ñ¡¥Ì¹ÍÁ•Œ€ôÍÁ•Œì(€€€ô(€€€ÍÑ…Ñ¥ŒÉ•…Ñ”¡Á…É•¹Ð°µ…É¬°¥¹±¥¹”°Ù¥•Ü¤ì(€€€€€±•ÐÕÍÑ½´€ôÙ¥•Ü¹¹½‘•Y¥•ÝÍmµ…É¬¹ÑåÁ”¹¹…µ•tì(€€€€€±•ÐÍÁ•Œ€ôÕÍÑ½´€˜˜ÕÍÑ½´¡µ…É¬°Ù¥•Ü°¥¹±¥¹”¤ì(€€€€€¥˜€ …ÍÁ•Œñð€…ÍÁ•Œ¹‘½´¤(€€€€€€€ÍÁ•Œ€ô=5M•É¥…±¥é•ÈÈ¹É•¹‘•ÉMÁ•Œ¡‘½Õµ•¹Ð°µ…É¬¹ÑåÁ”¹ÍÁ•Œ¹Ñ½=4¡µ…É¬°¥¹±¥¹”¤°¹Õ±°°µ…É¬¹…ÑÑÉÌ¤ì(€€€€€É•ÑÕÉ¸¹•Ü}5…É­Y¥•Ý•ÍŒ¡Á…É•¹Ð°µ…É¬°ÍÁ•Œ¹‘½´°ÍÁ•Œ¹½¹Ñ•¹Ñ=4ñðÍÁ•Œ¹‘½´°ÍÁ•Œ¤ì(€€€ô(€€€Á…ÉÍ•IÕ±” ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹‘¥ÉÑä€˜9=}%IQdñðÑ¡¥Ì¹µ…É¬¹ÑåÁ”¹ÍÁ•Œ¹É•Á…ÉÍ•%¹Y¥•Ü¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€É•ÑÕÉ¸ìµ…É¬èÑ¡¥Ì¹µ…É¬¹ÑåÁ”¹¹…µ”°…ÑÑÉÌèÑ¡¥Ì¹µ…É¬¹…ÑÑÉÌ°½¹Ñ•¹Ñ±•µ•¹ÐèÑ¡¥Ì¹½¹Ñ•¹Ñ=4ôì(€€€ô(€€€µ…Ñ¡•Í5…É¬¡µ…É¬¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹‘¥ÉÑä€„ô9=}%IQd€˜˜Ñ¡¥Ì¹µ…É¬¹•Ä¡µ…É¬¤ì(€€€ô(€€€µ…É­¥ÉÑä¡™É½´È°Ñ¼¤ì(€€€€€ÍÕÁ•È¹µ…É­¥ÉÑä¡™É½´È°Ñ¼¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹‘¥ÉÑä€„ô9=Q}%IQd¤ì(€€€€€€€±•ÐÁ…É•¹Ð€ôÑ¡¥Ì¹Á…É•¹Ðì(€€€€€€€Ý¡¥±”€ …Á…É•¹Ð¹¹½‘”¤(€€€€€€€€€Á…É•¹Ð€ôÁ…É•¹Ð¹Á…É•¹Ðì(€€€€€€€¥˜€¡Á…É•¹Ð¹‘¥ÉÑä€ðÑ¡¥Ì¹‘¥ÉÑä¤(€€€€€€€€€Á…É•¹Ð¹‘¥ÉÑä€ôÑ¡¥Ì¹‘¥ÉÑäì(€€€€€€€Ñ¡¥Ì¹‘¥ÉÑä€ô9=Q}%IQdì(€€€€€ô(€€€ô(€€€Í±¥”¡™É½´È°Ñ¼°Ù¥•Ü¤ì(€€€€€±•Ð½ÁäÔ€ô}5…É­Y¥•Ý•ÍŒ¹É•…Ñ”¡Ñ¡¥Ì¹Á…É•¹Ð°Ñ¡¥Ì¹µ…É¬°ÑÉÕ”°Ù¥•Ü¤ì(€€€€€±•Ð¹½‘•Ì€ôÑ¡¥Ì¹¡¥±‘É•¸°Í¥é”È€ôÑ¡¥Ì¹Í¥é”ì(€€€€€¥˜€¡Ñ¼€ðÍ¥é”È¤(€€€€€€€¹½‘•Ì€ôÉ•Á±…•9½‘•Ì¡¹½‘•Ì°Ñ¼°Í¥é”È°Ù¥•Ü¤ì(€€€€€¥˜€¡™É½´È€ø€À¤(€€€€€€€¹½‘•Ì€ôÉ•Á±…•9½‘•Ì¡¹½‘•Ì°€À°™É½´È°Ù¥•Ü¤ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð¹½‘•Ì¹±•¹Ñ ì¤¬¬¤(€€€€€€€¹½‘•Ím¥t¹Á…É•¹Ð€ô½ÁäÔì(€€€€€½ÁäÔ¹¡¥±‘É•¸€ô¹½‘•Ìì(€€€€€É•ÑÕÉ¸½ÁäÔì(€€€ô(€€€¥¹½É•5ÕÑ…Ñ¥½¸¡µÕÑ…Ñ¥½¸¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÍÁ•Œ¹¥¹½É•5ÕÑ…Ñ¥½¸€üÑ¡¥Ì¹ÍÁ•Œ¹¥¹½É•5ÕÑ…Ñ¥½¸¡µÕÑ…Ñ¥½¸¤€èÍÕÁ•È¹¥¹½É•5ÕÑ…Ñ¥½¸¡µÕÑ…Ñ¥½¸¤ì(€€€ô(€€€‘•ÍÑÉ½ä ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹ÍÁ•Œ¹‘•ÍÑÉ½ä¤(€€€€€€€Ñ¡¥Ì¹ÍÁ•Œ¹‘•ÍÑÉ½ä ¤ì(€€€€€ÍÕÁ•È¹‘•ÍÑÉ½ä ¤ì(€€€ô(€ôì(€Ù…È9½‘•Y¥•Ý•ÍŒ€ô±…ÍÌ}9½‘•Y¥•Ý•ÍŒ•áÑ•¹‘ÌY¥•Ý•ÍŒì(€€€½¹ÍÑÉÕÑ½È¡Á…É•¹Ð°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°‘½´°½¹Ñ•¹Ñ=4°¹½‘•=4¤ì(€€€€€ÍÕÁ•È¡Á…É•¹Ð°mt°‘½´°½¹Ñ•¹Ñ=4¤ì(€€€€€Ñ¡¥Ì¹¹½‘”€ô¹½‘”ì(€€€€€Ñ¡¥Ì¹½ÕÑ•É•¼€ô½ÕÑ•É•¼ì(€€€€€Ñ¡¥Ì¹¥¹¹•É•¼€ô¥¹¹•É•¼ì(€€€€€Ñ¡¥Ì¹¹½‘•=4€ô¹½‘•=4ì(€€€ô(€€€€¼¼	ä‘•™…Õ±Ð°„¹½‘”¥ÌÉ•¹‘•É•ÕÍ¥¹œÑ¡”Ñ½=5€µ•Ñ¡½™É½´Ñ¡”(€€€€¼¼¹½‘”ÑåÁ”ÍÁ•Œ¸	ÕÐ±¥•¹Ð½‘”…¸ÕÍ”Ñ¡”¹½‘•Y¥•ÝÍ€ÍÁ•ŒÑ¼(€€€€¼¼ÍÕÁÁ±ä„ÕÍÑ½´¹½‘”Ù¥•Ü°Ý¡¥ …¸¥¹™±Õ•¹”Ù…É¥½ÕÌ…ÍÁ•ÑÌ½˜(€€€€¼¼Ñ¡”Ý…äÑ¡”¹½‘”Ý½É­Ì¸(€€€€¼¼(€€€€¼¼€¡UÍ¥¹œÍÕ‰±…ÍÍ¥¹œ™½ÈÑ¡¥ÌÝ…Ì¥¹Ñ•¹Ñ¥½¹…±±ä‘•¥‘•……¥¹ÍÐ°(€€€€¼¼Í¥¹”¥ÐÉ•ÅÕ¥É”•áÁ½Í¥¹œ„Ý¡½±”Í±•Ü½˜™¥¹¥­ä(€€€€¼¼¥µÁ±•µ•¹Ñ…Ñ¥½¸‘•Ñ…¥±ÌÑ¼Ñ¡”ÕÍ•È½‘”Ñ¡…ÐÑ¡•äÁÉ½‰…‰±äÝ¥±°(€€€€¼¼¹•Ù•È¹••¸¤(€€€ÍÑ…Ñ¥ŒÉ•…Ñ”¡Á…É•¹Ð°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü°Á½Ì¤ì(€€€€€±•ÐÕÍÑ½´€ôÙ¥•Ü¹¹½‘•Y¥•ÝÍm¹½‘”¹ÑåÁ”¹¹…µ•t°‘•Í=‰¨ì(€€€€€±•ÐÍÁ•Œ€ôÕÍÑ½´€˜˜ÕÍÑ½´¡¹½‘”°Ù¥•Ü°€ ¤€ôøì(€€€€€€€¥˜€ …‘•Í=‰¨¤(€€€€€€€€€É•ÑÕÉ¸Á½Ìì(€€€€€€€¥˜€¡‘•Í=‰¨¹Á…É•¹Ð¤(€€€€€€€€€É•ÑÕÉ¸‘•Í=‰¨¹Á…É•¹Ð¹Á½Í	•™½É•¡¥±¡‘•Í=‰¨¤ì(€€€€€ô°½ÕÑ•É•¼°¥¹¹•É•¼¤ì(€€€€€±•Ð‘½´€ôÍÁ•Œ€˜˜ÍÁ•Œ¹‘½´°½¹Ñ•¹Ñ=4€ôÍÁ•Œ€˜˜ÍÁ•Œ¹½¹Ñ•¹Ñ=4ì(€€€€€¥˜€¡¹½‘”¹¥ÍQ•áÐ¤ì(€€€€€€€¥˜€ …‘½´¤(€€€€€€€€€‘½´€ô‘½Õµ•¹Ð¹É•…Ñ•Q•áÑ9½‘”¡¹½‘”¹Ñ•áÐ¤ì(€€€€€€€•±Í”¥˜€ …¥ÍQ•áÐ¡‘½´¤¤(€€€€€€€€€Ñ¡É½Ü¹•ÜI…¹•ÉÉ½È ‰Q•áÐµÕÍÐ‰”É•¹‘•É•…Ì„=4Ñ•áÐ¹½‘”ˆ¤ì(€€€€€ô•±Í”¥˜€ …‘½´¤ì(€€€€€€€±•ÐÍÁ•ŒÈ€ô=5M•É¥…±¥é•ÈÈ¹É•¹‘•ÉMÁ•Œ¡‘½Õµ•¹Ð°¹½‘”¹ÑåÁ”¹ÍÁ•Œ¹Ñ½=4¡¹½‘”¤°¹Õ±°°¹½‘”¹…ÑÑÉÌ¤ì(€€€€€€€€¡ì‘½´°½¹Ñ•¹Ñ=4ô€ôÍÁ•ŒÈ¤ì(€€€€€ô(€€€€€¥˜€ …½¹Ñ•¹Ñ=4€˜˜€…¹½‘”¹¥ÍQ•áÐ€˜˜‘½´¹¹½‘•9…µ”€„ô€‰	Hˆ¤ì(€€€€€€€¥˜€ …‘½´¹¡…ÍÑÑÉ¥‰ÕÑ” ‰½¹Ñ•¹Ñ•‘¥Ñ…‰±”ˆ¤¤(€€€€€€€€€‘½´¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ô€‰™…±Í”ˆì(€€€€€€€¥˜€¡¹½‘”¹ÑåÁ”¹ÍÁ•Œ¹‘É……‰±”¤(€€€€€€€€€‘½´¹‘É……‰±”€ôÑÉÕ”ì(€€€€€ô(€€€€€±•Ð¹½‘•=4€ô‘½´ì(€€€€€‘½´€ô…ÁÁ±å=ÕÑ•É•¼¡‘½´°½ÕÑ•É•¼°¹½‘”¤ì(€€€€€¥˜€¡ÍÁ•Œ¤(€€€€€€€É•ÑÕÉ¸‘•Í=‰¨€ô¹•ÜÕÍÑ½µ9½‘•Y¥•Ý•ÍŒ¡Á…É•¹Ð°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°‘½´°½¹Ñ•¹Ñ=4ñð¹Õ±°°¹½‘•=4°ÍÁ•Œ¤ì(€€€€€•±Í”¥˜€¡¹½‘”¹¥ÍQ•áÐ¤(€€€€€€€É•ÑÕÉ¸¹•ÜQ•áÑY¥•Ý•ÍŒ¡Á…É•¹Ð°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°‘½´°¹½‘•=4¤ì(€€€€€•±Í”(€€€€€€€É•ÑÕÉ¸¹•Ü}9½‘•Y¥•Ý•ÍŒ¡Á…É•¹Ð°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°‘½´°½¹Ñ•¹Ñ=4ñð¹Õ±°°¹½‘•=4¤ì(€€€ô(€€€Á…ÉÍ•IÕ±”¡…‘‘•‘9½‘•Ì¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹¹½‘”¹ÑåÁ”¹ÍÁ•Œ¹É•Á…ÉÍ•%¹Y¥•Ü¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€±•ÐÉÕ±”€ôì¹½‘”èÑ¡¥Ì¹¹½‘”¹ÑåÁ”¹¹…µ”°…ÑÑÉÌèÑ¡¥Ì¹¹½‘”¹…ÑÑÉÌôì(€€€€€¥˜€¡Ñ¡¥Ì¹¹½‘”¹ÑåÁ”¹Ý¡¥Ñ•ÍÁ…”€ôô€‰ÁÉ”ˆ¤(€€€€€€€ÉÕ±”¹ÁÉ•Í•ÉÙ•]¡¥Ñ•ÍÁ…”€ô€‰™Õ±°ˆì(€€€€€¥˜€ …Ñ¡¥Ì¹½¹Ñ•¹Ñ=4¤ì(€€€€€€€ÉÕ±”¹•Ñ½¹Ñ•¹Ð€ô€ ¤€ôøÑ¡¥Ì¹¹½‘”¹½¹Ñ•¹Ðì(€€€€€ô•±Í”¥˜€ …Ñ¡¥Ì¹½¹Ñ•¹Ñ1½ÍÐ¤ì(€€€€€€€ÉÕ±”¹½¹Ñ•¹Ñ±•µ•¹Ð€ôÑ¡¥Ì¹½¹Ñ•¹Ñ=4ì(€€€€€ô•±Í”ì(€€€€€€€™½È€¡±•Ð¤€ôÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ €´€Äì¤€øô€Àì¤´´¤ì(€€€€€€€€€±•Ð¡¥±€ôÑ¡¥Ì¹¡¥±‘É•¹m¥tì(€€€€€€€€€¥˜€¡Ñ¡¥Ì¹‘½´¹½¹Ñ…¥¹Ì¡¡¥±¹‘½´¹Á…É•¹Ñ9½‘”¤¤ì(€€€€€€€€€€€ÉÕ±”¹½¹Ñ•¹Ñ±•µ•¹Ð€ô¡¥±¹‘½´¹Á…É•¹Ñ9½‘”ì(€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€¥˜€ …ÉÕ±”¹½¹Ñ•¹Ñ±•µ•¹Ð¤ì(€€€€€€€€€±•Ð™½Õ¹Ì€ô…‘‘•‘9½‘•Ì€˜˜…‘‘•‘9½‘•Ì¹™¥¹ ¡¸¤€ôø¥Í±Ð¡¸¤€˜˜…‘‘•‘9½‘•Ì¹¥¹‘•á=˜¡¸¹Á…É•¹Ñ9½‘”¤€ð€À€˜˜Ñ¡¥Ì¹‘½´¹½¹Ñ…¥¹Ì¡¸¤¤ì(€€€€€€€€€¥˜€¡™½Õ¹Ì¤(€€€€€€€€€€€ÉÕ±”¹½¹Ñ•¹Ñ±•µ•¹Ð€ô™½Õ¹Ìì(€€€€€€€€€•±Í”(€€€€€€€€€€€ÉÕ±”¹•Ñ½¹Ñ•¹Ð€ô€ ¤€ôøÉ…µ•¹ÐÈ¹•µÁÑäì(€€€€€€€ô(€€€€€ô(€€€€€É•ÑÕÉ¸ÉÕ±”ì(€€€ô(€€€µ…Ñ¡•Í9½‘”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹‘¥ÉÑä€ôô9=Q}%IQd€˜˜¹½‘”¹•Ä¡Ñ¡¥Ì¹¹½‘”¤€˜˜Í…µ•=ÕÑ•É•¼¡½ÕÑ•É•¼°Ñ¡¥Ì¹½ÕÑ•É•¼¤€˜˜¥¹¹•É•¼¹•Ä¡Ñ¡¥Ì¹¥¹¹•É•¼¤ì(€€€ô(€€€•ÐÍ¥é” ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹¹½‘”¹¹½‘•M¥é”ì(€€€ô(€€€•Ð‰½É‘•È ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹¹½‘”¹¥Í1•…˜€ü€À€è€Äì(€€€ô(€€€€¼¼Må¹ÌÑ¡¥Ì¹¡¥±‘É•¹€Ñ¼µ…Ñ Ñ¡¥Ì¹¹½‘”¹½¹Ñ•¹Ñ€…¹Ñ¡”±½…°(€€€€¼¼‘•½É…Ñ¥½¹Ì°Á½ÍÍ¥‰±ä¥¹ÑÉ½‘Õ¥¹œ¹•ÍÑ¥¹œ™½Èµ…É­Ì¸Q¡•¸°¥¸„(€€€€¼¼Í•Á…É…Ñ”ÍÑ•À°Íå¹ÌÑ¡”=4¥¹Í¥‘”Ñ¡¥Ì¹½¹Ñ•¹Ñ=5€Ñ¼(€€€€¼¼Ñ¡¥Ì¹¡¥±‘É•¹€¸(€€€ÕÁ‘…Ñ•¡¥±‘É•¸¡Ù¥•Ü°Á½Ì¤ì(€€€€€±•Ð¥¹±¥¹”€ôÑ¡¥Ì¹¹½‘”¹¥¹±¥¹•½¹Ñ•¹Ð°½™˜€ôÁ½Ìì(€€€€€±•Ð½µÁ½Í¥Ñ¥½¸€ôÙ¥•Ü¹½µÁ½Í¥¹œ€üÑ¡¥Ì¹±½…±½µÁ½Í¥Ñ¥½¹%¹™¼¡Ù¥•Ü°Á½Ì¤€è¹Õ±°ì(€€€€€±•Ð±½…±½µÁ½Í¥Ñ¥½¸€ô½µÁ½Í¥Ñ¥½¸€˜˜½µÁ½Í¥Ñ¥½¸¹Á½Ì€ø€´Ä€ü½µÁ½Í¥Ñ¥½¸€è¹Õ±°ì(€€€€€±•Ð½µÁ½Í¥Ñ¥½¹%¹¡¥±€ô½µÁ½Í¥Ñ¥½¸€˜˜½µÁ½Í¥Ñ¥½¸¹Á½Ì€ð€Àì(€€€€€±•ÐÕÁ‘…Ñ•È€ô¹•ÜY¥•ÝQÉ••UÁ‘…Ñ•È¡Ñ¡¥Ì°±½…±½µÁ½Í¥Ñ¥½¸€˜˜±½…±½µÁ½Í¥Ñ¥½¸¹¹½‘”°Ù¥•Ü¤ì(€€€€€±•Ð…‘‘	Õ™™•ÉÌ€ôÑ¡¥Ì¹¹½‘”¹¥¹±¥¹•½¹Ñ•¹Ð°…Ñ	Õ™™•ÉA½Ì€ô…‘‘	Õ™™•ÉÌ€˜˜Ñ¡¥Ì¹¹½‘”¹¥Í	±½¬ì(€€€€€¥Ñ•É•¼¡Ñ¡¥Ì¹¹½‘”°Ñ¡¥Ì¹¥¹¹•É•¼°€¡Ý¥‘•Ð°¤°¥¹Í¥‘•9½‘”¤€ôøì(€€€€€€€¥˜€¡Ý¥‘•Ð¹ÍÁ•Œ¹µ…É­Ì¤(€€€€€€€€€ÕÁ‘…Ñ•È¹Íå¹Q½5…É­Ì¡Ý¥‘•Ð¹ÍÁ•Œ¹µ…É­Ì°¥¹±¥¹”°Ù¥•Ü°¤¤ì(€€€€€€€•±Í”¥˜€¡Ý¥‘•Ð¹ÑåÁ”¹Í¥‘”€øô€À€˜˜€…¥¹Í¥‘•9½‘”¤(€€€€€€€€€ÕÁ‘…Ñ•È¹Íå¹Q½5…É­Ì¡¤€ôôÑ¡¥Ì¹¹½‘”¹¡¥±‘½Õ¹Ð€ü5…É¬È¹¹½¹”€èÑ¡¥Ì¹¹½‘”¹¡¥±¡¤¤¹µ…É­Ì°¥¹±¥¹”°Ù¥•Ü°¤¤ì(€€€€€€€ÕÁ‘…Ñ•È¹Á±…•]¥‘•Ð¡Ý¥‘•Ð°Ù¥•Ü°½™˜¤ì(€€€€€ô°€¡¡¥±°½ÕÑ•É•¼°¥¹¹•É•¼°¤¤€ôøì(€€€€€€€ÕÁ‘…Ñ•È¹Íå¹Q½5…É­Ì¡¡¥±¹µ…É­Ì°¥¹±¥¹”°Ù¥•Ü°¤¤ì(€€€€€€€¥˜€¡…Ñ	Õ™™•ÉA½Ì€˜˜¡¥±¹¥ÍÑ½´€˜˜€…¡¥±¹¥ÍQ•áÐ¤(€€€€€€€€€ÕÁ‘…Ñ•È¹…‘‘!…­9½‘” ‰%5ˆ°ÕÁ‘…Ñ•È¹Ñ½À¤ì(€€€€€€€±•Ð½µÁ%¹‘•àì(€€€€€€€¥˜€¡ÕÁ‘…Ñ•È¹™¥¹‘9½‘•5…Ñ ¡¡¥±°½ÕÑ•É•¼°¥¹¹•É•¼°¤¤¤€ì(€€€€€€€•±Í”¥˜€¡½µÁ½Í¥Ñ¥½¹%¹¡¥±€˜˜Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´€ø½™˜€˜˜Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼€ð½™˜€¬¡¥±¹¹½‘•M¥é”€˜˜€¡½µÁ%¹‘•à€ôÕÁ‘…Ñ•È¹™¥¹‘%¹‘•á]¥Ñ¡¡¥±¡½µÁ½Í¥Ñ¥½¸¹¹½‘”¤¤€ø€´Ä€˜˜ÕÁ‘…Ñ•È¹ÕÁ‘…Ñ•9½‘•Ð¡¡¥±°½ÕÑ•É•¼°¥¹¹•É•¼°½µÁ%¹‘•à°Ù¥•Ü¤¤€ì(€€€€€€€•±Í”¥˜€¡ÕÁ‘…Ñ•È¹ÕÁ‘…Ñ•9•áÑ9½‘”¡¡¥±°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü°¤°½™˜¤¤€ì(€€€€€€€•±Í”ì(€€€€€€€€€ÕÁ‘…Ñ•È¹…‘‘9½‘”¡¡¥±°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü°½™˜¤ì(€€€€€€€ô(€€€€€€€½™˜€¬ô¡¥±¹¹½‘•M¥é”ì(€€€€€€€¥˜€¡…‘‘	Õ™™•ÉÌ¤(€€€€€€€€€…Ñ	Õ™™•ÉA½Ì€ô¡¥±¹¥ÍÑ½´€˜˜€…¡¥±¹¥ÍQ•áÐì(€€€€€ô¤ì(€€€€€ÕÁ‘…Ñ•È¹Íå¹Q½5…É­Ì¡mt°¥¹±¥¹”°Ù¥•Ü°€À¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹¹½‘”¹¥ÍQ•áÑ‰±½¬¤(€€€€€€€ÕÁ‘…Ñ•È¹…‘‘Q•áÑ‰±½­!…­Ì ¤ì(€€€€€ÕÁ‘…Ñ•È¹‘•ÍÑÉ½åI•ÍÐ ¤ì(€€€€€¥˜€¡ÕÁ‘…Ñ•È¹¡…¹•ñðÑ¡¥Ì¹‘¥ÉÑä€ôô=9Q9Q}%IQd¤ì(€€€€€€€¥˜€¡±½…±½µÁ½Í¥Ñ¥½¸¤(€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Ñ•Ñ1½…±½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü°±½…±½µÁ½Í¥Ñ¥½¸¤ì(€€€€€€€É•¹‘•É•ÍÌ¡Ñ¡¥Ì¹½¹Ñ•¹Ñ=4°Ñ¡¥Ì¹¡¥±‘É•¸°Ù¥•Ü¤ì(€€€€€€€¥˜€¡¥½Ì¤(€€€€€€€€€¥½Í!…­Ì¡Ñ¡¥Ì¹‘½´¤ì(€€€€€ô(€€€ô(€€€±½…±½µÁ½Í¥Ñ¥½¹%¹™¼¡Ù¥•Ü°Á½Ì¤ì(€€€€€±•Ðì™É½´è™É½´È°Ñ¼ô€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€€€¥˜€ „¡Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¥¹ÍÑ…¹•½˜Q•áÑM•±•Ñ¥½¸¤ñð™É½´È€ðÁ½ÌñðÑ¼€øÁ½Ì€¬Ñ¡¥Ì¹¹½‘”¹½¹Ñ•¹Ð¹Í¥é”¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€±•ÐÑ•áÑ9½‘”€ôÙ¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹9½‘”ì(€€€€€¥˜€ …Ñ•áÑ9½‘”ñð€…Ñ¡¥Ì¹‘½´¹½¹Ñ…¥¹Ì¡Ñ•áÑ9½‘”¹Á…É•¹Ñ9½‘”¤¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€¥˜€¡Ñ¡¥Ì¹¹½‘”¹¥¹±¥¹•½¹Ñ•¹Ð¤ì(€€€€€€€±•ÐÑ•áÐÈ€ôÑ•áÑ9½‘”¹¹½‘•Y…±Õ”ì(€€€€€€€±•ÐÑ•áÑA½Ì€ô™¥¹‘Q•áÑ%¹É…µ•¹Ð¡Ñ¡¥Ì¹¹½‘”¹½¹Ñ•¹Ð°Ñ•áÐÈ°™É½´È€´Á½Ì°Ñ¼€´Á½Ì¤ì(€€€€€€€É•ÑÕÉ¸Ñ•áÑA½Ì€ð€À€ü¹Õ±°€èì¹½‘”èÑ•áÑ9½‘”°Á½ÌèÑ•áÑA½Ì°Ñ•áÐèÑ•áÐÈôì(€€€€€ô•±Í”ì(€€€€€€€É•ÑÕÉ¸ì¹½‘”èÑ•áÑ9½‘”°Á½Ìè€´Ä°Ñ•áÐè€ˆˆôì(€€€€€ô(€€€ô(€€€ÁÉ½Ñ•Ñ1½…±½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü°ì¹½‘”°Á½Ì°Ñ•áÐèÑ•áÐÈô¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹•Ñ•ÍŒ¡¹½‘”¤¤(€€€€€€€É•ÑÕÉ¸ì(€€€€€±•ÐÑ½Á9½‘”€ô¹½‘”ì(€€€€€™½È€ ì€ìÑ½Á9½‘”€ôÑ½Á9½‘”¹Á…É•¹Ñ9½‘”¤ì(€€€€€€€¥˜€¡Ñ½Á9½‘”¹Á…É•¹Ñ9½‘”€ôôÑ¡¥Ì¹½¹Ñ•¹Ñ=4¤(€€€€€€€€€‰É•…¬ì(€€€€€€€Ý¡¥±”€¡Ñ½Á9½‘”¹ÁÉ•Ù¥½ÕÍM¥‰±¥¹œ¤(€€€€€€€€€Ñ½Á9½‘”¹Á…É•¹Ñ9½‘”¹É•µ½Ù•¡¥±¡Ñ½Á9½‘”¹ÁÉ•Ù¥½ÕÍM¥‰±¥¹œ¤ì(€€€€€€€Ý¡¥±”€¡Ñ½Á9½‘”¹¹•áÑM¥‰±¥¹œ¤(€€€€€€€€€Ñ½Á9½‘”¹Á…É•¹Ñ9½‘”¹É•µ½Ù•¡¥±¡Ñ½Á9½‘”¹¹•áÑM¥‰±¥¹œ¤ì(€€€€€€€¥˜€¡Ñ½Á9½‘”¹ÁµY¥•Ý•ÍŒ¤(€€€€€€€€€Ñ½Á9½‘”¹ÁµY¥•Ý•ÍŒ€ôÙ½¥€Àì(€€€€€ô(€€€€€±•Ð‘•ÍŒ€ô¹•Ü½µÁ½Í¥Ñ¥½¹Y¥•Ý•ÍŒ¡Ñ¡¥Ì°Ñ½Á9½‘”°¹½‘”°Ñ•áÐÈ¤ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹9½‘•Ì¹ÁÕÍ ¡‘•ÍŒ¤ì(€€€€€Ñ¡¥Ì¹¡¥±‘É•¸€ôÉ•Á±…•9½‘•Ì¡Ñ¡¥Ì¹¡¥±‘É•¸°Á½Ì°Á½Ì€¬Ñ•áÐÈ¹±•¹Ñ °Ù¥•Ü°‘•ÍŒ¤ì(€€€ô(€€€€¼¼%˜Ñ¡¥Ì‘•ÍŒµÕÍÐ‰”ÕÁ‘…Ñ•Ñ¼µ…Ñ Ñ¡”¥Ù•¸¹½‘”‘•½É…Ñ¥½¸°(€€€€¼¼‘¼Í¼…¹É•ÑÕÉ¸ÑÉÕ”¸(€€€ÕÁ‘…Ñ”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹‘¥ÉÑä€ôô9=}%IQdñð€…¹½‘”¹Í…µ•5…É­ÕÀ¡Ñ¡¥Ì¹¹½‘”¤¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•%¹¹•È¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€ÕÁ‘…Ñ•%¹¹•È¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü¤ì(€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•=ÕÑ•É•¼¡½ÕÑ•É•¼¤ì(€€€€€Ñ¡¥Ì¹¹½‘”€ô¹½‘”ì(€€€€€Ñ¡¥Ì¹¥¹¹•É•¼€ô¥¹¹•É•¼ì(€€€€€¥˜€¡Ñ¡¥Ì¹½¹Ñ•¹Ñ=4¤(€€€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•¡¥±‘É•¸¡Ù¥•Ü°Ñ¡¥Ì¹Á½ÍÑMÑ…ÉÐ¤ì(€€€€€Ñ¡¥Ì¹‘¥ÉÑä€ô9=Q}%IQdì(€€€ô(€€€ÕÁ‘…Ñ•=ÕÑ•É•¼¡½ÕÑ•É•¼¤ì(€€€€€¥˜€¡Í…µ•=ÕÑ•É•¼¡½ÕÑ•É•¼°Ñ¡¥Ì¹½ÕÑ•É•¼¤¤(€€€€€€€É•ÑÕÉ¸ì(€€€€€±•Ð¹••‘Í]É…À€ô€…¥Í±Ð¡Ñ¡¥Ì¹¹½‘•=4¤ì(€€€€€±•Ð½±‘=4€ôÑ¡¥Ì¹‘½´ì(€€€€€Ñ¡¥Ì¹‘½´€ôÁ…Ñ¡=ÕÑ•É•¼¡Ñ¡¥Ì¹‘½´°Ñ¡¥Ì¹¹½‘•=4°½µÁÕÑ•=ÕÑ•É•¼¡Ñ¡¥Ì¹½ÕÑ•É•¼°Ñ¡¥Ì¹¹½‘”°¹••‘Í]É…À¤°½µÁÕÑ•=ÕÑ•É•¼¡½ÕÑ•É•¼°Ñ¡¥Ì¹¹½‘”°¹••‘Í]É…À¤¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹‘½´€„ô½±‘=4¤ì(€€€€€€€½±‘=4¹ÁµY¥•Ý•ÍŒ€ôÙ½¥€Àì(€€€€€€€Ñ¡¥Ì¹‘½´¹ÁµY¥•Ý•ÍŒ€ôÑ¡¥Ìì(€€€€€ô(€€€€€Ñ¡¥Ì¹½ÕÑ•É•¼€ô½ÕÑ•É•¼ì(€€€ô(€€€€¼¼5…É¬Ñ¡¥Ì¹½‘”…Ì‰•¥¹œÑ¡”Í•±•Ñ•¹½‘”¸(€€€Í•±•Ñ9½‘” ¤ì(€€€€€¥˜€¡¥Í±Ð¡Ñ¡¥Ì¹¹½‘•=4¤¤ì(€€€€€€€Ñ¡¥Ì¹¹½‘•=4¹±…ÍÍ1¥ÍÐ¹…‘ ‰AÉ½Í•5¥ÉÉ½ÈµÍ•±•Ñ•‘¹½‘”ˆ¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹½¹Ñ•¹Ñ=4ñð€…Ñ¡¥Ì¹¹½‘”¹ÑåÁ”¹ÍÁ•Œ¹‘É……‰±”¤(€€€€€€€€€Ñ¡¥Ì¹¹½‘•=4¹‘É……‰±”€ôÑÉÕ”ì(€€€€€ô(€€€ô(€€€€¼¼I•µ½Ù”Í•±•Ñ•¹½‘”µ…É­¥¹œ™É½´Ñ¡¥Ì¹½‘”¸(€€€‘•Í•±•Ñ9½‘” ¤ì(€€€€€¥˜€¡¥Í±Ð¡Ñ¡¥Ì¹¹½‘•=4¤¤ì(€€€€€€€Ñ¡¥Ì¹¹½‘•=4¹±…ÍÍ1¥ÍÐ¹É•µ½Ù” ‰AÉ½Í•5¥ÉÉ½ÈµÍ•±•Ñ•‘¹½‘”ˆ¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹½¹Ñ•¹Ñ=4ñð€…Ñ¡¥Ì¹¹½‘”¹ÑåÁ”¹ÍÁ•Œ¹‘É……‰±”¤(€€€€€€€€€Ñ¡¥Ì¹¹½‘•=4¹É•µ½Ù•ÑÑÉ¥‰ÕÑ” ‰‘É……‰±”ˆ¤ì(€€€€€ô(€€€ô(€€€•Ð‘½µÑ½´ ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹¹½‘”¹¥ÍÑ½´ì(€€€ô(€ôì(€™Õ¹Ñ¥½¸‘½Y¥•Ý•ÍŒ¡‘½ŒÔ°½ÕÑ•É•¼°¥¹¹•É•¼°‘½´°Ù¥•Ü¤ì(€€€…ÁÁ±å=ÕÑ•É•¼¡‘½´°½ÕÑ•É•¼°‘½ŒÔ¤ì(€€€±•Ð‘½Y¥•Ü€ô¹•Ü9½‘•Y¥•Ý•ÍŒ¡Ù½¥€À°‘½ŒÔ°½ÕÑ•É•¼°¥¹¹•É•¼°‘½´°‘½´°‘½´¤ì(€€€¥˜€¡‘½Y¥•Ü¹½¹Ñ•¹Ñ=4¤(€€€€€‘½Y¥•Ü¹ÕÁ‘…Ñ•¡¥±‘É•¸¡Ù¥•Ü°€À¤ì(€€€É•ÑÕÉ¸‘½Y¥•Üì(€ô(€Ù…ÈQ•áÑY¥•Ý•ÍŒ€ô±…ÍÌ}Q•áÑY¥•Ý•ÍŒ•áÑ•¹‘Ì9½‘•Y¥•Ý•ÍŒì(€€€½¹ÍÑÉÕÑ½È¡Á…É•¹Ð°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°‘½´°¹½‘•=4¤ì(€€€€€ÍÕÁ•È¡Á…É•¹Ð°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°‘½´°¹Õ±°°¹½‘•=4¤ì(€€€ô(€€€Á…ÉÍ•IÕ±” ¤ì(€€€€€±•ÐÍ­¥À€ôÑ¡¥Ì¹¹½‘•=4¹Á…É•¹Ñ9½‘”ì(€€€€€Ý¡¥±”€¡Í­¥À€˜˜Í­¥À€„ôÑ¡¥Ì¹‘½´€˜˜€…Í­¥À¹Áµ%Í•¼¤(€€€€€€€Í­¥À€ôÍ­¥À¹Á…É•¹Ñ9½‘”ì(€€€€€É•ÑÕÉ¸ìÍ­¥ÀèÍ­¥ÀñðÑÉÕ”ôì(€€€ô(€€€ÕÁ‘…Ñ”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹‘¥ÉÑä€ôô9=}%IQdñðÑ¡¥Ì¹‘¥ÉÑä€„ô9=Q}%IQd€˜˜€…Ñ¡¥Ì¹¥¹A…É•¹Ð ¤ñð€…¹½‘”¹Í…µ•5…É­ÕÀ¡Ñ¡¥Ì¹¹½‘”¤¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•=ÕÑ•É•¼¡½ÕÑ•É•¼¤ì(€€€€€¥˜€ ¡Ñ¡¥Ì¹‘¥ÉÑä€„ô9=Q}%IQdñð¹½‘”¹Ñ•áÐ€„ôÑ¡¥Ì¹¹½‘”¹Ñ•áÐ¤€˜˜¹½‘”¹Ñ•áÐ€„ôÑ¡¥Ì¹¹½‘•=4¹¹½‘•Y…±Õ”¤ì(€€€€€€€Ñ¡¥Ì¹¹½‘•=4¹¹½‘•Y…±Õ”€ô¹½‘”¹Ñ•áÐì(€€€€€€€¥˜€¡Ù¥•Ü¹ÑÉ…­]É¥Ñ•Ì€ôôÑ¡¥Ì¹¹½‘•=4¤(€€€€€€€€€Ù¥•Ü¹ÑÉ…­]É¥Ñ•Ì€ô¹Õ±°ì(€€€€€ô(€€€€€Ñ¡¥Ì¹¹½‘”€ô¹½‘”ì(€€€€€Ñ¡¥Ì¹‘¥ÉÑä€ô9=Q}%IQdì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€¥¹A…É•¹Ð ¤ì(€€€€€±•ÐÁ…É•¹Ñ=4€ôÑ¡¥Ì¹Á…É•¹Ð¹½¹Ñ•¹Ñ=4ì(€€€€€™½È€¡±•Ð¸€ôÑ¡¥Ì¹¹½‘•=4ì¸ì¸€ô¸¹Á…É•¹Ñ9½‘”¤(€€€€€€€¥˜€¡¸€ôôÁ…É•¹Ñ=4¤(€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€‘½µÉ½µA½Ì¡Á½Ì¤ì(€€€€€É•ÑÕÉ¸ì¹½‘”èÑ¡¥Ì¹¹½‘•=4°½™™Í•ÐèÁ½Ìôì(€€€ô(€€€±½…±A½ÍÉ½µ=4¡‘½´°½™™Í•Ð°‰¥…Ì¤ì(€€€€€¥˜€¡‘½´€ôôÑ¡¥Ì¹¹½‘•=4¤(€€€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹Á½ÍÑMÑ…ÉÐ€¬5…Ñ ¹µ¥¸¡½™™Í•Ð°Ñ¡¥Ì¹¹½‘”¹Ñ•áÐ¹±•¹Ñ ¤ì(€€€€€É•ÑÕÉ¸ÍÕÁ•È¹±½…±A½ÍÉ½µ=4¡‘½´°½™™Í•Ð°‰¥…Ì¤ì(€€€ô(€€€¥¹½É•5ÕÑ…Ñ¥½¸¡µÕÑ…Ñ¥½¸¤ì(€€€€€É•ÑÕÉ¸µÕÑ…Ñ¥½¸¹ÑåÁ”€„ô€‰¡…É…Ñ•É…Ñ„ˆ€˜˜µÕÑ…Ñ¥½¸¹ÑåÁ”€„ô€‰Í•±•Ñ¥½¸ˆì(€€€ô(€€€Í±¥”¡™É½´È°Ñ¼°}Ù¥•Ü¤ì(€€€€€±•Ð¹½‘”€ôÑ¡¥Ì¹¹½‘”¹ÕÐ¡™É½´È°Ñ¼¤°‘½´€ô‘½Õµ•¹Ð¹É•…Ñ•Q•áÑ9½‘”¡¹½‘”¹Ñ•áÐ¤ì(€€€€€É•ÑÕÉ¸¹•Ü}Q•áÑY¥•Ý•ÍŒ¡Ñ¡¥Ì¹Á…É•¹Ð°¹½‘”°Ñ¡¥Ì¹½ÕÑ•É•¼°Ñ¡¥Ì¹¥¹¹•É•¼°‘½´°‘½´¤ì(€€€ô(€€€µ…É­¥ÉÑä¡™É½´È°Ñ¼¤ì(€€€€€ÍÕÁ•È¹µ…É­¥ÉÑä¡™É½´È°Ñ¼¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹‘½´€„ôÑ¡¥Ì¹¹½‘•=4€˜˜€¡™É½´È€ôô€ÀñðÑ¼€ôôÑ¡¥Ì¹¹½‘•=4¹¹½‘•Y…±Õ”¹±•¹Ñ ¤¤(€€€€€€€Ñ¡¥Ì¹‘¥ÉÑä€ô9=}%IQdì(€€€ô(€€€•Ð‘½µÑ½´ ¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€¥ÍQ•áÐ¡Ñ•áÐÈ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹¹½‘”¹Ñ•áÐ€ôôÑ•áÐÈì(€€€ô(€ôì(€Ù…È	Õ™™•É!…­Y¥•Ý•ÍŒ€ô±…ÍÌ•áÑ•¹‘ÌY¥•Ý•ÍŒì(€€€Á…ÉÍ•IÕ±” ¤ì(€€€€€É•ÑÕÉ¸ì¥¹½É”èÑÉÕ”ôì(€€€ô(€€€µ…Ñ¡•Í!…¬¡¹½‘•9…µ”¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹‘¥ÉÑä€ôô9=Q}%IQd€˜˜Ñ¡¥Ì¹‘½´¹¹½‘•9…µ”€ôô¹½‘•9…µ”ì(€€€ô(€€€•Ð‘½µÑ½´ ¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€•Ð¥¹½É•½É½½É‘Ì ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹‘½´¹¹½‘•9…µ”€ôô€‰%5ˆì(€€€ô(€ôì(€Ù…ÈÕÍÑ½µ9½‘•Y¥•Ý•ÍŒ€ô±…ÍÌ•áÑ•¹‘Ì9½‘•Y¥•Ý•ÍŒì(€€€½¹ÍÑÉÕÑ½È¡Á…É•¹Ð°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°‘½´°½¹Ñ•¹Ñ=4°¹½‘•=4°ÍÁ•Œ¤ì(€€€€€ÍÕÁ•È¡Á…É•¹Ð°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°‘½´°½¹Ñ•¹Ñ=4°¹½‘•=4¤ì(€€€€€Ñ¡¥Ì¹ÍÁ•Œ€ôÍÁ•Œì(€€€ô(€€€€¼¼ÕÍÑ½´ÕÁ‘…Ñ•€µ•Ñ¡½•ÑÌÑ¼‘•¥‘”Ý¡•Ñ¡•ÈÑ¡”ÕÁ‘…Ñ”½•Ì(€€€€¼¼Ñ¡É½Õ ¸%˜¥Ð‘½•Ì°…¹Ñ¡•É”Ì„½¹Ñ•¹Ñ=5€¹½‘”°½ÕÈ±½¥Œ(€€€€¼¼ÕÁ‘…Ñ•ÌÑ¡”¡¥±‘É•¸¸(€€€ÕÁ‘…Ñ”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹‘¥ÉÑä€ôô9=}%IQd¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€¥˜€¡Ñ¡¥Ì¹ÍÁ•Œ¹ÕÁ‘…Ñ”€˜˜€¡Ñ¡¥Ì¹¹½‘”¹ÑåÁ”€ôô¹½‘”¹ÑåÁ”ñðÑ¡¥Ì¹ÍÁ•Œ¹µÕ±Ñ¥QåÁ”¤¤ì(€€€€€€€±•ÐÉ•ÍÕ±Ð€ôÑ¡¥Ì¹ÍÁ•Œ¹ÕÁ‘…Ñ”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼¤ì(€€€€€€€¥˜€¡É•ÍÕ±Ð¤(€€€€€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•%¹¹•È¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü¤ì(€€€€€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€€€€€ô•±Í”¥˜€ …Ñ¡¥Ì¹½¹Ñ•¹Ñ=4€˜˜€…¹½‘”¹¥Í1•…˜¤ì(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€ô•±Í”ì(€€€€€€€É•ÑÕÉ¸ÍÕÁ•È¹ÕÁ‘…Ñ”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü¤ì(€€€€€ô(€€€ô(€€€Í•±•Ñ9½‘” ¤ì(€€€€€Ñ¡¥Ì¹ÍÁ•Œ¹Í•±•Ñ9½‘”€üÑ¡¥Ì¹ÍÁ•Œ¹Í•±•Ñ9½‘” ¤€èÍÕÁ•È¹Í•±•Ñ9½‘” ¤ì(€€€ô(€€€‘•Í•±•Ñ9½‘” ¤ì(€€€€€Ñ¡¥Ì¹ÍÁ•Œ¹‘•Í•±•Ñ9½‘”€üÑ¡¥Ì¹ÍÁ•Œ¹‘•Í•±•Ñ9½‘” ¤€èÍÕÁ•È¹‘•Í•±•Ñ9½‘” ¤ì(€€€ô(€€€Í•ÑM•±•Ñ¥½¸¡…¹¡½È°¡•…°Ù¥•Ü°™½É”¤ì(€€€€€Ñ¡¥Ì¹ÍÁ•Œ¹Í•ÑM•±•Ñ¥½¸€üÑ¡¥Ì¹ÍÁ•Œ¹Í•ÑM•±•Ñ¥½¸¡…¹¡½È°¡•…°Ù¥•Ü¹É½½Ð¤€èÍÕÁ•È¹Í•ÑM•±•Ñ¥½¸¡…¹¡½È°¡•…°Ù¥•Ü°™½É”¤ì(€€€ô(€€€‘•ÍÑÉ½ä ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹ÍÁ•Œ¹‘•ÍÑÉ½ä¤(€€€€€€€Ñ¡¥Ì¹ÍÁ•Œ¹‘•ÍÑÉ½ä ¤ì(€€€€€ÍÕÁ•È¹‘•ÍÑÉ½ä ¤ì(€€€ô(€€€ÍÑ½ÁÙ•¹Ð¡•Ù•¹Ð¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÍÁ•Œ¹ÍÑ½ÁÙ•¹Ð€üÑ¡¥Ì¹ÍÁ•Œ¹ÍÑ½ÁÙ•¹Ð¡•Ù•¹Ð¤€è™…±Í”ì(€€€ô(€€€¥¹½É•5ÕÑ…Ñ¥½¸¡µÕÑ…Ñ¥½¸¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÍÁ•Œ¹¥¹½É•5ÕÑ…Ñ¥½¸€üÑ¡¥Ì¹ÍÁ•Œ¹¥¹½É•5ÕÑ…Ñ¥½¸¡µÕÑ…Ñ¥½¸¤€èÍÕÁ•È¹¥¹½É•5ÕÑ…Ñ¥½¸¡µÕÑ…Ñ¥½¸¤ì(€€€ô(€ôì(€™Õ¹Ñ¥½¸É•¹‘•É•ÍÌ¡Á…É•¹Ñ=4°‘•ÍÌ°Ù¥•Ü¤ì(€€€±•Ð‘½´€ôÁ…É•¹Ñ=4¹™¥ÉÍÑ¡¥±°ÝÉ¥ÑÑ•¸€ô™…±Í”ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ð‘•ÍÌ¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•Ð‘•ÍŒ€ô‘•ÍÍm¥t°¡¥±‘=4€ô‘•ÍŒ¹‘½´ì(€€€€€¥˜€¡¡¥±‘=4¹Á…É•¹Ñ9½‘”€ôôÁ…É•¹Ñ=4¤ì(€€€€€€€Ý¡¥±”€¡¡¥±‘=4€„ô‘½´¤ì(€€€€€€€€€‘½´€ôÉ´¡‘½´¤ì(€€€€€€€€€ÝÉ¥ÑÑ•¸€ôÑÉÕ”ì(€€€€€€€ô(€€€€€€€‘½´€ô‘½´¹¹•áÑM¥‰±¥¹œì(€€€€€ô•±Í”ì(€€€€€€€ÝÉ¥ÑÑ•¸€ôÑÉÕ”ì(€€€€€€€Á…É•¹Ñ=4¹¥¹Í•ÉÑ	•™½É”¡¡¥±‘=4°‘½´¤ì(€€€€€ô(€€€€€¥˜€¡‘•ÍŒ¥¹ÍÑ…¹•½˜5…É­Y¥•Ý•ÍŒ¤ì(€€€€€€€±•ÐÁ½Ì€ô‘½´€ü‘½´¹ÁÉ•Ù¥½ÕÍM¥‰±¥¹œ€èÁ…É•¹Ñ=4¹±…ÍÑ¡¥±ì(€€€€€€€É•¹‘•É•ÍÌ¡‘•ÍŒ¹½¹Ñ•¹Ñ=4°‘•ÍŒ¹¡¥±‘É•¸°Ù¥•Ü¤ì(€€€€€€€‘½´€ôÁ½Ì€üÁ½Ì¹¹•áÑM¥‰±¥¹œ€èÁ…É•¹Ñ=4¹™¥ÉÍÑ¡¥±ì(€€€€€ô(€€€ô(€€€Ý¡¥±”€¡‘½´¤ì(€€€€€‘½´€ôÉ´¡‘½´¤ì(€€€€€ÝÉ¥ÑÑ•¸€ôÑÉÕ”ì(€€€ô(€€€¥˜€¡ÝÉ¥ÑÑ•¸€˜˜Ù¥•Ü¹ÑÉ…­]É¥Ñ•Ì€ôôÁ…É•¹Ñ=4¤(€€€€€Ù¥•Ü¹ÑÉ…­]É¥Ñ•Ì€ô¹Õ±°ì(€ô(€Ù…È=ÕÑ•É•½1•Ù•°€ô™Õ¹Ñ¥½¸¡¹½‘•9…µ”¤ì(€€€¥˜€¡¹½‘•9…µ”¤(€€€€€Ñ¡¥Ì¹¹½‘•9…µ”€ô¹½‘•9…µ”ì(€ôì(€=ÕÑ•É•½1•Ù•°¹ÁÉ½Ñ½ÑåÁ”€ô€¼¨}}AUI}|€¨¼=‰©•Ð¹É•…Ñ”¡¹Õ±°¤ì(€Ù…È¹½•¼€ôm¹•Ü=ÕÑ•É•½1•Ù•° ¥tì(€™Õ¹Ñ¥½¸½µÁÕÑ•=ÕÑ•É•¼¡½ÕÑ•É•¼°¹½‘”°¹••‘Í]É…À¤ì(€€€¥˜€¡½ÕÑ•É•¼¹±•¹Ñ €ôô€À¤(€€€€€É•ÑÕÉ¸¹½•¼ì(€€€±•ÐÑ½À€ô¹••‘Í]É…À€ü¹½•½lÁt€è¹•Ü=ÕÑ•É•½1•Ù•° ¤°É•ÍÕ±Ð€ômÑ½Átì(€€€™½È€¡±•Ð¤€ô€Àì¤€ð½ÕÑ•É•¼¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•Ð…ÑÑÉÌ€ô½ÕÑ•É•½m¥t¹ÑåÁ”¹…ÑÑÉÌì(€€€€€¥˜€ ……ÑÑÉÌ¤(€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€¥˜€¡…ÑÑÉÌ¹¹½‘•9…µ”¤(€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡Ñ½À€ô¹•Ü=ÕÑ•É•½1•Ù•°¡…ÑÑÉÌ¹¹½‘•9…µ”¤¤ì(€€€€€™½È€¡±•Ð¹…µ”¥¸…ÑÑÉÌ¤ì(€€€€€€€±•ÐÙ…°€ô…ÑÑÉÍm¹…µ•tì(€€€€€€€¥˜€¡Ù…°€ôô¹Õ±°¤(€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€¥˜€¡¹••‘Í]É…À€˜˜É•ÍÕ±Ð¹±•¹Ñ €ôô€Ä¤(€€€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡Ñ½À€ô¹•Ü=ÕÑ•É•½1•Ù•°¡¹½‘”¹¥Í%¹±¥¹”€ü€‰ÍÁ…¸ˆ€è€‰‘¥Øˆ¤¤ì(€€€€€€€¥˜€¡¹…µ”€ôô€‰±…ÍÌˆ¤(€€€€€€€€€Ñ½À¹±…ÍÌ€ô€¡Ñ½À¹±…ÍÌ€üÑ½À¹±…ÍÌ€¬€ˆ€ˆ€è€ˆˆ¤€¬Ù…°ì(€€€€€€€•±Í”¥˜€¡¹…µ”€ôô€‰ÍÑå±”ˆ¤(€€€€€€€€€Ñ½À¹ÍÑå±”€ô€¡Ñ½À¹ÍÑå±”€üÑ½À¹ÍÑå±”€¬€ˆìˆ€è€ˆˆ¤€¬Ù…°ì(€€€€€€€•±Í”¥˜€¡¹…µ”€„ô€‰¹½‘•9…µ”ˆ¤(€€€€€€€€€Ñ½Ám¹…µ•t€ôÙ…°ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€ô(€™Õ¹Ñ¥½¸Á…Ñ¡=ÕÑ•É•¼¡½ÕÑ•É=4°¹½‘•=4°ÁÉ•Ù½µÁÕÑ•°ÕÉ½µÁÕÑ•¤ì(€€€¥˜€¡ÁÉ•Ù½µÁÕÑ•€ôô¹½•¼€˜˜ÕÉ½µÁÕÑ•€ôô¹½•¼¤(€€€€€É•ÑÕÉ¸¹½‘•=4ì(€€€±•ÐÕÉ=4€ô¹½‘•=4ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðÕÉ½µÁÕÑ•¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•Ð‘•¼€ôÕÉ½µÁÕÑ•‘m¥t°ÁÉ•Ø€ôÁÉ•Ù½µÁÕÑ•‘m¥tì(€€€€€¥˜€¡¤¤ì(€€€€€€€±•ÐÁ…É•¹Ðì(€€€€€€€¥˜€¡ÁÉ•Ø€˜˜ÁÉ•Ø¹¹½‘•9…µ”€ôô‘•¼¹¹½‘•9…µ”€˜˜ÕÉ=4€„ô½ÕÑ•É=4€˜˜€¡Á…É•¹Ð€ôÕÉ=4¹Á…É•¹Ñ9½‘”¤€˜˜Á…É•¹Ð¹¹½‘•9…µ”¹Ñ½1½Ý•É…Í” ¤€ôô‘•¼¹¹½‘•9…µ”¤ì(€€€€€€€€€ÕÉ=4€ôÁ…É•¹Ðì(€€€€€€€ô•±Í”ì(€€€€€€€€€Á…É•¹Ð€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð¡‘•¼¹¹½‘•9…µ”¤ì(€€€€€€€€€Á…É•¹Ð¹Áµ%Í•¼€ôÑÉÕ”ì(€€€€€€€€€Á…É•¹Ð¹…ÁÁ•¹‘¡¥±¡ÕÉ=4¤ì(€€€€€€€€€ÁÉ•Ø€ô¹½•½lÁtì(€€€€€€€€€ÕÉ=4€ôÁ…É•¹Ðì(€€€€€€€ô(€€€€€ô(€€€€€Á…Ñ¡ÑÑÉ¥‰ÕÑ•Ì¡ÕÉ=4°ÁÉ•Øñð¹½•½lÁt°‘•¼¤ì(€€€ô(€€€É•ÑÕÉ¸ÕÉ=4ì(€ô(€™Õ¹Ñ¥½¸Á…Ñ¡ÑÑÉ¥‰ÕÑ•Ì¡‘½´°ÁÉ•Ø°ÕÈ¤ì(€€€™½È€¡±•Ð¹…µ”¥¸ÁÉ•Ø¤(€€€€€¥˜€¡¹…µ”€„ô€‰±…ÍÌˆ€˜˜¹…µ”€„ô€‰ÍÑå±”ˆ€˜˜¹…µ”€„ô€‰¹½‘•9…µ”ˆ€˜˜€„¡¹…µ”¥¸ÕÈ¤¤(€€€€€€€‘½´¹É•µ½Ù•ÑÑÉ¥‰ÕÑ”¡¹…µ”¤ì(€€€™½È€¡±•Ð¹…µ”¥¸ÕÈ¤(€€€€€¥˜€¡¹…µ”€„ô€‰±…ÍÌˆ€˜˜¹…µ”€„ô€‰ÍÑå±”ˆ€˜˜¹…µ”€„ô€‰¹½‘•9…µ”ˆ€˜˜ÕÉm¹…µ•t€„ôÁÉ•Ùm¹…µ•t¤(€€€€€€€‘½´¹Í•ÑÑÑÉ¥‰ÕÑ”¡¹…µ”°ÕÉm¹…µ•t¤ì(€€€¥˜€¡ÁÉ•Ø¹±…ÍÌ€„ôÕÈ¹±…ÍÌ¤ì(€€€€€±•ÐÁÉ•Ù1¥ÍÐ€ôÁÉ•Ø¹±…ÍÌ€üÁÉ•Ø¹±…ÍÌ¹ÍÁ±¥Ð ˆ€ˆ¤¹™¥±Ñ•È¡	½½±•…¸¤€èmtì(€€€€€±•ÐÕÉ1¥ÍÐ€ôÕÈ¹±…ÍÌ€üÕÈ¹±…ÍÌ¹ÍÁ±¥Ð ˆ€ˆ¤¹™¥±Ñ•È¡	½½±•…¸¤€èmtì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÁÉ•Ù1¥ÍÐ¹±•¹Ñ ì¤¬¬¤(€€€€€€€¥˜€¡ÕÉ1¥ÍÐ¹¥¹‘•á=˜¡ÁÉ•Ù1¥ÍÑm¥t¤€ôô€´Ä¤(€€€€€€€€€‘½´¹±…ÍÍ1¥ÍÐ¹É•µ½Ù”¡ÁÉ•Ù1¥ÍÑm¥t¤ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÕÉ1¥ÍÐ¹±•¹Ñ ì¤¬¬¤(€€€€€€€¥˜€¡ÁÉ•Ù1¥ÍÐ¹¥¹‘•á=˜¡ÕÉ1¥ÍÑm¥t¤€ôô€´Ä¤(€€€€€€€€€‘½´¹±…ÍÍ1¥ÍÐ¹…‘¡ÕÉ1¥ÍÑm¥t¤ì(€€€€€¥˜€¡‘½´¹±…ÍÍ1¥ÍÐ¹±•¹Ñ €ôô€À¤(€€€€€€€‘½´¹É•µ½Ù•ÑÑÉ¥‰ÕÑ” ‰±…ÍÌˆ¤ì(€€€ô(€€€¥˜€¡ÁÉ•Ø¹ÍÑå±”€„ôÕÈ¹ÍÑå±”¤ì(€€€€€¥˜€¡ÁÉ•Ø¹ÍÑå±”¤ì(€€€€€€€±•ÐÁÉ½À€ô€½qÌ¨¡mqÝpµqá„ÄµqÕ™™™™t¬¥qÌ¨è üèˆ üéqp¹ñmx‰t¤¨‰ðœ üéqp¹ñmxt¤¨ñp ¸¨ýp¥ñmxít¤¨½œ°´ì(€€€€€€€Ý¡¥±”€¡´€ôÁÉ½À¹•á•Œ¡ÁÉ•Ø¹ÍÑå±”¤¤(€€€€€€€€€‘½´¹ÍÑå±”¹É•µ½Ù•AÉ½Á•ÉÑä¡µlÅt¤ì(€€€€€ô(€€€€€¥˜€¡ÕÈ¹ÍÑå±”¤(€€€€€€€‘½´¹ÍÑå±”¹ÍÍQ•áÐ€¬ôÕÈ¹ÍÑå±”ì(€€€ô(€ô(€™Õ¹Ñ¥½¸…ÁÁ±å=ÕÑ•É•¼¡‘½´°‘•¼°¹½‘”¤ì(€€€É•ÑÕÉ¸Á…Ñ¡=ÕÑ•É•¼¡‘½´°‘½´°¹½•¼°½µÁÕÑ•=ÕÑ•É•¼¡‘•¼°¹½‘”°€…¥Í±Ð¡‘½´¤¤¤ì(€ô(€™Õ¹Ñ¥½¸Í…µ•=ÕÑ•É•¼¡„°ˆ¤ì(€€€¥˜€¡„¹±•¹Ñ €„ôˆ¹±•¹Ñ ¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ð„¹±•¹Ñ ì¤¬¬¤(€€€€€¥˜€ ……m¥t¹ÑåÁ”¹•Ä¡‰m¥t¹ÑåÁ”¤¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ô(€™Õ¹Ñ¥½¸É´¡‘½´¤ì(€€€±•Ð¹•áÐ€ô‘½´¹¹•áÑM¥‰±¥¹œì(€€€‘½´¹Á…É•¹Ñ9½‘”¹É•µ½Ù•¡¥±¡‘½´¤ì(€€€É•ÑÕÉ¸¹•áÐì(€ô(€Ù…ÈY¥•ÝQÉ••UÁ‘…Ñ•È€ô±…ÍÌì(€€€½¹ÍÑÉÕÑ½È¡Ñ½À°±½¬°Ù¥•Ü¤ì(€€€€€Ñ¡¥Ì¹±½¬€ô±½¬ì(€€€€€Ñ¡¥Ì¹Ù¥•Ü€ôÙ¥•Üì(€€€€€Ñ¡¥Ì¹¥¹‘•à€ô€Àì(€€€€€Ñ¡¥Ì¹ÍÑ…¬€ômtì(€€€€€Ñ¡¥Ì¹¡…¹•€ô™…±Í”ì(€€€€€Ñ¡¥Ì¹Ñ½À€ôÑ½Àì(€€€€€Ñ¡¥Ì¹ÁÉ•5…Ñ €ôÁÉ•5…Ñ ¡Ñ½À¹¹½‘”¹½¹Ñ•¹Ð°Ñ½À¤ì(€€€ô(€€€€¼¼•ÍÑÉ½ä…¹É•µ½Ù”Ñ¡”¡¥±‘É•¸‰•ÑÝ••¸Ñ¡”¥Ù•¸¥¹‘¥•Ì¥¸(€€€€¼¼Ñ¡¥Ì¹Ñ½Á€¸(€€€‘•ÍÑÉ½å	•ÑÝ••¸¡ÍÑ…ÉÐ°•¹¤ì(€€€€€¥˜€¡ÍÑ…ÉÐ€ôô•¹¤(€€€€€€€É•ÑÕÉ¸ì(€€€€€™½È€¡±•Ð¤€ôÍÑ…ÉÐì¤€ð•¹ì¤¬¬¤(€€€€€€€Ñ¡¥Ì¹Ñ½À¹¡¥±‘É•¹m¥t¹‘•ÍÑÉ½ä ¤ì(€€€€€Ñ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹ÍÁ±¥”¡ÍÑ…ÉÐ°•¹€´ÍÑ…ÉÐ¤ì(€€€€€Ñ¡¥Ì¹¡…¹•€ôÑÉÕ”ì(€€€ô(€€€€¼¼•ÍÑÉ½ä…±°É•µ…¥¹¥¹œ¡¥±‘É•¸¥¸Ñ¡¥Ì¹Ñ½Á€¸(€€€‘•ÍÑÉ½åI•ÍÐ ¤ì(€€€€€Ñ¡¥Ì¹‘•ÍÑÉ½å	•ÑÝ••¸¡Ñ¡¥Ì¹¥¹‘•à°Ñ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹±•¹Ñ ¤ì(€€€ô(€€€€¼¼Må¹ŒÑ¡”ÕÉÉ•¹ÐÍÑ…¬½˜µ…É¬‘•ÍÌÝ¥Ñ Ñ¡”¥Ù•¸…ÉÉ…ä½˜(€€€€¼¼µ…É­Ì°É•ÕÍ¥¹œ•á¥ÍÑ¥¹œµ…É¬‘•ÍÌÝ¡•¸Á½ÍÍ¥‰±”¸(€€€Íå¹Q½5…É­Ì¡µ…É­Ì°¥¹±¥¹”°Ù¥•Ü°Á…É•¹Ñ%¹‘•à¤ì(€€€€€±•Ð­••À€ô€À°‘•ÁÑ €ôÑ¡¥Ì¹ÍÑ…¬¹±•¹Ñ €øø€Äì(€€€€€±•Ðµ…á-••À€ô5…Ñ ¹µ¥¸¡‘•ÁÑ °µ…É­Ì¹±•¹Ñ ¤ì(€€€€€Ý¡¥±”€¡­••À€ðµ…á-••À€˜˜€¡­••À€ôô‘•ÁÑ €´€Ä€üÑ¡¥Ì¹Ñ½À€èÑ¡¥Ì¹ÍÑ…­m­••À€¬€Ä€ðð€Åt¤¹µ…Ñ¡•Í5…É¬¡µ…É­Ím­••Át¤€˜˜µ…É­Ím­••Át¹ÑåÁ”¹ÍÁ•Œ¹ÍÁ…¹¹¥¹œ€„ôô™…±Í”¤(€€€€€€€­••À¬¬ì(€€€€€Ý¡¥±”€¡­••À€ð‘•ÁÑ ¤ì(€€€€€€€Ñ¡¥Ì¹‘•ÍÑÉ½åI•ÍÐ ¤ì(€€€€€€€Ñ¡¥Ì¹Ñ½À¹‘¥ÉÑä€ô9=Q}%IQdì(€€€€€€€Ñ¡¥Ì¹¥¹‘•à€ôÑ¡¥Ì¹ÍÑ…¬¹Á½À ¤ì(€€€€€€€Ñ¡¥Ì¹Ñ½À€ôÑ¡¥Ì¹ÍÑ…¬¹Á½À ¤ì(€€€€€€€‘•ÁÑ ´´ì(€€€€€ô(€€€€€Ý¡¥±”€¡‘•ÁÑ €ðµ…É­Ì¹±•¹Ñ ¤ì(€€€€€€€Ñ¡¥Ì¹ÍÑ…¬¹ÁÕÍ ¡Ñ¡¥Ì¹Ñ½À°Ñ¡¥Ì¹¥¹‘•à€¬€Ä¤ì(€€€€€€€±•Ð™½Õ¹Ì€ô€´Ä°Í…¹Q¼€ôÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹±•¹Ñ ì(€€€€€€€¥˜€¡Á…É•¹Ñ%¹‘•à€ðÑ¡¥Ì¹ÁÉ•5…Ñ ¹¥¹‘•à¤(€€€€€€€€€Í…¹Q¼€ô5…Ñ ¹µ¥¸¡Ñ¡¥Ì¹¥¹‘•à€¬€Ì°Í…¹Q¼¤ì(€€€€€€€™½È€¡±•Ð¤€ôÑ¡¥Ì¹¥¹‘•àì¤€ðÍ…¹Q¼ì¤¬¬¤ì(€€€€€€€€€±•Ð¹•áÐ€ôÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¹m¥tì(€€€€€€€€€¥˜€¡¹•áÐ¹µ…Ñ¡•Í5…É¬¡µ…É­Ím‘•ÁÑ¡t¤€˜˜€…Ñ¡¥Ì¹¥Í1½­•¡¹•áÐ¹‘½´¤¤ì(€€€€€€€€€€€™½Õ¹Ì€ô¤ì(€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€¥˜€¡™½Õ¹Ì€ð€À€˜˜Ñ¡¥Ì¹¥¹‘•à€ðÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹±•¹Ñ ¤ì(€€€€€€€€€±•ÐÕÈ€ôÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¹mÑ¡¥Ì¹¥¹‘•átì(€€€€€€€€€¥˜€¡ÕÈ¥¹ÍÑ…¹•½˜5…É­Y¥•Ý•ÍŒ€˜˜ÕÈ¹‘¥ÉÑä€„ô9=}%IQd€˜˜ÕÈ¹µ…É¬¹ÑåÁ”€ôôµ…É­Ím‘•ÁÑ¡t¹ÑåÁ”€˜˜ÕÈ¹ÍÁ•Œ¹ÕÁ‘…Ñ”€˜˜€…Ñ¡¥Ì¹¥Í1½­•¡ÕÈ¹‘½´¤€˜˜ÕÈ¹ÍÁ•Œ¹ÕÁ‘…Ñ”¡µ…É­Ím‘•ÁÑ¡t¤¤ì(€€€€€€€€€€€ÕÈ¹µ…É¬€ôµ…É­Ím‘•ÁÑ¡tì(€€€€€€€€€€€™½Õ¹Ì€ôÑ¡¥Ì¹¥¹‘•àì(€€€€€€€€€€€Ñ¡¥Ì¹¡…¹•€ôÑÉÕ”ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€¥˜€¡™½Õ¹Ì€ø€´Ä¤ì(€€€€€€€€€¥˜€¡™½Õ¹Ì€øÑ¡¥Ì¹¥¹‘•à¤ì(€€€€€€€€€€€Ñ¡¥Ì¹¡…¹•€ôÑÉÕ”ì(€€€€€€€€€€€Ñ¡¥Ì¹‘•ÍÑÉ½å	•ÑÝ••¸¡Ñ¡¥Ì¹¥¹‘•à°™½Õ¹Ì¤ì(€€€€€€€€€ô(€€€€€€€€€Ñ¡¥Ì¹Ñ½À€ôÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¹mÑ¡¥Ì¹¥¹‘•átì(€€€€€€€ô•±Í”ì(€€€€€€€€€±•Ðµ…É­•ÍŒ€ô5…É­Y¥•Ý•ÍŒ¹É•…Ñ”¡Ñ¡¥Ì¹Ñ½À°µ…É­Ím‘•ÁÑ¡t°¥¹±¥¹”°Ù¥•Ü¤ì(€€€€€€€€€Ñ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹ÍÁ±¥”¡Ñ¡¥Ì¹¥¹‘•à°€À°µ…É­•ÍŒ¤ì(€€€€€€€€€Ñ¡¥Ì¹Ñ½À€ôµ…É­•ÍŒì(€€€€€€€€€Ñ¡¥Ì¹¡…¹•€ôÑÉÕ”ì(€€€€€€€ô(€€€€€€€Ñ¡¥Ì¹¥¹‘•à€ô€Àì(€€€€€€€‘•ÁÑ ¬¬ì(€€€€€ô(€€€ô(€€€€¼¼QÉäÑ¼™¥¹„¹½‘”‘•ÍŒµ…Ñ¡¥¹œÑ¡”¥Ù•¸‘…Ñ„¸M­¥À½Ù•È¥Ð…¹(€€€€¼¼É•ÑÕÉ¸ÑÉÕ”Ý¡•¸ÍÕ•ÍÍ™Õ°¸(€€€™¥¹‘9½‘•5…Ñ ¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°¥¹‘•à¤ì(€€€€€±•Ð™½Õ¹Ì€ô€´Ä°Ñ…É•Ñ•ÍŒì(€€€€€¥˜€¡¥¹‘•à€øôÑ¡¥Ì¹ÁÉ•5…Ñ ¹¥¹‘•à€˜˜€¡Ñ…É•Ñ•ÍŒ€ôÑ¡¥Ì¹ÁÉ•5…Ñ ¹µ…Ñ¡•Ím¥¹‘•à€´Ñ¡¥Ì¹ÁÉ•5…Ñ ¹¥¹‘•át¤¹Á…É•¹Ð€ôôÑ¡¥Ì¹Ñ½À€˜˜Ñ…É•Ñ•ÍŒ¹µ…Ñ¡•Í9½‘”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼¤¤ì(€€€€€€€™½Õ¹Ì€ôÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹¥¹‘•á=˜¡Ñ…É•Ñ•ÍŒ°Ñ¡¥Ì¹¥¹‘•à¤ì(€€€€€ô•±Í”ì(€€€€€€€™½È€¡±•Ð¤€ôÑ¡¥Ì¹¥¹‘•à°”€ô5…Ñ ¹µ¥¸¡Ñ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹±•¹Ñ °¤€¬€Ô¤ì¤€ð”ì¤¬¬¤ì(€€€€€€€€€±•Ð¡¥±€ôÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¹m¥tì(€€€€€€€€€¥˜€¡¡¥±¹µ…Ñ¡•Í9½‘”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼¤€˜˜€…Ñ¡¥Ì¹ÁÉ•5…Ñ ¹µ…Ñ¡•¹¡…Ì¡¡¥±¤¤ì(€€€€€€€€€€€™½Õ¹Ì€ô¤ì(€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€ô(€€€€€¥˜€¡™½Õ¹Ì€ð€À¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€Ñ¡¥Ì¹‘•ÍÑÉ½å	•ÑÝ••¸¡Ñ¡¥Ì¹¥¹‘•à°™½Õ¹Ì¤ì(€€€€€Ñ¡¥Ì¹¥¹‘•à¬¬ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€ÕÁ‘…Ñ•9½‘•Ð¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°¥¹‘•à°Ù¥•Ü¤ì(€€€€€±•Ð¡¥±€ôÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¹m¥¹‘•átì(€€€€€¥˜€¡¡¥±¹‘¥ÉÑä€ôô9=}%IQd€˜˜¡¥±¹‘½´€ôô¡¥±¹½¹Ñ•¹Ñ=4¤(€€€€€€€¡¥±¹‘¥ÉÑä€ô=9Q9Q}%IQdì(€€€€€¥˜€ …¡¥±¹ÕÁ‘…Ñ”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü¤¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€Ñ¡¥Ì¹‘•ÍÑÉ½å	•ÑÝ••¸¡Ñ¡¥Ì¹¥¹‘•à°¥¹‘•à¤ì(€€€€€Ñ¡¥Ì¹¥¹‘•à¬¬ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€™¥¹‘%¹‘•á]¥Ñ¡¡¥±¡‘½µ9½‘”¤ì(€€€€€™½È€ ì€ì€¤ì(€€€€€€€±•ÐÁ…É•¹Ð€ô‘½µ9½‘”¹Á…É•¹Ñ9½‘”ì(€€€€€€€¥˜€ …Á…É•¹Ð¤(€€€€€€€€€É•ÑÕÉ¸€´Äì(€€€€€€€¥˜€¡Á…É•¹Ð€ôôÑ¡¥Ì¹Ñ½À¹½¹Ñ•¹Ñ=4¤ì(€€€€€€€€€±•Ð‘•ÍŒ€ô‘½µ9½‘”¹ÁµY¥•Ý•ÍŒì(€€€€€€€€€¥˜€¡‘•ÍŒ¤(€€€€€€€€€€€™½È€¡±•Ð¤€ôÑ¡¥Ì¹¥¹‘•àì¤€ðÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€€€€€¥˜€¡Ñ¡¥Ì¹Ñ½À¹¡¥±‘É•¹m¥t€ôô‘•ÍŒ¤(€€€€€€€€€€€€€€€É•ÑÕÉ¸¤ì(€€€€€€€€€€€ô(€€€€€€€€€É•ÑÕÉ¸€´Äì(€€€€€€€ô(€€€€€€€‘½µ9½‘”€ôÁ…É•¹Ðì(€€€€€ô(€€€ô(€€€€¼¼QÉäÑ¼ÕÁ‘…Ñ”Ñ¡”¹•áÐ¹½‘”°¥˜…¹ä°Ñ¼Ñ¡”¥Ù•¸‘…Ñ„¸¡•­Ì(€€€€¼¼ÁÉ”µµ…Ñ¡•ÌÑ¼…Ù½¥½Ù•ÉÝÉ¥Ñ¥¹œ¹½‘•ÌÑ¡…Ð½Õ±ÍÑ¥±°‰”ÕÍ•¸(€€€ÕÁ‘…Ñ•9•áÑ9½‘”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü°¥¹‘•à°Á½Ì¤ì(€€€€€™½È€¡±•Ð¤€ôÑ¡¥Ì¹¥¹‘•àì¤€ðÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•Ð¹•áÐ€ôÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¹m¥tì(€€€€€€€¥˜€¡¹•áÐ¥¹ÍÑ…¹•½˜9½‘•Y¥•Ý•ÍŒ¤ì(€€€€€€€€€±•ÐÁÉ•5…Ñ È€ôÑ¡¥Ì¹ÁÉ•5…Ñ ¹µ…Ñ¡•¹•Ð¡¹•áÐ¤ì(€€€€€€€€€¥˜€¡ÁÉ•5…Ñ È€„ô¹Õ±°€˜˜ÁÉ•5…Ñ È€„ô¥¹‘•à¤(€€€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€€€±•Ð¹•áÑ=4€ô¹•áÐ¹‘½´°ÕÁ‘…Ñ•ì(€€€€€€€€€±•Ð±½­•€ôÑ¡¥Ì¹¥Í1½­•¡¹•áÑ=4¤€˜˜€„¡¹½‘”¹¥ÍQ•áÐ€˜˜¹•áÐ¹¹½‘”€˜˜¹•áÐ¹¹½‘”¹¥ÍQ•áÐ€˜˜¹•áÐ¹¹½‘•=4¹¹½‘•Y…±Õ”€ôô¹½‘”¹Ñ•áÐ€˜˜¹•áÐ¹‘¥ÉÑä€„ô9=}%IQd€˜˜Í…µ•=ÕÑ•É•¼¡½ÕÑ•É•¼°¹•áÐ¹½ÕÑ•É•¼¤¤ì(€€€€€€€€€¥˜€ …±½­•€˜˜¹•áÐ¹ÕÁ‘…Ñ”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü¤¤ì(€€€€€€€€€€€Ñ¡¥Ì¹‘•ÍÑÉ½å	•ÑÝ••¸¡Ñ¡¥Ì¹¥¹‘•à°¤¤ì(€€€€€€€€€€€¥˜€¡¹•áÐ¹‘½´€„ô¹•áÑ=4¤(€€€€€€€€€€€€€Ñ¡¥Ì¹¡…¹•€ôÑÉÕ”ì(€€€€€€€€€€€Ñ¡¥Ì¹¥¹‘•à¬¬ì(€€€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€€€ô•±Í”¥˜€ …±½­•€˜˜€¡ÕÁ‘…Ñ•€ôÑ¡¥Ì¹É•É•…Ñ•]É…ÁÁ•È¡¹•áÐ°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü°Á½Ì¤¤¤ì(€€€€€€€€€€€Ñ¡¥Ì¹‘•ÍÑÉ½å	•ÑÝ••¸¡Ñ¡¥Ì¹¥¹‘•à°¤¤ì(€€€€€€€€€€€Ñ¡¥Ì¹Ñ½À¹¡¥±‘É•¹mÑ¡¥Ì¹¥¹‘•át€ôÕÁ‘…Ñ•ì(€€€€€€€€€€€¥˜€¡ÕÁ‘…Ñ•¹½¹Ñ•¹Ñ=4¤ì(€€€€€€€€€€€€€ÕÁ‘…Ñ•¹‘¥ÉÑä€ô=9Q9Q}%IQdì(€€€€€€€€€€€€€ÕÁ‘…Ñ•¹ÕÁ‘…Ñ•¡¥±‘É•¸¡Ù¥•Ü°Á½Ì€¬€Ä¤ì(€€€€€€€€€€€€€ÕÁ‘…Ñ•¹‘¥ÉÑä€ô9=Q}%IQdì(€€€€€€€€€€€ô(€€€€€€€€€€€Ñ¡¥Ì¹¡…¹•€ôÑÉÕ”ì(€€€€€€€€€€€Ñ¡¥Ì¹¥¹‘•à¬¬ì(€€€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€€€ô(€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€ô(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€€¼¼]¡•¸„¹½‘”Ý¥Ñ ½¹Ñ•¹Ð¥ÌÉ•Á±…•‰ä„‘¥™™•É•¹Ð¹½‘”Ý¥Ñ (€€€€¼¼¥‘•¹Ñ¥…°½¹Ñ•¹Ð°µ½Ù”½Ù•È¥ÑÌ¡¥±‘É•¸¸(€€€É•É•…Ñ•]É…ÁÁ•È¡¹•áÐ°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü°Á½Ì¤ì(€€€€€¥˜€¡¹•áÐ¹‘¥ÉÑäñð¹½‘”¹¥ÍÑ½´ñð€…¹•áÐ¹¡¥±‘É•¸¹±•¹Ñ ñð€…¹•áÐ¹¹½‘”¹½¹Ñ•¹Ð¹•Ä¡¹½‘”¹½¹Ñ•¹Ð¤ñð€…Í…µ•=ÕÑ•É•¼¡½ÕÑ•É•¼°¹•áÐ¹½ÕÑ•É•¼¤ñð€…¥¹¹•É•¼¹•Ä¡¹•áÐ¹¥¹¹•É•¼¤¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€±•ÐÝÉ…ÁÁ•È€ô9½‘•Y¥•Ý•ÍŒ¹É•…Ñ”¡Ñ¡¥Ì¹Ñ½À°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü°Á½Ì¤ì(€€€€€¥˜€¡ÝÉ…ÁÁ•È¹½¹Ñ•¹Ñ=4¤ì(€€€€€€€ÝÉ…ÁÁ•È¹¡¥±‘É•¸€ô¹•áÐ¹¡¥±‘É•¸ì(€€€€€€€¹•áÐ¹¡¥±‘É•¸€ômtì(€€€€€€€™½È€¡±•Ð ½˜ÝÉ…ÁÁ•È¹¡¥±‘É•¸¤(€€€€€€€€€ ¹Á…É•¹Ð€ôÝÉ…ÁÁ•Èì(€€€€€ô(€€€€€¹•áÐ¹‘•ÍÑÉ½ä ¤ì(€€€€€É•ÑÕÉ¸ÝÉ…ÁÁ•Èì(€€€ô(€€€€¼¼%¹Í•ÉÐÑ¡”¹½‘”…Ì„¹•Ý±äÉ•…Ñ•¹½‘”‘•ÍŒ¸(€€€…‘‘9½‘”¡¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü°Á½Ì¤ì(€€€€€±•Ð‘•ÍŒ€ô9½‘•Y¥•Ý•ÍŒ¹É•…Ñ”¡Ñ¡¥Ì¹Ñ½À°¹½‘”°½ÕÑ•É•¼°¥¹¹•É•¼°Ù¥•Ü°Á½Ì¤ì(€€€€€¥˜€¡‘•ÍŒ¹½¹Ñ•¹Ñ=4¤(€€€€€€€‘•ÍŒ¹ÕÁ‘…Ñ•¡¥±‘É•¸¡Ù¥•Ü°Á½Ì€¬€Ä¤ì(€€€€€Ñ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹ÍÁ±¥”¡Ñ¡¥Ì¹¥¹‘•à¬¬°€À°‘•ÍŒ¤ì(€€€€€Ñ¡¥Ì¹¡…¹•€ôÑÉÕ”ì(€€€ô(€€€Á±…•]¥‘•Ð¡Ý¥‘•Ð°Ù¥•Ü°Á½Ì¤ì(€€€€€±•Ð¹•áÐ€ôÑ¡¥Ì¹¥¹‘•à€ðÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹±•¹Ñ €üÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¹mÑ¡¥Ì¹¥¹‘•át€è¹Õ±°ì(€€€€€¥˜€¡¹•áÐ€˜˜¹•áÐ¹µ…Ñ¡•Í]¥‘•Ð¡Ý¥‘•Ð¤€˜˜€¡Ý¥‘•Ð€ôô¹•áÐ¹Ý¥‘•Ðñð€…¹•áÐ¹Ý¥‘•Ð¹ÑåÁ”¹Ñ½=4¹Á…É•¹Ñ9½‘”¤¤ì(€€€€€€€Ñ¡¥Ì¹¥¹‘•à¬¬ì(€€€€€ô•±Í”ì(€€€€€€€±•Ð‘•ÍŒ€ô¹•Ü]¥‘•ÑY¥•Ý•ÍŒ¡Ñ¡¥Ì¹Ñ½À°Ý¥‘•Ð°Ù¥•Ü°Á½Ì¤ì(€€€€€€€Ñ¡¥Ì¹Ñ½À¹¡¥±‘É•¸¹ÍÁ±¥”¡Ñ¡¥Ì¹¥¹‘•à¬¬°€À°‘•ÍŒ¤ì(€€€€€€€Ñ¡¥Ì¹¡…¹•€ôÑÉÕ”ì(€€€€€ô(€€€ô(€€€€¼¼5…­”ÍÕÉ”„Ñ•áÑ‰±½¬±½½­Ì…¹‰•¡…Ù•Ì½ÉÉ•Ñ±ä¥¸(€€€€¼¼½¹Ñ•¹Ñ‘¥Ñ…‰±”¸(€€€…‘‘Q•áÑ‰±½­!…­Ì ¤ì(€€€€€±•Ð±…ÍÑ¡¥±€ôÑ¡¥Ì¹Ñ½À¹¡¥±‘É•¹mÑ¡¥Ì¹¥¹‘•à€´€Åt°Á…É•¹Ð€ôÑ¡¥Ì¹Ñ½Àì(€€€€€Ý¡¥±”€¡±…ÍÑ¡¥±¥¹ÍÑ…¹•½˜5…É­Y¥•Ý•ÍŒ¤ì(€€€€€€€Á…É•¹Ð€ô±…ÍÑ¡¥±ì(€€€€€€€±…ÍÑ¡¥±€ôÁ…É•¹Ð¹¡¥±‘É•¹mÁ…É•¹Ð¹¡¥±‘É•¸¹±•¹Ñ €´€Åtì(€€€€€ô(€€€€€¥˜€ …±…ÍÑ¡¥±ñð€¼¼µÁÑäÑ•áÑ‰±½¬(€€€€€€„¡±…ÍÑ¡¥±¥¹ÍÑ…¹•½˜Q•áÑY¥•Ý•ÍŒ¤ñð€½q¸¼¹Ñ•ÍÐ¡±…ÍÑ¡¥±¹¹½‘”¹Ñ•áÐ¤ñðÑ¡¥Ì¹Ù¥•Ü¹É•ÅÕ¥É•Í•­½!…­9½‘”€˜˜€½qÌ¼¹Ñ•ÍÐ¡±…ÍÑ¡¥±¹¹½‘”¹Ñ•áÐ¤¤ì(€€€€€€€¥˜€ ¡Í…™…É¤ñð¡É½µ”¤€˜˜±…ÍÑ¡¥±€˜˜±…ÍÑ¡¥±¹‘½´¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤(€€€€€€€€€Ñ¡¥Ì¹…‘‘!…­9½‘” ‰%5ˆ°Á…É•¹Ð¤ì(€€€€€€€Ñ¡¥Ì¹…‘‘!…­9½‘” ‰	Hˆ°Ñ¡¥Ì¹Ñ½À¤ì(€€€€€ô(€€€ô(€€€…‘‘!…­9½‘”¡¹½‘•9…µ”°Á…É•¹Ð¤ì(€€€€€¥˜€¡Á…É•¹Ð€ôôÑ¡¥Ì¹Ñ½À€˜˜Ñ¡¥Ì¹¥¹‘•à€ðÁ…É•¹Ð¹¡¥±‘É•¸¹±•¹Ñ €˜˜Á…É•¹Ð¹¡¥±‘É•¹mÑ¡¥Ì¹¥¹‘•át¹µ…Ñ¡•Í!…¬¡¹½‘•9…µ”¤¤ì(€€€€€€€Ñ¡¥Ì¹¥¹‘•à¬¬ì(€€€€€ô•±Í”ì(€€€€€€€±•Ð‘½´€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð¡¹½‘•9…µ”¤ì(€€€€€€€¥˜€¡¹½‘•9…µ”€ôô€‰%5ˆ¤ì(€€€€€€€€€‘½´¹±…ÍÍ9…µ”€ô€‰AÉ½Í•5¥ÉÉ½ÈµÍ•Á…É…Ñ½Èˆì(€€€€€€€€€‘½´¹…±Ð€ô€ˆˆì(€€€€€€€ô(€€€€€€€¥˜€¡¹½‘•9…µ”€ôô€‰	Hˆ¤(€€€€€€€€€‘½´¹±…ÍÍ9…µ”€ô€‰AÉ½Í•5¥ÉÉ½ÈµÑÉ…¥±¥¹	É•…¬ˆì(€€€€€€€±•Ð¡…¬€ô¹•Ü	Õ™™•É!…­Y¥•Ý•ÍŒ¡Ñ¡¥Ì¹Ñ½À°mt°‘½´°¹Õ±°¤ì(€€€€€€€¥˜€¡Á…É•¹Ð€„ôÑ¡¥Ì¹Ñ½À¤(€€€€€€€€€Á…É•¹Ð¹¡¥±‘É•¸¹ÁÕÍ ¡¡…¬¤ì(€€€€€€€•±Í”(€€€€€€€€€Á…É•¹Ð¹¡¥±‘É•¸¹ÍÁ±¥”¡Ñ¡¥Ì¹¥¹‘•à¬¬°€À°¡…¬¤ì(€€€€€€€Ñ¡¥Ì¹¡…¹•€ôÑÉÕ”ì(€€€€€ô(€€€ô(€€€¥Í1½­•¡¹½‘”¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹±½¬€˜˜€¡¹½‘”€ôôÑ¡¥Ì¹±½¬ñð¥Í±Ð¡¹½‘”¤€˜˜¹½‘”¹½¹Ñ…¥¹Ì¡Ñ¡¥Ì¹±½¬¹Á…É•¹Ñ9½‘”¤¤ì(€€€ô(€ôì(€™Õ¹Ñ¥½¸ÁÉ•5…Ñ ¡™É…œ°Á…É•¹Ñ•ÍŒ¤ì(€€€±•ÐÕÉ•ÍŒ€ôÁ…É•¹Ñ•ÍŒ°‘•Í$€ôÕÉ•ÍŒ¹¡¥±‘É•¸¹±•¹Ñ ì(€€€±•Ð™$€ô™É…œ¹¡¥±‘½Õ¹Ð°µ…Ñ¡•€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤°µ…Ñ¡•ÌÌ€ômtì(€€€½ÕÑ•ÈèÝ¡¥±”€¡™$€ø€À¤ì(€€€€€±•Ð‘•ÍŒì(€€€€€™½È€ ì€ì€¤ì(€€€€€€€¥˜€¡‘•Í$¤ì(€€€€€€€€€±•Ð¹•áÐ€ôÕÉ•ÍŒ¹¡¥±‘É•¹m‘•Í$€´€Åtì(€€€€€€€€€¥˜€¡¹•áÐ¥¹ÍÑ…¹•½˜5…É­Y¥•Ý•ÍŒ¤ì(€€€€€€€€€€€ÕÉ•ÍŒ€ô¹•áÐì(€€€€€€€€€€€‘•Í$€ô¹•áÐ¹¡¥±‘É•¸¹±•¹Ñ ì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€‘•ÍŒ€ô¹•áÐì(€€€€€€€€€€€‘•Í$´´ì(€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€ô(€€€€€€€ô•±Í”¥˜€¡ÕÉ•ÍŒ€ôôÁ…É•¹Ñ•ÍŒ¤ì(€€€€€€€€€‰É•…¬½ÕÑ•Èì(€€€€€€€ô•±Í”ì(€€€€€€€€€‘•Í$€ôÕÉ•ÍŒ¹Á…É•¹Ð¹¡¥±‘É•¸¹¥¹‘•á=˜¡ÕÉ•ÍŒ¤ì(€€€€€€€€€ÕÉ•ÍŒ€ôÕÉ•ÍŒ¹Á…É•¹Ðì(€€€€€€€ô(€€€€€ô(€€€€€±•Ð¹½‘”€ô‘•ÍŒ¹¹½‘”ì(€€€€€¥˜€ …¹½‘”¤(€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€¥˜€¡¹½‘”€„ô™É…œ¹¡¥±¡™$€´€Ä¤¤(€€€€€€€‰É•…¬ì(€€€€€€´µ™$ì(€€€€€µ…Ñ¡•¹Í•Ð¡‘•ÍŒ°™$¤ì(€€€€€µ…Ñ¡•ÌÌ¹ÁÕÍ ¡‘•ÍŒ¤ì(€€€ô(€€€É•ÑÕÉ¸ì¥¹‘•àè™$°µ…Ñ¡•°µ…Ñ¡•Ìèµ…Ñ¡•ÌÌ¹É•Ù•ÉÍ” ¤ôì(€ô(€™Õ¹Ñ¥½¸½µÁ…É•M¥‘”¡„°ˆ¤ì(€€€É•ÑÕÉ¸„¹ÑåÁ”¹Í¥‘”€´ˆ¹ÑåÁ”¹Í¥‘”ì(€ô(€™Õ¹Ñ¥½¸¥Ñ•É•¼¡Á…É•¹Ð°‘•¼°½¹]¥‘•Ð°½¹9½‘”¤ì(€€€±•Ð±½…±Ì€ô‘•¼¹±½…±Ì¡Á…É•¹Ð¤°½™™Í•Ð€ô€Àì(€€€¥˜€¡±½…±Ì¹±•¹Ñ €ôô€À¤ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÁ…É•¹Ð¹¡¥±‘½Õ¹Ðì¤¬¬¤ì(€€€€€€€±•Ð¡¥±€ôÁ…É•¹Ð¹¡¥±¡¤¤ì(€€€€€€€½¹9½‘”¡¡¥±°±½…±Ì°‘•¼¹™½É¡¥±¡½™™Í•Ð°¡¥±¤°¤¤ì(€€€€€€€½™™Í•Ð€¬ô¡¥±¹¹½‘•M¥é”ì(€€€€€ô(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€±•Ð‘•½%¹‘•à€ô€À°…Ñ¥Ù”€ômt°É•ÍÑ9½‘”€ô¹Õ±°ì(€€€™½È€¡±•ÐÁ…É•¹Ñ%¹‘•à€ô€Àì€ì€¤ì(€€€€€±•ÐÝ¥‘•Ð°Ý¥‘•ÑÌì(€€€€€Ý¡¥±”€¡‘•½%¹‘•à€ð±½…±Ì¹±•¹Ñ €˜˜±½…±Ím‘•½%¹‘•át¹Ñ¼€ôô½™™Í•Ð¤ì(€€€€€€€±•Ð¹•áÐ€ô±½…±Ím‘•½%¹‘•à¬­tì(€€€€€€€¥˜€¡¹•áÐ¹Ý¥‘•Ð¤ì(€€€€€€€€€¥˜€ …Ý¥‘•Ð¤(€€€€€€€€€€€Ý¥‘•Ð€ô¹•áÐì(€€€€€€€€€•±Í”(€€€€€€€€€€€€¡Ý¥‘•ÑÌñð€¡Ý¥‘•ÑÌ€ômÝ¥‘•Ñt¤¤¹ÁÕÍ ¡¹•áÐ¤ì(€€€€€€€ô(€€€€€ô(€€€€€¥˜€¡Ý¥‘•Ð¤ì(€€€€€€€¥˜€¡Ý¥‘•ÑÌ¤ì(€€€€€€€€€Ý¥‘•ÑÌ¹Í½ÉÐ¡½µÁ…É•M¥‘”¤ì(€€€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÝ¥‘•ÑÌ¹±•¹Ñ ì¤¬¬¤(€€€€€€€€€€€½¹]¥‘•Ð¡Ý¥‘•ÑÍm¥t°Á…É•¹Ñ%¹‘•à°€„…É•ÍÑ9½‘”¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€½¹]¥‘•Ð¡Ý¥‘•Ð°Á…É•¹Ñ%¹‘•à°€„…É•ÍÑ9½‘”¤ì(€€€€€€€ô(€€€€€ô(€€€€€±•Ð¡¥±°¥¹‘•àì(€€€€€¥˜€¡É•ÍÑ9½‘”¤ì(€€€€€€€¥¹‘•à€ô€´Äì(€€€€€€€¡¥±€ôÉ•ÍÑ9½‘”ì(€€€€€€€É•ÍÑ9½‘”€ô¹Õ±°ì(€€€€€ô•±Í”¥˜€¡Á…É•¹Ñ%¹‘•à€ðÁ…É•¹Ð¹¡¥±‘½Õ¹Ð¤ì(€€€€€€€¥¹‘•à€ôÁ…É•¹Ñ%¹‘•àì(€€€€€€€¡¥±€ôÁ…É•¹Ð¹¡¥±¡Á…É•¹Ñ%¹‘•à¬¬¤ì(€€€€€ô•±Í”ì(€€€€€€€‰É•…¬ì(€€€€€ô(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð…Ñ¥Ù”¹±•¹Ñ ì¤¬¬¤(€€€€€€€¥˜€¡…Ñ¥Ù•m¥t¹Ñ¼€ðô½™™Í•Ð¤(€€€€€€€€€…Ñ¥Ù”¹ÍÁ±¥”¡¤´´°€Ä¤ì(€€€€€Ý¡¥±”€¡‘•½%¹‘•à€ð±½…±Ì¹±•¹Ñ €˜˜±½…±Ím‘•½%¹‘•át¹™É½´€ðô½™™Í•Ð€˜˜±½…±Ím‘•½%¹‘•át¹Ñ¼€ø½™™Í•Ð¤(€€€€€€€…Ñ¥Ù”¹ÁÕÍ ¡±½…±Ím‘•½%¹‘•à¬­t¤ì(€€€€€±•Ð•¹€ô½™™Í•Ð€¬¡¥±¹¹½‘•M¥é”ì(€€€€€¥˜€¡¡¥±¹¥ÍQ•áÐ¤ì(€€€€€€€±•ÐÕÑÐ€ô•¹ì(€€€€€€€¥˜€¡‘•½%¹‘•à€ð±½…±Ì¹±•¹Ñ €˜˜±½…±Ím‘•½%¹‘•át¹™É½´€ðÕÑÐ¤(€€€€€€€€€ÕÑÐ€ô±½…±Ím‘•½%¹‘•át¹™É½´ì(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð…Ñ¥Ù”¹±•¹Ñ ì¤¬¬¤(€€€€€€€€€¥˜€¡…Ñ¥Ù•m¥t¹Ñ¼€ðÕÑÐ¤(€€€€€€€€€€€ÕÑÐ€ô…Ñ¥Ù•m¥t¹Ñ¼ì(€€€€€€€¥˜€¡ÕÑÐ€ð•¹¤ì(€€€€€€€€€É•ÍÑ9½‘”€ô¡¥±¹ÕÐ¡ÕÑÐ€´½™™Í•Ð¤ì(€€€€€€€€€¡¥±€ô¡¥±¹ÕÐ À°ÕÑÐ€´½™™Í•Ð¤ì(€€€€€€€€€•¹€ôÕÑÐì(€€€€€€€€€¥¹‘•à€ô€´Äì(€€€€€€€ô(€€€€€ô•±Í”ì(€€€€€€€Ý¡¥±”€¡‘•½%¹‘•à€ð±½…±Ì¹±•¹Ñ €˜˜±½…±Ím‘•½%¹‘•át¹Ñ¼€ð•¹¤(€€€€€€€€€‘•½%¹‘•à¬¬ì(€€€€€ô(€€€€€±•Ð½ÕÑ•É•¼€ô¡¥±¹¥Í%¹±¥¹”€˜˜€…¡¥±¹¥Í1•…˜€ü…Ñ¥Ù”¹™¥±Ñ•È ¡¤€ôø€…¹¥¹±¥¹”¤€è…Ñ¥Ù”¹Í±¥” ¤ì(€€€€€½¹9½‘”¡¡¥±°½ÕÑ•É•¼°‘•¼¹™½É¡¥±¡½™™Í•Ð°¡¥±¤°¥¹‘•à¤ì(€€€€€½™™Í•Ð€ô•¹ì(€€€ô(€ô(€™Õ¹Ñ¥½¸¥½Í!…­Ì¡‘½´¤ì(€€€¥˜€¡‘½´¹¹½‘•9…µ”€ôô€‰U0ˆñð‘½´¹¹½‘•9…µ”€ôô€‰=0ˆ¤ì(€€€€€±•Ð½±‘ML€ô‘½´¹ÍÑå±”¹ÍÍQ•áÐì(€€€€€‘½´¹ÍÑå±”¹ÍÍQ•áÐ€ô½±‘ML€¬€ˆì±¥ÍÐµÍÑå±”èÍÅÕ…É”€…¥µÁ½ÉÑ…¹Ðˆì(€€€€€Ý¥¹‘½Ü¹•Ñ½µÁÕÑ•‘MÑå±”¡‘½´¤¹±¥ÍÑMÑå±”ì(€€€€€‘½´¹ÍÑå±”¹ÍÍQ•áÐ€ô½±‘MLì(€€€ô(€ô(€™Õ¹Ñ¥½¸™¥¹‘Q•áÑ%¹É…µ•¹Ð¡™É…œ°Ñ•áÐÈ°™É½´È°Ñ¼¤ì(€€€™½È€¡±•Ð¤€ô€À°Á½Ì€ô€Àì¤€ð™É…œ¹¡¥±‘½Õ¹Ð€˜˜Á½Ì€ðôÑ¼ì€¤ì(€€€€€±•Ð¡¥±€ô™É…œ¹¡¥±¡¤¬¬¤°¡¥±‘MÑ…ÉÐ€ôÁ½Ìì(€€€€€Á½Ì€¬ô¡¥±¹¹½‘•M¥é”ì(€€€€€¥˜€ …¡¥±¹¥ÍQ•áÐ¤(€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€±•ÐÍÑÈ€ô¡¥±¹Ñ•áÐì(€€€€€Ý¡¥±”€¡¤€ð™É…œ¹¡¥±‘½Õ¹Ð¤ì(€€€€€€€±•Ð¹•áÐ€ô™É…œ¹¡¥±¡¤¬¬¤ì(€€€€€€€Á½Ì€¬ô¹•áÐ¹¹½‘•M¥é”ì(€€€€€€€¥˜€ …¹•áÐ¹¥ÍQ•áÐ¤(€€€€€€€€€‰É•…¬ì(€€€€€€€ÍÑÈ€¬ô¹•áÐ¹Ñ•áÐì(€€€€€ô(€€€€€¥˜€¡Á½Ì€øô™É½´È¤ì(€€€€€€€¥˜€¡Á½Ì€øôÑ¼€˜˜ÍÑÈ¹Í±¥”¡Ñ¼€´Ñ•áÐÈ¹±•¹Ñ €´¡¥±‘MÑ…ÉÐ°Ñ¼€´¡¥±‘MÑ…ÉÐ¤€ôôÑ•áÐÈ¤(€€€€€€€€€É•ÑÕÉ¸Ñ¼€´Ñ•áÐÈ¹±•¹Ñ ì(€€€€€€€±•Ð™½Õ¹Ì€ô¡¥±‘MÑ…ÉÐ€ðÑ¼€üÍÑÈ¹±…ÍÑ%¹‘•á=˜¡Ñ•áÐÈ°Ñ¼€´¡¥±‘MÑ…ÉÐ€´€Ä¤€è€´Äì(€€€€€€€¥˜€¡™½Õ¹Ì€øô€À€˜˜™½Õ¹Ì€¬Ñ•áÐÈ¹±•¹Ñ €¬¡¥±‘MÑ…ÉÐ€øô™É½´È¤(€€€€€€€€€É•ÑÕÉ¸¡¥±‘MÑ…ÉÐ€¬™½Õ¹Ìì(€€€€€€€¥˜€¡™É½´È€ôôÑ¼€˜˜ÍÑÈ¹±•¹Ñ €øôÑ¼€¬Ñ•áÐÈ¹±•¹Ñ €´¡¥±‘MÑ…ÉÐ€˜˜ÍÑÈ¹Í±¥”¡Ñ¼€´¡¥±‘MÑ…ÉÐ°Ñ¼€´¡¥±‘MÑ…ÉÐ€¬Ñ•áÐÈ¹±•¹Ñ ¤€ôôÑ•áÐÈ¤(€€€€€€€€€É•ÑÕÉ¸Ñ¼ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸€´Äì(€ô(€™Õ¹Ñ¥½¸É•Á±…•9½‘•Ì¡¹½‘•Ì°™É½´È°Ñ¼°Ù¥•Ü°É•Á±…•µ•¹Ð¤ì(€€€±•ÐÉ•ÍÕ±Ð€ômtì(€€€™½È€¡±•Ð¤€ô€À°½™˜€ô€Àì¤€ð¹½‘•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•Ð¡¥±€ô¹½‘•Ím¥t°ÍÑ…ÉÐ€ô½™˜°•¹€ô½™˜€¬ô¡¥±¹Í¥é”ì(€€€€€¥˜€¡ÍÑ…ÉÐ€øôÑ¼ñð•¹€ðô™É½´È¤ì(€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡¡¥±¤ì(€€€€€ô•±Í”ì(€€€€€€€¥˜€¡ÍÑ…ÉÐ€ð™É½´È¤(€€€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡¡¥±¹Í±¥” À°™É½´È€´ÍÑ…ÉÐ°Ù¥•Ü¤¤ì(€€€€€€€¥˜€¡É•Á±…•µ•¹Ð¤ì(€€€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡É•Á±…•µ•¹Ð¤ì(€€€€€€€€€É•Á±…•µ•¹Ð€ôÙ½¥€Àì(€€€€€€€ô(€€€€€€€¥˜€¡•¹€øÑ¼¤(€€€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡¡¥±¹Í±¥”¡Ñ¼€´ÍÑ…ÉÐ°¡¥±¹Í¥é”°Ù¥•Ü¤¤ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€ô(€™Õ¹Ñ¥½¸Í•±•Ñ¥½¹É½µ=4¡Ù¥•Ü°½É¥¥¸€ô¹Õ±°¤ì(€€€±•Ð‘½µM•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤°‘½ŒÔ€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œì(€€€¥˜€ …‘½µM•°¹™½ÕÍ9½‘”¤(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€±•Ð¹•…É•ÍÑ•ÍŒ€ôÙ¥•Ü¹‘½Y¥•Ü¹¹•…É•ÍÑ•ÍŒ¡‘½µM•°¹™½ÕÍ9½‘”¤°¥¹]¥‘•Ð€ô¹•…É•ÍÑ•ÍŒ€˜˜¹•…É•ÍÑ•ÍŒ¹Í¥é”€ôô€Àì(€€€±•Ð¡•…€ôÙ¥•Ü¹‘½Y¥•Ü¹Á½ÍÉ½µ=4¡‘½µM•°¹™½ÕÍ9½‘”°‘½µM•°¹™½ÕÍ=™™Í•Ð°€Ä¤ì(€€€¥˜€¡¡•…€ð€À¤(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€±•Ð€‘¡•…€ô‘½ŒÔ¹É•Í½±Ù”¡¡•…¤°…¹¡½È°Í•±•Ñ¥½¸ì(€€€¥˜€¡Í•±•Ñ¥½¹½±±…ÁÍ•¡‘½µM•°¤¤ì(€€€€€…¹¡½È€ô¡•…ì(€€€€€Ý¡¥±”€¡¹•…É•ÍÑ•ÍŒ€˜˜€…¹•…É•ÍÑ•ÍŒ¹¹½‘”¤(€€€€€€€¹•…É•ÍÑ•ÍŒ€ô¹•…É•ÍÑ•ÍŒ¹Á…É•¹Ðì(€€€€€¥˜€¡¹•…É•ÍÑ•ÍŒ€˜˜¹•…É•ÍÑ•ÍŒ¹¹½‘”¹¥ÍÑ½´€˜˜9½‘•M•±•Ñ¥½¸¹¥ÍM•±•Ñ…‰±”¡¹•…É•ÍÑ•ÍŒ¹¹½‘”¤€˜˜¹•…É•ÍÑ•ÍŒ¹Á…É•¹Ð€˜˜€„¡¹•…É•ÍÑ•ÍŒ¹¹½‘”¹¥Í%¹±¥¹”€˜˜¥Í=¹‘”¡‘½µM•°¹™½ÕÍ9½‘”°‘½µM•°¹™½ÕÍ=™™Í•Ð°¹•…É•ÍÑ•ÍŒ¹‘½´¤¤¤ì(€€€€€€€±•ÐÁ½Ì€ô¹•…É•ÍÑ•ÍŒ¹Á½Í	•™½É”ì(€€€€€€€Í•±•Ñ¥½¸€ô¹•Ü9½‘•M•±•Ñ¥½¸¡¡•…€ôôÁ½Ì€ü€‘¡•…€è‘½ŒÔ¹É•Í½±Ù”¡Á½Ì¤¤ì(€€€€€ô•±Í”¥˜€¡•­¼€˜˜½É¥¥¸€ôô€‰­•äˆ€˜˜¡•…€øÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼€˜˜¥Í±Ð¡‘½µM•°¹™½ÕÍ9½‘”¤€˜˜‘½µM•°¹™½ÕÍ=™™Í•Ð€ôô‘½µM•°¹™½ÕÍ9½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ €˜˜¹•…É•ÍÑ•ÍŒ€˜˜¹•…É•ÍÑ•ÍŒ¹Á½ÍÑMÑ…ÉÐ€øÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼¤ì(€€€€€€€™½È€¡±•ÐÍ…¸€ô‘½µM•°¹™½ÕÍ9½‘”ì€ìÍ…¸€ôÍ…¸¹Á…É•¹Ñ9½‘”¤ì(€€€€€€€€€¥˜€¡•Ñ½µÁÕÑ•‘MÑå±”¡Í…¸¤¹½Ù•É™±½Ü€„ô€‰Ù¥Í¥‰±”ˆ¤ì(€€€€€€€€€€€Í•±•Ñ¥½¸€ôM•±•Ñ¥½¸¹™¥¹‘É½´¡‘½ŒÔ¹É•Í½±Ù”¡¹•…É•ÍÑ•ÍŒ¹Á½ÍÑMÑ…ÉÐ¤°€Ä¤ì(€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€ô(€€€€€€€€€¥˜€¡Í…¸€ôô¹•…É•ÍÑ•ÍŒ¹‘½´ñðÍ…¸¹¹•áÑM¥‰±¥¹œñð€…Í…¸¹Á…É•¹Ñ9½‘”ñð€…¥Í±Ð¡Í…¸¹Á…É•¹Ñ9½‘”¤¤(€€€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€ô(€€€ô•±Í”ì(€€€€€¥˜€¡‘½µM•°¥¹ÍÑ…¹•½˜Ù¥•Ü¹‘½´¹½Ý¹•É½Õµ•¹Ð¹‘•™…Õ±ÑY¥•Ü¹M•±•Ñ¥½¸€˜˜‘½µM•°¹É…¹•½Õ¹Ð€ø€Ä¤ì(€€€€€€€±•Ðµ¥¸È€ô¡•…°µ…àÈ€ô¡•…ì(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð‘½µM•°¹É…¹•½Õ¹Ðì¤¬¬¤ì(€€€€€€€€€±•ÐÉ…¹”€ô‘½µM•°¹•ÑI…¹•Ð¡¤¤ì(€€€€€€€€€µ¥¸È€ô5…Ñ ¹µ¥¸¡µ¥¸È°Ù¥•Ü¹‘½Y¥•Ü¹Á½ÍÉ½µ=4¡É…¹”¹ÍÑ…ÉÑ½¹Ñ…¥¹•È°É…¹”¹ÍÑ…ÉÑ=™™Í•Ð°€Ä¤¤ì(€€€€€€€€€µ…àÈ€ô5…Ñ ¹µ…à¡µ…àÈ°Ù¥•Ü¹‘½Y¥•Ü¹Á½ÍÉ½µ=4¡É…¹”¹•¹‘½¹Ñ…¥¹•È°É…¹”¹•¹‘=™™Í•Ð°€´Ä¤¤ì(€€€€€€€ô(€€€€€€€¥˜€¡µ¥¸È€ð€À¤(€€€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€€€m…¹¡½È°¡•…‘t€ôµ…àÈ€ôôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹…¹¡½È€ümµ…àÈ°µ¥¸Ét€èmµ¥¸È°µ…àÉtì(€€€€€€€€‘¡•…€ô‘½ŒÔ¹É•Í½±Ù”¡¡•…¤ì(€€€€€ô•±Í”ì(€€€€€€€…¹¡½È€ôÙ¥•Ü¹‘½Y¥•Ü¹Á½ÍÉ½µ=4¡‘½µM•°¹…¹¡½É9½‘”°‘½µM•°¹…¹¡½É=™™Í•Ð°€Ä¤ì(€€€€€ô(€€€€€¥˜€¡…¹¡½È€ð€À¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€ô(€€€±•Ð€‘…¹¡½È€ô‘½ŒÔ¹É•Í½±Ù”¡…¹¡½È¤ì(€€€¥˜€ …Í•±•Ñ¥½¸¤ì(€€€€€±•Ð‰¥…Ì€ô½É¥¥¸€ôô€‰Á½¥¹Ñ•ÈˆñðÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹¡•…€ð€‘¡•…¹Á½Ì€˜˜€…¥¹]¥‘•Ð€ü€Ä€è€´Äì(€€€€€Í•±•Ñ¥½¸€ôÍ•±•Ñ¥½¹	•ÑÝ••¸¡Ù¥•Ü°€‘…¹¡½È°€‘¡•…°‰¥…Ì¤ì(€€€ô(€€€É•ÑÕÉ¸Í•±•Ñ¥½¸ì(€ô(€™Õ¹Ñ¥½¸•‘¥Ñ½É=Ý¹ÍM•±•Ñ¥½¸¡Ù¥•Ü¤ì(€€€É•ÑÕÉ¸Ù¥•Ü¹•‘¥Ñ…‰±”€üÙ¥•Ü¹¡…Í½ÕÌ ¤€è¡…ÍM•±•Ñ¥½¸¡Ù¥•Ü¤€˜˜‘½Õµ•¹Ð¹…Ñ¥Ù•±•µ•¹Ð€˜˜‘½Õµ•¹Ð¹…Ñ¥Ù•±•µ•¹Ð¹½¹Ñ…¥¹Ì¡Ù¥•Ü¹‘½´¤ì(€ô(€™Õ¹Ñ¥½¸Í•±•Ñ¥½¹Q½=4¡Ù¥•Ü°™½É”€ô™…±Í”¤ì(€€€±•ÐÍ•°€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€Íå¹9½‘•M•±•Ñ¥½¸¡Ù¥•Ü°Í•°¤ì(€€€¥˜€ …•‘¥Ñ½É=Ý¹ÍM•±•Ñ¥½¸¡Ù¥•Ü¤¤(€€€€€É•ÑÕÉ¸ì(€€€±•Ðµ½ÕÍ•½Ý¸€ôÙ¥•Ü¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸ì(€€€¥˜€ …™½É”€˜˜¡É½µ”€˜˜µ½ÕÍ•½Ý¸¤ì(€€€€€±•Ð‘½µM•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤°ÕÉM•°€ôÙ¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÕÉÉ•¹ÑM•±•Ñ¥½¸ì(€€€€€¥˜€¡‘½µM•°¹…¹¡½É9½‘”€˜˜ÕÉM•°¹…¹¡½É9½‘”€˜˜¥ÍÅÕ¥Ù…±•¹ÑA½Í¥Ñ¥½¸¡‘½µM•°¹…¹¡½É9½‘”°‘½µM•°¹…¹¡½É=™™Í•Ð°ÕÉM•°¹…¹¡½É9½‘”°ÕÉM•°¹…¹¡½É=™™Í•Ð¤€˜˜µ½ÕÍ•½Ý¸¹‘•±…åM•±UÁ‘…Ñ” ¤¤ì(€€€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹Í•ÑÕÉM•±•Ñ¥½¸ ¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô(€€€ô(€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹‘¥Í½¹¹•ÑM•±•Ñ¥½¸ ¤ì(€€€¥˜€¡Ù¥•Ü¹ÕÉÍ½É]É…ÁÁ•È¤ì(€€€€€Í•±•ÑÕÉÍ½É]É…ÁÁ•È¡Ù¥•Ü¤ì(€€€ô•±Í”ì(€€€€€±•Ðì…¹¡½È°¡•…ô€ôÍ•°°É•Í•Ñ‘¥Ñ…‰±•É½´°É•Í•Ñ‘¥Ñ…‰±•Q¼ì(€€€€€¥˜€¡‰É½­•¹M•±•Ñ	•ÑÝ••¹U¹•‘¥Ñ…‰±”€˜˜€„¡Í•°¥¹ÍÑ…¹•½˜Q•áÑM•±•Ñ¥½¸¤¤ì(€€€€€€€¥˜€ …Í•°¸‘™É½´¹Á…É•¹Ð¹¥¹±¥¹•½¹Ñ•¹Ð¤(€€€€€€€€€É•Í•Ñ‘¥Ñ…‰±•É½´€ôÑ•µÁ½É…É¥±å‘¥Ñ…‰±•9•…È¡Ù¥•Ü°Í•°¹™É½´¤ì(€€€€€€€¥˜€ …Í•°¹•µÁÑä€˜˜€…Í•°¸‘™É½´¹Á…É•¹Ð¹¥¹±¥¹•½¹Ñ•¹Ð¤(€€€€€€€€€É•Í•Ñ‘¥Ñ…‰±•Q¼€ôÑ•µÁ½É…É¥±å‘¥Ñ…‰±•9•…È¡Ù¥•Ü°Í•°¹Ñ¼¤ì(€€€€€ô(€€€€€Ù¥•Ü¹‘½Y¥•Ü¹Í•ÑM•±•Ñ¥½¸¡…¹¡½È°¡•…°Ù¥•Ü°™½É”¤ì(€€€€€¥˜€¡‰É½­•¹M•±•Ñ	•ÑÝ••¹U¹•‘¥Ñ…‰±”¤ì(€€€€€€€¥˜€¡É•Í•Ñ‘¥Ñ…‰±•É½´¤(€€€€€€€€€É•Í•Ñ‘¥Ñ…‰±”¡É•Í•Ñ‘¥Ñ…‰±•É½´¤ì(€€€€€€€¥˜€¡É•Í•Ñ‘¥Ñ…‰±•Q¼¤(€€€€€€€€€É•Í•Ñ‘¥Ñ…‰±”¡É•Í•Ñ‘¥Ñ…‰±•Q¼¤ì(€€€€€ô(€€€€€¥˜€¡Í•°¹Ù¥Í¥‰±”¤ì(€€€€€€€Ù¥•Ü¹‘½´¹±…ÍÍ1¥ÍÐ¹É•µ½Ù” ‰AÉ½Í•5¥ÉÉ½Èµ¡¥‘•Í•±•Ñ¥½¸ˆ¤ì(€€€€€ô•±Í”ì(€€€€€€€Ù¥•Ü¹‘½´¹±…ÍÍ1¥ÍÐ¹…‘ ‰AÉ½Í•5¥ÉÉ½Èµ¡¥‘•Í•±•Ñ¥½¸ˆ¤ì(€€€€€€€¥˜€ ‰½¹Í•±•Ñ¥½¹¡…¹”ˆ¥¸‘½Õµ•¹Ð¤(€€€€€€€€€É•µ½Ù•±…ÍÍ=¹M•±•Ñ¥½¹¡…¹”¡Ù¥•Ü¤ì(€€€€€ô(€€€ô(€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹Í•ÑÕÉM•±•Ñ¥½¸ ¤ì(€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹½¹¹•ÑM•±•Ñ¥½¸ ¤ì(€ô(€Ù…È‰É½­•¹M•±•Ñ	•ÑÝ••¹U¹•‘¥Ñ…‰±”€ôÍ…™…É¤ñð¡É½µ”€˜˜¡É½µ•}Ù•ÉÍ¥½¸€ð€ØÌì(€™Õ¹Ñ¥½¸Ñ•µÁ½É…É¥±å‘¥Ñ…‰±•9•…È¡Ù¥•Ü°Á½Ì¤ì(€€€±•Ðì¹½‘”°½™™Í•Ðô€ôÙ¥•Ü¹‘½Y¥•Ü¹‘½µÉ½µA½Ì¡Á½Ì°€À¤ì(€€€±•Ð…™Ñ•È€ô½™™Í•Ð€ð¹½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ €ü¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ñt€è¹Õ±°ì(€€€±•Ð‰•™½É”€ô½™™Í•Ð€ü¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ð€´€Åt€è¹Õ±°ì(€€€¥˜€¡Í…™…É¤€˜˜…™Ñ•È€˜˜…™Ñ•È¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤(€€€€€É•ÑÕÉ¸Í•Ñ‘¥Ñ…‰±”¡…™Ñ•È¤ì(€€€¥˜€  ……™Ñ•Èñð…™Ñ•È¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤€˜˜€ …‰•™½É”ñð‰•™½É”¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤¤ì(€€€€€¥˜€¡…™Ñ•È¤(€€€€€€€É•ÑÕÉ¸Í•Ñ‘¥Ñ…‰±”¡…™Ñ•È¤ì(€€€€€•±Í”¥˜€¡‰•™½É”¤(€€€€€€€É•ÑÕÉ¸Í•Ñ‘¥Ñ…‰±”¡‰•™½É”¤ì(€€€ô(€ô(€™Õ¹Ñ¥½¸Í•Ñ‘¥Ñ…‰±”¡•±•µ•¹ÐÈ¤ì(€€€•±•µ•¹ÐÈ¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ô€‰ÑÉÕ”ˆì(€€€¥˜€¡Í…™…É¤€˜˜•±•µ•¹ÐÈ¹‘É……‰±”¤ì(€€€€€•±•µ•¹ÐÈ¹‘É……‰±”€ô™…±Í”ì(€€€€€•±•µ•¹ÐÈ¹Ý…ÍÉ……‰±”€ôÑÉÕ”ì(€€€ô(€€€É•ÑÕÉ¸•±•µ•¹ÐÈì(€ô(€™Õ¹Ñ¥½¸É•Í•Ñ‘¥Ñ…‰±”¡•±•µ•¹ÐÈ¤ì(€€€•±•µ•¹ÐÈ¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ô€‰™…±Í”ˆì(€€€¥˜€¡•±•µ•¹ÐÈ¹Ý…ÍÉ……‰±”¤ì(€€€€€•±•µ•¹ÐÈ¹‘É……‰±”€ôÑÉÕ”ì(€€€€€•±•µ•¹ÐÈ¹Ý…ÍÉ……‰±”€ô¹Õ±°ì(€€€ô(€ô(€™Õ¹Ñ¥½¸É•µ½Ù•±…ÍÍ=¹M•±•Ñ¥½¹¡…¹”¡Ù¥•Ü¤ì(€€€±•Ð‘½ŒÔ€ôÙ¥•Ü¹‘½´¹½Ý¹•É½Õµ•¹Ðì(€€€‘½ŒÔ¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È ‰Í•±•Ñ¥½¹¡…¹”ˆ°Ù¥•Ü¹¥¹ÁÕÐ¹¡¥‘•M•±•Ñ¥½¹Õ…É¤ì(€€€±•Ð‘½µM•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€±•Ð¹½‘”€ô‘½µM•°¹…¹¡½É9½‘”°½™™Í•Ð€ô‘½µM•°¹…¹¡½É=™™Í•Ðì(€€€‘½ŒÔ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰Í•±•Ñ¥½¹¡…¹”ˆ°Ù¥•Ü¹¥¹ÁÕÐ¹¡¥‘•M•±•Ñ¥½¹Õ…É€ô€ ¤€ôøì(€€€€€¥˜€¡‘½µM•°¹…¹¡½É9½‘”€„ô¹½‘”ñð‘½µM•°¹…¹¡½É=™™Í•Ð€„ô½™™Í•Ð¤ì(€€€€€€€‘½ŒÔ¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È ‰Í•±•Ñ¥½¹¡…¹”ˆ°Ù¥•Ü¹¥¹ÁÕÐ¹¡¥‘•M•±•Ñ¥½¹Õ…É¤ì(€€€€€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€€€€€¥˜€ …•‘¥Ñ½É=Ý¹ÍM•±•Ñ¥½¸¡Ù¥•Ü¤ñðÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ù¥Í¥‰±”¤(€€€€€€€€€€€Ù¥•Ü¹‘½´¹±…ÍÍ1¥ÍÐ¹É•µ½Ù” ‰AÉ½Í•5¥ÉÉ½Èµ¡¥‘•Í•±•Ñ¥½¸ˆ¤ì(€€€€€€€ô°€ÈÀ¤ì(€€€€€ô(€€€ô¤ì(€ô(€™Õ¹Ñ¥½¸Í•±•ÑÕÉÍ½É]É…ÁÁ•È¡Ù¥•Ü¤ì(€€€±•Ð‘½µM•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¸ ¤ì(€€€¥˜€ …‘½µM•°¤(€€€€€É•ÑÕÉ¸ì(€€€±•Ð¹½‘”€ôÙ¥•Ü¹ÕÉÍ½É]É…ÁÁ•È¹‘½´°¥µœ€ô¹½‘”¹¹½‘•9…µ”€ôô€‰%5ˆì(€€€¥˜€¡¥µœ¤(€€€€€‘½µM•°¹½±±…ÁÍ”¡¹½‘”¹Á…É•¹Ñ9½‘”°‘½µ%¹‘•à¡¹½‘”¤€¬€Ä¤ì(€€€•±Í”(€€€€€‘½µM•°¹½±±…ÁÍ”¡¹½‘”°€À¤ì(€€€¥˜€ …¥µœ€˜˜€…Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ù¥Í¥‰±”€˜˜¥”€˜˜¥•}Ù•ÉÍ¥½¸€ðô€ÄÄ¤ì(€€€€€¹½‘”¹‘¥Í…‰±•€ôÑÉÕ”ì(€€€€€¹½‘”¹‘¥Í…‰±•€ô™…±Í”ì(€€€ô(€ô(€™Õ¹Ñ¥½¸Íå¹9½‘•M•±•Ñ¥½¸¡Ù¥•Ü°Í•°¤ì(€€€¥˜€¡Í•°¥¹ÍÑ…¹•½˜9½‘•M•±•Ñ¥½¸¤ì(€€€€€±•Ð‘•ÍŒ€ôÙ¥•Ü¹‘½Y¥•Ü¹‘•ÍÐ¡Í•°¹™É½´¤ì(€€€€€¥˜€¡‘•ÍŒ€„ôÙ¥•Ü¹±…ÍÑM•±•Ñ•‘Y¥•Ý•ÍŒ¤ì(€€€€€€€±•…É9½‘•M•±•Ñ¥½¸¡Ù¥•Ü¤ì(€€€€€€€¥˜€¡‘•ÍŒ¤(€€€€€€€€€‘•ÍŒ¹Í•±•Ñ9½‘” ¤ì(€€€€€€€Ù¥•Ü¹±…ÍÑM•±•Ñ•‘Y¥•Ý•ÍŒ€ô‘•ÍŒì(€€€€€ô(€€€ô•±Í”ì(€€€€€±•…É9½‘•M•±•Ñ¥½¸¡Ù¥•Ü¤ì(€€€ô(€ô(€™Õ¹Ñ¥½¸±•…É9½‘•M•±•Ñ¥½¸¡Ù¥•Ü¤ì(€€€¥˜€¡Ù¥•Ü¹±…ÍÑM•±•Ñ•‘Y¥•Ý•ÍŒ¤ì(€€€€€¥˜€¡Ù¥•Ü¹±…ÍÑM•±•Ñ•‘Y¥•Ý•ÍŒ¹Á…É•¹Ð¤(€€€€€€€Ù¥•Ü¹±…ÍÑM•±•Ñ•‘Y¥•Ý•ÍŒ¹‘•Í•±•Ñ9½‘” ¤ì(€€€€€Ù¥•Ü¹±…ÍÑM•±•Ñ•‘Y¥•Ý•ÍŒ€ôÙ½¥€Àì(€€€ô(€ô(€™Õ¹Ñ¥½¸Í•±•Ñ¥½¹	•ÑÝ••¸¡Ù¥•Ü°€‘…¹¡½È°€‘¡•…°‰¥…Ì¤ì(€€€É•ÑÕÉ¸Ù¥•Ü¹Í½µ•AÉ½À ‰É•…Ñ•M•±•Ñ¥½¹	•ÑÝ••¸ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°€‘…¹¡½È°€‘¡•…¤¤ñðQ•áÑM•±•Ñ¥½¸¹‰•ÑÝ••¸ ‘…¹¡½È°€‘¡•…°‰¥…Ì¤ì(€ô(€™Õ¹Ñ¥½¸¡…Í½ÕÍ¹‘M•±•Ñ¥½¸¡Ù¥•Ü¤ì(€€€¥˜€¡Ù¥•Ü¹•‘¥Ñ…‰±”€˜˜€…Ù¥•Ü¹¡…Í½ÕÌ ¤¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€É•ÑÕÉ¸¡…ÍM•±•Ñ¥½¸¡Ù¥•Ü¤ì(€ô(€™Õ¹Ñ¥½¸¡…ÍM•±•Ñ¥½¸¡Ù¥•Ü¤ì(€€€±•ÐÍ•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€¥˜€ …Í•°¹…¹¡½É9½‘”¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ÑÉäì(€€€€€É•ÑÕÉ¸½¹Ñ…¥¹Ì¡Ù¥•Ü¹‘½´°Í•°¹…¹¡½É9½‘”¤€˜˜€¡Ù¥•Ü¹•‘¥Ñ…‰±”ñð½¹Ñ…¥¹Ì¡Ù¥•Ü¹‘½´°Í•°¹™½ÕÍ9½‘”¤¤ì(€€€ô…Ñ €¡|¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€ô(€™Õ¹Ñ¥½¸…¹¡½É%¹I¥¡ÑA±…”¡Ù¥•Ü¤ì(€€€±•Ð…¹¡½É=4€ôÙ¥•Ü¹‘½Y¥•Ü¹‘½µÉ½µA½Ì¡Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹…¹¡½È°€À¤ì(€€€±•Ð‘½µM•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€É•ÑÕÉ¸¥ÍÅÕ¥Ù…±•¹ÑA½Í¥Ñ¥½¸¡…¹¡½É=4¹¹½‘”°…¹¡½É=4¹½™™Í•Ð°‘½µM•°¹…¹¡½É9½‘”°‘½µM•°¹…¹¡½É=™™Í•Ð¤ì(€ô(€™Õ¹Ñ¥½¸µ½Ù•M•±•Ñ¥½¹	±½¬¡ÍÑ…Ñ”°‘¥È¤ì(€€€±•Ðì€‘…¹¡½È°€‘¡•…ô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€±•Ð€‘Í¥‘”€ô‘¥È€ø€À€ü€‘…¹¡½È¹µ…à ‘¡•…¤€è€‘…¹¡½È¹µ¥¸ ‘¡•…¤ì(€€€±•Ð€‘ÍÑ…ÉÐ€ô€„‘Í¥‘”¹Á…É•¹Ð¹¥¹±¥¹•½¹Ñ•¹Ð€ü€‘Í¥‘”€è€‘Í¥‘”¹‘•ÁÑ €üÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡‘¥È€ø€À€ü€‘Í¥‘”¹…™Ñ•È ¤€è€‘Í¥‘”¹‰•™½É” ¤¤€è¹Õ±°ì(€€€É•ÑÕÉ¸€‘ÍÑ…ÉÐ€˜˜M•±•Ñ¥½¸¹™¥¹‘É½´ ‘ÍÑ…ÉÐ°‘¥È¤ì(€ô(€™Õ¹Ñ¥½¸…ÁÁ±ä¡Ù¥•Ü°Í•°¤ì(€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡Ù¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Í•°¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ô(€™Õ¹Ñ¥½¸Í•±•Ñ!½É¥é½¹Ñ…±±ä¡Ù¥•Ü°‘¥È°µ½‘Ì¤ì(€€€±•ÐÍ•°€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€¥˜€¡Í•°¥¹ÍÑ…¹•½˜Q•áÑM•±•Ñ¥½¸¤ì(€€€€€¥˜€¡µ½‘Ì¹¥¹‘•á=˜ ‰Ìˆ¤€ø€´Ä¤ì(€€€€€€€±•Ðì€‘¡•…ô€ôÍ•°°¹½‘”€ô€‘¡•…¹Ñ•áÑ=™™Í•Ð€ü¹Õ±°€è‘¥È€ð€À€ü€‘¡•…¹¹½‘•	•™½É”€è€‘¡•…¹¹½‘•™Ñ•Èì(€€€€€€€¥˜€ …¹½‘”ñð¹½‘”¹¥ÍQ•áÐñð€…¹½‘”¹¥Í1•…˜¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€±•Ð€‘¹•Ý!•…€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù” ‘¡•…¹Á½Ì€¬¹½‘”¹¹½‘•M¥é”€¨€¡‘¥È€ð€À€ü€´Ä€è€Ä¤¤ì(€€€€€€€É•ÑÕÉ¸…ÁÁ±ä¡Ù¥•Ü°¹•ÜQ•áÑM•±•Ñ¥½¸¡Í•°¸‘…¹¡½È°€‘¹•Ý!•…¤¤ì(€€€€€ô•±Í”¥˜€ …Í•°¹•µÁÑä¤ì(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€ô•±Í”¥˜€¡Ù¥•Ü¹•¹‘=™Q•áÑ‰±½¬¡‘¥È€ø€À€ü€‰™½ÉÝ…Éˆ€è€‰‰…­Ý…Éˆ¤¤ì(€€€€€€€±•Ð¹•áÐ€ôµ½Ù•M•±•Ñ¥½¹	±½¬¡Ù¥•Ü¹ÍÑ…Ñ”°‘¥È¤ì(€€€€€€€¥˜€¡¹•áÐ€˜˜¹•áÐ¥¹ÍÑ…¹•½˜9½‘•M•±•Ñ¥½¸¤(€€€€€€€€€É•ÑÕÉ¸…ÁÁ±ä¡Ù¥•Ü°¹•áÐ¤ì(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€ô•±Í”¥˜€ „¡µ…Œ€˜˜µ½‘Ì¹¥¹‘•á=˜ ‰´ˆ¤€ø€´Ä¤¤ì(€€€€€€€±•Ð€‘¡•…€ôÍ•°¸‘¡•…°¹½‘”€ô€‘¡•…¹Ñ•áÑ=™™Í•Ð€ü¹Õ±°€è‘¥È€ð€À€ü€‘¡•…¹¹½‘•	•™½É”€è€‘¡•…¹¹½‘•™Ñ•È°‘•ÍŒì(€€€€€€€¥˜€ …¹½‘”ñð¹½‘”¹¥ÍQ•áÐ¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€±•Ð¹½‘•A½Ì€ô‘¥È€ð€À€ü€‘¡•…¹Á½Ì€´¹½‘”¹¹½‘•M¥é”€è€‘¡•…¹Á½Ìì(€€€€€€€¥˜€ „¡¹½‘”¹¥ÍÑ½´ñð€¡‘•ÍŒ€ôÙ¥•Ü¹‘½Y¥•Ü¹‘•ÍÐ¡¹½‘•A½Ì¤¤€˜˜€…‘•ÍŒ¹½¹Ñ•¹Ñ=4¤¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€¥˜€¡9½‘•M•±•Ñ¥½¸¹¥ÍM•±•Ñ…‰±”¡¹½‘”¤¤ì(€€€€€€€€€É•ÑÕÉ¸…ÁÁ±ä¡Ù¥•Ü°¹•Ü9½‘•M•±•Ñ¥½¸¡‘¥È€ð€À€üÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù” ‘¡•…¹Á½Ì€´¹½‘”¹¹½‘•M¥é”¤€è€‘¡•…¤¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€É•ÑÕÉ¸…ÁÁ±ä¡Ù¥•Ü°¹•ÜQ•áÑM•±•Ñ¥½¸¡Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡‘¥È€ð€À€ü¹½‘•A½Ì€è¹½‘•A½Ì€¬¹½‘”¹¹½‘•M¥é”¤¤¤ì(€€€€€€€ô(€€€€€ô(€€€ô•±Í”¥˜€¡Í•°¥¹ÍÑ…¹•½˜9½‘•M•±•Ñ¥½¸€˜˜Í•°¹¹½‘”¹¥Í%¹±¥¹”¤ì(€€€€€É•ÑÕÉ¸…ÁÁ±ä¡Ù¥•Ü°¹•ÜQ•áÑM•±•Ñ¥½¸¡‘¥È€ø€À€üÍ•°¸‘Ñ¼€èÍ•°¸‘™É½´¤¤ì(€€€ô•±Í”ì(€€€€€±•Ð¹•áÐ€ôµ½Ù•M•±•Ñ¥½¹	±½¬¡Ù¥•Ü¹ÍÑ…Ñ”°‘¥È¤ì(€€€€€¥˜€¡¹•áÐ¤(€€€€€€€É•ÑÕÉ¸…ÁÁ±ä¡Ù¥•Ü°¹•áÐ¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€ô(€™Õ¹Ñ¥½¸¥Í%¹½É…‰±”¡‘½´°‘¥È¤ì(€€€±•Ð‘•ÍŒ€ô‘½´¹ÁµY¥•Ý•ÍŒì(€€€É•ÑÕÉ¸‘•ÍŒ€ü‘•ÍŒ¹Í¥é”€ôô€À€˜˜€¡‘¥È€ð€Àñð‘½´¹¹•áÑM¥‰±¥¹œñð‘½´¹¹½‘•9…µ”€„ô€‰	Hˆ¤€è¥Í±Ð¡‘½´¤€˜˜‘½´¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆì(€ô(€™Õ¹Ñ¥½¸Í­¥Á%¹½É•‘9½‘•Ì¡Ù¥•Ü°‘¥È¤ì(€€€É•ÑÕÉ¸‘¥È€ð€À€üÍ­¥Á%¹½É•‘9½‘•Í	•™½É”¡Ù¥•Ü¤€èÍ­¥Á%¹½É•‘9½‘•Í™Ñ•È¡Ù¥•Ü¤ì(€ô(€™Õ¹Ñ¥½¸Í­¥Á%¹½É•‘9½‘•Í	•™½É”¡Ù¥•Ü¤ì(€€€±•ÐÍ•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€±•Ð¹½‘”€ôÍ•°¹™½ÕÍ9½‘”°½™™Í•Ð€ôÍ•°¹™½ÕÍ=™™Í•Ðì(€€€¥˜€ …¹½‘”¤(€€€€€É•ÑÕÉ¸ì(€€€±•Ðµ½Ù•9½‘”°µ½Ù•=™™Í•Ð°™½É”€ô™…±Í”ì(€€€¥˜€¡•­¼€˜˜¥Í±Ð¡¹½‘”¤€˜˜½™™Í•Ð€ð¹½‘•M¥é”¡¹½‘”¤€˜˜¥Í%¹½É…‰±”¡¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ñt°€´Ä¤¤(€€€€€™½É”€ôÑÉÕ”ì(€€€™½È€ ì€ì€¤ì(€€€€€¥˜€¡½™™Í•Ð€ø€À¤ì(€€€€€€€¥˜€ …¥Í±Ð¡¹½‘”¤¤(€€€€€€€€€‰É•…¬ì(€€€€€€€±•Ð‰•™½É”€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ð€´€Åtì(€€€€€€€¥˜€¡¥Í%¹½É…‰±”¡‰•™½É”°€´Ä¤¤ì(€€€€€€€€€µ½Ù•9½‘”€ô¹½‘”ì(€€€€€€€€€µ½Ù•=™™Í•Ð€ô€´µ½™™Í•Ðì(€€€€€€€ô•±Í”¥˜€¡¥ÍQ•áÐ¡‰•™½É”¤¤ì(€€€€€€€€€¹½‘”€ô‰•™½É”ì(€€€€€€€€€½™™Í•Ð€ô¹½‘”¹¹½‘•Y…±Õ”¹±•¹Ñ ì(€€€€€€€ô•±Í”ì(€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€ô•±Í”¥˜€¡¥Í	±½­9½‘”¡¹½‘”¤¤ì(€€€€€€€‰É•…¬ì(€€€€€ô•±Í”ì(€€€€€€€±•ÐÁÉ•Ø€ô¹½‘”¹ÁÉ•Ù¥½ÕÍM¥‰±¥¹œì(€€€€€€€Ý¡¥±”€¡ÁÉ•Ø€˜˜¥Í%¹½É…‰±”¡ÁÉ•Ø°€´Ä¤¤ì(€€€€€€€€€µ½Ù•9½‘”€ô¹½‘”¹Á…É•¹Ñ9½‘”ì(€€€€€€€€€µ½Ù•=™™Í•Ð€ô‘½µ%¹‘•à¡ÁÉ•Ø¤ì(€€€€€€€€€ÁÉ•Ø€ôÁÉ•Ø¹ÁÉ•Ù¥½ÕÍM¥‰±¥¹œì(€€€€€€€ô(€€€€€€€¥˜€ …ÁÉ•Ø¤ì(€€€€€€€€€¹½‘”€ô¹½‘”¹Á…É•¹Ñ9½‘”ì(€€€€€€€€€¥˜€¡¹½‘”€ôôÙ¥•Ü¹‘½´¤(€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€½™™Í•Ð€ô€Àì(€€€€€€€ô•±Í”ì(€€€€€€€€€¹½‘”€ôÁÉ•Øì(€€€€€€€€€½™™Í•Ð€ô¹½‘•M¥é”¡¹½‘”¤ì(€€€€€€€ô(€€€€€ô(€€€ô(€€€¥˜€¡™½É”¤(€€€€€Í•ÑM•±½ÕÌ¡Ù¥•Ü°¹½‘”°½™™Í•Ð¤ì(€€€•±Í”¥˜€¡µ½Ù•9½‘”¤(€€€€€Í•ÑM•±½ÕÌ¡Ù¥•Ü°µ½Ù•9½‘”°µ½Ù•=™™Í•Ð¤ì(€ô(€™Õ¹Ñ¥½¸Í­¥Á%¹½É•‘9½‘•Í™Ñ•È¡Ù¥•Ü¤ì(€€€±•ÐÍ•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€±•Ð¹½‘”€ôÍ•°¹™½ÕÍ9½‘”°½™™Í•Ð€ôÍ•°¹™½ÕÍ=™™Í•Ðì(€€€¥˜€ …¹½‘”¤(€€€€€É•ÑÕÉ¸ì(€€€±•Ð±•¸€ô¹½‘•M¥é”¡¹½‘”¤ì(€€€±•Ðµ½Ù•9½‘”°µ½Ù•=™™Í•Ðì(€€€™½È€ ì€ì€¤ì(€€€€€¥˜€¡½™™Í•Ð€ð±•¸¤ì(€€€€€€€¥˜€ …¥Í±Ð¡¹½‘”¤¤(€€€€€€€€€‰É•…¬ì(€€€€€€€±•Ð…™Ñ•È€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ñtì(€€€€€€€¥˜€¡¥Í%¹½É…‰±”¡…™Ñ•È°€Ä¤¤ì(€€€€€€€€€µ½Ù•9½‘”€ô¹½‘”ì(€€€€€€€€€µ½Ù•=™™Í•Ð€ô€¬­½™™Í•Ðì(€€€€€€€ô•±Í”ì(€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€ô•±Í”¥˜€¡¥Í	±½­9½‘”¡¹½‘”¤¤ì(€€€€€€€‰É•…¬ì(€€€€€ô•±Í”ì(€€€€€€€±•Ð¹•áÐ€ô¹½‘”¹¹•áÑM¥‰±¥¹œì(€€€€€€€Ý¡¥±”€¡¹•áÐ€˜˜¥Í%¹½É…‰±”¡¹•áÐ°€Ä¤¤ì(€€€€€€€€€µ½Ù•9½‘”€ô¹•áÐ¹Á…É•¹Ñ9½‘”ì(€€€€€€€€€µ½Ù•=™™Í•Ð€ô‘½µ%¹‘•à¡¹•áÐ¤€¬€Äì(€€€€€€€€€¹•áÐ€ô¹•áÐ¹¹•áÑM¥‰±¥¹œì(€€€€€€€ô(€€€€€€€¥˜€ …¹•áÐ¤ì(€€€€€€€€€¹½‘”€ô¹½‘”¹Á…É•¹Ñ9½‘”ì(€€€€€€€€€¥˜€¡¹½‘”€ôôÙ¥•Ü¹‘½´¤(€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€½™™Í•Ð€ô±•¸€ô€Àì(€€€€€€€ô•±Í”ì(€€€€€€€€€¹½‘”€ô¹•áÐì(€€€€€€€€€½™™Í•Ð€ô€Àì(€€€€€€€€€±•¸€ô¹½‘•M¥é”¡¹½‘”¤ì(€€€€€€€ô(€€€€€ô(€€€ô(€€€¥˜€¡µ½Ù•9½‘”¤(€€€€€Í•ÑM•±½ÕÌ¡Ù¥•Ü°µ½Ù•9½‘”°µ½Ù•=™™Í•Ð¤ì(€ô(€™Õ¹Ñ¥½¸¥Í	±½­9½‘”¡‘½´¤ì(€€€±•Ð‘•ÍŒ€ô‘½´¹ÁµY¥•Ý•ÍŒì(€€€É•ÑÕÉ¸‘•ÍŒ€˜˜‘•ÍŒ¹¹½‘”€˜˜‘•ÍŒ¹¹½‘”¹¥Í	±½¬ì(€ô(€™Õ¹Ñ¥½¸Ñ•áÑ9½‘•™Ñ•È¡¹½‘”°½™™Í•Ð¤ì(€€€Ý¡¥±”€¡¹½‘”€˜˜½™™Í•Ð€ôô¹½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ €˜˜€…¡…Í	±½­•ÍŒ¡¹½‘”¤¤ì(€€€€€½™™Í•Ð€ô‘½µ%¹‘•à¡¹½‘”¤€¬€Äì(€€€€€¹½‘”€ô¹½‘”¹Á…É•¹Ñ9½‘”ì(€€€ô(€€€Ý¡¥±”€¡¹½‘”€˜˜½™™Í•Ð€ð¹½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ ¤ì(€€€€€±•Ð¹•áÐ€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ñtì(€€€€€¥˜€¡¥ÍQ•áÐ¡¹•áÐ¤¤(€€€€€€€É•ÑÕÉ¸¹•áÐì(€€€€€¥˜€¡¥Í±Ð¡¹•áÐ¤€˜˜¹•áÐ¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤(€€€€€€€‰É•…¬ì(€€€€€¹½‘”€ô¹•áÐì(€€€€€½™™Í•Ð€ô€Àì(€€€ô(€ô(€™Õ¹Ñ¥½¸Ñ•áÑ9½‘•	•™½É”¡¹½‘”°½™™Í•Ð¤ì(€€€Ý¡¥±”€¡¹½‘”€˜˜€…½™™Í•Ð€˜˜€…¡…Í	±½­•ÍŒ¡¹½‘”¤¤ì(€€€€€½™™Í•Ð€ô‘½µ%¹‘•à¡¹½‘”¤ì(€€€€€¹½‘”€ô¹½‘”¹Á…É•¹Ñ9½‘”ì(€€€ô(€€€Ý¡¥±”€¡¹½‘”€˜˜½™™Í•Ð¤ì(€€€€€±•Ð¹•áÐ€ô¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ð€´€Åtì(€€€€€¥˜€¡¥ÍQ•áÐ¡¹•áÐ¤¤(€€€€€€€É•ÑÕÉ¸¹•áÐì(€€€€€¥˜€¡¥Í±Ð¡¹•áÐ¤€˜˜¹•áÐ¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤(€€€€€€€‰É•…¬ì(€€€€€¹½‘”€ô¹•áÐì(€€€€€½™™Í•Ð€ô¹½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ ì(€€€ô(€ô(€™Õ¹Ñ¥½¸Í•ÑM•±½ÕÌ¡Ù¥•Ü°¹½‘”°½™™Í•Ð¤ì(€€€¥˜€ …¥ÍQ•áÐ¡¹½‘”¤¤ì(€€€€€±•Ð‰•™½É”°…™Ñ•Èì(€€€€€¥˜€¡…™Ñ•È€ôÑ•áÑ9½‘•™Ñ•È¡¹½‘”°½™™Í•Ð¤¤ì(€€€€€€€¹½‘”€ô…™Ñ•Èì(€€€€€€€½™™Í•Ð€ô€Àì(€€€€€ô•±Í”¥˜€¡‰•™½É”€ôÑ•áÑ9½‘•	•™½É”¡¹½‘”°½™™Í•Ð¤¤ì(€€€€€€€¹½‘”€ô‰•™½É”ì(€€€€€€€½™™Í•Ð€ô‰•™½É”¹¹½‘•Y…±Õ”¹±•¹Ñ ì(€€€€€ô(€€€ô(€€€±•ÐÍ•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¸ ¤ì(€€€¥˜€ …Í•°¤(€€€€€É•ÑÕÉ¸ì(€€€¥˜€¡Í•±•Ñ¥½¹½±±…ÁÍ•¡Í•°¤¤ì(€€€€€±•ÐÉ…¹”€ô‘½Õµ•¹Ð¹É•…Ñ•I…¹” ¤ì(€€€€€É…¹”¹Í•Ñ¹¡¹½‘”°½™™Í•Ð¤ì(€€€€€É…¹”¹Í•ÑMÑ…ÉÐ¡¹½‘”°½™™Í•Ð¤ì(€€€€€Í•°¹É•µ½Ù•±±I…¹•Ì ¤ì(€€€€€Í•°¹…‘‘I…¹”¡É…¹”¤ì(€€€ô•±Í”¥˜€¡Í•°¹•áÑ•¹¤ì(€€€€€Í•°¹•áÑ•¹¡¹½‘”°½™™Í•Ð¤ì(€€€ô(€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹Í•ÑÕÉM•±•Ñ¥½¸ ¤ì(€€€±•ÐìÍÑ…Ñ”ô€ôÙ¥•Üì(€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€¥˜€¡Ù¥•Ü¹ÍÑ…Ñ”€ôôÍÑ…Ñ”¤(€€€€€€€Í•±•Ñ¥½¹Q½=4¡Ù¥•Ü¤ì(€€€ô°€ÔÀ¤ì(€ô(€™Õ¹Ñ¥½¸™¥¹‘¥É•Ñ¥½¸¡Ù¥•Ü°Á½Ì¤ì(€€€±•Ð€‘Á½Ì€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡Á½Ì¤ì(€€€¥˜€ „¡¡É½µ”ñðÝ¥¹‘½ÝÌ¤€˜˜€‘Á½Ì¹Á…É•¹Ð¹¥¹±¥¹•½¹Ñ•¹Ð¤ì(€€€€€±•Ð½½É‘Ì€ôÙ¥•Ü¹½½É‘ÍÑA½Ì¡Á½Ì¤ì(€€€€€¥˜€¡Á½Ì€ø€‘Á½Ì¹ÍÑ…ÉÐ ¤¤ì(€€€€€€€±•Ð‰•™½É”€ôÙ¥•Ü¹½½É‘ÍÑA½Ì¡Á½Ì€´€Ä¤ì(€€€€€€€±•Ðµ¥€ô€¡‰•™½É”¹Ñ½À€¬‰•™½É”¹‰½ÑÑ½´¤€¼€Èì(€€€€€€€¥˜€¡µ¥€ø½½É‘Ì¹Ñ½À€˜˜µ¥€ð½½É‘Ì¹‰½ÑÑ½´€˜˜5…Ñ ¹…‰Ì¡‰•™½É”¹±•™Ð€´½½É‘Ì¹±•™Ð¤€ø€Ä¤(€€€€€€€€€É•ÑÕÉ¸‰•™½É”¹±•™Ð€ð½½É‘Ì¹±•™Ð€ü€‰±ÑÈˆ€è€‰ÉÑ°ˆì(€€€€€ô(€€€€€¥˜€¡Á½Ì€ð€‘Á½Ì¹•¹ ¤¤ì(€€€€€€€±•Ð…™Ñ•È€ôÙ¥•Ü¹½½É‘ÍÑA½Ì¡Á½Ì€¬€Ä¤ì(€€€€€€€±•Ðµ¥€ô€¡…™Ñ•È¹Ñ½À€¬…™Ñ•È¹‰½ÑÑ½´¤€¼€Èì(€€€€€€€¥˜€¡µ¥€ø½½É‘Ì¹Ñ½À€˜˜µ¥€ð½½É‘Ì¹‰½ÑÑ½´€˜˜5…Ñ ¹…‰Ì¡…™Ñ•È¹±•™Ð€´½½É‘Ì¹±•™Ð¤€ø€Ä¤(€€€€€€€€€É•ÑÕÉ¸…™Ñ•È¹±•™Ð€ø½½É‘Ì¹±•™Ð€ü€‰±ÑÈˆ€è€‰ÉÑ°ˆì(€€€€€ô(€€€ô(€€€±•Ð½µÁÕÑ•€ô•Ñ½µÁÕÑ•‘MÑå±”¡Ù¥•Ü¹‘½´¤¹‘¥É•Ñ¥½¸ì(€€€É•ÑÕÉ¸½µÁÕÑ•€ôô€‰ÉÑ°ˆ€ü€‰ÉÑ°ˆ€è€‰±ÑÈˆì(€ô(€™Õ¹Ñ¥½¸Í•±•ÑY•ÉÑ¥…±±ä¡Ù¥•Ü°‘¥È°µ½‘Ì¤ì(€€€±•ÐÍ•°€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€¥˜€¡Í•°¥¹ÍÑ…¹•½˜Q•áÑM•±•Ñ¥½¸€˜˜€…Í•°¹•µÁÑäñðµ½‘Ì¹¥¹‘•á=˜ ‰Ìˆ¤€ø€´Ä¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€¡µ…Œ€˜˜µ½‘Ì¹¥¹‘•á=˜ ‰´ˆ¤€ø€´Ä¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ðì€‘™É½´°€‘Ñ¼ô€ôÍ•°ì(€€€¥˜€ „‘™É½´¹Á…É•¹Ð¹¥¹±¥¹•½¹Ñ•¹ÐñðÙ¥•Ü¹•¹‘=™Q•áÑ‰±½¬¡‘¥È€ð€À€ü€‰ÕÀˆ€è€‰‘½Ý¸ˆ¤¤ì(€€€€€±•Ð¹•áÐ€ôµ½Ù•M•±•Ñ¥½¹	±½¬¡Ù¥•Ü¹ÍÑ…Ñ”°‘¥È¤ì(€€€€€¥˜€¡¹•áÐ€˜˜¹•áÐ¥¹ÍÑ…¹•½˜9½‘•M•±•Ñ¥½¸¤(€€€€€€€É•ÑÕÉ¸…ÁÁ±ä¡Ù¥•Ü°¹•áÐ¤ì(€€€ô(€€€¥˜€ „‘™É½´¹Á…É•¹Ð¹¥¹±¥¹•½¹Ñ•¹Ð¤ì(€€€€€±•ÐÍ¥‘”€ô‘¥È€ð€À€ü€‘™É½´€è€‘Ñ¼ì(€€€€€±•Ð‰•å½¹€ôÍ•°¥¹ÍÑ…¹•½˜±±M•±•Ñ¥½¸€üM•±•Ñ¥½¸¹¹•…È¡Í¥‘”°‘¥È¤€èM•±•Ñ¥½¸¹™¥¹‘É½´¡Í¥‘”°‘¥È¤ì(€€€€€É•ÑÕÉ¸‰•å½¹€ü…ÁÁ±ä¡Ù¥•Ü°‰•å½¹¤€è™…±Í”ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ô(€™Õ¹Ñ¥½¸ÍÑ½Á9…Ñ¥Ù•!½É¥é½¹Ñ…±•±•Ñ”¡Ù¥•Ü°‘¥È¤ì(€€€¥˜€ „¡Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¥¹ÍÑ…¹•½˜Q•áÑM•±•Ñ¥½¸¤¤(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€±•Ðì€‘¡•…°€‘…¹¡½È°•µÁÑäè•µÁÑäÈô€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€¥˜€ „‘¡•…¹Í…µ•A…É•¹Ð ‘…¹¡½È¤¤(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€¥˜€ …•µÁÑäÈ¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€¡Ù¥•Ü¹•¹‘=™Q•áÑ‰±½¬¡‘¥È€ø€À€ü€‰™½ÉÝ…Éˆ€è€‰‰…­Ý…Éˆ¤¤(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€±•Ð¹•áÑ9½‘”€ô€„‘¡•…¹Ñ•áÑ=™™Í•Ð€˜˜€¡‘¥È€ð€À€ü€‘¡•…¹¹½‘•	•™½É”€è€‘¡•…¹¹½‘•™Ñ•È¤ì(€€€¥˜€¡¹•áÑ9½‘”€˜˜€…¹•áÑ9½‘”¹¥ÍQ•áÐ¤ì(€€€€€±•ÐÑÈ€ôÙ¥•Ü¹ÍÑ…Ñ”¹ÑÈì(€€€€€¥˜€¡‘¥È€ð€À¤(€€€€€€€ÑÈ¹‘•±•Ñ” ‘¡•…¹Á½Ì€´¹•áÑ9½‘”¹¹½‘•M¥é”°€‘¡•…¹Á½Ì¤ì(€€€€€•±Í”(€€€€€€€ÑÈ¹‘•±•Ñ” ‘¡•…¹Á½Ì°€‘¡•…¹Á½Ì€¬¹•áÑ9½‘”¹¹½‘•M¥é”¤ì(€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡ÑÈ¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ô(€™Õ¹Ñ¥½¸ÍÝ¥Ñ¡‘¥Ñ…‰±”¡Ù¥•Ü°¹½‘”°ÍÑ…Ñ”¤ì(€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÑ½À ¤ì(€€€¹½‘”¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôÍÑ…Ñ”ì(€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÑ…ÉÐ ¤ì(€ô(€™Õ¹Ñ¥½¸Í…™…É¥½Ý¹ÉÉ½Ý	Õœ¡Ù¥•Ü¤ì(€€€¥˜€ …Í…™…É¤ñðÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¸‘¡•…¹Á…É•¹Ñ=™™Í•Ð€ø€À¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ðì™½ÕÍ9½‘”°™½ÕÍ=™™Í•Ðô€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€¥˜€¡™½ÕÍ9½‘”€˜˜¥Í±Ð¡™½ÕÍ9½‘”¤€˜˜™½ÕÍ=™™Í•Ð€ôô€À€˜˜™½ÕÍ9½‘”¹™¥ÉÍÑ¡¥±€˜˜¥Í±Ð¡™½ÕÍ9½‘”¹™¥ÉÍÑ¡¥±¤€˜˜™½ÕÍ9½‘”¹™¥ÉÍÑ¡¥±¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤ì(€€€€€±•Ð¡¥±€ô™½ÕÍ9½‘”¹™¥ÉÍÑ¡¥±ì(€€€€€ÍÝ¥Ñ¡‘¥Ñ…‰±”¡Ù¥•Ü°¡¥±°€‰ÑÉÕ”ˆ¤ì(€€€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøÍÝ¥Ñ¡‘¥Ñ…‰±”¡Ù¥•Ü°¡¥±°€‰™…±Í”ˆ¤°€ÈÀ¤ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ô(€™Õ¹Ñ¥½¸•Ñ5½‘Ì¡•Ù•¹Ð¤ì(€€€±•ÐÉ•ÍÕ±Ð€ô€ˆˆì(€€€¥˜€¡•Ù•¹Ð¹ÑÉ±-•ä¤(€€€€€É•ÍÕ±Ð€¬ô€‰Œˆì(€€€¥˜€¡•Ù•¹Ð¹µ•Ñ…-•ä¤(€€€€€É•ÍÕ±Ð€¬ô€‰´ˆì(€€€¥˜€¡•Ù•¹Ð¹…±Ñ-•ä¤(€€€€€É•ÍÕ±Ð€¬ô€‰„ˆì(€€€¥˜€¡•Ù•¹Ð¹Í¡¥™Ñ-•ä¤(€€€€€É•ÍÕ±Ð€¬ô€‰Ìˆì(€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€ô(€™Õ¹Ñ¥½¸…ÁÑÕÉ•-•å½Ý¸¡Ù¥•Ü°•Ù•¹Ð¤ì(€€€±•Ð½‘”€ô•Ù•¹Ð¹­•å½‘”°µ½‘Ì€ô•Ñ5½‘Ì¡•Ù•¹Ð¤ì(€€€¥˜€¡½‘”€ôô€àñðµ…Œ€˜˜½‘”€ôô€ÜÈ€˜˜µ½‘Ì€ôô€‰Œˆ¤ì(€€€€€É•ÑÕÉ¸ÍÑ½Á9…Ñ¥Ù•!½É¥é½¹Ñ…±•±•Ñ”¡Ù¥•Ü°€´Ä¤ñðÍ­¥Á%¹½É•‘9½‘•Ì¡Ù¥•Ü°€´Ä¤ì(€€€ô•±Í”¥˜€¡½‘”€ôô€ÐØ€˜˜€…•Ù•¹Ð¹Í¡¥™Ñ-•äñðµ…Œ€˜˜½‘”€ôô€Øà€˜˜µ½‘Ì€ôô€‰Œˆ¤ì(€€€€€É•ÑÕÉ¸ÍÑ½Á9…Ñ¥Ù•!½É¥é½¹Ñ…±•±•Ñ”¡Ù¥•Ü°€Ä¤ñðÍ­¥Á%¹½É•‘9½‘•Ì¡Ù¥•Ü°€Ä¤ì(€€€ô•±Í”¥˜€¡½‘”€ôô€ÄÌñð½‘”€ôô€ÈÜ¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô•±Í”¥˜€¡½‘”€ôô€ÌÜñðµ…Œ€˜˜½‘”€ôô€ØØ€˜˜µ½‘Ì€ôô€‰Œˆ¤ì(€€€€€±•Ð‘¥È€ô½‘”€ôô€ÌÜ€ü™¥¹‘¥É•Ñ¥½¸¡Ù¥•Ü°Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´¤€ôô€‰±ÑÈˆ€ü€´Ä€è€Ä€è€´Äì(€€€€€É•ÑÕÉ¸Í•±•Ñ!½É¥é½¹Ñ…±±ä¡Ù¥•Ü°‘¥È°µ½‘Ì¤ñðÍ­¥Á%¹½É•‘9½‘•Ì¡Ù¥•Ü°‘¥È¤ì(€€€ô•±Í”¥˜€¡½‘”€ôô€Ìäñðµ…Œ€˜˜½‘”€ôô€ÜÀ€˜˜µ½‘Ì€ôô€‰Œˆ¤ì(€€€€€±•Ð‘¥È€ô½‘”€ôô€Ìä€ü™¥¹‘¥É•Ñ¥½¸¡Ù¥•Ü°Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´¤€ôô€‰±ÑÈˆ€ü€Ä€è€´Ä€è€Äì(€€€€€É•ÑÕÉ¸Í•±•Ñ!½É¥é½¹Ñ…±±ä¡Ù¥•Ü°‘¥È°µ½‘Ì¤ñðÍ­¥Á%¹½É•‘9½‘•Ì¡Ù¥•Ü°‘¥È¤ì(€€€ô•±Í”¥˜€¡½‘”€ôô€Ìàñðµ…Œ€˜˜½‘”€ôô€àÀ€˜˜µ½‘Ì€ôô€‰Œˆ¤ì(€€€€€É•ÑÕÉ¸Í•±•ÑY•ÉÑ¥…±±ä¡Ù¥•Ü°€´Ä°µ½‘Ì¤ñðÍ­¥Á%¹½É•‘9½‘•Ì¡Ù¥•Ü°€´Ä¤ì(€€€ô•±Í”¥˜€¡½‘”€ôô€ÐÀñðµ…Œ€˜˜½‘”€ôô€Üà€˜˜µ½‘Ì€ôô€‰Œˆ¤ì(€€€€€É•ÑÕÉ¸Í…™…É¥½Ý¹ÉÉ½Ý	Õœ¡Ù¥•Ü¤ñðÍ•±•ÑY•ÉÑ¥…±±ä¡Ù¥•Ü°€Ä°µ½‘Ì¤ñðÍ­¥Á%¹½É•‘9½‘•Ì¡Ù¥•Ü°€Ä¤ì(€€€ô•±Í”¥˜€¡µ½‘Ì€ôô€¡µ…Œ€ü€‰´ˆ€è€‰Œˆ¤€˜˜€¡½‘”€ôô€ØØñð½‘”€ôô€ÜÌñð½‘”€ôô€àäñð½‘”€ôô€äÀ¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ô(€™Õ¹Ñ¥½¸Í•É¥…±¥é•½É±¥Á‰½…É¡Ù¥•Ü°Í±¥”¤ì(€€€Ù¥•Ü¹Í½µ•AÉ½À ‰ÑÉ…¹Í™½Éµ½Á¥•ˆ°€¡˜¤€ôøì(€€€€€Í±¥”€ô˜¡Í±¥”°Ù¥•Ü¤ì(€€€ô¤ì(€€€±•Ð½¹Ñ•áÐ€ômt°ì½¹Ñ•¹Ð°½Á•¹MÑ…ÉÐ°½Á•¹¹ô€ôÍ±¥”ì(€€€Ý¡¥±”€¡½Á•¹MÑ…ÉÐ€ø€Ä€˜˜½Á•¹¹€ø€Ä€˜˜½¹Ñ•¹Ð¹¡¥±‘½Õ¹Ð€ôô€Ä€˜˜½¹Ñ•¹Ð¹™¥ÉÍÑ¡¥±¹¡¥±‘½Õ¹Ð€ôô€Ä¤ì(€€€€€½Á•¹MÑ…ÉÐ´´ì(€€€€€½Á•¹¹´´ì(€€€€€±•Ð¹½‘”€ô½¹Ñ•¹Ð¹™¥ÉÍÑ¡¥±ì(€€€€€½¹Ñ•áÐ¹ÁÕÍ ¡¹½‘”¹ÑåÁ”¹¹…µ”°¹½‘”¹…ÑÑÉÌ€„ô¹½‘”¹ÑåÁ”¹‘•™…Õ±ÑÑÑÉÌ€ü¹½‘”¹…ÑÑÉÌ€è¹Õ±°¤ì(€€€€€½¹Ñ•¹Ð€ô¹½‘”¹½¹Ñ•¹Ðì(€€€ô(€€€±•ÐÍ•É¥…±¥é•È€ôÙ¥•Ü¹Í½µ•AÉ½À ‰±¥Á‰½…É‘M•É¥…±¥é•Èˆ¤ñð=5M•É¥…±¥é•ÈÈ¹™É½µM¡•µ„¡Ù¥•Ü¹ÍÑ…Ñ”¹Í¡•µ„¤ì(€€€±•Ð‘½ŒÔ€ô‘•Ñ…¡•‘½Œ ¤°ÝÉ…ÀÈ€ô‘½ŒÔ¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€ÝÉ…ÀÈ¹…ÁÁ•¹‘¡¥±¡Í•É¥…±¥é•È¹Í•É¥…±¥é•É…µ•¹Ð¡½¹Ñ•¹Ð°ì‘½Õµ•¹Ðè‘½ŒÔô¤¤ì(€€€±•Ð™¥ÉÍÑ¡¥±€ôÝÉ…ÀÈ¹™¥ÉÍÑ¡¥±°¹••‘Í]É…À°ÝÉ…ÁÁ•ÉÌ€ô€Àì(€€€Ý¡¥±”€¡™¥ÉÍÑ¡¥±€˜˜¥Í±Ð¡™¥ÉÍÑ¡¥±¤€˜˜€¡¹••‘Í]É…À€ôÝÉ…Á5…Ám™¥ÉÍÑ¡¥±¹¹½‘•9…µ”¹Ñ½1½Ý•É…Í” ¥t¤¤ì(€€€€€™½È€¡±•Ð¤€ô¹••‘Í]É…À¹±•¹Ñ €´€Äì¤€øô€Àì¤´´¤ì(€€€€€€€±•ÐÝÉ…ÁÁ•È€ô‘½ŒÔ¹É•…Ñ•±•µ•¹Ð¡¹••‘Í]É…Ám¥t¤ì(€€€€€€€Ý¡¥±”€¡ÝÉ…ÀÈ¹™¥ÉÍÑ¡¥±¤(€€€€€€€€€ÝÉ…ÁÁ•È¹…ÁÁ•¹‘¡¥±¡ÝÉ…ÀÈ¹™¥ÉÍÑ¡¥±¤ì(€€€€€€€ÝÉ…ÀÈ¹…ÁÁ•¹‘¡¥±¡ÝÉ…ÁÁ•È¤ì(€€€€€€€ÝÉ…ÁÁ•ÉÌ¬¬ì(€€€€€ô(€€€€€™¥ÉÍÑ¡¥±€ôÝÉ…ÀÈ¹™¥ÉÍÑ¡¥±ì(€€€ô(€€€¥˜€¡™¥ÉÍÑ¡¥±€˜˜¥Í±Ð¡™¥ÉÍÑ¡¥±¤¤(€€€€€™¥ÉÍÑ¡¥±¹Í•ÑÑÑÉ¥‰ÕÑ” ‰‘…Ñ„µÁ´µÍ±¥”ˆ°€‘í½Á•¹MÑ…ÉÑô€‘í½Á•¹¹‘ô‘íÝÉ…ÁÁ•ÉÌ€ü€€´‘íÝÉ…ÁÁ•ÉÍõ€€è€ˆ‰ô€‘í)M=8¹ÍÑÉ¥¹¥™ä¡½¹Ñ•áÐ¥õ€¤ì(€€€±•ÐÑ•áÐÈ€ôÙ¥•Ü¹Í½µ•AÉ½À ‰±¥Á‰½…É‘Q•áÑM•É¥…±¥é•Èˆ°€¡˜¤€ôø˜¡Í±¥”°Ù¥•Ü¤¤ñðÍ±¥”¹½¹Ñ•¹Ð¹Ñ•áÑ	•ÑÝ••¸ À°Í±¥”¹½¹Ñ•¹Ð¹Í¥é”°€‰q¹q¸ˆ¤ì(€€€É•ÑÕÉ¸ì‘½´èÝÉ…ÀÈ°Ñ•áÐèÑ•áÐÈ°Í±¥”ôì(€ô(€™Õ¹Ñ¥½¸Á…ÉÍ•É½µ±¥Á‰½…É¡Ù¥•Ü°Ñ•áÐÈ°¡Ñµ°°Á±…¥¹Q•áÐ°€‘½¹Ñ•áÐ¤ì(€€€±•Ð¥¹½‘”€ô€‘½¹Ñ•áÐ¹Á…É•¹Ð¹ÑåÁ”¹ÍÁ•Œ¹½‘”ì(€€€±•Ð‘½´°Í±¥”ì(€€€¥˜€ …¡Ñµ°€˜˜€…Ñ•áÐÈ¤(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€±•Ð…ÍQ•áÐ€ô€„…Ñ•áÐÈ€˜˜€¡Á±…¥¹Q•áÐñð¥¹½‘”ñð€…¡Ñµ°¤ì(€€€¥˜€¡…ÍQ•áÐ¤ì(€€€€€Ù¥•Ü¹Í½µ•AÉ½À ‰ÑÉ…¹Í™½ÉµA…ÍÑ•‘Q•áÐˆ°€¡˜¤€ôøì(€€€€€€€Ñ•áÐÈ€ô˜¡Ñ•áÐÈ°¥¹½‘”ñðÁ±…¥¹Q•áÐ°Ù¥•Ü¤ì(€€€€€ô¤ì(€€€€€¥˜€¡¥¹½‘”¤ì(€€€€€€€Í±¥”€ô¹•ÜM±¥”È¡É…µ•¹ÐÈ¹™É½´¡Ù¥•Ü¹ÍÑ…Ñ”¹Í¡•µ„¹Ñ•áÐ¡Ñ•áÐÈ¹É•Á±…” ½qÉq¸ü½œ°€‰q¸ˆ¤¤¤°€À°€À¤ì(€€€€€€€Ù¥•Ü¹Í½µ•AÉ½À ‰ÑÉ…¹Í™½ÉµA…ÍÑ•ˆ°€¡˜¤€ôøì(€€€€€€€€€Í±¥”€ô˜¡Í±¥”°Ù¥•Ü°ÑÉÕ”¤ì(€€€€€€€ô¤ì(€€€€€€€É•ÑÕÉ¸Í±¥”ì(€€€€€ô(€€€€€±•ÐÁ…ÉÍ•€ôÙ¥•Ü¹Í½µ•AÉ½À ‰±¥Á‰½…É‘Q•áÑA…ÉÍ•Èˆ°€¡˜¤€ôø˜¡Ñ•áÐÈ°€‘½¹Ñ•áÐ°Á±…¥¹Q•áÐ°Ù¥•Ü¤¤ì(€€€€€¥˜€¡Á…ÉÍ•¤ì(€€€€€€€Í±¥”€ôÁ…ÉÍ•ì(€€€€€ô•±Í”ì(€€€€€€€±•Ðµ…É­Ì€ô€‘½¹Ñ•áÐ¹µ…É­Ì ¤ì(€€€€€€€±•ÐìÍ¡•µ„èÍ¡•µ„Èô€ôÙ¥•Ü¹ÍÑ…Ñ”°Í•É¥…±¥é•È€ô=5M•É¥…±¥é•ÈÈ¹™É½µM¡•µ„¡Í¡•µ„È¤ì(€€€€€€€‘½´€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€€€Ñ•áÐÈ¹ÍÁ±¥Ð ¼ üéqÉq¸ýñq¸¤¬¼¤¹™½É…  ¡‰±½¬¤€ôøì(€€€€€€€€€±•ÐÀ€ô‘½´¹…ÁÁ•¹‘¡¥±¡‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Àˆ¤¤ì(€€€€€€€€€¥˜€¡‰±½¬¤(€€€€€€€€€€€À¹…ÁÁ•¹‘¡¥±¡Í•É¥…±¥é•È¹Í•É¥…±¥é•9½‘”¡Í¡•µ„È¹Ñ•áÐ¡‰±½¬°µ…É­Ì¤¤¤ì(€€€€€€€ô¤ì(€€€€€ô(€€€ô•±Í”ì(€€€€€Ù¥•Ü¹Í½µ•AÉ½À ‰ÑÉ…¹Í™½ÉµA…ÍÑ•‘!Q50ˆ°€¡˜¤€ôøì(€€€€€€€¡Ñµ°€ô˜¡¡Ñµ°°Ù¥•Ü¤ì(€€€€€ô¤ì(€€€€€‘½´€ôÉ•…‘!Q50¡¡Ñµ°¤ì(€€€€€¥˜€¡Ý•‰­¥Ð¤(€€€€€€€É•ÍÑ½É•I•Á±…•‘MÁ…•Ì¡‘½´¤ì(€€€ô(€€€±•Ð½¹Ñ•áÑ9½‘”€ô‘½´€˜˜‘½´¹ÅÕ•ÉåM•±•Ñ½È ‰m‘…Ñ„µÁ´µÍ±¥•tˆ¤ì(€€€±•ÐÍ±¥•…Ñ„€ô½¹Ñ•áÑ9½‘”€˜˜€½x¡q¬¤€¡q¬¤ üè€´¡q¬¤¤ü€ ¸¨¤¼¹•á•Œ¡½¹Ñ•áÑ9½‘”¹•ÑÑÑÉ¥‰ÕÑ” ‰‘…Ñ„µÁ´µÍ±¥”ˆ¤ñð€ˆˆ¤ì(€€€¥˜€¡Í±¥•…Ñ„€˜˜Í±¥•…Ñ…lÍt¤(€€€€€™½È€¡±•Ð¤€ô€­Í±¥•…Ñ…lÍtì¤€ø€Àì¤´´¤ì(€€€€€€€±•Ð¡¥±€ô‘½´¹™¥ÉÍÑ¡¥±ì(€€€€€€€Ý¡¥±”€¡¡¥±€˜˜€…¥Í±Ð¡¡¥±¤¤(€€€€€€€€€¡¥±€ô¡¥±¹¹•áÑM¥‰±¥¹œì(€€€€€€€¥˜€ …¡¥±¤(€€€€€€€€€‰É•…¬ì(€€€€€€€‘½´€ô¡¥±ì(€€€€€ô(€€€¥˜€ …Í±¥”¤ì(€€€€€±•ÐÁ…ÉÍ•È€ôÙ¥•Ü¹Í½µ•AÉ½À ‰±¥Á‰½…É‘A…ÉÍ•Èˆ¤ñðÙ¥•Ü¹Í½µ•AÉ½À ‰‘½µA…ÉÍ•Èˆ¤ñð=5A…ÉÍ•ÈÌ¹™É½µM¡•µ„¡Ù¥•Ü¹ÍÑ…Ñ”¹Í¡•µ„¤ì(€€€€€Í±¥”€ôÁ…ÉÍ•È¹Á…ÉÍ•M±¥”¡‘½´°ì(€€€€€€€ÁÉ•Í•ÉÙ•]¡¥Ñ•ÍÁ…”è€„„¡…ÍQ•áÐñðÍ±¥•…Ñ„¤°(€€€€€€€½¹Ñ•áÐè€‘½¹Ñ•áÐ°(€€€€€€€ÉÕ±•É½µ9½‘”¡‘½´È¤ì(€€€€€€€€€¥˜€¡‘½´È¹¹½‘•9…µ”€ôô€‰	Hˆ€˜˜€…‘½´È¹¹•áÑM¥‰±¥¹œ€˜˜‘½´È¹Á…É•¹Ñ9½‘”€˜˜€…¥¹±¥¹•A…É•¹ÑÌ¹Ñ•ÍÐ¡‘½´È¹Á…É•¹Ñ9½‘”¹¹½‘•9…µ”¤¤(€€€€€€€€€€€É•ÑÕÉ¸ì¥¹½É”èÑÉÕ”ôì(€€€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€€€ô(€€€€€ô¤ì(€€€ô(€€€¥˜€¡Í±¥•…Ñ„¤ì(€€€€€Í±¥”€ô…‘‘½¹Ñ•áÐ¡±½Í•M±¥”¡Í±¥”°€­Í±¥•…Ñ…lÅt°€­Í±¥•…Ñ…lÉt¤°Í±¥•…Ñ…lÑt¤ì(€€€ô•±Í”ì(€€€€€Í±¥”€ôM±¥”È¹µ…á=Á•¸¡¹½Éµ…±¥é•M¥‰±¥¹Ì¡Í±¥”¹½¹Ñ•¹Ð°€‘½¹Ñ•áÐ¤°ÑÉÕ”¤ì(€€€€€¥˜€¡Í±¥”¹½Á•¹MÑ…ÉÐñðÍ±¥”¹½Á•¹¹¤ì(€€€€€€€±•Ð½Á•¹MÑ…ÉÐ€ô€À°½Á•¹¹€ô€Àì(€€€€€€€™½È€¡±•Ð¹½‘”€ôÍ±¥”¹½¹Ñ•¹Ð¹™¥ÉÍÑ¡¥±ì½Á•¹MÑ…ÉÐ€ðÍ±¥”¹½Á•¹MÑ…ÉÐ€˜˜€…¹½‘”¹ÑåÁ”¹ÍÁ•Œ¹¥Í½±…Ñ¥¹œì½Á•¹MÑ…ÉÐ¬¬°¹½‘”€ô¹½‘”¹™¥ÉÍÑ¡¥±¤ì(€€€€€€€ô(€€€€€€€™½È€¡±•Ð¹½‘”€ôÍ±¥”¹½¹Ñ•¹Ð¹±…ÍÑ¡¥±ì½Á•¹¹€ðÍ±¥”¹½Á•¹¹€˜˜€…¹½‘”¹ÑåÁ”¹ÍÁ•Œ¹¥Í½±…Ñ¥¹œì½Á•¹¹¬¬°¹½‘”€ô¹½‘”¹±…ÍÑ¡¥±¤ì(€€€€€€€ô(€€€€€€€Í±¥”€ô±½Í•M±¥”¡Í±¥”°½Á•¹MÑ…ÉÐ°½Á•¹¹¤ì(€€€€€ô(€€€ô(€€€Ù¥•Ü¹Í½µ•AÉ½À ‰ÑÉ…¹Í™½ÉµA…ÍÑ•ˆ°€¡˜¤€ôøì(€€€€€Í±¥”€ô˜¡Í±¥”°Ù¥•Ü°…ÍQ•áÐ¤ì(€€€ô¤ì(€€€É•ÑÕÉ¸Í±¥”ì(€ô(€Ù…È¥¹±¥¹•A…É•¹ÑÌ€ô€½x¡…ñ…‰‰Éñ…É½¹åµñ‰ñ¥Ñ•ñ½‘•ñ‘•±ñ•µñ¥ñ¥¹Íñ­‰‘ñ±…‰•±ñ½ÕÑÁÕÑñÅñÉÕ‰åñÍñÍ…µÁñÍÁ…¹ñÍÑÉ½¹ñÍÕ‰ñÍÕÁñÑ¥µ•ñÕñÑÑñÙ…È¤½¤ì(€™Õ¹Ñ¥½¸¹½Éµ…±¥é•M¥‰±¥¹Ì¡™É…µ•¹Ð°€‘½¹Ñ•áÐ¤ì(€€€¥˜€¡™É…µ•¹Ð¹¡¥±‘½Õ¹Ð€ð€È¤(€€€€€É•ÑÕÉ¸™É…µ•¹Ðì(€€€™½È€¡±•Ð€ô€‘½¹Ñ•áÐ¹‘•ÁÑ ì€øô€Àì´´¤ì(€€€€€±•ÐÁ…É•¹Ð€ô€‘½¹Ñ•áÐ¹¹½‘”¡¤ì(€€€€€±•Ðµ…Ñ È€ôÁ…É•¹Ð¹½¹Ñ•¹Ñ5…Ñ¡Ð ‘½¹Ñ•áÐ¹¥¹‘•à¡¤¤ì(€€€€€±•Ð±…ÍÑ]É…À°É•ÍÕ±Ð€ômtì(€€€€€™É…µ•¹Ð¹™½É…  ¡¹½‘”¤€ôøì(€€€€€€€¥˜€ …É•ÍÕ±Ð¤(€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€±•ÐÝÉ…ÀÈ€ôµ…Ñ È¹™¥¹‘]É…ÁÁ¥¹œ¡¹½‘”¹ÑåÁ”¤°¥¹1…ÍÐì(€€€€€€€¥˜€ …ÝÉ…ÀÈ¤(€€€€€€€€€É•ÑÕÉ¸É•ÍÕ±Ð€ô¹Õ±°ì(€€€€€€€¥˜€¡¥¹1…ÍÐ€ôÉ•ÍÕ±Ð¹±•¹Ñ €˜˜±…ÍÑ]É…À¹±•¹Ñ €˜˜…‘‘Q½M¥‰±¥¹œ¡ÝÉ…ÀÈ°±…ÍÑ]É…À°¹½‘”°É•ÍÕ±ÑmÉ•ÍÕ±Ð¹±•¹Ñ €´€Åt°€À¤¤ì(€€€€€€€€€É•ÍÕ±ÑmÉ•ÍÕ±Ð¹±•¹Ñ €´€Åt€ô¥¹1…ÍÐì(€€€€€€€ô•±Í”ì(€€€€€€€€€¥˜€¡É•ÍÕ±Ð¹±•¹Ñ ¤(€€€€€€€€€€€É•ÍÕ±ÑmÉ•ÍÕ±Ð¹±•¹Ñ €´€Åt€ô±½Í•I¥¡Ð¡É•ÍÕ±ÑmÉ•ÍÕ±Ð¹±•¹Ñ €´€Åt°±…ÍÑ]É…À¹±•¹Ñ ¤ì(€€€€€€€€€±•ÐÝÉ…ÁÁ•€ôÝ¥Ñ¡]É…ÁÁ•ÉÌ¡¹½‘”°ÝÉ…ÀÈ¤ì(€€€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡ÝÉ…ÁÁ•¤ì(€€€€€€€€€µ…Ñ È€ôµ…Ñ È¹µ…Ñ¡QåÁ”¡ÝÉ…ÁÁ•¹ÑåÁ”¤ì(€€€€€€€€€±…ÍÑ]É…À€ôÝÉ…ÀÈì(€€€€€€€ô(€€€€€ô¤ì(€€€€€¥˜€¡É•ÍÕ±Ð¤(€€€€€€€É•ÑÕÉ¸É…µ•¹ÐÈ¹™É½´¡É•ÍÕ±Ð¤ì(€€€ô(€€€É•ÑÕÉ¸™É…µ•¹Ðì(€ô(€™Õ¹Ñ¥½¸Ý¥Ñ¡]É…ÁÁ•ÉÌ¡¹½‘”°ÝÉ…ÀÈ°™É½´È€ô€À¤ì(€€€™½È€¡±•Ð¤€ôÝÉ…ÀÈ¹±•¹Ñ €´€Äì¤€øô™É½´Èì¤´´¤(€€€€€¹½‘”€ôÝÉ…ÀÉm¥t¹É•…Ñ”¡¹Õ±°°É…µ•¹ÐÈ¹™É½´¡¹½‘”¤¤ì(€€€É•ÑÕÉ¸¹½‘”ì(€ô(€™Õ¹Ñ¥½¸…‘‘Q½M¥‰±¥¹œ¡ÝÉ…ÀÈ°±…ÍÑ]É…À°¹½‘”°Í¥‰±¥¹œ°‘•ÁÑ ¤ì(€€€¥˜€¡‘•ÁÑ €ðÝÉ…ÀÈ¹±•¹Ñ €˜˜‘•ÁÑ €ð±…ÍÑ]É…À¹±•¹Ñ €˜˜ÝÉ…ÀÉm‘•ÁÑ¡t€ôô±…ÍÑ]É…Ám‘•ÁÑ¡t¤ì(€€€€€±•Ð¥¹¹•È€ô…‘‘Q½M¥‰±¥¹œ¡ÝÉ…ÀÈ°±…ÍÑ]É…À°¹½‘”°Í¥‰±¥¹œ¹±…ÍÑ¡¥±°‘•ÁÑ €¬€Ä¤ì(€€€€€¥˜€¡¥¹¹•È¤(€€€€€€€É•ÑÕÉ¸Í¥‰±¥¹œ¹½Áä¡Í¥‰±¥¹œ¹½¹Ñ•¹Ð¹É•Á±…•¡¥±¡Í¥‰±¥¹œ¹¡¥±‘½Õ¹Ð€´€Ä°¥¹¹•È¤¤ì(€€€€€±•Ðµ…Ñ È€ôÍ¥‰±¥¹œ¹½¹Ñ•¹Ñ5…Ñ¡Ð¡Í¥‰±¥¹œ¹¡¥±‘½Õ¹Ð¤ì(€€€€€¥˜€¡µ…Ñ È¹µ…Ñ¡QåÁ”¡‘•ÁÑ €ôôÝÉ…ÀÈ¹±•¹Ñ €´€Ä€ü¹½‘”¹ÑåÁ”€èÝÉ…ÀÉm‘•ÁÑ €¬€Åt¤¤(€€€€€€€É•ÑÕÉ¸Í¥‰±¥¹œ¹½Áä¡Í¥‰±¥¹œ¹½¹Ñ•¹Ð¹…ÁÁ•¹¡É…µ•¹ÐÈ¹™É½´¡Ý¥Ñ¡]É…ÁÁ•ÉÌ¡¹½‘”°ÝÉ…ÀÈ°‘•ÁÑ €¬€Ä¤¤¤¤ì(€€€ô(€ô(€™Õ¹Ñ¥½¸±½Í•I¥¡Ð¡¹½‘”°‘•ÁÑ ¤ì(€€€¥˜€¡‘•ÁÑ €ôô€À¤(€€€€€É•ÑÕÉ¸¹½‘”ì(€€€±•Ð™É…µ•¹Ð€ô¹½‘”¹½¹Ñ•¹Ð¹É•Á±…•¡¥±¡¹½‘”¹¡¥±‘½Õ¹Ð€´€Ä°±½Í•I¥¡Ð¡¹½‘”¹±…ÍÑ¡¥±°‘•ÁÑ €´€Ä¤¤ì(€€€±•Ð™¥±°€ô¹½‘”¹½¹Ñ•¹Ñ5…Ñ¡Ð¡¹½‘”¹¡¥±‘½Õ¹Ð¤¹™¥±±	•™½É”¡É…µ•¹ÐÈ¹•µÁÑä°ÑÉÕ”¤ì(€€€É•ÑÕÉ¸¹½‘”¹½Áä¡™É…µ•¹Ð¹…ÁÁ•¹¡™¥±°¤¤ì(€ô(€™Õ¹Ñ¥½¸±½Í•I…¹”¡™É…µ•¹Ð°Í¥‘”°™É½´È°Ñ¼°‘•ÁÑ °½Á•¹¹¤ì(€€€±•Ð¹½‘”€ôÍ¥‘”€ð€À€ü™É…µ•¹Ð¹™¥ÉÍÑ¡¥±€è™É…µ•¹Ð¹±…ÍÑ¡¥±°¥¹¹•È€ô¹½‘”¹½¹Ñ•¹Ðì(€€€¥˜€¡™É…µ•¹Ð¹¡¥±‘½Õ¹Ð€ø€Ä¤(€€€€€½Á•¹¹€ô€Àì(€€€¥˜€¡‘•ÁÑ €ðÑ¼€´€Ä¤(€€€€€¥¹¹•È€ô±½Í•I…¹”¡¥¹¹•È°Í¥‘”°™É½´È°Ñ¼°‘•ÁÑ €¬€Ä°½Á•¹¹¤ì(€€€¥˜€¡‘•ÁÑ €øô™É½´È¤(€€€€€¥¹¹•È€ôÍ¥‘”€ð€À€ü¹½‘”¹½¹Ñ•¹Ñ5…Ñ¡Ð À¤¹™¥±±	•™½É”¡¥¹¹•È°½Á•¹¹€ðô‘•ÁÑ ¤¹…ÁÁ•¹¡¥¹¹•È¤€è¥¹¹•È¹…ÁÁ•¹¡¹½‘”¹½¹Ñ•¹Ñ5…Ñ¡Ð¡¹½‘”¹¡¥±‘½Õ¹Ð¤¹™¥±±	•™½É”¡É…µ•¹ÐÈ¹•µÁÑä°ÑÉÕ”¤¤ì(€€€É•ÑÕÉ¸™É…µ•¹Ð¹É•Á±…•¡¥±¡Í¥‘”€ð€À€ü€À€è™É…µ•¹Ð¹¡¥±‘½Õ¹Ð€´€Ä°¹½‘”¹½Áä¡¥¹¹•È¤¤ì(€ô(€™Õ¹Ñ¥½¸±½Í•M±¥”¡Í±¥”°½Á•¹MÑ…ÉÐ°½Á•¹¹¤ì(€€€¥˜€¡½Á•¹MÑ…ÉÐ€ðÍ±¥”¹½Á•¹MÑ…ÉÐ¤(€€€€€Í±¥”€ô¹•ÜM±¥”È¡±½Í•I…¹”¡Í±¥”¹½¹Ñ•¹Ð°€´Ä°½Á•¹MÑ…ÉÐ°Í±¥”¹½Á•¹MÑ…ÉÐ°€À°Í±¥”¹½Á•¹¹¤°½Á•¹MÑ…ÉÐ°Í±¥”¹½Á•¹¹¤ì(€€€¥˜€¡½Á•¹¹€ðÍ±¥”¹½Á•¹¹¤(€€€€€Í±¥”€ô¹•ÜM±¥”È¡±½Í•I…¹”¡Í±¥”¹½¹Ñ•¹Ð°€Ä°½Á•¹¹°Í±¥”¹½Á•¹¹°€À°€À¤°Í±¥”¹½Á•¹MÑ…ÉÐ°½Á•¹¹¤ì(€€€É•ÑÕÉ¸Í±¥”ì(€ô(€Ù…ÈÝÉ…Á5…À€ôì(€€€Ñ¡•…èl‰Ñ…‰±”‰t°(€€€Ñ‰½‘äèl‰Ñ…‰±”‰t°(€€€Ñ™½½Ðèl‰Ñ…‰±”‰t°(€€€…ÁÑ¥½¸èl‰Ñ…‰±”‰t°(€€€½±É½ÕÀèl‰Ñ…‰±”‰t°(€€€½°èl‰Ñ…‰±”ˆ°€‰½±É½ÕÀ‰t°(€€€ÑÈèl‰Ñ…‰±”ˆ°€‰Ñ‰½‘ä‰t°(€€€Ñèl‰Ñ…‰±”ˆ°€‰Ñ‰½‘äˆ°€‰ÑÈ‰t°(€€€Ñ èl‰Ñ…‰±”ˆ°€‰Ñ‰½‘äˆ°€‰ÑÈ‰t(€ôì(€™Õ¹Ñ¥½¸‘•Ñ…¡•‘½Œ ¤ì(€€€É•ÑÕÉ¸‘½Õµ•¹Ð¹¥µÁ±•µ•¹Ñ…Ñ¥½¸¹É•…Ñ•!Q51½Õµ•¹Ð ‰Ñ¥Ñ±”ˆ¤ì(€ô(€Ù…È}Á½±¥ä€ô¹Õ±°ì(€™Õ¹Ñ¥½¸µ…å‰•]É…ÁQÉÕÍÑ•¡¡Ñµ°¤ì(€€€±•ÐÑÉÕÍÑ•‘QåÁ•Ì€ôÝ¥¹‘½Ü¹ÑÉÕÍÑ•‘QåÁ•Ìì(€€€¥˜€ …ÑÉÕÍÑ•‘QåÁ•Ì¤(€€€€€É•ÑÕÉ¸¡Ñµ°ì(€€€¥˜€ …}Á½±¥ä¤ì(€€€€€¥˜€¡}Á½±¥ä€ôÑÉÕÍÑ•‘QåÁ•Ì¹‘•™…Õ±ÑA½±¥ä¤(€€€€€€€ÑÉäì(€€€€€€€€€É•ÑÕÉ¸}Á½±¥ä¹É•…Ñ•!Q50¡¡Ñµ°¤ì(€€€€€€€ô…Ñ €¡}„¤ì(€€€€€€€ô(€€€€€}Á½±¥ä€ôÑÉÕÍÑ•‘QåÁ•Ì¹É•…Ñ•A½±¥ä ‰AÉ½Í•5¥ÉÉ½É±¥Á‰½…Éˆ°ìÉ•…Ñ•!Q50è€¡Ì¤€ôøÌô¤ì(€€€ô(€€€É•ÑÕÉ¸}Á½±¥ä¹É•…Ñ•!Q50¡¡Ñµ°¤ì(€ô(€™Õ¹Ñ¥½¸É•…‘!Q50¡¡Ñµ°¤ì(€€€±•Ðµ•Ñ…Ì€ô€½x¡qÌ¨ñµ•Ñ„mxùt¨ø¤¨¼¹•á•Œ¡¡Ñµ°¤ì(€€€¥˜€¡µ•Ñ…Ì¤(€€€€€¡Ñµ°€ô¡Ñµ°¹Í±¥”¡µ•Ñ…ÍlÁt¹±•¹Ñ ¤ì(€€€±•Ð‘½ŒÔ€ô‘•Ñ…¡•‘½Œ ¤°•±Ð€ô‘½ŒÔ¹‰½‘äì(€€€±•Ð™¥ÉÍÑQ…œ€ô€¼ð¡m„µéumxùqÍt¬¤½¤¹•á•Œ¡¡Ñµ°¤°ÝÉ…ÀÈì(€€€¥˜€¡ÝÉ…ÀÈ€ô™¥ÉÍÑQ…œ€˜˜ÝÉ…Á5…Ám™¥ÉÍÑQ…lÅt¹Ñ½1½Ý•É…Í” ¥t¤(€€€€€¡Ñµ°€ôÝÉ…ÀÈ¹µ…À ¡¸¤€ôø€ˆðˆ€¬¸€¬€ˆøˆ¤¹©½¥¸ ˆˆ¤€¬¡Ñµ°€¬ÝÉ…ÀÈ¹µ…À ¡¸¤€ôø€ˆð¼ˆ€¬¸€¬€ˆøˆ¤¹É•Ù•ÉÍ” ¤¹©½¥¸ ˆˆ¤ì(€€€•±Ð¹¥¹¹•É!Q50€ôµ…å‰•]É…ÁQÉÕÍÑ•¡¡Ñµ°¤ì(€€€¥˜€¡ÝÉ…ÀÈ¤(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÝÉ…ÀÈ¹±•¹Ñ ì¤¬¬¤(€€€€€€€•±Ð€ô•±Ð¹ÅÕ•ÉåM•±•Ñ½È¡ÝÉ…ÀÉm¥t¤ñð•±Ðì(€€€™½È€¡±•Ð¤€ô€Àì¤€ð‘½ŒÔ¹ÍÑå±•M¡••ÑÌ¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•ÐÍÑå±”€ô‘½ŒÔ¹ÍÑå±•M¡••ÑÍm¥tì(€€€€€™½È€¡±•Ð¨€ô€Àì¨€ðÍÑå±”¹ÉÕ±•Ì¹±•¹Ñ ì¨¬¬¤ì(€€€€€€€±•ÐÉÕ±”€ôÍÑå±”¹ÉÕ±•Ím©tì(€€€€€€€¥˜€¡ÉÕ±”¥¹ÍÑ…¹•½˜MMMÑå±•IÕ±”¤ì(€€€€€€€€€±•Ðµ…Ñ¡•ÌÌ€ô•±Ð¹ÅÕ•ÉåM•±•Ñ½É±°¡ÉÕ±”¹Í•±•Ñ½ÉQ•áÐ¤ì(€€€€€€€€€™½È€¡±•Ð¬€ô€Àì¬€ðµ…Ñ¡•ÌÌ¹±•¹Ñ ì¬¬¬¤(€€€€€€€€€€€µ…Ñ¡•ÌÍm­t¹ÍÑå±”¹ÍÍQ•áÐ€¬ôÉÕ±”¹ÍÑå±”¹ÍÍQ•áÐì(€€€€€€€ô(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸•±Ðì(€ô(€™Õ¹Ñ¥½¸É•ÍÑ½É•I•Á±…•‘MÁ…•Ì¡‘½´¤ì(€€€±•Ð¹½‘•Ì€ô‘½´¹ÅÕ•ÉåM•±•Ñ½É±°¡¡É½µ”€ü€‰ÍÁ…¸é¹½Ð¡m±…ÍÍt¤é¹½Ð¡mÍÑå±•t¤ˆ€è€‰ÍÁ…¸¹ÁÁ±”µ½¹Ù•ÉÑ•µÍÁ…”ˆ¤ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ð¹½‘•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•Ð¹½‘”€ô¹½‘•Ím¥tì(€€€€€¥˜€¡¹½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ €ôô€Ä€˜˜¹½‘”¹Ñ•áÑ½¹Ñ•¹Ð€ôô€‰qáÀˆ€˜˜¹½‘”¹Á…É•¹Ñ9½‘”¤(€€€€€€€¹½‘”¹Á…É•¹Ñ9½‘”¹É•Á±…•¡¥±¡‘½´¹½Ý¹•É½Õµ•¹Ð¹É•…Ñ•Q•áÑ9½‘” ˆ€ˆ¤°¹½‘”¤ì(€€€ô(€ô(€™Õ¹Ñ¥½¸…‘‘½¹Ñ•áÐ¡Í±¥”°½¹Ñ•áÐ¤ì(€€€¥˜€ …Í±¥”¹Í¥é”¤(€€€€€É•ÑÕÉ¸Í±¥”ì(€€€±•ÐÍ¡•µ„È€ôÍ±¥”¹½¹Ñ•¹Ð¹™¥ÉÍÑ¡¥±¹ÑåÁ”¹Í¡•µ„°…ÉÉ…äì(€€€ÑÉäì(€€€€€…ÉÉ…ä€ô)M=8¹Á…ÉÍ”¡½¹Ñ•áÐ¤ì(€€€ô…Ñ €¡”¤ì(€€€€€É•ÑÕÉ¸Í±¥”ì(€€€ô(€€€±•Ðì½¹Ñ•¹Ð°½Á•¹MÑ…ÉÐ°½Á•¹¹ô€ôÍ±¥”ì(€€€™½È€¡±•Ð¤€ô…ÉÉ…ä¹±•¹Ñ €´€Èì¤€øô€Àì¤€´ô€È¤ì(€€€€€±•ÐÑåÁ”€ôÍ¡•µ„È¹¹½‘•Ím…ÉÉ…åm¥utì(€€€€€¥˜€ …ÑåÁ”ñðÑåÁ”¹¡…ÍI•ÅÕ¥É•‘ÑÑÉÌ ¤¤(€€€€€€€‰É•…¬ì(€€€€€ÑÉäì(€€€€€€€½¹Ñ•¹Ð€ôÉ…µ•¹ÐÈ¹™É½´¡ÑåÁ”¹É•…Ñ”¡…ÉÉ…åm¤€¬€Åt°½¹Ñ•¹Ð¤¤ì(€€€€€ô…Ñ €¡”¤ì(€€€€€€€‰É•…¬ì(€€€€€ô(€€€€€½Á•¹MÑ…ÉÐ¬¬ì(€€€€€½Á•¹¹¬¬ì(€€€ô(€€€É•ÑÕÉ¸¹•ÜM±¥”È¡½¹Ñ•¹Ð°½Á•¹MÑ…ÉÐ°½Á•¹¹¤ì(€ô(€Ù…È¡…¹‘±•ÉÌ€ôíôì(€Ù…È•‘¥Ñ!…¹‘±•ÉÌ€ôíôì(€Ù…ÈÁ…ÍÍ¥Ù•!…¹‘±•ÉÌ€ôìÑ½Õ¡ÍÑ…ÉÐèÑÉÕ”°Ñ½Õ¡µ½Ù”èÑÉÕ”ôì(€Ù…È%¹ÁÕÑMÑ…Ñ”€ô±…ÍÌì(€€€½¹ÍÑÉÕÑ½È ¤ì(€€€€€Ñ¡¥Ì¹Í¡¥™Ñ-•ä€ô™…±Í”ì(€€€€€Ñ¡¥Ì¹µ½ÕÍ•½Ý¸€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹±…ÍÑ-•å½‘”€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹±…ÍÑ-•å½‘•Q¥µ”€ô€Àì(€€€€€Ñ¡¥Ì¹±…ÍÑ±¥¬€ôìÑ¥µ”è€À°àè€À°äè€À°ÑåÁ”è€ˆˆ°‰ÕÑÑ½¸è€Àôì(€€€€€Ñ¡¥Ì¹±…ÍÑM•±•Ñ¥½¹=É¥¥¸€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹±…ÍÑM•±•Ñ¥½¹Q¥µ”€ô€Àì(€€€€€Ñ¡¥Ì¹±…ÍÑ%=M¹Ñ•È€ô€Àì(€€€€€Ñ¡¥Ì¹±…ÍÑ%=M¹Ñ•É…±±‰…­Q¥µ•½ÕÐ€ô€´Äì(€€€€€Ñ¡¥Ì¹±…ÍÑ½ÕÌ€ô€Àì(€€€€€Ñ¡¥Ì¹±…ÍÑQ½Õ €ô€Àì(€€€€€Ñ¡¥Ì¹±…ÍÑ¡É½µ••±•Ñ”€ô€Àì(€€€€€Ñ¡¥Ì¹½µÁ½Í¥¹œ€ô™…±Í”ì(€€€€€Ñ¡¥Ì¹½µÁ½Í¥Ñ¥½¹9½‘”€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹½µÁ½Í¥¹Q¥µ•½ÕÐ€ô€´Äì(€€€€€Ñ¡¥Ì¹½µÁ½Í¥Ñ¥½¹9½‘•Ì€ômtì(€€€€€Ñ¡¥Ì¹½µÁ½Í¥Ñ¥½¹¹‘•‘Ð€ô€´É”àì(€€€€€Ñ¡¥Ì¹½µÁ½Í¥Ñ¥½¹%€ô€Äì(€€€€€Ñ¡¥Ì¹‰…‘M…™…É¥½µÁ½Í¥Ñ¥½¸€ô™…±Í”ì(€€€€€Ñ¡¥Ì¹½µÁ½Í¥Ñ¥½¹A•¹‘¥¹¡…¹•Ì€ô€Àì(€€€€€Ñ¡¥Ì¹‘½µ¡…¹•½Õ¹Ð€ô€Àì(€€€€€Ñ¡¥Ì¹•Ù•¹Ñ!…¹‘±•ÉÌ€ô€¼¨}}AUI}|€¨¼=‰©•Ð¹É•…Ñ”¡¹Õ±°¤ì(€€€€€Ñ¡¥Ì¹¡¥‘•M•±•Ñ¥½¹Õ…É€ô¹Õ±°ì(€€€ô(€ôì(€™Õ¹Ñ¥½¸¥¹¥Ñ%¹ÁÕÐ¡Ù¥•Ü¤ì(€€€™½È€¡±•Ð•Ù•¹Ð¥¸¡…¹‘±•ÉÌ¤ì(€€€€€±•Ð¡…¹‘±•È€ô¡…¹‘±•ÉÍm•Ù•¹Ñtì(€€€€€Ù¥•Ü¹‘½´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È¡•Ù•¹Ð°Ù¥•Ü¹¥¹ÁÕÐ¹•Ù•¹Ñ!…¹‘±•ÉÍm•Ù•¹Ñt€ô€¡•Ù•¹ÐÈ¤€ôøì(€€€€€€€¥˜€¡•Ù•¹Ñ	•±½¹ÍQ½Y¥•Ü¡Ù¥•Ü°•Ù•¹ÐÈ¤€˜˜€…ÉÕ¹ÕÍÑ½µ!…¹‘±•È¡Ù¥•Ü°•Ù•¹ÐÈ¤€˜˜€¡Ù¥•Ü¹•‘¥Ñ…‰±”ñð€„¡•Ù•¹ÐÈ¹ÑåÁ”¥¸•‘¥Ñ!…¹‘±•ÉÌ¤¤¤(€€€€€€€€€¡…¹‘±•È¡Ù¥•Ü°•Ù•¹ÐÈ¤ì(€€€€€ô°Á…ÍÍ¥Ù•!…¹‘±•ÉÍm•Ù•¹Ñt€üìÁ…ÍÍ¥Ù”èÑÉÕ”ô€èÙ½¥€À¤ì(€€€ô(€€€¥˜€¡Í…™…É¤¤(€€€€€Ù¥•Ü¹‘½´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰¥¹ÁÕÐˆ°€ ¤€ôø¹Õ±°¤ì(€€€•¹ÍÕÉ•1¥ÍÑ•¹•ÉÌ¡Ù¥•Ü¤ì(€ô(€™Õ¹Ñ¥½¸Í•ÑM•±•Ñ¥½¹=É¥¥¸¡Ù¥•Ü°½É¥¥¸¤ì(€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑM•±•Ñ¥½¹=É¥¥¸€ô½É¥¥¸ì(€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑM•±•Ñ¥½¹Q¥µ”€ô…Ñ”¹¹½Ü ¤ì(€ô(€™Õ¹Ñ¥½¸‘•ÍÑÉ½å%¹ÁÕÐ¡Ù¥•Ü¤ì(€€€¥˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸¤(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸¹‘½¹” ¤ì(€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÑ½À ¤ì(€€€™½È€¡±•ÐÑåÁ”¥¸Ù¥•Ü¹¥¹ÁÕÐ¹•Ù•¹Ñ!…¹‘±•ÉÌ¤(€€€€€Ù¥•Ü¹‘½´¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È¡ÑåÁ”°Ù¥•Ü¹¥¹ÁÕÐ¹•Ù•¹Ñ!…¹‘±•ÉÍmÑåÁ•t¤ì(€€€±•…ÉQ¥µ•½ÕÐ¡Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥¹Q¥µ•½ÕÐ¤ì(€€€±•…ÉQ¥µ•½ÕÐ¡Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ%=M¹Ñ•É…±±‰…­Q¥µ•½ÕÐ¤ì(€ô(€™Õ¹Ñ¥½¸•¹ÍÕÉ•1¥ÍÑ•¹•ÉÌ¡Ù¥•Ü¤ì(€€€Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•=5Ù•¹ÑÌˆ°€¡ÕÉÉ•¹Ñ!…¹‘±•ÉÌ¤€ôøì(€€€€€™½È€¡±•ÐÑåÁ”¥¸ÕÉÉ•¹Ñ!…¹‘±•ÉÌ¤(€€€€€€€¥˜€ …Ù¥•Ü¹¥¹ÁÕÐ¹•Ù•¹Ñ!…¹‘±•ÉÍmÑåÁ•t¤(€€€€€€€€€Ù¥•Ü¹‘½´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È¡ÑåÁ”°Ù¥•Ü¹¥¹ÁÕÐ¹•Ù•¹Ñ!…¹‘±•ÉÍmÑåÁ•t€ô€¡•Ù•¹Ð¤€ôøÉÕ¹ÕÍÑ½µ!…¹‘±•È¡Ù¥•Ü°•Ù•¹Ð¤¤ì(€€€ô¤ì(€ô(€™Õ¹Ñ¥½¸ÉÕ¹ÕÍÑ½µ!…¹‘±•È¡Ù¥•Ü°•Ù•¹Ð¤ì(€€€É•ÑÕÉ¸Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•=5Ù•¹ÑÌˆ°€¡¡…¹‘±•ÉÌÈ¤€ôøì(€€€€€±•Ð¡…¹‘±•È€ô¡…¹‘±•ÉÌÉm•Ù•¹Ð¹ÑåÁ•tì(€€€€€É•ÑÕÉ¸¡…¹‘±•È€ü¡…¹‘±•È¡Ù¥•Ü°•Ù•¹Ð¤ñð•Ù•¹Ð¹‘•™…Õ±ÑAÉ•Ù•¹Ñ•€è™…±Í”ì(€€€ô¤ì(€ô(€™Õ¹Ñ¥½¸•Ù•¹Ñ	•±½¹ÍQ½Y¥•Ü¡Ù¥•Ü°•Ù•¹Ð¤ì(€€€¥˜€ …•Ù•¹Ð¹‰Õ‰‰±•Ì¤(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€¥˜€¡•Ù•¹Ð¹‘•™…Õ±ÑAÉ•Ù•¹Ñ•¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€™½È€¡±•Ð¹½‘”€ô•Ù•¹Ð¹Ñ…É•Ðì¹½‘”€„ôÙ¥•Ü¹‘½´ì¹½‘”€ô¹½‘”¹Á…É•¹Ñ9½‘”¤(€€€€€¥˜€ …¹½‘”ñð¹½‘”¹¹½‘•QåÁ”€ôô€ÄÄñð¹½‘”¹ÁµY¥•Ý•ÍŒ€˜˜¹½‘”¹ÁµY¥•Ý•ÍŒ¹ÍÑ½ÁÙ•¹Ð¡•Ù•¹Ð¤¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ô(€™Õ¹Ñ¥½¸‘¥ÍÁ…Ñ¡Ù•¹Ð¡Ù¥•Ü°•Ù•¹Ð¤ì(€€€¥˜€ …ÉÕ¹ÕÍÑ½µ!…¹‘±•È¡Ù¥•Ü°•Ù•¹Ð¤€˜˜¡…¹‘±•ÉÍm•Ù•¹Ð¹ÑåÁ•t€˜˜€¡Ù¥•Ü¹•‘¥Ñ…‰±”ñð€„¡•Ù•¹Ð¹ÑåÁ”¥¸•‘¥Ñ!…¹‘±•ÉÌ¤¤¤(€€€€€¡…¹‘±•ÉÍm•Ù•¹Ð¹ÑåÁ•t¡Ù¥•Ü°•Ù•¹Ð¤ì(€ô(€•‘¥Ñ!…¹‘±•ÉÌ¹­•å‘½Ý¸€ô€¡Ù¥•Ü°}•Ù•¹Ð¤€ôøì(€€€±•Ð•Ù•¹Ð€ô}•Ù•¹Ðì(€€€Ù¥•Ü¹¥¹ÁÕÐ¹Í¡¥™Ñ-•ä€ô•Ù•¹Ð¹­•å½‘”€ôô€ÄØñð•Ù•¹Ð¹Í¡¥™Ñ-•äì(€€€¥˜€¡¥¹=É9•…É½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü¤¤(€€€€€É•ÑÕÉ¸ì(€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘”€ô•Ù•¹Ð¹­•å½‘”ì(€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘•Q¥µ”€ô…Ñ”¹¹½Ü ¤ì(€€€¥˜€¡…¹‘É½¥€˜˜¡É½µ”€˜˜•Ù•¹Ð¹­•å½‘”€ôô€ÄÌ¤(€€€€€É•ÑÕÉ¸ì(€€€¥˜€¡•Ù•¹Ð¹­•å½‘”€„ô€ÈÈä¤(€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹™½É•±ÕÍ  ¤ì(€€€¥˜€¡¥½Ì€˜˜•Ù•¹Ð¹­•å½‘”€ôô€ÄÌ€˜˜€…•Ù•¹Ð¹ÑÉ±-•ä€˜˜€…•Ù•¹Ð¹…±Ñ-•ä€˜˜€…•Ù•¹Ð¹µ•Ñ…-•ä¤ì(€€€€€±•Ð¹½Ü€ô…Ñ”¹¹½Ü ¤ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ%=M¹Ñ•È€ô¹½Üì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ%=M¹Ñ•É…±±‰…­Q¥µ•½ÕÐ€ôÍ•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€€€¥˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ%=M¹Ñ•È€ôô¹½Ü¤ì(€€€€€€€€€Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•-•å½Ý¸ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°­•åÙ•¹Ð ÄÌ°€‰¹Ñ•Èˆ¤¤¤ì(€€€€€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ%=M¹Ñ•È€ô€Àì(€€€€€€€ô(€€€€€ô°€ÈÀÀ¤ì(€€€ô•±Í”¥˜€¡Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•-•å½Ý¸ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°•Ù•¹Ð¤¤ñð…ÁÑÕÉ•-•å½Ý¸¡Ù¥•Ü°•Ù•¹Ð¤¤ì(€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€ô•±Í”ì(€€€€€Í•ÑM•±•Ñ¥½¹=É¥¥¸¡Ù¥•Ü°€‰­•äˆ¤ì(€€€ô(€ôì(€•‘¥Ñ!…¹‘±•ÉÌ¹­•åÕÀ€ô€¡Ù¥•Ü°•Ù•¹Ð¤€ôøì(€€€¥˜€¡•Ù•¹Ð¹­•å½‘”€ôô€ÄØ¤(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹Í¡¥™Ñ-•ä€ô™…±Í”ì(€ôì(€•‘¥Ñ!…¹‘±•ÉÌ¹­•åÁÉ•ÍÌ€ô€¡Ù¥•Ü°}•Ù•¹Ð¤€ôøì(€€€±•Ð•Ù•¹Ð€ô}•Ù•¹Ðì(€€€¥˜€¡¥¹=É9•…É½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü¤ñð€…•Ù•¹Ð¹¡…É½‘”ñð•Ù•¹Ð¹ÑÉ±-•ä€˜˜€…•Ù•¹Ð¹…±Ñ-•äñðµ…Œ€˜˜•Ù•¹Ð¹µ•Ñ…-•ä¤(€€€€€É•ÑÕÉ¸ì(€€€¥˜€¡Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•-•åAÉ•ÍÌˆ°€¡˜¤€ôø˜¡Ù¥•Ü°•Ù•¹Ð¤¤¤ì(€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€±•ÐÍ•°€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€¥˜€ „¡Í•°¥¹ÍÑ…¹•½˜Q•áÑM•±•Ñ¥½¸¤ñð€…Í•°¸‘™É½´¹Í…µ•A…É•¹Ð¡Í•°¸‘Ñ¼¤¤ì(€€€€€±•ÐÑ•áÐÈ€ôMÑÉ¥¹œ¹™É½µ¡…É½‘”¡•Ù•¹Ð¹¡…É½‘”¤ì(€€€€€±•Ð‘•™±Ð€ô€ ¤€ôøÙ¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹¥¹Í•ÉÑQ•áÐ¡Ñ•áÐÈ¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤ì(€€€€€¥˜€ „½mqÉq¹t¼¹Ñ•ÍÐ¡Ñ•áÐÈ¤€˜˜€…Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•Q•áÑ%¹ÁÕÐˆ°€¡˜¤€ôø˜¡Ù¥•Ü°Í•°¸‘™É½´¹Á½Ì°Í•°¸‘Ñ¼¹Á½Ì°Ñ•áÐÈ°‘•™±Ð¤¤¤(€€€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡‘•™±Ð ¤¤ì(€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€ô(€ôì(€™Õ¹Ñ¥½¸•Ù•¹Ñ½½É‘Ì¡•Ù•¹Ð¤ì(€€€É•ÑÕÉ¸ì±•™Ðè•Ù•¹Ð¹±¥•¹Ñ`°Ñ½Àè•Ù•¹Ð¹±¥•¹Ñdôì(€ô(€™Õ¹Ñ¥½¸¥Í9•…È¡•Ù•¹Ð°±¥¬¤ì(€€€±•Ð‘à€ô±¥¬¹à€´•Ù•¹Ð¹±¥•¹Ñ`°‘ä€ô±¥¬¹ä€´•Ù•¹Ð¹±¥•¹Ñdì(€€€É•ÑÕÉ¸‘à€¨‘à€¬‘ä€¨‘ä€ð€ÄÀÀì(€ô(€™Õ¹Ñ¥½¸ÉÕ¹!…¹‘±•É=¹½¹Ñ•áÐ¡Ù¥•Ü°ÁÉ½Á9…µ”°Á½Ì°¥¹Í¥‘”°•Ù•¹Ð¤ì(€€€¥˜€¡¥¹Í¥‘”€ôô€´Ä¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ð€‘Á½Ì€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡¥¹Í¥‘”¤ì(€€€™½È€¡±•Ð¤€ô€‘Á½Ì¹‘•ÁÑ €¬€Äì¤€ø€Àì¤´´¤ì(€€€€€¥˜€¡Ù¥•Ü¹Í½µ•AÉ½À¡ÁÉ½Á9…µ”°€¡˜¤€ôø¤€ø€‘Á½Ì¹‘•ÁÑ €ü˜¡Ù¥•Ü°Á½Ì°€‘Á½Ì¹¹½‘•™Ñ•È°€‘Á½Ì¹‰•™½É”¡¤¤°•Ù•¹Ð°ÑÉÕ”¤€è˜¡Ù¥•Ü°Á½Ì°€‘Á½Ì¹¹½‘”¡¤¤°€‘Á½Ì¹‰•™½É”¡¤¤°•Ù•¹Ð°™…±Í”¤¤¤(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ô(€™Õ¹Ñ¥½¸ÕÁ‘…Ñ•M•±•Ñ¥½¸¡Ù¥•Ü°Í•±•Ñ¥½¸°½É¥¥¸¤ì(€€€¥˜€ …Ù¥•Ü¹™½ÕÍ•¤(€€€€€Ù¥•Ü¹™½ÕÌ ¤ì(€€€¥˜€¡Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹•Ä¡Í•±•Ñ¥½¸¤¤(€€€€€É•ÑÕÉ¸ì(€€€±•ÐÑÈ€ôÙ¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Í•±•Ñ¥½¸¤ì(€€€ÑÈ¹Í•Ñ5•Ñ„ ‰Á½¥¹Ñ•Èˆ°ÑÉÕ”¤ì(€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡ÑÈ¤ì(€ô(€™Õ¹Ñ¥½¸Í•±•Ñ±¥­•‘1•…˜¡Ù¥•Ü°¥¹Í¥‘”¤ì(€€€¥˜€¡¥¹Í¥‘”€ôô€´Ä¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ð€‘Á½Ì€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡¥¹Í¥‘”¤°¹½‘”€ô€‘Á½Ì¹¹½‘•™Ñ•Èì(€€€¥˜€¡¹½‘”€˜˜¹½‘”¹¥ÍÑ½´€˜˜9½‘•M•±•Ñ¥½¸¹¥ÍM•±•Ñ…‰±”¡¹½‘”¤¤ì(€€€€€ÕÁ‘…Ñ•M•±•Ñ¥½¸¡Ù¥•Ü°¹•Ü9½‘•M•±•Ñ¥½¸ ‘Á½Ì¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ô(€™Õ¹Ñ¥½¸Í•±•Ñ±¥­•‘9½‘”¡Ù¥•Ü°¥¹Í¥‘”¤ì(€€€¥˜€¡¥¹Í¥‘”€ôô€´Ä¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•ÐÍ•°€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸°Í•±•Ñ•‘9½‘”°Í•±•ÑÐì(€€€¥˜€¡Í•°¥¹ÍÑ…¹•½˜9½‘•M•±•Ñ¥½¸¤(€€€€€Í•±•Ñ•‘9½‘”€ôÍ•°¹¹½‘”ì(€€€±•Ð€‘Á½Ì€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡¥¹Í¥‘”¤ì(€€€™½È€¡±•Ð¤€ô€‘Á½Ì¹‘•ÁÑ €¬€Äì¤€ø€Àì¤´´¤ì(€€€€€±•Ð¹½‘”€ô¤€ø€‘Á½Ì¹‘•ÁÑ €ü€‘Á½Ì¹¹½‘•™Ñ•È€è€‘Á½Ì¹¹½‘”¡¤¤ì(€€€€€¥˜€¡9½‘•M•±•Ñ¥½¸¹¥ÍM•±•Ñ…‰±”¡¹½‘”¤¤ì(€€€€€€€¥˜€¡Í•±•Ñ•‘9½‘”€˜˜Í•°¸‘™É½´¹‘•ÁÑ €ø€À€˜˜¤€øôÍ•°¸‘™É½´¹‘•ÁÑ €˜˜€‘Á½Ì¹‰•™½É”¡Í•°¸‘™É½´¹‘•ÁÑ €¬€Ä¤€ôôÍ•°¸‘™É½´¹Á½Ì¤(€€€€€€€€€Í•±•ÑÐ€ô€‘Á½Ì¹‰•™½É”¡Í•°¸‘™É½´¹‘•ÁÑ ¤ì(€€€€€€€•±Í”(€€€€€€€€€Í•±•ÑÐ€ô€‘Á½Ì¹‰•™½É”¡¤¤ì(€€€€€€€‰É•…¬ì(€€€€€ô(€€€ô(€€€¥˜€¡Í•±•ÑÐ€„ô¹Õ±°¤ì(€€€€€ÕÁ‘…Ñ•M•±•Ñ¥½¸¡Ù¥•Ü°9½‘•M•±•Ñ¥½¸¹É•…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ°Í•±•ÑÐ¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô•±Í”ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€ô(€™Õ¹Ñ¥½¸¡…¹‘±•M¥¹±•±¥¬¡Ù¥•Ü°Á½Ì°¥¹Í¥‘”°•Ù•¹Ð°Í•±•Ñ9½‘”¤ì(€€€É•ÑÕÉ¸ÉÕ¹!…¹‘±•É=¹½¹Ñ•áÐ¡Ù¥•Ü°€‰¡…¹‘±•±¥­=¸ˆ°Á½Ì°¥¹Í¥‘”°•Ù•¹Ð¤ñðÙ¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•±¥¬ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°Á½Ì°•Ù•¹Ð¤¤ñð€¡Í•±•Ñ9½‘”€üÍ•±•Ñ±¥­•‘9½‘”¡Ù¥•Ü°¥¹Í¥‘”¤€èÍ•±•Ñ±¥­•‘1•…˜¡Ù¥•Ü°¥¹Í¥‘”¤¤ì(€ô(€™Õ¹Ñ¥½¸¡…¹‘±•½Õ‰±•±¥¬¡Ù¥•Ü°Á½Ì°¥¹Í¥‘”°•Ù•¹Ð¤ì(€€€É•ÑÕÉ¸ÉÕ¹!…¹‘±•É=¹½¹Ñ•áÐ¡Ù¥•Ü°€‰¡…¹‘±•½Õ‰±•±¥­=¸ˆ°Á½Ì°¥¹Í¥‘”°•Ù•¹Ð¤ñðÙ¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•½Õ‰±•±¥¬ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°Á½Ì°•Ù•¹Ð¤¤ì(€ô(€™Õ¹Ñ¥½¸¡…¹‘±•QÉ¥Á±•±¥¬¡Ù¥•Ü°Á½Ì°¥¹Í¥‘”°•Ù•¹Ð¤ì(€€€É•ÑÕÉ¸ÉÕ¹!…¹‘±•É=¹½¹Ñ•áÐ¡Ù¥•Ü°€‰¡…¹‘±•QÉ¥Á±•±¥­=¸ˆ°Á½Ì°¥¹Í¥‘”°•Ù•¹Ð¤ñðÙ¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•QÉ¥Á±•±¥¬ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°Á½Ì°•Ù•¹Ð¤¤ñð‘•™…Õ±ÑQÉ¥Á±•±¥¬¡Ù¥•Ü°¥¹Í¥‘”°•Ù•¹Ð¤ì(€ô(€™Õ¹Ñ¥½¸‘•™…Õ±ÑQÉ¥Á±•±¥¬¡Ù¥•Ü°¥¹Í¥‘”°•Ù•¹Ð¤ì(€€€¥˜€¡•Ù•¹Ð¹‰ÕÑÑ½¸€„ô€À¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•ÐÍ•±•Ñ¥½¸€ôÍ•±•Ñ¥½¹½ÉQÉ¥Á±•±¥¬¡Ù¥•Ü°¥¹Í¥‘”°ÑÉÕ”¤°‘½ŒÔ€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œì(€€€¥˜€ …Í•±•Ñ¥½¸¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ÕÁ‘…Ñ•M•±•Ñ¥½¸¡Ù¥•Ü°Í•±•Ñ¥½¸¤ì(€€€¥˜€¡Í•±•Ñ¥½¸¥¹ÍÑ…¹•½˜Q•áÑM•±•Ñ¥½¸€˜˜‘½ŒÔ¹•Ä¡Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ¤¤(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸€ô¹•ÜQÉ¥Á±•±¥­É…œ¡Ù¥•Ü°Í•±•Ñ¥½¸¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ô(€™Õ¹Ñ¥½¸Í•±•Ñ¥½¹½ÉQÉ¥Á±•±¥¬¡Ù¥•Ü°¥¹Í¥‘”°Í•±•Ñ9½‘•Ì¤ì(€€€±•Ð‘½ŒÔ€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œì(€€€¥˜€¡¥¹Í¥‘”€ôô€´Ä¤(€€€€€É•ÑÕÉ¸‘½ŒÔ¹¥¹±¥¹•½¹Ñ•¹Ð€üQ•áÑM•±•Ñ¥½¸¹É•…Ñ”¡‘½ŒÔ°€À°‘½ŒÔ¹½¹Ñ•¹Ð¹Í¥é”¤€è¹Õ±°ì(€€€±•Ð€‘Á½Ì€ô‘½ŒÔ¹É•Í½±Ù”¡¥¹Í¥‘”¤ì(€€€™½È€¡±•Ð¤€ô€‘Á½Ì¹‘•ÁÑ €¬€Äì¤€ø€Àì¤´´¤ì(€€€€€±•Ð¹½‘”€ô¤€ø€‘Á½Ì¹‘•ÁÑ €ü€‘Á½Ì¹¹½‘•™Ñ•È€è€‘Á½Ì¹¹½‘”¡¤¤ì(€€€€€±•Ð¹½‘•A½Ì€ô€‘Á½Ì¹‰•™½É”¡¤¤ì(€€€€€¥˜€¡¹½‘”¹¥¹±¥¹•½¹Ñ•¹Ð¤(€€€€€€€É•ÑÕÉ¸Q•áÑM•±•Ñ¥½¸¹É•…Ñ”¡‘½ŒÔ°¹½‘•A½Ì€¬€Ä°¹½‘•A½Ì€¬€Ä€¬¹½‘”¹½¹Ñ•¹Ð¹Í¥é”¤ì(€€€€€•±Í”¥˜€¡Í•±•Ñ9½‘•Ì€˜˜9½‘•M•±•Ñ¥½¸¹¥ÍM•±•Ñ…‰±”¡¹½‘”¤¤(€€€€€€€É•ÑÕÉ¸9½‘•M•±•Ñ¥½¸¹É•…Ñ”¡‘½ŒÔ°¹½‘•A½Ì¤ì(€€€ô(€€€É•ÑÕÉ¸¹Õ±°ì(€ô(€™Õ¹Ñ¥½¸™½É•=5±ÕÍ ¡Ù¥•Ü¤ì(€€€É•ÑÕÉ¸•¹‘½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü¤ì(€ô(€Ù…ÈÍ•±•Ñ9½‘•5½‘¥™¥•È€ôµ…Œ€ü€‰µ•Ñ…-•äˆ€è€‰ÑÉ±-•äˆì(€¡…¹‘±•ÉÌ¹µ½ÕÍ•‘½Ý¸€ô€¡Ù¥•Ü°}•Ù•¹Ð¤€ôøì(€€€±•Ð•Ù•¹Ð€ô}•Ù•¹Ðì(€€€Ù¥•Ü¹¥¹ÁÕÐ¹Í¡¥™Ñ-•ä€ô•Ù•¹Ð¹Í¡¥™Ñ-•äì(€€€±•Ð™±ÕÍ¡•€ô™½É•=5±ÕÍ ¡Ù¥•Ü¤ì(€€€±•Ð¹½Ü€ô…Ñ”¹¹½Ü ¤°ÑåÁ”€ô€‰Í¥¹±•±¥¬ˆì(€€€¥˜€¡¹½Ü€´Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ±¥¬¹Ñ¥µ”€ð€ÔÀÀ€˜˜¥Í9•…È¡•Ù•¹Ð°Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ±¥¬¤€˜˜€…•Ù•¹ÑmÍ•±•Ñ9½‘•5½‘¥™¥•Ét€˜˜Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ±¥¬¹‰ÕÑÑ½¸€ôô•Ù•¹Ð¹‰ÕÑÑ½¸¤ì(€€€€€¥˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ±¥¬¹ÑåÁ”€ôô€‰Í¥¹±•±¥¬ˆ¤(€€€€€€€ÑåÁ”€ô€‰‘½Õ‰±•±¥¬ˆì(€€€€€•±Í”¥˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ±¥¬¹ÑåÁ”€ôô€‰‘½Õ‰±•±¥¬ˆ¤(€€€€€€€ÑåÁ”€ô€‰ÑÉ¥Á±•±¥¬ˆì(€€€ô(€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ±¥¬€ôìÑ¥µ”è¹½Ü°àè•Ù•¹Ð¹±¥•¹Ñ`°äè•Ù•¹Ð¹±¥•¹Ñd°ÑåÁ”°‰ÕÑÑ½¸è•Ù•¹Ð¹‰ÕÑÑ½¸ôì(€€€¥˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸¤(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸¹‘½¹” ¤ì(€€€±•ÐÁ½Ì€ôÙ¥•Ü¹Á½ÍÑ½½É‘Ì¡•Ù•¹Ñ½½É‘Ì¡•Ù•¹Ð¤¤ì(€€€¥˜€ …Á½Ì¤(€€€€€É•ÑÕÉ¸ì(€€€¥˜€¡ÑåÁ”€ôô€‰Í¥¹±•±¥¬ˆ¤ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸€ô¹•Ü1•™Ñ5½ÕÍ•½Ý¸¡Ù¥•Ü°Á½Ì°•Ù•¹Ð°€„…™±ÕÍ¡•¤ì(€€€ô•±Í”¥˜€ ¡ÑåÁ”€ôô€‰‘½Õ‰±•±¥¬ˆ€ü¡…¹‘±•½Õ‰±•±¥¬€è¡…¹‘±•QÉ¥Á±•±¥¬¤¡Ù¥•Ü°Á½Ì¹Á½Ì°Á½Ì¹¥¹Í¥‘”°•Ù•¹Ð¤¤ì(€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€ô•±Í”ì(€€€€€Í•ÑM•±•Ñ¥½¹=É¥¥¸¡Ù¥•Ü°€‰Á½¥¹Ñ•Èˆ¤ì(€€€ô(€ôì(€Ù…È5½ÕÍ•½Ý¸€ô±…ÍÌì(€€€½¹ÍÑÉÕÑ½È¡Ù¥•Ü¤ì(€€€€€Ñ¡¥Ì¹Ù¥•Ü€ôÙ¥•Üì(€€€€€Ñ¡¥Ì¹µ¥¡ÑÉ…œ€ô¹Õ±°ì(€€€€€Ù¥•Ü¹É½½Ð¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰µ½ÕÍ•ÕÀˆ°Ñ¡¥Ì¹ÕÀ€ôÑ¡¥Ì¹ÕÀ¹‰¥¹¡Ñ¡¥Ì¤¤ì(€€€€€Ù¥•Ü¹É½½Ð¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰µ½ÕÍ•µ½Ù”ˆ°Ñ¡¥Ì¹µ½Ù”€ôÑ¡¥Ì¹µ½Ù”¹‰¥¹¡Ñ¡¥Ì¤¤ì(€€€ô(€€€ÕÀ¡•Ù•¹Ð¤ì(€€€€€Ñ¡¥Ì¹‘½¹” ¤ì(€€€ô(€€€µ½Ù”¡•Ù•¹Ð¤ì(€€€€€¥˜€¡•Ù•¹Ð¹‰ÕÑÑ½¹Ì€ôô€À¤(€€€€€€€Ñ¡¥Ì¹‘½¹” ¤ì(€€€ô(€€€‘½¹” ¤ì(€€€€€Ñ¡¥Ì¹Ù¥•Ü¹É½½Ð¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È ‰µ½ÕÍ•ÕÀˆ°Ñ¡¥Ì¹ÕÀ¤ì(€€€€€Ñ¡¥Ì¹Ù¥•Ü¹É½½Ð¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È ‰µ½ÕÍ•µ½Ù”ˆ°Ñ¡¥Ì¹µ½Ù”¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹Ù¥•Ü¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸€ôôÑ¡¥Ì¤(€€€€€€€Ñ¡¥Ì¹Ù¥•Ü¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸€ô¹Õ±°ì(€€€ô(€€€‘•±…åM•±UÁ‘…Ñ” ¤ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€ôì(€Ù…È1•™Ñ5½ÕÍ•½Ý¸€ô±…ÍÌ•áÑ•¹‘Ì5½ÕÍ•½Ý¸ì(€€€½¹ÍÑÉÕÑ½È¡Ù¥•Ü°Á½Ì°•Ù•¹Ð°™±ÕÍ¡•¤ì(€€€€€ÍÕÁ•È¡Ù¥•Ü¤ì(€€€€€Ñ¡¥Ì¹Á½Ì€ôÁ½Ìì(€€€€€Ñ¡¥Ì¹•Ù•¹Ð€ô•Ù•¹Ðì(€€€€€Ñ¡¥Ì¹™±ÕÍ¡•€ô™±ÕÍ¡•ì(€€€€€Ñ¡¥Ì¹‘•±…å•‘M•±•Ñ¥½¹Må¹Œ€ô™…±Í”ì(€€€€€Ñ¡¥Ì¹ÍÑ…ÉÑ½Œ€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œì(€€€€€Ñ¡¥Ì¹Í•±•Ñ9½‘”€ô€„…•Ù•¹ÑmÍ•±•Ñ9½‘•5½‘¥™¥•Étì(€€€€€Ñ¡¥Ì¹…±±½Ý•™…Õ±Ð€ô•Ù•¹Ð¹Í¡¥™Ñ-•äì(€€€€€±•ÐÑ…É•Ñ9½‘”°Ñ…É•ÑA½Ìì(€€€€€¥˜€¡Á½Ì¹¥¹Í¥‘”€ø€´Ä¤ì(€€€€€€€Ñ…É•Ñ9½‘”€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹¹½‘•Ð¡Á½Ì¹¥¹Í¥‘”¤ì(€€€€€€€Ñ…É•ÑA½Ì€ôÁ½Ì¹¥¹Í¥‘”ì(€€€€€ô•±Í”ì(€€€€€€€±•Ð€‘Á½Ì€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡Á½Ì¹Á½Ì¤ì(€€€€€€€Ñ…É•Ñ9½‘”€ô€‘Á½Ì¹Á…É•¹Ðì(€€€€€€€Ñ…É•ÑA½Ì€ô€‘Á½Ì¹‘•ÁÑ €ü€‘Á½Ì¹‰•™½É” ¤€è€Àì(€€€€€ô(€€€€€½¹ÍÐÑ…É•Ð€ô™±ÕÍ¡•€ü¹Õ±°€è•Ù•¹Ð¹Ñ…É•Ðì(€€€€€½¹ÍÐÑ…É•Ñ•ÍŒ€ôÑ…É•Ð€üÙ¥•Ü¹‘½Y¥•Ü¹¹•…É•ÍÑ•ÍŒ¡Ñ…É•Ð°ÑÉÕ”¤€è¹Õ±°ì(€€€€€Ñ¡¥Ì¹Ñ…É•Ð€ôÑ…É•Ñ•ÍŒ€˜˜¥Í±Ð¡Ñ…É•Ñ•ÍŒ¹¹½‘•=4¤€üÑ…É•Ñ•ÍŒ¹¹½‘•=4€è¹Õ±°ì(€€€€€±•ÐìÍ•±•Ñ¥½¸ô€ôÙ¥•Ü¹ÍÑ…Ñ”ì(€€€€€¥˜€¡•Ù•¹Ð¹‰ÕÑÑ½¸€ôô€À€˜˜€¡Ñ…É•Ñ9½‘”¹ÑåÁ”¹ÍÁ•Œ¹‘É……‰±”€˜˜Ñ…É•Ñ9½‘”¹ÑåÁ”¹ÍÁ•Œ¹Í•±•Ñ…‰±”€„ôô™…±Í”ñðÍ•±•Ñ¥½¸¥¹ÍÑ…¹•½˜9½‘•M•±•Ñ¥½¸€˜˜Í•±•Ñ¥½¸¹™É½´€ðôÑ…É•ÑA½Ì€˜˜Í•±•Ñ¥½¸¹Ñ¼€øÑ…É•ÑA½Ì¤¤(€€€€€€€Ñ¡¥Ì¹µ¥¡ÑÉ…œ€ôì(€€€€€€€€€¹½‘”èÑ…É•Ñ9½‘”°(€€€€€€€€€Á½ÌèÑ…É•ÑA½Ì°(€€€€€€€€€…‘‘ÑÑÈè€„„¡Ñ¡¥Ì¹Ñ…É•Ð€˜˜€…Ñ¡¥Ì¹Ñ…É•Ð¹‘É……‰±”¤°(€€€€€€€€€Í•ÑU¹•‘¥Ñ…‰±”è€„„¡Ñ¡¥Ì¹Ñ…É•Ð€˜˜•­¼€˜˜€…Ñ¡¥Ì¹Ñ…É•Ð¹¡…ÍÑÑÉ¥‰ÕÑ” ‰½¹Ñ•¹Ñ‘¥Ñ…‰±”ˆ¤¤(€€€€€€€ôì(€€€€€¥˜€¡Ñ¡¥Ì¹Ñ…É•Ð€˜˜Ñ¡¥Ì¹µ¥¡ÑÉ…œ€˜˜€¡Ñ¡¥Ì¹µ¥¡ÑÉ…œ¹…‘‘ÑÑÈñðÑ¡¥Ì¹µ¥¡ÑÉ…œ¹Í•ÑU¹•‘¥Ñ…‰±”¤¤ì(€€€€€€€Ñ¡¥Ì¹Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÑ½À ¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹µ¥¡ÑÉ…œ¹…‘‘ÑÑÈ¤(€€€€€€€€€Ñ¡¥Ì¹Ñ…É•Ð¹‘É……‰±”€ôÑÉÕ”ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹µ¥¡ÑÉ…œ¹Í•ÑU¹•‘¥Ñ…‰±”¤(€€€€€€€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€€€€€€€¥˜€¡Ñ¡¥Ì¹Ù¥•Ü¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸€ôôÑ¡¥Ì¤(€€€€€€€€€€€€€Ñ¡¥Ì¹Ñ…É•Ð¹Í•ÑÑÑÉ¥‰ÕÑ” ‰½¹Ñ•¹Ñ‘¥Ñ…‰±”ˆ°€‰™…±Í”ˆ¤ì(€€€€€€€€€ô°€ÈÀ¤ì(€€€€€€€Ñ¡¥Ì¹Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÑ…ÉÐ ¤ì(€€€€€ô(€€€€€Í•ÑM•±•Ñ¥½¹=É¥¥¸¡Ù¥•Ü°€‰Á½¥¹Ñ•Èˆ¤ì(€€€ô(€€€‘½¹” ¤ì(€€€€€ÍÕÁ•È¹‘½¹” ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹µ¥¡ÑÉ…œ€˜˜Ñ¡¥Ì¹Ñ…É•Ð¤ì(€€€€€€€Ñ¡¥Ì¹Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÑ½À ¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹µ¥¡ÑÉ…œ¹…‘‘ÑÑÈ¤(€€€€€€€€€Ñ¡¥Ì¹Ñ…É•Ð¹É•µ½Ù•ÑÑÉ¥‰ÕÑ” ‰‘É……‰±”ˆ¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹µ¥¡ÑÉ…œ¹Í•ÑU¹•‘¥Ñ…‰±”¤(€€€€€€€€€Ñ¡¥Ì¹Ñ…É•Ð¹É•µ½Ù•ÑÑÉ¥‰ÕÑ” ‰½¹Ñ•¹Ñ‘¥Ñ…‰±”ˆ¤ì(€€€€€€€Ñ¡¥Ì¹Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÑ…ÉÐ ¤ì(€€€€€ô(€€€€€¥˜€¡Ñ¡¥Ì¹‘•±…å•‘M•±•Ñ¥½¹Må¹Œ¤(€€€€€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€€€€€¥˜€ …Ñ¡¥Ì¹Ù¥•Ü¹¥Í•ÍÑÉ½å•¤(€€€€€€€€€€€Í•±•Ñ¥½¹Q½=4¡Ñ¡¥Ì¹Ù¥•Ü¤ì(€€€€€€€ô¤ì(€€€ô(€€€ÕÀ¡•Ù•¹Ð¤ì(€€€€€Ñ¡¥Ì¹‘½¹” ¤ì(€€€€€¥˜€ …Ñ¡¥Ì¹Ù¥•Ü¹‘½´¹½¹Ñ…¥¹Ì¡•Ù•¹Ð¹Ñ…É•Ð¤¤(€€€€€€€É•ÑÕÉ¸ì(€€€€€±•ÐÁ½Ì€ôÑ¡¥Ì¹Á½Ìì(€€€€€¥˜€¡Ñ¡¥Ì¹Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ€„ôÑ¡¥Ì¹ÍÑ…ÉÑ½Œ¤(€€€€€€€Á½Ì€ôÑ¡¥Ì¹Ù¥•Ü¹Á½ÍÑ½½É‘Ì¡•Ù•¹Ñ½½É‘Ì¡•Ù•¹Ð¤¤ì(€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•±±½Ý•™…Õ±Ð¡•Ù•¹Ð¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹…±±½Ý•™…Õ±Ðñð€…Á½Ì¤ì(€€€€€€€Í•ÑM•±•Ñ¥½¹=É¥¥¸¡Ñ¡¥Ì¹Ù¥•Ü°€‰Á½¥¹Ñ•Èˆ¤ì(€€€€€ô•±Í”¥˜€¡¡…¹‘±•M¥¹±•±¥¬¡Ñ¡¥Ì¹Ù¥•Ü°Á½Ì¹Á½Ì°Á½Ì¹¥¹Í¥‘”°•Ù•¹Ð°Ñ¡¥Ì¹Í•±•Ñ9½‘”¤¤ì(€€€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€€€ô•±Í”¥˜€¡•Ù•¹Ð¹‰ÕÑÑ½¸€ôô€À€˜˜€¡Ñ¡¥Ì¹™±ÕÍ¡•ñð€¼¼M…™…É¤¥¹½É•Ì±¥­Ì½¸‘É……‰±”•±•µ•¹ÑÌ(€€€€€Í…™…É¤€˜˜Ñ¡¥Ì¹µ¥¡ÑÉ…œ€˜˜€…Ñ¡¥Ì¹µ¥¡ÑÉ…œ¹¹½‘”¹¥ÍÑ½´ñð€¼¼¡É½µ”Ý¥±°Í½µ•Ñ¥µ•ÌÑÉ•…Ð„¹½‘”Í•±•Ñ¥½¸…Ì„(€€€€€€¼¼ÕÉÍ½È°‰ÕÐÍÑ¥±°É•Á½ÉÐÑ¡…ÐÑ¡”¹½‘”¥ÌÍ•±•Ñ•(€€€€€€¼¼Ý¡•¸…Í­•Ñ¡É½Õ •ÑM•±•Ñ¥½¸¸e½Ô±°Ñ¡•¸•Ð„(€€€€€€¼¼Í¥ÑÕ…Ñ¥½¸Ý¡•É”±¥­¥¹œ…ÐÑ¡”Á½¥¹ÐÝ¡•É”Ñ¡…Ð(€€€€€€¼¼€¡¡¥‘‘•¸¤ÕÉÍ½È¥Ì‘½•Í¸Ð¡…¹”Ñ¡”Í•±•Ñ¥½¸°…¹(€€€€€€¼¼Ñ¡ÕÌ‘½•Í¸Ð•Ð„É•…Ñ¥½¸™É½´AÉ½Í•5¥ÉÉ½È¸Q¡¥Ì(€€€€€€¼¼Ý½É­Ì…É½Õ¹Ñ¡…Ð¸(€€€€€¡É½µ”€˜˜€…Ñ¡¥Ì¹Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ù¥Í¥‰±”€˜˜5…Ñ ¹µ¥¸¡5…Ñ ¹…‰Ì¡Á½Ì¹Á½Ì€´Ñ¡¥Ì¹Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´¤°5…Ñ ¹…‰Ì¡Á½Ì¹Á½Ì€´Ñ¡¥Ì¹Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼¤¤€ðô€È¤¤ì(€€€€€€€ÕÁ‘…Ñ•M•±•Ñ¥½¸¡Ñ¡¥Ì¹Ù¥•Ü°M•±•Ñ¥½¸¹¹•…È¡Ñ¡¥Ì¹Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡Á½Ì¹Á½Ì¤¤¤ì(€€€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€€€ô•±Í”ì(€€€€€€€Í•ÑM•±•Ñ¥½¹=É¥¥¸¡Ñ¡¥Ì¹Ù¥•Ü°€‰Á½¥¹Ñ•Èˆ¤ì(€€€€€ô(€€€ô(€€€µ½Ù”¡•Ù•¹Ð¤ì(€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•±±½Ý•™…Õ±Ð¡•Ù•¹Ð¤ì(€€€€€Í•ÑM•±•Ñ¥½¹=É¥¥¸¡Ñ¡¥Ì¹Ù¥•Ü°€‰Á½¥¹Ñ•Èˆ¤ì(€€€€€ÍÕÁ•È¹µ½Ù”¡•Ù•¹Ð¤ì(€€€ô(€€€ÕÁ‘…Ñ•±±½Ý•™…Õ±Ð¡•Ù•¹Ð¤ì(€€€€€¥˜€ …Ñ¡¥Ì¹…±±½Ý•™…Õ±Ð€˜˜€¡5…Ñ ¹…‰Ì¡Ñ¡¥Ì¹•Ù•¹Ð¹à€´•Ù•¹Ð¹±¥•¹Ñ`¤€ø€Ðñð5…Ñ ¹…‰Ì¡Ñ¡¥Ì¹•Ù•¹Ð¹ä€´•Ù•¹Ð¹±¥•¹Ñd¤€ø€Ð¤¤(€€€€€€€Ñ¡¥Ì¹…±±½Ý•™…Õ±Ð€ôÑÉÕ”ì(€€€ô(€€€‘•±…åM•±UÁ‘…Ñ” ¤ì(€€€€€¥˜€ …Ñ¡¥Ì¹…±±½Ý•™…Õ±Ð¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€Ñ¡¥Ì¹‘•±…å•‘M•±•Ñ¥½¹Må¹Œ€ôÑÉÕ”ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€ôì(€Ù…ÈQÉ¥Á±•±¥­É…œ€ô±…ÍÌ•áÑ•¹‘Ì5½ÕÍ•½Ý¸ì(€€€½¹ÍÑÉÕÑ½È¡Ù¥•Ü°ÍÑ…ÉÑM•±•Ñ¥½¸¤ì(€€€€€ÍÕÁ•È¡Ù¥•Ü¤ì(€€€€€Ñ¡¥Ì¹ÍÑ…ÉÑM•±•Ñ¥½¸€ôÍÑ…ÉÑM•±•Ñ¥½¸ì(€€€€€Ñ¡¥Ì¹ÍÑ…ÉÑ½Œ€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œì(€€€ô(€€€µ½Ù”¡•Ù•¹Ð¤ì(€€€€€¥˜€¡•Ù•¹Ð¹‰ÕÑÑ½¹Ì€ôô€ÀñðÑ¡¥Ì¹Ù¥•Ü¹¥Í•ÍÑÉ½å•ñð€…Ñ¡¥Ì¹Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹•Ä¡Ñ¡¥Ì¹ÍÑ…ÉÑ½Œ¤¤ì(€€€€€€€Ñ¡¥Ì¹‘½¹” ¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô(€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€€€Í•ÑM•±•Ñ¥½¹=É¥¥¸¡Ñ¡¥Ì¹Ù¥•Ü°€‰Á½¥¹Ñ•Èˆ¤ì(€€€€€±•ÐÁ½Ì€ôÑ¡¥Ì¹Ù¥•Ü¹Á½ÍÑ½½É‘Ì¡•Ù•¹Ñ½½É‘Ì¡•Ù•¹Ð¤¤ì(€€€€€±•ÐÑ…É•Ð€ôÁ½Ì€˜˜Í•±•Ñ¥½¹½ÉQÉ¥Á±•±¥¬¡Ñ¡¥Ì¹Ù¥•Ü°Á½Ì¹¥¹Í¥‘”°™…±Í”¤ì(€€€€€¥˜€ …Ñ…É•Ð¤(€€€€€€€É•ÑÕÉ¸ì(€€€€€±•Ðì‘½Œè‘½ŒÔô€ôÑ¡¥Ì¹Ù¥•Ü¹ÍÑ…Ñ”°ÍÑ…ÉÐ€ôÑ¡¥Ì¹ÍÑ…ÉÑM•±•Ñ¥½¸ì(€€€€€±•Ðm…¹¡½È°¡•…‘t€ôÑ…É•Ð¹™É½´€ðÍÑ…ÉÐ¹™É½´€ümÍÑ…ÉÐ¹Ñ¼°Ñ…É•Ð¹™É½µt€èmÍÑ…ÉÐ¹™É½´°Ñ…É•Ð¹Ñ½tì(€€€€€ÕÁ‘…Ñ•M•±•Ñ¥½¸¡Ñ¡¥Ì¹Ù¥•Ü°Q•áÑM•±•Ñ¥½¸¹É•…Ñ”¡‘½ŒÔ°…¹¡½È°¡•…¤¤ì(€€€ô(€ôì(€¡…¹‘±•ÉÌ¹Ñ½Õ¡ÍÑ…ÉÐ€ô€¡Ù¥•Ü¤€ôøì(€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑQ½Õ €ô…Ñ”¹¹½Ü ¤ì(€€€™½É•=5±ÕÍ ¡Ù¥•Ü¤ì(€€€Í•ÑM•±•Ñ¥½¹=É¥¥¸¡Ù¥•Ü°€‰Á½¥¹Ñ•Èˆ¤ì(€ôì(€¡…¹‘±•ÉÌ¹Ñ½Õ¡µ½Ù”€ô€¡Ù¥•Ü¤€ôøì(€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑQ½Õ €ô…Ñ”¹¹½Ü ¤ì(€€€Í•ÑM•±•Ñ¥½¹=É¥¥¸¡Ù¥•Ü°€‰Á½¥¹Ñ•Èˆ¤ì(€ôì(€¡…¹‘±•ÉÌ¹½¹Ñ•áÑµ•¹Ô€ô€¡Ù¥•Ü¤€ôø™½É•=5±ÕÍ ¡Ù¥•Ü¤ì(€™Õ¹Ñ¥½¸¥¹=É9•…É½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü°•Ù•¹Ð¤ì(€€€¥˜€¡Ù¥•Ü¹½µÁ½Í¥¹œ¤(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€¥˜€¡Í…™…É¤€˜˜5…Ñ ¹…‰Ì¡…Ñ”¹¹½Ü ¤€´Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹¹‘•‘Ð¤€ð€ÔÀÀ¤ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹¹‘•‘Ð€ô€´É”àì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ô(€Ù…ÈÑ¥µ•½ÕÑ½µÁ½Í¥Ñ¥½¸€ô…¹‘É½¥€ü€Õ”Ì€è€´Äì(€•‘¥Ñ!…¹‘±•ÉÌ¹½µÁ½Í¥Ñ¥½¹ÍÑ…ÉÐ€ô•‘¥Ñ!…¹‘±•ÉÌ¹½µÁ½Í¥Ñ¥½¹ÕÁ‘…Ñ”€ô€¡Ù¥•Ü¤€ôøì(€€€¥˜€ …Ù¥•Ü¹½µÁ½Í¥¹œ¤ì(€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹™±ÕÍ  ¤ì(€€€€€±•ÐìÍÑ…Ñ”ô€ôÙ¥•Ü°€‘Á½Ì€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸¸‘Ñ¼ì(€€€€€¥˜€¡ÍÑ…Ñ”¹Í•±•Ñ¥½¸¥¹ÍÑ…¹•½˜Q•áÑM•±•Ñ¥½¸€˜˜ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹•µÁÑä€˜˜€¡ÍÑ…Ñ”¹ÍÑ½É•‘5…É­Ìñð€„‘Á½Ì¹Ñ•áÑ=™™Í•Ð€˜˜€‘Á½Ì¹Á…É•¹Ñ=™™Í•Ð€˜˜€‘Á½Ì¹¹½‘•	•™½É”¹µ…É­Ì¹Í½µ” ¡´¤€ôø´¹ÑåÁ”¹ÍÁ•Œ¹¥¹±ÕÍ¥Ù”€ôôô™…±Í”¤ñð¡É½µ”€˜˜Ý¥¹‘½ÝÌ€˜˜Í•±•Ñ¥½¹	•™½É•U¹•‘¥Ñ…‰±”¡Ù¥•Ü¤¤¤ì(€€€€€€€Ù¥•Ü¹µ…É­ÕÉÍ½È€ôÙ¥•Ü¹ÍÑ…Ñ”¹ÍÑ½É•‘5…É­Ìñð€‘Á½Ì¹µ…É­Ì ¤ì(€€€€€€€•¹‘½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü°ÑÉÕ”¤ì(€€€€€€€Ù¥•Ü¹µ…É­ÕÉÍ½È€ô¹Õ±°ì(€€€€€ô•±Í”ì(€€€€€€€•¹‘½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü°€…ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹•µÁÑä¤ì(€€€€€€€¥˜€¡•­¼€˜˜ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹•µÁÑä€˜˜€‘Á½Ì¹Á…É•¹Ñ=™™Í•Ð€˜˜€„‘Á½Ì¹Ñ•áÑ=™™Í•Ð€˜˜€‘Á½Ì¹¹½‘•	•™½É”¹µ…É­Ì¹±•¹Ñ ¤ì(€€€€€€€€€±•ÐÍ•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€€€€€€€™½È€¡±•Ð¹½‘”€ôÍ•°¹™½ÕÍ9½‘”°½™™Í•Ð€ôÍ•°¹™½ÕÍ=™™Í•Ðì¹½‘”€˜˜¥Í±Ð¡¹½‘”¤€˜˜½™™Í•Ð€„ô€Àì€¤ì(€€€€€€€€€€€±•Ð‰•™½É”€ô½™™Í•Ð€ð€À€ü¹½‘”¹±…ÍÑ¡¥±€è¹½‘”¹¡¥±‘9½‘•Ím½™™Í•Ð€´€Åtì(€€€€€€€€€€€¥˜€ …‰•™½É”¤(€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€¥˜€¡¥ÍQ•áÐ¡‰•™½É”¤¤ì(€€€€€€€€€€€€€±•ÐÍ•°È€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¸ ¤ì(€€€€€€€€€€€€€¥˜€¡Í•°È¤(€€€€€€€€€€€€€€€Í•°È¹½±±…ÁÍ”¡‰•™½É”°‰•™½É”¹¹½‘•Y…±Õ”¹±•¹Ñ ¤ì(€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€€€¹½‘”€ô‰•™½É”ì(€€€€€€€€€€€€€½™™Í•Ð€ô€´Äì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€ô(€€€€€ô(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥¹œ€ôÑÉÕ”ì(€€€ô(€€€Í¡•‘Õ±•½µÁ½Í•¹¡Ù¥•Ü°Ñ¥µ•½ÕÑ½µÁ½Í¥Ñ¥½¸¤ì(€ôì(€™Õ¹Ñ¥½¸Í•±•Ñ¥½¹	•™½É•U¹•‘¥Ñ…‰±”¡Ù¥•Ü¤ì(€€€±•Ðì™½ÕÍ9½‘”°™½ÕÍ=™™Í•Ðô€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€¥˜€ …™½ÕÍ9½‘”ñð€…¥Í±Ð¡™½ÕÍ9½‘”¤ñð™½ÕÍ=™™Í•Ð€øô™½ÕÍ9½‘”¹¡¥±‘9½‘•Ì¹±•¹Ñ ¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ð¹•áÐ€ô™½ÕÍ9½‘”¹¡¥±‘9½‘•Ím™½ÕÍ=™™Í•Ñtì(€€€É•ÑÕÉ¸¥Í±Ð¡¹•áÐ¤€˜˜¹•áÐ¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆì(€ô(€•‘¥Ñ!…¹‘±•ÉÌ¹½µÁ½Í¥Ñ¥½¹•¹€ô€¡Ù¥•Ü°•Ù•¹Ð¤€ôøì(€€€¥˜€¡Ù¥•Ü¹½µÁ½Í¥¹œ¤ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥¹œ€ô™…±Í”ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹¹‘•‘Ð€ô…Ñ”¹¹½Ü ¤ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹A•¹‘¥¹¡…¹•Ì€ôÙ¥•Ü¹‘½µ=‰Í•ÉÙ•È¹Á•¹‘¥¹I•½É‘Ì ¤¹±•¹Ñ €üÙ¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹%€è€Àì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹9½‘”€ô¹Õ±°ì(€€€€€¥˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹‰…‘M…™…É¥½µÁ½Í¥Ñ¥½¸¤(€€€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹™½É•±ÕÍ  ¤ì(€€€€€•±Í”¥˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹A•¹‘¥¹¡…¹•Ì¤(€€€€€€€AÉ½µ¥Í”¹É•Í½±Ù” ¤¹Ñ¡•¸  ¤€ôøÙ¥•Ü¹‘½µ=‰Í•ÉÙ•È¹™±ÕÍ  ¤¤ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹%¬¬ì(€€€€€Í¡•‘Õ±•½µÁ½Í•¹¡Ù¥•Ü°€ÈÀ¤ì(€€€ô(€ôì(€™Õ¹Ñ¥½¸Í¡•‘Õ±•½µÁ½Í•¹¡Ù¥•Ü°‘•±…ä¤ì(€€€±•…ÉQ¥µ•½ÕÐ¡Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥¹Q¥µ•½ÕÐ¤ì(€€€¥˜€¡‘•±…ä€ø€´Ä¤(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥¹Q¥µ•½ÕÐ€ôÍ•ÑQ¥µ•½ÕÐ  ¤€ôø•¹‘½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü¤°‘•±…ä¤ì(€ô(€™Õ¹Ñ¥½¸±•…É½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü¤ì(€€€¥˜€¡Ù¥•Ü¹½µÁ½Í¥¹œ¤ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥¹œ€ô™…±Í”ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹¹‘•‘Ð€ô…Ñ”¹¹½Ü ¤ì(€€€ô(€€€Ý¡¥±”€¡Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹9½‘•Ì¹±•¹Ñ €ø€À¤(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹9½‘•Ì¹Á½À ¤¹µ…É­A…É•¹ÑÍ¥ÉÑä ¤ì(€ô(€™Õ¹Ñ¥½¸™¥¹‘½µÁ½Í¥Ñ¥½¹9½‘”¡Ù¥•Ü¤ì(€€€±•ÐÍ•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€¥˜€ …Í•°¹™½ÕÍ9½‘”¤(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€±•ÐÑ•áÑ	•™½É”€ôÑ•áÑ9½‘•	•™½É”Ä¡Í•°¹™½ÕÍ9½‘”°Í•°¹™½ÕÍ=™™Í•Ð¤ì(€€€±•ÐÑ•áÑ™Ñ•È€ôÑ•áÑ9½‘•™Ñ•ÈÄ¡Í•°¹™½ÕÍ9½‘”°Í•°¹™½ÕÍ=™™Í•Ð¤ì(€€€¥˜€¡Ñ•áÑ	•™½É”€˜˜Ñ•áÑ™Ñ•È€˜˜Ñ•áÑ	•™½É”€„ôÑ•áÑ™Ñ•È¤ì(€€€€€±•Ð‘•Í™Ñ•È€ôÑ•áÑ™Ñ•È¹ÁµY¥•Ý•ÍŒ°±…ÍÑ¡…¹•€ôÙ¥•Ü¹‘½µ=‰Í•ÉÙ•È¹±…ÍÑ¡…¹•‘Q•áÑ9½‘”ì(€€€€€¥˜€¡Ñ•áÑ	•™½É”€ôô±…ÍÑ¡…¹•ñðÑ•áÑ™Ñ•È€ôô±…ÍÑ¡…¹•¤(€€€€€€€É•ÑÕÉ¸±…ÍÑ¡…¹•ì(€€€€€¥˜€ …‘•Í™Ñ•Èñð€…‘•Í™Ñ•È¹¥ÍQ•áÐ¡Ñ•áÑ™Ñ•È¹¹½‘•Y…±Õ”¤¤ì(€€€€€€€É•ÑÕÉ¸Ñ•áÑ™Ñ•Èì(€€€€€ô•±Í”¥˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹9½‘”€ôôÑ•áÑ™Ñ•È¤ì(€€€€€€€±•Ð‘•Í	•™½É”€ôÑ•áÑ	•™½É”¹ÁµY¥•Ý•ÍŒì(€€€€€€€¥˜€ „ …‘•Í	•™½É”ñð€…‘•Í	•™½É”¹¥ÍQ•áÐ¡Ñ•áÑ	•™½É”¹¹½‘•Y…±Õ”¤¤¤(€€€€€€€€€É•ÑÕÉ¸Ñ•áÑ™Ñ•Èì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸Ñ•áÑ	•™½É”ñðÑ•áÑ™Ñ•Èì(€ô(€™Õ¹Ñ¥½¸•¹‘½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü°É•ÍÑ…ÉÑ¥¹œ€ô™…±Í”¤ì(€€€¥˜€¡…¹‘É½¥€˜˜Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹™±ÕÍ¡¥¹M½½¸€øô€À¤(€€€€€É•ÑÕÉ¸ì(€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹™½É•±ÕÍ  ¤ì(€€€±•…É½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü¤ì(€€€¥˜€¡É•ÍÑ…ÉÑ¥¹œñðÙ¥•Ü¹‘½Y¥•Ü€˜˜Ù¥•Ü¹‘½Y¥•Ü¹‘¥ÉÑä¤ì(€€€€€±•ÐÍ•°€ôÍ•±•Ñ¥½¹É½µ=4¡Ù¥•Ü¤°ÕÈ€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€€€¥˜€¡Í•°€˜˜€…Í•°¹•Ä¡ÕÈ¤¤(€€€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡Ù¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Í•°¤¤ì(€€€€€•±Í”¥˜€ ¡Ù¥•Ü¹µ…É­ÕÉÍ½ÈñðÉ•ÍÑ…ÉÑ¥¹œ¤€˜˜€…ÕÈ¸‘™É½´¹¹½‘”¡ÕÈ¸‘™É½´¹Í¡…É•‘•ÁÑ ¡ÕÈ¹Ñ¼¤¤¹¥¹±¥¹•½¹Ñ•¹Ð¤(€€€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡Ù¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹‘•±•Ñ•M•±•Ñ¥½¸ ¤¤ì(€€€€€•±Í”(€€€€€€€Ù¥•Ü¹ÕÁ‘…Ñ•MÑ…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ô(€™Õ¹Ñ¥½¸…ÁÑÕÉ•½Áä¡Ù¥•Ü°‘½´¤ì(€€€¥˜€ …Ù¥•Ü¹‘½´¹Á…É•¹Ñ9½‘”¤(€€€€€É•ÑÕÉ¸ì(€€€±•ÐÝÉ…ÀÈ€ôÙ¥•Ü¹‘½´¹Á…É•¹Ñ9½‘”¹…ÁÁ•¹‘¡¥±¡‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤¤ì(€€€ÝÉ…ÀÈ¹…ÁÁ•¹‘¡¥±¡‘½´¤ì(€€€ÝÉ…ÀÈ¹ÍÑå±”¹ÍÍQ•áÐ€ô€‰Á½Í¥Ñ¥½¸è™¥á•ì±•™Ðè€´ÄÀÀÀÁÁàìÑ½Àè€ÄÁÁàˆì(€€€±•ÐÍ•°€ô•ÑM•±•Ñ¥½¸ ¤°É…¹”€ô‘½Õµ•¹Ð¹É•…Ñ•I…¹” ¤ì(€€€É…¹”¹Í•±•Ñ9½‘•½¹Ñ•¹ÑÌ¡‘½´¤ì(€€€Ù¥•Ü¹‘½´¹‰±ÕÈ ¤ì(€€€Í•°¹É•µ½Ù•±±I…¹•Ì ¤ì(€€€Í•°¹…‘‘I…¹”¡É…¹”¤ì(€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€¥˜€¡ÝÉ…ÀÈ¹Á…É•¹Ñ9½‘”¤(€€€€€€€ÝÉ…ÀÈ¹Á…É•¹Ñ9½‘”¹É•µ½Ù•¡¥±¡ÝÉ…ÀÈ¤ì(€€€€€Ù¥•Ü¹™½ÕÌ ¤ì(€€€ô°€ÔÀ¤ì(€ô(€Ù…È‰É½­•¹±¥Á‰½…É‘A$€ô¥”€˜˜¥•}Ù•ÉÍ¥½¸€ð€ÄÔñð¥½Ì€˜˜Ý•‰­¥Ñ}Ù•ÉÍ¥½¸€ð€ØÀÐì(€¡…¹‘±•ÉÌ¹½Áä€ô•‘¥Ñ!…¹‘±•ÉÌ¹ÕÐ€ô€¡Ù¥•Ü°}•Ù•¹Ð¤€ôøì(€€€±•Ð•Ù•¹Ð€ô}•Ù•¹Ðì(€€€±•ÐÍ•°€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸°ÕÐ€ô•Ù•¹Ð¹ÑåÁ”€ôô€‰ÕÐˆì(€€€¥˜€¡Í•°¹•µÁÑä¤(€€€€€É•ÑÕÉ¸ì(€€€±•Ð‘…Ñ„€ô‰É½­•¹±¥Á‰½…É‘A$€ü¹Õ±°€è•Ù•¹Ð¹±¥Á‰½…É‘…Ñ„ì(€€€±•ÐÍ±¥”€ôÍ•°¹½¹Ñ•¹Ð ¤°ì‘½´°Ñ•áÐèÑ•áÐÈô€ôÍ•É¥…±¥é•½É±¥Á‰½…É¡Ù¥•Ü°Í±¥”¤ì(€€€¥˜€¡‘…Ñ„¤ì(€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€€€‘…Ñ„¹±•…É…Ñ„ ¤ì(€€€€€‘…Ñ„¹Í•Ñ…Ñ„ ‰Ñ•áÐ½¡Ñµ°ˆ°‘½´¹¥¹¹•É!Q50¤ì(€€€€€‘…Ñ„¹Í•Ñ…Ñ„ ‰Ñ•áÐ½Á±…¥¸ˆ°Ñ•áÐÈ¤ì(€€€ô•±Í”ì(€€€€€…ÁÑÕÉ•½Áä¡Ù¥•Ü°‘½´¤ì(€€€ô(€€€¥˜€¡ÕÐ¤(€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡Ù¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹‘•±•Ñ•M•±•Ñ¥½¸ ¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¹Í•Ñ5•Ñ„ ‰Õ¥Ù•¹Ðˆ°€‰ÕÐˆ¤¤ì(€ôì(€™Õ¹Ñ¥½¸Í±¥•M¥¹±•9½‘”¡Í±¥”¤ì(€€€É•ÑÕÉ¸Í±¥”¹½Á•¹MÑ…ÉÐ€ôô€À€˜˜Í±¥”¹½Á•¹¹€ôô€À€˜˜Í±¥”¹½¹Ñ•¹Ð¹¡¥±‘½Õ¹Ð€ôô€Ä€üÍ±¥”¹½¹Ñ•¹Ð¹™¥ÉÍÑ¡¥±€è¹Õ±°ì(€ô(€™Õ¹Ñ¥½¸…ÁÑÕÉ•A…ÍÑ”¡Ù¥•Ü°•Ù•¹Ð¤ì(€€€¥˜€ …Ù¥•Ü¹‘½´¹Á…É•¹Ñ9½‘”¤(€€€€€É•ÑÕÉ¸ì(€€€±•ÐÁ±…¥¹Q•áÐ€ôÙ¥•Ü¹¥¹ÁÕÐ¹Í¡¥™Ñ-•äñðÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¸‘™É½´¹Á…É•¹Ð¹ÑåÁ”¹ÍÁ•Œ¹½‘”ì(€€€±•ÐÑ…É•Ð€ôÙ¥•Ü¹‘½´¹Á…É•¹Ñ9½‘”¹…ÁÁ•¹‘¡¥±¡‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð¡Á±…¥¹Q•áÐ€ü€‰Ñ•áÑ…É•„ˆ€è€‰‘¥Øˆ¤¤ì(€€€¥˜€ …Á±…¥¹Q•áÐ¤(€€€€€Ñ…É•Ð¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ô€‰ÑÉÕ”ˆì(€€€Ñ…É•Ð¹ÍÑå±”¹ÍÍQ•áÐ€ô€‰Á½Í¥Ñ¥½¸è™¥á•ì±•™Ðè€´ÄÀÀÀÁÁàìÑ½Àè€ÄÁÁàˆì(€€€Ñ…É•Ð¹™½ÕÌ ¤ì(€€€±•ÐÁ±…¥¸€ôÙ¥•Ü¹¥¹ÁÕÐ¹Í¡¥™Ñ-•ä€˜˜Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘”€„ô€ÐÔì(€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€Ù¥•Ü¹™½ÕÌ ¤ì(€€€€€¥˜€¡Ñ…É•Ð¹Á…É•¹Ñ9½‘”¤(€€€€€€€Ñ…É•Ð¹Á…É•¹Ñ9½‘”¹É•µ½Ù•¡¥±¡Ñ…É•Ð¤ì(€€€€€¥˜€¡Á±…¥¹Q•áÐ¤(€€€€€€€‘½A…ÍÑ”¡Ù¥•Ü°Ñ…É•Ð¹Ù…±Õ”°¹Õ±°°Á±…¥¸°•Ù•¹Ð¤ì(€€€€€•±Í”(€€€€€€€‘½A…ÍÑ”¡Ù¥•Ü°Ñ…É•Ð¹Ñ•áÑ½¹Ñ•¹Ð°Ñ…É•Ð¹¥¹¹•É!Q50°Á±…¥¸°•Ù•¹Ð¤ì(€€€ô°€ÔÀ¤ì(€ô(€™Õ¹Ñ¥½¸‘½A…ÍÑ”¡Ù¥•Ü°Ñ•áÐÈ°¡Ñµ°°ÁÉ•™•ÉA±…¥¸°•Ù•¹Ð¤ì(€€€±•ÐÍ±¥”€ôÁ…ÉÍ•É½µ±¥Á‰½…É¡Ù¥•Ü°Ñ•áÐÈ°¡Ñµ°°ÁÉ•™•ÉA±…¥¸°Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¸‘™É½´¤ì(€€€¥˜€¡Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•A…ÍÑ”ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°•Ù•¹Ð°Í±¥”ñðM±¥”È¹•µÁÑä¤¤¤(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€¥˜€ …Í±¥”¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•ÐÍ¥¹±•9½‘”€ôÍ±¥•M¥¹±•9½‘”¡Í±¥”¤ì(€€€±•ÐÑÈ€ôÍ¥¹±•9½‘”€üÙ¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹É•Á±…•M•±•Ñ¥½¹]¥Ñ ¡Í¥¹±•9½‘”°ÁÉ•™•ÉA±…¥¸¤€èÙ¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹É•Á±…•M•±•Ñ¥½¸¡Í±¥”¤ì(€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¹Í•Ñ5•Ñ„ ‰Á…ÍÑ”ˆ°ÑÉÕ”¤¹Í•Ñ5•Ñ„ ‰Õ¥Ù•¹Ðˆ°€‰Á…ÍÑ”ˆ¤¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ô(€™Õ¹Ñ¥½¸•ÑQ•áÐ¡±¥Á‰½…É‘…Ñ„¤ì(€€€±•ÐÑ•áÐÈ€ô±¥Á‰½…É‘…Ñ„¹•Ñ…Ñ„ ‰Ñ•áÐ½Á±…¥¸ˆ¤ñð±¥Á‰½…É‘…Ñ„¹•Ñ…Ñ„ ‰Q•áÐˆ¤ì(€€€¥˜€¡Ñ•áÐÈ¤(€€€€€É•ÑÕÉ¸Ñ•áÐÈì(€€€±•ÐÕÉ¥Ì€ô±¥Á‰½…É‘…Ñ„¹•Ñ…Ñ„ ‰Ñ•áÐ½ÕÉ¤µ±¥ÍÐˆ¤ì(€€€É•ÑÕÉ¸ÕÉ¥Ì€üÕÉ¥Ì¹É•Á±…” ½qÈýq¸½œ°€ˆ€ˆ¤€è€ˆˆì(€ô(€•‘¥Ñ!…¹‘±•ÉÌ¹Á…ÍÑ”€ô€¡Ù¥•Ü°}•Ù•¹Ð¤€ôøì(€€€±•Ð•Ù•¹Ð€ô}•Ù•¹Ðì(€€€¥˜€¡Ù¥•Ü¹½µÁ½Í¥¹œ€˜˜€……¹‘É½¥¤(€€€€€É•ÑÕÉ¸ì(€€€±•Ð‘…Ñ„€ô‰É½­•¹±¥Á‰½…É‘A$€ü¹Õ±°€è•Ù•¹Ð¹±¥Á‰½…É‘…Ñ„ì(€€€±•ÐÁ±…¥¸€ôÙ¥•Ü¹¥¹ÁÕÐ¹Í¡¥™Ñ-•ä€˜˜Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘”€„ô€ÐÔì(€€€¥˜€¡‘…Ñ„€˜˜‘½A…ÍÑ”¡Ù¥•Ü°•ÑQ•áÐ¡‘…Ñ„¤°‘…Ñ„¹•Ñ…Ñ„ ‰Ñ•áÐ½¡Ñµ°ˆ¤°Á±…¥¸°•Ù•¹Ð¤¤(€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€•±Í”(€€€€€…ÁÑÕÉ•A…ÍÑ”¡Ù¥•Ü°•Ù•¹Ð¤ì(€ôì(€Ù…ÈÉ…¥¹œ€ô±…ÍÌì(€€€½¹ÍÑÉÕÑ½È¡Í±¥”°µ½Ù”°¹½‘”¤ì(€€€€€Ñ¡¥Ì¹Í±¥”€ôÍ±¥”ì(€€€€€Ñ¡¥Ì¹µ½Ù”€ôµ½Ù”ì(€€€€€Ñ¡¥Ì¹¹½‘”€ô¹½‘”ì(€€€ô(€ôì(€Ù…È‘É…½Áå5½‘¥™¥•È€ôµ…Œ€ü€‰…±Ñ-•äˆ€è€‰ÑÉ±-•äˆì(€™Õ¹Ñ¥½¸‘É…5½Ù•Ì¡Ù¥•Ü°•Ù•¹Ð¤ì(€€€±•Ð½ÁäÔì(€€€Ù¥•Ü¹Í½µ•AÉ½À ‰‘É…½Á¥•Ìˆ°€¡Ñ•ÍÐ¤€ôøì(€€€€€½ÁäÔ€ô½ÁäÔñðÑ•ÍÐ¡•Ù•¹Ð¤ì(€€€ô¤ì(€€€É•ÑÕÉ¸½ÁäÔ€„ô¹Õ±°€ü€…½ÁäÔ€è€…•Ù•¹Ñm‘É…½Áå5½‘¥™¥•Étì(€ô(€¡…¹‘±•ÉÌ¹‘É…ÍÑ…ÉÐ€ô€¡Ù¥•Ü°}•Ù•¹Ð¤€ôøì(€€€±•Ð•Ù•¹Ð€ô}•Ù•¹Ðì(€€€±•Ðµ½ÕÍ•½Ý¸€ôÙ¥•Ü¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸ì(€€€¥˜€¡µ½ÕÍ•½Ý¸¤(€€€€€µ½ÕÍ•½Ý¸¹‘½¹” ¤ì(€€€¥˜€ …•Ù•¹Ð¹‘…Ñ…QÉ…¹Í™•È¤(€€€€€É•ÑÕÉ¸ì(€€€±•ÐÍ•°€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€±•ÐÁ½Ì€ôÍ•°¹•µÁÑä€ü¹Õ±°€èÙ¥•Ü¹Á½ÍÑ½½É‘Ì¡•Ù•¹Ñ½½É‘Ì¡•Ù•¹Ð¤¤ì(€€€±•Ð¹½‘”ì(€€€¥˜€¡Á½Ì€˜˜Á½Ì¹Á½Ì€øôÍ•°¹™É½´€˜˜Á½Ì¹Á½Ì€ðô€¡Í•°¥¹ÍÑ…¹•½˜9½‘•M•±•Ñ¥½¸€üÍ•°¹Ñ¼€´€Ä€èÍ•°¹Ñ¼¤¤€ì(€€€•±Í”¥˜€¡µ½ÕÍ•½Ý¸€˜˜µ½ÕÍ•½Ý¸¹µ¥¡ÑÉ…œ¤ì(€€€€€¹½‘”€ô9½‘•M•±•Ñ¥½¸¹É•…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ°µ½ÕÍ•½Ý¸¹µ¥¡ÑÉ…œ¹Á½Ì¤ì(€€€ô•±Í”¥˜€¡•Ù•¹Ð¹Ñ…É•Ð€˜˜¥Í±Ð¡•Ù•¹Ð¹Ñ…É•Ð¤¤ì(€€€€€±•Ð‘•ÍŒ€ôÙ¥•Ü¹‘½Y¥•Ü¹¹•…É•ÍÑ•ÍŒ¡•Ù•¹Ð¹Ñ…É•Ð°ÑÉÕ”¤ì(€€€€€¥˜€¡‘•ÍŒ€˜˜‘•ÍŒ¹¹½‘”¹ÑåÁ”¹ÍÁ•Œ¹‘É……‰±”€˜˜‘•ÍŒ€„ôÙ¥•Ü¹‘½Y¥•Ü¤(€€€€€€€¹½‘”€ô9½‘•M•±•Ñ¥½¸¹É•…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ°‘•ÍŒ¹Á½Í	•™½É”¤ì(€€€ô(€€€±•Ð‘É…•‘M±¥”€ô€¡¹½‘”ñðÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¤¹½¹Ñ•¹Ð ¤ì(€€€±•Ðì‘½´°Ñ•áÐèÑ•áÐÈ°Í±¥”ô€ôÍ•É¥…±¥é•½É±¥Á‰½…É¡Ù¥•Ü°‘É…•‘M±¥”¤ì(€€€¥˜€ …•Ù•¹Ð¹‘…Ñ…QÉ…¹Í™•È¹™¥±•Ì¹±•¹Ñ ñð€…¡É½µ”ñð¡É½µ•}Ù•ÉÍ¥½¸€ø€ÄÈÀ¤(€€€€€•Ù•¹Ð¹‘…Ñ…QÉ…¹Í™•È¹±•…É…Ñ„ ¤ì(€€€•Ù•¹Ð¹‘…Ñ…QÉ…¹Í™•È¹Í•Ñ…Ñ„¡‰É½­•¹±¥Á‰½…É‘A$€ü€‰Q•áÐˆ€è€‰Ñ•áÐ½¡Ñµ°ˆ°‘½´¹¥¹¹•É!Q50¤ì(€€€•Ù•¹Ð¹‘…Ñ…QÉ…¹Í™•È¹•™™•Ñ±±½Ý•€ô€‰½Áå5½Ù”ˆì(€€€¥˜€ …‰É½­•¹±¥Á‰½…É‘A$¤(€€€€€•Ù•¹Ð¹‘…Ñ…QÉ…¹Í™•È¹Í•Ñ…Ñ„ ‰Ñ•áÐ½Á±…¥¸ˆ°Ñ•áÐÈ¤ì(€€€Ù¥•Ü¹‘É…¥¹œ€ô¹•ÜÉ…¥¹œ¡Í±¥”°‘É…5½Ù•Ì¡Ù¥•Ü°•Ù•¹Ð¤°¹½‘”¤ì(€ôì(€¡…¹‘±•ÉÌ¹‘É…•¹€ô€¡Ù¥•Ü¤€ôøì(€€€±•Ð‘É…¥¹œ€ôÙ¥•Ü¹‘É…¥¹œì(€€€Ý¥¹‘½Ü¹Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€¥˜€¡Ù¥•Ü¹‘É…¥¹œ€ôô‘É…¥¹œ¤(€€€€€€€Ù¥•Ü¹‘É…¥¹œ€ô¹Õ±°ì(€€€ô°€ÔÀ¤ì(€ôì(€•‘¥Ñ!…¹‘±•ÉÌ¹‘É…½Ù•È€ô•‘¥Ñ!…¹‘±•ÉÌ¹‘É…•¹Ñ•È€ô€¡|°”¤€ôø”¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€•‘¥Ñ!…¹‘±•ÉÌ¹‘É½À€ô€¡Ù¥•Ü°•Ù•¹Ð¤€ôøì(€€€ÑÉäì(€€€€€¡…¹‘±•É½À¡Ù¥•Ü°•Ù•¹Ð°Ù¥•Ü¹‘É…¥¹œ¤ì(€€€ô™¥¹…±±äì(€€€€€Ù¥•Ü¹‘É…¥¹œ€ô¹Õ±°ì(€€€ô(€ôì(€™Õ¹Ñ¥½¸¡…¹‘±•É½À¡Ù¥•Ü°•Ù•¹Ð°‘É…¥¹œ¤ì(€€€¥˜€ …•Ù•¹Ð¹‘…Ñ…QÉ…¹Í™•È¤(€€€€€É•ÑÕÉ¸ì(€€€±•Ð•Ù•¹ÑA½Ì€ôÙ¥•Ü¹Á½ÍÑ½½É‘Ì¡•Ù•¹Ñ½½É‘Ì¡•Ù•¹Ð¤¤ì(€€€¥˜€ …•Ù•¹ÑA½Ì¤(€€€€€É•ÑÕÉ¸ì(€€€±•Ð€‘µ½ÕÍ”€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡•Ù•¹ÑA½Ì¹Á½Ì¤ì(€€€±•ÐÍ±¥”€ô‘É…¥¹œ€˜˜‘É…¥¹œ¹Í±¥”ì(€€€¥˜€¡Í±¥”¤ì(€€€€€Ù¥•Ü¹Í½µ•AÉ½À ‰ÑÉ…¹Í™½ÉµA…ÍÑ•ˆ°€¡˜¤€ôøì(€€€€€€€Í±¥”€ô˜¡Í±¥”°Ù¥•Ü°™…±Í”¤ì(€€€€€ô¤ì(€€€ô•±Í”ì(€€€€€Í±¥”€ôÁ…ÉÍ•É½µ±¥Á‰½…É¡Ù¥•Ü°•ÑQ•áÐ¡•Ù•¹Ð¹‘…Ñ…QÉ…¹Í™•È¤°‰É½­•¹±¥Á‰½…É‘A$€ü¹Õ±°€è•Ù•¹Ð¹‘…Ñ…QÉ…¹Í™•È¹•Ñ…Ñ„ ‰Ñ•áÐ½¡Ñµ°ˆ¤°™…±Í”°€‘µ½ÕÍ”¤ì(€€€ô(€€€±•Ðµ½Ù”€ô€„„¡‘É…¥¹œ€˜˜‘É…5½Ù•Ì¡Ù¥•Ü°•Ù•¹Ð¤¤ì(€€€¥˜€¡Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•É½Àˆ°€¡˜¤€ôø˜¡Ù¥•Ü°•Ù•¹Ð°Í±¥”ñðM±¥”È¹•µÁÑä°µ½Ù”¤¤¤ì(€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€¥˜€ …Í±¥”¤(€€€€€É•ÑÕÉ¸ì(€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€±•Ð¥¹Í•ÉÑA½Ì€ôÍ±¥”€ü‘É½ÁA½¥¹Ð¡Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ°€‘µ½ÕÍ”¹Á½Ì°Í±¥”¤€è€‘µ½ÕÍ”¹Á½Ìì(€€€¥˜€¡¥¹Í•ÉÑA½Ì€ôô¹Õ±°¤(€€€€€¥¹Í•ÉÑA½Ì€ô€‘µ½ÕÍ”¹Á½Ìì(€€€±•ÐÑÈ€ôÙ¥•Ü¹ÍÑ…Ñ”¹ÑÈì(€€€¥˜€¡µ½Ù”¤ì(€€€€€±•Ðì¹½‘”ô€ô‘É…¥¹œì(€€€€€¥˜€¡¹½‘”¤(€€€€€€€¹½‘”¹É•Á±…”¡ÑÈ¤ì(€€€€€•±Í”(€€€€€€€ÑÈ¹‘•±•Ñ•M•±•Ñ¥½¸ ¤ì(€€€ô(€€€±•ÐÁ½Ì€ôÑÈ¹µ…ÁÁ¥¹œ¹µ…À¡¥¹Í•ÉÑA½Ì¤ì(€€€±•Ð¥Í9½‘”È€ôÍ±¥”¹½Á•¹MÑ…ÉÐ€ôô€À€˜˜Í±¥”¹½Á•¹¹€ôô€À€˜˜Í±¥”¹½¹Ñ•¹Ð¹¡¥±‘½Õ¹Ð€ôô€Äì(€€€±•Ð‰•™½É•%¹Í•ÉÐ€ôÑÈ¹‘½Œì(€€€¥˜€¡¥Í9½‘”È¤(€€€€€ÑÈ¹É•Á±…•I…¹•]¥Ñ ¡Á½Ì°Á½Ì°Í±¥”¹½¹Ñ•¹Ð¹™¥ÉÍÑ¡¥±¤ì(€€€•±Í”(€€€€€ÑÈ¹É•Á±…•I…¹”¡Á½Ì°Á½Ì°Í±¥”¤ì(€€€¥˜€¡ÑÈ¹‘½Œ¹•Ä¡‰•™½É•%¹Í•ÉÐ¤¤(€€€€€É•ÑÕÉ¸ì(€€€±•Ð€‘Á½Ì€ôÑÈ¹‘½Œ¹É•Í½±Ù”¡Á½Ì¤ì(€€€¥˜€¡¥Í9½‘”È€˜˜9½‘•M•±•Ñ¥½¸¹¥ÍM•±•Ñ…‰±”¡Í±¥”¹½¹Ñ•¹Ð¹™¥ÉÍÑ¡¥±¤€˜˜€‘Á½Ì¹¹½‘•™Ñ•È€˜˜€‘Á½Ì¹¹½‘•™Ñ•È¹Í…µ•5…É­ÕÀ¡Í±¥”¹½¹Ñ•¹Ð¹™¥ÉÍÑ¡¥±¤¤ì(€€€€€ÑÈ¹Í•ÑM•±•Ñ¥½¸¡¹•Ü9½‘•M•±•Ñ¥½¸ ‘Á½Ì¤¤ì(€€€ô•±Í”ì(€€€€€±•Ð•¹€ôÑÈ¹µ…ÁÁ¥¹œ¹µ…À¡¥¹Í•ÉÑA½Ì¤ì(€€€€€ÑÈ¹µ…ÁÁ¥¹œ¹µ…ÁÍmÑÈ¹µ…ÁÁ¥¹œ¹µ…ÁÌ¹±•¹Ñ €´€Åt¹™½É…  ¡}™É½´°}Ñ¼°}¹•ÝÉ½´°¹•ÝQ¼¤€ôø•¹€ô¹•ÝQ¼¤ì(€€€€€ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Í•±•Ñ¥½¹	•ÑÝ••¸¡Ù¥•Ü°€‘Á½Ì°ÑÈ¹‘½Œ¹É•Í½±Ù”¡•¹¤¤¤ì(€€€ô(€€€Ù¥•Ü¹™½ÕÌ ¤ì(€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡ÑÈ¹Í•Ñ5•Ñ„ ‰Õ¥Ù•¹Ðˆ°€‰‘É½Àˆ¤¤ì(€ô(€¡…¹‘±•ÉÌ¹™½ÕÌ€ô€¡Ù¥•Ü¤€ôøì(€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ½ÕÌ€ô…Ñ”¹¹½Ü ¤ì(€€€¥˜€ …Ù¥•Ü¹™½ÕÍ•¤ì(€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÑ½À ¤ì(€€€€€Ù¥•Ü¹‘½´¹±…ÍÍ1¥ÍÐ¹…‘ ‰AÉ½Í•5¥ÉÉ½Èµ™½ÕÍ•ˆ¤ì(€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÑ…ÉÐ ¤ì(€€€€€Ù¥•Ü¹™½ÕÍ•€ôÑÉÕ”ì(€€€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€€€¥˜€¡Ù¥•Ü¹‘½Y¥•Ü€˜˜Ù¥•Ü¹¡…Í½ÕÌ ¤€˜˜€…Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÕÉÉ•¹ÑM•±•Ñ¥½¸¹•Ä¡Ù¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤¤¤(€€€€€€€€€Í•±•Ñ¥½¹Q½=4¡Ù¥•Ü¤ì(€€€€€ô°€ÈÀ¤ì(€€€ô(€ôì(€¡…¹‘±•ÉÌ¹‰±ÕÈ€ô€¡Ù¥•Ü°}•Ù•¹Ð¤€ôøì(€€€±•Ð•Ù•¹Ð€ô}•Ù•¹Ðì(€€€¥˜€¡Ù¥•Ü¹™½ÕÍ•¤ì(€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÑ½À ¤ì(€€€€€Ù¥•Ü¹‘½´¹±…ÍÍ1¥ÍÐ¹É•µ½Ù” ‰AÉ½Í•5¥ÉÉ½Èµ™½ÕÍ•ˆ¤ì(€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÑ…ÉÐ ¤ì(€€€€€¥˜€¡•Ù•¹Ð¹É•±…Ñ•‘Q…É•Ð€˜˜Ù¥•Ü¹‘½´¹½¹Ñ…¥¹Ì¡•Ù•¹Ð¹É•±…Ñ•‘Q…É•Ð¤¤(€€€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÕÉÉ•¹ÑM•±•Ñ¥½¸¹±•…È ¤ì(€€€€€Ù¥•Ü¹™½ÕÍ•€ô™…±Í”ì(€€€ô(€ôì(€¡…¹‘±•ÉÌ¹‰•™½É•¥¹ÁÕÐ€ô€¡Ù¥•Ü°}•Ù•¹Ð¤€ôøì(€€€±•Ð•Ù•¹Ð€ô}•Ù•¹Ðì(€€€¥˜€¡…¹‘É½¥€˜˜•Ù•¹Ð¹¥¹ÁÕÑQåÁ”€ôô€‰‘•±•Ñ•½¹Ñ•¹Ñ	…­Ý…Éˆ¤ì(€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹™±ÕÍ¡M½½¸ ¤ì(€€€€€±•Ðì‘½µ¡…¹•½Õ¹Ðô€ôÙ¥•Ü¹¥¹ÁÕÐì(€€€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€€€¥˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹‘½µ¡…¹•½Õ¹Ð€„ô‘½µ¡…¹•½Õ¹Ð¤(€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€Ù¥•Ü¹‘½´¹‰±ÕÈ ¤ì(€€€€€€€Ù¥•Ü¹™½ÕÌ ¤ì(€€€€€€€¥˜€¡Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•-•å½Ý¸ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°­•åÙ•¹Ð à°€‰	…­ÍÁ…”ˆ¤¤¤¤(€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€±•Ðì€‘ÕÉÍ½Èô€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€€€€€¥˜€ ‘ÕÉÍ½È€˜˜€‘ÕÉÍ½È¹Á½Ì€ø€À¤(€€€€€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡Ù¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹‘•±•Ñ” ‘ÕÉÍ½È¹Á½Ì€´€Ä°€‘ÕÉÍ½È¹Á½Ì¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€ô°€ÔÀ¤ì(€€€ô(€ôì(€™½È€¡±•ÐÁÉ½À¥¸•‘¥Ñ!…¹‘±•ÉÌ¤(€€€¡…¹‘±•ÉÍmÁÉ½Át€ô•‘¥Ñ!…¹‘±•ÉÍmÁÉ½Átì(€™Õ¹Ñ¥½¸½µÁ…É•=‰©Ì¡„°ˆ¤ì(€€€¥˜€¡„€ôôˆ¤(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€™½È€¡±•ÐÀ¥¸„¤(€€€€€¥˜€¡…mÁt€„ôô‰mÁt¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€™½È€¡±•ÐÀ¥¸ˆ¤(€€€€€¥˜€ „¡À¥¸„¤¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ô(€Ù…È]¥‘•ÑQåÁ”€ô±…ÍÌ}]¥‘•ÑQåÁ”ì(€€€½¹ÍÑÉÕÑ½È¡Ñ½=4°ÍÁ•Œ¤ì(€€€€€Ñ¡¥Ì¹Ñ½=4€ôÑ½=4ì(€€€€€Ñ¡¥Ì¹ÍÁ•Œ€ôÍÁ•Œñð¹½MÁ•Œì(€€€€€Ñ¡¥Ì¹Í¥‘”€ôÑ¡¥Ì¹ÍÁ•Œ¹Í¥‘”ñð€Àì(€€€ô(€€€µ…À¡µ…ÁÁ¥¹œ°ÍÁ…¸°½™™Í•Ð°½±‘=™™Í•Ð¤ì(€€€€€±•ÐìÁ½Ì°‘•±•Ñ•ô€ôµ…ÁÁ¥¹œ¹µ…ÁI•ÍÕ±Ð¡ÍÁ…¸¹™É½´€¬½±‘=™™Í•Ð°Ñ¡¥Ì¹Í¥‘”€ð€À€ü€´Ä€è€Ä¤ì(€€€€€É•ÑÕÉ¸‘•±•Ñ•€ü¹Õ±°€è¹•Ü•½É…Ñ¥½¸¡Á½Ì€´½™™Í•Ð°Á½Ì€´½™™Í•Ð°Ñ¡¥Ì¤ì(€€€ô(€€€Ù…±¥ ¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€•Ä¡½Ñ¡•È¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì€ôô½Ñ¡•Èñð½Ñ¡•È¥¹ÍÑ…¹•½˜}]¥‘•ÑQåÁ”€˜˜€¡Ñ¡¥Ì¹ÍÁ•Œ¹­•ä€˜˜Ñ¡¥Ì¹ÍÁ•Œ¹­•ä€ôô½Ñ¡•È¹ÍÁ•Œ¹­•äñðÑ¡¥Ì¹Ñ½=4€ôô½Ñ¡•È¹Ñ½=4€˜˜½µÁ…É•=‰©Ì¡Ñ¡¥Ì¹ÍÁ•Œ°½Ñ¡•È¹ÍÁ•Œ¤¤ì(€€€ô(€€€‘•ÍÑÉ½ä¡¹½‘”¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹ÍÁ•Œ¹‘•ÍÑÉ½ä¤(€€€€€€€Ñ¡¥Ì¹ÍÁ•Œ¹‘•ÍÑÉ½ä¡¹½‘”¤ì(€€€ô(€ôì(€Ù…È%¹±¥¹•QåÁ”€ô±…ÍÌ}%¹±¥¹•QåÁ”ì(€€€½¹ÍÑÉÕÑ½È¡…ÑÑÉÌ°ÍÁ•Œ¤ì(€€€€€Ñ¡¥Ì¹…ÑÑÉÌ€ô…ÑÑÉÌì(€€€€€Ñ¡¥Ì¹ÍÁ•Œ€ôÍÁ•Œñð¹½MÁ•Œì(€€€ô(€€€µ…À¡µ…ÁÁ¥¹œ°ÍÁ…¸°½™™Í•Ð°½±‘=™™Í•Ð¤ì(€€€€€±•Ð™É½´È€ôµ…ÁÁ¥¹œ¹µ…À¡ÍÁ…¸¹™É½´€¬½±‘=™™Í•Ð°Ñ¡¥Ì¹ÍÁ•Œ¹¥¹±ÕÍ¥Ù•MÑ…ÉÐ€ü€´Ä€è€Ä¤€´½™™Í•Ðì(€€€€€±•ÐÑ¼€ôµ…ÁÁ¥¹œ¹µ…À¡ÍÁ…¸¹Ñ¼€¬½±‘=™™Í•Ð°Ñ¡¥Ì¹ÍÁ•Œ¹¥¹±ÕÍ¥Ù•¹€ü€Ä€è€´Ä¤€´½™™Í•Ðì(€€€€€É•ÑÕÉ¸™É½´È€øôÑ¼€ü¹Õ±°€è¹•Ü•½É…Ñ¥½¸¡™É½´È°Ñ¼°Ñ¡¥Ì¤ì(€€€ô(€€€Ù…±¥¡|°ÍÁ…¸¤ì(€€€€€É•ÑÕÉ¸ÍÁ…¸¹™É½´€ðÍÁ…¸¹Ñ¼ì(€€€ô(€€€•Ä¡½Ñ¡•È¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì€ôô½Ñ¡•Èñð½Ñ¡•È¥¹ÍÑ…¹•½˜}%¹±¥¹•QåÁ”€˜˜½µÁ…É•=‰©Ì¡Ñ¡¥Ì¹…ÑÑÉÌ°½Ñ¡•È¹…ÑÑÉÌ¤€˜˜½µÁ…É•=‰©Ì¡Ñ¡¥Ì¹ÍÁ•Œ°½Ñ¡•È¹ÍÁ•Œ¤ì(€€€ô(€€€ÍÑ…Ñ¥Œ¥Ì¡ÍÁ…¸¤ì(€€€€€É•ÑÕÉ¸ÍÁ…¸¹ÑåÁ”¥¹ÍÑ…¹•½˜}%¹±¥¹•QåÁ”ì(€€€ô(€€€‘•ÍÑÉ½ä ¤ì(€€€ô(€ôì(€Ù…È9½‘•QåÁ”È€ô±…ÍÌ}9½‘•QåÁ”ì(€€€½¹ÍÑÉÕÑ½È¡…ÑÑÉÌ°ÍÁ•Œ¤ì(€€€€€Ñ¡¥Ì¹…ÑÑÉÌ€ô…ÑÑÉÌì(€€€€€Ñ¡¥Ì¹ÍÁ•Œ€ôÍÁ•Œñð¹½MÁ•Œì(€€€ô(€€€µ…À¡µ…ÁÁ¥¹œ°ÍÁ…¸°½™™Í•Ð°½±‘=™™Í•Ð¤ì(€€€€€±•Ð™É½´È€ôµ…ÁÁ¥¹œ¹µ…ÁI•ÍÕ±Ð¡ÍÁ…¸¹™É½´€¬½±‘=™™Í•Ð°€Ä¤ì(€€€€€¥˜€¡™É½´È¹‘•±•Ñ•¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€±•ÐÑ¼€ôµ…ÁÁ¥¹œ¹µ…ÁI•ÍÕ±Ð¡ÍÁ…¸¹Ñ¼€¬½±‘=™™Í•Ð°€´Ä¤ì(€€€€€¥˜€¡Ñ¼¹‘•±•Ñ•ñðÑ¼¹Á½Ì€ðô™É½´È¹Á½Ì¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€É•ÑÕÉ¸¹•Ü•½É…Ñ¥½¸¡™É½´È¹Á½Ì€´½™™Í•Ð°Ñ¼¹Á½Ì€´½™™Í•Ð°Ñ¡¥Ì¤ì(€€€ô(€€€Ù…±¥¡¹½‘”°ÍÁ…¸¤ì(€€€€€±•Ðì¥¹‘•à°½™™Í•Ðô€ô¹½‘”¹½¹Ñ•¹Ð¹™¥¹‘%¹‘•à¡ÍÁ…¸¹™É½´¤°¡¥±ì(€€€€€É•ÑÕÉ¸½™™Í•Ð€ôôÍÁ…¸¹™É½´€˜˜€„¡¡¥±€ô¹½‘”¹¡¥±¡¥¹‘•à¤¤¹¥ÍQ•áÐ€˜˜½™™Í•Ð€¬¡¥±¹¹½‘•M¥é”€ôôÍÁ…¸¹Ñ¼ì(€€€ô(€€€•Ä¡½Ñ¡•È¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì€ôô½Ñ¡•Èñð½Ñ¡•È¥¹ÍÑ…¹•½˜}9½‘•QåÁ”€˜˜½µÁ…É•=‰©Ì¡Ñ¡¥Ì¹…ÑÑÉÌ°½Ñ¡•È¹…ÑÑÉÌ¤€˜˜½µÁ…É•=‰©Ì¡Ñ¡¥Ì¹ÍÁ•Œ°½Ñ¡•È¹ÍÁ•Œ¤ì(€€€ô(€€€‘•ÍÑÉ½ä ¤ì(€€€ô(€ôì(€Ù…È•½É…Ñ¥½¸€ô±…ÍÌ}•½É…Ñ¥½¸ì(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€½¹ÍÑÉÕÑ½È¡™É½´È°Ñ¼°ÑåÁ”¤ì(€€€€€Ñ¡¥Ì¹™É½´€ô™É½´Èì(€€€€€Ñ¡¥Ì¹Ñ¼€ôÑ¼ì(€€€€€Ñ¡¥Ì¹ÑåÁ”€ôÑåÁ”ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€½Áä¡™É½´È°Ñ¼¤ì(€€€€€É•ÑÕÉ¸¹•Ü}•½É…Ñ¥½¸¡™É½´È°Ñ¼°Ñ¡¥Ì¹ÑåÁ”¤ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€•Ä¡½Ñ¡•È°½™™Í•Ð€ô€À¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÑåÁ”¹•Ä¡½Ñ¡•È¹ÑåÁ”¤€˜˜Ñ¡¥Ì¹™É½´€¬½™™Í•Ð€ôô½Ñ¡•È¹™É½´€˜˜Ñ¡¥Ì¹Ñ¼€¬½™™Í•Ð€ôô½Ñ¡•È¹Ñ¼ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€µ…À¡µ…ÁÁ¥¹œ°½™™Í•Ð°½±‘=™™Í•Ð¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÑåÁ”¹µ…À¡µ…ÁÁ¥¹œ°Ñ¡¥Ì°½™™Í•Ð°½±‘=™™Í•Ð¤ì(€€€ô(€€€€¼¨¨(€€€É•…Ñ•Ì„Ý¥‘•Ð‘•½É…Ñ¥½¸°Ý¡¥ ¥Ì„=4¹½‘”Ñ¡…ÐÌÍ¡½Ý¸¥¸(€€€Ñ¡”‘½Õµ•¹Ð…ÐÑ¡”¥Ù•¸Á½Í¥Ñ¥½¸¸%Ð¥ÌÉ•½µµ•¹‘•Ñ¡…Ðå½Ô(€€€‘•±…äÉ•¹‘•É¥¹œÑ¡”Ý¥‘•Ð‰äÁ…ÍÍ¥¹œ„™Õ¹Ñ¥½¸Ñ¡…ÐÝ¥±°‰”(€€€…±±•Ý¡•¸Ñ¡”Ý¥‘•Ð¥Ì…ÑÕ…±±ä‘É…Ý¸¥¸„Ù¥•Ü°‰ÕÐå½Ô…¸(€€€…±Í¼‘¥É•Ñ±äÁ…ÍÌ„=4¹½‘”¸•ÑA½Í€…¸‰”ÕÍ•Ñ¼™¥¹Ñ¡”(€€€Ý¥‘•ÐÌÕÉÉ•¹Ð‘½Õµ•¹ÐÁ½Í¥Ñ¥½¸¸(€€€€¨¼(€€€ÍÑ…Ñ¥ŒÝ¥‘•Ð¡Á½Ì°Ñ½=4°ÍÁ•Œ¤ì(€€€€€É•ÑÕÉ¸¹•Ü}•½É…Ñ¥½¸¡Á½Ì°Á½Ì°¹•Ü]¥‘•ÑQåÁ”¡Ñ½=4°ÍÁ•Œ¤¤ì(€€€ô(€€€€¼¨¨(€€€É•…Ñ•Ì…¸¥¹±¥¹”‘•½É…Ñ¥½¸°Ý¡¥ …‘‘ÌÑ¡”¥Ù•¸…ÑÑÉ¥‰ÕÑ•ÌÑ¼(€€€•… ¥¹±¥¹”¹½‘”‰•ÑÝ••¸™É½µ€…¹Ñ½€¸(€€€€¨¼(€€€ÍÑ…Ñ¥Œ¥¹±¥¹”¡™É½´È°Ñ¼°…ÑÑÉÌ°ÍÁ•Œ¤ì(€€€€€É•ÑÕÉ¸¹•Ü}•½É…Ñ¥½¸¡™É½´È°Ñ¼°¹•Ü%¹±¥¹•QåÁ”¡…ÑÑÉÌ°ÍÁ•Œ¤¤ì(€€€ô(€€€€¼¨¨(€€€É•…Ñ•Ì„¹½‘”‘•½É…Ñ¥½¸¸™É½µ€…¹Ñ½€Í¡½Õ±Á½¥¹ÐÁÉ•¥Í•±ä(€€€‰•™½É”…¹…™Ñ•È„¹½‘”¥¸Ñ¡”‘½Õµ•¹Ð¸Q¡…Ð¹½‘”°…¹½¹±äÑ¡…Ð(€€€¹½‘”°Ý¥±°É••¥Ù”Ñ¡”¥Ù•¸…ÑÑÉ¥‰ÕÑ•Ì¸(€€€€¨¼(€€€ÍÑ…Ñ¥Œ¹½‘”¡™É½´È°Ñ¼°…ÑÑÉÌ°ÍÁ•Œ¤ì(€€€€€É•ÑÕÉ¸¹•Ü}•½É…Ñ¥½¸¡™É½´È°Ñ¼°¹•Ü9½‘•QåÁ”È¡…ÑÑÉÌ°ÍÁ•Œ¤¤ì(€€€ô(€€€€¼¨¨(€€€Q¡”ÍÁ•ŒÁÉ½Ù¥‘•Ý¡•¸É•…Ñ¥¹œÑ¡¥Ì‘•½É…Ñ¥½¸¸…¸‰”ÕÍ•™Õ°(€€€¥˜å½ÔÙ”ÍÑ½É••áÑÉ„¥¹™½Éµ…Ñ¥½¸¥¸Ñ¡…Ð½‰©•Ð¸(€€€€¨¼(€€€•ÐÍÁ•Œ ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÑåÁ”¹ÍÁ•Œì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€•Ð¥¹±¥¹” ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÑåÁ”¥¹ÍÑ…¹•½˜%¹±¥¹•QåÁ”ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€•ÐÝ¥‘•Ð ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÑåÁ”¥¹ÍÑ…¹•½˜]¥‘•ÑQåÁ”ì(€€€ô(€ôì(€Ù…È¹½¹”€ômtì(€Ù…È¹½MÁ•Œ€ôíôì(€Ù…È•½É…Ñ¥½¹M•Ð€ô±…ÍÌ}•½É…Ñ¥½¹M•Ðì(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€½¹ÍÑÉÕÑ½È¡±½…°°¡¥±‘É•¸¤ì(€€€€€Ñ¡¥Ì¹±½…°€ô±½…°¹±•¹Ñ €ü±½…°€è¹½¹”ì(€€€€€Ñ¡¥Ì¹¡¥±‘É•¸€ô¡¥±‘É•¸¹±•¹Ñ €ü¡¥±‘É•¸€è¹½¹”ì(€€€ô(€€€€¼¨¨(€€€É•…Ñ”„Í•Ð½˜‘•½É…Ñ¥½¹Ì°ÕÍ¥¹œÑ¡”ÍÑÉÕÑÕÉ”½˜Ñ¡”¥Ù•¸(€€€‘½Õµ•¹Ð¸Q¡¥ÌÝ¥±°½¹ÍÕµ”€¡µ½‘¥™ä¤Ñ¡”‘•½É…Ñ¥½¹Í€…ÉÉ…ä°Í¼(€€€å½ÔµÕÍÐµ…­”„½Áä¥˜å½ÔÝ…¹Ð¹••Ñ¼ÁÉ•Í•ÉÙ”Ñ¡…Ð¸(€€€€¨¼(€€€ÍÑ…Ñ¥ŒÉ•…Ñ”¡‘½ŒÔ°‘•½É…Ñ¥½¹Ì¤ì(€€€€€É•ÑÕÉ¸‘•½É…Ñ¥½¹Ì¹±•¹Ñ €ü‰Õ¥±‘QÉ•”¡‘•½É…Ñ¥½¹Ì°‘½ŒÔ°€À°¹½MÁ•Œ¤€è•µÁÑäì(€€€ô(€€€€¼¨¨(€€€¥¹…±°‘•½É…Ñ¥½¹Ì¥¸Ñ¡¥ÌÍ•ÐÝ¡¥ Ñ½Õ Ñ¡”¥Ù•¸É…¹”(€€€€¡¥¹±Õ‘¥¹œ‘•½É…Ñ¥½¹ÌÑ¡…ÐÍÑ…ÉÐ½È•¹‘¥É•Ñ±ä…ÐÑ¡”(€€€‰½Õ¹‘…É¥•Ì¤…¹µ…Ñ Ñ¡”¥Ù•¸ÁÉ•‘¥…Ñ”½¸Ñ¡•¥ÈÍÁ•Œ¸]¡•¸(€€€ÍÑ…ÉÑ€…¹•¹‘€…É”½µ¥ÑÑ•°…±°‘•½É…Ñ¥½¹Ì¥¸Ñ¡”Í•Ð…É”(€€€½¹Í¥‘•É•¸]¡•¸ÁÉ•‘¥…Ñ•€¥Í¸Ð¥Ù•¸°…±°‘•½É…Ñ¥½¹Ì…É”(€€€…ÍÍÕµ•Ñ¼µ…Ñ ¸(€€€€¨¼(€€€™¥¹¡ÍÑ…ÉÐ°•¹°ÁÉ•‘¥…Ñ”¤ì(€€€€€±•ÐÉ•ÍÕ±Ð€ômtì(€€€€€Ñ¡¥Ì¹™¥¹‘%¹¹•È¡ÍÑ…ÉÐ€ôô¹Õ±°€ü€À€èÍÑ…ÉÐ°•¹€ôô¹Õ±°€ü€Å”ä€è•¹°É•ÍÕ±Ð°€À°ÁÉ•‘¥…Ñ”¤ì(€€€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€€€ô(€€€™¥¹‘%¹¹•È¡ÍÑ…ÉÐ°•¹°É•ÍÕ±Ð°½™™Í•Ð°ÁÉ•‘¥…Ñ”¤ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹±½…°¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•ÐÍÁ…¸€ôÑ¡¥Ì¹±½…±m¥tì(€€€€€€€¥˜€¡ÍÁ…¸¹™É½´€ðô•¹€˜˜ÍÁ…¸¹Ñ¼€øôÍÑ…ÉÐ€˜˜€ …ÁÉ•‘¥…Ñ”ñðÁÉ•‘¥…Ñ”¡ÍÁ…¸¹ÍÁ•Œ¤¤¤(€€€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡ÍÁ…¸¹½Áä¡ÍÁ…¸¹™É½´€¬½™™Í•Ð°ÍÁ…¸¹Ñ¼€¬½™™Í•Ð¤¤ì(€€€€€ô(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ì¤€¬ô€Ì¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹¡¥±‘É•¹m¥t€ð•¹€˜˜Ñ¡¥Ì¹¡¥±‘É•¹m¤€¬€Åt€øÍÑ…ÉÐ¤ì(€€€€€€€€€±•Ð¡¥±‘=™˜€ôÑ¡¥Ì¹¡¥±‘É•¹m¥t€¬€Äì(€€€€€€€€€Ñ¡¥Ì¹¡¥±‘É•¹m¤€¬€Ét¹™¥¹‘%¹¹•È¡ÍÑ…ÉÐ€´¡¥±‘=™˜°•¹€´¡¥±‘=™˜°É•ÍÕ±Ð°½™™Í•Ð€¬¡¥±‘=™˜°ÁÉ•‘¥…Ñ”¤ì(€€€€€€€ô(€€€€€ô(€€€ô(€€€€¼¨¨(€€€5…ÀÑ¡”Í•Ð½˜‘•½É…Ñ¥½¹Ì¥¸É•ÍÁ½¹Í”Ñ¼„¡…¹”¥¸Ñ¡”(€€€‘½Õµ•¹Ð¸(€€€€¨¼(€€€µ…À¡µ…ÁÁ¥¹œ°‘½ŒÔ°½ÁÑ¥½¹Ì¤ì(€€€€€¥˜€¡Ñ¡¥Ì€ôô•µÁÑäñðµ…ÁÁ¥¹œ¹µ…ÁÌ¹±•¹Ñ €ôô€À¤(€€€€€€€É•ÑÕÉ¸Ñ¡¥Ìì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹µ…Á%¹¹•È¡µ…ÁÁ¥¹œ°‘½ŒÔ°€À°€À°½ÁÑ¥½¹Ìñð¹½MÁ•Œ¤ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€µ…Á%¹¹•È¡µ…ÁÁ¥¹œ°¹½‘”°½™™Í•Ð°½±‘=™™Í•Ð°½ÁÑ¥½¹Ì¤ì(€€€€€±•Ð¹•Ý1½…°ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹±½…°¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•Ðµ…ÁÁ•€ôÑ¡¥Ì¹±½…±m¥t¹µ…À¡µ…ÁÁ¥¹œ°½™™Í•Ð°½±‘=™™Í•Ð¤ì(€€€€€€€¥˜€¡µ…ÁÁ•€˜˜µ…ÁÁ•¹ÑåÁ”¹Ù…±¥¡¹½‘”°µ…ÁÁ•¤¤(€€€€€€€€€€¡¹•Ý1½…°ñð€¡¹•Ý1½…°€ômt¤¤¹ÁÕÍ ¡µ…ÁÁ•¤ì(€€€€€€€•±Í”¥˜€¡½ÁÑ¥½¹Ì¹½¹I•µ½Ù”¤(€€€€€€€€€½ÁÑ¥½¹Ì¹½¹I•µ½Ù”¡Ñ¡¥Ì¹±½…±m¥t¹ÍÁ•Œ¤ì(€€€€€ô(€€€€€¥˜€¡Ñ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ¤(€€€€€€€É•ÑÕÉ¸µ…Á¡¥±‘É•¸¡Ñ¡¥Ì¹¡¥±‘É•¸°¹•Ý1½…°ñðmt°µ…ÁÁ¥¹œ°¹½‘”°½™™Í•Ð°½±‘=™™Í•Ð°½ÁÑ¥½¹Ì¤ì(€€€€€•±Í”(€€€€€€€É•ÑÕÉ¸¹•Ý1½…°€ü¹•Ü}•½É…Ñ¥½¹M•Ð¡¹•Ý1½…°¹Í½ÉÐ¡‰åA½Ì¤°¹½¹”¤€è•µÁÑäì(€€€ô(€€€€¼¨¨(€€€‘Ñ¡”¥Ù•¸…ÉÉ…ä½˜‘•½É…Ñ¥½¹ÌÑ¼Ñ¡”½¹•Ì¥¸Ñ¡”Í•Ð°(€€€ÁÉ½‘Õ¥¹œ„¹•ÜÍ•Ð¸½¹ÍÕµ•ÌÑ¡”‘•½É…Ñ¥½¹Í€…ÉÉ…ä¸9••‘Ì(€€€…•ÍÌÑ¼Ñ¡”ÕÉÉ•¹Ð‘½Õµ•¹ÐÑ¼É•…Ñ”Ñ¡”…ÁÁÉ½ÁÉ¥…Ñ”ÑÉ•”(€€€ÍÑÉÕÑÕÉ”¸(€€€€¨¼(€€€…‘¡‘½ŒÔ°‘•½É…Ñ¥½¹Ì¤ì(€€€€€¥˜€ …‘•½É…Ñ¥½¹Ì¹±•¹Ñ ¤(€€€€€€€É•ÑÕÉ¸Ñ¡¥Ìì(€€€€€¥˜€¡Ñ¡¥Ì€ôô•µÁÑä¤(€€€€€€€É•ÑÕÉ¸}•½É…Ñ¥½¹M•Ð¹É•…Ñ”¡‘½ŒÔ°‘•½É…Ñ¥½¹Ì¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹…‘‘%¹¹•È¡‘½ŒÔ°‘•½É…Ñ¥½¹Ì°€À¤ì(€€€ô(€€€…‘‘%¹¹•È¡‘½ŒÔ°‘•½É…Ñ¥½¹Ì°½™™Í•Ð¤ì(€€€€€±•Ð¡¥±‘É•¸°¡¥±‘%¹‘•à€ô€Àì(€€€€€‘½ŒÔ¹™½É…  ¡¡¥±‘9½‘”°¡¥±‘=™™Í•Ð¤€ôøì(€€€€€€€±•Ð‰…Í•=™™Í•Ð€ô¡¥±‘=™™Í•Ð€¬½™™Í•Ð°™½Õ¹Ìì(€€€€€€€¥˜€ „¡™½Õ¹Ì€ôÑ…­•MÁ…¹Í½É9½‘”¡‘•½É…Ñ¥½¹Ì°¡¥±‘9½‘”°‰…Í•=™™Í•Ð¤¤¤(€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€¥˜€ …¡¥±‘É•¸¤(€€€€€€€€€¡¥±‘É•¸€ôÑ¡¥Ì¹¡¥±‘É•¸¹Í±¥” ¤ì(€€€€€€€Ý¡¥±”€¡¡¥±‘%¹‘•à€ð¡¥±‘É•¸¹±•¹Ñ €˜˜¡¥±‘É•¹m¡¥±‘%¹‘•át€ð¡¥±‘=™™Í•Ð¤(€€€€€€€€€¡¥±‘%¹‘•à€¬ô€Ìì(€€€€€€€¥˜€¡¡¥±‘É•¹m¡¥±‘%¹‘•át€ôô¡¥±‘=™™Í•Ð¤(€€€€€€€€€¡¥±‘É•¹m¡¥±‘%¹‘•à€¬€Ét€ô¡¥±‘É•¹m¡¥±‘%¹‘•à€¬€Ét¹…‘‘%¹¹•È¡¡¥±‘9½‘”°™½Õ¹Ì°‰…Í•=™™Í•Ð€¬€Ä¤ì(€€€€€€€•±Í”(€€€€€€€€€¡¥±‘É•¸¹ÍÁ±¥”¡¡¥±‘%¹‘•à°€À°¡¥±‘=™™Í•Ð°¡¥±‘=™™Í•Ð€¬¡¥±‘9½‘”¹¹½‘•M¥é”°‰Õ¥±‘QÉ•”¡™½Õ¹Ì°¡¥±‘9½‘”°‰…Í•=™™Í•Ð€¬€Ä°¹½MÁ•Œ¤¤ì(€€€€€€€¡¥±‘%¹‘•à€¬ô€Ìì(€€€€€ô¤ì(€€€€€±•Ð±½…°€ôµ½Ù•MÁ…¹Ì¡¡¥±‘%¹‘•à€üÝ¥Ñ¡½ÕÑ9Õ±±Ì¡‘•½É…Ñ¥½¹Ì¤€è‘•½É…Ñ¥½¹Ì°€µ½™™Í•Ð¤ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð±½…°¹±•¹Ñ ì¤¬¬¤(€€€€€€€¥˜€ …±½…±m¥t¹ÑåÁ”¹Ù…±¥¡‘½ŒÔ°±½…±m¥t¤¤(€€€€€€€€€±½…°¹ÍÁ±¥”¡¤´´°€Ä¤ì(€€€€€É•ÑÕÉ¸¹•Ü}•½É…Ñ¥½¹M•Ð¡±½…°¹±•¹Ñ €üÑ¡¥Ì¹±½…°¹½¹…Ð¡±½…°¤¹Í½ÉÐ¡‰åA½Ì¤€èÑ¡¥Ì¹±½…°°¡¥±‘É•¸ñðÑ¡¥Ì¹¡¥±‘É•¸¤ì(€€€ô(€€€€¼¨¨(€€€É•…Ñ”„¹•ÜÍ•ÐÑ¡…Ð½¹Ñ…¥¹ÌÑ¡”‘•½É…Ñ¥½¹Ì¥¸Ñ¡¥ÌÍ•Ð°µ¥¹ÕÌ(€€€Ñ¡”½¹•Ì¥¸Ñ¡”¥Ù•¸…ÉÉ…ä¸(€€€€¨¼(€€€É•µ½Ù”¡‘•½É…Ñ¥½¹Ì¤ì(€€€€€¥˜€¡‘•½É…Ñ¥½¹Ì¹±•¹Ñ €ôô€ÀñðÑ¡¥Ì€ôô•µÁÑä¤(€€€€€€€É•ÑÕÉ¸Ñ¡¥Ìì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹É•µ½Ù•%¹¹•È¡‘•½É…Ñ¥½¹Ì°€À¤ì(€€€ô(€€€É•µ½Ù•%¹¹•È¡‘•½É…Ñ¥½¹Ì°½™™Í•Ð¤ì(€€€€€±•Ð¡¥±‘É•¸€ôÑ¡¥Ì¹¡¥±‘É•¸°±½…°€ôÑ¡¥Ì¹±½…°ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð¡¥±‘É•¸¹±•¹Ñ ì¤€¬ô€Ì¤ì(€€€€€€€±•Ð™½Õ¹Ìì(€€€€€€€±•Ð™É½´È€ô¡¥±‘É•¹m¥t€¬½™™Í•Ð°Ñ¼€ô¡¥±‘É•¹m¤€¬€Åt€¬½™™Í•Ðì(€€€€€€€™½È€¡±•Ð¨€ô€À°ÍÁ…¸ì¨€ð‘•½É…Ñ¥½¹Ì¹±•¹Ñ ì¨¬¬¤(€€€€€€€€€¥˜€¡ÍÁ…¸€ô‘•½É…Ñ¥½¹Ím©t¤ì(€€€€€€€€€€€¥˜€¡ÍÁ…¸¹™É½´€ø™É½´È€˜˜ÍÁ…¸¹Ñ¼€ðÑ¼¤ì(€€€€€€€€€€€€€‘•½É…Ñ¥½¹Ím©t€ô¹Õ±°ì(€€€€€€€€€€€€€€¡™½Õ¹Ìñð€¡™½Õ¹Ì€ômt¤¤¹ÁÕÍ ¡ÍÁ…¸¤ì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€¥˜€ …™½Õ¹Ì¤(€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€¥˜€¡¡¥±‘É•¸€ôôÑ¡¥Ì¹¡¥±‘É•¸¤(€€€€€€€€€¡¥±‘É•¸€ôÑ¡¥Ì¹¡¥±‘É•¸¹Í±¥” ¤ì(€€€€€€€±•ÐÉ•µ½Ù•€ô¡¥±‘É•¹m¤€¬€Ét¹É•µ½Ù•%¹¹•È¡™½Õ¹Ì°™É½´È€¬€Ä¤ì(€€€€€€€¥˜€¡É•µ½Ù•€„ô•µÁÑä¤ì(€€€€€€€€€¡¥±‘É•¹m¤€¬€Ét€ôÉ•µ½Ù•ì(€€€€€€€ô•±Í”ì(€€€€€€€€€¡¥±‘É•¸¹ÍÁ±¥”¡¤°€Ì¤ì(€€€€€€€€€¤€´ô€Ìì(€€€€€€€ô(€€€€€ô(€€€€€¥˜€¡±½…°¹±•¹Ñ ¤ì(€€€€€€€™½È€¡±•Ð¤€ô€À°ÍÁ…¸ì¤€ð‘•½É…Ñ¥½¹Ì¹±•¹Ñ ì¤¬¬¤(€€€€€€€€€¥˜€¡ÍÁ…¸€ô‘•½É…Ñ¥½¹Ím¥t¤ì(€€€€€€€€€€€™½È€¡±•Ð¨€ô€Àì¨€ð±½…°¹±•¹Ñ ì¨¬¬¤(€€€€€€€€€€€€€¥˜€¡±½…±m©t¹•Ä¡ÍÁ…¸°½™™Í•Ð¤¤ì(€€€€€€€€€€€€€€€¥˜€¡±½…°€ôôÑ¡¥Ì¹±½…°¤(€€€€€€€€€€€€€€€€€±½…°€ôÑ¡¥Ì¹±½…°¹Í±¥” ¤ì(€€€€€€€€€€€€€€€±½…°¹ÍÁ±¥”¡¨´´°€Ä¤ì(€€€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€ô(€€€€€¥˜€¡¡¥±‘É•¸€ôôÑ¡¥Ì¹¡¥±‘É•¸€˜˜±½…°€ôôÑ¡¥Ì¹±½…°¤(€€€€€€€É•ÑÕÉ¸Ñ¡¥Ìì(€€€€€É•ÑÕÉ¸±½…°¹±•¹Ñ ñð¡¥±‘É•¸¹±•¹Ñ €ü¹•Ü}•½É…Ñ¥½¹M•Ð¡±½…°°¡¥±‘É•¸¤€è•µÁÑäì(€€€ô(€€€™½É¡¥±¡½™™Í•Ð°¹½‘”¤ì(€€€€€¥˜€¡Ñ¡¥Ì€ôô•µÁÑä¤(€€€€€€€É•ÑÕÉ¸Ñ¡¥Ìì(€€€€€¥˜€¡¹½‘”¹¥Í1•…˜¤(€€€€€€€É•ÑÕÉ¸}•½É…Ñ¥½¹M•Ð¹•µÁÑäì(€€€€€±•Ð¡¥±°±½…°ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ì¤€¬ô€Ì¤(€€€€€€€¥˜€¡Ñ¡¥Ì¹¡¥±‘É•¹m¥t€øô½™™Í•Ð¤ì(€€€€€€€€€¥˜€¡Ñ¡¥Ì¹¡¥±‘É•¹m¥t€ôô½™™Í•Ð¤(€€€€€€€€€€€¡¥±€ôÑ¡¥Ì¹¡¥±‘É•¹m¤€¬€Étì(€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€±•ÐÍÑ…ÉÐ€ô½™™Í•Ð€¬€Ä°•¹€ôÍÑ…ÉÐ€¬¹½‘”¹½¹Ñ•¹Ð¹Í¥é”ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹±½…°¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•Ð‘•Œ€ôÑ¡¥Ì¹±½…±m¥tì(€€€€€€€¥˜€¡‘•Œ¹™É½´€ð•¹€˜˜‘•Œ¹Ñ¼€øÍÑ…ÉÐ€˜˜‘•Œ¹ÑåÁ”¥¹ÍÑ…¹•½˜%¹±¥¹•QåÁ”¤ì(€€€€€€€€€±•Ð™É½´È€ô5…Ñ ¹µ…à¡ÍÑ…ÉÐ°‘•Œ¹™É½´¤€´ÍÑ…ÉÐ°Ñ¼€ô5…Ñ ¹µ¥¸¡•¹°‘•Œ¹Ñ¼¤€´ÍÑ…ÉÐì(€€€€€€€€€¥˜€¡™É½´È€ðÑ¼¤(€€€€€€€€€€€€¡±½…°ñð€¡±½…°€ômt¤¤¹ÁÕÍ ¡‘•Œ¹½Áä¡™É½´È°Ñ¼¤¤ì(€€€€€€€ô(€€€€€ô(€€€€€¥˜€¡±½…°¤ì(€€€€€€€±•Ð±½…±M•Ð€ô¹•Ü}•½É…Ñ¥½¹M•Ð¡±½…°¹Í½ÉÐ¡‰åA½Ì¤°¹½¹”¤ì(€€€€€€€É•ÑÕÉ¸¡¥±€ü¹•Ü•½É…Ñ¥½¹É½ÕÀ¡m±½…±M•Ð°¡¥±‘t¤€è±½…±M•Ðì(€€€€€ô(€€€€€É•ÑÕÉ¸¡¥±ñð•µÁÑäì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€•Ä¡½Ñ¡•È¤ì(€€€€€¥˜€¡Ñ¡¥Ì€ôô½Ñ¡•È¤(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€¥˜€ „¡½Ñ¡•È¥¹ÍÑ…¹•½˜}•½É…Ñ¥½¹M•Ð¤ñðÑ¡¥Ì¹±½…°¹±•¹Ñ €„ô½Ñ¡•È¹±½…°¹±•¹Ñ ñðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ €„ô½Ñ¡•È¹¡¥±‘É•¸¹±•¹Ñ ¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹±½…°¹±•¹Ñ ì¤¬¬¤(€€€€€€€¥˜€ …Ñ¡¥Ì¹±½…±m¥t¹•Ä¡½Ñ¡•È¹±½…±m¥t¤¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹¡¥±‘É•¸¹±•¹Ñ ì¤€¬ô€Ì¤(€€€€€€€¥˜€¡Ñ¡¥Ì¹¡¥±‘É•¹m¥t€„ô½Ñ¡•È¹¡¥±‘É•¹m¥tñðÑ¡¥Ì¹¡¥±‘É•¹m¤€¬€Åt€„ô½Ñ¡•È¹¡¥±‘É•¹m¤€¬€Åtñð€…Ñ¡¥Ì¹¡¥±‘É•¹m¤€¬€Ét¹•Ä¡½Ñ¡•È¹¡¥±‘É•¹m¤€¬€Ét¤¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€±½…±Ì¡¹½‘”¤ì(€€€€€É•ÑÕÉ¸É•µ½Ù•=Ù•É±…À¡Ñ¡¥Ì¹±½…±Í%¹¹•È¡¹½‘”¤¤ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€±½…±Í%¹¹•È¡¹½‘”¤ì(€€€€€¥˜€¡Ñ¡¥Ì€ôô•µÁÑä¤(€€€€€€€É•ÑÕÉ¸¹½¹”ì(€€€€€¥˜€¡¹½‘”¹¥¹±¥¹•½¹Ñ•¹Ðñð€…Ñ¡¥Ì¹±½…°¹Í½µ”¡%¹±¥¹•QåÁ”¹¥Ì¤¤(€€€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹±½…°ì(€€€€€±•ÐÉ•ÍÕ±Ð€ômtì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹±½…°¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€¥˜€ „¡Ñ¡¥Ì¹±½…±m¥t¹ÑåÁ”¥¹ÍÑ…¹•½˜%¹±¥¹•QåÁ”¤¤(€€€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡Ñ¡¥Ì¹±½…±m¥t¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€€€ô(€€€™½É…¡M•Ð¡˜¤ì(€€€€€˜¡Ñ¡¥Ì¤ì(€€€ô(€ôì(€•½É…Ñ¥½¹M•Ð¹•µÁÑä€ô¹•Ü•½É…Ñ¥½¹M•Ð¡mt°mt¤ì(€•½É…Ñ¥½¹M•Ð¹É•µ½Ù•=Ù•É±…À€ôÉ•µ½Ù•=Ù•É±…Àì(€Ù…È•µÁÑä€ô•½É…Ñ¥½¹M•Ð¹•µÁÑäì(€Ù…È•½É…Ñ¥½¹É½ÕÀ€ô±…ÍÌ}•½É…Ñ¥½¹É½ÕÀì(€€€½¹ÍÑÉÕÑ½È¡µ•µ‰•ÉÌ¤ì(€€€€€Ñ¡¥Ì¹µ•µ‰•ÉÌ€ôµ•µ‰•ÉÌì(€€€ô(€€€µ…À¡µ…ÁÁ¥¹œ°‘½ŒÔ¤ì(€€€€€½¹ÍÐµ…ÁÁ•‘•½Ì€ôÑ¡¥Ì¹µ•µ‰•ÉÌ¹µ…À ¡µ•µ‰•È¤€ôøµ•µ‰•È¹µ…À¡µ…ÁÁ¥¹œ°‘½ŒÔ°¹½MÁ•Œ¤¤ì(€€€€€É•ÑÕÉ¸}•½É…Ñ¥½¹É½ÕÀ¹™É½´¡µ…ÁÁ•‘•½Ì¤ì(€€€ô(€€€™½É¡¥±¡½™™Í•Ð°¡¥±¤ì(€€€€€¥˜€¡¡¥±¹¥Í1•…˜¤(€€€€€€€É•ÑÕÉ¸•½É…Ñ¥½¹M•Ð¹•µÁÑäì(€€€€€±•Ð™½Õ¹Ì€ômtì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹µ•µ‰•ÉÌ¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•ÐÉ•ÍÕ±Ð€ôÑ¡¥Ì¹µ•µ‰•ÉÍm¥t¹™½É¡¥±¡½™™Í•Ð°¡¥±¤ì(€€€€€€€¥˜€¡É•ÍÕ±Ð€ôô•µÁÑä¤(€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€¥˜€¡É•ÍÕ±Ð¥¹ÍÑ…¹•½˜}•½É…Ñ¥½¹É½ÕÀ¤(€€€€€€€€€™½Õ¹Ì€ô™½Õ¹Ì¹½¹…Ð¡É•ÍÕ±Ð¹µ•µ‰•ÉÌ¤ì(€€€€€€€•±Í”(€€€€€€€€€™½Õ¹Ì¹ÁÕÍ ¡É•ÍÕ±Ð¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸}•½É…Ñ¥½¹É½ÕÀ¹™É½´¡™½Õ¹Ì¤ì(€€€ô(€€€•Ä¡½Ñ¡•È¤ì(€€€€€¥˜€ „¡½Ñ¡•È¥¹ÍÑ…¹•½˜}•½É…Ñ¥½¹É½ÕÀ¤ñð½Ñ¡•È¹µ•µ‰•ÉÌ¹±•¹Ñ €„ôÑ¡¥Ì¹µ•µ‰•ÉÌ¹±•¹Ñ ¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹µ•µ‰•ÉÌ¹±•¹Ñ ì¤¬¬¤(€€€€€€€¥˜€ …Ñ¡¥Ì¹µ•µ‰•ÉÍm¥t¹•Ä¡½Ñ¡•È¹µ•µ‰•ÉÍm¥t¤¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€±½…±Ì¡¹½‘”¤ì(€€€€€±•ÐÉ•ÍÕ±Ð°Í½ÉÑ•€ôÑÉÕ”ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹µ•µ‰•ÉÌ¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•Ð±½…±Ì€ôÑ¡¥Ì¹µ•µ‰•ÉÍm¥t¹±½…±Í%¹¹•È¡¹½‘”¤ì(€€€€€€€¥˜€ …±½…±Ì¹±•¹Ñ ¤(€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€¥˜€ …É•ÍÕ±Ð¤ì(€€€€€€€€€É•ÍÕ±Ð€ô±½…±Ìì(€€€€€€€ô•±Í”ì(€€€€€€€€€¥˜€¡Í½ÉÑ•¤ì(€€€€€€€€€€€É•ÍÕ±Ð€ôÉ•ÍÕ±Ð¹Í±¥” ¤ì(€€€€€€€€€€€Í½ÉÑ•€ô™…±Í”ì(€€€€€€€€€ô(€€€€€€€€€™½È€¡±•Ð¨€ô€Àì¨€ð±½…±Ì¹±•¹Ñ ì¨¬¬¤(€€€€€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡±½…±Ím©t¤ì(€€€€€€€ô(€€€€€ô(€€€€€É•ÑÕÉ¸É•ÍÕ±Ð€üÉ•µ½Ù•=Ù•É±…À¡Í½ÉÑ•€üÉ•ÍÕ±Ð€èÉ•ÍÕ±Ð¹Í½ÉÐ¡‰åA½Ì¤¤€è¹½¹”ì(€€€ô(€€€€¼¼É•…Ñ”„É½ÕÀ™½ÈÑ¡”¥Ù•¸…ÉÉ…ä½˜‘•½É…Ñ¥½¸Í•ÑÌ°½ÈÉ•ÑÕÉ¸(€€€€¼¼„Í¥¹±”Í•ÐÝ¡•¸Á½ÍÍ¥‰±”¸(€€€ÍÑ…Ñ¥Œ™É½´¡µ•µ‰•ÉÌ¤ì(€€€€€ÍÝ¥Ñ €¡µ•µ‰•ÉÌ¹±•¹Ñ ¤ì(€€€€€€€…Í”€Àè(€€€€€€€€€É•ÑÕÉ¸•µÁÑäì(€€€€€€€…Í”€Äè(€€€€€€€€€É•ÑÕÉ¸µ•µ‰•ÉÍlÁtì(€€€€€€€‘•™…Õ±Ðè(€€€€€€€€€É•ÑÕÉ¸¹•Ü}•½É…Ñ¥½¹É½ÕÀ¡µ•µ‰•ÉÌ¹•Ù•Éä ¡´¤€ôø´¥¹ÍÑ…¹•½˜•½É…Ñ¥½¹M•Ð¤€üµ•µ‰•ÉÌ€èµ•µ‰•ÉÌ¹É•‘Õ” ¡È°´¤€ôøÈ¹½¹…Ð¡´¥¹ÍÑ…¹•½˜•½É…Ñ¥½¹M•Ð€ü´€è´¹µ•µ‰•ÉÌ¤°mt¤¤ì(€€€€€ô(€€€ô(€€€™½É…¡M•Ð¡˜¤ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹µ•µ‰•ÉÌ¹±•¹Ñ ì¤¬¬¤(€€€€€€€Ñ¡¥Ì¹µ•µ‰•ÉÍm¥t¹™½É…¡M•Ð¡˜¤ì(€€€ô(€ôì(€™Õ¹Ñ¥½¸µ…Á¡¥±‘É•¸¡½±‘¡¥±‘É•¸°¹•Ý1½…°°µ…ÁÁ¥¹œ°¹½‘”°½™™Í•Ð°½±‘=™™Í•Ð°½ÁÑ¥½¹Ì¤ì(€€€±•Ð¡¥±‘É•¸€ô½±‘¡¥±‘É•¸¹Í±¥” ¤ì(€€€™½È€¡±•Ð¤€ô€À°‰…Í•=™™Í•Ð€ô½±‘=™™Í•Ðì¤€ðµ…ÁÁ¥¹œ¹µ…ÁÌ¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•Ðµ½Ù•€ô€Àì(€€€€€µ…ÁÁ¥¹œ¹µ…ÁÍm¥t¹™½É…  ¡½±‘MÑ…ÉÐ°½±‘¹°¹•ÝMÑ…ÉÐ°¹•Ý¹¤€ôøì(€€€€€€€±•Ð‘M¥é”€ô¹•Ý¹€´¹•ÝMÑ…ÉÐ€´€¡½±‘¹€´½±‘MÑ…ÉÐ¤ì(€€€€€€€™½È€¡±•Ð¤È€ô€Àì¤È€ð¡¥±‘É•¸¹±•¹Ñ ì¤È€¬ô€Ì¤ì(€€€€€€€€€±•Ð•¹€ô¡¥±‘É•¹m¤È€¬€Åtì(€€€€€€€€€¥˜€¡•¹€ð€Àñð½±‘MÑ…ÉÐ€ø•¹€¬‰…Í•=™™Í•Ð€´µ½Ù•¤(€€€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€€€±•ÐÍÑ…ÉÐ€ô¡¥±‘É•¹m¤Ét€¬‰…Í•=™™Í•Ð€´µ½Ù•ì(€€€€€€€€€¥˜€¡½±‘¹€øôÍÑ…ÉÐ¤ì(€€€€€€€€€€€¡¥±‘É•¹m¤È€¬€Åt€ô½±‘MÑ…ÉÐ€ðôÍÑ…ÉÐ€ü€´È€è€´Äì(€€€€€€€€€ô•±Í”¥˜€¡½±‘MÑ…ÉÐ€øô‰…Í•=™™Í•Ð€˜˜‘M¥é”¤ì(€€€€€€€€€€€¡¥±‘É•¹m¤Ét€¬ô‘M¥é”ì(€€€€€€€€€€€¡¥±‘É•¹m¤È€¬€Åt€¬ô‘M¥é”ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€µ½Ù•€¬ô‘M¥é”ì(€€€€€ô¤ì(€€€€€‰…Í•=™™Í•Ð€ôµ…ÁÁ¥¹œ¹µ…ÁÍm¥t¹µ…À¡‰…Í•=™™Í•Ð°€´Ä¤ì(€€€ô(€€€±•ÐµÕÍÑI•‰Õ¥±€ô™…±Í”ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ð¡¥±‘É•¸¹±•¹Ñ ì¤€¬ô€Ì¤(€€€€€¥˜€¡¡¥±‘É•¹m¤€¬€Åt€ð€À¤ì(€€€€€€€¥˜€¡¡¥±‘É•¹m¤€¬€Åt€ôô€´È¤ì(€€€€€€€€€µÕÍÑI•‰Õ¥±€ôÑÉÕ”ì(€€€€€€€€€¡¥±‘É•¹m¤€¬€Åt€ô€´Äì(€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€ô(€€€€€€€±•Ð™É½´È€ôµ…ÁÁ¥¹œ¹µ…À¡½±‘¡¥±‘É•¹m¥t€¬½±‘=™™Í•Ð¤°™É½µ1½…°€ô™É½´È€´½™™Í•Ðì(€€€€€€€¥˜€¡™É½µ1½…°€ð€Àñð™É½µ1½…°€øô¹½‘”¹½¹Ñ•¹Ð¹Í¥é”¤ì(€€€€€€€€€µÕÍÑI•‰Õ¥±€ôÑÉÕ”ì(€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€ô(€€€€€€€±•ÐÑ¼€ôµ…ÁÁ¥¹œ¹µ…À¡½±‘¡¥±‘É•¹m¤€¬€Åt€¬½±‘=™™Í•Ð°€´Ä¤°Ñ½1½…°€ôÑ¼€´½™™Í•Ðì(€€€€€€€±•Ðì¥¹‘•à°½™™Í•Ðè¡¥±‘=™™Í•Ðô€ô¹½‘”¹½¹Ñ•¹Ð¹™¥¹‘%¹‘•à¡™É½µ1½…°¤ì(€€€€€€€±•Ð¡¥±‘9½‘”€ô¹½‘”¹µ…å‰•¡¥±¡¥¹‘•à¤ì(€€€€€€€¥˜€¡¡¥±‘9½‘”€˜˜¡¥±‘=™™Í•Ð€ôô™É½µ1½…°€˜˜¡¥±‘=™™Í•Ð€¬¡¥±‘9½‘”¹¹½‘•M¥é”€ôôÑ½1½…°¤ì(€€€€€€€€€±•Ðµ…ÁÁ•€ô¡¥±‘É•¹m¤€¬€Ét¹µ…Á%¹¹•È¡µ…ÁÁ¥¹œ°¡¥±‘9½‘”°™É½´È€¬€Ä°½±‘¡¥±‘É•¹m¥t€¬½±‘=™™Í•Ð€¬€Ä°½ÁÑ¥½¹Ì¤ì(€€€€€€€€€¥˜€¡µ…ÁÁ•€„ô•µÁÑä¤ì(€€€€€€€€€€€¡¥±‘É•¹m¥t€ô™É½µ1½…°ì(€€€€€€€€€€€¡¥±‘É•¹m¤€¬€Åt€ôÑ½1½…°ì(€€€€€€€€€€€¡¥±‘É•¹m¤€¬€Ét€ôµ…ÁÁ•ì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€¡¥±‘É•¹m¤€¬€Åt€ô€´Èì(€€€€€€€€€€€µÕÍÑI•‰Õ¥±€ôÑÉÕ”ì(€€€€€€€€€ô(€€€€€€€ô•±Í”ì(€€€€€€€€€µÕÍÑI•‰Õ¥±€ôÑÉÕ”ì(€€€€€€€ô(€€€€€ô(€€€¥˜€¡µÕÍÑI•‰Õ¥±¤ì(€€€€€±•Ð‘•½É…Ñ¥½¹Ì€ôµ…Á¹‘…Ñ¡•ÉI•µ…¥¹¥¹•½É…Ñ¥½¹Ì¡¡¥±‘É•¸°½±‘¡¥±‘É•¸°¹•Ý1½…°°µ…ÁÁ¥¹œ°½™™Í•Ð°½±‘=™™Í•Ð°½ÁÑ¥½¹Ì¤ì(€€€€€±•Ð‰Õ¥±Ð€ô‰Õ¥±‘QÉ•”¡‘•½É…Ñ¥½¹Ì°¹½‘”°€À°½ÁÑ¥½¹Ì¤ì(€€€€€¹•Ý1½…°€ô‰Õ¥±Ð¹±½…°ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð¡¥±‘É•¸¹±•¹Ñ ì¤€¬ô€Ì¤(€€€€€€€¥˜€¡¡¥±‘É•¹m¤€¬€Åt€ð€À¤ì(€€€€€€€€€¡¥±‘É•¸¹ÍÁ±¥”¡¤°€Ì¤ì(€€€€€€€€€¤€´ô€Ìì(€€€€€€€ô(€€€€€™½È€¡±•Ð¤€ô€À°¨€ô€Àì¤€ð‰Õ¥±Ð¹¡¥±‘É•¸¹±•¹Ñ ì¤€¬ô€Ì¤ì(€€€€€€€±•Ð™É½´È€ô‰Õ¥±Ð¹¡¥±‘É•¹m¥tì(€€€€€€€Ý¡¥±”€¡¨€ð¡¥±‘É•¸¹±•¹Ñ €˜˜¡¥±‘É•¹m©t€ð™É½´È¤(€€€€€€€€€¨€¬ô€Ìì(€€€€€€€¡¥±‘É•¸¹ÍÁ±¥”¡¨°€À°‰Õ¥±Ð¹¡¥±‘É•¹m¥t°‰Õ¥±Ð¹¡¥±‘É•¹m¤€¬€Åt°‰Õ¥±Ð¹¡¥±‘É•¹m¤€¬€Ét¤ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸¹•Ü•½É…Ñ¥½¹M•Ð¡¹•Ý1½…°¹Í½ÉÐ¡‰åA½Ì¤°¡¥±‘É•¸¤ì(€ô(€™Õ¹Ñ¥½¸µ½Ù•MÁ…¹Ì¡ÍÁ…¹Ì°½™™Í•Ð¤ì(€€€¥˜€ …½™™Í•Ðñð€…ÍÁ…¹Ì¹±•¹Ñ ¤(€€€€€É•ÑÕÉ¸ÍÁ…¹Ìì(€€€±•ÐÉ•ÍÕ±Ð€ômtì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðÍÁ…¹Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•ÐÍÁ…¸€ôÍÁ…¹Ím¥tì(€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡¹•Ü•½É…Ñ¥½¸¡ÍÁ…¸¹™É½´€¬½™™Í•Ð°ÍÁ…¸¹Ñ¼€¬½™™Í•Ð°ÍÁ…¸¹ÑåÁ”¤¤ì(€€€ô(€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€ô(€™Õ¹Ñ¥½¸µ…Á¹‘…Ñ¡•ÉI•µ…¥¹¥¹•½É…Ñ¥½¹Ì¡¡¥±‘É•¸°½±‘¡¥±‘É•¸°‘•½É…Ñ¥½¹Ì°µ…ÁÁ¥¹œ°½™™Í•Ð°½±‘=™™Í•Ð°½ÁÑ¥½¹Ì¤ì(€€€™Õ¹Ñ¥½¸…Ñ¡•È¡Í•Ð°½±‘=™™Í•ÐÈ¤ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÍ•Ð¹±½…°¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•Ðµ…ÁÁ•€ôÍ•Ð¹±½…±m¥t¹µ…À¡µ…ÁÁ¥¹œ°½™™Í•Ð°½±‘=™™Í•ÐÈ¤ì(€€€€€€€¥˜€¡µ…ÁÁ•¤(€€€€€€€€€‘•½É…Ñ¥½¹Ì¹ÁÕÍ ¡µ…ÁÁ•¤ì(€€€€€€€•±Í”¥˜€¡½ÁÑ¥½¹Ì¹½¹I•µ½Ù”¤(€€€€€€€€€½ÁÑ¥½¹Ì¹½¹I•µ½Ù”¡Í•Ð¹±½…±m¥t¹ÍÁ•Œ¤ì(€€€€€ô(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÍ•Ð¹¡¥±‘É•¸¹±•¹Ñ ì¤€¬ô€Ì¤(€€€€€€€…Ñ¡•È¡Í•Ð¹¡¥±‘É•¹m¤€¬€Ét°Í•Ð¹¡¥±‘É•¹m¥t€¬½±‘=™™Í•ÐÈ€¬€Ä¤ì(€€€ô(€€€™½È€¡±•Ð¤€ô€Àì¤€ð¡¥±‘É•¸¹±•¹Ñ ì¤€¬ô€Ì¤(€€€€€¥˜€¡¡¥±‘É•¹m¤€¬€Åt€ôô€´Ä¤(€€€€€€€…Ñ¡•È¡¡¥±‘É•¹m¤€¬€Ét°½±‘¡¥±‘É•¹m¥t€¬½±‘=™™Í•Ð€¬€Ä¤ì(€€€É•ÑÕÉ¸‘•½É…Ñ¥½¹Ìì(€ô(€™Õ¹Ñ¥½¸Ñ…­•MÁ…¹Í½É9½‘”¡ÍÁ…¹Ì°¹½‘”°½™™Í•Ð¤ì(€€€¥˜€¡¹½‘”¹¥Í1•…˜¤(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€±•Ð•¹€ô½™™Í•Ð€¬¹½‘”¹¹½‘•M¥é”°™½Õ¹Ì€ô¹Õ±°ì(€€€™½È€¡±•Ð¤€ô€À°ÍÁ…¸ì¤€ðÍÁ…¹Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€¥˜€ ¡ÍÁ…¸€ôÍÁ…¹Ím¥t¤€˜˜ÍÁ…¸¹™É½´€ø½™™Í•Ð€˜˜ÍÁ…¸¹Ñ¼€ð•¹¤ì(€€€€€€€€¡™½Õ¹Ìñð€¡™½Õ¹Ì€ômt¤¤¹ÁÕÍ ¡ÍÁ…¸¤ì(€€€€€€€ÍÁ…¹Ím¥t€ô¹Õ±°ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸™½Õ¹Ìì(€ô(€™Õ¹Ñ¥½¸Ý¥Ñ¡½ÕÑ9Õ±±Ì¡…ÉÉ…ä¤ì(€€€±•ÐÉ•ÍÕ±Ð€ômtì(€€€™½È€¡±•Ð¤€ô€Àì¤€ð…ÉÉ…ä¹±•¹Ñ ì¤¬¬¤(€€€€€¥˜€¡…ÉÉ…åm¥t€„ô¹Õ±°¤(€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡…ÉÉ…åm¥t¤ì(€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€ô(€™Õ¹Ñ¥½¸‰Õ¥±‘QÉ•”¡ÍÁ…¹Ì°¹½‘”°½™™Í•Ð°½ÁÑ¥½¹Ì¤ì(€€€±•Ð¡¥±‘É•¸€ômt°¡…Í9Õ±±Ì€ô™…±Í”ì(€€€¹½‘”¹™½É…  ¡¡¥±‘9½‘”°±½…±MÑ…ÉÐ¤€ôøì(€€€€€±•Ð™½Õ¹Ì€ôÑ…­•MÁ…¹Í½É9½‘”¡ÍÁ…¹Ì°¡¥±‘9½‘”°±½…±MÑ…ÉÐ€¬½™™Í•Ð¤ì(€€€€€¥˜€¡™½Õ¹Ì¤ì(€€€€€€€¡…Í9Õ±±Ì€ôÑÉÕ”ì(€€€€€€€±•ÐÍÕ‰ÑÉ•”€ô‰Õ¥±‘QÉ•”¡™½Õ¹Ì°¡¥±‘9½‘”°½™™Í•Ð€¬±½…±MÑ…ÉÐ€¬€Ä°½ÁÑ¥½¹Ì¤ì(€€€€€€€¥˜€¡ÍÕ‰ÑÉ•”€„ô•µÁÑä¤(€€€€€€€€€¡¥±‘É•¸¹ÁÕÍ ¡±½…±MÑ…ÉÐ°±½…±MÑ…ÉÐ€¬¡¥±‘9½‘”¹¹½‘•M¥é”°ÍÕ‰ÑÉ•”¤ì(€€€€€ô(€€€ô¤ì(€€€±•Ð±½…±Ì€ôµ½Ù•MÁ…¹Ì¡¡…Í9Õ±±Ì€üÝ¥Ñ¡½ÕÑ9Õ±±Ì¡ÍÁ…¹Ì¤€èÍÁ…¹Ì°€µ½™™Í•Ð¤¹Í½ÉÐ¡‰åA½Ì¤ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ð±½…±Ì¹±•¹Ñ ì¤¬¬¤(€€€€€¥˜€ …±½…±Ím¥t¹ÑåÁ”¹Ù…±¥¡¹½‘”°±½…±Ím¥t¤¤ì(€€€€€€€¥˜€¡½ÁÑ¥½¹Ì¹½¹I•µ½Ù”¤(€€€€€€€€€½ÁÑ¥½¹Ì¹½¹I•µ½Ù”¡±½…±Ím¥t¹ÍÁ•Œ¤ì(€€€€€€€±½…±Ì¹ÍÁ±¥”¡¤´´°€Ä¤ì(€€€€€ô(€€€É•ÑÕÉ¸±½…±Ì¹±•¹Ñ ñð¡¥±‘É•¸¹±•¹Ñ €ü¹•Ü•½É…Ñ¥½¹M•Ð¡±½…±Ì°¡¥±‘É•¸¤€è•µÁÑäì(€ô(€™Õ¹Ñ¥½¸‰åA½Ì¡„°ˆ¤ì(€€€É•ÑÕÉ¸„¹™É½´€´ˆ¹™É½´ñð„¹Ñ¼€´ˆ¹Ñ¼ì(€ô(€™Õ¹Ñ¥½¸É•µ½Ù•=Ù•É±…À¡ÍÁ…¹Ì¤ì(€€€±•ÐÝ½É­¥¹œ€ôÍÁ…¹Ìì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðÝ½É­¥¹œ¹±•¹Ñ €´€Äì¤¬¬¤ì(€€€€€±•ÐÍÁ…¸€ôÝ½É­¥¹m¥tì(€€€€€¥˜€¡ÍÁ…¸¹™É½´€„ôÍÁ…¸¹Ñ¼¤(€€€€€€€™½È€¡±•Ð¨€ô¤€¬€Äì¨€ðÝ½É­¥¹œ¹±•¹Ñ ì¨¬¬¤ì(€€€€€€€€€±•Ð¹•áÐ€ôÝ½É­¥¹m©tì(€€€€€€€€€¥˜€¡¹•áÐ¹™É½´€ôôÍÁ…¸¹™É½´¤ì(€€€€€€€€€€€¥˜€¡¹•áÐ¹Ñ¼€„ôÍÁ…¸¹Ñ¼¤ì(€€€€€€€€€€€€€¥˜€¡Ý½É­¥¹œ€ôôÍÁ…¹Ì¤(€€€€€€€€€€€€€€€Ý½É­¥¹œ€ôÍÁ…¹Ì¹Í±¥” ¤ì(€€€€€€€€€€€€€Ý½É­¥¹m©t€ô¹•áÐ¹½Áä¡¹•áÐ¹™É½´°ÍÁ…¸¹Ñ¼¤ì(€€€€€€€€€€€€€¥¹Í•ÉÑ¡•…¡Ý½É­¥¹œ°¨€¬€Ä°¹•áÐ¹½Áä¡ÍÁ…¸¹Ñ¼°¹•áÐ¹Ñ¼¤¤ì(€€€€€€€€€€€ô(€€€€€€€€€€€½¹Ñ¥¹Õ”ì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€¥˜€¡¹•áÐ¹™É½´€ðÍÁ…¸¹Ñ¼¤ì(€€€€€€€€€€€€€¥˜€¡Ý½É­¥¹œ€ôôÍÁ…¹Ì¤(€€€€€€€€€€€€€€€Ý½É­¥¹œ€ôÍÁ…¹Ì¹Í±¥” ¤ì(€€€€€€€€€€€€€Ý½É­¥¹m¥t€ôÍÁ…¸¹½Áä¡ÍÁ…¸¹™É½´°¹•áÐ¹™É½´¤ì(€€€€€€€€€€€€€¥¹Í•ÉÑ¡•…¡Ý½É­¥¹œ°¨°ÍÁ…¸¹½Áä¡¹•áÐ¹™É½´°ÍÁ…¸¹Ñ¼¤¤ì(€€€€€€€€€€€ô(€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€ô(€€€€€€€ô(€€€ô(€€€É•ÑÕÉ¸Ý½É­¥¹œì(€ô(€™Õ¹Ñ¥½¸¥¹Í•ÉÑ¡•…¡…ÉÉ…ä°¤°‘•¼¤ì(€€€Ý¡¥±”€¡¤€ð…ÉÉ…ä¹±•¹Ñ €˜˜‰åA½Ì¡‘•¼°…ÉÉ…åm¥t¤€ø€À¤(€€€€€¤¬¬ì(€€€…ÉÉ…ä¹ÍÁ±¥”¡¤°€À°‘•¼¤ì(€ô(€™Õ¹Ñ¥½¸Ù¥•Ý•½É…Ñ¥½¹Ì¡Ù¥•Ü¤ì(€€€±•Ð™½Õ¹Ì€ômtì(€€€Ù¥•Ü¹Í½µ•AÉ½À ‰‘•½É…Ñ¥½¹Ìˆ°€¡˜¤€ôøì(€€€€€±•ÐÉ•ÍÕ±Ð€ô˜¡Ù¥•Ü¹ÍÑ…Ñ”¤ì(€€€€€¥˜€¡É•ÍÕ±Ð€˜˜É•ÍÕ±Ð€„ô•µÁÑä¤(€€€€€€€™½Õ¹Ì¹ÁÕÍ ¡É•ÍÕ±Ð¤ì(€€€ô¤ì(€€€¥˜€¡Ù¥•Ü¹ÕÉÍ½É]É…ÁÁ•È¤(€€€€€™½Õ¹Ì¹ÁÕÍ ¡•½É…Ñ¥½¹M•Ð¹É•…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ°mÙ¥•Ü¹ÕÉÍ½É]É…ÁÁ•È¹‘•½t¤¤ì(€€€É•ÑÕÉ¸•½É…Ñ¥½¹É½ÕÀ¹™É½´¡™½Õ¹Ì¤ì(€ô(€Ù…È½‰Í•ÉÙ•=ÁÑ¥½¹Ì€ôì(€€€¡¥±‘1¥ÍÐèÑÉÕ”°(€€€¡…É…Ñ•É…Ñ„èÑÉÕ”°(€€€¡…É…Ñ•É…Ñ…=±‘Y…±Õ”èÑÉÕ”°(€€€…ÑÑÉ¥‰ÕÑ•ÌèÑÉÕ”°(€€€…ÑÑÉ¥‰ÕÑ•=±‘Y…±Õ”èÑÉÕ”°(€€€ÍÕ‰ÑÉ•”èÑÉÕ”(€ôì(€Ù…ÈÕÍ•¡…É…Ñ„€ô¥”€˜˜¥•}Ù•ÉÍ¥½¸€ðô€ÄÄì(€Ù…ÈM•±•Ñ¥½¹MÑ…Ñ”€ô±…ÍÌì(€€€½¹ÍÑÉÕÑ½È ¤ì(€€€€€Ñ¡¥Ì¹…¹¡½É9½‘”€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹…¹¡½É=™™Í•Ð€ô€Àì(€€€€€Ñ¡¥Ì¹™½ÕÍ9½‘”€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹™½ÕÍ=™™Í•Ð€ô€Àì(€€€ô(€€€Í•Ð¡Í•°¤ì(€€€€€Ñ¡¥Ì¹…¹¡½É9½‘”€ôÍ•°¹…¹¡½É9½‘”ì(€€€€€Ñ¡¥Ì¹…¹¡½É=™™Í•Ð€ôÍ•°¹…¹¡½É=™™Í•Ðì(€€€€€Ñ¡¥Ì¹™½ÕÍ9½‘”€ôÍ•°¹™½ÕÍ9½‘”ì(€€€€€Ñ¡¥Ì¹™½ÕÍ=™™Í•Ð€ôÍ•°¹™½ÕÍ=™™Í•Ðì(€€€ô(€€€±•…È ¤ì(€€€€€Ñ¡¥Ì¹…¹¡½É9½‘”€ôÑ¡¥Ì¹™½ÕÍ9½‘”€ô¹Õ±°ì(€€€ô(€€€•Ä¡Í•°¤ì(€€€€€É•ÑÕÉ¸Í•°¹…¹¡½É9½‘”€ôôÑ¡¥Ì¹…¹¡½É9½‘”€˜˜Í•°¹…¹¡½É=™™Í•Ð€ôôÑ¡¥Ì¹…¹¡½É=™™Í•Ð€˜˜Í•°¹™½ÕÍ9½‘”€ôôÑ¡¥Ì¹™½ÕÍ9½‘”€˜˜Í•°¹™½ÕÍ=™™Í•Ð€ôôÑ¡¥Ì¹™½ÕÍ=™™Í•Ðì(€€€ô(€ôì(€Ù…È=5=‰Í•ÉÙ•È€ô±…ÍÌì(€€€½¹ÍÑÉÕÑ½È¡Ù¥•Ü°¡…¹‘±•=5¡…¹”¤ì(€€€€€Ñ¡¥Ì¹Ù¥•Ü€ôÙ¥•Üì(€€€€€Ñ¡¥Ì¹¡…¹‘±•=5¡…¹”€ô¡…¹‘±•=5¡…¹”ì(€€€€€Ñ¡¥Ì¹ÅÕ•Õ”€ômtì(€€€€€Ñ¡¥Ì¹™±ÕÍ¡¥¹M½½¸€ô€´Äì(€€€€€Ñ¡¥Ì¹½‰Í•ÉÙ•È€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹ÕÉÉ•¹ÑM•±•Ñ¥½¸€ô¹•ÜM•±•Ñ¥½¹MÑ…Ñ” ¤ì(€€€€€Ñ¡¥Ì¹½¹¡…É…Ñ„€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹ÍÕÁÁÉ•ÍÍ¥¹M•±•Ñ¥½¹UÁ‘…Ñ•Ì€ô™…±Í”ì(€€€€€Ñ¡¥Ì¹±…ÍÑ¡…¹•‘Q•áÑ9½‘”€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹½‰Í•ÉÙ•È€ôÝ¥¹‘½Ü¹5ÕÑ…Ñ¥½¹=‰Í•ÉÙ•È€˜˜¹•ÜÝ¥¹‘½Ü¹5ÕÑ…Ñ¥½¹=‰Í•ÉÙ•È ¡µÕÑ…Ñ¥½¹Ì¤€ôøì(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðµÕÑ…Ñ¥½¹Ì¹±•¹Ñ ì¤¬¬¤(€€€€€€€€€Ñ¡¥Ì¹ÅÕ•Õ”¹ÁÕÍ ¡µÕÑ…Ñ¥½¹Ím¥t¤ì(€€€€€€€¥˜€¡¥”€˜˜¥•}Ù•ÉÍ¥½¸€ðô€ÄÄ€˜˜µÕÑ…Ñ¥½¹Ì¹Í½µ” ¡´¤€ôø´¹ÑåÁ”€ôô€‰¡¥±‘1¥ÍÐˆ€˜˜´¹É•µ½Ù•‘9½‘•Ì¹±•¹Ñ ñð´¹ÑåÁ”€ôô€‰¡…É…Ñ•É…Ñ„ˆ€˜˜´¹½±‘Y…±Õ”¹±•¹Ñ €ø´¹Ñ…É•Ð¹¹½‘•Y…±Õ”¹±•¹Ñ ¤¤ì(€€€€€€€€€Ñ¡¥Ì¹™±ÕÍ¡M½½¸ ¤ì(€€€€€€€ô•±Í”¥˜€¡Í…™…É¤€˜˜Ù¥•Ü¹½µÁ½Í¥¹œ€˜˜µÕÑ…Ñ¥½¹Ì¹Í½µ” ¡´¤€ôø´¹ÑåÁ”€ôô€‰¡¥±‘1¥ÍÐˆ€˜˜´¹Ñ…É•Ð¹¹½‘•9…µ”€ôô€‰QHˆ¤¤ì(€€€€€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹‰…‘M…™…É¥½µÁ½Í¥Ñ¥½¸€ôÑÉÕ”ì(€€€€€€€€€Ñ¡¥Ì¹™±ÕÍ¡M½½¸ ¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€Ñ¡¥Ì¹™±ÕÍ  ¤ì(€€€€€€€ô(€€€€€ô¤ì(€€€€€¥˜€¡ÕÍ•¡…É…Ñ„¤ì(€€€€€€€Ñ¡¥Ì¹½¹¡…É…Ñ„€ô€¡”¤€ôøì(€€€€€€€€€Ñ¡¥Ì¹ÅÕ•Õ”¹ÁÕÍ ¡ìÑ…É•Ðè”¹Ñ…É•Ð°ÑåÁ”è€‰¡…É…Ñ•É…Ñ„ˆ°½±‘Y…±Õ”è”¹ÁÉ•ÙY…±Õ”ô¤ì(€€€€€€€€€Ñ¡¥Ì¹™±ÕÍ¡M½½¸ ¤ì(€€€€€€€ôì(€€€€€ô(€€€€€Ñ¡¥Ì¹½¹M•±•Ñ¥½¹¡…¹”€ôÑ¡¥Ì¹½¹M•±•Ñ¥½¹¡…¹”¹‰¥¹¡Ñ¡¥Ì¤ì(€€€ô(€€€™±ÕÍ¡M½½¸ ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹™±ÕÍ¡¥¹M½½¸€ð€À¤(€€€€€€€Ñ¡¥Ì¹™±ÕÍ¡¥¹M½½¸€ôÝ¥¹‘½Ü¹Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€€€€€Ñ¡¥Ì¹™±ÕÍ¡¥¹M½½¸€ô€´Äì(€€€€€€€€€Ñ¡¥Ì¹™±ÕÍ  ¤ì(€€€€€€€ô°€ÈÀ¤ì(€€€ô(€€€™½É•±ÕÍ  ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹™±ÕÍ¡¥¹M½½¸€ø€´Ä¤ì(€€€€€€€Ý¥¹‘½Ü¹±•…ÉQ¥µ•½ÕÐ¡Ñ¡¥Ì¹™±ÕÍ¡¥¹M½½¸¤ì(€€€€€€€Ñ¡¥Ì¹™±ÕÍ¡¥¹M½½¸€ô€´Äì(€€€€€€€Ñ¡¥Ì¹™±ÕÍ  ¤ì(€€€€€ô(€€€ô(€€€ÍÑ…ÉÐ ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹½‰Í•ÉÙ•È¤ì(€€€€€€€Ñ¡¥Ì¹½‰Í•ÉÙ•È¹Ñ…­•I•½É‘Ì ¤ì(€€€€€€€Ñ¡¥Ì¹½‰Í•ÉÙ•È¹½‰Í•ÉÙ”¡Ñ¡¥Ì¹Ù¥•Ü¹‘½´°½‰Í•ÉÙ•=ÁÑ¥½¹Ì¤ì(€€€€€ô(€€€€€¥˜€¡Ñ¡¥Ì¹½¹¡…É…Ñ„¤(€€€€€€€Ñ¡¥Ì¹Ù¥•Ü¹‘½´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰=5¡…É…Ñ•É…Ñ…5½‘¥™¥•ˆ°Ñ¡¥Ì¹½¹¡…É…Ñ„¤ì(€€€€€Ñ¡¥Ì¹½¹¹•ÑM•±•Ñ¥½¸ ¤ì(€€€ô(€€€ÍÑ½À ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹½‰Í•ÉÙ•È¤ì(€€€€€€€±•ÐÑ…­”€ôÑ¡¥Ì¹½‰Í•ÉÙ•È¹Ñ…­•I•½É‘Ì ¤ì(€€€€€€€¥˜€¡Ñ…­”¹±•¹Ñ ¤ì(€€€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ…­”¹±•¹Ñ ì¤¬¬¤(€€€€€€€€€€€Ñ¡¥Ì¹ÅÕ•Õ”¹ÁÕÍ ¡Ñ…­•m¥t¤ì(€€€€€€€€€Ý¥¹‘½Ü¹Í•ÑQ¥µ•½ÕÐ  ¤€ôøÑ¡¥Ì¹™±ÕÍ  ¤°€ÈÀ¤ì(€€€€€€€ô(€€€€€€€Ñ¡¥Ì¹½‰Í•ÉÙ•È¹‘¥Í½¹¹•Ð ¤ì(€€€€€ô(€€€€€¥˜€¡Ñ¡¥Ì¹½¹¡…É…Ñ„¤(€€€€€€€Ñ¡¥Ì¹Ù¥•Ü¹‘½´¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È ‰=5¡…É…Ñ•É…Ñ…5½‘¥™¥•ˆ°Ñ¡¥Ì¹½¹¡…É…Ñ„¤ì(€€€€€Ñ¡¥Ì¹‘¥Í½¹¹•ÑM•±•Ñ¥½¸ ¤ì(€€€ô(€€€½¹¹•ÑM•±•Ñ¥½¸ ¤ì(€€€€€Ñ¡¥Ì¹Ù¥•Ü¹‘½´¹½Ý¹•É½Õµ•¹Ð¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰Í•±•Ñ¥½¹¡…¹”ˆ°Ñ¡¥Ì¹½¹M•±•Ñ¥½¹¡…¹”¤ì(€€€ô(€€€‘¥Í½¹¹•ÑM•±•Ñ¥½¸ ¤ì(€€€€€Ñ¡¥Ì¹Ù¥•Ü¹‘½´¹½Ý¹•É½Õµ•¹Ð¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È ‰Í•±•Ñ¥½¹¡…¹”ˆ°Ñ¡¥Ì¹½¹M•±•Ñ¥½¹¡…¹”¤ì(€€€ô(€€€ÍÕÁÁÉ•ÍÍM•±•Ñ¥½¹UÁ‘…Ñ•Ì ¤ì(€€€€€Ñ¡¥Ì¹ÍÕÁÁÉ•ÍÍ¥¹M•±•Ñ¥½¹UÁ‘…Ñ•Ì€ôÑÉÕ”ì(€€€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøÑ¡¥Ì¹ÍÕÁÁÉ•ÍÍ¥¹M•±•Ñ¥½¹UÁ‘…Ñ•Ì€ô™…±Í”°€ÔÀ¤ì(€€€ô(€€€½¹M•±•Ñ¥½¹¡…¹” ¤ì(€€€€€¥˜€ …¡…Í½ÕÍ¹‘M•±•Ñ¥½¸¡Ñ¡¥Ì¹Ù¥•Ü¤¤(€€€€€€€É•ÑÕÉ¸ì(€€€€€¥˜€¡Ñ¡¥Ì¹ÍÕÁÁÉ•ÍÍ¥¹M•±•Ñ¥½¹UÁ‘…Ñ•Ì¤(€€€€€€€É•ÑÕÉ¸Í•±•Ñ¥½¹Q½=4¡Ñ¡¥Ì¹Ù¥•Ü¤ì(€€€€€¥˜€¡¥”€˜˜¥•}Ù•ÉÍ¥½¸€ðô€ÄÄ€˜˜€…Ñ¡¥Ì¹Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹•µÁÑä¤ì(€€€€€€€±•ÐÍ•°€ôÑ¡¥Ì¹Ù¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€€€€€¥˜€¡Í•°¹™½ÕÍ9½‘”€˜˜¥ÍÅÕ¥Ù…±•¹ÑA½Í¥Ñ¥½¸¡Í•°¹™½ÕÍ9½‘”°Í•°¹™½ÕÍ=™™Í•Ð°Í•°¹…¹¡½É9½‘”°Í•°¹…¹¡½É=™™Í•Ð¤¤(€€€€€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹™±ÕÍ¡M½½¸ ¤ì(€€€€€ô(€€€€€Ñ¡¥Ì¹™±ÕÍ  ¤ì(€€€ô(€€€Í•ÑÕÉM•±•Ñ¥½¸ ¤ì(€€€€€Ñ¡¥Ì¹ÕÉÉ•¹ÑM•±•Ñ¥½¸¹Í•Ð¡Ñ¡¥Ì¹Ù¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤¤ì(€€€ô(€€€¥¹½É•M•±•Ñ¥½¹¡…¹”¡Í•°¤ì(€€€€€¥˜€ …Í•°¹™½ÕÍ9½‘”¤(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€±•Ð…¹•ÍÑ½ÉÌ€ô€¼¨}}AUI}|€¨¼¹•ÜM•Ð ¤°½¹Ñ…¥¹•Èì(€€€€€™½È€¡±•ÐÍ…¸€ôÍ•°¹™½ÕÍ9½‘”ìÍ…¸ìÍ…¸€ôÁ…É•¹Ñ9½‘”¡Í…¸¤¤(€€€€€€€…¹•ÍÑ½ÉÌ¹…‘¡Í…¸¤ì(€€€€€™½È€¡±•ÐÍ…¸€ôÍ•°¹…¹¡½É9½‘”ìÍ…¸ìÍ…¸€ôÁ…É•¹Ñ9½‘”¡Í…¸¤¤(€€€€€€€¥˜€¡…¹•ÍÑ½ÉÌ¹¡…Ì¡Í…¸¤¤ì(€€€€€€€€€½¹Ñ…¥¹•È€ôÍ…¸ì(€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€±•Ð‘•ÍŒ€ô½¹Ñ…¥¹•È€˜˜Ñ¡¥Ì¹Ù¥•Ü¹‘½Y¥•Ü¹¹•…É•ÍÑ•ÍŒ¡½¹Ñ…¥¹•È¤ì(€€€€€¥˜€¡‘•ÍŒ€˜˜‘•ÍŒ¹¥¹½É•5ÕÑ…Ñ¥½¸¡ì(€€€€€€€ÑåÁ”è€‰Í•±•Ñ¥½¸ˆ°(€€€€€€€Ñ…É•Ðè¥ÍQ•áÐ¡½¹Ñ…¥¹•È¤€ü½¹Ñ…¥¹•È¹Á…É•¹Ñ9½‘”€è½¹Ñ…¥¹•È(€€€€€ô¤¤ì(€€€€€€€Ñ¡¥Ì¹Í•ÑÕÉM•±•Ñ¥½¸ ¤ì(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô(€€€ô(€€€Á•¹‘¥¹I•½É‘Ì ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹½‰Í•ÉÙ•È¤(€€€€€€€™½È€¡±•ÐµÕÐ½˜Ñ¡¥Ì¹½‰Í•ÉÙ•È¹Ñ…­•I•½É‘Ì ¤¤(€€€€€€€€€Ñ¡¥Ì¹ÅÕ•Õ”¹ÁÕÍ ¡µÕÐ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÅÕ•Õ”ì(€€€ô(€€€™±ÕÍ  ¤ì(€€€€€±•ÐìÙ¥•Üô€ôÑ¡¥Ìì(€€€€€¥˜€ …Ù¥•Ü¹‘½Y¥•ÜñðÑ¡¥Ì¹™±ÕÍ¡¥¹M½½¸€ø€´Ä¤(€€€€€€€É•ÑÕÉ¸ì(€€€€€±•ÐµÕÑ…Ñ¥½¹Ì€ôÑ¡¥Ì¹Á•¹‘¥¹I•½É‘Ì ¤ì(€€€€€¥˜€¡µÕÑ…Ñ¥½¹Ì¹±•¹Ñ ¤(€€€€€€€Ñ¡¥Ì¹ÅÕ•Õ”€ômtì(€€€€€±•ÐÍ•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€€€±•Ð¹•ÝM•°€ô€…Ñ¡¥Ì¹ÍÕÁÁÉ•ÍÍ¥¹M•±•Ñ¥½¹UÁ‘…Ñ•Ì€˜˜€…Ñ¡¥Ì¹ÕÉÉ•¹ÑM•±•Ñ¥½¸¹•Ä¡Í•°¤€˜˜¡…Í½ÕÍ¹‘M•±•Ñ¥½¸¡Ù¥•Ü¤€˜˜€…Ñ¡¥Ì¹¥¹½É•M•±•Ñ¥½¹¡…¹”¡Í•°¤ì(€€€€€±•Ð™É½´È€ô€´Ä°Ñ¼€ô€´Ä°ÑåÁ•=Ù•È€ô™…±Í”°…‘‘•€ômtì(€€€€€¥˜€¡Ù¥•Ü¹•‘¥Ñ…‰±”¤ì(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðµÕÑ…Ñ¥½¹Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€±•ÐÉ•ÍÕ±Ð€ôÑ¡¥Ì¹É•¥ÍÑ•É5ÕÑ…Ñ¥½¸¡µÕÑ…Ñ¥½¹Ím¥t°…‘‘•¤ì(€€€€€€€€€¥˜€¡É•ÍÕ±Ð¤ì(€€€€€€€€€€€™É½´È€ô™É½´È€ð€À€üÉ•ÍÕ±Ð¹™É½´€è5…Ñ ¹µ¥¸¡É•ÍÕ±Ð¹™É½´°™É½´È¤ì(€€€€€€€€€€€Ñ¼€ôÑ¼€ð€À€üÉ•ÍÕ±Ð¹Ñ¼€è5…Ñ ¹µ…à¡É•ÍÕ±Ð¹Ñ¼°Ñ¼¤ì(€€€€€€€€€€€¥˜€¡É•ÍÕ±Ð¹ÑåÁ•=Ù•È¤(€€€€€€€€€€€€€ÑåÁ•=Ù•È€ôÑÉÕ”ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€ô(€€€€€¥˜€¡…‘‘•¹Í½µ” ¡¸¤€ôø¸¹¹½‘•9…µ”€ôô€‰	Hˆ¤€˜˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘”€ôô€àñðÙ¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘”€ôô€ÐØñð¡É½µ”€˜˜€¡Ù¥•Ü¹½µÁ½Í¥¹œñðÙ¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹¹‘•‘Ð€ø…Ñ”¹¹½Ü ¤€´€ÔÀ¤€˜˜µÕÑ…Ñ¥½¹Ì¹Í½µ” ¡´¤€ôø´¹ÑåÁ”€ôô€‰¡¥±‘1¥ÍÐˆ€˜˜´¹É•µ½Ù•‘9½‘•Ì¹±•¹Ñ ¤¤¤ì(€€€€€€€™½È€¡±•Ð¹½‘”½˜…‘‘•¤(€€€€€€€€€¥˜€¡¹½‘”¹¹½‘•9…µ”€ôô€‰	Hˆ€˜˜¹½‘”¹Á…É•¹Ñ9½‘”¤ì(€€€€€€€€€€€±•Ð…™Ñ•È€ô¹½‘”¹¹•áÑM¥‰±¥¹œì(€€€€€€€€€€€Ý¡¥±”€¡…™Ñ•È€˜˜¥Í±Ð¡…™Ñ•È¤¤ì(€€€€€€€€€€€€€¥˜€¡…™Ñ•È¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤ì(€€€€€€€€€€€€€€€¹½‘”¹Á…É•¹Ñ9½‘”¹É•µ½Ù•¡¥±¡¹½‘”¤ì(€€€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€€€ô(€€€€€€€€€€€€€…™Ñ•È€ô…™Ñ•È¹™¥ÉÍÑ¡¥±ì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€ô•±Í”¥˜€¡•­¼€˜˜…‘‘•¹±•¹Ñ ¤ì(€€€€€€€±•Ð‰ÉÌ€ô…‘‘•¹™¥±Ñ•È ¡¸¤€ôø¸¹¹½‘•9…µ”€ôô€‰	Hˆ¤ì(€€€€€€€¥˜€¡‰ÉÌ¹±•¹Ñ €ôô€È¤ì(€€€€€€€€€±•Ðm„°‰t€ô‰ÉÌì(€€€€€€€€€¥˜€¡„¹Á…É•¹Ñ9½‘”€˜˜„¹Á…É•¹Ñ9½‘”¹Á…É•¹Ñ9½‘”€ôôˆ¹Á…É•¹Ñ9½‘”¤(€€€€€€€€€€€ˆ¹É•µ½Ù” ¤ì(€€€€€€€€€•±Í”(€€€€€€€€€€€„¹É•µ½Ù” ¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€±•Ðì™½ÕÍ9½‘”ô€ôÑ¡¥Ì¹ÕÉÉ•¹ÑM•±•Ñ¥½¸ì(€€€€€€€€€™½È€¡±•Ð‰È½˜‰ÉÌ¤ì(€€€€€€€€€€€±•ÐÁ…É•¹Ð€ô‰È¹Á…É•¹Ñ9½‘”ì(€€€€€€€€€€€¥˜€¡Á…É•¹Ð€˜˜Á…É•¹Ð¹¹½‘•9…µ”€ôô€‰1$ˆ€˜˜€ …™½ÕÍ9½‘”ñð‰±½­A…É•¹Ð¡Ù¥•Ü°™½ÕÍ9½‘”¤€„ôÁ…É•¹Ð¤¤(€€€€€€€€€€€€€‰È¹É•µ½Ù” ¤ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€ô(€€€€€±•ÐÉ•…‘M•°€ô¹Õ±°ì(€€€€€¥˜€¡™É½´È€ð€À€˜˜¹•ÝM•°€˜˜Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ½ÕÌ€ø…Ñ”¹¹½Ü ¤€´€ÈÀÀ€˜˜5…Ñ ¹µ…à¡Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑQ½Õ °Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ±¥¬¹Ñ¥µ”¤€ð…Ñ”¹¹½Ü ¤€´€ÌÀÀ€˜˜Í•±•Ñ¥½¹½±±…ÁÍ•¡Í•°¤€˜˜€¡É•…‘M•°€ôÍ•±•Ñ¥½¹É½µ=4¡Ù¥•Ü¤¤€˜˜É•…‘M•°¹•Ä¡M•±•Ñ¥½¸¹¹•…È¡Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù” À¤°€Ä¤¤¤ì(€€€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ½ÕÌ€ô€Àì(€€€€€€€Í•±•Ñ¥½¹Q½=4¡Ù¥•Ü¤ì(€€€€€€€Ñ¡¥Ì¹ÕÉÉ•¹ÑM•±•Ñ¥½¸¹Í•Ð¡Í•°¤ì(€€€€€€€Ù¥•Ü¹ÍÉ½±±Q½M•±•Ñ¥½¸ ¤ì(€€€€€ô•±Í”¥˜€¡™É½´È€ø€´Äñð¹•ÝM•°¤ì(€€€€€€€¥˜€¡™É½´È€ø€´Ä¤ì(€€€€€€€€€Ù¥•Ü¹‘½Y¥•Ü¹µ…É­¥ÉÑä¡™É½´È°Ñ¼¤ì(€€€€€€€€€¡•­ML¡Ù¥•Ü¤ì(€€€€€€€ô(€€€€€€€¥˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹‰…‘M…™…É¥½µÁ½Í¥Ñ¥½¸¤ì(€€€€€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹‰…‘M…™…É¥½µÁ½Í¥Ñ¥½¸€ô™…±Í”ì(€€€€€€€€€™¥áUÁ	…‘M…™…É¥½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü°…‘‘•¤ì(€€€€€€€ô(€€€€€€€Ñ¡¥Ì¹¡…¹‘±•=5¡…¹”¡™É½´È°Ñ¼°ÑåÁ•=Ù•È°…‘‘•¤ì(€€€€€€€¥˜€¡Ù¥•Ü¹‘½Y¥•Ü€˜˜Ù¥•Ü¹‘½Y¥•Ü¹‘¥ÉÑä¤(€€€€€€€€€Ù¥•Ü¹ÕÁ‘…Ñ•MÑ…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¤ì(€€€€€€€•±Í”¥˜€ …Ñ¡¥Ì¹ÕÉÉ•¹ÑM•±•Ñ¥½¸¹•Ä¡Í•°¤¤(€€€€€€€€€Í•±•Ñ¥½¹Q½=4¡Ù¥•Ü¤ì(€€€€€€€Ñ¡¥Ì¹ÕÉÉ•¹ÑM•±•Ñ¥½¸¹Í•Ð¡Í•°¤ì(€€€€€ô(€€€ô(€€€É•¥ÍÑ•É5ÕÑ…Ñ¥½¸¡µÕÐ°…‘‘•¤ì(€€€€€¥˜€¡…‘‘•¹¥¹‘•á=˜¡µÕÐ¹Ñ…É•Ð¤€ø€´Ä¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€±•Ð‘•ÍŒ€ôÑ¡¥Ì¹Ù¥•Ü¹‘½Y¥•Ü¹¹•…É•ÍÑ•ÍŒ¡µÕÐ¹Ñ…É•Ð¤ì(€€€€€¥˜€¡µÕÐ¹ÑåÁ”€ôô€‰…ÑÑÉ¥‰ÕÑ•Ìˆ€˜˜€¡‘•ÍŒ€ôôÑ¡¥Ì¹Ù¥•Ü¹‘½Y¥•ÜñðµÕÐ¹…ÑÑÉ¥‰ÕÑ•9…µ”€ôô€‰½¹Ñ•¹Ñ•‘¥Ñ…‰±”ˆñð€¼¼¥É•™½àÍ½µ•Ñ¥µ•Ì™¥É•ÌÍÁÕÉ¥½ÕÌ•Ù•¹ÑÌ™½È¹Õ±°½•µÁÑäÍÑå±•Ì(€€€€€µÕÐ¹…ÑÑÉ¥‰ÕÑ•9…µ”€ôô€‰ÍÑå±”ˆ€˜˜€…µÕÐ¹½±‘Y…±Õ”€˜˜€…µÕÐ¹Ñ…É•Ð¹•ÑÑÑÉ¥‰ÕÑ” ‰ÍÑå±”ˆ¤¤¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€¥˜€ …‘•ÍŒñð‘•ÍŒ¹¥¹½É•5ÕÑ…Ñ¥½¸¡µÕÐ¤¤(€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€¥˜€¡µÕÐ¹ÑåÁ”€ôô€‰¡¥±‘1¥ÍÐˆ¤ì(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðµÕÐ¹…‘‘•‘9½‘•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€±•Ð¹½‘”€ôµÕÐ¹…‘‘•‘9½‘•Ím¥tì(€€€€€€€€€…‘‘•¹ÁÕÍ ¡¹½‘”¤ì(€€€€€€€€€¥˜€¡¥ÍQ•áÐ¡¹½‘”¤¤(€€€€€€€€€€€Ñ¡¥Ì¹±…ÍÑ¡…¹•‘Q•áÑ9½‘”€ô¹½‘”ì(€€€€€€€ô(€€€€€€€¥˜€¡‘•ÍŒ¹½¹Ñ•¹Ñ=4€˜˜‘•ÍŒ¹½¹Ñ•¹Ñ=4€„ô‘•ÍŒ¹‘½´€˜˜€…‘•ÍŒ¹½¹Ñ•¹Ñ=4¹½¹Ñ…¥¹Ì¡µÕÐ¹Ñ…É•Ð¤¤(€€€€€€€€€É•ÑÕÉ¸ì™É½´è‘•ÍŒ¹Á½Í	•™½É”°Ñ¼è‘•ÍŒ¹Á½Í™Ñ•Èôì(€€€€€€€±•ÐÁÉ•Ø€ôµÕÐ¹ÁÉ•Ù¥½ÕÍM¥‰±¥¹œ°¹•áÐ€ôµÕÐ¹¹•áÑM¥‰±¥¹œì(€€€€€€€¥˜€¡¥”€˜˜¥•}Ù•ÉÍ¥½¸€ðô€ÄÄ€˜˜µÕÐ¹…‘‘•‘9½‘•Ì¹±•¹Ñ ¤ì(€€€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðµÕÐ¹…‘‘•‘9½‘•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€€€±•ÐìÁÉ•Ù¥½ÕÍM¥‰±¥¹œ°¹•áÑM¥‰±¥¹œô€ôµÕÐ¹…‘‘•‘9½‘•Ím¥tì(€€€€€€€€€€€¥˜€ …ÁÉ•Ù¥½ÕÍM¥‰±¥¹œñðÉÉ…ä¹ÁÉ½Ñ½ÑåÁ”¹¥¹‘•á=˜¹…±°¡µÕÐ¹…‘‘•‘9½‘•Ì°ÁÉ•Ù¥½ÕÍM¥‰±¥¹œ¤€ð€À¤(€€€€€€€€€€€€€ÁÉ•Ø€ôÁÉ•Ù¥½ÕÍM¥‰±¥¹œì(€€€€€€€€€€€¥˜€ …¹•áÑM¥‰±¥¹œñðÉÉ…ä¹ÁÉ½Ñ½ÑåÁ”¹¥¹‘•á=˜¹…±°¡µÕÐ¹…‘‘•‘9½‘•Ì°¹•áÑM¥‰±¥¹œ¤€ð€À¤(€€€€€€€€€€€€€¹•áÐ€ô¹•áÑM¥‰±¥¹œì(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€±•Ð™É½µ=™™Í•Ð€ôÁÉ•Ø€˜˜ÁÉ•Ø¹Á…É•¹Ñ9½‘”€ôôµÕÐ¹Ñ…É•Ð€ü‘½µ%¹‘•à¡ÁÉ•Ø¤€¬€Ä€è€Àì(€€€€€€€±•Ð™É½´È€ô‘•ÍŒ¹±½…±A½ÍÉ½µ=4¡µÕÐ¹Ñ…É•Ð°™É½µ=™™Í•Ð°€´Ä¤ì(€€€€€€€±•ÐÑ½=™™Í•Ð€ô¹•áÐ€˜˜¹•áÐ¹Á…É•¹Ñ9½‘”€ôôµÕÐ¹Ñ…É•Ð€ü‘½µ%¹‘•à¡¹•áÐ¤€èµÕÐ¹Ñ…É•Ð¹¡¥±‘9½‘•Ì¹±•¹Ñ ì(€€€€€€€±•ÐÑ¼€ô‘•ÍŒ¹±½…±A½ÍÉ½µ=4¡µÕÐ¹Ñ…É•Ð°Ñ½=™™Í•Ð°€Ä¤ì(€€€€€€€É•ÑÕÉ¸ì™É½´è™É½´È°Ñ¼ôì(€€€€€ô•±Í”¥˜€¡µÕÐ¹ÑåÁ”€ôô€‰…ÑÑÉ¥‰ÕÑ•Ìˆ¤ì(€€€€€€€É•ÑÕÉ¸ì™É½´è‘•ÍŒ¹Á½ÍÑMÑ…ÉÐ€´‘•ÍŒ¹‰½É‘•È°Ñ¼è‘•ÍŒ¹Á½ÍÑ¹€¬‘•ÍŒ¹‰½É‘•Èôì(€€€€€ô•±Í”ì(€€€€€€€Ñ¡¥Ì¹±…ÍÑ¡…¹•‘Q•áÑ9½‘”€ôµÕÐ¹Ñ…É•Ðì(€€€€€€€É•ÑÕÉ¸ì(€€€€€€€€€™É½´è‘•ÍŒ¹Á½ÍÑMÑ…ÉÐ°(€€€€€€€€€Ñ¼è‘•ÍŒ¹Á½ÍÑ¹°(€€€€€€€€€€¼¼¸•Ù•¹ÐÝ…Ì•¹•É…Ñ•™½È„Ñ•áÐ¡…¹”Ñ¡…Ð‘¥‘¸Ð¡…¹”(€€€€€€€€€€¼¼…¹äÑ•áÐ¸5…É¬Ñ¡”‘½´¡…¹”Ñ¼™…±°‰…¬Ñ¼…ÍÍÕµ¥¹œÑ¡”(€€€€€€€€€€¼¼Í•±•Ñ¥½¸Ý…ÌÑåÁ•½Ù•ÈÝ¥Ñ …¸¥‘•¹Ñ¥…°Ù…±Õ”¥˜¥Ð…¸Ð(€€€€€€€€€€¼¼™¥¹…¹½Ñ¡•È¡…¹”¸(€€€€€€€€€ÑåÁ•=Ù•ÈèµÕÐ¹Ñ…É•Ð¹¹½‘•Y…±Õ”€ôôµÕÐ¹½±‘Y…±Õ”(€€€€€€€ôì(€€€€€ô(€€€ô(€ôì(€Ù…ÈÍÍ¡•­•€ô€¼¨}}AUI}|€¨¼¹•Ü]•…­5…À ¤ì(€Ù…ÈÍÍ¡•­]…É¹•€ô™…±Í”ì(€™Õ¹Ñ¥½¸¡•­ML¡Ù¥•Ü¤ì(€€€¥˜€¡ÍÍ¡•­•¹¡…Ì¡Ù¥•Ü¤¤(€€€€€É•ÑÕÉ¸ì(€€€ÍÍ¡•­•¹Í•Ð¡Ù¥•Ü°¹Õ±°¤ì(€€€¥˜€¡l‰¹½Éµ…°ˆ°€‰¹½ÝÉ…Àˆ°€‰ÁÉ”µ±¥¹”‰t¹¥¹‘•á=˜¡•Ñ½µÁÕÑ•‘MÑå±”¡Ù¥•Ü¹‘½´¤¹Ý¡¥Ñ•MÁ…”¤€„ôô€´Ä¤ì(€€€€€Ù¥•Ü¹É•ÅÕ¥É•Í•­½!…­9½‘”€ô•­¼ì(€€€€€¥˜€¡ÍÍ¡•­]…É¹•¤(€€€€€€€É•ÑÕÉ¸ì(€€€€€½¹Í½±•l‰Ý…É¸‰t ‰AÉ½Í•5¥ÉÉ½È•áÁ•ÑÌÑ¡”MLÝ¡¥Ñ”µÍÁ…”ÁÉ½Á•ÉÑäÑ¼‰”Í•Ð°ÁÉ•™•É…‰±äÑ¼€ÁÉ”µÝÉ…Àœ¸%Ð¥ÌÉ•½µµ•¹‘•Ñ¼±½…ÍÑå±”½ÁÉ½Í•µ¥ÉÉ½È¹ÍÌ™É½´Ñ¡”ÁÉ½Í•µ¥ÉÉ½ÈµÙ¥•ÜÁ…­…”¸ˆ¤ì(€€€€€ÍÍ¡•­]…É¹•€ôÑÉÕ”ì(€€€ô(€ô(€™Õ¹Ñ¥½¸É…¹•Q½M•±•Ñ¥½¹I…¹”¡Ù¥•Ü°É…¹”¤ì(€€€±•Ð…¹¡½É9½‘”€ôÉ…¹”¹ÍÑ…ÉÑ½¹Ñ…¥¹•È°…¹¡½É=™™Í•Ð€ôÉ…¹”¹ÍÑ…ÉÑ=™™Í•Ðì(€€€±•Ð™½ÕÍ9½‘”€ôÉ…¹”¹•¹‘½¹Ñ…¥¹•È°™½ÕÍ=™™Í•Ð€ôÉ…¹”¹•¹‘=™™Í•Ðì(€€€±•ÐÕÉÉ•¹Ñ¹¡½È€ôÙ¥•Ü¹‘½µÑA½Ì¡Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹…¹¡½È¤ì(€€€¥˜€¡¥ÍÅÕ¥Ù…±•¹ÑA½Í¥Ñ¥½¸¡ÕÉÉ•¹Ñ¹¡½È¹¹½‘”°ÕÉÉ•¹Ñ¹¡½È¹½™™Í•Ð°™½ÕÍ9½‘”°™½ÕÍ=™™Í•Ð¤¤(€€€€€m…¹¡½É9½‘”°…¹¡½É=™™Í•Ð°™½ÕÍ9½‘”°™½ÕÍ=™™Í•Ñt€ôm™½ÕÍ9½‘”°™½ÕÍ=™™Í•Ð°…¹¡½É9½‘”°…¹¡½É=™™Í•Ñtì(€€€É•ÑÕÉ¸ì…¹¡½É9½‘”°…¹¡½É=™™Í•Ð°™½ÕÍ9½‘”°™½ÕÍ=™™Í•Ðôì(€ô(€™Õ¹Ñ¥½¸Í…™…É¥M¡…‘½ÝM•±•Ñ¥½¹I…¹”¡Ù¥•Ü°Í•±•Ñ¥½¸¤ì(€€€¥˜€¡Í•±•Ñ¥½¸¹•Ñ½µÁ½Í•‘I…¹•Ì¤ì(€€€€€±•ÐÉ…¹”€ôÍ•±•Ñ¥½¸¹•Ñ½µÁ½Í•‘I…¹•Ì¡Ù¥•Ü¹É½½Ð¥lÁtì(€€€€€¥˜€¡É…¹”¤(€€€€€€€É•ÑÕÉ¸É…¹•Q½M•±•Ñ¥½¹I…¹”¡Ù¥•Ü°É…¹”¤ì(€€€ô(€€€±•Ð™½Õ¹Ìì(€€€™Õ¹Ñ¥½¸É•…¡•Ù•¹Ð¤ì(€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€€€•Ù•¹Ð¹ÍÑ½Á%µµ•‘¥…Ñ•AÉ½Á……Ñ¥½¸ ¤ì(€€€€€™½Õ¹Ì€ô•Ù•¹Ð¹•ÑQ…É•ÑI…¹•Ì ¥lÁtì(€€€ô(€€€Ù¥•Ü¹‘½´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰‰•™½É•¥¹ÁÕÐˆ°É•…°ÑÉÕ”¤ì(€€€‘½Õµ•¹Ð¹•á•½µµ…¹ ‰¥¹‘•¹Ðˆ¤ì(€€€Ù¥•Ü¹‘½´¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È ‰‰•™½É•¥¹ÁÕÐˆ°É•…°ÑÉÕ”¤ì(€€€É•ÑÕÉ¸™½Õ¹Ì€üÉ…¹•Q½M•±•Ñ¥½¹I…¹”¡Ù¥•Ü°™½Õ¹Ì¤€è¹Õ±°ì(€ô(€™Õ¹Ñ¥½¸‰±½­A…É•¹Ð¡Ù¥•Ü°¹½‘”¤ì(€€€™½È€¡±•ÐÀ€ô¹½‘”¹Á…É•¹Ñ9½‘”ìÀ€˜˜À€„ôÙ¥•Ü¹‘½´ìÀ€ôÀ¹Á…É•¹Ñ9½‘”¤ì(€€€€€±•Ð‘•ÍŒ€ôÙ¥•Ü¹‘½Y¥•Ü¹¹•…É•ÍÑ•ÍŒ¡À°ÑÉÕ”¤ì(€€€€€¥˜€¡‘•ÍŒ€˜˜‘•ÍŒ¹¹½‘”¹¥Í	±½¬¤(€€€€€€€É•ÑÕÉ¸Àì(€€€ô(€€€É•ÑÕÉ¸¹Õ±°ì(€ô(€™Õ¹Ñ¥½¸™¥áUÁ	…‘M…™…É¥½µÁ½Í¥Ñ¥½¸¡Ù¥•Ü°…‘‘•‘9½‘•Ì¤ì(€€€Ù…È}„ì(€€€±•Ðì™½ÕÍ9½‘”°™½ÕÍ=™™Í•Ðô€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€™½È€¡±•Ð¹½‘”½˜…‘‘•‘9½‘•Ì¤ì(€€€€€¥˜€  ¡}„€ô¹½‘”¹Á…É•¹Ñ9½‘”¤€ôôô¹Õ±°ñð}„€ôôôÙ½¥€À€üÙ½¥€À€è}„¹¹½‘•9…µ”¤€ôô€‰QHˆ¤ì(€€€€€€€±•Ð¹•áÑ•±°€ô¹½‘”¹¹•áÑM¥‰±¥¹œì(€€€€€€€Ý¡¥±”€¡¹•áÑ•±°€˜˜€¡¹•áÑ•±°¹¹½‘•9…µ”€„ô€‰Qˆ€˜˜¹•áÑ•±°¹¹½‘•9…µ”€„ô€‰Q ˆ¤¤(€€€€€€€€€¹•áÑ•±°€ô¹•áÑ•±°¹¹•áÑM¥‰±¥¹œì(€€€€€€€¥˜€¡¹•áÑ•±°¤ì(€€€€€€€€€±•ÐÁ…É•¹Ð€ô¹•áÑ•±°ì(€€€€€€€€€™½È€ ì€ì€¤ì(€€€€€€€€€€€±•Ð™¥ÉÍÐ€ôÁ…É•¹Ð¹™¥ÉÍÑ¡¥±ì(€€€€€€€€€€€¥˜€ …™¥ÉÍÐñð€…¥Í±Ð¡™¥ÉÍÐ¤ñð™¥ÉÍÐ¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆñð€½x¡	Iñ%5¤¼¹Ñ•ÍÐ¡™¥ÉÍÐ¹¹½‘•9…µ”¤¤(€€€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€€€Á…É•¹Ð€ô™¥ÉÍÐì(€€€€€€€€€ô(€€€€€€€€€Á…É•¹Ð¹¥¹Í•ÉÑ	•™½É”¡¹½‘”°Á…É•¹Ð¹™¥ÉÍÑ¡¥±¤ì(€€€€€€€€€¥˜€¡™½ÕÍ9½‘”€ôô¹½‘”¤(€€€€€€€€€€€Ù¥•Ü¹‘½µM•±•Ñ¥½¸ ¤¹½±±…ÁÍ”¡¹½‘”°™½ÕÍ=™™Í•Ð¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€¹½‘”¹Á…É•¹Ñ9½‘”¹É•µ½Ù•¡¥±¡¹½‘”¤ì(€€€€€€€ô(€€€€€ô(€€€ô(€ô(€™Õ¹Ñ¥½¸Á…ÉÍ•	•ÑÝ••¸¡Ù¥•Ü°™É½µ|°Ñ½|°…‘‘•‘9½‘•Ì¤ì(€€€±•Ðì¹½‘”èÁ…É•¹Ð°™É½µ=™™Í•Ð°Ñ½=™™Í•Ð°™É½´è™É½´È°Ñ¼ô€ôÙ¥•Ü¹‘½Y¥•Ü¹Á…ÉÍ•I…¹”¡™É½µ|°Ñ½|¤ì(€€€±•Ð‘½µM•°€ôÙ¥•Ü¹‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€±•Ð™¥¹Èì(€€€±•Ð…¹¡½È€ô‘½µM•°¹…¹¡½É9½‘”ì(€€€¥˜€¡…¹¡½È€˜˜½¹Ñ…¥¹Ì¡Ù¥•Ü¹‘½´°…¹¡½È¤¤ì(€€€€€™¥¹È€ômì¹½‘”è…¹¡½È°½™™Í•Ðè‘½µM•°¹…¹¡½É=™™Í•Ðõtì(€€€€€¥˜€ …Í•±•Ñ¥½¹½±±…ÁÍ•¡‘½µM•°¤¤(€€€€€€€™¥¹È¹ÁÕÍ ¡ì¹½‘”è‘½µM•°¹™½ÕÍ9½‘”°½™™Í•Ðè‘½µM•°¹™½ÕÍ=™™Í•Ðô¤ì(€€€ô(€€€¥˜€¡¡É½µ”€˜˜Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘”€ôôô€à¤ì(€€€€€™½È€¡±•Ð½™˜€ôÑ½=™™Í•Ðì½™˜€ø™É½µ=™™Í•Ðì½™˜´´¤ì(€€€€€€€±•Ð¹½‘”€ôÁ…É•¹Ð¹¡¥±‘9½‘•Ím½™˜€´€Åt°‘•ÍŒ€ô¹½‘”¹ÁµY¥•Ý•ÍŒì(€€€€€€€¥˜€¡¹½‘”¹¹½‘•9…µ”€ôô€‰	Hˆ€˜˜€…‘•ÍŒ¤ì(€€€€€€€€€Ñ½=™™Í•Ð€ô½™˜ì(€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€€€¥˜€ …‘•ÍŒñð‘•ÍŒ¹Í¥é”¤(€€€€€€€€€‰É•…¬ì(€€€€€ô(€€€ô(€€€±•ÐÍÑ…ÉÑ½Œ€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œì(€€€±•ÐÁ…ÉÍ•È€ôÙ¥•Ü¹Í½µ•AÉ½À ‰‘½µA…ÉÍ•Èˆ¤ñð=5A…ÉÍ•ÈÌ¹™É½µM¡•µ„¡Ù¥•Ü¹ÍÑ…Ñ”¹Í¡•µ„¤ì(€€€±•Ð€‘™É½´€ôÍÑ…ÉÑ½Œ¹É•Í½±Ù”¡™É½´È¤ì(€€€±•ÐÍ•°€ô¹Õ±°°‘½ŒÔ€ôÁ…ÉÍ•È¹Á…ÉÍ”¡Á…É•¹Ð°ì(€€€€€Ñ½Á9½‘”è€‘™É½´¹Á…É•¹Ð°(€€€€€Ñ½Á5…Ñ è€‘™É½´¹Á…É•¹Ð¹½¹Ñ•¹Ñ5…Ñ¡Ð ‘™É½´¹¥¹‘•à ¤¤°(€€€€€Ñ½Á=Á•¸èÑÉÕ”°(€€€€€™É½´è™É½µ=™™Í•Ð°(€€€€€Ñ¼èÑ½=™™Í•Ð°(€€€€€ÁÉ•Í•ÉÙ•]¡¥Ñ•ÍÁ…”è€‘™É½´¹Á…É•¹Ð¹ÑåÁ”¹Ý¡¥Ñ•ÍÁ…”€ôô€‰ÁÉ”ˆ€ü€‰™Õ±°ˆ€èÑÉÕ”°(€€€€€™¥¹‘A½Í¥Ñ¥½¹Ìè™¥¹È°(€€€€€ÉÕ±•É½µ9½‘”èÉÕ±•É½µ9½‘”¡…‘‘•‘9½‘•Ì¤°(€€€€€½¹Ñ•áÐè€‘™É½´(€€€ô¤ì(€€€¥˜€¡™¥¹È€˜˜™¥¹ÉlÁt¹Á½Ì€„ô¹Õ±°¤ì(€€€€€±•Ð…¹¡½ÈÈ€ô™¥¹ÉlÁt¹Á½Ì°¡•…€ô™¥¹ÉlÅt€˜˜™¥¹ÉlÅt¹Á½Ìì(€€€€€¥˜€¡¡•…€ôô¹Õ±°¤(€€€€€€€¡•…€ô…¹¡½ÈÈì(€€€€€Í•°€ôì…¹¡½Èè…¹¡½ÈÈ€¬™É½´È°¡•…è¡•…€¬™É½´Èôì(€€€ô(€€€É•ÑÕÉ¸ì‘½Œè‘½ŒÔ°Í•°°™É½´è™É½´È°Ñ¼ôì(€ô(€Ù…ÈÉÕ±•É½µ9½‘”€ô€¡…‘‘•¤€ôø€¡‘½´¤€ôøì(€€€±•Ð‘•ÍŒ€ô‘½´¹ÁµY¥•Ý•ÍŒì(€€€¥˜€¡‘•ÍŒ¤ì(€€€€€É•ÑÕÉ¸‘•ÍŒ¹Á…ÉÍ•IÕ±”¡…‘‘•¤ì(€€€ô•±Í”¥˜€¡‘½´¹¹½‘•9…µ”€ôô€‰	Hˆ€˜˜‘½´¹Á…É•¹Ñ9½‘”¤ì(€€€€€¥˜€¡Í…™…É¤€˜˜€½x¡Õ±ñ½°¤½¤¹Ñ•ÍÐ¡‘½´¹Á…É•¹Ñ9½‘”¹¹½‘•9…µ”¤¤ì(€€€€€€€±•ÐÍ­¥À€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€€€Í­¥À¹…ÁÁ•¹‘¡¥±¡‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰±¤ˆ¤¤ì(€€€€€€€É•ÑÕÉ¸ìÍ­¥Àôì(€€€€€ô•±Í”¥˜€¡‘½´¹Á…É•¹Ñ9½‘”¹±…ÍÑ¡¥±€ôô‘½´ñðÍ…™…É¤€˜˜€½x¡ÑÉñÑ…‰±”¤½¤¹Ñ•ÍÐ¡‘½´¹Á…É•¹Ñ9½‘”¹¹½‘•9…µ”¤¤ì(€€€€€€€É•ÑÕÉ¸ì¥¹½É”èÑÉÕ”ôì(€€€€€ô(€€€ô•±Í”¥˜€¡‘½´¹¹½‘•9…µ”€ôô€‰%5ˆ€˜˜‘½´¹•ÑÑÑÉ¥‰ÕÑ” ‰µ…É¬µÁ±…•¡½±‘•Èˆ¤¤ì(€€€€€É•ÑÕÉ¸ì¥¹½É”èÑÉÕ”ôì(€€€ô(€€€É•ÑÕÉ¸¹Õ±°ì(€ôì(€Ù…È¥Í%¹±¥¹”€ô€½x¡…ñ…‰‰Éñ…É½¹åµñ‰ñ‰‘m¥½uñ‰¥ñ‰Éñ‰ÕÑÑ½¹ñ¥Ñ•ñ½‘•ñ‘…Ñ„¡±¥ÍÐ¤ýñ‘•±ñ‘™¹ñ•µñ¥ñ¥µñ¥¹Íñ­‰‘ñ±…‰•±ñµ…Áñµ…É­ñµ•Ñ•Éñ½ÕÑÁÕÑñÅñÉÕ‰åñÍñÍ…µÁñÍµ…±±ñÍÁ…¹ñÍÑÉ½¹ñÍÕm‰ÁuñÑ¥µ•ñÕñÑÑñÙ…È¤½¤ì(€™Õ¹Ñ¥½¸É•…‘=5¡…¹”¡Ù¥•Ü°™É½´È°Ñ¼°ÑåÁ•=Ù•È°…‘‘•‘9½‘•Ì¤ì(€€€±•Ð½µÁ½Í¥Ñ¥½¹%€ôÙ¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹A•¹‘¥¹¡…¹•Ìñð€¡Ù¥•Ü¹½µÁ½Í¥¹œ€üÙ¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹%€è€À¤ì(€€€Ù¥•Ü¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹A•¹‘¥¹¡…¹•Ì€ô€Àì(€€€¥˜€¡™É½´È€ð€À¤ì(€€€€€±•Ð½É¥¥¸€ôÙ¥•Ü¹¥¹ÁÕÐ¹±…ÍÑM•±•Ñ¥½¹Q¥µ”€ø…Ñ”¹¹½Ü ¤€´€ÔÀ€üÙ¥•Ü¹¥¹ÁÕÐ¹±…ÍÑM•±•Ñ¥½¹=É¥¥¸€è¹Õ±°ì(€€€€€±•Ð¹•ÝM•°€ôÍ•±•Ñ¥½¹É½µ=4¡Ù¥•Ü°½É¥¥¸¤ì(€€€€€¥˜€¡¹•ÝM•°€˜˜€…Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹•Ä¡¹•ÝM•°¤¤ì(€€€€€€€¥˜€¡¡É½µ”€˜˜…¹‘É½¥€˜˜Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘”€ôôô€ÄÌ€˜˜…Ñ”¹¹½Ü ¤€´€ÄÀÀ€ðÙ¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘•Q¥µ”€˜˜Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•-•å½Ý¸ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°­•åÙ•¹Ð ÄÌ°€‰¹Ñ•Èˆ¤¤¤¤(€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€±•ÐÑÈ€ôÙ¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹Í•ÑM•±•Ñ¥½¸¡¹•ÝM•°¤ì(€€€€€€€¥˜€¡½É¥¥¸€ôô€‰Á½¥¹Ñ•Èˆ¤(€€€€€€€€€ÑÈ¹Í•Ñ5•Ñ„ ‰Á½¥¹Ñ•Èˆ°ÑÉÕ”¤ì(€€€€€€€•±Í”¥˜€¡½É¥¥¸€ôô€‰­•äˆ¤(€€€€€€€€€ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤ì(€€€€€€€¥˜€¡½µÁ½Í¥Ñ¥½¹%¤(€€€€€€€€€ÑÈ¹Í•Ñ5•Ñ„ ‰½µÁ½Í¥Ñ¥½¸ˆ°½µÁ½Í¥Ñ¥½¹%¤ì(€€€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡ÑÈ¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€±•Ð€‘‰•™½É”€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡™É½´È¤ì(€€€±•ÐÍ¡…É•€ô€‘‰•™½É”¹Í¡…É•‘•ÁÑ ¡Ñ¼¤ì(€€€™É½´È€ô€‘‰•™½É”¹‰•™½É”¡Í¡…É•€¬€Ä¤ì(€€€Ñ¼€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡Ñ¼¤¹…™Ñ•È¡Í¡…É•€¬€Ä¤ì(€€€±•ÐÍ•°€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€±•ÐÁ…ÉÍ”€ôÁ…ÉÍ•	•ÑÝ••¸¡Ù¥•Ü°™É½´È°Ñ¼°…‘‘•‘9½‘•Ì¤ì(€€€±•Ð‘½ŒÔ€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ°½µÁ…É”€ô‘½ŒÔ¹Í±¥”¡Á…ÉÍ”¹™É½´°Á…ÉÍ”¹Ñ¼¤ì(€€€±•ÐÁÉ•™•ÉÉ•‘A½Ì°ÁÉ•™•ÉÉ•‘M¥‘”ì(€€€¥˜€¡Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘”€ôôô€à€˜˜…Ñ”¹¹½Ü ¤€´€ÄÀÀ€ðÙ¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘•Q¥µ”¤ì(€€€€€ÁÉ•™•ÉÉ•‘A½Ì€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼ì(€€€€€ÁÉ•™•ÉÉ•‘M¥‘”€ô€‰•¹ˆì(€€€ô•±Í”ì(€€€€€ÁÉ•™•ÉÉ•‘A½Ì€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´ì(€€€€€ÁÉ•™•ÉÉ•‘M¥‘”€ô€‰ÍÑ…ÉÐˆì(€€€ô(€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ-•å½‘”€ô¹Õ±°ì(€€€±•Ð¡…¹”€ô™¥¹‘¥™˜¡½µÁ…É”¹½¹Ñ•¹Ð°Á…ÉÍ”¹‘½Œ¹½¹Ñ•¹Ð°Á…ÉÍ”¹™É½´°ÁÉ•™•ÉÉ•‘A½Ì°ÁÉ•™•ÉÉ•‘M¥‘”¤ì(€€€¥˜€¡¡…¹”¤(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹‘½µ¡…¹•½Õ¹Ð¬¬ì(€€€¥˜€ ¡¥½Ì€˜˜Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ%=M¹Ñ•È€ø…Ñ”¹¹½Ü ¤€´€ÈÈÔñð…¹‘É½¥¤€˜˜…‘‘•‘9½‘•Ì¹Í½µ” ¡¸¤€ôø¥Í±Ð¡¸¤€˜˜€…¥Í%¹±¥¹”¹Ñ•ÍÐ¡¸¹¹½‘•9…µ”¤¤€˜˜€ …¡…¹”ñð¡…¹”¹•¹‘€øô¡…¹”¹•¹‘¤€˜˜Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•-•å½Ý¸ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°­•åÙ•¹Ð ÄÌ°€‰¹Ñ•Èˆ¤¤¤¤ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ%=M¹Ñ•È€ô€Àì(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€¥˜€ …¡…¹”¤ì(€€€€€¥˜€¡ÑåÁ•=Ù•È€˜˜Í•°¥¹ÍÑ…¹•½˜Q•áÑM•±•Ñ¥½¸€˜˜€…Í•°¹•µÁÑä€˜˜Í•°¸‘¡•…¹Í…µ•A…É•¹Ð¡Í•°¸‘…¹¡½È¤€˜˜€…Ù¥•Ü¹½µÁ½Í¥¹œ€˜˜€„¡Á…ÉÍ”¹Í•°€˜˜Á…ÉÍ”¹Í•°¹…¹¡½È€„ôÁ…ÉÍ”¹Í•°¹¡•…¤¤ì(€€€€€€€¡…¹”€ôìÍÑ…ÉÐèÍ•°¹™É½´°•¹‘èÍ•°¹Ñ¼°•¹‘èÍ•°¹Ñ¼ôì(€€€€€ô•±Í”ì(€€€€€€€¥˜€¡Á…ÉÍ”¹Í•°¤ì(€€€€€€€€€±•ÐÍ•°È€ôÉ•Í½±Ù•M•±•Ñ¥½¸¡Ù¥•Ü°Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ°Á…ÉÍ”¹Í•°¤ì(€€€€€€€€€¥˜€¡Í•°È€˜˜€…Í•°È¹•Ä¡Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¤¤ì(€€€€€€€€€€€±•ÐÑÈ€ôÙ¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Í•°È¤ì(€€€€€€€€€€€¥˜€¡½µÁ½Í¥Ñ¥½¹%¤(€€€€€€€€€€€€€ÑÈ¹Í•Ñ5•Ñ„ ‰½µÁ½Í¥Ñ¥½¸ˆ°½µÁ½Í¥Ñ¥½¹%¤ì(€€€€€€€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡ÑÈ¤ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô(€€€ô(€€€¥˜€¡Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´€ðÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼€˜˜¡…¹”¹ÍÑ…ÉÐ€ôô¡…¹”¹•¹‘€˜˜Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¥¹ÍÑ…¹•½˜Q•áÑM•±•Ñ¥½¸¤ì(€€€€€¥˜€¡¡…¹”¹ÍÑ…ÉÐ€øÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´€˜˜¡…¹”¹ÍÑ…ÉÐ€ðôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´€¬€È€˜˜Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´€øôÁ…ÉÍ”¹™É½´¤ì(€€€€€€€¡…¹”¹ÍÑ…ÉÐ€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´ì(€€€€€ô•±Í”¥˜€¡¡…¹”¹•¹‘€ðÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼€˜˜¡…¹”¹•¹‘€øôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼€´€È€˜˜Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼€ðôÁ…ÉÍ”¹Ñ¼¤ì(€€€€€€€¡…¹”¹•¹‘€¬ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼€´¡…¹”¹•¹‘ì(€€€€€€€¡…¹”¹•¹‘€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼ì(€€€€€ô(€€€ô(€€€¥˜€¡¥”€˜˜¥•}Ù•ÉÍ¥½¸€ðô€ÄÄ€˜˜¡…¹”¹•¹‘€ôô¡…¹”¹ÍÑ…ÉÐ€¬€Ä€˜˜¡…¹”¹•¹‘€ôô¡…¹”¹ÍÑ…ÉÐ€˜˜¡…¹”¹ÍÑ…ÉÐ€øÁ…ÉÍ”¹™É½´€˜˜Á…ÉÍ”¹‘½Œ¹Ñ•áÑ	•ÑÝ••¸¡¡…¹”¹ÍÑ…ÉÐ€´Á…ÉÍ”¹™É½´€´€Ä°¡…¹”¹ÍÑ…ÉÐ€´Á…ÉÍ”¹™É½´€¬€Ä¤€ôô€ˆqáÀˆ¤ì(€€€€€¡…¹”¹ÍÑ…ÉÐ´´ì(€€€€€¡…¹”¹•¹‘´´ì(€€€€€¡…¹”¹•¹‘´´ì(€€€ô(€€€±•Ð€‘™É½´€ôÁ…ÉÍ”¹‘½Œ¹É•Í½±Ù•9½…¡”¡¡…¹”¹ÍÑ…ÉÐ€´Á…ÉÍ”¹™É½´¤ì(€€€±•Ð€‘Ñ¼€ôÁ…ÉÍ”¹‘½Œ¹É•Í½±Ù•9½…¡”¡¡…¹”¹•¹‘€´Á…ÉÍ”¹™É½´¤ì(€€€±•Ð€‘™É½µ€ô‘½ŒÔ¹É•Í½±Ù”¡¡…¹”¹ÍÑ…ÉÐ¤ì(€€€±•Ð¥¹±¥¹•¡…¹”€ô€‘™É½´¹Í…µ•A…É•¹Ð ‘Ñ¼¤€˜˜€‘™É½´¹Á…É•¹Ð¹¥¹±¥¹•½¹Ñ•¹Ð€˜˜€‘™É½µ¹•¹ ¤€øô¡…¹”¹•¹‘ì(€€€¥˜€ ¡¥½Ì€˜˜Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ%=M¹Ñ•È€ø…Ñ”¹¹½Ü ¤€´€ÈÈÔ€˜˜€ …¥¹±¥¹•¡…¹”ñð…‘‘•‘9½‘•Ì¹Í½µ” ¡¸¤€ôø¸¹¹½‘•9…µ”€ôô€‰%Xˆñð¸¹¹½‘•9…µ”€ôô€‰@ˆ¤¤ñð€…¥¹±¥¹•¡…¹”€˜˜±½½­Í1¥­•¹Ñ•È¡Á…ÉÍ”¹‘½Œ°€‘™É½´¹Á½Ì°€‘Ñ¼¹Á½Ì¤¤€˜˜Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•-•å½Ý¸ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°­•åÙ•¹Ð ÄÌ°€‰¹Ñ•Èˆ¤¤¤¤ì(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ%=M¹Ñ•È€ô€Àì(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€¥˜€¡Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹…¹¡½È€ø¡…¹”¹ÍÑ…ÉÐ€˜˜±½½­Í1¥­•	…­ÍÁ…”¡‘½ŒÔ°¡…¹”¹ÍÑ…ÉÐ°¡…¹”¹•¹‘°€‘™É½´°€‘Ñ¼¤€˜˜Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•-•å½Ý¸ˆ°€¡˜¤€ôø˜¡Ù¥•Ü°­•åÙ•¹Ð à°€‰	…­ÍÁ…”ˆ¤¤¤¤ì(€€€€€¥˜€¡…¹‘É½¥€˜˜¡É½µ”¤(€€€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÕÁÁÉ•ÍÍM•±•Ñ¥½¹UÁ‘…Ñ•Ì ¤ì(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€¥˜€¡¡É½µ”€˜˜¡…¹”¹•¹‘€ôô¡…¹”¹ÍÑ…ÉÐ¤(€€€€€Ù¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ¡É½µ••±•Ñ”€ô…Ñ”¹¹½Ü ¤ì(€€€¥˜€¡…¹‘É½¥€˜˜€…¥¹±¥¹•¡…¹”€˜˜€‘™É½´¹ÍÑ…ÉÐ ¤€„ô€‘Ñ¼¹ÍÑ…ÉÐ ¤€˜˜€‘Ñ¼¹Á…É•¹Ñ=™™Í•Ð€ôô€À€˜˜€‘™É½´¹‘•ÁÑ €ôô€‘Ñ¼¹‘•ÁÑ €˜˜Á…ÉÍ”¹Í•°€˜˜Á…ÉÍ”¹Í•°¹…¹¡½È€ôôÁ…ÉÍ”¹Í•°¹¡•…€˜˜Á…ÉÍ”¹Í•°¹¡•…€ôô¡…¹”¹•¹‘¤ì(€€€€€¡…¹”¹•¹‘€´ô€Èì(€€€€€€‘Ñ¼€ôÁ…ÉÍ”¹‘½Œ¹É•Í½±Ù•9½…¡”¡¡…¹”¹•¹‘€´Á…ÉÍ”¹™É½´¤ì(€€€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€€€Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•-•å½Ý¸ˆ°™Õ¹Ñ¥½¸¡˜¤ì(€€€€€€€€€É•ÑÕÉ¸˜¡Ù¥•Ü°­•åÙ•¹Ð ÄÌ°€‰¹Ñ•Èˆ¤¤ì(€€€€€€€ô¤ì(€€€€€ô°€ÈÀ¤ì(€€€ô(€€€±•Ð¡É½´€ô¡…¹”¹ÍÑ…ÉÐ°¡Q¼€ô¡…¹”¹•¹‘ì(€€€±•Ðµ­QÈ€ô€¡‰…Í”È¤€ôøì(€€€€€±•ÐÑÈ€ô‰…Í”ÈñðÙ¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹É•Á±…”¡¡É½´°¡Q¼°Á…ÉÍ”¹‘½Œ¹Í±¥”¡¡…¹”¹ÍÑ…ÉÐ€´Á…ÉÍ”¹™É½´°¡…¹”¹•¹‘€´Á…ÉÍ”¹™É½´¤¤ì(€€€€€¥˜€¡Á…ÉÍ”¹Í•°¤ì(€€€€€€€±•ÐÍ•°È€ôÉ•Í½±Ù•M•±•Ñ¥½¸¡Ù¥•Ü°ÑÈ¹‘½Œ°Á…ÉÍ”¹Í•°¤ì(€€€€€€€¥˜€¡Í•°È€˜˜€„¡¡É½µ”€˜˜Ù¥•Ü¹½µÁ½Í¥¹œ€˜˜Í•°È¹•µÁÑä€˜˜€¡¡…¹”¹ÍÑ…ÉÐ€„ô¡…¹”¹•¹‘ñðÙ¥•Ü¹¥¹ÁÕÐ¹±…ÍÑ¡É½µ••±•Ñ”€ð…Ñ”¹¹½Ü ¤€´€ÄÀÀ¤€˜˜€¡Í•°È¹¡•…€ôô¡É½´ñðÍ•°È¹¡•…€ôôÑÈ¹µ…ÁÁ¥¹œ¹µ…À¡¡Q¼¤€´€Ä¤ñð¥”€˜˜Í•°È¹•µÁÑä€˜˜Í•°È¹¡•…€ôô¡É½´¤¤(€€€€€€€€€ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Í•°È¤ì(€€€€€ô(€€€€€¥˜€¡½µÁ½Í¥Ñ¥½¹%¤(€€€€€€€ÑÈ¹Í•Ñ5•Ñ„ ‰½µÁ½Í¥Ñ¥½¸ˆ°½µÁ½Í¥Ñ¥½¹%¤ì(€€€€€É•ÑÕÉ¸ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤ì(€€€ôì(€€€±•Ðµ…É­¡…¹”ì(€€€¥˜€¡¥¹±¥¹•¡…¹”¤ì(€€€€€¥˜€ ‘™É½´¹Á½Ì€ôô€‘Ñ¼¹Á½Ì¤ì(€€€€€€€¥˜€¡¥”€˜˜¥•}Ù•ÉÍ¥½¸€ðô€ÄÄ€˜˜€‘™É½´¹Á…É•¹Ñ=™™Í•Ð€ôô€À¤ì(€€€€€€€€€Ù¥•Ü¹‘½µ=‰Í•ÉÙ•È¹ÍÕÁÁÉ•ÍÍM•±•Ñ¥½¹UÁ‘…Ñ•Ì ¤ì(€€€€€€€€€Í•ÑQ¥µ•½ÕÐ  ¤€ôøÍ•±•Ñ¥½¹Q½=4¡Ù¥•Ü¤°€ÈÀ¤ì(€€€€€€€ô(€€€€€€€±•ÐÑÈ€ôµ­QÈ¡Ù¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹‘•±•Ñ”¡¡É½´°¡Q¼¤¤ì(€€€€€€€±•Ðµ…É­Ì€ô‘½ŒÔ¹É•Í½±Ù”¡¡…¹”¹ÍÑ…ÉÐ¤¹µ…É­ÍÉ½ÍÌ¡‘½ŒÔ¹É•Í½±Ù”¡¡…¹”¹•¹‘¤¤ì(€€€€€€€¥˜€¡µ…É­Ì¤(€€€€€€€€€ÑÈ¹•¹ÍÕÉ•5…É­Ì¡µ…É­Ì¤ì(€€€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡ÑÈ¤ì(€€€€€ô•±Í”¥˜€ (€€€€€€€€¼¼‘‘¥¹œ½ÈÉ•µ½Ù¥¹œ„µ…É¬(€€€€€€€¡…¹”¹•¹‘€ôô¡…¹”¹•¹‘€˜˜€¡µ…É­¡…¹”€ô¥Í5…É­¡…¹” ‘™É½´¹Á…É•¹Ð¹½¹Ñ•¹Ð¹ÕÐ ‘™É½´¹Á…É•¹Ñ=™™Í•Ð°€‘Ñ¼¹Á…É•¹Ñ=™™Í•Ð¤°€‘™É½µ¹Á…É•¹Ð¹½¹Ñ•¹Ð¹ÕÐ ‘™É½µ¹Á…É•¹Ñ=™™Í•Ð°¡…¹”¹•¹‘€´€‘™É½µ¹ÍÑ…ÉÐ ¤¤¤¤(€€€€€€¤ì(€€€€€€€±•ÐÑÈ€ôµ­QÈ¡Ù¥•Ü¹ÍÑ…Ñ”¹ÑÈ¤ì(€€€€€€€¥˜€¡µ…É­¡…¹”¹ÑåÁ”€ôô€‰…‘ˆ¤(€€€€€€€€€ÑÈ¹…‘‘5…É¬¡¡É½´°¡Q¼°µ…É­¡…¹”¹µ…É¬¤ì(€€€€€€€•±Í”(€€€€€€€€€ÑÈ¹É•µ½Ù•5…É¬¡¡É½´°¡Q¼°µ…É­¡…¹”¹µ…É¬¤ì(€€€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡ÑÈ¤ì(€€€€€ô•±Í”¥˜€ ‘™É½´¹Á…É•¹Ð¹¡¥± ‘™É½´¹¥¹‘•à ¤¤¹¥ÍQ•áÐ€˜˜€‘™É½´¹¥¹‘•à ¤€ôô€‘Ñ¼¹¥¹‘•à ¤€´€ ‘Ñ¼¹Ñ•áÑ=™™Í•Ð€ü€À€è€Ä¤¤ì(€€€€€€€±•ÐÑ•áÐÈ€ô€‘™É½´¹Á…É•¹Ð¹Ñ•áÑ	•ÑÝ••¸ ‘™É½´¹Á…É•¹Ñ=™™Í•Ð°€‘Ñ¼¹Á…É•¹Ñ=™™Í•Ð¤ì(€€€€€€€±•Ð‘•™±Ð€ô€ ¤€ôøµ­QÈ¡Ù¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹¥¹Í•ÉÑQ•áÐ¡Ñ•áÐÈ°¡É½´°¡Q¼¤¤ì(€€€€€€€¥˜€ …Ù¥•Ü¹Í½µ•AÉ½À ‰¡…¹‘±•Q•áÑ%¹ÁÕÐˆ°€¡˜¤€ôø˜¡Ù¥•Ü°¡É½´°¡Q¼°Ñ•áÐÈ°‘•™±Ð¤¤¤(€€€€€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡‘•™±Ð ¤¤ì(€€€€€ô•±Í”ì(€€€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡µ­QÈ ¤¤ì(€€€€€ô(€€€ô•±Í”ì(€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡µ­QÈ ¤¤ì(€€€ô(€ô(€™Õ¹Ñ¥½¸É•Í½±Ù•M•±•Ñ¥½¸¡Ù¥•Ü°‘½ŒÔ°Á…ÉÍ•‘M•°¤ì(€€€¥˜€¡5…Ñ ¹µ…à¡Á…ÉÍ•‘M•°¹…¹¡½È°Á…ÉÍ•‘M•°¹¡•…¤€ø‘½ŒÔ¹½¹Ñ•¹Ð¹Í¥é”¤(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€É•ÑÕÉ¸Í•±•Ñ¥½¹	•ÑÝ••¸¡Ù¥•Ü°‘½ŒÔ¹É•Í½±Ù”¡Á…ÉÍ•‘M•°¹…¹¡½È¤°‘½ŒÔ¹É•Í½±Ù”¡Á…ÉÍ•‘M•°¹¡•…¤¤ì(€ô(€™Õ¹Ñ¥½¸¥Í5…É­¡…¹”¡ÕÈ°ÁÉ•Ø¤ì(€€€±•ÐÕÉ5…É­Ì€ôÕÈ¹™¥ÉÍÑ¡¥±¹µ…É­Ì°ÁÉ•Ù5…É­Ì€ôÁÉ•Ø¹™¥ÉÍÑ¡¥±¹µ…É­Ìì(€€€±•Ð…‘‘•€ôÕÉ5…É­Ì°É•µ½Ù•€ôÁÉ•Ù5…É­Ì°ÑåÁ”°µ…É¬°ÕÁ‘…Ñ”ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðÁÉ•Ù5…É­Ì¹±•¹Ñ ì¤¬¬¤(€€€€€…‘‘•€ôÁÉ•Ù5…É­Ím¥t¹É•µ½Ù•É½µM•Ð¡…‘‘•¤ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðÕÉ5…É­Ì¹±•¹Ñ ì¤¬¬¤(€€€€€É•µ½Ù•€ôÕÉ5…É­Ím¥t¹É•µ½Ù•É½µM•Ð¡É•µ½Ù•¤ì(€€€¥˜€¡…‘‘•¹±•¹Ñ €ôô€Ä€˜˜É•µ½Ù•¹±•¹Ñ €ôô€À¤ì(€€€€€µ…É¬€ô…‘‘•‘lÁtì(€€€€€ÑåÁ”€ô€‰…‘ˆì(€€€€€ÕÁ‘…Ñ”€ô€¡¹½‘”¤€ôø¹½‘”¹µ…É¬¡µ…É¬¹…‘‘Q½M•Ð¡¹½‘”¹µ…É­Ì¤¤ì(€€€ô•±Í”¥˜€¡…‘‘•¹±•¹Ñ €ôô€À€˜˜É•µ½Ù•¹±•¹Ñ €ôô€Ä¤ì(€€€€€µ…É¬€ôÉ•µ½Ù•‘lÁtì(€€€€€ÑåÁ”€ô€‰É•µ½Ù”ˆì(€€€€€ÕÁ‘…Ñ”€ô€¡¹½‘”¤€ôø¹½‘”¹µ…É¬¡µ…É¬¹É•µ½Ù•É½µM•Ð¡¹½‘”¹µ…É­Ì¤¤ì(€€€ô•±Í”ì(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€ô(€€€±•ÐÕÁ‘…Ñ•€ômtì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðÁÉ•Ø¹¡¥±‘½Õ¹Ðì¤¬¬¤(€€€€€ÕÁ‘…Ñ•¹ÁÕÍ ¡ÕÁ‘…Ñ”¡ÁÉ•Ø¹¡¥±¡¤¤¤¤ì(€€€¥˜€¡É…µ•¹ÐÈ¹™É½´¡ÕÁ‘…Ñ•¤¹•Ä¡ÕÈ¤¤(€€€€€É•ÑÕÉ¸ìµ…É¬°ÑåÁ”ôì(€ô(€™Õ¹Ñ¥½¸±½½­Í1¥­•	…­ÍÁ…”¡½±°ÍÑ…ÉÐ°•¹°€‘¹•ÝMÑ…ÉÐ°€‘¹•Ý¹¤ì(€€€¥˜€ (€€€€€€¼¼Q¡”½¹Ñ•¹ÐµÕÍÐ¡…Ù”Í¡ÉÕ¹¬(€€€€€•¹€´ÍÑ…ÉÐ€ðô€‘¹•Ý¹¹Á½Ì€´€‘¹•ÝMÑ…ÉÐ¹Á½Ìñð€¼¼¹•Ý¹µÕÍÐÁ½¥¹Ð‘¥É•Ñ±ä…Ð½È…™Ñ•ÈÑ¡”•¹½˜Ñ¡”‰±½¬Ñ¡…Ð¹•ÝMÑ…ÉÐÁ½¥¹ÑÌ¥¹Ñ¼(€€€€€Í­¥Á±½Í¥¹¹‘=Á•¹¥¹œ ‘¹•ÝMÑ…ÉÐ°ÑÉÕ”°™…±Í”¤€ð€‘¹•Ý¹¹Á½Ì(€€€€¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ð€‘ÍÑ…ÉÐ€ô½±¹É•Í½±Ù”¡ÍÑ…ÉÐ¤ì(€€€¥˜€ „‘¹•ÝMÑ…ÉÐ¹Á…É•¹Ð¹¥ÍQ•áÑ‰±½¬¤ì(€€€€€±•Ð…™Ñ•È€ô€‘ÍÑ…ÉÐ¹¹½‘•™Ñ•Èì(€€€€€É•ÑÕÉ¸…™Ñ•È€„ô¹Õ±°€˜˜•¹€ôôÍÑ…ÉÐ€¬…™Ñ•È¹¹½‘•M¥é”ì(€€€ô(€€€¥˜€ ‘ÍÑ…ÉÐ¹Á…É•¹Ñ=™™Í•Ð€ð€‘ÍÑ…ÉÐ¹Á…É•¹Ð¹½¹Ñ•¹Ð¹Í¥é”ñð€„‘ÍÑ…ÉÐ¹Á…É•¹Ð¹¥ÍQ•áÑ‰±½¬¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ð€‘¹•áÐ€ô½±¹É•Í½±Ù”¡Í­¥Á±½Í¥¹¹‘=Á•¹¥¹œ ‘ÍÑ…ÉÐ°ÑÉÕ”°ÑÉÕ”¤¤ì(€€€¥˜€ „‘¹•áÐ¹Á…É•¹Ð¹¥ÍQ•áÑ‰±½¬ñð€‘¹•áÐ¹Á½Ì€ø•¹ñðÍ­¥Á±½Í¥¹¹‘=Á•¹¥¹œ ‘¹•áÐ°ÑÉÕ”°™…±Í”¤€ð•¹¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€É•ÑÕÉ¸€‘¹•ÝMÑ…ÉÐ¹Á…É•¹Ð¹½¹Ñ•¹Ð¹ÕÐ ‘¹•ÝMÑ…ÉÐ¹Á…É•¹Ñ=™™Í•Ð¤¹•Ä ‘¹•áÐ¹Á…É•¹Ð¹½¹Ñ•¹Ð¤ì(€ô(€™Õ¹Ñ¥½¸±½½­Í1¥­•¹Ñ•È¡½¹Ñ•¹Ð°™É½´È°Ñ¼¤ì(€€€±•Ð¹•ÝQ•áÑ±¥¹•Ì€ô€À°¹•Ý1•…Ù•Ì€ô€Àì(€€€½¹Ñ•¹Ð¹¹½‘•Í	•ÑÝ••¸¡™É½´È°Ñ¼°€¡¹½‘”°Á½Ì¤€ôøì(€€€€€¥˜€¡¹½‘”¹¥ÍQ•áÑ‰±½¬€˜˜Á½Ì€øô™É½´È€˜˜Á½Ì€ðÑ¼¤(€€€€€€€¹•ÝQ•áÑ±¥¹•Ì¬¬ì(€€€€€•±Í”¥˜€¡¹½‘”¹¥ÍQ•áÐ€ü€½qL¼¹Ñ•ÍÐ¡¹½‘”¹Ñ•áÐ¹Í±¥”¡5…Ñ ¹µ…à À°™É½´È€´Á½Ì¤°5…Ñ ¹µ¥¸¡¹½‘”¹¹½‘•M¥é”°Ñ¼€´Á½Ì¤¤¤€è¹½‘”¹¥Í1•…˜¤(€€€€€€€¹•Ý1•…Ù•Ì¬¬ì(€€€ô¤ì(€€€É•ÑÕÉ¸¹•Ý1•…Ù•Ì€ôô€À€˜˜¹•ÝQ•áÑ±¥¹•Ì€ôô€Äì(€ô(€™Õ¹Ñ¥½¸Í­¥Á±½Í¥¹¹‘=Á•¹¥¹œ ‘Á½Ì°™É½µ¹°µ…å=Á•¸¤ì(€€€±•Ð‘•ÁÑ €ô€‘Á½Ì¹‘•ÁÑ °•¹€ô™É½µ¹€ü€‘Á½Ì¹•¹ ¤€è€‘Á½Ì¹Á½Ìì(€€€Ý¡¥±”€¡‘•ÁÑ €ø€À€˜˜€¡™É½µ¹ñð€‘Á½Ì¹¥¹‘•á™Ñ•È¡‘•ÁÑ ¤€ôô€‘Á½Ì¹¹½‘”¡‘•ÁÑ ¤¹¡¥±‘½Õ¹Ð¤¤ì(€€€€€‘•ÁÑ ´´ì(€€€€€•¹¬¬ì(€€€€€™É½µ¹€ô™…±Í”ì(€€€ô(€€€¥˜€¡µ…å=Á•¸¤ì(€€€€€±•Ð¹•áÐ€ô€‘Á½Ì¹¹½‘”¡‘•ÁÑ ¤¹µ…å‰•¡¥± ‘Á½Ì¹¥¹‘•á™Ñ•È¡‘•ÁÑ ¤¤ì(€€€€€Ý¡¥±”€¡¹•áÐ€˜˜€…¹•áÐ¹¥Í1•…˜¤ì(€€€€€€€¹•áÐ€ô¹•áÐ¹™¥ÉÍÑ¡¥±ì(€€€€€€€•¹¬¬ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸•¹ì(€ô(€™Õ¹Ñ¥½¸™¥¹‘¥™˜¡„°ˆ°Á½Ì°ÁÉ•™•ÉÉ•‘A½Ì°ÁÉ•™•ÉÉ•‘M¥‘”¤ì(€€€±•ÐÍÑ…ÉÐ€ô„¹™¥¹‘¥™™MÑ…ÉÐ¡ˆ°Á½Ì¤°±•¹€ôÁ½Ì€¬„¹Í¥é”°±•¹€ôÁ½Ì€¬ˆ¹Í¥é”ì(€€€¥˜€¡ÍÑ…ÉÐ€ôô¹Õ±°¤(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€±•Ðì„è•¹‘°ˆè•¹‘ô€ô„¹™¥¹‘¥™™¹¡ˆ°±•¹°±•¹¤ì(€€€¥˜€¡ÁÉ•™•ÉÉ•‘M¥‘”€ôô€‰•¹ˆ¤ì(€€€€€±•Ð…‘©ÕÍÐ€ô5…Ñ ¹µ…à À°ÍÑ…ÉÐ€´5…Ñ ¹µ¥¸¡•¹‘°•¹‘¤¤ì(€€€€€ÁÉ•™•ÉÉ•‘A½Ì€´ô•¹‘€¬…‘©ÕÍÐ€´ÍÑ…ÉÐì(€€€ô(€€€¥˜€¡•¹‘€ðÍÑ…ÉÐ€˜˜±•¹€ð±•¹¤ì(€€€€€±•Ðµ½Ù”€ôÁÉ•™•ÉÉ•‘A½Ì€ðôÍÑ…ÉÐ€˜˜ÁÉ•™•ÉÉ•‘A½Ì€øô•¹‘€üÍÑ…ÉÐ€´ÁÉ•™•ÉÉ•‘A½Ì€è€Àì(€€€€€ÍÑ…ÉÐ€´ôµ½Ù”ì(€€€€€•¹‘€ôÍÑ…ÉÐ€¬€¡•¹‘€´•¹‘¤ì(€€€€€•¹‘€ôÍÑ…ÉÐì(€€€ô•±Í”¥˜€¡•¹‘€ðÍÑ…ÉÐ¤ì(€€€€€±•Ðµ½Ù”€ôÁÉ•™•ÉÉ•‘A½Ì€ðôÍÑ…ÉÐ€˜˜ÁÉ•™•ÉÉ•‘A½Ì€øô•¹‘€üÍÑ…ÉÐ€´ÁÉ•™•ÉÉ•‘A½Ì€è€Àì(€€€€€ÍÑ…ÉÐ€´ôµ½Ù”ì(€€€€€•¹‘€ôÍÑ…ÉÐ€¬€¡•¹‘€´•¹‘¤ì(€€€€€•¹‘€ôÍÑ…ÉÐì(€€€ô(€€€É•ÑÕÉ¸ìÍÑ…ÉÐ°•¹‘°•¹‘ôì(€ô(€Ù…È‘¥Ñ½ÉY¥•Ü€ô±…ÍÌì(€€€€¼¨¨(€€€É•…Ñ”„Ù¥•Ü¸Á±…•€µ…ä‰”„=4¹½‘”Ñ¡…ÐÑ¡”•‘¥Ñ½ÈÍ¡½Õ±(€€€‰”…ÁÁ•¹‘•Ñ¼°„™Õ¹Ñ¥½¸Ñ¡…ÐÝ¥±°Á±…”¥Ð¥¹Ñ¼Ñ¡”‘½Õµ•¹Ð°(€€€½È…¸½‰©•ÐÝ¡½Í”µ½Õ¹Ñ€ÁÉ½Á•ÉÑä¡½±‘ÌÑ¡”¹½‘”Ñ¼ÕÍ”…ÌÑ¡”(€€€‘½Õµ•¹Ð½¹Ñ…¥¹•È¸%˜¥Ð¥Ì¹Õ±±€°Ñ¡”•‘¥Ñ½ÈÝ¥±°¹½Ð‰”(€€€…‘‘•Ñ¼Ñ¡”‘½Õµ•¹Ð¸(€€€€¨¼(€€€½¹ÍÑÉÕÑ½È¡Á±…”°ÁÉ½ÁÌ¤ì(€€€€€Ñ¡¥Ì¹}É½½Ð€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹™½ÕÍ•€ô™…±Í”ì(€€€€€Ñ¡¥Ì¹ÑÉ…­]É¥Ñ•Ì€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹µ½Õ¹Ñ•€ô™…±Í”ì(€€€€€Ñ¡¥Ì¹µ…É­ÕÉÍ½È€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹ÕÉÍ½É]É…ÁÁ•È€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹±…ÍÑM•±•Ñ•‘Y¥•Ý•ÍŒ€ôÙ½¥€Àì(€€€€€Ñ¡¥Ì¹¥¹ÁÕÐ€ô¹•Ü%¹ÁÕÑMÑ…Ñ” ¤ì(€€€€€Ñ¡¥Ì¹ÁÉ•Ù¥É•ÑA±Õ¥¹Ì€ômtì(€€€€€Ñ¡¥Ì¹Á±Õ¥¹Y¥•ÝÌ€ômtì(€€€€€Ñ¡¥Ì¹É•ÅÕ¥É•Í•­½!…­9½‘”€ô™…±Í”ì(€€€€€Ñ¡¥Ì¹‘É…¥¹œ€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹}ÁÉ½ÁÌ€ôÁÉ½ÁÌì(€€€€€Ñ¡¥Ì¹ÍÑ…Ñ”€ôÁÉ½ÁÌ¹ÍÑ…Ñ”ì(€€€€€Ñ¡¥Ì¹‘¥É•ÑA±Õ¥¹Ì€ôÁÉ½ÁÌ¹Á±Õ¥¹Ìñðmtì(€€€€€Ñ¡¥Ì¹‘¥É•ÑA±Õ¥¹Ì¹™½É… ¡¡•­MÑ…Ñ•½µÁ½¹•¹Ð¤ì(€€€€€Ñ¡¥Ì¹‘¥ÍÁ…Ñ €ôÑ¡¥Ì¹‘¥ÍÁ…Ñ ¹‰¥¹¡Ñ¡¥Ì¤ì(€€€€€Ñ¡¥Ì¹‘½´€ôÁ±…”€˜˜Á±…”¹µ½Õ¹Ðñð‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€¥˜€¡Á±…”¤ì(€€€€€€€¥˜€¡Á±…”¹…ÁÁ•¹‘¡¥±¤(€€€€€€€€€Á±…”¹…ÁÁ•¹‘¡¥±¡Ñ¡¥Ì¹‘½´¤ì(€€€€€€€•±Í”¥˜€¡ÑåÁ•½˜Á±…”€ôô€‰™Õ¹Ñ¥½¸ˆ¤(€€€€€€€€€Á±…”¡Ñ¡¥Ì¹‘½´¤ì(€€€€€€€•±Í”¥˜€¡Á±…”¹µ½Õ¹Ð¤(€€€€€€€€€Ñ¡¥Ì¹µ½Õ¹Ñ•€ôÑÉÕ”ì(€€€€€ô(€€€€€Ñ¡¥Ì¹•‘¥Ñ…‰±”€ô•Ñ‘¥Ñ…‰±”¡Ñ¡¥Ì¤ì(€€€€€ÕÁ‘…Ñ•ÕÉÍ½É]É…ÁÁ•È¡Ñ¡¥Ì¤ì(€€€€€Ñ¡¥Ì¹¹½‘•Y¥•ÝÌ€ô‰Õ¥±‘9½‘•Y¥•ÝÌ¡Ñ¡¥Ì¤ì(€€€€€Ñ¡¥Ì¹‘½Y¥•Ü€ô‘½Y¥•Ý•ÍŒ¡Ñ¡¥Ì¹ÍÑ…Ñ”¹‘½Œ°½µÁÕÑ•½•¼¡Ñ¡¥Ì¤°Ù¥•Ý•½É…Ñ¥½¹Ì¡Ñ¡¥Ì¤°Ñ¡¥Ì¹‘½´°Ñ¡¥Ì¤ì(€€€€€Ñ¡¥Ì¹‘½µ=‰Í•ÉÙ•È€ô¹•Ü=5=‰Í•ÉÙ•È¡Ñ¡¥Ì°€¡™É½´È°Ñ¼°ÑåÁ•=Ù•È°…‘‘•¤€ôøÉ•…‘=5¡…¹”¡Ñ¡¥Ì°™É½´È°Ñ¼°ÑåÁ•=Ù•È°…‘‘•¤¤ì(€€€€€Ñ¡¥Ì¹‘½µ=‰Í•ÉÙ•È¹ÍÑ…ÉÐ ¤ì(€€€€€¥¹¥Ñ%¹ÁÕÐ¡Ñ¡¥Ì¤ì(€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•A±Õ¥¹Y¥•ÝÌ ¤ì(€€€ô(€€€€¼¨¨(€€€!½±‘ÌÑÉÕ•€Ý¡•¸„(€€€m½µÁ½Í¥Ñ¥½¹t¡¡ÑÑÁÌè¼½ÜÍŒ¹¥Ñ¡Õˆ¹¥¼½Õ¥•Ù•¹ÑÌ¼•Ù•¹ÑÌµ½µÁ½Í¥Ñ¥½¹•Ù•¹ÑÌ¤(€€€¥Ì…Ñ¥Ù”¸(€€€€¨¼(€€€•Ð½µÁ½Í¥¹œ ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹¥¹ÁÕÐ¹½µÁ½Í¥¹œì(€€€ô(€€€€¼¨¨(€€€Q¡”Ù¥•ÜÌÕÉÉ•¹ÐmÁÉ½ÁÍt¡¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½É•˜¼Ù¥•Ü¹‘¥Ñ½ÉAÉ½ÁÌ¤¸(€€€€¨¼(€€€•ÐÁÉ½ÁÌ ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹}ÁÉ½ÁÌ¹ÍÑ…Ñ”€„ôÑ¡¥Ì¹ÍÑ…Ñ”¤ì(€€€€€€€±•ÐÁÉ•Ø€ôÑ¡¥Ì¹}ÁÉ½ÁÌì(€€€€€€€Ñ¡¥Ì¹}ÁÉ½ÁÌ€ôíôì(€€€€€€€™½È€¡±•Ð¹…µ”¥¸ÁÉ•Ø¤(€€€€€€€€€Ñ¡¥Ì¹}ÁÉ½ÁÍm¹…µ•t€ôÁÉ•Ùm¹…µ•tì(€€€€€€€Ñ¡¥Ì¹}ÁÉ½ÁÌ¹ÍÑ…Ñ”€ôÑ¡¥Ì¹ÍÑ…Ñ”ì(€€€€€ô(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹}ÁÉ½ÁÌì(€€€ô(€€€€¼¨¨(€€€UÁ‘…Ñ”Ñ¡”Ù¥•ÜÌÁÉ½ÁÌ¸]¥±°¥µµ•‘¥…Ñ•±ä…ÕÍ”…¸ÕÁ‘…Ñ”Ñ¼(€€€Ñ¡”=4¸(€€€€¨¼(€€€ÕÁ‘…Ñ”¡ÁÉ½ÁÌ¤ì(€€€€€¥˜€¡ÁÉ½ÁÌ¹¡…¹‘±•=5Ù•¹ÑÌ€„ôÑ¡¥Ì¹}ÁÉ½ÁÌ¹¡…¹‘±•=5Ù•¹ÑÌ¤(€€€€€€€•¹ÍÕÉ•1¥ÍÑ•¹•ÉÌ¡Ñ¡¥Ì¤ì(€€€€€±•ÐÁÉ•ÙAÉ½ÁÌ€ôÑ¡¥Ì¹}ÁÉ½ÁÌì(€€€€€Ñ¡¥Ì¹}ÁÉ½ÁÌ€ôÁÉ½ÁÌì(€€€€€¥˜€¡ÁÉ½ÁÌ¹Á±Õ¥¹Ì¤ì(€€€€€€€ÁÉ½ÁÌ¹Á±Õ¥¹Ì¹™½É… ¡¡•­MÑ…Ñ•½µÁ½¹•¹Ð¤ì(€€€€€€€Ñ¡¥Ì¹‘¥É•ÑA±Õ¥¹Ì€ôÁÉ½ÁÌ¹Á±Õ¥¹Ìì(€€€€€ô(€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•MÑ…Ñ•%¹¹•È¡ÁÉ½ÁÌ¹ÍÑ…Ñ”°ÁÉ•ÙAÉ½ÁÌ¤ì(€€€ô(€€€€¼¨¨(€€€UÁ‘…Ñ”Ñ¡”Ù¥•Ü‰äÕÁ‘…Ñ¥¹œ•á¥ÍÑ¥¹œÁÉ½ÁÌ½‰©•ÐÝ¥Ñ Ñ¡”½‰©•Ð(€€€¥Ù•¸…Ì…ÉÕµ•¹Ð¸ÅÕ¥Ù…±•¹ÐÑ¼Ù¥•Ü¹ÕÁ‘…Ñ”¡=‰©•Ð¹…ÍÍ¥¸¡íô°(€€€Ù¥•Ü¹ÁÉ½ÁÌ°ÁÉ½ÁÌ¤¥€¸(€€€€¨¼(€€€Í•ÑAÉ½ÁÌ¡ÁÉ½ÁÌ¤ì(€€€€€±•ÐÕÁ‘…Ñ•€ôíôì(€€€€€™½È€¡±•Ð¹…µ”¥¸Ñ¡¥Ì¹}ÁÉ½ÁÌ¤(€€€€€€€ÕÁ‘…Ñ•‘m¹…µ•t€ôÑ¡¥Ì¹}ÁÉ½ÁÍm¹…µ•tì(€€€€€ÕÁ‘…Ñ•¹ÍÑ…Ñ”€ôÑ¡¥Ì¹ÍÑ…Ñ”ì(€€€€€™½È€¡±•Ð¹…µ”¥¸ÁÉ½ÁÌ¤(€€€€€€€ÕÁ‘…Ñ•‘m¹…µ•t€ôÁÉ½ÁÍm¹…µ•tì(€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ”¡ÕÁ‘…Ñ•¤ì(€€€ô(€€€€¼¨¨(€€€UÁ‘…Ñ”Ñ¡”•‘¥Ñ½ÈÌÍÑ…Ñ•€ÁÉ½À°Ý¥Ñ¡½ÕÐÑ½Õ¡¥¹œ…¹ä½˜Ñ¡”(€€€½Ñ¡•ÈÁÉ½ÁÌ¸(€€€€¨¼(€€€ÕÁ‘…Ñ•MÑ…Ñ”¡ÍÑ…Ñ”¤ì(€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•MÑ…Ñ•%¹¹•È¡ÍÑ…Ñ”°Ñ¡¥Ì¹}ÁÉ½ÁÌ¤ì(€€€ô(€€€ÕÁ‘…Ñ•MÑ…Ñ•%¹¹•È¡ÍÑ…Ñ”°ÁÉ•ÙAÉ½ÁÌ¤ì(€€€€€Ù…È}„ì(€€€€€±•ÐÁÉ•Ø€ôÑ¡¥Ì¹ÍÑ…Ñ”°É•‘É…Ü€ô™…±Í”°ÕÁ‘…Ñ•M•°€ô™…±Í”ì(€€€€€¥˜€¡ÍÑ…Ñ”¹ÍÑ½É•‘5…É­Ì€˜˜Ñ¡¥Ì¹½µÁ½Í¥¹œ¤ì(€€€€€€€±•…É½µÁ½Í¥Ñ¥½¸¡Ñ¡¥Ì¤ì(€€€€€€€ÕÁ‘…Ñ•M•°€ôÑÉÕ”ì(€€€€€ô(€€€€€Ñ¡¥Ì¹ÍÑ…Ñ”€ôÍÑ…Ñ”ì(€€€€€±•ÐÁ±Õ¥¹Í¡…¹•€ôÁÉ•Ø¹Á±Õ¥¹Ì€„ôÍÑ…Ñ”¹Á±Õ¥¹ÌñðÑ¡¥Ì¹}ÁÉ½ÁÌ¹Á±Õ¥¹Ì€„ôÁÉ•ÙAÉ½ÁÌ¹Á±Õ¥¹Ìì(€€€€€¥˜€¡Á±Õ¥¹Í¡…¹•ñðÑ¡¥Ì¹}ÁÉ½ÁÌ¹Á±Õ¥¹Ì€„ôÁÉ•ÙAÉ½ÁÌ¹Á±Õ¥¹ÌñðÑ¡¥Ì¹}ÁÉ½ÁÌ¹¹½‘•Y¥•ÝÌ€„ôÁÉ•ÙAÉ½ÁÌ¹¹½‘•Y¥•ÝÌ¤ì(€€€€€€€±•Ð¹½‘•Y¥•ÝÌ€ô‰Õ¥±‘9½‘•Y¥•ÝÌ¡Ñ¡¥Ì¤ì(€€€€€€€¥˜€¡¡…¹•‘9½‘•Y¥•ÝÌ¡¹½‘•Y¥•ÝÌ°Ñ¡¥Ì¹¹½‘•Y¥•ÝÌ¤¤ì(€€€€€€€€€Ñ¡¥Ì¹¹½‘•Y¥•ÝÌ€ô¹½‘•Y¥•ÝÌì(€€€€€€€€€É•‘É…Ü€ôÑÉÕ”ì(€€€€€€€ô(€€€€€ô(€€€€€¥˜€¡Á±Õ¥¹Í¡…¹•ñðÁÉ•ÙAÉ½ÁÌ¹¡…¹‘±•=5Ù•¹ÑÌ€„ôÑ¡¥Ì¹}ÁÉ½ÁÌ¹¡…¹‘±•=5Ù•¹ÑÌ¤ì(€€€€€€€•¹ÍÕÉ•1¥ÍÑ•¹•ÉÌ¡Ñ¡¥Ì¤ì(€€€€€ô(€€€€€Ñ¡¥Ì¹•‘¥Ñ…‰±”€ô•Ñ‘¥Ñ…‰±”¡Ñ¡¥Ì¤ì(€€€€€ÕÁ‘…Ñ•ÕÉÍ½É]É…ÁÁ•È¡Ñ¡¥Ì¤ì(€€€€€±•Ð¥¹¹•É•¼€ôÙ¥•Ý•½É…Ñ¥½¹Ì¡Ñ¡¥Ì¤°½ÕÑ•É•¼€ô½µÁÕÑ•½•¼¡Ñ¡¥Ì¤ì(€€€€€±•ÐÍÉ½±°€ôÁÉ•Ø¹Á±Õ¥¹Ì€„ôÍÑ…Ñ”¹Á±Õ¥¹Ì€˜˜€…ÁÉ•Ø¹‘½Œ¹•Ä¡ÍÑ…Ñ”¹‘½Œ¤€ü€‰É•Í•Ðˆ€èÍÑ…Ñ”¹ÍÉ½±±Q½M•±•Ñ¥½¸€øÁÉ•Ø¹ÍÉ½±±Q½M•±•Ñ¥½¸€ü€‰Ñ¼Í•±•Ñ¥½¸ˆ€è€‰ÁÉ•Í•ÉÙ”ˆì(€€€€€±•ÐÕÁ‘…Ñ•½Œ€ôÉ•‘É…Üñð€…Ñ¡¥Ì¹‘½Y¥•Ü¹µ…Ñ¡•Í9½‘”¡ÍÑ…Ñ”¹‘½Œ°½ÕÑ•É•¼°¥¹¹•É•¼¤ì(€€€€€¥˜€¡ÕÁ‘…Ñ•½Œñð€…ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹•Ä¡ÁÉ•Ø¹Í•±•Ñ¥½¸¤¤(€€€€€€€ÕÁ‘…Ñ•M•°€ôÑÉÕ”ì(€€€€€±•Ð½±‘MÉ½±±A½Ì€ôÍÉ½±°€ôô€‰ÁÉ•Í•ÉÙ”ˆ€˜˜ÕÁ‘…Ñ•M•°€˜˜Ñ¡¥Ì¹‘½´¹ÍÑå±”¹½Ù•É™±½Ý¹¡½È€ôô¹Õ±°€˜˜ÍÑ½É•MÉ½±±A½Ì¡Ñ¡¥Ì¤ì(€€€€€¥˜€¡ÕÁ‘…Ñ•M•°¤ì(€€€€€€€Ñ¡¥Ì¹‘½µ=‰Í•ÉÙ•È¹ÍÑ½À ¤ì(€€€€€€€±•Ð™½É•M•±UÁ‘…Ñ”€ôÕÁ‘…Ñ•½Œ€˜˜€¡¥”ñð¡É½µ”¤€˜˜€…Ñ¡¥Ì¹½µÁ½Í¥¹œ€˜˜€…ÁÉ•Ø¹Í•±•Ñ¥½¸¹•µÁÑä€˜˜€…ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹•µÁÑä€˜˜Í•±•Ñ¥½¹½¹Ñ•áÑ¡…¹•¡ÁÉ•Ø¹Í•±•Ñ¥½¸°ÍÑ…Ñ”¹Í•±•Ñ¥½¸¤ì(€€€€€€€¥˜€¡ÕÁ‘…Ñ•½Œ¤ì(€€€€€€€€€±•Ð¡É½µ•-±Õ‘”€ô¡É½µ”€üÑ¡¥Ì¹ÑÉ…­]É¥Ñ•Ì€ôÑ¡¥Ì¹‘½µM•±•Ñ¥½¹I…¹” ¤¹™½ÕÍ9½‘”€è¹Õ±°ì(€€€€€€€€€¥˜€¡Ñ¡¥Ì¹½µÁ½Í¥¹œ¤(€€€€€€€€€€€Ñ¡¥Ì¹¥¹ÁÕÐ¹½µÁ½Í¥Ñ¥½¹9½‘”€ô™¥¹‘½µÁ½Í¥Ñ¥½¹9½‘”¡Ñ¡¥Ì¤ì(€€€€€€€€€¥˜€¡É•‘É…Üñð€…Ñ¡¥Ì¹‘½Y¥•Ü¹ÕÁ‘…Ñ”¡ÍÑ…Ñ”¹‘½Œ°½ÕÑ•É•¼°¥¹¹•É•¼°Ñ¡¥Ì¤¤ì(€€€€€€€€€€€Ñ¡¥Ì¹‘½Y¥•Ü¹ÕÁ‘…Ñ•=ÕÑ•É•¼¡½ÕÑ•É•¼¤ì(€€€€€€€€€€€Ñ¡¥Ì¹‘½Y¥•Ü¹‘•ÍÑÉ½ä ¤ì(€€€€€€€€€€€Ñ¡¥Ì¹‘½Y¥•Ü€ô‘½Y¥•Ý•ÍŒ¡ÍÑ…Ñ”¹‘½Œ°½ÕÑ•É•¼°¥¹¹•É•¼°Ñ¡¥Ì¹‘½´°Ñ¡¥Ì¤ì(€€€€€€€€€ô(€€€€€€€€€¥˜€¡¡É½µ•-±Õ‘”€˜˜€ …Ñ¡¥Ì¹ÑÉ…­]É¥Ñ•Ìñð€…Ñ¡¥Ì¹‘½´¹½¹Ñ…¥¹Ì¡Ñ¡¥Ì¹ÑÉ…­]É¥Ñ•Ì¤¤¤(€€€€€€€€€€€™½É•M•±UÁ‘…Ñ”€ôÑÉÕ”ì(€€€€€€€ô(€€€€€€€±•Ðµ½ÕÍ•½Ý¸€ôÑ¡¥Ì¹¥¹ÁÕÐ¹µ½ÕÍ•½Ý¸ì(€€€€€€€¥˜€¡™½É•M•±UÁ‘…Ñ”ñð€„¡µ½ÕÍ•½Ý¸€˜˜Ñ¡¥Ì¹‘½µ=‰Í•ÉÙ•È¹ÕÉÉ•¹ÑM•±•Ñ¥½¸¹•Ä¡Ñ¡¥Ì¹‘½µM•±•Ñ¥½¹I…¹” ¤¤€˜˜…¹¡½É%¹I¥¡ÑA±…”¡Ñ¡¥Ì¤€˜˜µ½ÕÍ•½Ý¸¹‘•±…åM•±UÁ‘…Ñ” ¤¤¤ì(€€€€€€€€€Í•±•Ñ¥½¹Q½=4¡Ñ¡¥Ì°™½É•M•±UÁ‘…Ñ”¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€Íå¹9½‘•M•±•Ñ¥½¸¡Ñ¡¥Ì°ÍÑ…Ñ”¹Í•±•Ñ¥½¸¤ì(€€€€€€€€€Ñ¡¥Ì¹‘½µ=‰Í•ÉÙ•È¹Í•ÑÕÉM•±•Ñ¥½¸ ¤ì(€€€€€€€ô(€€€€€€€Ñ¡¥Ì¹‘½µ=‰Í•ÉÙ•È¹ÍÑ…ÉÐ ¤ì(€€€€€ô(€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•A±Õ¥¹Y¥•ÝÌ¡ÁÉ•Ø¤ì(€€€€€¥˜€  ¡}„€ôÑ¡¥Ì¹‘É…¥¹œ¤€ôôô¹Õ±°ñð}„€ôôôÙ½¥€À€üÙ½¥€À€è}„¹¹½‘”¤€˜˜€…ÁÉ•Ø¹‘½Œ¹•Ä¡ÍÑ…Ñ”¹‘½Œ¤¤(€€€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•É…•‘9½‘”¡Ñ¡¥Ì¹‘É…¥¹œ°ÁÉ•Ø¤ì(€€€€€¥˜€¡ÍÉ½±°€ôô€‰É•Í•Ðˆ¤ì(€€€€€€€Ñ¡¥Ì¹‘½´¹ÍÉ½±±Q½À€ô€Àì(€€€€€ô•±Í”¥˜€¡ÍÉ½±°€ôô€‰Ñ¼Í•±•Ñ¥½¸ˆ¤ì(€€€€€€€Ñ¡¥Ì¹ÍÉ½±±Q½M•±•Ñ¥½¸ ¤ì(€€€€€ô•±Í”¥˜€¡½±‘MÉ½±±A½Ì¤ì(€€€€€€€É•Í•ÑMÉ½±±A½Ì¡½±‘MÉ½±±A½Ì¤ì(€€€€€ô(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€ÍÉ½±±Q½M•±•Ñ¥½¸ ¤ì(€€€€€±•ÐÍÑ…ÉÑ=4€ôÑ¡¥Ì¹‘½µM•±•Ñ¥½¹I…¹” ¤¹™½ÕÍ9½‘”ì(€€€€€¥˜€ …ÍÑ…ÉÑ=4ñð€…½¹Ñ…¥¹Ì¡Ñ¡¥Ì¹‘½´°ÍÑ…ÉÑ=4¤¤€ì(€€€€€•±Í”¥˜€¡Ñ¡¥Ì¹Í½µ•AÉ½À ‰¡…¹‘±•MÉ½±±Q½M•±•Ñ¥½¸ˆ°€¡˜¤€ôø˜¡Ñ¡¥Ì¤¤¤€ì(€€€€€•±Í”¥˜€¡Ñ¡¥Ì¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¥¹ÍÑ…¹•½˜9½‘•M•±•Ñ¥½¸¤ì(€€€€€€€±•ÐÑ…É•Ð€ôÑ¡¥Ì¹‘½Y¥•Ü¹‘½µ™Ñ•ÉA½Ì¡Ñ¡¥Ì¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´¤ì(€€€€€€€¥˜€¡¥Í±Ð¡Ñ…É•Ð¤¤(€€€€€€€€€ÍÉ½±±I•Ñ%¹Ñ½Y¥•Ü¡Ñ¡¥Ì°Ñ…É•Ð¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤°ÍÑ…ÉÑ=4¤ì(€€€€€ô•±Í”ì(€€€€€€€ÍÉ½±±I•Ñ%¹Ñ½Y¥•Ü¡Ñ¡¥Ì°Ñ¡¥Ì¹½½É‘ÍÑA½Ì¡Ñ¡¥Ì¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹¡•…°€Ä¤°ÍÑ…ÉÑ=4¤ì(€€€€€ô(€€€ô(€€€‘•ÍÑÉ½åA±Õ¥¹Y¥•ÝÌ ¤ì(€€€€€±•ÐÙ¥•Üì(€€€€€Ý¡¥±”€¡Ù¥•Ü€ôÑ¡¥Ì¹Á±Õ¥¹Y¥•ÝÌ¹Á½À ¤¤(€€€€€€€¥˜€¡Ù¥•Ü¹‘•ÍÑÉ½ä¤(€€€€€€€€€Ù¥•Ü¹‘•ÍÑÉ½ä ¤ì(€€€ô(€€€ÕÁ‘…Ñ•A±Õ¥¹Y¥•ÝÌ¡ÁÉ•ÙMÑ…Ñ”¤ì(€€€€€¥˜€ …ÁÉ•ÙMÑ…Ñ”ñðÁÉ•ÙMÑ…Ñ”¹Á±Õ¥¹Ì€„ôÑ¡¥Ì¹ÍÑ…Ñ”¹Á±Õ¥¹ÌñðÑ¡¥Ì¹‘¥É•ÑA±Õ¥¹Ì€„ôÑ¡¥Ì¹ÁÉ•Ù¥É•ÑA±Õ¥¹Ì¤ì(€€€€€€€Ñ¡¥Ì¹ÁÉ•Ù¥É•ÑA±Õ¥¹Ì€ôÑ¡¥Ì¹‘¥É•ÑA±Õ¥¹Ìì(€€€€€€€Ñ¡¥Ì¹‘•ÍÑÉ½åA±Õ¥¹Y¥•ÝÌ ¤ì(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹‘¥É•ÑA±Õ¥¹Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€±•ÐÁ±Õ¥¸€ôÑ¡¥Ì¹‘¥É•ÑA±Õ¥¹Ím¥tì(€€€€€€€€€¥˜€¡Á±Õ¥¸¹ÍÁ•Œ¹Ù¥•Ü¤(€€€€€€€€€€€Ñ¡¥Ì¹Á±Õ¥¹Y¥•ÝÌ¹ÁÕÍ ¡Á±Õ¥¸¹ÍÁ•Œ¹Ù¥•Ü¡Ñ¡¥Ì¤¤ì(€€€€€€€ô(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹ÍÑ…Ñ”¹Á±Õ¥¹Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€±•ÐÁ±Õ¥¸€ôÑ¡¥Ì¹ÍÑ…Ñ”¹Á±Õ¥¹Ím¥tì(€€€€€€€€€¥˜€¡Á±Õ¥¸¹ÍÁ•Œ¹Ù¥•Ü¤(€€€€€€€€€€€Ñ¡¥Ì¹Á±Õ¥¹Y¥•ÝÌ¹ÁÕÍ ¡Á±Õ¥¸¹ÍÁ•Œ¹Ù¥•Ü¡Ñ¡¥Ì¤¤ì(€€€€€€€ô(€€€€€ô•±Í”ì(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹Á±Õ¥¹Y¥•ÝÌ¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€±•ÐÁ±Õ¥¹Y¥•Ü€ôÑ¡¥Ì¹Á±Õ¥¹Y¥•ÝÍm¥tì(€€€€€€€€€¥˜€¡Á±Õ¥¹Y¥•Ü¹ÕÁ‘…Ñ”¤(€€€€€€€€€€€Á±Õ¥¹Y¥•Ü¹ÕÁ‘…Ñ”¡Ñ¡¥Ì°ÁÉ•ÙMÑ…Ñ”¤ì(€€€€€€€ô(€€€€€ô(€€€ô(€€€ÕÁ‘…Ñ•É…•‘9½‘”¡‘É…¥¹œ°ÁÉ•Ø¤ì(€€€€€±•ÐÍ•°€ô‘É…¥¹œ¹¹½‘”°™½Õ¹Ì€ô€´Äì(€€€€€¥˜€¡Í•°¹™É½´€ðÑ¡¥Ì¹ÍÑ…Ñ”¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”€˜˜Ñ¡¥Ì¹ÍÑ…Ñ”¹‘½Œ¹¹½‘•Ð¡Í•°¹™É½´¤€ôôÍ•°¹¹½‘”¤ì(€€€€€€€™½Õ¹Ì€ôÍ•°¹™É½´ì(€€€€€ô•±Í”ì(€€€€€€€±•Ðµ½Ù•‘A½Ì€ôÍ•°¹™É½´€¬€¡Ñ¡¥Ì¹ÍÑ…Ñ”¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”€´ÁÉ•Ø¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”¤ì(€€€€€€€±•Ðµ½Ù•€ôµ½Ù•‘A½Ì€ø€À€˜˜µ½Ù•‘A½Ì€ðÑ¡¥Ì¹ÍÑ…Ñ”¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”€˜˜Ñ¡¥Ì¹ÍÑ…Ñ”¹‘½Œ¹¹½‘•Ð¡µ½Ù•‘A½Ì¤ì(€€€€€€€¥˜€¡µ½Ù•€ôôÍ•°¹¹½‘”¤(€€€€€€€€€™½Õ¹Ì€ôµ½Ù•‘A½Ìì(€€€€€ô(€€€€€Ñ¡¥Ì¹‘É…¥¹œ€ô¹•ÜÉ…¥¹œ¡‘É…¥¹œ¹Í±¥”°‘É…¥¹œ¹µ½Ù”°™½Õ¹Ì€ð€À€üÙ½¥€À€è9½‘•M•±•Ñ¥½¸¹É•…Ñ”¡Ñ¡¥Ì¹ÍÑ…Ñ”¹‘½Œ°™½Õ¹Ì¤¤ì(€€€ô(€€€Í½µ•AÉ½À¡ÁÉ½Á9…µ”°˜¤ì(€€€€€±•ÐÁÉ½À€ôÑ¡¥Ì¹}ÁÉ½ÁÌ€˜˜Ñ¡¥Ì¹}ÁÉ½ÁÍmÁÉ½Á9…µ•t°Ù…±Õ”ì(€€€€€¥˜€¡ÁÉ½À€„ô¹Õ±°€˜˜€¡Ù…±Õ”€ô˜€ü˜¡ÁÉ½À¤€èÁÉ½À¤¤(€€€€€€€É•ÑÕÉ¸Ù…±Õ”ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÑ¡¥Ì¹‘¥É•ÑA±Õ¥¹Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€±•ÐÁÉ½ÀÈ€ôÑ¡¥Ì¹‘¥É•ÑA±Õ¥¹Ím¥t¹ÁÉ½ÁÍmÁÉ½Á9…µ•tì(€€€€€€€¥˜€¡ÁÉ½ÀÈ€„ô¹Õ±°€˜˜€¡Ù…±Õ”€ô˜€ü˜¡ÁÉ½ÀÈ¤€èÁÉ½ÀÈ¤¤(€€€€€€€€€É•ÑÕÉ¸Ù…±Õ”ì(€€€€€ô(€€€€€±•ÐÁ±Õ¥¹Ì€ôÑ¡¥Ì¹ÍÑ…Ñ”¹Á±Õ¥¹Ìì(€€€€€¥˜€¡Á±Õ¥¹Ì¤(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÁ±Õ¥¹Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€±•ÐÁÉ½ÀÈ€ôÁ±Õ¥¹Ím¥t¹ÁÉ½ÁÍmÁÉ½Á9…µ•tì(€€€€€€€€€¥˜€¡ÁÉ½ÀÈ€„ô¹Õ±°€˜˜€¡Ù…±Õ”€ô˜€ü˜¡ÁÉ½ÀÈ¤€èÁÉ½ÀÈ¤¤(€€€€€€€€€€€É•ÑÕÉ¸Ù…±Õ”ì(€€€€€€€ô(€€€ô(€€€€¼¨¨(€€€EÕ•ÉäÝ¡•Ñ¡•ÈÑ¡”Ù¥•Ü¡…Ì™½ÕÌ¸(€€€€¨¼(€€€¡…Í½ÕÌ ¤ì(€€€€€¥˜€¡¥”¤ì(€€€€€€€±•Ð¹½‘”€ôÑ¡¥Ì¹É½½Ð¹…Ñ¥Ù•±•µ•¹Ðì(€€€€€€€¥˜€¡¹½‘”€ôôÑ¡¥Ì¹‘½´¤(€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€¥˜€ …¹½‘”ñð€…Ñ¡¥Ì¹‘½´¹½¹Ñ…¥¹Ì¡¹½‘”¤¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€Ý¡¥±”€¡¹½‘”€˜˜Ñ¡¥Ì¹‘½´€„ô¹½‘”€˜˜Ñ¡¥Ì¹‘½´¹½¹Ñ…¥¹Ì¡¹½‘”¤¤ì(€€€€€€€€€¥˜€¡¹½‘”¹½¹Ñ•¹Ñ‘¥Ñ…‰±”€ôô€‰™…±Í”ˆ¤(€€€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€€€¹½‘”€ô¹½‘”¹Á…É•¹Ñ±•µ•¹Ðì(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹É½½Ð¹…Ñ¥Ù•±•µ•¹Ð€ôôÑ¡¥Ì¹‘½´ì(€€€ô(€€€€¼¨¨(€€€½ÕÌÑ¡”•‘¥Ñ½È¸(€€€€¨¼(€€€™½ÕÌ ¤ì(€€€€€Ñ¡¥Ì¹‘½µ=‰Í•ÉÙ•È¹ÍÑ½À ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹•‘¥Ñ…‰±”¤(€€€€€€€™½ÕÍAÉ•Ù•¹ÑMÉ½±°¡Ñ¡¥Ì¹‘½´¤ì(€€€€€Í•±•Ñ¥½¹Q½=4¡Ñ¡¥Ì¤ì(€€€€€Ñ¡¥Ì¹‘½µ=‰Í•ÉÙ•È¹ÍÑ…ÉÐ ¤ì(€€€ô(€€€€¼¨¨(€€€•ÐÑ¡”‘½Õµ•¹ÐÉ½½Ð¥¸Ý¡¥ Ñ¡”•‘¥Ñ½È•á¥ÍÑÌ¸Q¡¥ÌÝ¥±°(€€€ÕÍÕ…±±ä‰”Ñ¡”Ñ½Àµ±•Ù•°‘½Õµ•¹Ñ€°‰ÕÐµ¥¡Ð‰”„mÍ¡…‘½Ü(€€€=5t¡¡ÑÑÁÌè¼½‘•Ù•±½Á•È¹µ½é¥±±„¹½Éœ½•¸µUL½‘½Ì½]•ˆ½]•‰}½µÁ½¹•¹ÑÌ½M¡…‘½Ý}=4¤(€€€É½½Ð¥˜Ñ¡”•‘¥Ñ½È¥Ì¥¹Í¥‘”½¹”¸(€€€€¨¼(€€€•ÐÉ½½Ð ¤ì(€€€€€±•Ð…¡•€ôÑ¡¥Ì¹}É½½Ðì(€€€€€¥˜€¡…¡•€ôô¹Õ±°¤(€€€€€€€™½È€¡±•ÐÍ•…É €ôÑ¡¥Ì¹‘½´¹Á…É•¹Ñ9½‘”ìÍ•…É ìÍ•…É €ôÍ•…É ¹Á…É•¹Ñ9½‘”¤ì(€€€€€€€€€¥˜€¡Í•…É ¹¹½‘•QåÁ”€ôô€äñðÍ•…É ¹¹½‘•QåÁ”€ôô€ÄÄ€˜˜Í•…É ¹¡½ÍÐ¤ì(€€€€€€€€€€€¥˜€ …Í•…É ¹•ÑM•±•Ñ¥½¸¤(€€€€€€€€€€€€€=‰©•Ð¹•ÑAÉ½Ñ½ÑåÁ•=˜¡Í•…É ¤¹•ÑM•±•Ñ¥½¸€ô€ ¤€ôøÍ•…É ¹½Ý¹•É½Õµ•¹Ð¹•ÑM•±•Ñ¥½¸ ¤ì(€€€€€€€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹}É½½Ð€ôÍ•…É ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€É•ÑÕÉ¸…¡•ñð‘½Õµ•¹Ðì(€€€ô(€€€€¼¨¨(€€€]¡•¸…¸•á¥ÍÑ¥¹œ•‘¥Ñ½ÈÙ¥•Ü¥Ìµ½Ù•Ñ¼„¹•Ü‘½Õµ•¹Ð½È(€€€Í¡…‘½ÜÑÉ•”°…±°Ñ¡¥ÌÑ¼µ…­”¥ÐÉ•½µÁÕÑ”¥ÑÌÉ½½Ð¸(€€€€¨¼(€€€ÕÁ‘…Ñ•I½½Ð ¤ì(€€€€€Ñ¡¥Ì¹}É½½Ð€ô¹Õ±°ì(€€€ô(€€€€¼¨¨(€€€¥Ù•¸„Á…¥È½˜Ù¥•ÝÁ½ÉÐ½½É‘¥¹…Ñ•Ì°É•ÑÕÉ¸Ñ¡”‘½Õµ•¹Ð(€€€Á½Í¥Ñ¥½¸Ñ¡…Ð½ÉÉ•ÍÁ½¹‘ÌÑ¼Ñ¡•´¸5…äÉ•ÑÕÉ¸¹Õ±°¥˜Ñ¡”¥Ù•¸(€€€½½É‘¥¹…Ñ•Ì…É•¸Ð¥¹Í¥‘”½˜Ñ¡”•‘¥Ñ½È¸]¡•¸…¸½‰©•Ð¥Ì(€€€É•ÑÕÉ¹•°¥ÑÌÁ½Í€ÁÉ½Á•ÉÑä¥ÌÑ¡”Á½Í¥Ñ¥½¸¹•…É•ÍÐÑ¼Ñ¡”(€€€½½É‘¥¹…Ñ•Ì°…¹¥ÑÌ¥¹Í¥‘•€ÁÉ½Á•ÉÑä¡½±‘ÌÑ¡”Á½Í¥Ñ¥½¸½˜Ñ¡”(€€€¥¹¹•È¹½‘”Ñ¡…ÐÑ¡”Á½Í¥Ñ¥½¸™…±±Ì¥¹Í¥‘”½˜°½È€´Ä¥˜¥Ð¥Ì…Ð(€€€Ñ¡”Ñ½À±•Ù•°°¹½Ð¥¸…¹ä¹½‘”¸(€€€€¨¼(€€€Á½ÍÑ½½É‘Ì¡½½É‘Ì¤ì(€€€€€É•ÑÕÉ¸Á½ÍÑ½½É‘Ì¡Ñ¡¥Ì°½½É‘Ì¤ì(€€€ô(€€€€¼¨¨(€€€I•ÑÕÉ¹ÌÑ¡”Ù¥•ÝÁ½ÉÐÉ•Ñ…¹±”…Ð„¥Ù•¸‘½Õµ•¹ÐÁ½Í¥Ñ¥½¸¸(€€€±•™Ñ€…¹É¥¡Ñ€Ý¥±°‰”Ñ¡”Í…µ”¹Õµ‰•È°…ÌÑ¡¥ÌÉ•ÑÕÉ¹Ì„(€€€™±…ÐÕÉÍ½Èµ¥Í É•Ñ…¹±”¸%˜Ñ¡”Á½Í¥Ñ¥½¸¥Ì‰•ÑÝ••¸ÑÝ¼Ñ¡¥¹Ì(€€€Ñ¡…Ð…É•¸Ð‘¥É•Ñ±ä…‘©…•¹Ð°Í¥‘•€‘•Ñ•Éµ¥¹•ÌÝ¡¥ •±•µ•¹Ð(€€€¥ÌÕÍ•¸]¡•¸€ð€À°Ñ¡”•±•µ•¹Ð‰•™½É”Ñ¡”Á½Í¥Ñ¥½¸¥ÌÕÍ•°(€€€½Ñ¡•ÉÝ¥Í”Ñ¡”•±•µ•¹Ð…™Ñ•È¸(€€€€¨¼(€€€½½É‘ÍÑA½Ì¡Á½Ì°Í¥‘”€ô€Ä¤ì(€€€€€É•ÑÕÉ¸½½É‘ÍÑA½Ì¡Ñ¡¥Ì°Á½Ì°Í¥‘”¤ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ¡”=4Á½Í¥Ñ¥½¸Ñ¡…Ð½ÉÉ•ÍÁ½¹‘ÌÑ¼Ñ¡”¥Ù•¸‘½Õµ•¹Ð(€€€Á½Í¥Ñ¥½¸¸]¡•¸Í¥‘•€¥Ì¹•…Ñ¥Ù”°™¥¹Ñ¡”Á½Í¥Ñ¥½¸…Ì±½Í”…Ì(€€€Á½ÍÍ¥‰±”Ñ¼Ñ¡”½¹Ñ•¹Ð‰•™½É”Ñ¡”Á½Í¥Ñ¥½¸¸]¡•¸Á½Í¥Ñ¥Ù”°(€€€ÁÉ•™•ÈÁ½Í¥Ñ¥½¹Ì±½Í”Ñ¼Ñ¡”½¹Ñ•¹Ð…™Ñ•ÈÑ¡”Á½Í¥Ñ¥½¸¸]¡•¸(€€€é•É¼°ÁÉ•™•È…ÌÍ¡…±±½Ü„Á½Í¥Ñ¥½¸…ÌÁ½ÍÍ¥‰±”¸(€€€€(€€€9½Ñ”Ñ¡…Ðå½ÔÍ¡½Õ±€¨©¹½Ð¨¨µÕÑ…Ñ”Ñ¡”•‘¥Ñ½ÈÌ¥¹Ñ•É¹…°=4°(€€€½¹±ä¥¹ÍÁ•Ð¥Ð€¡…¹•Ù•¸Ñ¡…Ð¥ÌÕÍÕ…±±ä¹½Ð¹••ÍÍ…Éä¤¸(€€€€¨¼(€€€‘½µÑA½Ì¡Á½Ì°Í¥‘”€ô€À¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹‘½Y¥•Ü¹‘½µÉ½µA½Ì¡Á½Ì°Í¥‘”¤ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ¡”=4¹½‘”Ñ¡…ÐÉ•ÁÉ•Í•¹ÑÌÑ¡”‘½Õµ•¹Ð¹½‘”…™Ñ•ÈÑ¡”(€€€¥Ù•¸Á½Í¥Ñ¥½¸¸5…äÉ•ÑÕÉ¸¹Õ±±€Ý¡•¸Ñ¡”Á½Í¥Ñ¥½¸‘½•Í¸ÐÁ½¥¹Ð(€€€¥¸™É½¹Ð½˜„¹½‘”½È¥˜Ñ¡”¹½‘”¥Ì¥¹Í¥‘”…¸½Á…ÅÕ”¹½‘”Ù¥•Ü¸(€€€€(€€€Q¡¥Ì¥Ì¥¹Ñ•¹‘•Ñ¼‰”…‰±”Ñ¼…±°Ñ¡¥¹Ì±¥­”(€€€•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ñ€½¸Ñ¡…Ð=4¹½‘”¸¼€¨©¹½Ð¨¨µÕÑ…Ñ”Ñ¡”(€€€•‘¥Ñ½È=4‘¥É•Ñ±ä°½È…‘ÍÑå±¥¹œÑ¡¥ÌÝ…ä°Í¥¹”Ñ¡…ÐÝ¥±°‰”(€€€¥µµ•‘¥…Ñ•±ä½Ù•ÉÉ¥‘•¸‰äÑ¡”•‘¥Ñ½È…Ì¥ÐÉ•‘É…ÝÌÑ¡”¹½‘”¸(€€€€¨¼(€€€¹½‘•=4¡Á½Ì¤ì(€€€€€±•Ð‘•ÍŒ€ôÑ¡¥Ì¹‘½Y¥•Ü¹‘•ÍÐ¡Á½Ì¤ì(€€€€€É•ÑÕÉ¸‘•ÍŒ€ü‘•ÍŒ¹¹½‘•=4€è¹Õ±°ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ¡”‘½Õµ•¹ÐÁ½Í¥Ñ¥½¸Ñ¡…Ð½ÉÉ•ÍÁ½¹‘ÌÑ¼„¥Ù•¸=4(€€€Á½Í¥Ñ¥½¸¸€¡]¡•¹•Ù•ÈÁ½ÍÍ¥‰±”°¥Ð¥ÌÁÉ•™•É…‰±”Ñ¼¥¹ÍÁ•ÐÑ¡”(€€€‘½Õµ•¹ÐÍÑÉÕÑÕÉ”‘¥É•Ñ±ä°É…Ñ¡•ÈÑ¡…¸Á½­¥¹œ…É½Õ¹¥¸Ñ¡”(€€€=4°‰ÕÐÍ½µ•Ñ¥µ•ÏŠQ™½È•á…µÁ±”Ý¡•¸¥¹Ñ•ÉÁÉ•Ñ¥¹œ…¸•Ù•¹Ð(€€€Ñ…É•ÓŠQå½Ô‘½¸Ð¡…Ù”„¡½¥”¸¤(€€€€(€€€Q¡”‰¥…Í€Á…É…µ•Ñ•È…¸‰”ÕÍ•Ñ¼¥¹™±Õ•¹”Ý¡¥ Í¥‘”½˜„=4(€€€¹½‘”Ñ¼ÕÍ”Ý¡•¸Ñ¡”Á½Í¥Ñ¥½¸¥Ì¥¹Í¥‘”„±•…˜¹½‘”¸(€€€€¨¼(€€€Á½ÍÑ=4¡¹½‘”°½™™Í•Ð°‰¥…Ì€ô€´Ä¤ì(€€€€€±•ÐÁ½Ì€ôÑ¡¥Ì¹‘½Y¥•Ü¹Á½ÍÉ½µ=4¡¹½‘”°½™™Í•Ð°‰¥…Ì¤ì(€€€€€¥˜€¡Á½Ì€ôô¹Õ±°¤(€€€€€€€Ñ¡É½Ü¹•ÜI…¹•ÉÉ½È ‰=4Á½Í¥Ñ¥½¸¹½Ð¥¹Í¥‘”Ñ¡”•‘¥Ñ½Èˆ¤ì(€€€€€É•ÑÕÉ¸Á½Ìì(€€€ô(€€€€¼¨¨(€€€¥¹½ÕÐÝ¡•Ñ¡•ÈÑ¡”Í•±•Ñ¥½¸¥Ì…ÐÑ¡”•¹½˜„Ñ•áÑ‰±½¬Ý¡•¸(€€€µ½Ù¥¹œ¥¸„¥Ù•¸‘¥É•Ñ¥½¸¸]¡•¸°™½È•á…µÁ±”°¥Ù•¸€‰±•™Ð‰€°(€€€¥ÐÝ¥±°É•ÑÕÉ¸ÑÉÕ”¥˜µ½Ù¥¹œ±•™Ð™É½´Ñ¡”ÕÉÉ•¹ÐÕÉÍ½È(€€€Á½Í¥Ñ¥½¸Ý½Õ±±•…Ù”Ñ¡…ÐÁ½Í¥Ñ¥½¸ÌÁ…É•¹ÐÑ•áÑ‰±½¬¸]¥±°…ÁÁ±ä(€€€Ñ¼Ñ¡”Ù¥•ÜÌÕÉÉ•¹ÐÍÑ…Ñ”‰ä‘•™…Õ±Ð°‰ÕÐ¥Ð¥ÌÁ½ÍÍ¥‰±”Ñ¼(€€€Á…ÍÌ„‘¥™™•É•¹ÐÍÑ…Ñ”¸(€€€€¨¼(€€€•¹‘=™Q•áÑ‰±½¬¡‘¥È°ÍÑ…Ñ”¤ì(€€€€€É•ÑÕÉ¸•¹‘=™Q•áÑ‰±½¬¡Ñ¡¥Ì°ÍÑ…Ñ”ñðÑ¡¥Ì¹ÍÑ…Ñ”°‘¥È¤ì(€€€ô(€€€€¼¨¨(€€€IÕ¸Ñ¡”•‘¥Ñ½ÈÌÁ…ÍÑ”±½¥ŒÝ¥Ñ Ñ¡”¥Ù•¸!Q50ÍÑÉ¥¹œ¸Q¡”(€€€•Ù•¹Ñ€°¥˜¥Ù•¸°Ý¥±°‰”Á…ÍÍ•Ñ¼Ñ¡”(€€€m¡…¹‘±•A…ÍÑ•t¡¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½É•˜¼Ù¥•Ü¹‘¥Ñ½ÉAÉ½ÁÌ¹¡…¹‘±•A…ÍÑ”¤¡½½¬¸(€€€€¨¼(€€€Á…ÍÑ•!Q50¡¡Ñµ°°•Ù•¹Ð¤ì(€€€€€É•ÑÕÉ¸‘½A…ÍÑ”¡Ñ¡¥Ì°€ˆˆ°¡Ñµ°°™…±Í”°•Ù•¹Ðñð¹•Ü±¥Á‰½…É‘Ù•¹Ð ‰Á…ÍÑ”ˆ¤¤ì(€€€ô(€€€€¼¨¨(€€€IÕ¸Ñ¡”•‘¥Ñ½ÈÌÁ…ÍÑ”±½¥ŒÝ¥Ñ Ñ¡”¥Ù•¸Á±…¥¸µÑ•áÐ¥¹ÁÕÐ¸(€€€€¨¼(€€€Á…ÍÑ•Q•áÐ¡Ñ•áÐÈ°•Ù•¹Ð¤ì(€€€€€É•ÑÕÉ¸‘½A…ÍÑ”¡Ñ¡¥Ì°Ñ•áÐÈ°¹Õ±°°ÑÉÕ”°•Ù•¹Ðñð¹•Ü±¥Á‰½…É‘Ù•¹Ð ‰Á…ÍÑ”ˆ¤¤ì(€€€ô(€€€€¼¨¨(€€€M•É¥…±¥é”Ñ¡”¥Ù•¸Í±¥”…Ì¥ÐÝ½Õ±‰”¥˜¥ÐÝ…Ì½Á¥•™É½´(€€€Ñ¡¥Ì•‘¥Ñ½È¸I•ÑÕÉ¹Ì„=4•±•µ•¹ÐÑ¡…Ð½¹Ñ…¥¹Ì„(€€€É•ÁÉ•Í•¹Ñ…Ñ¥½¸½˜Ñ¡”Í±¥”…Ì¥ÑÌ¡¥±‘É•¸°„Ñ•áÑÕ…°(€€€É•ÁÉ•Í•¹Ñ…Ñ¥½¸°…¹Ñ¡”ÑÉ…¹Í™½Éµ•Í±¥”€¡Ý¡¥ …¸‰”(€€€‘¥™™•É•¹Ð™É½´Ñ¡”¥Ù•¸¥¹ÁÕÐ‘Õ”Ñ¼¡½½­Ì±¥­”(€€€mÑÉ…¹Í™½Éµ½Á¥•‘t¡¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½É•˜¼Ù¥•Ü¹‘¥Ñ½ÉAÉ½ÁÌ¹ÑÉ…¹Í™½Éµ½Á¥•¤¤¸(€€€€¨¼(€€€Í•É¥…±¥é•½É±¥Á‰½…É¡Í±¥”¤ì(€€€€€É•ÑÕÉ¸Í•É¥…±¥é•½É±¥Á‰½…É¡Ñ¡¥Ì°Í±¥”¤ì(€€€ô(€€€€¼¨¨(€€€I•µ½Ù•ÌÑ¡”•‘¥Ñ½È™É½´Ñ¡”=4…¹‘•ÍÑÉ½åÌ…±°m¹½‘”(€€€Ù¥•ÝÍt¡¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½É•˜¼Ù¥•Ü¹9½‘•Y¥•Ü¤¸(€€€€¨¼(€€€‘•ÍÑÉ½ä ¤ì(€€€€€¥˜€ …Ñ¡¥Ì¹‘½Y¥•Ü¤(€€€€€€€É•ÑÕÉ¸ì(€€€€€‘•ÍÑÉ½å%¹ÁÕÐ¡Ñ¡¥Ì¤ì(€€€€€Ñ¡¥Ì¹‘•ÍÑÉ½åA±Õ¥¹Y¥•ÝÌ ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹µ½Õ¹Ñ•¤ì(€€€€€€€Ñ¡¥Ì¹‘½Y¥•Ü¹ÕÁ‘…Ñ”¡Ñ¡¥Ì¹ÍÑ…Ñ”¹‘½Œ°mt°Ù¥•Ý•½É…Ñ¥½¹Ì¡Ñ¡¥Ì¤°Ñ¡¥Ì¤ì(€€€€€€€Ñ¡¥Ì¹‘½´¹Ñ•áÑ½¹Ñ•¹Ð€ô€ˆˆì(€€€€€ô•±Í”¥˜€¡Ñ¡¥Ì¹‘½´¹Á…É•¹Ñ9½‘”¤ì(€€€€€€€Ñ¡¥Ì¹‘½´¹Á…É•¹Ñ9½‘”¹É•µ½Ù•¡¥±¡Ñ¡¥Ì¹‘½´¤ì(€€€€€ô(€€€€€Ñ¡¥Ì¹‘½Y¥•Ü¹‘•ÍÑÉ½ä ¤ì(€€€€€Ñ¡¥Ì¹‘½Y¥•Ü€ô¹Õ±°ì(€€€€€±•…ÉI•ÕÍ•‘I…¹” ¤ì(€€€ô(€€€€¼¨¨(€€€Q¡¥Ì¥ÌÑÉÕ”Ý¡•¸Ñ¡”Ù¥•Ü¡…Ì‰••¸(€€€m‘•ÍÑÉ½å•‘t¡¡ÑÑÁÌè¼½ÁÉ½Í•µ¥ÉÉ½È¹¹•Ð½‘½Ì½É•˜¼Ù¥•Ü¹‘¥Ñ½ÉY¥•Ü¹‘•ÍÑÉ½ä¤€¡…¹Ñ¡ÕÌÍ¡½Õ±¹½Ð‰”(€€€ÕÍ•…¹åµ½É”¤¸(€€€€¨¼(€€€•Ð¥Í•ÍÑÉ½å• ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹‘½Y¥•Ü€ôô¹Õ±°ì(€€€ô(€€€€¼¨¨(€€€UÍ•™½ÈÑ•ÍÑ¥¹œ¸(€€€€¨¼(€€€‘¥ÍÁ…Ñ¡Ù•¹Ð¡•Ù•¹Ð¤ì(€€€€€É•ÑÕÉ¸‘¥ÍÁ…Ñ¡Ù•¹Ð¡Ñ¡¥Ì°•Ù•¹Ð¤ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€‘½µM•±•Ñ¥½¹I…¹” ¤ì(€€€€€±•ÐÍ•°€ôÑ¡¥Ì¹‘½´¹¥Í½¹¹•Ñ•€„ôô™…±Í”€˜˜Ñ¡¥Ì¹‘½µM•±•Ñ¥½¸ ¤ì(€€€€€¥˜€ …Í•°¤(€€€€€€€É•ÑÕÉ¸ì™½ÕÍ9½‘”è¹Õ±°°™½ÕÍ=™™Í•Ðè€À°…¹¡½É9½‘”è¹Õ±°°…¹¡½É=™™Í•Ðè€Àôì(€€€€€É•ÑÕÉ¸Í…™…É¤€˜˜Ñ¡¥Ì¹É½½Ð¹¹½‘•QåÁ”€ôôô€ÄÄ€˜˜‘••ÁÑ¥Ù•±•µ•¹Ð¡Ñ¡¥Ì¹‘½´¹½Ý¹•É½Õµ•¹Ð¤€ôôÑ¡¥Ì¹‘½´€˜˜Í…™…É¥M¡…‘½ÝM•±•Ñ¥½¹I…¹”¡Ñ¡¥Ì°Í•°¤ñðÍ•°ì(€€€ô(€€€€¼¨¨(€€€¥¹Ñ•É¹…°(€€€€¨¼(€€€‘½µM•±•Ñ¥½¸ ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹É½½Ð¹•ÑM•±•Ñ¥½¸ ¤ì(€€€ô(€ôì(€‘¥Ñ½ÉY¥•Ü¹ÁÉ½Ñ½ÑåÁ”¹‘¥ÍÁ…Ñ €ô™Õ¹Ñ¥½¸¡ÑÈ¤ì(€€€±•Ð‘¥ÍÁ…Ñ¡QÉ…¹Í…Ñ¥½¸€ôÑ¡¥Ì¹}ÁÉ½ÁÌ¹‘¥ÍÁ…Ñ¡QÉ…¹Í…Ñ¥½¸ì(€€€¥˜€¡‘¥ÍÁ…Ñ¡QÉ…¹Í…Ñ¥½¸¤(€€€€€‘¥ÍÁ…Ñ¡QÉ…¹Í…Ñ¥½¸¹…±°¡Ñ¡¥Ì°ÑÈ¤ì(€€€•±Í”(€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•MÑ…Ñ”¡Ñ¡¥Ì¹ÍÑ…Ñ”¹…ÁÁ±ä¡ÑÈ¤¤ì(€ôì(€™Õ¹Ñ¥½¸½µÁÕÑ•½•¼¡Ù¥•Ü¤ì(€€€±•Ð…ÑÑÉÌ€ô€¼¨}}AUI}|€¨¼=‰©•Ð¹É•…Ñ”¡¹Õ±°¤ì(€€€…ÑÑÉÌ¹±…ÍÌ€ô€‰AÉ½Í•5¥ÉÉ½Èˆì(€€€…ÑÑÉÌ¹½¹Ñ•¹Ñ•‘¥Ñ…‰±”€ôMÑÉ¥¹œ¡Ù¥•Ü¹•‘¥Ñ…‰±”¤ì(€€€Ù¥•Ü¹Í½µ•AÉ½À ‰…ÑÑÉ¥‰ÕÑ•Ìˆ°€¡Ù…±Õ”¤€ôøì(€€€€€¥˜€¡ÑåÁ•½˜Ù…±Õ”€ôô€‰™Õ¹Ñ¥½¸ˆ¤(€€€€€€€Ù…±Õ”€ôÙ…±Õ”¡Ù¥•Ü¹ÍÑ…Ñ”¤ì(€€€€€¥˜€¡Ù…±Õ”¤(€€€€€€€™½È€¡±•Ð…ÑÑÈ¥¸Ù…±Õ”¤ì(€€€€€€€€€¥˜€¡…ÑÑÈ€ôô€‰±…ÍÌˆ¤(€€€€€€€€€€€…ÑÑÉÌ¹±…ÍÌ€¬ô€ˆ€ˆ€¬Ù…±Õ•m…ÑÑÉtì(€€€€€€€€€•±Í”¥˜€¡…ÑÑÈ€ôô€‰ÍÑå±”ˆ¤(€€€€€€€€€€€…ÑÑÉÌ¹ÍÑå±”€ô€¡…ÑÑÉÌ¹ÍÑå±”€ü…ÑÑÉÌ¹ÍÑå±”€¬€ˆìˆ€è€ˆˆ¤€¬Ù…±Õ•m…ÑÑÉtì(€€€€€€€€€•±Í”¥˜€ ……ÑÑÉÍm…ÑÑÉt€˜˜…ÑÑÈ€„ô€‰½¹Ñ•¹Ñ•‘¥Ñ…‰±”ˆ€˜˜…ÑÑÈ€„ô€‰¹½‘•9…µ”ˆ¤(€€€€€€€€€€€…ÑÑÉÍm…ÑÑÉt€ôMÑÉ¥¹œ¡Ù…±Õ•m…ÑÑÉt¤ì(€€€€€€€ô(€€€ô¤ì(€€€¥˜€ ……ÑÑÉÌ¹ÑÉ…¹Í±…Ñ”¤(€€€€€…ÑÑÉÌ¹ÑÉ…¹Í±…Ñ”€ô€‰¹¼ˆì(€€€É•ÑÕÉ¸m•½É…Ñ¥½¸¹¹½‘” À°Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”°…ÑÑÉÌ¥tì(€ô(€™Õ¹Ñ¥½¸ÕÁ‘…Ñ•ÕÉÍ½É]É…ÁÁ•È¡Ù¥•Ü¤ì(€€€¥˜€¡Ù¥•Ü¹µ…É­ÕÉÍ½È¤ì(€€€€€±•Ð‘½´€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰¥µœˆ¤ì(€€€€€‘½´¹±…ÍÍ9…µ”€ô€‰AÉ½Í•5¥ÉÉ½ÈµÍ•Á…É…Ñ½Èˆì(€€€€€‘½´¹Í•ÑÑÑÉ¥‰ÕÑ” ‰µ…É¬µÁ±…•¡½±‘•Èˆ°€‰ÑÉÕ”ˆ¤ì(€€€€€‘½´¹Í•ÑÑÑÉ¥‰ÕÑ” ‰…±Ðˆ°€ˆˆ¤ì(€€€€€Ù¥•Ü¹ÕÉÍ½É]É…ÁÁ•È€ôì‘½´°‘•¼è•½É…Ñ¥½¸¹Ý¥‘•Ð¡Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´°‘½´°ìÉ…ÜèÑÉÕ”°µ…É­ÌèÙ¥•Ü¹µ…É­ÕÉÍ½Èô¤ôì(€€€ô•±Í”ì(€€€€€Ù¥•Ü¹ÕÉÍ½É]É…ÁÁ•È€ô¹Õ±°ì(€€€ô(€ô(€™Õ¹Ñ¥½¸•Ñ‘¥Ñ…‰±”¡Ù¥•Ü¤ì(€€€É•ÑÕÉ¸€…Ù¥•Ü¹Í½µ•AÉ½À ‰•‘¥Ñ…‰±”ˆ°€¡Ù…±Õ”¤€ôøÙ…±Õ”¡Ù¥•Ü¹ÍÑ…Ñ”¤€ôôô™…±Í”¤ì(€ô(€™Õ¹Ñ¥½¸Í•±•Ñ¥½¹½¹Ñ•áÑ¡…¹•¡Í•°Ä°Í•°È¤ì(€€€±•Ð‘•ÁÑ €ô5…Ñ ¹µ¥¸¡Í•°Ä¸‘…¹¡½È¹Í¡…É•‘•ÁÑ ¡Í•°Ä¹¡•…¤°Í•°È¸‘…¹¡½È¹Í¡…É•‘•ÁÑ ¡Í•°È¹¡•…¤¤ì(€€€É•ÑÕÉ¸Í•°Ä¸‘…¹¡½È¹ÍÑ…ÉÐ¡‘•ÁÑ ¤€„ôÍ•°È¸‘…¹¡½È¹ÍÑ…ÉÐ¡‘•ÁÑ ¤ì(€ô(€™Õ¹Ñ¥½¸‰Õ¥±‘9½‘•Y¥•ÝÌ¡Ù¥•Ü¤ì(€€€±•ÐÉ•ÍÕ±Ð€ô€¼¨}}AUI}|€¨¼=‰©•Ð¹É•…Ñ”¡¹Õ±°¤ì(€€€™Õ¹Ñ¥½¸…‘¡½‰¨¤ì(€€€€€™½È€¡±•ÐÁÉ½À¥¸½‰¨¤(€€€€€€€¥˜€ …=‰©•Ð¹ÁÉ½Ñ½ÑåÁ”¹¡…Í=Ý¹AÉ½Á•ÉÑä¹…±°¡É•ÍÕ±Ð°ÁÉ½À¤¤(€€€€€€€€€É•ÍÕ±ÑmÁÉ½Át€ô½‰©mÁÉ½Átì(€€€ô(€€€Ù¥•Ü¹Í½µ•AÉ½À ‰¹½‘•Y¥•ÝÌˆ°…‘¤ì(€€€Ù¥•Ü¹Í½µ•AÉ½À ‰µ…É­Y¥•ÝÌˆ°…‘¤ì(€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€ô(€™Õ¹Ñ¥½¸¡…¹•‘9½‘•Y¥•ÝÌ¡„°ˆ¤ì(€€€±•Ð¹€ô€À°¹€ô€Àì(€€€™½È€¡±•ÐÁÉ½À¥¸„¤ì(€€€€€¥˜€¡…mÁÉ½Át€„ô‰mÁÉ½Át¤(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€¹¬¬ì(€€€ô(€€€™½È€¡±•Ð|¥¸ˆ¤(€€€€€¹¬¬ì(€€€É•ÑÕÉ¸¹€„ô¹ì(€ô(€™Õ¹Ñ¥½¸¡•­MÑ…Ñ•½µÁ½¹•¹Ð¡Á±Õ¥¸¤ì(€€€¥˜€¡Á±Õ¥¸¹ÍÁ•Œ¹ÍÑ…Ñ”ñðÁ±Õ¥¸¹ÍÁ•Œ¹™¥±Ñ•ÉQÉ…¹Í…Ñ¥½¸ñðÁ±Õ¥¸¹ÍÁ•Œ¹…ÁÁ•¹‘QÉ…¹Í…Ñ¥½¸¤(€€€€€Ñ¡É½Ü¹•ÜI…¹•ÉÉ½È ‰A±Õ¥¹ÌÁ…ÍÍ•‘¥É•Ñ±äÑ¼Ñ¡”Ù¥•ÜµÕÍÐ¹½Ð¡…Ù”„ÍÑ…Ñ”½µÁ½¹•¹Ðˆ¤ì(€ô((€€¼¼¹½‘•}µ½‘Õ±•Ì½ÁÉ½Í•µ¥ÉÉ½Èµ½µµ…¹‘Ì½‘¥ÍÐ½¥¹‘•à¹©Ì(€Ù…È‘•±•Ñ•M•±•Ñ¥½¸€ô€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤€ôøì(€€€¥˜€¡ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹•µÁÑä¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹‘•±•Ñ•M•±•Ñ¥½¸ ¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ôì(€™Õ¹Ñ¥½¸…Ñ	±½­MÑ…ÉÐ¡ÍÑ…Ñ”°Ù¥•Ü¤ì(€€€±•Ðì€‘ÕÉÍ½Èô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€¥˜€ „‘ÕÉÍ½Èñð€¡Ù¥•Ü€ü€…Ù¥•Ü¹•¹‘=™Q•áÑ‰±½¬ ‰‰…­Ý…Éˆ°ÍÑ…Ñ”¤€è€‘ÕÉÍ½È¹Á…É•¹Ñ=™™Í•Ð€ø€À¤¤(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€É•ÑÕÉ¸€‘ÕÉÍ½Èì(€ô(€Ù…È©½¥¹	…­Ý…É€ô€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ °Ù¥•Ü¤€ôøì(€€€±•Ð€‘ÕÉÍ½È€ô…Ñ	±½­MÑ…ÉÐ¡ÍÑ…Ñ”°Ù¥•Ü¤ì(€€€¥˜€ „‘ÕÉÍ½È¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ð€‘ÕÐ€ô™¥¹‘ÕÑ	•™½É” ‘ÕÉÍ½È¤ì(€€€¥˜€ „‘ÕÐ¤ì(€€€€€±•ÐÉ…¹”€ô€‘ÕÉÍ½È¹‰±½­I…¹” ¤°Ñ…É•Ð€ôÉ…¹”€˜˜±¥™ÑQ…É•Ð¡É…¹”¤ì(€€€€€¥˜€¡Ñ…É•Ð€ôô¹Õ±°¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹±¥™Ð¡É…¹”°Ñ…É•Ð¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€±•Ð‰•™½É”€ô€‘ÕÐ¹¹½‘•	•™½É”ì(€€€¥˜€¡‘•±•Ñ•	…ÉÉ¥•È¡ÍÑ…Ñ”°€‘ÕÐ°‘¥ÍÁ…Ñ °€´Ä¤¤(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€¥˜€ ‘ÕÉÍ½È¹Á…É•¹Ð¹½¹Ñ•¹Ð¹Í¥é”€ôô€À€˜˜€¡Ñ•áÑ‰±½­Ð¡‰•™½É”°€‰•¹ˆ¤ñð9½‘•M•±•Ñ¥½¸¹¥ÍM•±•Ñ…‰±”¡‰•™½É”¤¤¤ì(€€€€€™½È€¡±•Ð‘•ÁÑ €ô€‘ÕÉÍ½È¹‘•ÁÑ ì€ì‘•ÁÑ ´´¤ì(€€€€€€€±•Ð‘•±MÑ•À€ôÉ•Á±…•MÑ•À¡ÍÑ…Ñ”¹‘½Œ°€‘ÕÉÍ½È¹‰•™½É”¡‘•ÁÑ ¤°€‘ÕÉÍ½È¹…™Ñ•È¡‘•ÁÑ ¤°M±¥”¹•µÁÑä¤ì(€€€€€€€¥˜€¡‘•±MÑ•À€˜˜‘•±MÑ•À¹Í±¥”¹Í¥é”€ð‘•±MÑ•À¹Ñ¼€´‘•±MÑ•À¹™É½´¤ì(€€€€€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤ì(€€€€€€€€€€€±•ÐÑÈ€ôÍÑ…Ñ”¹ÑÈ¹ÍÑ•À¡‘•±MÑ•À¤ì(€€€€€€€€€€€ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Ñ•áÑ‰±½­Ð¡‰•™½É”°€‰•¹ˆ¤€üM•±•Ñ¥½¸¹™¥¹‘É½´¡ÑÈ¹‘½Œ¹É•Í½±Ù”¡ÑÈ¹µ…ÁÁ¥¹œ¹µ…À ‘ÕÐ¹Á½Ì°€´Ä¤¤°€´Ä¤€è9½‘•M•±•Ñ¥½¸¹É•…Ñ”¡ÑÈ¹‘½Œ°€‘ÕÐ¹Á½Ì€´‰•™½É”¹¹½‘•M¥é”¤¤ì(€€€€€€€€€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€€€€€ô(€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€ô(€€€€€€€¥˜€¡‘•ÁÑ €ôô€Äñð€‘ÕÉÍ½È¹¹½‘”¡‘•ÁÑ €´€Ä¤¹¡¥±‘½Õ¹Ð€ø€Ä¤(€€€€€€€€€‰É•…¬ì(€€€€€ô(€€€ô(€€€¥˜€¡‰•™½É”¹¥ÍÑ½´€˜˜€‘ÕÐ¹‘•ÁÑ €ôô€‘ÕÉÍ½È¹‘•ÁÑ €´€Ä¤ì(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹‘•±•Ñ” ‘ÕÐ¹Á½Ì€´‰•™½É”¹¹½‘•M¥é”°€‘ÕÐ¹Á½Ì¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ôì(€™Õ¹Ñ¥½¸Ñ•áÑ‰±½­Ð¡¹½‘”°Í¥‘”°½¹±ä€ô™…±Í”¤ì(€€€™½È€¡±•ÐÍ…¸€ô¹½‘”ìÍ…¸ìÍ…¸€ôÍ¥‘”€ôô€‰ÍÑ…ÉÐˆ€üÍ…¸¹™¥ÉÍÑ¡¥±€èÍ…¸¹±…ÍÑ¡¥±¤ì(€€€€€¥˜€¡Í…¸¹¥ÍQ•áÑ‰±½¬¤(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€¥˜€¡½¹±ä€˜˜Í…¸¹¡¥±‘½Õ¹Ð€„ô€Ä¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ô(€Ù…ÈÍ•±•Ñ9½‘•	…­Ý…É€ô€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ °Ù¥•Ü¤€ôøì(€€€±•Ðì€‘¡•…°•µÁÑäè•µÁÑäÈô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸°€‘ÕÐ€ô€‘¡•…ì(€€€¥˜€ …•µÁÑäÈ¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€ ‘¡•…¹Á…É•¹Ð¹¥ÍQ•áÑ‰±½¬¤ì(€€€€€¥˜€¡Ù¥•Ü€ü€…Ù¥•Ü¹•¹‘=™Q•áÑ‰±½¬ ‰‰…­Ý…Éˆ°ÍÑ…Ñ”¤€è€‘¡•…¹Á…É•¹Ñ=™™Í•Ð€ø€À¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€‘ÕÐ€ô™¥¹‘ÕÑ	•™½É” ‘¡•…¤ì(€€€ô(€€€±•Ð¹½‘”€ô€‘ÕÐ€˜˜€‘ÕÐ¹¹½‘•	•™½É”ì(€€€¥˜€ …¹½‘”ñð€…9½‘•M•±•Ñ¥½¸¹¥ÍM•±•Ñ…‰±”¡¹½‘”¤¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹Í•ÑM•±•Ñ¥½¸¡9½‘•M•±•Ñ¥½¸¹É•…Ñ”¡ÍÑ…Ñ”¹‘½Œ°€‘ÕÐ¹Á½Ì€´¹½‘”¹¹½‘•M¥é”¤¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ôì(€™Õ¹Ñ¥½¸™¥¹‘ÕÑ	•™½É” ‘Á½Ì¤ì(€€€¥˜€ „‘Á½Ì¹Á…É•¹Ð¹ÑåÁ”¹ÍÁ•Œ¹¥Í½±…Ñ¥¹œ¤(€€€€€™½È€¡±•Ð¤€ô€‘Á½Ì¹‘•ÁÑ €´€Äì¤€øô€Àì¤´´¤ì(€€€€€€€¥˜€ ‘Á½Ì¹¥¹‘•à¡¤¤€ø€À¤(€€€€€€€€€É•ÑÕÉ¸€‘Á½Ì¹‘½Œ¹É•Í½±Ù” ‘Á½Ì¹‰•™½É”¡¤€¬€Ä¤¤ì(€€€€€€€¥˜€ ‘Á½Ì¹¹½‘”¡¤¤¹ÑåÁ”¹ÍÁ•Œ¹¥Í½±…Ñ¥¹œ¤(€€€€€€€€€‰É•…¬ì(€€€€€ô(€€€É•ÑÕÉ¸¹Õ±°ì(€ô(€™Õ¹Ñ¥½¸…Ñ	±½­¹¡ÍÑ…Ñ”°Ù¥•Ü¤ì(€€€±•Ðì€‘ÕÉÍ½Èô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€¥˜€ „‘ÕÉÍ½Èñð€¡Ù¥•Ü€ü€…Ù¥•Ü¹•¹‘=™Q•áÑ‰±½¬ ‰™½ÉÝ…Éˆ°ÍÑ…Ñ”¤€è€‘ÕÉÍ½È¹Á…É•¹Ñ=™™Í•Ð€ð€‘ÕÉÍ½È¹Á…É•¹Ð¹½¹Ñ•¹Ð¹Í¥é”¤¤(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€É•ÑÕÉ¸€‘ÕÉÍ½Èì(€ô(€Ù…È©½¥¹½ÉÝ…É€ô€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ °Ù¥•Ü¤€ôøì(€€€±•Ð€‘ÕÉÍ½È€ô…Ñ	±½­¹¡ÍÑ…Ñ”°Ù¥•Ü¤ì(€€€¥˜€ „‘ÕÉÍ½È¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ð€‘ÕÐ€ô™¥¹‘ÕÑ™Ñ•È ‘ÕÉÍ½È¤ì(€€€¥˜€ „‘ÕÐ¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ð…™Ñ•È€ô€‘ÕÐ¹¹½‘•™Ñ•Èì(€€€¥˜€¡‘•±•Ñ•	…ÉÉ¥•È¡ÍÑ…Ñ”°€‘ÕÐ°‘¥ÍÁ…Ñ °€Ä¤¤(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€¥˜€ ‘ÕÉÍ½È¹Á…É•¹Ð¹½¹Ñ•¹Ð¹Í¥é”€ôô€À€˜˜€¡Ñ•áÑ‰±½­Ð¡…™Ñ•È°€‰ÍÑ…ÉÐˆ¤ñð9½‘•M•±•Ñ¥½¸¹¥ÍM•±•Ñ…‰±”¡…™Ñ•È¤¤¤ì(€€€€€±•Ð‘•±MÑ•À€ôÉ•Á±…•MÑ•À¡ÍÑ…Ñ”¹‘½Œ°€‘ÕÉÍ½È¹‰•™½É” ¤°€‘ÕÉÍ½È¹…™Ñ•È ¤°M±¥”¹•µÁÑä¤ì(€€€€€¥˜€¡‘•±MÑ•À€˜˜‘•±MÑ•À¹Í±¥”¹Í¥é”€ð‘•±MÑ•À¹Ñ¼€´‘•±MÑ•À¹™É½´¤ì(€€€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤ì(€€€€€€€€€±•ÐÑÈ€ôÍÑ…Ñ”¹ÑÈ¹ÍÑ•À¡‘•±MÑ•À¤ì(€€€€€€€€€ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Ñ•áÑ‰±½­Ð¡…™Ñ•È°€‰ÍÑ…ÉÐˆ¤€üM•±•Ñ¥½¸¹™¥¹‘É½´¡ÑÈ¹‘½Œ¹É•Í½±Ù”¡ÑÈ¹µ…ÁÁ¥¹œ¹µ…À ‘ÕÐ¹Á½Ì¤¤°€Ä¤€è9½‘•M•±•Ñ¥½¸¹É•…Ñ”¡ÑÈ¹‘½Œ°ÑÈ¹µ…ÁÁ¥¹œ¹µ…À ‘ÕÐ¹Á½Ì¤¤¤ì(€€€€€€€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô(€€€ô(€€€¥˜€¡…™Ñ•È¹¥ÍÑ½´€˜˜€‘ÕÐ¹‘•ÁÑ €ôô€‘ÕÉÍ½È¹‘•ÁÑ €´€Ä¤ì(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹‘•±•Ñ” ‘ÕÐ¹Á½Ì°€‘ÕÐ¹Á½Ì€¬…™Ñ•È¹¹½‘•M¥é”¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ôì(€Ù…ÈÍ•±•Ñ9½‘•½ÉÝ…É€ô€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ °Ù¥•Ü¤€ôøì(€€€±•Ðì€‘¡•…°•µÁÑäè•µÁÑäÈô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸°€‘ÕÐ€ô€‘¡•…ì(€€€¥˜€ …•µÁÑäÈ¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€ ‘¡•…¹Á…É•¹Ð¹¥ÍQ•áÑ‰±½¬¤ì(€€€€€¥˜€¡Ù¥•Ü€ü€…Ù¥•Ü¹•¹‘=™Q•áÑ‰±½¬ ‰™½ÉÝ…Éˆ°ÍÑ…Ñ”¤€è€‘¡•…¹Á…É•¹Ñ=™™Í•Ð€ð€‘¡•…¹Á…É•¹Ð¹½¹Ñ•¹Ð¹Í¥é”¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€‘ÕÐ€ô™¥¹‘ÕÑ™Ñ•È ‘¡•…¤ì(€€€ô(€€€±•Ð¹½‘”€ô€‘ÕÐ€˜˜€‘ÕÐ¹¹½‘•™Ñ•Èì(€€€¥˜€ …¹½‘”ñð€…9½‘•M•±•Ñ¥½¸¹¥ÍM•±•Ñ…‰±”¡¹½‘”¤¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹Í•ÑM•±•Ñ¥½¸¡9½‘•M•±•Ñ¥½¸¹É•…Ñ”¡ÍÑ…Ñ”¹‘½Œ°€‘ÕÐ¹Á½Ì¤¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ôì(€™Õ¹Ñ¥½¸™¥¹‘ÕÑ™Ñ•È ‘Á½Ì¤ì(€€€¥˜€ „‘Á½Ì¹Á…É•¹Ð¹ÑåÁ”¹ÍÁ•Œ¹¥Í½±…Ñ¥¹œ¤(€€€€€™½È€¡±•Ð¤€ô€‘Á½Ì¹‘•ÁÑ €´€Äì¤€øô€Àì¤´´¤ì(€€€€€€€±•ÐÁ…É•¹Ð€ô€‘Á½Ì¹¹½‘”¡¤¤ì(€€€€€€€¥˜€ ‘Á½Ì¹¥¹‘•à¡¤¤€¬€Ä€ðÁ…É•¹Ð¹¡¥±‘½Õ¹Ð¤(€€€€€€€€€É•ÑÕÉ¸€‘Á½Ì¹‘½Œ¹É•Í½±Ù” ‘Á½Ì¹…™Ñ•È¡¤€¬€Ä¤¤ì(€€€€€€€¥˜€¡Á…É•¹Ð¹ÑåÁ”¹ÍÁ•Œ¹¥Í½±…Ñ¥¹œ¤(€€€€€€€€€‰É•…¬ì(€€€€€ô(€€€É•ÑÕÉ¸¹Õ±°ì(€ô(€Ù…È¹•Ý±¥¹•%¹½‘”€ô€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤€ôøì(€€€±•Ðì€‘¡•…°€‘…¹¡½Èô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€¥˜€ „‘¡•…¹Á…É•¹Ð¹ÑåÁ”¹ÍÁ•Œ¹½‘”ñð€„‘¡•…¹Í…µ•A…É•¹Ð ‘…¹¡½È¤¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹¥¹Í•ÉÑQ•áÐ ‰q¸ˆ¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ôì(€™Õ¹Ñ¥½¸‘•™…Õ±Ñ	±½­Ð¡µ…Ñ È¤ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðµ…Ñ È¹•‘•½Õ¹Ðì¤¬¬¤ì(€€€€€±•ÐìÑåÁ”ô€ôµ…Ñ È¹•‘”¡¤¤ì(€€€€€¥˜€¡ÑåÁ”¹¥ÍQ•áÑ‰±½¬€˜˜€…ÑåÁ”¹¡…ÍI•ÅÕ¥É•‘ÑÑÉÌ ¤¤(€€€€€€€É•ÑÕÉ¸ÑåÁ”ì(€€€ô(€€€É•ÑÕÉ¸¹Õ±°ì(€ô(€Ù…È•á¥Ñ½‘”€ô€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤€ôøì(€€€±•Ðì€‘¡•…°€‘…¹¡½Èô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€¥˜€ „‘¡•…¹Á…É•¹Ð¹ÑåÁ”¹ÍÁ•Œ¹½‘”ñð€„‘¡•…¹Í…µ•A…É•¹Ð ‘…¹¡½È¤¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ð…‰½Ù”€ô€‘¡•…¹¹½‘” ´Ä¤°…™Ñ•È€ô€‘¡•…¹¥¹‘•á™Ñ•È ´Ä¤°ÑåÁ”€ô‘•™…Õ±Ñ	±½­Ð¡…‰½Ù”¹½¹Ñ•¹Ñ5…Ñ¡Ð¡…™Ñ•È¤¤ì(€€€¥˜€ …ÑåÁ”ñð€……‰½Ù”¹…¹I•Á±…•]¥Ñ ¡…™Ñ•È°…™Ñ•È°ÑåÁ”¤¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€¡‘¥ÍÁ…Ñ ¤ì(€€€€€±•ÐÁ½Ì€ô€‘¡•…¹…™Ñ•È ¤°ÑÈ€ôÍÑ…Ñ”¹ÑÈ¹É•Á±…•]¥Ñ ¡Á½Ì°Á½Ì°ÑåÁ”¹É•…Ñ•¹‘¥±° ¤¤ì(€€€€€ÑÈ¹Í•ÑM•±•Ñ¥½¸¡M•±•Ñ¥½¸¹¹•…È¡ÑÈ¹‘½Œ¹É•Í½±Ù”¡Á½Ì¤°€Ä¤¤ì(€€€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€ô(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ôì(€Ù…ÈÉ•…Ñ•A…É…É…Á¡9•…È€ô€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤€ôøì(€€€±•ÐÍ•°€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸°ì€‘™É½´°€‘Ñ¼ô€ôÍ•°ì(€€€¥˜€¡Í•°¥¹ÍÑ…¹•½˜±±M•±•Ñ¥½¸ñð€‘™É½´¹Á…É•¹Ð¹¥¹±¥¹•½¹Ñ•¹Ðñð€‘Ñ¼¹Á…É•¹Ð¹¥¹±¥¹•½¹Ñ•¹Ð¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•ÐÑåÁ”€ô‘•™…Õ±Ñ	±½­Ð ‘Ñ¼¹Á…É•¹Ð¹½¹Ñ•¹Ñ5…Ñ¡Ð ‘Ñ¼¹¥¹‘•á™Ñ•È ¤¤¤ì(€€€¥˜€ …ÑåÁ”ñð€…ÑåÁ”¹¥ÍQ•áÑ‰±½¬¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€¡‘¥ÍÁ…Ñ ¤ì(€€€€€±•ÐÍ¥‘”€ô€ „‘™É½´¹Á…É•¹Ñ=™™Í•Ð€˜˜€‘Ñ¼¹¥¹‘•à ¤€ð€‘Ñ¼¹Á…É•¹Ð¹¡¥±‘½Õ¹Ð€ü€‘™É½´€è€‘Ñ¼¤¹Á½Ìì(€€€€€±•ÐÑÈ€ôÍÑ…Ñ”¹ÑÈ¹¥¹Í•ÉÐ¡Í¥‘”°ÑåÁ”¹É•…Ñ•¹‘¥±° ¤¤ì(€€€€€ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Q•áÑM•±•Ñ¥½¸¹É•…Ñ”¡ÑÈ¹‘½Œ°Í¥‘”€¬€Ä¤¤ì(€€€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€ô(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ôì(€Ù…È±¥™ÑµÁÑå	±½¬€ô€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤€ôøì(€€€±•Ðì€‘ÕÉÍ½Èô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€¥˜€ „‘ÕÉÍ½Èñð€‘ÕÉÍ½È¹Á…É•¹Ð¹½¹Ñ•¹Ð¹Í¥é”¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€ ‘ÕÉÍ½È¹‘•ÁÑ €ø€Ä€˜˜€‘ÕÉÍ½È¹…™Ñ•È ¤€„ô€‘ÕÉÍ½È¹•¹ ´Ä¤¤ì(€€€€€±•Ð‰•™½É”€ô€‘ÕÉÍ½È¹‰•™½É” ¤ì(€€€€€¥˜€¡…¹MÁ±¥Ð¡ÍÑ…Ñ”¹‘½Œ°‰•™½É”¤¤ì(€€€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹ÍÁ±¥Ð¡‰•™½É”¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô(€€€ô(€€€±•ÐÉ…¹”€ô€‘ÕÉÍ½È¹‰±½­I…¹” ¤°Ñ…É•Ð€ôÉ…¹”€˜˜±¥™ÑQ…É•Ð¡É…¹”¤ì(€€€¥˜€¡Ñ…É•Ð€ôô¹Õ±°¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹±¥™Ð¡É…¹”°Ñ…É•Ð¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ôì(€™Õ¹Ñ¥½¸ÍÁ±¥Ñ	±½­Ì¡ÍÁ±¥Ñ9½‘”¤ì(€€€É•ÑÕÉ¸€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤€ôøì(€€€€€±•Ðì€‘™É½´°€‘Ñ¼ô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€€€¥˜€¡ÍÑ…Ñ”¹Í•±•Ñ¥½¸¥¹ÍÑ…¹•½˜9½‘•M•±•Ñ¥½¸€˜˜ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹¹½‘”¹¥Í	±½¬¤ì(€€€€€€€¥˜€ „‘™É½´¹Á…É•¹Ñ=™™Í•Ðñð€……¹MÁ±¥Ð¡ÍÑ…Ñ”¹‘½Œ°€‘™É½´¹Á½Ì¤¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹ÍÁ±¥Ð ‘™É½´¹Á½Ì¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô(€€€€€¥˜€ „‘™É½´¹‘•ÁÑ ¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€±•ÐÑåÁ•Ì€ômtì(€€€€€±•ÐÍÁ±¥Ñ•ÁÑ °‘•™±Ð°…Ñ¹€ô™…±Í”°…ÑMÑ…ÉÐ€ô™…±Í”ì(€€€€€™½È€¡±•Ð€ô€‘™É½´¹‘•ÁÑ ì€ì´´¤ì(€€€€€€€±•Ð¹½‘”€ô€‘™É½´¹¹½‘”¡¤ì(€€€€€€€¥˜€¡¹½‘”¹¥Í	±½¬¤ì(€€€€€€€€€…Ñ¹€ô€‘™É½´¹•¹¡¤€ôô€‘™É½´¹Á½Ì€¬€ ‘™É½´¹‘•ÁÑ €´¤ì(€€€€€€€€€…ÑMÑ…ÉÐ€ô€‘™É½´¹ÍÑ…ÉÐ¡¤€ôô€‘™É½´¹Á½Ì€´€ ‘™É½´¹‘•ÁÑ €´¤ì(€€€€€€€€€‘•™±Ð€ô‘•™…Õ±Ñ	±½­Ð ‘™É½´¹¹½‘”¡€´€Ä¤¹½¹Ñ•¹Ñ5…Ñ¡Ð ‘™É½´¹¥¹‘•á™Ñ•È¡€´€Ä¤¤¤ì(€€€€€€€€€±•ÐÍÁ±¥ÑQåÁ”€ôÍÁ±¥Ñ9½‘”€˜˜ÍÁ±¥Ñ9½‘” ‘Ñ¼¹Á…É•¹Ð°…Ñ¹°€‘™É½´¤ì(€€€€€€€€€ÑåÁ•Ì¹Õ¹Í¡¥™Ð¡ÍÁ±¥ÑQåÁ”ñð€¡…Ñ¹€˜˜‘•™±Ð€üìÑåÁ”è‘•™±Ðô€è¹Õ±°¤¤ì(€€€€€€€€€ÍÁ±¥Ñ•ÁÑ €ôì(€€€€€€€€€‰É•…¬ì(€€€€€€€ô•±Í”ì(€€€€€€€€€¥˜€¡€ôô€Ä¤(€€€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€€€ÑåÁ•Ì¹Õ¹Í¡¥™Ð¡¹Õ±°¤ì(€€€€€€€ô(€€€€€ô(€€€€€±•ÐÑÈ€ôÍÑ…Ñ”¹ÑÈì(€€€€€¥˜€¡ÍÑ…Ñ”¹Í•±•Ñ¥½¸¥¹ÍÑ…¹•½˜Q•áÑM•±•Ñ¥½¸ñðÍÑ…Ñ”¹Í•±•Ñ¥½¸¥¹ÍÑ…¹•½˜±±M•±•Ñ¥½¸¤(€€€€€€€ÑÈ¹‘•±•Ñ•M•±•Ñ¥½¸ ¤ì(€€€€€±•ÐÍÁ±¥ÑA½Ì€ôÑÈ¹µ…ÁÁ¥¹œ¹µ…À ‘™É½´¹Á½Ì¤ì(€€€€€±•Ð…¸€ô…¹MÁ±¥Ð¡ÑÈ¹‘½Œ°ÍÁ±¥ÑA½Ì°ÑåÁ•Ì¹±•¹Ñ °ÑåÁ•Ì¤ì(€€€€€¥˜€ ……¸¤ì(€€€€€€€ÑåÁ•ÍlÁt€ô‘•™±Ð€üìÑåÁ”è‘•™±Ðô€è¹Õ±°ì(€€€€€€€…¸€ô…¹MÁ±¥Ð¡ÑÈ¹‘½Œ°ÍÁ±¥ÑA½Ì°ÑåÁ•Ì¹±•¹Ñ °ÑåÁ•Ì¤ì(€€€€€ô(€€€€€¥˜€ ……¸¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€ÑÈ¹ÍÁ±¥Ð¡ÍÁ±¥ÑA½Ì°ÑåÁ•Ì¹±•¹Ñ °ÑåÁ•Ì¤ì(€€€€€¥˜€ ……Ñ¹€˜˜…ÑMÑ…ÉÐ€˜˜€‘™É½´¹¹½‘”¡ÍÁ±¥Ñ•ÁÑ ¤¹ÑåÁ”€„ô‘•™±Ð¤ì(€€€€€€€±•Ð™¥ÉÍÐ€ôÑÈ¹µ…ÁÁ¥¹œ¹µ…À ‘™É½´¹‰•™½É”¡ÍÁ±¥Ñ•ÁÑ ¤¤°€‘™¥ÉÍÐ€ôÑÈ¹‘½Œ¹É•Í½±Ù”¡™¥ÉÍÐ¤ì(€€€€€€€¥˜€¡‘•™±Ð€˜˜€‘™É½´¹¹½‘”¡ÍÁ±¥Ñ•ÁÑ €´€Ä¤¹…¹I•Á±…•]¥Ñ  ‘™¥ÉÍÐ¹¥¹‘•à ¤°€‘™¥ÉÍÐ¹¥¹‘•à ¤€¬€Ä°‘•™±Ð¤¤(€€€€€€€€€ÑÈ¹Í•Ñ9½‘•5…É­ÕÀ¡ÑÈ¹µ…ÁÁ¥¹œ¹µ…À ‘™É½´¹‰•™½É”¡ÍÁ±¥Ñ•ÁÑ ¤¤°‘•™±Ð¤ì(€€€€€ô(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ôì(€ô(€Ù…ÈÍÁ±¥Ñ	±½¬€ôÍÁ±¥Ñ	±½­Ì ¤ì(€Ù…ÈÍ•±•Ñ±°€ô€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤€ôøì(€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹Í•ÑM•±•Ñ¥½¸¡¹•Ü±±M•±•Ñ¥½¸¡ÍÑ…Ñ”¹‘½Œ¤¤¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ôì(€™Õ¹Ñ¥½¸©½¥¹5…å‰•±•…È¡ÍÑ…Ñ”°€‘Á½Ì°‘¥ÍÁ…Ñ ¤ì(€€€±•Ð‰•™½É”€ô€‘Á½Ì¹¹½‘•	•™½É”°…™Ñ•È€ô€‘Á½Ì¹¹½‘•™Ñ•È°¥¹‘•à€ô€‘Á½Ì¹¥¹‘•à ¤ì(€€€¥˜€ …‰•™½É”ñð€……™Ñ•Èñð€…‰•™½É”¹ÑåÁ”¹½µÁ…Ñ¥‰±•½¹Ñ•¹Ð¡…™Ñ•È¹ÑåÁ”¤¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€ …‰•™½É”¹½¹Ñ•¹Ð¹Í¥é”€˜˜€‘Á½Ì¹Á…É•¹Ð¹…¹I•Á±…”¡¥¹‘•à€´€Ä°¥¹‘•à¤¤ì(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹‘•±•Ñ” ‘Á½Ì¹Á½Ì€´‰•™½É”¹¹½‘•M¥é”°€‘Á½Ì¹Á½Ì¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€¥˜€ „‘Á½Ì¹Á…É•¹Ð¹…¹I•Á±…”¡¥¹‘•à°¥¹‘•à€¬€Ä¤ñð€„¡…™Ñ•È¹¥ÍQ•áÑ‰±½¬ñð…¹)½¥¸¡ÍÑ…Ñ”¹‘½Œ°€‘Á½Ì¹Á½Ì¤¤¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹©½¥¸ ‘Á½Ì¹Á½Ì¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ô(€™Õ¹Ñ¥½¸‘•±•Ñ•	…ÉÉ¥•È¡ÍÑ…Ñ”°€‘ÕÐ°‘¥ÍÁ…Ñ °‘¥È¤ì(€€€±•Ð‰•™½É”€ô€‘ÕÐ¹¹½‘•	•™½É”°…™Ñ•È€ô€‘ÕÐ¹¹½‘•™Ñ•È°½¹¸°µ…Ñ Èì(€€€±•Ð¥Í½±…Ñ•€ô‰•™½É”¹ÑåÁ”¹ÍÁ•Œ¹¥Í½±…Ñ¥¹œñð…™Ñ•È¹ÑåÁ”¹ÍÁ•Œ¹¥Í½±…Ñ¥¹œì(€€€¥˜€ …¥Í½±…Ñ•€˜˜©½¥¹5…å‰•±•…È¡ÍÑ…Ñ”°€‘ÕÐ°‘¥ÍÁ…Ñ ¤¤(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€±•Ð…¹•±™Ñ•È€ô€…¥Í½±…Ñ•€˜˜€‘ÕÐ¹Á…É•¹Ð¹…¹I•Á±…” ‘ÕÐ¹¥¹‘•à ¤°€‘ÕÐ¹¥¹‘•à ¤€¬€Ä¤ì(€€€¥˜€¡…¹•±™Ñ•È€˜˜€¡½¹¸€ô€¡µ…Ñ È€ô‰•™½É”¹½¹Ñ•¹Ñ5…Ñ¡Ð¡‰•™½É”¹¡¥±‘½Õ¹Ð¤¤¹™¥¹‘]É…ÁÁ¥¹œ¡…™Ñ•È¹ÑåÁ”¤¤€˜˜µ…Ñ È¹µ…Ñ¡QåÁ”¡½¹¹lÁtñð…™Ñ•È¹ÑåÁ”¤¹Ù…±¥‘¹¤ì(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤ì(€€€€€€€±•Ð•¹€ô€‘ÕÐ¹Á½Ì€¬…™Ñ•È¹¹½‘•M¥é”°ÝÉ…ÀÈ€ôÉ…µ•¹Ð¹•µÁÑäì(€€€€€€€™½È€¡±•Ð¤€ô½¹¸¹±•¹Ñ €´€Äì¤€øô€Àì¤´´¤(€€€€€€€€€ÝÉ…ÀÈ€ôÉ…µ•¹Ð¹™É½´¡½¹¹m¥t¹É•…Ñ”¡¹Õ±°°ÝÉ…ÀÈ¤¤ì(€€€€€€€ÝÉ…ÀÈ€ôÉ…µ•¹Ð¹™É½´¡‰•™½É”¹½Áä¡ÝÉ…ÀÈ¤¤ì(€€€€€€€±•ÐÑÈ€ôÍÑ…Ñ”¹ÑÈ¹ÍÑ•À¡¹•ÜI•Á±…•É½Õ¹‘MÑ•À ‘ÕÐ¹Á½Ì€´€Ä°•¹°€‘ÕÐ¹Á½Ì°•¹°¹•ÜM±¥”¡ÝÉ…ÀÈ°€Ä°€À¤°½¹¸¹±•¹Ñ °ÑÉÕ”¤¤ì(€€€€€€€±•Ð€‘©½¥¹Ð€ôÑÈ¹‘½Œ¹É•Í½±Ù”¡•¹€¬€È€¨½¹¸¹±•¹Ñ ¤ì(€€€€€€€¥˜€ ‘©½¥¹Ð¹¹½‘•™Ñ•È€˜˜€‘©½¥¹Ð¹¹½‘•™Ñ•È¹ÑåÁ”€ôô‰•™½É”¹ÑåÁ”€˜˜…¹)½¥¸¡ÑÈ¹‘½Œ°€‘©½¥¹Ð¹Á½Ì¤¤(€€€€€€€€€ÑÈ¹©½¥¸ ‘©½¥¹Ð¹Á½Ì¤ì(€€€€€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€±•ÐÍ•±™Ñ•È€ô…™Ñ•È¹ÑåÁ”¹ÍÁ•Œ¹¥Í½±…Ñ¥¹œñð‘¥È€ø€À€˜˜¥Í½±…Ñ•€ü¹Õ±°€èM•±•Ñ¥½¸¹™¥¹‘É½´ ‘ÕÐ°€Ä¤ì(€€€±•ÐÉ…¹”€ôÍ•±™Ñ•È€˜˜Í•±™Ñ•È¸‘™É½´¹‰±½­I…¹”¡Í•±™Ñ•È¸‘Ñ¼¤°Ñ…É•Ð€ôÉ…¹”€˜˜±¥™ÑQ…É•Ð¡É…¹”¤ì(€€€¥˜€¡Ñ…É•Ð€„ô¹Õ±°€˜˜Ñ…É•Ð€øô€‘ÕÐ¹‘•ÁÑ ¤ì(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹±¥™Ð¡É…¹”°Ñ…É•Ð¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€¥˜€¡…¹•±™Ñ•È€˜˜Ñ•áÑ‰±½­Ð¡…™Ñ•È°€‰ÍÑ…ÉÐˆ°ÑÉÕ”¤€˜˜Ñ•áÑ‰±½­Ð¡‰•™½É”°€‰•¹ˆ¤¤ì(€€€€€±•Ð…Ð€ô‰•™½É”°ÝÉ…ÀÈ€ômtì(€€€€€™½È€ ì€ì€¤ì(€€€€€€€ÝÉ…ÀÈ¹ÁÕÍ ¡…Ð¤ì(€€€€€€€¥˜€¡…Ð¹¥ÍQ•áÑ‰±½¬¤(€€€€€€€€€‰É•…¬ì(€€€€€€€…Ð€ô…Ð¹±…ÍÑ¡¥±ì(€€€€€ô(€€€€€±•Ð…™Ñ•ÉQ•áÐ€ô…™Ñ•È°…™Ñ•É•ÁÑ €ô€Äì(€€€€€™½È€ ì€……™Ñ•ÉQ•áÐ¹¥ÍQ•áÑ‰±½¬ì…™Ñ•ÉQ•áÐ€ô…™Ñ•ÉQ•áÐ¹™¥ÉÍÑ¡¥±¤(€€€€€€€…™Ñ•É•ÁÑ ¬¬ì(€€€€€¥˜€¡…Ð¹…¹I•Á±…”¡…Ð¹¡¥±‘½Õ¹Ð°…Ð¹¡¥±‘½Õ¹Ð°…™Ñ•ÉQ•áÐ¹½¹Ñ•¹Ð¤¤ì(€€€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤ì(€€€€€€€€€±•Ð•¹€ôÉ…µ•¹Ð¹•µÁÑäì(€€€€€€€€€™½È€¡±•Ð¤€ôÝÉ…ÀÈ¹±•¹Ñ €´€Äì¤€øô€Àì¤´´¤(€€€€€€€€€€€•¹€ôÉ…µ•¹Ð¹™É½´¡ÝÉ…ÀÉm¥t¹½Áä¡•¹¤¤ì(€€€€€€€€€±•ÐÑÈ€ôÍÑ…Ñ”¹ÑÈ¹ÍÑ•À¡¹•ÜI•Á±…•É½Õ¹‘MÑ•À ‘ÕÐ¹Á½Ì€´ÝÉ…ÀÈ¹±•¹Ñ °€‘ÕÐ¹Á½Ì€¬…™Ñ•È¹¹½‘•M¥é”°€‘ÕÐ¹Á½Ì€¬…™Ñ•É•ÁÑ °€‘ÕÐ¹Á½Ì€¬…™Ñ•È¹¹½‘•M¥é”€´…™Ñ•É•ÁÑ °¹•ÜM±¥”¡•¹°ÝÉ…ÀÈ¹±•¹Ñ °€À¤°€À°ÑÉÕ”¤¤ì(€€€€€€€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ô(€™Õ¹Ñ¥½¸Í•±•ÑQ•áÑ‰±½­M¥‘”¡Í¥‘”¤ì(€€€É•ÑÕÉ¸™Õ¹Ñ¥½¸¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤ì(€€€€€±•ÐÍ•°€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸°€‘Á½Ì€ôÍ¥‘”€ð€À€üÍ•°¸‘™É½´€èÍ•°¸‘Ñ¼ì(€€€€€±•Ð‘•ÁÑ €ô€‘Á½Ì¹‘•ÁÑ ì(€€€€€Ý¡¥±”€ ‘Á½Ì¹¹½‘”¡‘•ÁÑ ¤¹¥Í%¹±¥¹”¤ì(€€€€€€€¥˜€ …‘•ÁÑ ¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€‘•ÁÑ ´´ì(€€€€€ô(€€€€€¥˜€ „‘Á½Ì¹¹½‘”¡‘•ÁÑ ¤¹¥ÍQ•áÑ‰±½¬¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Q•áÑM•±•Ñ¥½¸¹É•…Ñ”¡ÍÑ…Ñ”¹‘½Œ°Í¥‘”€ð€À€ü€‘Á½Ì¹ÍÑ…ÉÐ¡‘•ÁÑ ¤€è€‘Á½Ì¹•¹¡‘•ÁÑ ¤¤¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ôì(€ô(€Ù…ÈÍ•±•ÑQ•áÑ‰±½­MÑ…ÉÐ€ôÍ•±•ÑQ•áÑ‰±½­M¥‘” ´Ä¤ì(€Ù…ÈÍ•±•ÑQ•áÑ‰±½­¹€ôÍ•±•ÑQ•áÑ‰±½­M¥‘” Ä¤ì(€™Õ¹Ñ¥½¸Í•Ñ	±½­QåÁ”È¡¹½‘•QåÁ”°…ÑÑÉÌ€ô¹Õ±°¤ì(€€€É•ÑÕÉ¸™Õ¹Ñ¥½¸¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤ì(€€€€€±•Ð…ÁÁ±¥…‰±”€ô™…±Í”ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÍÑ…Ñ”¹Í•±•Ñ¥½¸¹É…¹•Ì¹±•¹Ñ €˜˜€……ÁÁ±¥…‰±”ì¤¬¬¤ì(€€€€€€€±•Ðì€‘™É½´èìÁ½Ìè™É½´Èô°€‘Ñ¼èìÁ½ÌèÑ¼ôô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸¹É…¹•Ím¥tì(€€€€€€€ÍÑ…Ñ”¹‘½Œ¹¹½‘•Í	•ÑÝ••¸¡™É½´È°Ñ¼°€¡¹½‘”°Á½Ì¤€ôøì(€€€€€€€€€¥˜€¡…ÁÁ±¥…‰±”¤(€€€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€€€¥˜€ …¹½‘”¹¥ÍQ•áÑ‰±½¬ñð¹½‘”¹¡…Í5…É­ÕÀ¡¹½‘•QåÁ”°…ÑÑÉÌ¤¤(€€€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€€€¥˜€¡¹½‘”¹ÑåÁ”€ôô¹½‘•QåÁ”¤ì(€€€€€€€€€€€…ÁÁ±¥…‰±”€ôÑÉÕ”ì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€±•Ð€‘Á½Ì€ôÍÑ…Ñ”¹‘½Œ¹É•Í½±Ù”¡Á½Ì¤°¥¹‘•à€ô€‘Á½Ì¹¥¹‘•à ¤ì(€€€€€€€€€€€…ÁÁ±¥…‰±”€ô€‘Á½Ì¹Á…É•¹Ð¹…¹I•Á±…•]¥Ñ ¡¥¹‘•à°¥¹‘•à€¬€Ä°¹½‘•QåÁ”¤ì(€€€€€€€€€ô(€€€€€€€ô¤ì(€€€€€ô(€€€€€¥˜€ ……ÁÁ±¥…‰±”¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤ì(€€€€€€€±•ÐÑÈ€ôÍÑ…Ñ”¹ÑÈì(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÍÑ…Ñ”¹Í•±•Ñ¥½¸¹É…¹•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€±•Ðì€‘™É½´èìÁ½Ìè™É½´Èô°€‘Ñ¼èìÁ½ÌèÑ¼ôô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸¹É…¹•Ím¥tì(€€€€€€€€€ÑÈ¹Í•Ñ	±½­QåÁ”¡™É½´È°Ñ¼°¹½‘•QåÁ”°…ÑÑÉÌ¤ì(€€€€€€€ô(€€€€€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ôì(€ô(€™Õ¹Ñ¥½¸µ…É­ÁÁ±¥•Ì¡‘½ŒÔ°É…¹•Ì°ÑåÁ”°•¹Ñ•ÉÑ½µÌ¤ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðÉ…¹•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•Ðì€‘™É½´°€‘Ñ¼ô€ôÉ…¹•Ím¥tì(€€€€€±•Ð…¸€ô€‘™É½´¹‘•ÁÑ €ôô€À€ü‘½ŒÔ¹¥¹±¥¹•½¹Ñ•¹Ð€˜˜‘½ŒÔ¹ÑåÁ”¹…±±½ÝÍ5…É­QåÁ”¡ÑåÁ”¤€è™…±Í”ì(€€€€€‘½ŒÔ¹¹½‘•Í	•ÑÝ••¸ ‘™É½´¹Á½Ì°€‘Ñ¼¹Á½Ì°€¡¹½‘”°Á½Ì¤€ôøì(€€€€€€€¥˜€¡…¸ñð€…•¹Ñ•ÉÑ½µÌ€˜˜¹½‘”¹¥ÍÑ½´€˜˜¹½‘”¹¥Í%¹±¥¹”€˜˜Á½Ì€øô€‘™É½´¹Á½Ì€˜˜Á½Ì€¬¹½‘”¹¹½‘•M¥é”€ðô€‘Ñ¼¹Á½Ì¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€…¸€ô¹½‘”¹¥¹±¥¹•½¹Ñ•¹Ð€˜˜¹½‘”¹ÑåÁ”¹…±±½ÝÍ5…É­QåÁ”¡ÑåÁ”¤ì(€€€€€ô¤ì(€€€€€¥˜€¡…¸¤(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€É•ÑÕÉ¸™…±Í”ì(€ô(€™Õ¹Ñ¥½¸É•µ½Ù•%¹±¥¹•Ñ½µÌ¡É…¹•Ì¤ì(€€€±•ÐÉ•ÍÕ±Ð€ômtì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðÉ…¹•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€±•Ðì€‘™É½´°€‘Ñ¼ô€ôÉ…¹•Ím¥tì(€€€€€€‘™É½´¹‘½Œ¹¹½‘•Í	•ÑÝ••¸ ‘™É½´¹Á½Ì°€‘Ñ¼¹Á½Ì°€¡¹½‘”°Á½Ì¤€ôøì(€€€€€€€¥˜€¡¹½‘”¹¥ÍÑ½´€˜˜¹½‘”¹½¹Ñ•¹Ð¹Í¥é”€˜˜¹½‘”¹¥Í%¹±¥¹”€˜˜Á½Ì€øô€‘™É½´¹Á½Ì€˜˜Á½Ì€¬¹½‘”¹¹½‘•M¥é”€ðô€‘Ñ¼¹Á½Ì¤ì(€€€€€€€€€¥˜€¡Á½Ì€¬€Ä€ø€‘™É½´¹Á½Ì¤(€€€€€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡¹•ÜM•±•Ñ¥½¹I…¹” ‘™É½´°€‘™É½´¹‘½Œ¹É•Í½±Ù”¡Á½Ì€¬€Ä¤¤¤ì(€€€€€€€€€€‘™É½´€ô€‘™É½´¹‘½Œ¹É•Í½±Ù”¡Á½Ì€¬€Ä€¬¹½‘”¹½¹Ñ•¹Ð¹Í¥é”¤ì(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€ô(€€€€€ô¤ì(€€€€€¥˜€ ‘™É½´¹Á½Ì€ð€‘Ñ¼¹Á½Ì¤(€€€€€€€É•ÍÕ±Ð¹ÁÕÍ ¡¹•ÜM•±•Ñ¥½¹I…¹” ‘™É½´°€‘Ñ¼¤¤ì(€€€ô(€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€ô(€™Õ¹Ñ¥½¸Ñ½±•5…É¬¡µ…É­QåÁ”°…ÑÑÉÌ€ô¹Õ±°°½ÁÑ¥½¹Ì¤ì(€€€±•ÐÉ•µ½Ù•]¡•¹AÉ•Í•¹Ð€ô€¡½ÁÑ¥½¹Ì€˜˜½ÁÑ¥½¹Ì¹É•µ½Ù•]¡•¹AÉ•Í•¹Ð¤€„ôô™…±Í”ì(€€€±•Ð•¹Ñ•ÉÑ½µÌ€ô€¡½ÁÑ¥½¹Ì€˜˜½ÁÑ¥½¹Ì¹•¹Ñ•É%¹±¥¹•Ñ½µÌ¤€„ôô™…±Í”ì(€€€±•Ð‘É½ÁMÁ…”€ô€„¡½ÁÑ¥½¹Ì€˜˜½ÁÑ¥½¹Ì¹¥¹±Õ‘•]¡¥Ñ•ÍÁ…”¤ì(€€€É•ÑÕÉ¸™Õ¹Ñ¥½¸¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤ì(€€€€€±•Ðì•µÁÑäè•µÁÑäÈ°€‘ÕÉÍ½È°É…¹•Ìô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€€€¥˜€¡•µÁÑäÈ€˜˜€„‘ÕÉÍ½Èñð€…µ…É­ÁÁ±¥•Ì¡ÍÑ…Ñ”¹‘½Œ°É…¹•Ì°µ…É­QåÁ”°•¹Ñ•ÉÑ½µÌ¤¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤ì(€€€€€€€¥˜€ ‘ÕÉÍ½È¤ì(€€€€€€€€€¥˜€¡µ…É­QåÁ”¹¥Í%¹M•Ð¡ÍÑ…Ñ”¹ÍÑ½É•‘5…É­Ìñð€‘ÕÉÍ½È¹µ…É­Ì ¤¤¤(€€€€€€€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹É•µ½Ù•MÑ½É•‘5…É¬¡µ…É­QåÁ”¤¤ì(€€€€€€€€€•±Í”(€€€€€€€€€€€‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹…‘‘MÑ½É•‘5…É¬¡µ…É­QåÁ”¹É•…Ñ”¡…ÑÑÉÌ¤¤¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€±•Ð…‘°ÑÈ€ôÍÑ…Ñ”¹ÑÈì(€€€€€€€€€¥˜€ …•¹Ñ•ÉÑ½µÌ¤(€€€€€€€€€€€É…¹•Ì€ôÉ•µ½Ù•%¹±¥¹•Ñ½µÌ¡É…¹•Ì¤ì(€€€€€€€€€¥˜€¡É•µ½Ù•]¡•¹AÉ•Í•¹Ð¤ì(€€€€€€€€€€€…‘€ô€…É…¹•Ì¹Í½µ” ¡È¤€ôøÍÑ…Ñ”¹‘½Œ¹É…¹•!…Í5…É¬¡È¸‘™É½´¹Á½Ì°È¸‘Ñ¼¹Á½Ì°µ…É­QåÁ”¤¤ì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€…‘€ô€…É…¹•Ì¹•Ù•Éä ¡È¤€ôøì(€€€€€€€€€€€€€±•Ðµ¥ÍÍ¥¹œ€ô™…±Í”ì(€€€€€€€€€€€€€ÑÈ¹‘½Œ¹¹½‘•Í	•ÑÝ••¸¡È¸‘™É½´¹Á½Ì°È¸‘Ñ¼¹Á½Ì°€¡¹½‘”°Á½Ì°Á…É•¹Ð¤€ôøì(€€€€€€€€€€€€€€€¥˜€¡µ¥ÍÍ¥¹œ¤(€€€€€€€€€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€€€€€€€€€µ¥ÍÍ¥¹œ€ô€…µ…É­QåÁ”¹¥Í%¹M•Ð¡¹½‘”¹µ…É­Ì¤€˜˜€„…Á…É•¹Ð€˜˜Á…É•¹Ð¹ÑåÁ”¹…±±½ÝÍ5…É­QåÁ”¡µ…É­QåÁ”¤€˜˜€„¡¹½‘”¹¥ÍQ•áÐ€˜˜€½yqÌ¨¼¹Ñ•ÍÐ¡¹½‘”¹Ñ•áÑ	•ÑÝ••¸¡5…Ñ ¹µ…à À°È¸‘™É½´¹Á½Ì€´Á½Ì¤°5…Ñ ¹µ¥¸¡¹½‘”¹¹½‘•M¥é”°È¸‘Ñ¼¹Á½Ì€´Á½Ì¤¤¤¤ì(€€€€€€€€€€€€€ô¤ì(€€€€€€€€€€€€€É•ÑÕÉ¸€…µ¥ÍÍ¥¹œì(€€€€€€€€€€€ô¤ì(€€€€€€€€€ô(€€€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ðÉ…¹•Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€€€€€±•Ðì€‘™É½´°€‘Ñ¼ô€ôÉ…¹•Ím¥tì(€€€€€€€€€€€¥˜€ ……‘¤ì(€€€€€€€€€€€€€ÑÈ¹É•µ½Ù•5…É¬ ‘™É½´¹Á½Ì°€‘Ñ¼¹Á½Ì°µ…É­QåÁ”¤ì(€€€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€€€±•Ð™É½´È€ô€‘™É½´¹Á½Ì°Ñ¼€ô€‘Ñ¼¹Á½Ì°ÍÑ…ÉÐ€ô€‘™É½´¹¹½‘•™Ñ•È°•¹€ô€‘Ñ¼¹¹½‘•	•™½É”ì(€€€€€€€€€€€€€±•ÐÍÁ…•MÑ…ÉÐ€ô‘É½ÁMÁ…”€˜˜ÍÑ…ÉÐ€˜˜ÍÑ…ÉÐ¹¥ÍQ•áÐ€ü€½yqÌ¨¼¹•á•Œ¡ÍÑ…ÉÐ¹Ñ•áÐ¥lÁt¹±•¹Ñ €è€Àì(€€€€€€€€€€€€€±•ÐÍÁ…•¹€ô‘É½ÁMÁ…”€˜˜•¹€˜˜•¹¹¥ÍQ•áÐ€ü€½qÌ¨¼¹•á•Œ¡•¹¹Ñ•áÐ¥lÁt¹±•¹Ñ €è€Àì(€€€€€€€€€€€€€¥˜€¡™É½´È€¬ÍÁ…•MÑ…ÉÐ€ðÑ¼¤ì(€€€€€€€€€€€€€€€™É½´È€¬ôÍÁ…•MÑ…ÉÐì(€€€€€€€€€€€€€€€Ñ¼€´ôÍÁ…•¹ì(€€€€€€€€€€€€€ô(€€€€€€€€€€€€€ÑÈ¹…‘‘5…É¬¡™É½´È°Ñ¼°µ…É­QåÁ”¹É•…Ñ”¡…ÑÑÉÌ¤¤ì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€€€ô(€€€€€ô(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ôì(€ô(€™Õ¹Ñ¥½¸¡…¥¹½µµ…¹‘Ì ¸¸¹½µµ…¹‘Ì¤ì(€€€É•ÑÕÉ¸™Õ¹Ñ¥½¸¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ °Ù¥•Ü¤ì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð½µµ…¹‘Ì¹±•¹Ñ ì¤¬¬¤(€€€€€€€¥˜€¡½µµ…¹‘Ím¥t¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ °Ù¥•Ü¤¤(€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ôì(€ô(€Ù…È‰…­ÍÁ…”€ô¡…¥¹½µµ…¹‘Ì¡‘•±•Ñ•M•±•Ñ¥½¸°©½¥¹	…­Ý…É°Í•±•Ñ9½‘•	…­Ý…É¤ì(€Ù…È‘•°€ô¡…¥¹½µµ…¹‘Ì¡‘•±•Ñ•M•±•Ñ¥½¸°©½¥¹½ÉÝ…É°Í•±•Ñ9½‘•½ÉÝ…É¤ì(€Ù…ÈÁ	…Í•-•åµ…À€ôì(€€€€‰¹Ñ•Èˆè¡…¥¹½µµ…¹‘Ì¡¹•Ý±¥¹•%¹½‘”°É•…Ñ•A…É…É…Á¡9•…È°±¥™ÑµÁÑå	±½¬°ÍÁ±¥Ñ	±½¬¤°(€€€€‰5½µ¹Ñ•Èˆè•á¥Ñ½‘”°(€€€€‰	…­ÍÁ…”ˆè‰…­ÍÁ…”°(€€€€‰5½µ	…­ÍÁ…”ˆè‰…­ÍÁ…”°(€€€€‰M¡¥™Ðµ	…­ÍÁ…”ˆè‰…­ÍÁ…”°(€€€€‰•±•Ñ”ˆè‘•°°(€€€€‰5½µ•±•Ñ”ˆè‘•°°(€€€€‰5½µ„ˆèÍ•±•Ñ±°(€ôì(€Ù…Èµ…	…Í•-•åµ…À€ôì(€€€€‰ÑÉ°µ ˆèÁ	…Í•-•åµ…Ál‰	…­ÍÁ…”‰t°(€€€€‰±Ðµ	…­ÍÁ…”ˆèÁ	…Í•-•åµ…Ál‰5½µ	…­ÍÁ…”‰t°(€€€€‰ÑÉ°µˆèÁ	…Í•-•åµ…Ál‰•±•Ñ”‰t°(€€€€‰ÑÉ°µ±Ðµ	…­ÍÁ…”ˆèÁ	…Í•-•åµ…Ál‰5½µ•±•Ñ”‰t°(€€€€‰±Ðµ•±•Ñ”ˆèÁ	…Í•-•åµ…Ál‰5½µ•±•Ñ”‰t°(€€€€‰±ÐµˆèÁ	…Í•-•åµ…Ál‰5½µ•±•Ñ”‰t°(€€€€‰ÑÉ°µ„ˆèÍ•±•ÑQ•áÑ‰±½­MÑ…ÉÐ°(€€€€‰ÑÉ°µ”ˆèÍ•±•ÑQ•áÑ‰±½­¹(€ôì(€™½È€¡±•Ð­•ä¥¸Á	…Í•-•åµ…À¤(€€€µ…	…Í•-•åµ…Ám­•åt€ôÁ	…Í•-•åµ…Ám­•åtì(€Ù…Èµ…ŒÈ€ôÑåÁ•½˜¹…Ù¥…Ñ½È€„ô€‰Õ¹‘•™¥¹•ˆ€ü€½5…ñ¥@¡¡½¹•ñm½…u¤¼¹Ñ•ÍÐ¡¹…Ù¥…Ñ½È¹Á±…Ñ™½É´¤€èÑåÁ•½˜½Ì€„ô€‰Õ¹‘•™¥¹•ˆ€˜˜½Ì¹Á±…Ñ™½É´€ü½Ì¹Á±…Ñ™½É´ ¤€ôô€‰‘…ÉÝ¥¸ˆ€è™…±Í”ì(€Ù…È‰…Í•-•åµ…À€ôµ…ŒÈ€üµ…	…Í•-•åµ…À€èÁ	…Í•-•åµ…Àì((€€¼¼¹½‘•}µ½‘Õ±•Ì½ÁÉ½Í•µ¥ÉÉ½ÈµÍ¡•µ„µ±¥ÍÐ½‘¥ÍÐ½¥¹‘•à¹©Ì(€™Õ¹Ñ¥½¸ÝÉ…Á%¹1¥ÍÐ¡±¥ÍÑQåÁ”°…ÑÑÉÌ€ô¹Õ±°¤ì(€€€É•ÑÕÉ¸™Õ¹Ñ¥½¸¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤ì(€€€€€±•Ðì€‘™É½´°€‘Ñ¼ô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€€€±•ÐÉ…¹”€ô€‘™É½´¹‰±½­I…¹” ‘Ñ¼¤ì(€€€€€¥˜€ …É…¹”¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€±•ÐÑÈ€ô‘¥ÍÁ…Ñ €üÍÑ…Ñ”¹ÑÈ€è¹Õ±°ì(€€€€€¥˜€ …ÝÉ…ÁI…¹•%¹1¥ÍÐ¡ÑÈ°É…¹”°±¥ÍÑQåÁ”°…ÑÑÉÌ¤¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ôì(€ô(€™Õ¹Ñ¥½¸ÝÉ…ÁI…¹•%¹1¥ÍÐ¡ÑÈ°É…¹”°±¥ÍÑQåÁ”°…ÑÑÉÌ€ô¹Õ±°¤ì(€€€±•Ð‘½)½¥¸€ô™…±Í”°½ÕÑ•ÉI…¹”€ôÉ…¹”°‘½ŒÔ€ôÉ…¹”¸‘™É½´¹‘½Œì(€€€¥˜€¡É…¹”¹‘•ÁÑ €øô€È€˜˜É…¹”¸‘™É½´¹¹½‘”¡É…¹”¹‘•ÁÑ €´€Ä¤¹ÑåÁ”¹½µÁ…Ñ¥‰±•½¹Ñ•¹Ð¡±¥ÍÑQåÁ”¤€˜˜É…¹”¹ÍÑ…ÉÑ%¹‘•à€ôô€À¤ì(€€€€€¥˜€¡É…¹”¸‘™É½´¹¥¹‘•à¡É…¹”¹‘•ÁÑ €´€Ä¤€ôô€À¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€±•Ð€‘¥¹Í•ÉÐ€ô‘½ŒÔ¹É•Í½±Ù”¡É…¹”¹ÍÑ…ÉÐ€´€È¤ì(€€€€€½ÕÑ•ÉI…¹”€ô¹•Ü9½‘•I…¹” ‘¥¹Í•ÉÐ°€‘¥¹Í•ÉÐ°É…¹”¹‘•ÁÑ ¤ì(€€€€€¥˜€¡É…¹”¹•¹‘%¹‘•à€ðÉ…¹”¹Á…É•¹Ð¹¡¥±‘½Õ¹Ð¤(€€€€€€€É…¹”€ô¹•Ü9½‘•I…¹”¡É…¹”¸‘™É½´°‘½ŒÔ¹É•Í½±Ù”¡É…¹”¸‘Ñ¼¹•¹¡É…¹”¹‘•ÁÑ ¤¤°É…¹”¹‘•ÁÑ ¤ì(€€€€€‘½)½¥¸€ôÑÉÕ”ì(€€€ô(€€€±•ÐÝÉ…ÀÈ€ô™¥¹‘]É…ÁÁ¥¹œ¡½ÕÑ•ÉI…¹”°±¥ÍÑQåÁ”°…ÑÑÉÌ°É…¹”¤ì(€€€¥˜€ …ÝÉ…ÀÈ¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€¥˜€¡ÑÈ¤(€€€€€‘½]É…Á%¹1¥ÍÐ¡ÑÈ°É…¹”°ÝÉ…ÀÈ°‘½)½¥¸°±¥ÍÑQåÁ”¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ô(€™Õ¹Ñ¥½¸‘½]É…Á%¹1¥ÍÐ¡ÑÈ°É…¹”°ÝÉ…ÁÁ•ÉÌ°©½¥¹	•™½É”°±¥ÍÑQåÁ”¤ì(€€€±•Ð½¹Ñ•¹Ð€ôÉ…µ•¹Ð¹•µÁÑäì(€€€™½È€¡±•Ð¤€ôÝÉ…ÁÁ•ÉÌ¹±•¹Ñ €´€Äì¤€øô€Àì¤´´¤(€€€€€½¹Ñ•¹Ð€ôÉ…µ•¹Ð¹™É½´¡ÝÉ…ÁÁ•ÉÍm¥t¹ÑåÁ”¹É•…Ñ”¡ÝÉ…ÁÁ•ÉÍm¥t¹…ÑÑÉÌ°½¹Ñ•¹Ð¤¤ì(€€€ÑÈ¹ÍÑ•À¡¹•ÜI•Á±…•É½Õ¹‘MÑ•À¡É…¹”¹ÍÑ…ÉÐ€´€¡©½¥¹	•™½É”€ü€È€è€À¤°É…¹”¹•¹°É…¹”¹ÍÑ…ÉÐ°É…¹”¹•¹°¹•ÜM±¥”¡½¹Ñ•¹Ð°€À°€À¤°ÝÉ…ÁÁ•ÉÌ¹±•¹Ñ °ÑÉÕ”¤¤ì(€€€±•Ð™½Õ¹Ì€ô€Àì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðÝÉ…ÁÁ•ÉÌ¹±•¹Ñ ì¤¬¬¤(€€€€€¥˜€¡ÝÉ…ÁÁ•ÉÍm¥t¹ÑåÁ”€ôô±¥ÍÑQåÁ”¤(€€€€€€€™½Õ¹Ì€ô¤€¬€Äì(€€€±•ÐÍÁ±¥Ñ•ÁÑ €ôÝÉ…ÁÁ•ÉÌ¹±•¹Ñ €´™½Õ¹Ìì(€€€±•ÐÍÁ±¥ÑA½Ì€ôÉ…¹”¹ÍÑ…ÉÐ€¬ÝÉ…ÁÁ•ÉÌ¹±•¹Ñ €´€¡©½¥¹	•™½É”€ü€È€è€À¤°Á…É•¹Ð€ôÉ…¹”¹Á…É•¹Ðì(€€€™½È€¡±•Ð¤€ôÉ…¹”¹ÍÑ…ÉÑ%¹‘•à°”€ôÉ…¹”¹•¹‘%¹‘•à°™¥ÉÍÐ€ôÑÉÕ”ì¤€ð”ì¤¬¬°™¥ÉÍÐ€ô™…±Í”¤ì(€€€€€¥˜€ …™¥ÉÍÐ€˜˜…¹MÁ±¥Ð¡ÑÈ¹‘½Œ°ÍÁ±¥ÑA½Ì°ÍÁ±¥Ñ•ÁÑ ¤¤ì(€€€€€€€ÑÈ¹ÍÁ±¥Ð¡ÍÁ±¥ÑA½Ì°ÍÁ±¥Ñ•ÁÑ ¤ì(€€€€€€€ÍÁ±¥ÑA½Ì€¬ô€È€¨ÍÁ±¥Ñ•ÁÑ ì(€€€€€ô(€€€€€ÍÁ±¥ÑA½Ì€¬ôÁ…É•¹Ð¹¡¥±¡¤¤¹¹½‘•M¥é”ì(€€€ô(€€€É•ÑÕÉ¸ÑÈì(€ô(€™Õ¹Ñ¥½¸ÍÁ±¥Ñ1¥ÍÑ%Ñ•´¡¥Ñ•µQåÁ”°¥Ñ•µÑÑÉÌ¤ì(€€€É•ÑÕÉ¸™Õ¹Ñ¥½¸¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤ì(€€€€€±•Ðì€‘™É½´°€‘Ñ¼°¹½‘”ô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€€€¥˜€¡¹½‘”€˜˜¹½‘”¹¥Í	±½¬ñð€‘™É½´¹‘•ÁÑ €ð€Èñð€„‘™É½´¹Í…µ•A…É•¹Ð ‘Ñ¼¤¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€±•ÐÉ…¹‘A…É•¹Ð€ô€‘™É½´¹¹½‘” ´Ä¤ì(€€€€€¥˜€¡É…¹‘A…É•¹Ð¹ÑåÁ”€„ô¥Ñ•µQåÁ”¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€¥˜€ ‘™É½´¹Á…É•¹Ð¹½¹Ñ•¹Ð¹Í¥é”€ôô€À€˜˜€‘™É½´¹¹½‘” ´Ä¤¹¡¥±‘½Õ¹Ð€ôô€‘™É½´¹¥¹‘•á™Ñ•È ´Ä¤¤ì(€€€€€€€¥˜€ ‘™É½´¹‘•ÁÑ €ôô€Ìñð€‘™É½´¹¹½‘” ´Ì¤¹ÑåÁ”€„ô¥Ñ•µQåÁ”ñð€‘™É½´¹¥¹‘•à ´È¤€„ô€‘™É½´¹¹½‘” ´È¤¹¡¥±‘½Õ¹Ð€´€Ä¤(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤ì(€€€€€€€€€±•ÐÝÉ…ÀÈ€ôÉ…µ•¹Ð¹•µÁÑäì(€€€€€€€€€±•Ð‘•ÁÑ¡	•™½É”€ô€‘™É½´¹¥¹‘•à ´Ä¤€ü€Ä€è€‘™É½´¹¥¹‘•à ´È¤€ü€È€è€Ìì(€€€€€€€€€™½È€¡±•Ð€ô€‘™É½´¹‘•ÁÑ €´‘•ÁÑ¡	•™½É”ì€øô€‘™É½´¹‘•ÁÑ €´€Ìì´´¤(€€€€€€€€€€€ÝÉ…ÀÈ€ôÉ…µ•¹Ð¹™É½´ ‘™É½´¹¹½‘”¡¤¹½Áä¡ÝÉ…ÀÈ¤¤ì(€€€€€€€€€±•Ð‘•ÁÑ¡™Ñ•È€ô€‘™É½´¹¥¹‘•á™Ñ•È ´Ä¤€ð€‘™É½´¹¹½‘” ´È¤¹¡¥±‘½Õ¹Ð€ü€Ä€è€‘™É½´¹¥¹‘•á™Ñ•È ´È¤€ð€‘™É½´¹¹½‘” ´Ì¤¹¡¥±‘½Õ¹Ð€ü€È€è€Ìì(€€€€€€€€€ÝÉ…ÀÈ€ôÝÉ…ÀÈ¹…ÁÁ•¹¡É…µ•¹Ð¹™É½´¡¥Ñ•µQåÁ”¹É•…Ñ•¹‘¥±° ¤¤¤ì(€€€€€€€€€±•ÐÍÑ…ÉÐ€ô€‘™É½´¹‰•™½É” ‘™É½´¹‘•ÁÑ €´€¡‘•ÁÑ¡	•™½É”€´€Ä¤¤ì(€€€€€€€€€±•ÐÑÈÈ€ôÍÑ…Ñ”¹ÑÈ¹É•Á±…”¡ÍÑ…ÉÐ°€‘™É½´¹…™Ñ•È µ‘•ÁÑ¡™Ñ•È¤°¹•ÜM±¥”¡ÝÉ…ÀÈ°€Ð€´‘•ÁÑ¡	•™½É”°€À¤¤ì(€€€€€€€€€±•ÐÍ•°€ô€´Äì(€€€€€€€€€ÑÈÈ¹‘½Œ¹¹½‘•Í	•ÑÝ••¸¡ÍÑ…ÉÐ°ÑÈÈ¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”°€¡¹½‘”È°Á½Ì¤€ôøì(€€€€€€€€€€€¥˜€¡Í•°€ø€´Ä¤(€€€€€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€€€€€¥˜€¡¹½‘”È¹¥ÍQ•áÑ‰±½¬€˜˜¹½‘”È¹½¹Ñ•¹Ð¹Í¥é”€ôô€À¤(€€€€€€€€€€€€€Í•°€ôÁ½Ì€¬€Äì(€€€€€€€€€ô¤ì(€€€€€€€€€¥˜€¡Í•°€ø€´Ä¤(€€€€€€€€€€€ÑÈÈ¹Í•ÑM•±•Ñ¥½¸¡M•±•Ñ¥½¸¹¹•…È¡ÑÈÈ¹‘½Œ¹É•Í½±Ù”¡Í•°¤¤¤ì(€€€€€€€€€‘¥ÍÁ…Ñ ¡ÑÈÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô(€€€€€±•Ð¹•áÑQåÁ”€ô€‘Ñ¼¹Á½Ì€ôô€‘™É½´¹•¹ ¤€üÉ…¹‘A…É•¹Ð¹½¹Ñ•¹Ñ5…Ñ¡Ð À¤¹‘•™…Õ±ÑQåÁ”€è¹Õ±°ì(€€€€€±•ÐÑÈ€ôÍÑ…Ñ”¹ÑÈ¹‘•±•Ñ” ‘™É½´¹Á½Ì°€‘Ñ¼¹Á½Ì¤ì(€€€€€±•ÐÑåÁ•Ì€ô¹•áÑQåÁ”€üm¥Ñ•µÑÑÉÌ€üìÑåÁ”è¥Ñ•µQåÁ”°…ÑÑÉÌè¥Ñ•µÑÑÉÌô€è¹Õ±°°ìÑåÁ”è¹•áÑQåÁ”õt€èÙ½¥€Àì(€€€€€¥˜€ ……¹MÁ±¥Ð¡ÑÈ¹‘½Œ°€‘™É½´¹Á½Ì°€È°ÑåÁ•Ì¤¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€¥˜€¡‘¥ÍÁ…Ñ ¤(€€€€€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÁ±¥Ð ‘™É½´¹Á½Ì°€È°ÑåÁ•Ì¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ôì(€ô(€™Õ¹Ñ¥½¸±¥™Ñ1¥ÍÑ%Ñ•´¡¥Ñ•µQåÁ”¤ì(€€€É•ÑÕÉ¸™Õ¹Ñ¥½¸¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤ì(€€€€€±•Ðì€‘™É½´°€‘Ñ¼ô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€€€±•ÐÉ…¹”€ô€‘™É½´¹‰±½­I…¹” ‘Ñ¼°€¡¹½‘”¤€ôø¹½‘”¹¡¥±‘½Õ¹Ð€ø€À€˜˜¹½‘”¹™¥ÉÍÑ¡¥±¹ÑåÁ”€ôô¥Ñ•µQåÁ”¤ì(€€€€€¥˜€ …É…¹”¤(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€¥˜€ …‘¥ÍÁ…Ñ ¤(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€¥˜€ ‘™É½´¹¹½‘”¡É…¹”¹‘•ÁÑ €´€Ä¤¹ÑåÁ”€ôô¥Ñ•µQåÁ”¤(€€€€€€€É•ÑÕÉ¸±¥™ÑQ½=ÕÑ•É1¥ÍÐ¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ °¥Ñ•µQåÁ”°É…¹”¤ì(€€€€€•±Í”(€€€€€€€É•ÑÕÉ¸±¥™Ñ=ÕÑ=™1¥ÍÐ¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ °É…¹”¤ì(€€€ôì(€ô(€™Õ¹Ñ¥½¸±¥™ÑQ½=ÕÑ•É1¥ÍÐ¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ °¥Ñ•µQåÁ”°É…¹”¤ì(€€€±•ÐÑÈ€ôÍÑ…Ñ”¹ÑÈ°•¹€ôÉ…¹”¹•¹°•¹‘=™1¥ÍÐ€ôÉ…¹”¸‘Ñ¼¹•¹¡É…¹”¹‘•ÁÑ ¤ì(€€€¥˜€¡•¹€ð•¹‘=™1¥ÍÐ¤ì(€€€€€ÑÈ¹ÍÑ•À¡¹•ÜI•Á±…•É½Õ¹‘MÑ•À¡•¹€´€Ä°•¹‘=™1¥ÍÐ°•¹°•¹‘=™1¥ÍÐ°¹•ÜM±¥”¡É…µ•¹Ð¹™É½´¡¥Ñ•µQåÁ”¹É•…Ñ”¡¹Õ±°°É…¹”¹Á…É•¹Ð¹½Áä ¤¤¤°€Ä°€À¤°€Ä°ÑÉÕ”¤¤ì(€€€€€É…¹”€ô¹•Ü9½‘•I…¹”¡ÑÈ¹‘½Œ¹É•Í½±Ù”¡É…¹”¸‘™É½´¹Á½Ì¤°ÑÈ¹‘½Œ¹É•Í½±Ù”¡•¹‘=™1¥ÍÐ¤°É…¹”¹‘•ÁÑ ¤ì(€€€ô(€€€½¹ÍÐÑ…É•Ð€ô±¥™ÑQ…É•Ð¡É…¹”¤ì(€€€¥˜€¡Ñ…É•Ð€ôô¹Õ±°¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ÑÈ¹±¥™Ð¡É…¹”°Ñ…É•Ð¤ì(€€€±•Ð€‘…™Ñ•È€ôÑÈ¹‘½Œ¹É•Í½±Ù”¡ÑÈ¹µ…ÁÁ¥¹œ¹µ…À¡•¹°€´Ä¤€´€Ä¤ì(€€€¥˜€¡…¹)½¥¸¡ÑÈ¹‘½Œ°€‘…™Ñ•È¹Á½Ì¤€˜˜€‘…™Ñ•È¹¹½‘•	•™½É”¹ÑåÁ”€ôô€‘…™Ñ•È¹¹½‘•™Ñ•È¹ÑåÁ”¤(€€€€€ÑÈ¹©½¥¸ ‘…™Ñ•È¹Á½Ì¤ì(€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ô(€™Õ¹Ñ¥½¸±¥™Ñ=ÕÑ=™1¥ÍÐ¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ °É…¹”¤ì(€€€±•ÐÑÈ€ôÍÑ…Ñ”¹ÑÈ°±¥ÍÐ€ôÉ…¹”¹Á…É•¹Ðì(€€€™½È€¡±•ÐÁ½Ì€ôÉ…¹”¹•¹°¤€ôÉ…¹”¹•¹‘%¹‘•à€´€Ä°”€ôÉ…¹”¹ÍÑ…ÉÑ%¹‘•àì¤€ø”ì¤´´¤ì(€€€€€Á½Ì€´ô±¥ÍÐ¹¡¥±¡¤¤¹¹½‘•M¥é”ì(€€€€€ÑÈ¹‘•±•Ñ”¡Á½Ì€´€Ä°Á½Ì€¬€Ä¤ì(€€€ô(€€€±•Ð€‘ÍÑ…ÉÐ€ôÑÈ¹‘½Œ¹É•Í½±Ù”¡É…¹”¹ÍÑ…ÉÐ¤°¥Ñ•´€ô€‘ÍÑ…ÉÐ¹¹½‘•™Ñ•Èì(€€€¥˜€¡ÑÈ¹µ…ÁÁ¥¹œ¹µ…À¡É…¹”¹•¹¤€„ôÉ…¹”¹ÍÑ…ÉÐ€¬€‘ÍÑ…ÉÐ¹¹½‘•™Ñ•È¹¹½‘•M¥é”¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•Ð…ÑMÑ…ÉÐ€ôÉ…¹”¹ÍÑ…ÉÑ%¹‘•à€ôô€À°…Ñ¹€ôÉ…¹”¹•¹‘%¹‘•à€ôô±¥ÍÐ¹¡¥±‘½Õ¹Ðì(€€€±•ÐÁ…É•¹Ð€ô€‘ÍÑ…ÉÐ¹¹½‘” ´Ä¤°¥¹‘•á	•™½É”€ô€‘ÍÑ…ÉÐ¹¥¹‘•à ´Ä¤ì(€€€¥˜€ …Á…É•¹Ð¹…¹I•Á±…”¡¥¹‘•á	•™½É”€¬€¡…ÑMÑ…ÉÐ€ü€À€è€Ä¤°¥¹‘•á	•™½É”€¬€Ä°¥Ñ•´¹½¹Ñ•¹Ð¹…ÁÁ•¹¡…Ñ¹€üÉ…µ•¹Ð¹•µÁÑä€èÉ…µ•¹Ð¹™É½´¡±¥ÍÐ¤¤¤¤(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€±•ÐÍÑ…ÉÐ€ô€‘ÍÑ…ÉÐ¹Á½Ì°•¹€ôÍÑ…ÉÐ€¬¥Ñ•´¹¹½‘•M¥é”ì(€€€ÑÈ¹ÍÑ•À¡¹•ÜI•Á±…•É½Õ¹‘MÑ•À¡ÍÑ…ÉÐ€´€¡…ÑMÑ…ÉÐ€ü€Ä€è€À¤°•¹€¬€¡…Ñ¹€ü€Ä€è€À¤°ÍÑ…ÉÐ€¬€Ä°•¹€´€Ä°¹•ÜM±¥” ¡…ÑMÑ…ÉÐ€üÉ…µ•¹Ð¹•µÁÑä€èÉ…µ•¹Ð¹™É½´¡±¥ÍÐ¹½Áä¡É…µ•¹Ð¹•µÁÑä¤¤¤¹…ÁÁ•¹¡…Ñ¹€üÉ…µ•¹Ð¹•µÁÑä€èÉ…µ•¹Ð¹™É½´¡±¥ÍÐ¹½Áä¡É…µ•¹Ð¹•µÁÑä¤¤¤°…ÑMÑ…ÉÐ€ü€À€è€Ä°…Ñ¹€ü€À€è€Ä¤°…ÑMÑ…ÉÐ€ü€À€è€Ä¤¤ì(€€€‘¥ÍÁ…Ñ ¡ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€É•ÑÕÉ¸ÑÉÕ”ì(€ô((€€¼¼¹½‘•}µ½‘Õ±•Ì½ÜÍŒµ­•å¹…µ”½¥¹‘•à¹©Ì(€Ù…È‰…Í”€ôì(€€€€àè€‰	…­ÍÁ…”ˆ°(€€€€äè€‰Q…ˆˆ°(€€€€ÄÀè€‰¹Ñ•Èˆ°(€€€€ÄÈè€‰9Õµ1½¬ˆ°(€€€€ÄÌè€‰¹Ñ•Èˆ°(€€€€ÄØè€‰M¡¥™Ðˆ°(€€€€ÄÜè€‰½¹ÑÉ½°ˆ°(€€€€Äàè€‰±Ðˆ°(€€€€ÈÀè€‰…ÁÍ1½¬ˆ°(€€€€ÈÜè€‰Í…Á”ˆ°(€€€€ÌÈè€ˆ€ˆ°(€€€€ÌÌè€‰A…•UÀˆ°(€€€€ÌÐè€‰A…•½Ý¸ˆ°(€€€€ÌÔè€‰¹ˆ°(€€€€ÌØè€‰!½µ”ˆ°(€€€€ÌÜè€‰ÉÉ½Ý1•™Ðˆ°(€€€€Ìàè€‰ÉÉ½ÝUÀˆ°(€€€€Ìäè€‰ÉÉ½ÝI¥¡Ðˆ°(€€€€ÐÀè€‰ÉÉ½Ý½Ý¸ˆ°(€€€€ÐÐè€‰AÉ¥¹ÑMÉ••¸ˆ°(€€€€ÐÔè€‰%¹Í•ÉÐˆ°(€€€€ÐØè€‰•±•Ñ”ˆ°(€€€€Ôäè€ˆìˆ°(€€€€ØÄè€ˆôˆ°(€€€€äÄè€‰5•Ñ„ˆ°(€€€€äÈè€‰5•Ñ„ˆ°(€€€€ÄÀØè€ˆ¨ˆ°(€€€€ÄÀÜè€ˆ¬ˆ°(€€€€ÄÀàè€ˆ°ˆ°(€€€€ÄÀäè€ˆ´ˆ°(€€€€ÄÄÀè€ˆ¸ˆ°(€€€€ÄÄÄè€ˆ¼ˆ°(€€€€ÄÐÐè€‰9Õµ1½¬ˆ°(€€€€ÄÐÔè€‰MÉ½±±1½¬ˆ°(€€€€ÄØÀè€‰M¡¥™Ðˆ°(€€€€ÄØÄè€‰M¡¥™Ðˆ°(€€€€ÄØÈè€‰½¹ÑÉ½°ˆ°(€€€€ÄØÌè€‰½¹ÑÉ½°ˆ°(€€€€ÄØÐè€‰±Ðˆ°(€€€€ÄØÔè€‰±Ðˆ°(€€€€ÄÜÌè€ˆ´ˆ°(€€€€ÄàØè€ˆìˆ°(€€€€ÄàÜè€ˆôˆ°(€€€€Äààè€ˆ°ˆ°(€€€€Äàäè€ˆ´ˆ°(€€€€ÄäÀè€ˆ¸ˆ°(€€€€ÄäÄè€ˆ¼ˆ°(€€€€ÄäÈè€‰€ˆ°(€€€€ÈÄäè€‰lˆ°(€€€€ÈÈÀè€‰qpˆ°(€€€€ÈÈÄè€‰tˆ°(€€€€ÈÈÈè€ˆœˆ(€ôì(€Ù…ÈÍ¡¥™Ð€ôì(€€€€Ðàè€ˆ¤ˆ°(€€€€Ðäè€ˆ„ˆ°(€€€€ÔÀè€‰ ˆ°(€€€€ÔÄè€ˆŒˆ°(€€€€ÔÈè€ˆˆ°(€€€€ÔÌè€ˆ”ˆ°(€€€€ÔÐè€‰xˆ°(€€€€ÔÔè€ˆ˜ˆ°(€€€€ÔØè€ˆ¨ˆ°(€€€€ÔÜè€ˆ ˆ°(€€€€Ôäè€ˆèˆ°(€€€€ØÄè€ˆ¬ˆ°(€€€€ÄÜÌè€‰|ˆ°(€€€€ÄàØè€ˆèˆ°(€€€€ÄàÜè€ˆ¬ˆ°(€€€€Äààè€ˆðˆ°(€€€€Äàäè€‰|ˆ°(€€€€ÄäÀè€ˆøˆ°(€€€€ÄäÄè€ˆüˆ°(€€€€ÄäÈè€‰øˆ°(€€€€ÈÄäè€‰ìˆ°(€€€€ÈÈÀè€‰ðˆ°(€€€€ÈÈÄè€‰ôˆ°(€€€€ÈÈÈè€œˆœ(€ôì(€Ù…Èµ…ŒÌ€ôÑåÁ•½˜¹…Ù¥…Ñ½È€„ô€‰Õ¹‘•™¥¹•ˆ€˜˜€½5…Œ¼¹Ñ•ÍÐ¡¹…Ù¥…Ñ½È¹Á±…Ñ™½É´¤ì(€Ù…È¥”È€ôÑåÁ•½˜¹…Ù¥…Ñ½È€„ô€‰Õ¹‘•™¥¹•ˆ€˜˜€½5M%q‘ñQÉ¥‘•¹Ñp¼ üélÜ´åuñq‘ìÈ±ô¥p¸¸©ÉØè¡q¬¤¼¹•á•Œ¡¹…Ù¥…Ñ½È¹ÕÍ•É•¹Ð¤ì(€™½È€¡¤€ô€Àì¤€ð€ÄÀì¤¬¬¤‰…Í•lÐà€¬¥t€ô‰…Í•läØ€¬¥t€ôMÑÉ¥¹œ¡¤¤ì(€Ù…È¤ì(€™½È€¡¤€ô€Äì¤€ðô€ÈÐì¤¬¬¤‰…Í•m¤€¬€ÄÄÅt€ô€‰ˆ€¬¤ì(€Ù…È¤ì(€™½È€¡¤€ô€ØÔì¤€ðô€äÀì¤¬¬¤ì(€€€‰…Í•m¥t€ôMÑÉ¥¹œ¹™É½µ¡…É½‘”¡¤€¬€ÌÈ¤ì(€€€Í¡¥™Ñm¥t€ôMÑÉ¥¹œ¹™É½µ¡…É½‘”¡¤¤ì(€ô(€Ù…È¤ì(€™½È€¡½‘”¥¸‰…Í”¤¥˜€ …Í¡¥™Ð¹¡…Í=Ý¹AÉ½Á•ÉÑä¡½‘”¤¤Í¡¥™Ñm½‘•t€ô‰…Í•m½‘•tì(€Ù…È½‘”ì(€™Õ¹Ñ¥½¸­•å9…µ”¡•Ù•¹Ð¤ì(€€€Ù…È¥¹½É•-•ä€ôµ…ŒÌ€˜˜•Ù•¹Ð¹µ•Ñ…-•ä€˜˜•Ù•¹Ð¹Í¡¥™Ñ-•ä€˜˜€…•Ù•¹Ð¹ÑÉ±-•ä€˜˜€…•Ù•¹Ð¹…±Ñ-•äñð¥”È€˜˜•Ù•¹Ð¹Í¡¥™Ñ-•ä€˜˜•Ù•¹Ð¹­•ä€˜˜•Ù•¹Ð¹­•ä¹±•¹Ñ €ôô€Äñð•Ù•¹Ð¹­•ä€ôô€‰U¹¥‘•¹Ñ¥™¥•ˆì(€€€Ù…È¹…µ”€ô€…¥¹½É•-•ä€˜˜•Ù•¹Ð¹­•äñð€¡•Ù•¹Ð¹Í¡¥™Ñ-•ä€üÍ¡¥™Ð€è‰…Í”¥m•Ù•¹Ð¹­•å½‘•tñð•Ù•¹Ð¹­•äñð€‰U¹¥‘•¹Ñ¥™¥•ˆì(€€€¥˜€¡¹…µ”€ôô€‰ÍŒˆ¤¹…µ”€ô€‰Í…Á”ˆì(€€€¥˜€¡¹…µ”€ôô€‰•°ˆ¤¹…µ”€ô€‰•±•Ñ”ˆì(€€€¥˜€¡¹…µ”€ôô€‰1•™Ðˆ¤¹…µ”€ô€‰ÉÉ½Ý1•™Ðˆì(€€€¥˜€¡¹…µ”€ôô€‰UÀˆ¤¹…µ”€ô€‰ÉÉ½ÝUÀˆì(€€€¥˜€¡¹…µ”€ôô€‰I¥¡Ðˆ¤¹…µ”€ô€‰ÉÉ½ÝI¥¡Ðˆì(€€€¥˜€¡¹…µ”€ôô€‰½Ý¸ˆ¤¹…µ”€ô€‰ÉÉ½Ý½Ý¸ˆì(€€€É•ÑÕÉ¸¹…µ”ì(€ô((€€¼¼¹½‘•}µ½‘Õ±•Ì½ÁÉ½Í•µ¥ÉÉ½Èµ­•åµ…À½‘¥ÍÐ½¥¹‘•à¹©Ì(€Ù…Èµ…ŒÐ€ôÑåÁ•½˜¹…Ù¥…Ñ½È€„ô€‰Õ¹‘•™¥¹•ˆ€˜˜€½5…ñ¥@¡¡½¹•ñm½…u¤¼¹Ñ•ÍÐ¡¹…Ù¥…Ñ½È¹Á±…Ñ™½É´¤ì(€Ù…ÈÝ¥¹‘½ÝÌÈ€ôÑåÁ•½˜¹…Ù¥…Ñ½È€„ô€‰Õ¹‘•™¥¹•ˆ€˜˜€½]¥¸¼¹Ñ•ÍÐ¡¹…Ù¥…Ñ½È¹Á±…Ñ™½É´¤ì(€™Õ¹Ñ¥½¸¹½Éµ…±¥é•-•å9…µ”¡¹…µ”¤ì(€€€±•ÐÁ…ÉÑÌ€ô¹…µ”¹ÍÁ±¥Ð ¼´ ü„¤¼¤°É•ÍÕ±Ð€ôÁ…ÉÑÍmÁ…ÉÑÌ¹±•¹Ñ €´€Åtì(€€€¥˜€¡É•ÍÕ±Ð€ôô€‰MÁ…”ˆ¤(€€€€€É•ÍÕ±Ð€ô€ˆ€ˆì(€€€±•Ð…±Ð°ÑÉ°°Í¡¥™ÐÈ°µ•Ñ„ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðÁ…ÉÑÌ¹±•¹Ñ €´€Äì¤¬¬¤ì(€€€€€±•Ðµ½€ôÁ…ÉÑÍm¥tì(€€€€€¥˜€ ½x¡µ‘ñµ•Ñ…ñ´¤½¤¹Ñ•ÍÐ¡µ½¤¤(€€€€€€€µ•Ñ„€ôÑÉÕ”ì(€€€€€•±Í”¥˜€ ½y„¡±Ð¤ü½¤¹Ñ•ÍÐ¡µ½¤¤(€€€€€€€…±Ð€ôÑÉÕ”ì(€€€€€•±Í”¥˜€ ½x¡ñÑÉ±ñ½¹ÑÉ½°¤½¤¹Ñ•ÍÐ¡µ½¤¤(€€€€€€€ÑÉ°€ôÑÉÕ”ì(€€€€€•±Í”¥˜€ ½yÌ¡¡¥™Ð¤ü½¤¹Ñ•ÍÐ¡µ½¤¤(€€€€€€€Í¡¥™ÐÈ€ôÑÉÕ”ì(€€€€€•±Í”¥˜€ ½yµ½½¤¹Ñ•ÍÐ¡µ½¤¤ì(€€€€€€€¥˜€¡µ…ŒÐ¤(€€€€€€€€€µ•Ñ„€ôÑÉÕ”ì(€€€€€€€•±Í”(€€€€€€€€€ÑÉ°€ôÑÉÕ”ì(€€€€€ô•±Í”(€€€€€€€Ñ¡É½Ü¹•ÜÉÉ½È ‰U¹É•½¹¥é•µ½‘¥™¥•È¹…µ”è€ˆ€¬µ½¤ì(€€€ô(€€€¥˜€¡…±Ð¤(€€€€€É•ÍÕ±Ð€ô€‰±Ð´ˆ€¬É•ÍÕ±Ðì(€€€¥˜€¡ÑÉ°¤(€€€€€É•ÍÕ±Ð€ô€‰ÑÉ°´ˆ€¬É•ÍÕ±Ðì(€€€¥˜€¡µ•Ñ„¤(€€€€€É•ÍÕ±Ð€ô€‰5•Ñ„´ˆ€¬É•ÍÕ±Ðì(€€€¥˜€¡Í¡¥™ÐÈ¤(€€€€€É•ÍÕ±Ð€ô€‰M¡¥™Ð´ˆ€¬É•ÍÕ±Ðì(€€€É•ÑÕÉ¸É•ÍÕ±Ðì(€ô(€™Õ¹Ñ¥½¸¹½Éµ…±¥é”¡µ…ÀÈ¤ì(€€€±•Ð½ÁäÔ€ô€¼¨}}AUI}|€¨¼=‰©•Ð¹É•…Ñ”¡¹Õ±°¤ì(€€€™½È€¡±•ÐÁÉ½À¥¸µ…ÀÈ¤(€€€€€½ÁäÕm¹½Éµ…±¥é•-•å9…µ”¡ÁÉ½À¥t€ôµ…ÀÉmÁÉ½Átì(€€€É•ÑÕÉ¸½ÁäÔì(€ô(€™Õ¹Ñ¥½¸µ½‘¥™¥•ÉÌ¡¹…µ”°•Ù•¹Ð°Í¡¥™ÐÈ€ôÑÉÕ”¤ì(€€€¥˜€¡•Ù•¹Ð¹…±Ñ-•ä¤(€€€€€¹…µ”€ô€‰±Ð´ˆ€¬¹…µ”ì(€€€¥˜€¡•Ù•¹Ð¹ÑÉ±-•ä¤(€€€€€¹…µ”€ô€‰ÑÉ°´ˆ€¬¹…µ”ì(€€€¥˜€¡•Ù•¹Ð¹µ•Ñ…-•ä¤(€€€€€¹…µ”€ô€‰5•Ñ„´ˆ€¬¹…µ”ì(€€€¥˜€¡Í¡¥™ÐÈ€˜˜•Ù•¹Ð¹Í¡¥™Ñ-•ä¤(€€€€€¹…µ”€ô€‰M¡¥™Ð´ˆ€¬¹…µ”ì(€€€É•ÑÕÉ¸¹…µ”ì(€ô(€™Õ¹Ñ¥½¸­•åµ…À¡‰¥¹‘¥¹Ì¤ì(€€€É•ÑÕÉ¸¹•ÜA±Õ¥¸¡ìÁÉ½ÁÌèì¡…¹‘±•-•å½Ý¸è­•å‘½Ý¹!…¹‘±•È¡‰¥¹‘¥¹Ì¤ôô¤ì(€ô(€™Õ¹Ñ¥½¸­•å‘½Ý¹!…¹‘±•È¡‰¥¹‘¥¹Ì¤ì(€€€±•Ðµ…ÀÈ€ô¹½Éµ…±¥é”¡‰¥¹‘¥¹Ì¤ì(€€€É•ÑÕÉ¸™Õ¹Ñ¥½¸¡Ù¥•Ü°•Ù•¹Ð¤ì(€€€€€±•Ð¹…µ”€ô­•å9…µ”¡•Ù•¹Ð¤°‰…Í•9…µ”°‘¥É•Ð€ôµ…ÀÉmµ½‘¥™¥•ÉÌ¡¹…µ”°•Ù•¹Ð¥tì(€€€€€¥˜€¡‘¥É•Ð€˜˜‘¥É•Ð¡Ù¥•Ü¹ÍÑ…Ñ”°Ù¥•Ü¹‘¥ÍÁ…Ñ °Ù¥•Ü¤¤(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€¥˜€¡¹…µ”¹±•¹Ñ €ôô€Ä€˜˜¹…µ”€„ô€ˆ€ˆ¤ì(€€€€€€€¥˜€¡•Ù•¹Ð¹Í¡¥™Ñ-•ä¤ì(€€€€€€€€€±•Ð¹½M¡¥™Ð€ôµ…ÀÉmµ½‘¥™¥•ÉÌ¡¹…µ”°•Ù•¹Ð°™…±Í”¥tì(€€€€€€€€€¥˜€¡¹½M¡¥™Ð€˜˜¹½M¡¥™Ð¡Ù¥•Ü¹ÍÑ…Ñ”°Ù¥•Ü¹‘¥ÍÁ…Ñ °Ù¥•Ü¤¤(€€€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€ô(€€€€€€€¥˜€ ¡•Ù•¹Ð¹…±Ñ-•äñð•Ù•¹Ð¹µ•Ñ…-•äñð•Ù•¹Ð¹ÑÉ±-•ä¤€˜˜€¼¼ÑÉ°µ±Ðµ…ä‰”ÕÍ•™½È±ÑÈ½¸]¥¹‘½ÝÌ(€€€€€€€€„¡Ý¥¹‘½ÝÌÈ€˜˜•Ù•¹Ð¹ÑÉ±-•ä€˜˜•Ù•¹Ð¹…±Ñ-•ä¤€˜˜€¡‰…Í•9…µ”€ô‰…Í•m•Ù•¹Ð¹­•å½‘•t¤€˜˜‰…Í•9…µ”€„ô¹…µ”¤ì(€€€€€€€€€±•Ð™É½µ½‘”€ôµ…ÀÉmµ½‘¥™¥•ÉÌ¡‰…Í•9…µ”°•Ù•¹Ð¥tì(€€€€€€€€€¥˜€¡™É½µ½‘”€˜˜™É½µ½‘”¡Ù¥•Ü¹ÍÑ…Ñ”°Ù¥•Ü¹‘¥ÍÁ…Ñ °Ù¥•Ü¤¤(€€€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€ô(€€€€€ô(€€€€€É•ÑÕÉ¸™…±Í”ì(€€€ôì(€ô((€€¼¼¹½‘•}µ½‘Õ±•Ì½±¥ˆÀ½µÕÑ•à¹©Ì(€Ù…ÈÉ•…Ñ•5ÕÑ•à€ô€ ¤€ôøì(€€€±•ÐÑ½­•¸€ôÑÉÕ”ì(€€€É•ÑÕÉ¸€¡˜°œ¤€ôøì(€€€€€¥˜€¡Ñ½­•¸¤ì(€€€€€€€Ñ½­•¸€ô™…±Í”ì(€€€€€€€ÑÉäì(€€€€€€€€€˜ ¤ì(€€€€€€€ô™¥¹…±±äì(€€€€€€€€€Ñ½­•¸€ôÑÉÕ”ì(€€€€€€€ô(€€€€€ô•±Í”¥˜€¡œ€„ôôÙ½¥€À¤ì(€€€€€€€œ ¤ì(€€€€€ô(€€€ôì(€ôì((€€¼¼¹½‘•}µ½‘Õ±•Ì½±¥ˆÀ½‘¥™˜¹©Ì(€Ù…È¡¥¡MÕÉÉ½…Ñ•I••à€ô€½mqÕàÀÀµqÕ	t¼ì(€Ù…È±½ÝMÕÉÉ½…Ñ•I••à€ô€½mqÕÀÀµqÕt¼ì(€Ù…ÈÍ¥µÁ±•¥™™MÑÉ¥¹œ€ô€¡„°ˆ¤€ôøì(€€€±•Ð±•™Ð€ô€Àì(€€€±•ÐÉ¥¡Ð€ô€Àì(€€€Ý¡¥±”€¡±•™Ð€ð„¹±•¹Ñ €˜˜±•™Ð€ðˆ¹±•¹Ñ €˜˜…m±•™Ñt€ôôô‰m±•™Ñt¤ì(€€€€€±•™Ð¬¬ì(€€€ô(€€€¥˜€¡±•™Ð€ø€À€˜˜¡¥¡MÕÉÉ½…Ñ•I••à¹Ñ•ÍÐ¡…m±•™Ð€´€Åt¤¤±•™Ð´´ì(€€€Ý¡¥±”€¡É¥¡Ð€¬±•™Ð€ð„¹±•¹Ñ €˜˜É¥¡Ð€¬±•™Ð€ðˆ¹±•¹Ñ €˜˜…m„¹±•¹Ñ €´É¥¡Ð€´€Åt€ôôô‰mˆ¹±•¹Ñ €´É¥¡Ð€´€Åt¤ì(€€€€€É¥¡Ð¬¬ì(€€€ô(€€€¥˜€¡É¥¡Ð€ø€À€˜˜±½ÝMÕÉÉ½…Ñ•I••à¹Ñ•ÍÐ¡…m„¹±•¹Ñ €´É¥¡Ñt¤¤É¥¡Ð´´ì(€€€É•ÑÕÉ¸ì(€€€€€¥¹‘•àè±•™Ð°(€€€€€É•µ½Ù”è„¹±•¹Ñ €´±•™Ð€´É¥¡Ð°(€€€€€¥¹Í•ÉÐèˆ¹Í±¥”¡±•™Ð°ˆ¹±•¹Ñ €´É¥¡Ð¤(€€€ôì(€ôì(€Ù…ÈÍ¥µÁ±•¥™˜€ôÍ¥µÁ±•¥™™MÑÉ¥¹œì((€€¼¼¹½‘•}µ½‘Õ±•Ì½äµÁÉ½Í•µ¥ÉÉ½È½ÍÉŒ½Á±Õ¥¹Ì½­•åÌ¹©Ì(€Ù…ÈåMå¹A±Õ¥¹-•ä€ô¹•ÜA±Õ¥¹-•ä ‰äµÍå¹Œˆ¤ì(€Ù…ÈåU¹‘½A±Õ¥¹-•ä€ô¹•ÜA±Õ¥¹-•ä ‰äµÕ¹‘¼ˆ¤ì(€Ù…ÈåÕÉÍ½ÉA±Õ¥¹-•ä€ô¹•ÜA±Õ¥¹-•ä ‰å©ÌµÕÉÍ½Èˆ¤ì((€€¼¼¹½‘•}µ½‘Õ±•Ì½±¥ˆÀ½¡…Í ½Í¡„ÈÔØ¹©Ì(€Ù…ÈÉ½ÑÈ€ô€¡Ü°Í¡¥™ÐÈ¤€ôøÜ€øøøÍ¡¥™ÐÈðÜ€ðð€ÌÈ€´Í¡¥™ÐÈì(€Ù…ÈÍÕ´ÁÑ¼ÈÔØ€ô€¡à¤€ôøÉ½ÑÈ¡à°€È¤xÉ½ÑÈ¡à°€ÄÌ¤xÉ½ÑÈ¡à°€ÈÈ¤ì(€Ù…ÈÍÕ´ÅÑ¼ÈÔØ€ô€¡à¤€ôøÉ½ÑÈ¡à°€Ø¤xÉ½ÑÈ¡à°€ÄÄ¤xÉ½ÑÈ¡à°€ÈÔ¤ì(€Ù…ÈÍ¥µ„ÁÑ¼ÈÔØ€ô€¡à¤€ôøÉ½ÑÈ¡à°€Ü¤xÉ½ÑÈ¡à°€Äà¤xà€øøø€Ìì(€Ù…ÈÍ¥µ„ÅÑ¼ÈÔØ€ô€¡à¤€ôøÉ½ÑÈ¡à°€ÄÜ¤xÉ½ÑÈ¡à°€Ää¤xà€øøø€ÄÀì(€Ù…È,€ô¹•ÜU¥¹ÐÌÉÉÉ…ä¡l(€€€€ÄÄÄØÌÔÈÐÀà°(€€€€ÄàääÐÐÜÐÐÄ°(€€€€ÌÀÐäÌÈÌÐÜÄ°(€€€€ÌäÈÄÀÀäÔÜÌ°(€€€€äØÄäàÜÄØÌ°(€€€€ÄÔÀàäÜÀääÌ°(€€€€ÈÐÔÌØÌÔÜÐà°(€€€€ÈàÜÀÜØÌÈÈÄ°(€€€€ÌØÈÐÌàÄÀàÀ°(€€€€ÌÄÀÔäàÐÀÄ°(€€€€ØÀÜÈÈÔÈÜà°(€€€€ÄÐÈØààÄäàÜ°(€€€€ÄäÈÔÀÜàÌàà°(€€€€ÈÄØÈÀÜàÈÀØ°(€€€€ÈØÄÐàààÄÀÌ°(€€€€ÌÈÐàÈÈÈÔàÀ°(€€€€ÌàÌÔÌäÀÐÀÄ°(€€€€ÐÀÈÈÈÈÐÜÜÐ°(€€€€ÈØÐÌÐÜÀÜà°(€€€€ØÀÐàÀÜØÈà°(€€€€ÜÜÀÈÔÔäàÌ°(€€€€ÄÈÐäÄÔÀÄÈÈ°(€€€€ÄÔÔÔÀàÄØäÈ°(€€€€ÄääØÀØÐäàØ°(€€€€ÈÔÔÐÈÈÀààÈ°(€€€€ÈàÈÄàÌÐÌÐä°(€€€€ÈäÔÈääØàÀà°(€€€€ÌÈÄÀÌÄÌØÜÄ°(€€€€ÌÌÌØÔÜÄàäÄ°(€€€€ÌÔàÐÔÈàÜÄÄ°(€€€€ÄÄÌäÈØääÌ°(€€€€ÌÌàÈÐÄàäÔ°(€€€€ØØØÌÀÜÈÀÔ°(€€€€ÜÜÌÔÈääÄÈ°(€€€€ÄÈäÐÜÔÜÌÜÈ°(€€€€ÄÌäØÄàÈÈäÄ°(€€€€ÄØäÔÄàÌÜÀÀ°(€€€€ÄäàØØØÄÀÔÄ°(€€€€ÈÄÜÜÀÈØÌÔÀ°(€€€€ÈÐÔØäÔØÀÌÜ°(€€€€ÈÜÌÀÐàÔäÈÄ°(€€€€ÈàÈÀÌÀÈÐÄÄ°(€€€€ÌÈÔäÜÌÀàÀÀ°(€€€€ÌÌÐÔÜØÐÜÜÄ°(€€€€ÌÔÄØÀØÔàÄÜ°(€€€€ÌØÀÀÌÔÈàÀÐ°(€€€€ÐÀäÐÔÜÄäÀä°(€€€€ÈÜÔÐÈÌÌÐÐ°(€€€€ÐÌÀÈÈÜÜÌÐ°(€€€€ÔÀØäÐàØÄØ°(€€€€ØÔäÀØÀÔÔØ°(€€€€ààÌääÜàÜÜ°(€€€€äÔàÄÌäÔÜÄ°(€€€€ÄÌÈÈàÈÈÈÄà°(€€€€ÄÔÌÜÀÀÈÀØÌ°(€€€€ÄÜÐÜàÜÌÜÜä°(€€€€ÄäÔÔÔØÈÈÈÈ°(€€€€ÈÀÈÐÄÀÐàÄÔ°(€€€€ÈÈÈÜÜÌÀÐÔÈ°(€€€€ÈÌØÄàÔÈÐÈÐ°(€€€€ÈÐÈàÐÌØÐÜÐ°(€€€€ÈÜÔØÜÌÐÄàÜ°(€€€€ÌÈÀÐÀÌÄÐÜä°(€€€€ÌÌÈäÌÈÔÈäà(€t¤ì(€Ù…È!%9%P€ô¹•ÜU¥¹ÐÌÉÉÉ…ä¡l(€€€€ÄÜÜäÀÌÌÜÀÌ°(€€€€ÌÄÐÐÄÌÐÈÜÜ°(€€€€ÄÀÄÌäÀÐÈÐÈ°(€€€€ÈÜÜÌÐàÀÜØÈ°(€€€€ÄÌÔäàäÌÄÄä°(€€€€ÈØÀÀàÈÈäÈÐ°(€€€€ÔÈàÜÌÐØÌÔ°(€€€€ÄÔÐÄÐÔäÈÈÔ(€t¤ì(€Ù…È!…Í¡•È€ô±…ÍÌì(€€€½¹ÍÑÉÕÑ½È ¤ì(€€€€€½¹ÍÐ‰Õ˜€ô¹•ÜÉÉ…å	Õ™™•È ØÐ€¬€ØÐ€¨€Ð¤ì(€€€€€Ñ¡¥Ì¹} €ô¹•ÜU¥¹ÐÌÉÉÉ…ä¡‰Õ˜°€À°€à¤ì(€€€€€Ñ¡¥Ì¹} ¹Í•Ð¡!%9%P¤ì(€€€€€Ñ¡¥Ì¹}\€ô¹•ÜU¥¹ÐÌÉÉÉ…ä¡‰Õ˜°€ØÐ°€ØÐ¤ì(€€€ô(€€€}ÕÁ‘…Ñ•!…Í  ¤ì(€€€€€½¹ÍÐ €ôÑ¡¥Ì¹} ì(€€€€€½¹ÍÐ\€ôÑ¡¥Ì¹}\ì(€€€€€™½È€¡±•ÐÐ€ô€ÄØìÐ€ð€ØÐìÐ¬¬¤ì(€€€€€€€]mÑt€ôÍ¥µ„ÅÑ¼ÈÔØ¡]mÐ€´€Ét¤€¬]mÐ€´€Ýt€¬Í¥µ„ÁÑ¼ÈÔØ¡]mÐ€´€ÄÕt¤€¬]mÐ€´€ÄÙtì(€€€€€ô(€€€€€±•Ð„€ô!lÁtì(€€€€€±•Ðˆ€ô!lÅtì(€€€€€±•ÐŒ€ô!lÉtì(€€€€€±•Ð€ô!lÍtì(€€€€€±•Ð”€ô!lÑtì(€€€€€±•Ð˜€ô!lÕtì(€€€€€±•Ðœ€ô!lÙtì(€€€€€±•Ð €ô!lÝtì(€€€€€™½È€¡±•ÐÑÐ€ô€À°PÄ°PÈìÑÐ€ð€ØÐìÑÐ¬¬¤ì(€€€€€€€PÄ€ô €¬ÍÕ´ÅÑ¼ÈÔØ¡”¤€¬€¡”€˜˜xù”€˜œ¤€¬-mÑÑt€¬]mÑÑt€øøø€Àì(€€€€€€€PÈ€ôÍÕ´ÁÑ¼ÈÔØ¡„¤€¬€¡„€˜ˆx„€˜Œxˆ€˜Œ¤€øøø€Àì(€€€€€€€ €ôœì(€€€€€€€œ€ô˜ì(€€€€€€€˜€ô”ì(€€€€€€€”€ô€¬PÄ€øøø€Àì(€€€€€€€€ôŒì(€€€€€€€Œ€ôˆì(€€€€€€€ˆ€ô„ì(€€€€€€€„€ôPÄ€¬PÈ€øøø€Àì(€€€€€ô(€€€€€!lÁt€¬ô„ì(€€€€€!lÅt€¬ôˆì(€€€€€!lÉt€¬ôŒì(€€€€€!lÍt€¬ôì(€€€€€!lÑt€¬ô”ì(€€€€€!lÕt€¬ô˜ì(€€€€€!lÙt€¬ôœì(€€€€€!lÝt€¬ô ì(€€€ô(€€€€¼¨¨(€€€€€¨I•ÑÕÉ¹Ì„€ÌÈµ‰åÑ”¡…Í ¸(€€€€€¨(€€€€€¨Á…É…´íU¥¹ÐáÉÉ…åô‘…Ñ„(€€€€€¨¼(€€€‘¥•ÍÐ¡‘…Ñ„¤ì(€€€€€±•Ð¤€ô€Àì(€€€€€™½È€ ì¤€¬€ÔØ€ðô‘…Ñ„¹±•¹Ñ ì€¤ì(€€€€€€€±•Ð¨È€ô€Àì(€€€€€€€™½È€ ì¨È€ð€ÄØ€˜˜¤€¬€Ì€ð‘…Ñ„¹±•¹Ñ ì¨È¬¬¤ì(€€€€€€€€€Ñ¡¥Ì¹}]m¨Ét€ô‘…Ñ…m¤¬­t€ðð€ÈÐð‘…Ñ…m¤¬­t€ðð€ÄØð‘…Ñ…m¤¬­t€ðð€àð‘…Ñ…m¤¬­tì(€€€€€€€ô(€€€€€€€¥˜€¡¤€”€ØÐ€„ôô€À¤ì(€€€€€€€€€Ñ¡¥Ì¹}\¹™¥±° À°¨È°€ÄØ¤ì(€€€€€€€€€Ý¡¥±”€¡¤€ð‘…Ñ„¹±•¹Ñ ¤ì(€€€€€€€€€€€Ñ¡¥Ì¹}]m¨Étðô‘…Ñ…m¥t€ðð€ Ì€´¤€”€Ð¤€¨€àì(€€€€€€€€€€€¤¬¬ì(€€€€€€€€€ô(€€€€€€€€€Ñ¡¥Ì¹}]m¨Étðô	%Pà€ðð€ Ì€´¤€”€Ð¤€¨€àì(€€€€€€€ô(€€€€€€€Ñ¡¥Ì¹}ÕÁ‘…Ñ•!…Í  ¤ì(€€€€€ô(€€€€€½¹ÍÐ¥ÍA…‘‘•‘]¥Ñ Ä€ô¤€”€ØÐ€„ôô€Àì(€€€€€Ñ¡¥Ì¹}\¹™¥±° À°€À°€ÄØ¤ì(€€€€€±•Ð¨€ô€Àì(€€€€€™½È€ ì¤€ð‘…Ñ„¹±•¹Ñ ì¨¬¬¤ì(€€€€€€€™½È€¡±•Ð¤€ô€Ìì¤€øô€À€˜˜¤€ð‘…Ñ„¹±•¹Ñ ì¤´´¤ì(€€€€€€€€€Ñ¡¥Ì¹}]m©tðô‘…Ñ…m¤¬­t€ðð¤€¨€àì(€€€€€€€ô(€€€€€ô(€€€€€¥˜€ …¥ÍA…‘‘•‘]¥Ñ Ä¤ì(€€€€€€€Ñ¡¥Ì¹}]m¨€´€¡¤€”€Ð€ôôô€À€ü€À€è€Ä¥tðô	%Pà€ðð€ Ì€´¤€”€Ð¤€¨€àì(€€€€€ô(€€€€€Ñ¡¥Ì¹}]lÄÑt€ô‘…Ñ„¹‰åÑ•1•¹Ñ €¼	%PÌÀì(€€€€€Ñ¡¥Ì¹}]lÄÕt€ô‘…Ñ„¹‰åÑ•1•¹Ñ €¨€àì(€€€€€Ñ¡¥Ì¹}ÕÁ‘…Ñ•!…Í  ¤ì(€€€€€½¹ÍÐ‘Ø€ô¹•ÜU¥¹ÐáÉÉ…ä ÌÈ¤ì(€€€€€™½È€¡±•Ð¤È€ô€Àì¤È€ðÑ¡¥Ì¹} ¹±•¹Ñ ì¤È¬¬¤ì(€€€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð€Ðì¤¬¬¤ì(€€€€€€€€€‘Ùm¤È€¨€Ð€¬¥t€ôÑ¡¥Ì¹}!m¤Ét€øøø€ Ì€´¤¤€¨€àì(€€€€€€€ô(€€€€€ô(€€€€€É•ÑÕÉ¸‘Øì(€€€ô(€ôì(€Ù…È‘¥•ÍÐ€ô€¡‘…Ñ„¤€ôø¹•Ü!…Í¡•È ¤¹‘¥•ÍÐ¡‘…Ñ„¤ì((€€¼¼¹½‘•}µ½‘Õ±•Ì½äµÁÉ½Í•µ¥ÉÉ½È½ÍÉŒ½ÕÑ¥±Ì¹©Ì(€Ù…È}½¹Ù½±ÕÑ”€ô€¡‘¥•ÍÐÈ¤€ôøì(€€€½¹ÍÐ8€ô€Øì(€€€™½È€¡±•Ð¤€ô8ì¤€ð‘¥•ÍÐÈ¹±•¹Ñ ì¤¬¬¤ì(€€€€€‘¥•ÍÐÉm¤€”9t€ô‘¥•ÍÐÉm¤€”9tx‘¥•ÍÐÉm¥tì(€€€ô(€€€É•ÑÕÉ¸‘¥•ÍÐÈ¹Í±¥” À°8¤ì(€ôì(€Ù…È¡…Í¡=™)M=8€ô€¡©Í½¸¤€ôøÑ½	…Í”ØÐ¡}½¹Ù½±ÕÑ”¡‘¥•ÍÐ¡•¹½‘•¹ä¡©Í½¸¤¤¤¤ì((€€¼¼¹½‘•}µ½‘Õ±•Ì½äµÁÉ½Í•µ¥ÉÉ½È½ÍÉŒ½Á±Õ¥¹Ì½Íå¹ŒµÁ±Õ¥¸¹©Ì(€Ù…ÈÉ•…Ñ•µÁÑå5•Ñ„€ô€ ¤€ôø€¡ì(€€€µ…ÁÁ¥¹œè€¼¨}}AUI}|€¨¼¹•Ü5…À ¤°(€€€¥Í=5…É¬è€¼¨}}AUI}|€¨¼¹•Ü5…À ¤(€ô¤ì(€Ù…È¥ÍY¥Í¥‰±”È€ô€¡¥Ñ•´°Í¹…ÁÍ¡½ÐÈ¤€ôøÍ¹…ÁÍ¡½ÐÈ€ôôôÙ½¥€À€ü€…¥Ñ•´¹‘•±•Ñ•€èÍ¹…ÁÍ¡½ÐÈ¹ÍØ¹¡…Ì¡¥Ñ•´¹¥¹±¥•¹Ð¤€˜˜€¼¨¨ÑåÁ”í¹Õµ‰•Éô€¨¼(€Í¹…ÁÍ¡½ÐÈ¹ÍØ¹•Ð¡¥Ñ•´¹¥¹±¥•¹Ð¤€ø¥Ñ•´¹¥¹±½¬€˜˜€…¥Í•±•Ñ•¡Í¹…ÁÍ¡½ÐÈ¹‘Ì°¥Ñ•´¹¥¤ì(€Ù…È‘•™…Õ±Ñ½±½ÉÌ€ômì±¥¡Ðè€ˆ•ÐÐÐÌÌˆ°‘…É¬è€ˆ•ÐÐÐˆõtì(€Ù…È•ÑUÍ•É½±½È€ô€¡½±½É5…ÁÁ¥¹œ°½±½ÉÌÈ°ÕÍ•È¤€ôøì(€€€¥˜€ …½±½É5…ÁÁ¥¹œ¹¡…Ì¡ÕÍ•È¤¤ì(€€€€€¥˜€¡½±½É5…ÁÁ¥¹œ¹Í¥é”€ð½±½ÉÌÈ¹±•¹Ñ ¤ì(€€€€€€€½¹ÍÐÕÍ•‘½±½ÉÌ€ôÉ•…Ñ”È ¤ì(€€€€€€€½±½É5…ÁÁ¥¹œ¹™½É…  ¡½±½È¤€ôøÕÍ•‘½±½ÉÌ¹…‘¡½±½È¤¤ì(€€€€€€€½±½ÉÌÈ€ô½±½ÉÌÈ¹™¥±Ñ•È ¡½±½È¤€ôø€…ÕÍ•‘½±½ÉÌ¹¡…Ì¡½±½È¤¤ì(€€€€€ô(€€€€€½±½É5…ÁÁ¥¹œ¹Í•Ð¡ÕÍ•È°½¹•=˜¡½±½ÉÌÈ¤¤ì(€€€ô(€€€É•ÑÕÉ¸€ (€€€€€€¼¨¨ÑåÁ”í½±½É•™ô€¨¼(€€€€€½±½É5…ÁÁ¥¹œ¹•Ð¡ÕÍ•È¤(€€€€¤ì(€ôì(€Ù…ÈåMå¹A±Õ¥¸€ô€¡åaµ±É…µ•¹Ð°ì(€€€½±½ÉÌè½±½ÉÌÈ€ô‘•™…Õ±Ñ½±½ÉÌ°(€€€½±½É5…ÁÁ¥¹œ€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤°(€€€Á•Éµ…¹•¹ÑUÍ•É…Ñ„€ô¹Õ±°°(€€€½¹¥ÉÍÑI•¹‘•È€ô€ ¤€ôøì(€€€ô°(€€€µ…ÁÁ¥¹œ(€ô€ôíô¤€ôøì(€€€±•Ð¥¹¥Ñ¥…±½¹Ñ•¹Ñ¡…¹•€ô™…±Í”ì(€€€½¹ÍÐ‰¥¹‘¥¹œ€ô¹•ÜAÉ½Í•µ¥ÉÉ½É	¥¹‘¥¹œ¡åaµ±É…µ•¹Ð°µ…ÁÁ¥¹œ¤ì(€€€½¹ÍÐÁ±Õ¥¸€ô¹•ÜA±Õ¥¸¡ì(€€€€€ÁÉ½ÁÌèì(€€€€€€€•‘¥Ñ…‰±”è€¡ÍÑ…Ñ”¤€ôøì(€€€€€€€€€½¹ÍÐÍå¹MÑ…Ñ”€ôåMå¹A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡ÍÑ…Ñ”¤ì(€€€€€€€€€É•ÑÕÉ¸Íå¹MÑ…Ñ”¹Í¹…ÁÍ¡½Ð€ôô¹Õ±°€˜˜Íå¹MÑ…Ñ”¹ÁÉ•ÙM¹…ÁÍ¡½Ð€ôô¹Õ±°ì(€€€€€€€ô(€€€€€ô°(€€€€€­•äèåMå¹A±Õ¥¹-•ä°(€€€€€ÍÑ…Ñ”èì(€€€€€€€€¼¨¨(€€€€€€€€€¨É•ÑÕÉ¹Ìí…¹åô(€€€€€€€€€¨¼(€€€€€€€¥¹¥Ðè€¡}¥¹¥Ñ…ÉÌ°}ÍÑ…Ñ”¤€ôøì(€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€€€€€ÑåÁ”èåaµ±É…µ•¹Ð°(€€€€€€€€€€€‘½Œèåaµ±É…µ•¹Ð¹‘½Œ°(€€€€€€€€€€€‰¥¹‘¥¹œ°(€€€€€€€€€€€Í¹…ÁÍ¡½Ðè¹Õ±°°(€€€€€€€€€€€ÁÉ•ÙM¹…ÁÍ¡½Ðè¹Õ±°°(€€€€€€€€€€€¥Í¡…¹•=É¥¥¸è™…±Í”°(€€€€€€€€€€€¥ÍU¹‘½I•‘½=Á•É…Ñ¥½¸è™…±Í”°(€€€€€€€€€€€…‘‘Q½!¥ÍÑ½ÉäèÑÉÕ”°(€€€€€€€€€€€½±½ÉÌè½±½ÉÌÈ°(€€€€€€€€€€€½±½É5…ÁÁ¥¹œ°(€€€€€€€€€€€Á•Éµ…¹•¹ÑUÍ•É…Ñ„(€€€€€€€€€ôì(€€€€€€€ô°(€€€€€€€…ÁÁ±äè€¡ÑÈ°Á±Õ¥¹MÑ…Ñ”¤€ôøì(€€€€€€€€€½¹ÍÐ¡…¹”€ôÑÈ¹•Ñ5•Ñ„¡åMå¹A±Õ¥¹-•ä¤ì(€€€€€€€€€¥˜€¡¡…¹”€„ôôÙ½¥€À¤ì(€€€€€€€€€€€Á±Õ¥¹MÑ…Ñ”€ô=‰©•Ð¹…ÍÍ¥¸¡íô°Á±Õ¥¹MÑ…Ñ”¤ì(€€€€€€€€€€€™½È€¡½¹ÍÐ­•ä¥¸¡…¹”¤ì(€€€€€€€€€€€€€Á±Õ¥¹MÑ…Ñ•m­•åt€ô¡…¹•m­•åtì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€€€Á±Õ¥¹MÑ…Ñ”¹…‘‘Q½!¥ÍÑ½Éä€ôÑÈ¹•Ñ5•Ñ„ ‰…‘‘Q½!¥ÍÑ½Éäˆ¤€„ôô™…±Í”ì(€€€€€€€€€Á±Õ¥¹MÑ…Ñ”¹¥Í¡…¹•=É¥¥¸€ô¡…¹”€„ôôÙ½¥€À€˜˜€„…¡…¹”¹¥Í¡…¹•=É¥¥¸ì(€€€€€€€€€Á±Õ¥¹MÑ…Ñ”¹¥ÍU¹‘½I•‘½=Á•É…Ñ¥½¸€ô¡…¹”€„ôôÙ½¥€À€˜˜€„…¡…¹”¹¥Í¡…¹•=É¥¥¸€˜˜€„…¡…¹”¹¥ÍU¹‘½I•‘½=Á•É…Ñ¥½¸ì(€€€€€€€€€¥˜€¡‰¥¹‘¥¹œ¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü€„ôô¹Õ±°¤ì(€€€€€€€€€€€¥˜€¡¡…¹”€„ôôÙ½¥€À€˜˜€¡¡…¹”¹Í¹…ÁÍ¡½Ð€„ô¹Õ±°ñð¡…¹”¹ÁÉ•ÙM¹…ÁÍ¡½Ð€„ô¹Õ±°¤¤ì(€€€€€€€€€€€€€Ñ¥µ•½ÕÐ À°€ ¤€ôøì(€€€€€€€€€€€€€€€¥˜€¡‰¥¹‘¥¹œ¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü€ôô¹Õ±°¤ì(€€€€€€€€€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€€€€€€€€€ô(€€€€€€€€€€€€€€€¥˜€¡¡…¹”¹É•ÍÑ½É”€ôô¹Õ±°¤ì(€€€€€€€€€€€€€€€€€‰¥¹‘¥¹œ¹}É•¹‘•ÉM¹…ÁÍ¡½Ð (€€€€€€€€€€€€€€€€€€€¡…¹”¹Í¹…ÁÍ¡½Ð°(€€€€€€€€€€€€€€€€€€€¡…¹”¹ÁÉ•ÙM¹…ÁÍ¡½Ð°(€€€€€€€€€€€€€€€€€€€Á±Õ¥¹MÑ…Ñ”(€€€€€€€€€€€€€€€€€€¤ì(€€€€€€€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€€€€€€€‰¥¹‘¥¹œ¹}É•¹‘•ÉM¹…ÁÍ¡½Ð (€€€€€€€€€€€€€€€€€€€¡…¹”¹Í¹…ÁÍ¡½Ð°(€€€€€€€€€€€€€€€€€€€¡…¹”¹Í¹…ÁÍ¡½Ð°(€€€€€€€€€€€€€€€€€€€Á±Õ¥¹MÑ…Ñ”(€€€€€€€€€€€€€€€€€€¤ì(€€€€€€€€€€€€€€€€€‘•±•Ñ”Á±Õ¥¹MÑ…Ñ”¹É•ÍÑ½É”ì(€€€€€€€€€€€€€€€€€‘•±•Ñ”Á±Õ¥¹MÑ…Ñ”¹Í¹…ÁÍ¡½Ðì(€€€€€€€€€€€€€€€€€‘•±•Ñ”Á±Õ¥¹MÑ…Ñ”¹ÁÉ•ÙM¹…ÁÍ¡½Ðì(€€€€€€€€€€€€€€€€€‰¥¹‘¥¹œ¹µÕà  ¤€ôøì(€€€€€€€€€€€€€€€€€€€‰¥¹‘¥¹œ¹}ÁÉ½Í•µ¥ÉÉ½É¡…¹• (€€€€€€€€€€€€€€€€€€€€€‰¥¹‘¥¹œ¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¹‘½Œ(€€€€€€€€€€€€€€€€€€€€¤ì(€€€€€€€€€€€€€€€€€ô¤ì(€€€€€€€€€€€€€€€ô(€€€€€€€€€€€€€ô¤ì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€€€É•ÑÕÉ¸Á±Õ¥¹MÑ…Ñ”ì(€€€€€€€ô(€€€€€ô°(€€€€€Ù¥•Üè€¡Ù¥•Ü¤€ôøì(€€€€€€€‰¥¹‘¥¹œ¹¥¹¥ÑY¥•Ü¡Ù¥•Ü¤ì(€€€€€€€¥˜€¡µ…ÁÁ¥¹œ€ôô¹Õ±°¤ì(€€€€€€€€€‰¥¹‘¥¹œ¹}™½É•I•É•¹‘•È ¤ì(€€€€€€€ô(€€€€€€€½¹¥ÉÍÑI•¹‘•È ¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€€€€€ÕÁ‘…Ñ”è€ ¤€ôøì(€€€€€€€€€€€½¹ÍÐÁ±Õ¥¹MÑ…Ñ”€ôÁ±Õ¥¸¹•ÑMÑ…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¤ì(€€€€€€€€€€€¥˜€¡Á±Õ¥¹MÑ…Ñ”¹Í¹…ÁÍ¡½Ð€ôô¹Õ±°€˜˜Á±Õ¥¹MÑ…Ñ”¹ÁÉ•ÙM¹…ÁÍ¡½Ð€ôô¹Õ±°¤ì(€€€€€€€€€€€€€¥˜€ (€€€€€€€€€€€€€€€€¼¼%˜Ñ¡”½¹Ñ•¹Ð‘½•Í¸Ð¡…¹”¥¹¥Ñ¥…±±ä°Ý”‘½¸ÐÉ•¹‘•È…¹åÑ¡¥¹œÑ¼e©Ì(€€€€€€€€€€€€€€€€¼¼%˜Ñ¡”½¹Ñ•¹ÐÝ…Ì±•…É•‰ä„ÕÍ•È…Ñ¥½¸°Ý”Ý…¹ÐÑ¼…Ñ Ñ¡”¡…¹”…¹(€€€€€€€€€€€€€€€€¼¼É•ÁÉ•Í•¹Ð¥Ð¥¸e©Ì(€€€€€€€€€€€€€€€¥¹¥Ñ¥…±½¹Ñ•¹Ñ¡…¹•ñðÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹½¹Ñ•¹Ð¹™¥¹‘¥™™MÑ…ÉÐ (€€€€€€€€€€€€€€€€€Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹ÑåÁ”¹É•…Ñ•¹‘¥±° ¤¹½¹Ñ•¹Ð(€€€€€€€€€€€€€€€€¤€„ôô¹Õ±°(€€€€€€€€€€€€€€¤ì(€€€€€€€€€€€€€€€¥¹¥Ñ¥…±½¹Ñ•¹Ñ¡…¹•€ôÑÉÕ”ì(€€€€€€€€€€€€€€€¥˜€¡Á±Õ¥¹MÑ…Ñ”¹…‘‘Q½!¥ÍÑ½Éä€ôôô™…±Í”€˜˜€…Á±Õ¥¹MÑ…Ñ”¹¥Í¡…¹•=É¥¥¸¤ì(€€€€€€€€€€€€€€€€€½¹ÍÐåU¹‘½A±Õ¥¹MÑ…Ñ”€ôåU¹‘½A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¤ì(€€€€€€€€€€€€€€€€€½¹ÍÐÕ´€ôåU¹‘½A±Õ¥¹MÑ…Ñ”€˜˜åU¹‘½A±Õ¥¹MÑ…Ñ”¹Õ¹‘½5…¹…•Èì(€€€€€€€€€€€€€€€€€¥˜€¡Õ´¤ì(€€€€€€€€€€€€€€€€€€€Õ´¹ÍÑ½Á…ÁÑÕÉ¥¹œ ¤ì(€€€€€€€€€€€€€€€€€ô(€€€€€€€€€€€€€€€ô(€€€€€€€€€€€€€€€‰¥¹‘¥¹œ¹µÕà  ¤€ôøì(€€€€€€€€€€€€€€€€€Á±Õ¥¹MÑ…Ñ”¹‘½Œ¹ÑÉ…¹Í…Ð ¡ÑÈ¤€ôøì(€€€€€€€€€€€€€€€€€€€ÑÈ¹µ•Ñ„¹Í•Ð ‰…‘‘Q½!¥ÍÑ½Éäˆ°Á±Õ¥¹MÑ…Ñ”¹…‘‘Q½!¥ÍÑ½Éä¤ì(€€€€€€€€€€€€€€€€€€€‰¥¹‘¥¹œ¹}ÁÉ½Í•µ¥ÉÉ½É¡…¹•¡Ù¥•Ü¹ÍÑ…Ñ”¹‘½Œ¤ì(€€€€€€€€€€€€€€€€€ô°åMå¹A±Õ¥¹-•ä¤ì(€€€€€€€€€€€€€€€ô¤ì(€€€€€€€€€€€€€ô(€€€€€€€€€€€ô(€€€€€€€€€ô°(€€€€€€€€€‘•ÍÑÉ½äè€ ¤€ôøì(€€€€€€€€€€€‰¥¹‘¥¹œ¹‘•ÍÑÉ½ä ¤ì(€€€€€€€€€ô(€€€€€€€ôì(€€€€€ô(€€€ô¤ì(€€€É•ÑÕÉ¸Á±Õ¥¸ì(€ôì(€Ù…ÈÉ•ÍÑ½É•I•±…Ñ¥Ù•M•±•Ñ¥½¸€ô€¡ÑÈ°É•±M•°°‰¥¹‘¥¹œ¤€ôøì(€€€¥˜€¡É•±M•°€„ôô¹Õ±°€˜˜É•±M•°¹…¹¡½È€„ôô¹Õ±°€˜˜É•±M•°¹¡•…€„ôô¹Õ±°¤ì(€€€€€¥˜€¡É•±M•°¹ÑåÁ”€ôôô€‰…±°ˆ¤ì(€€€€€€€ÑÈ¹Í•ÑM•±•Ñ¥½¸¡¹•Ü±±M•±•Ñ¥½¸¡ÑÈ¹‘½Œ¤¤ì(€€€€€ô•±Í”¥˜€¡É•±M•°¹ÑåÁ”€ôôô€‰¹½‘”ˆ¤ì(€€€€€€€½¹ÍÐ…¹¡½È€ôÉ•±…Ñ¥Ù•A½Í¥Ñ¥½¹Q½‰Í½±ÕÑ•A½Í¥Ñ¥½¸ (€€€€€€€€€‰¥¹‘¥¹œ¹‘½Œ°(€€€€€€€€€‰¥¹‘¥¹œ¹ÑåÁ”°(€€€€€€€€€É•±M•°¹…¹¡½È°(€€€€€€€€€‰¥¹‘¥¹œ¹µ…ÁÁ¥¹œ(€€€€€€€€¤ì(€€€€€€€ÑÈ¹Í•ÑM•±•Ñ¥½¸¡9½‘•M•±•Ñ¥½¸¹É•…Ñ”¡ÑÈ¹‘½Œ°…¹¡½È¤¤ì(€€€€€ô•±Í”ì(€€€€€€€½¹ÍÐ…¹¡½È€ôÉ•±…Ñ¥Ù•A½Í¥Ñ¥½¹Q½‰Í½±ÕÑ•A½Í¥Ñ¥½¸ (€€€€€€€€€‰¥¹‘¥¹œ¹‘½Œ°(€€€€€€€€€‰¥¹‘¥¹œ¹ÑåÁ”°(€€€€€€€€€É•±M•°¹…¹¡½È°(€€€€€€€€€‰¥¹‘¥¹œ¹µ…ÁÁ¥¹œ(€€€€€€€€¤ì(€€€€€€€½¹ÍÐ¡•…€ôÉ•±…Ñ¥Ù•A½Í¥Ñ¥½¹Q½‰Í½±ÕÑ•A½Í¥Ñ¥½¸ (€€€€€€€€€‰¥¹‘¥¹œ¹‘½Œ°(€€€€€€€€€‰¥¹‘¥¹œ¹ÑåÁ”°(€€€€€€€€€É•±M•°¹¡•…°(€€€€€€€€€‰¥¹‘¥¹œ¹µ…ÁÁ¥¹œ(€€€€€€€€¤ì(€€€€€€€¥˜€¡…¹¡½È€„ôô¹Õ±°€˜˜¡•…€„ôô¹Õ±°¤ì(€€€€€€€€€½¹ÍÐÍ•°€ôQ•áÑM•±•Ñ¥½¸¹‰•ÑÝ••¸¡ÑÈ¹‘½Œ¹É•Í½±Ù”¡…¹¡½È¤°ÑÈ¹‘½Œ¹É•Í½±Ù”¡¡•…¤¤ì(€€€€€€€€€ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Í•°¤ì(€€€€€€€ô(€€€€€ô(€€€ô(€ôì(€Ù…È•ÑI•±…Ñ¥Ù•M•±•Ñ¥½¸€ô€¡Áµ‰¥¹‘¥¹œ°ÍÑ…Ñ”¤€ôø€¡ì(€€€ÑåÁ”è€ (€€€€€€¼¨¨ÑåÁ”í…¹åô€¨¼(€€€€€ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹©Í½¹%(€€€€¤°(€€€…¹¡½Èè…‰Í½±ÕÑ•A½Í¥Ñ¥½¹Q½I•±…Ñ¥Ù•A½Í¥Ñ¥½¸ (€€€€€ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹…¹¡½È°(€€€€€Áµ‰¥¹‘¥¹œ¹ÑåÁ”°(€€€€€Áµ‰¥¹‘¥¹œ¹µ…ÁÁ¥¹œ(€€€€¤°(€€€¡•…è…‰Í½±ÕÑ•A½Í¥Ñ¥½¹Q½I•±…Ñ¥Ù•A½Í¥Ñ¥½¸ (€€€€€ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹¡•…°(€€€€€Áµ‰¥¹‘¥¹œ¹ÑåÁ”°(€€€€€Áµ‰¥¹‘¥¹œ¹µ…ÁÁ¥¹œ(€€€€¤(€ô¤ì(€Ù…ÈAÉ½Í•µ¥ÉÉ½É	¥¹‘¥¹œ€ô±…ÍÌì(€€€€¼¨¨(€€€€€¨Á…É…´íd¹aµ±É…µ•¹Ñôåaµ±É…µ•¹ÐQ¡”‰¥¹Í½ÕÉ”(€€€€€¨Á…É…´íAÉ½Í•µ¥ÉÉ½É5…ÁÁ¥¹ôµ…ÁÁ¥¹œ(€€€€€¨¼(€€€½¹ÍÑÉÕÑ½È¡åaµ±É…µ•¹Ð°µ…ÁÁ¥¹œ€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤¤ì(€€€€€Ñ¡¥Ì¹ÑåÁ”€ôåaµ±É…µ•¹Ðì(€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹µÕà€ôÉ•…Ñ•5ÕÑ•à ¤ì(€€€€€Ñ¡¥Ì¹µ…ÁÁ¥¹œ€ôµ…ÁÁ¥¹œì(€€€€€Ñ¡¥Ì¹¥Í=5…É¬€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤ì(€€€€€Ñ¡¥Ì¹}½‰Í•ÉÙ•Õ¹Ñ¥½¸€ôÑ¡¥Ì¹}ÑåÁ•¡…¹•¹‰¥¹¡Ñ¡¥Ì¤ì(€€€€€Ñ¡¥Ì¹‘½Œ€ôåaµ±É…µ•¹Ð¹‘½Œì(€€€€€Ñ¡¥Ì¹‰•™½É•QÉ…¹Í…Ñ¥½¹M•±•Ñ¥½¸€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹‰•™½É•±±QÉ…¹Í…Ñ¥½¹Ì€ô€ ¤€ôøì(€€€€€€€¥˜€¡Ñ¡¥Ì¹‰•™½É•QÉ…¹Í…Ñ¥½¹M•±•Ñ¥½¸€ôôô¹Õ±°€˜˜Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü€„ô¹Õ±°¤ì(€€€€€€€€€Ñ¡¥Ì¹‰•™½É•QÉ…¹Í…Ñ¥½¹M•±•Ñ¥½¸€ô•ÑI•±…Ñ¥Ù•M•±•Ñ¥½¸ (€€€€€€€€€€€Ñ¡¥Ì°(€€€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”(€€€€€€€€€€¤ì(€€€€€€€ô(€€€€€ôì(€€€€€Ñ¡¥Ì¹…™Ñ•É±±QÉ…¹Í…Ñ¥½¹Ì€ô€ ¤€ôøì(€€€€€€€Ñ¡¥Ì¹‰•™½É•QÉ…¹Í…Ñ¥½¹M•±•Ñ¥½¸€ô¹Õ±°ì(€€€€€ôì(€€€€€Ñ¡¥Ì¹}‘½µM•±•Ñ¥½¹%¹Y¥•Ü€ô¹Õ±°ì(€€€ô(€€€€¼¨¨(€€€€€¨É•…Ñ”„ÑÉ…¹Í…Ñ¥½¸™½È¡…¹¥¹œÑ¡”ÁÉ½Í•µ¥ÉÉ½ÈÍÑ…Ñ”¸(€€€€€¨(€€€€€¨É•ÑÕÉ¹Ì(€€€€€¨¼(€€€•Ð}ÑÈ ¤ì(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹Í•Ñ5•Ñ„ ‰…‘‘Q½!¥ÍÑ½Éäˆ°™…±Í”¤ì(€€€ô(€€€}¥Í1½…±ÕÉÍ½É%¹Y¥•Ü ¤ì(€€€€€¥˜€ …Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹¡…Í½ÕÌ ¤¤É•ÑÕÉ¸™…±Í”ì(€€€€€¥˜€¡¥Í	É½ÝÍ•È€˜˜Ñ¡¥Ì¹}‘½µM•±•Ñ¥½¹%¹Y¥•Ü€ôôô¹Õ±°¤ì(€€€€€€€Ñ¥µ•½ÕÐ À°€ ¤€ôøì(€€€€€€€€€Ñ¡¥Ì¹}‘½µM•±•Ñ¥½¹%¹Y¥•Ü€ô¹Õ±°ì(€€€€€€€ô¤ì(€€€€€€€Ñ¡¥Ì¹}‘½µM•±•Ñ¥½¹%¹Y¥•Ü€ôÑ¡¥Ì¹}¥Í½µM•±•Ñ¥½¹%¹Y¥•Ü ¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸Ñ¡¥Ì¹}‘½µM•±•Ñ¥½¹%¹Y¥•Üì(€€€ô(€€€}¥Í½µM•±•Ñ¥½¹%¹Y¥•Ü ¤ì(€€€€€½¹ÍÐÍ•±•Ñ¥½¸€ôÑ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹}É½½Ð¹•ÑM•±•Ñ¥½¸ ¤ì(€€€€€¥˜€¡Í•±•Ñ¥½¸€ôô¹Õ±°ñðÍ•±•Ñ¥½¸¹…¹¡½É9½‘”€ôô¹Õ±°¤É•ÑÕÉ¸™…±Í”ì(€€€€€½¹ÍÐÉ…¹”€ôÑ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹}É½½Ð¹É•…Ñ•I…¹” ¤ì(€€€€€É…¹”¹Í•ÑMÑ…ÉÐ¡Í•±•Ñ¥½¸¹…¹¡½É9½‘”°Í•±•Ñ¥½¸¹…¹¡½É=™™Í•Ð¤ì(€€€€€É…¹”¹Í•Ñ¹¡Í•±•Ñ¥½¸¹™½ÕÍ9½‘”°Í•±•Ñ¥½¸¹™½ÕÍ=™™Í•Ð¤ì(€€€€€½¹ÍÐÉ•ÑÌ€ôÉ…¹”¹•Ñ±¥•¹ÑI•ÑÌ ¤ì(€€€€€¥˜€¡É•ÑÌ¹±•¹Ñ €ôôô€À¤ì(€€€€€€€¥˜€¡É…¹”¹ÍÑ…ÉÑ½¹Ñ…¥¹•È€˜˜É…¹”¹½±±…ÁÍ•¤ì(€€€€€€€€€É…¹”¹Í•±•Ñ9½‘•½¹Ñ•¹ÑÌ¡É…¹”¹ÍÑ…ÉÑ½¹Ñ…¥¹•È¤ì(€€€€€€€ô(€€€€€ô(€€€€€½¹ÍÐ‰½Õ¹‘¥¹œ€ôÉ…¹”¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤ì(€€€€€½¹ÍÐ‘½Õµ•¹Ñ±•µ•¹Ð€ô‘½Œ¹‘½Õµ•¹Ñ±•µ•¹Ðì(€€€€€É•ÑÕÉ¸‰½Õ¹‘¥¹œ¹‰½ÑÑ½´€øô€À€˜˜‰½Õ¹‘¥¹œ¹É¥¡Ð€øô€À€˜˜‰½Õ¹‘¥¹œ¹±•™Ð€ðô€¡Ý¥¹‘½Ü¹¥¹¹•É]¥‘Ñ ñð‘½Õµ•¹Ñ±•µ•¹Ð¹±¥•¹Ñ]¥‘Ñ ñð€À¤€˜˜‰½Õ¹‘¥¹œ¹Ñ½À€ðô€¡Ý¥¹‘½Ü¹¥¹¹•É!•¥¡Ðñð‘½Õµ•¹Ñ±•µ•¹Ð¹±¥•¹Ñ!•¥¡Ðñð€À¤ì(€€€ô(€€€€¼¨¨(€€€€€¨Á…É…´íd¹M¹…ÁÍ¡½ÑôÍ¹…ÁÍ¡½Ð(€€€€€¨Á…É…´íd¹M¹…ÁÍ¡½ÑôÁÉ•ÙM¹…ÁÍ¡½Ð(€€€€€¨¼(€€€É•¹‘•ÉM¹…ÁÍ¡½Ð¡Í¹…ÁÍ¡½ÐÈ°ÁÉ•ÙM¹…ÁÍ¡½Ð¤ì(€€€€€¥˜€ …ÁÉ•ÙM¹…ÁÍ¡½Ð¤ì(€€€€€€€ÁÉ•ÙM¹…ÁÍ¡½Ð€ôÉ•…Ñ•M¹…ÁÍ¡½Ð¡É•…Ñ••±•Ñ•M•Ð ¤°€¼¨}}AUI}|€¨¼¹•Ü5…À ¤¤ì(€€€€€ô(€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹‘¥ÍÁ…Ñ  (€€€€€€€Ñ¡¥Ì¹}ÑÈ¹Í•Ñ5•Ñ„¡åMå¹A±Õ¥¹-•ä°ìÍ¹…ÁÍ¡½ÐèÍ¹…ÁÍ¡½ÐÈ°ÁÉ•ÙM¹…ÁÍ¡½Ðô¤(€€€€€€¤ì(€€€ô(€€€Õ¹É•¹‘•ÉM¹…ÁÍ¡½Ð ¤ì(€€€€€Ñ¡¥Ì¹µ…ÁÁ¥¹œ¹±•…È ¤ì(€€€€€Ñ¡¥Ì¹µÕà  ¤€ôøì(€€€€€€€½¹ÍÐ™É…µ•¹Ñ½¹Ñ•¹Ð€ôÑ¡¥Ì¹ÑåÁ”¹Ñ½ÉÉ…ä ¤¹µ…À (€€€€€€€€€€¡Ð¤€ôøÉ•…Ñ•9½‘•É½µe±•µ•¹Ð (€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹aµ±±•µ•¹Ñô€¨¼(€€€€€€€€€€€Ð°(€€€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¹Í¡•µ„°(€€€€€€€€€€€Ñ¡¥Ì(€€€€€€€€€€¤(€€€€€€€€¤¹™¥±Ñ•È ¡¸¤€ôø¸€„ôô¹Õ±°¤ì(€€€€€€€½¹ÍÐÑÈ€ôÑ¡¥Ì¹}ÑÈ¹É•Á±…” (€€€€€€€€€€À°(€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”°(€€€€€€€€€¹•ÜM±¥”¡É…µ•¹Ð¹™É½´¡™É…µ•¹Ñ½¹Ñ•¹Ð¤°€À°€À¤(€€€€€€€€¤ì(€€€€€€€ÑÈ¹Í•Ñ5•Ñ„¡åMå¹A±Õ¥¹-•ä°ìÍ¹…ÁÍ¡½Ðè¹Õ±°°ÁÉ•ÙM¹…ÁÍ¡½Ðè¹Õ±°ô¤ì(€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹‘¥ÍÁ…Ñ ¡ÑÈ¤ì(€€€€€ô¤ì(€€€ô(€€€}™½É•I•É•¹‘•È ¤ì(€€€€€Ñ¡¥Ì¹µ…ÁÁ¥¹œ¹±•…È ¤ì(€€€€€Ñ¡¥Ì¹µÕà  ¤€ôøì(€€€€€€€½¹ÍÐÍ•°€ôÑ¡¥Ì¹‰•™½É•QÉ…¹Í…Ñ¥½¹M•±•Ñ¥½¸€„ôô¹Õ±°€ü¹Õ±°€èÑ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€€€€€½¹ÍÐ™É…µ•¹Ñ½¹Ñ•¹Ð€ôÑ¡¥Ì¹ÑåÁ”¹Ñ½ÉÉ…ä ¤¹µ…À (€€€€€€€€€€¡Ð¤€ôøÉ•…Ñ•9½‘•É½µe±•µ•¹Ð (€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹aµ±±•µ•¹Ñô€¨¼(€€€€€€€€€€€Ð°(€€€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¹Í¡•µ„°(€€€€€€€€€€€Ñ¡¥Ì(€€€€€€€€€€¤(€€€€€€€€¤¹™¥±Ñ•È ¡¸¤€ôø¸€„ôô¹Õ±°¤ì(€€€€€€€½¹ÍÐÑÈ€ôÑ¡¥Ì¹}ÑÈ¹É•Á±…” (€€€€€€€€€€À°(€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”°(€€€€€€€€€¹•ÜM±¥”¡É…µ•¹Ð¹™É½´¡™É…µ•¹Ñ½¹Ñ•¹Ð¤°€À°€À¤(€€€€€€€€¤ì(€€€€€€€¥˜€¡Í•°¤ì(€€€€€€€€€½¹ÍÐ±…µÁ•‘¹¡½È€ôµ¥¸¡µ…à¡Í•°¹…¹¡½È°€À¤°ÑÈ¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”¤ì(€€€€€€€€€½¹ÍÐ±…µÁ•‘!•…€ôµ¥¸¡µ…à¡Í•°¹¡•…°€À¤°ÑÈ¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”¤ì(€€€€€€€€€ÑÈ¹Í•ÑM•±•Ñ¥½¸¡Q•áÑM•±•Ñ¥½¸¹É•…Ñ”¡ÑÈ¹‘½Œ°±…µÁ•‘¹¡½È°±…µÁ•‘!•…¤¤ì(€€€€€€€ô(€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹‘¥ÍÁ…Ñ  (€€€€€€€€€ÑÈ¹Í•Ñ5•Ñ„¡åMå¹A±Õ¥¹-•ä°ì¥Í¡…¹•=É¥¥¸èÑÉÕ”°‰¥¹‘¥¹œèÑ¡¥Ìô¤(€€€€€€€€¤ì(€€€€€ô¤ì(€€€ô(€€€€¼¨¨(€€€€€¨Á…É…´íd¹M¹…ÁÍ¡½ÑñU¥¹ÐáÉÉ…åôÍ¹…ÁÍ¡½Ð(€€€€€¨Á…É…´íd¹M¹…ÁÍ¡½ÑñU¥¹ÐáÉÉ…åôÁÉ•ÙM¹…ÁÍ¡½Ð(€€€€€¨Á…É…´í=‰©•ÑôÁ±Õ¥¹MÑ…Ñ”(€€€€€¨¼(€€€}É•¹‘•ÉM¹…ÁÍ¡½Ð¡Í¹…ÁÍ¡½ÐÈ°ÁÉ•ÙM¹…ÁÍ¡½Ð°Á±Õ¥¹MÑ…Ñ”¤ì(€€€€€±•Ð¡¥ÍÑ½Éå½Œ€ôÑ¡¥Ì¹‘½Œì(€€€€€±•Ð¡¥ÍÑ½ÉåQåÁ”€ôÑ¡¥Ì¹ÑåÁ”ì(€€€€€¥˜€ …Í¹…ÁÍ¡½ÐÈ¤ì(€€€€€€€Í¹…ÁÍ¡½ÐÈ€ôÍ¹…ÁÍ¡½Ð¡Ñ¡¥Ì¹‘½Œ¤ì(€€€€€ô(€€€€€¥˜€¡Í¹…ÁÍ¡½ÐÈ¥¹ÍÑ…¹•½˜U¥¹ÐáÉÉ…äñðÁÉ•ÙM¹…ÁÍ¡½Ð¥¹ÍÑ…¹•½˜U¥¹ÐáÉÉ…ä¤ì(€€€€€€€¥˜€ „¡Í¹…ÁÍ¡½ÐÈ¥¹ÍÑ…¹•½˜U¥¹ÐáÉÉ…ä¤ñð€„¡ÁÉ•ÙM¹…ÁÍ¡½Ð¥¹ÍÑ…¹•½˜U¥¹ÐáÉÉ…ä¤¤ì(€€€€€€€€€Õ¹•áÁ•Ñ•‘…Í” ¤ì(€€€€€€€ô(€€€€€€€¡¥ÍÑ½Éå½Œ€ô¹•Ü½Œ¡ìŒè™…±Í”ô¤ì(€€€€€€€…ÁÁ±åUÁ‘…Ñ•XÈ¡¡¥ÍÑ½Éå½Œ°ÁÉ•ÙM¹…ÁÍ¡½Ð¤ì(€€€€€€€ÁÉ•ÙM¹…ÁÍ¡½Ð€ôÍ¹…ÁÍ¡½Ð¡¡¥ÍÑ½Éå½Œ¤ì(€€€€€€€…ÁÁ±åUÁ‘…Ñ•XÈ¡¡¥ÍÑ½Éå½Œ°Í¹…ÁÍ¡½ÐÈ¤ì(€€€€€€€Í¹…ÁÍ¡½ÐÈ€ôÍ¹…ÁÍ¡½Ð¡¡¥ÍÑ½Éå½Œ¤ì(€€€€€€€¥˜€¡¡¥ÍÑ½ÉåQåÁ”¹}¥Ñ•´€ôôô¹Õ±°¤ì(€€€€€€€€€½¹ÍÐÉ½½Ñ-•ä€ôÉÉ…ä¹™É½´¡Ñ¡¥Ì¹‘½Œ¹Í¡…É”¹­•åÌ ¤¤¹™¥¹ (€€€€€€€€€€€€¡­•ä¤€ôøÑ¡¥Ì¹‘½Œ¹Í¡…É”¹•Ð¡­•ä¤€ôôôÑ¡¥Ì¹ÑåÁ”(€€€€€€€€€€¤ì(€€€€€€€€€¡¥ÍÑ½ÉåQåÁ”€ô¡¥ÍÑ½Éå½Œ¹•Ñaµ±É…µ•¹Ð¡É½½Ñ-•ä¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€½¹ÍÐ¡¥ÍÑ½ÉåMÑÉÕÑÌ€ô¡¥ÍÑ½Éå½Œ¹ÍÑ½É”¹±¥•¹ÑÌ¹•Ð¡¡¥ÍÑ½ÉåQåÁ”¹}¥Ñ•´¹¥¹±¥•¹Ð¤€üümtì(€€€€€€€€€½¹ÍÐ¥Ñ•µ%¹‘•à€ô™¥¹‘%¹‘•áML (€€€€€€€€€€€¡¥ÍÑ½ÉåMÑÉÕÑÌ°(€€€€€€€€€€€¡¥ÍÑ½ÉåQåÁ”¹}¥Ñ•´¹¥¹±½¬(€€€€€€€€€€¤ì(€€€€€€€€€½¹ÍÐ¥Ñ•´€ô€ (€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹%Ñ•µô€¨¼(€€€€€€€€€€€¡¥ÍÑ½ÉåMÑÉÕÑÍm¥Ñ•µ%¹‘•át(€€€€€€€€€€¤ì(€€€€€€€€€½¹ÍÐ½¹Ñ•¹Ð€ô€ (€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹½¹Ñ•¹ÑQåÁ•ô€¨¼(€€€€€€€€€€€¥Ñ•´¹½¹Ñ•¹Ð(€€€€€€€€€€¤ì(€€€€€€€€€¡¥ÍÑ½ÉåQåÁ”€ô€¼¨¨ÑåÁ”íd¹aµ±É…µ•¹Ñô€¨¼(€€€€€€€€€½¹Ñ•¹Ð¹ÑåÁ”ì(€€€€€€€ô(€€€€€ô(€€€€€Ñ¡¥Ì¹µ…ÁÁ¥¹œ¹±•…È ¤ì(€€€€€Ñ¡¥Ì¹µÕà  ¤€ôøì(€€€€€€€¡¥ÍÑ½Éå½Œ¹ÑÉ…¹Í…Ð ¡ÑÉ…¹Í…Ñ¥½¸¤€ôøì(€€€€€€€€€½¹ÍÐÁÕ€ôÁ±Õ¥¹MÑ…Ñ”¹Á•Éµ…¹•¹ÑUÍ•É…Ñ„ì(€€€€€€€€€¥˜€¡ÁÕ¤ì(€€€€€€€€€€€ÁÕ¹‘ÍÌ¹™½É…  ¡‘Ì¤€ôøì(€€€€€€€€€€€€€¥Ñ•É…Ñ••±•Ñ•‘MÑÉÕÑÌ¡ÑÉ…¹Í…Ñ¥½¸°‘Ì°€¡}¥Ñ•´¤€ôøì(€€€€€€€€€€€€€ô¤ì(€€€€€€€€€€€ô¤ì(€€€€€€€€€ô(€€€€€€€€€½¹ÍÐ½µÁÕÑ•e¡…¹”€ô€¡ÑåÁ”°¥È¤€ôøì(€€€€€€€€€€€½¹ÍÐÕÍ•È€ôÑåÁ”€ôôô€‰…‘‘•ˆ€üÁÕ¹•ÑUÍ•É	å±¥•¹Ñ%¡¥È¹±¥•¹Ð¤€èÁÕ¹•ÑUÍ•É	å•±•Ñ•‘%¡¥È¤ì(€€€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€€€€€€€ÕÍ•È°(€€€€€€€€€€€€€ÑåÁ”°(€€€€€€€€€€€€€½±½Èè•ÑUÍ•É½±½È (€€€€€€€€€€€€€€€Á±Õ¥¹MÑ…Ñ”¹½±½É5…ÁÁ¥¹œ°(€€€€€€€€€€€€€€€Á±Õ¥¹MÑ…Ñ”¹½±½ÉÌ°(€€€€€€€€€€€€€€€ÕÍ•È(€€€€€€€€€€€€€€¤(€€€€€€€€€€€ôì(€€€€€€€€€ôì(€€€€€€€€€½¹ÍÐ™É…µ•¹Ñ½¹Ñ•¹Ð€ôÑåÁ•1¥ÍÑQ½ÉÉ…åM¹…ÁÍ¡½Ð (€€€€€€€€€€€¡¥ÍÑ½ÉåQåÁ”°(€€€€€€€€€€€¹•ÜM¹…ÁÍ¡½Ð¡ÁÉ•ÙM¹…ÁÍ¡½Ð¹‘Ì°Í¹…ÁÍ¡½ÐÈ¹ÍØ¤(€€€€€€€€€€¤¹µ…À ¡Ð¤€ôøì(€€€€€€€€€€€¥˜€ …Ð¹}¥Ñ•´¹‘•±•Ñ•ñð¥ÍY¥Í¥‰±”È¡Ð¹}¥Ñ•´°Í¹…ÁÍ¡½ÐÈ¤ñð¥ÍY¥Í¥‰±”È¡Ð¹}¥Ñ•´°ÁÉ•ÙM¹…ÁÍ¡½Ð¤¤ì(€€€€€€€€€€€€€É•ÑÕÉ¸É•…Ñ•9½‘•É½µe±•µ•¹Ð (€€€€€€€€€€€€€€€Ð°(€€€€€€€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¹Í¡•µ„°(€€€€€€€€€€€€€€€ìµ…ÁÁ¥¹œè€¼¨}}AUI}|€¨¼¹•Ü5…À ¤°¥Í=5…É¬è€¼¨}}AUI}|€¨¼¹•Ü5…À ¤ô°(€€€€€€€€€€€€€€€Í¹…ÁÍ¡½ÐÈ°(€€€€€€€€€€€€€€€ÁÉ•ÙM¹…ÁÍ¡½Ð°(€€€€€€€€€€€€€€€½µÁÕÑ•e¡…¹”(€€€€€€€€€€€€€€¤ì(€€€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€€€€€€€€€ô(€€€€€€€€€ô¤¹™¥±Ñ•È ¡¸¤€ôø¸€„ôô¹Õ±°¤ì(€€€€€€€€€½¹ÍÐÑÈ€ôÑ¡¥Ì¹}ÑÈ¹É•Á±…” (€€€€€€€€€€€€À°(€€€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”°(€€€€€€€€€€€¹•ÜM±¥”¡É…µ•¹Ð¹™É½´¡™É…µ•¹Ñ½¹Ñ•¹Ð¤°€À°€À¤(€€€€€€€€€€¤ì(€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹‘¥ÍÁ…Ñ  (€€€€€€€€€€€ÑÈ¹Í•Ñ5•Ñ„¡åMå¹A±Õ¥¹-•ä°ì¥Í¡…¹•=É¥¥¸èÑÉÕ”ô¤(€€€€€€€€€€¤ì(€€€€€€€ô°åMå¹A±Õ¥¹-•ä¤ì(€€€€€ô¤ì(€€€ô(€€€€¼¨¨(€€€€€¨Á…É…´íÉÉ…äñd¹eÙ•¹Ðñ…¹äøùô•Ù•¹ÑÌ(€€€€€¨Á…É…´íd¹QÉ…¹Í…Ñ¥½¹ôÑÉ…¹Í…Ñ¥½¸(€€€€€¨¼(€€€}ÑåÁ•¡…¹•¡•Ù•¹ÑÌ°ÑÉ…¹Í…Ñ¥½¸¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü€ôô¹Õ±°¤É•ÑÕÉ¸ì(€€€€€½¹ÍÐÍå¹MÑ…Ñ”€ôåMå¹A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¤ì(€€€€€¥˜€¡•Ù•¹ÑÌ¹±•¹Ñ €ôôô€ÀñðÍå¹MÑ…Ñ”¹Í¹…ÁÍ¡½Ð€„ô¹Õ±°ñðÍå¹MÑ…Ñ”¹ÁÉ•ÙM¹…ÁÍ¡½Ð€„ô¹Õ±°¤ì(€€€€€€€Ñ¡¥Ì¹É•¹‘•ÉM¹…ÁÍ¡½Ð¡Íå¹MÑ…Ñ”¹Í¹…ÁÍ¡½Ð°Íå¹MÑ…Ñ”¹ÁÉ•ÙM¹…ÁÍ¡½Ð¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô(€€€€€Ñ¡¥Ì¹µÕà  ¤€ôøì(€€€€€€€½¹ÍÐ‘•±QåÁ”€ô€¡|°ÑåÁ”¤€ôøÑ¡¥Ì¹µ…ÁÁ¥¹œ¹‘•±•Ñ”¡ÑåÁ”¤ì(€€€€€€€¥Ñ•É…Ñ••±•Ñ•‘MÑÉÕÑÌ (€€€€€€€€€ÑÉ…¹Í…Ñ¥½¸°(€€€€€€€€€ÑÉ…¹Í…Ñ¥½¸¹‘•±•Ñ•M•Ð°(€€€€€€€€€€¡ÍÑÉÕÐ¤€ôøì(€€€€€€€€€€€¥˜€¡ÍÑÉÕÐ¹½¹ÍÑÉÕÑ½È€ôôô%Ñ•´¤ì(€€€€€€€€€€€€€½¹ÍÐÑåÁ”€ô€ (€€€€€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹½¹Ñ•¹ÑQåÁ•ô€¨¼(€€€€€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹%Ñ•µô€¨¼(€€€€€€€€€€€€€€€ÍÑÉÕÐ¹½¹Ñ•¹Ð¹ÑåÁ”(€€€€€€€€€€€€€€¤ì(€€€€€€€€€€€€€ÑåÁ”€˜˜Ñ¡¥Ì¹µ…ÁÁ¥¹œ¹‘•±•Ñ”¡ÑåÁ”¤ì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€€¤ì(€€€€€€€ÑÉ…¹Í…Ñ¥½¸¹¡…¹•¹™½É… ¡‘•±QåÁ”¤ì(€€€€€€€ÑÉ…¹Í…Ñ¥½¸¹¡…¹•‘A…É•¹ÑQåÁ•Ì¹™½É… ¡‘•±QåÁ”¤ì(€€€€€€€½¹ÍÐ™É…µ•¹Ñ½¹Ñ•¹Ð€ôÑ¡¥Ì¹ÑåÁ”¹Ñ½ÉÉ…ä ¤¹µ…À (€€€€€€€€€€¡Ð¤€ôøÉ•…Ñ•9½‘•%™9½Ñá¥ÍÑÌ (€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹aµ±±•µ•¹Ððd¹aµ±!½½­ô€¨¼(€€€€€€€€€€€Ð°(€€€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¹Í¡•µ„°(€€€€€€€€€€€Ñ¡¥Ì(€€€€€€€€€€¤(€€€€€€€€¤¹™¥±Ñ•È ¡¸¤€ôø¸€„ôô¹Õ±°¤ì(€€€€€€€±•ÐÑÈ€ôÑ¡¥Ì¹}ÑÈ¹É•Á±…” (€€€€€€€€€€À°(€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”°(€€€€€€€€€¹•ÜM±¥”¡É…µ•¹Ð¹™É½´¡™É…µ•¹Ñ½¹Ñ•¹Ð¤°€À°€À¤(€€€€€€€€¤ì(€€€€€€€É•ÍÑ½É•I•±…Ñ¥Ù•M•±•Ñ¥½¸¡ÑÈ°Ñ¡¥Ì¹‰•™½É•QÉ…¹Í…Ñ¥½¹M•±•Ñ¥½¸°Ñ¡¥Ì¤ì(€€€€€€€ÑÈ€ôÑÈ¹Í•Ñ5•Ñ„¡åMå¹A±Õ¥¹-•ä°ì¥Í¡…¹•=É¥¥¸èÑÉÕ”°¥ÍU¹‘½I•‘½=Á•É…Ñ¥½¸èÑÉ…¹Í…Ñ¥½¸¹½É¥¥¸¥¹ÍÑ…¹•½˜U¹‘½5…¹…•Èô¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹‰•™½É•QÉ…¹Í…Ñ¥½¹M•±•Ñ¥½¸€„ôô¹Õ±°€˜˜Ñ¡¥Ì¹}¥Í1½…±ÕÉÍ½É%¹Y¥•Ü ¤¤ì(€€€€€€€€€ÑÈ¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤ì(€€€€€€€ô(€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹‘¥ÍÁ…Ñ ¡ÑÈ¤ì(€€€€€ô¤ì(€€€ô(€€€€¼¨¨(€€€€€¨Á…É…´í¥µÁ½ÉÐ ÁÉ½Í•µ¥ÉÉ½Èµµ½‘•°œ¤¹9½‘•ô‘½Œ(€€€€€¨¼(€€€}ÁÉ½Í•µ¥ÉÉ½É¡…¹•¡‘½ŒÔ¤ì(€€€€€Ñ¡¥Ì¹‘½Œ¹ÑÉ…¹Í…Ð  ¤€ôøì(€€€€€€€ÕÁ‘…Ñ•eÉ…µ•¹Ð¡Ñ¡¥Ì¹‘½Œ°Ñ¡¥Ì¹ÑåÁ”°‘½ŒÔ°Ñ¡¥Ì¤ì(€€€€€€€Ñ¡¥Ì¹‰•™½É•QÉ…¹Í…Ñ¥½¹M•±•Ñ¥½¸€ô•ÑI•±…Ñ¥Ù•M•±•Ñ¥½¸ (€€€€€€€€€Ñ¡¥Ì°(€€€€€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¹ÍÑ…Ñ”(€€€€€€€€¤ì(€€€€€ô°åMå¹A±Õ¥¹-•ä¤ì(€€€ô(€€€€¼¨¨(€€€€€¨Y¥•Ü¥ÌÉ•…‘äÑ¼±¥ÍÑ•¸Ñ¼¡…¹•Ì¸I•¥ÍÑ•È½‰Í•ÉÙ•ÉÌ¸(€€€€€¨Á…É…´í…¹åôÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü(€€€€€¨¼(€€€¥¹¥ÑY¥•Ü¡ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü€„ô¹Õ±°¤Ñ¡¥Ì¹‘•ÍÑÉ½ä ¤ì(€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü€ôÁÉ½Í•µ¥ÉÉ½ÉY¥•Üì(€€€€€Ñ¡¥Ì¹‘½Œ¹½¸ ‰‰•™½É•±±QÉ…¹Í…Ñ¥½¹Ìˆ°Ñ¡¥Ì¹‰•™½É•±±QÉ…¹Í…Ñ¥½¹Ì¤ì(€€€€€Ñ¡¥Ì¹‘½Œ¹½¸ ‰…™Ñ•É±±QÉ…¹Í…Ñ¥½¹Ìˆ°Ñ¡¥Ì¹…™Ñ•É±±QÉ…¹Í…Ñ¥½¹Ì¤ì(€€€€€Ñ¡¥Ì¹ÑåÁ”¹½‰Í•ÉÙ•••À¡Ñ¡¥Ì¹}½‰Í•ÉÙ•Õ¹Ñ¥½¸¤ì(€€€ô(€€€‘•ÍÑÉ½ä ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü€ôô¹Õ±°¤É•ÑÕÉ¸ì(€€€€€Ñ¡¥Ì¹ÁÉ½Í•µ¥ÉÉ½ÉY¥•Ü€ô¹Õ±°ì(€€€€€Ñ¡¥Ì¹ÑåÁ”¹Õ¹½‰Í•ÉÙ•••À¡Ñ¡¥Ì¹}½‰Í•ÉÙ•Õ¹Ñ¥½¸¤ì(€€€€€Ñ¡¥Ì¹‘½Œ¹½™˜ ‰‰•™½É•±±QÉ…¹Í…Ñ¥½¹Ìˆ°Ñ¡¥Ì¹‰•™½É•±±QÉ…¹Í…Ñ¥½¹Ì¤ì(€€€€€Ñ¡¥Ì¹‘½Œ¹½™˜ ‰…™Ñ•É±±QÉ…¹Í…Ñ¥½¹Ìˆ°Ñ¡¥Ì¹…™Ñ•É±±QÉ…¹Í…Ñ¥½¹Ì¤ì(€€€ô(€ôì(€Ù…ÈÉ•…Ñ•9½‘•%™9½Ñá¥ÍÑÌ€ô€¡•°°Í¡•µ„È°µ•Ñ„°Í¹…ÁÍ¡½ÐÈ°ÁÉ•ÙM¹…ÁÍ¡½Ð°½µÁÕÑ•e¡…¹”¤€ôøì(€€€½¹ÍÐ¹½‘”€ô€ (€€€€€€¼¨¨ÑåÁ”íA5½‘•°¹9½‘•ô€¨¼(€€€€€µ•Ñ„¹µ…ÁÁ¥¹œ¹•Ð¡•°¤(€€€€¤ì(€€€¥˜€¡¹½‘”€ôôôÙ½¥€À¤ì(€€€€€¥˜€¡•°¥¹ÍÑ…¹•½˜eaµ±±•µ•¹Ð¤ì(€€€€€€€É•ÑÕÉ¸É•…Ñ•9½‘•É½µe±•µ•¹Ð (€€€€€€€€€•°°(€€€€€€€€€Í¡•µ„È°(€€€€€€€€€µ•Ñ„°(€€€€€€€€€Í¹…ÁÍ¡½ÐÈ°(€€€€€€€€€ÁÉ•ÙM¹…ÁÍ¡½Ð°(€€€€€€€€€½µÁÕÑ•e¡…¹”(€€€€€€€€¤ì(€€€€€ô•±Í”ì(€€€€€€€Ñ¡É½Üµ•Ñ¡½‘U¹¥µÁ±•µ•¹Ñ• ¤ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸¹½‘”ì(€ôì(€Ù…ÈÉ•…Ñ•9½‘•É½µe±•µ•¹Ð€ô€¡•°°Í¡•µ„È°µ•Ñ„°Í¹…ÁÍ¡½ÐÈ°ÁÉ•ÙM¹…ÁÍ¡½Ð°½µÁÕÑ•e¡…¹”¤€ôøì(€€€½¹ÍÐ¡¥±‘É•¸€ômtì(€€€½¹ÍÐÉ•…Ñ•¡¥±‘É•¸€ô€¡ÑåÁ”¤€ôøì(€€€€€¥˜€¡ÑåÁ”¥¹ÍÑ…¹•½˜eaµ±±•µ•¹Ð¤ì(€€€€€€€½¹ÍÐ¸€ôÉ•…Ñ•9½‘•%™9½Ñá¥ÍÑÌ (€€€€€€€€€ÑåÁ”°(€€€€€€€€€Í¡•µ„È°(€€€€€€€€€µ•Ñ„°(€€€€€€€€€Í¹…ÁÍ¡½ÐÈ°(€€€€€€€€€ÁÉ•ÙM¹…ÁÍ¡½Ð°(€€€€€€€€€½µÁÕÑ•e¡…¹”(€€€€€€€€¤ì(€€€€€€€¥˜€¡¸€„ôô¹Õ±°¤ì(€€€€€€€€€¡¥±‘É•¸¹ÁÕÍ ¡¸¤ì(€€€€€€€ô(€€€€€ô•±Í”ì(€€€€€€€½¹ÍÐ¹•áÑåÑ•áÐ€ô€ (€€€€€€€€€€¼¨¨ÑåÁ”íd¹½¹Ñ•¹ÑQåÁ•ô€¨¼(€€€€€€€€€ÑåÁ”¹}¥Ñ•´¹É¥¡Ðü¹½¹Ñ•¹Ðü¹ÑåÁ”(€€€€€€€€¤ì(€€€€€€€¥˜€¡¹•áÑåÑ•áÐ¥¹ÍÑ…¹•½˜eQ•áÐ€˜˜€…¹•áÑåÑ•áÐ¹}¥Ñ•´¹‘•±•Ñ•€˜˜¹•áÑåÑ•áÐ¹}¥Ñ•´¹¥¹±¥•¹Ð€ôôô¹•áÑåÑ•áÐ¹‘½Œ¹±¥•¹Ñ%¤ì(€€€€€€€€€ÑåÁ”¹…ÁÁ±å•±Ñ„¡l(€€€€€€€€€€€ìÉ•Ñ…¥¸èÑåÁ”¹±•¹Ñ ô°(€€€€€€€€€€€€¸¸¹¹•áÑåÑ•áÐ¹Ñ½•±Ñ„ ¤(€€€€€€€€€t¤ì(€€€€€€€€€¹•áÑåÑ•áÐ¹‘½Œ¹ÑÉ…¹Í…Ð ¡ÑÈ¤€ôøì(€€€€€€€€€€€¹•áÑåÑ•áÐ¹}¥Ñ•´¹‘•±•Ñ”¡ÑÈ¤ì(€€€€€€€€€ô¤ì(€€€€€€€ô(€€€€€€€½¹ÍÐ¹Ì€ôÉ•…Ñ•Q•áÑ9½‘•ÍÉ½µeQ•áÐ (€€€€€€€€€ÑåÁ”°(€€€€€€€€€Í¡•µ„È°(€€€€€€€€€µ•Ñ„°(€€€€€€€€€Í¹…ÁÍ¡½ÐÈ°(€€€€€€€€€ÁÉ•ÙM¹…ÁÍ¡½Ð°(€€€€€€€€€½µÁÕÑ•e¡…¹”(€€€€€€€€¤ì(€€€€€€€¥˜€¡¹Ì€„ôô¹Õ±°¤ì(€€€€€€€€€¹Ì¹™½É…  ¡Ñ•áÑ¡¥±¤€ôøì(€€€€€€€€€€€¥˜€¡Ñ•áÑ¡¥±€„ôô¹Õ±°¤ì(€€€€€€€€€€€€€¡¥±‘É•¸¹ÁÕÍ ¡Ñ•áÑ¡¥±¤ì(€€€€€€€€€€€ô(€€€€€€€€€ô¤ì(€€€€€€€ô(€€€€€ô(€€€ôì(€€€¥˜€¡Í¹…ÁÍ¡½ÐÈ€ôôôÙ½¥€ÀñðÁÉ•ÙM¹…ÁÍ¡½Ð€ôôôÙ½¥€À¤ì(€€€€€•°¹Ñ½ÉÉ…ä ¤¹™½É… ¡É•…Ñ•¡¥±‘É•¸¤ì(€€€ô•±Í”ì(€€€€€ÑåÁ•1¥ÍÑQ½ÉÉ…åM¹…ÁÍ¡½Ð¡•°°¹•ÜM¹…ÁÍ¡½Ð¡ÁÉ•ÙM¹…ÁÍ¡½Ð¹‘Ì°Í¹…ÁÍ¡½ÐÈ¹ÍØ¤¤¹™½É… ¡É•…Ñ•¡¥±‘É•¸¤ì(€€€ô(€€€ÑÉäì(€€€€€½¹ÍÐ…ÑÑÉÌ€ô•°¹•ÑÑÑÉ¥‰ÕÑ•Ì¡Í¹…ÁÍ¡½ÐÈ¤ì(€€€€€¥˜€¡Í¹…ÁÍ¡½ÐÈ€„ôôÙ½¥€À¤ì(€€€€€€€¥˜€ …¥ÍY¥Í¥‰±”È (€€€€€€€€€€¼¨¨ÑåÁ”íd¹%Ñ•µô€¨¼(€€€€€€€€€•°¹}¥Ñ•´°(€€€€€€€€€Í¹…ÁÍ¡½ÐÈ(€€€€€€€€¤¤ì(€€€€€€€€€…ÑÑÉÌ¹å¡…¹”€ô½µÁÕÑ•e¡…¹”€ü½µÁÕÑ•e¡…¹” (€€€€€€€€€€€€‰É•µ½Ù•ˆ°(€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹%Ñ•µô€¨¼(€€€€€€€€€€€•°¹}¥Ñ•´¹¥(€€€€€€€€€€¤€èìÑåÁ”è€‰É•µ½Ù•ˆôì(€€€€€€€ô•±Í”¥˜€ …¥ÍY¥Í¥‰±”È (€€€€€€€€€€¼¨¨ÑåÁ”íd¹%Ñ•µô€¨¼(€€€€€€€€€•°¹}¥Ñ•´°(€€€€€€€€€ÁÉ•ÙM¹…ÁÍ¡½Ð(€€€€€€€€¤¤ì(€€€€€€€€€…ÑÑÉÌ¹å¡…¹”€ô½µÁÕÑ•e¡…¹”€ü½µÁÕÑ•e¡…¹” (€€€€€€€€€€€€‰…‘‘•ˆ°(€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹%Ñ•µô€¨¼(€€€€€€€€€€€•°¹}¥Ñ•´¹¥(€€€€€€€€€€¤€èìÑåÁ”è€‰…‘‘•ˆôì(€€€€€€€ô(€€€€€ô(€€€€€½¹ÍÐ¹½‘”€ôÍ¡•µ„È¹¹½‘”¡•°¹¹½‘•9…µ”°…ÑÑÉÌ°¡¥±‘É•¸¤ì(€€€€€µ•Ñ„¹µ…ÁÁ¥¹œ¹Í•Ð¡•°°¹½‘”¤ì(€€€€€É•ÑÕÉ¸¹½‘”ì(€€€ô…Ñ €¡”¤ì(€€€€€•°¹‘½Œ¹ÑÉ…¹Í…Ð ¡ÑÉ…¹Í…Ñ¥½¸¤€ôøì(€€€€€€€•°¹}¥Ñ•´¹‘•±•Ñ”¡ÑÉ…¹Í…Ñ¥½¸¤ì(€€€€€ô°åMå¹A±Õ¥¹-•ä¤ì(€€€€€µ•Ñ„¹µ…ÁÁ¥¹œ¹‘•±•Ñ”¡•°¤ì(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€ô(€ôì(€Ù…ÈÉ•…Ñ•Q•áÑ9½‘•ÍÉ½µeQ•áÐ€ô€¡Ñ•áÐÈ°Í¡•µ„È°}µ•Ñ„°Í¹…ÁÍ¡½ÐÈ°ÁÉ•ÙM¹…ÁÍ¡½Ð°½µÁÕÑ•e¡…¹”¤€ôøì(€€€½¹ÍÐ¹½‘•Ì€ômtì(€€€½¹ÍÐ‘•±Ñ…Ì€ôÑ•áÐÈ¹Ñ½•±Ñ„¡Í¹…ÁÍ¡½ÐÈ°ÁÉ•ÙM¹…ÁÍ¡½Ð°½µÁÕÑ•e¡…¹”¤ì(€€€ÑÉäì(€€€€€™½È€¡±•Ð¤€ô€Àì¤€ð‘•±Ñ…Ì¹±•¹Ñ ì¤¬¬¤ì(€€€€€€€½¹ÍÐ‘•±Ñ„€ô‘•±Ñ…Ím¥tì(€€€€€€€¹½‘•Ì¹ÁÕÍ ¡Í¡•µ„È¹Ñ•áÐ¡‘•±Ñ„¹¥¹Í•ÉÐ°…ÑÑÉ¥‰ÕÑ•ÍQ½5…É­Ì¡‘•±Ñ„¹…ÑÑÉ¥‰ÕÑ•Ì°Í¡•µ„È¤¤¤ì(€€€€€ô(€€€ô…Ñ €¡”¤ì(€€€€€Ñ•áÐÈ¹‘½Œ¹ÑÉ…¹Í…Ð ¡ÑÉ…¹Í…Ñ¥½¸¤€ôøì(€€€€€€€Ñ•áÐÈ¹}¥Ñ•´¹‘•±•Ñ”¡ÑÉ…¹Í…Ñ¥½¸¤ì(€€€€€ô°åMå¹A±Õ¥¹-•ä¤ì(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€ô(€€€É•ÑÕÉ¸¹½‘•Ìì(€ôì(€Ù…ÈÉ•…Ñ•QåÁ•É½µQ•áÑ9½‘•Ì€ô€¡¹½‘•Ì°µ•Ñ„¤€ôøì(€€€½¹ÍÐÑåÁ”€ô¹•Üeaµ±Q•áÐ ¤ì(€€€½¹ÍÐ‘•±Ñ„€ô¹½‘•Ì¹µ…À ¡¹½‘”¤€ôø€¡ì(€€€€€€¼¼ÑÌµ¥¹½É”(€€€€€¥¹Í•ÉÐè¹½‘”¹Ñ•áÐ°(€€€€€…ÑÑÉ¥‰ÕÑ•Ìèµ…É­ÍQ½ÑÑÉ¥‰ÕÑ•Ì¡¹½‘”¹µ…É­Ì°µ•Ñ„¤(€€€ô¤¤ì(€€€ÑåÁ”¹…ÁÁ±å•±Ñ„¡‘•±Ñ„¤ì(€€€µ•Ñ„¹µ…ÁÁ¥¹œ¹Í•Ð¡ÑåÁ”°¹½‘•Ì¤ì(€€€É•ÑÕÉ¸ÑåÁ”ì(€ôì(€Ù…ÈÉ•…Ñ•QåÁ•É½µ±•µ•¹Ñ9½‘”€ô€¡¹½‘”°µ•Ñ„¤€ôøì(€€€½¹ÍÐÑåÁ”€ô¹•Üeaµ±±•µ•¹Ð¡¹½‘”¹ÑåÁ”¹¹…µ”¤ì(€€€™½È€¡½¹ÍÐ­•ä¥¸¹½‘”¹…ÑÑÉÌ¤ì(€€€€€½¹ÍÐÙ…°€ô¹½‘”¹…ÑÑÉÍm­•åtì(€€€€€¥˜€¡Ù…°€„ôô¹Õ±°€˜˜­•ä€„ôô€‰å¡…¹”ˆ¤ì(€€€€€€€ÑåÁ”¹Í•ÑÑÑÉ¥‰ÕÑ”¡­•ä°Ù…°¤ì(€€€€€ô(€€€ô(€€€ÑåÁ”¹¥¹Í•ÉÐ (€€€€€€À°(€€€€€¹½Éµ…±¥é•A9½‘•½¹Ñ•¹Ð¡¹½‘”¤¹µ…À (€€€€€€€€¡¸¤€ôøÉ•…Ñ•QåÁ•É½µQ•áÑ=É±•µ•¹Ñ9½‘”¡¸°µ•Ñ„¤(€€€€€€¤(€€€€¤ì(€€€µ•Ñ„¹µ…ÁÁ¥¹œ¹Í•Ð¡ÑåÁ”°¹½‘”¤ì(€€€É•ÑÕÉ¸ÑåÁ”ì(€ôì(€Ù…ÈÉ•…Ñ•QåÁ•É½µQ•áÑ=É±•µ•¹Ñ9½‘”€ô€¡¹½‘”°µ•Ñ„¤€ôø¹½‘”¥¹ÍÑ…¹•½˜ÉÉ…ä€üÉ•…Ñ•QåÁ•É½µQ•áÑ9½‘•Ì¡¹½‘”°µ•Ñ„¤€èÉ•…Ñ•QåÁ•É½µ±•µ•¹Ñ9½‘”¡¹½‘”°µ•Ñ„¤ì(€Ù…È¥Í=‰©•ÐÈ€ô€¡Ù…°¤€ôøÑåÁ•½˜Ù…°€ôôô€‰½‰©•Ðˆ€˜˜Ù…°€„ôô¹Õ±°ì(€Ù…È•ÅÕ…±ÑÑÉÌÈ€ô€¡Á…ÑÑÉÌ°å…ÑÑÉÌ¤€ôøì(€€€½¹ÍÐ­•åÌÌ€ô=‰©•Ð¹­•åÌ¡Á…ÑÑÉÌ¤¹™¥±Ñ•È ¡­•ä¤€ôøÁ…ÑÑÉÍm­•åt€„ôô¹Õ±°¤ì(€€€±•Ð•Ä€ô­•åÌÌ¹±•¹Ñ €ôôô€¡å…ÑÑÉÌ€ôô¹Õ±°€ü€À€è=‰©•Ð¹­•åÌ¡å…ÑÑÉÌ¤¹™¥±Ñ•È ¡­•ä¤€ôøå…ÑÑÉÍm­•åt€„ôô¹Õ±°¤¹±•¹Ñ ¤ì(€€€™½È€¡±•Ð¤€ô€Àì¤€ð­•åÌÌ¹±•¹Ñ €˜˜•Äì¤¬¬¤ì(€€€€€½¹ÍÐ­•ä€ô­•åÌÍm¥tì(€€€€€½¹ÍÐ°€ôÁ…ÑÑÉÍm­•åtì(€€€€€½¹ÍÐÈ€ôå…ÑÑÉÍm­•åtì(€€€€€•Ä€ô­•ä€ôôô€‰å¡…¹”ˆñð°€ôôôÈñð¥Í=‰©•ÐÈ¡°¤€˜˜¥Í=‰©•ÐÈ¡È¤€˜˜•ÅÕ…±ÑÑÉÌÈ¡°°È¤ì(€€€ô(€€€É•ÑÕÉ¸•Äì(€ôì(€Ù…È¹½Éµ…±¥é•A9½‘•½¹Ñ•¹Ð€ô€¡Á¹½‘”¤€ôøì(€€€½¹ÍÐŒ€ôÁ¹½‘”¹½¹Ñ•¹Ð¹½¹Ñ•¹Ðì(€€€½¹ÍÐÉ•Ì€ômtì(€€€™½È€¡±•Ð¤€ô€Àì¤€ðŒ¹±•¹Ñ ì¤¬¬¤ì(€€€€€½¹ÍÐ¸€ôm¥tì(€€€€€¥˜€¡¸¹¥ÍQ•áÐ¤ì(€€€€€€€½¹ÍÐÑ•áÑ9½‘•Ì€ômtì(€€€€€€€™½È€¡±•ÐÑ¹½‘”€ôm¥tì¤€ðŒ¹±•¹Ñ €˜˜Ñ¹½‘”¹¥ÍQ•áÐìÑ¹½‘”€ôl¬­¥t¤ì(€€€€€€€€€Ñ•áÑ9½‘•Ì¹ÁÕÍ ¡Ñ¹½‘”¤ì(€€€€€€€ô(€€€€€€€¤´´ì(€€€€€€€É•Ì¹ÁÕÍ ¡Ñ•áÑ9½‘•Ì¤ì(€€€€€ô•±Í”ì(€€€€€€€É•Ì¹ÁÕÍ ¡¸¤ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸É•Ìì(€ôì(€Ù…È•ÅÕ…±eQ•áÑAQ•áÐ€ô€¡åÑ•áÐ°ÁÑ•áÑÌ¤€ôøì(€€€½¹ÍÐ‘•±Ñ„€ôåÑ•áÐ¹Ñ½•±Ñ„ ¤ì(€€€É•ÑÕÉ¸‘•±Ñ„¹±•¹Ñ €ôôôÁÑ•áÑÌ¹±•¹Ñ €˜˜‘•±Ñ„¹•Ù•Éä (€€€€€€¼¨¨ÑåÁ”ì¡é…¹ä±¤é¹Õµ‰•È¤€ôø‰½½±•…¹ô€¨¼(€€€€€€¡°¤¤€ôø¹¥¹Í•ÉÐ€ôôô€¼¨¨ÑåÁ”í…¹åô€¨¼(€€€€€ÁÑ•áÑÍm¥t¹Ñ•áÐ€˜˜­•åÌ¡¹…ÑÑÉ¥‰ÕÑ•Ìñðíô¤¹±•¹Ñ €ôôôÁÑ•áÑÍm¥t¹µ…É­Ì¹±•¹Ñ €˜˜•Ù•ÉäÈ¡¹…ÑÑÉ¥‰ÕÑ•Ì°€¡…ÑÑÈ°å…ÑÑÉ¹…µ”¤€ôøì(€€€€€€€½¹ÍÐµ…É­¹…µ”€ôå…ÑÑÈÉµ…É­¹…µ”¡å…ÑÑÉ¹…µ”¤ì(€€€€€€€½¹ÍÐÁµ…É­Ì€ôÁÑ•áÑÍm¥t¹µ…É­Ìì(€€€€€€€É•ÑÕÉ¸•ÅÕ…±ÑÑÉÌÈ¡…ÑÑÈ°Áµ…É­Ì¹™¥¹ (€€€€€€€€€€¼¨¨Á…É…´í…¹åôµ…É¬€¨¼(€€€€€€€€€€¡µ…É¬¤€ôøµ…É¬¹ÑåÁ”¹¹…µ”€ôôôµ…É­¹…µ”(€€€€€€€€¤ü¹…ÑÑÉÌ¤ì(€€€€€ô¤(€€€€¤ì(€ôì(€Ù…È•ÅÕ…±eQåÁ•A9½‘”€ô€¡åÑåÁ”°Á¹½‘”¤€ôøì(€€€¥˜€¡åÑåÁ”¥¹ÍÑ…¹•½˜eaµ±±•µ•¹Ð€˜˜€„¡Á¹½‘”¥¹ÍÑ…¹•½˜ÉÉ…ä¤€˜˜µ…Ñ¡9½‘•9…µ”¡åÑåÁ”°Á¹½‘”¤¤ì(€€€€€½¹ÍÐ¹½Éµ…±¥é•‘½¹Ñ•¹Ð€ô¹½Éµ…±¥é•A9½‘•½¹Ñ•¹Ð¡Á¹½‘”¤ì(€€€€€É•ÑÕÉ¸åÑåÁ”¹}±•¹Ñ €ôôô¹½Éµ…±¥é•‘½¹Ñ•¹Ð¹±•¹Ñ €˜˜•ÅÕ…±ÑÑÉÌÈ¡åÑåÁ”¹•ÑÑÑÉ¥‰ÕÑ•Ì ¤°Á¹½‘”¹…ÑÑÉÌ¤€˜˜åÑåÁ”¹Ñ½ÉÉ…ä ¤¹•Ù•Éä (€€€€€€€€¡å¡¥±°¤¤€ôø•ÅÕ…±eQåÁ•A9½‘”¡å¡¥±°¹½Éµ…±¥é•‘½¹Ñ•¹Ñm¥t¤(€€€€€€¤ì(€€€ô(€€€É•ÑÕÉ¸åÑåÁ”¥¹ÍÑ…¹•½˜eaµ±Q•áÐ€˜˜Á¹½‘”¥¹ÍÑ…¹•½˜ÉÉ…ä€˜˜•ÅÕ…±eQ•áÑAQ•áÐ¡åÑåÁ”°Á¹½‘”¤ì(€ôì(€Ù…Èµ…ÁÁ•‘%‘•¹Ñ¥Ñä€ô€¡µ…ÁÁ•°Á½¹Ñ•¹Ð¤€ôøµ…ÁÁ•€ôôôÁ½¹Ñ•¹Ðñðµ…ÁÁ•¥¹ÍÑ…¹•½˜ÉÉ…ä€˜˜Á½¹Ñ•¹Ð¥¹ÍÑ…¹•½˜ÉÉ…ä€˜˜µ…ÁÁ•¹±•¹Ñ €ôôôÁ½¹Ñ•¹Ð¹±•¹Ñ €˜˜µ…ÁÁ•¹•Ù•Éä (€€€€¡„°¤¤€ôøÁ½¹Ñ•¹Ñm¥t€ôôô„(€€¤ì(€Ù…È½µÁÕÑ•¡¥±‘ÅÕ…±¥Ñå…Ñ½È€ô€¡åÑåÁ”°Á¹½‘”°µ•Ñ„¤€ôøì(€€€½¹ÍÐå¡¥±‘É•¸€ôåÑåÁ”¹Ñ½ÉÉ…ä ¤ì(€€€½¹ÍÐÁ¡¥±‘É•¸€ô¹½Éµ…±¥é•A9½‘•½¹Ñ•¹Ð¡Á¹½‘”¤ì(€€€½¹ÍÐÁ¡¥±‘¹Ð€ôÁ¡¥±‘É•¸¹±•¹Ñ ì(€€€½¹ÍÐå¡¥±‘¹Ð€ôå¡¥±‘É•¸¹±•¹Ñ ì(€€€½¹ÍÐµ¥¹¹Ð€ôµ¥¸¡å¡¥±‘¹Ð°Á¡¥±‘¹Ð¤ì(€€€±•Ð±•™Ð€ô€Àì(€€€±•ÐÉ¥¡Ð€ô€Àì(€€€±•Ð™½Õ¹‘5…ÁÁ•‘¡¥±€ô™…±Í”ì(€€€™½È€ ì±•™Ð€ðµ¥¹¹Ðì±•™Ð¬¬¤ì(€€€€€½¹ÍÐ±•™Ñd€ôå¡¥±‘É•¹m±•™Ñtì(€€€€€½¹ÍÐ±•™Ñ@€ôÁ¡¥±‘É•¹m±•™Ñtì(€€€€€¥˜€¡µ…ÁÁ•‘%‘•¹Ñ¥Ñä¡µ•Ñ„¹µ…ÁÁ¥¹œ¹•Ð¡±•™Ñd¤°±•™Ñ@¤¤ì(€€€€€€€™½Õ¹‘5…ÁÁ•‘¡¥±€ôÑÉÕ”ì(€€€€€ô•±Í”¥˜€ …•ÅÕ…±eQåÁ•A9½‘”¡±•™Ñd°±•™Ñ@¤¤ì(€€€€€€€‰É•…¬ì(€€€€€ô(€€€ô(€€€™½È€ ì±•™Ð€¬É¥¡Ð€ðµ¥¹¹ÐìÉ¥¡Ð¬¬¤ì(€€€€€½¹ÍÐÉ¥¡Ñd€ôå¡¥±‘É•¹må¡¥±‘¹Ð€´É¥¡Ð€´€Åtì(€€€€€½¹ÍÐÉ¥¡Ñ@€ôÁ¡¥±‘É•¹mÁ¡¥±‘¹Ð€´É¥¡Ð€´€Åtì(€€€€€¥˜€¡µ…ÁÁ•‘%‘•¹Ñ¥Ñä¡µ•Ñ„¹µ…ÁÁ¥¹œ¹•Ð¡É¥¡Ñd¤°É¥¡Ñ@¤¤ì(€€€€€€€™½Õ¹‘5…ÁÁ•‘¡¥±€ôÑÉÕ”ì(€€€€€ô•±Í”¥˜€ …•ÅÕ…±eQåÁ•A9½‘”¡É¥¡Ñd°É¥¡Ñ@¤¤ì(€€€€€€€‰É•…¬ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸ì(€€€€€•ÅÕ…±¥Ñå…Ñ½Èè±•™Ð€¬É¥¡Ð°(€€€€€™½Õ¹‘5…ÁÁ•‘¡¥±(€€€ôì(€ôì(€Ù…ÈåÑ•áÑQÉ…¹Ì€ô€¡åÑ•áÐ¤€ôøì(€€€±•ÐÍÑÈ€ô€ˆˆì(€€€±•Ð¸€ôåÑ•áÐ¹}ÍÑ…ÉÐì(€€€½¹ÍÐ¹ÑÑÉÌ€ôíôì(€€€Ý¡¥±”€¡¸€„ôô¹Õ±°¤ì(€€€€€¥˜€ …¸¹‘•±•Ñ•¤ì(€€€€€€€¥˜€¡¸¹½Õ¹Ñ…‰±”€˜˜¸¹½¹Ñ•¹Ð¥¹ÍÑ…¹•½˜½¹Ñ•¹ÑMÑÉ¥¹œ¤ì(€€€€€€€€€ÍÑÈ€¬ô¸¹½¹Ñ•¹Ð¹ÍÑÈì(€€€€€€€ô•±Í”¥˜€¡¸¹½¹Ñ•¹Ð¥¹ÍÑ…¹•½˜½¹Ñ•¹Ñ½Éµ…Ð¤ì(€€€€€€€€€¹ÑÑÉÍm¸¹½¹Ñ•¹Ð¹­•åt€ô¹Õ±°ì(€€€€€€€ô(€€€€€ô(€€€€€¸€ô¸¹É¥¡Ðì(€€€ô(€€€É•ÑÕÉ¸ì(€€€€€ÍÑÈ°(€€€€€¹ÑÑÉÌ(€€€ôì(€ôì(€Ù…ÈÕÁ‘…Ñ•eQ•áÐ€ô€¡åÑ•áÐ°ÁÑ•áÑÌ°µ•Ñ„¤€ôøì(€€€µ•Ñ„¹µ…ÁÁ¥¹œ¹Í•Ð¡åÑ•áÐ°ÁÑ•áÑÌ¤ì(€€€½¹ÍÐì¹ÑÑÉÌ°ÍÑÈô€ôåÑ•áÑQÉ…¹Ì¡åÑ•áÐ¤ì(€€€½¹ÍÐ½¹Ñ•¹Ð€ôÁÑ•áÑÌ¹µ…À ¡À¤€ôø€¡ì(€€€€€¥¹Í•ÉÐè€ (€€€€€€€€¼¨¨ÑåÁ”í…¹åô€¨¼(€€€€€€€À¹Ñ•áÐ(€€€€€€¤°(€€€€€…ÑÑÉ¥‰ÕÑ•Ìè=‰©•Ð¹…ÍÍ¥¸¡íô°¹ÑÑÉÌ°µ…É­ÍQ½ÑÑÉ¥‰ÕÑ•Ì¡À¹µ…É­Ì°µ•Ñ„¤¤(€€€ô¤¤ì(€€€½¹ÍÐì¥¹Í•ÉÐ°É•µ½Ù”°¥¹‘•àô€ôÍ¥µÁ±•¥™˜ (€€€€€ÍÑÈ°(€€€€€½¹Ñ•¹Ð¹µ…À ¡Œ¤€ôøŒ¹¥¹Í•ÉÐ¤¹©½¥¸ ˆˆ¤(€€€€¤ì(€€€åÑ•áÐ¹‘•±•Ñ”¡¥¹‘•à°É•µ½Ù”¤ì(€€€åÑ•áÐ¹¥¹Í•ÉÐ¡¥¹‘•à°¥¹Í•ÉÐ¤ì(€€€åÑ•áÐ¹…ÁÁ±å•±Ñ„ (€€€€€½¹Ñ•¹Ð¹µ…À ¡Œ¤€ôø€¡ìÉ•Ñ…¥¸èŒ¹¥¹Í•ÉÐ¹±•¹Ñ °…ÑÑÉ¥‰ÕÑ•ÌèŒ¹…ÑÑÉ¥‰ÕÑ•Ìô¤¤(€€€€¤ì(€ôì(€Ù…È¡…Í¡•‘5…É­9…µ•I••à€ô€¼ ¸¨¤ ´µm„µéµhÀ´ä¬¼õuìáô¤¼ì(€Ù…Èå…ÑÑÈÉµ…É­¹…µ”€ô€¡…ÑÑÉ9…µ”¤€ôø¡…Í¡•‘5…É­9…µ•I••à¹•á•Œ¡…ÑÑÉ9…µ”¤ü¹lÅt€üü…ÑÑÉ9…µ”ì(€Ù…È…ÑÑÉ¥‰ÕÑ•ÍQ½5…É­Ì€ô€¡…ÑÑÉÌ°Í¡•µ„È¤€ôøì(€€€½¹ÍÐµ…É­Ì€ômtì(€€€™½È€¡½¹ÍÐµ…É­9…µ”¥¸…ÑÑÉÌ¤ì(€€€€€µ…É­Ì¹ÁÕÍ ¡Í¡•µ„È¹µ…É¬¡å…ÑÑÈÉµ…É­¹…µ”¡µ…É­9…µ”¤°…ÑÑÉÍmµ…É­9…µ•t¤¤ì(€€€ô(€€€É•ÑÕÉ¸µ…É­Ìì(€ôì(€Ù…Èµ…É­ÍQ½ÑÑÉ¥‰ÕÑ•Ì€ô€¡µ…É­Ì°µ•Ñ„¤€ôøì(€€€½¹ÍÐÁ…ÑÑÉÌ€ôíôì(€€€µ…É­Ì¹™½É…  ¡µ…É¬¤€ôøì(€€€€€¥˜€¡µ…É¬¹ÑåÁ”¹¹…µ”€„ôô€‰å¡…¹”ˆ¤ì(€€€€€€€½¹ÍÐ¥Í=Ù•É±…ÁÁ¥¹œ€ôÍ•Ñ%™U¹‘•™¥¹•¡µ•Ñ„¹¥Í=5…É¬°µ…É¬¹ÑåÁ”°€ ¤€ôø€…µ…É¬¹ÑåÁ”¹•á±Õ‘•Ì¡µ…É¬¹ÑåÁ”¤¤ì(€€€€€€€Á…ÑÑÉÍm¥Í=Ù•É±…ÁÁ¥¹œ€ü€‘íµ…É¬¹ÑåÁ”¹¹…µ•ô´´‘í¡…Í¡=™)M=8¡µ…É¬¹Ñ½)M=8 ¤¥õ€€èµ…É¬¹ÑåÁ”¹¹…µ•t€ôµ…É¬¹…ÑÑÉÌì(€€€€€ô(€€€ô¤ì(€€€É•ÑÕÉ¸Á…ÑÑÉÌì(€ôì(€Ù…ÈÕÁ‘…Ñ•eÉ…µ•¹Ð€ô€¡ä°å½µÉ…µ•¹Ð°Á9½‘”°µ•Ñ„¤€ôøì(€€€¥˜€¡å½µÉ…µ•¹Ð¥¹ÍÑ…¹•½˜eaµ±±•µ•¹Ð€˜˜å½µÉ…µ•¹Ð¹¹½‘•9…µ”€„ôôÁ9½‘”¹ÑåÁ”¹¹…µ”¤ì(€€€€€Ñ¡É½Ü¹•ÜÉÉ½È ‰¹½‘”¹…µ”µ¥Íµ…Ñ „ˆ¤ì(€€€ô(€€€µ•Ñ„¹µ…ÁÁ¥¹œ¹Í•Ð¡å½µÉ…µ•¹Ð°Á9½‘”¤ì(€€€¥˜€¡å½µÉ…µ•¹Ð¥¹ÍÑ…¹•½˜eaµ±±•µ•¹Ð¤ì(€€€€€½¹ÍÐå½µÑÑÉÌ€ôå½µÉ…µ•¹Ð¹•ÑÑÑÉ¥‰ÕÑ•Ì ¤ì(€€€€€½¹ÍÐÁÑÑÉÌ€ôÁ9½‘”¹…ÑÑÉÌì(€€€€€™½È€¡½¹ÍÐ­•ä¥¸ÁÑÑÉÌ¤ì(€€€€€€€¥˜€¡ÁÑÑÉÍm­•åt€„ôô¹Õ±°¤ì(€€€€€€€€€¥˜€¡å½µÑÑÉÍm­•åt€„ôôÁÑÑÉÍm­•åt€˜˜­•ä€„ôô€‰å¡…¹”ˆ¤ì(€€€€€€€€€€€å½µÉ…µ•¹Ð¹Í•ÑÑÑÉ¥‰ÕÑ”¡­•ä°ÁÑÑÉÍm­•åt¤ì(€€€€€€€€€ô(€€€€€€€ô•±Í”ì(€€€€€€€€€å½µÉ…µ•¹Ð¹É•µ½Ù•ÑÑÉ¥‰ÕÑ”¡­•ä¤ì(€€€€€€€ô(€€€€€ô(€€€€€™½È€¡½¹ÍÐ­•ä¥¸å½µÑÑÉÌ¤ì(€€€€€€€¥˜€¡ÁÑÑÉÍm­•åt€ôôôÙ½¥€À¤ì(€€€€€€€€€å½µÉ…µ•¹Ð¹É•µ½Ù•ÑÑÉ¥‰ÕÑ”¡­•ä¤ì(€€€€€€€ô(€€€€€ô(€€€ô(€€€½¹ÍÐÁ¡¥±‘É•¸€ô¹½Éµ…±¥é•A9½‘•½¹Ñ•¹Ð¡Á9½‘”¤ì(€€€½¹ÍÐÁ¡¥±‘¹Ð€ôÁ¡¥±‘É•¸¹±•¹Ñ ì(€€€½¹ÍÐå¡¥±‘É•¸€ôå½µÉ…µ•¹Ð¹Ñ½ÉÉ…ä ¤ì(€€€½¹ÍÐå¡¥±‘¹Ð€ôå¡¥±‘É•¸¹±•¹Ñ ì(€€€½¹ÍÐµ¥¹¹Ð€ôµ¥¸¡Á¡¥±‘¹Ð°å¡¥±‘¹Ð¤ì(€€€±•Ð±•™Ð€ô€Àì(€€€±•ÐÉ¥¡Ð€ô€Àì(€€€™½È€ ì±•™Ð€ðµ¥¹¹Ðì±•™Ð¬¬¤ì(€€€€€½¹ÍÐ±•™Ñd€ôå¡¥±‘É•¹m±•™Ñtì(€€€€€½¹ÍÐ±•™Ñ@€ôÁ¡¥±‘É•¹m±•™Ñtì(€€€€€¥˜€ …µ…ÁÁ•‘%‘•¹Ñ¥Ñä¡µ•Ñ„¹µ…ÁÁ¥¹œ¹•Ð¡±•™Ñd¤°±•™Ñ@¤¤ì(€€€€€€€¥˜€¡•ÅÕ…±eQåÁ•A9½‘”¡±•™Ñd°±•™Ñ@¤¤ì(€€€€€€€€€µ•Ñ„¹µ…ÁÁ¥¹œ¹Í•Ð¡±•™Ñd°±•™Ñ@¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€ô(€€€ô(€€€™½È€ ìÉ¥¡Ð€¬±•™Ð€ðµ¥¹¹ÐìÉ¥¡Ð¬¬¤ì(€€€€€½¹ÍÐÉ¥¡Ñd€ôå¡¥±‘É•¹må¡¥±‘¹Ð€´É¥¡Ð€´€Åtì(€€€€€½¹ÍÐÉ¥¡Ñ@€ôÁ¡¥±‘É•¹mÁ¡¥±‘¹Ð€´É¥¡Ð€´€Åtì(€€€€€¥˜€ …µ…ÁÁ•‘%‘•¹Ñ¥Ñä¡µ•Ñ„¹µ…ÁÁ¥¹œ¹•Ð¡É¥¡Ñd¤°É¥¡Ñ@¤¤ì(€€€€€€€¥˜€¡•ÅÕ…±eQåÁ•A9½‘”¡É¥¡Ñd°É¥¡Ñ@¤¤ì(€€€€€€€€€µ•Ñ„¹µ…ÁÁ¥¹œ¹Í•Ð¡É¥¡Ñd°É¥¡Ñ@¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€‰É•…¬ì(€€€€€€€ô(€€€€€ô(€€€ô(€€€ä¹ÑÉ…¹Í…Ð  ¤€ôøì(€€€€€Ý¡¥±”€¡å¡¥±‘¹Ð€´±•™Ð€´É¥¡Ð€ø€À€˜˜Á¡¥±‘¹Ð€´±•™Ð€´É¥¡Ð€ø€À¤ì(€€€€€€€½¹ÍÐ±•™Ñd€ôå¡¥±‘É•¹m±•™Ñtì(€€€€€€€½¹ÍÐ±•™Ñ@€ôÁ¡¥±‘É•¹m±•™Ñtì(€€€€€€€½¹ÍÐÉ¥¡Ñd€ôå¡¥±‘É•¹må¡¥±‘¹Ð€´É¥¡Ð€´€Åtì(€€€€€€€½¹ÍÐÉ¥¡Ñ@€ôÁ¡¥±‘É•¹mÁ¡¥±‘¹Ð€´É¥¡Ð€´€Åtì(€€€€€€€¥˜€¡±•™Ñd¥¹ÍÑ…¹•½˜eaµ±Q•áÐ€˜˜±•™Ñ@¥¹ÍÑ…¹•½˜ÉÉ…ä¤ì(€€€€€€€€€¥˜€ …•ÅÕ…±eQ•áÑAQ•áÐ¡±•™Ñd°±•™Ñ@¤¤ì(€€€€€€€€€€€ÕÁ‘…Ñ•eQ•áÐ¡±•™Ñd°±•™Ñ@°µ•Ñ„¤ì(€€€€€€€€€ô(€€€€€€€€€±•™Ð€¬ô€Äì(€€€€€€€ô•±Í”ì(€€€€€€€€€±•ÐÕÁ‘…Ñ•1•™Ð€ô±•™Ñd¥¹ÍÑ…¹•½˜eaµ±±•µ•¹Ð€˜˜µ…Ñ¡9½‘•9…µ”¡±•™Ñd°±•™Ñ@¤ì(€€€€€€€€€±•ÐÕÁ‘…Ñ•I¥¡Ð€ôÉ¥¡Ñd¥¹ÍÑ…¹•½˜eaµ±±•µ•¹Ð€˜˜µ…Ñ¡9½‘•9…µ”¡É¥¡Ñd°É¥¡Ñ@¤ì(€€€€€€€€€¥˜€¡ÕÁ‘…Ñ•1•™Ð€˜˜ÕÁ‘…Ñ•I¥¡Ð¤ì(€€€€€€€€€€€½¹ÍÐ•ÅÕ…±¥Ñå1•™Ð€ô½µÁÕÑ•¡¥±‘ÅÕ…±¥Ñå…Ñ½È (€€€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹aµ±±•µ•¹Ñô€¨¼(€€€€€€€€€€€€€±•™Ñd°(€€€€€€€€€€€€€€¼¨¨ÑåÁ”íA5½‘•°¹9½‘•ô€¨¼(€€€€€€€€€€€€€±•™Ñ@°(€€€€€€€€€€€€€µ•Ñ„(€€€€€€€€€€€€¤ì(€€€€€€€€€€€½¹ÍÐ•ÅÕ…±¥ÑåI¥¡Ð€ô½µÁÕÑ•¡¥±‘ÅÕ…±¥Ñå…Ñ½È (€€€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹aµ±±•µ•¹Ñô€¨¼(€€€€€€€€€€€€€É¥¡Ñd°(€€€€€€€€€€€€€€¼¨¨ÑåÁ”íA5½‘•°¹9½‘•ô€¨¼(€€€€€€€€€€€€€É¥¡Ñ@°(€€€€€€€€€€€€€µ•Ñ„(€€€€€€€€€€€€¤ì(€€€€€€€€€€€¥˜€¡•ÅÕ…±¥Ñå1•™Ð¹™½Õ¹‘5…ÁÁ•‘¡¥±€˜˜€…•ÅÕ…±¥ÑåI¥¡Ð¹™½Õ¹‘5…ÁÁ•‘¡¥±¤ì(€€€€€€€€€€€€€ÕÁ‘…Ñ•I¥¡Ð€ô™…±Í”ì(€€€€€€€€€€€ô•±Í”¥˜€ …•ÅÕ…±¥Ñå1•™Ð¹™½Õ¹‘5…ÁÁ•‘¡¥±€˜˜•ÅÕ…±¥ÑåI¥¡Ð¹™½Õ¹‘5…ÁÁ•‘¡¥±¤ì(€€€€€€€€€€€€€ÕÁ‘…Ñ•1•™Ð€ô™…±Í”ì(€€€€€€€€€€€ô•±Í”¥˜€¡•ÅÕ…±¥Ñå1•™Ð¹•ÅÕ…±¥Ñå…Ñ½È€ð•ÅÕ…±¥ÑåI¥¡Ð¹•ÅÕ…±¥Ñå…Ñ½È¤ì(€€€€€€€€€€€€€ÕÁ‘…Ñ•1•™Ð€ô™…±Í”ì(€€€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€€€ÕÁ‘…Ñ•I¥¡Ð€ô™…±Í”ì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€€€¥˜€¡ÕÁ‘…Ñ•1•™Ð¤ì(€€€€€€€€€€€ÕÁ‘…Ñ•eÉ…µ•¹Ð (€€€€€€€€€€€€€ä°(€€€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹aµ±É…µ•¹Ñô€¨¼(€€€€€€€€€€€€€±•™Ñd°(€€€€€€€€€€€€€€¼¨¨ÑåÁ”íA5½‘•°¹9½‘•ô€¨¼(€€€€€€€€€€€€€±•™Ñ@°(€€€€€€€€€€€€€µ•Ñ„(€€€€€€€€€€€€¤ì(€€€€€€€€€€€±•™Ð€¬ô€Äì(€€€€€€€€€ô•±Í”¥˜€¡ÕÁ‘…Ñ•I¥¡Ð¤ì(€€€€€€€€€€€ÕÁ‘…Ñ•eÉ…µ•¹Ð (€€€€€€€€€€€€€ä°(€€€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹aµ±É…µ•¹Ñô€¨¼(€€€€€€€€€€€€€É¥¡Ñd°(€€€€€€€€€€€€€€¼¨¨ÑåÁ”íA5½‘•°¹9½‘•ô€¨¼(€€€€€€€€€€€€€É¥¡Ñ@°(€€€€€€€€€€€€€µ•Ñ„(€€€€€€€€€€€€¤ì(€€€€€€€€€€€É¥¡Ð€¬ô€Äì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€µ•Ñ„¹µ…ÁÁ¥¹œ¹‘•±•Ñ”¡å½µÉ…µ•¹Ð¹•Ð¡±•™Ð¤¤ì(€€€€€€€€€€€å½µÉ…µ•¹Ð¹‘•±•Ñ”¡±•™Ð°€Ä¤ì(€€€€€€€€€€€å½µÉ…µ•¹Ð¹¥¹Í•ÉÐ¡±•™Ð°l(€€€€€€€€€€€€€É•…Ñ•QåÁ•É½µQ•áÑ=É±•µ•¹Ñ9½‘”¡±•™Ñ@°µ•Ñ„¤(€€€€€€€€€€€t¤ì(€€€€€€€€€€€±•™Ð€¬ô€Äì(€€€€€€€€€ô(€€€€€€€ô(€€€€€ô(€€€€€½¹ÍÐå•±1•¸€ôå¡¥±‘¹Ð€´±•™Ð€´É¥¡Ðì(€€€€€¥˜€¡å¡¥±‘¹Ð€ôôô€Ä€˜˜Á¡¥±‘¹Ð€ôôô€À€˜˜å¡¥±‘É•¹lÁt¥¹ÍÑ…¹•½˜eaµ±Q•áÐ¤ì(€€€€€€€µ•Ñ„¹µ…ÁÁ¥¹œ¹‘•±•Ñ”¡å¡¥±‘É•¹lÁt¤ì(€€€€€€€å¡¥±‘É•¹lÁt¹‘•±•Ñ” À°å¡¥±‘É•¹lÁt¹±•¹Ñ ¤ì(€€€€€ô•±Í”¥˜€¡å•±1•¸€ø€À¤ì(€€€€€€€å½µÉ…µ•¹Ð¹Í±¥”¡±•™Ð°±•™Ð€¬å•±1•¸¤¹™½É…  ¡ÑåÁ”¤€ôøµ•Ñ„¹µ…ÁÁ¥¹œ¹‘•±•Ñ”¡ÑåÁ”¤¤ì(€€€€€€€å½µÉ…µ•¹Ð¹‘•±•Ñ”¡±•™Ð°å•±1•¸¤ì(€€€€€ô(€€€€€¥˜€¡±•™Ð€¬É¥¡Ð€ðÁ¡¥±‘¹Ð¤ì(€€€€€€€½¹ÍÐ¥¹Ì€ômtì(€€€€€€€™½È€¡±•Ð¤€ô±•™Ðì¤€ðÁ¡¥±‘¹Ð€´É¥¡Ðì¤¬¬¤ì(€€€€€€€€€¥¹Ì¹ÁÕÍ ¡É•…Ñ•QåÁ•É½µQ•áÑ=É±•µ•¹Ñ9½‘”¡Á¡¥±‘É•¹m¥t°µ•Ñ„¤¤ì(€€€€€€€ô(€€€€€€€å½µÉ…µ•¹Ð¹¥¹Í•ÉÐ¡±•™Ð°¥¹Ì¤ì(€€€€€ô(€€€ô°åMå¹A±Õ¥¹-•ä¤ì(€ôì(€Ù…Èµ…Ñ¡9½‘•9…µ”€ô€¡å±•µ•¹Ð°Á9½‘”¤€ôø€„¡Á9½‘”¥¹ÍÑ…¹•½˜ÉÉ…ä¤€˜˜å±•µ•¹Ð¹¹½‘•9…µ”€ôôôÁ9½‘”¹ÑåÁ”¹¹…µ”ì((€€¼¼¹½‘•}µ½‘Õ±•Ì½äµÁÉ½Í•µ¥ÉÉ½È½ÍÉŒ½±¥ˆ¹©Ì(€Ù…ÈÙ¥•ÝÍQ½UÁ‘…Ñ”€ô¹Õ±°ì(€Ù…ÈÕÁ‘…Ñ•5•Ñ…Ì€ô€ ¤€ôøì(€€€½¹ÍÐÕÁÌ€ô€ (€€€€€€¼¨¨ÑåÁ”í5…Àñ‘¥Ñ½ÉY¥•Ü°5…Àñ…¹ä°…¹äøùô€¨¼(€€€€€Ù¥•ÝÍQ½UÁ‘…Ñ”(€€€€¤ì(€€€Ù¥•ÝÍQ½UÁ‘…Ñ”€ô¹Õ±°ì(€€€ÕÁÌ¹™½É…  ¡µ•Ñ…Ì°Ù¥•Ü¤€ôøì(€€€€€½¹ÍÐÑÈ€ôÙ¥•Ü¹ÍÑ…Ñ”¹ÑÈì(€€€€€½¹ÍÐÍå¹MÑ…Ñ”€ôåMå¹A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¤ì(€€€€€¥˜€¡Íå¹MÑ…Ñ”€˜˜Íå¹MÑ…Ñ”¹‰¥¹‘¥¹œ€˜˜€…Íå¹MÑ…Ñ”¹‰¥¹‘¥¹œ¹¥Í•ÍÑÉ½å•¤ì(€€€€€€€µ•Ñ…Ì¹™½É…  ¡Ù…°°­•ä¤€ôøì(€€€€€€€€€ÑÈ¹Í•Ñ5•Ñ„¡­•ä°Ù…°¤ì(€€€€€€€ô¤ì(€€€€€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡ÑÈ¤ì(€€€€€ô(€€€ô¤ì(€ôì(€Ù…ÈÍ•Ñ5•Ñ„€ô€¡Ù¥•Ü°­•ä°Ù…±Õ”¤€ôøì(€€€¥˜€ …Ù¥•ÝÍQ½UÁ‘…Ñ”¤ì(€€€€€Ù¥•ÝÍQ½UÁ‘…Ñ”€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤ì(€€€€€Ñ¥µ•½ÕÐ À°ÕÁ‘…Ñ•5•Ñ…Ì¤ì(€€€ô(€€€Í•Ñ%™U¹‘•™¥¹•¡Ù¥•ÝÍQ½UÁ‘…Ñ”°Ù¥•Ü°É•…Ñ”¤¹Í•Ð¡­•ä°Ù…±Õ”¤ì(€ôì(€Ù…È…‰Í½±ÕÑ•A½Í¥Ñ¥½¹Q½I•±…Ñ¥Ù•A½Í¥Ñ¥½¸€ô€¡Á½Ì°ÑåÁ”°µ…ÁÁ¥¹œ¤€ôøì(€€€¥˜€¡Á½Ì€ôôô€À¤ì(€€€€€É•ÑÕÉ¸É•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹É½µQåÁ•%¹‘•à¡ÑåÁ”°€À°ÑåÁ”¹±•¹Ñ €ôôô€À€ü€´Ä€è€À¤ì(€€€ô(€€€±•Ð¸€ôÑåÁ”¹}™¥ÉÍÐ€ôôô¹Õ±°€ü¹Õ±°€è€ (€€€€€€¼¨¨ÑåÁ”íd¹½¹Ñ•¹ÑQåÁ•ô€¨¼(€€€€€ÑåÁ”¹}™¥ÉÍÐ¹½¹Ñ•¹Ð¹ÑåÁ”(€€€€¤ì(€€€Ý¡¥±”€¡¸€„ôô¹Õ±°€˜˜ÑåÁ”€„ôô¸¤ì(€€€€€¥˜€¡¸¥¹ÍÑ…¹•½˜eaµ±Q•áÐ¤ì(€€€€€€€¥˜€¡¸¹}±•¹Ñ €øôÁ½Ì¤ì(€€€€€€€€€É•ÑÕÉ¸É•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹É½µQåÁ•%¹‘•à¡¸°Á½Ì°ÑåÁ”¹±•¹Ñ €ôôô€À€ü€´Ä€è€À¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€Á½Ì€´ô¸¹}±•¹Ñ ì(€€€€€€€ô(€€€€€€€¥˜€¡¸¹}¥Ñ•´€„ôô¹Õ±°€˜˜¸¹}¥Ñ•´¹¹•áÐ€„ôô¹Õ±°¤ì(€€€€€€€€€¸€ô€¼¨¨ÑåÁ”íd¹½¹Ñ•¹ÑQåÁ•ô€¨¼(€€€€€€€€€¸¹}¥Ñ•´¹¹•áÐ¹½¹Ñ•¹Ð¹ÑåÁ”ì(€€€€€€€ô•±Í”ì(€€€€€€€€€‘¼ì(€€€€€€€€€€€¸€ô¸¹}¥Ñ•´€ôôô¹Õ±°€ü¹Õ±°€è¸¹}¥Ñ•´¹Á…É•¹Ðì(€€€€€€€€€€€Á½Ì´´ì(€€€€€€€€€ôÝ¡¥±”€¡¸€„ôôÑåÁ”€˜˜¸€„ôô¹Õ±°€˜˜¸¹}¥Ñ•´€„ôô¹Õ±°€˜˜¸¹}¥Ñ•´¹¹•áÐ€ôôô¹Õ±°¤ì(€€€€€€€€€¥˜€¡¸€„ôô¹Õ±°€˜˜¸€„ôôÑåÁ”¤ì(€€€€€€€€€€€¸€ô¸¹}¥Ñ•´€ôôô¹Õ±°€ü¹Õ±°€è€ (€€€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹½¹Ñ•¹ÑQåÁ•ô€¨¼(€€€€€€€€€€€€€€¼¨¨ÑåÁ”d¹%Ñ•´€¨¼(€€€€€€€€€€€€€¸¹}¥Ñ•´¹¹•áÐ¹½¹Ñ•¹Ð¹ÑåÁ”(€€€€€€€€€€€€¤ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€ô•±Í”ì(€€€€€€€½¹ÍÐÁ9½‘•M¥é”€ô€ (€€€€€€€€€€¼¨¨ÑåÁ”í…¹åô€¨¼(€€€€€€€€€€¡µ…ÁÁ¥¹œ¹•Ð¡¸¤ñðì¹½‘•M¥é”è€Àô¤¹¹½‘•M¥é”(€€€€€€€€¤ì(€€€€€€€¥˜€¡¸¹}™¥ÉÍÐ€„ôô¹Õ±°€˜˜Á½Ì€ðÁ9½‘•M¥é”¤ì(€€€€€€€€€¸€ô€¼¨¨ÑåÁ”íd¹½¹Ñ•¹ÑQåÁ•ô€¨¼(€€€€€€€€€¸¹}™¥ÉÍÐ¹½¹Ñ•¹Ð¹ÑåÁ”ì(€€€€€€€€€Á½Ì´´ì(€€€€€€€ô•±Í”ì(€€€€€€€€€¥˜€¡Á½Ì€ôôô€Ä€˜˜¸¹}±•¹Ñ €ôôô€À€˜˜Á9½‘•M¥é”€ø€Ä¤ì(€€€€€€€€€€€É•ÑÕÉ¸¹•ÜI•±…Ñ¥Ù•A½Í¥Ñ¥½¸¡¸¹}¥Ñ•´€ôôô¹Õ±°€ü¹Õ±°€è¸¹}¥Ñ•´¹¥°¸¹}¥Ñ•´€ôôô¹Õ±°€ü™¥¹‘I½½ÑQåÁ•-•ä¡¸¤€è¹Õ±°°¹Õ±°¤ì(€€€€€€€€€ô(€€€€€€€€€Á½Ì€´ôÁ9½‘•M¥é”ì(€€€€€€€€€¥˜€¡¸¹}¥Ñ•´€„ôô¹Õ±°€˜˜¸¹}¥Ñ•´¹¹•áÐ€„ôô¹Õ±°¤ì(€€€€€€€€€€€¸€ô€¼¨¨ÑåÁ”íd¹½¹Ñ•¹ÑQåÁ•ô€¨¼(€€€€€€€€€€€¸¹}¥Ñ•´¹¹•áÐ¹½¹Ñ•¹Ð¹ÑåÁ”ì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€¥˜€¡Á½Ì€ôôô€À¤ì(€€€€€€€€€€€€€¸€ô¸¹}¥Ñ•´€ôôô¹Õ±°€ü¸€è¸¹}¥Ñ•´¹Á…É•¹Ðì(€€€€€€€€€€€€€É•ÑÕÉ¸¹•ÜI•±…Ñ¥Ù•A½Í¥Ñ¥½¸¡¸¹}¥Ñ•´€ôôô¹Õ±°€ü¹Õ±°€è¸¹}¥Ñ•´¹¥°¸¹}¥Ñ•´€ôôô¹Õ±°€ü™¥¹‘I½½ÑQåÁ•-•ä¡¸¤€è¹Õ±°°¹Õ±°¤ì(€€€€€€€€€€€ô(€€€€€€€€€€€‘¼ì(€€€€€€€€€€€€€¸€ô€¼¨¨ÑåÁ”íd¹%Ñ•µô€¨¼(€€€€€€€€€€€€€¸¹}¥Ñ•´¹Á…É•¹Ðì(€€€€€€€€€€€€€Á½Ì´´ì(€€€€€€€€€€€ôÝ¡¥±”€¡¸€„ôôÑåÁ”€˜˜€¼¨¨ÑåÁ”íd¹%Ñ•µô€¨¼(€€€€€€€€€€€¸¹}¥Ñ•´¹¹•áÐ€ôôô¹Õ±°¤ì(€€€€€€€€€€€¥˜€¡¸€„ôôÑåÁ”¤ì(€€€€€€€€€€€€€¸€ô€¼¨¨ÑåÁ”íd¹½¹Ñ•¹ÑQåÁ•ô€¨¼(€€€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹%Ñ•µô€¨¼(€€€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹%Ñ•µô€¨¼(€€€€€€€€€€€€€¸¹}¥Ñ•´¹¹•áÐ¹½¹Ñ•¹Ð¹ÑåÁ”ì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€ô(€€€€€ô(€€€€€¥˜€¡¸€ôôô¹Õ±°¤ì(€€€€€€€Ñ¡É½ÜÕ¹•áÁ•Ñ•‘…Í” ¤ì(€€€€€ô(€€€€€¥˜€¡Á½Ì€ôôô€À€˜˜¸¹½¹ÍÑÉÕÑ½È€„ôôeaµ±Q•áÐ€˜˜¸€„ôôÑåÁ”¤ì(€€€€€€€É•ÑÕÉ¸É•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¸È¡¸¹}¥Ñ•´¹Á…É•¹Ð°¸¹}¥Ñ•´¤ì(€€€€€ô(€€€ô(€€€É•ÑÕÉ¸É•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹É½µQåÁ•%¹‘•à¡ÑåÁ”°ÑåÁ”¹}±•¹Ñ °ÑåÁ”¹±•¹Ñ €ôôô€À€ü€´Ä€è€À¤ì(€ôì(€Ù…ÈÉ•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¸È€ô€¡ÑåÁ”°¥Ñ•´¤€ôøì(€€€±•ÐÑåÁ•¥€ô¹Õ±°ì(€€€±•ÐÑ¹…µ”€ô¹Õ±°ì(€€€¥˜€¡ÑåÁ”¹}¥Ñ•´€ôôô¹Õ±°¤ì(€€€€€Ñ¹…µ”€ô™¥¹‘I½½ÑQåÁ•-•ä¡ÑåÁ”¤ì(€€€ô•±Í”ì(€€€€€ÑåÁ•¥€ôÉ•…Ñ•%¡ÑåÁ”¹}¥Ñ•´¹¥¹±¥•¹Ð°ÑåÁ”¹}¥Ñ•´¹¥¹±½¬¤ì(€€€ô(€€€É•ÑÕÉ¸¹•ÜI•±…Ñ¥Ù•A½Í¥Ñ¥½¸¡ÑåÁ•¥°Ñ¹…µ”°¥Ñ•´¹¥¤ì(€ôì(€Ù…ÈÉ•±…Ñ¥Ù•A½Í¥Ñ¥½¹Q½‰Í½±ÕÑ•A½Í¥Ñ¥½¸€ô€¡ä°‘½Õµ•¹ÑQåÁ”°É•±A½Ì°µ…ÁÁ¥¹œ¤€ôøì(€€€½¹ÍÐ‘•½‘•‘A½Ì€ôÉ•…Ñ•‰Í½±ÕÑ•A½Í¥Ñ¥½¹É½µI•±…Ñ¥Ù•A½Í¥Ñ¥½¸¡É•±A½Ì°ä¤ì(€€€¥˜€¡‘•½‘•‘A½Ì€ôôô¹Õ±°ñð‘•½‘•‘A½Ì¹ÑåÁ”€„ôô‘½Õµ•¹ÑQåÁ”€˜˜€…¥ÍA…É•¹Ñ=˜¡‘½Õµ•¹ÑQåÁ”°‘•½‘•‘A½Ì¹ÑåÁ”¹}¥Ñ•´¤¤ì(€€€€€É•ÑÕÉ¸¹Õ±°ì(€€€ô(€€€±•ÐÑåÁ”€ô‘•½‘•‘A½Ì¹ÑåÁ”ì(€€€±•ÐÁ½Ì€ô€Àì(€€€¥˜€¡ÑåÁ”¹½¹ÍÑÉÕÑ½È€ôôôeaµ±Q•áÐ¤ì(€€€€€Á½Ì€ô‘•½‘•‘A½Ì¹¥¹‘•àì(€€€ô•±Í”¥˜€¡ÑåÁ”¹}¥Ñ•´€ôôô¹Õ±°ñð€…ÑåÁ”¹}¥Ñ•´¹‘•±•Ñ•¤ì(€€€€€±•Ð¸€ôÑåÁ”¹}™¥ÉÍÐì(€€€€€±•Ð¤€ô€Àì(€€€€€Ý¡¥±”€¡¤€ðÑåÁ”¹}±•¹Ñ €˜˜¤€ð‘•½‘•‘A½Ì¹¥¹‘•à€˜˜¸€„ôô¹Õ±°¤ì(€€€€€€€¥˜€ …¸¹‘•±•Ñ•¤ì(€€€€€€€€€½¹ÍÐÐ€ô€ (€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹½¹Ñ•¹ÑQåÁ•ô€¨¼(€€€€€€€€€€€¸¹½¹Ñ•¹Ð¹ÑåÁ”(€€€€€€€€€€¤ì(€€€€€€€€€¤¬¬ì(€€€€€€€€€¥˜€¡Ð¥¹ÍÑ…¹•½˜eaµ±Q•áÐ¤ì(€€€€€€€€€€€Á½Ì€¬ôÐ¹}±•¹Ñ ì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€Á½Ì€¬ô€¼¨¨ÑåÁ”í…¹åô€¨¼(€€€€€€€€€€€µ…ÁÁ¥¹œ¹•Ð¡Ð¤¹¹½‘•M¥é”ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€€€¸€ô€¼¨¨ÑåÁ”íd¹%Ñ•µô€¨¼(€€€€€€€¸¹É¥¡Ðì(€€€€€ô(€€€€€Á½Ì€¬ô€Äì(€€€ô(€€€Ý¡¥±”€¡ÑåÁ”€„ôô‘½Õµ•¹ÑQåÁ”€˜˜ÑåÁ”¹}¥Ñ•´€„ôô¹Õ±°¤ì(€€€€€½¹ÍÐÁ…É•¹Ð€ôÑåÁ”¹}¥Ñ•´¹Á…É•¹Ðì(€€€€€¥˜€¡Á…É•¹Ð¹}¥Ñ•´€ôôô¹Õ±°ñð€…Á…É•¹Ð¹}¥Ñ•´¹‘•±•Ñ•¤ì(€€€€€€€Á½Ì€¬ô€Äì(€€€€€€€±•Ð¸€ô€ (€€€€€€€€€€¼¨¨ÑåÁ”íd¹‰ÍÑÉ…ÑQåÁ•ô€¨¼(€€€€€€€€€Á…É•¹Ð¹}™¥ÉÍÐ(€€€€€€€€¤ì(€€€€€€€Ý¡¥±”€¡¸€„ôô¹Õ±°¤ì(€€€€€€€€€½¹ÍÐ½¹Ñ•¹ÑQåÁ”€ô€ (€€€€€€€€€€€€¼¨¨ÑåÁ”íd¹½¹Ñ•¹ÑQåÁ•ô€¨¼(€€€€€€€€€€€¸¹½¹Ñ•¹Ð¹ÑåÁ”(€€€€€€€€€€¤ì(€€€€€€€€€¥˜€¡½¹Ñ•¹ÑQåÁ”€ôôôÑåÁ”¤ì(€€€€€€€€€€€‰É•…¬ì(€€€€€€€€€ô(€€€€€€€€€¥˜€ …¸¹‘•±•Ñ•¤ì(€€€€€€€€€€€¥˜€¡½¹Ñ•¹ÑQåÁ”¥¹ÍÑ…¹•½˜eaµ±Q•áÐ¤ì(€€€€€€€€€€€€€Á½Ì€¬ô½¹Ñ•¹ÑQåÁ”¹}±•¹Ñ ì(€€€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€€€Á½Ì€¬ô€¼¨¨ÑåÁ”í…¹åô€¨¼(€€€€€€€€€€€€€µ…ÁÁ¥¹œ¹•Ð¡½¹Ñ•¹ÑQåÁ”¤¹¹½‘•M¥é”ì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€€€¸€ô¸¹É¥¡Ðì(€€€€€€€ô(€€€€€ô(€€€€€ÑåÁ”€ô€¼¨¨ÑåÁ”íd¹‰ÍÑÉ…ÑQåÁ•ô€¨¼(€€€€€Á…É•¹Ðì(€€€ô(€€€É•ÑÕÉ¸Á½Ì€´€Äì(€ôì(€Ù…Èåaµ±É…µ•¹ÑQ½AÉ½Í•5¥ÉÉ½ÉÉ…µ•¹Ð€ô€¡åaµ±É…µ•¹Ð°Í¡•µ„È¤€ôøì(€€€½¹ÍÐ™É…µ•¹Ñ½¹Ñ•¹Ð€ôåaµ±É…µ•¹Ð¹Ñ½ÉÉ…ä ¤¹µ…À (€€€€€€¡Ð¤€ôøÉ•…Ñ•9½‘•É½µe±•µ•¹Ð (€€€€€€€€¼¨¨ÑåÁ”íd¹aµ±±•µ•¹Ñô€¨¼(€€€€€€€Ð°(€€€€€€€Í¡•µ„È°(€€€€€€€É•…Ñ•µÁÑå5•Ñ„ ¤(€€€€€€¤(€€€€¤¹™¥±Ñ•È ¡¸¤€ôø¸€„ôô¹Õ±°¤ì(€€€É•ÑÕÉ¸É…µ•¹Ð¹™É½µÉÉ…ä¡™É…µ•¹Ñ½¹Ñ•¹Ð¤ì(€ôì(€Ù…Èåaµ±É…µ•¹ÑQ½AÉ½Í•5¥ÉÉ½ÉI½½Ñ9½‘”€ô€¡åaµ±É…µ•¹Ð°Í¡•µ„È¤€ôøÍ¡•µ„È¹Ñ½Á9½‘•QåÁ”¹É•…Ñ”¡¹Õ±°°åaµ±É…µ•¹ÑQ½AÉ½Í•5¥ÉÉ½ÉÉ…µ•¹Ð¡åaµ±É…µ•¹Ð°Í¡•µ„È¤¤ì(€™Õ¹Ñ¥½¸ÁÉ½Í•µ¥ÉÉ½ÉQ½eaµ±É…µ•¹Ð¡‘½ŒÔ°áµ±É…µ•¹Ð¤ì(€€€½¹ÍÐÑåÁ”€ôáµ±É…µ•¹Ðñð¹•Üeaµ±É…µ•¹Ð ¤ì(€€€½¹ÍÐå‘½Œ€ôÑåÁ”¹‘½Œ€üÑåÁ”¹‘½Œ€èìÑÉ…¹Í…Ðè€¡ÑÉ…¹Í…Ñ¥½¸¤€ôøÑÉ…¹Í…Ñ¥½¸¡Ù½¥€À¤ôì(€€€ÕÁ‘…Ñ•eÉ…µ•¹Ð¡å‘½Œ°ÑåÁ”°‘½ŒÔ°ìµ…ÁÁ¥¹œè€¼¨}}AUI}|€¨¼¹•Ü5…À ¤°¥Í=5…É¬è€¼¨}}AUI}|€¨¼¹•Ü5…À ¤ô¤ì(€€€É•ÑÕÉ¸ÑåÁ”ì(€ô((€€¼¼¹½‘•}µ½‘Õ±•Ì½äµÁÉ½Í•µ¥ÉÉ½È½ÍÉŒ½Á±Õ¥¹Ì½ÕÉÍ½ÈµÁ±Õ¥¸¹©Ì(€Ù…È‘•™…Õ±ÑÝ…É•¹•ÍÍMÑ…Ñ•¥±Ñ•È€ô€¡ÕÉÉ•¹Ñ±¥•¹Ñ%°ÕÍ•É±¥•¹Ñ%°}ÕÍ•È¤€ôøÕÉÉ•¹Ñ±¥•¹Ñ%€„ôôÕÍ•É±¥•¹Ñ%ì(€Ù…È‘•™…Õ±ÑÕÉÍ½É	Õ¥±‘•È€ô€¡ÕÍ•È¤€ôøì(€€€½¹ÍÐÕÉÍ½È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€ÕÉÍ½È¹±…ÍÍ1¥ÍÐ¹…‘ ‰AÉ½Í•5¥ÉÉ½Èµå©ÌµÕÉÍ½Èˆ¤ì(€€€ÕÉÍ½È¹Í•ÑÑÑÉ¥‰ÕÑ” ‰ÍÑå±”ˆ°‰½É‘•Èµ½±½Èè€‘íÕÍ•È¹½±½Éõ€¤ì(€€€½¹ÍÐÕÍ•É¥Ø€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€ÕÍ•É¥Ø¹Í•ÑÑÑÉ¥‰ÕÑ” ‰ÍÑå±”ˆ°‰…­É½Õ¹µ½±½Èè€‘íÕÍ•È¹½±½Éõ€¤ì(€€€ÕÍ•É¥Ø¹¥¹Í•ÉÑ	•™½É”¡‘½Õµ•¹Ð¹É•…Ñ•Q•áÑ9½‘”¡ÕÍ•È¹¹…µ”¤°¹Õ±°¤ì(€€€½¹ÍÐ¹½¹‰É•…­¥¹MÁ…”Ä€ô‘½Õµ•¹Ð¹É•…Ñ•Q•áÑ9½‘” ‰qÔÈÀØÀˆ¤ì(€€€½¹ÍÐ¹½¹‰É•…­¥¹MÁ…”È€ô‘½Õµ•¹Ð¹É•…Ñ•Q•áÑ9½‘” ‰qÔÈÀØÀˆ¤ì(€€€ÕÉÍ½È¹¥¹Í•ÉÑ	•™½É”¡¹½¹‰É•…­¥¹MÁ…”Ä°¹Õ±°¤ì(€€€ÕÉÍ½È¹¥¹Í•ÉÑ	•™½É”¡ÕÍ•É¥Ø°¹Õ±°¤ì(€€€ÕÉÍ½È¹¥¹Í•ÉÑ	•™½É”¡¹½¹‰É•…­¥¹MÁ…”È°¹Õ±°¤ì(€€€É•ÑÕÉ¸ÕÉÍ½Èì(€ôì(€Ù…È‘•™…Õ±ÑM•±•Ñ¥½¹	Õ¥±‘•È€ô€¡ÕÍ•È¤€ôøì(€€€É•ÑÕÉ¸ì(€€€€€ÍÑå±”è‰…­É½Õ¹µ½±½Èè€‘íÕÍ•È¹½±½ÉôÜÁ€°(€€€€€±…ÍÌè€‰AÉ½Í•5¥ÉÉ½Èµå©ÌµÍ•±•Ñ¥½¸ˆ(€€€ôì(€ôì(€Ù…ÈÉáY…±¥‘½±½È€ô€½xlÀ´å„µ™µuìÙô¼ì(€Ù…ÈÉ•…Ñ••½É…Ñ¥½¹Ì€ô€¡ÍÑ…Ñ”°…Ý…É•¹•ÍÌ°…Ý…É•¹•ÍÍ¥±Ñ•È°É•…Ñ•ÕÉÍ½È°É•…Ñ•M•±•Ñ¥½¸¤€ôøì(€€€½¹ÍÐåÍÑ…Ñ”€ôåMå¹A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡ÍÑ…Ñ”¤ì(€€€½¹ÍÐä€ôåÍÑ…Ñ”¹‘½Œì(€€€½¹ÍÐ‘•½É…Ñ¥½¹Ì€ômtì(€€€¥˜€¡åÍÑ…Ñ”¹Í¹…ÁÍ¡½Ð€„ô¹Õ±°ñðåÍÑ…Ñ”¹ÁÉ•ÙM¹…ÁÍ¡½Ð€„ô¹Õ±°ñðåÍÑ…Ñ”¹‰¥¹‘¥¹œ¹µ…ÁÁ¥¹œ¹Í¥é”€ôôô€À¤ì(€€€€€É•ÑÕÉ¸•½É…Ñ¥½¹M•Ð¹É•…Ñ”¡ÍÑ…Ñ”¹‘½Œ°mt¤ì(€€€ô(€€€…Ý…É•¹•ÍÌ¹•ÑMÑ…Ñ•Ì ¤¹™½É…  ¡…Ü°±¥•¹Ñ%¤€ôøì(€€€€€¥˜€ ……Ý…É•¹•ÍÍ¥±Ñ•È¡ä¹±¥•¹Ñ%°±¥•¹Ñ%°…Ü¤¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô(€€€€€¥˜€¡…Ü¹ÕÉÍ½È€„ô¹Õ±°¤ì(€€€€€€€½¹ÍÐÕÍ•È€ô…Ü¹ÕÍ•Èñðíôì(€€€€€€€¥˜€¡ÕÍ•È¹½±½È€ôô¹Õ±°¤ì(€€€€€€€€€ÕÍ•È¹½±½È€ô€ˆ™™„ÔÀÀˆì(€€€€€€€ô•±Í”¥˜€ …ÉáY…±¥‘½±½È¹Ñ•ÍÐ¡ÕÍ•È¹½±½È¤¤ì(€€€€€€€€€½¹Í½±”¹Ý…É¸ ‰ÕÍ•ÈÕÍ•Ì…¸Õ¹ÍÕÁÁ½ÉÑ•½±½È™½Éµ…Ðˆ°ÕÍ•È¤ì(€€€€€€€ô(€€€€€€€¥˜€¡ÕÍ•È¹¹…µ”€ôô¹Õ±°¤ì(€€€€€€€€€ÕÍ•È¹¹…µ”€ôUÍ•Èè€‘í±¥•¹Ñ%‘õ€ì(€€€€€€€ô(€€€€€€€±•Ð…¹¡½È€ôÉ•±…Ñ¥Ù•A½Í¥Ñ¥½¹Q½‰Í½±ÕÑ•A½Í¥Ñ¥½¸ (€€€€€€€€€ä°(€€€€€€€€€åÍÑ…Ñ”¹ÑåÁ”°(€€€€€€€€€É•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹É½µ)M=8¡…Ü¹ÕÉÍ½È¹…¹¡½È¤°(€€€€€€€€€åÍÑ…Ñ”¹‰¥¹‘¥¹œ¹µ…ÁÁ¥¹œ(€€€€€€€€¤ì(€€€€€€€±•Ð¡•…€ôÉ•±…Ñ¥Ù•A½Í¥Ñ¥½¹Q½‰Í½±ÕÑ•A½Í¥Ñ¥½¸ (€€€€€€€€€ä°(€€€€€€€€€åÍÑ…Ñ”¹ÑåÁ”°(€€€€€€€€€É•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹É½µ)M=8¡…Ü¹ÕÉÍ½È¹¡•…¤°(€€€€€€€€€åÍÑ…Ñ”¹‰¥¹‘¥¹œ¹µ…ÁÁ¥¹œ(€€€€€€€€¤ì(€€€€€€€¥˜€¡…¹¡½È€„ôô¹Õ±°€˜˜¡•…€„ôô¹Õ±°¤ì(€€€€€€€€€½¹ÍÐµ…áÍ¥é”€ôµ…à¡ÍÑ…Ñ”¹‘½Œ¹½¹Ñ•¹Ð¹Í¥é”€´€Ä°€À¤ì(€€€€€€€€€…¹¡½È€ôµ¥¸¡…¹¡½È°µ…áÍ¥é”¤ì(€€€€€€€€€¡•…€ôµ¥¸¡¡•…°µ…áÍ¥é”¤ì(€€€€€€€€€‘•½É…Ñ¥½¹Ì¹ÁÕÍ  (€€€€€€€€€€€•½É…Ñ¥½¸¹Ý¥‘•Ð¡¡•…°€ ¤€ôøÉ•…Ñ•ÕÉÍ½È¡ÕÍ•È°±¥•¹Ñ%¤°ì(€€€€€€€€€€€€€­•äè±¥•¹Ñ%€¬€ˆˆ°(€€€€€€€€€€€€€Í¥‘”è€ÄÀ(€€€€€€€€€€€ô¤(€€€€€€€€€€¤ì(€€€€€€€€€½¹ÍÐ™É½´È€ôµ¥¸¡…¹¡½È°¡•…¤ì(€€€€€€€€€½¹ÍÐÑ¼€ôµ…à¡…¹¡½È°¡•…¤ì(€€€€€€€€€‘•½É…Ñ¥½¹Ì¹ÁÕÍ  (€€€€€€€€€€€•½É…Ñ¥½¸¹¥¹±¥¹”¡™É½´È°Ñ¼°É•…Ñ•M•±•Ñ¥½¸¡ÕÍ•È°±¥•¹Ñ%¤°ì(€€€€€€€€€€€€€¥¹±ÕÍ¥Ù•¹èÑÉÕ”°(€€€€€€€€€€€€€¥¹±ÕÍ¥Ù•MÑ…ÉÐè™…±Í”(€€€€€€€€€€€ô¤(€€€€€€€€€€¤ì(€€€€€€€ô(€€€€€ô(€€€ô¤ì(€€€É•ÑÕÉ¸•½É…Ñ¥½¹M•Ð¹É•…Ñ”¡ÍÑ…Ñ”¹‘½Œ°‘•½É…Ñ¥½¹Ì¤ì(€ôì(€Ù…ÈåÕÉÍ½ÉA±Õ¥¸€ô€¡…Ý…É•¹•ÍÌ°ì(€€€…Ý…É•¹•ÍÍMÑ…Ñ•¥±Ñ•È€ô‘•™…Õ±ÑÝ…É•¹•ÍÍMÑ…Ñ•¥±Ñ•È°(€€€ÕÉÍ½É	Õ¥±‘•È€ô‘•™…Õ±ÑÕÉÍ½É	Õ¥±‘•È°(€€€Í•±•Ñ¥½¹	Õ¥±‘•È€ô‘•™…Õ±ÑM•±•Ñ¥½¹	Õ¥±‘•È°(€€€•ÑM•±•Ñ¥½¸è•ÑM•±•Ñ¥½¸È€ô€¡ÍÑ…Ñ”¤€ôøÍÑ…Ñ”¹Í•±•Ñ¥½¸(€ô€ôíô°ÕÉÍ½ÉMÑ…Ñ•¥•±€ô€‰ÕÉÍ½Èˆ¤€ôø¹•ÜA±Õ¥¸¡ì(€€€­•äèåÕÉÍ½ÉA±Õ¥¹-•ä°(€€€ÍÑ…Ñ”èì(€€€€€¥¹¥Ð¡|°ÍÑ…Ñ”¤ì(€€€€€€€É•ÑÕÉ¸É•…Ñ••½É…Ñ¥½¹Ì (€€€€€€€€€ÍÑ…Ñ”°(€€€€€€€€€…Ý…É•¹•ÍÌ°(€€€€€€€€€…Ý…É•¹•ÍÍMÑ…Ñ•¥±Ñ•È°(€€€€€€€€€ÕÉÍ½É	Õ¥±‘•È°(€€€€€€€€€Í•±•Ñ¥½¹	Õ¥±‘•È(€€€€€€€€¤ì(€€€€€ô°(€€€€€…ÁÁ±ä¡ÑÈ°ÁÉ•ÙMÑ…Ñ”°}½±‘MÑ…Ñ”°¹•ÝMÑ…Ñ”¤ì(€€€€€€€½¹ÍÐåÍÑ…Ñ”€ôåMå¹A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡¹•ÝMÑ…Ñ”¤ì(€€€€€€€½¹ÍÐåÕÉÍ½ÉMÑ…Ñ”€ôÑÈ¹•Ñ5•Ñ„¡åÕÉÍ½ÉA±Õ¥¹-•ä¤ì(€€€€€€€¥˜€¡åÍÑ…Ñ”€˜˜åÍÑ…Ñ”¹¥Í¡…¹•=É¥¥¸ñðåÕÉÍ½ÉMÑ…Ñ”€˜˜åÕÉÍ½ÉMÑ…Ñ”¹…Ý…É•¹•ÍÍUÁ‘…Ñ•¤ì(€€€€€€€€€É•ÑÕÉ¸É•…Ñ••½É…Ñ¥½¹Ì (€€€€€€€€€€€¹•ÝMÑ…Ñ”°(€€€€€€€€€€€…Ý…É•¹•ÍÌ°(€€€€€€€€€€€…Ý…É•¹•ÍÍMÑ…Ñ•¥±Ñ•È°(€€€€€€€€€€€ÕÉÍ½É	Õ¥±‘•È°(€€€€€€€€€€€Í•±•Ñ¥½¹	Õ¥±‘•È(€€€€€€€€€€¤ì(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸ÁÉ•ÙMÑ…Ñ”¹µ…À¡ÑÈ¹µ…ÁÁ¥¹œ°ÑÈ¹‘½Œ¤ì(€€€€€ô(€€€ô°(€€€ÁÉ½ÁÌèì(€€€€€‘•½É…Ñ¥½¹Ìè€¡ÍÑ…Ñ”¤€ôøì(€€€€€€€É•ÑÕÉ¸åÕÉÍ½ÉA±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡ÍÑ…Ñ”¤ì(€€€€€ô(€€€ô°(€€€Ù¥•Üè€¡Ù¥•Ü¤€ôøì(€€€€€½¹ÍÐ…Ý…É•¹•ÍÍ1¥ÍÑ•¹•È€ô€ ¤€ôøì(€€€€€€€¥˜€¡Ù¥•Ü¹‘½Y¥•Ü¤ì(€€€€€€€€€Í•Ñ5•Ñ„¡Ù¥•Ü°åÕÉÍ½ÉA±Õ¥¹-•ä°ì…Ý…É•¹•ÍÍUÁ‘…Ñ•èÑÉÕ”ô¤ì(€€€€€€€ô(€€€€€ôì(€€€€€½¹ÍÐÕÁ‘…Ñ•ÕÉÍ½É%¹™¼€ô€ ¤€ôøì(€€€€€€€½¹ÍÐåÍÑ…Ñ”€ôåMå¹A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¤ì(€€€€€€€½¹ÍÐÕÉÉ•¹Ð€ô…Ý…É•¹•ÍÌ¹•Ñ1½…±MÑ…Ñ” ¤ñðíôì(€€€€€€€¥˜€¡Ù¥•Ü¹¡…Í½ÕÌ ¤¤ì(€€€€€€€€€½¹ÍÐÍ•±•Ñ¥½¸€ô•ÑM•±•Ñ¥½¸È¡Ù¥•Ü¹ÍÑ…Ñ”¤ì(€€€€€€€€€½¹ÍÐ…¹¡½È€ô…‰Í½±ÕÑ•A½Í¥Ñ¥½¹Q½I•±…Ñ¥Ù•A½Í¥Ñ¥½¸ (€€€€€€€€€€€Í•±•Ñ¥½¸¹…¹¡½È°(€€€€€€€€€€€åÍÑ…Ñ”¹ÑåÁ”°(€€€€€€€€€€€åÍÑ…Ñ”¹‰¥¹‘¥¹œ¹µ…ÁÁ¥¹œ(€€€€€€€€€€¤ì(€€€€€€€€€½¹ÍÐ¡•…€ô…‰Í½±ÕÑ•A½Í¥Ñ¥½¹Q½I•±…Ñ¥Ù•A½Í¥Ñ¥½¸ (€€€€€€€€€€€Í•±•Ñ¥½¸¹¡•…°(€€€€€€€€€€€åÍÑ…Ñ”¹ÑåÁ”°(€€€€€€€€€€€åÍÑ…Ñ”¹‰¥¹‘¥¹œ¹µ…ÁÁ¥¹œ(€€€€€€€€€€¤ì(€€€€€€€€€¥˜€¡ÕÉÉ•¹Ð¹ÕÉÍ½È€ôô¹Õ±°ñð€…½µÁ…É•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹Ì (€€€€€€€€€€€É•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹É½µ)M=8¡ÕÉÉ•¹Ð¹ÕÉÍ½È¹…¹¡½È¤°(€€€€€€€€€€€…¹¡½È(€€€€€€€€€€¤ñð€…½µÁ…É•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹Ì (€€€€€€€€€€€É•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹É½µ)M=8¡ÕÉÉ•¹Ð¹ÕÉÍ½È¹¡•…¤°(€€€€€€€€€€€¡•…(€€€€€€€€€€¤¤ì(€€€€€€€€€€€…Ý…É•¹•ÍÌ¹Í•Ñ1½…±MÑ…Ñ•¥•±¡ÕÉÍ½ÉMÑ…Ñ•¥•±°ì(€€€€€€€€€€€€€…¹¡½È°(€€€€€€€€€€€€€¡•…(€€€€€€€€€€€ô¤ì(€€€€€€€€€ô(€€€€€€€ô•±Í”¥˜€¡ÕÉÉ•¹Ð¹ÕÉÍ½È€„ô¹Õ±°€˜˜É•±…Ñ¥Ù•A½Í¥Ñ¥½¹Q½‰Í½±ÕÑ•A½Í¥Ñ¥½¸ (€€€€€€€€€åÍÑ…Ñ”¹‘½Œ°(€€€€€€€€€åÍÑ…Ñ”¹ÑåÁ”°(€€€€€€€€€É•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹É½µ)M=8¡ÕÉÉ•¹Ð¹ÕÉÍ½È¹…¹¡½È¤°(€€€€€€€€€åÍÑ…Ñ”¹‰¥¹‘¥¹œ¹µ…ÁÁ¥¹œ(€€€€€€€€¤€„ôô¹Õ±°¤ì(€€€€€€€€€…Ý…É•¹•ÍÌ¹Í•Ñ1½…±MÑ…Ñ•¥•±¡ÕÉÍ½ÉMÑ…Ñ•¥•±°¹Õ±°¤ì(€€€€€€€ô(€€€€€ôì(€€€€€…Ý…É•¹•ÍÌ¹½¸ ‰¡…¹”ˆ°…Ý…É•¹•ÍÍ1¥ÍÑ•¹•È¤ì(€€€€€Ù¥•Ü¹‘½´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰™½ÕÍ¥¸ˆ°ÕÁ‘…Ñ•ÕÉÍ½É%¹™¼¤ì(€€€€€Ù¥•Ü¹‘½´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰™½ÕÍ½ÕÐˆ°ÕÁ‘…Ñ•ÕÉÍ½É%¹™¼¤ì(€€€€€É•ÑÕÉ¸ì(€€€€€€€ÕÁ‘…Ñ”èÕÁ‘…Ñ•ÕÉÍ½É%¹™¼°(€€€€€€€‘•ÍÑÉ½äè€ ¤€ôøì(€€€€€€€€€Ù¥•Ü¹‘½´¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È ‰™½ÕÍ¥¸ˆ°ÕÁ‘…Ñ•ÕÉÍ½É%¹™¼¤ì(€€€€€€€€€Ù¥•Ü¹‘½´¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È ‰™½ÕÍ½ÕÐˆ°ÕÁ‘…Ñ•ÕÉÍ½É%¹™¼¤ì(€€€€€€€€€…Ý…É•¹•ÍÌ¹½™˜ ‰¡…¹”ˆ°…Ý…É•¹•ÍÍ1¥ÍÑ•¹•È¤ì(€€€€€€€€€…Ý…É•¹•ÍÌ¹Í•Ñ1½…±MÑ…Ñ•¥•±¡ÕÉÍ½ÉMÑ…Ñ•¥•±°¹Õ±°¤ì(€€€€€€€ô(€€€€€ôì(€€€ô(€ô¤ì((€€¼¼¹½‘•}µ½‘Õ±•Ì½äµÁÉ½Í•µ¥ÉÉ½È½ÍÉŒ½Á±Õ¥¹Ì½Õ¹‘¼µÁ±Õ¥¸¹©Ì(€Ù…ÈÕ¹‘¼€ô€¡ÍÑ…Ñ”¤€ôøåU¹‘½A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡ÍÑ…Ñ”¤ü¹Õ¹‘½5…¹…•Èü¹Õ¹‘¼ ¤€„ô¹Õ±°ì(€Ù…ÈÉ•‘¼€ô€¡ÍÑ…Ñ”¤€ôøåU¹‘½A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡ÍÑ…Ñ”¤ü¹Õ¹‘½5…¹…•Èü¹É•‘¼ ¤€„ô¹Õ±°ì(€Ù…È‘•™…Õ±ÑAÉ½Ñ•Ñ•‘9½‘•Ì€ô€¼¨}}AUI}|€¨¼¹•ÜM•Ð¡l‰Á…É…É…Á ‰t¤ì(€Ù…È‘•™…Õ±Ñ•±•Ñ•¥±Ñ•È€ô€¡¥Ñ•´°ÁÉ½Ñ•Ñ•‘9½‘•Ì¤€ôø€„¡¥Ñ•´¥¹ÍÑ…¹•½˜%Ñ•´¤ñð€„¡¥Ñ•´¹½¹Ñ•¹Ð¥¹ÍÑ…¹•½˜½¹Ñ•¹ÑQåÁ”¤ñð€„¡¥Ñ•´¹½¹Ñ•¹Ð¹ÑåÁ”¥¹ÍÑ…¹•½˜eQ•áÐñð¥Ñ•´¹½¹Ñ•¹Ð¹ÑåÁ”¥¹ÍÑ…¹•½˜eaµ±±•µ•¹Ð€˜˜ÁÉ½Ñ•Ñ•‘9½‘•Ì¹¡…Ì¡¥Ñ•´¹½¹Ñ•¹Ð¹ÑåÁ”¹¹½‘•9…µ”¤¤ñð¥Ñ•´¹½¹Ñ•¹Ð¹ÑåÁ”¹}±•¹Ñ €ôôô€Àì(€Ù…ÈåU¹‘½A±Õ¥¸€ô€¡ìÁÉ½Ñ•Ñ•‘9½‘•Ì€ô‘•™…Õ±ÑAÉ½Ñ•Ñ•‘9½‘•Ì°ÑÉ…­•‘=É¥¥¹Ì€ômt°Õ¹‘½5…¹…•È€ô¹Õ±°ô€ôíô¤€ôø¹•ÜA±Õ¥¸¡ì(€€€­•äèåU¹‘½A±Õ¥¹-•ä°(€€€ÍÑ…Ñ”èì(€€€€€¥¹¥Ðè€¡¥¹¥Ñ…ÉÌ°ÍÑ…Ñ”¤€ôøì(€€€€€€€½¹ÍÐåÍÑ…Ñ”€ôåMå¹A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡ÍÑ…Ñ”¤ì(€€€€€€€½¹ÍÐ}Õ¹‘½5…¹…•È€ôÕ¹‘½5…¹…•Èñð¹•ÜU¹‘½5…¹…•È¡åÍÑ…Ñ”¹ÑåÁ”°ì(€€€€€€€€€ÑÉ…­•‘=É¥¥¹Ìè¹•ÜM•Ð¡måMå¹A±Õ¥¹-•åt¹½¹…Ð¡ÑÉ…­•‘=É¥¥¹Ì¤¤°(€€€€€€€€€‘•±•Ñ•¥±Ñ•Èè€¡¥Ñ•´¤€ôø‘•™…Õ±Ñ•±•Ñ•¥±Ñ•È¡¥Ñ•´°ÁÉ½Ñ•Ñ•‘9½‘•Ì¤°(€€€€€€€€€…ÁÑÕÉ•QÉ…¹Í…Ñ¥½¸è€¡ÑÈ¤€ôøÑÈ¹µ•Ñ„¹•Ð ‰…‘‘Q½!¥ÍÑ½Éäˆ¤€„ôô™…±Í”(€€€€€€€ô¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€€€€€Õ¹‘½5…¹…•Èè}Õ¹‘½5…¹…•È°(€€€€€€€€€ÁÉ•ÙM•°è¹Õ±°°(€€€€€€€€€¡…ÍU¹‘½=ÁÌè}Õ¹‘½5…¹…•È¹Õ¹‘½MÑ…¬¹±•¹Ñ €ø€À°(€€€€€€€€€¡…ÍI•‘½=ÁÌè}Õ¹‘½5…¹…•È¹É•‘½MÑ…¬¹±•¹Ñ €ø€À(€€€€€€€ôì(€€€€€ô°(€€€€€…ÁÁ±äè€¡ÑÈ°Ù…°°½±‘MÑ…Ñ”°ÍÑ…Ñ”¤€ôøì(€€€€€€€½¹ÍÐ‰¥¹‘¥¹œ€ôåMå¹A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡ÍÑ…Ñ”¤¹‰¥¹‘¥¹œì(€€€€€€€½¹ÍÐÕ¹‘½5…¹…•ÈÈ€ôÙ…°¹Õ¹‘½5…¹…•Èì(€€€€€€€½¹ÍÐ¡…ÍU¹‘½=ÁÌ€ôÕ¹‘½5…¹…•ÈÈ¹Õ¹‘½MÑ…¬¹±•¹Ñ €ø€Àì(€€€€€€€½¹ÍÐ¡…ÍI•‘½=ÁÌ€ôÕ¹‘½5…¹…•ÈÈ¹É•‘½MÑ…¬¹±•¹Ñ €ø€Àì(€€€€€€€¥˜€¡‰¥¹‘¥¹œ¤ì(€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€€€€€Õ¹‘½5…¹…•ÈèÕ¹‘½5…¹…•ÈÈ°(€€€€€€€€€€€ÁÉ•ÙM•°è•ÑI•±…Ñ¥Ù•M•±•Ñ¥½¸¡‰¥¹‘¥¹œ°½±‘MÑ…Ñ”¤°(€€€€€€€€€€€¡…ÍU¹‘½=ÁÌ°(€€€€€€€€€€€¡…ÍI•‘½=ÁÌ(€€€€€€€€€ôì(€€€€€€€ô•±Í”ì(€€€€€€€€€¥˜€¡¡…ÍU¹‘½=ÁÌ€„ôôÙ…°¹¡…ÍU¹‘½=ÁÌñð¡…ÍI•‘½=ÁÌ€„ôôÙ…°¹¡…ÍI•‘½=ÁÌ¤ì(€€€€€€€€€€€É•ÑÕÉ¸=‰©•Ð¹…ÍÍ¥¸¡íô°Ù…°°ì(€€€€€€€€€€€€€¡…ÍU¹‘½=ÁÌèÕ¹‘½5…¹…•ÈÈ¹Õ¹‘½MÑ…¬¹±•¹Ñ €ø€À°(€€€€€€€€€€€€€¡…ÍI•‘½=ÁÌèÕ¹‘½5…¹…•ÈÈ¹É•‘½MÑ…¬¹±•¹Ñ €ø€À(€€€€€€€€€€€ô¤ì(€€€€€€€€€ô•±Í”ì(€€€€€€€€€€€É•ÑÕÉ¸Ù…°ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€ô(€€€ô°(€€€Ù¥•Üè€¡Ù¥•Ü¤€ôøì(€€€€€½¹ÍÐåÍÑ…Ñ”€ôåMå¹A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¤ì(€€€€€½¹ÍÐÕ¹‘½5…¹…•ÈÈ€ôåU¹‘½A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¤¹Õ¹‘½5…¹…•Èì(€€€€€Õ¹‘½5…¹…•ÈÈ¹½¸ ‰ÍÑ…¬µ¥Ñ•´µ…‘‘•ˆ°€¡ìÍÑ…­%Ñ•´ô¤€ôøì(€€€€€€€½¹ÍÐ‰¥¹‘¥¹œ€ôåÍÑ…Ñ”¹‰¥¹‘¥¹œì(€€€€€€€¥˜€¡‰¥¹‘¥¹œ¤ì(€€€€€€€€€ÍÑ…­%Ñ•´¹µ•Ñ„¹Í•Ð¡‰¥¹‘¥¹œ°åU¹‘½A±Õ¥¹-•ä¹•ÑMÑ…Ñ”¡Ù¥•Ü¹ÍÑ…Ñ”¤¹ÁÉ•ÙM•°¤ì(€€€€€€€ô(€€€€€ô¤ì(€€€€€Õ¹‘½5…¹…•ÈÈ¹½¸ ‰ÍÑ…¬µ¥Ñ•´µÁ½ÁÁ•ˆ°€¡ìÍÑ…­%Ñ•´ô¤€ôøì(€€€€€€€½¹ÍÐ‰¥¹‘¥¹œ€ôåÍÑ…Ñ”¹‰¥¹‘¥¹œì(€€€€€€€¥˜€¡‰¥¹‘¥¹œ¤ì(€€€€€€€€€‰¥¹‘¥¹œ¹‰•™½É•QÉ…¹Í…Ñ¥½¹M•±•Ñ¥½¸€ôÍÑ…­%Ñ•´¹µ•Ñ„¹•Ð¡‰¥¹‘¥¹œ¤ñð‰¥¹‘¥¹œ¹‰•™½É•QÉ…¹Í…Ñ¥½¹M•±•Ñ¥½¸ì(€€€€€€€ô(€€€€€ô¤ì(€€€€€É•ÑÕÉ¸ì(€€€€€€€‘•ÍÑÉ½äè€ ¤€ôøì(€€€€€€€€€Õ¹‘½5…¹…•ÈÈ¹‘•ÍÑÉ½ä ¤ì(€€€€€€€ô(€€€€€ôì(€€€ô(€ô¤ì((€€¼¼É¥ µÑ•áÐ¹©Ì(€Ù…ÈÍ¡•µ„€ô¹•ÜM¡•µ„È¡ì(€€€¹½‘•Ìèì(€€€€€‘½Œèì½¹Ñ•¹Ðè€‰‰±½¬¬ˆô°(€€€€€Á…É…É…Á èì½¹Ñ•¹Ðè€‰¥¹±¥¹”¨ˆ°É½ÕÀè€‰‰±½¬ˆ°Á…ÉÍ•=4èmìÑ…œè€‰Àˆô°ìÑ…œè€‰‘¥Øˆõt°Ñ½=4è€ ¤€ôøl‰Àˆ°€Átô°(€€€€€¡•…‘¥¹œèì…ÑÑÉÌèì±•Ù•°èì‘•™…Õ±Ðè€Ìôô°½¹Ñ•¹Ðè€‰¥¹±¥¹”¨ˆ°É½ÕÀè€‰‰±½¬ˆ°Á…ÉÍ•=4èmìÑ…œè€‰ Èˆ°…ÑÑÉÌèì±•Ù•°è€Èôô°ìÑ…œè€‰ Ìˆ°…ÑÑÉÌèì±•Ù•°è€Ìôõt°Ñ½=4è€¡¹½‘”¤€ôøm¹½‘”¹…ÑÑÉÌ¹±•Ù•°€ôôô€È€ü€‰ Èˆ€è€‰ Ìˆ°€Átô°(€€€€€‰Õ±±•Ñ}±¥ÍÐèì½¹Ñ•¹Ðè€‰±¥ÍÑ}¥Ñ•´¬ˆ°É½ÕÀè€‰‰±½¬ˆ°Á…ÉÍ•=4èmìÑ…œè€‰Õ°ˆõt°Ñ½=4è€ ¤€ôøl‰Õ°ˆ°€Átô°(€€€€€½É‘•É•‘}±¥ÍÐèì…ÑÑÉÌèì½É‘•Èèì‘•™…Õ±Ðè€Äôô°½¹Ñ•¹Ðè€‰±¥ÍÑ}¥Ñ•´¬ˆ°É½ÕÀè€‰‰±½¬ˆ°Á…ÉÍ•=4èmìÑ…œè€‰½°ˆõt°Ñ½=4è€¡¹½‘”¤€ôøl‰½°ˆ°ìÍÑ…ÉÐè¹½‘”¹…ÑÑÉÌ¹½É‘•Èô°€Átô°(€€€€€±¥ÍÑ}¥Ñ•´èì½¹Ñ•¹Ðè€‰Á…É…É…Á ‰±½¬¨ˆ°Á…ÉÍ•=4èmìÑ…œè€‰±¤ˆõt°Ñ½=4è€ ¤€ôøl‰±¤ˆ°€Átô°(€€€€€Ñ•áÐèìÉ½ÕÀè€‰¥¹±¥¹”ˆô°(€€€€€¡…É‘}‰É•…¬èì¥¹±¥¹”èÑÉÕ”°É½ÕÀè€‰¥¹±¥¹”ˆ°Í•±•Ñ…‰±”è™…±Í”°Á…ÉÍ•=4èmìÑ…œè€‰‰Èˆõt°Ñ½=4è€ ¤€ôøl‰‰È‰tô(€€€ô°(€€€µ…É­Ìèì(€€€€€ÍÑÉ½¹œèìÁ…ÉÍ•=4èmìÑ…œè€‰ˆˆô°ìÑ…œè€‰ÍÑÉ½¹œˆô°ìÍÑå±”è€‰™½¹ÐµÝ•¥¡Ðõ‰½±ˆõt°Ñ½=4è€ ¤€ôøl‰ÍÑÉ½¹œˆ°€Átô°(€€€€€•´èìÁ…ÉÍ•=4èmìÑ…œè€‰¤ˆô°ìÑ…œè€‰•´ˆô°ìÍÑå±”è€‰™½¹ÐµÍÑå±”õ¥Ñ…±¥Œˆõt°Ñ½=4è€ ¤€ôøl‰•´ˆ°€Átô°(€€€€€Õ¹‘•É±¥¹”èìÁ…ÉÍ•=4èmìÑ…œè€‰Ôˆô°ìÍÑå±”è€‰Ñ•áÐµ‘•½É…Ñ¥½¸õÕ¹‘•É±¥¹”ˆõt°Ñ½=4è€ ¤€ôøl‰Ôˆ°€Átô°(€€€€€½±½Èèì(€€€€€€€…ÑÑÉÌèì½±½Èèíôô°(€€€€€€€Á…ÉÍ•=4èmìÍÑå±”è€‰½±½Èˆ°•ÑÑÑÉÌè€¡Ù…±Õ”¤€ôø€½xlÀ´å„µ™uìÙô‘ñyÉ‰p¡mq±qÍt­p¤½¤¹Ñ•ÍÐ¡Ù…±Õ”¤€üì½±½ÈèÙ…±Õ”ô€è™…±Í”õt°(€€€€€€€Ñ½=4è€¡µ…É¬¤€ôøl‰ÍÁ…¸ˆ°ìÍÑå±”è€‰½±½Èèˆ€¬µ…É¬¹…ÑÑÉÌ¹½±½Èô°€Át(€€€€€ô°(€€€€€½µµ•¹Ðèì(€€€€€€€…ÑÑÉÌèì¥èíôô°(€€€€€€€¥¹±ÕÍ¥Ù”è™…±Í”°(€€€€€€€Á…ÉÍ•=4èmìÑ…œè€‰µ…É­m‘…Ñ„µ½µµ•¹Ðµ¥‘tˆ°•ÑÑÑÉÌè€¡•±•µ•¹ÐÈ¤€ôø€¡ì¥è•±•µ•¹ÐÈ¹•ÑÑÑÉ¥‰ÕÑ” ‰‘…Ñ„µ½µµ•¹Ðµ¥ˆ¤ñð€ˆˆô¤õt°(€€€€€€€Ñ½=4è€¡µ…É¬¤€ôøl‰µ…É¬ˆ°ì€‰‘…Ñ„µ½µµ•¹Ðµ¥ˆèµ…É¬¹…ÑÑÉÌ¹¥°±…ÍÌè€‰½µµÌµ½µµ•¹Ðµ¡¥¡±¥¡Ðˆô°€Át(€€€€€ô(€€€ô(€ô¤ì(€™Õ¹Ñ¥½¸Í••‘I¥ ¡™É…µ•¹Ð°¡Ñµ°¤ì(€€€¥˜€¡™É…µ•¹Ð¹±•¹Ñ ¤É•ÑÕÉ¸ì(€€€½¹ÍÐ½¹Ñ…¥¹•È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€½¹Ñ…¥¹•È¹¥¹¹•É!Q50€ô¡Ñµ°ì(€€€ÁÉ½Í•µ¥ÉÉ½ÉQ½eaµ±É…µ•¹Ð¡=5A…ÉÍ•ÈÈ¹™É½µM¡•µ„¡Í¡•µ„¤¹Á…ÉÍ”¡½¹Ñ…¥¹•È¤°™É…µ•¹Ð¤ì(€ô(€™Õ¹Ñ¥½¸É•…‘I¥ ¡™É…µ•¹Ð°­••Á	±½­Ì€ô™…±Í”¤ì(€€€¥˜€ …™É…µ•¹Ð¹±•¹Ñ ¤É•ÑÕÉ¸ìÉ¥¡!Ñµ°è€ˆˆ°½¹Ñ•¹Ðè€ˆˆôì(€€€½¹ÍÐ¹½‘”€ôåaµ±É…µ•¹ÑQ½AÉ½Í•5¥ÉÉ½ÉI½½Ñ9½‘”¡™É…µ•¹Ð°Í¡•µ„¤ì(€€€½¹ÍÐ½¹Ñ…¥¹•È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€½¹Ñ…¥¹•È¹…ÁÁ•¹¡=5M•É¥…±¥é•È¹™É½µM¡•µ„¡Í¡•µ„¤¹Í•É¥…±¥é•É…µ•¹Ð¡¹½‘”¹½¹Ñ•¹Ð¤¤ì(€€€É•ÑÕÉ¸ìÉ¥¡!Ñµ°è­••Á	±½­Ì€ü½¹Ñ…¥¹•È¹¥¹¹•É!Q50€è½¹Ñ…¥¹•È¹¥¹¹•É!Q50°½¹Ñ•¹Ðè¹½‘”¹Ñ•áÑ	•ÑÝ••¸ À°¹½‘”¹½¹Ñ•¹Ð¹Í¥é”°€‰q¸ˆ°€‰q¸ˆ¤ôì(€ô(€™Õ¹Ñ¥½¸‰¥¹‘I¥ ¡ì•±•µ•¹Ðè•±•µ•¹ÐÈ°™É…µ•¹Ð°…Ý…É•¹•ÍÌ°•‘¥Ñ…‰±”°½¹¡…¹”°™¥•±°…É•„°½¹Ñ¥Ù¥Ñäô¤ì(€€€™½È€¡½¹ÍÐ…ÑÑÈ½˜l¸¸¹•±•µ•¹ÐÈ¹…ÑÑÉ¥‰ÕÑ•Ít¤¥˜€¡…ÑÑÈ¹¹…µ”¹ÍÑ…ÉÑÍ]¥Ñ  ‰½¸ˆ¤¤•±•µ•¹ÐÈ¹É•µ½Ù•ÑÑÉ¥‰ÕÑ”¡…ÑÑÈ¹¹…µ”¤ì(€€€•±•µ•¹ÐÈ¹É•µ½Ù•ÑÑÉ¥‰ÕÑ” ‰½¹Ñ•¹Ñ•‘¥Ñ…‰±”ˆ¤ì(€€€•±•µ•¹ÐÈ¹¥¹¹•É!Q50€ô€ˆˆì(€€€½¹ÍÐÕÉÍ½É	Õ¥±‘•È€ô€¡ÕÍ•È¤€ôøì(€€€€€½¹ÍÐÕÉÍ½È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤°±…‰•°È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€ÕÉÍ½È¹±…ÍÍ9…µ”€ô€‰AÉ½Í•5¥ÉÉ½Èµå©ÌµÕÉÍ½Èˆì(€€€€€½¹ÍÐ½±½È€ô€½xlÀ´å„µ™uìÙô½¤¹Ñ•ÍÐ¡ÕÍ•È¹½±½È¤€üÕÍ•È¹½±½È€è€ˆŒÀÀÝÜÌˆì(€€€€€ÕÉÍ½È¹ÍÑå±”¹‰½É‘•É½±½È€ô½±½Èì(€€€€€±…‰•°È¹ÍÑå±”¹‰…­É½Õ¹‘½±½È€ô½±½Èì(€€€€€±…‰•°È¹Ñ•áÑ½¹Ñ•¹Ð€ôMÑÉ¥¹œ¡ÕÍ•È¹¹…µ”ñð€‰½±…‰½É…‘½Èˆ¤¹Í±¥” À°€àÀ¤ì(€€€€€ÕÉÍ½È¹…ÁÁ•¹¡±…‰•°È¤ì(€€€€€É•ÑÕÉ¸ÕÉÍ½Èì(€€€ôì(€€€½¹ÍÐÙ¥•Ü€ô¹•Ü‘¥Ñ½ÉY¥•Ü¡•±•µ•¹ÐÈ°ì(€€€€€ÍÑ…Ñ”è‘¥Ñ½ÉMÑ…Ñ”¹É•…Ñ”¡ìÍ¡•µ„°Á±Õ¥¹Ìèl(€€€€€€€åMå¹A±Õ¥¸¡™É…µ•¹Ð¤°(€€€€€€€åÕÉÍ½ÉA±Õ¥¸¡…Ý…É•¹•ÍÌ°ìÕÉÍ½É	Õ¥±‘•È°…Ý…É•¹•ÍÍMÑ…Ñ•¥±Ñ•Èè€¡±½…±%°±¥•¹Ñ%°ÍÑ…Ñ”¤€ôø±½…±%€„ôô±¥•¹Ñ%€˜˜ÍÑ…Ñ”¹™¥•±€ôôô™¥•±ô¤°(€€€€€€€åU¹‘½A±Õ¥¸ ¤°(€€€€€€€­•åµ…À¡ì(€€€€€€€€€€‰5½µèˆèÕ¹‘¼°(€€€€€€€€€€‰5½µäˆèÉ•‘¼°(€€€€€€€€€€‰5½µM¡¥™ÐµèˆèÉ•‘¼°(€€€€€€€€€€‰5½µˆˆèÑ½±•5…É¬¡Í¡•µ„¹µ…É­Ì¹ÍÑÉ½¹œ¤°(€€€€€€€€€€‰5½µ¤ˆèÑ½±•5…É¬¡Í¡•µ„¹µ…É­Ì¹•´¤°(€€€€€€€€€¹Ñ•Èè€¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤€ôøÍÁ±¥Ñ1¥ÍÑ%Ñ•´¡Í¡•µ„¹¹½‘•Ì¹±¥ÍÑ}¥Ñ•´¤¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤°(€€€€€€€€€€‰5½µlˆè±¥™Ñ1¥ÍÑ%Ñ•´¡Í¡•µ„¹¹½‘•Ì¹±¥ÍÑ}¥Ñ•´¤(€€€€€€€ô¤°(€€€€€€€­•åµ…À¡‰…Í•-•åµ…À¤(€€€€€tô¤°(€€€€€•‘¥Ñ…‰±”°(€€€€€…ÑÑÉ¥‰ÕÑ•Ìèì€‰…É¥„µ±…‰•°ˆè•±•µ•¹ÐÈ¹•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ±…‰•°ˆ¤ñð€‰Q•áÑ¼‘•°½µÕ¹¥…‘¼ˆ°€‰É½±”ˆè€‰Ñ•áÑ‰½àˆ°€‰…É¥„µµÕ±Ñ¥±¥¹”ˆè€‰ÑÉÕ”ˆô°(€€€€€¡…¹‘±•=5Ù•¹ÑÌèì™½ÕÌè€ ¤€ôøì(€€€€€€€…Ý…É•¹•ÍÌ¹Í•Ñ1½…±MÑ…Ñ•¥•± ‰™¥•±ˆ°™¥•±¤ì(€€€€€€€…Ý…É•¹•ÍÌ¹Í•Ñ1½…±MÑ…Ñ•¥•± ‰…É•„ˆ°…É•„ñð€‰Q•áÑ¼‘•°½µÕ¹¥…‘¼ˆ¤ì(€€€€€€€…Ý…É•¹•ÍÌ¹Í•Ñ1½…±MÑ…Ñ•¥•± ‰µ½‘”ˆ°€‰ÕÉÍ½Èˆ¤ì(€€€€€€€½¹Ñ¥Ù¥Ñäü¸ ¤ì(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€ôô°(€€€€€‘¥ÍÁ…Ñ¡QÉ…¹Í…Ñ¥½¸¡ÑÉ…¹Í…Ñ¥½¸¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹¥Í•ÍÑÉ½å•¤É•ÑÕÉ¸ì(€€€€€€€Ñ¡¥Ì¹ÕÁ‘…Ñ•MÑ…Ñ”¡Ñ¡¥Ì¹ÍÑ…Ñ”¹…ÁÁ±ä¡ÑÉ…¹Í…Ñ¥½¸¤¤ì(€€€€€€€¥˜€¡ÑÉ…¹Í…Ñ¥½¸¹‘½¡…¹•¤ÅÕ•Õ•5¥É½Ñ…Í¬¡½¹¡…¹”¤ì(€€€€€ô(€€€ô¤ì(€€€É•ÑÕÉ¸Ù¥•Üì(€ô(€™Õ¹Ñ¥½¸É¥¡½µµ…¹¡Ù¥•Ü°½µµ…¹°Ù…±Õ”¤ì(€€€½¹ÍÐìÍÑ…Ñ”°‘¥ÍÁ…Ñ ô€ôÙ¥•Üì(€€€½¹ÍÐµ…É¬€ôì‰½±è€‰ÍÑÉ½¹œˆ°¥Ñ…±¥Œè€‰•´ˆ°Õ¹‘•É±¥¹”è€‰Õ¹‘•É±¥¹”ˆõm½µµ…¹‘tì(€€€¥˜€¡µ…É¬¤Ñ½±•5…É¬¡Í¡•µ„¹µ…É­Ímµ…É­t¤¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤ì(€€€•±Í”¥˜€¡½µµ…¹€ôôô€‰™½Éµ…Ñ	±½¬ˆ¤Í•Ñ	±½­QåÁ”È¡Ù…±Õ”€ôôô€‰Àˆ€üÍ¡•µ„¹¹½‘•Ì¹Á…É…É…Á €èÍ¡•µ„¹¹½‘•Ì¹¡•…‘¥¹œ°ì±•Ù•°è€Ìô¤¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤ì(€€€•±Í”¥˜€¡½µµ…¹€ôôô€‰¥¹Í•ÉÑU¹½É‘•É•‘1¥ÍÐˆñð½µµ…¹€ôôô€‰¥¹Í•ÉÑ=É‘•É•‘1¥ÍÐˆ¤ì(€€€€€½¹ÍÐ±¥ÍÐ€ô½µµ…¹€ôôô€‰¥¹Í•ÉÑU¹½É‘•É•‘1¥ÍÐˆ€üÍ¡•µ„¹¹½‘•Ì¹‰Õ±±•Ñ}±¥ÍÐ€èÍ¡•µ„¹¹½‘•Ì¹½É‘•É•‘}±¥ÍÐì(€€€€€±•Ð¥¹M…µ•1¥ÍÐ€ô™…±Í”ì(€€€€€™½È€¡±•Ð‘•ÁÑ €ôÍÑ…Ñ”¹Í•±•Ñ¥½¸¸‘™É½´¹‘•ÁÑ ì‘•ÁÑ €ø€Àì‘•ÁÑ ´´¤¥˜€¡ÍÑ…Ñ”¹Í•±•Ñ¥½¸¸‘™É½´¹¹½‘”¡‘•ÁÑ ¤¹ÑåÁ”€ôôô±¥ÍÐ¤ì(€€€€€€€¥¹M…µ•1¥ÍÐ€ôÑÉÕ”ì(€€€€€€€‰É•…¬ì(€€€€€ô(€€€€€¥˜€¡¥¹M…µ•1¥ÍÐ¤±¥™Ñ1¥ÍÑ%Ñ•´¡Í¡•µ„¹¹½‘•Ì¹±¥ÍÑ}¥Ñ•´¤¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤ì(€€€€€•±Í”ÝÉ…Á%¹1¥ÍÐ¡±¥ÍÐ¤¡ÍÑ…Ñ”°‘¥ÍÁ…Ñ ¤ì(€€€ô•±Í”¥˜€¡½µµ…¹€ôôô€‰™½É•½±½Èˆ€˜˜€½xlÀ´å„µ™uìÙô½¤¹Ñ•ÍÐ¡Ù…±Õ”¤¤ì(€€€€€½¹ÍÐì™É½´è™É½´È°Ñ¼°•µÁÑäè•µÁÑäÈô€ôÍÑ…Ñ”¹Í•±•Ñ¥½¸°´€ôÍ¡•µ„¹µ…É­Ì¹½±½È¹É•…Ñ”¡ì½±½ÈèÙ…±Õ”ô¤ì(€€€€€‘¥ÍÁ…Ñ ¡•µÁÑäÈ€üÍÑ…Ñ”¹ÑÈ¹…‘‘MÑ½É•‘5…É¬¡´¤€èÍÑ…Ñ”¹ÑÈ¹…‘‘5…É¬¡™É½´È°Ñ¼°´¤¤ì(€€€ô•±Í”¥˜€¡½µµ…¹€ôôô€‰É•µ½Ù•½Éµ…Ðˆ¤‘¥ÍÁ…Ñ ¡ÍÑ…Ñ”¹ÑÈ¹É•µ½Ù•5…É¬¡ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´°ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼¤¹Í•ÑMÑ½É•‘5…É­Ì¡mt¤¤ì(€€€Ù¥•Ü¹™½ÕÌ ¤ì(€ô(€™Õ¹Ñ¥½¸…‘‘½µµ•¹Ñ5…É¬¡Ù¥•Ü°¥È¤ì(€€€½¹ÍÐì™É½´è™É½´È°Ñ¼°•µÁÑäè•µÁÑäÈô€ôÙ¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸ì(€€€¥˜€¡•µÁÑäÈ¤É•ÑÕÉ¸€ˆˆì(€€€½¹ÍÐÅÕ½Ñ”€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹Ñ•áÑ	•ÑÝ••¸¡™É½´È°Ñ¼°€ˆ€ˆ°€ˆ€ˆ¤¹É•Á±…” ½qÌ¬½œ°€ˆ€ˆ¤¹ÑÉ¥´ ¤ì(€€€¥˜€ …ÅÕ½Ñ”¤É•ÑÕÉ¸€ˆˆì(€€€Ù¥•Ü¹‘¥ÍÁ…Ñ ¡Ù¥•Ü¹ÍÑ…Ñ”¹ÑÈ¹…‘‘5…É¬¡™É½´È°Ñ¼°Í¡•µ„¹µ…É­Ì¹½µµ•¹Ð¹É•…Ñ”¡ì¥è¥Èô¤¤¹ÍÉ½±±%¹Ñ½Y¥•Ü ¤¤ì(€€€É•ÑÕÉ¸ÅÕ½Ñ”ì(€ô((€€¼¼¥µ…•Ì¹©Ì(€Ù…ÈÁ¡½Ñ½-•åÌ€ô€¼¨}}AUI}|€¨¼¹•ÜM•Ð¡l‰ÍÉŒˆ°€‰Á¡½Ñ¼ˆ°€‰¡•É½%µ…”ˆ°€‰…ÕÑ¡½ÉA¡½Ñ¼‰t¤ì(€…Íå¹Œ™Õ¹Ñ¥½¸½ÁÑ¥µ¥é•M¡…É¥¹%µ…•Ì¡‘É…™Ð°ìµ…á¥µ•¹Í¥½¸€ô€ÈÐÀÀ°ÅÕ…±¥Ñä€ô€À¸ä°½¹Ù•ÉÐ€ôÉ•Í¥é•%µ…”°ÁÉ½É•ÍÌ€ô€ ¤€ôøì(€ô°Ù…±¥€ô€ ¤€ôøÑÉÕ”ô€ôíô¤ì(€€€½¹ÍÐ½ÁäÔ€ôÍÑÉÕÑÕÉ•‘±½¹”¡‘É…™Ð¤°¥µ…•Ì€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤ì(€€€™Õ¹Ñ¥½¸½±±•Ð¡Ù…±Õ”°Á…Ñ €ômt¤ì(€€€€€¥˜€ …Ù…±Õ”ñðÑåÁ•½˜Ù…±Õ”€„ôô€‰½‰©•Ðˆ¤É•ÑÕÉ¸ì(€€€€€™½È€¡½¹ÍÐm­•ä°¥Ñ•µt½˜=‰©•Ð¹•¹ÑÉ¥•Ì¡Ù…±Õ”¤¤ì(€€€€€€€¥˜€¡ÑåÁ•½˜¥Ñ•´€ôôô€‰ÍÑÉ¥¹œˆ€˜˜Á¡½Ñ½-•åÌ¹¡…Ì¡­•ä¤€˜˜€½y‘…Ñ„é¥µ…•p¼¡Á¹ñ©Á•ñÝ•‰À¤í‰…Í”ØÐ°½¤¹Ñ•ÍÐ¡¥Ñ•´¤€˜˜¥Ñ•´¹±•¹Ñ €ø€ÌÕ”Ð€˜˜€…Á…Ñ ¹Í½µ” ¡Á…ÉÐ¤€ôø€½Í¥¹…ÑÕÉ•ñÅÉñ±½¼½¤¹Ñ•ÍÐ¡Á…ÉÐ¤¤¤ì(€€€€€€€€€¥˜€ …¥µ…•Ì¹¡…Ì¡¥Ñ•´¤¤¥µ…•Ì¹Í•Ð¡¥Ñ•´°mt¤ì(€€€€€€€€€¥µ…•Ì¹•Ð¡¥Ñ•´¤¹ÁÕÍ ¡ìÙ…±Õ”°­•äô¤ì(€€€€€€€ô•±Í”¥˜€¡¥Ñ•´€˜˜ÑåÁ•½˜¥Ñ•´€ôôô€‰½‰©•Ðˆ¤½±±•Ð¡¥Ñ•´°l¸¸¹Á…Ñ °­•åt¤ì(€€€€€ô(€€€ô(€€€½±±•Ð¡½ÁäÔ¤ì(€€€±•Ð½µÁ±•Ñ•€ô€Àì(€€€™½È€¡½¹ÍÐm¥µ…”°™¥•±‘Ít½˜¥µ…•Ì¤ì(€€€€€¥˜€ …Ù…±¥ ¤¤Ñ¡É½ÜÉÉ½È ‰M”…¹•±qáÌ±„ÁÉ•Á…É…¥qáÍ¸‘•°½µÕ¹¥…‘¼¸ˆ¤ì(€€€€€½¹ÍÐ½ÁÑ¥µ¥é•€ô…Ý…¥Ð½¹Ù•ÉÐ¡¥µ…”°ìµ…á¥µ•¹Í¥½¸°ÅÕ…±¥Ñäô¤ì(€€€€€¥˜€ …Ù…±¥ ¤¤Ñ¡É½ÜÉÉ½È ‰M”…¹•±qáÌ±„ÁÉ•Á…É…¥qáÍ¸‘•°½µÕ¹¥…‘¼¸ˆ¤ì(€€€€€¥˜€¡ÑåÁ•½˜½ÁÑ¥µ¥é•€ôôô€‰ÍÑÉ¥¹œˆ€˜˜½ÁÑ¥µ¥é•¹ÍÑ…ÉÑÍ]¥Ñ  ‰‘…Ñ„é¥µ…”¼ˆ¤€˜˜½ÁÑ¥µ¥é•¹±•¹Ñ €ð¥µ…”¹±•¹Ñ ¤(€€€€€€€™¥•±‘Ì¹™½É…  ¡ìÙ…±Õ”°­•äô¤€ôøì(€€€€€€€€€Ù…±Õ•m­•åt€ô½ÁÑ¥µ¥é•ì(€€€€€€€ô¤ì(€€€€€ÁÉ½É•ÍÌ ¬­½µÁ±•Ñ•°¥µ…•Ì¹Í¥é”¤ì(€€€ô(€€€É•ÑÕÉ¸½ÁäÔì(€ô(€…Íå¹Œ™Õ¹Ñ¥½¸É•Í¥é•%µ…”¡Í½ÕÉ”°ìµ…á¥µ•¹Í¥½¸°ÅÕ…±¥Ñäô¤ì(€€€½¹ÍÐ¥µ…”€ô¹•Ü%µ…” ¤ì(€€€¥µ…”¹‘•½‘¥¹œ€ô€‰…Íå¹Œˆì(€€€¥µ…”¹ÍÉŒ€ôÍ½ÕÉ”ì(€€€…Ý…¥Ð¥µ…”¹‘•½‘” ¤ì(€€€½¹ÍÐÍ…±”€ô5…Ñ ¹µ¥¸ Ä°µ…á¥µ•¹Í¥½¸€¼5…Ñ ¹µ…à¡¥µ…”¹¹…ÑÕÉ…±]¥‘Ñ °¥µ…”¹¹…ÑÕÉ…±!•¥¡Ð¤¤ì(€€€½¹ÍÐ…¹Ù…Ì€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰…¹Ù…Ìˆ¤ì(€€€…¹Ù…Ì¹Ý¥‘Ñ €ô5…Ñ ¹µ…à Ä°5…Ñ ¹É½Õ¹¡¥µ…”¹¹…ÑÕÉ…±]¥‘Ñ €¨Í…±”¤¤ì(€€€…¹Ù…Ì¹¡•¥¡Ð€ô5…Ñ ¹µ…à Ä°5…Ñ ¹É½Õ¹¡¥µ…”¹¹…ÑÕÉ…±!•¥¡Ð€¨Í…±”¤¤ì(€€€ÑÉäì(€€€€€½¹ÍÐ½¹Ñ•áÐ€ô…¹Ù…Ì¹•Ñ½¹Ñ•áÐ ˆÉˆ¤ì(€€€€€¥˜€ …½¹Ñ•áÐ¤Ñ¡É½ÜÉÉ½È ‰9¼Í”ÁÕ‘¼ÁÉ•Á…É…ÈÕ¹„¥µ…•¸¸QÔ½É¥¥¹…°Í”½¹Í•ÉÙ„¸ˆ¤ì(€€€€€½¹Ñ•áÐ¹¥µ…•Mµ½½Ñ¡¥¹¹…‰±•€ôÑÉÕ”ì(€€€€€½¹Ñ•áÐ¹¥µ…•Mµ½½Ñ¡¥¹EÕ…±¥Ñä€ô€‰¡¥ ˆì(€€€€€½¹Ñ•áÐ¹‘É…Ý%µ…”¡¥µ…”°€À°€À°…¹Ù…Ì¹Ý¥‘Ñ °…¹Ù…Ì¹¡•¥¡Ð¤ì(€€€€€É•ÑÕÉ¸…¹Ù…Ì¹Ñ½…Ñ…UI0 ‰¥µ…”½Ý•‰Àˆ°ÅÕ…±¥Ñä¤ì(€€€ô™¥¹…±±äì(€€€€€…¹Ù…Ì¹Ý¥‘Ñ €ô…¹Ù…Ì¹¡•¥¡Ð€ô€Äì(€€€€€¥µ…”¹ÍÉŒ€ô€ˆˆì(€€€ô(€ô((€€¼¼‰É½ÝÍ•È¹©Ì(€Ù…È½ÁäÐ€ô€¡Ù…±Õ”¤€ôø)M=8¹Á…ÉÍ”¡)M=8¹ÍÑÉ¥¹¥™ä¡Ù…±Õ”¤¤ì(€Ù…È½±½ÉÌ€ôlˆŒÀÀÝÜÌˆ°€ˆŒÀÀÑ„àØˆ°€ˆŒØÜÀÀàÐˆ°€ˆÑ˜ÀÀˆ°€ˆŒÉ„äÈÀÀ‰tì(€Ù…È±…‰•°€ô€¡É½±”¤€ôø€¡ì½Ý¹•Èè€‰AÉ½Á¥•Ñ…É¥¼ˆ°•‘¥Ñ½Èè€‰AÕ•‘”•‘¥Ñ…Èˆ°Ù¥•Ý•Èè€‰AÕ•‘”±••Èˆô¥mÉ½±•tñð€‰M¥¸…•Í¼ˆì(€Ù…ÈÉ¥¡	±½­Ì€ô€¡¤€ôø€¡¹‰±½­Ìñðmt¤¹™±…Ñ5…À ¡ˆ¤€ôøˆ¹ÑåÁ”€ôôô€‰…É‘Ìˆ€üˆ¹…É‘Ìñðmt€èl‰Ñ•áÐˆ°€‰ÅÕ½Ñ”ˆ°€‰™•…ÑÕÉ”‰t¹¥¹±Õ‘•Ì¡ˆ¹ÑåÁ”¤€üm‰t€èmt¤ì(€Ù…ÈÍÑÉ¥ÁÁ•€ô€¡¤€ôøì(€€€½¹ÍÐÙ…±Õ”€ô½ÁäÐ¡¤ì(€€€É¥¡	±½­Ì¡Ù…±Õ”¤¹™½É…  ¡ˆ¤€ôøì(€€€€€‘•±•Ñ”ˆ¹É¥¡!Ñµ°ì(€€€€€‘•±•Ñ”ˆ¹½¹Ñ•¹Ðì(€€€ô¤ì(€€€¥˜€¡Ù…±Õ”¹­¥¹€ôôô€‰…Ù¥Í¼ˆ¤ì(€€€€€‘•±•Ñ”Ù…±Õ”¹¹½Ñ¥•I¥¡!Ñµ°ì(€€€€€‘•±•Ñ”Ù…±Õ”¹¹½Ñ¥•5•ÍÍ…”ì(€€€ô(€€€É•ÑÕÉ¸Ù…±Õ”ì(€ôì(€™Õ¹Ñ¥½¸‘¥…±½œ¡Ñ¥Ñ±”¤ì(€€€‘½Õµ•¹Ð¹•Ñ±•µ•¹Ñ	å% ‰½µµÌµÍ¡…É¥¹œˆ¤ü¹É•µ½Ù” ¤ì(€€€½¹ÍÐ•°€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥…±½œˆ¤ì(€€€•°¹¥€ô€‰½µµÌµÍ¡…É¥¹œˆì(€€€•°¹±…ÍÍ9…µ”€ô€‰½µµÌµÍ¡…É”µ‘¥…±½œˆì(€€€½¹ÍÐ¡•…‘•È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰¡•…‘•Èˆ¤°¡•…‘¥¹œ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ Èˆ¤°±½Í”Ì€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰ÕÑÑ½¸ˆ¤ì(€€€¡•…‘¥¹œ¹¥€ô€‰½µµÌµÍ¡…É¥¹œµÑ¥Ñ±”ˆì(€€€¡•…‘¥¹œ¹Ñ•áÑ½¹Ñ•¹Ð€ôÑ¥Ñ±”ì(€€€•°¹Í•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ±…‰•±±•‘‰äˆ°¡•…‘¥¹œ¹¥¤ì(€€€±½Í”Ì¹±…ÍÍ9…µ”€ô€‰¥½¸µ‰Ñ¸ˆì(€€€±½Í”Ì¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰qáÜˆì(€€€±½Í”Ì¹Ñ¥Ñ±”€ô€‰•ÉÉ…Èˆì(€€€±½Í”Ì¹Í•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ±…‰•°ˆ°€‰•ÉÉ…Èˆ¤ì(€€€±½Í”Ì¹½¹±¥¬€ô€ ¤€ôø•°¹±½Í” ¤ì(€€€¡•…‘•È¹…ÁÁ•¹¡¡•…‘¥¹œ°±½Í”Ì¤ì(€€€•°¹…ÁÁ•¹¡¡•…‘•È¤ì(€€€‘½Õµ•¹Ð¹‰½‘ä¹…ÁÁ•¹¡•°¤ì(€€€•°¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰±½Í”ˆ°€ ¤€ôø•°¹É•µ½Ù” ¤°ì½¹”èÑÉÕ”ô¤ì(€€€•°¹Í¡½Ý5½‘…° ¤ì(€€€É•ÑÕÉ¸•°ì(€ô(€™Õ¹Ñ¥½¸µ•ÍÍ…”¡•°°Ù…±Õ”°•ÉÉ½È€ô™…±Í”¤ì(€€€•°¹ÅÕ•ÉåM•±•Ñ½È ‰m‘…Ñ„µµ•ÍÍ…•tˆ¤ü¹É•µ½Ù” ¤ì(€€€½¹ÍÐ¹½‘”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Àˆ¤ì(€€€¹½‘”¹‘…Ñ…Í•Ð¹µ•ÍÍ…”€ô€ˆˆì(€€€¹½‘”¹Í•ÑÑÑÉ¥‰ÕÑ” ‰É½±”ˆ°•ÉÉ½È€ü€‰…±•ÉÐˆ€è€‰ÍÑ…ÑÕÌˆ¤ì(€€€¹½‘”¹Ñ•áÑ½¹Ñ•¹Ð€ôÙ…±Õ”ì(€€€•°¹…ÁÁ•¹¡¹½‘”¤ì(€ô(€Ù…ÈÍ¡½ÉÑQ•áÐ€ô€¡Ù…±Õ”¤€ôøMÑÉ¥¹œ¡Ù…±Õ”ñð€ˆˆ¤¹É•Á±…” ½qÌ¬½œ°€ˆ€ˆ¤¹ÑÉ¥´ ¤¹Í±¥” À°€àÀ¤ì(€Ù…È¥¹¥Ñ¥…±Ì€ô€¡Ù…±Õ”¤€ôøÍ¡½ÉÑQ•áÐ¡Ù…±Õ”¤¹ÍÁ±¥Ð ˆ€ˆ¤¹™¥±Ñ•È¡	½½±•…¸¤¹Í±¥” À°€È¤¹µ…À ¡Á…ÉÐ¤€ôøÁ…ÉÑlÁtü¹Ñ½UÁÁ•É…Í” ¤¤¹©½¥¸ ˆˆ¤ñð€‰M$ˆì(€Ù…ÈÍ…™•½±½È€ô€¡Ù…±Õ”°™…±±‰…¬€ô€ˆŒÀÀÝÜÌˆ¤€ôø€½xlÀ´å„µ™uìÙô½¤¹Ñ•ÍÐ¡Ù…±Õ”ñð€ˆˆ¤€üÙ…±Õ”€è™…±±‰…¬ì(€Ù…ÈÍÑ…‰±•-•ä€ô€¡Ù…±Õ”¤€ôøì(€€€±•Ð¡…Í €ô€ÈÄØØÄÌØÈØÄì(€€€™½È€¡½¹ÍÐ¡…È½˜MÑÉ¥¹œ¡Ù…±Õ”¤¤ì(€€€€€¡…Í xô¡…È¹¡…É½‘•Ð À¤ì(€€€€€¡…Í €ô5…Ñ ¹¥µÕ°¡¡…Í °€ÄØÜÜÜØÄä¤ì(€€€ô(€€€É•ÑÕÉ¸€¡¡…Í €øøø€À¤¹Ñ½MÑÉ¥¹œ ÌØ¤ì(€ôì(€™Õ¹Ñ¥½¸…É•…9…µ”¡•±•µ•¹ÐÈ°¥¹‘•à€ô€À¤ì(€€€½¹ÍÐ™¥•±€ô•±•µ•¹ÐÈ¹±½Í•ÍÐ ˆ¹µ•µ¼µ™¥•±°¹¥¹Ù¥Ñ”µ¥µ…”µ½¹ÑÉ½°°¹Í¥µÁ±”µ¥¹Ù¥Ñ”µ‰…¹¹•Èµ½¹ÑÉ½°ˆ¤ì(€€€½¹ÍÐ™¥•±‘1…‰•°€ô™¥•±ü¹ÅÕ•ÉåM•±•Ñ½È ‰±…‰•°±ÍÁ…¸ˆ¤ì(€€€¥˜€¡Í¡½ÉÑQ•áÐ¡™¥•±‘1…‰•°ü¹Ñ•áÑ½¹Ñ•¹Ð¤¤É•ÑÕÉ¸Í¡½ÉÑQ•áÐ¡™¥•±‘1…‰•°¹Ñ•áÑ½¹Ñ•¹Ð¤ì(€€€½¹ÍÐ‰±½¬€ô•±•µ•¹ÐÈ¹±½Í•ÍÐ ˆ¹µ•µ¼µ‰±½¬°¹¥¹Ù¥Ñ”µ…Éµ½ÕÑ±¥¹”°¹¥¹Ù¥Ñ”µ¥Ñ•´µ•‘¥Ñ½Èˆ¤ì(€€€½¹ÍÐ‰±½­1…‰•°€ô‰±½¬ü¹ÅÕ•ÉåM•±•Ñ½È ˆ¹µ•µ¼µ‰±½¬µ­¥¹°¹¥¹Ù¥Ñ”µ…ÉµÑ½±”ˆ°¹¥¹Ù¥Ñ”µ¥Ñ•´µ•‘¥Ñ½Èµ¡•…ˆˆ¤ì(€€€¥˜€¡Í¡½ÉÑQ•áÐ¡‰±½­1…‰•°ü¹Ñ•áÑ½¹Ñ•¹Ð¤¤É•ÑÕÉ¸Í¡½ÉÑQ•áÐ¡‰±½­1…‰•°¹Ñ•áÑ½¹Ñ•¹Ð¤ì(€€€½¹ÍÐÍ•Ñ¥½¸€ô•±•µ•¹ÐÈ¹±½Í•ÍÐ ˆ¹µ•µ¼µ™½É´µÍ•Ñ¥½¸ˆ¤ì(€€€½¹ÍÐÍ•Ñ¥½¹1…‰•°€ôÍ•Ñ¥½¸ü¹ÅÕ•ÉåM•±•Ñ½È ˆ¹µ•µ¼µ™½É´µÍ•Ñ¥½¸µÑ¥Ñ±”ˆ¤ì(€€€É•ÑÕÉ¸Í¡½ÉÑQ•áÐ¡•±•µ•¹ÐÈ¹•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ±…‰•°ˆ¤ñð•±•µ•¹ÐÈ¹•ÑÑÑÉ¥‰ÕÑ” ‰Á±…•¡½±‘•Èˆ¤ñðÍ•Ñ¥½¹1…‰•°ü¹Ñ•áÑ½¹Ñ•¹Ð¤ñðqáÅÉ•„€‘í¥¹‘•à€¬€Åõ€ì(€ô(€™Õ¹Ñ¥½¸½¹ÑÉ½±-•ä¡•±•µ•¹ÐÈ°¥¹‘•à€ô€À¤ì(€€€½¹ÍÐ‰•¡…Ù¥½È€ôl‰¥ˆ°€‰¹…µ”ˆ°€‰½¹¥¹ÁÕÐˆ°€‰½¹¡…¹”ˆ°€‰½¹±¥¬‰t¹µ…À ¡¹…µ”¤€ôø•±•µ•¹ÐÈ¹•ÑÑÑÉ¥‰ÕÑ”¡¹…µ”¤ñð€ˆˆ¤¹©½¥¸ ‰ðˆ¤ì(€€€½¹ÍÐ½¹Ñ•áÐ€ô•±•µ•¹ÐÈ¹±½Í•ÍÐ ‰m‘…Ñ„µ¥¹Ù¥Ñ…Ñ¥½¸µ…É‘t±m‘…Ñ„µ™±½Üµ‰±½­tˆ¤ü¹•ÑÑÑÉ¥‰ÕÑ” ‰‘…Ñ„µ¥¹Ù¥Ñ…Ñ¥½¸µ…Éˆ¤ñð•±•µ•¹ÐÈ¹±½Í•ÍÐ ‰m‘…Ñ„µ™±½Üµ‰±½­tˆ¤ü¹•ÑÑÑÉ¥‰ÕÑ” ‰‘…Ñ„µ™±½Üµ‰±½¬ˆ¤ñð€ˆˆì(€€€É•ÑÕÉ¸€‰½¹ÑÉ½°èˆ€¬ÍÑ…‰±•-•ä¡‰•¡…Ù¥½È€¬€‰ðˆ€¬½¹Ñ•áÐ€¬€‰ðˆ€¬…É•…9…µ”¡•±•µ•¹ÐÈ°¥¹‘•à¤€¬€‰ðˆ€¬•±•µ•¹ÐÈ¹Ñ…9…µ”€¬€‰ðˆ€¬€¡•±•µ•¹ÐÈ¹•ÑÑÑÉ¥‰ÕÑ” ‰ÑåÁ”ˆ¤ñð€ˆˆ¤¤ì(€ô(€™Õ¹Ñ¥½¸¥¹ÍÑ…±°¡…Á¤¤ì(€€€±•ÐÍ•ÍÍ¥½¸€ô¹Õ±°°É•¹‘•É¥¹œ€ô™…±Í”°‘•™•ÉÉ•€ô™…±Í”°Í¡…É¥¹œ€ô™…±Í”°¡½µ•I•ÅÕ•ÍÐ€ô€À°¡½µ•=‰Í•ÉÙ•È€ô¹Õ±°°ÁÉ•Ù¥•ÝÑ¥Ù”€ô€Àì(€€€½¹ÍÐÙ¥•ÝÌ€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤°¥¹ÁÕÑ±•…¹ÕÁÌ€ômt°±½­•‘±•µ•¹ÑÌ€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤ì(€€€½¹ÍÐÁÉ•Ù¥•Ý…¡”€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤°ÁÉ•Ù¥•ÝA•¹‘¥¹œ€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤°ÁÉ•Ù¥•ÝEÕ•Õ”€ômtì(€€€½¹ÍÐ•Ñ½Õ¹Ð€ô€ ¤€ôø…Á¤¹…½Õ¹Ð ¤ü¹¥ì(€€€½¹ÍÐÉÁŒ€ô…Íå¹Œ€¡¹…µ”°…ÉÌÈ€ôíô¤€ôøì(€€€€€½¹ÍÐ…½Õ¹Ð€ô•Ñ½Õ¹Ð ¤ì(€€€€€¥˜€ ……½Õ¹Ð¤Ñ¡É½ÜÉÉ½È ‰%¹¥¥„Í•Í¥qáÍ¸Á…É„½¹Ñ¥¹Õ…È¸ˆ¤ì(€€€€€½¹ÍÐì‘…Ñ„°•ÉÉ½Èô€ô…Ý…¥Ð…Á¤¹ÉÁŒ¡¹…µ”°…ÉÌÈ¤ì(€€€€€¥˜€¡•Ñ½Õ¹Ð ¤€„ôô…½Õ¹Ð¤Ñ¡É½Ü=‰©•Ð¹…ÍÍ¥¸¡ÉÉ½È ‰1„Í•Í¥qáÍ¸…µ‰¥qáÌ¸ˆ¤°ì½‘”è€ˆÐÈÔÀÄˆô¤ì(€€€€€¥˜€¡•ÉÉ½È¤Ñ¡É½Ü•ÉÉ½Èì(€€€€€É•ÑÕÉ¸‘…Ñ„ì(€€€ôì(€€€½¹ÍÐ…Ñ¥Ù”€ô€ ¤€ôøì(€€€€€¥˜€¡Í•ÍÍ¥½¸€˜˜Í•ÍÍ¥½¸¹…½Õ¹Ð€„ôô•Ñ½Õ¹Ð ¤¤ì(€€€€€€€ÍÑ½À ¤ì(€€€€€€€…Á¤¹ÕÉÉ•¹Ð¡¹Õ±°¤ì(€€€€€€€…Á¤¹±•…ÉA…” ‰1„Í•Í¥qáÍ¸…µ‰¥qáÌ¸ˆ¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸€„…Í•ÍÍ¥½¸ì(€€€ôì(€€€½¹ÍÐ•‘¥Ñ…‰±”€ô€ ¤€ôø…Ñ¥Ù” ¤€˜˜€…Í•ÍÍ¥½¸¹‰±½­•€˜˜l‰½Ý¹•Èˆ°€‰•‘¥Ñ½È‰t¹¥¹±Õ‘•Ì¡Í•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹É½±”¤ì(€€€½¹ÍÐ‘•ÍÑÉ½åY¥•ÝÌ€ô€ ¤€ôøì(€€€€€Ù¥•ÝÌ¹™½É…  ¡Ù¥•Ü¤€ôøÙ¥•Ü¹‘•ÍÑÉ½ä ¤¤ì(€€€€€Ù¥•ÝÌ¹±•…È ¤ì(€€€€€¥¹ÁÕÑ±•…¹ÕÁÌ¹ÍÁ±¥” À¤¹™½É…  ¡±•…¸¤€ôø±•…¸ ¤¤ì(€€€ôì(€€€½¹ÍÐÉ•…‘5½‘•°€ô€¡µ½‘•°¤€ôøì(€€€€€½¹ÍÐ€ôµ½‘•°¹É•… ¤ì(€€€€€É¥¡	±½­Ì¡¤¹™½É…  ¡ˆ¤€ôø=‰©•Ð¹…ÍÍ¥¸¡ˆ°É•…‘I¥ ¡µ½‘•°¹‘½Œ¹•Ñaµ±É…µ•¹Ð ‰É¥ èˆ€¬ˆ¹¥¤¤¤¤ì(€€€€€¥˜€¡¹­¥¹€ôôô€‰…Ù¥Í¼ˆ¤ì(€€€€€€€½¹ÍÐÉ¥ €ôÉ•…‘I¥ ¡µ½‘•°¹‘½Œ¹•Ñaµ±É…µ•¹Ð ‰É¥ é¹½Ñ¥”µµ•ÍÍ…”ˆ¤°ÑÉÕ”¤ì(€€€€€€€¹¹½Ñ¥•I¥¡!Ñµ°€ôÉ¥ ¹É¥¡!Ñµ°ì(€€€€€€€¹¹½Ñ¥•5•ÍÍ…”€ôÉ¥ ¹½¹Ñ•¹Ðì(€€€€€ô(€€€€€É•ÑÕÉ¸ì(€€€ôì(€€€½¹ÍÐÉ•…€ô€ ¤€ôøÉ•…‘5½‘•°¡Í•ÍÍ¥½¸¹µ½‘•°¤ì(€€€½¹ÍÐÁÉ•Á…É•I¥ €ô€¡µ½‘•°°¤€ôøì(€€€€€É¥¡	±½­Ì¡¤¹™½É…  ¡ˆ¤€ôøÍ••‘I¥ ¡µ½‘•°¹‘½Œ¹•Ñaµ±É…µ•¹Ð ‰É¥ èˆ€¬ˆ¹¥¤°…Á¤¹É¥¡!Ñµ°¡ˆ¤¤¤ì(€€€€€¥˜€¡¹­¥¹€ôôô€‰…Ù¥Í¼ˆ¤Í••‘I¥ ¡µ½‘•°¹‘½Œ¹•Ñaµ±É…µ•¹Ð ‰É¥ é¹½Ñ¥”µµ•ÍÍ…”ˆ¤°…Á¤¹¹½Ñ¥•!Ñµ°¡¤¤ì(€€€ôì(€€€½¹ÍÐ…ÁÑÕÉ”€ô€ ¤€ôøì(€€€€€¥˜€ …•‘¥Ñ…‰±” ¤¤É•ÑÕÉ¸™…±Í”ì(€€€€€½¹ÍÐ€ô…Á¤¹ÕÉÉ•¹Ð ¤ì(€€€€€¥˜€ …ñð¹¥€„ôôÍ•ÍÍ¥½¸¹Í½ÕÉ”¤É•ÑÕÉ¸™…±Í”ì(€€€€€ÁÉ•Á…É•I¥ ¡Í•ÍÍ¥½¸¹µ½‘•°°¤ì(€€€€€½¹ÍÐ¹•áÐ€ôÍÑÉ¥ÁÁ•¡¤ì(€€€€€Í•ÍÍ¥½¸¹µ½‘•°¹…ÁÁ±ä¡Í•ÍÍ¥½¸¹‰…Í•±¥¹”°¹•áÐ¤ì(€€€€€Í•ÍÍ¥½¸¹‰…Í•±¥¹”€ô½ÁäÐ¡¹•áÐ¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ôì(€€€½¹ÍÐÍÑ…ÑÕÌ€ô€¡Ñ•áÐÈ°‰±½­•€ô™…±Í”¤€ôøì(€€€€€¥˜€ …Í•ÍÍ¥½¸¤É•ÑÕÉ¸ì(€€€€€Í•ÍÍ¥½¸¹‰±½­•€ô‰±½­•ì(€€€€€‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½É±° ˆµ•µ¼µÍ…Ù”µÍÑ…Ñ”±m‘…Ñ„µ½±±…ˆµÍÑ…ÑÕÍtˆ¤¹™½É…  ¡•°¤€ôø€¡•°¹ÅÕ•ÉåM•±•Ñ½È ‰ÍÁ…¸ˆ¤ñð•°¤¹Ñ•áÑ½¹Ñ•¹Ð€ôÑ•áÐÈ¤ì(€€€€€¥˜€¡Í•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹ÍÑ½ÁÁ•¤ì(€€€€€€€‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½È ˆ¹µ•µ¼µÕÍÑ½µ¥é•Èˆ¤ü¹Í•ÑÑÑÉ¥‰ÕÑ” ‰‘…Ñ„µ½±±…ˆµ‘¥Í½¹¹•Ñ•ˆ°€‰ÑÉÕ”ˆ¤ì(€€€€€€€Ù¥•ÝÌ¹™½É…  ¡Ù¥•Ü¤€ôøÙ¥•Ü¹Í•ÑAÉ½ÁÌ¡ì•‘¥Ñ…‰±”è€ ¤€ôø™…±Í”ô¤¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô(€€€€€¥˜€¡•‘¥Ñ…‰±” ¤¤ì(€€€€€€€±½­•‘±•µ•¹ÑÌ¹™½É…  ¡Ý…Í¥Í…‰±•°•°¤€ôøì(€€€€€€€€€¥˜€¡•°¹¥Í½¹¹•Ñ•¤•°¹‘¥Í…‰±•€ôÝ…Í¥Í…‰±•ì(€€€€€€€ô¤ì(€€€€€€€±½­•‘±•µ•¹ÑÌ¹±•…È ¤ì(€€€€€ô•±Í”‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½É±° ˆ¹µ•µ¼µ™½É´¥¹ÁÕÐ°¹µ•µ¼µ™½É´Ñ•áÑ…É•„°¹µ•µ¼µ™½É´‰ÕÑÑ½¸°¹µ•µ¼µ™½É´Í•±•Ð°¹µ•µ¼µÁ…¹•°µ¡•…€¹ÁµÍ•±•Ðµ‰Ñ¸ˆ¤¹™½É…  ¡•°¤€ôøì(€€€€€€€¥˜€ …•°¹±½Í•ÍÐ ˆ¹µ•µ¼µÍÑÕ‘¥¼µ…Ñ¥½¹Ìˆ¤¤ì(€€€€€€€€€¥˜€ …±½­•‘±•µ•¹ÑÌ¹¡…Ì¡•°¤¤±½­•‘±•µ•¹ÑÌ¹Í•Ð¡•°°•°¹‘¥Í…‰±•¤ì(€€€€€€€€€•°¹‘¥Í…‰±•€ôÑÉÕ”ì(€€€€€€€ô(€€€€€ô¤ì(€€€€€Ù¥•ÝÌ¹™½É…  ¡Ù¥•Ü¤€ôøÙ¥•Ü¹Í•ÑAÉ½ÁÌ¡ì•‘¥Ñ…‰±”ô¤¤ì(€€€ôì(€€€™Õ¹Ñ¥½¸ÍÑ½À¡±½Í•¥…±½œ€ôÑÉÕ”¤ì(€€€€€‘•ÍÑÉ½åY¥•ÝÌ ¤ì(€€€€€¥˜€¡Í•ÍÍ¥½¸¤ì(€€€€€€€½¹ÍÐÕÉÉ•¹Ð€ôÍ•ÍÍ¥½¸ì(€€€€€€€¥˜€ …ÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹ÍÑ½ÁÁ•¤ÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹±•…Ù” ¤¹…Ñ   ¤€ôøÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹ÍÑ½À ¤¤ì(€€€€€€€•±Í”ÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹ÍÑ½À ¤ì(€€€€€€€ÕÉÉ•¹Ð¹…Ý…É•¹•ÍÌ¹‘•ÍÑÉ½ä ¤ì(€€€€€€€ÕÉÉ•¹Ð¹µ½‘•°¹‘½Œ¹‘•ÍÑÉ½ä ¤ì(€€€€€ô(€€€€€Í•ÍÍ¥½¸€ô¹Õ±°ì(€€€€€‘•™•ÉÉ•€ô™…±Í”ì(€€€€€±½­•‘±•µ•¹ÑÌ¹±•…È ¤ì(€€€€€…Á¤¹±•…ÉM•±•Ñ½ÉÌ ¤ì(€€€€€¥˜€¡±½Í•¥…±½œ¤‘½Õµ•¹Ð¹•Ñ±•µ•¹Ñ	å% ‰½µµÌµÍ¡…É¥¹œˆ¤ü¹±½Í” ¤ì(€€€ô(€€€™Õ¹Ñ¥½¸…ÁÁ±åI•µ½Ñ”¡‘…Ñ„¤ì(€€€€€¥˜€ ……Ñ¥Ù” ¤¤É•ÑÕÉ¸ì(€€€€€½¹ÍÐÁÉ•Ù¥½ÕÌ€ô…Á¤¹ÕÉÉ•¹Ð ¤°¹•áÐ€ôÉ•… ¤ì(€€€€€…Á¤¹Ù…±¥‘…Ñ”¡¹•áÐ¤ì(€€€€€Í•ÍÍ¥½¸¹‰…Í•±¥¹”€ôÍÑÉ¥ÁÁ•¡¹•áÐ¤ì(€€€€€…Á¤¹ÕÉÉ•¹Ð¡¹•áÐ¤ì(€€€€€½¹ÍÐÍÑ…Ñ•Ì€ôÍ•ÍÍ¥½¸¹…Ý…É•¹•ÍÌ¹•ÑMÑ…Ñ•Ì ¤ì(€€€€€½¹ÍÐÍ••¸€ô€¼¨}}AUI}|€¨¼¹•ÜM•Ð¡mÍ•ÍÍ¥½¸¹µ½‘•°¹‘½Œ¹±¥•¹Ñ%t¤ì(€€€€€‘…Ñ„¹ÁÉ•Í•¹”¹™½É…  ¡Á•ÉÍ½¸¤€ôøì(€€€€€€€¥˜€¡Á•ÉÍ½¸¹Í•ÍÍ¥½¹}¥€ôôôÍ•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹Í•ÍÍ¥½¸¤É•ÑÕÉ¸ì(€€€€€€€ÑÉäì(€€€€€€€€€½¹ÍÐÍÑ…Ñ”€ô)M=8¹Á…ÉÍ”¡Á•ÉÍ½¸¹…Ý…É•¹•ÍÌ¤°¥È€ô9Õµ‰•È¡ÍÑ…Ñ”¹±¥•¹Ñ%¤ì(€€€€€€€€€¥˜€ …9Õµ‰•È¹¥ÍM…™•%¹Ñ••È¡¥È¤ñð¥È€ôôôÍ•ÍÍ¥½¸¹µ½‘•°¹‘½Œ¹±¥•¹Ñ%¤É•ÑÕÉ¸ì(€€€€€€€€€½¹ÍÐ¹…µ”€ôMÑÉ¥¹œ¡Á•ÉÍ½¸¹¹…µ”ñð€‰½±…‰½É…‘½Èˆ¤¹Í±¥” À°€àÀ¤°½±½È€ô½±½ÉÍm¥È€”½±½ÉÌ¹±•¹Ñ¡tì(€€€€€€€€€ÍÑ…Ñ•Ì¹Í•Ð¡¥È°ìÕÍ•Èèì¹…µ”°½±½Èô°™¥•±èÍÑ…Ñ”¹™¥•±°…É•„èÍÑ…Ñ”¹…É•„°µ½‘”èÍÑ…Ñ”¹µ½‘”°ÕÉÍ½ÈèÍÑ…Ñ”¹ÕÉÍ½Èô¤ì(€€€€€€€€€Í••¸¹…‘¡¥È¤ì(€€€€€€€ô…Ñ ì(€€€€€€€ô(€€€€€ô¤ì(€€€€€½¹ÍÐÉ•µ½Ù•€ômtì(€€€€€ÍÑ…Ñ•Ì¹™½É…  ¡}ÍÑ…Ñ”°¥È¤€ôøì(€€€€€€€¥˜€ …Í••¸¹¡…Ì¡¥È¤¤ì(€€€€€€€€€ÍÑ…Ñ•Ì¹‘•±•Ñ”¡¥È¤ì(€€€€€€€€€É•µ½Ù•¹ÁÕÍ ¡¥È¤ì(€€€€€€€ô(€€€€€ô¤ì(€€€€€Í•ÍÍ¥½¸¹…Ý…É•¹•ÍÌ¹•µ¥Ð ‰¡…¹”ˆ°mì…‘‘•èmt°ÕÁ‘…Ñ•èl¸¸¹Í••¹t°É•µ½Ù•ô°€‰É•µ½Ñ”‰t¤ì(€€€€€¥˜€¡ÁÉ•Ù¥½ÕÌ€˜˜)M=8¹ÍÑÉ¥¹¥™ä¡ÍÑÉ¥ÁÁ•¡ÁÉ•Ù¥½ÕÌ¤¤€„ôô)M=8¹ÍÑÉ¥¹¥™ä¡ÍÑÉ¥ÁÁ•¡¹•áÐ¤¤¤ì(€€€€€€€¥˜€¡‘½Õµ•¹Ð¹…Ñ¥Ù•±•µ•¹Ðü¹±½Í•ÍÐ ˆ¹µ•µ¼µ™½É´ˆ¤ñð‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½È ˆ¹µ•µ¼µ‘É…¥¹œˆ¤¤‘•™•ÉÉ•€ôÑÉÕ”ì(€€€€€€€•±Í”ì(€€€€€€€€€É•¹‘•É¥¹œ€ôÑÉÕ”ì(€€€€€€€€€ÑÉäì(€€€€€€€€€€€…Á¤¹É•¹‘•È ¤ì(€€€€€€€€€ô™¥¹…±±äì(€€€€€€€€€€€É•¹‘•É¥¹œ€ô™…±Í”ì(€€€€€€€€€ô(€€€€€€€ô(€€€€€ô(€€€€€…Á¤¹ÁÉ•Ù¥•Ü ¤ì(€€€€€Á…¥¹ÑAÉ•Í•¹”¡‘…Ñ„¹ÁÉ•Í•¹”¤ì(€€€ô(€€€½¹ÍÐ½µµ•¹ÑÌ€ô€ ¤€ôøÉÉ…ä¹¥ÍÉÉ…ä¡…Á¤¹ÕÉÉ•¹Ð ¤ü¹½µµ•¹ÑÌ¤€ü…Á¤¹ÕÉÉ•¹Ð ¤¹½µµ•¹ÑÌ€èmtì(€€€½¹ÍÐ…Ñ¥Ù•½µµ•¹ÑÌ€ô€ ¤€ôø½µµ•¹ÑÌ ¤¹™¥±Ñ•È ¡½µµ•¹Ð¤€ôø€…½µµ•¹Ð¹É•Í½±Ù•¤ì(€€€½¹ÍÐÍå¹½µµ•¹ÑÌ€ô€ ¤€ôøì(€€€€€…ÁÑÕÉ” ¤ì(€€€€€Í•ÍÍ¥½¸ü¹ÑÉ…¹ÍÁ½ÉÐ¹Íå¹Œ ¤¹…Ñ   ¤€ôøì(€€€€€ô¤ì(€€€ôì(€€€™Õ¹Ñ¥½¸½µµ•¹ÑÍ¥…±½œ¡™½ÕÍ%€ô€ˆˆ¤ì(€€€€€¥˜€ ……Ñ¥Ù” ¤¤É•ÑÕÉ¸ì(€€€€€½¹ÍÐ•°€ô‘¥…±½œ ‰½µ•¹Ñ…É¥½Ìˆ¤ì(€€€€€½¹ÍÐ¥¹ÑÉ¼€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Àˆ¤ì(€€€€€¥¹ÑÉ¼¹±…ÍÍ9…µ”€ô€‰½µµÌµ½±±…ˆµ±½¬ˆì(€€€€€¥¹ÑÉ¼¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰1½Ì½µ•¹Ñ…É¥½ÌÅÕ•‘…¸•¸•°•‘¥Ñ½Èä¹¼Í”¥¹±Õå•¸•¸±„Ù¥ÍÑ„ÁÉ•Ù¥„¹¤•¸±…Ì‘•Í…É…Ì¸ˆì(€€€€€•°¹…ÁÁ•¹¡¥¹ÑÉ¼¤ì(€€€€€½¹ÍÐ±¥ÍÐ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€±¥ÍÐ¹±…ÍÍ9…µ”€ô€‰½µµÌµ½µµ•¹Ðµ±¥ÍÐˆì(€€€€€•°¹…ÁÁ•¹¡±¥ÍÐ¤ì(€€€€€½¹ÍÐ¥Ñ•µÌ€ô½µµ•¹ÑÌ ¤ì(€€€€€¥˜€ …¥Ñ•µÌ¹±•¹Ñ ¤µ•ÍÍ…”¡•°°€‰M•±•¥½¹„Ñ•áÑ¼äÕÍ„½µ•¹Ñ…ÈÁ…É„¥¹¥¥…ÈÕ¹„½¹Ù•ÉÍ…¥qáÍ¸¸ˆ¤ì(€€€€€¥Ñ•µÌ¹™½É…  ¡½µµ•¹Ð¤€ôøì(€€€€€€€½¹ÍÐ…É€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰…ÉÑ¥±”ˆ¤ì(€€€€€€€…É¹±…ÍÍ9…µ”€ô€‰½µµÌµ½µµ•¹Ðµ…Éˆ€¬€¡½µµ•¹Ð¹É•Í½±Ù•€ü€ˆ¥ÌµÉ•Í½±Ù•ˆ€è€ˆˆ¤ì(€€€€€€€…É¹‘…Ñ…Í•Ð¹½µµ•¹Ñ%€ô½µµ•¹Ð¹¥ì(€€€€€€€½¹ÍÐµ•Ñ„€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€€€µ•Ñ„¹±…ÍÍ9…µ”€ô€‰½µµÌµ½µµ•¹Ðµµ•Ñ„ˆì(€€€€€€€½¹ÍÐ…ÕÑ¡½È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÑÉ½¹œˆ¤ì(€€€€€€€…ÕÑ¡½È¹Ñ•áÑ½¹Ñ•¹Ð€ô½µµ•¹Ð¹…ÕÑ¡½É9…µ”ñð€‰½±…‰½É…‘½Èˆì(€€€€€€€½¹ÍÐÑ¥µ”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Ñ¥µ”ˆ¤ì(€€€€€€€Ñ¥µ”¹Ñ•áÑ½¹Ñ•¹Ð€ô½µµ•¹Ð¹É•…Ñ•‘Ð€ü¹•Ü…Ñ”¡½µµ•¹Ð¹É•…Ñ•‘Ð¤¹Ñ½1½…±•MÑÉ¥¹œ ‰•ÌµPˆ¤€è€ˆˆì(€€€€€€€µ•Ñ„¹…ÁÁ•¹¡…ÕÑ¡½È°Ñ¥µ”¤ì(€€€€€€€½¹ÍÐÅÕ½Ñ”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰±½­ÅÕ½Ñ”ˆ¤ì(€€€€€€€ÅÕ½Ñ”¹Ñ•áÑ½¹Ñ•¹Ð€ô½µµ•¹Ð¹ÅÕ½Ñ”ñð€ˆˆì(€€€€€€€½¹ÍÐ‰½‘ä€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Àˆ¤ì(€€€€€€€‰½‘ä¹Ñ•áÑ½¹Ñ•¹Ð€ô½µµ•¹Ð¹‰½‘äñð€ˆˆì(€€€€€€€½¹ÍÐ…Ñ¥½¸€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰ÕÑÑ½¸ˆ¤ì(€€€€€€€…Ñ¥½¸¹ÑåÁ”€ô€‰‰ÕÑÑ½¸ˆì(€€€€€€€…Ñ¥½¸¹±…ÍÍ9…µ”€ô€‰‰Ñ¸‰Ñ¸µ¡½ÍÐ‰Ñ¸µÍ´ˆì(€€€€€€€…Ñ¥½¸¹Ñ•áÑ½¹Ñ•¹Ð€ô½µµ•¹Ð¹É•Í½±Ù•€ü€‰I•…‰É¥Èˆ€è€‰I•Í½±Ù•Èˆì(€€€€€€€…Ñ¥½¸¹½¹±¥¬€ô€ ¤€ôøì(€€€€€€€€€½µµ•¹Ð¹É•Í½±Ù•€ô€…½µµ•¹Ð¹É•Í½±Ù•ì(€€€€€€€€€½µµ•¹Ð¹É•Í½±Ù•‘Ð€ô½µµ•¹Ð¹É•Í½±Ù•€ü€ ¼¨}}AUI}|€¨¼¹•Ü…Ñ” ¤¤¹Ñ½%M=MÑÉ¥¹œ ¤€è€ˆˆì(€€€€€€€€€Íå¹½µµ•¹ÑÌ ¤ì(€€€€€€€€€•°¹±½Í” ¤ì(€€€€€€€€€…Á¤¹É•¹‘•È ¤ì(€€€€€€€€€ÅÕ•Õ•5¥É½Ñ…Í¬  ¤€ôø½µµ•¹ÑÍ¥…±½œ¡½µµ•¹Ð¹¥¤¤ì(€€€€€€€ôì(€€€€€€€…É¹…ÁÁ•¹¡µ•Ñ„°ÅÕ½Ñ”°‰½‘ä°…Ñ¥½¸¤ì(€€€€€€€±¥ÍÐ¹…ÁÁ•¹¡…É¤ì(€€€€€ô¤ì(€€€€€¥˜€¡™½ÕÍ%¤ÅÕ•Õ•5¥É½Ñ…Í¬  ¤€ôø•°¹ÅÕ•ÉåM•±•Ñ½È¡m‘…Ñ„µ½µµ•¹Ðµ¥ôˆ‘íML¹•Í…Á”¡™½ÕÍ%¥ô‰u€¤ü¹ÍÉ½±±%¹Ñ½Y¥•Ü¡ì‰±½¬è€‰•¹Ñ•Èˆô¤¤ì(€€€ô(€€€™Õ¹Ñ¥½¸…‘‘½µµ•¹Ð¡Ù¥•Ü°™¥•±¤ì(€€€€€¥˜€ …•‘¥Ñ…‰±” ¤¤É•ÑÕÉ¸ì(€€€€€½¹ÍÐÍ•±•Ñ•€ôÙ¥•Ü¹ÍÑ…Ñ”¹‘½Œ¹Ñ•áÑ	•ÑÝ••¸¡Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹™É½´°Ù¥•Ü¹ÍÑ…Ñ”¹Í•±•Ñ¥½¸¹Ñ¼°€ˆ€ˆ°€ˆ€ˆ¤¹É•Á±…” ½qÌ¬½œ°€ˆ€ˆ¤¹ÑÉ¥´ ¤ì(€€€€€¥˜€ …Í•±•Ñ•¤ì(€€€€€€€µ•ÍÍ…”¡‘¥…±½œ ‰É•…È½µ•¹Ñ…É¥¼ˆ¤°€‰M•±•¥½¹„ÁÉ¥µ•É¼•°Ñ•áÑ¼ÅÕ”ÅÕ¥•É•Ì½µ•¹Ñ…È¸ˆ°ÑÉÕ”¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô(€€€€€½¹ÍÐ•°€ô‘¥…±½œ ‰É•…È½µ•¹Ñ…É¥¼ˆ¤°™½É´€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰™½É´ˆ¤°ÅÕ½Ñ”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰±½­ÅÕ½Ñ”ˆ¤°±…‰•°È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰±…‰•°ˆ¤°Ñ•áÑ…É•„€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Ñ•áÑ…É•„ˆ¤°‰ÕÑÑ½¸€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰ÕÑÑ½¸ˆ¤ì(€€€€€ÅÕ½Ñ”¹Ñ•áÑ½¹Ñ•¹Ð€ôÍ•±•Ñ•ì(€€€€€±…‰•°È¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰½µ•¹Ñ…É¥¼ˆì(€€€€€Ñ•áÑ…É•„¹±…ÍÍ9…µ”€ô€‰½¹ÑÉ½°µ¥¹ÁÕÐˆì(€€€€€Ñ•áÑ…É•„¹¹…µ”€ô€‰‰½‘äˆì(€€€€€Ñ•áÑ…É•„¹É•ÅÕ¥É•€ôÑÉÕ”ì(€€€€€Ñ•áÑ…É•„¹É½ÝÌ€ô€Ðì(€€€€€±…‰•°È¹…ÁÁ•¹¡Ñ•áÑ…É•„¤ì(€€€€€‰ÕÑÑ½¸¹±…ÍÍ9…µ”€ô€‰‰Ñ¸‰Ñ¸µÁÉ¥µ…Éäˆì(€€€€€‰ÕÑÑ½¸¹ÑåÁ”€ô€‰ÍÕ‰µ¥Ðˆì(€€€€€‰ÕÑÑ½¸¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰½µ•¹Ñ…Èˆì(€€€€€™½É´¹…ÁÁ•¹¡ÅÕ½Ñ”°±…‰•°È°‰ÕÑÑ½¸¤ì(€€€€€•°¹…ÁÁ•¹¡™½É´¤ì(€€€€€Ñ•áÑ…É•„¹™½ÕÌ ¤ì(€€€€€™½É´¹½¹ÍÕ‰µ¥Ð€ô€¡•Ù•¹Ð¤€ôøì(€€€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€€€€€½¹ÍÐ¥È€ô€‰½µµ•¹Ð´ˆ€¬ÉåÁÑ¼¹É…¹‘½µUU% ¤°µ…É­•€ô…‘‘½µµ•¹Ñ5…É¬¡Ù¥•Ü°¥È¤ì(€€€€€€€¥˜€ …µ…É­•¤ì(€€€€€€€€€µ•ÍÍ…”¡•°°€‰1„Í•±•¥qáÍ¸å„¹¼•ÍÑqáÄ‘¥ÍÁ½¹¥‰±”¸YÕ•±Ù”„Í•±•¥½¹…È•°Ñ•áÑ¼¸ˆ°ÑÉÕ”¤ì(€€€€€€€€€É•ÑÕÉ¸ì(€€€€€€€ô(€€€€€€€½¹ÍÐ¥‘•¹Ñ¥ÑäÈ€ô…Á¤¹…½Õ¹Ð ¤ñðíôì(€€€€€€€½¹ÍÐÕÉÉ•¹Ð€ô…Á¤¹ÕÉÉ•¹Ð ¤ì(€€€€€€€ÕÉÉ•¹Ð¹½µµ•¹ÑÌ€ôÉÉ…ä¹¥ÍÉÉ…ä¡ÕÉÉ•¹Ð¹½µµ•¹ÑÌ¤€üÕÉÉ•¹Ð¹½µµ•¹ÑÌ€èmtì(€€€€€€€ÕÉÉ•¹Ð¹½µµ•¹ÑÌ¹ÁÕÍ ¡ì¥è¥È°™¥•±°ÅÕ½Ñ”èµ…É­•°‰½‘äèÑ•áÑ…É•„¹Ù…±Õ”¹ÑÉ¥´ ¤°…ÕÑ¡½É%è¥‘•¹Ñ¥ÑäÈ¹¥ñð€ˆˆ°…ÕÑ¡½É9…µ”è¥‘•¹Ñ¥ÑäÈ¹¹…µ”ñð€‰½±…‰½É…‘½Èˆ°…ÕÑ¡½Éµ…¥°è¥‘•¹Ñ¥ÑäÈ¹•µ…¥°ñð€ˆˆ°É•…Ñ•‘Ðè€ ¼¨}}AUI}|€¨¼¹•Ü…Ñ” ¤¤¹Ñ½%M=MÑÉ¥¹œ ¤°É•Í½±Ù•è™…±Í”ô¤ì(€€€€€€€Íå¹½µµ•¹ÑÌ ¤ì(€€€€€€€•°¹±½Í” ¤ì(€€€€€€€…Á¤¹É•¹‘•È ¤ì(€€€€€ôì(€€€ô(€€€™Õ¹Ñ¥½¸ÁÉ•Í•¹•I½ÝÌ¡Á•½Á±”€ômt¤ì(€€€€€½¹ÍÐÉ½ÝÌ€ômt°±½…°€ô…Á¤¹…½Õ¹Ð ¤ñðíô°±½…±MÑ…Ñ”€ôÍ•ÍÍ¥½¸¹…Ý…É•¹•ÍÌ¹•Ñ1½…±MÑ…Ñ” ¤ñðíôì(€€€€€É½ÝÌ¹ÁÕÍ ¡ì­•äè€‰±½…°ˆ°ÕÍ•É%è±½…°¹¥ñð€ˆˆ°¹…µ”è±½…°¹¹…µ”ñð€‰Qqáˆ°Í•±˜èÑÉÕ”°½±½ÈèÍ…™•½±½È¡±½…±MÑ…Ñ”¹ÕÍ•Èü¹½±½È¤°…É•„èÍ¡½ÉÑQ•áÐ¡±½…±MÑ…Ñ”¹…É•„¤ñð€‰½Õµ•¹Ñ¼ˆ°™¥•±è±½…±MÑ…Ñ”¹™¥•±ñð€‰‘½Õµ•¹Ðˆ°µ½‘”è±½…±MÑ…Ñ”¹µ½‘”ñð€‰…É•„ˆô¤ì(€€€€€™½È€¡½¹ÍÐÁ•ÉÍ½¸½˜Á•½Á±”¤ì(€€€€€€€¥˜€¡Á•ÉÍ½¸¹Í•ÍÍ¥½¹}¥€ôôôÍ•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹Í•ÍÍ¥½¸¤½¹Ñ¥¹Õ”ì(€€€€€€€ÑÉäì(€€€€€€€€€½¹ÍÐÍÑ…Ñ”€ô)M=8¹Á…ÉÍ”¡Á•ÉÍ½¸¹…Ý…É•¹•ÍÌñð€‰íôˆ¤°±¥•¹Ñ%€ô9Õµ‰•È¡ÍÑ…Ñ”¹±¥•¹Ñ%¤ì(€€€€€€€€€¥˜€ …9Õµ‰•È¹¥ÍM…™•%¹Ñ••È¡±¥•¹Ñ%¤¤½¹Ñ¥¹Õ”ì(€€€€€€€€€É½ÝÌ¹ÁÕÍ ¡ì(€€€€€€€€€€€­•äèÁ•ÉÍ½¸¹Í•ÍÍ¥½¹}¥ñðMÑÉ¥¹œ¡±¥•¹Ñ%¤°(€€€€€€€€€€€ÕÍ•É%èÁ•ÉÍ½¸¹ÕÍ•É}¥ñð€ˆˆ°(€€€€€€€€€€€¹…µ”èÍ¡½ÉÑQ•áÐ¡Á•ÉÍ½¸¹¹…µ”¤ñð€‰½±…‰½É…‘½Èˆ°(€€€€€€€€€€€Í•±˜è™…±Í”°(€€€€€€€€€€€½±½Èè½±½ÉÍm±¥•¹Ñ%€”½±½ÉÌ¹±•¹Ñ¡t°(€€€€€€€€€€€…É•„èÍ¡½ÉÑQ•áÐ¡ÍÑ…Ñ”¹…É•„¤ñð€‰½Õµ•¹Ñ¼ˆ°(€€€€€€€€€€€™¥•±èÍÑ…Ñ”¹™¥•±ñð€‰‘½Õµ•¹Ðˆ°(€€€€€€€€€€€µ½‘”èÍÑ…Ñ”¹µ½‘”ñð€‰…É•„ˆ°(€€€€€€€€€€€Í••¹ÐèÁ•ÉÍ½¸¹Í••¹}…Ðñð€ˆˆ(€€€€€€€€€ô¤ì(€€€€€€€ô…Ñ ì(€€€€€€€ô(€€€€€ô(€€€€€½¹ÍÐÕ¹¥ÅÕ”€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤ì(€€€€€™½È€¡½¹ÍÐÉ½Ü½˜É½ÝÌ¤ì(€€€€€€€½¹ÍÐ­•ä€ôÉ½Ü¹Í•±˜€ü€‰±½…°ˆ€èÉ½Ü¹ÕÍ•É%ñðÉ½Ü¹­•ä°ÁÉ•Ù¥½ÕÌ€ôÕ¹¥ÅÕ”¹•Ð¡­•ä¤ì(€€€€€€€¥˜€ …ÁÉ•Ù¥½ÕÌñðMÑÉ¥¹œ¡É½Ü¹Í••¹Ð¤€øMÑÉ¥¹œ¡ÁÉ•Ù¥½ÕÌ¹Í••¹Ð¤¤Õ¹¥ÅÕ”¹Í•Ð¡­•ä°É½Ü¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸l¸¸¹Õ¹¥ÅÕ”¹Ù…±Õ•Ì ¥tì(€€€ô(€€€™Õ¹Ñ¥½¸É•½É‘AÉ•Í•¹•Ù•¹ÑÌ¡É½ÝÌ¤ì(€€€€€½¹ÍÐ¹•áÐ€ô¹•Ü5…À¡É½ÝÌ¹™¥±Ñ•È ¡É½Ü¤€ôø€…É½Ü¹Í•±˜¤¹µ…À ¡É½Ü¤€ôømÉ½Ü¹­•ä°É½Ýt¤¤ì(€€€€€¥˜€¡Í•ÍÍ¥½¸¹ÁÉ•Í•¹•I•…‘ä¤ì(€€€€€€€¹•áÐ¹™½É…  ¡É½Ü°­•ä¤€ôøì(€€€€€€€€€¥˜€ …Í•ÍÍ¥½¸¹ÁÉ•Í•¹•M•ÍÍ¥½¹Ì¹¡…Ì¡­•ä¤¤Í•ÍÍ¥½¸¹•Ù•¹ÑÌ¹Õ¹Í¡¥™Ð¡ìÑ•áÐè€‘íÉ½Ü¹¹…µ•ô•¹ÑÉqáÌ…°‘½Õµ•¹Ñ½€°…Ðè€¼¨}}AUI}|€¨¼¹•Ü…Ñ” ¤°­¥¹è€‰©½¥¸ˆô¤ì(€€€€€€€ô¤ì(€€€€€€€Í•ÍÍ¥½¸¹ÁÉ•Í•¹•M•ÍÍ¥½¹Ì¹™½É…  ¡É½Ü°­•ä¤€ôøì(€€€€€€€€€¥˜€ …¹•áÐ¹¡…Ì¡­•ä¤¤Í•ÍÍ¥½¸¹•Ù•¹ÑÌ¹Õ¹Í¡¥™Ð¡ìÑ•áÐè€‘íÉ½Ü¹¹…µ•ôÍ…±¥qáÌ‘•°‘½Õµ•¹Ñ½€°…Ðè€¼¨}}AUI}|€¨¼¹•Ü…Ñ” ¤°­¥¹è€‰±•…Ù”ˆô¤ì(€€€€€€€ô¤ì(€€€€€€€Í•ÍÍ¥½¸¹•Ù•¹ÑÌ€ôÍ•ÍÍ¥½¸¹•Ù•¹ÑÌ¹Í±¥” À°€ÄÈ¤ì(€€€€€ô•±Í”Í•ÍÍ¥½¸¹ÁÉ•Í•¹•I•…‘ä€ôÑÉÕ”ì(€€€€€Í•ÍÍ¥½¸¹ÁÉ•Í•¹•M•ÍÍ¥½¹Ì€ô¹•áÐì(€€€ô(€€€™Õ¹Ñ¥½¸Á…¥¹ÑI•µ½Ñ•É•…Ì¡É½ÝÌ¤ì(€€€€€½¹ÍÐÁ…¹•°€ô‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½È ˆ¹µ•µ¼µÕÍÑ½µ¥é•Èˆ¤ì(€€€€€¥˜€ …Á…¹•°¤É•ÑÕÉ¸ì(€€€€€Á…¹•°¹ÅÕ•ÉåM•±•Ñ½É±° ˆ¹½µµÌµÉ•µ½Ñ”µ…É•„ˆ¤¹™½É…  ¡•°¤€ôø•°¹±…ÍÍ1¥ÍÐ¹É•µ½Ù” ‰½µµÌµÉ•µ½Ñ”µ…É•„ˆ¤¤ì(€€€€€Á…¹•°¹ÅÕ•ÉåM•±•Ñ½É±° ‰m‘…Ñ„µÉ•µ½Ñ”µÁÉ•Í•¹•tˆ¤¹™½É…  ¡•°¤€ôø•°¹É•µ½Ù” ¤¤ì(€€€€€½¹ÍÐÉ½ÕÁ•€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤ì(€€€€€É½ÝÌ¹™¥±Ñ•È ¡É½Ü¤€ôø€…É½Ü¹Í•±˜€˜˜É½Ü¹™¥•±€˜˜É½Ü¹™¥•±€„ôô€‰‘½Õµ•¹Ðˆ¤¹™½É…  ¡É½Ü¤€ôøì(€€€€€€€½¹ÍÐ±¥ÍÐ€ôÉ½ÕÁ•¹•Ð¡É½Ü¹™¥•±¤ñðmtì(€€€€€€€±¥ÍÐ¹ÁÕÍ ¡É½Ü¤ì(€€€€€€€É½ÕÁ•¹Í•Ð¡É½Ü¹™¥•±°±¥ÍÐ¤ì(€€€€€ô¤ì(€€€€€É½ÕÁ•¹™½É…  ¡…Ñ¥Ù•I½ÝÌ°™¥•±¤€ôøì(€€€€€€€½¹ÍÐÑ…É•Ð€ôl¸¸¹Á…¹•°¹ÅÕ•ÉåM•±•Ñ½É±° ‰m‘…Ñ„µ½±±…ˆµ­•åtˆ¥t¹™¥¹ ¡•±•µ•¹ÐÈ¤€ôø•±•µ•¹ÐÈ¹‘…Ñ…Í•Ð¹½±±…‰-•ä€ôôô™¥•±¤ì(€€€€€€€¥˜€ …Ñ…É•Ð¤É•ÑÕÉ¸ì(€€€€€€€½¹ÍÐ…É•„€ôÑ…É•Ð¹±½Í•ÍÐ ˆ¹µ•µ¼µ‰±½¬°¹¥¹Ù¥Ñ”µ…Éµ½ÕÑ±¥¹”°¹¥¹Ù¥Ñ”µ¥Ñ•´µ•‘¥Ñ½È°¹µ•µ¼µ™¥•±°¹µ•µ¼µ™½É´µÍ•Ñ¥½¸ˆ¤ñðÑ…É•Ðì(€€€€€€€…É•„¹±…ÍÍ1¥ÍÐ¹…‘ ‰½µµÌµÉ•µ½Ñ”µ…É•„ˆ¤ì(€€€€€€€…É•„¹ÍÑå±”¹Í•ÑAÉ½Á•ÉÑä ˆ´µÉ•µ½Ñ”µ½±½Èˆ°Í…™•½±½È¡…Ñ¥Ù•I½ÝÍlÁt¹½±½È¤¤ì(€€€€€€€½¹ÍÐ‰…‘”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€€€‰…‘”¹‘…Ñ…Í•Ð¹É•µ½Ñ•AÉ•Í•¹”€ô€ˆˆì(€€€€€€€‰…‘”¹±…ÍÍ9…µ”€ô€‰½µµÌµÉ•µ½Ñ”µ‰…‘”ˆì(€€€€€€€‰…‘”¹ÍÑå±”¹Í•ÑAÉ½Á•ÉÑä ˆ´µÉ•µ½Ñ”µ½±½Èˆ°Í…™•½±½È¡…Ñ¥Ù•I½ÝÍlÁt¹½±½È¤¤ì(€€€€€€€‰…‘”¹Ñ•áÑ½¹Ñ•¹Ð€ô…Ñ¥Ù•I½ÝÌ¹µ…À ¡É½Ü¤€ôøÉ½Ü¹¹…µ”¤¹©½¥¸ ˆ°€ˆ¤ì(€€€€€€€…É•„¹…ÁÁ•¹¡‰…‘”¤ì(€€€€€ô¤ì(€€€ô(€€€™Õ¹Ñ¥½¸Á•ÉÍ½¹9½‘”¡É½Ü¤ì(€€€€€½¹ÍÐ¥Ñ•´€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€¥Ñ•´¹±…ÍÍ9…µ”€ô€‰½µµÌµ½±±…ˆµÁ•ÉÍ½¸ˆì(€€€€€¥Ñ•´¹ÍÑå±”¹Í•ÑAÉ½Á•ÉÑä ˆ´µÁ•ÉÍ½¸µ½±½Èˆ°Í…™•½±½È¡É½Ü¹½±½È¤¤ì(€€€€€½¹ÍÐ…Ù…Ñ…È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€…Ù…Ñ…È¹±…ÍÍ9…µ”€ô€‰½µµÌµ½±±…ˆµ…Ù…Ñ…Èˆì(€€€€€…Ù…Ñ…È¹Í•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ¡¥‘‘•¸ˆ°€‰ÑÉÕ”ˆ¤ì(€€€€€…Ù…Ñ…È¹Ñ•áÑ½¹Ñ•¹Ð€ô¥¹¥Ñ¥…±Ì¡É½Ü¹¹…µ”¤ì(€€€€€½¹ÍÐÑ•áÐÈ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤°¹…µ”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÑÉ½¹œˆ¤°…É•„€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Íµ…±°ˆ¤ì(€€€€€¹…µ”¹Ñ•áÑ½¹Ñ•¹Ð€ôÉ½Ü¹Í•±˜€ü€‰Qqáˆ€èÉ½Ü¹¹…µ”ì(€€€€€…É•„¹Ñ•áÑ½¹Ñ•¹Ð€ôÉ½Ü¹…É•„ì(€€€€€Ñ•áÐÈ¹…ÁÁ•¹¡¹…µ”°…É•„¤ì(€€€€€¥Ñ•´¹…ÁÁ•¹¡…Ù…Ñ…È°Ñ•áÐÈ¤ì(€€€€€É•ÑÕÉ¸¥Ñ•´ì(€€€ô(€€€™Õ¹Ñ¥½¸ÁÉ•Í•¹•¥…±½œ ¤ì(€€€€€¥˜€ ……Ñ¥Ù” ¤¤É•ÑÕÉ¸ì(€€€€€½¹ÍÐ•°€ô‘¥…±½œ ‰A•ÉÍ½¹…Ì•¸•ÍÑ”½µÕ¹¥…‘¼ˆ¤°É½ÝÌ€ôÍ•ÍÍ¥½¸¹ÁÉ•Í•¹•I½ÝÌñðmtì(€€€€€½¹ÍÐ¥¹ÑÉ¼€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Àˆ¤ì(€€€€€¥¹ÑÉ¼¹±…ÍÍ9…µ”€ô€‰½µµÌµ½±±…ˆµ±½¬ˆì(€€€€€¥¹ÑÉ¼¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰1„Õ‰¥…¥qáÍ¸Í”…ÑÕ…±¥é„µ¥•¹ÑÉ…Ì…‘„Á•ÉÍ½¹„ÑÉ…‰…©„¸¸±½Ì‰±½ÅÕ•Ì‘”Ñ•áÑ¼Ñ…µ‰¥qáå¸Ù•ÉqáÅÌÍÔÕÉÍ½ÈäÍ•±•¥qáÍ¸¸ˆì(€€€€€•°¹…ÁÁ•¹¡¥¹ÑÉ¼¤ì(€€€€€½¹ÍÐ±¥ÍÐ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€±¥ÍÐ¹±…ÍÍ9…µ”€ô€‰½µµÌµÁÉ•Í•¹”µ±¥ÍÐˆì(€€€€€É½ÝÌ¹™½É…  ¡É½Ü¤€ôøì(€€€€€€€½¹ÍÐ…É€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€€€…É¹±…ÍÍ9…µ”€ô€‰½µµÌµÁÉ•Í•¹”µ…Éˆì(€€€€€€€…É¹…ÁÁ•¹¡Á•ÉÍ½¹9½‘”¡É½Ü¤¤ì(€€€€€€€½¹ÍÐÍÑ…Ñ”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€€€ÍÑ…Ñ”¹±…ÍÍ9…µ”€ô€‰½µµÌµÁÉ•Í•¹”µ½¹±¥¹”ˆì(€€€€€€€ÍÑ…Ñ”¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰¸±qá¹•„ˆì(€€€€€€€…É¹…ÁÁ•¹¡ÍÑ…Ñ”¤ì(€€€€€€€±¥ÍÐ¹…ÁÁ•¹¡…É¤ì(€€€€€ô¤ì(€€€€€•°¹…ÁÁ•¹¡±¥ÍÐ¤ì(€€€€€½¹ÍÐ¡•…‘¥¹œ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ Ìˆ¤ì(€€€€€¡•…‘¥¹œ¹±…ÍÍ9…µ”€ô€‰½µµÌµÁÉ•Í•¹”µ¡•…‘¥¹œˆì(€€€€€¡•…‘¥¹œ¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰Ñ¥Ù¥‘…É•¥•¹Ñ”ˆì(€€€€€•°¹…ÁÁ•¹¡¡•…‘¥¹œ¤ì(€€€€€½¹ÍÐ•Ù•¹ÑÌ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰½°ˆ¤ì(€€€€€•Ù•¹ÑÌ¹±…ÍÍ9…µ”€ô€‰½µµÌµÁÉ•Í•¹”µ•Ù•¹ÑÌˆì(€€€€€¥˜€ …Í•ÍÍ¥½¸¹•Ù•¹ÑÌ¹±•¹Ñ ¤ì(€€€€€€€½¹ÍÐ•µÁÑäÈ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰±¤ˆ¤ì(€€€€€€€•µÁÑäÈ¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰qá¸¹¼¡…ä•¹ÑÉ…‘…Ì¼Í…±¥‘…Ì‘ÕÉ…¹Ñ”•ÍÑ„Í•Í¥qáÍ¸¸ˆì(€€€€€€€•Ù•¹ÑÌ¹…ÁÁ•¹¡•µÁÑäÈ¤ì(€€€€€ô(€€€€€Í•ÍÍ¥½¸¹•Ù•¹ÑÌ¹™½É…  ¡•Ù•¹Ð¤€ôøì(€€€€€€€½¹ÍÐ¥Ñ•´€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰±¤ˆ¤ì(€€€€€€€½¹ÍÐÑ¥µ”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Ñ¥µ”ˆ¤ì(€€€€€€€Ñ¥µ”¹Ñ•áÑ½¹Ñ•¹Ð€ô•Ù•¹Ð¹…Ð¹Ñ½1½…±•Q¥µ•MÑÉ¥¹œ ‰•ÌµPˆ°ì¡½ÕÈè€ˆÈµ‘¥¥Ðˆ°µ¥¹ÕÑ”è€ˆÈµ‘¥¥Ðˆô¤ì(€€€€€€€¥Ñ•´¹…ÁÁ•¹¡‘½Õµ•¹Ð¹É•…Ñ•Q•áÑ9½‘”¡•Ù•¹Ð¹Ñ•áÐ€¬€ˆ€ˆ¤°Ñ¥µ”¤ì(€€€€€€€•Ù•¹ÑÌ¹…ÁÁ•¹¡¥Ñ•´¤ì(€€€€€ô¤ì(€€€€€•°¹…ÁÁ•¹¡•Ù•¹ÑÌ¤ì(€€€ô(€€€™Õ¹Ñ¥½¸Á…¥¹ÑAÉ•Í•¹”¡Á•½Á±”€ômt¤ì(€€€€€½¹ÍÐ‰…È€ô‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½È ˆ¹½µµÌµ½±±…ˆµ‰…Èˆ¤ì(€€€€€¥˜€ …‰…Èñð€…Í•ÍÍ¥½¸¤É•ÑÕÉ¸ì(€€€€€½¹ÍÐÉ½ÝÌ€ôÁÉ•Í•¹•I½ÝÌ¡Á•½Á±”¤ì(€€€€€É•½É‘AÉ•Í•¹•Ù•¹ÑÌ¡É½ÝÌ¤ì(€€€€€Í•ÍÍ¥½¸¹ÁÉ•Í•¹•I½ÝÌ€ôÉ½ÝÌì(€€€€€Í•ÍÍ¥½¸¹±…ÍÑAÉ•Í•¹”€ôÁ•½Á±”ì(€€€€€‰…È¹É•Á±…•¡¥±‘É•¸ ¤ì(€€€€€½¹ÍÐ½±±…‰½É…Ñ½ÉÌ€ôÉ½ÝÌ¹™¥±Ñ•È ¡É½Ü¤€ôø€…É½Ü¹Í•±˜¤°Á•½Á±•	ÕÑÑ½¸€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰ÕÑÑ½¸ˆ¤ì(€€€€€Á•½Á±•	ÕÑÑ½¸¹ÑåÁ”€ô€‰‰ÕÑÑ½¸ˆì(€€€€€Á•½Á±•	ÕÑÑ½¸¹±…ÍÍ9…µ”€ô€‰½µµÌµ½±±…ˆµÁ•½Á±”ˆì(€€€€€Á•½Á±•	ÕÑÑ½¸¹‘…Ñ…Í•Ð¹ÁÉ•Í•¹•A…¹•°€ô€ˆˆì(€€€€€Á•½Á±•	ÕÑÑ½¸¹Í•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ±…‰•°ˆ°½±±…‰½É…Ñ½ÉÌ¹±•¹Ñ €ü€‘í½±±…‰½É…Ñ½ÉÌ¹±•¹Ñ¡ô€‘í½±±…‰½É…Ñ½ÉÌ¹±•¹Ñ €ôôô€Ä€ü€‰½±…‰½É…‘½È½¹•Ñ…‘¼ˆ€è€‰½±…‰½É…‘½É•Ì½¹•Ñ…‘½Ì‰õ€€è€‰M½±¼Ñqá•ÍÑqáÅÌ•¸•ÍÑ”½µÕ¹¥…‘¼ˆ¤ì(€€€€€Á•½Á±•	ÕÑÑ½¸¹½¹±¥¬€ôÁÉ•Í•¹•¥…±½œì(€€€€€½±±…‰½É…Ñ½ÉÌ¹Í±¥” À°€Ì¤¹™½É…  ¡É½Ü¤€ôøÁ•½Á±•	ÕÑÑ½¸¹…ÁÁ•¹¡Á•ÉÍ½¹9½‘”¡É½Ü¤¤¤ì(€€€€€¥˜€¡½±±…‰½É…Ñ½ÉÌ¹±•¹Ñ €ø€Ì¤ì(€€€€€€€½¹ÍÐµ½É”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€€€µ½É”¹±…ÍÍ9…µ”€ô€‰½µµÌµ½±±…ˆµµ½É”ˆì(€€€€€€€µ½É”¹Ñ•áÑ½¹Ñ•¹Ð€ô€¬‘í½±±…‰½É…Ñ½ÉÌ¹±•¹Ñ €´€Íõ€ì(€€€€€€€Á•½Á±•	ÕÑÑ½¸¹…ÁÁ•¹¡µ½É”¤ì(€€€€€ô•±Í”¥˜€ …½±±…‰½É…Ñ½ÉÌ¹±•¹Ñ ¤ì(€€€€€€€½¹ÍÐ…±½¹”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€€€…±½¹”¹±…ÍÍ9…µ”€ô€‰½µµÌµ½±±…ˆµ…±½¹”ˆì(€€€€€€€…±½¹”¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰M½±¼Ñqáˆì(€€€€€€€Á•½Á±•	ÕÑÑ½¸¹…ÁÁ•¹¡…±½¹”¤ì(€€€€€ô(€€€€€‰…È¹…ÁÁ•¹¡Á•½Á±•	ÕÑÑ½¸¤ì(€€€€€Á…¥¹ÑI•µ½Ñ•É•…Ì¡É½ÝÌ¤ì(€€€ô(€€€™Õ¹Ñ¥½¸Í•ÑÑ¥Ù¥Ñä¡™¥•±°…É•„°µ½‘”€ô€‰…É•„ˆ¤ì(€€€€€¥˜€ ……Ñ¥Ù” ¤¤É•ÑÕÉ¸ì(€€€€€Í•ÍÍ¥½¸¹…Ý…É•¹•ÍÌ¹Í•Ñ1½…±MÑ…Ñ”¡ì€¸¸¹Í•ÍÍ¥½¸¹…Ý…É•¹•ÍÌ¹•Ñ1½…±MÑ…Ñ” ¤°™¥•±°…É•„èÍ¡½ÉÑQ•áÐ¡…É•„¤ñð€‰½Õµ•¹Ñ¼ˆ°µ½‘”ô¤ì(€€€€€Á…¥¹ÑAÉ•Í•¹”¡Í•ÍÍ¥½¸¹±…ÍÑAÉ•Í•¹”ñðmt¤ì(€€€€€Í•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹Íå¹Œ ¤¹…Ñ   ¤€ôøì(€€€€€ô¤ì(€€€ô(€€€…Íå¹Œ™Õ¹Ñ¥½¸½Á•¸¡¥È¤ì(€€€€€¥˜€¡…Ñ¥Ù” ¤€˜˜Í•ÍÍ¥½¸¹¥€ôôô¥È¤É•ÑÕÉ¸ì(€€€€€¥˜€¡…Ñ¥Ù” ¤¤ì(€€€€€€€…ÁÑÕÉ” ¤ì(€€€€€€€…Ý…¥ÐÍ•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹Íå¹Œ ¤ì(€€€€€€€¥˜€¡Í•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹‘¥ÉÑä¤Ñ¡É½ÜÉÉ½È ‰Q½‘…Ùqá„¡…ä…µ‰¥½ÌÁ•¹‘¥•¹Ñ•Ì¸ˆ¤ì(€€€€€ô(€€€€€¥˜€ ……Ñ¥Ù” ¤€˜˜…Á¤¹ÕÉÉ•¹Ð ¤€˜˜€……Á¤¹Á•ÉÍ¥ÍÑ1½…° ¤¤Ñ¡É½ÜÉÉ½È ‰9¼Í”ÁÕ‘¼Õ…É‘…È•°‘½Õµ•¹Ñ¼±½…°¸ˆ¤ì(€€€€€ÍÑ½À¡™…±Í”¤ì(€€€€€½¹ÍÐ…½Õ¹Ð€ô•Ñ½Õ¹Ð ¤°µ½‘•°€ô¹•Ü½µµÕ¹¥…Ñ¥½¹5½‘•° ¤°…Ý…É•¹•ÍÌ€ô¹•ÜÝ…É•¹•ÍÌ¡µ½‘•°¹‘½Œ¤ì(€€€€€½¹ÍÐÕÉÉ•¹Ð€ôì¥è¥È°…½Õ¹Ð°µ½‘•°°…Ý…É•¹•ÍÌ°‰±½­•èÑÉÕ”°Í½ÕÉ”è¹Õ±°°‰…Í•±¥¹”èíô°ÁÉ•Í•¹•I•…‘äè™…±Í”°ÁÉ•Í•¹•M•ÍÍ¥½¹Ìè€¼¨}}AUI}|€¨¼¹•Ü5…À ¤°ÁÉ•Í•¹•I½ÝÌèmt°•Ù•¹ÑÌèmt°±…ÍÑAÉ•Í•¹”èmtôì(€€€€€½¹ÍÐÑÉ…¹ÍÁ½ÉÐ€ô¹•Ü½µµÕ¹¥…Ñ¥½¹QÉ…¹ÍÁ½ÉÐ¡ì(€€€€€€€‘½Œèµ½‘•°¹‘½Œ°(€€€€€€€ÉÁŒè€¡¹…µ”°…ÉÌÈ¤€ôøÉÁŒ¡¹…µ”°ìÁ}¥è¥È°€¸¸¹…ÉÌÈô¤°(€€€€€€€Ù…±¥è€ ¤€ôøÍ•ÍÍ¥½¸€ôôôÕÉÉ•¹Ð€˜˜•Ñ½Õ¹Ð ¤€ôôô…½Õ¹Ð°(€€€€€€€ÁÉ•Í•¹”è€ ¤€ôø€¡ì±¥•¹Ñ%èµ½‘•°¹‘½Œ¹±¥•¹Ñ%°€¸¸¹…Ý…É•¹•ÍÌ¹•Ñ1½…±MÑ…Ñ” ¤ô¤°(€€€€€€€½¹¡…¹”è€¡‘…Ñ„¤€ôøì(€€€€€€€€€¥˜€¡ÕÉÉ•¹Ð¹Í½ÕÉ”¤…ÁÁ±åI•µ½Ñ”¡‘…Ñ„¤ì(€€€€€€€ô°(€€€€€€€½¹MÑ…ÑÕÌèÍÑ…ÑÕÌ(€€€€€ô¤ì(€€€€€ÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ€ôÑÉ…¹ÍÁ½ÉÐì(€€€€€Í•ÍÍ¥½¸€ôÕÉÉ•¹Ðì(€€€€€ÑÉäì(€€€€€€€…Ý…¥ÐÑÉ…¹ÍÁ½ÉÐ¹Íå¹Œ ¤ì(€€€€€€€¥˜€¡Í•ÍÍ¥½¸€„ôôÕÉÉ•¹Ð¤É•ÑÕÉ¸ì(€€€€€€€½¹ÍÐ€ôÉ•… ¤ì(€€€€€€€…Á¤¹Ù…±¥‘…Ñ”¡¤ì(€€€€€€€ÕÉÉ•¹Ð¹Í½ÕÉ”€ô¹¥ì(€€€€€€€ÕÉÉ•¹Ð¹‰…Í•±¥¹”€ôÍÑÉ¥ÁÁ•¡¤ì(€€€€€€€ÕÉÉ•¹Ð¹‰±½­•€ô™…±Í”ì(€€€€€€€…Ý…É•¹•ÍÌ¹Í•Ñ1½…±MÑ…Ñ”¡ìÕÍ•Èèì¹…µ”è…Á¤¹…½Õ¹Ð ¤¹¹…µ”ñð€‰½±…‰½É…‘½Èˆ°½±½Èè½±½ÉÍmµ½‘•°¹‘½Œ¹±¥•¹Ñ%€”½±½ÉÌ¹±•¹Ñ¡tô°™¥•±è€‰‘½Õµ•¹Ðˆ°…É•„è€‰½Õµ•¹Ñ¼ˆ°µ½‘”è€‰…É•„ˆô¤ì(€€€€€€€…Á¤¹ÕÉÉ•¹Ð¡¤ì(€€€€€€€…Á¤¹É•¹‘•È ¤ì(€€€€€€€ÑÉ…¹ÍÁ½ÉÐ¹ÍÑ…ÉÐ ¤ì(€€€€€ô…Ñ €¡•ÉÉ½È¤ì(€€€€€€€ÍÑ½À ¤ì(€€€€€€€Ñ¡É½Ü•ÉÉ½Èì(€€€€€ô(€€€ô(€€€…Íå¹Œ™Õ¹Ñ¥½¸ÁÕ‰±¥Í¡ÕÉÉ•¹Ð ¤ì(€€€€€¥˜€¡…Ñ¥Ù” ¤¤É•ÑÕÉ¸ÑÉÕ”ì(€€€€€¥˜€ ……Á¤¹ÕÉÉ•¹Ð ¤ñð€……Á¤¹Á•ÉÍ¥ÍÑ1½…° ¤¤Ñ¡É½ÜÉÉ½È ‰9¼Í”ÁÕ‘¼Õ…É‘…È•°½µÕ¹¥…‘¼…¹Ñ•Ì‘”ÁÕ‰±¥…É±¼…°•ÅÕ¥Á¼¸ˆ¤ì(€€€€€½¹ÍÐ‘É…™Ð€ô½ÁäÐ¡…Á¤¹ÕÉÉ•¹Ð ¤¤ì(€€€€€¥˜€¡)M=8¹ÍÑÉ¥¹¥™ä¡‘É…™Ð¤¹¥¹±Õ‘•Ì ‰Í¥•ÉÉ„µµ•µ¼µ…ÍÍ•Ðèˆ¤¤Ñ¡É½ÜÉÉ½È ‰…±Ñ…¸¥µqáÅ•¹•Ì±½…±•Ì¸UÍ„qÔÈÀÅÕ…É‘…È•¸•ÅÕ¥Á½qÔÈÀÅÁ…É„ÁÉ•Á…É…É±…Ì¸ˆ¤ì(€€€€€½¹ÍÐµ½‘•°€ô¹•Ü½µµÕ¹¥…Ñ¥½¹5½‘•° ¤ì(€€€€€±•ÐÍ¹…ÁÍ¡½ÐÈì(€€€€€ÑÉäì(€€€€€€€µ½‘•°¹Í••¡ÍÑÉ¥ÁÁ•¡‘É…™Ð¤¤ì(€€€€€€€ÁÉ•Á…É•I¥ ¡µ½‘•°°‘É…™Ð¤ì(€€€€€€€Í¹…ÁÍ¡½ÐÈ€ôå©Í}•áÁ½ÉÑÌ¹•¹½‘•MÑ…Ñ•ÍUÁ‘…Ñ”¡µ½‘•°¹‘½Œ¤ì(€€€€€ô™¥¹…±±äì(€€€€€€€µ½‘•°¹‘½Œ¹‘•ÍÑÉ½ä ¤ì(€€€€€ô(€€€€€¥˜€¡Í¹…ÁÍ¡½ÐÈ¹±•¹Ñ €ø€ÄØÜÜÜÈÄØ¤Ñ¡É½ÜÉÉ½È ‰°½µÕ¹¥…‘¼¹••Í¥Ñ„ÁÉ•Á…É…ÈÍÕÌ¥µqáÅ•¹•Ì¸UÍ„qÔÈÀÅÕ…É‘…È•¸•ÅÕ¥Á½qÔÈÀÅ¸ˆ¤ì(€€€€€½¹ÍÐ¥È€ô…Ý…¥ÐÉÁŒ ‰½µµÕ¹¥…Ñ¥½¹}É•…Ñ”ˆ°ìÁ}Í½ÕÉ”è‘É…™Ð¹¥°Á}Ñ¥Ñ±”è€¡‘É…™Ð¹ÍÕ‰©•Ðñð€‰½µÕ¹¥…‘¼ˆ¤¹Í±¥” À°€ÔÀÀ¤°Á}­¥¹è‘É…™Ð¹­¥¹ñð€‰µ•µ¼ˆ°Á}Í¹…ÁÍ¡½ÐèÑ½	…Í”ØÐÈ¡Í¹…ÁÍ¡½ÐÈ¤ô¤ì(€€€€€¥˜€¡…Á¤¹ÕÉÉ•¹Ð ¤ü¹¥€„ôô‘É…™Ð¹¥¤É•ÑÕÉ¸™…±Í”ì(€€€€€…Ý…¥Ð½Á•¸¡¥È¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ô(€€€…Íå¹Œ™Õ¹Ñ¥½¸Í¡…É” ¤ì(€€€€€¥˜€¡Í¡…É¥¹œ¤É•ÑÕÉ¸ì(€€€€€Í¡…É¥¹œ€ôÑÉÕ”ì(€€€€€…Á¤¹±•…ÉM•±•Ñ½ÉÌ ¤ì(€€€€€½¹ÍÐ•°€ô‘¥…±½œ ‰ÍÁ…¥¼‘•°•ÅÕ¥Á¼ˆ¤ì(€€€€€µ•ÍÍ…”¡•°°€‰Y•É¥™¥…¹‘¼•°‘½Õµ•¹Ñ¼¸¸¸ˆ¤ì(€€€€€ÑÉäì(€€€€€€€¥˜€ ……Ñ¥Ù” ¤¤ì(€€€€€€€€€¥˜€ ……Á¤¹ÕÉÉ•¹Ð ¤ñð€……Á¤¹Á•ÉÍ¥ÍÑ1½…° ¤¤Ñ¡É½ÜÉÉ½È ‰Õ…É‘„•°½µÕ¹¥…‘¼…¹Ñ•Ì‘”½µÁ…ÉÑ¥É±¼¸ˆ¤ì(€€€€€€€€€½¹ÍÐ½É¥¥¹…°€ô½ÁäÐ¡…Á¤¹ÕÉÉ•¹Ð ¤¤°…½Õ¹Ð€ô•Ñ½Õ¹Ð ¤ì(€€€€€€€€€±•Ð‘É…™Ð€ô½É¥¥¹…°°Í¹…ÁÍ¡½ÐÈì(€€€€€€€€€½¹ÍÐÙ…±¥€ô€ ¤€ôø•°¹¥Í½¹¹•Ñ•€˜˜•Ñ½Õ¹Ð ¤€ôôô…½Õ¹Ð€˜˜…Á¤¹ÕÉÉ•¹Ð ¤ü¹¥€ôôô½É¥¥¹…°¹¥ì(€€€€€€€€€½¹ÍÐ•¹½‘”Ì€ô€¡¤€ôøì(€€€€€€€€€€€½¹ÍÐµ½‘•°€ô¹•Ü½µµÕ¹¥…Ñ¥½¹5½‘•° ¤ì(€€€€€€€€€€€ÑÉäì(€€€€€€€€€€€€€µ½‘•°¹Í••¡ÍÑÉ¥ÁÁ•¡¤¤ì(€€€€€€€€€€€€€ÁÉ•Á…É•I¥ ¡µ½‘•°°¤ì(€€€€€€€€€€€€€É•ÑÕÉ¸å©Í}•áÁ½ÉÑÌ¹•¹½‘•MÑ…Ñ•ÍUÁ‘…Ñ”¡µ½‘•°¹‘½Œ¤ì(€€€€€€€€€€€ô™¥¹…±±äì(€€€€€€€€€€€€€µ½‘•°¹‘½Œ¹‘•ÍÑÉ½ä ¤ì(€€€€€€€€€€€ô(€€€€€€€€€ôì(€€€€€€€€€¥˜€¡)M=8¹ÍÑÉ¥¹¥™ä¡‘É…™Ð¤¹¥¹±Õ‘•Ì ‰Í¥•ÉÉ„µµ•µ¼µ…ÍÍ•Ðèˆ¤¤Ñ¡É½ÜÉÉ½È ‰…±Ñ…¸¥µqáÅ•¹•Ì±½…±•Ì¸I•ÕÁqáåÉ…±…Ì…¹Ñ•Ì‘”½µÁ…ÉÑ¥È¸ˆ¤ì(€€€€€€€€€Í¹…ÁÍ¡½ÐÈ€ô•¹½‘”Ì¡‘É…™Ð¤ì(€€€€€€€€€¥˜€¡Í¹…ÁÍ¡½ÐÈ¹±•¹Ñ €ø€à€¨€ÄÀÈÐ€¨€ÄÀÈÐ¤ì(€€€€€€€€€€€µ•ÍÍ…”¡•°°€‰AÉ•Á…É…¹‘¼¥µqáÅ•¹•ÌÁ…É„½µÁ…ÉÑ¥È¸°½É¥¥¹…°Í”½¹Í•ÉÙ„¸¸¸ˆ¤ì(€€€€€€€€€€€™½È€¡½¹ÍÐmµ…á¥µ•¹Í¥½¸°ÅÕ…±¥Ñåt½˜mlÈÐÀÀ°€À¸åt°lÄäÈÀ°€À¸àát°lÄØÀÀ°€À¸àÕut¤ì(€€€€€€€€€€€€€‘É…™Ð€ô…Ý…¥Ð½ÁÑ¥µ¥é•M¡…É¥¹%µ…•Ì¡½É¥¥¹…°°ì(€€€€€€€€€€€€€€€µ…á¥µ•¹Í¥½¸°(€€€€€€€€€€€€€€€ÅÕ…±¥Ñä°(€€€€€€€€€€€€€€€Ù…±¥°(€€€€€€€€€€€€€€€ÁÉ½É•ÍÌè€¡‘½¹”°Ñ½Ñ…°¤€ôøµ•ÍÍ…”¡•°°€‰AÉ•Á…É…¹‘¼¥µqáÅ•¹•Ìè€ˆ€¬‘½¹”€¬€ˆ‘”€ˆ€¬Ñ½Ñ…°€¬€ˆ¸¸¸ˆ¤(€€€€€€€€€€€€€ô¤ì(€€€€€€€€€€€€€Í¹…ÁÍ¡½ÐÈ€ô•¹½‘”Ì¡‘É…™Ð¤ì(€€€€€€€€€€€€€¥˜€¡Í¹…ÁÍ¡½ÐÈ¹±•¹Ñ €ðô€ÄÔ€¨€ÄÀÈÐ€¨€ÄÀÈÐ¤‰É•…¬ì(€€€€€€€€€€€ô(€€€€€€€€€ô(€€€€€€€€€¥˜€ …Ù…±¥ ¤¤É•ÑÕÉ¸ì(€€€€€€€€€¥˜€¡)M=8¹ÍÑÉ¥¹¥™ä¡…Á¤¹ÕÉÉ•¹Ð ¤¤€„ôô)M=8¹ÍÑÉ¥¹¥™ä¡½É¥¥¹…°¤¤Ñ¡É½ÜÉÉ½È ‰°½µÕ¹¥…‘¼…µ‰¥qáÌ‘ÕÉ…¹Ñ”±„ÁÉ•Á…É…¥qáÍ¸¸YÕ•±Ù”„½µÁ…ÉÑ¥È±„Ù•ÉÍ¥qáÍ¸…ÑÕ…°¸ˆ¤ì(€€€€€€€€€¥˜€¡Í¹…ÁÍ¡½ÐÈ¹±•¹Ñ €ø€ÄØÜÜÜÈÄØ¤Ñ¡É½ÜÉÉ½È ‰9¼Í”ÁÕ‘¼ÁÉ•Á…É…È±„½Á¥„½µÁ…ÉÑ¥‘„…ÕÑ½µqáÅÑ¥…µ•¹Ñ”¸QÔ½µÕ¹¥…‘¼½É¥¥¹…°Í”½¹Í•ÉÙ„¥¹Ñ…Ñ¼¸ˆ¤ì(€€€€€€€€€µ•ÍÍ…”¡•°°€‰Õ…É‘…¹‘¼•°½µÕ¹¥…‘¼•¸•°•ÍÁ…¥¼‘•°•ÅÕ¥Á¼¸¸¸ˆ¤ì(€€€€€€€€€½¹ÍÐ¥È€ô…Ý…¥ÐÉÁŒ ‰½µµÕ¹¥…Ñ¥½¹}É•…Ñ”ˆ°ìÁ}Í½ÕÉ”è‘É…™Ð¹¥°Á}Ñ¥Ñ±”è€¡‘É…™Ð¹ÍÕ‰©•Ðñð€‰½µÕ¹¥…‘¼ˆ¤¹Í±¥” À°€ÔÀÀ¤°Á}­¥¹è‘É…™Ð¹­¥¹ñð€‰µ•µ¼ˆ°Á}Í¹…ÁÍ¡½ÐèÑ½	…Í”ØÐÈ¡Í¹…ÁÍ¡½ÐÈ¤ô¤ì(€€€€€€€€€¥˜€ …Ù…±¥ ¤¤É•ÑÕÉ¸ì(€€€€€€€€€…Ý…¥Ð½Á•¸¡¥È¤ì(€€€€€€€ô(€€€€€€€¥˜€ …•°¹¥Í½¹¹•Ñ•¤É•ÑÕÉ¸ì(€€€€€€€•°¹ÅÕ•ÉåM•±•Ñ½È ‰m‘…Ñ„µµ•ÍÍ…•tˆ¤ü¹É•µ½Ù” ¤ì(€€€€€€€½¹ÍÐÑ•…´€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Àˆ¤ì(€€€€€€€Ñ•…´¹±…ÍÍ9…µ”€ô€‰½µµÌµ½±±…ˆµ±½¬ˆì(€€€€€€€Ñ•…´¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰Y¥Í¥‰±”Á…É„Ñ½‘…Ì±…ÌÕ•¹Ñ…Ì½¸…•Í¼„½µÕ¹¥…¥½¹•Ì¸EÕ¥•¹•ÌÑ•¹…¸Á•Éµ¥Í¼‘”•‘¥¥qáÍ¸ÁÕ•‘•¸µ½‘¥™¥…É±¼ä½µ•¹Ñ…È•¸Ñ¥•µÁ¼É•…°¸ˆì(€€€€€€€•°¹…ÁÁ•¹¡Ñ•…´¤ì(€€€€€ô…Ñ €¡•ÉÉ½È¤ì(€€€€€€€¥˜€¡•°¹¥Í½¹¹•Ñ•¤µ•ÍÍ…”¡•°°•ÉÉ½È¹µ•ÍÍ…”ñð€‰9¼Í”ÁÕ‘¼…‰É¥È•°…•Í¼½µÁ…ÉÑ¥‘¼¸ˆ°ÑÉÕ”¤ì(€€€€€ô™¥¹…±±äì(€€€€€€€Í¡…É¥¹œ€ô™…±Í”ì(€€€€€ô(€€€ô(€€€½¹ÍÐ…Ý…É•¹•ÍÍ=˜€ô€¡Á•ÉÍ½¸¤€ôøì(€€€€€ÑÉäì(€€€€€€€É•ÑÕÉ¸)M=8¹Á…ÉÍ”¡Á•ÉÍ½¸¹…Ý…É•¹•ÍÌñð€‰íôˆ¤ì(€€€€€ô…Ñ ì(€€€€€€€É•ÑÕÉ¸íôì(€€€€€ô(€€€ôì(€€€½¹ÍÐÁ•½Á±•%¸€ô€¡‘½Õµ•¹ÐÈ¤€ôøì(€€€€€½¹ÍÐÁ•½Á±”€ô€¼¨}}AUI}|€¨¼¹•Ü5…À ¤ì(€€€€€™½È€¡½¹ÍÐÁ•ÉÍ½¸½˜‘½Õµ•¹ÐÈ¹ÁÉ•Í•¹”ñðmt¤ì(€€€€€€€½¹ÍÐÁÉ•Ù¥½ÕÌ€ôÁ•½Á±”¹•Ð¡Á•ÉÍ½¸¹ÕÍ•É}¥¤ì(€€€€€€€¥˜€ …ÁÉ•Ù¥½ÕÌñðMÑÉ¥¹œ¡ÁÉ•Ù¥½ÕÌ¹Í••¹}…Ð¤€ðMÑÉ¥¹œ¡Á•ÉÍ½¸¹Í••¹}…Ð¤¤Á•½Á±”¹Í•Ð¡Á•ÉÍ½¸¹ÕÍ•É}¥°Á•ÉÍ½¸¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸l¸¸¹Á•½Á±”¹Ù…±Õ•Ì ¥tì(€€€ôì(€€€½¹ÍÐ…Ù…Ñ…É½È€ô€¡Á•ÉÍ½¸¤€ôøì(€€€€€½¹ÍÐ…Ù…Ñ…È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€…Ù…Ñ…È¹±…ÍÍ9…µ”€ô€‰½µµÌµ½±±…ˆµ…Ù…Ñ…Èˆì(€€€€€…Ù…Ñ…È¹Ñ•áÑ½¹Ñ•¹Ð€ô¥¹¥Ñ¥…±Ì¡Á•ÉÍ½¸¹¹…µ”¤ì(€€€€€…Ù…Ñ…È¹ÍÑå±”¹Í•ÑAÉ½Á•ÉÑä ˆ´µÁ•ÉÍ½¸µ½±½Èˆ°½±½ÉÍmÁ…ÉÍ•%¹Ð¡ÍÑ…‰±•-•ä¡Á•ÉÍ½¸¹ÕÍ•É}¥ñðÁ•ÉÍ½¸¹¹…µ”¤°€ÌØ¤€”½±½ÉÌ¹±•¹Ñ¡t¤ì(€€€€€…Ù…Ñ…È¹Í•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ¡¥‘‘•¸ˆ°€‰ÑÉÕ”ˆ¤ì(€€€€€É•ÑÕÉ¸…Ù…Ñ…Èì(€€€ôì(€€€™Õ¹Ñ¥½¸É•¹‘•ÉQ•…µÑ¥Ù¥Ñä¡•°°‘½Õµ•¹ÑÌ¤ì(€€€€€•°¹ÅÕ•ÉåM•±•Ñ½È ‰m‘…Ñ„µµ•ÍÍ…•tˆ¤ü¹É•µ½Ù” ¤ì(€€€€€•°¹ÅÕ•ÉåM•±•Ñ½È ‰m‘…Ñ„µÑ•…´µ‰½‘åtˆ¤ü¹É•µ½Ù” ¤ì(€€€€€½¹ÍÐ‰½‘ä€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€‰½‘ä¹‘…Ñ…Í•Ð¹Ñ•…µ	½‘ä€ô€ˆˆì(€€€€€‰½‘ä¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µ‰½‘äˆì(€€€€€‰½‘ä¹Í•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ±¥Ù”ˆ°€‰Á½±¥Ñ”ˆ¤ì(€€€€€½¹ÍÐ¥¹ÑÉ¼€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Àˆ¤ì(€€€€€¥¹ÑÉ¼¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µ¥¹ÑÉ¼ˆì(€€€€€¥¹ÑÉ¼¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰½¹ÍÕ±Ñ„ÅÕ¥qáå¸•ÍÑqáÄÑÉ…‰…©…¹‘¼°•¸ÅÕqáä½µÕ¹¥…‘¼ä•¸ÅÕqáäqáÅÉ•„°Í¥¸…‰É¥È•°‘½Õµ•¹Ñ¼¸ˆì(€€€€€‰½‘ä¹…ÁÁ•¹¡¥¹ÑÉ¼¤ì(€€€€€¥˜€ …‘½Õµ•¹ÑÌ¹±•¹Ñ ¤ì(€€€€€€€½¹ÍÐ•µÁÑäÈ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Àˆ¤ì(€€€€€€€•µÁÑäÈ¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µ•µÁÑäˆì(€€€€€€€•µÁÑäÈ¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰Q½‘…Ùqá„¹¼¡…ä½µÕ¹¥…‘½Ì•¸•°•ÍÁ…¥¼‘•°•ÅÕ¥Á¼¸ˆì(€€€€€€€‰½‘ä¹…ÁÁ•¹¡•µÁÑäÈ¤ì(€€€€€€€•°¹…ÁÁ•¹¡‰½‘ä¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô(€€€€€½¹ÍÐ±¥Ù”€ô‘½Õµ•¹ÑÌ¹µ…À ¡‘½Õµ•¹ÐÈ¤€ôø€¡ì‘½Õµ•¹Ðè‘½Õµ•¹ÐÈ°Á•½Á±”èÁ•½Á±•%¸¡‘½Õµ•¹ÐÈ¤ô¤¤¹™¥±Ñ•È ¡¥Ñ•´¤€ôø¥Ñ•´¹Á•½Á±”¹±•¹Ñ ¤ì(€€€€€½¹ÍÐ¡•…‘¥¹œ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ Ìˆ¤ì(€€€€€¡•…‘¥¹œ¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µ¡•…‘¥¹œˆì(€€€€€¡•…‘¥¹œ¹Ñ•áÑ½¹Ñ•¹Ð€ô¡½É„µ¥Íµ¼qáÜ€‘í±¥Ù”¹É•‘Õ” ¡ÍÕ´°¥Ñ•´¤€ôøÍÕ´€¬¥Ñ•´¹Á•½Á±”¹±•¹Ñ °€À¥ô•¸±qá¹•…€ì(€€€€€‰½‘ä¹…ÁÁ•¹¡¡•…‘¥¹œ¤ì(€€€€€¥˜€ …±¥Ù”¹±•¹Ñ ¤ì(€€€€€€€½¹ÍÐ•µÁÑäÈ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Àˆ¤ì(€€€€€€€•µÁÑäÈ¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µ•µÁÑäˆì(€€€€€€€•µÁÑäÈ¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰9…‘¥”•ÍÑqáÄ•‘¥Ñ…¹‘¼…¡½É„¸ˆì(€€€€€€€‰½‘ä¹…ÁÁ•¹¡•µÁÑäÈ¤ì(€€€€€ô•±Í”™½È€¡½¹ÍÐì‘½Õµ•¹ÐèÉ•½É°Á•½Á±”ô½˜±¥Ù”¤ì(€€€€€€€½¹ÍÐ…É€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Í•Ñ¥½¸ˆ¤ì(€€€€€€€…É¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µ‘½Õµ•¹Ðˆì(€€€€€€€½¹ÍÐ½Á•¹	ÕÑÑ½¸€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰ÕÑÑ½¸ˆ¤ì(€€€€€€€½Á•¹	ÕÑÑ½¸¹ÑåÁ”€ô€‰‰ÕÑÑ½¸ˆì(€€€€€€€½Á•¹	ÕÑÑ½¸¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µ‘½Õµ•¹Ðµ½Á•¸ˆì(€€€€€€€½¹ÍÐÑ¥Ñ±”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÑÉ½¹œˆ¤ì(€€€€€€€Ñ¥Ñ±”¹Ñ•áÑ½¹Ñ•¹Ð€ôÉ•½É¹Ñ¥Ñ±”ñð€‰½µÕ¹¥…‘¼Í¥¸ÑqáÑÕ±¼ˆì(€€€€€€€½¹ÍÐ¡¥¹Ð€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Íµ…±°ˆ¤ì(€€€€€€€¡¥¹Ð¹Ñ•áÑ½¹Ñ•¹Ð€ô€‘íÁ•½Á±”¹±•¹Ñ¡ô€‘íÁ•½Á±”¹±•¹Ñ €ôôô€Ä€ü€‰Á•ÉÍ½¹„ˆ€è€‰Á•ÉÍ½¹…Ì‰ôqáÜ‰É¥È½µÕ¹¥…‘½€ì(€€€€€€€½Á•¹	ÕÑÑ½¸¹…ÁÁ•¹¡Ñ¥Ñ±”°¡¥¹Ð¤ì(€€€€€€€½Á•¹	ÕÑÑ½¸¹½¹±¥¬€ô…Íå¹Œ€ ¤€ôøì(€€€€€€€€€½Á•¹	ÕÑÑ½¸¹‘¥Í…‰±•€ôÑÉÕ”ì(€€€€€€€€€ÑÉäì(€€€€€€€€€€€…Ý…¥Ð½Á•¸¡É•½É¹¥¤ì(€€€€€€€€€€€•°¹±½Í” ¤ì(€€€€€€€€€ô…Ñ €¡•ÉÉ½È¤ì(€€€€€€€€€€€½Á•¹	ÕÑÑ½¸¹‘¥Í…‰±•€ô™…±Í”ì(€€€€€€€€€€€µ•ÍÍ…”¡•°°€‰9¼Í”ÁÕ‘¼…‰É¥È•°½µÕ¹¥…‘¼¸½µÁÉÕ•‰„ÑÔ…•Í¼ä½¹•á¥qáÍ¸¸ˆ°ÑÉÕ”¤ì(€€€€€€€€€ô(€€€€€€€ôì(€€€€€€€…É¹…ÁÁ•¹¡½Á•¹	ÕÑÑ½¸¤ì(€€€€€€€½¹ÍÐ±¥ÍÐ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€€€±¥ÍÐ¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µÁ•½Á±”ˆì(€€€€€€€™½È€¡½¹ÍÐÁ•ÉÍ½¸½˜Á•½Á±”¤ì(€€€€€€€€€½¹ÍÐ…Ý…É•¹•ÍÌ€ô…Ý…É•¹•ÍÍ=˜¡Á•ÉÍ½¸¤°É½Ü€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€€€€€É½Ü¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µÁ•ÉÍ½¸ˆì(€€€€€€€€€É½Ü¹…ÁÁ•¹¡…Ù…Ñ…É½È¡Á•ÉÍ½¸¤¤ì(€€€€€€€€€½¹ÍÐ½ÁäÔ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤°¹…µ”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÑÉ½¹œˆ¤°…É•„€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Íµ…±°ˆ¤ì(€€€€€€€€€¹…µ”¹Ñ•áÑ½¹Ñ•¹Ð€ôÁ•ÉÍ½¸¹¹…µ”ñð€‰Õ•¹Ñ„M%IIˆì(€€€€€€€€€…É•„¹Ñ•áÑ½¹Ñ•¹Ð€ôÍ¡½ÉÑQ•áÐ¡…Ý…É•¹•ÍÌ¹…É•„¤ñð€‰¸•°‘½Õµ•¹Ñ¼ˆì(€€€€€€€€€½ÁäÔ¹…ÁÁ•¹¡¹…µ”°…É•„¤ì(€€€€€€€€€É½Ü¹…ÁÁ•¹¡½ÁäÔ¤ì(€€€€€€€€€±¥ÍÐ¹…ÁÁ•¹¡É½Ü¤ì(€€€€€€€ô(€€€€€€€…É¹…ÁÁ•¹¡±¥ÍÐ¤ì(€€€€€€€‰½‘ä¹…ÁÁ•¹¡…É¤ì(€€€€€ô(€€€€€½¹ÍÐÍ¡…É•‘!•…‘¥¹œ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ Ìˆ¤ì(€€€€€Í¡…É•‘!•…‘¥¹œ¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µ¡•…‘¥¹œˆì(€€€€€Í¡…É•‘!•…‘¥¹œ¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰½µÕ¹¥…‘½Ì½µÁ…ÉÑ¥‘½Ìˆì(€€€€€‰½‘ä¹…ÁÁ•¹¡Í¡…É•‘!•…‘¥¹œ¤ì(€€€€€½¹ÍÐ…±°È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€…±°È¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µ‘½Õµ•¹ÑÌˆì(€€€€€™½È€¡½¹ÍÐÉ•½É½˜‘½Õµ•¹ÑÌ¤ì(€€€€€€€½¹ÍÐÁ•½Á±”€ôÁ•½Á±•%¸¡É•½É¤°É½Ü€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰ÕÑÑ½¸ˆ¤ì(€€€€€€€É½Ü¹ÑåÁ”€ô€‰‰ÕÑÑ½¸ˆì(€€€€€€€É½Ü¹±…ÍÍ9…µ”€ô€‰½µµÌµÑ•…´µ‘½Õµ•¹ÐµÉ½Üˆì(€€€€€€€½¹ÍÐ½ÁäÔ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤°Ñ¥Ñ±”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÑÉ½¹œˆ¤°µ•Ñ„€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Íµ…±°ˆ¤°½Õ¹Ð€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€€€Ñ¥Ñ±”¹Ñ•áÑ½¹Ñ•¹Ð€ôÉ•½É¹Ñ¥Ñ±”ñð€‰½µÕ¹¥…‘¼Í¥¸ÑqáÑÕ±¼ˆì(€€€€€€€µ•Ñ„¹Ñ•áÑ½¹Ñ•¹Ð€ô±…‰•°¡É•½É¹É½±”¤ì(€€€€€€€½ÁäÔ¹…ÁÁ•¹¡Ñ¥Ñ±”°µ•Ñ„¤ì(€€€€€€€½Õ¹Ð¹±…ÍÍ9…µ”€ôÁ•½Á±”¹±•¹Ñ €ü€‰¥Ìµ½¹±¥¹”ˆ€è€ˆˆì(€€€€€€€½Õ¹Ð¹Ñ•áÑ½¹Ñ•¹Ð€ôÁ•½Á±”¹±•¹Ñ €ü€‘íÁ•½Á±”¹±•¹Ñ¡ô•¸±qá¹•…€€è€‰M¥¸…Ñ¥Ù¥‘…ˆì(€€€€€€€É½Ü¹…ÁÁ•¹¡½ÁäÔ°½Õ¹Ð¤ì(€€€€€€€É½Ü¹½¹±¥¬€ô…Íå¹Œ€ ¤€ôøì(€€€€€€€€€É½Ü¹‘¥Í…‰±•€ôÑÉÕ”ì(€€€€€€€€€ÑÉäì(€€€€€€€€€€€…Ý…¥Ð½Á•¸¡É•½É¹¥¤ì(€€€€€€€€€€€•°¹±½Í” ¤ì(€€€€€€€€€ô…Ñ €¡•ÉÉ½È¤ì(€€€€€€€€€€€É½Ü¹‘¥Í…‰±•€ô™…±Í”ì(€€€€€€€€€€€µ•ÍÍ…”¡•°°€‰9¼Í”ÁÕ‘¼…‰É¥È•°½µÕ¹¥…‘¼¸½µÁÉÕ•‰„ÑÔ…•Í¼ä½¹•á¥qáÍ¸¸ˆ°ÑÉÕ”¤ì(€€€€€€€€€ô(€€€€€€€ôì(€€€€€€€…±°È¹…ÁÁ•¹¡É½Ü¤ì(€€€€€ô(€€€€€‰½‘ä¹…ÁÁ•¹¡…±°È¤ì(€€€€€•°¹…ÁÁ•¹¡‰½‘ä¤ì(€€€ô(€€€…Íå¹Œ™Õ¹Ñ¥½¸±¥‰É…Éä ¤ì(€€€€€½¹ÍÐ•°€ô‘¥…±½œ ‰Ñ¥Ù¥‘…‘•°•ÅÕ¥Á¼ˆ¤ì(€€€€€•°¹±…ÍÍ1¥ÍÐ¹…‘ ‰½µµÌµÑ•…´µ‘¥…±½œˆ¤ì(€€€€€µ•ÍÍ…”¡•°°€‰…É…¹‘¼…Ñ¥Ù¥‘…¸¸¸ˆ¤ì(€€€€€±•ÐÍÑ½ÁÁ•€ô™…±Í”°±½…‘¥¹œ€ô™…±Í”°Ñ¥µ•È€ô€Àì(€€€€€½¹ÍÐ±½…€ô…Íå¹Œ€ ¤€ôøì(€€€€€€€¥˜€¡ÍÑ½ÁÁ•ñð±½…‘¥¹œ¤É•ÑÕÉ¸ì(€€€€€€€±½…‘¥¹œ€ôÑÉÕ”ì(€€€€€€€ÑÉäì(€€€€€€€€€½¹ÍÐ‘½Õµ•¹ÑÌ€ô…Ý…¥ÐÉÁŒ ‰½µµÕ¹¥…Ñ¥½¹}±¥ÍÐˆ¤ì(€€€€€€€€€¥˜€¡•°¹¥Í½¹¹•Ñ•¤É•¹‘•ÉQ•…µÑ¥Ù¥Ñä¡•°°€¡‘½Õµ•¹ÑÌñðmt¤¹™¥±Ñ•È¡¥Í½µµÕ¹¥…Ñ¥½¸¤¤ì(€€€€€€€ô…Ñ €¡•ÉÉ½È¤ì(€€€€€€€€€¥˜€¡•°¹¥Í½¹¹•Ñ•¤µ•ÍÍ…”¡•°°€‰°•ÍÁ…¥¼½µÁ…ÉÑ¥‘¼¹¼•ÍÑqáÄ‘¥ÍÁ½¹¥‰±”¸9¼Í”µ½‘¥™¥…É½¸ÑÕÌ‘½Õµ•¹Ñ½Ì±½…±•Ì¸ˆ°ÑÉÕ”¤ì(€€€€€€€ô™¥¹…±±äì(€€€€€€€€€±½…‘¥¹œ€ô™…±Í”ì(€€€€€€€ô(€€€€€ôì(€€€€€•°¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰±½Í”ˆ°€ ¤€ôøì(€€€€€€€ÍÑ½ÁÁ•€ôÑÉÕ”ì(€€€€€€€±•…É%¹Ñ•ÉÙ…°¡Ñ¥µ•È¤ì(€€€€€ô°ì½¹”èÑÉÕ”ô¤ì(€€€€€…Ý…¥Ð±½… ¤ì(€€€€€¥˜€ …ÍÑ½ÁÁ•¤Ñ¥µ•È€ôÍ•Ñ%¹Ñ•ÉÙ…°¡±½…°€Ñ”Ì¤ì(€€€ô(€€€½¹ÍÐ­¥¹‘9…µ”€ô€¡­¥¹¤€ôø€¡ìµ•µ¼è€‰5•µ¼ˆ°½¹Ù½…Ñ½É¥„è€‰½¹Ù½…Ñ½É¥„ˆ°¥ÉÕ±…Èè€‰¥ÉÕ±…È¥¹™½Éµ…Ñ¥Ù„ˆ°…Ù¥Í¼è€‰Ù¥Í¼ˆô¥m­¥¹‘tñð€‰½µÕ¹¥…‘¼ˆì(€€€½¹ÍÐ¥Í½µµÕ¹¥…Ñ¥½¸€ô€¡É•½É¤€ôøl‰µ•µ¼ˆ°€‰½¹Ù½…Ñ½É¥„ˆ°€‰¥ÉÕ±…Èˆ°€‰…Ù¥Í¼‰t¹¥¹±Õ‘•Ì¡É•½Éü¹­¥¹ñð€‰µ•µ¼ˆ¤ì(€€€½¹ÍÐÍ¡…É•‘!½µ•I•½É‘Ì€ô€¡‘½Õµ•¹ÑÌ¤€ôøì(€€€€€¥˜€¡ÑåÁ•½˜}½µµÍY¥•Ü€„ôô€‰Õ¹‘•™¥¹•ˆ€˜˜}½µµÍY¥•Ü€„ôô€‰…Ñ¥Ù”ˆ¤É•ÑÕÉ¸mtì(€€€€€½¹ÍÐ±½…±%‘Ì€ô¹•ÜM•Ð ¡ÑåÁ•½˜}½µµÍÉ…™ÑÌ€ôôô€‰Õ¹‘•™¥¹•ˆ€ümt€è}½µµÍÉ…™ÑÌ¤¹µ…À ¡¤€ôø¹¥¤¤ì(€€€€€½¹ÍÐ…½Õ¹Ð€ô•Ñ½Õ¹Ð ¤°­¥¹€ôÑåÁ•½˜}½µµÍ-¥¹€ôôô€‰Õ¹‘•™¥¹•ˆ€ü€ˆˆ€è}½µµÍ-¥¹ì(€€€€€½¹ÍÐÅÕ•Éä€ôMÑÉ¥¹œ¡ÑåÁ•½˜}½µµÍEÕ•Éä€ôôô€‰Õ¹‘•™¥¹•ˆ€ü€ˆˆ€è}½µµÍEÕ•Éä¤¹ÑÉ¥´ ¤¹Ñ½1½…±•1½Ý•É…Í” ‰•Ìˆ¤ì(€€€€€É•ÑÕÉ¸€¡‘½Õµ•¹ÑÌñðmt¤¹™¥±Ñ•È ¡É•½É¤€ôøì(€€€€€€€¥˜€ …¥Í½µµÕ¹¥…Ñ¥½¸¡É•½É¤¤É•ÑÕÉ¸™…±Í”ì(€€€€€€€¥˜€¡É•½É¹½Ý¹•É}¥€ôôô…½Õ¹Ð€˜˜É•½É¹Í½ÕÉ•}¥€˜˜±½…±%‘Ì¹¡…Ì¡É•½É¹Í½ÕÉ•}¥¤¤É•ÑÕÉ¸™…±Í”ì(€€€€€€€¥˜€¡­¥¹€˜˜€¡É•½É¹­¥¹ñð€‰µ•µ¼ˆ¤€„ôô­¥¹¤É•ÑÕÉ¸™…±Í”ì(€€€€€€€É•ÑÕÉ¸€…ÅÕ•ÉäñðmÉ•½É¹Ñ¥Ñ±”°É•½É¹½Ý¹•É}¹…µ”°­¥¹‘9…µ”¡É•½É¹­¥¹¤°±…‰•°¡É•½É¹É½±”¥t¹©½¥¸ ˆ€ˆ¤¹Ñ½1½…±•1½Ý•É…Í” ‰•Ìˆ¤¹¥¹±Õ‘•Ì¡ÅÕ•Éä¤ì(€€€€€ô¤ì(€€€ôì(€€€™Õ¹Ñ¥½¸ÕÁ‘…Ñ•M¡…É•‘½Õ¹ÑÌ¡‘½Õµ•¹ÑÌ¤ì(€€€€€¥˜€¡ÑåÁ•½˜}½µµÍÉ…™ÑÌ€ôôô€‰Õ¹‘•™¥¹•ˆ¤É•ÑÕÉ¸ì(€€€€€½¹ÍÐ±½…±%‘Ì€ô¹•ÜM•Ð¡}½µµÍÉ…™ÑÌ¹µ…À ¡¤€ôø¹¥¤¤°…½Õ¹Ð€ô•Ñ½Õ¹Ð ¤ì(€€€€€½¹ÍÐÍ¡…É•€ô€¡‘½Õµ•¹ÑÌñðmt¤¹™¥±Ñ•È ¡É•½É¤€ôø¥Í½µµÕ¹¥…Ñ¥½¸¡É•½É¤€˜˜€„¡É•½É¹½Ý¹•É}¥€ôôô…½Õ¹Ð€˜˜É•½É¹Í½ÕÉ•}¥€˜˜±½…±%‘Ì¹¡…Ì¡É•½É¹Í½ÕÉ•}¥¤¤¤ì(€€€€€‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½É±° ˆ¹½µµÌµ­¥¹µÑ…‰m‘…Ñ„µ­¥¹‘tˆ¤¹™½É…  ¡‰ÕÑÑ½¸¤€ôøì(€€€€€€€½¹ÍÐ­¥¹€ô‰ÕÑÑ½¸¹‘…Ñ…Í•Ð¹­¥¹°½Õ¹Ð€ôÍ¡…É•¹™¥±Ñ•È ¡É•½É¤€ôø€…­¥¹ñð€¡É•½É¹­¥¹ñð€‰µ•µ¼ˆ¤€ôôô­¥¹¤¹±•¹Ñ ì(€€€€€€€½¹ÍÐ±½…°€ô}½µµÍÉ…™ÑÌ¹™¥±Ñ•È ¡¤€ôø¹±¥™•å±”€ôôô€‰…Ñ¥Ù”ˆ€˜˜€ …­¥¹ñð€¡¹­¥¹ñð€‰µ•µ¼ˆ¤€ôôô­¥¹¤¤¹±•¹Ñ ì(€€€€€€€½¹ÍÐ‰…‘”€ô‰ÕÑÑ½¸¹ÅÕ•ÉåM•±•Ñ½È ˆ¹½µµÌµ­¥¹µ½Õ¹Ðˆ¤ì(€€€€€€€¥˜€¡‰…‘”¤‰…‘”¹Ñ•áÑ½¹Ñ•¹Ð€ôMÑÉ¥¹œ¡±½…°€¬½Õ¹Ð¤ì(€€€€€ô¤ì(€€€€€½¹ÍÐ…Ñ¥Ù•Q…ˆ€ô‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½È ˆ¹½µµÌµ±¥™•å±”µÑ…‰Ì‰ÕÑÑ½¸é™¥ÉÍÐµ¡¥±ÍÁ…¸ˆ¤ì(€€€€€¥˜€¡…Ñ¥Ù•Q…ˆ¤…Ñ¥Ù•Q…ˆ¹Ñ•áÑ½¹Ñ•¹Ð€ôMÑÉ¥¹œ¡}½µµÍÉ…™ÑÌ¹™¥±Ñ•È ¡¤€ôø¹±¥™•å±”€ôôô€‰…Ñ¥Ù”ˆ¤¹±•¹Ñ €¬Í¡…É•¹±•¹Ñ ¤ì(€€€ô(€€€™Õ¹Ñ¥½¸É•¹‘•ÉM¡…É•‘!½µ”¡É•ÍÕ±ÑÌ°‘½Õµ•¹ÑÌ¤ì(€€€€€É•ÍÕ±ÑÌ¹ÅÕ•ÉåM•±•Ñ½È ‰m‘…Ñ„µÍ¡…É•µ¡½µ•tˆ¤ü¹É•µ½Ù” ¤ì(€€€€€ÕÁ‘…Ñ•M¡…É•‘½Õ¹ÑÌ¡‘½Õµ•¹ÑÌ¤ì(€€€€€½¹ÍÐÉ•½É‘Ì€ôÍ¡…É•‘!½µ•I•½É‘Ì¡‘½Õµ•¹ÑÌ¤ì(€€€€€¥˜€ …É•½É‘Ì¹±•¹Ñ ¤É•ÑÕÉ¸ì(€€€€€É•ÍÕ±ÑÌ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹µ•µ¼µ•µÁÑäˆ¤ü¹Í•ÑÑÑÉ¥‰ÕÑ” ‰¡¥‘‘•¸ˆ°€ˆˆ¤ì(€€€€€½¹ÍÐÉ¥€ôÑåÁ•½˜}½µµÍ1…å½ÕÐ€„ôô€‰Õ¹‘•™¥¹•ˆ€˜˜}½µµÍ1…å½ÕÐ€ôôô€‰É¥ˆì(€€€€€½¹ÍÐÍ•Ñ¥½¸€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Í•Ñ¥½¸ˆ¤ì(€€€€€Í•Ñ¥½¸¹‘…Ñ…Í•Ð¹Í¡…É•‘!½µ”€ô€ˆˆì(€€€€€Í•Ñ¥½¸¹±…ÍÍ9…µ”€ô€‰½µµÌµÍ¡…É•µ±¥‰É…Éäˆ€¬€¡É¥€ü€ˆ¥ÌµÉ¥ˆ€è€ˆˆ¤ì(€€€€€Í•Ñ¥½¸¹Í•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ±…‰•±±•‘‰äˆ°€‰½µµÌµÍ¡…É•µ±¥‰É…ÉäµÑ¥Ñ±”ˆ¤ì(€€€€€½¹ÍÐ¡•…‘¥¹œ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€¡•…‘¥¹œ¹±…ÍÍ9…µ”€ô€‰½µµÌµÍ¡…É•µ±¥‰É…Éäµ¡•…‘¥¹œˆì(€€€€€½¹ÍÐ½ÁäÔ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤°Ñ¥Ñ±”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ Èˆ¤°¡¥¹Ð€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Àˆ¤°½Õ¹Ð€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€Ñ¥Ñ±”¹¥€ô€‰½µµÌµÍ¡…É•µ±¥‰É…ÉäµÑ¥Ñ±”ˆì(€€€€€Ñ¥Ñ±”¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰	¥‰±¥½Ñ•„‘•°•ÅÕ¥Á¼ˆì(€€€€€¡¥¹Ð¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰½µÕ¹¥…‘½ÌÉ•…‘½ÌÁ½È½ÑÉ…ÌÁ•ÉÍ½¹…Ìä‘½Õµ•¹Ñ½Ì½µÁ…ÉÑ¥‘½Ì½¹Ñ¥¼¸ˆì(€€€€€½ÁäÔ¹…ÁÁ•¹¡Ñ¥Ñ±”°¡¥¹Ð¤ì(€€€€€½Õ¹Ð¹Ñ•áÑ½¹Ñ•¹Ð€ôMÑÉ¥¹œ¡É•½É‘Ì¹±•¹Ñ ¤ì(€€€€€½Õ¹Ð¹Í•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ±…‰•°ˆ°€‘íÉ•½É‘Ì¹±•¹Ñ¡ô€‘íÉ•½É‘Ì¹±•¹Ñ €ôôô€Ä€ü€‰½µÕ¹¥…‘¼½µÁ…ÉÑ¥‘¼ˆ€è€‰½µÕ¹¥…‘½Ì½µÁ…ÉÑ¥‘½Ì‰õ€¤ì(€€€€€¡•…‘¥¹œ¹…ÁÁ•¹¡½ÁäÔ°½Õ¹Ð¤ì(€€€€€Í•Ñ¥½¸¹…ÁÁ•¹¡¡•…‘¥¹œ¤ì(€€€€€½¹ÍÐ±¥ÍÐ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€±¥ÍÐ¹±…ÍÍ9…µ”€ôÉ¥€ü€‰½µµÌµ±¥‰É…ÉäµÉ¥½µµÌµÍ¡…É•µ±¥‰É…ÉäµÉ¥ˆ€è€‰½µµÌµÍ¡…É•µ±¥‰É…ÉäµÉ½ÝÌˆì(€€€€€™½È€¡½¹ÍÐÉ•½É½˜É•½É‘Ì¤ì(€€€€€€€½¹ÍÐÉ½Ü€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰ÕÑÑ½¸ˆ¤ì(€€€€€€€É½Ü¹ÑåÁ”€ô€‰‰ÕÑÑ½¸ˆì(€€€€€€€É½Ü¹±…ÍÍ9…µ”€ôÉ¥€ü€‰½µµÌµÍ¡…É•µ…Éµ½Á•¸ˆ€è€‰½µµÌµÍ¡…É•µ±¥‰É…ÉäµÉ½Üˆì(€€€€€€€É½Ü¹‘…Ñ…Í•Ð¹Í¡…É•‘½µµÕ¹¥…Ñ¥½¸€ôÉ•½É¹¥ì(€€€€€€€½¹ÍÐ‰½‘ä€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤°Ñ½À€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤°­¥¹€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤°É•½É‘Q¥Ñ±”€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÑÉ½¹œˆ¤°µ•Ñ„€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤°…•ÍÌ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€€€‰½‘ä¹±…ÍÍ9…µ”€ô€‰½µµÌµÍ¡…É•µ±¥‰É…Éäµ½Áäˆì(€€€€€€€Ñ½À¹±…ÍÍ9…µ”€ô€‰½µµÌµÍ¡…É•µ±¥‰É…ÉäµÑ¥Ñ±”ˆì(€€€€€€€­¥¹¹±…ÍÍ9…µ”€ô€‰½µµÌµ‘½Õµ•¹Ðµ­¥¹ˆì(€€€€€€€­¥¹¹Ñ•áÑ½¹Ñ•¹Ð€ô­¥¹‘9…µ”¡É•½É¹­¥¹¤ì(€€€€€€€É•½É‘Q¥Ñ±”¹Ñ•áÑ½¹Ñ•¹Ð€ôÉ•½É¹Ñ¥Ñ±”ñð€‰½µÕ¹¥…‘¼Í¥¸ÑqáÑÕ±¼ˆì(€€€€€€€Ñ½À¹…ÁÁ•¹¡­¥¹°É•½É‘Q¥Ñ±”¤ì(€€€€€€€µ•Ñ„¹±…ÍÍ9…µ”€ô€‰½µµÌµÍ¡…É•µ±¥‰É…Éäµµ•Ñ„ˆì(€€€€€€€µ•Ñ„¹Ñ•áÑ½¹Ñ•¹Ð€ôA½È€‘íÉ•½É¹½Ý¹•É}¹…µ”ñð€‰ÅÕ¥Á¼M%II‰ô‘íÉ•½É¹ÕÁ‘…Ñ•‘}…Ð€ü€ˆqáÜ€ˆ€¬¹•Ü…Ñ”¡É•½É¹ÕÁ‘…Ñ•‘}…Ð¤¹Ñ½1½…±•…Ñ•MÑÉ¥¹œ ‰•ÌµPˆ°ì‘…äè€ˆÈµ‘¥¥Ðˆ°µ½¹Ñ è€‰Í¡½ÉÐˆ°å•…Èè€‰¹Õµ•É¥Œˆô¤€è€ˆ‰õ€ì(€€€€€€€‰½‘ä¹…ÁÁ•¹¡Ñ½À°µ•Ñ„¤ì(€€€€€€€…•ÍÌ¹±…ÍÍ9…µ”€ô€‰½µµÌµÍ¡…É•µ±¥‰É…Éäµ…•ÍÌˆì(€€€€€€€…•ÍÌ¹Ñ•áÑ½¹Ñ•¹Ð€ô±…‰•°¡É•½É¹É½±”¤ì(€€€€€€€É½Ü¹…ÁÁ•¹¡‰½‘ä°…•ÍÌ¤ì(€€€€€€€É½Ü¹½¹±¥¬€ô…Íå¹Œ€ ¤€ôøì(€€€€€€€€€É½Ü¹‘¥Í…‰±•€ôÑÉÕ”ì(€€€€€€€€€ÑÉäì(€€€€€€€€€€€…Ý…¥Ð½Á•¸¡É•½É¹¥¤ì(€€€€€€€€€ô…Ñ €¡•ÉÉ½È¤ì(€€€€€€€€€€€É½Ü¹‘¥Í…‰±•€ô™…±Í”ì(€€€€€€€€€€€µ•ÍÍ…”¡‘¥…±½œ ‰	¥‰±¥½Ñ•„‘•°•ÅÕ¥Á¼ˆ¤°•ÉÉ½È¹µ•ÍÍ…”ñð€‰9¼Í”ÁÕ‘¼…‰É¥È•°½µÕ¹¥…‘¼¸ˆ°ÑÉÕ”¤ì(€€€€€€€€€ô(€€€€€€€ôì(€€€€€€€¥˜€¡É¥¤ì(€€€€€€€€€½¹ÍÐ…É€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰…ÉÑ¥±”ˆ¤ì(€€€€€€€€€…É¹±…ÍÍ9…µ”€ô€‰½µµÌµÍ¡…É•µ±¥‰É…Éäµ…Éˆì(€€€€€€€€€…É¹‘…Ñ…Í•Ð¹­¥¹€ôÉ•½É¹­¥¹ñð€‰µ•µ¼ˆì(€€€€€€€€€½¹ÍÐÁÉ•Ù¥•Ü€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤°±½…‘¥¹œ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€€€€€ÁÉ•Ù¥•Ü¹±…ÍÍ9…µ”€ô€‰½µµÌµ…ÉµÁÉ•Ù¥•Ü½µµÌµÍ¡…É•µ…ÉµÁÉ•Ù¥•Üˆì(€€€€€€€€€ÁÉ•Ù¥•Ü¹‘…Ñ…Í•Ð¹Í¡…É•‘AÉ•Ù¥•Ü€ôÉ•½É¹¥ì(€€€€€€€€€ÁÉ•Ù¥•Ü¹Í•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ¡¥‘‘•¸ˆ°€‰ÑÉÕ”ˆ¤ì(€€€€€€€€€±½…‘¥¹œ¹±…ÍÍ9…µ”€ô€‰½µµÌµÍ¡…É•µÁÉ•Ù¥•Üµ±½…‘¥¹œˆì(€€€€€€€€€±½…‘¥¹œ¹¥¹¹•É!Q50€ô…Á¤¹¥½¸ ‰™¥±”ˆ°€Èà¤€¬€ˆñÍÁ…¸ù…É…¹‘¼Ù¥ÍÑ„ÁÉ•Ù¥…qÔÈÀÈØð½ÍÁ…¸øˆì(€€€€€€€€€ÁÉ•Ù¥•Ü¹…ÁÁ•¹¡±½…‘¥¹œ¤ì(€€€€€€€€€É½Ü¹ÁÉ•Á•¹¡ÁÉ•Ù¥•Ü¤ì(€€€€€€€€€…É¹…ÁÁ•¹¡É½Ü¤ì(€€€€€€€€€±¥ÍÐ¹…ÁÁ•¹¡…É¤ì(€€€€€€€ô•±Í”±¥ÍÐ¹…ÁÁ•¹¡É½Ü¤ì(€€€€€ô(€€€€€Í•Ñ¥½¸¹…ÁÁ•¹¡±¥ÍÐ¤ì(€€€€€½¹ÍÐ¡•…€ôÉ•ÍÕ±ÑÌ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹½µµÌµÉ•ÍÕ±ÑÌµ¡•…ˆ¤ì(€€€€€¥˜€¡¡•…¤¡•…¹…™Ñ•È¡Í•Ñ¥½¸¤ì(€€€€€•±Í”É•ÍÕ±ÑÌ¹ÁÉ•Á•¹¡Í•Ñ¥½¸¤ì(€€€€€¥˜€¡É¥¤½‰Í•ÉÙ•M¡…É•‘AÉ•Ù¥•ÝÌ¡Í•Ñ¥½¸°É•½É‘Ì¤ì(€€€ô(€€€½¹ÍÐÉÕ¹AÉ•Ù¥•ÝEÕ•Õ”€ô€ ¤€ôøì(€€€€€Ý¡¥±”€¡ÁÉ•Ù¥•ÝÑ¥Ù”€ð€È€˜˜ÁÉ•Ù¥•ÝEÕ•Õ”¹±•¹Ñ ¤ì(€€€€€€€½¹ÍÐ©½ˆ€ôÁÉ•Ù¥•ÝEÕ•Õ”¹Í¡¥™Ð ¤ì(€€€€€€€ÁÉ•Ù¥•ÝÑ¥Ù”¬¬ì(€€€€€€€AÉ½µ¥Í”¹É•Í½±Ù” ¤¹Ñ¡•¸¡©½ˆ¹Ñ…Í¬¤¹Ñ¡•¸¡©½ˆ¹É•Í½±Ù”°©½ˆ¹É•©•Ð¤¹™¥¹…±±ä  ¤€ôøì(€€€€€€€€€ÁÉ•Ù¥•ÝÑ¥Ù”´´ì(€€€€€€€€€ÉÕ¹AÉ•Ù¥•ÝEÕ•Õ” ¤ì(€€€€€€€ô¤ì(€€€€€ô(€€€ôì(€€€½¹ÍÐ•¹ÅÕ•Õ•AÉ•Ù¥•Ü€ô€¡Ñ…Í¬¤€ôø¹•ÜAÉ½µ¥Í” ¡É•Í½±Ù”°É•©•Ð¤€ôøì(€€€€€ÁÉ•Ù¥•ÝEÕ•Õ”¹ÁÕÍ ¡ìÑ…Í¬°É•Í½±Ù”°É•©•Ðô¤ì(€€€€€ÉÕ¹AÉ•Ù¥•ÝEÕ•Õ” ¤ì(€€€ô¤ì(€€€…Íå¹Œ™Õ¹Ñ¥½¸Í¡…É•‘AÉ•Ù¥•Ý!Ñµ°¡É•½É¤ì(€€€€€½¹ÍÐ­•ä€ô€‘íÉ•½É¹¥‘ôè‘íÉ•½É¹ÕÁ‘…Ñ•‘}…Ðñð€ˆ‰õ€ì(€€€€€¥˜€¡ÁÉ•Ù¥•Ý…¡”¹¡…Ì¡­•ä¤¤É•ÑÕÉ¸ÁÉ•Ù¥•Ý…¡”¹•Ð¡­•ä¤ì(€€€€€¥˜€¡ÁÉ•Ù¥•ÝA•¹‘¥¹œ¹¡…Ì¡­•ä¤¤É•ÑÕÉ¸ÁÉ•Ù¥•ÝA•¹‘¥¹œ¹•Ð¡­•ä¤ì(€€€€€½¹ÍÐÁ•¹‘¥¹œ€ô•¹ÅÕ•Õ•AÉ•Ù¥•Ü¡…Íå¹Œ€ ¤€ôøì(€€€€€€€½¹ÍÐ‘…Ñ„€ô…Ý…¥ÐÉÁŒ ‰½µµÕ¹¥…Ñ¥½¹}Íå¹Œˆ°ìÁ}¥èÉ•½É¹¥°Á}…™Ñ•Èè€´Ä°Á}¹½¹”è¹Õ±°°Á}ÕÁ‘…Ñ”è¹Õ±°°Á}Í•ÍÍ¥½¸è¹Õ±°°Á}…Ý…É•¹•ÍÌè¹Õ±°ô¤ì(€€€€€€€½¹ÍÐµ½‘•°€ô¹•Ü½µµÕ¹¥…Ñ¥½¹5½‘•° ¤ì(€€€€€€€ÑÉäì(€€€€€€€€€µ½‘•°¹‘½Œ¹ÑÉ…¹Í…Ð  ¤€ôøì(€€€€€€€€€€€¥˜€¡‘…Ñ„ü¹Í¹…ÁÍ¡½Ð¤å©Í}•áÁ½ÉÑÌ¹…ÁÁ±åUÁ‘…Ñ”¡µ½‘•°¹‘½Œ°™É½µ	…Í”ØÐ¡‘…Ñ„¹Í¹…ÁÍ¡½Ð¤°€‰É•µ½Ñ”ˆ¤ì(€€€€€€€€€€€™½È€¡½¹ÍÐÕÁ‘…Ñ”½˜‘…Ñ„ü¹ÕÁ‘…Ñ•Ìñðmt¤å©Í}•áÁ½ÉÑÌ¹…ÁÁ±åUÁ‘…Ñ”¡µ½‘•°¹‘½Œ°™É½µ	…Í”ØÐ¡ÕÁ‘…Ñ”¹Á…å±½…¤°€‰É•µ½Ñ”ˆ¤ì(€€€€€€€€€ô°€‰É•µ½Ñ”ˆ¤ì(€€€€€€€€€½¹ÍÐ‘É…™Ð€ôÉ•…‘5½‘•°¡µ½‘•°¤ì(€€€€€€€€€…Á¤¹Ù…±¥‘…Ñ”¡‘É…™Ð¤ì(€€€€€€€€€É•ÑÕÉ¸…Á¤¹ÁÉ•Ù¥•Ý!Ñµ°¡‘É…™Ð¤ì(€€€€€€€ô™¥¹…±±äì(€€€€€€€€€µ½‘•°¹‘½Œ¹‘•ÍÑÉ½ä ¤ì(€€€€€€€ô(€€€€€ô¤ì(€€€€€ÁÉ•Ù¥•ÝA•¹‘¥¹œ¹Í•Ð¡­•ä°Á•¹‘¥¹œ¤ì(€€€€€ÑÉäì(€€€€€€€½¹ÍÐ¡Ñµ°€ô…Ý…¥ÐÁ•¹‘¥¹œì(€€€€€€€ÁÉ•Ù¥•Ý…¡”¹Í•Ð¡­•ä°¡Ñµ°¤ì(€€€€€€€Ý¡¥±”€¡ÁÉ•Ù¥•Ý…¡”¹Í¥é”€ø€ÈÐ¤ÁÉ•Ù¥•Ý…¡”¹‘•±•Ñ”¡ÁÉ•Ù¥•Ý…¡”¹­•åÌ ¤¹¹•áÐ ¤¹Ù…±Õ”¤ì(€€€€€€€É•ÑÕÉ¸¡Ñµ°ì(€€€€€ô™¥¹…±±äì(€€€€€€€ÁÉ•Ù¥•ÝA•¹‘¥¹œ¹‘•±•Ñ”¡­•ä¤ì(€€€€€ô(€€€ô(€€€™Õ¹Ñ¥½¸½‰Í•ÉÙ•M¡…É•‘AÉ•Ù¥•ÝÌ¡Í•Ñ¥½¸°É•½É‘Ì¤ì(€€€€€½¹ÍÐ‰å%€ô¹•Ü5…À¡É•½É‘Ì¹µ…À ¡É•½É¤€ôømÉ•½É¹¥°É•½É‘t¤¤°É•ÅÕ•ÍÐ€ô¡½µ•I•ÅÕ•ÍÐì(€€€€€½¹ÍÐ±½…€ô…Íå¹Œ€¡¡½ÍÐ¤€ôøì(€€€€€€€¥˜€¡¡½ÍÐ¹‘…Ñ…Í•Ð¹ÁÉ•Ù¥•ÝMÑ…Ñ”¤É•ÑÕÉ¸ì(€€€€€€€¡½ÍÐ¹‘…Ñ…Í•Ð¹ÁÉ•Ù¥•ÝMÑ…Ñ”€ô€‰±½…‘¥¹œˆì(€€€€€€€ÑÉäì(€€€€€€€€€½¹ÍÐ¡Ñµ°€ô…Ý…¥ÐÍ¡…É•‘AÉ•Ù¥•Ý!Ñµ°¡‰å%¹•Ð¡¡½ÍÐ¹‘…Ñ…Í•Ð¹Í¡…É•‘AÉ•Ù¥•Ü¤¤ì(€€€€€€€€€¥˜€¡É•ÅÕ•ÍÐ€„ôô¡½µ•I•ÅÕ•ÍÐñð€…¡½ÍÐ¹¥Í½¹¹•Ñ•¤É•ÑÕÉ¸ì(€€€€€€€€€½¹ÍÐÍ¡••Ð€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€€€€€Í¡••Ð¹±…ÍÍ9…µ”€ô€‰½µµÌµ…ÉµÁÉ•Ù¥•ÜµÍ¡••Ðˆì(€€€€€€€€€Í¡••Ð¹¥¹¹•É!Q50€ô¡Ñµ°ì(€€€€€€€€€¡½ÍÐ¹É•Á±…•¡¥±‘É•¸¡Í¡••Ð¤ì(€€€€€€€€€¡½ÍÐ¹‘…Ñ…Í•Ð¹ÁÉ•Ù¥•ÝMÑ…Ñ”€ô€‰É•…‘äˆì(€€€€€€€ô…Ñ €¡•ÉÉ½È¤ì(€€€€€€€€€¥˜€¡É•ÅÕ•ÍÐ€„ôô¡½µ•I•ÅÕ•ÍÐñð€…¡½ÍÐ¹¥Í½¹¹•Ñ•¤É•ÑÕÉ¸ì(€€€€€€€€€½¹ÍÐ™…±±‰…¬€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰ÍÁ…¸ˆ¤ì(€€€€€€€€€™…±±‰…¬¹±…ÍÍ9…µ”€ô€‰½µµÌµÍ¡…É•µÁÉ•Ù¥•Üµ±½…‘¥¹œ¥Ìµ•ÉÉ½Èˆì(€€€€€€€€€™…±±‰…¬¹¥¹¹•É!Q50€ô…Á¤¹¥½¸ ‰™¥±”ˆ°€Èà¤€¬€ˆñÍÁ…¸ùY¥ÍÑ„ÁÉ•Ù¥„¹¼‘¥ÍÁ½¹¥‰±”ð½ÍÁ…¸øˆì(€€€€€€€€€¡½ÍÐ¹É•Á±…•¡¥±‘É•¸¡™…±±‰…¬¤ì(€€€€€€€€€¡½ÍÐ¹‘…Ñ…Í•Ð¹ÁÉ•Ù¥•ÝMÑ…Ñ”€ô€‰•ÉÉ½Èˆì(€€€€€€€ô(€€€€€ôì(€€€€€½¹ÍÐ¡½ÍÑÌ€ôl¸¸¹Í•Ñ¥½¸¹ÅÕ•ÉåM•±•Ñ½É±° ‰m‘…Ñ„µÍ¡…É•µÁÉ•Ù¥•Ýtˆ¥tì(€€€€€¥˜€ ‰%¹Ñ•ÉÍ•Ñ¥½¹=‰Í•ÉÙ•Èˆ¥¸Ý¥¹‘½Ü¤ì(€€€€€€€¡½µ•=‰Í•ÉÙ•È€ô¹•Ü%¹Ñ•ÉÍ•Ñ¥½¹=‰Í•ÉÙ•È ¡•¹ÑÉ¥•Ì¤€ôø•¹ÑÉ¥•Ì¹™½É…  ¡•¹ÑÉä¤€ôøì(€€€€€€€€€¥˜€¡•¹ÑÉä¹¥Í%¹Ñ•ÉÍ•Ñ¥¹œ¤ì(€€€€€€€€€€€¡½µ•=‰Í•ÉÙ•Èü¹Õ¹½‰Í•ÉÙ”¡•¹ÑÉä¹Ñ…É•Ð¤ì(€€€€€€€€€€€±½…¡•¹ÑÉä¹Ñ…É•Ð¤ì(€€€€€€€€€ô(€€€€€€€ô¤°ìÉ½½Ñ5…É¥¸è€ˆÈÐÁÁà€ÁÁàˆô¤ì(€€€€€€€¡½ÍÑÌ¹™½É…  ¡¡½ÍÐ¤€ôø¡½µ•=‰Í•ÉÙ•È¹½‰Í•ÉÙ”¡¡½ÍÐ¤¤ì(€€€€€ô•±Í”¡½ÍÑÌ¹™½É… ¡±½…¤ì(€€€ô(€€€…Íå¹Œ™Õ¹Ñ¥½¸±½…‘M¡…É•‘!½µ” ¤ì(€€€€€½¹ÍÐÉ•ÅÕ•ÍÐ€ô€¬­¡½µ•I•ÅÕ•ÍÐ°É•ÍÕ±ÑÌ€ô‘½Õµ•¹Ð¹•Ñ±•µ•¹Ñ	å% ‰½µµÌµÉ•ÍÕ±ÑÌˆ¤ì(€€€€€¡½µ•=‰Í•ÉÙ•Èü¹‘¥Í½¹¹•Ð ¤ì(€€€€€¡½µ•=‰Í•ÉÙ•È€ô¹Õ±°ì(€€€€€¥˜€ …É•ÍÕ±ÑÌñð€…‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½È ˆ¹½µµÌµ¡½µ”ˆ¤¤É•ÑÕÉ¸ì(€€€€€É•ÍÕ±ÑÌ¹ÅÕ•ÉåM•±•Ñ½È ‰m‘…Ñ„µÍ¡…É•µ¡½µ•tˆ¤ü¹É•µ½Ù” ¤ì(€€€€€¥˜€¡ÑåÁ•½˜}½µµÍY¥•Ü€„ôô€‰Õ¹‘•™¥¹•ˆ€˜˜}½µµÍY¥•Ü€„ôô€‰…Ñ¥Ù”ˆ¤É•ÑÕÉ¸ì(€€€€€½¹ÍÐ±½…‘¥¹œ€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰Àˆ¤ì(€€€€€±½…‘¥¹œ¹‘…Ñ…Í•Ð¹Í¡…É•‘!½µ”€ô€ˆˆì(€€€€€±½…‘¥¹œ¹±…ÍÍ9…µ”€ô€‰½µµÌµÍ¡…É•µ±¥‰É…Éäµ±½…‘¥¹œˆì(€€€€€±½…‘¥¹œ¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰…É…¹‘¼‰¥‰±¥½Ñ•„‘•°•ÅÕ¥Á½qÔÈÀÈØˆì(€€€€€É•ÍÕ±ÑÌ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹½µµÌµÉ•ÍÕ±ÑÌµ¡•…ˆ¤ü¹…™Ñ•È¡±½…‘¥¹œ¤ì(€€€€€ÑÉäì(€€€€€€€½¹ÍÐ‘½Õµ•¹ÑÌ€ô…Ý…¥ÐÉÁŒ ‰½µµÕ¹¥…Ñ¥½¹}±¥ÍÐˆ¤ì(€€€€€€€¥˜€¡É•ÅÕ•ÍÐ€„ôô¡½µ•I•ÅÕ•ÍÐñðÉ•ÍÕ±ÑÌ€„ôô‘½Õµ•¹Ð¹•Ñ±•µ•¹Ñ	å% ‰½µµÌµÉ•ÍÕ±ÑÌˆ¤¤É•ÑÕÉ¸ì(€€€€€€€É•¹‘•ÉM¡…É•‘!½µ”¡É•ÍÕ±ÑÌ°‘½Õµ•¹ÑÌñðmt¤ì(€€€€€ô…Ñ €¡•ÉÉ½È¤ì(€€€€€€€¥˜€¡É•ÅÕ•ÍÐ€„ôô¡½µ•I•ÅÕ•ÍÐñðÉ•ÍÕ±ÑÌ€„ôô‘½Õµ•¹Ð¹•Ñ±•µ•¹Ñ	å% ‰½µµÌµÉ•ÍÕ±ÑÌˆ¤¤É•ÑÕÉ¸ì(€€€€€€€±½…‘¥¹œ¹Ñ•áÑ½¹Ñ•¹Ð€ô€‰9¼Í”ÁÕ‘¼…É…È±„‰¥‰±¥½Ñ•„‘•°•ÅÕ¥Á¼¸QÕÌ‘½Õµ•¹Ñ½Ì±½…±•ÌÍ¥Õ•¸‘¥ÍÁ½¹¥‰±•Ì¸ˆì(€€€€€€€±½…‘¥¹œ¹±…ÍÍ1¥ÍÐ¹…‘ ‰¥Ìµ•ÉÉ½Èˆ¤ì(€€€€€ô(€€€ô(€€€™Õ¹Ñ¥½¸É•¹‘•É• ¤ì(€€€€€¥˜€ ……Á¤¹ÕÉÉ•¹Ð ¤¤É•ÑÕÉ¸ì(€€€€€½¹ÍÐ¡•…‘•È€ô‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½È ˆÁÉ½‘ÕÐµ½¹ÑÉ½±Ì€¹½µµÌµ¡•…‘•Èµ…Ñ¥½¹Ì°¹µ•µ¼µÁ…¹•°µ¡•…€¹½µµÌµ¡•…‘•Èµ…Ñ¥½¹Ìˆ¤ì(€€€€€¥˜€ ……Ñ¥Ù” ¤¤É•ÑÕÉ¸ì(€€€€€‘•ÍÑÉ½åY¥•ÝÌ ¤ì(€€€€€½¹ÍÐÁ…¹•°€ô‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½È ˆ¹µ•µ¼µÕÍÑ½µ¥é•Èˆ¤ì(€€€€€¥˜€ …Á…¹•°¤É•ÑÕÉ¸ì(€€€€€¥˜€ …‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½È ˆ¹½µµÌµ½±±…ˆµ‰…Èˆ¤¤ì(€€€€€€€½¹ÍÐ‰…È€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‘¥Øˆ¤ì(€€€€€€€‰…È¹±…ÍÍ9…µ”€ô€‰½µµÌµ½±±…ˆµ‰…Èˆì(€€€€€€€¡•…‘•Èü¹‰•™½É”¡‰…È¤ì(€€€€€ô(€€€€€‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½É±° ˆ¹µ•µ¼µÉ¥ µ•‘¥Ñ½Ém‘…Ñ„µ‰±½¬µ¥‘tˆ¤¹™½É…  ¡•±•µ•¹ÐÈ¤€ôøì(€€€€€€€½¹ÍÐ¥È€ô•±•µ•¹ÐÈ¹‘…Ñ…Í•Ð¹‰±½­%°™É…µ•¹Ð€ôÍ•ÍÍ¥½¸¹µ½‘•°¹‘½Œ¹•Ñaµ±É…µ•¹Ð ‰É¥ èˆ€¬¥È¤ì(€€€€€€€½¹ÍÐ…É•„€ô…É•…9…µ”¡•±•µ•¹ÐÈ°l¸¸¹‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½É±° ˆ¹µ•µ¼µÉ¥ µ•‘¥Ñ½Ém‘…Ñ„µ‰±½¬µ¥‘tˆ¥t¹¥¹‘•á=˜¡•±•µ•¹ÐÈ¤¤ì(€€€€€€€•±•µ•¹ÐÈ¹‘…Ñ…Í•Ð¹½±±…‰-•ä€ô¥Èì(€€€€€€€½¹ÍÐÙ¥•Ü€ô‰¥¹‘I¥ ¡ì•±•µ•¹Ðè•±•µ•¹ÐÈ°™É…µ•¹Ð°…Ý…É•¹•ÍÌèÍ•ÍÍ¥½¸¹…Ý…É•¹•ÍÌ°•‘¥Ñ…‰±”°™¥•±è¥È°…É•„°½¹Ñ¥Ù¥Ñäè€ ¤€ôøÍ•ÑÑ¥Ù¥Ñä¡¥È°…É•„°€‰ÕÉÍ½Èˆ¤°½¹¡…¹”è€ ¤€ôøì(€€€€€€€€€¥˜€ ……Ñ¥Ù” ¤¤É•ÑÕÉ¸ì(€€€€€€€€€½¹ÍÐ‰±½¬€ôÉ¥¡	±½­Ì¡…Á¤¹ÕÉÉ•¹Ð ¤¤¹™¥¹ ¡ˆ¤€ôøˆ¹¥€ôôô¥È¤ì(€€€€€€€€€¥˜€¡‰±½¬¤ì(€€€€€€€€€€€=‰©•Ð¹…ÍÍ¥¸¡‰±½¬°É•…‘I¥ ¡™É…µ•¹Ð¤¤ì(€€€€€€€€€€€…Á¤¹ÁÉ•Ù¥•Ü ¤ì(€€€€€€€€€ô•±Í”¥˜€¡¥È€ôôô€‰¹½Ñ¥”µµ•ÍÍ…”ˆ€˜˜…Á¤¹ÕÉÉ•¹Ð ¤¹­¥¹€ôôô€‰…Ù¥Í¼ˆ¤ì(€€€€€€€€€€€½¹ÍÐÉ¥ €ôÉ•…‘I¥ ¡™É…µ•¹Ð°ÑÉÕ”¤ì(€€€€€€€€€€€…Á¤¹ÕÉÉ•¹Ð ¤¹¹½Ñ¥•I¥¡!Ñµ°€ôÉ¥ ¹É¥¡!Ñµ°ì(€€€€€€€€€€€…Á¤¹ÕÉÉ•¹Ð ¤¹¹½Ñ¥•5•ÍÍ…”€ôÉ¥ ¹½¹Ñ•¹Ðì(€€€€€€€€€€€…Á¤¹ÁÉ•Ù¥•Ü ¤ì(€€€€€€€€€ô(€€€€€€€ôô¤ì(€€€€€€€Ù¥•ÝÌ¹Í•Ð¡•±•µ•¹ÐÈ°Ù¥•Ü¤ì(€€€€€€€½¹ÍÐÑ½½±‰…È€ô•±•µ•¹ÐÈ¹Á…É•¹Ñ±•µ•¹Ðü¹ÅÕ•ÉåM•±•Ñ½È ˆ¹µ•µ¼µÉ¥ µÑ½½±‰…Èˆ¤ì(€€€€€€€¥˜€¡Ñ½½±‰…È€˜˜€…Ñ½½±‰…È¹ÅÕ•ÉåM•±•Ñ½È ‰m‘…Ñ„µ½µµ•¹Ðµ…Ñ¥½¹tˆ¤¤ì(€€€€€€€€€½¹ÍÐ‰ÕÑÑ½¸€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰ÕÑÑ½¸ˆ¤ì(€€€€€€€€€‰ÕÑÑ½¸¹ÑåÁ”€ô€‰‰ÕÑÑ½¸ˆì(€€€€€€€€€‰ÕÑÑ½¸¹‘…Ñ…Í•Ð¹½µµ•¹ÑÑ¥½¸€ô€ˆˆì(€€€€€€€€€‰ÕÑÑ½¸¹Ñ¥Ñ±”€ô€‰½µ•¹Ñ…ÈÍ•±•¥qáÍ¸ˆì(€€€€€€€€€‰ÕÑÑ½¸¹Í•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µ±…‰•°ˆ°€‰½µ•¹Ñ…ÈÑ•áÑ¼Í•±•¥½¹…‘¼ˆ¤ì(€€€€€€€€€‰ÕÑÑ½¸¹¥¹¹•É!Q50€ô…Á¤¹¥½¸ ‰µ•ÍÍ…”ˆ°€ÄØ¤€¬€ˆ½µ•¹Ñ…Èˆì(€€€€€€€€€‰ÕÑÑ½¸¹½¹±¥¬€ô€ ¤€ôø…‘‘½µµ•¹Ð¡Ù¥•Ü°¥È¤ì(€€€€€€€€€Ñ½½±‰…È¹…ÁÁ•¹¡‰ÕÑÑ½¸¤ì(€€€€€€€ô(€€€€€€€•±•µ•¹ÐÈ¹ÅÕ•ÉåM•±•Ñ½É±° ‰µ…É­m‘…Ñ„µ½µµ•¹Ðµ¥‘tˆ¤¹™½É…  ¡µ…É¬¤€ôøì(€€€€€€€€€µ…É¬¹Ñ…‰%¹‘•à€ô€Àì(€€€€€€€€€µ…É¬¹Ñ¥Ñ±”€ô€‰‰É¥È½µ•¹Ñ…É¥¼ˆì(€€€€€€€€€µ…É¬¹½¹±¥¬€ô€ ¤€ôø½µµ•¹ÑÍ¥…±½œ¡µ…É¬¹‘…Ñ…Í•Ð¹½µµ•¹Ñ%¤ì(€€€€€€€€€µ…É¬¹½¹­•å‘½Ý¸€ô€¡•Ù•¹Ð¤€ôøì(€€€€€€€€€€€¥˜€¡•Ù•¹Ð¹­•ä€ôôô€‰¹Ñ•Èˆñð•Ù•¹Ð¹­•ä€ôôô€ˆ€ˆ¤ì(€€€€€€€€€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€€€€€€€€€€€½µµ•¹ÑÍ¥…±½œ¡µ…É¬¹‘…Ñ…Í•Ð¹½µµ•¹Ñ%¤ì(€€€€€€€€€€€ô(€€€€€€€€€ôì(€€€€€€€ô¤ì(€€€€€ô¤ì(€€€€€½¹ÍÐ½¹ÑÉ½±Ì€ôl¸¸¹Á…¹•°¹ÅÕ•ÉåM•±•Ñ½É±° œ¹µ•µ¼µ™½É´¥¹ÁÕÐ°¹µ•µ¼µ™½É´Ñ•áÑ…É•„°¹µ•µ¼µ™½É´Í•±•Ð°¹µ•µ¼µ™½É´‰ÕÑÑ½¸°¹µ•µ¼µ™½É´mÉ½±”ô‰‰ÕÑÑ½¸‰t°¹µ•µ¼µ™½É´ÍÕµµ…Éäœ¥t¹™¥±Ñ•È ¡•±•µ•¹ÐÈ¤€ôø€…•±•µ•¹ÐÈ¹±½Í•ÍÐ ˆ¹µ•µ¼µÉ¥ µÑ½½±‰…Èˆ¤€˜˜€…•±•µ•¹ÐÈ¹±½Í•ÍÐ ˆ¹µ•µ¼µÉ¥ µ•‘¥Ñ½Èˆ¤¤ì(€€€€€½¹ÑÉ½±Ì¹™½É…  ¡•±•µ•¹ÐÈ°¥¹‘•à¤€ôøì(€€€€€€€½¹ÍÐ­•ä€ô½¹ÑÉ½±-•ä¡•±•µ•¹ÐÈ°¥¹‘•à¤°…É•„€ô…É•…9…µ”¡•±•µ•¹ÐÈ°¥¹‘•à¤ì(€€€€€€€•±•µ•¹ÐÈ¹‘…Ñ…Í•Ð¹½±±…‰-•ä€ô­•äì(€€€€€€€½¹ÍÐ™½ÕÍ•€ô€ ¤€ôøÍ•ÑÑ¥Ù¥Ñä¡­•ä°…É•„°•±•µ•¹ÐÈ¹µ…Ñ¡•Ì ‰¥¹ÁÕÐ±Ñ•áÑ…É•„ˆ¤€ü€‰™¥•±ˆ€è€‰…É•„ˆ¤ì(€€€€€€€•±•µ•¹ÐÈ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰™½ÕÌˆ°™½ÕÍ•¤ì(€€€€€€€•±•µ•¹ÐÈ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰Á½¥¹Ñ•É‘½Ý¸ˆ°™½ÕÍ•¤ì(€€€€€€€¥¹ÁÕÑ±•…¹ÕÁÌ¹ÁÕÍ   ¤€ôøì(€€€€€€€€€•±•µ•¹ÐÈ¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È ‰™½ÕÌˆ°™½ÕÍ•¤ì(€€€€€€€€€•±•µ•¹ÐÈ¹É•µ½Ù•Ù•¹Ñ1¥ÍÑ•¹•È ‰Á½¥¹Ñ•É‘½Ý¸ˆ°™½ÕÍ•¤ì(€€€€€€€ô¤ì(€€€€€ô¤ì(€€€€€‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½É±° ˆ¹µ•µ¼µ™½É´¥¹ÁÕÐ°¹µ•µ¼µ™½É´Ñ•áÑ…É•„ˆ¤¹™½É…  ¡•±•µ•¹ÐÈ¤€ôøì(€€€€€€€½¹ÍÐ¡…¹‘±•È€ô•±•µ•¹ÐÈ¹•ÑÑÑÉ¥‰ÕÑ” ‰½¹¥¹ÁÕÐˆ¤ñð€ˆˆì(€€€€€€€½¹ÍÐÉ½½Ð€ô¡…¹‘±•È¹µ…Ñ  ½½µµÍM•Ñp œ¡mxt¬¤œ¼¤°‰±½¬€ô¡…¹‘±•È¹µ…Ñ  ½½µµÍM•Ñ	±½­p œ¡mxt¬¤qÌ¨±qÌ¨œ¡mxt¬¤œ¼¤ì(€€€€€€€±•ÐÑåÁ”€ôÉ½½Ð€üÍ•ÍÍ¥½¸¹µ½‘•°¹É½½Ð¹•Ð¡É½½ÑlÅt¤€è¹Õ±°ì(€€€€€€€¥˜€¡‰±½¬¤ÑåÁ”€ôÍ•ÍÍ¥½¸¹µ½‘•°¹É½½Ð¹•Ð ‰‰±½­Ìˆ¤ü¹•Ð ‰}¥Ñ•µÌˆ¤ü¹•Ð¡‰±½­lÅt¤ü¹•Ð¡‰±½­lÉt¤ì(€€€€€€€¥˜€ „¡ÑåÁ”¥¹ÍÑ…¹•½˜å©Í}•áÁ½ÉÑÌ¹Q•áÐ¤¤É•ÑÕÉ¸ì(€€€€€€€±•Ð…¹¡½È€ô¹Õ±°°¡•…€ô¹Õ±°ì(€€€€€€€½¹ÍÐ‰•™½É”€ô€ ¤€ôøì(€€€€€€€€€¥˜€¡‘½Õµ•¹Ð¹…Ñ¥Ù•±•µ•¹Ð€„ôô•±•µ•¹ÐÈñð•±•µ•¹ÐÈ¹Í•±•Ñ¥½¹MÑ…ÉÐ€ôôô¹Õ±°¤É•ÑÕÉ¸ì(€€€€€€€€€…¹¡½È€ôå©Í}•áÁ½ÉÑÌ¹É•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹É½µQåÁ•%¹‘•à¡ÑåÁ”°5…Ñ ¹µ¥¸¡•±•µ•¹ÐÈ¹Í•±•Ñ¥½¹MÑ…ÉÐ°ÑåÁ”¹±•¹Ñ ¤¤ì(€€€€€€€€€¡•…€ôå©Í}•áÁ½ÉÑÌ¹É•…Ñ•I•±…Ñ¥Ù•A½Í¥Ñ¥½¹É½µQåÁ•%¹‘•à¡ÑåÁ”°5…Ñ ¹µ¥¸¡•±•µ•¹ÐÈ¹Í•±•Ñ¥½¹¹°ÑåÁ”¹±•¹Ñ ¤¤ì(€€€€€€€ôì(€€€€€€€½¹ÍÐ¡…¹•€ô€ ¤€ôøì(€€€€€€€€€¥˜€¡•±•µ•¹ÐÈ¹Ù…±Õ”€ôôôÑåÁ”¹Ñ½MÑÉ¥¹œ ¤¤É•ÑÕÉ¸ì(€€€€€€€€€•±•µ•¹ÐÈ¹Ù…±Õ”€ôÑåÁ”¹Ñ½MÑÉ¥¹œ ¤ì(€€€€€€€€€¥˜€¡‘½Õµ•¹Ð¹…Ñ¥Ù•±•µ•¹Ð€ôôô•±•µ•¹ÐÈ€˜˜…¹¡½È€˜˜¡•…¤ì(€€€€€€€€€€€½¹ÍÐ„€ôå©Í}•áÁ½ÉÑÌ¹É•…Ñ•‰Í½±ÕÑ•A½Í¥Ñ¥½¹É½µI•±…Ñ¥Ù•A½Í¥Ñ¥½¸¡…¹¡½È°Í•ÍÍ¥½¸¹µ½‘•°¹‘½Œ¤°ˆ€ôå©Í}•áÁ½ÉÑÌ¹É•…Ñ•‰Í½±ÕÑ•A½Í¥Ñ¥½¹É½µI•±…Ñ¥Ù•A½Í¥Ñ¥½¸¡¡•…°Í•ÍÍ¥½¸¹µ½‘•°¹‘½Œ¤ì(€€€€€€€€€€€¥˜€¡„€˜˜ˆ¤•±•µ•¹ÐÈ¹Í•ÑM•±•Ñ¥½¹I…¹”¡„¹¥¹‘•à°ˆ¹¥¹‘•à¤ì(€€€€€€€€€ô(€€€€€€€ôì(€€€€€€€Í•ÍÍ¥½¸¹µ½‘•°¹‘½Œ¹½¸ ‰‰•™½É•QÉ…¹Í…Ñ¥½¸ˆ°‰•™½É”¤ì(€€€€€€€ÑåÁ”¹½‰Í•ÉÙ”¡¡…¹•¤ì(€€€€€€€¥¹ÁÕÑ±•…¹ÕÁÌ¹ÁÕÍ   ¤€ôøì(€€€€€€€€€ÑåÁ”¹Õ¹½‰Í•ÉÙ”¡¡…¹•¤ì(€€€€€€€€€Í•ÍÍ¥½¸ü¹µ½‘•°¹‘½Œ¹½™˜ ‰‰•™½É•QÉ…¹Í…Ñ¥½¸ˆ°‰•™½É”¤ì(€€€€€€€ô¤ì(€€€€€ô¤ì(€€€€€¡•…‘•Èü¹ÅÕ•ÉåM•±•Ñ½É±° m…É¥„µ±…‰•°ô‰¥½¹•Ì‘•°½µÕ¹¥…‘¼‰tœ¤¹™½É…  ¡‰ÕÑÑ½¸¤€ôø‰ÕÑÑ½¸¹‘¥Í…‰±•€ôÑÉÕ”¤ì(€€€€€¥˜€¡¡•…‘•È€˜˜€…¡•…‘•È¹ÅÕ•ÉåM•±•Ñ½È ‰m‘…Ñ„µ½µµ•¹ÑÌµÁ…¹•±tˆ¤¤ì(€€€€€€€½¹ÍÐ‰ÕÑÑ½¸€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰ÕÑÑ½¸ˆ¤ì(€€€€€€€‰ÕÑÑ½¸¹ÑåÁ”€ô€‰‰ÕÑÑ½¸ˆì(€€€€€€€‰ÕÑÑ½¸¹±…ÍÍ9…µ”€ô€‰‰Ñ¸‰Ñ¸µÍ•½¹‘…Éäˆì(€€€€€€€‰ÕÑÑ½¸¹‘…Ñ…Í•Ð¹½µµ•¹ÑÍA…¹•°€ô€ˆˆì(€€€€€€€‰ÕÑÑ½¸¹¥¹¹•É!Q50€ô…Á¤¹¥½¸ ‰µ•ÍÍ…”ˆ°€ÄØ¤€¬€ˆ½µ•¹Ñ…É¥½Ì€ˆ€¬…Ñ¥Ù•½µµ•¹ÑÌ ¤¹±•¹Ñ ì(€€€€€€€‰ÕÑÑ½¸¹½¹±¥¬€ô€ ¤€ôø½µµ•¹ÑÍ¥…±½œ ¤ì(€€€€€€€¡•…‘•È¹ÁÉ•Á•¹¡‰ÕÑÑ½¸¤ì(€€€€€ô(€€€€€Á…¥¹ÑAÉ•Í•¹”¡Í•ÍÍ¥½¸¹±…ÍÑAÉ•Í•¹”ñðmt¤ì(€€€€€ÍÑ…ÑÕÌ¡Í•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹‘¥ÉÑä€ü€‰Õ…É‘…¹‘¼•¸±qá¹•…qÔÈÀÈØˆ€è€‰Õ…É‘…‘¼•¸±qá¹•„ˆ°Í•ÍÍ¥½¸¹‰±½­•¤ì(€€€ô(€€€™Õ¹Ñ¥½¸¡½µ•I•¹‘•É• ¤ì(€€€€€½¹ÍÐ¡•…‘•È€ô‘½Õµ•¹Ð¹ÅÕ•ÉåM•±•Ñ½È ˆ¹½µµÌµ¡•…‘•Èµ…Ñ¥½¹Ìˆ¤ì(€€€€€¥˜€ …¡•…‘•È¤É•ÑÕÉ¸ì(€€€€€¥˜€ …¡•…‘•È¹ÅÕ•ÉåM•±•Ñ½È ‰m‘…Ñ„µÍ¡…É•µ±¥‰É…Éåtˆ¤¤ì(€€€€€€€½¹ÍÐ‰ÕÑÑ½¸€ô‘½Õµ•¹Ð¹É•…Ñ•±•µ•¹Ð ‰‰ÕÑÑ½¸ˆ¤ì(€€€€€€€‰ÕÑÑ½¸¹±…ÍÍ9…µ”€ô€‰‰Ñ¸‰Ñ¸µÍ•½¹‘…Éäˆì(€€€€€€€‰ÕÑÑ½¸¹‘…Ñ…Í•Ð¹Í¡…É•‘1¥‰É…Éä€ô€ˆˆì(€€€€€€€‰ÕÑÑ½¸¹¥¹¹•É!Q50€ô…Á¤¹¥½¸ ‰ÕÍ•ÉÌˆ°€ÄØ¤€¬€ˆÑ¥Ù¥‘…ˆì(€€€€€€€‰ÕÑÑ½¸¹½¹±¥¬€ô±¥‰É…Éäì(€€€€€€€¡•…‘•È¹ÁÉ•Á•¹¡‰ÕÑÑ½¸¤ì(€€€€€ô(€€€€€±½…‘M¡…É•‘!½µ” ¤ì(€€€ô(€€€‘½Õµ•¹Ð¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰™½ÕÍ½ÕÐˆ°€ ¤€ôøÍ•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€¥˜€¡…Ñ¥Ù” ¤€˜˜‘•™•ÉÉ•€˜˜€…‘½Õµ•¹Ð¹…Ñ¥Ù•±•µ•¹Ðü¹±½Í•ÍÐ ˆ¹µ•µ¼µ™½É´ˆ¤¤ì(€€€€€€€‘•™•ÉÉ•€ô™…±Í”ì(€€€€€€€…Á¤¹É•¹‘•È ¤ì(€€€€€ô(€€€ô°€À¤¤ì(€€€Ý¥¹‘½Ü¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰‰•™½É•Õ¹±½…ˆ°€¡•Ù•¹Ð¤€ôøì(€€€€€¥˜€¡…Ñ¥Ù” ¤€˜˜Í•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹‘¥ÉÑä¤ì(€€€€€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€€€€€•Ù•¹Ð¹É•ÑÕÉ¹Y…±Õ”€ô€ˆˆì(€€€€€ô(€€€ô¤ì(€€€Ý¥¹‘½Ü¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ‰Á…•¡¥‘”ˆ°€ ¤€ôøì(€€€€€¥˜€¡…Ñ¥Ù” ¤¤Í•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹±•…Ù” ¤¹…Ñ   ¤€ôøì(€€€€€ô¤ì(€€€ô¤ì(€€€É•ÑÕÉ¸ì(€€€€€…Ñ¥Ù”°(€€€€€•‘¥Ñ…‰±”°(€€€€€ÍÑ½À°(€€€€€…ÁÑÕÉ”°(€€€€€É•¹‘•É•°(€€€€€¡½µ•I•¹‘•É•°(€€€€€Í¡…É”°(€€€€€±¥‰É…Éä°(€€€€€ÁÕ‰±¥Í¡ÕÉÉ•¹Ð°(€€€€€ÁÉ•Á…É•%µ…”è…Íå¹Œ€¡Í½ÕÉ”¤€ôøì(€€€€€€€½¹ÍÐÕÉÉ•¹Ð€ôÍ•ÍÍ¥½¸ì(€€€€€€€¥˜€ …•‘¥Ñ…‰±” ¤¤Ñ¡É½ÜÉÉ½È ‰9¼Ñ¥•¹•ÌÁ•Éµ¥Í¼Á…É„•‘¥Ñ…È•ÍÑ”½µÕ¹¥…‘¼¸ˆ¤ì(€€€€€€€½¹ÍÐ‘É…™Ð€ô…Ý…¥Ð½ÁÑ¥µ¥é•M¡…É¥¹%µ…•Ì¡ìÍÉŒèÍ½ÕÉ”ô°ìÙ…±¥è€ ¤€ôøÍ•ÍÍ¥½¸€ôôôÕÉÉ•¹Ð€˜˜•‘¥Ñ…‰±” ¤ô¤ì(€€€€€€€É•ÑÕÉ¸‘É…™Ð¹ÍÉŒì(€€€€€ô°(€€€€€…½Õ¹Ñ¡…¹•è€¡¥È¤€ôøì(€€€€€€€ÁÉ•Ù¥•Ý…¡”¹±•…È ¤ì(€€€€€€€ÁÉ•Ù¥•ÝA•¹‘¥¹œ¹±•…È ¤ì(€€€€€€€¥˜€¡Í•ÍÍ¥½¸€˜˜Í•ÍÍ¥½¸¹…½Õ¹Ð€„ôô¥È¤ì(€€€€€€€€€ÍÑ½À ¤ì(€€€€€€€€€…Á¤¹ÕÉÉ•¹Ð¡¹Õ±°¤ì(€€€€€€€€€…Á¤¹±•…ÉA…” ‰1„Í•Í¥qáÍ¸…µ‰¥qáÌ¸ˆ¤ì(€€€€€€€ô(€€€€€ô°(€€€€€‰•™½É•I•¹‘•Èè€ ¤€ôøì(€€€€€€€¥˜€¡…Ñ¥Ù” ¤€˜˜€…É•¹‘•É¥¹œ¤…ÁÑÕÉ” ¤ì(€€€€€€€‘•ÍÑÉ½åY¥•ÝÌ ¤ì(€€€€€ô°(€€€€€Á•ÉÍ¥ÍÐè€ ¤€ôøì(€€€€€€€¥˜€ ……Ñ¥Ù” ¤¤É•ÑÕÉ¸¹Õ±°ì(€€€€€€€…ÁÑÕÉ” ¤ì(€€€€€€€Í•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹Íå¹Œ ¤¹…Ñ   ¤€ôøì(€€€€€€€ô¤ì(€€€€€€€É•ÑÕÉ¸€…Í•ÍÍ¥½¸¹‰±½­•ì(€€€€€ô°(€€€€€½µµ…¹è€¡½¹ÑÉ½°°½µµ…¹°Ù…±Õ”¤€ôøì(€€€€€€€½¹ÍÐ•±•µ•¹ÐÈ€ô½¹ÑÉ½°¹±½Í•ÍÐ ˆ¹µ•µ¼µÉ¥ µÑ½½±‰…Èˆ¤ü¹¹•áÑ±•µ•¹ÑM¥‰±¥¹œ°Ù¥•Ü€ôÙ¥•ÝÌ¹•Ð¡•±•µ•¹ÐÈ¤ì(€€€€€€€¥˜€ …Ù¥•Ü¤É•ÑÕÉ¸™…±Í”ì(€€€€€€€¥˜€¡•‘¥Ñ…‰±” ¤¤É¥¡½µµ…¹¡Ù¥•Ü°½µµ…¹°Ù…±Õ”¤ì(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô°(€€€€€±•…Ù”è…Íå¹Œ€ ¤€ôøì(€€€€€€€¥˜€ ……Ñ¥Ù” ¤¤É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€…ÁÑÕÉ” ¤ì(€€€€€€€ÑÉäì(€€€€€€€€€½¹ÍÐÕÉÉ•¹Ð€ôÍ•ÍÍ¥½¸ì(€€€€€€€€€™½È€¡±•Ð…ÑÑ•µÁÐ€ô€ÀìÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹‘¥ÉÑä€˜˜…ÑÑ•µÁÐ€ð€Ìì…ÑÑ•µÁÐ¬¬¤…Ý…¥ÐÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹Íå¹Œ ¤ì(€€€€€€€€€¥˜€¡ÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹‘¥ÉÑä¤É•ÑÕÉ¸™…±Í”ì(€€€€€€€€€…Ý…¥ÐÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹±•…Ù” ¤ì(€€€€€€€€€¥˜€¡Í•ÍÍ¥½¸€ôôôÕÉÉ•¹Ð¤ÍÑ½À ¤ì(€€€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€€€ô…Ñ ì(€€€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€€€ô(€€€€€ô(€€€ôì(€ô(€™Õ¹Ñ¥½¸¥¹ÍÑ…±±%¹™½É…Á¡¥Ì¡…Á¤¤ì(€€€±•ÐÍ•ÍÍ¥½¸€ô¹Õ±°ì(€€€½¹ÍÐ±½¹”€ô€¡Ù…±Õ”¤€ôø)M=8¹Á…ÉÍ”¡)M=8¹ÍÑÉ¥¹¥™ä¡Ù…±Õ”¤¤ì(€€€½¹ÍÐ…½Õ¹Ð€ô€ ¤€ôø…Á¤¹…½Õ¹Ð ¤ü¹¥ì(€€€½¹ÍÐÉÁŒ€ô…Íå¹Œ€¡¹…µ”°…ÉÌÈ€ôíô¤€ôøì(€€€€€½¹ÍÐ½Ý¹•È€ô…½Õ¹Ð ¤ì(€€€€€¥˜€ …½Ý¹•È¤Ñ¡É½ÜÉÉ½È ‰%¹¥¥„Í•Í¥qáÍ¸Á…É„½¹Ñ¥¹Õ…È¸ˆ¤ì(€€€€€½¹ÍÐì‘…Ñ„°•ÉÉ½Èô€ô…Ý…¥Ð…Á¤¹ÉÁŒ¡¹…µ”°…ÉÌÈ¤ì(€€€€€¥˜€¡…½Õ¹Ð ¤€„ôô½Ý¹•È¤Ñ¡É½Ü=‰©•Ð¹…ÍÍ¥¸¡ÉÉ½È ‰1„Í•Í¥qáÍ¸…µ‰¥qáÌ¸ˆ¤°ì½‘”è€ˆÐÈÔÀÄˆô¤ì(€€€€€¥˜€¡•ÉÉ½È¤Ñ¡É½Ü•ÉÉ½Èì(€€€€€É•ÑÕÉ¸‘…Ñ„ì(€€€ôì(€€€½¹ÍÐ‘•½‘”È€ô€¡‘…Ñ„¤€ôøì(€€€€€½¹ÍÐµ½‘•°€ô¹•Ü½µµÕ¹¥…Ñ¥½¹5½‘•° ¤ì(€€€€€µ½‘•°¹‘½Œ¹ÑÉ…¹Í…Ð  ¤€ôøì(€€€€€€€¥˜€¡‘…Ñ„ü¹Í¹…ÁÍ¡½Ð¤å©Í}•áÁ½ÉÑÌ¹…ÁÁ±åUÁ‘…Ñ”¡µ½‘•°¹‘½Œ°™É½µ	…Í”ØÐ¡‘…Ñ„¹Í¹…ÁÍ¡½Ð¤°€‰É•µ½Ñ”ˆ¤ì(€€€€€€€™½È€¡½¹ÍÐÕÁ‘…Ñ”½˜‘…Ñ„ü¹ÕÁ‘…Ñ•Ìñðmt¤å©Í}•áÁ½ÉÑÌ¹…ÁÁ±åUÁ‘…Ñ”¡µ½‘•°¹‘½Œ°™É½µ	…Í”ØÐ¡ÕÁ‘…Ñ”¹Á…å±½…¤°€‰É•µ½Ñ”ˆ¤ì(€€€€€ô°€‰É•µ½Ñ”ˆ¤ì(€€€€€É•ÑÕÉ¸µ½‘•°ì(€€€ôì(€€€½¹ÍÐÍ¹…ÁÍ¡½ÐÈ€ô…Íå¹Œ€¡¥È¤€ôøì(€€€€€½¹ÍÐ‘…Ñ„€ô…Ý…¥ÐÉÁŒ ‰½µµÕ¹¥…Ñ¥½¹}Íå¹Œˆ°ìÁ}¥è¥È°Á}…™Ñ•Èè€´Ä°Á}¹½¹”è¹Õ±°°Á}ÕÁ‘…Ñ”è¹Õ±°°Á}Í•ÍÍ¥½¸è¹Õ±°°Á}…Ý…É•¹•ÍÌè¹Õ±°ô¤°µ½‘•°€ô‘•½‘”È¡‘…Ñ„¤ì(€€€€€ÑÉäì(€€€€€€€½¹ÍÐ‘É…™Ð€ôµ½‘•°¹É•… ¤ì(€€€€€€€…Á¤¹Ù…±¥‘…Ñ”¡‘É…™Ð¤ì(€€€€€€€É•ÑÕÉ¸ì‘É…™Ð°É½±”è‘…Ñ„¹É½±”ôì(€€€€€ô™¥¹…±±äì(€€€€€€€µ½‘•°¹‘½Œ¹‘•ÍÑÉ½ä ¤ì(€€€€€ô(€€€ôì(€€€½¹ÍÐ±•…Ù”€ô…Íå¹Œ€ ¤€ôøì(€€€€€¥˜€ …Í•ÍÍ¥½¸¤É•ÑÕÉ¸ÑÉÕ”ì(€€€€€½¹ÍÐÕÉÉ•¹Ð€ôÍ•ÍÍ¥½¸ì(€€€€€ÑÉäì(€€€€€€€™½È€¡±•Ð…ÑÑ•µÁÐ€ô€ÀìÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹‘¥ÉÑä€˜˜…ÑÑ•µÁÐ€ð€Ìì…ÑÑ•µÁÐ¬¬¤…Ý…¥ÐÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹Íå¹Œ ¤ì(€€€€€€€¥˜€¡ÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹‘¥ÉÑä¤É•ÑÕÉ¸™…±Í”ì(€€€€€€€…Ý…¥ÐÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ¹±•…Ù” ¤ì(€€€€€€€¥˜€¡Í•ÍÍ¥½¸€ôôôÕÉÉ•¹Ð¤ì(€€€€€€€€€ÕÉÉ•¹Ð¹µ½‘•°¹‘½Œ¹‘•ÍÑÉ½ä ¤ì(€€€€€€€€€Í•ÍÍ¥½¸€ô¹Õ±°ì(€€€€€€€ô(€€€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€€€ô…Ñ ì(€€€€€€€É•ÑÕÉ¸™…±Í”ì(€€€€€ô(€€€ôì(€€€½¹ÍÐÉ••¥Ù”€ô€ ¤€ôøì(€€€€€¥˜€ …Í•ÍÍ¥½¸ü¹É•…‘ä¤É•ÑÕÉ¸ì(€€€€€½¹ÍÐ‘É…™Ð€ôÍ•ÍÍ¥½¸¹µ½‘•°¹É•… ¤ì(€€€€€…Á¤¹Ù…±¥‘…Ñ”¡‘É…™Ð¤ì(€€€€€¥˜€¡)M=8¹ÍÑÉ¥¹¥™ä¡‘É…™Ð¤€„ôô)M=8¹ÍÑÉ¥¹¥™ä¡Í•ÍÍ¥½¸¹‰…Í•±¥¹”¤¤ì(€€€€€€€Í•ÍÍ¥½¸¹‰…Í•±¥¹”€ô±½¹”¡‘É…™Ð¤ì(€€€€€€€…Á¤¹É•µ½Ñ”¡‘É…™Ð°Í•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹É½±”¤ì(€€€€€ô(€€€ôì(€€€½¹ÍÐ½Á•¸€ô…Íå¹Œ€¡¥È¤€ôøì(€€€€€¥˜€¡Í•ÍÍ¥½¸ü¹¥€ôôô¥È¤É•ÑÕÉ¸ì‘É…™Ðè±½¹”¡Í•ÍÍ¥½¸¹‰…Í•±¥¹”¤°É½±”èÍ•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹É½±”ôì(€€€€€¥˜€ ……Ý…¥Ð±•…Ù” ¤¤Ñ¡É½ÜÉÉ½È ‰Q½‘…Ùqá„¡…ä…µ‰¥½ÌÁ•¹‘¥•¹Ñ•Ì¸ˆ¤ì(€€€€€½¹ÍÐ½Ý¹•È€ô…½Õ¹Ð ¤°µ½‘•°€ô¹•Ü½µµÕ¹¥…Ñ¥½¹5½‘•° ¤°ÕÉÉ•¹Ð€ôì¥è¥È°½Ý¹•È°µ½‘•°°‰…Í•±¥¹”èíô°É•…‘äè™…±Í”ôì(€€€€€½¹ÍÐÑÉ…¹ÍÁ½ÉÐ€ô¹•Ü½µµÕ¹¥…Ñ¥½¹QÉ…¹ÍÁ½ÉÐ¡ì‘½Œèµ½‘•°¹‘½Œ°ÉÁŒè€¡¹…µ”°…ÉÌÈ¤€ôøÉÁŒ¡¹…µ”°ìÁ}¥è¥È°€¸¸¹…ÉÌÈô¤°Ù…±¥è€ ¤€ôøÍ•ÍÍ¥½¸€ôôôÕÉÉ•¹Ð€˜˜…½Õ¹Ð ¤€ôôô½Ý¹•È°ÁÉ•Í•¹”è€ ¤€ôø€¡ì±¥•¹Ñ%èµ½‘•°¹‘½Œ¹±¥•¹Ñ%°™¥•±è€‰‘½Õµ•¹Ðˆ°…É•„è€‰%¹™½É…™qá„ˆ°µ½‘”è€‰…É•„ˆô¤°½¹¡…¹”èÉ••¥Ù”°½¹MÑ…ÑÕÌè€¡Ñ•áÐÈ°‰±½­•¤€ôø…Á¤¹ÍÑ…ÑÕÌ¡Ñ•áÐÈ°‰±½­•¤ô¤ì(€€€€€ÕÉÉ•¹Ð¹ÑÉ…¹ÍÁ½ÉÐ€ôÑÉ…¹ÍÁ½ÉÐì(€€€€€Í•ÍÍ¥½¸€ôÕÉÉ•¹Ðì(€€€€€ÑÉäì(€€€€€€€…Ý…¥ÐÑÉ…¹ÍÁ½ÉÐ¹Íå¹Œ ¤ì(€€€€€€€¥˜€¡Í•ÍÍ¥½¸€„ôôÕÉÉ•¹Ð¤Ñ¡É½ÜÉÉ½È ‰1„Í•Í¥qáÍ¸…µ‰¥qáÌ¸ˆ¤ì(€€€€€€€½¹ÍÐ‘É…™Ð€ôµ½‘•°¹É•… ¤ì(€€€€€€€…Á¤¹Ù…±¥‘…Ñ”¡‘É…™Ð¤ì(€€€€€€€ÕÉÉ•¹Ð¹‰…Í•±¥¹”€ô±½¹”¡‘É…™Ð¤ì(€€€€€€€ÕÉÉ•¹Ð¹É•…‘ä€ôÑÉÕ”ì(€€€€€€€ÑÉ…¹ÍÁ½ÉÐ¹ÍÑ…ÉÐ ¤ì(€€€€€€€…Á¤¹ÍÑ…ÑÕÌ ‰Õ…É‘…‘¼•¸±qá¹•„ˆ°™…±Í”¤ì(€€€€€€€É•ÑÕÉ¸ì‘É…™Ð°É½±”èÑÉ…¹ÍÁ½ÉÐ¹É½±”ôì(€€€€€ô…Ñ €¡•ÉÉ½È¤ì(€€€€€€€ÑÉ…¹ÍÁ½ÉÐ¹ÍÑ½À ¤ì(€€€€€€€µ½‘•°¹‘½Œ¹‘•ÍÑÉ½ä ¤ì(€€€€€€€¥˜€¡Í•ÍÍ¥½¸€ôôôÕÉÉ•¹Ð¤Í•ÍÍ¥½¸€ô¹Õ±°ì(€€€€€€€Ñ¡É½Ü•ÉÉ½Èì(€€€€€ô(€€€ôì(€€€½¹ÍÐÉ•…Ñ”Ü€ô…Íå¹Œ€¡‘É…™Ð¤€ôøì(€€€€€…Á¤¹Ù…±¥‘…Ñ”¡‘É…™Ð¤ì(€€€€€½¹ÍÐµ½‘•°€ô¹•Ü½µµÕ¹¥…Ñ¥½¹5½‘•° ¤ì(€€€€€±•Ð•¹½‘•ì(€€€€€ÑÉäì(€€€€€€€µ½‘•°¹Í••¡‘É…™Ð¤ì(€€€€€€€•¹½‘•€ôå©Í}•áÁ½ÉÑÌ¹•¹½‘•MÑ…Ñ•ÍUÁ‘…Ñ”¡µ½‘•°¹‘½Œ¤ì(€€€€€ô™¥¹…±±äì(€€€€€€€µ½‘•°¹‘½Œ¹‘•ÍÑÉ½ä ¤ì(€€€€€ô(€€€€€¥˜€¡•¹½‘•¹±•¹Ñ €ø€ÄØÜÜÜÈÄØ¤Ñ¡É½ÜÉÉ½È ‰1„¥¹™½É…™qá„½¹Ñ¥•¹”‘•µ…Í¥…‘…Ì¥µqáÅ•¹•ÌÁ…É„½µÁ…ÉÑ¥É±„¸I•‘Õ”ÍÔÑ…µ…qáÅ¼”¥¹Ñqáå¹Ñ…±¼‘”¹Õ•Ù¼¸ˆ¤ì(€€€€€½¹ÍÐ¥È€ô…Ý…¥ÐÉÁŒ ‰½µµÕ¹¥…Ñ¥½¹}É•…Ñ”ˆ°ìÁ}Í½ÕÉ”è‘É…™Ð¹¥°Á}Ñ¥Ñ±”èMÑÉ¥¹œ¡‘É…™Ð¹Ñ¥Ñ±”ñð€‰%¹™½É…™qá„ˆ¤¹Í±¥” À°€ÔÀÀ¤°Á}­¥¹è€‰¥¹™½É…Á¡¥Œˆ°Á}Í¹…ÁÍ¡½ÐèÑ½	…Í”ØÐÈ¡•¹½‘•¤ô¤ì(€€€€€É•ÑÕÉ¸ì¥è¥È°€¸¸¹…Ý…¥Ð½Á•¸¡¥È¤ôì(€€€ôì(€€€½¹ÍÐ…ÁÑÕÉ”€ô€¡‘É…™Ð¤€ôøì(€€€€€¥˜€ …Í•ÍÍ¥½¸ü¹É•…‘ä¤É•ÑÕÉ¸™…±Í”ì(€€€€€…Á¤¹Ù…±¥‘…Ñ”¡‘É…™Ð¤ì(€€€€€Í•ÍÍ¥½¸¹µ½‘•°¹…ÁÁ±ä¡Í•ÍÍ¥½¸¹‰…Í•±¥¹”°‘É…™Ð¤ì(€€€€€Í•ÍÍ¥½¸¹‰…Í•±¥¹”€ô±½¹”¡‘É…™Ð¤ì(€€€€€Í•ÍÍ¥½¸¹ÑÉ…¹ÍÁ½ÉÐ¹Íå¹Œ ¤¹…Ñ   ¤€ôøì(€€€€€ô¤ì(€€€€€É•ÑÕÉ¸ÑÉÕ”ì(€€€ôì(€€€½¹ÍÐ±¥ÍÐ€ô…Íå¹Œ€ ¤€ôø€¡…Ý…¥ÐÉÁŒ ‰½µµÕ¹¥…Ñ¥½¹}±¥ÍÐˆ¤ñðmt¤¹™¥±Ñ•È ¡É•½É¤€ôøÉ•½É¹­¥¹€ôôô€‰¥¹™½É…Á¡¥Œˆ¤ì(€€€É•ÑÕÉ¸ì±¥ÍÐ°Í¹…ÁÍ¡½ÐèÍ¹…ÁÍ¡½ÐÈ°½Á•¸°É•…Ñ”èÉ•…Ñ”Ü°…ÁÑÕÉ”°±•…Ù”°…Ñ¥Ù”è€ ¤€ôø€„…Í•ÍÍ¥½¸°¥è€ ¤€ôøÍ•ÍÍ¥½¸ü¹¥ñð€ˆˆ°É½±”è€ ¤€ôøÍ•ÍÍ¥½¸ü¹ÑÉ…¹ÍÁ½ÉÐ¹É½±”ñð€ˆˆ°…½Õ¹Ñ¡…¹•è€¡¥È¤€ôøì(€€€€€¥˜€¡Í•ÍÍ¥½¸€˜˜Í•ÍÍ¥½¸¹½Ý¹•È€„ôô¥È¤±•…Ù” ¤ì(€€€ôôì(€ô(€Ý¥¹‘½Ü¹M¥•ÉÉ…½±±…‰½É…Ñ¥½¸€ôì¥¹ÍÑ…±°°¥¹ÍÑ…±±%¹™½É…Á¡¥Ìôì)ô¤ ¤ì(