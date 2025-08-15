import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import { v2 as cloudinary } from 'cloudinary';
import handleRouteError from "@/app/utils/HandleApiError";
import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export let POST = handleRouteError(async (req) => {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
        throw new ApiError(400, "No file was provided in the request.");
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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    const dataUri = `data:${file.type};base64,${base64Image}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'varientImage',
        resource_type: 'auto',
    });

    console.log('Cloudinary upload result:', uploadResult);



    return NextResponse.json({
        success: true,
        // message: 'Image uploaded to Cloudinary and saved to database successfully!',
        // imageUrl: uploadResult.secure_url,
        // publicId: uploadResult.public_id,
        // fileName: file.name,
        // dbId: newImage._id, 
    }, { status: 200 });
});

// Optionally, handle other HTTP methods
export async function GET() {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}