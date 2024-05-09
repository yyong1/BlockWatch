<?php
Flight::group('/auth', function() {
    /**
     * @OA\Post(
     *      path="/auth/login",
     *      tags={"auth"},
     *      summary="Login to system",
     *      @OA\Response(
     *           response=200,
     *           description="User data and JWT token"
     *      ),
     *      @OA\RequestBody(
     *          description="User credentials",
     *          @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", required=true, type="string", example="exampleMail@gmail.com"),
     *             @OA\Property(property="password", required=true, type="string", example="pass")
     *           )
     *      ),
     * )
     */
    Flight::route('POST /login', function () {
        $data = json_decode(Flight::request()->getBody(),true);
        return Flight::authService()->login($data);
    });

    /**
     * @OA\Post(
     *      path="/auth/signup",
     *      tags={"auth"},
     *      summary="Signup to system",
     *      security={
     *          {"ApiKey": {}}
     *      },
     *      @OA\Response(
     *           response=200,
     *           description="Success response or exception"
     *      ),
     * )
     */
    Flight::route('POST /signup', function () {
        $data = json_decode(Flight::request()->getBody(),true);
        return Flight::authService()->register($data);
    });

    Flight::route('POST /logout', function () {
        return Flight::authService()->logout();
    });
});