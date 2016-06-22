function getFullHtmlOfOrphan(elem) {
    return elem.wrap('<div>').parent().html();
}

function urlToHostname(url) {
    let startPos = url.indexOf('://') + 3;
    let pathPos = url.indexOf('/', startPos);
    let endPos = pathPos === -1 ? url.length : pathPos;

    return url.substring(startPos, endPos);
}

Array.prototype.remove = function(index) {
    this.splice(index, 1);
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



https://developer.chrome.com/extensions/tabs#method-create

*/