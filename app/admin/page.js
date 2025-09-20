"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Maximize,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AlertModel from "../components/alertModel";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'
import { useSession, signOut, signIn } from "next-auth/react"
import Loading from "../components/componentLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Dummy data for bookings
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
const AdminBookingsPage = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  // const [filteredBookings, setFilteredBookings] = useState([]);
  const [showUnverified, setShowUnverified] = useState("show all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const isHist = useRef(false);
  const router = useRouter();
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState({ title: "", description: "" })
  let currentAlertFunction = useRef(() => { });
  const debouncedSearchTerm = useDebounce(searchQuery, 1000);
  if (status === "unauthenticated") {
    router.push("/user");
  }
  useEffect(() => {
    async function getBookings() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/allbooking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unVerified: showUnverified,
          })
        });
        setLoading(false);
        const data = await res.json();
        console.log(data);
        if (data.success) {
          setBookings(data.bookings);
        } else {
          setAlertContent({
            title: "Error",
            description: data.message || "Something went wrong",
          })
          setAlertOpen(true)
          currentAlertFunction.current = () => {
            setAlertOpen(false);
            if (data.message === "Forbidden") router.push("/user");
          }
        }
      } catch (error) {
        console.log(error)
        alert("something wend wrog")
      }
    }
    if (status === "authenticated") {
      getBookings();
    }
  }, [status, showUnverified, debouncedSearchTerm]);


  useEffect(() => {
    async function SearchBooking() {
      if (debouncedSearchTerm) {
        console.log('Searching for:', searchQuery);
        try {
          const res = await fetch("/api/admin/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              search: searchQuery,
              unVerified: showUnverified,
            })
          });
          const data = await res.json();
          console.log(data);
          if (data.success) {
            setBookings(data.bookings);
          } else {
            setAlertContent({
              title: "Error",
              description: data.message || "Something went wrong",
            })
            setAlertOpen(true)
            currentAlertFunction.current = () => {
              setAlertOpen(false);
              if (data.message === "Forbidden") router.push("/user");
            }
          }
        } catch (error) {
          console.log(error)
          alert("something wend wrog")
        }
      }
    }
    SearchBooking();
  }, [debouncedSearchTerm]);



  const handleStatusUpdate = async () => {
    if (!selectedBooking) { return };
    try {
      setSaveLoading(true);
      const res = await fetch("/api/admin/updatebooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          status: selectedBooking.status
        })
      });
      setSaveLoading(false);
      const data = await res.json();
      console.log(data);
      if (data.success) {
        alert("status updated successfully");
        setBookings((prevBookings) => {
          return prevBookings.filter((e) => e._id !== selectedBooking._id);
        });
        setSelectedBooking(false);
      } else {
        setSelectedBooking(null);
        setAlertContent({
          title: "Error",
          description: data.message || "Something went wrong",
        })
        setAlertOpen(true)
        currentAlertFunction.current = () => {
          setAlertOpen(false);
          if (data.message === "Forbidden") router.push("/user");
        }
      }
    } catch (error) {
      console.log(error)
      alert("something wend wrog")
    }
  };
  async function handleDel(id) {
    if (confirm("are you sure you want to delete id")) {
      try {
        const res = await fetch("/api/admin/deletebookingbyid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: id,
          })
        });
        // setLoading(false);
        const data = await res.json();
        console.log(data);
        if (data.success) {
          setBookings((prev) => prev.filter((booking) => booking._id !== data.bookingId))
          alert("booking delete successfully")
        } else {
          alert("fail to delete it")
        }
      } catch (error) {
        alert("some thing went wrong");
        console.log("some thing went wrong", error);
      }
    }
  }
  async function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(date));

  const formatTime = (date) =>
    new Intl.DateTimeFormat("en-US", {
      timeStyle: "short",
    }).format(new Date(date));

  const BookingCard = ({ booking }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary truncate">
            {booking.contactEmail}
          </CardTitle>
        </div>
        <CardDescription>{formatDate(booking.createdAt)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(booking.startDateTime)} {formatTime(booking.startDateTime)} to {formatDate(booking.endDateTime)} {formatTime(booking.endDateTime)}
          </div>
          <div className="font-medium flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {booking.numberOfHours}h
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {booking.playerCount} players
          </div>
          <div className="text-lg font-bold text-secondary">
            Rs. {booking.price.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center">
            {booking.isImage ? (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Image Uploaded
              </div>
            ) : (
              <div className="flex items-center text-gray-500 text-sm">
                <XCircle className="w-4 h-4 mr-1" />
                No Image
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedBooking(booking)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={getStatusVariant(booking.status)} className="capitalize flex-shrink-0">
            {getStatusIcon(booking.status)}
            {booking.status}
          </Badge>
        </div>
        {booking.status === "cancelled" ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => {
              handleDel(booking._id);
            }} className="capitalize bg-red-600 flex-shrink-0">delete booking</Button>
          </div>
        ) : ""}
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-primary text-white border-primary mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white">Admin - All Bookings</CardTitle>
              <CardDescription className="text-blue-200">
                Manage and track all user bookings
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-2">All Bookings</h2>
              <p className="text-gray-600">View all user bookings</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Search by email, phone, or ID"
                className="p-2 border rounded w-full md:w-auto"
                value={searchQuery}
                onChange={handleSearch}
              />
              <select
                id="bt"
                value={showUnverified}
                required
                onChange={(e) => setShowUnverified(e.target.value)}
                className="w-full px-3 py-2 border border-primary rounded-md"
              >
                <option value={"show all"} key={"show All"}>
                  show all
                </option>
                <option value={"show univerified"} key={"show Univerified"}>
                  show univerified
                </option>
                <option value={"show cancel"} key={"show Cancled"}>
                  show cancel
                </option>
              </select>


              {/* <Button className="w-full md:w-auto" onClick={() => setShowUnverified(!showUnverified)}> */}
              {/*   {showUnverified ? "Show All" : "Show Unverified"} */}
              {/* </Button> */}
              <Button className="w-full md:w-auto"
                onClick={() => router.push("/user")}
              >
                create new booking +
              </Button>
              <Button className="w-full md:w-auto"
                onClick={() => router.push("/admin/dashboard")}
              >
                dashboard
              </Button>
            </div>
          </div>
          {loading ? <Loading /> :
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.length <= 0 ? <h1 className="text-5xl">no booking found</h1> : bookings.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} />
                ))}
              </div>
            </>
          }

        </div>
      </div>
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-3xl z-[100] overflow-y-auto max-h-[90vh]">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-primary">
                  Booking Details - {selectedBooking._id}
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Here are the full details of the booking.
                </DialogDescription>
              </DialogHeader>
              {selectedBooking.isImage && selectedBooking.imageData && (
                <div className="relative w-full h-80 rounded-lg overflow-hidden">
                  <img
                    src={selectedBooking.imageData.url}
                    alt="Booking proof"
                    className="cursor-pointer object-cover absolute w-full h-full"
                    onClick={() => setFullscreenImage(selectedBooking.imageData.url)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70"
                    onClick={() => setFullscreenImage(selectedBooking.imageData.url)}
                  >
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="mr-2">👤</span>
                      <span className="font-medium">{selectedBooking.contactName}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      {selectedBooking.contactPhone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      {selectedBooking.contactEmail}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Booking Info</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">
                        {formatDate(selectedBooking.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">
                        {formatDate(selectedBooking.startDateTime)}{" "}
                        {formatTime(selectedBooking.startDateTime)} to{" "}
                        {formatDate(selectedBooking.endDateTime)}{" "}
                        {formatTime(selectedBooking.endDateTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">
                        {selectedBooking.numberOfHours} hours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Players:</span>
                      <span className="font-medium">{selectedBooking.playerCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium text-secondary">
                        Rs. {selectedBooking.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Status:</span>
                      <select
                        value={selectedBooking.status}
                        onChange={(e) =>
                          setSelectedBooking({
                            ...selectedBooking,
                            status: e.target.value,
                          })
                        }
                        className="p-2 border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex justify-between">
                      <span>Image Uploaded:</span>
                      <span>
                        {selectedBooking.isImage ? (
                          <span className="text-green-600">Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedBooking.specialRequests && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Special Requests</h4>
                  <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}
              <div className="flex flex-col md:flex-row justify-end mt-6">
                <Button
                  onClick={() => setSelectedBooking(null)}
                  variant="outline"
                  className="mr-0 md:mr-2 mb-2 md:mb-0"
                >
                  Cancel
                </Button>
                <Button onClick={handleStatusUpdate}> {saveLoading ? "Loading..." : "save"}</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogContent className="max-w-full h-full p-4 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[110]">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={fullscreenImage}
              alt="Full-screen booking proof"
              className="object-contain max-w-[95vw] max-h-[95vh]"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-black/20"
              onClick={() => setFullscreenImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AlertModel
        isOpen={alertOpen}
        setisOpen={setAlertOpen}
        alertContent={alertContent}
        onclick={currentAlertFunction.current}
      />
    </>
  );
};
export default AdminBookingsPage;





