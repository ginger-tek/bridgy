<?php

namespace Bridgy\Services;

class Logger
{
  public static function write(string $message, ?string $level = 'error'): void
  {
    $logFile = 'data/logs/app.err';
    if (!file_exists($logFile)) {
      if (!mkdir(dirname($logFile), 0755, true) && !is_dir(dirname($logFile))) {
        error_log("Failed to create log directory: " . dirname($logFile));
        return;
      }
      touch($logFile);
    }
    $h = fopen($logFile, 'a');
    if ($h) {
      stream_set_blocking($h, false);
      fwrite($h, sprintf('%s | [%s] %s', date('c'), strtoupper($level), $message) . "\n");
      fclose($h);
    } else {
      error_log("Failed to open log file: $logFile");
    }
  }

  public static function error(string $message): void
  {
    self::write($message, 'error');
  }

  public static function info(string $message): void
  {
    self::write($message, 'info');
  }

  public static function warning(string $message): void
  {
    self::write($message, 'warning');
  }
}