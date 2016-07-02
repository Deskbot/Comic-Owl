//globals
let pageInputTemplate = $($('#new-page-template').html());
let pageRowTemplate = $($('#page-row-template').html());
let editRowTemplate = $($('#edit-row-template').html());
let pageListElem = $('#page-list tbody');
let trackPageElem = $('#track-page');
let creditsElem = $('#credits');

let pageList = new PageList(pageListElem);
let tracker = new Tracker();

//preparation

//listeners

trackPageElem.on('click', function() {
    let isNew = !tracker.isTracking(tracker.currentUrl);

    if (this.checked) {
        if (isNew) {
            tracker.add(tracker.currentUrl);
            tracker.update();

            let rawUrl = Link.necessaryFragment(tracker.currentUrl);
            let linkData = {
                name: tracker.currentTitle,
                baseUrl: rawUrl,
                chapter: 0,
                page: 0
            };

            let linkId = pageList.addNew(linkData);

            pageList.display(linkId);
            pageList.edit(linkId);
        }

    } else {
        let index = tracker.delete(Link.necessaryFragment(tracker.currentUrl));
        tracker.update();
        pageList.delete(index);
    }
});

$('#new-page').on('click', function() {
    let inputRow = pageInputTemplate.clone();
    pageListElem.append(inputRow);
    inputRow.find('input[name="name"]').focus();
});

function acceptNew() {
    let $this = $(this);
    let $thisRow = $this.parentsUntil('tbody').last();

    let name = $thisRow.find('input[name="name"]').val();
    let rawUrl = $thisRow.find('input[name="url"]').val();

    let id = pageList.addNew({name: name, baseUrl: rawUrl});
    let html = pageList.list[id].toHtml();

    tracker.add(rawUrl);
    tracker.update();

    $thisRow.remove();
    pageListElem.append(html);
}

pageListElem.on('keypress', '.input input[type="text"]', function(event) {
    if (event.which === 13) {
        acceptNew.bind(this)();
    }
});

pageListElem.on('click', '.input .accept', acceptNew);

pageListElem.on('click', '.input .cancel', function() {
    let $this = $(this);
    let $thisRow = $this.parentsUntil('tbody').last();
    $thisRow.remove();
});

pageListElem.on('click', '.data .name, .data .chapter, .data .page', function() {
    let $this = $(this);
    let redirectUrl = $this.parentsUntil('tbody').first().attr('data-href');

    chrome.tabs.create({url: redirectUrl});

});

pageListElem.on('click', '.delete', function() {
    let $this = $(this);
    let $thisRow = $this.parentsUntil('tbody').last();
    let number = $thisRow.attr('data-number');
    
    tracker.delete(pageList.get(number).data.hostname);
    tracker.update();
    pageList.delete(number, $thisRow);
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
    let currentLink = pageList.get(number);

    tracker.alter(number, data.baseUrl);
    tracker.update();

    currentLink.setData(data);
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