import { Lock, Calendar, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LockedLessonProps {
  lesson: {
    title: string;
    description?: string;
  };
  accessInfo: {
    reason: string;
    unlock_date?: string;
    days_remaining?: number;
  };
  onBack?: () => void;
}

export function LockedLesson({
  lesson,
  accessInfo,
  onBack,
}: LockedLessonProps) {
  const renderLockContent = () => {
    if (accessInfo.reason === "date_locked" && accessInfo.unlock_date) {
      const date = new Date(accessInfo.unlock_date);
      return (
        <div className="text-center space-y-2">
          <Calendar className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">
            Available on {date.toLocaleDateString()}
          </h3>
          <p className="text-gray-400">
            This lesson is scheduled to unlock at {date.toLocaleTimeString()}
          </p>
        </div>
      );
    }

    if (accessInfo.reason === "days_locked") {
      return (
        <div className="text-center space-y-2">
          <Clock className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">
            Unlocks in {accessInfo.days_remaining} days
          </h3>
          <p className="text-gray-400">
            This content is part of a scheduled learning path.
          </p>
          {accessInfo.unlock_date && (
            <p className="text-sm text-gray-500">
              Available on{" "}
              {new Date(accessInfo.unlock_date).toLocaleDateString()}
            </p>
          )}
        </div>
      );
    }

    if (accessInfo.reason === "prerequisite_not_completed") {
      return (
        <div className="text-center space-y-2">
          <Lock className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">
            Prerequisite Required
          </h3>
          <p className="text-gray-400">
            You must complete the previous lesson to unlock this content.
          </p>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="text-center space-y-2">
        <Lock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white">Content Locked</h3>
        <p className="text-gray-400">This lesson is currently not available.</p>
      </div>
    );
  };

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-900/50 border border-gray-800 rounded-xl p-8 backdrop-blur-sm">
      <div className="max-w-md w-full">
        {renderLockContent()}

        {onBack && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Back to Course
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
