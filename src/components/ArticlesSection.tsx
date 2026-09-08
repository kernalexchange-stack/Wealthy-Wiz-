import React, { useState } from 'react';
import { ARTICLES_DATA } from '../data/articlesData';
import { ArticleItem } from '../types';
import { BookOpen, Clock, Calendar, ArrowRight, X, Sparkles, CheckCircle2, Bookmark } from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);

  const handleActionClick = (targetHash: string) => {
    setActiveArticle(null);
    const id = targetHash.replace('#', '');
    const el = document.getElementById(id);
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
  };

  return (
    <section id="blog" className="py-16 sm:py-24 bg-[#faf7f2] text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/10 text-[#881337] text-xs font-semibold uppercase tracking-wider mb-3 border border-rose-900/20">
            <BookOpen className="w-3.5 h-3.5 text-[#881337]" />
            Educational Guides & Market Insights
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-['Fraunces',serif]">
            Master Mutual Funds & Smart Investing
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            No jargon. Clear, data-driven handbooks on Indian mutual funds, capital gains taxation, compounding rules, and asset allocation strategy.
          </p>
        </div>

        {/* 6 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES_DATA.map((art) => (
            <article
              key={art.slug}
              onClick={() => setActiveArticle(art)}
              className="bg-white border border-stone-200/90 rounded-3xl p-6 hover:shadow-lg hover:border-rose-300 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Meta Row */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-[#881337] bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#881337] transition-colors leading-snug font-['Fraunces',serif]">
                  {art.title}
                </h3>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              {/* Card Footer CTA */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#881337] group-hover:text-rose-900">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Interactive Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-[#180914]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Article Header */}
            <div className="pr-8 space-y-2">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="bg-rose-50 text-[#881337] px-2.5 py-0.5 rounded-md font-semibold border border-rose-200">
                  {activeArticle.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {activeArticle.readTime}
                </span>
                <span>•</span>
                <span>{activeArticle.publishedDate}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Fraunces',serif] leading-tight pt-1">
                {activeArticle.title}
              </h2>
              <p className="text-sm text-slate-600 italic">
                {activeArticle.subtitle}
              </p>
            </div>

            {/* Key Takeaways Box */}
            <div className="my-6 p-5 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#881337] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Key Strategic Takeaways
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-rose-950">
                {activeArticle.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#881337] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed font-sans border-t border-slate-100 pt-4">
              {activeArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* In-Article Call to Action */}
            <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-50 p-5 rounded-2xl">
              <div>
                <div className="text-xs font-bold text-slate-900">Ready to take action?</div>
                <div className="text-xs text-slate-500">Apply what you learned to your personal wealth strategy.</div>
              </div>
              <button
                onClick={() => handleActionClick(activeArticle.relatedAction.targetHash)}
                className="w-full sm:w-auto bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:brightness-105 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                {activeArticle.relatedAction.label}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
