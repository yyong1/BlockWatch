<?php
require_once dirname(__FILE__) . "/../config.php";

class BaseDao {
    protected $connection;
    private $table;
    private $primaryKey;

    public function __construct($table, $primaryKey = 'id') {
        $this->table = $table;
        $this->primaryKey = $primaryKey;
        try {
            $this->connection = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8;port=" . DB_PORT, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $e) {
            print_r($e);
            throw $e;
        }
    }

    public function begin_transaction() {
        $this->connection->beginTransaction();
    }

    public function commit() {
        $this->connection->commit();
    }

    public function rollback() {
        $this->connection->rollBack();
    }

    public function parse_order($order) {
        $direction = str_starts_with($order, '-') ? 'ASC' : 'DESC';
        $column = ltrim($order, '+-');
        return [$column, $direction];
    }

    public function insert($entity) {
        $keys = array_keys($entity);
        $fields = implode(', ', $keys);
        $placeholders = ':' . implode(', :', $keys);

        $query = "INSERT INTO {$this->table} ($fields) VALUES ($placeholders)";
        $stmt = $this->connection->prepare($query);
        $stmt->execute($entity);
        return $this->connection->lastInsertId();
    }

    protected function execute_update($id, $entity) {
        $assignments = array_map(function($field) {
            return "$field = :$field";
        }, array_keys($entity));

        $query = "UPDATE {$this->table} SET " . implode(', ', $assignments) . " WHERE {$this->primaryKey} = :primaryKey";
        $entity['primaryKey'] = $id; // Add primary key to entity for binding
        $stmt = $this->connection->prepare($query);
        $stmt->execute($entity);
    }

    public function execute($query, $params = []) {
        $stmt = $this->connection->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    protected function query($query, $params = []) {
        $stmt = $this->connection->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    protected function query_unique($query, $params = []) {
        $result = $this->query($query, $params);
        return reset($result);
    }

    public function add($entity) {
        return $this->insert($entity);
    }

    public function update($id, $entity) {
        $this->execute_update($id, $entity);
    }

    public function get_by_id($id) {
        $query = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :primaryKey";
        return $this->query_unique($query, ['primaryKey' => $id]);
    }

    public function get_all($offset = 0, $limit = 25, $order = null) {
        $order_clause = $order ? " ORDER BY " . implode(' ', $this->parse_order($order)) : "";
        $query = "SELECT * FROM {$this->table}{$order_clause} LIMIT :limit OFFSET :offset";
        $stmt = $this->connection->prepare($query);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE {$this->primaryKey} = :primaryKey";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['primaryKey' => $id]);
    }
}
