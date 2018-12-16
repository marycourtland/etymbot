// Scrapes etymonline.com for etymology matches of a given word

var noodle = require('noodlejs');

module.exports = function fetchEtymology(word, callback) {
    var url = "https://www.etymonline.com/word/" + word;
    noodle.query({
        url: url,
	selector: 'meta[name="description"]',
	extract: 'content'
    }).then(function(response) {
        if (!response || !response.results || !response.results.length || !response.results[0].results) {
            // Some sort of error state
            console.log('Unexpected response from etymonline.com:', response);
            return callback(true, null);
        }

        var matches = [];
        var unmatched = [];

	if (response.results[0].results.length > 0) {
	    var etymology = response.results[0].results[0];
	    matches.push({word: word, etymology: etymology}) 
	}

        callback(null, {
            url: url,
            matches: matches,
            unmatched: unmatched
        });
    })
}
