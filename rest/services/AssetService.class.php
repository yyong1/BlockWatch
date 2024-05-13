<?php
require_once(__DIR__ . '/../dao/AssetDao.class.php');
require_once(__DIR__ . '/../services/BaseService.class.php');

class AssetService extends BaseService
{
    public function __construct()
    {
        parent::__construct(new AssetDao());
    }

    public function getAssets()
    {
        return $this->dao->getAll();
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

    public function get_asset_symbol()
    {
        return $this->dao->get_asset_symbol();
    }

    public function update_database_asset()
    {
        $symbols = $this->dao->get_asset_symbol();

        $symbol_array = array_map(function ($item) {
            $symbol = is_array($item) ? $item['symbol'] : (is_object($item) ? $item->symbol : '');
            $symbol = trim($symbol);
            return ctype_alnum($symbol) ? $symbol : null;
        }, $symbols);

        $symbol_array = array_filter($symbol_array, function ($symbol) {
            return !empty($symbol);
        });

        $symbol_array = array_unique($symbol_array);

        $symbol_string = implode(',', $symbol_array);

        $url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
        $parameters = ['symbol' => $symbol_string, 'convert' => 'USD'];
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

        if ($response) {
            $responseArray = json_decode($response, true);
            if (isset($responseArray['status']) && $responseArray['status']['error_code'] != 0) {
                throw new Exception("API Error: " . $responseArray['status']['error_message']);
            }

            if (!isset($responseArray['data'])) {
                throw new Exception("Data key not found in the response: " . json_encode($responseArray));
            }

            foreach ($responseArray['data'] as $asset) {
                $this->dao->updateAssetAndLogHistory($asset['symbol'], [
                    'current_price' => $asset['quote']['USD']['price'],
                    'market_cap' => $asset['quote']['USD']['market_cap'],
                    'percent_change_24h' => $asset['quote']['USD']['percent_change_24h'],
                    'supply' => $asset['total_supply']
                ]);
            }
        } else {
            throw new Exception("No response from CMC");
        }
    }
}
