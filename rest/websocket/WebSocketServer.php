<?php

require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/BinanceWebSocket.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use React\EventLoop\Loop;
use Ratchet\Client\Connector;

class WebSocketServer implements MessageComponentInterface
{
    protected $clients;
    private $binanceWebSocket;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $this->binanceWebSocket = new BinanceWebSocket($this);
        $this->binanceWebSocket->connect();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        foreach ($this->clients as $client) {
            if ($from !== $client) {
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    public function broadcast($msg)
    {
        foreach ($this->clients as $client) {
            $client->send($msg);
        }
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new WebSocketServer()
        )
    ),
    8080
);

$server->run();
