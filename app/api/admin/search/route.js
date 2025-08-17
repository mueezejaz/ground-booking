import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import { auth } from "@/app/auth";
import mongoose from "mongoose"; // Import mongoose to use Types.ObjectId

export const POST = handleRouteError(auth(async (req) => {
    // Connect to the database
    await dbConnect();

    const body = await req.json();

    const conditions = [];

    if (body.unVerified) {
        conditions.push({
            $or: [
                { isImage: false },
                { status: "Panding" }
            ]
        });
    } else {
        conditions.push({ isImage: true, status: "confirmed" });
    }

    if (body.search) {
        const searchRegex = new RegExp(body.search, 'i'); // Case-insensitive regex for phone/email search
        const orConditions = [
            { contactPhone: { $regex: searchRegex } },
            { contactEmail: { $regex: searchRegex } }
        ];

        if (mongoose.Types.ObjectId.isValid(body.search)) {
            orConditions.push({ _id: new mongoose.Types.ObjectId(body.search) });
        }

        // Apply the $or query to search across multiple fields
        conditions.push({ $or: orConditions });
    }

    const query = conditions.length > 0 ? { $and: conditions } : {};

    const bookings = await Booking.find(query).sort({ _id: -1 }).limit(10);

    return NextResponse.json({
        bookings: bookings,
        success: true,
    }, { status: 200 });
}));

