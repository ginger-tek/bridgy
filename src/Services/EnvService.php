<?php

namespace App\Services;

class EnvService
{
  public static function load(?string $path = '.env')
  {
    if (file_exists($path))
      foreach (parse_ini_file($path) as $k => $v)
        putenv("$k=$v");
  }
}