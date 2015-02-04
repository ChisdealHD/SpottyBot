process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

//Libs
var irc = require('twitch-irc');
var nodeSpotifyWebHelper = require('node-spotify-webhelper');
var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();

//External Files
var tracks = require('./tracks');
var settings = require('./settings');

//Global Vars
var _skipCount = 0;
var _currentSkipVoters = [];
var _currentKeepVoters = [];
var _myNextTrackTimer = 0;
var _myTracks = tracks.allTracks();
var _myUsername = settings.botUsername;
var _myPassword = settings.botAuthToken;
var _myTwitchChannel = settings.twitchChannels;
var _mySkipCount = settings.skipCount;

// Creating NEW Twitch IRC Client
var client = new irc.client({
  options: {
    debug: true,
    debugIgnore: ['ping', 'chat', 'action'],
    logging: false,
    tc: 3
  },
  identity: {
    username: _myUsername,
    password: _myPassword
  },
  channels: _myTwitchChannel
});

//Connect to Twitch
client.connect();

// Add listeners for chat commands.
client.addListener('chat', function(channel, user, message) {

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

  if (message.indexOf('!start') === 0 && user.special.indexOf('broadcaster') >= 0) {
    var newTrack = getTrack();
    play(newTrack);
    console.info("Spotify started!");
  }

});

function whatSong(channel, user, message) {
  spotify.getStatus(function(err, res) {
    if (err) {
      return console.error(err);
    }

    var message = 'Currently playing: ' + res.track.track_resource.name + ' by ' + res.track.artist_resource.name + ' - ' + res.track.track_resource.location.og;
    client.say(channel, message);
  });
}

function getTrack() {
  var trackNumber = Math.floor(Math.random() * _myTracks.length + 1);
  return _myTracks[trackNumber].uri;
}

function play(track) {

  _currentSkipVoters = [];
  _currentKeepVoters = [];
  _skipCount = 0;

  spotify.play(track, function(err, res) {

    if (err) {
      console.info(err);
      return console.error(err);
    }

    if (res) {

      console.log("Now playing: " + track);

      clearTimeout(_myNextTrackTimer);
      var timeBeforeNextTrack = res.track.length * 1000;

      _myNextTrackTimer = setTimeout(function() {
        var newTrack = getTrack();

        play(newTrack);

      }, timeBeforeNextTrack);

    }

  });

}

function skip(channel, user, message) {

  var voter = user.username;

  if (_currentSkipVoters.indexOf(voter) !== -1) {

    var message = user.username + " you can only vote once per song!";
    client.say(channel, message);

  } else {

    _currentSkipVoters.push(voter);
    console.log(voter + " is voting to skip this track!");
    var index = _currentKeepVoters.indexOf(voter);
    if (index > -1) {
      _currentKeepVoters.splice(index, 1);
    }

    if (_skipCount === (_mySkipCount - 1)) {

      _skipCount = _skipCount + 1;

      var message = _skipCount + " / " + _mySkipCount + " votes needed to skip this track! - Track Skipped!";
      client.say(channel, message);
      console.log("Track Skipped!");

      var track = getTrack();

      play(track);

    } else {

      _skipCount = _skipCount + 1;
      var message = user.username + " is voting to skip this track! " + _skipCount + " / " + _mySkipCount + " votes needed to skip this track!";
      client.say(channel, message);

    }
  }

}

function keep(channel, user, message) {

  var voter = user.username;

  if (_currentKeepVoters.indexOf(voter) !== -1) {

    var message = user.username + " you can only vote once per song!";
    client.say(channel, message);

  } else {

    _currentKeepVoters.push(voter);
    console.log(voter + " is voting to keep this track!");
    var index = _currentSkipVoters.indexOf(voter);
    if (index > -1) {
      _currentSkipVoters.splice(index, 1);
    }

    _skipCount = _skipCount - 1;

    if (_skipCount === -1) {
      _skipCount = 0;
    }

    var message = user.username + " is voting to keep this track! Skip votes is now " + _skipCount + " / " + _mySkipCount + " booya!";
    client.say(channel, message);

  }
}