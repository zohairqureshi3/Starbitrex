const { ENV } = require('../../config/config')
exports.exchangeEmailTemplate = (email, code, name) => {
    let text = `
<html >
    <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Check Email</title>
    </head>
    <body style="padding:0; margin:0px; background:#eee;">
        <div style="max-width:600px; margin:auto;  background:#fff; color:#222; font-size:17px; position: relative;">
            <div style="width:100%; text-align:center; margin-bottom: 15px;">
                <img src="${ENV.BASE_URL}/assets/img/email-head.png" style="width: 100%; max-width: 600px;"/>
            </div>
            <div style=" padding:10px 30px 10px;  font-family: Segoe, 'Segoe UI', 'sans-serif';">
                <h3 style=" font-size: 22px; text-transform: capitalize; font-family: Segoe, 'Segoe UI', 'sans-serif'; margin-top: 20px;">Dear <span style="color: #F17700;">${name},</span> </h3>
                <div style="font-size:18px;   line-height: 25px;">
                    <span style="font-weight: 600;">Congratulations</span>! you've successfully entered the contest. The following contest code has been associated with your account:
                    <div style="font-size: 26px;  padding: 20px 0px; color: #1048b5; font-weight: bold;">
                        <p style="font-size: 12px; font-style: italic; font-weight: 600; color: #666; margin-bottom: 0;">Contest Code</p>
                        ${code}
                    </div>
                    <p style="color: #686868; font-style:italic;">Start playing and win yummy prize! Good Luck!</p>
                </div>
                <div style="margin-top: 30px;  font-size: 16px; color: #555;">
                    <p style="font-size: 15px; font-style: italic; font-weight: 600; margin-bottom: 0;"> Regards,</p>
                    StarBitrex Team
                </div>
            </div>
            <div style="margin-top: 40px; text-align: center; background: #f3f3f3;padding:10px 20px 10px;  ">
                <p style="font-size:12px; color: #777; margin-bottom: 0; font-family: sans-serif;">Please check out FAQs section in our app or website for further assistance. </p>
                <a style="color: #1048b5; font-size:12px;font-family: sans-serif; " href="https://www.starbitrex.com/">www.starbitrex.com</a>
            </div>
            <!--footer area-->
            <div style=" background: #F17700; padding:10px 20px 10px; font-size: 12px;text-align: center; font-family: sans-serif;  color: #fff;">
                <!-- copyright area-->
                <p style="margin-bottom: 0; margin-top: 0">Copyright © 2022 StarBitrex. All Rights Reserved.</p>
            </div>
        </div>
    </body>
</html>
`
    return text;
}