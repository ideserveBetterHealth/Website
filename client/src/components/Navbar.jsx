import { Loader2 } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MobileNavbar from "./MobileNavbar";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { DropdownMenuSubContent } from "@radix-ui/react-dropdown-menu";

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
              Better Health
            </h1>
          </div>
        </Link>
        {/* User icon and dark mode icon */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src="/user-icon.png" alt="User" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50">
                <DropdownMenuLabel>Your Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to="/dashboard">
                    <DropdownMenuItem>
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>

                  {role === "doctor" && (
                    <Link to="/meetinghistory">
                      <DropdownMenuItem>
                        <span>Meeting History</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {role === "doctor" && (
                    <Link to="/details">
                      <DropdownMenuItem>
                        <span>Submit Documents</span>
                      </DropdownMenuItem>
                    </Link>
                  )}

                  {role === "admin" && (
                    <>
                      <Link to="/admin/register">
                        <DropdownMenuItem>
                          <span>Create Accounts</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/admin/create-meeting">
                        <DropdownMenuItem>
                          <span>Schedule Meetings</span>
                        </DropdownMenuItem>
                      </Link>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <span>Verification</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="bg-white shadow-lg rounded-md p-1 border border-gray-200 ml-1">
                          <Link to="/admin/verify-documents">
                            <DropdownMenuItem>
                              <span>Pending Verifications</span>
                            </DropdownMenuItem>
                          </Link>
                          <Link to="/admin/verified-doctors">
                            <DropdownMenuItem>
                              <span>Verified Doctors</span>
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <span>Coupons</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="bg-white shadow-lg rounded-md p-1 border border-gray-200 ml-1">
                          <Link to="/admin/create-coupons">
                            <DropdownMenuItem>
                              <span>Create Coupons</span>
                            </DropdownMenuItem>
                          </Link>
                          <Link to="/admin/all-coupons">
                            <DropdownMenuItem>
                              <span>Manage Coupons</span>
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </>
                  )}

                  <DropdownMenuItem onClick={logoutHandler}>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
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
