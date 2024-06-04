<?php

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL ^ (E_NOTICE | E_DEPRECATED));

// class Config
// {
//   public static function DB_NAME()
//   {
//     return Config::get_env("DB_NAME", "web-live-coding");
//   }
//   public static function DB_PORT()
//   {
//     return Config::get_env("DB_PORT", 3306);
//   }
//   public static function DB_USER()
//   {
//     return Config::get_env("DB_USER", 'root');
//   }
//   public static function DB_PASSWORD()
//   {
//     return Config::get_env("DB_PASSWORD", '12345678');
//   }
//   public static function DB_HOST()
//   {
//     return Config::get_env("DB_HOST", '127.0.0.1');
//   }
//   public static function JWT_SECRET()
//   {
//     return Config::get_env("DB_HOST", ',dpPL,Se%fM-UVQBwf/X0T&B!DF6%}');
//   }
//   public static function get_env($name, $default)
//   {
//     return isset($_ENV[$name]) && trim($_ENV[$name]) != "" ? $_ENV[$name] : $default;
//   }
// }
define('DB_NAME', $_ENV['DB_NAME']);
define('DB_PORT', $_ENV['DB_PORT']);
define('DB_USER', $_ENV['DB_USER']);
define('DB_PASS', $_ENV['DB_PASS']);
define('DB_HOST', $_ENV['DB_HOST']);


define('JWT_SECRET', $_ENV['JWT_SECRET']);