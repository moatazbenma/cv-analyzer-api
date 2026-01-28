import React from 'react';

const BulkAnalysis = ({
  requiredSkills,
  setRequiredSkills,
  roleLevel,
  setRoleLevel,
  cvFiles,
  loading,
  results,
  error,
  onSubmit,
  onFileChange,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex flex-col p-2 sm:p-4">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto w-full mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Bulk CV Ranking
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-2">Upload multiple CVs for comparative analysis and ranking</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Skills
                </label>
                <input
                  type="text"
                  value={requiredSkills}
                  onChange={e => setRequiredSkills(e.target.value)}
                  placeholder="e.g. Python, JavaScript, React"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role Level
                </label>
                <input
                  type="text"
                  value={roleLevel}
                  onChange={e => setRoleLevel(e.target.value)}
                  placeholder="e.g. Senior, Junior, Mid-level"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CV Files (PDF) - Select Multiple
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={onFileChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 border-dashed rounded-lg sm:rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>
              {cvFiles.length > 0 && (
                <p className="text-sm text-gray-600">
                  {cvFiles.length} file{cvFiles.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || cvFiles.length === 0}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing {cvFiles.length} CV{cvFiles.length !== 1 ? 's' : ''}...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  Analyze & Rank CVs
                </div>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-red-700 font-medium text-sm sm:text-base">Error: {error}</p>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 sm:p-6 mb-4">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <h2 className="text-lg sm:text-xl font-bold text-purple-800">Ranking Results</h2>
                </div>
                <p className="text-center text-purple-700 text-sm sm:text-base">
                  CVs ranked by overall score (highest to lowest)
                </p>
              </div>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className={`bg-white rounded-xl border shadow-sm p-4 sm:p-6 ${result.status === 'success' ? 'border-green-200' : 'border-red-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold mr-3 ${
                          result.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status === 'success' ? (index + 1) : '!'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate max-w-xs sm:max-w-sm">
                            {result.file_name || `CV ${result.file_index}`}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {result.status === 'success' ? 'Analysis Complete' : 'Analysis Failed'}
                          </p>
                        </div>
                      </div>
                      {result.status === 'success' && result.analysis?.overall_score && (
                        <div className="text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                            {result.analysis.overall_score}%
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">Overall Score</div>
                        </div>
                      )}
                    </div>

                    {result.status === 'success' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-semibold text-blue-600">
                            {result.analysis?.skill_match_percentage || 0}%
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">Skill Match</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-semibold text-green-600">
                            {result.analysis?.experience_years || 'N/A'}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">Experience</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-semibold text-purple-600">
                            {result.analysis?.matched_skills?.length || 0}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">Matched Skills</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-semibold text-orange-600">
                            {result.analysis?.recommendation?.replace('_', ' ') || 'N/A'}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">Recommendation</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-red-600 text-sm sm:text-base">
                        {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 sm:mt-8 text-center text-gray-500 text-xs sm:text-sm">
            <p>Powered by AI • Secure & Private Analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkAnalysis;