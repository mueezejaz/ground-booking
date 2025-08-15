'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentVerificationPage() {
  const { bookingId } = useParams()
  const [timeLeft, setTimeLeft] = useState(20)
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

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

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      alert("Booking cancelled.")
      // TODO: Cancel booking API call
    }
  }

  const handleSubmit = () => {
    if (!image) {
      alert("Please upload a screenshot of your payment.")
      return
    }
    alert("Payment submitted for verification.")
    // TODO: Upload image and verify
  }

  return (
    <div className="min-h-screen w-full bg-primary text-white flex justify-center items-center px-4 py-10">
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
              ₹100 per hour (Dummy)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="upload" className="text-primary font-medium">
              Upload Payment Screenshot
            </Label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-secondary">Selected: {image.name}</p>
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

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSubmit}
              className="bg-secondary text-dark hover:bg-accent hover:text-white w-full"
            >
              Submit for Verification
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancel}
            >
              Cancel Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

