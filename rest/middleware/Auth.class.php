<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth
{
    public function before($params)
    {
        $token = substr(Flight::request()->getHeader('Authorization'), 7);
        if (empty($token)) {
            return Flight::halt(401, json_encode(['message' => 'Missing Token']));
        }
        try {
            $payload = (array)JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
        } catch (Exception $e) {
            return Flight::halt(401, json_encode(['message' => 'Invalid Token']));
        }
        $user = Flight::authService()->findByEmail($payload['email']);
        if ($user) {
            $assetService = new AssetService();
            $assetService->update_database_asset();
            unset($user['password']);
            return true;
        } else {
            return Flight::halt(401, json_encode(['message' => 'Invalid Token']));
        }
    }
}
