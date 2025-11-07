"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";

interface Participant {
  id: string;
  email: string;
  full_name: string;
  school_institution: string | null;
  attendance_status: string;
  checked_in_at: number | null;
}

interface Category {
  id: string;
  name: string;
}

export default function CheckInPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to find participant");
        setLoading(false);
        return;
      }

      setParticipant(data.participant);
      setCategory(data.category);
    } catch (error) {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!participant) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/check-in", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: participant.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to confirm check-in");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setParticipant(data.participant);
      toast.success("Check-in successful!");
    } catch (error) {
      setError("Failed to confirm check-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp: number | null) => {
    if (!timestamp) return "";
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Success Screen
  if (success && participant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              ✓ Attendance Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="space-y-2">
              <p className="text-lg font-semibold">{participant.full_name}</p>
              {participant.school_institution && (
                <p className="text-gray-600">{participant.school_institution}</p>
              )}
              {category && (
                <p className="text-sm text-gray-500">Category: {category.name}</p>
              )}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">Check-in Time</p>
              <p className="text-lg font-medium">
                {formatDateTime(participant.checked_in_at)}
              </p>
            </div>

            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                You're all set! Thank you for checking in.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Confirmation Screen
  if (participant && category && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <QrCode className="w-10 h-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Confirm Your Identity</CardTitle>
            <p className="text-sm text-gray-600 mt-2">{category.name}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {participant.attendance_status === "checked_in" ? (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  You have already checked in at{" "}
                  {formatDateTime(participant.checked_in_at)}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-lg font-semibold">{participant.full_name}</p>
                  </div>
                  {participant.school_institution && (
                    <div>
                      <p className="text-sm text-gray-600">School/Institution</p>
                      <p className="text-lg">{participant.school_institution}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg">{participant.email}</p>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <p className="text-center text-sm text-gray-600">
                    Is this you? Click below to confirm your attendance.
                  </p>
                  <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      "Yes, Confirm Attendance"
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setParticipant(null);
                      setEmail("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    No, Go Back
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Email Input Screen
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <QrCode className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Check-In</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Enter your registered email to check in
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="mt-1"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Make sure you're using the email you registered with.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
