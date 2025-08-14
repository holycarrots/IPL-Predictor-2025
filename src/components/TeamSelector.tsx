
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeamSelectorProps {
  label: string;
  selectedTeam: string;
  onTeamSelect: (team: string) => void;
  excludeTeam?: string;
}

const IPL_TEAMS = [
  { name: "Chennai Super Kings", code: "CSK", color: "bg-yellow-500" },
  { name: "Mumbai Indians", code: "MI", color: "bg-blue-600" },
  { name: "Royal Challengers Bangalore", code: "RCB", color: "bg-red-600" },
  { name: "Kolkata Knight Riders", code: "KKR", color: "bg-purple-600" },
  { name: "Delhi Capitals", code: "DC", color: "bg-blue-500" },
  { name: "Punjab Kings", code: "PBKS", color: "bg-red-500" },
  { name: "Rajasthan Royals", code: "RR", color: "bg-pink-500" },
  { name: "Sunrisers Hyderabad", code: "SRH", color: "bg-orange-500" },
  { name: "Gujarat Titans", code: "GT", color: "bg-teal-600" },
  { name: "Lucknow Super Giants", code: "LSG", color: "bg-cyan-500" },
];

const TeamSelector = ({ label, selectedTeam, onTeamSelect, excludeTeam }: TeamSelectorProps) => {
  const availableTeams = IPL_TEAMS.filter(team => team.name !== excludeTeam);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-blue-100">{label}</label>
      <Select value={selectedTeam} onValueChange={onTeamSelect}>
        <SelectTrigger className="bg-white/20 border-white/30 text-white">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700">
          {availableTeams.map((team) => (
            <SelectItem 
              key={team.code} 
              value={team.name}
              className="text-white hover:bg-gray-800 focus:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${team.color}`}></div>
                <span>{team.name}</span>
                <span className="text-gray-400">({team.code})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TeamSelector;
