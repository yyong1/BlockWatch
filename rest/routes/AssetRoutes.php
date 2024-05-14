<?php
require_once(__DIR__ . '/../middleware/Auth.class.php');

Flight::group('/assets', function () {
    /**
     * @OA\Get(
     *     path="/assets/",
     *     tags={"Assets"},
     *     summary="Retrieve all assets",
     *     @OA\Response(
     *         response=200,
     *         description="List of all assets",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Asset")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No assets found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="No assets found")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
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
    /**
     * @OA\Get(
     *     path="/assets/symbol",
     *     tags={"Assets"},
     *     summary="Get asset symbols",
     *     @OA\Response(
     *         response=200,
     *         description="Asset symbols found",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/AssetSymbol")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No symbol found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="No symbol found")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */

    Flight::route('GET /symbol', function () {
        $data = Flight::assetService()->get_asset_symbol();
        if (!empty($data)) {
            Flight::json($data, 200);
        } else {
            Flight::json(['message' => 'No symbol found'], 404);
        }
    });

    /**
     * @OA\Post(
     *     path="/assets/",
     *     tags={"Assets"},
     *     summary="Create a new asset",
     *     @OA\RequestBody(
     *         required=true,
     *         description="Asset data to be created",
     *         @OA\JsonContent(ref="#/components/schemas/Asset")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Asset created",
     *         @OA\JsonContent(ref="#/components/schemas/Asset")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Error creating asset",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Error in creating asset")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    Flight::route('POST /', function () {
        $data = Flight::request()->data->getData();
        Flight::assetService()->add($data);
        if ($data) {
            Flight::json($data, 201);
        } else {
            Flight::json(['message' => 'No assets found'], 404);
        }
    });
    /**
     * @OA\Get(
     *     path="/assets/{id}",
     *     tags={"Assets"},
     *     summary="Retrieve a single asset by ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the asset to retrieve",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Asset retrieved",
     *         @OA\JsonContent(ref="#/components/schemas/Asset")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Asset not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Asset not found")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */

    Flight::route('GET /@id', function ($id) {
        return Flight::assetService()->get_by_id($id);
    });
    /**
     * @OA\Patch(
     *     path="/assets",
     *     tags={"Assets"},
     *     summary="Update asset information in database",
     *     @OA\RequestBody(
     *         required=true,
     *         description="Asset data for updating",
     *         @OA\JsonContent(ref="#/components/schemas/Asset")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Asset information updated",
     *         @OA\JsonContent(ref="#/components/schemas/Asset")
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid asset information provided",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Invalid asset data")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    Flight::route('PATCH /', function () {
        return Flight::assetService()->update_database_asset();
    });

    /**
     * @OA\Post(
     *     path="/assets/userAsset/{userId}/{assetId}",
     *     tags={"User Assets"},
     *     summary="Assign an asset to a user",
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         required=true,
     *         description="User ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="assetId",
     *         in="path",
     *         required=true,
     *         description="Asset ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Asset data including amount",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="amount", type="number", example=100)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User asset assigned",
     *         @OA\JsonContent(ref="#/components/schemas/UserAsset")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Asset or user not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="No assets found")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    Flight::route('POST /userAsset/@userId/@assetId', function ($userId, $assetId) {
        $data = Flight::request()->data->getData();
        Flight::assetService()->add_user_asset($userId, $assetId, $data['amount']);
        if ($data) {
            Flight::json($data, 201);
        } else {
            Flight::json(['message' => 'No assets found'], 404);
        }
    });
    /**
     * @OA\Get(
     *     path="/assets/userAsset/{userId}",
     *     tags={"User Assets"},
     *     summary="Retrieve all assets assigned to a user",
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         required=true,
     *         description="User ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of user assets",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/UserAsset")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    Flight::route('GET /userAsset/@userId', function ($userId) {
        $data = Flight::assetService()->get_user_assets($userId);
        Flight::json($data, 200);
    });
    /**
     * @OA\Patch(
     *     path="/assets",
     *     tags={"Assets"},
     *     summary="Update an asset",
     *     @OA\RequestBody(
     *         description="Asset data to update",
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/Asset")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Asset updated",
     *         @OA\JsonContent(ref="#/components/schemas/Asset")
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid input",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Invalid data provided")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
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


    /**
     * @OA\Delete(
     *     path="/assets/{id}",
     *     tags={"Assets"},
     *     summary="Delete an asset",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         description="Asset ID"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Asset deleted",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Asset deleted")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    Flight::route('DELETE /userAsset/@userId/@assetId', function ($userId, $assetId) {
        Flight::assetService()->delete_user_asset($userId, $assetId);
        Flight::json(['message' => 'Asset deleted'], 200);
    });
}, [new Auth()]);
