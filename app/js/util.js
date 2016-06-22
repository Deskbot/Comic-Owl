function getFullHtmlOfOrphan(elem) {
    return elem.wrap('<div>').parent().html();
}

/*

Object.prototype.addSetter = function(attr, func) {
    Object.defineProperty(this, attr, {set: func});
    return this;
}

Object.prototype.addGetter = function(attr, func) {
    Object.defineProperty(this, attr, {get: func});
    return this;
}

*/