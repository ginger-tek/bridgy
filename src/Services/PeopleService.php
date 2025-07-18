<?php

namespace App\Services;

use App\Data\DB;

class PeopleService
{
  protected DB $db;
  public function __construct(DB $db = new DB)
  {
    $this->db = $db;
  }

  public function create(array|object $data): object|bool
  {
    $this->db->run(
      'INSERT INTO people (firstName, lastName, email) VALUES (:firstName, :lastName, :email)',
      [
        ':firstName' => $data->firstName ?? '',
        ':lastName' => $data->lastName ?? '',
        ':email' => $data->email ?? ''
      ]
    );
    return $this->getById($this->db->lastInsertId());
  }

  public function getAll(): array
  {
    return $this->db->run('SELECT * FROM v_people')->fetchAll();
  }

  public function getById($id): object|bool
  {
    return $this->db->run('SELECT * FROM v_people WHERE id = :id', [':id' => $id])->fetch();
  }

  public function update(array|object $data): object|bool
  {
    $this->db->run(
      'UPDATE people SET firstName = :firstName, lastName = :lastName, email = :email, modified = CURRENT_TIMESTAMP WHERE id = :id',
      [
        ':firstName' => $data->firstName ?? '',
        ':lastName' => $data->lastName ?? '',
        ':email' => $data->email ?? '',
        ':id' => $data->id
      ]
    );
    return $this->getById($data->id);
  }

  public function delete($id): bool
  {
    return $this->db->run('DELETE FROM people WHERE id = :id', [':id' => $id])->rowCount() == 1;
  }
}