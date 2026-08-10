import { useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaImage,
  FaTrash,
  FaSyncAlt,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

function LogoUploader({
  label = "Organization Logo",
  description = "Upload your organization's logo.",
  value = null,
  onChange,
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
  maxSizeMB = 5,
}) {
  const inputRef = useRef(null);

  const [preview, setPreview] = useState(value || null);
  const [error, setError] = useState("");

  const handleFile = (file) => {
    setError("");

    if (!file) return;

    const maxSize = maxSizeMB * 1024 * 1024;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSizeMB} MB.`);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      setPreview(result);

      if (onChange) {
        onChange(file, result);
      }
    };

    reader.onerror = () => {
      setError("Unable to read this file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    handleFile(file);

    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];

    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const removeFile = () => {
    setPreview(null);
    setError("");

    if (onChange) {
      onChange(null, null);
    }
  };

  const chooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">

      {/* Header */}

      <div className="flex items-start justify-between mb-3">

        <div>
          <h3 className="text-sm font-bold text-slate-800">
            {label}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {description}
          </p>
        </div>

        {preview && (
          <div className="flex items-center gap-1 text-xs font-semibold text-[#16B979]">
            <FaCheckCircle />
            Uploaded
          </div>
        )}

      </div>

      {/* Hidden File Input */}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {!preview ? (
        /* Upload Area */

        <div
          onClick={chooseFile}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="
            group
            relative
            min-h-[190px]
            border-2
            border-dashed
            border-slate-300
            rounded-2xl
            bg-slate-50
            hover:bg-white
            hover:border-[#19D68C]
            transition-all
            duration-200
            cursor-pointer
            flex
            flex-col
            items-center
            justify-center
            text-center
            px-6
          "
        >

          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-white
              border
              border-slate-200
              flex
              items-center
              justify-center
              text-slate-400
              group-hover:text-[#19D68C]
              group-hover:border-[#19D68C]
              transition-all
              shadow-sm
            "
          >
            <FaCloudUploadAlt className="text-2xl" />
          </div>

          <h4 className="mt-4 text-sm font-bold text-slate-700">
            Drop your file here
          </h4>

          <p className="mt-1 text-xs text-slate-500">
            or click to browse from your computer
          </p>

          <span
            className="
              mt-4
              inline-flex
              items-center
              justify-center
              px-4
              py-2
              rounded-lg
              bg-[#19D68C]
              text-white
              text-xs
              font-bold
              group-hover:bg-[#14C47D]
              transition
            "
          >
            Choose File
          </span>

          <p className="mt-3 text-[10px] text-slate-400">
            PNG, JPG, WEBP or SVG • Max {maxSizeMB} MB
          </p>

        </div>
      ) : (
        /* Preview Area */

        <div
          className="
            border
            border-slate-200
            rounded-2xl
            bg-slate-50
            p-5
          "
        >

          <div className="flex items-center gap-5">

            {/* Image Preview */}

            <div
              className="
                w-24
                h-24
                rounded-xl
                bg-white
                border
                border-slate-200
                flex
                items-center
                justify-center
                overflow-hidden
                shrink-0
              "
            >
              <img
                src={preview}
                alt={`${label} preview`}
                className="max-w-full max-h-full object-contain p-2"
              />
            </div>

            {/* File Information */}

            <div className="flex-1 min-w-0">

              <div className="flex items-center gap-2">

                <FaImage className="text-[#19D68C]" />

                <span className="text-sm font-semibold text-slate-800">
                  {label}
                </span>

              </div>

              <p className="text-xs text-slate-500 mt-2">
                Image preview ready.
              </p>

              <div className="flex items-center gap-2 mt-4">

                <button
                  type="button"
                  onClick={chooseFile}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-lg
                    bg-white
                    border
                    border-slate-200
                    text-slate-700
                    text-xs
                    font-semibold
                    hover:border-[#19D68C]
                    hover:text-[#16B979]
                    transition
                  "
                >
                  <FaSyncAlt />
                  Replace
                </button>

                <button
                  type="button"
                  onClick={removeFile}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-lg
                    bg-white
                    border
                    border-red-200
                    text-red-500
                    text-xs
                    font-semibold
                    hover:bg-red-50
                    transition
                  "
                >
                  <FaTrash />
                  Remove
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Error */}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-red-500">
          <FaExclamationCircle />
          {error}
        </div>
      )}

    </div>
  );
}

export default LogoUploader;