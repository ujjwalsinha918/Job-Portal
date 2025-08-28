import * as React from "react";

export default function ManageJobs() {
  return (
    <div>
        <h2 className="text-xl font-bold mb-4">Manage Jobs</h2>
    <ul className="space-y-2">
        <li className="border p-2 flex justify-between">
            <span>Frontend Developer</span>
            <div>
                <button className="text-blue-500 mr-2">Edit</button>
                <button className="text-red-500">Delete</button>
            </div>
        </li>
        <li className="border p-2 flex justify-between">
            <span>Backend Developer</span>
            <div>
                <button className="text-blue-500 mr-2">Edit</button>
                <button className="text-red-500">Delete</button>
            </div>
        </li>
    </ul>
    </div>
  );
}
