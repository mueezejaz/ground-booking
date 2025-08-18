import nodemailer from "nodemailer";

export default async function EmailSender(to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to || process.env.ADMIN_EMAIL, // Fallback admin email
        subject: subject || "New Payment Screenshot Uploaded",
        html: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Admin email sent");
    } catch (error) {
        console.error('Error sending admin email:', error);
    }
}

