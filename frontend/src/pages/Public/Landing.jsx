import { Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlineRocket, AiOutlineCheckCircle, AiOutlineStar, AiOutlineTeam, AiOutlineTrophy } from "react-icons/ai";
import { useState } from "react";

function Landing() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Technology", icon: "💻", jobs: "2,500+" },
    { name: "Healthcare", icon: "🏥", jobs: "1,800+" },
    { name: "Finance", icon: "💰", jobs: "1,200+" },
    { name: "Marketing", icon: "📱", jobs: "900+" },
    { name: "Design", icon: "🎨", jobs: "750+" },
    { name: "Engineering", icon: "⚙️", jobs: "1,100+" },
  ];

  const stats = [
    { number: "10,000+", label: "Active Jobs" },
    { number: "5,000+", label: "Companies" },
    { number: "50,000+", label: "Job Seekers" },
    { number: "15,000+", label: "Success Stories" },
  ];

  const features = [
    { icon: <AiOutlineSearch />, title: "Easy Job Search", desc: "Find jobs that match your skills instantly" },
    { icon: <AiOutlineRocket />, title: "Quick Apply", desc: "Apply to multiple jobs with one click" },
    { icon: <AiOutlineCheckCircle />, title: "Verified Companies", desc: "All employers are verified and trusted" },
    { icon: <AiOutlineStar />, title: "Top Opportunities", desc: "Access exclusive job openings" },
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Software Developer", text: "Found my dream job in just 2 weeks! The platform is amazing.", rating: 5 },
    { name: "Mike Chen", role: "Marketing Manager", text: "Best job portal I've used. Clean interface and great opportunities.", rating: 5 },
    { name: "Emma Davis", role: "Product Designer", text: "Highly recommend! Got multiple interview calls within days.", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">JobPortal</div>
          <div className="hidden md:flex gap-6 items-center">
            <a href="#jobs" className="text-gray-700 hover:text-blue-600 transition">Jobs</a>
            <a href="#companies" className="text-gray-700 hover:text-blue-600 transition">Companies</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
            <Link to="/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
          🎉 Over 10,000 jobs posted this week
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Find Your Dream Job Today
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Connect with top companies and discover opportunities that match your skills and ambitions
        </p>

        {/* Enhanced Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-2xl shadow-xl">
            <div className="flex-1 flex items-center gap-3 px-4">
              <AiOutlineSearch className="w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 focus:outline-none text-gray-700"
              />
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
              Search Jobs
            </button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
            Get Started Free
          </Link>
          <Link to="/jobs" className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all">
            Browse All Jobs
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, idx) => (
              <div key={idx} className="transform hover:scale-110 transition-all">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Popular Categories</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Explore jobs by category</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all cursor-pointer text-center">
              <div className="text-5xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{cat.name}</h3>
              <p className="text-sm text-blue-600">{cat.jobs} jobs</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Why Choose Us</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Everything you need to find your next opportunity</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <div className="text-4xl text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Success Stories</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Hear from people who found their dream jobs</p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(test.rating)].map((_, i) => (
                  <AiOutlineStar key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{test.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {test.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{test.name}</div>
                  <div className="text-sm text-gray-600">{test.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <AiOutlineTrophy className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-10 text-blue-100">Join thousands of job seekers who found their dream careers</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all">
              Create Free Account
            </Link>
            <Link to="/login" className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">JobPortal</h3>
              <p className="text-gray-400">Your trusted partner in career success</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Career Advice</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">Post a Job</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Search Candidates</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;