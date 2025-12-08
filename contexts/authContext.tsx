import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { router } from "expo-router";
import { useOverlay } from "../hooks/useOverlay";
import { useTokenStorage } from "./tokenStorage";
import { apiLogin, apiLogout } from "./api/auth";
import { apiGetMe, apiRegister, type User } from "./api/user";

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signIn: (login: string, password: string) => Promise<boolean>;
  signUp: (
    username: string,
    email: string,
    password: string,
    confirm: string
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
  bootstrapped: boolean;
  clearError: () => void;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => {},
  bootstrapped: false,
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    token,
    bootstrapped: tokenBootstrapped,
    setToken,
  } = useTokenStorage();
  const [user, setUser] = useState<User | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast, destructiveConfirm } = useOverlay();

  useEffect(() => {
    if (!tokenBootstrapped) return;

    if (!token) {
      setUser(null);
      setBootstrapped(true);
      return;
    }

    let cancelled = false;

    async function loadMe() {
      setLoading(true);
      setError(null);
      try {
        const me = await apiGetMe();
        if (!cancelled) {
          setUser(me);
        }
      } catch (e: any) {
        if (!cancelled) {
          setUser(null);
          await setToken(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setBootstrapped(true);
        }
      }
    }

    loadMe();

    return () => {
      cancelled = true;
    };
  }, [token, tokenBootstrapped, setToken]);

  const clearError = useCallback(() => setError(null), []);

  const signIn = useCallback(
    async (login: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiLogin({ login, password });
        await setToken(res.token);

        const fetchedUser = await apiGetMe();
        setUser(fetchedUser);

        const displayName = fetchedUser.username;

        toast({
          message: `Signed in as ${displayName}`,
          variant: "success",
        });

        router.replace("/welcome");
        return true;
      } catch (e: any) {
        const msg = e?.message || "Unable to sign in";
        setError(msg);
        toast({ message: msg, variant: "error" });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setToken, toast]
  );

  const signUp = useCallback(
    async (
      username: string,
      email: string,
      password: string,
      confirm: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        await apiRegister({
          username,
          email,
          password,
          password_confirmation: confirm,
        });

        toast({
          message: "Registration successful! Please sign in.",
          variant: "success",
        });

        router.replace("/");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        router.push("/signIn");

        return true;
      } catch (e: any) {
        const msg = e?.message || "Registration failed. Please try again.";
        setError(msg);
        toast({ message: msg, variant: "error" });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const signOut = useCallback(async () => {
    const ok = await destructiveConfirm({
      title: "Sign out?",
      message: "You’ll be logged out from this device.",
      okText: "Sign out",
      cancelText: "Cancel",
    });
    if (!ok) return;

    try {
      await apiLogout();
    } catch {}

    await setToken(null);
    setUser(null);
    setError(null);
    toast({ message: "Signed out", variant: "info" });
    router.replace("/goodbye");
  }, [destructiveConfirm, toast, setToken]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      error,
      signIn,
      signUp,
      signOut,
      bootstrapped,
      clearError,
    }),
    [user, loading, error, signIn, signUp, signOut, bootstrapped, clearError]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
