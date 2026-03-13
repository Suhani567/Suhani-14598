const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'dropdown', 'checkbox', 'radio', 'textarea', 'email', 'number'], required: true },
  label: { type: String, required: true },
  name: { type: String, required: true }, // unique key for response
  options: [{ type: String }], // for dropdown/radio/checkbox
  required: { type: Boolean, default: false },
  style: {
    width: String,
    color: String,
    fontSize: String
  }
}, { _id: false });

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fields: [fieldSchema],
  layout: {
    direction: { type: String, enum: ['row', 'column'], default: 'column' },
    columns: { type: Number, default: 1 }
  },
  theme: {
    primaryColor: { type: String, default: '#007bff' },
    fontFamily: { type: String, default: 'Arial' },
    backgroundColor: { type: String, default: '#ffffff' }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);
