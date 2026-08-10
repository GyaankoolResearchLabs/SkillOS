import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFolderOpen,
} from "react-icons/fa";

import api from "../../services/api";
import AIGenerationScreen from "../../components/ui/AIGenerationScreen";

function UploadSOP() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFile = (file) => {
    if (!file) return;

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const generateCourse = async () => {
    if (!selectedFile) {
      alert("Please select a PDF first.");
      return;
    }

    try {
      setLoading(true);

      // Initial Stage
      setCurrentStage(0);

      // Temporary stage updates
      setTimeout(() => setCurrentStage(1), 800);
      setTimeout(() => setCurrentStage(2), 1800);
      setTimeout(() => setCurrentStage(3), 3000);
      setTimeout(() => setCurrentStage(4), 5000);
      setTimeout(() => setCurrentStage(5), 7500);
      setTimeout(() => setCurrentStage(6), 9500);

      const formData = new FormData();
      formData.append("pdf", selectedFile);

      const res = await api.post("/sops", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setCurrentStage(6);

      navigate(`/manager/course/${res.data.course._id}`);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to generate course."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <AIGenerationScreen
          currentStage={currentStage}
        />
      )}

      <div>

        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            Upload Standard Operating Procedure
          </h1>

          <p className="text-gray-500 mt-2">
            Upload an SOP to automatically generate a structured AI learning course.
          </p>

        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all ${
            dragging
              ? "border-[#18D39A] bg-green-50"
              : "border-gray-300 bg-white"
          }`}
        >

          <FaCloudUploadAlt className="mx-auto text-7xl text-[#18D39A]" />

          <h2 className="text-2xl font-bold mt-6">
            Drag & Drop your SOP here
          </h2>

          <p className="text-gray-500 mt-3">
            or
          </p>

          <button
            type="button"
            onClick={handleBrowse}
            className="mt-6 bg-[#18D39A] hover:bg-[#14b67c] text-white px-8 py-3 rounded-xl flex items-center gap-3 mx-auto"
          >
            <FaFolderOpen />
            Browse Files
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <p className="mt-8 text-sm text-gray-500">
            Supported Formats
          </p>

          <p className="font-semibold mt-2">
            PDF • DOCX • DOC • TXT
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Maximum File Size: 20 MB
          </p>

        </div>

        {selectedFile && (

          <div className="mt-8 bg-white rounded-2xl shadow p-6 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <FaFilePdf className="text-red-500 text-3xl" />

              <div>

                <h3 className="font-bold">
                  {selectedFile.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

            </div>

            <button
              onClick={generateCourse}
              disabled={loading}
              className="bg-[#18D39A] hover:bg-[#14b67c] text-white px-6 py-3 rounded-xl disabled:opacity-50"
            >
              {loading
                ? "Generating..."
                : "Generate AI Course"}
            </button>

          </div>

        )}

      </div>
    </>
  );
}

export default UploadSOP;