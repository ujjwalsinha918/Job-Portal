// import { useState } from "react";
// import { uploadResume } from "../api/jobs";

// export default function ResumeUpload() {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");

//   const handleUpload = async () => {
//      console.log("🚀 Upload started");
//     if (!file){
//       console.log("❌ No file selected");
//       return;
//     } 
//     try {
//       // ✅ Create FormData object
//       const formData = new FormData();
//       formData.append("file", file);
//       console.log("📦 FormData prepared:", file.name);
      
//       const res = await uploadResume(formData);
//       setMessage(res.detail || "Resume uploaded successfully!");
//       setFile(null);
//     } catch (err) {
//       setMessage(err.response?.data?.detail || "Upload failed");
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button type="button" onClick={handleUpload}>
//         Upload Resume
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }