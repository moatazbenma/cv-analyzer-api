import React from 'react';

const WelcomePage = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      <div className="w-full max-w-5xl relative z-10 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 w-full">
          <div className="mb-8 flex justify-center">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-5 shadow-2xl">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            CV Analyzer <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Pro</span>
          </h1>
          
          <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-2xl mx-auto px-4">
            <p className="text-gray-300 text-lg sm:text-xl lg:text-2xl leading-relaxed font-light">
              Transform your CV with AI-powered analysis
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm font-medium border border-purple-400/30">Skill Analysis</span>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm font-medium border border-blue-400/30">Interview Prep</span>
              <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-xs sm:text-sm font-medium border border-pink-400/30">AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Main Card Section */}
        <div className="w-full flex justify-center px-4 mb-12 sm:mb-16">
          <div
            onClick={() => onSelectMode('single')}
            className="bg-gradient-to-br from-gray-800/80 via-gray-850/80 to-gray-900/80 rounded-3xl shadow-2xl border border-purple-500/40 p-10 sm:p-12 lg:p-14 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:border-purple-400/70 group w-full max-w-2xl backdrop-blur-md hover:bg-gradient-to-br hover:from-gray-800/90 hover:via-purple-900/40 hover:to-gray-900/90"
          >
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
              {/* Icon Section */}
              <div className="flex-shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl group-hover:shadow-3xl">
                  <svg className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Analyze Your CV
                </h2>
                <p className="text-gray-300 text-base sm:text-lg lg:text-xl mb-8 leading-relaxed">
                  Upload your CV and unlock comprehensive AI analysis including skill matching, experience evaluation, and personalized recommendations.
                </p>
                
                <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-12 max-w-md lg:max-w-none">
                  <div className="flex items-center justify-center lg:justify-start text-gray-300 group/item">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-4 group-hover/item:scale-150 transition-transform duration-300"></div>
                    <span className="text-base sm:text-lg font-medium">Detailed skill analysis & matching</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start text-gray-300 group/item">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-4 group-hover/item:scale-150 transition-transform duration-300"></div>
                    <span className="text-base sm:text-lg font-medium">Experience & education evaluation</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start text-gray-300 group/item">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full mr-4 group-hover/item:scale-150 transition-transform duration-300"></div>
                    <span className="text-base sm:text-lg font-medium">Personalized interview questions</span>
                  </div>
                </div>

                <button className="w-full lg:w-auto px-8 sm:px-10 lg:px-12 py-4 sm:py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform group-hover:translate-y-0 hover:-translate-y-1">
                  Start Analysis Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="w-full grid grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-2xl mx-auto px-4">
          <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-bold text-purple-300 mb-2">1000+</div>
            <div className="text-xs sm:text-sm text-gray-400">CVs Analyzed</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-bold text-blue-300 mb-2">98%</div>
            <div className="text-xs sm:text-sm text-gray-400">Accuracy Rate</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-pink-500/10 to-pink-500/5 rounded-2xl border border-pink-500/20 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-bold text-pink-300 mb-2">&lt;10s</div>
            <div className="text-xs sm:text-sm text-gray-400">Analysis Time</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs sm:text-sm">
          <p className="mb-2">✨ Powered by Advanced AI • Secure & Private Analysis</p>
          <p className="text-gray-500 text-xs">Your CV data is never stored or shared</p>
          <p className="text-gray-600 text-xs mt-6">Built by <span className="font-semibold text-gray-500">EL MOUATAZ BENMANSSOUR</span></p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;