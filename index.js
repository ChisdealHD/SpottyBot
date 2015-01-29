process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var irc = require('twitch-irc');
var nodeSpotifyWebHelper = require('node-spotify-webhelper');

var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();

// Calling a new client..
var client = new irc.client({
    options: {
        debug: true,
        debugIgnore: ['ping', 'chat', 'action'],
        logging: false,
        tc: 3
    },
    identity: {
        username: 'SpottyBot',
        password: 'oauth:y13g9wu7jilquha4489dtde0fxvuyv'
    },
    channels: ['fivemandown']
});

// Connect the client to server..
client.connect();

// Your events..
client.addListener('chat', function (channel, user, message) {
    // If the message starts with !hello..
    if (message.indexOf('!hello') === 0) {
        // Say something
        // https://github.com/Schmoopiie/twitch-irc/wiki/Command:-Say
        client.say(channel, 'Hey '+user.username+'! How you doing? Kappa');
    }

    if (message.indexOf('!song') === 0) {
        // get the name of the song which is currently playing
        whatSong(channel, user, message);
    }

    // if (message.indexOf('!next') === 0) {

    //     //spotify.play("spotify:track:0VCgCqwScZdg72toljZdQP", function (err, res) {
    //     spotify.play("spotify:track", function (err, res) {

    //         console.info('next12');

    //         if (err) {
    //             console.info(err);
    //           return console.error(err);
    //         }

    //         if (res) {
    //             console.info(res);
    //           return console.info(res);
    //         }
    //     });

    // }

    });

function whatSong(channel, user, message) {
    spotify.getStatus(function (err, res) {
      if (err) {
        return console.error(err);
      }

      var message = 'Currently playing: ' + res.track.artist_resource.name + ' - ' + res.track.track_resource.name + ' (' + res.track.track_resource.location.og + ')';
      client.say(channel, message);
    });
}