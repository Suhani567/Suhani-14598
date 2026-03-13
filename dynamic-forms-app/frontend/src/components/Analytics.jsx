import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const Analytics = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalForms: 0,
    totalSubmissions: 0,
    formsData: [],
    submissionsData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const formsRes = await axios.get('/api/forms');
      const submissionsRes = await axios.get('/api/submissions'); // Aggregate endpoint if exists

      const forms = formsRes.data;
      const submissions = submissionsRes.data.flatMap(s => s); // Flatten if nested

      const formsData = forms.map(f => ({
        name: f.title.substring(0, 20),
        submissions: submissions.filter(s => s.formId === f._id).length,
        fields: f.fields.length
      }));

      const submissionsData = submissions.reduce((acc, s) => {
        const date = new Date(s.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalForms: forms.length,
        totalSubmissions: submissions.length,
        formsData,
        submissionsData: Object.entries(submissionsData).map(([date, count]) => ({ date, count: Number(count) }))
      });
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) return <div className="p-8 text-center">Loading analytics...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            📊
            Analytics Dashboard
          </h1>
          <div className="text-3xl font-bold text-gray-700">
            {stats.totalSubmissions} Submissions | {stats.totalForms} Forms
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Forms by submissions */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Top Forms by Responses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.formsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="submissions" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Submissions over time */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Submissions Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.submissionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">📈 Conversion Rate</h3>
            <div className="text-4xl font-bold">{Math.round((stats.totalSubmissions / stats.totalForms) || 0)}%</div>
            <p className="text-purple-100">Avg responses per form</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">⚡ Active Forms</h3>
            <div className="text-4xl font-bold">{stats.totalForms}</div>
            <p className="text-emerald-100">Total forms created</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">📊 Field Usage</h3>
            <div className="text-4xl font-bold">{stats.formsData.reduce((sum, f) => sum + f.fields, 0)}</div>
            <p className="text-orange-100">Total fields</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
