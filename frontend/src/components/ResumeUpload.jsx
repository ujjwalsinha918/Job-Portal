import { useState } from "react";
import { uploadResume } from "../api/jobs"; // import the new function

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    try {
      const res = await uploadResume(file);
      setMessage(res.detail || "Resume uploaded successfully!");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="button" onClick={handleUpload}>
        Upload Resume
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
