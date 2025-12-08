import { useContext } from "react";
import {
  OverlayContext,
  type AlertOptions,
  type ToastOptions,
  type ModalOptions,
  type ConfirmOptions,
  type OptionsOverlayOptions,
} from "../contexts/overlayContext";

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used within OverlayProvider");
  return ctx;
}

export function useToast(): (opts: ToastOptions | string) => void {
  return useOverlay().toast;
}

export function useAlert(): {
  alert: (opts: AlertOptions) => void;
  dismissAlert: () => void;
} {
  const { alert, dismissAlert } = useOverlay();
  return { alert, dismissAlert };
}

export function useModal(): {
  modal: (opts: ModalOptions) => void;
  dismissModal: () => void;
} {
  const { modal, dismissModal } = useOverlay();
  return { modal, dismissModal };
}

export function useConfirm(): {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  destructiveConfirm: (opts: ConfirmOptions) => Promise<boolean>;
} {
  const { confirm, destructiveConfirm } = useOverlay();
  return { confirm, destructiveConfirm };
}

export function useOptions(): {
  options: (opts: OptionsOverlayOptions) => void;
  dismissOptions: () => void;
} {
  const { options, dismissOptions } = useOverlay();
  return { options, dismissOptions };
}
