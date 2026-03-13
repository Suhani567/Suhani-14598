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

// @route   GET api/forms/public
// @desc    Get active forms (public list)
router.get('/public', async (_req, res) => {
  try {
    const forms = await Form.find({ isActive: true })
      .select('_id title description createdAt')
      .sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/forms/admin/:id
// @desc    Get single form (admin owner)
router.get('/admin/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, createdBy: req.admin.id });
    if (!form) return res.status(404).json({ msg: 'Form not found' });
    res.json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/forms
// @desc    Create form (admin)
router.post('/', auth, async (req, res) => {
  const { title, description, fields, layout, theme, isActive } = req.body;
  try {
    if (!title || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ msg: 'Title and at least one field are required' });
    }

    const form = new Form({
      title,
      description,
      fields,
      layout,
      theme,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdBy: req.admin.id
    });
    await form.save();
    res.json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/forms/:id
// @desc    Update form (admin)
router.put('/:id', auth, async (req, res) => {
  const { title, description, fields, layout, theme, isActive } = req.body;
  try {
    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.admin.id },
      { $set: { title, description, fields, layout, theme, isActive: Boolean(isActive) } },
      { new: true }
    );
    if (!form) return res.status(404).json({ msg: 'Form not found' });
    res.json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE api/forms/:id
// @desc    Delete form (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, createdBy: req.admin.id });
    if (!form) return res.status(404).json({ msg: 'Form not found' });

    await form.deleteOne();
    res.json({ msg: 'Form deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
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
    const form = await Form.findOne({ _id: req.params.id, createdBy: req.admin.id });
    if (!form) return res.status(404).json({ msg: 'Form not found' });

    const newForm = new Form({
      ...form.toObject(),
      _id: undefined,
      title: form.title + ' (Copy)',
      createdBy: req.admin.id
    });
    await newForm.save();
    res.json(newForm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
