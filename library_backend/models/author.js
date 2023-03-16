const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
  bookCount: {
    type: Number,
    required: true,
    minlength: 0
  }
})
schema.set('toObject', {
    transform: (doc, ret, options) => {
        ret.id = doc._id.toString()
        delete ret._id
    }
})
module.exports = mongoose.model('Author', schema)