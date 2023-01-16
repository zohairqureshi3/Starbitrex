const Notification = require('../models/notification');

// @route GET admin/notification
// @desc Returns all notifications
// @access Public
exports.index = async function (req, res) {

    const { type } = req.params;
    let results;
    if( type == 'all' ) {
        results = await Notification.find({});
    } else if(type == 'unread') {
        results = await Notification.find({ isRead: false });
    }
    const notifications = results.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    });
    res.status(200).json({ success: true, message: "List of notifications", notifications })
};


// @route PUT api/notification/{id}
// @desc Update notification status read
// @access Public

exports.update = async function (req, res) {

    try {

        const id = req.params.id;
        const notification = await Notification.findByIdAndUpdate(id, { $set: {isRead: true} }, { new: true });

        return res.status(200).json({ notification, message: 'Notification mark as read.' });
       
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};