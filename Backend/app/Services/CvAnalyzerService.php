<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CvAnalyzerService
{
    private string $apiKey;
    private string $baseUrl = 'https://api.bytez.com/models/v2/meta-llama/Llama-3.2-3B-Instruct';

    public function __construct()
    {
        $this->apiKey = config('services.bytez.key');
    }

    public function analyze(string $cvText, string $requiredSkills, string $roleLevel): array
    {
        // Clean and normalize required skills input
        $requiredSkills = $this->normalizeSkillsInput($requiredSkills);
        
        $prompt = $this->buildPrompt($cvText, $requiredSkills, $roleLevel);

        set_time_limit(300);

        try {
            $response = Http::timeout(120)->withHeaders([
                'Authorization' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl, [
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert HR assistant that analyzes CVs/resumes. Always respond with valid JSON only, no markdown.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ]
            ]);

            if (!$response->successful()) {
                return [
                    'success' => false,
                    'error' => 'API request failed: ' . $response->body()
                ];
            }

            $result = $response->json();
            $content = $result['output']['content'] ?? null;

            if (!$content) {
                return [
                    'success' => false,
                    'error' => 'No response from AI',
                    'raw_response' => $result
                ];
            }

            // Clean JSON response - remove markdown code blocks if present
            $content = trim($content);
            
            // Remove markdown code blocks
            $content = preg_replace('/^```json\s*/i', '', $content);
            $content = preg_replace('/^```\s*/i', '', $content);
            $content = preg_replace('/\s*```$/', '', $content);
            $content = trim($content);

            // Try to extract JSON if there's extra text
            $jsonStart = strpos($content, '{');
            $jsonEnd = strrpos($content, '}');
            
            if ($jsonStart !== false && $jsonEnd !== false && $jsonEnd > $jsonStart) {
                $content = substr($content, $jsonStart, $jsonEnd - $jsonStart + 1);
            }
            
            $content = trim($content);

            // Log raw content for debugging
            \Log::info('Raw AI Response', [
                'raw_content' => substr($content, 0, 2000),
                'content_length' => strlen($content),
            ]);

            $analysis = json_decode($content, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                // Try to fix common JSON issues
                $content = $this->fixJsonSyntax($content);
                $analysis = json_decode($content, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    // Last attempt: try to extract and rebuild JSON
                    $analysis = $this->extractAndRebuildJson($content);
                    
                    if (!$analysis) {
                        \Log::error('Failed to parse AI response', [
                            'error' => json_last_error_msg(),
                            'raw_response' => substr($content, 0, 2000)
                        ]);
                        return [
                            'success' => false,
                            'error' => 'Failed to parse AI response: ' . json_last_error_msg(),
                            'raw_response' => substr($content, 0, 2000)
                        ];
                    }
                }
            }

            // Validate and clean up skills arrays to ensure no overlap
            $requiredSkillsArray = array_map('trim', explode(',', $requiredSkills));
            $requiredSkillsArray = array_filter($requiredSkillsArray); // Remove empty strings
            
            $matchedSkills = $analysis['matched_skills'] ?? [];
            $missingSkills = $analysis['missing_skills'] ?? [];
            $extractedSkills = $analysis['extracted_skills'] ?? [];

            // Log for debugging
            \Log::info('Skills Analysis Debug', [
                'required_skills_input' => $requiredSkills,
                'required_skills_parsed' => $requiredSkillsArray,
                'matched_skills_raw' => $matchedSkills,
                'missing_skills_raw' => $missingSkills,
                'extracted_skills_raw' => $extractedSkills,
                'experience_years_raw' => $analysis['experience_years'] ?? null,
                'skill_match_percentage_raw' => $analysis['skill_match_percentage'] ?? null,
                'overall_score_raw' => $analysis['overall_score'] ?? null,
            ]);

            // Ensure arrays are arrays
            $matchedSkills = is_array($matchedSkills) ? $matchedSkills : [];
            $missingSkills = is_array($missingSkills) ? $missingSkills : [];
            $extractedSkills = is_array($extractedSkills) ? $extractedSkills : [];

            // Normalize skills (trim whitespace and lowercase for comparison)
            $matchedSkills = array_map('trim', $matchedSkills);
            $missingSkills = array_map('trim', $missingSkills);
            $extractedSkills = array_map('trim', $extractedSkills);
            // Validate extracted skills - remove any that are in required skills but shouldn't be
            // (AI sometimes includes required skills in extracted even if not in CV)
            $extractedSkillsLower = array_map('strtolower', $extractedSkills);
            $requiredSkillsLower = array_map('strtolower', $requiredSkillsArray);
            
            // Remove required skills from extracted skills if they appear to be false positives
            // Only keep skills that are mentioned in the CV (not just in requirements)
            $verifiedExtractedSkills = [];
            foreach ($extractedSkills as $extracted) {
                $extractedLower = strtolower($extracted);
                // Keep it if it's not a required skill, or if it really appears in CV content
                if (!in_array($extractedLower, $requiredSkillsLower)) {
                    $verifiedExtractedSkills[] = $extracted;
                } else {
                    // For required skills in extracted, do stricter CV content check
                    $cvLower = strtolower($cvText);
                    // Check if skill appears at least twice in CV (to reduce false positives)
                    $occurrences = substr_count($cvLower, $extractedLower);
                    if ($occurrences >= 2 || strpos($cvLower, 'skill' . $extractedLower) !== false) {
                        $verifiedExtractedSkills[] = $extracted;
                    }
                }
            }
            
            $extractedSkills = !empty($verifiedExtractedSkills) ? $verifiedExtractedSkills : $extractedSkills;
            
            // Case-insensitive skill matching
            $normalizedMatched = [];
            foreach ($requiredSkillsArray as $requiredSkill) {
                if ($this->skillMatches($requiredSkill, $extractedSkills)) {
                    // Find the matched skill as it appears in the extracted list
                    foreach ($extractedSkills as $extracted) {
                        if ($this->skillMatches($requiredSkill, [$extracted])) {
                            $normalizedMatched[] = $extracted;
                            break;
                        }
                    }
                }
            }
            
            // Recalculate matched skills based on case-insensitive matching
            $matchedSkills = array_unique($normalizedMatched);
            
            // Calculate missing skills as required skills not in matched
            $missingSkills = [];
            foreach ($requiredSkillsArray as $requiredSkill) {
                if (!$this->skillMatches($requiredSkill, $matchedSkills)) {
                    $missingSkills[] = $requiredSkill;
                }
            }

            // Remove any skills that appear in both matched and missing (should be in matched only)
            $matchedSkills = array_diff($matchedSkills, $missingSkills);
            $missingSkills = array_diff($missingSkills, $matchedSkills);

            // Ensure matched skills are actually from required skills (only matched from required)
            $matchedSkills = array_intersect($matchedSkills, $requiredSkillsArray);

            // Ensure missing skills are from required skills and not in matched
            $missingSkills = array_diff(array_intersect($missingSkills, $requiredSkillsArray), $matchedSkills);

            // Validate that all required skills are accounted for
            $allRequiredSkillsAccounted = array_merge($matchedSkills, $missingSkills);
            $unaccountedSkills = array_diff($requiredSkillsArray, $allRequiredSkillsAccounted);
            if (!empty($unaccountedSkills)) {
                // Put unaccounted required skills in missing skills
                $missingSkills = array_merge($missingSkills, $unaccountedSkills);
            }

            // Remove duplicates and reset indexes
            $matchedSkills = array_values(array_unique(array_map('strtolower', $matchedSkills)));
            $missingSkills = array_values(array_unique(array_map('strtolower', $missingSkills)));
            $extractedSkills = array_values(array_unique(array_map('strtolower', $extractedSkills)));

            // Update the analysis with cleaned data
            $analysis['matched_skills'] = $matchedSkills;
            $analysis['missing_skills'] = $missingSkills;
            $analysis['extracted_skills'] = $extractedSkills;

            // Recalculate skill_match_percentage based on accurate data
            if (!empty($requiredSkillsArray)) {
                $matchPercentage = count($matchedSkills) > 0 
                    ? round((count($matchedSkills) / count($requiredSkillsArray)) * 100) 
                    : 0;
                $analysis['skill_match_percentage'] = min(100, max(0, $matchPercentage));
            } else {
                $analysis['skill_match_percentage'] = 0;
            }

            // Validate and clean experience_years
            if (isset($analysis['experience_years'])) {
                $expYears = $analysis['experience_years'];
                
                // If it's a string that looks like a number, convert it
                if (is_string($expYears) && is_numeric($expYears)) {
                    $expYears = (float) $expYears;
                }
                
                // Validate the experience years
                if (is_numeric($expYears)) {
                    // Round to nearest whole number
                    $expYears = (int) round($expYears);
                    
                    // Reasonable bounds check (0-50 years)
                    if ($expYears < 0) {
                        $expYears = null;
                    } elseif ($expYears > 50) {
                        // If over 50, it might be a calculation error, set to null
                        $expYears = null;
                    }
                } else {
                    // If not numeric, set to null
                    $expYears = null;
                }
                
                $analysis['experience_years'] = $expYears;
            }

            // Validate and clean overall_score
            if (isset($analysis['overall_score'])) {
                $score = $analysis['overall_score'];
                if (is_numeric($score)) {
                    $score = (int) round($score);
                    $analysis['overall_score'] = min(100, max(0, $score));
                } else {
                    // Recalculate based on skill match and experience
                    $baseScore = $analysis['skill_match_percentage'] ?? 0;
                    $expYears = $analysis['experience_years'] ?? 0;
                    $expBonus = $expYears > 0 ? min(20, $expYears * 2) : 0;
                    $analysis['overall_score'] = min(100, (int)($baseScore + $expBonus * 0.3));
                }
            }

            // Validate recommendation based on overall score
            if (isset($analysis['recommendation'])) {
                $rec = $analysis['recommendation'];
                $score = $analysis['overall_score'] ?? 0;
                
                // Auto-correct if recommendation doesn't match score
                if ($score >= 85 && $rec !== 'STRONG_MATCH') {
                    $analysis['recommendation'] = 'STRONG_MATCH';
                } elseif ($score >= 70 && $score < 85 && $rec !== 'GOOD_MATCH') {
                    $analysis['recommendation'] = 'GOOD_MATCH';
                } elseif ($score >= 50 && $score < 70 && $rec !== 'PARTIAL_MATCH') {
                    $analysis['recommendation'] = 'PARTIAL_MATCH';
                } elseif ($score < 50 && $rec !== 'WEAK_MATCH') {
                    $analysis['recommendation'] = 'WEAK_MATCH';
                }
            }

            // Ensure all required fields are present
            $requiredFields = [
                'candidate_name', 'email', 'phone', 'summary', 'extracted_skills',
                'matched_skills', 'missing_skills', 'experience_years', 'education',
                'skill_match_percentage', 'overall_score', 'recommendation',
                'strengths', 'concerns', 'interview_questions'
            ];

            foreach ($requiredFields as $field) {
                if (!isset($analysis[$field])) {
                    $analysis[$field] = match($field) {
                        'candidate_name', 'email', 'phone', 'summary' => null,
                        'extracted_skills', 'matched_skills', 'missing_skills', 'education', 'strengths', 'concerns', 'interview_questions' => [],
                        'experience_years' => null,
                        'skill_match_percentage', 'overall_score' => 0,
                        'recommendation' => 'WEAK_MATCH',
                        default => null,
                    };
                }
            }

            \Log::info('Skills Analysis After Cleanup', [
                'matched_skills_final' => $analysis['matched_skills'],
                'missing_skills_final' => $analysis['missing_skills'],
                'extracted_skills_final' => $analysis['extracted_skills'],
                'experience_years_final' => $analysis['experience_years'],
                'skill_match_percentage_final' => $analysis['skill_match_percentage'],
                'overall_score_final' => $analysis['overall_score'],
                'recommendation_final' => $analysis['recommendation'],
            ]);

            return [
                'success' => true,
                'analysis' => $analysis
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => 'Service error: ' . $e->getMessage()
            ];
        }
    }

    private function buildPrompt(string $cvText, string $requiredSkills, string $roleLevel): string
    {
        return <<<PROMPT
You are an expert HR professional analyzing a CV for a {$roleLevel} position.

CV CONTENT:
{$cvText}

REQUIRED SKILLS TO MATCH: {$requiredSkills}

=== CRITICAL ANALYSIS INSTRUCTIONS ===

IMPORTANT: extracted_skills must ONLY contain skills that are EXPLICITLY MENTIONED IN THE CV ABOVE.
Do NOT include skills from the "Required Skills to Match" list unless they actually appear in the CV text.

=== DETAILED INSTRUCTIONS ===

1. CONTACT INFORMATION:
   - Extract: candidate_name, email, phone from CV if present
   - Use null if not found

2. EXPERIENCE YEARS:
   - Count total professional work experience (employment history ONLY, exclude education time)
   - Look for dates like "2020-2023" or "Jan 2020 - Dec 2023" and calculate difference
   - Accept explicit mentions like "5 years of experience"
   - For ranges (e.g., "3-5 years"), use the lower number
   - Round to whole number
   - Return as number only, NOT string. Use null if unclear.
   - NEVER guess or assume

3. SKILLS EXTRACTION (CRITICAL):
   - extracted_skills: Find EVERY technical skill EXPLICITLY MENTIONED in the CV text only
   - DO NOT include skills from the Required Skills list if they're not in the CV
   - Include: programming languages, frameworks, tools, technologies, databases, platforms, methodologies, libraries, etc.
   - extracted_skills must be 100% from CV content, not from the Required Skills list

4. CRITICAL RULES FOR SKILLS:
   - matched_skills and missing_skills are MUTUALLY EXCLUSIVE (no overlap allowed)
   - Matched skills must be EXACT or CLEAR matches (e.g., "Python" matches "Python", "Java" matches "Java/Spring")
   - If a required skill could be in the CV but is unclear, put it in missing_skills (conservative approach)
   - Return as arrays of strings

5. PERCENTAGES (0-100 scale):
   - skill_match_percentage: (matched skills / required skills) × 100, rounded to nearest integer
   - overall_score: Based on experience level, education, matched skills, and quality
     * 85-100: Excellent fit (strong match, high experience, relevant skills)
     * 70-84: Good fit (decent experience, most required skills)
     * 50-69: Partial fit (some skills missing, or lower experience)
     * Below 50: Weak fit (many missing skills or insufficient experience)

6. RECOMMENDATION:
   - STRONG_MATCH: 85+ overall score
   - GOOD_MATCH: 70-84 overall score
   - PARTIAL_MATCH: 50-69 overall score
   - WEAK_MATCH: Below 50 overall score

7. OTHER FIELDS:
   - summary: 2-3 sentences summarizing the candidate's background and fit
   - education: Array of degrees, certifications, and qualifications found
   - strengths: 4-6 key professional strengths relevant to the position
   - concerns: 3-5 areas that could be improved or potential gaps
   - interview_questions: 5-8 targeted questions to ask this candidate

=== JSON RESPONSE FORMAT (MUST BE VALID JSON) ===
{
    "candidate_name": "string or null",
    "email": "string or null", 
    "phone": "string or null",
    "summary": "string",
    "extracted_skills": ["skill1", "skill2"],
    "matched_skills": ["skill1", "skill2"],
    "missing_skills": ["skill1", "skill2"],
    "experience_years": number or null,
    "education": ["degree1", "degree2"],
    "skill_match_percentage": number (0-100),
    "overall_score": number (0-100),
    "recommendation": "STRONG_MATCH|GOOD_MATCH|PARTIAL_MATCH|WEAK_MATCH",
    "strengths": ["strength1", "strength2"],
    "concerns": ["concern1", "concern2"],
    "interview_questions": ["question1", "question2"]
}

=== JSON FORMAT REQUIREMENTS ===
- Return ONLY a single valid JSON object, nothing else
- NO markdown code blocks (no ```json or ```)
- NO explanatory text before or after the JSON
- NO line breaks or extra formatting
- Ensure all strings are properly quoted
- Ensure all arrays are valid JSON arrays
- Ensure all numbers are valid JSON numbers (not strings)
- Double-check JSON validity before responding
- Start immediately with { and end immediately with }

PROMPT;
    }

    /**
     * Normalize and clean required skills input
     * Handles space-separated, comma-separated, or mixed formats
     * Fixes common typos and normalizes casing
     */
    private function normalizeSkillsInput(string $input): string
    {
        // Define known multi-word skills to protect from splitting
        $multiWordSkills = [
            'problem solving' => 'Problem Solving',
            'data structures' => 'Data Structures',
            'algorithms & data structures' => 'Algorithms & Data Structures',
            'vs code' => 'VS Code',
            'git & github' => 'Git & GitHub',
            'git github' => 'Git & GitHub',
            'react.js' => 'React',
            'react js' => 'React',
            'node.js' => 'Node.js',
            'node js' => 'Node.js',
            'rest api' => 'REST API',
            'machine learning' => 'Machine Learning',
            'deep learning' => 'Deep Learning',
            'natural language' => 'NLP',
            'artificial intelligence' => 'AI',
        ];

        $normalized = strtolower(trim($input));
        
        // Protect multi-word skills by replacing with placeholders
        $placeholders = [];
        $counter = 0;
        foreach ($multiWordSkills as $pattern => $replacement) {
            $placeholder = "@@SKILL{$counter}@@";
            $placeholders[$placeholder] = $replacement;
            $normalized = str_replace($pattern, $placeholder, $normalized);
            $counter++;
        }

        // Now split by spaces if no commas found
        if (strpos($normalized, ',') === false) {
            $parts = preg_split('/\s+/', $normalized);
            $parts = array_filter($parts); // Remove empty strings
            $normalized = implode(', ', $parts);
        }

        // Fix common typos and casing issues
        $corrections = [
            '/\baws\b/i' => 'AWS',
            '/\bphp\b/i' => 'PHP',
            '/\bpython\b/i' => 'Python',
            '/\bjavascript\b/i' => 'JavaScript',
            '/\breact\b/i' => 'React',
            '/\bnode\b/i' => 'Node.js',
            '/\bgithub\b/i' => 'GitHub',
            '/\bgit\b/i' => 'Git',
            '/\bdocker\b/i' => 'Docker',
            '/\bkubernetes\b/i' => 'Kubernetes',
            '/\bhtml\b/i' => 'HTML',
            '/\bcss\b/i' => 'CSS',
            '/\bsql\b/i' => 'SQL',
            '/\bnosql\b/i' => 'NoSQL',
            '/\bai\b/i' => 'AI',
            '/\bml\b/i' => 'Machine Learning',
            '/\btnsorflow\b/i' => 'TensorFlow',
            '/\bpandas\b/i' => 'Pandas',
            '/\bnumpy\b/i' => 'NumPy',
        ];

        foreach ($corrections as $pattern => $replacement) {
            $normalized = preg_replace($pattern, $replacement, $normalized);
        }

        // Restore multi-word skills from placeholders
        foreach ($placeholders as $placeholder => $skill) {
            $normalized = str_replace(strtolower($placeholder), $skill, $normalized);
            $normalized = str_replace($placeholder, $skill, $normalized);
        }

        // Remove unwanted symbols and single ampersands, "vs", "and", "or"
        $normalized = preg_replace('/\s*&\s*/', ' & ', $normalized); // Normalize ampersands
        $normalized = preg_replace('/,\s*,/', ',', $normalized); // Remove consecutive commas
        
        // Split and clean skills
        $skills = array_map('trim', explode(',', $normalized));
        $skills = array_filter($skills); // Remove empty strings
        
        // Remove invalid skills (single letters except known langs, very short or nonsense words)
        $validSkills = [];
        $knownSingleLetters = ['C', 'R', 'Go', 'Java'];
        
        foreach ($skills as $skill) {
            $skill = trim($skill);
            
            // Skip completely empty
            if (empty($skill)) continue;
            
            // Skip common words that aren't skills
            if (in_array(strtolower($skill), ['&', 'vs', 'and', 'or', 'the', 'a', 'an', 'in', 'to', 'for', 'with'])) {
                continue;
            }
            
            // Skip very short skills (less than 2 chars) unless they're known
            if (strlen($skill) < 2 && !in_array($skill, $knownSingleLetters)) {
                continue;
            }
            
            // Skip if it's just numbers or symbols
            if (preg_match('/^[\d\s&\-\.]+$/', $skill)) {
                continue;
            }
            
            $validSkills[] = $skill;
        }
        
        // Remove case-insensitive duplicates
        $seen = [];
        $unique = [];
        foreach ($validSkills as $skill) {
            $lower = strtolower($skill);
            if (!isset($seen[$lower])) {
                $seen[$lower] = true;
                $unique[] = $skill;
            }
        }

        return implode(', ', $unique);
    }

    /**
     * Case-insensitive skill matching
     * Checks if a required skill is found in extracted skills
     */
    private function skillMatches(string $requiredSkill, array $extractedSkills): bool
    {
        $required = strtolower(trim($requiredSkill));
        
        foreach ($extractedSkills as $extracted) {
            $extracted_lower = strtolower(trim($extracted));
            
            // Exact match
            if ($required === $extracted_lower) {
                return true;
            }
            
            // Partial matches for common variations
            if (strpos($extracted_lower, $required) !== false || strpos($required, $extracted_lower) !== false) {
                // But avoid false positives
                $minLength = min(strlen($required), strlen($extracted_lower));
                if ($minLength > 3) { // Only partial match if both are substantial
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * Fix common JSON syntax errors
     */
    private function fixJsonSyntax(string $json): string
    {
        // First, properly escape unescaped newlines and special chars within string values
        $json = preg_replace_callback(
            '/"([^"]*(?:\\.[^"]*)*)"/',
            function($matches) {
                $value = $matches[1];
                // Unescape already escaped characters first
                $value = str_replace(['\\n', '\\r', '\\t'], ["\n", "\r", "\t"], $value);
                // Then re-escape them properly
                $value = str_replace(["\n", "\r", "\t"], ['\\n', '\\r', '\\t'], $value);
                // Escape unescaped quotes
                $value = str_replace('"', '\\"', $value);
                return '"' . $value . '"';
            },
            $json
        );
        
        // Remove control characters that shouldn't be in JSON
        $json = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $json);
        
        // Fix single quotes to double quotes in JSON values (but not in escaped strings)
        $json = preg_replace("/: '([^']*)'([,\}])/", ': "$1"$2', $json);
        
        // Fix unquoted keys
        $json = preg_replace('/([,\{]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/', '$1"$2"$3', $json);
        
        // Fix trailing commas before closing brackets
        $json = preg_replace('/,(\s*[\]\}])/', '$1', $json);
        
        // Normalize whitespace outside of strings
        $json = preg_replace('/\s*:\s*/', ': ', $json);
        $json = preg_replace('/\s*,\s*/', ', ', $json);
        
        $json = trim($json);
        
        // Fix missing closing braces and brackets
        $openBraces = substr_count($json, '{') - substr_count($json, '}');
        $openBrackets = substr_count($json, '[') - substr_count($json, ']');
        
        // Add missing closing brackets first, then braces
        if ($openBrackets > 0) {
            $json .= str_repeat(']', $openBrackets);
        }
        if ($openBraces > 0) {
            $json .= str_repeat('}', $openBraces);
        }
        
        return trim($json);
    }

    /**
     * Extract and rebuild JSON from malformed response
     * Attempts to salvage data even if JSON is severely malformed
     */
    private function extractAndRebuildJson(string $content): ?array
    {
        try {
            // Use regex to extract key-value pairs
            $data = [];
            
            // Extract candidate_name
            if (preg_match('/"candidate_name"\s*:\s*"([^"]*)"/', $content, $matches)) {
                $data['candidate_name'] = $matches[1];
            }
            
            // Extract email
            if (preg_match('/"email"\s*:\s*"([^"]*)"/', $content, $matches)) {
                $data['email'] = $matches[1];
            }
            
            // Extract phone
            if (preg_match('/"phone"\s*:\s*"([^"]*)"/', $content, $matches)) {
                $data['phone'] = $matches[1];
            }
            
            // Extract summary (handle newlines)
            if (preg_match('/"summary"\s*:\s*"([^"]*(?:\\\\.[^"]*)*)"/', $content, $matches)) {
                $data['summary'] = str_replace(['\\n', '\\r', '\\t'], [' ', ' ', ' '], $matches[1]);
            }
            
            // Extract arrays using regex
            $data['extracted_skills'] = $this->extractJsonArray($content, 'extracted_skills');
            $data['matched_skills'] = $this->extractJsonArray($content, 'matched_skills');
            $data['missing_skills'] = $this->extractJsonArray($content, 'missing_skills');
            $data['education'] = $this->extractJsonArray($content, 'education');
            $data['strengths'] = $this->extractJsonArray($content, 'strengths');
            $data['concerns'] = $this->extractJsonArray($content, 'concerns');
            $data['interview_questions'] = $this->extractJsonArray($content, 'interview_questions');
            
            // Extract numbers
            if (preg_match('/"experience_years"\s*:\s*(\d+)/', $content, $matches)) {
                $data['experience_years'] = (int)$matches[1];
            }
            
            if (preg_match('/"skill_match_percentage"\s*:\s*(\d+)/', $content, $matches)) {
                $data['skill_match_percentage'] = (int)$matches[1];
            }
            
            if (preg_match('/"overall_score"\s*:\s*(\d+)/', $content, $matches)) {
                $data['overall_score'] = (int)$matches[1];
            }
            
            // Extract recommendation
            if (preg_match('/"recommendation"\s*:\s*"([^"]*)"/', $content, $matches)) {
                $data['recommendation'] = $matches[1];
            }
            
            return !empty($data) ? $data : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Extract JSON array from content using flexible regex
     */
    private function extractJsonArray(string $content, string $key): array
    {
        // Try first with proper JSON array pattern
        $pattern = '/"' . preg_quote($key) . '"\s*:\s*\[([^\]]*)\]';
        
        if (preg_match($pattern, $content, $matches)) {
            $arrayContent = $matches[1];
            $items = [];
            
            // Extract quoted strings
            if (preg_match_all('/"([^"]*)"/', $arrayContent, $matches)) {
                $items = array_filter(array_map('trim', $matches[1]));
            }
            
            return array_values($items);
        }
        
        // Fallback for malformed arrays (missing closing bracket)
        $pattern = '/"' . preg_quote($key) . '"\s*:\s*\[([^,\}]*)(?:,|\}|$)';
        
        if (preg_match($pattern, $content, $matches)) {
            $arrayContent = $matches[1];
            $items = [];
            
            // Extract quoted strings
            if (preg_match_all('/"([^"]*)"/', $arrayContent, $matches)) {
                $items = array_filter(array_map('trim', $matches[1]));
            }
            
            return array_values($items);
        }
        
        return [];
    }
}
