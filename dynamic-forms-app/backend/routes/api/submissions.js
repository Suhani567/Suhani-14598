const express = require('express');
const Submission = require('../../models/Submission');
const auth = require('../../middleware/auth');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const router = express.Router();

// @route   POST api/submissions
// @desc    Submit form responses (public)
router.post('/', async (req, res) => {
  const { formId, responses } = req.body;
  try {
    const submission = new Submission({
      formId,
      responses
    });
    await submission.save();
    res.json({ msg: 'Submission saved', id: submission._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/submissions/:formId
// @desc    Get submissions for form (admin)
router.get('/:formId', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ formId: req.params.formId }).sort({ createdAt: -1 }).populate('formId');
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/submissions/:formId/export
// @desc    Export submissions CSV (admin)
router.get('/:formId/export', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ formId: req.params.formId });
    if (submissions.length === 0) return res.status(404).json({ msg: 'No submissions' });

    // Get form fields for headers
    const Form = require('../../models/Form');
    const form = await Form.findById(req.params.formId);
    const headers = form.fields.map(f => ({ id: f.name, title: f.label }));

    const csvWriter = createCsvWriter({
      path: 'submissions.csv',
      header: headers
    });

    const records = submissions.map(s => s.responses);
    await csvWriter.writeRecords(records);

    res.download('submissions.csv', `${req.params.formId}-submissions.csv`, () => {
      // Cleanup file if needed
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
