//functions
/*function () {
    
}*/

//globals
let pageInputTemplate = $($('#new-page-template').html());
let pageRowTemplate = $($('#page-row-template').html());
let editRowTemplate = $($('#edit-row-template').html());
let pageListElem = $('#page-list tbody');

let pageList = new PageList(pageListElem);

//listeners

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

        let id = pageList.addNew(name, rawUrl);
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

    pageList.delete(number);

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
    dataRow.find('.chapter').html(data.chapter);
    dataRow.find('.page').html(data.page);
    dataRow.removeClass('hidden');
    $thisRow.remove();
}

pageListElem.on('keypress', '.editing input', function(event) {
    if (event.which === 13) {
        finishEditCallback(event);
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


















/*
let template = $('template').first();
let elem = $(template.html());

//do stuff with elem

otherElem.append(elem);
*/