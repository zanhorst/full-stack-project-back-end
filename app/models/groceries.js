const mongoose = require('mongoose')
// const itemSchema = require('./items.js')
const grocerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // items: {itemSchema},
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  token: String
}, {
  timestamps: true
})

module.exports = mongoose.model('Grocery', grocerySchema)
