
<?php
require_once(__DIR__ . '/../dao/FavoriteDao.class.php');
require_once(__DIR__ . '/../services/BaseService.class.php');

class FavoriteService extends BaseService
{
  public function __construct()
  {
    parent::__construct(new FavoriteDao());
  }
  public function get_favorite($id)
  {
    return $this->dao->getAll($id);
  }

  public function add_to_favorite($userId, $assetId)
  {
    $this->dao->addFavorite($userId, $assetId);
  }

  public function remove_from_favorite($userId, $assetId)
  {
    $this->dao->removeFavorite($userId, $assetId);
  }
}
