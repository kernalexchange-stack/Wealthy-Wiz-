import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Cookie, 
  AlertCircle, 
  ExternalLink, 
  Check, 
  Copy, 
  Mail, 
  Globe, 
  Scale, 
  Lock,
  ChevronRight
} from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'adsense' | 'disclaimer';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy'
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#${activeTab === 'privacy' ? 'privacy-policy' : activeTab === 'terms' ? 'terms-of-service' : activeTab === 'adsense' ? 'adsense-policy' : 'regulatory-disclaimer'}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#180914]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        {/* Header */}
        <div className="bg-[#180914] text-white px-6 py-5 flex items-center justify-between border-b border-[#38142c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-900 to-rose-950 flex items-center justify-center border border-rose-800/60 text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
                  Compliance & Transparency
                </span>
                <span className="text-[11px] text-rose-300/60">•</span>
                <span className="text-[11px] text-rose-200/70 font-mono">wealthywiz.online</span>
              </div>
              <h2 id="legal-modal-title" className="text-xl font-bold font-['Fraunces',serif] text-white">
                Legal Center & Disclosures
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy link to this document"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-[#881337] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-[#881337] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('adsense')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'adsense'
                ? 'bg-[#881337] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>Google AdSense & Cookies</span>
          </button>

          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'bg-[#881337] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SEBI & Regulatory Disclaimer</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-stone-700 text-sm leading-relaxed font-['IBM_Plex_Sans',sans-serif]">
          
          {/* =========================================================================
              TAB 1: PRIVACY POLICY (AdSense Compliant)
          ========================================================================= */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <div className="text-xs text-stone-500 font-mono">Last Updated: September 2026 • Effective Date: Immediate</div>
                <h3 className="text-2xl font-bold font-['Fraunces',serif] text-stone-900 mt-1">
                  Privacy Policy for WealthyWiz
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm mt-1">
                  At WealthyWiz (accessible at <span className="font-mono text-[#881337] font-semibold">https://wealthywiz.online</span>), one of our primary priorities is the privacy and security of our visitors. This Privacy Policy document describes the types of information collected and recorded by WealthyWiz and how we use it.
                </p>
              </div>

              {/* Notice Box */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#881337] shrink-0 mt-0.5" />
                <div className="text-xs text-rose-950 leading-relaxed">
                  <strong>Zero Spam & Non-Selling Pledge:</strong> We do not sell, rent, or trade your personal or financial data to third-party telemarketers or unauthorized brokers. Information collected via advisory forms is strictly utilized to provide mutual fund portfolio reviews and loan facilitation.
                </div>
              </div>

              {/* Section 1: Information Collected */}
              <section className="space-y-3">
                <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs flex items-center justify-center font-mono">1</span>
                  Information We Collect
                </h4>
                <p>
                  When you access or interact with WealthyWiz, we may collect the following categories of information:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-stone-600 text-xs sm:text-sm">
                  <li>
                    <strong>Personally Identifiable Information (Voluntary):</strong> When you request a mutual fund advisory plan or submit an inquiry for a Loan Against Mutual Funds (LAMF), we collect your full name, email address, WhatsApp/mobile number, target investment amount or existing portfolio value, and stated financial goals.
                  </li>
                  <li>
                    <strong>Interactive Tool & Simulator Inputs:</strong> Anonymous parameter values inputted into our risk profiler quiz, SIP compounding calculators, and LAMF loan simulators. These inputs are processed locally in your web browser.
                  </li>
                  <li>
                    <strong>Log Files:</strong> WealthyWiz follows a standard procedure of utilizing server log files. The data logged includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
                  </li>
                </ul>
              </section>

              {/* Section 2: Google AdSense & Third-Party Cookies (MANDATORY FOR ADSENSE) */}
              <section className="space-y-3 p-5 bg-stone-50 border border-stone-200 rounded-2xl">
                <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-amber-600" />
                  <span>Google AdSense & Third-Party Advertising Cookies</span>
                </h4>
                <p className="text-xs sm:text-sm">
                  Google is one of the third-party vendors on our site. It also uses cookies, known as <strong>DoubleClick DART cookies</strong> and advertising identifiers, to serve advertisements to our site visitors based upon their visit to <span className="font-mono text-stone-900 font-semibold">wealthywiz.online</span> and other sites on the internet.
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-xs text-stone-600">
                  <li>
                    Third-party vendors, including <strong>Google</strong>, use cookies to serve ads based on a user's prior visits to this website or other websites.
                  </li>
                  <li>
                    Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to WealthyWiz and/or other sites on the Internet.
                  </li>
                  <li>
                    Users may opt out of personalized advertising by visiting Google Ads Settings:{' '}
                    <a 
                      href="https://www.google.com/settings/ads" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#881337] font-semibold underline inline-flex items-center gap-1"
                    >
                      Google Ads Settings <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  </li>
                  <li>
                    Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting{' '}
                    <a 
                      href="https://www.aboutads.info/choices/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#881337] font-semibold underline inline-flex items-center gap-1"
                    >
                      www.aboutads.info <ExternalLink className="w-3 h-3 inline" />
                    </a>.
                  </li>
                </ul>
              </section>

              {/* Section 3: How We Use Your Data */}
              <section className="space-y-2">
                <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs flex items-center justify-center font-mono">2</span>
                  How We Use Your Information
                </h4>
                <p>We use the collected information for specific, legitimate business purposes:</p>
                <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm text-stone-600">
                  <li>To provide personalized mutual fund risk analysis and asset allocation recommendations.</li>
                  <li>To verify eligibility for Loan Against Mutual Funds (LAMF) with RBI-regulated lending partners.</li>
                  <li>To operate, maintain, and enhance the features of the WealthyWiz website.</li>
                  <li>To prevent fraudulent access, unauthorized security breaches, and ensure platform safety.</li>
                  <li>To serve relevant, non-intrusive advertisements and educational investment content.</li>
                </ul>
              </section>

              {/* Section 4: Data Retention & Security */}
              <section className="space-y-2">
                <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs flex items-center justify-center font-mono">3</span>
                  Data Storage & Security Standards
                </h4>
                <p className="text-xs sm:text-sm">
                  We employ industry-standard TLS/SSL encryption across all data transmissions. User inquiry records are securely routed via encrypted HTTPS endpoints (Formspree API) and stored with restricted role-based administrative access controls. We adhere to the provisions of the <strong>Information Technology Act, 2000</strong> and the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> of India.
                </p>
              </section>

              {/* Section 5: User Rights */}
              <section className="space-y-2">
                <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs flex items-center justify-center font-mono">4</span>
                  Your Data Protection Rights
                </h4>
                <p className="text-xs sm:text-sm">
                  Every user is entitled to the following rights:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">Right to Access:</strong>
                    You have the right to request copies of your personal data stored with WealthyWiz.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">Right to Erasure:</strong>
                    You have the right to request that we delete or purge your contact records from our advisory logs.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">Right to Rectification:</strong>
                    You have the right to request that we correct any inaccurate contact details.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">Right to Withdraw Consent:</strong>
                    You can revoke consent for advisory communication at any time by contacting support.
                  </div>
                </div>
              </section>

              {/* Contact Info */}
              <div className="p-4 bg-stone-100 rounded-2xl text-xs space-y-1.5 border border-stone-200">
                <div className="font-bold text-stone-900">Grievance & Privacy Inquiries</div>
                <div>Entity: <span className="font-semibold">WealthyWiz Advisory & Analytics Desk</span></div>
                <div>Official Domain: <span className="font-mono text-[#881337]">wealthywiz.online</span></div>
                <div>Direct Contact: <a href="mailto:support@wealthywiz.online" className="text-[#881337] underline">support@wealthywiz.online</a> / <a href="mailto:krishnadasktcr@gmail.com" className="text-[#881337] underline">krishnadasktcr@gmail.com</a></div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: TERMS OF SERVICE
          ========================================================================= */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <div className="text-xs text-stone-500 font-mono">Effective: September 2026 • Governing Law: Republic of India</div>
                <h3 className="text-2xl font-bold font-['Fraunces',serif] text-stone-900 mt-1">
                  Terms of Service & Usage Agreement
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm mt-1">
                  Welcome to WealthyWiz (<span className="font-mono text-[#881337]">wealthywiz.online</span>). By accessing or using our website, interactive tools, calculators, and services, you agree to comply with and be bound by the following terms and conditions.
                </p>
              </div>

              {/* Terms Items */}
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <h4 className="font-bold text-stone-900 text-sm">1. Nature of the Platform & Informational Scope</h4>
                  <p className="text-stone-600">
                    WealthyWiz is a financial discovery, analytics, and educational portal. The interactive calculators (e.g., SIP Compounding vs Fixed Deposit, Risk Profiler, LAMF Loan Calculator) provide mathematical simulations based on user-defined inputs and historical benchmarks. They do not constitute an offer, solicitation, or legally binding guarantee of financial return.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <h4 className="font-bold text-stone-900 text-sm">2. Mutual Fund Investments & Market Risk Disclaimers</h4>
                  <p className="text-stone-600">
                    Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing. Historical returns of schemes (such as 1-Year, 3-Year, or 5-Year CAGR) do not guarantee future performance. WealthyWiz mirrors NAV feeds directly from the Association of Mutual Funds in India (AMFI) and mfapi.in; we are not liable for transient latency or feed discrepancies from upstream registry servers.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <h4 className="font-bold text-stone-900 text-sm">3. Loan Against Mutual Funds (LAMF) Facilitation</h4>
                  <p className="text-stone-600">
                    WealthyWiz acts as a referral, calculation, and technology facilitation platform. All loan disbursements, lien markings with RTAs (CAMS / KFintech), credit checks, interest rate approvals (e.g., 9.5% p.a.), and loan documentation are solely executed by RBI-regulated Banks and Non-Banking Financial Companies (NBFCs). WealthyWiz does not directly lend capital or collect loan repayments.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <h4 className="font-bold text-stone-900 text-sm">4. Intellectual Property Rights</h4>
                  <p className="text-stone-600">
                    All original software code, user interface designs, mathematical calculation algorithms, logos (including the WealthyWiz Owl mark), and educational guides are the exclusive intellectual property of WealthyWiz. Any unauthorized reproduction, scraping, reverse engineering, or commercial redistribution without prior written consent is strictly prohibited.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <h4 className="font-bold text-stone-900 text-sm">5. Third-Party Advertisements & Links</h4>
                  <p className="text-stone-600">
                    This website displays third-party advertisements via Google AdSense and may feature links to external websites. WealthyWiz does not endorse, guarantee, or assume responsibility for products, services, or claims advertised by third-party sponsors. Users access third-party sites at their own discretion and risk.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <h4 className="font-bold text-stone-900 text-sm">6. Limitation of Liability & Indemnification</h4>
                  <p className="text-stone-600">
                    To the fullest extent permitted by Indian law, WealthyWiz and its creators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from investment decisions made using data, calculators, or content available on this site.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <h4 className="font-bold text-stone-900 text-sm">7. Governing Law & Jurisdiction</h4>
                  <p className="text-stone-600">
                    These Terms of Service are governed by and construed in accordance with the laws of the Republic of India. Any legal disputes arising out of the use of this website shall be subject to the exclusive jurisdiction of the competent courts in India.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: GOOGLE ADSENSE & COOKIE POLICY
          ========================================================================= */}
          {activeTab === 'adsense' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <div className="text-xs text-stone-500 font-mono">AdSense Transparency & Publisher Disclosure</div>
                <h3 className="text-2xl font-bold font-['Fraunces',serif] text-stone-900 mt-1">
                  Google AdSense & Cookie Disclosures
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm mt-1">
                  WealthyWiz utilizes Google AdSense and standard web tracking technologies to support independent financial research and maintain free public access to our live AMFI mutual fund intelligence tools.
                </p>
              </div>

              {/* AdSense Verification Notice */}
              <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950 text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Verified Google ads.txt Relationship</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  WealthyWiz publishes a verified <span className="font-mono font-bold bg-amber-100 px-1.5 py-0.5 rounded">/ads.txt</span> declaration file in accordance with the Interactive Advertising Bureau (IAB) OpenRTB standard:
                </p>
                <div className="p-2.5 bg-white rounded-xl font-mono text-xs text-stone-800 border border-amber-200 flex items-center justify-between">
                  <span>google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0</span>
                  <a 
                    href="/ads.txt" 
                    target="_blank" 
                    className="text-[#881337] font-semibold text-[11px] underline flex items-center gap-1"
                  >
                    View File <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Detailed Cookie Explanations */}
              <div className="space-y-3 text-xs sm:text-sm">
                <h4 className="font-bold text-stone-900 text-base">What are Cookies and How are They Used?</h4>
                <p className="text-stone-600">
                  Cookies are small text files placed on your device by web browsers when you visit a website. WealthyWiz uses cookies for the following specific purposes:
                </p>

                <div className="space-y-2.5">
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">1. Essential Platform Session Cookies</strong>
                    <p className="text-stone-600 text-xs">
                      Used to preserve user interface preferences (such as selected mutual fund schemes in your advisory basket, completed risk quiz profiles, and local calculation states) so you do not have to re-enter them on page refreshes.
                    </p>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">2. Google DoubleClick DART Advertising Cookies</strong>
                    <p className="text-stone-600 text-xs">
                      Google, as a third-party vendor, uses cookies to serve contextual and interest-based advertisements on WealthyWiz. Google’s use of the DART cookie allows it to serve ads based on your visit to WealthyWiz and other websites on the Internet.
                    </p>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">3. Analytics & Performance Cookies</strong>
                    <p className="text-stone-600 text-xs">
                      Help us understand aggregate traffic trends, most popular mutual fund categories (e.g. Flexi Cap vs Small Cap), and device types to continually optimize website performance and loading speeds.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-200">
                  <h4 className="font-bold text-stone-900 text-sm mb-2">How Can You Control or Disable Cookies?</h4>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    You can choose to disable cookies through your individual browser settings (Chrome, Firefox, Safari, Edge). Please note that disabling cookies may affect certain interactive conveniences on WealthyWiz, such as holding selected mutual fund schemes in your advisory basket.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <a 
                      href="https://adssettings.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-300 font-semibold inline-flex items-center gap-1.5"
                    >
                      Google Ad Settings <ExternalLink className="w-3 h-3" />
                    </a>
                    <a 
                      href="https://optout.networkadvertising.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-300 font-semibold inline-flex items-center gap-1.5"
                    >
                      NAI Consumer Opt-Out <ExternalLink className="w-3 h-3" />
                    </a>
                    <a 
                      href="https://www.youronlinechoices.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-300 font-semibold inline-flex items-center gap-1.5"
                    >
                      Your Online Choices <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: STATUTORY REGULATORY & SEBI DISCLAIMER
          ========================================================================= */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <div className="text-xs text-stone-500 font-mono">Statutory Investment Warning • AMFI Code Compliance</div>
                <h3 className="text-2xl font-bold font-['Fraunces',serif] text-stone-900 mt-1">
                  SEBI & AMFI Regulatory Notices
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm mt-1">
                  WealthyWiz operates strictly within the framework of Indian financial regulatory compliance guidelines established by the Securities and Exchange Board of India (SEBI) and Association of Mutual Funds in India (AMFI).
                </p>
              </div>

              {/* Statutory Warning Big Box */}
              <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 font-bold text-[#881337] text-sm">
                  <AlertCircle className="w-5 h-5 text-[#881337] shrink-0" />
                  <span>MANDATORY STATUTORY RISK WARNING</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-rose-950 leading-relaxed">
                  Mutual fund investments are subject to market risks, read all scheme-related documents carefully.
                </p>
                <p className="text-xs text-rose-900 leading-relaxed">
                  Past performance of any mutual fund scheme is not an indicator or guarantee of future returns. Neither WealthyWiz nor its promoters, analysts, or contributors guarantee any specific returns, principal protection, or capital preservation on any scheme showcased on this platform.
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-600">
                <h4 className="font-bold text-stone-900 text-sm">AMFI Data Integrity</h4>
                <p>
                  All Net Asset Value (NAV) numbers, 52-week highs/lows, and historical tracking charts displayed on WealthyWiz are fetched directly from public AMFI / Scheme Registry endpoints. While we make every endeavor to keep the NAV feed real-time and error-free, NAV updates are governed by mutual fund house cut-off timings on Indian business days.
                </p>

                <h4 className="font-bold text-stone-900 text-sm pt-2">Advisory Notice</h4>
                <p>
                  Calculators and the 60-Second Risk Profiler Quiz are algorithmic models intended to assist investors in understanding asset allocation concepts. They do not constitute formal SEBI-Registered Investment Advisory (RIA) service. Investors are advised to consult their independent financial planner before taking significant investment actions.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-stone-400" />
            <span>WealthyWiz • wealthywiz.online</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(
                activeTab === 'privacy' ? 'terms' : activeTab === 'terms' ? 'adsense' : activeTab === 'adsense' ? 'disclaimer' : 'privacy'
              )}
              className="text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Next Section</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="bg-[#180914] text-white hover:bg-[#2e1126] font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
