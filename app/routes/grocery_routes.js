const express = require('express')
// instantiate a router (mini app that only handles routes)
const router = express.Router()
// require grocery model
const Grocery = require('../models/grocery')
// pull in error types and the logic to handle them and set status codes
const handle404 = require('../../lib/custom_errors')
const passport = require('passport')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })
// INDEX
// GET /grocery/
router.get('/groceries', requireToken, (req, res, next) => {
  Grocery.find({ owner: req.user._id })
    .then(grocery => res.json({
      grocery: grocery
    }))
    .catch(next)
})
// SHOW
// GET /grocery/:id
router.get('/groceries/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Grocery.findById(id)
    .populate('owner', '-hashedPassword')
    .then(handle404)
    .then(grocery => res.json({
      grocery: grocery
    }))
    .catch(next)
})
// CREATE
// POST /grocery/
router.post('/groceries', requireToken, (req, res, next) => {
  const groceryData = req.body.grocery
  groceryData.owner = req.user.id
  Grocery.create(groceryData)
    .then(grocery => res.status(201).json({ grocery: grocery.toObject() }))
    .catch(next)
})
// PATCH
// PATCH /grocery/:id
router.patch('/groceries/:id', requireToken, (req, res, next) => {
  const groceryData = req.body.grocery
  const id = req.params.id
  Grocery.findById(id)
    .then(handle404)
    .then(grocery => grocery.updateOne(groceryData))
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DELETE
// DELETE /grocery/:id
router.delete('/groceries/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Grocery.findById(id)
    .then(handle404)
    .then(grocery => grocery.deleteOne())
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
