
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeamSelector from "@/components/TeamSelector";
import VenueSelector from "@/components/VenueSelector";
import PredictionResult from "@/components/PredictionResult";
import { Trophy, TrendingUp, Target, Activity } from "lucide-react";

export interface PredictionData {
  team1: string;
  team2: string;
  venue: string;
  prediction?: {
    winner: string;
    probability: number;
    confidence: string;
  };
}

const Index = () => {
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState<PredictionData>({
    team1: "",
    team2: "",
    venue: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!predictionData.team1 || !predictionData.team2 || !predictionData.venue) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to Flask backend
    setTimeout(() => {
      const mockPrediction = {
        winner: predictionData.team1,
        probability: Math.random() * 0.3 + 0.6, // 60-90% probability
        confidence: Math.random() > 0.5 ? "High" : "Medium"
      };
      
      setPredictionData(prev => ({
        ...prev,
        prediction: mockPrediction
      }));
      setIsLoading(false);
    }, 2000);
  };

  const canPredict = predictionData.team1 && predictionData.team2 && predictionData.venue && predictionData.team1 !== predictionData.team2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-12 w-12 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">IPL Predictor</h1>
            <Trophy className="h-12 w-12 text-yellow-400" />
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-6">
            Powered by advanced machine learning and historical IPL data (2008-2024)
          </p>
          
          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Match Predictor
            </Button>
            <Button
              onClick={() => navigate('/live')}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Activity className="h-4 w-4 mr-2" />
              Live Predictor
            </Button>
          </div>
        </div>

        {/* Main Prediction Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Team Selection */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-yellow-400" />
                  Select Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <TeamSelector
                  label="Team 1"
                  selectedTeam={predictionData.team1}
                  onTeamSelect={(team) => setPredictionData(prev => ({ ...prev, team1: team }))}
                  excludeTeam={predictionData.team2}
                />
                
                <div className="flex justify-center">
                  <div className="text-2xl font-bold text-yellow-400">VS</div>
                </div>
                
                <TeamSelector
                  label="Team 2"
                  selectedTeam={predictionData.team2}
                  onTeamSelect={(team) => setPredictionData(prev => ({ ...prev, team2: team }))}
                  excludeTeam={predictionData.team1}
                />
              </CardContent>
            </Card>

            {/* Venue Selection */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-yellow-400" />
                  Match Venue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VenueSelector
                  selectedVenue={predictionData.venue}
                  onVenueSelect={(venue) => setPredictionData(prev => ({ ...prev, venue }))}
                />
                
                <div className="mt-8">
                  <Button
                    onClick={handlePredict}
                    disabled={!canPredict || isLoading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? "Analyzing..." : "Predict Winner"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Prediction Result */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PredictionResult 
                  predictionData={predictionData}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">16+</div>
                <div className="text-white">Years of Data</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">1000+</div>
                <div className="text-white">Matches Analyzed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">85%</div>
                <div className="text-white">Prediction Accuracy</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
