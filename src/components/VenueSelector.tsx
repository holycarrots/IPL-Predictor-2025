
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface VenueSelectorProps {
  selectedVenue: string;
  onVenueSelect: (venue: string) => void;
}

const IPL_VENUES = [
  { name: "Wankhede Stadium", city: "Mumbai", capacity: "33,108" },
  { name: "M. Chinnaswamy Stadium", city: "Bangalore", capacity: "40,000" },
  { name: "Eden Gardens", city: "Kolkata", capacity: "66,349" },
  { name: "Feroz Shah Kotla", city: "Delhi", capacity: "41,820" },
  { name: "M.A. Chidambaram Stadium", city: "Chennai", capacity: "50,000" },
  { name: "Sawai Mansingh Stadium", city: "Jaipur", capacity: "30,000" },
  { name: "Punjab Cricket Association IS Bindra Stadium", city: "Mohali", capacity: "26,950" },
  { name: "Rajiv Gandhi International Stadium", city: "Hyderabad", capacity: "55,000" },
  { name: "Narendra Modi Stadium", city: "Ahmedabad", capacity: "132,000" },
  { name: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium", city: "Lucknow", capacity: "50,000" },
  { name: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium", city: "Visakhapatnam", capacity: "27,000" },
  { name: "Maharashtra Cricket Association Stadium", city: "Pune", capacity: "37,406" },
];

const VenueSelector = ({ selectedVenue, onVenueSelect }: VenueSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-blue-100 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Select Venue
      </label>
      <Select value={selectedVenue} onValueChange={onVenueSelect}>
        <SelectTrigger className="bg-white/20 border-white/30 text-white">
          <SelectValue placeholder="Choose cricket ground" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700 max-h-60">
          {IPL_VENUES.map((venue) => (
            <SelectItem 
              key={venue.name} 
              value={venue.name}
              className="text-white hover:bg-gray-800 focus:bg-gray-800"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{venue.name}</span>
                <span className="text-xs text-gray-400">{venue.city} • Capacity: {venue.capacity}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VenueSelector;
