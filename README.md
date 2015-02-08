![SpottyBot](http://i.imgur.com/0ZJJA0Q.gif)

## SpottyBot - A Twitch Spotify Bot

SpottyBot is a Twitch IRC bot which plays only TOS compliment music via your desktop Spotify application!  
(Works on Windows and Mac).

Recently Twitch announced a list of tracks made available to Twitch broadcasters to use freely in Twitch live and recorded videos.

Users in your Twitch chat room can now control the music playing on your Twitch stream and as a streamer you can be sure your not breaking any laws or the Twitch terms of service!

This small node app allows users in your chat room to control the music via a voting system and discover the currently playing music track!

The current app list is over 500 songs! [Twitch Music](http://music.twitch.tv)

## Usage

You will need a few things before you start:

You need to have a Spotify account. [Create Spotify Account](https://www.spotify.com/signup/)  
You need to launch Spotify on your streaming desktop or laptop computer. [Install Spotify](https://www.spotify.com/download/)  
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
Type !start in your Twitch chat room.  
This command can also be used to skip a track.  
This is a Broadcaster only command.

## Chat client commands
!start - Only the broadcaster can use this. Can be used to skip a track also.  
!song - List the current song playing.  
!skip - Votes to skip the track.  
!keep - Votes to keep the track.  

## FAQ

Coming Soon!

## Known Issues
If the bot try's to play a music track which is not allowed in the given users country or if an advert plays the bot will crash. The bot can be restarted by typing !start in the Twitch chat. I am working to issolate and fix this issue. <3
