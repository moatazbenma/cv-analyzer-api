<?php

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'https://api.bytez.com/models/v2/Qwen/Qwen3-4B',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 120,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        'messages' => [
            ['role' => 'user', 'content' => 'Say hello in one word']
        ]
    ]),
    CURLOPT_HTTPHEADER => [
        'Authorization: da431de45a2dc421e476aa00e111e7f7',
        'Content-Type: application/json'
    ]
]);

$response = curl_exec($ch);
$error = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo $error ? "Error: $error\n" : "Response: $response\n";
