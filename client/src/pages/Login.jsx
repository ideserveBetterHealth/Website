import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginUserMutation } from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const navigate = useNavigate();

  // Load saved credentials
  useEffect(() => {
    const saved = localStorage.getItem("rememberedLogin");
    if (saved) {
      const { email, password } = JSON.parse(saved);
      setLoginInput({ email, password });
      setRememberMe(true);
    }
  }, []);

  const changeInputHandler = (e) => {
    const { name, value } = e.target;
    setLoginInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAuth = async () => {
    // Save credentials before triggering login
    if (rememberMe) {
      localStorage.setItem("rememberedLogin", JSON.stringify(loginInput));
      console.log("Credentials saved to localStorage");
    } else {
      localStorage.removeItem("rememberedLogin");
      console.log("Credentials removed from localStorage");
    }

    await loginUser(loginInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loginIsLoading) {
      e.preventDefault();

      // If cursor is in email field and password is empty, move to password field
      if (e.target.name === "email" && !loginInput.password) {
        document.getElementById("password").focus();
      } else {
        // Otherwise, trigger login
        handleAuth();
      }
    }
  };

  useEffect(() => {
    if (loginIsSuccess && loginData) {
      toast.success(loginData?.message || "Login Success");
      navigate("/Dashboard");
    }

    if (loginError) {
      toast.error(loginError?.data?.message || "Login failed");
    }
  }, [loginIsSuccess, loginData, loginError]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#fffae3] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#000080]">Welcome Back</h2>
          <p className="text-sm text-gray-500">
            Sign in to continue to Better Health
          </p>
        </div>

        <div className="space-y-4" onKeyDown={handleKeyDown}>
          <div className="space-y-1">
            <Label htmlFor="email">Better Health ID</Label>
            <Input
              id="email"
              type="email"
              name="email"
              required
              value={loginInput.email}
              placeholder="name@ideservebetterhealth.in"
              onChange={changeInputHandler}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              required
              value={loginInput.password}
              placeholder="●●●●●●●●●"
              onChange={changeInputHandler}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                className="w-4 h-4 accent-[#ec5228]"
              />
              Remember me
            </label>
          </div>

          <Button
            disabled={loginIsLoading}
            onClick={handleAuth}
            className="w-full bg-[#ec5228] hover:bg-[#d64720] text-white"
          >
            {loginIsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
