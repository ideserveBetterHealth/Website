import {
  Loader2,
  LayoutDashboard,
  History,
  FileText,
  UserPlus,
  Calendar,
  Shield,
  CheckCircle,
  Users,
  Tag,
  Plus,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MobileNavbar from "./MobileNavbar";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

function Navbar() {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((Store) => Store.auth);

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      // This is a fallback solution if the server isn't clearing cookies properly
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

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User logged out");
      navigate("/login");
    }
  }, [isSuccess]);

  if (isLoading) {
    // If data is still loading, you could show a spinner or return null
    return (
      <div className="h-16 flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const role = user?.role || "user"; // This will only be accessed after user data is available

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 duration-300 z-10 fixed top-0 left-0 right-0">
      {/* DESKTOP */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <Link to={"/dashboard"}>
          <div className="flex items-center">
            <h1 className="hidden md:block font-bold text-3xl ml-1 text-orange-600 hover:text-orange-700 transition-all duration-500">
              Better Health Dashboard
            </h1>
          </div>
        </Link>
        {/* User icon and dark mode icon */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer group">
                  <Avatar className="w-10 h-10 ring-2 ring-orange-100 hover:ring-orange-200 transition-all duration-300 group-hover:scale-105">
                    <AvatarImage src="/settings-icon.svg" alt="User" />
                    <AvatarFallback className="bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 z-50 bg-white/95 backdrop-blur-md shadow-2xl border border-gray-100 rounded-2xl p-2 mt-2">
                <div className="px-3 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {user?.name || "User"}
                      </p>
                      <p className="text-gray-500 text-xs truncate max-w-[150px]">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <DropdownMenuGroup>
                    <Link to="/dashboard">
                      <DropdownMenuItem className="mx-1 my-1 rounded-xl px-3 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-200 group">
                        <LayoutDashboard className="w-4 h-4 mr-3 text-orange-600 group-hover:text-orange-700" />
                        <span className="font-medium text-gray-700 group-hover:text-gray-900">
                          Dashboard
                        </span>
                      </DropdownMenuItem>
                    </Link>

                    {role === "doctor" && (
                      <>
                        <Link to="/meetinghistory">
                          <DropdownMenuItem className="mx-1 my-1 rounded-xl px-3 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 group">
                            <History className="w-4 h-4 mr-3 text-blue-600 group-hover:text-blue-700" />
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">
                              Meeting History
                            </span>
                          </DropdownMenuItem>
                        </Link>
                        <Link to="/details">
                          <DropdownMenuItem className="mx-1 my-1 rounded-xl px-3 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-200 group">
                            <FileText className="w-4 h-4 mr-3 text-green-600 group-hover:text-green-700" />
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">
                              Submit Documents
                            </span>
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}

                    {role === "admin" && (
                      <>
                        <div className="mx-3 my-2">
                          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Admin Tools
                          </div>
                        </div>

                        <Link to="/details">
                          <DropdownMenuItem className="mx-1 my-1 rounded-xl px-3 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-200 group">
                            <FileText className="w-4 h-4 mr-3 text-green-600 group-hover:text-green-700" />
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">
                              Submit Documents
                            </span>
                          </DropdownMenuItem>
                        </Link>

                        <Link to="/admin/register">
                          <DropdownMenuItem className="mx-1 my-1 rounded-xl px-3 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-200 group">
                            <UserPlus className="w-4 h-4 mr-3 text-purple-600 group-hover:text-purple-700" />
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">
                              Create Accounts
                            </span>
                          </DropdownMenuItem>
                        </Link>

                        <Link to="/admin/create-meeting">
                          <DropdownMenuItem className="mx-1 my-1 rounded-xl px-3 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 transition-all duration-200 group">
                            <Calendar className="w-4 h-4 mr-3 text-indigo-600 group-hover:text-indigo-700" />
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">
                              Schedule Meetings
                            </span>
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="mx-1 my-1 rounded-xl px-3 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 transition-all duration-200 group data-[state=open]:bg-emerald-50">
                            <Shield className="w-4 h-4 mr-3 text-emerald-600 group-hover:text-emerald-700" />
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">
                              Verification
                            </span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-56 bg-white/95 backdrop-blur-md shadow-xl rounded-xl p-2 border border-gray-100">
                              <Link to="/admin/verify-documents">
                                <DropdownMenuItem className="rounded-lg px-3 py-2 hover:bg-yellow-50 transition-all duration-200 group">
                                  <Settings className="w-4 h-4 mr-3 text-yellow-600 group-hover:text-yellow-700" />
                                  <span className="font-medium text-gray-700 group-hover:text-gray-900">
                                    Pending Verifications
                                  </span>
                                </DropdownMenuItem>
                              </Link>
                              <Link to="/admin/verified-doctors">
                                <DropdownMenuItem className="rounded-lg px-3 py-2 hover:bg-green-50 transition-all duration-200 group">
                                  <CheckCircle className="w-4 h-4 mr-3 text-green-600 group-hover:text-green-700" />
                                  <span className="font-medium text-gray-700 group-hover:text-gray-900">
                                    Verified BH Associates
                                  </span>
                                </DropdownMenuItem>
                              </Link>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="mx-1 my-1 rounded-xl px-3 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 transition-all duration-200 group data-[state=open]:bg-pink-50">
                            <Tag className="w-4 h-4 mr-3 text-pink-600 group-hover:text-pink-700" />
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">
                              Coupons
                            </span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-56 bg-white/95 backdrop-blur-md shadow-xl rounded-xl p-2 border border-gray-100">
                              <Link to="/admin/create-coupons">
                                <DropdownMenuItem className="rounded-lg px-3 py-2 hover:bg-blue-50 transition-all duration-200 group">
                                  <Plus className="w-4 h-4 mr-3 text-blue-600 group-hover:text-blue-700" />
                                  <span className="font-medium text-gray-700 group-hover:text-gray-900">
                                    Create Coupons
                                  </span>
                                </DropdownMenuItem>
                              </Link>
                              <Link to="/admin/all-coupons">
                                <DropdownMenuItem className="rounded-lg px-3 py-2 hover:bg-purple-50 transition-all duration-200 group">
                                  <Settings className="w-4 h-4 mr-3 text-purple-600 group-hover:text-purple-700" />
                                  <span className="font-medium text-gray-700 group-hover:text-gray-900">
                                    Manage Coupons
                                  </span>
                                </DropdownMenuItem>
                              </Link>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </>
                    )}
                  </DropdownMenuGroup>

                  <div className="mx-2 my-2">
                    <div className="border-t border-gray-100"></div>
                  </div>

                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="mx-1 my-1 rounded-xl px-3 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-200 group cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-red-600 group-hover:text-red-700" />
                    <span className="font-medium text-gray-700 group-hover:text-red-700">
                      Logout
                    </span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DEVICES */}
      <div className="flex md:hidden justify-between mr-3 ml-3 items-center h-full">
        <div className="flex gap-1 items-center">
          <div
            className="flex gap-1 items-center"
            onClick={() => navigate("/dashboard")}
          >
            <p className="font-bold text-blue-900">BetterHealth</p>
          </div>
        </div>
        <MobileNavbar role={role} />
      </div>
    </div>
  );
}

export default Navbar;
