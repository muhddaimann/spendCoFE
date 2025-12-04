import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { setAuthToken } from "./api/api";

const TOKEN_KEY = "spendco-token";

type TokenCtx = {
  token: string | null;
  bootstrapped: boolean;
  setToken: (token: string | null) => Promise<void>;
};

const TokenContext = createContext<TokenCtx>({
  token: null,
  bootstrapped: false,
  setToken: async () => {},
});

export function TokenStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setTokenState] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      if (cancelled) return;
      if (stored) {
        setTokenState(stored);
        setAuthToken(stored);
      } else {
        setAuthToken(null);
      }
      setBootstrapped(true);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const setToken = useCallback(async (next: string | null) => {
    if (next) {
      await SecureStore.setItemAsync(TOKEN_KEY, next);
      setAuthToken(next);
      setTokenState(next);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setAuthToken(null);
      setTokenState(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      bootstrapped,
      setToken,
    }),
    [token, bootstrapped, setToken]
  );

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
}

export const useTokenStorage = () => useContext(TokenContext);