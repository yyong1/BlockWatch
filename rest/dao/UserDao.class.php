<?php
require_once (__DIR__ . '/BaseDao.class.php');
class UserDao extends BaseDao{
    public function __construct()
    {
        parent::__construct('users');
    }

    public function getByEmail($email)
    {
        return $this->query_unique("SELECT * FROM users WHERE email = :email", ['email' => $email]);
    }

    public function create($data)
    {
        return $this->add($data);
    }

    // public function update($id, $user)
    // {
    //     protected $table = 'user'; // Declare the '$table' property

    //     $this->execute_update($this->table, $id, $user);
    // }

}