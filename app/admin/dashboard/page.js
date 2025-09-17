"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useSession, signOut, signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'


export default function Dashboard() {
  const [data, setData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.push("/user");
  }

  // Generate month options for the last 12 months and next 6 months
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();

    // Add previous 12 months
    for (let i = 12; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long"
      });
      options.push({ value, label });
    }

    // Add next 6 months
    for (let i = 1; i <= 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long"
      });
      options.push({ value, label });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  const fetchDashboard = async (month) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard?month=${month}`);
      if (!res.ok) {
        const json = await res.json();
        if (json.message === "Forbidden") router.push("/user");
        confirm("some thing went wrong")
        router.push("/")
        return;
      }
      const json = await res.json();
      if (json.message === "Forbidden") router.push("/user");
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(selectedMonth);
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  if (!data && !loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-[#080229]">
        Loading...
      </div>
    );
  }

  const { totalEarnings, monthlyHours, dailyHours } = data || {};
  const maxHours = dailyHours ? Math.max(...dailyHours.map((d) => d.hoursBooked || 0), 1) : 1;

  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDayNum = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  const selectedMonthLabel = monthOptions.find(option => option.value === selectedMonth)?.label || '';

  return (
    <div className="min-h-screen bg-[#080229] p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-extrabold mb-4 md:mb-0 tracking-wide uppercase text-[#665EFF]">
          Admin Dashboard
        </h1>

        {/* Month Selection Dropdown */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <label htmlFor="month-select" className="text-sm font-medium text-gray-300">
            Select Month:
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="bg-[#0e053a] border border-[#665EFF]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#665EFF] focus:border-transparent transition-all duration-200 min-w-[200px]"
            disabled={loading}
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#0e053a] text-white">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#665EFF]"></div>
          <span className="ml-3">Loading {selectedMonthLabel}...</span>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Total Earnings */}
            <Card className="bg-[#0e053a] p-6 rounded-2xl shadow-lg hover:shadow-[#665EFF]/40 transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#665EFF] font-bold text-lg">
                  Total Earnings - {selectedMonthLabel}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">Rs {totalEarnings || 0}</p>
              </CardContent>
            </Card>

            {/* Monthly Hours */}
            <Card className="bg-[#0e053a] p-6 rounded-2xl shadow-lg hover:shadow-[#665EFF]/40 transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#665EFF] font-bold text-lg">
                  Hours - {selectedMonthLabel}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-white text-2xl mb-2">
                  <span className="text-white">Booked</span>
                  <span className="text-white text-2xl">{monthlyHours?.booked || 0}h</span>
                </div>
                <div className="flex justify-between text-white text-2xl mt-2">
                  <span className="">Available</span>
                  <span className="text-white text-2xl">{monthlyHours?.notBooked || 0}h</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Heatmap */}
          <Card className="bg-[#0e053a] p-6 rounded-2xl shadow-lg hover:shadow-[#665EFF]/40 transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#665EFF] font-bold text-lg">
                Hours Booked - {selectedMonthLabel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-3">
                {dailyHours?.map((day) => {
                  const intensity = day.hoursBooked
                    ? Math.min(1, day.hoursBooked / maxHours)
                    : 0;
                  const bgColor = intensity
                    ? `rgba(102,94,255,${0.3 + intensity * 0.7})`
                    : "rgba(255,255,255,0.08)";
                  return (
                    <div
                      key={day.date}
                      className="flex flex-col items-center"
                      title={`${formatDay(day.date)}, ${day.date} — ${day.hoursBooked}h booked`}
                    >
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold cursor-pointer"
                        style={{ backgroundColor: bgColor, color: "#fff" }}
                      >
                        {day.hoursBooked > 0 ? day.hoursBooked : ""}
                      </div>
                      <span className="text-[10px] text-gray-300 mt-1">
                        {formatDayNum(day.date)}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        {formatDay(day.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
