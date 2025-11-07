"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: {
    id: string;
    name: string;
    date: number | null;
    categoryCount: number;
    participantCount: number;
  };
  onDelete?: (id: string) => void;
}

export function EventCard({ event, onDelete }: EventCardProps) {
  const router = useRouter();

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "No date set";
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader onClick={() => router.push(`/dashboard/events/${event.id}`)}>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {event.name}
        </CardTitle>
        <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {event.categoryCount} categories • {event.participantCount} participants
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/events/${event.id}/edit`);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(event.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
