import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";
export const POST = handleRouteError(auth(async (req) => {
    await dbConnect();
    const body = await req.json();

    if (!req.auth.user || req.auth.user.email !== body.contactEmail) {
        throw new ApiError(401, `unauthorized user`);
    }
    const requiredFields = [
        "startDateTime",
        "endDateTime",
        "playerCount",
        "numberOfHours",
        "contactName",
        "contactPhone",
        "contactEmail",
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

    // Check for overlapping bookings
    const conflict = await Booking.findOne({
        $or: [
            { startDateTime: { $lt: end }, endDateTime: { $gt: start } }
        ],
    });

    if (conflict) {
        if (conflict.isImage) {
            // Booking is verified – block new booking
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

        // Booking is unverified – check how much time is left
        const createdAt = new Date(conflict.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const minutesLeft = Math.max(20 - diffMinutes, 0);

        if (minutesLeft > 0) {
            // Still within 20 min hold – block new booking
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
        await Booking.findByIdAndDelete(conflict._id);
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
            status:"Panding",
            isImage: false,
            contactEmail: body.contactEmail,
            specialRequests: body.specialRequests || "",
        });

        const savedBooking = await newBooking.save();

        return NextResponse.json({
            message: "Booking successful!",
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

