import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Trophy, Target, Activity } from "lucide-react";
import { LiveMatchData } from "@/pages/LivePredictor";

interface LivePredictionResultProps {
  matchData: LiveMatchData;
  isLoading: boolean;
}

const LivePredictionResult = ({ matchData, isLoading }: LivePredictionResultProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-yellow-400" />
        <p className="text-white">Calculating live probabilities...</p>
      </div>
    );
  }

  if (!matchData.prediction) {
    return (
      <div className="text-center py-8">
        <Activity className="h-12 w-12 mx-auto mb-4 text-white/50" />
        <p className="text-white/70">Update match details and click predict to see live win probabilities</p>
      </div>
    );
  }

  const { prediction } = matchData;
  const battingWinProb = prediction.battingTeamWinProbability;
  const bowlingWinProb = prediction.bowlingTeamWinProbability;

  return (
    <div className="space-y-6">
      {/* Win Probabilities */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-4">Win Probabilities</h3>
        </div>
        
        {/* Batting Team */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">{matchData.battingTeam || "Batting Team"}</span>
            <span className="text-yellow-400 font-bold text-lg">{battingWinProb}%</span>
          </div>
          <Progress 
            value={battingWinProb} 
            className="h-3 bg-white/20"
          />
        </div>

        {/* Bowling Team */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">{matchData.bowlingTeam || "Bowling Team"}</span>
            <span className="text-blue-300 font-bold text-lg">{bowlingWinProb}%</span>
          </div>
          <Progress 
            value={bowlingWinProb} 
            className="h-3 bg-white/20"
          />
        </div>
      </div>

      {/* Match Statistics */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-yellow-400" />
                <span className="text-white text-sm">Current RR</span>
              </div>
              <span className="text-yellow-400 font-bold">{prediction.currentRunRate}</span>
            </div>
          </CardContent>
        </Card>

        {prediction.requiredRunRate && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-green-400" />
                  <span className="text-white text-sm">Required RR</span>
                </div>
                <span className="text-green-400 font-bold">{prediction.requiredRunRate}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <span className="text-white text-sm">Balls Left</span>
              </div>
              <span className="text-blue-400 font-bold">{prediction.ballsRemaining}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Winning Team Highlight */}
      <div className="text-center p-4 bg-gradient-to-r from-yellow-500/20 to-green-500/20 rounded-lg border border-yellow-400/30">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <span className="text-white font-semibold">Current Favorite</span>
        </div>
        <div className="text-xl font-bold text-yellow-400">
          {battingWinProb > bowlingWinProb ? matchData.battingTeam : matchData.bowlingTeam}
        </div>
        <div className="text-sm text-white/80">
          {Math.max(battingWinProb, bowlingWinProb)}% win probability
        </div>
      </div>
    </div>
  );
};

export default LivePredictionResult;