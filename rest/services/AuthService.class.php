
<?php
require_once(__DIR__ . '/../dao/UserDao.class.php');
require_once(__DIR__ . '/../services/BaseService.class.php');

use Firebase\JWT\JWT;

class AuthService extends BaseService
{

    public function __construct()
    {
        parent::__construct(new UserDao());
    }

    public function findByEmail($email)
    {
        return $this->dao->getByEmail($email);
    }

    public function login($data)
    {
        $user = $this->findByEmail($data['email']);
        if (!$user) {
            return Flight::halt(404, json_encode(['message' => 'User Does Not Exist']));
        }
        if (hash('sha256', $data['password']) == $user['passwordhash']) {
            $jwtPayload = ['id' => $user['user_id'], 'email' => $user['email'], 'username' => $user['username'], 'createdate' => $user['createdate']];
            $jwt = JWT::encode($jwtPayload, JWT_SECRET, 'HS256');
            return Flight::json(['token' => $jwt, 'user' => ['id' => $user['user_id'], 'email' => $user['email'], 'username' => $user['username']]]);
        } else {
            return Flight::halt(401, json_encode(['message' => 'Incorrect Credentials']));
        }
    }

    public function register($data)
    {
        if ($this->dao->getByEmail($data['email'])) {
            return Flight::halt(404, json_encode(['message' => 'User Already Exists']));
        }

        $data['createdate'] = date('Y-m-d H:i:s');

        $user = parent::add(['email' => $data['email'], 'passwordhash' => hash('sha256', $data['password']), 'username' => $data['username'], 'createdate' => $data['createdate']]);
        $jwtPayload = ['id' => $user['id'], 'email' => $user['email'], 'username' => $user['username'], 'createdate' => $user['createdate']];
        $jwt = JWT::encode($jwtPayload, JWT_SECRET, 'HS256');
        return Flight::json(['token' => $jwt, 'user' => ['id' => $user['id'], 'email' => $user['email'], 'username' => $user['username']]]);
    }

    public function logout()
    {
        setcookie('jwt', '', time() - 3600, '/');
        return Flight::json(['message' => 'Logged out successfully']);
    }
}
