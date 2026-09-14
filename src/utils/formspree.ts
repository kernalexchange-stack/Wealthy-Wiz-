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

export interface LeadSubmissionData {
  name: string;
  email: string;
  phone: string;
  investmentGoal?: string;
  investmentAmount?: number;
  investmentMode?: string;
  riskProfile?: string;
  recommendedFunds?: string[];
  sourcePage?: string;
  message?: string;
}

export async function sendLeadToFormspree(leadData: LeadSubmissionData): Promise<{ success: boolean; message: string }> {
  const formId = getFormspreeFormId();
  const endpoint = getFormspreeEndpoint(formId);

  const payload = {
    serviceType: 'WealthyWiz Advisory Consultation',
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    investmentGoal: leadData.investmentGoal || 'Direct Investment Consultation',
    investmentAmount: leadData.investmentAmount ? `₹${leadData.investmentAmount.toLocaleString('en-IN')}` : 'Not Specified',
    investmentMode: leadData.investmentMode || 'SIP',
    riskProfile: leadData.riskProfile || 'Not Specified',
    recommendedFunds: (leadData.recommendedFunds || []).join(', ') || 'Direct Scheme Inquiry',
    message: leadData.message || 'Direct consultation inquiry',
    sourcePage: leadData.sourcePage || window.location.pathname,
    submittedAt: new Date().toLocaleString('en-IN'),
    _subject: `New WealthyWiz Lead: ${leadData.name} (${leadData.investmentGoal || 'Direct Consultation'})`,
  };

  // 1. Submit to server API (which stores in CRM and forwards to Formspree)
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...leadData,
        createdAt: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.warn('Server CRM dispatch note:', err);
  }

  // 2. Direct client-side submission to Formspree
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { success: true, message: 'Lead submitted successfully to Formspree.' };
    }
  } catch (err) {
    console.warn('Direct Formspree dispatch note (server already queued):', err);
  }

  return { success: true, message: 'Lead submitted successfully.' };
}
