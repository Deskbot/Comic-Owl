let newPageTemplate = $($('#new-page-template').html());
let pageList = $('#page-list tbody');



$('#new-page').click(function() {
	let inputRow = newPageTemplate.clone();
	pageList.append(inputRow);
});





























/*
let template = $('template').first();
let elem = $(template.html());

//do stuff with elem

otherElem.append(elem);
*/