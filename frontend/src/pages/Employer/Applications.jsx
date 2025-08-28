import * as React from "react";

export default function Applications() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Applications</h2>
      <ul className="space-y-2">
        <li className="border p-2">
          <strong>John Doe</strong> - Applied for Frontend Developer
        </li>
        <li className="border p-2">
          <strong>Jane Smith</strong> - Applied for Backend Developer
        </li>
      </ul>
    </div>
  );
}
