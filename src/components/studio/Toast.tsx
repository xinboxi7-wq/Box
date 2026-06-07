import { CheckCircle2, XCircle } from "lucide-react";

export type ToastState = {
  id: number;
  message: string;
  tone: "success" | "error";
} | null;

type ToastProps = {
  toast: ToastState;
};

export function Toast({ toast }: ToastProps) {
  if (!toast) {
    return null;
  }

  const success = toast.tone === "success";
  const Icon = success ? CheckCircle2 : XCircle;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 px-4">
      <div
        role="status"
        aria-live="polite"
        className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-lg backdrop-blur-xl ${
          success
            ? "border-emerald-200 bg-white text-emerald-800"
            : "border-red-200 bg-white text-red-700"
        }`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        {toast.message}
      </div>
    </div>
  );
}
