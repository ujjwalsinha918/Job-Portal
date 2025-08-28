import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {/* Main heading */}
      <h1 className="text-4xl font-bold mb-4">Welcome to Job Portal</h1>

      {/* Sub-heading / description */}
      <p className="mb-6 text-lg text-gray-700">
        Find your dream job or hire the best talent.
      </p>

      {/* Search bar */}
      <div className="flex w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700">
          Search
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mb-6">
        <Link
          to="/login"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          Register
        </Link>
      </div>

      {/* Browse jobs button */}
      <Link
        to="/jobs"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Browse Jobs
      </Link>
    </div>
  );
}

export default Landing;
