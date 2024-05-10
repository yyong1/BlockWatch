<?php
require_once (__DIR__ . '/BaseDao.class.php');
class AssetDao extends BaseDao{
    public function __construct()
    {
        parent::__construct('assets');
    }

    public function getAll()
    {
        return $this->get_all();
    }

    public function create($data)
    {
        return $this->add($data);
    }

    public function update($id, $asset)
    {
        $this->update($id, $asset);
    }

    public function delete($id)
    {
        return $this->delete($id);
    }

}