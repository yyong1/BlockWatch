<?php
Flight::group('/assets', function () {
    /**
     * @OA\Get(
     *     path="/assets/",
     *     @OA\Response(response="200", description="An example resource")
     * )
     */
    Flight::route('GET /', function () {
        $data = Flight::assetService()->getAssets();
        if (!empty($data)) {
            Flight::json($data, 200);
        } else {
            Flight::json(['message' => 'No assets found'], 404);
        }
    });

    Flight::route('GET /symbol', function () {
        $data = Flight::assetService()->get_asset_symbol();
        if (!empty($data)) {
            Flight::json($data, 200);
        } else {
            Flight::json(['message' => 'No symbol found'], 404);
        }
    });

    Flight::route('POST /', function () {
        $data = Flight::request()->data->getData();
        Flight::assetService()->add($data);
        if ($data) {
            Flight::json($data, 201);
        } else {
            Flight::json(['message' => 'No assets found'], 404);
        }
    });

    Flight::route('GET /@id', function ($id) {
        return Flight::assetService()->get_by_id($id);
    });

    Flight::route('PATCH /', function () {
        return Flight::assetService()->update_database_asset();
    });
});
