import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";
import EmailSender from "@/app/utils/EmailSender";

const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background-color: #f4f4f4; color: #333;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); overflow: hidden;">
      <div style="background-color: #4CAF50; padding: 20px; color: white; text-align: center;">
        <h2 style="margin: 0;">📣 Booking Status Update</h2>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px;">Dear Valued Customer,</p>
        <p style="font-size: 16px;">We wanted to inform you that the status of your booking has been updated.</p>
        <div style="margin: 20px 0; padding: 20px; background-color: #e8f5e9; border-left: 6px solid #4CAF50;">
          <p style="font-size: 18px; margin: 0;"><strong>📌 New Status:</strong> <span style="color: #2e7d32;">{{status}}</span></p>
        </div>
        <p style="font-size: 16px;">Please visit your booking page to view more details or contact us if you have any questions.</p>



        <p style="font-size: 14px; color: #777;">Thank you for using our booking system. If you have any questions, feel free to reply contact us .</p>
      </div>
    </div>
  </div>
`;
export const POST = handleRouteError(auth(async (req) => {
    await dbConnect();
    if (!req.auth.user.email || req.auth.user.email !== process.env.ADMIN_EMAIL) {
        throw new ApiError(403, "Forbidden");
    }
    const body = await req.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
        throw new ApiError(400, "Booking ID and status are required");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true }
    );

    console.log(updatedBooking);
    if (!updatedBooking) {
        throw new ApiError(404, "Booking not found");
    }
    await EmailSender(updatedBooking.contactEmail, "Booking Status Updated", html.replace("{{status}}", updatedBooking.status));

    return NextResponse.json({
        booking: updatedBooking,
        success: true,
    }, { status: 200 });
}));
