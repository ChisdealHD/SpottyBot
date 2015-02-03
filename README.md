![SpottyBot](http://i.imgur.com/0ZJJA0Q.gif)

## SpottyBot

A Twitch IRC bot which plays only TOS compliment music via your desktop Spotify application! (Windows Only, maybe Mac but I have not tested!)

Yes, users in your Twitch chat room can now control the music playing on your twitch stream and as a streamer you can be sure your not breaking any laws or Twitch terms of service!

Recently Twitch announced a list of tracks made available to Twitch broadcasters to use freely in Twitch Live and Recorded Videos.

This small node app allows users in your room to control the music!

The current app list is over 500 songs! [Twitch Music](http://music.twitch.tv)

## Usage

You will need a few things before you start:

You need to have a Spotify account. [Create Spotify Account](https://www.spotify.com/signup/)  
You need to launch Spotify on your streaming desktop or laptop computer. [Install Spotify](https://www.spotify.com/download/)  
You may need  a premium Spotify account for this to work (I have not tested yet).  
You need to have node.js installed. [Install Node](http://nodejs.org/)  
Download this SpottyBot application. [Download SpottyBot](https://github.com/Fasani/SpottyBot/archive/master.zip)  
You need a spare or new twitch bot account.  

## Start SpottyBot

1. You need to create a new twitch account for your SpottyBot, call it something like TimsJukeBox or FMDMusicBot.
2. You need to get an oauth token for the bot to connect to Twitch. [Create oauth token](http://twitchapps.com/tmi/)
3. Edit the `settings.js` file
4. Open a node console at the folder location and type `node app.js`.

settings.js
```javascript
module.exports = {
  botUsername: 'YourBotsUserName',
  botAuthToken: 'oauth:123456789123456789',
  twitchChannels: ['YourTwitchChannel'],
  skipCount: 5
};
```

## Start the app playing music!
Type !skip 5 times. (I need to make command that says !play only for channel owners.)

## Chat client commands
!song - list the current song playing
!skip - votes to skip the track
!keep - votes to keep the track

## FAQ

Coming Soon!
