<?php

require_once('../vendor/autoload.php');

require_once('./dao/UserDao.class.php');
require_once('./routes/AuthRoutes.php');
require_once('./services/AuthService.class.php');
require_once('./services/AssetService.class.php');
// require_once('./services/FeedbackService.class.php');

Flight::register('assetService', 'AssetService');
Flight::register('authService', 'AuthService');

Flight::start();
