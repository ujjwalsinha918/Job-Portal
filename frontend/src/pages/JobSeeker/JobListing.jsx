import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, CheckCircle } from "lucide-react";
import { getJobs, applyForJob, getMyApplications, saveJob, unsaveJob, getSavedJobs } from "../../api/jobs";
import ProtectedRoute from "../../components/ProtectedRoute";
import JobCard from "../../components/JobCard";


function JobListingContent() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [savedJobIds, setSavedJobIds] = useState(new Set());


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both jobs and user's applications
        const [jobsData, applicationsData, savedJobsData] = await Promise.all([
          getJobs(),
          getMyApplications(),
          getSavedJobs()
        ]);
        
        setJobs(jobsData);
        
        // Create a Set of job IDs that user has already applied to
        const appliedIds = new Set(applicationsData.map(app => app.job.id));
        const savedIds = new Set(savedJobsData.map(job => job.id));
        setAppliedJobIds(appliedIds);
        setSavedJobIds(savedIds);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
  const handleSave = async (jobId) => {
  try {
    await saveJob(jobId);
    setSavedJobIds(prev => new Set([...prev, jobId]));
    alert("Job saved!");
  } catch (err) {
    alert(err.response?.data?.detail || "Failed to save job");
  }
};

const handleUnsave = async (jobId) => {
  try {
    await unsaveJob(jobId);
    setSavedJobIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(jobId);
      return newSet;
    });
    alert("Removed from saved jobs!");
  } catch (err) {
    alert(err.response?.data?.detail || "Failed to remove job");
  }
};

  const handleApply = async (jobId) => {
    // Check if already applied
    if (appliedJobIds.has(jobId)) {
      alert("You have already applied to this job!");
      return;
    }

    try {
      await applyForJob(jobId);
      // Add to applied jobs set
      setAppliedJobIds(prev => new Set([...prev, jobId]));
      alert("Applied successfully!");
    } catch (err) {
      console.error("Application error:", err.response?.data || err);
      alert(err.response?.data?.detail || "Failed to apply. Try again.");
    }
  };

  // Filter jobs based on search term and location
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "" || 
                           job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="text-gray-600 mt-2">Find your next opportunity</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by job title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
          <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={handleApply}
              hasApplied={appliedJobIds.has(job.id)}
              isSaved={savedJobIds.has(job.id)}
  onSave={() => handleSave(job.id)}
  onUnsave={() => handleUnsave(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}


export default function JobListing() {
  return (
    <ProtectedRoute role="jobseeker">
      <JobListingContent />
    </ProtectedRoute>
  );
}