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

const strategy = new SpotifyStrategy(
    spotifyConfig,
    (token, refreshToken, profile, done) => {
        const spotifyId = profile.id
        const name = profile.displayName
        const email = profile.emails[0].value

        User.find({where: {spotifyId}})
        .then(
            foundUser =>
            foundUser
                ? done(null, foundUser)
                : User.create({name, email, spotifyId}).then(createdUser =>
                    done(null, createdUser)
                )
        )
        .catch(done)
    }
)

passport.use(strategy)

router.get('/', passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'] }),);

router.get(
    '/callback',
    passport.authenticate('spotify', {
      successRedirect: '/home',
      failureRedirect: '/login'
    })
  )
}