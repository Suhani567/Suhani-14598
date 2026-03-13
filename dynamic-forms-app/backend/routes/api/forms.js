const express = require('express');
const Form = require('../../models/Form');
const auth = require('../../middleware/auth');
const router = express.Router();

// @route   GET api/forms
// @desc    Get all forms (admin)
router.get('/', auth, async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.admin.id }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/forms
// @desc    Create form (admin)
router.post('/', auth, async (req, res) => {
  const { title, description, fields, layout, theme } = req.body;
  try {
    const form = new Form({
      title,
      description,
      fields,
      layout,
      theme,
      createdBy: req.admin.id
    });
    await form.save();
    res.json(form);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   PUT api/forms/:id
// @desc    Update form (admin)
router.put('/:id', auth, async (req, res) => {
  const { title, description, fields, layout, theme } = req.body;
  try {
    let form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ msg: 'Form not found' });
    if (form.createdBy.toString() !== req.admin.id) return res.status(401).json({ msg: 'Not authorized' });

    form = await Form.findByIdAndUpdate(req.params.id, { $set: { title, description, fields, layout, theme } }, { new: true });
    res.json(form);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/forms/:id
// @desc    Delete form (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    let form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ msg: 'Form not found' });
    if (form.createdBy.toString() !== req.admin.id) return res.status(401).json({ msg: 'Not authorized' });

    await form.remove();
    res.json({ msg: 'Form deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   GET api/forms/:id
// @desc    Get single form (public)
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form || !form.isActive) return res.status(404).json({ msg: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   POST api/forms/:id/duplicate
// @desc    Duplicate form (admin)
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form || form.createdBy.toString() !== req.admin.id) return res.status(401).json({ msg: 'Not authorized' });

    const newForm = new Form({
      ...form.toObject(),
      _id: undefined,
      title: form.title + ' (Copy)',
      createdBy: req.admin.id
    });
    await newForm.save();
    res.json(newForm);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
