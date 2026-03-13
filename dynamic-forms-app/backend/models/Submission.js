const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },
  responses: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  }, // { fieldName: value }
  submittedBy: String, // optional user info
  ipAddress: String // optional
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
