const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true, 
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
   isActive: {
        type: Boolean,
        default: true,
        required: false
    },
  order: {
    type: Number,
    default: 0,  
  },
}, { timestamps: true });

module.exports = mongoose.model('Header', headerSchema);
