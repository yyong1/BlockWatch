<?php
require_once(__DIR__ . '/../dao/AssetDao.class.php');
require_once(__DIR__ . '/../services/BaseService.class.php');

class AssetService extends BaseService
{
    public function __construct()
    {
        parent::__construct(new AssetDao());
    }

    public function get_assets()
    {
        return $this->dao->get_all();
    }

    public function search_assets($search, $offset, $limit, $order)
    {
        return $this->dao->get_assets($search, $offset, $limit, $order);
    }

    public function add($asset)
    {
        return $this->dao->add($asset);
    }

    public function update($id, $asset)
    {
        $this->dao->update($id, $asset);
    }

    public function delete($id)
    {
        $this->dao->delete($id);
    }
}