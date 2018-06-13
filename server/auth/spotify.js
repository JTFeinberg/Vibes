const passport = require('passport')
const router = require('express').Router()
const SpotifyStrategy = require('passport-spotify').Strategy;
const {User} = require('../db/models')
module.exports = router

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.log('Spotify client ID / secret not found. Skipping Spotify OAuth.')
  } else {
    const spotifyConfig = {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_CALLBACK
    }

passport.use(new SpotifyStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "http://localhost:8888/auth/spotify/callback"
  },
  function(accessToken, refreshToken, expires_in, profile, done) {
    User.findOrCreate({ spotifyId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));