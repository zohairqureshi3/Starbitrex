const Notifications = require('../src/models/notification')

/**
* logs user activities
*/
const addUserLogs = async (data) => {
    try {
        
        const saveNotification = new Notifications(
            {
                userId: data.userId,
                module: data.module,
                message: data.message,
                isRead: data.isRead,
                redirectUrl: data.redirectUrl
            }
        );
        await saveNotification.save();
        return { success: true, message: 'notification created!' }

    } catch (error) {
        return { success: false, message: error.message }
    }
};

module.exports = { addUserLogs };