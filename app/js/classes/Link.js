let Link = function() {
    function Link(number) {
        this.number = number;
        this.data = {
            name: "",
            rawUrl: "",
            page: "",
            chapter: "",
            latestUrl: ""
        };

        Object.defineProperty(this.data, 'url', {get: function() {
            return this.latestUrl = this.rawUrl.replace(Link.chapterPH, this.chapter).replace(Link.pagePH, this.page);
        }});
        Object.defineProperty(this.data, 'baseUrl', {set: function(val) {
            this.rawUrl = val;
            this.hostname = Link.necessaryFragment(val);
        }});
/*
        this.data.addGetter('url', function(){
            return this.latestUrl = this.rawUrl.replace(Link.chapterPH, this.chapter).replace(Link.pagePH, this.page);
        });*/
    }

    //attributes

    Link.chapterPH = '%c';
    Link.pagePH = '%p';


    //methods

    Link.necessaryFragment = function(url) {
        let cPos = url.indexOf(Link.chapterPH);
        let pPos = url.indexOf(Link.pagePH);
        let possible = [];

        if (cPos !== -1) {
            possible.push(cPos);
        }
        if (pPos !== -1) {
            possible.push(pPos);
        }

        if (possible.length === 0) {
            return url;
        } else {
            return url.substring(0, possible.min());
        }
    }

    Link.prototype.getUrl = function() {
        return this.data.url;
    }

    Link.prototype.setData = function(data) {
        if (data.hasOwnProperty('rawUrl')) {
            tracker.delete(this.data.rawUrl);
            tracker.add(data.rawUrl);
        }

        for (let key in data) {
            this.data[key] = data[key];
        }
    }

    Link.prototype.toHtmlElem = function() {
        let pageRow = pageRowTemplate.clone();

        let name = pageRow.find('.name');

        pageRow.attr('data-number', this.number);
        pageRow.attr('data-href', this.data.url);
        name.html(this.data.name);
        //name.attr('data-href', this.data.url); //pretty sure not needed
        pageRow.find('.chapter').html(this.data.chapter === null ? "" : this.data.chapter);
        pageRow.find('.page').html(this.data.page === null ? "" : this.data.page);

        return pageRow;
    }

    Link.prototype.toHtml = function() {
        return getFullHtmlOfOrphan(this.toHtmlElem());
    }

    Link.prototype.serialise = function() {
        return JSON.stringify(this.data);
    }


    return Link;
}();