const AdminComment = require('../models/adminComment');
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// @route GET api/admin-comment
// @desc Returns all admin-comment
// @access Public
exports.index = async function (req, res) {
    const adminComments = await AdminComment.find({ status: true });
    res.status(200).json({ success: true, message: "List of all admin comments", adminComments })
};

// @route POST api/admin-comment/add
// @desc Add a new admin-comment
// @access Public
exports.store = async (req, res) => {
    try {
        const newAdminComment = new AdminComment({ ...req.body });
        const { author } = req.body;

        let adminComment = await newAdminComment.save();
        let adminComment_ = await AdminComment.aggregate([
            {
                $match: {
                    _id: ObjectId(adminComment._id)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: '$author'
            }
        ]);

        return res.status(200).json({ success: false, message: "Comment has been added successfully", adminComment_: adminComment_[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET api/admin-comment/{id}
// @desc Returns a specific comment
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;
        const adminComment = await AdminComment.findById(id);
        if (!adminComment) return res.status(401).json({ message: 'Comment does not exist' });

        res.status(200).json({ adminComment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT api/admin-comment/{id}
// @desc Update comment detail
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const adminComment = await AdminComment.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (adminComment) return res.status(200).json({ adminComment, message: 'Comment has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DELETE api/admin-comment/{id}
// @desc Delete comment detail
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const adminComment_ = await AdminComment.findByIdAndDelete(id);
        res.status(200).json({ message: 'Comment has been deleted', adminComment_ });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/admin-comment/get-comments/{id}
// @desc Returns all comments of user
// @access Public
exports.getUserComments = async function (req, res) {
    const id = req.params.id;
    const adminComments = await AdminComment.aggregate([
        {
            $match: {
                userId: ObjectId(id)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'authorId',
                foreignField: '_id',
                as: 'author'
            }
        },
        {
            $unwind: '$author'
        }
    ]);
    res.status(200).json({ success: true, message: "List all comments of user", adminComments });
};

// @route POST api/admin-comment/delete-comments
// @desc Delete multiple comments
// @access Public
exports.destroyComments = async (req, res) => {
    try {
        const { ids } = req.body;
        await AdminComment.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Comments have been deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};