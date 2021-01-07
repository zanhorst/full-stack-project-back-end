const mongoose = require('mongoose')
// const itemSchema = require('./items.js')
const groceriesSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Groceries', groceriesSchema)
