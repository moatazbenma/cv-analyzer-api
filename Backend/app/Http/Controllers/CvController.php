<?php

namespace App\Http\Controllers;

use App\Services\CvAnalyzerService;
use Illuminate\Http\Request;
use Smalot\PdfParser\Parser;

class CvController extends Controller
{
    public function __construct(
        private CvAnalyzerService $analyzerService
    ) {}

    public function analyze(Request $request)
    {
        // Check if this is a bulk request (multiple files)
        if ($request->hasFile('cv_file') && is_array($request->file('cv_file'))) {
            return $this->analyzeBulk($request);
        }

        // Single file analysis
        $validated = $request->validate([
            'required_skills' => ['required', 'string'],
            'role_level' => ['required', 'string'],
            'cv_file' => ['required', 'file', 'mimes:pdf', 'max:2048']
        ]);

        $cvfile = $request->file('cv_file');

        // Extract text from PDF
        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($cvfile->getPathname());
            $cvText = $pdf->getText();
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to parse PDF file: ' . $e->getMessage(),
            ], 422);
        }

        // Analyze CV with AI
        $result = $this->analyzerService->analyze(
            $cvText,
            $validated['required_skills'],
            $validated['role_level']
        );

        if (!$result['success']) {
            return response()->json([
                'status' => 'error',
                'message' => $result['error'],
                'raw_response' => $result['raw_response'] ?? null,
            ], 422);
        }

        return response()->json([
            'status' => 'success',
            'file_name' => $cvfile->getClientOriginalName(),
            'file_size_kb' => round($cvfile->getSize() / 1024),
            'analysis' => $result['analysis'],
        ]);
    }

    private function analyzeBulk(Request $request)
    {
        $validated = $request->validate([
            'required_skills' => ['required', 'string'],
            'role_level' => ['required', 'string'],
            'cv_file' => ['required', 'array', 'min:1'],
            'cv_file.*' => ['required', 'file', 'mimes:pdf', 'max:2048']
        ]);

        $cvFiles = $request->file('cv_file');
        $results = [];

        foreach ($cvFiles as $index => $cvFile) {
            try {
                // Extract text from PDF
                $parser = new Parser();
                $pdf = $parser->parseFile($cvFile->getPathname());
                $cvText = $pdf->getText();

                // Analyze CV with AI
                $result = $this->analyzerService->analyze(
                    $cvText,
                    $validated['required_skills'],
                    $validated['role_level']
                );

                if ($result['success']) {
                    $results[] = [
                        'status' => 'success',
                        'file_name' => $cvFile->getClientOriginalName(),
                        'file_size_kb' => round($cvFile->getSize() / 1024),
                        'file_index' => $index + 1,
                        'analysis' => $result['analysis'],
                    ];
                } else {
                    $results[] = [
                        'status' => 'error',
                        'error' => $result['error'],
                        'file_name' => $cvFile->getClientOriginalName(),
                        'file_index' => $index + 1,
                        'raw_response' => $result['raw_response'] ?? null,
                    ];
                }

            } catch (\Exception $e) {
                $results[] = [
                    'status' => 'error',
                    'error' => 'Failed to parse PDF file: ' . $e->getMessage(),
                    'file_name' => $cvFile->getClientOriginalName(),
                    'file_index' => $index + 1,
                ];
            }
        }

        // Sort results by overall score (highest first), errors at the end
        $sortedResults = collect($results)->sort(function ($a, $b) {
            if ($a['status'] === 'error' && $b['status'] === 'error') {
                return 0;
            }
            if ($a['status'] === 'error') {
                return 1;
            }
            if ($b['status'] === 'error') {
                return -1;
            }

            $scoreA = $a['analysis']['overall_score'] ?? 0;
            $scoreB = $b['analysis']['overall_score'] ?? 0;

            return $scoreB <=> $scoreA;
        })->values()->all();

        return response()->json([
            'status' => 'success',
            'total_files' => count($cvFiles),
            'results' => $sortedResults,
        ]);
    }
}


