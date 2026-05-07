import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Shell from "./app/layout/Shell";
import CareerSimulator from "./app/pages/CareerSimulator";
import SkillGap from "./app/pages/SkillGap";
import ResumeUpload from "./app/pages/ResumeUpload";
import RoleCompare from "./app/pages/RoleCompare";
import DataManager from "./app/pages/DataManager";
import NotFound from "./app/pages/NotFound";
import SplashScreen from "./app/pages/SplashScreen";
import Onboarding from "./app/pages/Onboarding";
import { isOnboarded } from "./core/db/repo";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [onboarded, setOnboarded] = useState(null); // null = loading

  useEffect(() => {
    const check = async () => {
      const done = await isOnboarded();
      setOnboarded(done);
    };
    check();
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Still checking onboarding status
  if (onboarded === null) {
    return (
      <div className="fixed inset-0 bg-[#0b0f19] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#13ec6d]" />
      </div>
    );
  }

  // Show onboarding if not completed
  if (!onboarded) {
    return <Onboarding onComplete={() => setOnboarded(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell />}>
          <Route index element={<Navigate to="/career" replace />} />
          <Route path="career" element={<CareerSimulator />} />
          <Route path="skill-gap" element={<SkillGap />} />
          <Route path="upload" element={<ResumeUpload />} />
          <Route path="compare" element={<RoleCompare />} />
          <Route path="data" element={<DataManager />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
