// Scrapes etymonline.com for etymology matches of a given word

var noodle = require('noodlejs');

module.exports = function fetchEtymology(word, callback) {
    var url = 'http://www.etymonline.com/index.php?search=' + word;
    noodle.query({
        url: url,
        selector: '#dictionary dl dt a:first-child, #dictionary dl dd',
        extract: 'text'
    }).then(function(response) {
        if (!response || !response.results || !response.results.length || !response.results[0].results) {
            // Some sort of error state
            console.log('Unexpected response from etymonline.com:', response);
            return callback(true, null);
        }

        // Results are currently interleaved; turn them into key-value pairs
        var results = {};
        for (var i = 0; i < response.results[0].results.length / 2; i++) {
            results[response.results[0].results[2*i]] = response.results[0].results[2*i + 1];
        }

        // Now find relevant ones 
        var matches = [];
        var unmatched = [];
        for (var key in results) {
            var w = key.replace(/\([^()]+\)$/, '').trim().toLowerCase();
            if (w === word.toLowerCase()) {
                matches.push({word: key, etymology: results[key]});
            }
            else {
                unmatched.push(key);
            }
        }

        callback(null, {
            url: url,
            matches: matches,
            unmatched: unmatched
        });
    })
}
