<?php
require_once('../vendor/autoload.php');

class ReviewDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('reviews', 'review_id');
    }

    public function get_last_five_reviews()
    {
        return $this->query("SELECT r.review_id, u.username, r.rating, r.comment, r.reviewdate
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        ORDER BY r.reviewdate DESC
        LIMIT 5;");
    }

    public function get_review_by_id($id)
    {
        return $this->query_unique("SELECT * FROM reviews WHERE review_id = :id", ['id' => $id]);
    }

    public function add_new_review($review)
    {
        $this->add($review);
    }

    public function update_review($id, $rating, $comment)
    {
        $this->query(
            "UPDATE reviews
             SET rating = :rating,
             comment = :comment,
             reviewdate = NOW()
             WHERE review_id = :id;",
             ['id' => $id, 'rating' => $rating, 'comment' => $comment]
        );
        return $this->get_review_by_id($id);
    }

    public function delete_review($id)
    {
        $this->delete($id);
    }

    public function get_user_reviews($user_id)
    {
        return $this->query("SELECT * FROM reviews WHERE user_id = :user_id ORDER BY reviewdate DESC", ['user_id' => $user_id]);
    }
}
