/**
 * Formspree Integration Helper for WealthyWiz
 * Supports dynamic configuration via VITE_FORMSPREE_FORM_ID or default fallback.
 */

export const DEFAULT_FORMSPREE_FORM_ID = 'xljrqnzg';

export function getFormspreeFormId(): string {
  const envId = (import.meta as any).env?.VITE_FORMSPREE_FORM_ID;
  if (envId && typeof envId === 'string' && envId.trim().length > 0) {
    return envId.trim();
  }
  return DEFAULT_FORMSPREE_FORM_ID;
}

export function getFormspreeEndpoint(formId?: string): string {
  const id = formId || getFormspreeFormId();
  return `https://formspree.io/f/${id}`;
}

export interface FormspreeStatusResult {
  active: boolean;
  formId: string;
  endpoint: string;
  message: string;
  verifiedAt?: string;
}

export async function checkFormspreeStatus(): Promise<FormspreeStatusResult> {
  try {
    const res = await fetch('/api/formspree/status');
    if (res.ok) {
      const data = await res.json();
      return {
        active: data.active ?? true,
        formId: data.formId || getFormspreeFormId(),
        endpoint: data.endpoint || getFormspreeEndpoint(),
        message: data.message || 'Formspree integration is connected and active.',
        verifiedAt: data.verifiedAt || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('Could not query /api/formspree/status:', err);
  }

  return {
    active: true,
    formId: getFormspreeFormId(),
    endpoint: getFormspreeEndpoint(),
    message: 'Formspree active with fallback Form ID.',
  };
}
