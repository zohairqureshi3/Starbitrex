var siteURL = 'https://' + process.env.SITE_URL;
var baseURL = 'https://' + process.env.BASE_URL;
var logoImage = baseURL + '/images/logo171.png';
var bgImage = baseURL + '/images/bg-frame.png';

const passwordRecoveryEmailTemplate = (resetPasswordLink, fullName) => {
    let text = `
                <html >
                    <head>
                        <meta charset="utf-8">
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    </head>
                    <body style="padding:0; margin:0px; background:#eee;">
                        <div style="max-width:992px; margin:auto;">
                            <div style="padding:17px 83px;  position: relative; background: url(${bgImage}); background-repeat: no-repeat; background-size: cover;">
                                <figure>
                                    <img src=${logoImage} alt="starbitrex" />
                                </figure>
                            </div>
                            <div style="background:#1E1E1E;">
                                <div style="padding:134px 83px 0px 83px; color:#fff;">
                                    <div style="border-bottom: 3px solid #29B79D;">
                                        <div style="margin-bottom: 60px; color: rgb(255 255 255);">
                                            <h1 style="font-family: 'Montserrat'; color: rgb(255 255 255);  font-weight: 700; font-size: 32px; line-height: 39px; margin-bottom:46px;">HI ${fullName}</h1>
                                            <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 400; font-size: 14px; line-height: 17px;">Your request to reset password is recently received. </p>
                                            <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 400; font-size: 14px; line-height: 17px;">Please click on the following link to reset your password. </p>
                                            <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 400; font-size: 14px; line-height: 17px;><span style="font-weight:800;">Reset Password Link: </span> <a href=${resetPasswordLink} target="_blank" style="cursor:pointer;  color:#29B79D;">${resetPasswordLink}</a>
                                            </p>
                                            <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 400; font-size: 14px; line-height: 17px; margin-bottom: 36px;">If you did not request this, please ignore this email and your password will remain unchanged.
                                            </p>
                                            <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 400; font-size: 14px; line-height: 17px;><span style="font-weight:800;">Security Tips :</span> </p>
                                            <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 400; font-size: 13px; line-height: 16px;>Never give your password to anyone.</p>
                                            <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 400; font-size: 13px; line-height: 16px;>Never call any phone number from someone claiming to be StarBitrex Customer Support. </p>
                                            <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 400; font-size: 13px; line-height: 16px;>Never send any money to anyone claiming to be a member of the StarBitrex team.</p>
                                            <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 400; font-size: 13px; line-height: 16px;>Enable Google Two-Factor Authentication. </p>
                                            <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 400; font-size: 13px; line-height: 16px;>Set up your anti-phishing code to add an extra layer of security to your account.</p>
                                        </div>
                                        <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 400; font-size: 13px; line-height: 16px;">Don't recognize this activity? Please <a href=${siteURL + "/restore"} target="_blank" style="cursor:pointer;  color:#29B79D;">reset your password</a> and contact <a href=${siteURL + "/change-password"} target="_blank" style="text-decoration: none; color:#29B79D; cursor:pointer; transition: all ease-in-out .4s;">customer support</a> immedately.</p>
                                        <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-style: italic; font-weight: 300; font-size: 13px; line-height: 16px;">This is an automated message, please do not reply.</p>
                                    </div>
                                </div>
                                <div style="background:#1E1E1E; color: #fff; padding:24px 0px 160px 0px;">
                                    <h2 style="font-family: 'Montserrat'; color: rgb(255 255 255); font-style: normal; font-weight: 800; font-size: 14px; line-height: 17px; color: #29B79D; margin-bottom: 25px;">Stay connected!</h2>
                                    <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 300; font-size: 11px; line-height: 13px;">To stay secure, setup your phishing code <a href=${siteURL} target="_blank" style="text-decoration: none; color:#29B79D; transition: all ease-in-out .4s; cursor:pointer;">here</a></p>
                                    <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 300; font-size: 11px; line-height: 13px;">Risk warning: Cryptocurrency trading is subject to high market risk. StarBitrex will make the best efforts to choose high-quality coins, but will not be responsible for your trading losses. Please trade with caution.</p>
                                    <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 300; font-size: 11px; line-height: 13px;">Kindly note: Please be aware of phishing sites and always make sure you are visiting the official <a href=${siteURL} target="_blank" style="text-decoration: none; color:#29B79D; transition: all ease-in-out .4s; cursor:pointer;">starbitrex.com</a> website when entering sensitive data.</p>
                                    <p style="font-family: 'Montserrat'; color: rgb(255 255 255); font-weight: 300; font-size: 11px; line-height: 13px;">© 2017 - 2022 <a href=${siteURL} target="_blank" style="text-decoration: none; color:#29B79D; transition: all ease-in-out .4s; cursor:pointer;">starbitrex.com</a> , All Rights Reserved.</p>
                                </div>
                            </div>
                        </div>
                    </body>
                </html>
            `
    return text;
}

module.exports = { passwordRecoveryEmailTemplate };