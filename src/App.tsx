import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

// User Pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import ExploreLands from "./pages/dashboard/user/ExploreLands";
import LandDetail from "./pages/dashboard/user/LandDetail";
import Notifications from "./pages/dashboard/user/Notifications";
import Portfolio from "./pages/dashboard/user/Portfolio";
import Voting from "./pages/dashboard/user/Voting";
import Wallet from "./pages/dashboard/user/Wallet";

// Owner Pages
import OwnerAddLand from "./pages/dashboard/OwnerAddLand";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import OwnerDeveloperBids from "./pages/dashboard/OwnerDeveloperBids";
import OwnerLandDetail from "./pages/dashboard/OwnerLandDetail";
import OwnerLands from "./pages/dashboard/OwnerLands";
import OwnerPayments from "./pages/dashboard/OwnerPayments";
import OwnerVoting from "./pages/dashboard/OwnerVoting";

// Generic Profile
import Profile from "./pages/dashboard/Profile";

// Agent Pages
import AgentDashboard from "./pages/dashboard/AgentDashboard";
import Earnings from "./pages/dashboard/agent/Earnings";
import AgentExploreLands from "./pages/dashboard/agent/ExploreLands";
import AgentLandDetail from "./pages/dashboard/agent/LandDetail";
import ReferralLinks from "./pages/dashboard/agent/ReferralLinks";
import Referrals from "./pages/dashboard/agent/Referrals";

// Developer (Builder) Pages
import BuilderDashboard from "./pages/dashboard/BuilderDashboard";
import DeveloperLanding from "./pages/DeveloperLanding";
import DeveloperLogin from "./pages/DeveloperLogin";
import DeveloperRegister from "./pages/DeveloperRegister";

import Wishlist from "./pages/dashboard/user/Wishlist";
import WishlistDetail from "./pages/dashboard/user/WishlistDetail";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
              <WishlistProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Isolated Developer Portal Routes */}
                  <Route path="/developer" element={<DeveloperLanding />} />
                  <Route path="/developer/login" element={<DeveloperLogin />} />
                  <Route path="/developer/register" element={<DeveloperRegister />} />

                  {/* Dashboard Routes with Persistent Layout */}
                  <Route element={<DashboardLayout />}>
                    {/* User Routes */}
                    <Route path="/dashboard/user" element={<UserDashboard />} />
                    <Route path="/dashboard/user/explore" element={<ExploreLands />} />
                    <Route path="/dashboard/user/land/:id" element={<LandDetail />} />
                    <Route path="/dashboard/user/portfolio" element={<Portfolio />} />
                    <Route path="/dashboard/user/wishlist" element={<Wishlist />} />
                    <Route path="/dashboard/user/wishlist/:id" element={<WishlistDetail />} />
                    <Route path="/dashboard/user/notifications" element={<Notifications />} />
                    <Route path="/dashboard/user/profile" element={<Profile />} />
                    <Route path="/dashboard/user/voting" element={<Voting />} />
                    <Route path="/dashboard/user/wallet" element={<Wallet />} />

                    {/* Land Owner Routes */}
                    <Route path="/dashboard/owner" element={<OwnerDashboard />} />
                    <Route path="/dashboard/owner/lands" element={<OwnerLands />} />
                    <Route path="/dashboard/owner/lands/new" element={<OwnerAddLand />} />
                    <Route path="/dashboard/owner/land/:id" element={<OwnerLandDetail />} />
                    <Route path="/dashboard/owner/voting" element={<OwnerVoting />} />
                    <Route path="/dashboard/owner/bids" element={<OwnerDeveloperBids />} />
                    <Route path="/dashboard/owner/notifications" element={<Notifications />} />
                    <Route path="/dashboard/owner/payments" element={<OwnerPayments />} />
                    <Route path="/dashboard/owner/profile" element={<Profile />} />

                    {/* Agent Routes */}
                    <Route path="/dashboard/agent" element={<AgentDashboard />} />
                    <Route path="/dashboard/agent/referrals" element={<Referrals />} />
                    <Route path="/dashboard/agent/links" element={<ReferralLinks />} />
                    <Route path="/dashboard/agent/earnings" element={<Earnings />} />
                    <Route path="/dashboard/agent/notifications" element={<Notifications />} />
                    <Route path="/dashboard/agent/profile" element={<Profile />} />
                    <Route path="/dashboard/agent/explore" element={<AgentExploreLands />} />
                    <Route path="/dashboard/agent/land/:id" element={<AgentLandDetail />} />

                    {/* Developer Dashboard Routes */}
                    <Route path="/dashboard/developer" element={<BuilderDashboard />} />
                    <Route path="/dashboard/developer/lands" element={<BuilderDashboard />} />
                    <Route path="/dashboard/developer/bids" element={<BuilderDashboard />} />
                    <Route path="/dashboard/developer/projects" element={<BuilderDashboard />} />
                    <Route path="/dashboard/developer/notifications" element={<Notifications />} />
                    <Route path="/dashboard/developer/profile" element={<Profile />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </WishlistProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;