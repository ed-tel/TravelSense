import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { CheckCircle, XCircle, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

interface AIVerificationModalProps {
  isOpen: boolean;
  partnerName: string;
  dataTypes: string[];
  onVerificationComplete: (success: boolean) => void;
  onCancel: () => void;
}

/**
 * Animation Timeline:
 * Frame 1 → Frame 2: Progress 0% → 100% (6 seconds, ease-in-out)
 * Frame 2 → Frame 3: Wait 800ms, show success state
 * Frame 3 → Rewards: Auto-redirect after 1000ms
 * Total duration: ~7.8 seconds
 */

const verificationMessages = [
  { range: [0, 20], text: "Checking data type consistency..." },
  { range: [20, 60], text: "Verifying uploaded files..." },
  { range: [60, 90], text: "Analyzing category alignment..." },
  { range: [90, 100], text: "Finalizing AI review..." },
];

export function AIVerificationModal({
  isOpen,
  partnerName,
  dataTypes,
  onVerificationComplete,
  onCancel,
}: AIVerificationModalProps) {
  const progressValue = useMotionValue(0);
  const progressWidth = useTransform(progressValue, [0, 100], ["0%", "100%"]);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(verificationMessages[0].text);
  const [verificationStatus, setVerificationStatus] = useState<"verifying" | "success" | "failed">("verifying");

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      progressValue.set(0);
      setDisplayProgress(0);
      setCurrentMessage(verificationMessages[0].text);
      setVerificationStatus("verifying");
      return;
    }

    // Reset to initial state (Frame 1: 0%)
    progressValue.set(0);
    setDisplayProgress(0);
    setVerificationStatus("verifying");
    setCurrentMessage(verificationMessages[0].text);

    // Frame 1 → Frame 2: Animate from 0% to 100% over 6 seconds
    const controls = animate(progressValue, 100, {
      duration: 6,
      ease: "easeInOut",
      onUpdate: (latest) => {
        setDisplayProgress(Math.round(latest));
        
        // Update message based on progress ranges
        const currentMsg = verificationMessages.find(
          msg => latest >= msg.range[0] && latest < msg.range[1]
        );
        
        if (currentMsg && currentMsg.text !== currentMessage) {
          setCurrentMessage(currentMsg.text);
        }
      },
      onComplete: () => {
        // Frame 2 → Frame 3: Wait 800ms then show success
        setTimeout(() => {
          setVerificationStatus("success");
          
          // Frame 3 → Rewards: Auto-redirect after 1000ms
          setTimeout(() => {
            onVerificationComplete(true);
          }, 1000);
        }, 800);
      }
    });

    return () => {
      controls.stop();
    };
  }, [isOpen, progressValue, onVerificationComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-none">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {verificationStatus === "verifying" 
              ? "AI Verification in Progress"
              : verificationStatus === "success"
              ? "Verification Successful"
              : "Verification Failed"}
          </DialogTitle>
          <DialogDescription>
            {verificationStatus === "verifying"
              ? `Verifying your dataset against ${partnerName} requirements`
              : verificationStatus === "success"
              ? "Your data has been approved and the reward is now active"
              : "The uploaded file doesn't match the required data types"}
          </DialogDescription>
        </DialogHeader>
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse"></div>
          
          <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <AnimatePresence mode="wait">
                {verificationStatus === "verifying" && (
                  <motion.div
                    key="verifying"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] rounded-2xl flex items-center justify-center relative overflow-hidden"
                  >
                    {/* Pulsing glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-blue-400 rounded-2xl"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                    {/* Subtle pulsing robot icon */}
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative z-10"
                    >
                      <Bot className="w-10 h-10 text-white" />
                    </motion.div>
                  </motion.div>
                )}
                
                {verificationStatus === "success" && (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center relative"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <div className="w-full h-full rounded-2xl border-4 border-green-400"></div>
                    </motion.div>
                  </motion.div>
                )}
                
                {verificationStatus === "failed" && (
                  <motion.div
                    key="failed"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center"
                  >
                    <XCircle className="w-10 h-10 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.h3
                  key={verificationStatus}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-[#0E1E3D]"
                >
                  {verificationStatus === "verifying" && "AI Verification in Progress"}
                  {verificationStatus === "success" && "✅ Verification Complete!"}
                  {verificationStatus === "failed" && "⚠️ Verification Failed"}
                </motion.h3>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`${verificationStatus}-${currentMessage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-muted-foreground"
                >
                  {verificationStatus === "verifying" && currentMessage}
                  {verificationStatus === "success" && "Your data has been approved. Redirecting to Rewards..."}
                  {verificationStatus === "failed" && "Uploaded file doesn't match required data types."}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress Bar (only show during verification) */}
            {verificationStatus === "verifying" && (
              <div className="space-y-3">
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#3b82f6] to-[#60a5fa]"
                    style={{ 
                      width: progressWidth
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                </div>
                <motion.p 
                  className="text-center text-gray-600"
                  key={displayProgress}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {displayProgress}%
                </motion.p>
              </div>
            )}

            {/* Partner Info */}
            {verificationStatus === "verifying" && (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#2563EB]/20">
                <p className="text-sm text-muted-foreground mb-2">Verifying data for:</p>
                <p className="text-[#0E1E3D] mb-2">{partnerName}</p>
                <div className="flex flex-wrap gap-2">
                  {dataTypes.map((type) => (
                    <span
                      key={type}
                      className="text-xs px-2 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-lg"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Success Message */}
            {verificationStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-900">
                      Your data has been approved! Your reward from <strong>{partnerName}</strong> is now active.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Failure Message */}
            {verificationStatus === "failed" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3"
              >
                <p className="text-sm text-orange-900">
                  Please re-upload the correct dataset in Upload Data.
                </p>
                <div className="text-xs text-orange-700 space-y-1">
                  <p>Required data types:</p>
                  <ul className="list-disc list-inside">
                    {dataTypes.map((type) => (
                      <li key={type}>{type}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            {verificationStatus === "verifying" && (
              <div className="flex gap-3">
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            )}
            
            {verificationStatus === "failed" && (
              <div className="flex gap-3">
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onVerificationComplete(false)}
                  className="w-full rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/90"
                >
                  Re-upload File
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
