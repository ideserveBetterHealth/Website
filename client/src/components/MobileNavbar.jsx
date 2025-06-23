import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// eslint-disable-next-line react/prop-types
function MobileNavbar({ role }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    await logoutUser();
  };

  function navigateHandler(path) {
    setOpen(false);
    navigate(path);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User logged out");
      navigate("/login");
      setOpen(false);
    }
  }, [isSuccess]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded border-none shadow-none hover:text-bold"
        >
          <Menu className="text-black dark:text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col ">
        <SheetHeader className="flex flex-row items-center justify-between mt-5">
          <SheetTitle
            onClick={() => {
              navigateHandler("/");
            }}
          >
            Better Health
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <Separator />
        <nav className="flex flex-col space-y-4">
          <span>
            <Button
              onClick={() => navigateHandler("/")}
              variant="outline"
              className="w-full border-none shadow-none"
            >
              Dashboard
            </Button>
          </span>
          <Separator />

          {(role === "doctor" || role === "admin") && (
            <>
              <span>
                <Button
                  onClick={() => navigateHandler("/meetinghistory")}
                  variant="outline"
                  className="w-full border-none shadow-none"
                >
                  Meeting History
                </Button>
              </span>
              <Separator />
            </>
          )}

          {role === "doctor" && (
            <>
              <span>
                <Button
                  onClick={() => navigateHandler("/details")}
                  variant="outline"
                  className="w-full border-none shadow-none"
                >
                  Submit Documents
                </Button>
              </span>
              <Separator />
            </>
          )}

          {role === "admin" && (
            <>
              <span>
                <Button
                  onClick={() => navigateHandler("/admin/register")}
                  variant="outline"
                  className="w-full border-none shadow-none"
                >
                  Register
                </Button>
              </span>
              <Separator />
              <span>
                <Button
                  onClick={() => navigateHandler("/admin/verify-documents")}
                  variant="outline"
                  className="w-full border-none shadow-none"
                >
                  Verify Documents
                </Button>
              </span>
              <Separator />
            </>
          )}

          <span>
            <Button
              onClick={logoutHandler}
              variant="outline"
              className="w-full border-none shadow-none"
            >
              Logout
            </Button>
          </span>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavbar;
