<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Http\Resources\CommentResource;
use App\Http\Requests\CommentRequest;
use App\Events\CommentSent;

class CommentController extends Controller
{
    public function getComment($postId)
    {
        $comment = Comment::where('post_id', $postId)->get();
        return CommentResource::collection($comment);
    }

    public function postComment(CommentRequest $request)
    {
        $comment = Comment::create($request->only(['user_id', 'post_id', 'body']));
        $user = $comment->user;
        $post = $comment->post;

        broadcast(new CommentSent($comment))->toOthers();

        return new CommentResource($comment);
    }
}
