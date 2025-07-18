<?php

namespace App\Controllers;

use GingerTek\Routy;
use App\Middlewares\AuthMiddleware;
use App\Services\Logger;
use App\Services\ClassAssignmentsService;
use App\Services\ClassService;
use App\Services\PeopleService;
use App\Services\UsersService;

class ApiRoutes
{
  public static function index($app)
  {
    try {
      $app->post('/login', function ($app) {
        $data = $app->getBody();
        if (empty($data->username) || empty($data->password))
          $app->sendJson(['error' => 'Invalid username or password']);
        $user = (new UsersService)->getByUsername(trim(strtolower($data->username)));
        if (!$user || !password_verify(trim($data->password), $user->password))
          $app->status(401)->sendJson(['error' => 'Invalid username or password']);
        session_start();
        unset($user->password);
        $_SESSION['user'] = $user;
        $app->setCtx('user', $_SESSION['user']);
        session_write_close();
        $app->sendJson(['result' => 'success']);
      });

      $app->get('/session', fn($app) => $app->sendJson($app->getCtx('user') ?? ['' => '']));

      $app->post('/logout', AuthMiddleware::auth(...), function ($app) {
        session_start();
        unset($_SESSION['user']);
        session_write_close();
        $app->setCtx('user', null);
        $app->sendJson(['result' => 'success']);
      });

      $app->group('/people', AuthMiddleware::auth(...), function ($app) {
        $svc = new PeopleService;
        $app->post('/', fn($app) => $app->sendJson($svc->create($app->getBody())));
        $app->get('/', fn($app) => $app->sendJson($svc->getAll()));
        $guard = AuthMiddleware::exists($svc, $app->params->id, 'Person not found');
        $app->get('/:id', $guard(...), fn($app) => $app->sendJson($svc->getById($app->params->id)));
        $app->get('/:id/classes', $guard(...), fn($app) => $app->sendJson((new ClassAssignmentsService)->getAll(['personId' => $app->params->id])));
        $app->put('/:id', $guard(...), fn($app) => $app->sendJson($svc->update($app->getBody())));
        $app->delete('/:id', $guard(...), fn($app) => $app->sendJson(['result' => $svc->delete($app->params->id)]));
      });

      $app->group('/classes', AuthMiddleware::auth(...), function (Routy $app) {
        $svc = new ClassService;
        $app->post('/', fn($app) => $app->sendJson($svc->create($app->getBody())));
        $app->get('/', fn($app) => $app->sendJson($svc->getAll()));
        $guard = AuthMiddleware::exists($svc, $app->params->id, 'Class not found');
        $app->get('/:id', $guard(...), fn($app) => $app->sendJson($svc->getById($app->params->id)));
        $app->get('/:id/assignments', $guard(...), fn($app) => $app->sendJson((new ClassAssignmentsService)->getAll(['classId' => $app->params->id])));
        $app->get('/:id/instructors', $guard(...), fn($app) => $app->sendJson((new ClassAssignmentsService)->getAll(['classId' => $app->params->id, 'isInstructor' => true])));
        $app->get('/:id/students', $guard(...), fn($app) => $app->sendJson((new ClassAssignmentsService)->getAll(['classId' => $app->params->id, 'isStudent' => true])));
        $app->put('/:id', $guard(...), fn($app) => $app->sendJson($svc->update($app->getBody())));
        $app->delete('/:id', $guard(...), fn($app) => $app->sendJson(['result' => $svc->delete($app->params->id)]));
      });

      $app->group('/assignments', AuthMiddleware::auth(...), function (Routy $app) {
        $svc = new ClassAssignmentsService;
        $app->post('/', fn($app) => $app->sendJson($svc->create($app->getBody())));
        $app->get('/', fn($app) => $app->sendJson($svc->getAll()));
        $app->get('/students', fn($app) => $app->sendJson((new ClassAssignmentsService)->getAll(['isStudent' => true])));
        $guard = AuthMiddleware::exists($svc, $app->params->id, 'Assignment not found');
        $app->get('/:id', $guard(...), fn($app) => $app->sendJson($svc->getById($app->params->id)));
        $app->put('/:id', $guard(...), fn($app) => $app->sendJson($svc->update($app->getBody())));
        $app->delete('/:id', $guard(...), fn($app) => $app->sendJson(['result' => $svc->delete($app->params->id)]));
      });

      $app->notFound(fn($app) => $app->sendJson(['error' => 'Not Found']));
    } catch (\Exception $e) {
      Logger::error(sprintf('%s %s = %s', $app->method, $app->uri, (string) $e));
      $app->status(500)->sendJson(['error' => 'An error occurred']);
    }
  }
}