import React, { createContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("chatUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("chatUser");
    }

    // Sync Supabase session (if manually refreshed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        setUser((prevUser) => prevUser || { email: session.user.email });
      }
      setLoading(false);
    });

    // Real-time listener for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email });
        localStorage.setItem("chatUser", JSON.stringify({ email: session.user.email }));
      } else {
        setUser(null);
        localStorage.removeItem("chatUser");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      });
      throw new Error(error.message);
    }

    const userData = { email: data.user.email };
    localStorage.setItem("chatUser", JSON.stringify(userData));
    setUser(userData);
  }, [toast]);

  const register = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      console.error("Registration error:", error.message);
      toast({
        title: "Registration Error",
        description: error.message,
        variant: "destructive",
      });
      throw new Error(error.message);
    }

    const userData = { email: data.user?.email || email };
    localStorage.setItem("chatUser", JSON.stringify(userData));
    setUser(userData);
  }, [toast]);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive",
      });
    }
    localStorage.removeItem("chatUser");
    setUser(null);
  }, [toast]);

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
