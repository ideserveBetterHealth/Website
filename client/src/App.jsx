import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import {
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import Signup from "./pages/signup";
import DynamicForm from "./pages/EmployeeForm";
import UserAllMeetings from "./pages/UserAllMeetings";
import ErrorPage from "./pages/ErrorPage";
import VerificationPending from "./pages/VerificationPening";
import VerifyDocuments from "./pages/VerifyDocuments";
import LandingPage from "./pages/LandingPageBar";
import Home from "./pages/Home";
import MentalHealth from "./pages/MentalHealth";
import FinancialAid from "./pages/FinancialAid";
import Cosmetology from "./pages/Cosmetology";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import RefundCancellationPolicy from "./pages/RefundCancellationPolicy";
import VerifiedDoctors from "./pages/VerifiedDoctors";
import VerifiedDoctorInDetail from "./pages/VerifedDoctorInDetail";
import PaymentPage from "./pages/PaymentPage";
import CreateCoupon from "./pages/CreateCoupons";
import AllCoupons from "./pages/AllCoupons";
import CreateMeeting from "./pages/CreateMeeting";

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
          path: "/login",
          element: (
            <AuthenticatedUser>
              <Login />
            </AuthenticatedUser>
          ),
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
          path: "/meetinghistory",
          element: (
            <ProtectedRoute>
              <UserAllMeetings />
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
