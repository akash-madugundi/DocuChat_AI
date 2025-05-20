import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/signin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !confirmPassword)) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLogin) {
        await login({ email, password });
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
      } else {
        await register({ email, password });
        toast({
          title: "Success",
          description: "Registered successfully! Please log in.",
        });
        navigate("/signin");
      }
    } catch (err) {
      // Errors are already being logged via toast in AuthProvider, but you can add a fallback:
      toast({
        title: "Authentication Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900">
      <motion.div
        key={isLogin ? "login" : "register"}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="w-full max-w-lg mx-auto shadow-2xl bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="mx-auto p-3 bg-gradient-to-r from-primary to-accent rounded-full inline-block text-primary-foreground mb-4"
            >
              {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
            </motion.div>
            <CardTitle className="text-3xl font-bold text-white">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-gray-300 mt-1">
              {isLogin
                ? "Log in to access your chatbot."
                : "Sign up to get started."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 text-white placeholder-gray-400 border-white/20 focus:bg-white/20"
                  required
                />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 text-white placeholder-gray-400 border-white/20 focus:bg-white/20"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-7 text-gray-300 hover:text-white focus:outline-none focus:ring-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-200">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/10 text-white placeholder-gray-400 border-white/20 focus:bg-white/20"
                    required
                  />
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300 text-lg py-3"
              >
                {isLogin ? "Log In" : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Button
              variant="link"
              onClick={() => navigate(isLogin ? "/signup" : "/signin")}
              className="text-gray-300 hover:text-white"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Log in"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;
