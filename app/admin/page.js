"use client";
import React, { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Dummy data for bookings
const dummyBookings = [
  {
    _id: "66a2a1b1a3b9c3d1e3f8b3a0",
    startDateTime: "2024-07-25T10:00:00.000Z",
    endDateTime: "2024-07-25T12:00:00.000Z",
    numberOfHours: 2,
    playerCount: 4,
    contactName: "John Doe",
    contactPhone: "123-456-7890",
    price: 5000,
    isImage: true,
    status: "confirmed",
    imageData: {
      url: "https://images.unsplash.com/photo-1554123168-b400f9c806ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    contactEmail: "john.doe@example.com",
    specialRequests: "Need a golf cart.",
    createdAt: "2024-07-24T12:00:00.000Z",
  },
  {
    _id: "66a2a1b1a3b9c3d1e3f8b3a1",
    startDateTime: "2024-07-26T14:00:00.000Z",
    endDateTime: "2024-07-26T16:00:00.000Z",
    numberOfHours: 2,
    playerCount: 2,
    contactName: "Jane Smith",
    contactPhone: "098-765-4321",
    price: 5000,
    isImage: false,
    status: "pending",
    imageData: null,
    contactEmail: "jane.smith@example.com",
    specialRequests: "",
    createdAt: "2024-07-24T13:00:00.000Z",
  },
    {
    _id: "66a2a1b1a3b9c3d1e3f8b3a2",
    startDateTime: "2024-07-27T09:00:00.000Z",
    endDateTime: "2024-07-27T11:00:00.000Z",
    numberOfHours: 2,
    playerCount: 3,
    contactName: "Peter Jones",
    contactPhone: "555-555-5555",
    price: 7500,
    isImage: true,
    status: "cancelled",
    imageData: {
      url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    contactEmail: "peter.jones@example.com",
    specialRequests: "Left-handed clubs needed.",
    createdAt: "2024-07-25T10:00:00.000Z",
  },
];


const AdminBookingsPage = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState(dummyBookings);
  const [filteredBookings, setFilteredBookings] = useState(dummyBookings);
  const [showUnverified, setShowUnverified] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const handleStatusUpdate = () => {
    if (!selectedBooking) return;

    // Update the booking in the local state
    const updatedBookings = bookings.map((booking) =>
      booking._id === selectedBooking._id ? selectedBooking : booking
    );
    setBookings(updatedBookings);
    setSelectedBooking(null);
  };

  useEffect(() => {
    let filtered = bookings;

    if (showUnverified) {
      // Assuming "unverified" means no image uploaded
      filtered = filtered.filter((booking) => !booking.isImage);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.contactPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [showUnverified, bookings, searchQuery]);

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
          <CardTitle className="text-lg text-primary">{booking._id}</CardTitle>
          <Badge variant={getStatusVariant(booking.status)} className="capitalize">
            {getStatusIcon(booking.status)}
            {booking.status}
          </Badge>
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

          <div className="mb-6 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">All Bookings</h2>
                <p className="text-gray-600">View all user bookings</p>
            </div>
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Search by email, phone, or ID"
                    className="p-2 border rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={() => setShowUnverified(!showUnverified)}>
                {showUnverified ? "Show All" : "Show Unverified"}
                </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        </div>
      </div>

      {/* Booking Details Dialog */}
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
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setSelectedBooking(null)}
                  variant="outline"
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button onClick={handleStatusUpdate}>Save</Button>
              </div>
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
      </Dialog>
    </>
  );
};

export default AdminBookingsPage;





