import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


export const sendEmail = async(to, subject, text)=>{
    dotenv.config();
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to,
        subject,
        html: `<div style="font-family: Arial, sans-serif; line-height:1.5;">
                    <h2>Password Reset Request</h2>
                    <p>Click the button below to reset your password. This link will expire in 15 minutes.</p>
                    <a href="${text}"
                    style="display:inline-block;padding:10px 20px;
                            background-color:#007bff;color:#fff;
                            text-decoration:none;border-radius:5px;">
                    Reset Password
                    </a>
                    <P> Token: ${text}</p>
                    <p>If you didn’t request this, you can safely ignore this email.</p>
                </div>`
    });
}