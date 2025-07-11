<?php

namespace Bridgy\Services;

use Bridgy\Data\DB;

class ClassAssignmentsService
{
  protected DB $db;
  public function __construct(DB $db = new DB)
  {
    $this->db = $db;
  }

  public function create(array|object $data): object|bool
  {
    $this->db->run(
      'INSERT INTO class_assignments (classId, personId, role) VALUES (:classId, :personId, :role)',
      [
        ':classId' => $data->classId,
        ':personId' => $data->personId,
        ':role' => $data->role ?? 'student',
      ]
    );
    return $this->getById($this->db->lastInsertId());
  }

  public function getAll(?array $filters = []): array
  {
    $clauses = $vals = [];
    if ($filters['classId'] ?? false) {
      $clauses[] = 'classId = :classId';
      $vals[':classId'] = $filters['classId'];
    }
    if ($filters['personId'] ?? false) {
      $clauses[] = 'personId = :personId';
      $vals[':personId'] = $filters['personId'];
    }
    if ($filters['isInstructor'] ?? false) {
      $clauses[] = "role in ('instructor', 'assistant')";
    } elseif ($filters['isStudent'] ?? false) {
      return $this->db->run("SELECT * FROM v_students")->fetchAll();
    }
    $clauses = $clauses ? 'WHERE ' . join(' AND ', $clauses) : '';
    return $this->db->run("SELECT * FROM v_class_assignments $clauses", $vals)->fetchAll();
  }

  public function getById($id): object|bool
  {
    return $this->db->run('SELECT * FROM v_class_assignments WHERE id = :id', [':id' => $id])->fetch();
  }

  public function update(array|object $data): object|bool
  {
    $this->db->run(
      'UPDATE class_assignments SET classId = :classId, personId = :personId, role = :role, modified = CURRENT_TIMESTAMP WHERE id = :id',
      [
        ':classId' => $data->classId,
        ':personId' => $data->personId,
        ':role' => $data->role ?? 'student',
        ':id' => $data->id
      ]
    );
    return $this->getById($data->id);
  }

  public function delete($id): bool
  {
    return $this->db->run("DELETE FROM class_assignments WHERE id = :id", [':id' => $id])->rowCount() == 1;
  }
}