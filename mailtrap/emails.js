const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} = require("./emailTemplates.js");

dotenv.config();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.Email_User,
		pass: process.env.Email_Password,
	},
});

const sendVerificationEmail = async (email, verificationToken) => {
	const mailOptions = {
		from: process.env.Email_User,
		to: email,
		subject: "Verify your email",
		html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Verification email sent successfully", info.response);
	} catch (error) {
		console.error("Error sending verification email", error);
		throw new Error(`Error sending verification email: ${error}`);
	}
};

const sendWelcomeEmail = async (email, name) => {
	const mailOptions = {
		from: process.env.Email_User,
		to: email,
		subject: "Welcome to Auth Company!",
		html: `<p>Welcome, ${name}!</p>`,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Welcome email sent successfully", info.response);
	} catch (error) {
		console.error("Error sending welcome email", error);
		throw new Error(`Error sending welcome email: ${error}`);
	}
};

const sendPasswordResetEmail = async (email, resetURL) => {
	const mailOptions = {
		from: process.env.Email_User,
		to: email,
		subject: "Reset your password",
		html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Password reset email sent successfully", info.response);
	} catch (error) {
		console.error("Error sending password reset email", error);
		throw new Error(`Error sending password reset email: ${error}`);
	}
};

const sendResetSuccessEmail = async (email) => {
	const mailOptions = {
		from: process.env.Email_User,
		to: email,
		subject: "Password Reset Successful",
		html: PASSWORD_RESET_SUCCESS_TEMPLATE,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Password reset success email sent successfully", info.response);
	} catch (error) {
		console.error("Error sending password reset success email", error);
		throw new Error(`Error sending password reset success email: ${error}`);
	}
};

module.exports = {
	sendVerificationEmail,
	sendWelcomeEmail,
	sendPasswordResetEmail,
	sendResetSuccessEmail,
};