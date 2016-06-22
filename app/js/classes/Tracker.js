let Tracker = function() {
    function Tracker() {
        let self = this;
        this.list = [];

        chrome.storage.local.get('trackList', function(items) {
            if (items.trackList instanceof Array) {
                self.list = items.trackList;
            }
        });
    }


    //methods

    Tracker.prototype.add = function(hostname) {
        console.log(hostname)
        let newHost = !this.list.includes(hostname);

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