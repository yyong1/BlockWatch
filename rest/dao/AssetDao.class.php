<?php
require_once(__DIR__ . '/BaseDao.class.php');
class AssetDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('asset');
    }
}
