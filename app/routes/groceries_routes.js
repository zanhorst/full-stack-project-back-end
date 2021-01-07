const express = require('express')
// instantiate a router (mini app that only handles routes)
const router = express.Router()
// require groceries model
const Groceries = require('../models/groceries')
// pull in error types and the logic to handle them and set status codes
const handle404 = require('../../lib/custom_errors')
const passport = require('passport')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// INDEX
// GET /groceries/
router.get('/groceries', requireToken, (req, res, next) => {
  Groceries.find({ owner: req.user._id })
    .then(groceries => res.json({
      groceries: groceries
    }))
    .catch(next)
})
// SHOW
// GET /groceries/:id
router.get('/groceries/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Groceries.findById(id)
    .then(handle404)
    .populate('owner', '-hashedPassword')
    .then(groceries => res.json({
      groceries: groceries
    }))
    .catch(next)
})

// PATCH
// PATCH /groceries/:id
router.patch('/groceries/:id', requireToken, (req, res, next) => {
  const groceriesData = req.body.groceries
  const id = req.params.id
  Groceries.findById(id)
    .then(handle404)
    .then(groceries => groceries.updateOne(groceriesData))
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DELETE
// DELETE /groceries/:id
router.delete('/groceries/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Groceries.findById(id)
    .then(handle404)
    .then(groceries => groceries.deleteOne())
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
