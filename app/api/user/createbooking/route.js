import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";
import EmailSender from "@/app/utils/EmailSender";
export const POST = handleRouteError(auth(async (req) => {
    await dbConnect();
    let isAdmin = false;
    if (!req.auth.user && !req.auth.user.email) {
        throw new ApiError(403, "Forbidden");
    }
    if (req.auth.user.email === process.env.ADMIN_EMAIL) {
        isAdmin = true;
    }
    const body = await req.json();
    const requiredFields = [
        "startDateTime",
        "endDateTime",
        "playerCount",
        "numberOfHours",
        "contactName",
        "contactPhone",
    ];

    for (const field of requiredFields) {
        if (!body[field]) {
            throw new ApiError(400, `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
        }
    }

    const start = new Date(body.startDateTime);
    const end = new Date(body.endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new ApiError(400, "Invalid start or end datetime.");
    }

    const conflict = await Booking.findOne({
        $and: [
            {
                $or: [
                    { startDateTime: { $lt: end }, endDateTime: { $gt: start } }
                ]
            },
            { status: { $ne: 'cancelled' } }
        ]
    });

    if (conflict) {
        console.log("found")
        if (conflict.isImage || conflict.status === "confirmed") {
            // Booking is verified – block new booking
            console.log("found2")
            return NextResponse.json({
                success: false,
                isBooked: true,
                from: conflict.startDateTime,
                to: conflict.endDateTime,
                isImage: conflict.isImage,
                createdAt: conflict.createdAt,
                minutesLeft: 0,
            });
        }

        const createdAt = new Date(conflict.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const minutesLeft = Math.max(20 - diffMinutes, 0);
        console.log(minutesLeft)
        if (minutesLeft > 0 && conflict.status === "pending") {
            //show panding time to user 
            return NextResponse.json({
                success: false,
                isBooked: true,
                from: conflict.startDateTime,
                to: conflict.endDateTime,
                isImage: conflict.isImage,
                createdAt: conflict.createdAt,
                minutesLeft,
            });
        }

        // Hold expired – delete the old booking
        if (conflict.status === "pending" && !conflict.isImage) {
            await Booking.findByIdAndDelete(conflict._id);
        }
    }

    try {
        const newBooking = new Booking({
            startDateTime: start,
            endDateTime: end,
            numberOfHours: body.numberOfHours,
            playerCount: body.playerCount,
            contactName: body.contactName,
            contactPhone: body.contactPhone,
            price: body.numberOfHours * 100,
            status: isAdmin ? "confirmed" : "pending",
            isImage: isAdmin ? true : false,
            contactEmail: req.auth.user.email,
            specialRequests: isAdmin ? "made by admin" : body.specialRequests || "",
        });

        const savedBooking = await newBooking.save();

        const email = `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); padding: 30px;">
                    <h2 style="color: #FF9800;">⏳ Booking Created – Awaiting Payment Screenshot</h2>
                    <p style="font-size: 16px;">A new booking has been created, but the user has <strong>not yet uploaded</strong> a payment screenshot. They have <strong>20 minutes</strong> remaining to complete the payment process.</p>

                    <h3 style="margin-top: 30px; color: #333;">🧾 Booking Details:</h3>
                    <ul style="line-height: 1.8; font-size: 15px; padding-left: 20px;">
                        <li><strong>Contact Name:</strong> ${savedBooking.contactName}</li>
                        <li><strong>Contact Phone:</strong> ${savedBooking.contactPhone}</li>
                        <li><strong>Contact Email:</strong> ${savedBooking.contactEmail}</li>
                        <li><strong>Player Count:</strong> ${savedBooking.playerCount}</li>
                        <li><strong>Number of Hours:</strong> ${savedBooking.numberOfHours}</li>
                        <li><strong>Total Price:</strong> ${savedBooking.price}</li>
                        <li><strong>Status:</strong> ${savedBooking.status}</li>
                        <li><strong>Start Time:</strong> ${new Date(savedBooking.startDateTime).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</li>
                        <li><strong>End Time:</strong> ${new Date(savedBooking.endDateTime).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</li>

                        ${savedBooking.specialRequests ? `<li><strong>Special Requests:</strong> ${savedBooking.specialRequests}</li>` : ""}
                    </ul>

                    <div style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-left: 5px solid #ff9800;">
                        <p style="margin: 0; font-size: 15px; color: #856404;">
                        ⚠️ The user has <strong>20 minutes</strong> to upload their payment screenshot. Please monitor this booking in case the time runs out.
                        </p>
                    </div>

                    <hr style="margin-top: 40px;"/>
                    <p style="font-size: 13px; color: #999;">This is an automated email from the booking system.</p>
                    </div>
                </div>
                `;

        if (!isAdmin) {
            await EmailSender(process.env.ADMIN_EMAIL, "New Payment Screenshot Uploaded", email)
        }
        return NextResponse.json({
            message: "Booking successful!",
            isAdmin,
            data: savedBooking,
        }, { status: 201 });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const messages = Object.values(error.errors).map(err => err.message);
            throw new ApiError(400, "Validation failed: " + messages.join(", "));
        }
        console.error("Error saving booking:", error);
        throw new ApiError(500, "An unexpected error occurred while processing the booking.");
    }
}));

