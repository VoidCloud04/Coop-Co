const MAX_SIGNIFICANT_DIGITS = 17;
const EXP_LIMIT = 9e15;
const LAYER_DOWN = Math.log10(9e15);
const FIRST_NEG_LAYER = 9e-15;
const NUMBER_EXP_MAX = 308;
const NUMBER_EXP_MIN = -324;
const MAX_ES_IN_A_ROW = 5;
const DEFAULT_FROM_STRING_CACHE_SIZE = 1023;
const IGNORE_COMMAS = true;
const COMMAS_ARE_DECIMAL_POINTS = false;
const powerOf10 = (function () {
    const powersOf10 = [];
    for (let i = NUMBER_EXP_MIN + 1; i <= NUMBER_EXP_MAX; i++) {
        powersOf10.push(Number("1e" + i));
    }
    return function (power) {
        return powersOf10[power + 323];
    };
})();
let D = function D(value) {
    return Decimal.fromValue_noAlloc(value);
};
let FC = function (sign, layer, mag) {
    return Decimal.fromComponents(sign, layer, mag);
};
let FC_NN = function FC_NN(sign, layer, mag) {
    return Decimal.fromComponents_noNormalize(sign, layer, mag);
};
const decimalPlaces = function decimalPlaces(value, places) {
    const len = places + 1;
    const numDigits = Math.ceil(Math.log10(Math.abs(value)));
    const rounded = Math.round(value * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);
    return parseFloat(rounded.toFixed(Math.max(len - numDigits, 0)));
};
const f_maglog10 = function (n) {
    return Math.sign(n) * Math.log10(Math.abs(n));
};
class LRUCache {
    map = new Map();
    first;
    last;
    maxSize = 0;
    constructor(maxSize) {
        this.maxSize = maxSize;
    }
    get size() {
        return this.map.size;
    }
    get(key) {
        const node = this.map.get(key);
        if (node === undefined) {
            return undefined;
        }
        if (node !== this.first) {
            if (node === this.last) {
                this.last = node.prev;
                this.last.next = undefined;
            }
            else {
                node.prev.next = node.next;
                node.next.prev = node.prev;
            }
            node.next = this.first;
            this.first.prev = node;
            this.first = node;
        }
        return node.value;
    }
    set(key, value) {
        if (this.maxSize < 1) {
            return;
        }
        if (this.map.has(key)) {
            throw new Error("Cannot update existing keys in the cache");
        }
        const node = new ListNode(key, value);
        if (this.first === undefined) {
            this.first = node;
            this.last = node;
        }
        else {
            node.next = this.first;
            this.first.prev = node;
            this.first = node;
        }
        this.map.set(key, node);
        while (this.map.size > this.maxSize) {
            const last = this.last;
            this.map.delete(last.key);
            this.last = last.prev;
            this.last.next = undefined;
        }
    }
}
class ListNode {
    key;
    value;
    next;
    prev;
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
class Decimal {
    static dZero = new Decimal(0);
    static dOne = new Decimal(1);
    static dNegOne = new Decimal(-1);
    static dTwo = new Decimal(2);
    static dTen = new Decimal(10);
    static dNaN = new Decimal(Number.NaN);
    static dInf = new Decimal(Number.POSITIVE_INFINITY);
    static dNegInf = new Decimal(Number.NEGATIVE_INFINITY);
    static fromStringCache = new LRUCache(DEFAULT_FROM_STRING_CACHE_SIZE);
    sign = 0;
    mag = 0;
    layer = 0;
    constructor(value) {
        if (value instanceof Decimal) {
            this.fromDecimal(value);
        }
        else if (typeof value === "number") {
            this.fromNumber(value);
        }
        else if (typeof value === "string") {
            this.fromString(value);
        }
    }
    get m() {
        if (this.sign === 0) {
            return 0;
        }
        else if (this.layer === 0) {
            const exp = Math.floor(Math.log10(this.mag));
            let man;
            if (this.mag === 5e-324) {
                man = 5;
            }
            else {
                man = this.mag / powerOf10(exp);
            }
            return this.sign * man;
        }
        else if (this.layer === 1) {
            const residue = this.mag - Math.floor(this.mag);
            return this.sign * Math.pow(10, residue);
        }
        else {
            return this.sign;
        }
    }
    set m(value) {
        if (this.layer <= 2) {
            this.fromMantissaExponent(value, this.e);
        }
        else {
            this.sign = Math.sign(value);
            if (this.sign === 0) {
                this.layer = 0;
                this.e = 0;
            }
        }
    }
    get e() {
        if (this.sign === 0) {
            return 0;
        }
        else if (this.layer === 0) {
            return Math.floor(Math.log10(this.mag));
        }
        else if (this.layer === 1) {
            return Math.floor(this.mag);
        }
        else if (this.layer === 2) {
            return Math.floor(Math.sign(this.mag) * Math.pow(10, Math.abs(this.mag)));
        }
        else {
            return this.mag * Number.POSITIVE_INFINITY;
        }
    }
    set e(value) {
        this.fromMantissaExponent(this.m, value);
    }
    static fromComponents(sign, layer, mag) {
        return new Decimal().fromComponents(sign, layer, mag);
    }
    static fromComponents_noNormalize(sign, layer, mag) {
        return new Decimal().fromComponents_noNormalize(sign, layer, mag);
    }
    static fromMantissaExponent(mantissa, exponent) {
        return new Decimal().fromMantissaExponent(mantissa, exponent);
    }
    static fromMantissaExponent_noNormalize(mantissa, exponent) {
        return new Decimal().fromMantissaExponent_noNormalize(mantissa, exponent);
    }
    static fromDecimal(value) {
        return new Decimal().fromDecimal(value);
    }
    static fromValue(value) {
        return new Decimal().fromValue(value);
    }
    /**
     * Converts a DecimalSource to a Decimal, without constructing a new Decimal
     * if the provided value is already a Decimal.
     *
     * As the return value could be the provided value itself, this function
     * returns a read-only Decimal to prevent accidental mutations of the value.
     * Use `new Decimal(value)` to explicitly create a writeable copy if mutation
     * is required.
     */
    static fromValue_noAlloc(value) {
        return value instanceof Decimal ? value : new Decimal(value);
    }
    static abs(value) {
        return D(value).abs();
    }
    static neg(value) {
        return D(value).neg();
    }
    static round(value) {
        return D(value).round();
    }
    static floor(value) {
        return D(value).floor();
    }
    static ceil(value) {
        return D(value).ceil();
    }
    static trunc(value) {
        return D(value).trunc();
    }
    static add(value, other) {
        return D(value).add(other);
    }
    static sub(value, other) {
        return D(value).sub(other);
    }
    static minus(value, other) {
        return D(value).sub(other);
    }
    static mul(value, other) {
        return D(value).mul(other);
    }
    static times(value, other) {
        return D(value).mul(other);
    }
    static div(value, other) {
        return D(value).div(other);
    }
    static recip(value) {
        return D(value).recip();
    }
    static mod(value, other) {
        return D(value).mod(other);
    }
    static cmp(value, other) {
        return D(value).cmp(other);
    }
    static isNaN(value) {
        D(value).isNan();
    }
    static isFinite(value) {
        D(value).isFinite();
    }
    static eq(value, other) {
        return D(value).eq(other);
    }
    static neq(value, other) {
        return D(value).neq(other);
    }
    static lt(value, other) {
        return D(value).lt(other);
    }
    static lte(value, other) {
        return D(value).lte(other);
    }
    static gt(value, other) {
        return D(value).gt(other);
    }
    static gte(value, other) {
        return D(value).gte(other);
    }
    static max(value, other) {
        return D(value).max(other);
    }
    static min(value, other) {
        return D(value).min(other);
    }
    static log10(value) {
        return D(value).log10();
    }
    static log(value, base) {
        return D(value).log(base);
    }
    static log2(value) {
        return D(value).log2();
    }
    static ln(value) {
        return D(value).ln();
    }
    static pow(value, other) {
        return D(value).pow(other);
    }
    static pow10(value) {
        return D(value).pow10();
    }
    static root(value, other) {
        return D(value).root(other);
    }
    static exp(value) {
        return D(value).exp();
    }
    static sqrt(value) {
        return D(value).sqrt();
    }
    static cbrt(value) {
        return D(value).cbrt();
    }
    normalize() {
        if (this.sign === 0 || (this.mag === 0 && this.layer === 0)) {
            this.sign = 0;
            this.mag = 0;
            this.layer = 0;
            return this;
        }
        if (this.layer === 0 && this.mag < 0) {
            this.mag = -this.mag;
            this.sign = -this.sign;
        }
        if (this.layer === 0 && this.mag < FIRST_NEG_LAYER) {
            this.layer += 1;
            this.mag = Math.log10(this.mag);
            return this;
        }
        let absmag = Math.abs(this.mag);
        let signmag = Math.sign(this.mag);
        if (absmag >= EXP_LIMIT) {
            this.layer += 1;
            this.mag = signmag * Math.log10(absmag);
            return this;
        }
        else {
            while (absmag < LAYER_DOWN && this.layer > 0) {
                this.layer -= 1;
                if (this.layer === 0) {
                    this.mag = Math.pow(10, this.mag);
                }
                else {
                    this.mag = signmag * Math.pow(10, absmag);
                    absmag = Math.abs(this.mag);
                    signmag = Math.sign(this.mag);
                }
            }
            if (this.layer === 0) {
                if (this.mag < 0) {
                    this.mag = -this.mag;
                    this.sign = -this.sign;
                }
                else if (this.mag === 0) {
                    this.sign = 0;
                }
            }
        }
        return this;
    }
    fromComponents(sign, layer, mag) {
        this.sign = sign;
        this.layer = layer;
        this.mag = mag;
        this.normalize();
        return this;
    }
    fromComponents_noNormalize(sign, layer, mag) {
        this.sign = sign;
        this.layer = layer;
        this.mag = mag;
        return this;
    }
    fromDecimal(value) {
        this.sign = value.sign;
        this.layer = value.layer;
        this.mag = value.mag;
        return this;
    }
    fromNumber(value) {
        this.sign = Math.sign(value);
        if (!Number.isFinite(value)) {
          this.mag = value;
          this.layer = value;
          return this;
        }
        this.mag = Math.abs(value);
        this.layer = 0;
        this.normalize();
        return this;
    }
    fromString(value) {
        const originalValue = value;
        const cached = Decimal.fromStringCache.get(originalValue);
        if (cached !== undefined) {
            return this.fromDecimal(cached);
        }
        value = value.replace(",", "");
        const parts = value.split("e");
        const ecount = parts.length - 1;
        if (ecount === 0) {
            const numberAttempt = parseFloat(value);
            if (isFinite(numberAttempt)) {
                this.fromNumber(numberAttempt);
                Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
                return this;
            }
        }
        else if (ecount === 1) {
            const numberAttempt = parseFloat(value);
            if (isFinite(numberAttempt) && numberAttempt !== 0) {
                this.fromNumber(numberAttempt);
                Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
                return this;
            }
        }
        if (ecount < 1) {
            this.sign = 0;
            this.layer = 0;
            this.mag = 0;
            Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
            return this;
        }
        const mantissa = parseFloat(parts[0]);
        if (mantissa === 0) {
            this.sign = 0;
            this.layer = 0;
            this.mag = 0;
            Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
            return this;
        }
        let exponent = parseFloat(parts[parts.length - 1]);
        if (ecount >= 2) {
            const me = parseFloat(parts[parts.length - 2]);
            if (isFinite(me)) {
                exponent *= Math.sign(me);
                exponent += f_maglog10(me);
            }
        }
        if (!isFinite(mantissa)) {
            this.sign = parts[0] === "-" ? -1 : 1;
            this.layer = ecount;
            this.mag = exponent;
        }
        else if (ecount === 1) {
            this.sign = Math.sign(mantissa);
            this.layer = 1;
            this.mag = exponent + Math.log10(Math.abs(mantissa));
        }
        else {
            this.sign = Math.sign(mantissa);
            this.layer = ecount;
            if (ecount === 2) {
                const result = Decimal.mul(FC(1, 2, exponent), D(mantissa));
                this.sign = result.sign;
                this.layer = result.layer;
                this.mag = result.mag;
                Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
                return this;
            }
            else {
                this.mag = exponent;
            }
        }
        this.normalize();
        if (Decimal.fromStringCache.maxSize >= 1) {
            Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
        }
        return this;
    }
    fromValue(value) {
        if (value instanceof Decimal) {
            return this.fromDecimal(value);
        }
        if (typeof value === "number") {
            return this.fromNumber(value);
        }
        if (typeof value === "string") {
            return this.fromString(value);
        }
        return this;
    }
    toNumber() {
        if (!Number.isFinite(this.layer)) {
            return Number.NaN;
        }
        if (this.layer === 0) {
            return this.sign * this.mag;
        }
        else if (this.layer === 1) {
            return this.sign * Math.pow(10, this.mag);
        }
        else {
            return this.mag > 0
                ? this.sign > 0
                    ? Number.POSITIVE_INFINITY
                    : Number.NEGATIVE_INFINITY
                : 0;
        }
    }
    toString() {
        if (this.isNan()) {
            return "NaN";
        }
        if (this.mag === Number.POSITIVE_INFINITY || this.layer === Number.POSITIVE_INFINITY) {
            return this.sign === 1 ? "Infinity" : "-Infinity";
        }
        if (this.layer === 0) {
            if ((this.mag < 1e21 && this.mag > 1e-7) || this.mag === 0) {
                return (this.sign * this.mag).toString();
            }
            return this.m + "e" + this.e;
        }
        else if (this.layer === 1) {
            return this.m + "e" + this.e;
        }
        else {
            if (this.layer <= MAX_ES_IN_A_ROW) {
                return (this.sign === -1 ? "-" : "") + "e".repeat(this.layer) + this.mag;
            }
            else {
                return (this.sign === -1 ? "-" : "") + "(e^" + this.layer + ")" + this.mag;
            }
        }
    }
    toExponential(places) {
        if (this.layer === 0) {
            return (this.sign * this.mag).toExponential(places);
        }
        return this.toStringWithDecimalPlaces(places);
    }
    toFixed(places) {
        if (this.layer === 0) {
            return (this.sign * this.mag).toFixed(places);
        }
        return this.toStringWithDecimalPlaces(places);
    }
    toPrecision(places) {
        const { e } = this;
        if (e <= -7) {
            return this.toExponential(places - 1);
        }
        if (places > e) {
            return this.toFixed(places - e - 1);
        }
        return this.toExponential(places - 1);
    }
    valueOf() {
        return this.toString();
    }
    toJSON() {
        return this.toString();
    }
    toStringWithDecimalPlaces(places) {
        if (this.layer === 0) {
            if ((this.mag < 1e21 && this.mag > 1e-7) || this.mag === 0) {
                return (this.sign * this.mag).toFixed(places);
            }
            return decimalPlaces(this.m, places) + "e" + decimalPlaces(this.e, places);
        }
        else if (this.layer === 1) {
            return decimalPlaces(this.m, places) + "e" + decimalPlaces(this.e, places);
        }
        else {
            if (this.layer <= MAX_ES_IN_A_ROW) {
                return ((this.sign === -1 ? "-" : "") + "e".repeat(this.layer) + decimalPlaces(this.mag, places));
            }
            else {
                return ((this.sign === -1 ? "-" : "") + "(e^" + this.layer + ")" + decimalPlaces(this.mag, places));
            }
        }
    }
    abs() {
        return FC_NN(this.sign === 0 ? 0 : 1, this.layer, this.mag);
    }
    neg() {
        return FC_NN(-this.sign, this.layer, this.mag);
    }
    round() {
        if (this.mag < 0) {
            return Decimal.dZero;
        }
        if (this.layer === 0) {
            return FC(this.sign, 0, Math.round(this.mag));
        }
        return this;
    }
    floor() {
        if (this.mag < 0) {
            return Decimal.dZero;
        }
        if (this.layer === 0) {
            return FC(this.sign, 0, Math.floor(this.mag));
        }
        return this;
    }
    ceil() {
        if (this.mag < 0) {
            return Decimal.dZero;
        }
        if (this.layer === 0) {
            return FC(this.sign, 0, Math.ceil(this.mag));
        }
        return this;
    }
    trunc() {
        if (this.mag < 0) {
            return Decimal.dZero;
        }
        if (this.layer === 0) {
            return FC(this.sign, 0, Math.trunc(this.mag));
        }
        return this;
    }
    add(value) {
        const decimal = D(value);
        if (!Number.isFinite(this.layer)) {
            return this;
        }
        if (!Number.isFinite(decimal.layer)) {
            return decimal;
        }
        if (this.sign === 0) {
            return decimal;
        }
        if (decimal.sign === 0) {
            return this;
        }
        if (this.sign === -decimal.sign && this.layer === decimal.layer && this.mag === decimal.mag) {
            return FC_NN(0, 0, 0);
        }
        let a;
        let b;
        if (this.layer >= 2 || decimal.layer >= 2) {
            return this.maxabs(decimal);
        }
        if (this.cmpabs(decimal) > 0) {
            a = this;
            b = decimal;
        }
        else {
            a = decimal;
            b = this;
        }
        if (a.layer === 0 && b.layer === 0) {
            return new Decimal(a.sign * a.mag + b.sign * b.mag);
        }
        const layera = a.layer * Math.sign(a.mag);
        const layerb = b.layer * Math.sign(b.mag);
        if (layera - layerb >= 2) {
            return a;
        }
        if (layera === 0 && layerb === -1) {
            if (Math.abs(b.mag - Math.log10(a.mag)) > MAX_SIGNIFICANT_DIGITS) {
                return a;
            }
            else {
                const magdiff = Math.pow(10, Math.log10(a.mag) - b.mag);
                const mantissa = b.sign + a.sign * magdiff;
                return FC(Math.sign(mantissa), 1, b.mag + Math.log10(Math.abs(mantissa)));
            }
        }
        if (layera === 1 && layerb === 0) {
            if (Math.abs(a.mag - Math.log10(b.mag)) > MAX_SIGNIFICANT_DIGITS) {
                return a;
            }
            else {
                const magdiff = Math.pow(10, a.mag - Math.log10(b.mag));
                const mantissa = b.sign + a.sign * magdiff;
                return FC(Math.sign(mantissa), 1, Math.log10(b.mag) + Math.log10(Math.abs(mantissa)));
            }
        }
        if (Math.abs(a.mag - b.mag) > MAX_SIGNIFICANT_DIGITS) {
            return a;
        }
        else {
            const magdiff = Math.pow(10, a.mag - b.mag);
            const mantissa = b.sign + a.sign * magdiff;
            return FC(Math.sign(mantissa), 1, b.mag + Math.log10(Math.abs(mantissa)));
        }
    }
    sub(value) {
        return this.add(D(value).neg());
    }
    mul(value) {
        const decimal = D(value);
        if (!Number.isFinite(this.layer)) {
            return this;
        }
        if (!Number.isFinite(decimal.layer)) {
            return decimal;
        }
        if (this.sign === 0 || decimal.sign === 0) {
            return FC_NN(0, 0, 0);
        }
        if (this.layer === decimal.layer && this.mag === -decimal.mag) {
            return FC_NN(this.sign * decimal.sign, 0, 1);
        }
        let a;
        let b;
        if (this.layer > decimal.layer ||
            (this.layer == decimal.layer && Math.abs(this.mag) > Math.abs(decimal.mag))) {
            a = this;
            b = decimal;
        }
        else {
            a = decimal;
            b = this;
        }
        if (a.layer === 0 && b.layer === 0) {
            return new Decimal(a.sign * b.sign * a.mag * b.mag);
        }
        if (a.layer >= 3 || a.layer - b.layer >= 2) {
            return FC(a.sign * b.sign, a.layer, a.mag);
        }
        if (a.layer === 1 && b.layer === 0) {
            return FC(a.sign * b.sign, 1, a.mag + Math.log10(b.mag));
        }
        if (a.layer === 1 && b.layer === 1) {
            return FC(a.sign * b.sign, 1, a.mag + b.mag);
        }
        if (a.layer === 2 && b.layer === 1) {
            const newmag = FC(Math.sign(a.mag), a.layer - 1, Math.abs(a.mag)).add(FC(Math.sign(b.mag), b.layer - 1, Math.abs(b.mag)));
            return FC(a.sign * b.sign, newmag.layer + 1, newmag.sign * newmag.mag);
        }
        if (a.layer === 2 && b.layer === 2) {
            const newmag = FC(Math.sign(a.mag), a.layer - 1, Math.abs(a.mag)).add(FC(Math.sign(b.mag), b.layer - 1, Math.abs(b.mag)));
            return FC(a.sign * b.sign, newmag.layer + 1, newmag.sign * newmag.mag);
        }
        throw Error("Bad arguments to mul: " + this + ", " + value);
    }
    times(value) {
        return this.mul(value);
    }
    div(value) {
        const decimal = D(value);
        return this.mul(decimal.recip());
    }
    recip() {
        if (this.mag === 0) {
            return Decimal.dNaN;
        }
        else if (this.layer === 0) {
            return FC(this.sign, 0, 1 / this.mag);
        }
        else {
            return FC(this.sign, this.layer, -this.mag);
        }
    }
    mod(value) {
        const decimal = D(value).abs();
        if (decimal.eq(Decimal.dZero))
            return Decimal.dZero;
        const num_this = this.toNumber();
        const num_decimal = decimal.toNumber();
        if (isFinite(num_this) && isFinite(num_decimal) && num_this != 0 && num_decimal != 0) {
            return new Decimal(num_this % num_decimal);
        }
        if (this.sub(decimal).eq(this)) {
            return Decimal.dZero;
        }
        if (decimal.sub(this).eq(decimal)) {
            return this;
        }
        if (this.sign == -1)
            return this.abs().mod(decimal).neg();
        return this.sub(this.div(decimal).floor().mul(decimal));
    }
    cmpabs(value) {
        const decimal = D(value);
        const layera = this.mag > 0 ? this.layer : -this.layer;
        const layerb = decimal.mag > 0 ? decimal.layer : -decimal.layer;
        if (layera > layerb) {
            return 1;
        }
        if (layera < layerb) {
            return -1;
        }
        if (this.mag > decimal.mag) {
            return 1;
        }
        if (this.mag < decimal.mag) {
            return -1;
        }
        return 0;
    }
    /**
     * -1 for less than value, 0 for equals value, 1 for greater than value
     */
    cmp(value) {
        const decimal = D(value);
        if (this.sign > decimal.sign) {
            return 1;
        }
        if (this.sign < decimal.sign) {
            return -1;
        }
        return (this.sign * this.cmpabs(value));
    }
    isNan() {
        return Number.isNaN(this.layer);
    }
    isFinite() {
        return Number.isFinite(this.layer);
    }
    eq(value) {
        const decimal = D(value);
        return this.sign === decimal.sign && this.layer === decimal.layer && this.mag === decimal.mag;
    }
    neq(value) {
        return !this.eq(value);
    }
    lt(value) {
        return this.cmp(value) === -1;
    }
    lte(value) {
        return this.cmp(value) <= 0;
    }
    gt(value) {
        return this.cmp(value) === 1;
    }
    gte(value) {
        return this.cmp(value) >= 0;
    }
    max(value) {
        const decimal = D(value);
        return this.lt(decimal) ? decimal : this;
    }
    min(value) {
        const decimal = D(value);
        return this.gt(decimal) ? decimal : this;
    }
    absLog10() {
        if (this.sign === 0) {
            return Decimal.dNaN;
        }
        else if (this.layer > 0) {
            return FC(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
        }
        else {
            return FC(1, 0, Math.log10(this.mag));
        }
    }
    log10() {
        if (this.sign <= 0) {
            return Decimal.dNaN;
        }
        else if (this.layer > 0) {
            return FC(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
        }
        else {
            return FC(this.sign, 0, Math.log10(this.mag));
        }
    }
    log(base) {
        base = D(base);
        if (this.sign <= 0) {
            return Decimal.dNaN;
        }
        if (base.sign <= 0) {
            return Decimal.dNaN;
        }
        if (base.sign === 1 && base.layer === 0 && base.mag === 1) {
            return Decimal.dNaN;
        }
        else if (this.layer === 0 && base.layer === 0) {
            return FC(this.sign, 0, Math.log(this.mag) / Math.log(base.mag));
        }
        return Decimal.div(this.log10(), base.log10());
    }
    log2() {
        if (this.sign <= 0) {
            return Decimal.dNaN;
        }
        else if (this.layer === 0) {
            return FC(this.sign, 0, Math.log2(this.mag));
        }
        else if (this.layer === 1) {
            return FC(Math.sign(this.mag), 0, Math.abs(this.mag) * 3.321928094887362); //log2(10)
        }
        else if (this.layer === 2) {
            return FC(Math.sign(this.mag), 1, Math.abs(this.mag) + 0.5213902276543247); //-log10(log10(2))
        }
        else {
            return FC(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
        }
    }
    ln() {
        if (this.sign <= 0) {
            return Decimal.dNaN;
        }
        else if (this.layer === 0) {
            return FC(this.sign, 0, Math.log(this.mag));
        }
        else if (this.layer === 1) {
            return FC(Math.sign(this.mag), 0, Math.abs(this.mag) * 2.302585092994046); //ln(10)
        }
        else if (this.layer === 2) {
            return FC(Math.sign(this.mag), 1, Math.abs(this.mag) + 0.36221568869946325); //log10(log10(e))
        }
        else {
            return FC(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
        }
    }
    pow(value) {
        const decimal = D(value);
        const a = this;
        const b = decimal;
        if (a.sign === 0) {
            return b.eq(0) ? FC_NN(1, 0, 1) : a;
        }
        if (a.sign === 1 && a.layer === 0 && a.mag === 1) {
            return a;
        }
        if (b.sign === 0) {
            return FC_NN(1, 0, 1);
        }
        if (b.sign === 1 && b.layer === 0 && b.mag === 1) {
            return a;
        }
        const result = a.absLog10().mul(b).pow10();
        if (this.sign === -1) {
            if (Math.abs(b.toNumber() % 2) % 2 === 1) {
                return result.neg();
            }
            else if (Math.abs(b.toNumber() % 2) % 2 === 0) {
                return result;
            }
            return Decimal.dNaN;
        }
        return result;
    }
    pow10() {
        if (!Number.isFinite(this.layer) || !Number.isFinite(this.mag)) {
            return Decimal.dNaN;
        }
        let a = this;
        if (a.layer === 0) {
            const newmag = Math.pow(10, a.sign * a.mag);
            if (Number.isFinite(newmag) && Math.abs(newmag) >= 0.1) {
                return FC(1, 0, newmag);
            }
            else {
                if (a.sign === 0) {
                    return Decimal.dOne;
                }
                else {
                    a = FC_NN(a.sign, a.layer + 1, Math.log10(a.mag));
                }
            }
        }
        if (a.sign > 0 && a.mag >= 0) {
            return FC(a.sign, a.layer + 1, a.mag);
        }
        if (a.sign < 0 && a.mag >= 0) {
            return FC(-a.sign, a.layer + 1, -a.mag);
        }
        return Decimal.dOne;
    }
    root(value) {
        const decimal = D(value);
        return this.pow(decimal.recip());
    }
    exp() {
        if (this.mag < 0) {
            return Decimal.dOne;
        }
        if (this.layer === 0 && this.mag <= 709.7) {
            return new Decimal(Math.exp(this.sign * this.mag));
        }
        else if (this.layer === 0) {
            return FC(1, 1, this.sign * Math.log10(Math.E) * this.mag);
        }
        else if (this.layer === 1) {
            return FC(1, 2, this.sign * (Math.log10(0.4342944819032518) + this.mag));
        }
        else {
            return FC(1, this.layer + 1, this.sign * this.mag);
        }
    }
    sqrt() {
        if (this.layer === 0) {
            return new Decimal(Math.sqrt(this.sign * this.mag));
        }
        else if (this.layer === 1) {
            return FC(1, 2, Math.log10(this.mag) - 0.3010299956639812);
        }
        else {
            const result = Decimal.div(FC_NN(this.sign, this.layer - 1, this.mag), FC_NN(1, 0, 2));
            result.layer += 1;
            result.normalize();
            return result;
        }
    }
    cbrt() {
        return this.pow(1 / 3);
    }
}

D = Decimal.fromValue_noAlloc;
FC = Decimal.fromComponents;
FC_NN = Decimal.fromComponents_noNormalize;
