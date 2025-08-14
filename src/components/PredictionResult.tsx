
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, TrendingUp } from "lucide-react";
import { PredictionData } from "@/pages/Index";

interface PredictionResultProps {
  predictionData: PredictionData;
  isLoading: boolean;
}

const PredictionResult = ({ predictionData, isLoading }: PredictionResultProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-white">Analyzing match data...</p>
        <p className="text-blue-200 text-sm mt-2">Processing team statistics, venue factors, and historical performance</p>
      </div>
    );
  }

  if (!predictionData.prediction) {
    return (
      <div className="text-center py-8">
        <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300">Select teams and venue to get prediction</p>
      </div>
    );
  }

  const { winner, probability, confidence } = predictionData.prediction;
  const winPercentage = Math.round(probability * 100);
  const losePercentage = 100 - winPercentage;

  return (
    <div className="space-y-6">
      {/* Winner Announcement */}
      <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30">
        <CardContent className="p-4 text-center">
          <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white mb-1">Predicted Winner</h3>
          <p className="text-2xl font-bold text-yellow-400">{winner}</p>
        </CardContent>
      </Card>

      {/* Probability Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-white">
          <span className="font-medium">{predictionData.team1}</span>
          <span className="font-bold">{winner === predictionData.team1 ? winPercentage : losePercentage}%</span>
        </div>
        <Progress 
          value={winner === predictionData.team1 ? winPercentage : losePercentage} 
          className="h-3 bg-white/20"
        />
        
        <div className="flex items-center justify-between text-white">
          <span className="font-medium">{predictionData.team2}</span>
          <span className="font-bold">{winner === predictionData.team2 ? winPercentage : losePercentage}%</span>
        </div>
        <Progress 
          value={winner === predictionData.team2 ? winPercentage : losePercentage} 
          className="h-3 bg-white/20"
        />
      </div>

      {/* Confidence and Insights */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-3 text-center">
            <Target className="h-5 w-5 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-gray-300">Confidence</p>
            <p className="text-sm font-bold text-white">{confidence}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-3 text-center">
            <TrendingUp className="h-5 w-5 text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-gray-300">Win Probability</p>
            <p className="text-sm font-bold text-white">{winPercentage}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Match Details Summary */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-blue-200 mb-2">Match Analysis</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <p>Venue: {predictionData.venue}</p>
            <p>Based on historical performance, team form, and venue statistics</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResult;
