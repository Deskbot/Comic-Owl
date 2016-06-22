/*
 * names in chrome storage:
 ** pageList is the list of elements
*/

let PageList = function() {
    function PageList(elem) {
        let self = this;

        this.elem = elem;
        this.list = [];

        chrome.storage.local.get('pageList', function(items) {
            if (items.pageList instanceof Array) {
                let list = items.pageList;

                for (let i=0; i < list.length; i++) {
                    self.add(JSON.parse(list[i]));
                }

                self.displayAll();
            }
        });
    }

    //attributes



    //methods

    PageList.prototype.get = function(num) {
        return this.list[num];
    }

    PageList.prototype.add = function(linkData) {
        let listLen = this.list.push(null);
        let linkId = listLen - 1;
        let newLink = this.list[linkId] = new Link(linkId);

        newLink.setData(linkData);

        return linkId;
    };

    PageList.prototype.addNew = function(linkData) {
        let linkId = this.add(linkData);

        this.saveList();

        return linkId;
    };

    PageList.prototype.saveList = function() {
        let jsonList = [];

        for (let i=0; i < this.list.length; i++) {
            jsonList[i] = this.list[i].serialise();
        }

        let storage = {
            pageList: jsonList
        };

        chrome.storage.local.set(storage);
    };

    PageList.prototype.displayAll = function() {
        for (let i=0; i < this.list.length; i++) {
            this.display(i);
        }
    };

    PageList.prototype.display = function(id) {
        this.elem.append(this.list[id].toHtml());
    };

    PageList.prototype.delete = function(index) {
        this.list.remove(index);
        this.saveList();
    };

    PageList.prototype.edit = function(number) {
        //provisional
        this.elem.children('tr:eq(' + number + ')').find('.edit').click();
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