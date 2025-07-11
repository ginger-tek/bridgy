<?php

require_once __DIR__ . '/vendor/autoload.php';

if (file_exists('.env'))
  foreach (parse_ini_file('.env') as $k => $v)
    putenv("$k=$v");

use GingerTek\Routy;
use Bridgy\Controllers\ApiRoutes;

$app = new Routy;

$app->use(function (Routy $app) {
  session_start(['read_and_close' => true]);
  if ($_SESSION['user'] ?? false)
    $app->setCtx('user', $_SESSION['user']);
});

$app->use(function (Routy $app) {
  if (preg_match('#/nm/#', $app->uri)) {
    $path = 'node_modules/' . str_replace('/nm/', '', $app->uri);
    if (!file_exists($path))
      $app->end(404);
    $app->sendData($path, match (pathinfo($app->uri, PATHINFO_EXTENSION)) {
      'js' => 'application/javascript',
      'css' => 'text/css',
      'html' => 'text/html',
      'json' => 'application/json',
      'svg' => 'image/svg+xml',
      'png' => 'image/png',
      default => 'text/plain'
    });
  }
});
$app->group('/api', ApiRoutes::index(...));
$app->serveStatic('public');