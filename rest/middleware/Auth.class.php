<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth
{
    public function before($params)
    {
        $authHeader = Flight::request()->getHeader('Auth');
        $token = substr($authHeader, 7);
        error_log("Received token: " . $token);

        if (empty($token)) {
            return Flight::halt(401, json_encode(['message' => 'Missing Token' . $authHeader . ' ' . $token]));
        }
        try {
            $payload = (array)JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
            error_log("Payload: " . print_r($payload, true));
        } catch (Exception $e) {
            error_log("JWT Exception: " . $e->getMessage());
            return Flight::halt(401, json_encode(['message' => 'Invalid Token']));
        }
    }
}
