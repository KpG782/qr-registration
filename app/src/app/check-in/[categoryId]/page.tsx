"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  event_id: string;
}

interface Participant {
  id: string;
  email: string;
  full_name: string;
  school_institution: string | null;
  attendance_status: "pending" | "checked_in";
  checked_in_at: number | null;
}

export default function CheckInPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setCategory(data);
      }
    } catch (error) {
      console.error("Failed to fetch category:", error);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCheckInStatus("idle");
    setMessage("");
    setParticipant(null);

    try {
      // First, find the participant by email and category
      const participantsResponse = await fetch(
        `/api/participants?categoryId=${categoryId}`
      );

      if (!participantsResponse.ok) {
        throw new Error("Failed to fetch participants");
      }

      const participants: Participant[] = await participantsResponse.json();
      const foundParticipant = participants.find(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      );

      if (!foundParticipant) {
        setCheckInStatus("error");
        setMessage("Email not found in this category. Please check your email or contact the organizer.");
        toast.error("Email not found");
        return;
      }

      // Check if already checked in
      if (foundParticipant.attendance_status === "checked_in") {
        setCheckInStatus("error");
        setMessage("You have already checked in!");
        setParticipant(foundParticipant);
        toast.info("Already checked in");
        return;
      }

      // Check in the participant
      const checkInResponse = await fetch(
        `/api/participants/${foundParticipant.id}/check-in`,
        {
          method: "POST",
        }
      );

      if (!checkInResponse.ok) {
        throw new Error("Failed to check in");
      }

      const updatedParticipant = await checkInResponse.json();
      setCheckInStatus("success");
      setMessage("Successfully checked in!");
      setParticipant(updatedParticipant);
      toast.success("Check-in successful!");
      setEmail("");
    } catch (error) {
      console.error("Check-in error:", error);
      setCheckInStatus("error");
      setMessage("Failed to check in. Please try again or contact support.");
      toast.error("Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Event Check-In</CardTitle>
          {category && (
            <p className="text-gray-600 mt-2">
              Category: <span className="font-semibold">{category.name}</span>
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !email}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking in...
                </>
              ) : (
                "Check In"
              )}
            </Button>
          </form>

          {checkInStatus !== "idle" && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                checkInStatus === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {checkInStatus === "success" ? (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      checkInStatus === "success"
                        ? "text-green-900"
                        : "text-red-900"
                    }`}
                  >
                    {message}
                  </p>
                  {participant && (
                    <div className="mt-2 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {participant.full_name}
                      </p>
                      {participant.school_institution && (
                        <p>
                          <span className="font-medium">School:</span>{" "}
                          {participant.school_institution}
                        </p>
                      )}
                      {participant.checked_in_at && (
                        <p>
                          <span className="font-medium">Check-in Time:</span>{" "}
                          {new Date(
                            participant.checked_in_at * 1000
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Enter the email address you used to register for this event.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
