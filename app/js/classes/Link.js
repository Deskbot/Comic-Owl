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

    //attributes

    Link.chapterPH = '%c';
    Link.pagePH = '%p';


    //methods

    Link.prototype.getUrl = function() {
        let url = this.data.rawUrl;
        return url.replace(Link.chapterPH, this.data.chapter).replace(Link.pagePH, this.data.chapter);
    }

    Link.prototype.setData = function(data) {
        for (let key in data) {
            this.data[key] = data[key];
        }
    }

    Link.prototype.toHtmlElem = function() {
        let pageRow = pageRowTemplate.clone();

        pageRow.data('href', this.data.latestUrl);
        pageRow.find('td.name').html(this.data.name);
        pageRow.find('td.chapter').html(this.data.chapter === null ? "" : this.data.chapter);
        pageRow.find('td.page').html(this.data.page === null ? "" : this.data.page);

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