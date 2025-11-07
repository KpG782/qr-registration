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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryList } from "@/components/category-list";
import { Plus, Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: string;
  name: string;
  description: string | null;
  date: number | null;
  categoryCount: number;
  participantCount: number;
}

interface Category {
  id: string;
  name: string;
  participantCount: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchEventAndCategories();
  }, [eventId]);

  const fetchEventAndCategories = async () => {
    try {
      const [eventRes, categoriesRes] = await Promise.all([
        fetch(`/api/events/${eventId}`),
        fetch(`/api/categories?eventId=${eventId}`),
      ]);

      if (!eventRes.ok) throw new Error("Failed to fetch event");
      if (!categoriesRes.ok) throw new Error("Failed to fetch categories");

      const eventData = await eventRes.json();
      const categoriesData = await categoriesRes.json();

      setEvent(eventData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Failed to load data");
      router.push("/dashboard/events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          name: categoryName,
        }),
      });

      if (!response.ok) throw new Error("Failed to create category");

      toast.success("Category created successfully");
      setCategoryName("");
      setDialogOpen(false);
      fetchEventAndCategories();
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      toast.success("Category deleted successfully");
      fetchEventAndCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "No date set";
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/dashboard/events")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{event.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                {formatDate(event.date)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {event.categoryCount} categories
              </div>
              <div className="text-sm text-gray-600">
                {event.participantCount} participants
              </div>
            </div>
          </div>
        </CardHeader>
        {event.description && (
          <CardContent>
            <p className="text-gray-600">{event.description}</p>
          </CardContent>
        )}
      </Card>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Categories</h2>
          <p className="text-gray-600 mt-1">
            Organize participants into categories
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <Label htmlFor="categoryName">Category Name *</Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Web Development, Mobile Apps"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Category"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <CategoryList
        categories={categories}
        eventId={eventId}
        eventName={event.name}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}
