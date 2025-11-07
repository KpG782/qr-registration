"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, CheckCircle, Clock } from "lucide-react";

interface Participant {
  id: string;
  email: string;
  full_name: string;
  school_institution: string | null;
  attendance_status: 'pending' | 'checked_in';
  checked_in_at: number | null;
  winner_rank: number | null;
}

interface ParticipantTableProps {
  participants: Participant[];
  onEdit: (participant: Participant) => void;
  onDelete: (id: string) => void;
  onCheckIn: (id: string) => void;
}

export function ParticipantTable({
  participants,
  onEdit,
  onDelete,
  onCheckIn,
}: ParticipantTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "checked_in" | "pending">("all");

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.school_institution?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "checked_in" && p.attendance_status === "checked_in") ||
      (filter === "pending" && p.attendance_status === "pending");

    return matchesSearch && matchesFilter;
  });

  const formatDateTime = (timestamp: number | null) => {
    if (!timestamp) return "-";
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getWinnerBadge = (rank: number | null) => {
    if (!rank) return null;
    const badges = {
      1: <Badge className="bg-yellow-500">🥇 1st</Badge>,
      2: <Badge className="bg-gray-400">🥈 2nd</Badge>,
      3: <Badge className="bg-orange-600">🥉 3rd</Badge>,
    };
    return badges[rank as 1 | 2 | 3];
  };

  if (participants.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-600 mb-4">No participants yet</p>
        <p className="text-sm text-gray-500">
          Upload a CSV file or add participants manually
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by name, email, or school..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All ({participants.length})</TabsTrigger>
            <TabsTrigger value="checked_in">
              Checked In ({participants.filter((p) => p.attendance_status === "checked_in").length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({participants.filter((p) => p.attendance_status === "pending").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check-in Time</TableHead>
              <TableHead>Winner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium">{participant.email}</TableCell>
                <TableCell>{participant.full_name}</TableCell>
                <TableCell>{participant.school_institution || "-"}</TableCell>
                <TableCell>
                  {participant.attendance_status === "checked_in" ? (
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Checked In
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDateTime(participant.checked_in_at)}
                </TableCell>
                <TableCell>{getWinnerBadge(participant.winner_rank)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {participant.attendance_status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCheckIn(participant.id)}
                      >
                        Check In
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(participant)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(participant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredParticipants.length === 0 && participants.length > 0 && (
        <div className="text-center py-8 text-gray-600">
          No participants match your search or filter
        </div>
      )}
    </div>
  );
}
