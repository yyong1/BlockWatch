<?php

require_once(__DIR__ . '/../dao/UserDao.class.php');
require_once(__DIR__ . '/../services/BaseService.class.php');


class AuthService extends BaseService
{

    public function __construct()
    {
        parent::__construct(new UserDao());
    }
}