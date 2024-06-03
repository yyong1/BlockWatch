<?php
require_once(__DIR__ . '/../dao/ReviewDao.class.php');
require_once(__DIR__ . '/../services/BaseService.class.php');

class ReviewService extends BaseService
{
    public function __construct()
    {
        parent::__construct(new ReviewDao());
    }

    public function getLastFiveReviews()
    {
        return $this->dao->get_last_five_reviews();
    }

    public function getUserReview($user_id)
    {
        return $this->dao->get_user_reviews($user_id);
    }

    public function add($review)
    {
        return $this->dao->add_new_review($review);
    }

    public function updateUserReview($id, $rate, $review)
    {
        return $this->dao->update_review($id, $rate, $review);
    }

    public function delete($id)
    {
        $this->dao->delete_review($id);
    }
}
