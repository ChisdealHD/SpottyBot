process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var irc = require('twitch-irc');
var nodeSpotifyWebHelper = require('node-spotify-webhelper');
var tracks = require('./tracks');

var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();

var _skipCount = 0;
var _myNextTrackTimer = 0;
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

  if (message.indexOf('!song') === 0) {
    // Get the name of the song which is currently playing
    whatSong(channel, user, message);
  }

  if (message.indexOf('!skip') === 0) {
    // Skip track
    skip(channel, user, message);
  }

  if (message.indexOf('!keep') === 0) {
    // Skip track
    keep(channel, user, message);
  }

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

function getTrack() {
  var myTracks = tracks.allTracks();
  var trackNumber = Math.floor(Math.random() * myTracks.length + 1);

  return myTracks[trackNumber].uri;
}

function play(track) {

  spotify.play(track, function (err, res) {

    if (err) {
      console.info(err);
      return console.error(err);
    }

    if (res) {

      clearTimeout(_myNextTrackTimer);
      var timeBeforeNextTrack = res.track.length * 1000;

      _myNextTrackTimer = setTimeout(function () {
        var newTrack = getTrack();

        console.log(newTrack);
        console.log(timeBeforeNextTrack);

        play(newTrack);

      }, timeBeforeNextTrack);

    }

  });

}

function skip(channel, user, message) {

  if (_skipCount === 4) {

    _skipCount = _skipCount + 1;
    var message = _skipCount + " / 5 votes needed to skip this track! - Track Skipped!";
    client.say(channel, message);

    _skipCount = 0

    var track = getTrack();

    play(track);

  } else {
    _skipCount = _skipCount + 1;
    var message = user.username + " is voting to skip this track! " + _skipCount + " / 5 votes needed to skip this track!";
    client.say(channel, message);
  }

}

function keep(channel, user, message) {

    _skipCount = _skipCount - 1;

    if (_skipCount === -1) {
      _skipCount = 0;
    }

    var message = user.username + " is voting to keep this track! Skip votes is now " + _skipCount + " / 5 booya!";
    client.say(channel, message);

}