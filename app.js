require('dotenv').config();

const { response } = require('express');
const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

//Client ID edcd5d7857c74812a5eaeed5cacfddc4
//Client Secret 34e18b848ff84c5885722d98779f1068

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get('/', (request, response) => {
  response.render('home');
});

//app.get('/search', (request, response ) => {
//  const searchQuery = request.query.q;
//  response.render('artist-search', {
//    searchQuery: searchQuery
//  });
//});

app.get('/search', (request, response) => {
  const searchQuery = request.query.q;
  spotifyApi
    .searchArtists(searchQuery)
    .then((data) => {
      console.log(data.body);
      const artistItems = data.body.artists.items;
      console.log(items);
      response.render('artists-result', {
        records: artistItems
       });
      
    })
    .catch((error) => {
      response.render('error');
    })
  
});


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
