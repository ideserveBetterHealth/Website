import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  LayoutDashboard,
  History,
  UserPlus,
  Calendar,
  CheckCircle,
  Plus,
  Settings,
  LogOut,
  FileText,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

function MobileNavbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((Store) => Store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      // Fallback: clear cookies if server didn't
      document.cookie.split(";").forEach(function (c) {
        document.cookie =
          c.trim().split("=")[0] +
          "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      });
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  function navigateHandler(path) {
    setOpen(false);
    navigate(path);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out");
      navigate("/login");
      setOpen(false);
    }
  }, [isSuccess, data?.message, navigate]);

  const role = user?.role || "user";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-lg border-none shadow-none hover:bg-[#fffae3] transition-colors duration-200"
        >
          <Menu className="w-5 h-5 text-[#000080]" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[280px] sm:w-[300px] flex flex-col p-0 bg-gray-50">
        {/* Header Section */}
        <div className="relative">
          <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] p-4 border-b border-gray-200">
            <SheetHeader className="relative z-10">
              <SheetTitle
                onClick={() => navigateHandler("/dashboard")}
                className="text-white text-lg font-semibold cursor-pointer hover:text-orange-100 transition-colors"
              >
                Better Health
              </SheetTitle>
            </SheetHeader>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            {/* Dashboard Button */}
            <button
              onClick={() => navigateHandler("/dashboard")}
              className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  Dashboard
                </span>
              </div>
            </button>

            {/* View Past Sessions Button */}
            <button
              onClick={() => navigateHandler("/view-past-sessions")}
              className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <History className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  View Past Sessions
                </span>
              </div>
            </button>

            {/* Doctor Specific Options - Only show if doctor is verified */}
            {user && role === "doctor" && user.isVerified === "verified" && (
              <button
                onClick={() => navigateHandler("/my-schedule")}
                className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">
                    My Schedule
                  </span>
                </div>
              </button>
            )}

            {/* Submit Documents — for Doctors and Admins (regardless of verification) */}
            {(role === "doctor" || role === "admin") && (
              <button
                onClick={() => navigateHandler("/details")}
                className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">
                    Submit Documents
                  </span>
                </div>
              </button>
            )}

            {/* Admin Specific Options — only if admin is verified */}
            {user && role === "admin" && user.isVerified === "verified" && (
              <>
                <div className="pt-2 pb-1">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                    Admin Tools
                  </div>
                </div>

                <button
                  onClick={() => navigateHandler("/admin/register")}
                  className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      Create Accounts
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => navigateHandler("/admin/create-meeting")}
                  className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      Schedule Meetings
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => navigateHandler("/admin/verify-documents")}
                  className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      Pending Verifications
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => navigateHandler("/admin/verified-doctors")}
                  className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      Verified BH Associates
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => navigateHandler("/admin/manage-schedule")}
                  className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      Manage Schedule
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => navigateHandler("/admin/manage-bh-family")}
                  className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      Manage BH Family
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => navigateHandler("/admin/create-coupons")}
                  className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      Create Coupons
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => navigateHandler("/admin/all-coupons")}
                  className="w-full group bg-white hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-violet-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      Manage Coupons
                    </span>
                  </div>
                </button>
              </>
            )}

            {/* Logout Button - Now in the scrollable list */}
            <div className="pt-3">
              <button
                onClick={logoutHandler}
                className="w-full group bg-red-50 hover:bg-red-100 rounded-lg p-3 transition-all duration-200 border border-red-200 hover:border-red-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-red-700 font-medium text-sm">
                    Logout
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavbar;
