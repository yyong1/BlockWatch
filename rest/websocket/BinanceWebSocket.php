<?php

require __DIR__ . '/../../vendor/autoload.php';

use Ratchet\Client\WebSocket;
use Ratchet\Client\Connector;
use React\EventLoop\Loop;

class BinanceWebSocket
{
    private $url = 'wss://fstream.binance.com/ws/btcusdt@aggTrade';
    private $connection;
    private $loop;
    private $server;

    public function __construct($server)
    {
        $this->loop = Loop::get();
        $this->server = $server;
    }

    public function connect()
    {
        $connector = new Connector($this->loop);

        $connector($this->url)->then(
            function (WebSocket $conn) {
                $this->connection = $conn;
                echo "Connected to Binance WebSocket API.\n";

                $conn->on('message', function ($msg) {
                    $this->onMessage($msg);
                });

                $conn->on('close', function ($code = null, $reason = null) {
                    echo "Connection closed ({$code} - {$reason})\n";
                });
            },
            function ($e) {
                echo "Could not connect: {$e->getMessage()}\n";
            }
        );

        $this->loop->run();
    }

    private function onMessage($msg)
    {
        $data = json_decode($msg, true);
        echo "Received message: \n";
        print_r($data);

        // Forward the message to the WebSocket server
        $this->server->broadcast($msg);
    }

    public function close()
    {
        if ($this->connection) {
            $this->connection->close();
        }
        $this->loop->stop();
    }
}
