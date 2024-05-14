<?php
require_once(__DIR__ . '/../middleware/Auth.class.php');

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

    Flight::route('POST /userAsset/@userId/@assetId', function ($userId, $assetId) {
        $data = Flight::request()->data->getData();
        Flight::assetService()->add_user_asset($userId, $assetId, $data['amount']);
        if ($data) {
            Flight::json($data, 201);
        } else {
            Flight::json(['message' => 'No assets found'], 404);
        }
    });

    Flight::route('GET /userAsset/@userId', function ($userId) {
        $data = Flight::assetService()->get_user_assets($userId);
        Flight::json($data, 200);
    });

    Flight::route('PATCH /userAsset/@userId', function ($userId) {
        $data = Flight::request()->data->getData();
        if (empty($data) || !isset($data['amount'])) {
            Flight::json(['message' => 'Invalid data provided'], 400);
            return;
        }
    
        try {
            Flight::assetService()->update_user_asset($userId, $data['amount']);
            Flight::json(['message' => 'User asset updated successfully'], 200);

        } catch (Exception $e) {
            Flight::json(['message' => 'Failed to update user asset: ' . $e->getMessage()], 500);
        }
    });
    
    

    Flight::route('DELETE /userAsset/@userId/@assetId', function ($userId, $assetId) {
        Flight::assetService()->delete_user_asset($userId, $assetId);
        Flight::json(['message' => 'Asset deleted'], 200);
    });
}, [new Auth()]);
