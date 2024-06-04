<?php
require_once(__DIR__ . '/BaseDao.class.php');

class AssetDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('assets', 'asset_id');
    }

    public function getAll()
    {
        try {
            return $this->get_all();
        } catch (Exception $e) {
            throw new Exception("Failed to retrieve assets: " . $e->getMessage());
        }
    }

    public function create($data)
    {
        $this->add($data);
        return $this->getAssetBySymbol($data['symbol'])['asset_id'];
    }

    public function get_asset_symbol()
    {
        return $this->query("SELECT asset_id, symbol FROM assets");
    }

    public function updateAsset($id, $asset)
    {
        $this->update($id, $asset);
    }

    public function deleteAsset($id)
    {
        $this->delete($id);
    }

    public function getAssetBySymbol($symbol)
    {
        return $this->query_unique("SELECT * FROM assets WHERE symbol = :symbol", ['symbol' => $symbol]);
    }

    public function updateBySymbol($symbol, $assetData)
    {
        $query = "UPDATE assets SET current_price = :current_price, market_cap = :market_cap, 
                  percent_change_24h = :percent_change_24h, supply = :supply WHERE symbol = :symbol";
        $params = array_merge($assetData, ['symbol' => $symbol]);
        $this->execute($query, $params);
        return $this->getAssetBySymbol($symbol)['asset_id'];
    }

    public function addUserAsset($userId, $assetId, $purchaseAmount)
    {
        $priceQuery = "SELECT current_price FROM assets WHERE asset_id = :assetId";
        $priceResult = $this->query_unique($priceQuery, ['assetId' => $assetId]);

        if (!$priceResult || !isset($priceResult['current_price'])) {
            throw new Exception("Asset not found with ID: $assetId or current price is undefined.");
        }

        $currentPrice = $priceResult['current_price'];

        $query = "INSERT INTO user_assets (user_id, asset_id, purchaseamount, purchasepriceusd)
                  VALUES (:userId, :assetId, :purchaseAmount, :currentPrice)
                  ON DUPLICATE KEY UPDATE 
                      purchaseamount = purchaseamount + :purchaseAmount,
                      purchasepriceusd = :currentPrice";

        $params = [
            'userId' => $userId,
            'assetId' => $assetId,
            'purchaseAmount' => $purchaseAmount,
            'currentPrice' => $currentPrice
        ];

        $this->execute($query, $params);
    }

    public function deleteUserAsset($userId, $assetId)
    {
        $query = "DELETE FROM user_assets WHERE user_id = :userId AND asset_id = :assetId";
        $params = [
            'userId' => $userId,
            'assetId' => $assetId
        ];
        $this->execute($query, $params);
    }

    public function getUserAssets($userId)
    {
        $query = "SELECT ua.userasset_id, ua.asset_id, a.symbol, a.current_price, ua.purchaseamount, ua.purchasepriceusd
                  FROM user_assets ua
                  JOIN assets a ON ua.asset_id = a.asset_id
                  WHERE ua.user_id = :userId";
        return $this->query($query, ['userId' => $userId]);
    }

    public function updateUserAsset($userAssetId, $amount) {
        $query = "UPDATE user_assets SET purchaseamount = :amount WHERE userasset_id = :userAssetId";
        $params = [
            ':userAssetId' => $userAssetId,
            ':amount' => $amount
        ];
        return $this->execute($query, $params);
    }
    
    
    public function updateAssetAndLogHistory($symbol, $assetData)
    {
        try {
            $this->begin_transaction();
            $assetId = $this->getAssetBySymbol($symbol)['asset_id'];
            if ($assetId) {
                $this->updateBySymbol($symbol, $assetData);
            } else {
                $assetId = $this->create(array_merge($assetData, ['symbol' => $symbol]));
            }

            $this->execute(
                "INSERT INTO price_history (asset_id, timestamp, price_usd) VALUES (:assetId, NOW(), :current_price)",
                ["assetId" => $assetId, "current_price" => $assetData['current_price']]
            );
            $this->commit();
        } catch (Exception $e) {
            $this->rollback();
            throw new Exception("Failed to update asset and log history: " . $e->getMessage());
        }
    }
}
