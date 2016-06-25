//globals
let pageInputTemplate = $($('#new-page-template').html());
let pageRowTemplate = $($('#page-row-template').html());
let editRowTemplate = $($('#edit-row-template').html());
let pageListElem = $('#page-list tbody');
let trackPageElem = $('#track-page');
let creditsElem = $('#credits');

let pageList = new PageList(pageListElem);
let tracker = new Tracker();

//listeners

trackPageElem.on('click', function() {
    let self = this;

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
        let tab = tabs[0];
        let isNew = tracker.add(tab.url);

        if (self.checked) {
            if (isNew) {
                let rawUrl = Link.necessaryFragment(tab.url);
                let linkData = {
                    name: tab.title,
                    baseUrl: rawUrl,
//                    hostname: hostname,
                    chapter: 0,
                    page: 0
                };

                let linkId = pageList.addNew(linkData);

                pageList.display(linkId);
                pageList.edit(linkId);
            }

        } else {
            tracker.delete(Link.necessaryFragment(tab.url));
        }
    });
});

$('#new-page').on('click', function() {
    let inputRow = pageInputTemplate.clone();
    pageListElem.append(inputRow);
    inputRow.find('input[name="name"]').focus();
});

pageListElem.on('keypress', '.input input[type="text"]', function(event) {
    if (event.which === 13) {
        let $this = $(this);
        let $thisRow = $this.parentsUntil('tbody').last();

        let name = $thisRow.find('input[name="name"]').val();
        let rawUrl = $thisRow.find('input[name="url"]').val();

        let id = pageList.addNew({name: name, baseUrl: rawUrl});
        let html = pageList.list[id].toHtml();

        $thisRow.remove();

        pageListElem.append(html);
    }
});

pageListElem.on('click', '.data .name', function() {
    let $this = $(this);
    let redirectUrl = $this.attr('data-href');

    chrome.tabs.create({url: redirectUrl});

});

pageListElem.on('click', '.delete', function() {
    let $this = $(this);
    let $thisRow = $this.parentsUntil('tbody').last();
    let number = $thisRow.attr('data-number');
    
    tracker.delete(pageList.get(number).data.hostname);
    pageList.delete(number);

    //decrement the number of all following rows
    $thisRow.nextAll().each(function(num, elem) {
        $elem = $(elem);
        $elem.attr('data-number', $elem.attr('data-number') - 1);
    });
    
    $thisRow.remove();
});

pageListElem.on('click', '.edit', function() {
    let $this = $(this);
    let $thisRow = $this.parentsUntil('tbody').last();
    let editRow = editRowTemplate.clone();
    let number = $thisRow.attr('data-number');
    let link = pageList.get(number);

    //build edit row
    editRow.attr('data-number', number);
    editRow.find('input[name="name"]').val(link.data.name);
    editRow.find('input[name="rawUrl"]').val(link.data.rawUrl);
    editRow.find('input[name="chapter"]').val(link.data.chapter);
    editRow.find('input[name="page"]').val(link.data.page);

    //swap row shown
    $thisRow.addClass('hidden');
    $thisRow.after(editRow);
});

function finishEditCallback(event) {
    let $this = $(this);
    let $thisRow = $this.parentsUntil('tbody').last();
    let data = {
        name: $thisRow.find('input[name="name"]').val(),
        baseUrl: $thisRow.find('input[name="rawUrl"]').val(),
        chapter: $thisRow.find('input[name="chapter"]').val(),
        page: $thisRow.find('input[name="page"]').val()
    };

    //save changes
    let number = $thisRow.attr('data-number');
    pageList.get(number).setData(data);
    pageList.saveList();

    //turn it back
    let dataRow = $thisRow.prev();
    dataRow.find('.name').html(data.name);
    dataRow.find('.rawUrl').html(data.rawUrl);
    dataRow.find('.chapter').html(data.chapter);
    dataRow.find('.page').html(data.page);
    dataRow.removeClass('hidden');
    $thisRow.remove();
}

pageListElem.on('keypress', '.editing input', function(event) {
    if (event.which === 13) {
        finishEditCallback.bind(this)(event);
    }
});

pageListElem.on('click', '.editing .accept', finishEditCallback);

pageListElem.on('click', '.editing .cancel', function() {
    let $this = $(this);
    let $thisRow = $this.parentsUntil('tbody').last();

    //turn it back
    let dataRow = $thisRow.prev();
    dataRow.removeClass('hidden');
    $thisRow.remove();
});

$('#credits-button').on('click', function(event) {
    creditsElem.toggleClass('hidden');
});