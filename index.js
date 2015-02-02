process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var irc = require('twitch-irc');
var nodeSpotifyWebHelper = require('node-spotify-webhelper');

var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();

var _skipCount = 0;

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

// client.addListener('join', function (channel, user, message) {
//     if (user.special.indexOf('mod') >= 0) {
//         client.say(channel, "Hello " + user.username + '!');
//     }
// });

// Your events..
client.addListener('chat', function(channel, user, message) {
    // If the message starts with !hello..
    if (message.indexOf('!hello') === 0) {
        client.say(channel, 'Hey ' + user.username + '! How you doing? Kappa');
    }

    if (message.indexOf('!song') === 0) {
        // Get the name of the song which is currently playing
        whatSong(channel, user, message);
    }

    if (message.indexOf('!skip') === 0) {
        // Skip track
        skip(channel, user, message);
    }

});

function whatSong(channel, user, message) {
    spotify.getStatus(function(err, res) {
        if (err) {
            return console.error(err);
        }

        var message = 'Currently playing: ' + res.track.artist_resource.name + ' - ' + res.track.track_resource.name + ' (' + res.track.track_resource.location.og + ')';
        client.say(channel, message);
    });
}

function getTrack() {
    var trackNumber = Math.floor(Math.random() * tracks.length + 1);
    var track = tracks[trackNumber].uri;
    return track;
}

function skip(channel, user, message) {

    if (_skipCount === 4) {

        _skipCount = _skipCount + 1;
        var message = _skipCount + " / 5 votes needed to skip this track! - Track Skipped!";
        client.say(channel, message);

        _skipCount = 0

        var track = getTrack();

        spotify.play(track, function(err, res) {

            if (err) {
                console.info(err);
                return console.error(err);
            }

        });

    } else {
        _skipCount = _skipCount + 1;
        var message = _skipCount + " / 5 votes needed to skip this track!";
        client.say(channel, message);
    }

}

