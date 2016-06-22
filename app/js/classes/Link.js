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
            return this.lastestUrl = this.rawUrl.replace(Link.chapterPH, this.chapter).replace(Link.pagePH, this.chapter);
        }});
/*
        this.data.addGetter('url', function(){
            return this.lastestUrl = this.rawUrl.replace(Link.chapterPH, this.chapter).replace(Link.pagePH, this.chapter);
        });*/
    }

    //attributes

    Link.chapterPH = '%c';
    Link.pagePH = '%p';


    //methods

    Link.prototype.getUrl = function() {
        return this.data.url;
    }

    Link.prototype.setData = function(data) {
        for (let key in data) {
            this.data[key] = data[key];
        }
    }

    Link.prototype.toHtmlElem = function() {
        let pageRow = pageRowTemplate.clone();

        let name = pageRow.find('.name');

        pageRow.attr('data-number', this.number);
        pageRow.attr('data-href', this.data.url); //legacy
        name.html(this.data.name);
        name.attr('data-href', this.data.url);
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