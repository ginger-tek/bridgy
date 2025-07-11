<?php

namespace Bridgy\Controllers;

use Bridgy\Services\ClassAssignmentsService;
use GingerTek\Routy;
use Bridgy\Services\ClassService;
use Bridgy\Services\PeopleService;
use Bridgy\Services\Logger;

class ApiRoutes
{
  public static function index($app)
  {
    try {
      $auth = fn($app) => !$app->getCtx('user') ? $app->status(401)->sendJson(['error' => 'Unauthorized']) : false;
      $app->post('/login', function ($app) {
        $data = $app->getBody();
        if (empty($data->username) || empty($data->password))
          $app->sendJson(['error' => 'Invalid username and password']);
        session_start();
        $_SESSION['user'] = (object) ['id' => 1, 'username' => $data->username];
        $app->setCtx('user', $_SESSION['user']);
        session_write_close();
        $app->sendJson(['result' => 'success']);
      });
      $app->get('/session', fn($app) => $app->sendJson($app->getCtx('user') ?? ['' => '']));
      $app->post('/logout', $auth(...), function ($app) {
        session_start();
        unset($_SESSION['user']);
        session_write_close();
        $app->setCtx('user', null);
        $app->sendJson(['result' => 'success']);
      });

      $app->group('/people', $auth(...), function ($app) {
        $svc = new PeopleService;
        $app->post('/', fn($app) => $app->sendJson($svc->create($app->getBody())));
        $app->get('/', fn($app) => $app->sendJson($svc->getAll()));
        $guard = fn($app) => !$svc->getById($app->params->id) ? $app->status(404)->sendJson(['error' => 'Person not found']) : false;
        $app->get('/:id', $guard(...), fn($app) => $app->sendJson($svc->getById($app->params->id)));
        $app->get('/:id/classes', $guard(...), fn($app) => $app->sendJson((new ClassAssignmentsService)->getAll(['personId' => $app->params->id])));
        $app->put('/:id', $guard(...), fn($app) => $app->sendJson($svc->update($app->getBody())));
        $app->delete('/:id', $guard(...), fn($app) => $app->sendJson(['result' => $svc->delete($app->params->id)]));
      });

      $app->group('/classes', $auth(...), function (Routy $app) {
        $svc = new ClassService;
        $app->post('/', fn($app) => $app->sendJson($svc->create($app->getBody())));
        $app->get('/', fn($app) => $app->sendJson($svc->getAll()));
        $guard = fn($app) => !$svc->getById($app->params->id) ? $app->status(404)->sendJson(['error' => 'Class not found']) : false;
        $app->get('/:id', $guard(...), fn($app) => $app->sendJson($svc->getById($app->params->id)));
        $app->get('/:id/assignments', $guard(...), fn($app) => $app->sendJson((new ClassAssignmentsService)->getAll(['classId' => $app->params->id])));
        $app->get('/:id/instructors', $guard(...), fn($app) => $app->sendJson((new ClassAssignmentsService)->getAll(['classId' => $app->params->id, 'isInstructor' => true])));
        $app->get('/:id/students', $guard(...), fn($app) => $app->sendJson((new ClassAssignmentsService)->getAll(['classId' => $app->params->id, 'isStudent' => true])));
        $app->put('/:id', $guard(...), fn($app) => $app->sendJson($svc->update($app->getBody())));
        $app->delete('/:id', $guard(...), fn($app) => $app->sendJson(['result' => $svc->delete($app->params->id)]));
      });

      $app->group('/assignments', $auth(...), function (Routy $app) {
        $svc = new ClassAssignmentsService;
        $app->post('/', fn($app) => $app->sendJson($svc->create($app->getBody())));
        $app->get('/', fn($app) => $app->sendJson($svc->getAll()));
        $app->get('/students', fn($app) => $app->sendJson((new ClassAssignmentsService)->getAll(['isStudent' => true])));
        $guard = fn($app) => !$svc->getById($app->params->id) ? $app->status(404)->sendJson(['error' => 'Assignment not found']) : false;
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