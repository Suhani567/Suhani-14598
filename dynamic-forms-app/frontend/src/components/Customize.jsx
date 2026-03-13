import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Customize = () => {
  const { token } = useAuth();
  const [customizations, setCustomizations] = useState({
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    fontFamily: 'Arial',
    logo: '',
    customCSS: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage or API
      localStorage.setItem('appCustomizations', JSON.stringify(customizations));
      toast.success('Customizations saved!');
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (colorType, color) => {
    setCustomizations(prev => ({ ...prev, [colorType]: color }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            ⚙️ Customize App
          </h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Customizations'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colors */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">🎨 Colors</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <input
                  type="color"
                  value={customizations.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-32 h-12 rounded-xl shadow-lg cursor-pointer border-4 border-gray-200 hover:border-gray-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Secondary Color</label>
                <input
                  type="color"
                  value={customizations.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-32 h-12 rounded-xl shadow-lg cursor-pointer border-4 border-gray-200 hover:border-gray-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Typography & Logo */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">📝 Typography & Logo</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Font Family</label>
                <select
                  value={customizations.fontFamily}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option>Arial</option>
                  <option>Helvetica</option>
                  <option>'Times New Roman'</option>
                  <option>'Courier New'</option>
                  <option>Georgia</option>
                  <option>Verdana</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Logo URL</label>
                <input
                  type="url"
                  value={customizations.logo}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="https://your-logo.com/image.png"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl shadow-xl p-8 border-2 border-dashed border-gray-300">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">👀 Live Preview</h3>
            <div 
              className="p-12 rounded-2xl shadow-2xl min-h-64 flex items-center justify-center font-[var(--font-family)]"
              style={{
                '--primary-color': customizations.primaryColor,
                '--secondary-color': customizations.secondaryColor,
                fontFamily: customizations.fontFamily
              }}
            >
              <div className="text-center">
                {customizations.logo && (
                  <img src={customizations.logo} alt="Logo" className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg" />
                )}
                <h2 className="text-3xl font-bold mb-4" style={{ color: customizations.primaryColor }}>
                  Your Custom App
                </h2>
                <p className="text-xl" style={{ color: customizations.secondaryColor }}>
                  Primary: {customizations.primaryColor} | Font: {customizations.fontFamily}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-white rounded-3xl shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">✨ Custom CSS</h3>
          <textarea
            value={customizations.customCSS}
            onChange={(e) => setCustomizations(prev => ({ ...prev, customCSS: e.target.value }))}
            placeholder="/* Add custom CSS */\n.form-field { border-radius: 20px; }\n.btn-custom { background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)); }"
            rows="8"
            className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Customize;
