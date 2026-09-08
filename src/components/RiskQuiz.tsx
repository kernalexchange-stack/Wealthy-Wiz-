import React, { useState } from 'react';
import { QUIZ_QUESTIONS, calculateRiskProfile } from '../data/quizData';
import { RiskProfileInfo, FundScheme } from '../types';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2, PieChart, ShieldAlert, ArrowDown, Send } from 'lucide-react';

interface RiskQuizProps {
  onCompleteQuiz: (profile: RiskProfileInfo) => void;
}

export const RiskQuiz: React.FC<RiskQuizProps> = ({ onCompleteQuiz }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, { score: number; text: string }>>({});
  const [completedProfile, setCompletedProfile] = useState<RiskProfileInfo | null>(null);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (questionId: number, score: number, text: string) => {
    const updated = {
      ...selectedAnswers,
      [questionId]: { score, text },
    };
    setSelectedAnswers(updated);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate total score
      const sum = (Object.values(updated) as { score: number; text: string }[]).reduce((acc, curr) => acc + curr.score, 0);
      const profile = calculateRiskProfile(sum);
      setCompletedProfile(profile);
      onCompleteQuiz(profile);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setCompletedProfile(null);
  };

  const handleGetAdviceForProfile = () => {
    if (completedProfile) {
      onCompleteQuiz(completedProfile);
      const el = document.getElementById('advice');
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elRect = el.getBoundingClientRect().top;
        const elementPosition = elRect - bodyRect;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <section id="quiz" className="py-16 sm:py-24 bg-[#faf7f2] border-y border-[#ecdcd3] text-slate-900 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fdf2f4] text-[#881337] text-xs font-bold uppercase tracking-wider mb-3 border border-rose-200 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#881337]" />
            60-Second Investor Profiler
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#701a2f] tracking-tight font-['Fraunces',serif]">
            Discover Your True Risk Profile & Ideal Portfolio Split
          </h2>
          <p className="text-[#645c60] mt-2 text-sm sm:text-base">
            Answer 4 quick questions to identify whether your mindset aligns with Conservative, Moderate, Growth, or Aggressive wealth compounding.
          </p>
        </div>

        {/* Quiz Container Card */}
        <div className="bg-white border border-[#ecdcd3] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          
          {!completedProfile ? (
            /* Active Question State */
            <div className="space-y-6">
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs text-stone-500 pb-2">
                <span className="font-semibold text-stone-700">
                  Question {currentStep + 1} of {totalQuestions}
                </span>
                <span className="font-mono">
                  {Math.round(((currentStep + 1) / totalQuestions) * 100)}% Completed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#f4ece7] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#881337] via-[#b91c1c] to-[#d97706] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Question Title & Subtitle */}
              <div className="pt-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#701a2f] leading-snug font-['Fraunces',serif]">
                  {currentQuestion.title}
                </h3>
                <p className="text-sm text-stone-500 mt-1">
                  {currentQuestion.subtitle}
                </p>
              </div>

              {/* Options List */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQuestion.id]?.score === opt.score;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.score, opt.text)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 group ${
                        isSelected
                          ? 'border-[#881337] bg-rose-50/60 shadow-sm'
                          : 'border-[#ecdcd3] hover:border-rose-300 hover:bg-[#faf7f2]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-sm sm:text-base font-semibold text-stone-800 group-hover:text-stone-950">
                          {opt.text}
                        </div>
                        {opt.hint && (
                          <div className="text-xs text-stone-500">
                            {opt.hint}
                          </div>
                        )}
                      </div>

                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-[#881337] bg-[#881337] text-white' : 'border-stone-300'
                      }`}>
                        {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-stone-300" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Back button if past step 1 */}
              {currentStep > 0 && (
                <div className="pt-2 flex justify-start">
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="text-xs text-stone-500 hover:text-stone-800 font-medium py-1 px-2"
                  >
                    ← Previous Question
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Result Outcome State */
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
              
              {/* Top Result Banner */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#881337] text-xs font-bold uppercase tracking-wider border border-rose-200">
                  <CheckCircle2 className="w-4 h-4 text-[#881337]" />
                  Assessment Complete
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 font-['Fraunces',serif]">
                  Your Profile: <span className="text-[#701a2f]">{completedProfile.title}</span>
                </h3>
                <p className="text-sm text-stone-600 max-w-xl mx-auto">
                  {completedProfile.tagline}
                </p>
              </div>

              {/* Asset Allocation Breakdown Box */}
              <div className="bg-[#faf7f2] border border-[#ecdcd3] rounded-2xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-[#881337]" />
                  Recommended Asset Allocation Split
                </h4>

                {/* Visual Ratio Bar */}
                <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner mb-4">
                  <div 
                    className="bg-[#881337] h-full transition-all" 
                    style={{ width: `${completedProfile.equityAllocation}%` }}
                    title={`Equity: ${completedProfile.equityAllocation}%`}
                  />
                  <div 
                    className="bg-[#4a0e2e] h-full transition-all" 
                    style={{ width: `${completedProfile.debtAllocation}%` }}
                    title={`Debt: ${completedProfile.debtAllocation}%`}
                  />
                  <div 
                    className="bg-[#d97706] h-full transition-all" 
                    style={{ width: `${completedProfile.goldAllocation}%` }}
                    title={`Gold: ${completedProfile.goldAllocation}%`}
                  />
                </div>

                {/* Ratio Legend */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-[#ecdcd3]">
                    <div className="text-xs text-stone-500 font-medium">Equity (Growth)</div>
                    <div className="text-lg font-bold text-[#881337] font-mono">
                      {completedProfile.equityAllocation}%
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#ecdcd3]">
                    <div className="text-xs text-stone-500 font-medium">Debt (Stability)</div>
                    <div className="text-lg font-bold text-[#4a0e2e] font-mono">
                      {completedProfile.debtAllocation}%
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#ecdcd3]">
                    <div className="text-xs text-stone-500 font-medium">Gold / Hedge</div>
                    <div className="text-lg font-bold text-[#d97706] font-mono">
                      {completedProfile.goldAllocation}%
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-4 leading-relaxed bg-white p-3 rounded-xl border border-[#ecdcd3]">
                  {completedProfile.description}
                </p>
              </div>

              {/* Matching Curated Schemes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Exemplar Schemes for {completedProfile.type} Investors
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {completedProfile.sampleFunds.slice(0, 4).map((f) => (
                    <div
                      key={f.schemeCode}
                      className="p-3.5 bg-[#faf7f2] rounded-xl border border-[#ecdcd3] flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate">
                          {f.schemeName.replace(' - Direct Plan - Growth', '')}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {f.category} • 1Y Return: <span className="text-emerald-700 font-mono font-semibold">+{f.return1Y}%</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-stone-900 font-mono shrink-0">
                        ₹{f.nav.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleGetAdviceForProfile}
                  className="w-full sm:flex-1 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Get Advice for {completedProfile.type} Profile
                </button>

                <button
                  onClick={handleResetQuiz}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-[#ecdcd3] text-stone-600 hover:text-stone-900 hover:bg-[#faf7f2] text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retake Quiz
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
