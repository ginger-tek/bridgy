<?php

require_once __DIR__ . '/vendor/autoload.php';

\App\Services\EnvService::load();

$app = new \GingerTek\Routy;

$app->use(\App\Middlewares\AuthMiddleware::index(...));
$app->group('/api', \App\Controllers\ApiRoutes::index(...));
$app->serveStatic('/nm', 'node_modules');
$app->serveStatic('/', 'public');