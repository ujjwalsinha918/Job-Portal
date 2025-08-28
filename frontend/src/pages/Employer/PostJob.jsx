import * as React from "react";
export default function PostJob() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Post a Job</h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Job Title"
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Job Description"
          className="border p-2 w-full"
        ></textarea>
        <input
          type="text"
          placeholder="Location"
          className="border p-2 w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Post Job
        </button>
      </form>
    </div>
  );
}
