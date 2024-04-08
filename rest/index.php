<?php

require_once('../vendor/autoload.php');

require_once('./dao/UserDao.class.php');
require_once('./routes/AuthRoutes.php');
require_once('./services/AuthService.class.php');

Flight::register('authService', 'AuthService');

Flight::start();
