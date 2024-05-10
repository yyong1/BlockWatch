<?php
Flight::group('/assets', function() {
    /**
 * @OA\Get(
 *     path="/assets/",
 *     @OA\Response(response="200", description="An example resource")
 * )
 */
    Flight::route('GET /', function () {
        return Flight::assetService()->get_all();
    });

    
    // Flight::route('POST /signup', function () {
    //     $data = json_decode(Flight::request()->getBody(),true);
    //     return Flight::authService()->register($data);
    // });

    Flight::route('POST /', function () {
        return Flight::assetService()->logout();
    });
});