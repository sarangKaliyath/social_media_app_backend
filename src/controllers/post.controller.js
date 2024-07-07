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


module.exports = {
    createPost,
    getPosts,
    deleteMyPost,
}