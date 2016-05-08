if (!('SLACK_TOKEN' in process.env)) {
    console.log('Missing SLACK_TOKEN; please provide it in the env');
    process.exit(1);
}

var fetchEtymology = require('./etymology');
var SlackClient = require('slack-client');
var slackClient = new SlackClient(process.env.SLACK_TOKEN);
 
var bot;
var trigger = null;
 
slackClient.on('loggedIn', function(user, team) {
    bot = user;
    trigger = new RegExp('^<@' + bot.id + '>:? ');
});
 
slackClient.on('open', function() {
    console.log('Connected');
});
 
slackClient.on('message', function(message) {
    if (message.user == bot.id) return; // Ignore bot's own messages
 
    var channel = slackClient.getChannelGroupOrDMByID(message.channel);
 
    if (!message.text.match(trigger)) return;

    var words  = message.text.split(' ');
    if (words.length < 2) {
        channel.send("Give me a word, like this: @etymbot <word>");
        return;
    }

    var reply = '';
    slackClient._send({ type: "typing", channel: message.channel });
    fetchEtymology(words[1], function(error, result) {
        if (error) {
            channel.send('_Uh oh, something went wrong!_');
            return;
        }
        if (result.matches.length === 0) {
            reply += "_couldn't find an exact match for \"" + words[1] + "\"!_"
        }
        else {
            result.matches.forEach(function(m) {
                reply += '*' + m.word + '* ' + m.etymology + '\n';
            })
        }
        if (result.unmatched.length > 0) {
            reply += '_' + result.unmatched.length + ' more results at ' + result.url + ' _'
        } 
        channel.send(reply);
    });

 });

 slackClient.login();
