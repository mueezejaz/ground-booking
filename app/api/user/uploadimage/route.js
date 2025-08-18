import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import { v2 as cloudinary } from 'cloudinary';
import handleRouteError from "@/app/utils/HandleApiError";
import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";
import EmailSender from "@/app/utils/EmailSender";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export let POST = auth(handleRouteError(async (req) => {
    await dbConnect();
    if (!req.auth.user && !req.auth.user.email) {
        throw new ApiError(403, "Forbidden");
    }

    const formData = await req.formData();
    const file = formData.get('image');
    const bookingId = formData.get("bookingId");

    if (!file) {
        throw new ApiError(400, "No file was provided in the request.");
    }

    if (!bookingId) {
        throw new ApiError(400, "Booking ID is missing. Please provide a booking ID.");
    }

    if (typeof file === 'string') {
        throw new ApiError(400, "Invalid file format received.");
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new ApiError(400, `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new ApiError(400, "File size exceeds 5MB limit.");
    }

    // Upload image to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64Image}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'bookingImages',
        resource_type: 'image',
    });

    // Find and update the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }
    if (booking.isImage) {
        throw new ApiError(400, "image is already uploaded");
    }
    booking.imageData = {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
        fileName: file.name,
    };
    booking.isImage = true;

    let newBooking = await booking.save();
    const email = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #4CAF50;">📸 Payment Screenshot Uploaded</h2>
                <p>A user has uploaded a payment screenshot. Please review the booking and verify the payment.</p>

                <h3>🧾 Booking Details:</h3>
                <ul style="line-height: 1.8;">
                    <li><strong>Contact Name:</strong> ${booking.contactName}</li>
                    <li><strong>Contact Phone:</strong> ${booking.contactPhone}</li>
                    <li><strong>Contact Email:</strong> ${booking.contactEmail}</li>
                    <li><strong>Player Count:</strong> ${booking.playerCount}</li>
                    <li><strong>Number of Hours:</strong> ${booking.numberOfHours}</li>
                    <li><strong>Total Price:</strong> ${booking.price}</li>
                    <li><strong>Status:</strong> ${booking.status}</li>
                    <li><strong>Start Time:</strong> ${new Date(booking.startDateTime).toLocaleString()}</li>
                    <li><strong>End Time:</strong> ${new Date(booking.endDateTime).toLocaleString()}</li>
                    ${booking.specialRequests ? `<li><strong>Special Requests:</strong> ${booking.specialRequests}</li>` : ""}
                </ul>

                ${booking.imageData?.url
            ? `<h3>📷 Screenshot Preview:</h3>
                           <img src="${booking.imageData.url}" alt="Payment Screenshot" style="max-width: 100%; border: 1px solid #ccc;" />`
            : ""
        }

                <hr style="margin-top: 30px;"/>
                <p style="font-size: 12px; color: #888;">This is an automated notification from the booking system.</p>
            </div>
        `
    await EmailSender(process.env.ADMIN_EMAIL, "New Payment Screenshot Uploaded", email)
    return NextResponse.json({
        success: true,
        message: "Image uploaded and attached to booking successfully wait for admin to verify payment you can view you status in booking page.",
    }, { status: 200 });
}));
