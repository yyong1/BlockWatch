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

    public function update_database_asset()
    {
        $symbols = $this->dao->get_asset_symbol();

        $symbol_string = implode(',', array_column($symbols, 'symbol'));

        $url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=' . $symbol_string;
        $parameters = ['start' => '1', 'limit' => '10', 'convert' => 'USD'];
        $apiKey = $_ENV['CMC_API_KEY'] ?? '';

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url . '?' . http_build_query($parameters),
            CURLOPT_HTTPHEADER => [
                'Accepts: application/json',
                'X-CMC_PRO_API_KEY: ' . $apiKey
            ],
            CURLOPT_RETURNTRANSFER => true
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        if($response) {
            $response = json_decode($response, true);
            foreach($response['data'] as $asset) {
                $this->dao->update($asset['id'], [ // TODO not only update but also add new assets to price history for each asset
                    'price' => $asset['quote']['USD']['price'],
                    'market_cap' => $asset['quote']['USD']['market_cap'],
                    'volume_24h' => $asset['quote']['USD']['percent_change_24h'],
                    'total_supply' => $asset['total_supply']
                ]);
            }
        } else{
            throw new Exception("No response from CMC");
        }
    }
    
}