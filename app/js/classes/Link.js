let Link = function() {
    function Link(number) {
        this.number = number;
        this.data = {
            name: null,
            rawUrl: null,
            page: null,
            chapter: null,
            latestUrl: null
        };
    }

    Link.prototype.setData = function(data) {
        for (let key in data) {
            this.data[key] = data;
        }
    }

    Link.prototype.serialise = function() {
        return JSON.stringify(this.data);
    }


    return Link;
}();