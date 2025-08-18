'use client'

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import AlertModel from "@/app/components/alertModel"
export default function PaymentVerificationPage() {
    const { bookingId } = useParams()
    const [timeLeft, setTimeLeft] = useState(20)
    const [image, setImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const { data: session, status } = useSession()
    const [data, setData] = useState(0);
    const inputRef = useRef(null);
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertContent, setAlertContent] = useState({ title: "", description: "" })
    const isHit = useRef(false);
    const currentAlertFunction = useRef(() => { });
    const router = useRouter()
    console.log(session)
    if (status === "unauthenticated") {
        router.push("/user");
    }
    useEffect(() => {
        const verifyBooking = async () => {
            if (status === "authenticated" && !isHit.current) {
                console.log("running")
                try {
                    const res = await fetch('/api/user/getunverifiedbooking/byid', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include', // if using cookies for auth
                        body: JSON.stringify({
                            id: bookingId,
                        }),
                    });
                    isHit.current = true;
                    const data = await res.json();
                    if (data.success) {
                        if (!data.isFound) {
                            setAlertContent({ title: "booking not found", description: "booking not found may be your id is wrong or admin cancel your booking pls try again" })
                            setAlertOpen(true);
                            currentAlertFunction.current = () => {
                                router.push("/user");
                                setAlertOpen(false)
                            }
                            return
                        }
                        if (data.expired) {
                            setAlertContent({ title: "booking expired", description: data.message })
                            setAlertOpen(true);
                            currentAlertFunction.current = () => {
                                router.push("/user");
                                setAlertOpen(false);
                            }
                            return
                        } else {
                            setTimeLeft(data.minutesLeft);
                            setPreviewUrl(data.booking?.imageData?.url)
                            setData(data.booking)

                        }
                        return
                    } else {
                        setAlertContent({ title: "some thing wrong", description: data.message })
                        setAlertOpen(true);
                        currentAlertFunction.current = () => {
                            setAlertOpen(false);
                        }
                    }
                } catch (err) {
                    console.log(data);
                    alert("some thing went wrong");
                }
            };
        }
        if (bookingId) {
            verifyBooking();
        }
    }, [bookingId, status]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            setPreviewUrl(URL.createObjectURL(file))
        }

    }

    const handleCancel = async () => {
        if (confirm("Are you sure you want to cancel this booking?")) {
            const res = await fetch('/api/user/deletebooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // if using cookies for auth
                body: JSON.stringify({
                    id: bookingId,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setAlertContent({ title: "success", description: data.message });
                setAlertOpen(true);
                currentAlertFunction.current = () => {
                    router.push("/user");
                    setAlertOpen(false);
                }
            }
        }
    }

    const handleSubmit = async () => {
        if (data.isImage) {
            alert("image already uploaded")
            return
        }
        if (!image) {
            alert("Please upload a screenshot of your payment.");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("bookingId", bookingId);
        try {
            const res = await fetch("/api/user/uploadimage", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log(data);
            if (data.success) {
                setAlertContent({ title: "success", description: data.message });
                setAlertOpen(true);
                currentAlertFunction.current = () => {
                    router.push("/user/bookings");
                    setAlertOpen(false);
                }
            } else {
                alert("Upload failed: " + data.message);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Something went wrong during upload.");
        }
    };

    return (
        <>
            <nav className="w-full px-6 py-4 bg-primary text-white flex justify-between items-center">
                <Link href="/" className="text-lg font-bold tracking-tight hover:underline">
                    🏏 Ground Booker
                </Link>

                <div className="flex flex-row space-x-2">
                    <Button onClick={() => { router.push("/user/bookings") }} className="bg-secondary hover:bg-red-600 text-white">
                        bookings
                    </Button>
                    <Button onClick={() => { signOut(); router.push("/") }} className="bg-accent hover:bg-red-600 text-white">
                        Sign Out
                    </Button>
                </div>
            </nav>
            <div className="min-h-screen w-full bg-white flex justify-center items-center px-4 py-10">
                <Card className="w-full max-w-xl bg-white text-primary shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-primary">Payment Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">
                                Booking ID: <span className="text-secondary">{bookingId}</span>
                            </h2>
                            <p>
                                Time left to verify:{" "}
                                <span className="text-accent font-bold">{timeLeft} minute(s)</span>
                            </p>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-primary font-medium">Amount to Pay</Label>
                            <p className="bg-secondary text-dark px-4 py-2 rounded-md font-bold">
                                {data.price}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="upload" className="text-primary font-medium">
                                Upload Payment Screenshot
                            </Label>
                            <Input ref={inputRef} type="file" accept="image/*" onChange={handleImageUpload} />
                            {(image || data.isImage) && (
                                <div className="mt-2 space-y-2">
                                    <p className="text-sm text-secondary">Selected: {image ? image.name : data.imageData.fileName}</p>
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            alt="Payment preview"
                                            className="rounded-md border border-secondary max-h-64 object-contain"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button
                                onClick={() => {
                                    if (data.isImage) {
                                        alert("image already uploaded")
                                        return
                                    }
                                    inputRef.current.click();
                                }}
                                className="bg-secondary text-dark hover:bg-accent hover:text-white w-full"
                            >
                                {
                                    data.isImage ? "Image is already uploaded" : "click here to select image"
                                }
                            </Button>

                            <Button
                                onClick={handleSubmit}
                                className="bg-secondary text-dark hover:bg-accent hover:text-white w-full"
                            >
                                {
                                    data.isImage ? "Image is already uploaded" : "submit for verification"
                                }
                            </Button>
                            {
                                !data.isImage &&
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={handleCancel}
                                >
                                    Cancel Booking
                                </Button>
                            }
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
        </>
    )
}

