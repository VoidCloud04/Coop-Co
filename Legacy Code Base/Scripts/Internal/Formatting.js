//Credit to Acamaeda
function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(Decimal.dOne)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
    if (mantissa)
        return m.toStringWithDecimalPlaces(precision) + "e" + e
    else return "e" + e
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 4)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
    return x || new Decimal(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return decimalZero
    return x.reduce((a, b) => Decimal.add(a, b))
}
/*
function formatSci(decimal, precision = 2, small = true) {
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        return "NaN"
    }
    if (decimal.sign < 0) return "-" + formatSci(decimal.neg(), precision, small)
    if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
    if (decimal.gte("eeee1000")) {
        var slog = decimal.slog()
        if (slog.gte(1e6)) return "F" + formatSci(slog.floor())
        else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
    }
    else if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0, false)
    else if (decimal.gte("1e10000")) return exponentialFormat(decimal, 0)
    else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
    else if (decimal.gte(0.0001) || !small) return regularFormat(decimal, precision)
    else if (decimal.eq(0)) return (0).toFixed(precision)

    decimal = invertOOM(decimal)
    let val = ""
    if (decimal.lt("1e1000")){
        val = exponentialFormat(decimal, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }
    else   
        return formatSci(decimal, precision) + "⁻¹"

}
*/
//Formatting created by MrRedshark77
function formatSci(ex, acc=2, max=6) {
    ex = D(ex)
    neg = ex.lt(0)?"-":""
    if (ex.mag == Infinity) return neg + 'Infinity'
    if (Number.isNaN(ex.mag)) return neg + 'NaN'
    if (ex.lt(0)) ex = ex.mul(-1)
    if (ex.eq(0)) return ex.toFixed(acc)
    let e = ex.log10().floor()
    if (ex.log10().lt(Math.min(-acc,0)) && acc > 1) {
        let e = ex.log10().ceil()
        let m = ex.div(e.eq(-1)?D(0.1):Decimal.dTen.pow(e))
        let be = e.mul(-1).max(1).log10().gte(9)
        return neg+(be?'':m.toFixed(2))+'e'+formatSci(e, 0, max)
    } else if (e.lt(max)) {
        let a = Math.max(Math.min(acc-e.toNumber(), acc), 0)
        return neg+(a>0?ex.toFixed(a):ex.toFixed(a).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
    } else {
        if (ex.gte("eeee10")) {
            let slog = ex.slog()
            return (slog.gte(1e9)?'':Decimal.dTen.pow(slog.sub(slog.floor())).toFixed(2)) + "F" + formatSci(slog.floor(), 0)
        }
        let m = ex.div(Decimal.dTen.pow(e))
        let be = e.log10().gte(9)
        return neg+(be?'':m.toFixed(2))+'e'+formatSci(e, 0, max)
    }
}
function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    return format(decimal, 0)
}

function formatTime(time) {
  if (time >= 31536000) {
      return Decimal.floor(time / 31536000) + "y, " + Decimal.floor((time % 31536000) / 86400) + "d, " + Decimal.floor((time % 86400) / 3600) + "m, " + Decimal.floor((time % 3600) / 60) + "m, and " + Decimal.floor(time % 60) + "s"
  } else if (time >= 86400) {
      return Decimal.floor(time / 86400) + "d, " + Decimal.floor((time % 86400) / 3600) + "h, " + Decimal.floor((time % 3600) / 60) + "m, and " + Decimal.floor(time % 60) + "s"
  } else if (time >= 3600) {
      return Decimal.floor(time / 3600) + "h, " + Decimal.floor((time % 3600) / 60) + "m, and " + Decimal.floor(time % 60) + "s"
  } else if (time >= 60) {
      return Decimal.floor(time / 60) + "m, and " + Decimal.floor(time % 60) + "s"
  } else return Decimal.floor(time % 60) + "s"
}

function formatTimeAlternate(time) {
    if (time >= 3600) {
        return Decimal.floor(time / 3600) + ":" + Decimal.floor((time % 3600) / 60) + ":" + Decimal.floor(time % 60)
    } else if (time >= 60) {
        return "00:" + (Decimal.floor(time / 60) < 10 ? "0" + Decimal.floor(time / 60) : Decimal.floor(time / 60)) + ":" + (Decimal.floor(time % 60) < 10 ? `0${Decimal.floor(time % 60)}` : Decimal.floor(time % 60))
    } else if (time >= 10) {
        return "00:00:" + Decimal.floor(time % 60)
    }
    else return "00:00:0"+ Decimal.floor(time % 60)
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}

// Will also display very small numbers
function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}