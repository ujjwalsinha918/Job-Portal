import React from "react";
import { Briefcase, MapPin, CheckCircle, Heart, X } from "lucide-react";



export default function JobCard({ job, onApply, hasApplied, isSaved, onSave, onUnsave }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
          {job.company && (
            <div className="flex items-center">
              <Briefcase size={16} className="mr-1" />
              <span>{job.company}</span>
            </div>
          )}
          <div className="flex items-center">
            <MapPin size={16} className="mr-1" />
            <span>{job.location}</span>
          </div>
        </div>
        <p className="text-gray-700 line-clamp-3 mb-4">{job.description}</p>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          {hasApplied ? (
            <button
              disabled
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md cursor-not-allowed flex items-center space-x-2"
            >
              <CheckCircle size={16} />
              <span>Already Applied</span>
            </button>
          ) : (
            <button
              onClick={() => onApply(job.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Apply
            </button>
          )}

          {isSaved ? (
            <button
              onClick={() => onUnsave(job.id)}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition flex items-center space-x-1"
            >
              <X size={16} />
              <span>Unsave</span>
            </button>
          ) : (
            <button
              onClick={() => onSave(job.id)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition flex items-center space-x-1"
            >
              <Heart size={16} />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
