import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { arrayMove } from '@dnd-kit/sortable';

const DraggableField = ({ field, editField, deleteField, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg mb-4 hover:border-blue-400 group cursor-move">
      <div className="flex justify-between items-start mb-2">
        <span className="text-lg font-semibold text-gray-800">{field.label} ({field.type})</span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => editField(index)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">✏️</button>
          <button onClick={() => deleteField(index)} className="p-1 text-red-600 hover:bg-red-100 rounded">🗑️</button>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        Name: {field.name} | Required: {field.required ? 'Yes' : 'No'}
        {field.options && <div>Options: {field.options.join(', ')}</div>}
      </div>
    </div>
  );
};

const FieldPalette = ({ addField }) => {
  const fieldTypes = [
    { type: 'text', label: 'Text Field' },
    { type: 'email', label: 'Email' },
    { type: 'number', label: 'Number' },
    { type: 'textarea', label: 'Textarea' },
    { type: 'dropdown', label: 'Dropdown' },
    { type: 'radio', label: 'Radio Buttons' },
    { type: 'checkbox', label: 'Checkboxes' },
  ];

  return (
    <div className="w-64 bg-gray-100 p-6 rounded-xl">
      <h3 className="font-bold text-lg mb-4 text-gray-800">Field Palette</h3>
      {fieldTypes.map((ft, i) => (
        <button
          key={i}
          onClick={() => addField(ft)}
          className="w-full p-3 mb-2 bg-white border rounded-lg hover:border-blue-400 hover:shadow-md transition flex items-center"
        >
          📝 {ft.label}
        </button>
      ))}
    </div>
  );
};

const FieldEditor = ({ field, updateField, cancelEdit }) => {
  const [editData, setEditData] = useState(field);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateField(editData);
    cancelEdit();
  };

  const handleOptionsChange = (options) => {
    setEditData({ ...editData, options: options.split(',').map(o => o.trim()).filter(Boolean) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6">Edit Field</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Label</label>
            <input
              type="text"
              value={editData.label}
              onChange={(e) => setEditData({ ...editData, label: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Field Name (key)</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {['dropdown', 'radio', 'checkbox'].includes(editData.type) && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Options (comma separated)</label>
              <input
                type="text"
                placeholder="Option 1, Option 2, Option 3"
                value={editData.options ? editData.options.join(', ') : ''}
                onChange={(e) => handleOptionsChange(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div className="mb-6 flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editData.required}
                onChange={(e) => setEditData({ ...editData, required: e.target.checked })}
                className="mr-2"
              />
              Required
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Save
            </button>
            <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormBuilder = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: [],
    layout: { direction: 'column', columns: 1 },
    theme: { primaryColor: '#007bff', fontFamily: 'Arial', backgroundColor: '#ffffff' }
  });
  const [activeFieldIndex, setActiveFieldIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      fetchForm();
    }
  }, [id, isEdit]);

  const fetchForm = async () => {
    try {
      const res = await axios.get(`/api/forms/${id}`);
      setFormData(res.data);
    } catch (err) {
      toast.error('Form not found');
      navigate('/admin/forms');
    }
  };

  const addField = (fieldType) => {
    const newField = {
      id: Date.now().toString(),
      type: fieldType.type,
      label: fieldType.label,
      name: fieldType.label.toLowerCase().replace(/\s+/g, '-'),
      required: false,
      style: {}
    };
    setFormData({ ...formData, fields: [...formData.fields, newField] });
  };

  const deleteField = (index) => {
    setFormData({ ...formData, fields: formData.fields.filter((_, i) => i !== index) });
  };

  const updateField = (index, updatedField) => {
    const newFields = [...formData.fields];
    newFields[index] = { ...newFields[index], ...updatedField };
    setFormData({ ...formData, fields: newFields });
  };

  const editField = (index) => {
    setActiveFieldIndex(index);
  };

  const cancelEdit = () => {
    setActiveFieldIndex(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.fields.findIndex(f => f.id === active.id);
        const newIndex = prev.fields.findIndex(f => f.id === over.id);
        return {
          ...prev,
          fields: arrayMove(prev.fields, oldIndex, newIndex)
        };
      });
    }
  };

  const saveForm = async () => {
    setLoading(true);
    try {
      console.log('Saving form:', formData); // Debug
      const endpoint = isEdit ? `/api/forms/${id}` : '/api/forms';
      const method = isEdit ? axios.put : axios.post;
      const res = await method(endpoint, formData);
      console.log('Save response:', res.data);
      toast.success(isEdit ? 'Form updated!' : 'Form created!');
      navigate('/admin/forms');
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      toast.error(`Save failed: ${err.response?.data?.msg || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const Preview = () => (
    <div 
      className="p-8 rounded-2xl border-4 border-dashed border-gray-300 min-h-96"
      style={{
        backgroundColor: formData.theme.backgroundColor,
        fontFamily: formData.theme.fontFamily,
        color: formData.theme.primaryColor
      }}
    >
      <h2 style={{ color: formData.theme.primaryColor }} className="text-2xl font-bold mb-6">{formData.title}</h2>
      {formData.description && <p className="mb-6 text-gray-600">{formData.description}</p>}
      <div className={`space-y-4 ${formData.layout.direction === 'row' ? 'grid grid-cols-${formData.layout.columns}' : ''}`}>
        {formData.fields.map((field, index) => (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium">{field.label} {field.required && <span className="text-red-500">*</span>}</label>
            {field.type === 'textarea' && <textarea className="w-full p-3 border rounded-lg" rows="4" />}
            {field.type === 'dropdown' && (
              <select className="w-full p-3 border rounded-lg">
                <option>Select...</option>
                {field.options?.map((opt, i) => <option key={i}>{opt}</option>)}
              </select>
            )}
            {['radio', 'checkbox'].includes(field.type) && (
              <div className="space-y-2">
                {field.options?.map((opt, i) => (
                  <label key={i} className="flex items-center">
                    <input type={field.type} className="mr-2" />
                    {opt}
                  </label>
                ))}
              </div>
            )}
            {['text', 'email', 'number'].includes(field.type) && (
              <input type={field.type} className="w-full p-3 border rounded-lg" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {activeFieldIndex !== null && (
        <FieldEditor
          field={formData.fields[activeFieldIndex]}
          updateField={(updated) => updateField(activeFieldIndex, updated)}
          cancelEdit={cancelEdit}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {isEdit ? 'Edit Form' : 'Create New Form'}
            </h1>
            <p className="text-gray-600 mt-2">Build your no-code form with drag & drop</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={saveForm}
              disabled={loading || formData.fields.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Form' : 'Create Form')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Palette */}
          <FieldPalette addField={addField} />
          
          {/* Builder Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border">
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Form Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="flex-1 p-4 text-2xl font-bold border-2 border-dashed border-gray-300 rounded-xl focus:border-blue-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-xl focus:border-blue-400 outline-none"
                />
              </div>
              
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={formData.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                  <div className="min-h-96">
                    {formData.fields.map((field, index) => (
                      <DraggableField
                        key={field.id}
                        field={field}
                        index={index}
                        editField={editField}
                        deleteField={deleteField}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
          
          {/* Preview */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-800">Live Preview</h3>
            <Preview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
