





















const mongoose = require('mongoose')

// schema for book
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: Number,
  },
  author: {
    type: String,
    ref: 'Author'
  },
  genres: [
    { type: String}
  ]
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('Book', schema)









