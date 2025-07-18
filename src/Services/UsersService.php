<?php

namespace App\Services;

use App\Data\DB;

class UsersService
{
  protected DB $db;
  public function __construct(DB $db = new DB)
  {
    $this->db = $db;
  }

  public function create(array|object $data): bool|object
  {
    $this->db->run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [
        $data->username,
        $data->email,
        password_hash($data->password, PASSWORD_BCRYPT)
      ]
    );
    return $this->getById($this->db->lastInsertId());
  }

  public function getById(int $id): bool|object
  {
    return $this->db->run("SELECT * FROM users WHERE id = ?", [$id])->fetch();
  }

  public function getByUsername(string $username): bool|object
  {
    return $this->db->run("SELECT * FROM users WHERE username = ? and isActive = 1", [$username])->fetch();
  }

  public function getAll(): array
  {
    return $this->db->run("SELECT * FROM users")->fetchAll();
  }
}