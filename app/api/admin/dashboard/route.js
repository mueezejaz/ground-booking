import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";

function formatLocalDate(input) {
  const d = new Date(input);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseMonthParameter(monthParam) {
  if (!monthParam) {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() // 0-based month
    };
  }

  const [yearStr, monthStr] = monthParam.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // Convert to 0-based month

  if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
    throw new ApiError("Invalid month parameter. Use YYYY-MM format.", 400);
  }

  return { year, month };
}

export const GET = handleRouteError(
  auth(async (req) => {

    await dbConnect();
    if (!req.auth?.user?.email || req.auth.user.email !== process.env.ADMIN_EMAIL) {
      throw new ApiError(403, "Forbidden");
    }

    const url = new URL(req.url);
    const monthParam = url.searchParams.get("month");

    try {
      const { year, month } = parseMonthParameter(monthParam);

      // Start at the 1st of the specified month (local)
      const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
      // End at the last day of the specified month at 23:59:59.999 (local)
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
      // Number of days in the specified month
      const totalDays = endOfMonth.getDate();

      // Fetch bookings for the specified month
      const bookings = await Booking.find({
        startDateTime: { $gte: startOfMonth, $lte: endOfMonth },
        isImage: true,
        status: "confirmed"
      }).lean();

      if (!bookings || bookings.length === 0) {
        const dailyHours = Array.from({ length: totalDays }, (_, i) => {
          const date = new Date(year, month, i + 1);
          return { date: formatLocalDate(date), hoursBooked: 0 };
        });

        return NextResponse.json(
          {
            totalEarnings: 0,
            dailyHours,
            monthlyHours: {
              booked: 0,
              notBooked: totalDays * 24,
            },
            success: true,
          },
          { status: 200 }
        );
      }

      const totalEarnings = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
      const dailyHoursMap = {};
      let bookedHours = 0;

      for (const b of bookings) {
        const key = formatLocalDate(b.startDateTime);
        dailyHoursMap[key] = (dailyHoursMap[key] || 0) + (b.numberOfHours || 0);
        bookedHours += (b.numberOfHours || 0);
      }

      const dailyHours = Array.from({ length: totalDays }, (_, i) => {
        const date = new Date(year, month, i + 1);
        const key = formatLocalDate(date);
        return {
          date: key,
          hoursBooked: dailyHoursMap[key] || 0,
        };
      });

      const totalAvailable = totalDays * 24;
      const notBooked = Math.max(totalAvailable - bookedHours, 0);

      return NextResponse.json(
        {
          totalEarnings,
          dailyHours,
          monthlyHours: {
            booked: bookedHours,
            notBooked,
          },
          success: true,
        },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message, success: false },
          { status: error.statusCode }
        );
      }
      throw error; // Let handleRouteError handle other errors
    }
  })
);
