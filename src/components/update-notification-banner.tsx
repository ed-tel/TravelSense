import { CheckCircle, X, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

interface UpdateNotificationBannerProps {
  partnerName: string;
  reward: string;
  onDismiss: () => void;
}

export function UpdateNotificationBanner({ 
  partnerName, 
  reward, 
  onDismiss 
}: UpdateNotificationBannerProps) {
  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right duration-500">
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-xl p-4 max-w-md flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium mb-1">Dashboard Updated!</h4>
          <p className="text-sm text-white/90">
            Your partnership with <strong>{partnerName}</strong> is now active. 
            Reward: <strong>{reward}</strong>
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-white/80">
            <TrendingUp className="w-3 h-3" />
            <span>All stats have been updated</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="flex-shrink-0 text-white hover:bg-white/20 h-6 w-6 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
