<?php

require_once __DIR__ . '/vendor/autoload.php';

if (file_exists('.env'))
  foreach (parse_ini_file('.env') as $k => $v)
    putenv("$k=$v");

use GingerTek\Routy;
use Bridgy\Controllers\ApiRoutes;

$app = new Routy;

$app->use(function (Routy $app) {
  if (preg_match('#/nm/#', $app->uri))
    $app->sendData('node_modules/' . str_replace('/nm/', '', $app->uri), match (pathinfo($app->uri, PATHINFO_EXTENSION)) {
      'js' => 'application/javascript',
      'css' => 'text/css',
      'html' => 'text/html',
      'json' => 'application/json',
      default => 'text/plain'
    });
});
$app->group('/api', ApiRoutes::index(...));
$app->serveStatic('public');