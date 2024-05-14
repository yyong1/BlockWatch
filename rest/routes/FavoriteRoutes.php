<?php
require_once(__DIR__ . '/../middleware/Auth.class.php');

Flight::group('/favorite', function () {

  /**
 * @OA\Get(
 *      path="/favorite/{userId}",
 *      tags={"favorites"},
 *      summary="Retrieve all favorite assets for a user",
 *      @OA\Parameter(
 *          name="userId",
 *          in="path",
 *          required=true,
 *          @OA\Schema(type="string"),
 *          description="The ID of the user"
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="A list of favorite assets",
 *          @OA\JsonContent(
 *              type="array",
 *              @OA\Items(ref="#/components/schemas/Asset")
 *          )
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="No favorite assets found",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="message", type="string", example="No favorite assets found")
 *          )
 *      ),
 *      security={{"bearerAuth": {}}}
 * )
 */
  Flight::route('GET /@userId', function ($userId) {
    $data = Flight::favoriteService()->get_favorite($userId);
    if (!empty($data)) {
      Flight::json($data, 200);
    } else {
      Flight::json(['message' => 'No favorite assets found'], 404);
    }
  });

  /**
 * @OA\Post(
 *      path="/favorite/{userId}/{assetId}",
 *      tags={"favorites"},
 *      summary="Add an asset to the user's favorites",
 *      @OA\Parameter(
 *          name="userId",
 *          in="path",
 *          required=true,
 *          @OA\Schema(type="string"),
 *          description="The ID of the user"
 *      ),
 *      @OA\Parameter(
 *          name="assetId",
 *          in="path",
 *          required=true,
 *          @OA\Schema(type="string"),
 *          description="The ID of the asset to add to favorites"
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Asset added to favorites",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="message", type="string", example="Added to favorites")
 *          )
 *      ),
 *      @OA\Response(
 *          response=400,
 *          description="Invalid user ID or asset ID",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="message", type="string", example="Invalid user ID or asset ID")
 *          )
 *      ),
 *      security={{"bearerAuth": {}}}
 * )
 */
  Flight::route('POST /@userId/@assetId', function ($userId, $assetId) {
    if ($userId && $assetId) {
      Flight::favoriteService()->add_to_favorite($userId, $assetId);
      Flight::json(['message' => 'Added to favorites'], 200);
    } else {
      Flight::json(['message' => 'Invalid user ID or asset ID'], 400);
    }
  });

  /**
 * @OA\Delete(
 *      path="/favorite/{userId}/{assetId}",
 *      tags={"favorites"},
 *      summary="Remove an asset from the user's favorites",
 *      @OA\Parameter(
 *          name="userId",
 *          in="path",
 *          required=true,
 *          @OA\Schema(type="string"),
 *          description="The ID of the user"
 *      ),
 *      @OA\Parameter(
 *          name="assetId",
 *          in="path",
 *          required=true,
 *          @OA\Schema(type="string"),
 *          description="The ID of the asset to remove from favorites"
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Asset removed from favorites",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="message", type="string", example="Removed from favorites")
 *          )
 *      ),
 *      @OA\Response(
 *          response=400,
 *          description="Invalid user ID or asset ID",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="message", type="string", example="Invalid user ID or asset ID")
 *          )
 *      ),
 *      security={{"bearerAuth": {}}}
 * )
 */
  Flight::route('DELETE /@userId/@assetId', function ($userId, $assetId) {
    if ($userId && $assetId) {
      Flight::favoriteService()->remove_from_favorite($userId, $assetId);
      Flight::json(['message' => 'Removed from favorites'], 200);
    } else {
      Flight::json(['message' => 'Invalid user ID or asset ID'], 400);
    }
  });
}, [new Auth()]);
