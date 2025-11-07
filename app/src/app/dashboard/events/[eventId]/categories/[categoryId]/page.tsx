"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParticipantTable } from "@/components/participant-table";
import { FileUploadModal } from "@/components/file-upload-modal";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { ArrowLeft, Upload, UserPlus, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Event {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  event_id: string;
  participantCount: number;
}

interface Participant {
  id: string;
  email: string;
  full_name: string;
  school_institution: string | null;
  attendance_status: "pending" | "checked_in";
  checked_in_at: number | null;
  winner_rank: number | null;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const categoryId = params.categoryId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    schoolInstitution: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const fetchData = async () => {
    try {
      const [eventRes, categoryRes, participantsRes] = await Promise.all([
        fetch(`/api/events/${eventId}`),
        fetch(`/api/categories/${categoryId}`),
        fetch(`/api/participants?categoryId=${categoryId}`),
      ]);

      if (!eventRes.ok) throw new Error("Failed to fetch event");
      if (!categoryRes.ok) throw new Error("Failed to fetch category");
      if (!participantsRes.ok) throw new Error("Failed to fetch participants");

      const eventData = await eventRes.json();
      const categoryData = await categoryRes.json();
      const participantsData = await participantsRes.json();

      setEvent(eventData);
      setCategory(categoryData);
      setParticipants(participantsData);
    } catch (error) {
      toast.error("Failed to load data");
      router.push(`/dashboard/events/${eventId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          email: formData.email,
          fullName: formData.fullName,
          schoolInstitution: formData.schoolInstitution,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add participant");
      }

      toast.success("Participant added successfully");
      setFormData({ email: "", fullName: "", schoolInstitution: "" });
      setAddModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant) return;

    setSaving(true);

    try {
      const response = await fetch(`/api/participants/${editingParticipant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          schoolInstitution: formData.schoolInstitution,
        }),
      });

      if (!response.ok) throw new Error("Failed to update participant");

      toast.success("Participant updated successfully");
      setEditingParticipant(null);
      setFormData({ email: "", fullName: "", schoolInstitution: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to update participant");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this participant?")) return;

    try {
      const response = await fetch(`/api/participants/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete participant");

      toast.success("Participant deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete participant");
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      const response = await fetch(`/api/participants/${id}/check-in`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to check in participant");

      toast.success("Participant checked in successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to check in participant");
    }
  };

  const openEditModal = (participant: Participant) => {
    setEditingParticipant(participant);
    setFormData({
      email: participant.email,
      fullName: participant.full_name,
      schoolInstitution: participant.school_institution || "",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  const stats = {
    total: participants.length,
    checkedIn: participants.filter((p) => p.attendance_status === "checked_in").length,
    pending: participants.filter((p) => p.attendance_status === "pending").length,
  };

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/dashboard/events/${eventId}`)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Event
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{category.name}</CardTitle>
              <p className="text-sm text-gray-600 mt-2">Category Details</p>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.checkedIn}</div>
                <div className="text-sm text-gray-600">Checked In</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="participants" className="space-y-6">
        <TabsList>
          <TabsTrigger value="participants">
            <UserPlus className="h-4 w-4 mr-2" />
            Participants
          </TabsTrigger>
          <TabsTrigger value="qr-code">
            <QrCode className="h-4 w-4 mr-2" />
            QR Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Participants</h2>
              <p className="text-gray-600 mt-1">Manage participants for this category</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setUploadModalOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
              <Button onClick={() => setAddModalOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Participant
              </Button>
            </div>
          </div>

          <ParticipantTable
            participants={participants}
            onEdit={openEditModal}
            onDelete={handleDeleteParticipant}
            onCheckIn={handleCheckIn}
          />
        </TabsContent>

        <TabsContent value="qr-code">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">QR Code for Check-in</h2>
              <p className="text-gray-600 mt-1">
                Share this QR code for participants to check in
              </p>
            </div>
            <QRCodeDisplay
              categoryId={categoryId}
              categoryName={category.name}
              eventName={event?.name}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      <FileUploadModal
        categoryId={categoryId}
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onImportComplete={fetchData}
      />

      {/* Add/Edit Participant Modal */}
      <Dialog
        open={addModalOpen || editingParticipant !== null}
        onOpenChange={(open) => {
          if (!open) {
            setAddModalOpen(false);
            setEditingParticipant(null);
            setFormData({ email: "", fullName: "", schoolInstitution: "" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingParticipant ? "Edit Participant" : "Add Participant"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={editingParticipant ? handleEditParticipant : handleAddParticipant}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="schoolInstitution">School/Institution</Label>
              <Input
                id="schoolInstitution"
                value={formData.schoolInstitution}
                onChange={(e) =>
                  setFormData({ ...formData, schoolInstitution: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingParticipant ? "Update" : "Add"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddModalOpen(false);
                  setEditingParticipant(null);
                  setFormData({ email: "", fullName: "", schoolInstitution: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
