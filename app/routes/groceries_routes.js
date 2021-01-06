const express = require('express')
// jsonwebtoken docs: https://github.com/auth0/node-jsonwebtoken
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')

// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10

// pull in error types and the logic to handle them and set status codes
const errors = require('../../lib/custom_errors')

const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError

const Groceries = require('../models/groceries')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// create list
// POST /groceries
router.post('/groceries', requireToken, (req, res, next) => {
  req.body.groceries.owner = req.user.id
  const groceriesData = req.body.groceries
  // start a promise chain, so that any errors will pass to `handle`
  Promise.resolve(groceriesData)
    // reject any requests where `credentials.password` is not present, or where
    // the password is an empty string
    .then(credentials => {
      if (!credentials ||
          !credentials.password ||
          credentials.password !== credentials.password_confirmation) {
        throw new BadParamsError()
      }
    })
    // generate a hash from the provided password, returning a promise
    .then(() => bcrypt.hash(req.body.credentials.password, bcryptSaltRounds))
    .then(hash => {
      // return necessary params to create a user
      return {
        email: req.body.credentials.email,
        hashedPassword: hash
      }
    })
    // send the new user object back with status 201, but `hashedPassword`
    // won't be send because of the `transform` in the User model
    .then(groceries => res.status(201).json({ groceries: groceries.toObject() }))
    // pass any errors along to the error handler
    .catch(next)
})

// SHOW
// GET /groceries/:id
router.post('/groceries/:id', (req, res, next) => {
  const pw = req.body.credentials.password
  let groceries

  // find a user based on the email that was passed
  Groceries.findOne({ email: req.body.credentials.email })
    .then(record => {
      // if we didn't find a user with that email, send 401
      if (!record) {
        throw new BadCredentialsError()
      }
      // save the found user outside the promise chain
      groceries = record
      // `bcrypt.compare` will return true if the result of hashing `pw`
      // is exactly equal to the hashed password stored in the DB
      return bcrypt.compare(pw, groceries.hashedPassword)
    })
    .then(correctPassword => {
      // if the passwords matched
      if (correctPassword) {
        // the token will be a 16 byte random hex string
        const token = crypto.randomBytes(16).toString('hex')
        user.token = token
        // save the token to the DB as a property on user
        return user.save()
      } else {
        // throw an error to trigger the error handler and end the promise chain
        // this will send back 401 and a message about sending wrong parameters
        throw new BadCredentialsError()
      }
    })
    .then(user => {
      // return status 201, the email, and the new token
      res.status(201).json({ user: user.toObject() })
    })
    .catch(next)
})

// CHANGE password
// PATCH /change-password
router.patch('/groceries/:id', requireToken, (req, res, next) => {
  let groceries
  // `req.user` will be determined by decoding the token payload
  Groceries.findById(req.groceries.id)
    // save user outside the promise chain
    .then(record => { groceries = record })
    // check that the old password is correct
    .then(() => bcrypt.compare(req.groceries._id, groceries.hashedPassword))
    // `correctPassword` will be true if hashing the old password ends up the
    // same as `user.hashedPassword`
    .then(correctPassword => {
      // throw an error if the new password is missing, an empty string,
      // or the old password was wrong
      if (!req.body.passwords.new || !correctPassword) {
        throw new BadParamsError()
      }
    })
    // hash the new password
    .then(() => bcrypt.hash(req.body.passwords.new, bcryptSaltRounds))
    .then(hash => {
      // set and save the new hashed password in the DB
      groceries.hashedPassword = hash
      return groceries.save()
    })
    // respond with no content and status 200
    .then(() => res.sendStatus(204))
    // pass any errors along to the error handler
    .catch(next)
})

router.delete('/sign-out', requireToken, (req, res, next) => {
  // create a new random token for the user, invalidating the current one
  req.user.token = null
  // save the token and respond with 204
  req.user.save()
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
