import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Login } from "./pages/auth/Login";
import OTPLogin from "./pages/auth/OTPLogin";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import {
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/auth/ProtectedRoutes";
import Signup from "./pages/auth/signup";
import DynamicForm from "./pages/EmployeeForm";
import ErrorPage from "./pages/ErrorPage";
import VerificationPending from "./pages/VerificationPening";
import VerifyDocuments from "./pages/VerifyDocuments";
import LandingPage from "./pages/LandingPageBar";
import Home from "./pages/Home";
import MentalHealth from "./pages/services/MentalHealth";
import FinancialAid from "./pages/FinancialAid";
import Cosmetology from "./pages/services/Cosmetology";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/services/Services";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsConditions from "./pages/legal/TermsConditions";
import RefundCancellationPolicy from "./pages/legal/RefundCancellationPolicy";
import VerifiedDoctors from "./pages/VerifiedDoctors";
import VerifiedDoctorInDetail from "./pages/VerifedDoctorInDetail";
import PaymentPage from "./pages/payment/PaymentPage";
import CreateCoupon from "./pages/CreateCoupons";
import AllCoupons from "./pages/AllCoupons";
import ViewPastSessions from "./pages/ViewPastSessions";
import CreateMeeting from "./pages/CreateMeeting";
import MySchedule from "./pages/MySchedule";
import ManageSchedule from "./pages/admin/ManageSchedule";
import ManageBHFamily from "./pages/admin/ManageBHFamily";
import Career from "./pages/Career";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import BHAssociateProfile from "./pages/profile/bhAssociateProfile";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/mental-health",
          element: <MentalHealth />,
        },
        {
          path: "/financial-aid",
          element: <FinancialAid />,
        },
        {
          path: "/cosmetology",
          element: <Cosmetology />,
        },
        {
          path: "/about-us",
          element: <AboutUs />,
        },
        {
          path: "/services",
          element: <Services />,
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy />,
        },
        {
          path: "/terms-conditions",
          element: <TermsConditions />,
        },
        {
          path: "/refund-cancellation-policy",
          element: <RefundCancellationPolicy />,
        },
        {
          path: "/make-payment/:service/:planType",
          element: <PaymentPage />,
        },
        {
          path: "/payment-success",
          element: <PaymentSuccess />,
        },
        {
          path: "/login",
          element: (
            <AuthenticatedUser>
              <Login />
            </AuthenticatedUser>
          ),
        },
        {
          path: "/otp-login",
          element: (
            <AuthenticatedUser>
              <OTPLogin />
            </AuthenticatedUser>
          ),
        },
        {
          path: "/career",
          element: <Career />,
        },
        {
          path: "/bh-associate-profile/:id",
          element: <BHAssociateProfile />,
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "*", // handles 404 in protected routes
          element: <ErrorPage />,
        },
        // Public routes (accessible to all)
        {
          path: "/details",
          element: <DynamicForm />,
        },

        // Protected routes (require authentication)
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/view-past-sessions",
          element: (
            <ProtectedRoute>
              <ViewPastSessions />
            </ProtectedRoute>
          ),
        },

        // Doctor routes
        {
          path: "/my-schedule",
          element: (
            <ProtectedRoute doctorOnly={true}>
              <MySchedule />
            </ProtectedRoute>
          ),
        },

        // Admin routes
        {
          path: "/admin/register",
          element: (
            <ProtectedRoute adminOnly={true}>
              <Signup />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/verification-pending/:userId",
          element: (
            <ProtectedRoute adminOnly={true}>
              <VerificationPending />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/Verified-doc-details/:userId",
          element: (
            <ProtectedRoute adminOnly={true}>
              <VerifiedDoctorInDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/verify-documents",
          element: (
            <ProtectedRoute adminOnly={true}>
              <VerifyDocuments />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/verified-doctors",
          element: (
            <ProtectedRoute adminOnly={true}>
              <VerifiedDoctors />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/create-coupons",
          element: (
            <ProtectedRoute adminOnly={true}>
              <CreateCoupon />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/create-coupons",
          element: (
            <ProtectedRoute adminOnly={true}>
              <CreateCoupon />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/all-coupons",
          element: (
            <ProtectedRoute adminOnly={true}>
              <AllCoupons />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/create-meeting",
          element: (
            <ProtectedRoute adminOnly={true}>
              <CreateMeeting />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/manage-schedule",
          element: (
            <ProtectedRoute adminOnly={true}>
              <ManageSchedule />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/manage-bh-family",
          element: (
            <ProtectedRoute adminOnly={true}>
              <ManageBHFamily />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
