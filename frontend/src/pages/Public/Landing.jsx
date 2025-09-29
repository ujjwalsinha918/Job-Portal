import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 px-4">
      {/* Main heading */}
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 text-gray-900">
        Welcome to <span className="text-blue-600">Job Portal</span>
      </h1>

      {/* Sub-heading / description */}
      <p className="mb-8 text-lg sm:text-xl text-gray-700 max-w-2xl">
        Find your dream job or hire the best talent quickly and efficiently.
      </p>

      {/* Search bar */}
      <div className="flex w-full max-w-lg mb-8 shadow-lg rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Search jobs..."
          className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-r-0 rounded-l-lg"
        />
        <button className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
          <AiOutlineSearch className="w-5 h-5" /> Search
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link
          to="/login"
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-8 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
        >
          Register
        </Link>
      </div>

      {/* Browse jobs button */}
      <Link
        to="/jobs"
        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Browse Jobs
      </Link>

      {/* Footer / small text */}
      <p className="mt-12 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Job Portal. All rights reserved.
      </p>
    </div>
  );
}

export default Landing;
