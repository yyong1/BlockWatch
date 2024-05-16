<?php
require_once(__DIR__ . '/../middleware/Auth.class.php');

Flight::group('/reviews', function () {

    /**
     * @OA\Get(
     *     path="/reviews/",
     *     tags={"Reviews"},
     *     summary="Get the last five reviews",
     *     @OA\Response(
     *         response=200,
     *         description="Returns the last five reviews",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Review")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No reviews found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="No reviews found")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
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
    /**
     * @OA\Post(
     *     path="/reviews/",
     *     tags={"Reviews"},
     *     summary="Add a new review",
     *     @OA\RequestBody(
     *         required=true,
     *         description="Review data to add",
     *         @OA\JsonContent(ref="#/components/schemas/Review")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Review added",
     *         @OA\JsonContent(ref="#/components/schemas/Review")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Error adding review",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="No reviews found")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    Flight::route('POST /', function () {
        $data = Flight::request()->data->getData();
        Flight::reviewService()->add($data);
        if ($data) {
            Flight::json($data, 201);
        } else {
            Flight::json(['message' => 'No reviews found'], 404);
        }
    });
    /**
     * @OA\Get(
     *     path="/reviews/{id}",
     *     tags={"Reviews"},
     *     summary="Get reviews by user ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="User ID to fetch reviews for",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reviews retrieved",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Review")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    Flight::route('GET /@id', function ($id) {
        return Flight::reviewService()->get_user_reviews($id);
    });
    /**
     * @OA\Patch(
     *     path="/reviews/",
     *     tags={"Reviews"},
     *     summary="Update a review",
     *     @OA\RequestBody(
     *         required=true,
     *         description="Review ID and updated data",
     *         @OA\JsonContent(
     *             type="object",
     *             required=["id", "review"],
     *             properties={
     *                 "id": {
     *                     type="integer",
     *                     description="Review ID to update"
     *                 },
     *                 "review": {
     *                     type="string",
     *                     description="Updated review text"
     *                 }
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Review updated",
     *         @OA\JsonContent(ref="#/components/schemas/Review")
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid review data",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Invalid review data provided")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    Flight::route('PATCH /', function () {
        $data = Flight::request()->data->getData();
        $id = $data['id'];
        $review = $data['review'];
        return Flight::reviewService()->updateUserReview($id, $review);
    });
}, [new Auth()]);
