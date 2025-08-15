"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut, signIn } from "next-auth/react"
import Loading from "../components/loading"
import AlertModel from "../components/alertModel"

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedStartTime, setSelectedStartTime] = useState("")
  const [numberOfHours, setNumberOfHours] = useState("")
  const [playerCount, setPlayerCount] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState({ title: "", description: "" })
  const hasChecked = useRef(false);
  let currentAlertFunction = useRef(()=>{});
  //auth
  const { data: session, status } = useSession()

  useEffect(() => {
    const createBooking = async () => {
      if (status === "authenticated" && !hasChecked.current) {
        hasChecked.current = true;
        console.log("entered");
        try {
          const response = await fetch("/api/user/getunverifiedbooking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
            }),
          });
          // Optional: handle the response
          const data = await response.json();
          if (data.success) {
            if (!data.isFound) return
            if (data.expired) {
              setAlertContent({ title: "booking expired", description: data.message })
              alertOpen(true);
              currentAlertFunction = () => {
                setAlertOpen(false);
              }
              return
            } else {
              console.log("to be done send user to verification page")
            }
            return
          }
        } catch (error) {
          console.log("some this went wrong")
        }
      }
    };

    createBooking();
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google", { callbackUrl: window.location.href })
    } else {
      if (status != "loading")
        setContactEmail(session.user?.email);
    }
  }, [status])

  if (status === "loading") {
    return <Loading />
  }
  const startTimes = Array.from({ length: 24 }).map((_, i) => {
    const hour24 = i
    const period = hour24 >= 12 ? "PM" : "AM"
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
    const hourStr = hour12.toString().padStart(2, "0")
    return `${hourStr}:00 ${period}`
  })
  // Parse a time string like "07:00 PM" into 24h hour and minutes
  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(" ")
    let [hour, minute] = time.split(":").map(Number)
    if (period === "PM" && hour !== 12) hour += 12
    if (period === "AM" && hour === 12) hour = 0
    return { hour, minute }
  }
  const handleSubmit = async () => {
    if (!endTimes) return

    try {
      const response = await fetch("/api/user/createbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDateTime: endTimes.startDateTime,
          endDateTime: endTimes.endDateTime,
          numberOfHours,
          playerCount,
          contactName,
          contactPhone,
          contactEmail,
          specialRequests,
        }),
      })

      const data = await response.json()
      console.log(data);
      if (data.success === false) {
        console.log("false");
      }
      if (data.success === false) {
        // Check if booking is already made
        currentAlertFunction.current = () => {
          setAlertOpen(false);
        }
        if (data.isBooked) {
          const from = new Date(data.from)
          const to = new Date(data.to)
          const createdAt = new Date(data.createdAt)
          currentAlertFunction = () => {
            setAlertOpen(false);
          }
          if (data.isImage) {
            setAlertContent({
              title: "Slot Already Booked",
              description: `This slot has already been booked from ${from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${to.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
            })
          } else {

            setAlertContent({
              title: "Slot Pending Verification",
              description: `This slot has been temporarily reserved (not verified yet) from ${from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${to.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Please check again in ${data.minutesLeft} minute(s).`,
            })
          }
          setAlertOpen(true)
        } else {
          setAlertContent({
            title: "Booking Error",
            description: data.message || "Something went wrong while booking.",
          })
          setAlertOpen(true)
        }
      } else {
        alert("Booking successful!")
      }
    } catch (err) {
      console.error(err)
      setAlertContent({
        title: "Network Error",
        description: "Could not complete your booking. Please try again later.",
      })
      setAlertOpen(true)
    }
  }
  // Format Date to "YYYY-MM-DD hh:mm AM/PM"
  const formatDateTime = (date) => {
    const yyyy = date.getFullYear()
    const mm = (date.getMonth() + 1).toString().padStart(2, "0")
    const dd = date.getDate().toString().padStart(2, "0")
    let hour = date.getHours()
    const minute = date.getMinutes().toString().padStart(2, "0")
    const period = hour >= 12 ? "PM" : "AM"
    hour = hour % 12
    if (hour === 0) hour = 12
    const hourStr = hour.toString().padStart(2, "0")
    return `${yyyy}-${mm}-${dd} ${hourStr}:${minute} ${period}`
  }

  // Calculate end datetime from selected date, start time, and duration in hours
  const calculateEndDateTime = () => {
    if (!selectedDate || !selectedStartTime || !numberOfHours) return null
    const { hour: startHour, minute: startMinute } = parseTime(selectedStartTime)
    const startDateTime = new Date(selectedDate)
    startDateTime.setHours(startHour, startMinute, 0, 0)

    const endDateTime = new Date(startDateTime.getTime())
    endDateTime.setHours(endDateTime.getHours() + Number(numberOfHours))

    return { startDateTime, endDateTime }
  }

  const getFilteredStartTimes = () => {
    if (!selectedDate) return startTimes

    const todayStr = new Date().toISOString().split("T")[0]
    if (selectedDate !== todayStr) return startTimes

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    return startTimes.filter((time) => {
      const { hour, minute } = parseTime(time)
      if (hour > currentHour) return true
      if (hour === currentHour && minute > currentMinute) return true
      return false
    })
  }

  const filteredStartTimes = getFilteredStartTimes()
  const endTimes = calculateEndDateTime()

  const handleSignOut = () => {
    signOut();
  }
  if (status === "unauthenticated") {
    return <Loading />
  }
  return (
    <div className="relative h-screen w-full overflow-auto bg-secondary text-primary">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 bg-primary text-white flex justify-between items-center">
        <Link href="/" className="text-lg font-bold tracking-tight hover:underline">
          🏏 Ground Booker
        </Link>
        <Button onClick={handleSignOut} className="bg-accent hover:bg-red-600 text-white">
          Sign Out
        </Button>
      </nav>

      {/* Booking Form */}
      <div className="max-w-2xl mx-auto py-10 px-4 text-primary">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">Book a Ground</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold flex items-center text-primary">
                <Calendar className="w-4 h-4 mr-2 text-secondary" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setSelectedStartTime("")
                }}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-semibold flex items-center text-primary">
                <Clock className="w-4 h-4 mr-2 text-secondary" />
                Start Time
              </Label>
              <select
                id="startTime"
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-primary rounded-md"
                disabled={!selectedDate}
              >
                <option value="">Choose start time</option>
                {filteredStartTimes.length === 0 && <option disabled>No available times today</option>}
                {filteredStartTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration (hours) */}
            <div className="space-y-2">
              <Label htmlFor="hours" className="text-sm font-semibold text-primary">
                Duration (hours) price Rs 100 per hour
              </Label>
              <Input
                id="hours"
                type="number"
                min="1"
                max="24"
                placeholder="Enter number of hours"
                value={numberOfHours}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === "" || (Number(val) >= 1 && Number(val) <= 24)) {
                    setNumberOfHours(val)
                  }
                }}
                disabled={!selectedStartTime}
              />
            </div>

            {/* Booking summary */}
            {endTimes && (
              <>
                <p className="text-sm text-secondary">
                  Booking from <strong>{formatDateTime(endTimes.startDateTime)}</strong> to <strong>{formatDateTime(endTimes.endDateTime)}</strong>
                </p>
                <p className="text-sm text-secondary">
                  total amount {numberOfHours * 100};
                </p>
              </>
            )}

            {/* Players Count */}
            <div className="space-y-2">
              <Label htmlFor="players" className="text-sm font-semibold flex items-center text-primary">
                <Users className="w-4 h-4 mr-2 text-secondary" />
                Number of Players
              </Label>
              <Input
                id="players"
                type="number"
                placeholder="e.g., 22"
                value={playerCount}
                onChange={(e) => setPlayerCount(e.target.value)}
                min="1"
                max="50"
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <Label htmlFor="name" className="text-sm font-semibold text-primary">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />

              <Label htmlFor="phone" className="text-sm font-semibold text-primary">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />

              <Label htmlFor="email" className="text-sm font-semibold text-primary">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                defaultValue={contactEmail}
                readOnly
              />
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="requests" className="text-sm font-semibold text-primary">
                Special Requests
              </Label>
              <Textarea
                id="requests"
                placeholder="Any equipment, preferences, etc."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Submit Button */}
            <div>
              <Button
                className="bg-primary hover:bg-secondary text-white w-full"
                onClick={handleSubmit}
              >
                Submit Booking
              </Button>
            </div>
          </CardContent>
        </Card>
        <AlertModel
          isOpen={alertOpen}
          setisOpen={setAlertOpen}
          alertContent={alertContent}
          onclick={currentAlertFunction.current}
        />
      </div>
    </div>
  )
}





