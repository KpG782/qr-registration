import { StatsCard } from "@/components/stats-card";
import { Calendar, FolderKanban, Users } from "lucide-react";

export default function DashboardPage() {
  // TODO: Fetch real data from database
  const stats = {
    totalEvents: 0,
    totalCategories: 0,
    totalParticipants: 0,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your QR Registration System</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Events"
          value={stats.totalEvents}
          icon={<Calendar className="h-4 w-4 text-gray-600" />}
        />
        <StatsCard
          title="Total Categories"
          value={stats.totalCategories}
          icon={<FolderKanban className="h-4 w-4 text-gray-600" />}
        />
        <StatsCard
          title="Total Participants"
          value={stats.totalParticipants}
          icon={<Users className="h-4 w-4 text-gray-600" />}
        />
      </div>
    </div>
  );
}
