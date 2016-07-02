/*
 * list of hostnames being tracked is at trackList
 */

let Tracker = function() {
    function Tracker() {
        let self = this;
        this.list = [];

        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
            let tab = tabs[0];

            self.currentUrl = tab.url;
            self.currentTitle = tab.title;

            console.log(tab.url);
            console.log(self.isTracking(tab.url));

            if (self.isTracking(tab.url)) {
                trackPageElem.attr('checked', true);
            }
        });

        chrome.storage.local.get('trackList', function(items) {
            if (items.trackList instanceof Array) {
                self.list = items.trackList;
            }
        });
    }


    //methods

    Tracker.prototype.add = function(hostname) {
        //let newHost = !this.list.includes(hostname);
        hostname = Link.necessaryFragment(hostname);

        let newHost = true;

        //has to check each part of the list for some reason
        for (let i=0; i < this.list; i++) {
            if (this.list[i].includes(hostname)) {
                newHost = false;
                break;
            }
        }

        if (newHost) {
            this.addNew(hostname);
        }

        return newHost;
    };

    Tracker.prototype.addNew = function(hostname) {
        this.list.push(hostname);
    };

    Tracker.prototype.alter = function(number, newName) {
        this.list[number] = Link.necessaryFragment(newName);
    }

    Tracker.prototype.update = function() {
        console.trace(this.list);
        chrome.storage.local.set({trackList: this.list});
    };

    Tracker.prototype.delete = function(hostname) {
        let index = this.list.indexOf(hostname);
        this.list.remove(index);

//        this.update();

        return index;
    }

    Tracker.prototype.isTracking = function(url) {
        for (let i=0; i < this.list.length; i++) {
            console.log(url, this.list[i], url.includes(this.list[i]));
            if (url.includes(this.list[i])) {
                return true;
            }
            
        }

        return false;
    }

    return Tracker;
}();