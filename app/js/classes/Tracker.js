/*
 * list of hostnames being tracked is at trackList
 */

let Tracker = function() {
    function Tracker() {
        let self = this;
        this.list = [];

        chrome.storage.local.get('trackList', function(items) {
            if (items.trackList instanceof Array) {
                self.list = items.trackList;

                chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
                    let tab = tabs[0];

                    if (self.list.includes(tab.url)) {
                        trackPageElem.attr('checked', true);
                    }
                });
            }
        });
    }


    //methods

    Tracker.prototype.add = function(hostname) {
        //let newHost = !this.list.includes(hostname);
        hostname = Link.necessaryFragment(hostname);

        let newHost = true;

        for (let i=0; i < this.list; i++) {
            if (this.list[i].includes(hostname)) {
                newHost = false;
                break;
            }
        }

        if (newHost) {
            this.addNew(hostname);
            this.update();
        }

        return newHost;
    };

    Tracker.prototype.addNew = function(hostname) {
        this.list.push(hostname);
    };

    Tracker.prototype.update = function() {
        chrome.storage.local.set({trackList: this.list});
    };

    Tracker.prototype.delete = function(hostname) {
        let index = this.list.indexOf(hostname);
        this.list.remove(index);

        this.update();
    }

    return Tracker;
}();