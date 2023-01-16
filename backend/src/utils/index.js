
const mailgun = require("mailgun-js")
var domain = process.env.MAIL_GUN_DOMAIN
var api_key = process.env.MAIL_GUN_API_KEY
var mg = mailgun({apiKey: api_key, domain: domain})
function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        const data = {
            to: mailOptions.to,
            from: mailOptions.from,
            subject: mailOptions.subject,
            html: mailOptions.html
        };
        mg.messages().send(data, (error, body) => {
            if (error) {
                reject(error)
            } else {
                resolve(body);
            }
        });
    });
}
module.exports = { sendEmail };