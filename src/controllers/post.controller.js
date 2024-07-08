const UserSchema = require("../models/user.model");
const PostSchema = require("../models/post.model");
const { serverError, errorResponse } = require("../utils/errorResponse.utils");
const { AcceptedRequestSchema } = require("../models/friendship.model");


const createPost = async (req, res) => {
    try {

        const {userId} = req;
        const {text, pictureUrl} = req.body;

        if(!text) return errorResponse(res, "Text is required!");
        
        if(text.length < 2) return errorResponse(res, "Text must be at least 1 character long");

        const post = await new PostSchema({user: userId, text: text, pictureUrl: pictureUrl || null}).save();

        const createdPost = await PostSchema.findById(post._id).populate("user");

        return res.status(201).json({error: false, message: "Post created", post: createdPost});
        
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
};

const getPosts = async (req, res) => {
    try {

        const {userId} = req;
        const {pageNumber} = req.query;

        const currentPage = Number(pageNumber);
        const postPerPage = 10;
        const skip = postPerPage * (currentPage - 1);

        const acceptedFriends = await AcceptedRequestSchema.findOne({user: userId});

        const posts = await PostSchema.find({
            user: {
                $in: [userId, ...acceptedFriends?.friendsList?.map(el => el?.user)]
            }
        })
        .skip(skip)
        .limit(postPerPage)
        .sort({createdAt: -1})
        .populate("user")
        .populate("comments.user");

        return res.status(200).json({error: true, message: "Post retrieved", posts});
        
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}

const deleteMyPost = async (req, res) => {
    try {

        const {userId} = req;
        const {postId} = req.query;

        if(!postId) return errorResponse(res, "PostId required!");

        const post = await PostSchema.findById(postId);
        const user = await UserSchema.findById(userId);

        if(!post) return errorResponse(res, "Post not found!");

        if(post.user.toString() !== userId && user.role !== "admin") return errorResponse(res, "Unauthorized to delete post!");

        await post.deleteOne();

        return res.status(200).json({error: true, message: "Post Deleted"})
        
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}

const getPostById = async (req, res) => {
    try {
        const {userId} = req;
        const {postId} = req.params;

        if(!postId) return errorResponse(res, "PostId required!");

        const post = await PostSchema.findById(postId)
            .populate("user")
            .populate("comments.user");

        if(!post) return errorResponse(res, "Post not found!");

        const loggedInUserFriends = await AcceptedRequestSchema.findOne({user: userId});

        const notMyPost = userId !== post.user._id.toString();
        const isNotFriend = !loggedInUserFriends?.friendsList?.some(el => el.user.toString() === post.user._id.toString());

        if(isNotFriend && notMyPost) return errorResponse(res, "Must be a acquaintance to view post.", 401, {unauthorized: true});

        return res.status(200).json({error: false, message: "Post found", post});

        
    } catch (error) {
        console.log(error);
        return serverError(res)
    }
}

const addComment = async (req, res) => {
    try {
        const {userId} = req;
        const {postId} = req.params;
        const {text} = req.body;

        if(text.length < 2) return errorResponse(res, "Comment must be at least 2 characters long!");

        const post = await PostSchema.findById(postId);

        if(!post) return errorResponse(res, "Post not found!");

        const comment = {
            user: userId,
            text,
        }

        post.comments.unshift(comment)
        await post.save();

        return res.status(201).json({error: false, message: "Comment added"});
        
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}

const deleteComment = async (req, res) => {
    try {
        
        const {userId} = req;
        const {postId, commentId} = req.params;

        const post = await PostSchema.findById(postId);
        const user = await UserSchema.findById(userId);

        if(!post) return errorResponse(res, "Post not found!");

        const commentIndex = post.comments.findIndex((el) => el._id.toString() === commentId );

        if(commentIndex === -1) return errorResponse(res, "Comment not found!");

        if(user.role !== 'admin' && post.comments[commentIndex]?.user.toString() !== userId){
            return errorResponse(res, "Unauthorize to delete comment!", 401);
        }

        post.comments.splice(commentIndex, 1);

        await post.save();

        return res.status(200).json({error: false, message: "Comment deleted!"});

    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}

const postLikeToggle = async (req, res) => {
    try {

        const {userId} = req;
        const {postId} = req.params;

        const post = await PostSchema.findById(postId);

        if(!post) return errorResponse(res, "Post not found!");

        const likeIndex = post?.likes?.findIndex((el) => el.user.toString() === userId);

        if(likeIndex === -1){
            post.likes.unshift({user: userId});
        }
        else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();

        return res.status(200).json({error: false, message: `Post ${likeIndex === -1 ? "liked" : "unlike"} successfully`})
        
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}


module.exports = {
    createPost,
    getPosts,
    deleteMyPost,
    getPostById,
    addComment,
    deleteComment,
    postLikeToggle,
}