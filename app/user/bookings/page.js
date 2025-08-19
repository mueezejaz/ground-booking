"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AlertModel from "@/app/components/alertModel";

const UserBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookins] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: "", description: "" });
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const isHit = useRef(false);
  const currentAlertFunction = useRef(() => { });


  if (status === "unauthenticated") {
    router.push("/user");
  }

  function handleSignOut() {
    signOut({ callbackUrl: '/' });
    router.push("/")
  }
  useEffect(() => {
    async function getBookings() {
      try {
        const res = await fetch("/api/user/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: session.user.email,
          }),
        });
        isHit.current = true;
        const data = await res.json();
        if (data.success) {
          setBookins(data.booking);
          if (!data.booking || data.booking.length <= 0) {
            setAlertContent({
              title: "booking don't found",
              description: "you dont have any booking pls create booking first",
            });
            setAlertOpen(true);
            currentAlertFunction.current = () => {
              setAlertOpen(false);
              router.push("/user");
            };
          }
        } else {
          setAlertContent({ title: "some thing went wrong", description: data.message });
          setAlertOpen(true);
          currentAlertFunction.current = () => {
            setAlertOpen(false);
            router.push("/user");
          };
        }
        console.log(data);
      } catch (error) {
        alert("some thing went wrong");
        console.error("Failed to fetch bookings:", error);
      }
    }


    if (status === "authenticated" && !isHit.current) {
      getBookings();
    }
  }, [status]);


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
    new Intl.DateTimeFormat("en-PK", {
      dateStyle: "medium",
      timeZone: "Asia/Karachi",
    }).format(new Date(date));


  const formatTime = (date) =>
    new Intl.DateTimeFormat("en-PK", {
      timeStyle: "short",
      timeZone: "Asia/Karachi",
    }).format(new Date(date));


  const BookingCard = ({ booking }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary break-all">
            {booking.contactEmail}
          </CardTitle>
        </div>
        <CardDescription>{formatDate(booking.createdAt)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(booking.startDateTime)} {formatTime(booking.startDateTime)} to{" "}
            {formatDate(booking.endDateTime)} {formatTime(booking.endDateTime)}
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
                image uploaded
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
          {booking.status === "pending" && (
            <span className="text-sm text-muted-foreground flex-1 min-w-0">
              Booking is currently in pending, Wait for the admin to see your payment and confirm it.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );


  return (
    <>

      <nav className="w-full px-6 py-4 bg-primary text-white flex  justify-between items-center">
        <Link href="/" passHref>
          <img
            src="/nav.webp"
            alt="Logo"
            className="h-12 sm:h-13 md:h-15 object-contain"
          />
        </Link>

        <div className="flex  space-y-2 gap-2 ">
          <Button onClick={() => { router.push("/user") }} className="bg-secondary hover:bg-red-600 text-white">
            create booking
          </Button>
          <Button onClick={handleSignOut} className="bg-accent hover:bg-red-600 text-white">
            Sign Out
          </Button>
        </div>
      </nav>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary mb-2">Booking History</h2>
            <p className="text-gray-600">View all your facility bookings</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        </div>
      </div>


      {/* Centralized Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-3xl z-[100] overflow-y-auto max-h-[90vh]">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-primary">
                  Booking Details - {selectedBooking._id}
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Here are the full details of your booking.
                </DialogDescription>
              </DialogHeader>


              {/* Image Section */}
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
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(selectedBooking.status)}
                        <span className="capitalize">{selectedBooking.status}</span>
                      </span>
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
            </>
          )}
        </DialogContent>
      </Dialog>


      {/* Full-screen Image Dialog */}
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
      </Dialog >
    </>
  );
};


export default UserBookings;

