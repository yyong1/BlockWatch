<?php

require_once('../vendor/autoload.php');

require_once('./dao/UserDao.class.php');

require_once('./routes/AuthRoutes.php');
require_once('./routes/AssetRoutes.php');
require_once('./routes/FavoriteRoutes.php');

require_once('./services/AuthService.class.php');
require_once('./services/AssetService.class.php');
require_once('./services/FavoriteService.class.php');
// require_once('./services/FeedbackService.class.php');

Flight::register('assetService', 'AssetService');
Flight::register('authService', 'AuthService');
Flight::register('favoriteService', 'FavoriteService');

Flight::start();
