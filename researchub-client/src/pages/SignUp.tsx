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
import { useRegister } from "@/hooks/useRegister";
// import { useAppSelector } from "@/store/hooks";
import { Label } from "@radix-ui/react-label";
import { FileText, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignUpForm = () => {
  // const { error, isAuthenticated: success } = useAppSelector(
  //   (state) => state.auth
  // );

  const { register, loading: registerLoading } = useRegister();

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Validation
    if (
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Create username from name (remove spaces, lowercase)
    const username = signupForm.name.toLowerCase().replace(/\s+/g, "_");

    // Call the register hook
    const result = await register({
      username,
      email: signupForm.email,
      password: signupForm.password,
      personalDetails: {
        fullName: signupForm.name,
      },
    });

    if (result.success) {
      toast.success("Account created successfully!");
      setSignupForm({ name: "", email: "", password: "", confirmPassword: "" });

      // Redirect to home or login after successful registration
      navigate("/auth/sign-in");
    } else {
      toast.error(result.error || "Registration failed");
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
              Create an account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 h-4 w-4"
                    style={{ color: "rgba(102, 126, 234, 0.6)" }}
                  />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    style={{
                      borderColor: "rgba(102, 126, 234, 0.3)",
                      color: "rgba(102, 126, 234, 0.6)",
                    }}
                    value={signupForm.name}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 h-4 w-4"
                    style={{ color: "rgba(102, 126, 234, 0.6)" }}
                  />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    style={{
                      borderColor: "rgba(102, 126, 234, 0.3)",
                      color: "rgba(102, 126, 234, 0.6)",
                    }}
                    value={signupForm.email}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 h-4 w-4"
                    style={{ color: "rgba(102, 126, 234, 0.6)" }}
                  />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    style={{
                      borderColor: "rgba(102, 126, 234, 0.3)",
                      color: "rgba(102, 126, 234, 0.6)",
                    }}
                    value={signupForm.password}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="signup-confirm-password"
                  className="text-gray-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 h-4 w-4"
                    style={{ color: "rgba(102, 126, 234, 0.6)" }}
                  />
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    style={{
                      borderColor: "rgba(102, 126, 234, 0.3)",
                      color: "rgba(102, 126, 234, 0.6)",
                    }}
                    value={signupForm.confirmPassword}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        confirmPassword: e.target.value,
                      })
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
                onClick={handleSignup}
                className="w-full text-white shadow-lg"
                style={{
                  background: "linear-gradient(to right, #667eea, #764ba2)",
                }}
              >
                {registerLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth/sign-in")}
                className="font-medium hover:underline text-white"
                style={{
                  background: "linear-gradient(to right, #667eea, #764ba2)",
                }}
              >
                Sign in
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </ContentWrapper>
  );
};

export default SignUpForm;
