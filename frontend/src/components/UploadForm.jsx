import React, { useState, useEffect } from "react";
import axios from "axios";
import.meta.env.VITE_API_BASE_URL


const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (file) => {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => handleFileChange(e.target.files[0]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const ext = droppedFile.name.toLowerCase().split(".").pop();
      if (["glb", "gltf"].includes(ext)) handleFileChange(droppedFile);
      else alert("Only .glb or .gltf files are allowed.");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("No file selected.");
    if (file.size > 50 * 1024 * 1024) return alert("Max file size is 50MB.");

    const ext = file.name.toLowerCase().split(".").pop();
    if (!["glb", "gltf"].includes(ext)) return alert("Invalid file type.");

    const formData = new FormData();
    formData.append("model", file);

    try {
      setLoading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/upload`,

        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: ({ loaded, total }) =>
            setUploadProgress(Math.round((loaded * 100) / total)),
        }
      );

      alert("Upload successful!");
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      if (onUploadSuccess) onUploadSuccess(response.data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Upload failed.";
      alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    () => () => previewUrl && URL.revokeObjectURL(previewUrl),
    [previewUrl]
  );

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleUpload}
        className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <h2 className="text-3xl font-bold text-center  bg-clip-text bg-gradient-to-r text-blue-600 mb-6">
          Upload 3D Model
        </h2>

        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? "border-blue-500 bg-blue-50/50 scale-105"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/50"
          }`}
        >
          {!file ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16  bg-blue-500  rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-700">
                Drop your 3D model here
              </p>
              <p className="text-sm text-gray-500">or click to browse</p>
              <p className="text-xs text-gray-400">
                Supports .GLB and .GLTF up to 50MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-green-700">
                File Selected
              </p>
              <p className="text-sm text-gray-600">{file.name}</p>
            </div>
          )}
          <input
            type="file"
            accept=".glb,.gltf"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {file && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 text-sm grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">File:</span>
              <p className="text-gray-600 truncate">{file.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Size:</span>
              <p className="text-gray-600">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Type:</span>
              <p className="text-gray-600">
                {file.name.split(".").pop().toUpperCase()}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <p className="text-green-600 font-medium">Ready to upload</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2   bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {file && !loading && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
              }}
              className="flex-1 py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !file}
            className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all ${
              loading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : " bg-purple-500 hover:bg-purple-700 text-white shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </div>
            ) : (
              "Upload Model"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
