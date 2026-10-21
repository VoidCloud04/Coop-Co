import { data } from "./DataManager.svelte"
import Decimal from "break_eternity.js"
import { formatSci } from "./Formatting"

export function format(a,b = 2) {
    a = new Decimal(a)
    if(!data.settings.toggles[0]) {
        if(a.div(1e93).lt(1e3))
            return notate(a)
        else 
            return formatSci(a)
    }
    else {
        return formatSci(a)
    }
}

class Notation {
    static standardPrefix = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'O', 'N', 'Dc', 'UnDc', 'DuDc', 'TrDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'OcDc', 'NoDc', 'Vg', 'UnVg', 'DuVg', 'TrVg', 'QaVg', 'QiVg', 'SxVg', 'SpVg', 'OcVg', 'NoVg', 'TG'];
    constructor(standardPrefix = Notation.standardPrefix) {
        this.standardPrefix = standardPrefix;
    }
    notate(e) {
        return e.toPrecision(4).replace(/(\d)\.?(\d*)e\+?(\d+)/, (s,a,b,c)=> {
            let ab0 = a + b + '000';
            let num = `${ab0.slice(0, c % 3 + 1)}.${ab0.slice(c % 3 + 1, 4)}`;
            let pow3 = ~~(c/3);
            let prefix = this.standardPrefix[pow3];
            if (prefix) prefix = ' ' + prefix;
            else if (c < 4) prefix = '';
            else prefix = 'e' + (pow3 * 3);
            return `${num}${prefix}`;
        })
    }
    bind() {
        return (e) => this.notate(e);
    }
}

export const notate = new Notation().bind()