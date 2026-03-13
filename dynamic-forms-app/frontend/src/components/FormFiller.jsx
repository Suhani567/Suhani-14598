import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const FormFiller = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const res = await axios.get(`/api/forms/${id}`);
      setForm(res.data);
    } catch (err) {
      toast.error('Form not found');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setResponses({ ...responses, [fieldName]: value });
  };

  const handleCheckboxChange = (fieldName, option) => {
    const current = responses[fieldName] || [];
    const newValue = current.includes(option)
      ? current.filter(v => v !== option)
      : [...current, option];
    setResponses({ ...responses, [fieldName]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/submissions', { formId: id, responses });
      toast.success('Form submitted successfully!');
      setResponses({});
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading form...</div>;
  if (!form) return <div className="min-h-screen flex items-center justify-center">Form not found</div>;

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: form.theme.backgroundColor,
        fontFamily: form.theme.fontFamily
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div 
          className="bg-white shadow-2xl rounded-3xl p-12"
          style={{ '--primary-color': form.theme.primaryColor }}
        >
          <h1 
            className="text-4xl font-bold mb-6 text-gray-800"
            style={{ color: form.theme.primaryColor }}
          >
            {form.title}
          </h1>
          {form.description && (
            <p className="text-xl text-gray-600 mb-12">{form.description}</p>
          )}

          <form onSubmit={handleSubmit} className={`space-y-6 ${form.layout.direction === 'row' ? `grid grid-cols-${form.layout.columns} gap-6` : ''}`}>
            {form.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'textarea' && (
                  <textarea
                    value={responses[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    rows="4"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 resize-vertical transition"
                    required={field.required}
                    style={field.style}
                  />
                )}
                
                {field.type === 'dropdown' && (
                  <select
                    value={responses[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                    required={field.required}
                    style={field.style}
                  >
                    <option value="">Select an option...</option>
                    {field.options.map((option, i) => (
                      <option key={i} value={option}>{option}</option>
                    ))}
                  </select>
                )}
                
                {field.type === 'radio' && (
                  <div className="space-y-2 p-4 border border-gray-200 rounded-xl bg-gray-50">
                    {field.options.map((option, i) => (
                      <label key={i} className="flex items-center p-3 hover:bg-white rounded-lg cursor-pointer transition">
                        <input
                          type="radio"
                          name={field.name}
                          value={option}
                          checked={responses[field.name] === option}
                          onChange={() => handleInputChange(field.name, option)}
                          className="mr-3 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          required={field.required}
                        />
                        <span className="font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {field.type === 'checkbox' && (
                  <div className="space-y-2 p-4 border border-gray-200 rounded-xl bg-gray-50">
                    {field.options.map((option, i) => (
                      <label key={i} className="flex items-center p-3 hover:bg-white rounded-lg cursor-pointer transition">
                        <input
                          type="checkbox"
                          value={option}
                          checked={(responses[field.name] || []).includes(option)}
                          onChange={() => handleCheckboxChange(field.name, option)}
                          className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {['text', 'email', 'number'].includes(field.type) && (
                  <input
                    type={field.type}
                    value={responses[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                    required={field.required}
                    style={field.style}
                  />
                )}
              </div>
            ))}
            
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-8 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all duration-200"
              style={{ backgroundColor: form.theme.primaryColor }}
            >
              {submitting ? 'Submitting...' : `Submit ${form.title}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormFiller;
