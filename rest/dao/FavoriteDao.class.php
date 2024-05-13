<?php
require_once(__DIR__ . '/BaseDao.class.php');

class FavoriteDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct('favorite_assets', 'favorite_id');
  }

  public function getAll($userId)
  {
    try {
      $query = "SELECT a.* FROM assets a
                  JOIN favorite_assets fa ON a.asset_id = fa.asset_id
                  WHERE fa.user_id = :user_id";
      $params = [
        'user_id' => $userId
      ];
      return $this->query($query, $params);
    } catch (Exception $e) {
      throw new Exception("Failed to retrieve favorite assets: " . $e->getMessage());
    }
  }


  public function addFavorite($userId, $assetId)
  {
    $query = "INSERT INTO favorite_assets (user_id, asset_id, addeddate) VALUES (:user_id, :asset_id, NOW())";
    $params = [
      'user_id' => $userId,
      'asset_id' => $assetId
    ];
    $this->execute($query, $params);
  }

  public function removeFavorite($userId, $assetId)
  {
    $query = "DELETE FROM favorite_assets WHERE user_id = :user_id AND asset_id = :asset_id";
    $params = [
      'user_id' => $userId,
      'asset_id' => $assetId
    ];
    $this->execute($query, $params);
  }
}
