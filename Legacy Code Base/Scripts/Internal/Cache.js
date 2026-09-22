/**
 * A cache for DOM elements
 */
const DOMCache = new Map();

const DOMCacheGetOrSet = (id) => {
    const cachedEl = DOMCache.get(id);
    if (cachedEl) return cachedEl;

    const el = document.getElementById(id);
    DOMCache.set(id, el);
    return el;
}