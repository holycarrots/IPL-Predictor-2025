import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TeamSelector from "@/components/TeamSelector";
import LivePredictionResult from "@/components/LivePredictionResult";
import { Activity, Target, Clock, TrendingUp, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface LiveMatchData {
  currentRuns: number;
  currentWickets: number;
  oversCompleted: number;
  ballsInCurrentOver: number;
  targetScore?: number;
  battingTeam: string;
  bowlingTeam: string;
  isSecondInnings: boolean;
  prediction?: {
    battingTeamWinProbability: number;
    bowlingTeamWinProbability: number;
    requiredRunRate?: number;
    currentRunRate: number;
    ballsRemaining: number;
  };
}

const LivePredictor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matchData, setMatchData] = useState<LiveMatchData>({
    currentRuns: 0,
    currentWickets: 0,
    oversCompleted: 0,
    ballsInCurrentOver: 0,
    battingTeam: "",
    bowlingTeam: "",
    isSecondInnings: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!matchData.battingTeam || !matchData.bowlingTeam) {
      toast({
        title: "Missing Information",
        description: "Please select both batting and bowling teams.",
        variant: "destructive",
      });
      return;
    }

    if (matchData.isSecondInnings && !matchData.targetScore) {
      toast({
        title: "Missing Target",
        description: "Please enter the target score for second innings.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to Flask backend
    setTimeout(() => {
      const totalBalls = (matchData.oversCompleted * 6) + matchData.ballsInCurrentOver;
      const ballsRemaining = (20 * 6) - totalBalls; // Assuming T20 format
      const currentRunRate = totalBalls > 0 ? (matchData.currentRuns / totalBalls) * 6 : 0;
      
      let battingTeamProb = 50;
      
      if (matchData.isSecondInnings && matchData.targetScore) {
        const runsNeeded = matchData.targetScore - matchData.currentRuns;
        const requiredRunRate = ballsRemaining > 0 ? (runsNeeded / ballsRemaining) * 6 : 0;
        
        // Simple probability calculation based on required run rate vs current run rate
        if (runsNeeded <= 0) {
          battingTeamProb = 95;
        } else if (matchData.currentWickets >= 8) {
          battingTeamProb = Math.max(10, 60 - (requiredRunRate * 5));
        } else {
          battingTeamProb = Math.max(15, Math.min(85, 65 - (requiredRunRate - currentRunRate) * 8));
        }
      } else {
        // First innings - base on current run rate and wickets
        battingTeamProb = Math.max(20, Math.min(80, 50 + (currentRunRate - 8) * 3 - (matchData.currentWickets * 4)));
      }
      
      const mockPrediction = {
        battingTeamWinProbability: Math.round(battingTeamProb),
        bowlingTeamWinProbability: Math.round(100 - battingTeamProb),
        requiredRunRate: matchData.isSecondInnings && matchData.targetScore 
          ? Number(((matchData.targetScore - matchData.currentRuns) / ballsRemaining * 6).toFixed(2))
          : undefined,
        currentRunRate: Number(currentRunRate.toFixed(2)),
        ballsRemaining,
      };
      
      setMatchData(prev => ({
        ...prev,
        prediction: mockPrediction
      }));
      setIsLoading(false);
      
      toast({
        title: "Prediction Updated",
        description: "Live win probabilities calculated successfully!",
      });
    }, 1500);
  };

  const updateMatchData = (field: keyof LiveMatchData, value: any) => {
    setMatchData(prev => ({
      ...prev,
      [field]: value,
      // Clear prediction when match data changes
      prediction: undefined
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="h-12 w-12 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">Live Match Predictor</h1>
            <Activity className="h-12 w-12 text-yellow-400" />
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-6">
            Real-time win probability analysis based on current match situation
          </p>
          
          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Match Predictor
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Live Predictor
            </Button>
          </div>
        </div>

        {/* Main Interface */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Team Selection */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-yellow-400" />
                  Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TeamSelector
                  label="Batting Team"
                  selectedTeam={matchData.battingTeam}
                  onTeamSelect={(team) => updateMatchData('battingTeam', team)}
                  excludeTeam={matchData.bowlingTeam}
                />
                
                <TeamSelector
                  label="Bowling Team"
                  selectedTeam={matchData.bowlingTeam}
                  onTeamSelect={(team) => updateMatchData('bowlingTeam', team)}
                  excludeTeam={matchData.battingTeam}
                />
              </CardContent>
            </Card>

            {/* Current Score */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-yellow-400" />
                  Current Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="runs" className="text-white text-sm">Runs</Label>
                    <Input
                      id="runs"
                      type="number"
                      min="0"
                      value={matchData.currentRuns}
                      onChange={(e) => updateMatchData('currentRuns', Number(e.target.value))}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wickets" className="text-white text-sm">Wickets</Label>
                    <Input
                      id="wickets"
                      type="number"
                      min="0"
                      max="10"
                      value={matchData.currentWickets}
                      onChange={(e) => updateMatchData('currentWickets', Number(e.target.value))}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {matchData.currentRuns}/{matchData.currentWickets}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overs & Target */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  Match Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="overs" className="text-white text-sm">Overs</Label>
                    <Input
                      id="overs"
                      type="number"
                      min="0"
                      max="20"
                      value={matchData.oversCompleted}
                      onChange={(e) => updateMatchData('oversCompleted', Number(e.target.value))}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="balls" className="text-white text-sm">Balls</Label>
                    <Input
                      id="balls"
                      type="number"
                      min="0"
                      max="5"
                      value={matchData.ballsInCurrentOver}
                      onChange={(e) => updateMatchData('ballsInCurrentOver', Number(e.target.value))}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="secondInnings"
                      checked={matchData.isSecondInnings}
                      onChange={(e) => updateMatchData('isSecondInnings', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="secondInnings" className="text-white text-sm">
                      Second Innings
                    </Label>
                  </div>
                  
                  {matchData.isSecondInnings && (
                    <div>
                      <Label htmlFor="target" className="text-white text-sm">Target Score</Label>
                      <Input
                        id="target"
                        type="number"
                        min="1"
                        value={matchData.targetScore || ''}
                        onChange={(e) => updateMatchData('targetScore', Number(e.target.value))}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                        placeholder="Target"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Prediction Result */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5 text-yellow-400" />
                  Live Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LivePredictionResult 
                  matchData={matchData}
                  isLoading={isLoading}
                />
                
                <div className="mt-6">
                  <Button
                    onClick={handlePredict}
                    disabled={!matchData.battingTeam || !matchData.bowlingTeam || isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? "Calculating..." : "Update Prediction"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePredictor;