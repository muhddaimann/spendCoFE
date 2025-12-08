import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, Platform } from "react-native";

type Mode = "shown" | "dim" | "hidden";

type TabCtx = {
  mode: Mode;
  opacity: number;
  scale: number;
  reveal: (v?: number) => void;
  dim: () => void;
  hide: () => void;
  lockHidden: () => void;
  unlockHidden: () => void;
  updateByOffset: (y: number) => void;
  setActiveRoute: (route: string) => void;
  saveOffset: (route: string, y: number) => void;
};

const Ctx = createContext<TabCtx>({
  mode: "shown",
  opacity: 1,
  scale: 1,
  reveal: () => {},
  dim: () => {},
  hide: () => {},
  lockHidden: () => {},
  unlockHidden: () => {},
  updateByOffset: () => {},
  setActiveRoute: () => {},
  saveOffset: () => {},
});

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("shown");
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);

  const isLockedRef = useRef(false);
  const lastY = useRef(0);
  const ignoreNext = useRef(false);
  const kbd = useRef(false);
  const activeRoute = useRef<string | null>(null);
  const routeY = useRef<Record<string, number>>({});

  const applyFromY = useCallback((y: number) => {
    if (kbd.current || isLockedRef.current) return;

    const minOpacity = 0.6;
    const dimOpacity = 0.78;
    const shownY = 16;
    const dimY = 96;

    if (y <= shownY) {
      setMode("shown");
      setOpacity(1);
      setScale(1);
      return;
    }

    if (y >= dimY) {
      setMode("dim");
      setOpacity(dimOpacity);
      setScale(0.98);
      return;
    }

    const t = (y - shownY) / (dimY - shownY);
    const o = 1 - (1 - dimOpacity) * t;

    setOpacity(o);
  }, []);

  const reveal = useCallback((v?: number) => {
    if (kbd.current || isLockedRef.current) return;
    setMode("shown");
    setOpacity(v ?? 1);
    setScale(1);
  }, []);

  const dim = useCallback(() => {
    if (kbd.current || isLockedRef.current) return;
    setMode("dim");
    setOpacity(0.78);
    setScale(0.98);
  }, []);

  const hide = useCallback(() => {
    if (isLockedRef.current) {
      setMode("hidden");
      setOpacity(0);
      setScale(0.92);
      return;
    }

    if (kbd.current) {
      setMode("hidden");
      setOpacity(0);
      setScale(0.92);
    }
  }, []);

  const lockHidden = useCallback(() => {
    isLockedRef.current = true;
    setMode("hidden");
    setOpacity(0);
    setScale(0.92);
  }, []);

  const unlockHidden = useCallback(() => {
    isLockedRef.current = false;
    reveal();
  }, [reveal]);

  const updateByOffset = useCallback(
    (y: number) => {
      if (ignoreNext.current) {
        ignoreNext.current = false;
        lastY.current = y;
        return;
      }

      lastY.current = y;
      applyFromY(y);
    },
    [applyFromY]
  );

  const setActiveRoute = useCallback(
    (route: string) => {
      activeRoute.current = route;
      const y = routeY.current[route] ?? 0;
      ignoreNext.current = true;
      lastY.current = y;
      applyFromY(y);
    },
    [applyFromY]
  );

  const saveOffset = useCallback((route: string, y: number) => {
    routeY.current[route] = y;
  }, []);

  useEffect(() => {
    const sh = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        kbd.current = true;
        hide();
      }
    );
    const hd = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        kbd.current = false;
        const route = activeRoute.current;
        const y = route ? routeY.current[route] ?? 0 : 0;
        setTimeout(
          () => {
            setActiveRoute(route ?? "");
          },
          Platform.OS === "ios" ? 0 : 0
        );
      }
    );
    return () => {
      sh.remove();
      hd.remove();
    };
  }, [hide, setActiveRoute]);

  const value = useMemo(
    () => ({
      mode,
      opacity,
      scale,
      reveal,
      dim,
      hide,
      lockHidden,
      unlockHidden,
      updateByOffset,
      setActiveRoute,
      saveOffset,
    }),
    [
      mode,
      opacity,
      scale,
      reveal,
      dim,
      hide,
      lockHidden,
      unlockHidden,
      updateByOffset,
      setActiveRoute,
      saveOffset,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}


export const useTabsUi = () => useContext(Ctx);
