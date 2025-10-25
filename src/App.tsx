import { useState } from "react";
import { LandingPage } from "./components/landing-page";
import { AuthPage } from "./components/auth-page";
import { MyDataPage } from "./components/my-data-page";
import { RewardsPage } from "./components/rewards-page";
import { PrivacySecurityPage } from "./components/privacy-security-page";
import { Navigation } from "./components/navigation";
import { HeroPanel } from "./components/hero-panel";
import { SummaryCards } from "./components/summary-cards";
import { EntriesTable } from "./components/entries-table";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AppState = "landing" | "auth" | "dashboard" | "my-data" | "rewards" | "privacy";

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>("landing");

  const handleGetStarted = () => {
    setCurrentState("auth");
  };

  const handleSignIn = () => {
    setCurrentState("auth");
  };

  const handleAuthSuccess = () => {
    setCurrentState("dashboard");
  };

  const handleReturnToLanding = () => {
    setCurrentState("landing");
  };

  const handleNavigateToMyData = () => {
    setCurrentState("my-data");
  };

  const handleNavigateToDashboard = () => {
    setCurrentState("dashboard");
  };

  const handleNavigateToRewards = () => {
    setCurrentState("rewards");
  };

  const handleNavigateToPrivacy = () => {
    setCurrentState("privacy");
  };

  if (currentState === "landing") {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} onSignIn={handleSignIn} />
        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          closeOnClick
          pauseOnHover
          draggable
          toastClassName="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md"
          bodyClassName="text-sm"
        />
      </>
    );
  }

  if (currentState === "auth") {
    return (
      <>
        <AuthPage onSignIn={handleAuthSuccess} onReturnToLanding={handleReturnToLanding} />
        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          closeOnClick
          pauseOnHover
          draggable
          toastClassName="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md"
          bodyClassName="text-sm"
        />
      </>
    );
  }

  if (currentState === "my-data") {
    return (
      <>
        <div className="min-h-screen bg-background">
          <Navigation 
            onLogoClick={handleReturnToLanding} 
            onNavigateToMyData={handleNavigateToMyData}
            onNavigateToDashboard={handleNavigateToDashboard}
            onNavigateToRewards={handleNavigateToRewards}
            onNavigateToPrivacy={handleNavigateToPrivacy}
            currentPage="my-data"
          />
          <MyDataPage />
        </div>
        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          closeOnClick
          pauseOnHover
          draggable
          toastClassName="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md"
          bodyClassName="text-sm"
        />
      </>
    );
  }

  if (currentState === "rewards") {
    return (
      <>
        <div className="min-h-screen bg-background">
          <Navigation 
            onLogoClick={handleReturnToLanding} 
            onNavigateToMyData={handleNavigateToMyData}
            onNavigateToDashboard={handleNavigateToDashboard}
            onNavigateToRewards={handleNavigateToRewards}
            onNavigateToPrivacy={handleNavigateToPrivacy}
            currentPage="rewards"
          />
          <RewardsPage />
        </div>
        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          closeOnClick
          pauseOnHover
          draggable
          toastClassName="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md"
          bodyClassName="text-sm"
        />
      </>
    );
  }

  if (currentState === "privacy") {
    return (
      <>
        <div className="min-h-screen bg-background">
          <Navigation 
            onLogoClick={handleReturnToLanding} 
            onNavigateToMyData={handleNavigateToMyData}
            onNavigateToDashboard={handleNavigateToDashboard}
            onNavigateToRewards={handleNavigateToRewards}
            onNavigateToPrivacy={handleNavigateToPrivacy}
            currentPage="privacy"
          />
          <PrivacySecurityPage />
        </div>
        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          closeOnClick
          pauseOnHover
          draggable
          toastClassName="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md"
          bodyClassName="text-sm"
        />
      </>
    );
  }

  // Default: dashboard
  return (
    <>
      <div className="min-h-screen bg-background">
        <Navigation 
          onLogoClick={handleReturnToLanding} 
          onNavigateToMyData={handleNavigateToMyData}
          onNavigateToDashboard={handleNavigateToDashboard}
          onNavigateToRewards={handleNavigateToRewards}
          onNavigateToPrivacy={handleNavigateToPrivacy}
          currentPage="dashboard"
        />
        
        <main className="container mx-auto px-6 py-8 space-y-8">
          <HeroPanel />
          <SummaryCards />
          <EntriesTable />
        </main>
      </div>

      {/* Toast container works globally */}
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md"
        bodyClassName="text-sm"
      />
    </>
  );
}
