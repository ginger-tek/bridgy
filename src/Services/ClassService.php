<?php

namespace Bridgy\Services;

use Bridgy\Data\DB;

class ClassService
{
  protected DB $db;
  public function __construct(DB $db = new DB)
  {
    $this->db = $db;
  }

  public function create(array|object $data): object|bool
  {
    $this->db->run(
      'INSERT INTO classes (title, description) VALUES (:title, :description)',
      [
        ':title' => $data->title,
        ':description' => $data->description ?? ''
      ]
    );
    return $this->getById($this->db->lastInsertId());
  }

  public function getAll(): array
  {
    return $this->db->run('SELECT * FROM v_classes')->fetchAll();
  }

  public function getById($id): object|bool
  {
    return $this->db->run('SELECT * FROM v_classes WHERE id = :id', [':id' => $id])->fetch();
  }

  public function update(array|object $data): object|bool
  {
    $this->db->run(
      'UPDATE classes SET title = :title, description = :description, modified = CURRENT_TIMESTAMP WHERE id = :id',
      [
        ':title' => $data->title,
        ':description' => $data->description ?? '',
        ':id' => $data->id
      ]
    );
    return $this->getById($data->id);
  }

  public function delete($id): bool
  {
    return $this->db->run('DELETE FROM classes WHERE id = :id', [':id' => $id])->rowCount() == 1;
  }
}