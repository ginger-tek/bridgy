<?php

namespace Bridgy\Data;

class DB
{
  protected \PDO $pdo;

  public function __construct()
  {
    $this->pdo = new \PDO(
      getenv('DB_DSN'),
      getenv('DB_USER') ?? null,
      getenv('DB_PASS') ?? null,
      [
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_OBJ,
      ]
    );
    $this->pdo->exec('PRAGMA foreign_keys=ON');
    $this->pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));
  }

  public function run(string $sql, ?array $vals = []): \PDOStatement
  {
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute($vals);
    return $stmt;
  }

  public function lastInsertId(): string
  {
    return $this->pdo->lastInsertId();
  }
}