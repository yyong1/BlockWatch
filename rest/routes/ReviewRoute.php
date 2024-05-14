<?php 
require_once(__DIR__ . '/../middleware/Auth.class.php');

Flight::group('/reviews', function () {

    /**
     * @OA\Get(
     *     path="/assets/",
     *     @OA\Response(response="200", description="An example resource")
     * )
     */
    Flight::route('GET /', function () {
        $data = Flight::reviewService()->getLastFiveReviews();
        if (!empty($data)) {
            Flight::json($data, 200);
        } else {
            Flight::json(['message' => 'No reviews found'], 404);
        }
    });

    Flight::route('POST /', function () {
        $data = Flight::request()->data->getData();
        Flight::reviewService()->add($data);
        if ($data) {
            Flight::json($data, 201);
        } else {
            Flight::json(['message' => 'No reviews found'], 404);
        }
    });

    Flight::route('GET /@id', function ($id) {
        return Flight::reviewService()->get_user_reviews($id);
    });

    Flight::route('PATCH /', function () {
        $data = Flight::request()->data->getData();
        $id = $data['id'];
        $review = $data['review'];
        return Flight::reviewService()->updateUserReview($id, $review);
    });
}, [new Auth()]);