var tracks = [{
    "name": "Amsterdam - Radio Edit",
    "uri": "spotify:track:1Y9JyeOwSiWooBDnLGPN6i"
}, {
    "name": "Bazooka - Original Mix",
    "uri": "spotify:track:6SDyHmJylWfNh4h6SwPUTO"
}, {
    "name": "Break The House - Original Mix",
    "uri": "spotify:track:2q5MjR1LjBHIJ4ELaBoPCj"
}, {
    "name": "Breathe - Original Mix",
    "uri": "spotify:track:0OvK0gHZfgJnIP1zopELq0"
}, {
    "name": "C'mon Rave On - Original Mix",
    "uri": "spotify:track:0mMLQtz11t85LOwaxMG6vP"
}, {
    "name": "Can You Feel It - Original Mix",
    "uri": "spotify:track:46baQ65FTbE9zPFMi16pNf"
}, {
    "name": "Desire - Original Mix",
    "uri": "spotify:track:5Zp6NY5hBIVt31ki2NF1F2"
}, {
    "name": "Enjoy Me Feat. Max Julien - Original Mix",
    "uri": "spotify:track:1lQxtNW0GOdu9SPTlYZzOu"
}, {
    "name": "Ghosts - Radio Edit",
    "uri": "spotify:track:2TUYTRcHGpsCvahehqlmxR"
}, {
    "name": "Heavy - Original Mix",
    "uri": "spotify:track:7rx6QoUs6pnpL2IEmbv6MV"
}, {
    "name": "Hypnotica - Original Mix",
    "uri": "spotify:track:5eawvXM3TSkhdMK0gDDPgr"
}, {
    "name": "Love 2.0 - Original Mix",
    "uri": "spotify:track:1nWDFyfNppCKkj5NUctphZ"
}, {
    "name": "Max Ammo - Original Mix",
    "uri": "spotify:track:491nz6PT6kTbi66kM3bSda"
}, {
    "name": "Parade - Original Mix",
    "uri": "spotify:track:3aZKEEocdMK0PF61eCdeIu"
}, {
    "name": "Ramcar",
    "uri": "spotify:track:7eHBfJ6mXXbIly9YBdsE50"
}, {
    "name": "Ravelocker - Original Mix",
    "uri": "spotify:track:3KHC2FRKcybNBJGnsfuZ7I"
}, {
    "name": "Starlight - Original Mix",
    "uri": "spotify:track:0kFgx9Ocu4Ta9Pblli3C8E"
}, {
    "name": "Step Six - Radio Edit",
    "uri": "spotify:track:3JWDeiGaB9ZmEPnppCgNqC"
}, {
    "name": "Switch - Radio Edit",
    "uri": "spotify:track:3dvZu2boFmaL46oZOTCWCI"
}, {
    "name": "Unleash - Original Mix",
    "uri": "spotify:track:3EpAVolpbvMle2BZ95obfc"
}, {
    "name": "Vicious - Original Mix",
    "uri": "spotify:track:6M3LMAZJ8qZ6EyxQp8Szjx"
}, {
    "name": "Break Them (feat. Anna Yvette)",
    "uri": "spotify:track:6Ig3vDalExljCxjmpaiWpK"
}, {
    "name": "Surface",
    "uri": "spotify:track:6SkzEGUcX6x5flwDBgeOpc"
}, {
    "name": "Apollo (Electro Mix)",
    "uri": "spotify:track:3xx7HGqDychRrgBmx0r060"
}, {
    "name": "Rain (Stephen Walking Remix)",
    "uri": "spotify:track:65z3OLrV2sEne0TE4h82BH"
}, {
    "name": "Follow You (feat. Danyka Nadeau)",
    "uri": "spotify:track:6dt0xjpzolXsP3DSwthwg0"
}, {
    "name": "To the Stars",
    "uri": "spotify:track:4CLSOQ1moBBoYqhr7vdcbz"
}, {
    "name": "Error Code",
    "uri": "spotify:track:7qBMxXf2bGl1i7SB9KOtM6"
}, {
    "name": "Prism",
    "uri": "spotify:track:31mB79epUWxraKzTPbiWzl"
}, {
    "name": "Battle Cry",
    "uri": "spotify:track:7LNkV2YhTuqHZR9u5dt6y5"
}, {
    "name": "With You (feat. Alby Hobbs)",
    "uri": "spotify:track:60nT78s9l9r66SwslTOo5o"
}, {
    "name": "Boundaries",
    "uri": "spotify:track:25J6iZeRvOccJP1WpIUshx"
}, {
    "name": "Keep on Rocking",
    "uri": "spotify:track:51KpUc9hoi3ixweklvPp8Y"
}, {
    "name": "Taking Over (feat. Cassandra Kay)",
    "uri": "spotify:track:2WWyllDdKzdgcj7SlT7pt7"
}, {
    "name": "Phosphor (feat. Miyoki)",
    "uri": "spotify:track:4D8OO0bSlzBSJgBCHxqikf"
}, {
    "name": "Duality",
    "uri": "spotify:track:1WbVVZyonpRwlOkLkxFZ0V"
}, {
    "name": "Here With You Now",
    "uri": "spotify:track:242CCCVyuXYhb9FjuGOA1n"
}, {
    "name": "Cloud Nine",
    "uri": "spotify:track:07M8danOSocZYpjH5uYpyT"
}, {
    "name": "Synergy",
    "uri": "spotify:track:5Z6JyoLuTbSKO3mpAwK0k9"
}, {
    "name": "The Schism",
    "uri": "spotify:track:2wYTXWyPrDsIC7WRXOpyBo"
}, {
    "name": "Collide (Astronaut & Barely Alive Remix)",
    "uri": "spotify:track:15WhpFYtQm4Y4wDjFaqV0F"
}, {
    "name": "Air",
    "uri": "spotify:track:1hnCDp42G1yjeZEfP9Eu81"
}, {
    "name": "Interstellar",
    "uri": "spotify:track:7DLezij0MvzU7RonUosBJe"
}, {
    "name": "You & Me",
    "uri": "spotify:track:1MT8g9MZYt1eb4NVhJitU1"
}, {
    "name": "One Look (feat. Mammals)",
    "uri": "spotify:track:0yNwiO2VD2vakcfHZ1NI33"
}, {
    "name": "Hysteria",
    "uri": "spotify:track:3Kr6MuDeWgt1FqmMzFvsTm"
}, {
    "name": "Out on a Limb (feat. Jonny Rose)",
    "uri": "spotify:track:18bX2TaTJ0lUJAjNqHr7xh"
}, {
    "name": "The Phantom (feat. High Maintenance)",
    "uri": "spotify:track:6qQPfms2b3kDN1OFLvojoy"
}, {
    "name": "Rainbow Road",
    "uri": "spotify:track:1fb58RF764rR8PvuDKMsNi"
}, {
    "name": "New Game",
    "uri": "spotify:track:0yIVXWfIXn4TtMlT0qzA3h"
}, {
    "name": "Cheat Codes",
    "uri": "spotify:track:3DOZzpCGYmuJVkZqsRBHwk"
}, {
    "name": "Surge",
    "uri": "spotify:track:6BzAon1atwUfogF2K0p8vc"
}, {
    "name": "Sentinel",
    "uri": "spotify:track:3t1Z0ofIfZy43HRBrhpwef"
}, {
    "name": "Sugar Rush",
    "uri": "spotify:track:6HKYDQhGllwms0LKxsjg6z"
}, {
    "name": "Rat Twist",
    "uri": "spotify:track:3eUBCaLMh0jYVmeZAQnm46"
}, {
    "name": "Full Force",
    "uri": "spotify:track:2tY2EdWx0ofDN2h1nldpkz"
}, {
    "name": "Timeless (feat. Veela)",
    "uri": "spotify:track:0vyLLDC3tvww95Ok1mQ17i"
}, {
    "name": "Renzokuken",
    "uri": "spotify:track:32b22KxMKJiOsqhBdpRtaE"
}, {
    "name": "Canvas",
    "uri": "spotify:track:7GZRH1sughcgD0QkQ6qRIu"
}, {
    "name": "From the Dust",
    "uri": "spotify:track:4tqlt6UHxlR0Awk3nKC3kE"
}, {
    "name": "Night After Night",
    "uri": "spotify:track:4kdStZBn2PJHsZcYleMl8m"
}, {
    "name": "Too Late",
    "uri": "spotify:track:3Ygk3Go0MSTIYgMDLjkHRS"
}, {
    "name": "Do It",
    "uri": "spotify:track:1CGbcD01vbsKHu6ONnhjwn"
}, {
    "name": "Top of the World 2",
    "uri": "spotify:track:4aHjOErNgf7kOpNH4aC3Gy"
}, {
    "name": "Moving On (feat. EMEL)",
    "uri": "spotify:track:3W25CkC8ZPMNxUjzaq5odO"
}, {
    "name": "Alliance",
    "uri": "spotify:track:5gc8jj89nC1vuQ6ZhRRsSf"
}, {
    "name": "Automagic",
    "uri": "spotify:track:2r7G3QuzTU7wSjVRqKXl3A"
}, {
    "name": "Till It's Over",
    "uri": "spotify:track:4m5tzX2tLQhNGDkaaF7G9a"
}, {
    "name": "Frame of Mind",
    "uri": "spotify:track:7AUVhucKouRoBEbXyvd3Ro"
}, {
    "name": "Believe (feat. Connor Zwetsch)",
    "uri": "spotify:track:56MVvpk3w4FeCkN7IcnhbY"
}, {
    "name": "Breathe (feat. Danyka Nadeau)",
    "uri": "spotify:track:51O58Axxs6CFiJzf1uUflq"
}, {
    "name": "Universal",
    "uri": "spotify:track:2PqNhRA38FCjMjZVPwdQ2b"
}, {
    "name": "Moonlight (feat. Aloma Steele)",
    "uri": "spotify:track:4plEBM5RxBg3IevG0k289T"
}, {
    "name": "Mirai Sekai Pt.3 - Aeon Metropolis (Extended Mix)",
    "uri": "spotify:track:2OjKrXRL1KmYQTc9cslYyH"
}, {
    "name": "Heartbeat (feat. Collin McLoughlin)",
    "uri": "spotify:track:7eVZbb7YlUopOeuiyRcJ7Z"
}, {
    "name": "Rock 'N' Roll - Original Mix",
    "uri": "spotify:track:3ER2cLVJTGn1XCwb2EeZBB"
}, {
    "name": "Sophia - Original Mix",
    "uri": "spotify:track:5CLRTisAlDnBcex6Yyqruo"
}, {
    "name": "We Are the Dream",
    "uri": "spotify:track:6c2jnvuqCCbfBWR3Xm4SAA"
}, {
    "name": "Victory (feat. Evvy)",
    "uri": "spotify:track:3LWkVS9T9iIrpgKwZZKtNE"
}, {
    "name": "Nope (feat. ShayGray)",
    "uri": "spotify:track:6wVybG6R8tN8UC6rNTg3Rb"
}, {
    "name": "Decisions",
    "uri": "spotify:track:3fe6pdC4PQkhFOvuiHYxCt"
}, {
    "name": "Orbit (feat. Richard Caddock)",
    "uri": "spotify:track:3BkLpheTPPxLrAvi0dHId8"
}, {
    "name": "Alone",
    "uri": "spotify:track:6rkEKsiKLdi7ex5Ak3dKRP"
}, {
    "name": "Dark Heart",
    "uri": "spotify:track:2ttpHDpP6I3TP8Ng5BBv6D"
}, {
    "name": "Safe",
    "uri": "spotify:track:6Fkm8xBwA6U6jzlz34iuIu"
}, {
    "name": "Monsters",
    "uri": "spotify:track:5qumYJzC7cIUxbYZTZk3ku"
}, {
    "name": "Wave",
    "uri": "spotify:track:4CaMIwVMzmvQ4Q5yxRwCMX"
}, {
    "name": "Fireball",
    "uri": "spotify:track:5F5RLFd53KaFaqFOlhBoZN"
}, {
    "name": "Can't Ruin My Fun",
    "uri": "spotify:track:6PKVQLV40S6PV3FaZUWq7E"
}, {
    "name": "Thank You",
    "uri": "spotify:track:3LnQ6Urv8nPJsQ8Tim9zGc"
}, {
    "name": "Feel The Volume",
    "uri": "spotify:track:6RyXxSHs7VZSgQH4hjrg7L"
}, {
    "name": "Tip Toe Wing In My Jawwwdinz",
    "uri": "spotify:track:72umswj0Jlu9EVT5uoL2hl"
}, {
    "name": "Bap U",
    "uri": "spotify:track:0qaGri80rAPOcbJi4OyLQZ"
}, {
    "name": "CA$HVILLE",
    "uri": "spotify:track:1zAUjFLoWfr3iWAkDZoBjq"
}, {
    "name": "Mobbin",
    "uri": "spotify:track:7yjyQt8AhQO5EyIRQUA0nf"
}, {
    "name": "Drip",
    "uri": "spotify:track:6O7gRQ19LSdtTKYOhXstXu"
}, {
    "name": "Thanks For Playing",
    "uri": "spotify:track:4tpZVk6DtGWALD4h76Ihpp"
}, {
    "name": "Sunshine EP",
    "uri": "spotify:track:6onWUHuOUd4ydyF2UyTiXS"
}, {
    "name": "That's Right",
    "uri": "spotify:track:0gMcfwK2ySuLLdBxvxPrqj"
}, {
    "name": "Rock Steady - Original Mix",
    "uri": "spotify:track:0OgNxxC6vB1S0gK4mGnqjX"
}];