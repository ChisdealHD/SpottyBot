$(document).ready(function() {

  //Restore Local
  $('#botUsername').val(localStorage.botUsername);
  $('#botAuth').val(localStorage.botAuth);
  $('#channel').val(localStorage.channel);
  $('#votes').val(localStorage.votes);

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  //Libs
  var nodeSpotifyWebHelper = require('node-spotify-webhelper');
  var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();

  //External Files
  var tracks = require('./tracks');

  //Global Vars
  var _skipCount = 0;
  var _currentSkipVoters = [];
  var _currentKeepVoters = [];
  var _myNextTrackTimer = 0;
  var _myTracks = tracks.allTracks();
  var _mySkipCount = "";
  var _varWhatSong = "";

  // Creating NEW Twitch IRC Client
  $('body').one("click", "#buttonReset", function() {
    $('#botUsername').val("");
    $('#botAuth').val("");
    $('#channel').val("");
    $('#votes').val("");

    localStorage.botUsername = "";
    localStorage.botAuth = "";
    localStorage.channel = "";
    localStorage.votes = "";
  });

  $('body').one("click", "#buttonConnect", function() {

    var botUsername = $('#botUsername').val();
    var botAuth = $('#botAuth').val();
    var channel = $('#channel').val().toLowerCase();
    var votes = $('#votes').val();

    _mySkipCount = votes;

    localStorage.botUsername = botUsername;
    localStorage.botAuth = botAuth;
    localStorage.channel = channel;
    localStorage.votes = votes;

    if (botUsername === "" || botAuth === "" || channel === "" || votes === "") {
      alert("Plase fill in all details.")
    } else {
      var options = {
        options: {
          debug: true
        },
        connection: {
          random: "chat",
          reconnect: true
        },
        identity: {
          username: botUsername,
          password: botAuth
        },
        channels: [channel]
      };

      var client = new irc.client(options);

      client.addListener('connected', function(address, port) {

        $('#connect').hide();
        $('#logger').show();

        myLogger("Connected to <b>#" + channel + "</b> on Twitch!")
        myLogger("Now type <b>!adminstart</b> in your Twitch chat room!");
        myLogger("Using the offical Twitch Music Library! The music listed in the Twitch Music Library is safe to use for both LIVE broadcasts and VOD playback.");
        myLogger("https://play.spotify.com/user/twitchfm/playlist/1fm7mdOoADMy0508dlNbGE");

        $('#twitch-connection .connection-status').html("Connected (#" + channel + ')').removeClass('error').addClass('success');
      });

      client.addListener('connectfail', function(reason) {

        myLogger("Connection to Twitch failed! " + reason);
        $('#twitch-connection .connection-status').html("Connection to Twitch failed!").removeClass('success').addClass('error');
      });

      client.addListener('disconnected', function(reason) {

        myLogger("Disconnected from Twitch! " + reason);
        $('#twitch-connection .connection-status').html("Disconnected from Twitch!").removeClass('success').addClass('error');
      });

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

        if (message.indexOf('!adminstart') === 0 && ('#' + user.username) === channel) {
          var newTrack = getTrack();
          play(newTrack);
          myLogger("<b>Spotify started!</b>");
        }

        if (message.indexOf('!adminskip') === 0 && ('#' + user.username) === channel) {
          var newTrack = getTrack();
          play(newTrack);
          myLogger("<b>Admin skipped the track!</b>");
        }

      });

      //Connect to Twitch
      client.connect();

    }

    function whatSong(channel, user, message) {
      client.say(channel, _varWhatSong);
    }

    function getTrack() {
      var trackNumber = Math.floor(Math.random() * _myTracks.length);
      return _myTracks[trackNumber].uri;
    }

    function play(track) {

      _currentSkipVoters = [];
      _currentKeepVoters = [];
      _skipCount = 0;

      spotify.play(track, function(err, res) {

        if (err) {
          return console.error(err);
        }

        if (res) {

          if (res.track && res.track.track_resource) {

            var message = 'Now playing: ' + res.track.track_resource.name + ' by ' + res.track.artist_resource.name + ' ' + res.track.track_resource.location.og;

            _varWhatSong = message;
            myLogger(message);

            clearTimeout(_myNextTrackTimer);
            var timeBeforeNextTrack = res.track.length * 1000;

            _myNextTrackTimer = setTimeout(function() {
              var newTrack = getTrack();
              play(newTrack);
            }, timeBeforeNextTrack);

          } else {
            //Something went wrong, try again!
            var newTrack = getTrack();
            play(newTrack);
            myLogger("<b>Something went wrong, trying another track!</b>");

          }

        }

      });

    }

    function skip(channel, user, message) {

      var voter = capitaliseFirstLetter(user.username);

      if (_currentSkipVoters.indexOf(voter) !== -1) {

        var message = voter + " you can only vote once per song!";
        client.say(channel, message);

      } else {

        _currentSkipVoters.push(voter);
        myLogger("<b>" + voter + "</b> is voting to skip this track!");

        var index = _currentKeepVoters.indexOf(voter);
        if (index > -1) {
          _currentKeepVoters.splice(index, 1);
        }

        if (_skipCount === (_mySkipCount - 1)) {

          _skipCount = _skipCount + 1;

          var message = _skipCount + " / " + _mySkipCount + " votes needed to skip this track! - Track Skipped!";
          client.say(channel, message);
          myLogger("<b>Track Skipped!</b>");

          var track = getTrack();

          play(track);

        } else {

          _skipCount = _skipCount + 1;
          var message = voter + " is voting to skip this track! " + _skipCount + " / " + _mySkipCount + " votes needed to skip this track!";
          client.say(channel, message);

        }
      }

    }

    function keep(channel, user, message) {

      var voter = capitaliseFirstLetter(user.username);

      if (_currentKeepVoters.indexOf(voter) !== -1) {

        var message = voter + " you can only vote once per song!";
        client.say(channel, message);

      } else {

        _currentKeepVoters.push(voter);
        myLogger("<b>" + voter + "</b> is voting to keep this track!");
        var index = _currentSkipVoters.indexOf(voter);
        if (index > -1) {
          _currentSkipVoters.splice(index, 1);
        }

        _skipCount = _skipCount - 1;

        if (_skipCount === -1) {
          _skipCount = 0;
        }

        var message = voter + " is voting to keep this track! Skip votes is now " + _skipCount + " / " + _mySkipCount + " booya!";
        client.say(channel, message);

      }
    }

    function myLogger(message) {
      console.log(message);
      $("#logger").append("<p>" + message + "</p>");
      $("#logger").scrollTop($("#logger")[0].scrollHeight);
    }

    function capitaliseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

  });

});