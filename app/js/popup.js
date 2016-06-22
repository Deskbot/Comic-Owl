//functions
/*function () {
    
}*/

//globals
let pageInputTemplate = $($('#new-page-template').html());
let pageRowTemplate = $($('#page-row-template').html());
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

pageListElem.on('click', '.data', function() {
    let $this = $(this);
    let redirectUrl = $this.attr('data-href');

    chrome.tabs.create({url: redirectUrl});

});






























/*
let template = $('template').first();
let elem = $(template.html());

//do stuff with elem

otherElem.append(elem);
*/