import ContentWrapper from "@/components/custom/ContentWrapper";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useLogin";
// import { useAppSelector } from "@/store/hooks";
import { Label } from "@radix-ui/react-label";
import { FileText, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginForm = () => {
  // const { error, isAuthenticated: success } = useAppSelector(
  //   (state) => state.auth
  // );

  const { login, loading: loginLoading } = useLogin();

  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Validation
    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await login({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (result.success) {
      toast.success("Login successful!");
      setLoginForm({ email: "", password: "" });

      // Redirect to home or login after successful registration
      navigate("/chat/home");
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  return (
    <ContentWrapper>
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{
                background:
                  "linear-gradient(to bottom right, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
              }}
            >
              <FileText className="h-8 w-8" style={{ color: "#667eea" }} />
            </div>
            <CardTitle
              className="text-2xl font-bold text-center bg-clip-text text-transparent"
              style={{
                background: "linear-gradient(to right, #667eea, #764ba2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 h-4 w-4"
                    style={{ color: "rgba(102, 126, 234, 0.6)" }}
                  />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    style={{
                      borderColor: "rgba(102, 126, 234, 0.3)",
                      color: "rgba(102, 126, 234, 0.6)",
                    }}
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 h-4 w-4"
                    style={{ color: "rgba(102, 126, 234, 0.6)" }}
                  />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    style={{
                      borderColor: "rgba(102, 126, 234, 0.3)",
                      color: "rgba(102, 126, 234, 0.6)",
                    }}
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )} */}
              <Button
                onClick={handleLogin}
                className="w-full text-white shadow-lg"
                style={{
                  background: "linear-gradient(to right, #667eea, #764ba2)",
                }}
              >
                {loginLoading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/auth/sign-up")}
                className="font-medium hover:underline text-white"
                style={{
                  background: "linear-gradient(to right, #667eea, #764ba2)",
                }}
              >
                Sign up
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </ContentWrapper>
  );
};

export default LoginForm;
