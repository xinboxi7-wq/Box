export type AuditEvent =
  | "case_view"
  | "cta_click"
  | "favorite_toggle"
  | "filter_apply"
  | "material_replace"
  | "prompt_copy_all"
  | "prompt_model_switch"
  | "prompt_copy"
  | "search_submit";

type AuditPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(event: AuditEvent, payload: AuditPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event,
    ...payload,
    trackedAt: new Date().toISOString()
  });
}
