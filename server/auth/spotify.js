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
        const imgUrl = profile.photos[0]

        User.find({where: {spotifyId}})
        .then(
            foundUser =>
            foundUser
                ? done(null, foundUser)
                : User.create({name, email, spotifyId, imgUrl}).then(createdUser =>
                    done(null, createdUser)
                )
        )
        .catch(done)
    }
)

passport.use(strategy)

router.get('/', passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'user-read-playback-state'] }),);

router.get('/callback', passport.authenticate('spotify'), (req,res) => {
    let {error, code} = req.query
    if(code){
        console.log('USER>>>',req.user)
        User.findById(req.user.id)
        .then(user => user.update({accessToken: code}))
        .then(res.redirect('/home'))
    } else {
        res.redirect('/login');
    }
    }
  )

//   router.get('/callback', passport.authenticate('spotify', {
//     successRedirect: '/home',
//     failureRedirect: '/login'
//   })
//     )
}


