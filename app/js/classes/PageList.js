let PageList = function() {
    function PageList() {
        let self = this;

        this.list = [];

        chrome.storage.local.get('pageList', function(items) {
            let list = items.pageList;

            if (list instanceof Array) {
                for (let i=0; i < list.length; i++) {
                    self.add(JSON.parse(list[i]));
                }
            }
        });
    }

    //methods

    PageList.prototype.add = function(linkData) {
        let listLen = this.list.push(null);
        let linkId = listLen - 1;
        let newLink = this.list[linkId] = new Link(linkId);

        newLink.setData({
            name: linkData.name,
            rawUrl: linkData.rawUrl,
            page: linkData.page,
            chapter: linkData.chapter,
            latestUrl: linkData.latestUrl
        });

        return linkId;
    }

    PageList.prototype.addNew = function(name, url) {
        let listLen = this.list.push(null);
        let linkId = listLen - 1;
        let newLink = this.list[linkId] = new Link(linkId);

        newLink.setData({
            name: name,
            rawUrl: url,
            page: null,
            chapter: null,
            latestUrl: null
        });

        return linkId;
    }


    return PageList;
}();

/*

Page format:

{
    id:
    name:
    rawUrl:
    page:
    chapter:
    latestUrl:
}

*/