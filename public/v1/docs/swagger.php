<?php

require __DIR__ . '/../../../vendor/autoload.php';

define('BASE_URL', 'http://localhost:8888/BlockWatch/rest/');

if($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == '127.0.0.1') {
  define('BASE_URL', 'http://localhost:8888/BlockWatch/rest/');
} else {
  define('BASE_URL', $_SERVER['SERVER_NAME'] . '/rest/');
}

error_reporting(0);

$openapi = \OpenApi\Generator::scan(['../../../rest', './'], ['pattern' => '*.php']);
// $openapi = \OpenApi\Util::finder(['../../../rest/routes', './'], NULL, '*.php');
// $openapi = \OpenApi\scan(['../../../rest', './'], ['pattern' => '*.php']);

header('Content-Type: application/json');
echo $openapi->toJson();
?>
