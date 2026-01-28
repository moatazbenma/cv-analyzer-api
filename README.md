# CV Analyzer API

A modern, intelligent CV analysis system that uses AI to automatically analyze resumes, extract skills, match job requirements, and provide comprehensive recruitment insights.

**Built by EL MOUATAZ BENMANSSOUR**

## 🎯 Features

- **AI-Powered CV Analysis**: Leverages meta-llama/Llama-3.2-3B-Instruct model via bytez.com API
- **Automatic Skill Extraction**: Extracts technical and soft skills from CV content
- **Requirement Matching**: Matches CV skills against required skills with accuracy scoring
- **Comprehensive Reports**: Generates detailed analysis including:
  - Candidate information (name, email, phone)
  - Extracted skills with match percentage
  - Matched & missing skills comparison
  - Experience level assessment
  - Educational background
  - Key strengths and concerns
  - Interview question suggestions
  - Match recommendation (PERFECT_MATCH, STRONG_MATCH, PARTIAL_MATCH, WEAK_MATCH)

- **Robust Error Handling**: Three-layer JSON parsing with fallback mechanisms
- **Smart Input Processing**: 
  - Handles space/comma/mixed separated skill inputs
  - Auto-corrects common typos (aWS→AWS, pHP→PHP, etc.)
  - Protects multi-word skills from splitting
  - Filters invalid skill entries
- **Modern UI**: Dark-themed React interface with responsive design
- **Production-Ready**: Comprehensive logging and error recovery

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Features**: Dark theme, animated backgrounds, responsive layouts

### Backend
- **Framework**: Laravel 11
- **Language**: PHP 8.2+
- **PDF Processing**: Smalot PdfParser
- **External API**: bytez.com LLaMA model
- **Logging**: Laravel logging system

## 📋 Prerequisites

- PHP 8.2 or higher
- Node.js 18+ and npm
- Composer
- Modern web browser
- API access to bytez.com LLaMA model

## 🚀 Installation

### Backend Setup

```bash
cd Backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Set up database (if needed)
php artisan migrate

# Start the server
php artisan serve
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📝 Usage

1. **Open the Application**: Navigate to `http://localhost:5173`
2. **Upload CV**: Click on the CV upload area and select a PDF file
3. **Enter Requirements**: Input required skills (comma or space separated):
   ```
   HTML CSS JavaScript Python Django Problem Solving
   ```
4. **Select Role Level**: Choose from Junior, Mid-level, Senior
5. **Analyze**: Click "Analyze CV" button
6. **Review Results**: Examine:
   - Matched skills (found in CV)
   - Missing skills (required but not in CV)
   - Overall match percentage
   - Detailed strengths and concerns
   - Interview questions for the candidate

## 🎯 Skill Input Format

The system accepts multiple input formats:

```
# Comma separated
HTML, CSS, JavaScript, Python, Django

# Space separated
HTML CSS JavaScript Python Django

# Mixed format
HTML, CSS JavaScript Python, Django

# Multi-word skills (automatically protected)
Problem Solving, Algorithms & Data Structures, VS Code, Git & GitHub
```

## ✨ Smart Features

### Typo Correction
Automatically corrects common typos:
- aWS → AWS
- pHP → PHP
- javascript → JavaScript
- pYTHON → Python
- dJANGO → Django

### Multi-Word Skill Protection
Prevents skills with multiple words from being split:
- Problem Solving (stays together)
- Algorithms & Data Structures (stays together)
- VS Code (stays together)
- Git & GitHub (stays together)

### Invalid Skill Filtering
Automatically removes invalid entries:
- Single letters (except programming languages: C, R, Go, Java)
- Common words (&, vs, and, or)
- Nonsensical entries

### JSON Parsing Resilience
Three-layer error recovery:
1. **Layer 1**: Standard JSON parsing
2. **Layer 2**: Syntax fixing (escaping, brace balancing, quote normalization)
3. **Layer 3**: Regex-based field extraction (emergency fallback)

## 📊 Analysis Report Fields

### Candidate Info
- Name, Email, Phone
- Professional summary

### Skills Analysis
- **Extracted Skills**: Skills found in the CV
- **Matched Skills**: Required skills found in the CV
- **Missing Skills**: Required skills NOT in the CV
- **Skill Match %**: Percentage of required skills present in CV

### Assessment
- **Experience Years**: Estimated years of experience
- **Education**: Degrees and institutions
- **Strengths**: Top 3-5 key strengths
- **Concerns**: Areas of improvement or missing skills
- **Overall Score**: 0-100 score based on match
- **Recommendation**: PERFECT_MATCH | STRONG_MATCH | PARTIAL_MATCH | WEAK_MATCH

### Insights
- Interview questions tailored to the candidate

## 🔍 API Endpoints

### POST `/api/analyze-cv`

Analyze a CV against job requirements.

**Request:**
```json
{
  "required_skills": "HTML, CSS, JavaScript, Python, Django",
  "role_level": "Mid-level",
  "cv_file": <PDF file>
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidate_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "summary": "...",
    "extracted_skills": ["HTML", "CSS", "JavaScript", "Python"],
    "matched_skills": ["HTML", "CSS", "JavaScript", "Python"],
    "missing_skills": ["Django"],
    "experience_years": 5,
    "education": ["Bachelor's in Computer Science"],
    "skill_match_percentage": 80,
    "overall_score": 85,
    "recommendation": "STRONG_MATCH",
    "strengths": ["Problem Solving", "Frontend Development"],
    "concerns": ["No Django experience"],
    "interview_questions": ["Tell us about your best project..."]
  }
}
```

## 🐛 Debugging

### View Logs
```bash
# Backend logs
tail -f Backend/storage/logs/laravel.log

# Check API response in browser console
# Look for detailed error messages with raw_response data
```

### Common Issues

**Issue**: "Failed to parse AI response"
- **Solution**: Check API key and bytez.com API availability
- The system now has three-layer fallback recovery

**Issue**: Missing or false positive skills
- **Solution**: Verify skill input format and CV content
- Check that multi-word skills are properly separated by commas

**Issue**: PDF upload fails
- **Solution**: Ensure file is valid PDF, less than 2MB, with extractable text

## 🔐 Environment Variables

Create a `.env` file in the Backend directory:

```env
APP_NAME=CVAnalyzer
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite

BYTEZ_API_KEY=your_api_key_here
BYTEZ_API_URL=https://api.bytez.com/api/v1/completions
```

## 📈 Performance

- **PDF Processing**: < 2 seconds
- **AI Analysis**: 5-15 seconds (depends on CV length)
- **Total Analysis Time**: < 20 seconds

## 🎨 Design Highlights

- **Dark Theme**: Professional slate-900 base with purple/blue accents
- **Glassmorphism**: Modern frosted glass effects
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessibility**: Semantic HTML with ARIA labels
- **Animations**: Smooth transitions and fade effects

## 📄 License

This project is created for educational and recruitment purposes.

## 👨‍💻 Author

**EL MOUATAZ BENMANSSOUR**
- Focus: Full-stack development and AI integration
- Technologies: Laravel, React, Python, Generative AI

## 🤝 Support

For issues and feature requests, please check the application logs and verify:
1. Backend is running on `http://localhost:8000`
2. Frontend is running on `http://localhost:5173`
3. PDF file is valid and has extractable text
4. API key is configured correctly
5. Required skills are in supported format

## 📞 Contact

For questions or feedback about this CV Analyzer, reach out to the project creator.

---

**Version**: 1.0.0  
**Last Updated**: January 2026
