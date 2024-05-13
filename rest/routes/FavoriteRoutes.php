<?php
Flight::group('/favorite', function () {
  Flight::route('GET /@userId', function ($userId) {
    $data = Flight::favoriteService()->get_favorite($userId);
    if (!empty($data)) {
      Flight::json($data, 200);
    } else {
      Flight::json(['message' => 'No favorite assets found'], 404);
    }
  });

  Flight::route('POST /@userId/@assetId', function ($userId, $assetId) {
    if ($userId && $assetId) {
      Flight::favoriteService()->add_to_favorite($userId, $assetId);
      Flight::json(['message' => 'Added to favorites'], 200);
    } else {
      Flight::json(['message' => 'Invalid user ID or asset ID'], 400);
    }
  });

  Flight::route('DELETE /@userId/@assetId', function ($userId, $assetId) {
    if ($userId && $assetId) {
      Flight::favoriteService()->remove_from_favorite($userId, $assetId);
      Flight::json(['message' => 'Removed from favorites'], 200);
    } else {
      Flight::json(['message' => 'Invalid user ID or asset ID'], 400);
    }
  });
});
