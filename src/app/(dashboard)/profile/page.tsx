import ProfileHeader from "@/components/profile/ProfileHeader";
import RaceArchive from "@/components/profile/RaceArchive";
import PersonalBest from "@/components/profile/PersonalBest";
import BestEfforts from "@/components/profile/BestEfforts";

const profileRaces = [
  {
    id: 1,
    title: "Bohol International Marathon",
    imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80",
  },
  {
    id: 2,
    title: "Bohol International Marathon",
    imageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80",
  },
  {
    id: 3,
    title: "Bohol International Marathon",
    imageUrl: "https://images.unsplash.com/photo-1565411642431-7e2c99f2d686?w=800&q=80",
  },
];

const bestEfforts = [
  {
    distance: "3",
    unit: "KM",
    time: "00:12:23",
    pace: "4:07 / km",
    race: "Maasin City Marathon",
    date: "August 3, 2025",
    hasMedal: true,
  },
  {
    distance: "5",
    unit: "KM",
    time: "--:--:--",
    pace: "-- / km",
    race: "",
    date: "",
    hasMedal: true,
  },
  {
    distance: "10",
    unit: "KM",
    time: "00:12:23",
    pace: "4:07 / km",
    race: "Maasin City Marathon",
    date: "August 3, 2025",
    hasMedal: true,
  },
  {
    distance: "Half",
    unit: "Marathon",
    time: "00:12:23",
    pace: "4:07 / km",
    race: "Maasin City Marathon",
    date: "August 3, 2025",
    hasMedal: true,
  },
  {
    distance: "Marathon",
    unit: "",
    time: "00:12:23",
    pace: "4:07 / km",
    race: "Maasin City Marathon",
    date: "August 3, 2025",
    hasMedal: true,
  },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ProfileHeader
          name="Hanni Pham"
          location="Mahaplag, Leyte, Philippines"
          bio="Marathoner"
          imageUrl="https://images.unsplash.com/photo-1758684051112-3df152ce3256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwd29tYW4lMjBydW5uZXJ8ZW58MXx8fHwxNzY0NTAwNTY5fDA&ixlib=rb-4.1.0&q=80&w=1080"
          totalRaces={3}
          totalDistance={52}
          timeOnFeet={{
            hours: 4,
            minutes: 45,
            seconds: 36,
          }}
        />

        <RaceArchive races={profileRaces} />

        <PersonalBest efforts={bestEfforts} />

        <BestEfforts efforts={bestEfforts} />
      </div>
    </div>
  );
}
