function getFullHtmlOfOrphan(elem) {
	return elem.wrap('<div>').parent().html();
}