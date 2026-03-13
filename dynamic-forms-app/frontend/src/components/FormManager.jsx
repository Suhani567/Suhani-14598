import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const FormManager = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await axios.get('/api/forms');
      setForms(res.data);
    } catch (err) {
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this form?')) {
      try {
        await axios.delete(`/api/forms/${id}`);
        toast.success('Form deleted');
        fetchForms();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await axios.post(`/api/forms/${id}/duplicate`);
      toast.success('Form duplicated');
      fetchForms();
    } catch (err) {
      toast.error('Duplicate failed');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Forms</h1>
          <Link to="/admin/forms/new" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all">+ New Form</Link>
            <Link to="/admin/forms" className="px-8 py-4 bg-gray-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all ml-4">List Forms</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map(form => (
            <div key={form._id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all group">
              <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{form.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{form.description || 'No description'}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{form.fields.length} fields</span>
                {form.isActive ? <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span> : <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Draft</span>}
              </div>
              <div className="flex gap-2">
<Link to={`/admin/forms/${form._id}/edit`} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl text-center font-medium hover:bg-blue-700 transition mr-1">Edit</Link>
                <Link to={`/forms/${form._id}`} target="_blank" className="bg-green-600 text-white py-2 px-4 rounded-xl text-center font-medium hover:bg-green-700 transition">🔗 Fill Form</Link>
                <button onClick={() => handleDuplicate(form._id)} className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition">Duplicate</button>
                <button onClick={() => handleDelete(form._id)} className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">Delete</button>
              </div>
            </div>
          ))}
          {forms.length === 0 && (
            <div className="col-span-full text-center py-24">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-gray-600 mb-2">No forms yet</h2>
              <Link to="/admin/forms/new" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl">Create your first form</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormManager;
