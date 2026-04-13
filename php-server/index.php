<?php
// php-server/index.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// A simple router for the AgroConnect PHP backend

// 1. Setup environment
include_once 'include/helpers.php'; // Includes CORS headers

$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$path = str_replace($scriptName, '', $requestUri);
$path = strtok($path, '?'); // Remove query params
$path = trim($path, '/');

// Normalize: Remove leading 'api/' or 'php-server/' if present
$path = preg_replace('/^(api\/|php-server\/)/', '', $path);

if ($path === 'auth/register') {
    include 'api/register.php';
} elseif ($path === 'auth/login') {
    include 'api/login.php';
} elseif ($path === 'crops') {
    include 'api/crops.php';
} elseif ($path === 'orders') {
    include 'api/orders.php';
} elseif ($path === 'ai/guide') {
    include 'api/ai-guide.php';
} elseif ($path === 'ai/detect') {
    include 'api/ai.php';
} elseif ($path === 'ai/bag_scan') {
    include 'api/ai-bag-scan.php';
} elseif ($path === 'ai/quiz-gen') {
    include 'api/ai-quiz-gen.php';
} elseif ($path === 'logistics') {
    include 'api/logistics.php';
} elseif ($path === 'admin/stats') {
    include 'api/admin.php';
} else {
    sendResponse(['error' => 'Endpoint not found: ' . $path, 'request_uri' => $_SERVER['REQUEST_URI']], 404);
}
?>
