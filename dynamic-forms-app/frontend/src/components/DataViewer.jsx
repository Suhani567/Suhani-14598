import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const DataViewer = () => {
  const { formId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    fetchData();
  }, [formId]);

  const fetchData = async () => {
    try {
      const [subsRes, formRes] = await Promise.all([
        axios.get(`/api/submissions/${formId}`),
        axios.get(`/api/forms/${formId}`)
      ]);
      setSubmissions(subsRes.data);
      setFormFields(formRes.data.fields || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const res = await axios.get(`/api/submissions/${formId}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `form-${formId}-submissions.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV exported');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center p-8">Loading submissions...</div>;

  // Simple chart data example
  const chartData = formFields.slice(0, 3).map(field => ({
    name: field.label,
    submissions: submissions.filter(s => s.responses[field.name]).length
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            📊
            Submissions ({submissions.length})
          </h1>
          <button
            onClick={exportCSV}
            className="px-8 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
            disabled={submissions.length === 0}
          >
            📥 Export CSV
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6 text-gray-300">📭</div>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No submissions yet</h2>
            <p className="text-gray-500 mb-8">Share your form link to start collecting responses</p>
          </div>
        ) : (
          <>
            {/* Chart */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Response Summary</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submissions" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-8 py-6 text-left text-lg font-bold text-gray-800">Date</th>
                      {formFields.map(field => (
                        <th key={field.name} className="px-6 py-6 text-left font-bold text-gray-700">
                          {field.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.slice(0, 50).map((submission, index) => (
                      <tr key={submission._id || index} className="border-t hover:bg-gray-50 transition">
                        <td className="px-8 py-6 font-medium text-gray-900">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </td>
                        {formFields.map(field => (
                          <td key={field.name} className="px-6 py-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {Array.isArray(submission.responses[field.name]) 
                                ? submission.responses[field.name].join(', ') 
                                : submission.responses[field.name] || '—'
                              }
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                    {submissions.length > 50 && (
                      <tr>
                        <td colSpan={formFields.length + 1} className="px-8 py-6 text-center text-gray-500">
                          Showing first 50 of {submissions.length} submissions
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataViewer;
