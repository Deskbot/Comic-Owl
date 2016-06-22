//functions
function () {
	
}

//globals

let newPageTemplate = $($('#new-page-template').html());
let pageList = $('#page-list tbody');

//listeners

pageList.on('keypress', '.input input[type="text"]', function(event) {
	if (event.which === 13) {
		let $this = $(this);

	}
});

$('#new-page').on('click', function() {
	let inputRow = newPageTemplate.clone();
	pageList.append(inputRow);
});





























/*
let template = $('template').first();
let elem = $(template.html());

//do stuff with elem

otherElem.append(elem);
*/