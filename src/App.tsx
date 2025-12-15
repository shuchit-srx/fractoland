import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// User Pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import ExploreLands from "./pages/dashboard/user/ExploreLands";
import LandDetail from "./pages/dashboard/user/LandDetail";
import Portfolio from "./pages/dashboard/user/Portfolio";
import Voting from "./pages/dashboard/user/Voting";
import Wallet from "./pages/dashboard/user/Wallet";

// Builder Pages
import BuilderDashboard from "./pages/dashboard/BuilderDashboard";
import AvailableLands from "./pages/dashboard/builder/AvailableLands";
import MyBids from "./pages/dashboard/builder/MyBids";
import Projects from "./pages/dashboard/builder/Projects";

// Agent Pages
import AgentDashboard from "./pages/dashboard/AgentDashboard";
import Referrals from "./pages/dashboard/agent/Referrals";
import ReferralLinks from "./pages/dashboard/agent/ReferralLinks";
import Earnings from "./pages/dashboard/agent/Earnings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* User Routes */}
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/dashboard/user/explore" element={<ExploreLands />} />
            <Route path="/dashboard/user/land/:id" element={<LandDetail />} />
            <Route path="/dashboard/user/portfolio" element={<Portfolio />} />
            <Route path="/dashboard/user/voting" element={<Voting />} />
            <Route path="/dashboard/user/wallet" element={<Wallet />} />
            
            {/* Builder Routes */}
            <Route path="/dashboard/builder" element={<BuilderDashboard />} />
            <Route path="/dashboard/builder/lands" element={<AvailableLands />} />
            <Route path="/dashboard/builder/bids" element={<MyBids />} />
            <Route path="/dashboard/builder/projects" element={<Projects />} />
            
            {/* Agent Routes */}
            <Route path="/dashboard/agent" element={<AgentDashboard />} />
            <Route path="/dashboard/agent/referrals" element={<Referrals />} />
            <Route path="/dashboard/agent/links" element={<ReferralLinks />} />
            <Route path="/dashboard/agent/earnings" element={<Earnings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
