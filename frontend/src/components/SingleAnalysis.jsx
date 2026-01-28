import React from 'react';

const SingleAnalysis = ({
  requiredSkills,
  setRequiredSkills,
  roleLevel,
  setRoleLevel,
  cvFile,
  setCvFile,
  loading,
  result,
  error,
  onSubmit,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col p-4 sm:p-6 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Back Button */}
      <div className="max-w-3xl mx-auto w-full mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-3xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-purple-500/30 backdrop-blur-xl">
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              Analyze Your CV
            </h1>
            <p className="text-gray-300 text-base sm:text-lg">Upload your CV and get instant AI-powered insights</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  Required Skills
                </label>
                <input
                  type="text"
                  value={requiredSkills}
                  onChange={e => setRequiredSkills(e.target.value)}
                  placeholder="e.g. Python, JavaScript, React or space-separated"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder-gray-400 text-sm sm:text-base"
                />
                <p className="text-xs text-gray-400">💡 Separate skills with commas or spaces. Auto-corrects common typos (aWS → AWS, pHP → PHP)</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  Role Level
                </label>
                <input
                  type="text"
                  value={roleLevel}
                  onChange={e => setRoleLevel(e.target.value)}
                  placeholder="e.g. Senior, Junior, Mid-level"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                CV File (PDF)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={e => setCvFile(e.target.files[0])}
                  required
                  className="w-full px-4 py-4 bg-gray-700 border-2 border-dashed border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 transition-all text-white placeholder-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-400">PDF format only, max 10MB</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 text-base sm:text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Your CV...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Analyze CV
                </div>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start">
              <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="text-red-400 font-semibold">Error</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && result.analysis && (
            <div className="mt-8 space-y-6">
              {/* Success Banner */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-green-300">Analysis Complete!</h2>
                </div>
                <p className="text-green-300/80 text-sm sm:text-base">Here's your comprehensive CV analysis</p>
              </div>

              {/* Candidate Info */}
              {(result.analysis.candidate_name || result.analysis.email || result.analysis.phone) && (
                <div className="bg-gray-700/50 border border-blue-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    Candidate Information
                  </h3>
                  <div className="space-y-3">
                    {result.analysis.candidate_name && (
                      <div className="flex items-center p-3 bg-gray-600/50 rounded-lg border border-gray-600">
                        <div className="flex-shrink-0 mr-3">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-400">Name</p>
                          <p className="text-white font-semibold truncate">{result.analysis.candidate_name}</p>
                        </div>
                      </div>
                    )}
                    {result.analysis.email && (
                      <div className="flex items-center p-3 bg-gray-600/50 rounded-lg border border-gray-600">
                        <div className="flex-shrink-0 mr-3">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-white break-all">{result.analysis.email}</p>
                        </div>
                      </div>
                    )}
                    {result.analysis.phone && (
                      <div className="flex items-center p-3 bg-gray-600/50 rounded-lg border border-gray-600">
                        <div className="flex-shrink-0 mr-3">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-400">Phone</p>
                          <p className="text-white">{result.analysis.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Summary */}
              {result.analysis.summary && (
                <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Summary
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{result.analysis.summary}</p>
                </div>
              )}

              {/* Recommendation */}
              {result.analysis.recommendation && (
                <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    Recommendation
                  </h3>
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                    result.analysis.recommendation === 'STRONG_MATCH' ? 'bg-green-500/20 text-green-300' :
                    result.analysis.recommendation === 'GOOD_MATCH' ? 'bg-blue-500/20 text-blue-300' :
                    result.analysis.recommendation === 'PARTIAL_MATCH' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {result.analysis.recommendation.replace('_', ' ')}
                  </div>
                </div>
              )}

              {/* Skills Match Scores */}
              {(result.analysis.skill_match_percentage !== undefined || result.analysis.overall_score !== undefined) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {result.analysis.skill_match_percentage !== undefined && (
                    <div className="bg-gray-700/50 border border-orange-500/30 rounded-xl p-4">
                      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        Skill Match
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${result.analysis.skill_match_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-orange-400 w-12 text-right">{result.analysis.skill_match_percentage}%</span>
                      </div>
                    </div>
                  )}

                  {result.analysis.overall_score !== undefined && (
                    <div className="bg-gray-700/50 border border-green-500/30 rounded-xl p-4">
                      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Overall Score
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${result.analysis.overall_score}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-green-400 w-12 text-right">{result.analysis.overall_score}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Skills Analysis */}
              {(result.analysis.extracted_skills?.length > 0 || result.analysis.matched_skills?.length > 0 || result.analysis.missing_skills?.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.analysis.extracted_skills && result.analysis.extracted_skills.length > 0 && (
                    <div className="bg-gray-700/50 border border-teal-500/30 rounded-xl p-4">
                      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path>
                        </svg>
                        Extracted Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.extracted_skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded-lg text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.analysis.matched_skills && result.analysis.matched_skills.length > 0 && (
                    <div className="bg-gray-700/50 border border-green-500/30 rounded-xl p-4">
                      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Matched Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.matched_skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 rounded-lg text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.analysis.missing_skills && result.analysis.missing_skills.length > 0 && (
                    <div className="bg-gray-700/50 border border-red-500/30 rounded-xl p-4">
                      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Missing Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.missing_skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Experience & Education */}
              {(result.analysis.experience_years || (result.analysis.education && result.analysis.education.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.analysis.experience_years && (
                    <div className="bg-gray-700/50 border border-blue-500/30 rounded-xl p-4">
                      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Experience
                      </h3>
                      <p className="text-white text-lg font-semibold">{result.analysis.experience_years} years</p>
                    </div>
                  )}

                  {result.analysis.education && result.analysis.education.length > 0 && (
                    <div className="bg-gray-700/50 border border-purple-500/30 rounded-xl p-4">
                      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        </svg>
                        Education
                      </h3>
                      <ul className="space-y-1">
                        {result.analysis.education.map((edu, index) => (
                          <li key={index} className="text-gray-300 text-xs flex items-start">
                            <span className="mr-2 mt-1">•</span>
                            <span>{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Strengths & Concerns */}
              {(result.analysis.strengths?.length > 0 || result.analysis.concerns?.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.analysis.strengths && result.analysis.strengths.length > 0 && (
                    <div className="bg-gray-700/50 border border-green-500/30 rounded-xl p-4">
                      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {result.analysis.strengths.map((strength, index) => (
                          <li key={index} className="text-gray-300 text-sm flex items-start">
                            <span className="mr-2 mt-0.5">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.analysis.concerns && result.analysis.concerns.length > 0 && (
                    <div className="bg-gray-700/50 border border-yellow-500/30 rounded-xl p-4">
                      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {result.analysis.concerns.map((concern, index) => (
                          <li key={index} className="text-gray-300 text-sm flex items-start">
                            <span className="mr-2 mt-0.5">!</span>
                            <span>{concern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Interview Questions */}
              {result.analysis.interview_questions && result.analysis.interview_questions.length > 0 && (
                <div className="bg-gray-700/50 border border-indigo-500/30 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Suggested Interview Questions
                  </h3>
                  <ol className="space-y-3">
                    {result.analysis.interview_questions.map((question, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start">
                        <span className="flex-shrink-0 w-5 h-5 bg-indigo-500/30 text-indigo-300 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 text-center text-gray-400 text-xs">
            <p>Powered by AI • Secure & Private Analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAnalysis;