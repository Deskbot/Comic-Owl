let hostname = window.location.href;

Array.prototype.parseAll = function() {
    for (let i=0; i < this.length; i++) {
        this[i] = JSON.parse(this[i]);
    }

    return this;
}

Array.prototype.stringifyAll = function() {
    for (let i=0; i < this.length; i++) {
        this[i] = JSON.stringify(this[i]);
    }
    return this;
}

function store(pageList) {
    console.log(pageList)
    chrome.storage.local.set({pageList: pageList.stringifyAll()});
}

function getReadData(hostname, data) {
    let numberMatcher = /[0-9]+/;
    let cPos = data.rawUrl.indexOf(Link.chapterPH);
    let pPos = data.rawUrl.indexOf(Link.pagePH);

    let cPosLength = hostname.substring(cPos).match(numberMatcher)[0].length;
    let pPosLength = hostname.substring(pPos).match(numberMatcher)[0].length;

    return {
        chapter: cPos === -1 ? null : hostname.substr(cPos, cPosLength),
        page: pPos === -1 ? null : hostname.substr(pPos, pPosLength)
    };
}

function checkToStore() {
    console.log('check to store');
    console.log(hostname)
    chrome.storage.local.get('trackList', function(items) {
        if (items.trackList instanceof Array) {
            console.log("is array");

            for (let i=0; i < items.trackList.length; i++) {
                if (hostname.includes(items.trackList[i])) {
                    console.log("hostname match");

                    chrome.storage.local.get('pageList', function(items) {
                        if (items.pageList instanceof Array) {
                            console.log("is array 2");
                            for (let j=0; j < items.pageList.length; j++) {
                                
                                let linkData = JSON.parse(items.pageList[j]);

                                console.log(linkData);

                                if (hostname.includes(linkData.hostname)) {
                                    console.log("hostname match 2");
                                    let readData = getReadData(hostname, linkData);

                                    console.log(readData);

                                    if (readData.chapter !== null && readData.chapter > linkData.chapter) {
                                        console.log('store 1');
                                        let arr = items.pageList.parseAll();
                                        arr[j].chapter = readData.chapter;
                                        arr[j].page = readData.page;
                                        

                                        store(arr);

                                    } else if (readData.page !== null && readData.page > linkData.page) {
                                        console.log('store 2');

                                        let arr = items.pageList.parseAll();

                                        arr[j].page = readData.page;
                                        store(arr);
                                    } else {
                                        console.log('store 3');
                                    }

                                    chrome.storage.local.get(null, function(i){console.log(i)})


                                    break;
                                }
                            }

                        } else {
                            throw "Url (" + hostname + ") is being tracked but has no data stored about it.";
                        }
                    });

                    break;
                }
            }
        }
    });
}

checkToStore();








/*
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
});*/