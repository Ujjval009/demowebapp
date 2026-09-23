import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function BookingSuccess() {
  return (
    <div className="max-w-[480px] mx-auto text-center py-16">
      <CheckCircle size={64} className="text-sage mx-auto mb-6" strokeWidth={1.5} />
      <h1 className="font-serif text-2xl font-semibold mb-3">Appointment Booked!</h1>
      <p className="text-ink-soft mb-2">
        Your appointment request has been received. Our team will confirm your
        slot via SMS or email within 2 hours.
      </p>
      <p className="text-ink-soft text-sm mb-8">
        Please arrive 15 minutes before your scheduled time with a valid photo ID.
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/">
          <Button variant="ghost">Back to Home</Button>
        </Link>
        <Link to="/book-appointment">
          <Button>Book Another</Button>
        </Link>
      </div>
    </div>
  );
}
