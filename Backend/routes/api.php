<?php

use App\Http\Controllers\CvController;
use Illuminate\Support\Facades\Route;


Route::post('/analyze-cv', [CvController::class, 'analyze']);