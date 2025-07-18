<?php

namespace App\Middlewares;

use GingerTek\Routy;

class AuthMiddleware
{
  public static function index(Routy $app)
  {
    session_start(['read_and_close' => true]);
    if (isset($_SESSION['user']))
      $app->setCtx('user', $_SESSION['user']);
  }

  public static function auth(Routy $app)
  {
    if (!$app->getCtx('user'))
      $app->status(401)->sendJson(['error' => 'Unauthorized']);
  }

  public static function exists($svc, $id, $errText): callable
  {
    return function (Routy $app) use ($svc, $id, $errText) {
      if (!$svc->getById($app->params->{$id}))
        $app->status(404)->sendJson(['error' => $errText]);
    };
  }
}