import Navbar from "./components/navebar"
import Hero from "./components/hero"
import GroundShowcase from "./components/GroundShowCase"
import { Button } from "@/components/ui/button"
import FeedbackForm from "./components/FeedBackForm"
import ClientReviews from "./components/ClintReviews"
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <GroundShowcase />
      <ClientReviews />
      <FeedbackForm />
    </>
  )
}
