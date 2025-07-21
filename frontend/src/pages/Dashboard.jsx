import React, { useState, useEffect } from "react";
import axios from "axios";
import ModelViewer from "../components/ModelViewer";
import UploadForm from "../components/UploadForm";
import { FiEye, FiTrash2, FiDownload } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/models`);
      setModels(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Failed to load models. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this model?")) return;
    try {
      await axios.delete(`${API_BASE}/models/${id}`);
      setModels((prevModels) => prevModels.filter((model) => model._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete model. Please try again.");
    }
  };

  const handleView = (modelUrl) => {
    if (modelUrl) {
      window.open(modelUrl, "_blank");
    }
  };

  const handleDownload = (modelUrl, filename) => {
    if (modelUrl) {
      const link = document.createElement("a");
      link.href = modelUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <UploadForm onUploadSuccess={fetchModels} />

      <h1 className="text-3xl font-bold text-gray-800 text-center mt-8 mb-6">
        3D Model Dashboard
      </h1>

      {error && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-center text-gray-600 text-lg mt-2">Loading models...</p>
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No models uploaded yet.</p>
          <p className="text-gray-400 text-sm mt-2">Upload your first 3D model to get started!</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {models.map((model) => {
               const modelUrl = model.url;
              return (
                <div
                  key={model._id}
                  className="bg-white shadow-lg rounded-2xl p-4 flex flex-col hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-full h-64 bg-gray-50 rounded-xl overflow-hidden">
                    <ModelViewer modelUrl={modelUrl} />
                  </div>

                  <div className="mt-4 flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                       {model.title || model.filename || "3D Model"}
                    </h2>
                    <p className="text-xs text-gray-500">Format: .glb</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {model.views || 0} views
                    </p>
                  </div>

                  <div className="mt-2 text-sm text-gray-400">
                    {model.createdAt
                      ? new Date(model.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </div>

                  <div className="mt-3 flex justify-between items-center gap-2">
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                        onClick={() => handleView(modelUrl)}
                        title="View model"
                      >
                        <FiEye size={14} /> View
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-700 text-white text-sm p-2 rounded-lg transition-colors"
                        onClick={() => handleDownload(modelUrl, model.filename)}
                        title="Download model"
                      >
                        <FiDownload size={14} />
                      </button>
                    </div>

                    <button
                      className="bg-red-500 hover:bg-red-600 text-white text-sm p-2 rounded-lg transition-colors"
                      onClick={() => handleDelete(model._id)}
                      title="Delete model"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
