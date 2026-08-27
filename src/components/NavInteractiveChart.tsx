import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, Activity, Zap, BarChart2, Check } from 'lucide-react';
import { getChartDataForTimeframe, formatINR } from '../utils/mfapi';

interface NavInteractiveChartProps {
  schemeName: string;
  schemeCode: number;
  currentNav: number;
  navDate: string;
  rawHistoryData?: { date: string; nav: string }[];
  category?: string;
  return1Y?: number;
  return3Y?: number;
  return5Y?: number;
}

type Timeframe = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'MAX';
type ViewMode = 'nav' | 'pct';

export const NavInteractiveChart: React.FC<NavInteractiveChartProps> = ({
  schemeName,
  schemeCode,
  currentNav,
  navDate,
  rawHistoryData,
  category,
  return1Y,
  return3Y,
  return5Y,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');
  const [viewMode, setViewMode] = useState<ViewMode>('nav');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Compute timeline data for selected timeframe
  const chartData = useMemo(() => {
    return getChartDataForTimeframe(rawHistoryData, timeframe, currentNav);
  }, [rawHistoryData, timeframe, currentNav]);

  // Statistical calculations across the current timeframe
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        startNav: currentNav,
        endNav: currentNav,
        highNav: currentNav,
        highDate: navDate,
        lowNav: currentNav,
        lowDate: navDate,
        totalChange: 0,
        totalChangePct: 0,
        startDate: navDate,
        endDate: navDate,
      };
    }

    const start = chartData[0];
    const end = chartData[chartData.length - 1];
    
    let high = chartData[0];
    let low = chartData[0];

    chartData.forEach(pt => {
      if (pt.nav > high.nav) high = pt;
      if (pt.nav < low.nav) low = pt;
    });

    const totalChange = +(end.nav - start.nav).toFixed(2);
    const totalChangePct = start.nav > 0 ? +(((end.nav - start.nav) / start.nav) * 100).toFixed(2) : 0;

    return {
      startNav: start.nav,
      endNav: end.nav,
      highNav: high.nav,
      highDate: high.date,
      lowNav: low.nav,
      lowDate: low.date,
      totalChange,
      totalChangePct,
      startDate: start.date,
      endDate: end.date,
    };
  }, [chartData, currentNav, navDate]);

  const isPositive = stats.totalChange >= 0;
  const activePoint = hoveredPointIndex !== null && chartData[hoveredPointIndex] ? chartData[hoveredPointIndex] : chartData[chartData.length - 1];

  // SVG Chart Geometry
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = { top: 20, right: 15, bottom: 30, left: 55 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Min and Max calculation for scales
  const minVal = Math.min(...chartData.map(d => viewMode === 'nav' ? d.nav : d.returnPct));
  const maxVal = Math.max(...chartData.map(d => viewMode === 'nav' ? d.nav : d.returnPct));
  const range = maxVal - minVal || 1;
  const yPadding = range * 0.08;
  const yMin = minVal - yPadding;
  const yMax = maxVal + yPadding;
  const yRange = yMax - yMin || 1;

  // Coordinate mapper functions
  const getX = (index: number) => {
    if (chartData.length <= 1) return padding.left;
    return padding.left + (index / (chartData.length - 1)) * graphWidth;
  };

  const getY = (val: number) => {
    return padding.top + graphHeight - ((val - yMin) / yRange) * graphHeight;
  };

  // Generate SVG Path String
  const linePoints = chartData.map((d, i) => `${getX(i)},${getY(viewMode === 'nav' ? d.nav : d.returnPct)}`).join(' ');
  const areaPoints = `${getX(0)},${padding.top + graphHeight} ${linePoints} ${getX(chartData.length - 1)},${padding.top + graphHeight}`;

  // SMA Path String
  const smaPoints = chartData
    .filter(d => d.sma !== undefined)
    .map((d, i) => `${getX(i)},${getY(viewMode === 'nav' ? d.sma! : ((d.sma! - stats.startNav) / stats.startNav) * 100)}`)
    .join(' ');

  // Y-Axis Ticks (4 levels)
  const yTicks = [0, 0.33, 0.66, 1].map(pct => {
    const val = yMin + pct * yRange;
    return {
      val,
      y: getY(val),
      label: viewMode === 'nav' ? `₹${val.toFixed(1)}` : `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`,
    };
  });

  // X-Axis Ticks (5 date milestones)
  const xTickIndices = [
    0,
    Math.floor(chartData.length * 0.25),
    Math.floor(chartData.length * 0.5),
    Math.floor(chartData.length * 0.75),
    chartData.length - 1,
  ].filter((v, i, a) => a.indexOf(v) === i && v < chartData.length);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-cyan-50 text-cyan-900 border border-cyan-200">
              {category || 'Equity Scheme'}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Code: <strong className="text-slate-800">{schemeCode}</strong>
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Feed: {navDate}
            </span>
          </div>
          <h4 className="text-lg font-bold text-slate-900 mt-1 font-['Fraunces',serif] leading-tight line-clamp-1">
            {schemeName}
          </h4>
        </div>

        {/* View Mode Toggle: NAV ₹ vs Return % */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('nav')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'nav'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              NAV (₹)
            </button>
            <button
              onClick={() => setViewMode('pct')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'pct'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Return (%)
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Cursor Info Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200/80">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-500 block">
            {hoveredPointIndex !== null ? 'Cursor Date' : 'Latest NAV Date'}
          </span>
          <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-600" />
            {activePoint?.date || navDate}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-500 block">
            NAV on Date
          </span>
          <span className="text-base font-bold text-slate-900 font-mono mt-0.5">
            ₹{activePoint?.nav?.toFixed(2) || currentNav.toFixed(2)}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-500 block">
            {timeframe} Period Return
          </span>
          <span className={`text-base font-bold font-mono mt-0.5 flex items-center gap-1 ${
            (activePoint?.returnPct ?? stats.totalChangePct) >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {(activePoint?.returnPct ?? stats.totalChangePct) >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {(activePoint?.returnPct ?? stats.totalChangePct) >= 0 ? '+' : ''}
            {(activePoint?.returnPct ?? stats.totalChangePct).toFixed(2)}%
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-500 block">
            Period High / Low
          </span>
          <span className="text-xs font-bold text-slate-700 font-mono mt-1 block">
            ₹{stats.highNav.toFixed(1)} <span className="text-slate-400 font-normal">/</span> ₹{stats.lowNav.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Timeframe Selector Pills */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['1M', '3M', '6M', '1Y', '3Y', '5Y', 'MAX'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                setHoveredPointIndex(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === tf
                  ? 'bg-[#17144e] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* SMA Toggle */}
        <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showSMA}
            onChange={(e) => setShowSMA(e.target.checked)}
            className="rounded text-cyan-600 focus:ring-cyan-500 w-3.5 h-3.5"
          />
          <span className="font-medium">Moving Average (SMA)</span>
        </label>
      </div>

      {/* Interactive SVG Chart Canvas */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50/50 to-white rounded-xl border border-slate-100 p-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoveredPointIndex(null)}
        >
          <defs>
            {/* Emerald Gradient */}
            <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            {/* Rose Gradient */}
            <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={svgWidth - padding.right}
                y2={tick.y}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={tick.y + 3}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
                fontFamily="monospace"
                fontWeight="500"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <polygon
            points={areaPoints}
            fill={isPositive ? 'url(#positiveGradient)' : 'url(#negativeGradient)'}
          />

          {/* SMA Line */}
          {showSMA && (
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.75"
              strokeDasharray="4 2"
              points={smaPoints}
            />
          )}

          {/* Main NAV Trendline */}
          <polyline
            fill="none"
            stroke={isPositive ? '#059669' : '#e11d48'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints}
          />

          {/* X-Axis Ticks (Dates) */}
          {xTickIndices.map((idx) => {
            const pt = chartData[idx];
            if (!pt) return null;
            const x = getX(idx);
            return (
              <text
                key={idx}
                x={x}
                y={svgHeight - 8}
                textAnchor={idx === 0 ? 'start' : idx === chartData.length - 1 ? 'end' : 'middle'}
                fontSize="10"
                fill="#64748b"
                fontFamily="monospace"
              >
                {pt.displayDate || pt.date}
              </text>
            );
          })}

          {/* Interactive Hover Crosshair */}
          {hoveredPointIndex !== null && chartData[hoveredPointIndex] && (
            <g>
              <line
                x1={getX(hoveredPointIndex)}
                y1={padding.top}
                x2={getX(hoveredPointIndex)}
                y2={padding.top + graphHeight}
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoveredPointIndex)}
                cy={getY(viewMode === 'nav' ? chartData[hoveredPointIndex].nav : chartData[hoveredPointIndex].returnPct)}
                r="5"
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Transparent Hover Hit Boxes for smooth tracking */}
          {chartData.map((_d, idx) => {
            const x = getX(idx);
            const w = graphWidth / Math.max(1, chartData.length - 1);
            return (
              <rect
                key={idx}
                x={x - w / 2}
                y={padding.top}
                width={w}
                height={graphHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredPointIndex(idx)}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend & Summary Info */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-0.5 rounded-full ${isPositive ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
            <span className="font-medium text-slate-700">Scheme NAV</span>
          </div>
          {showSMA && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-500 rounded-full border-b border-dashed"></span>
              <span className="font-medium text-slate-700">SMA Trend</span>
            </div>
          )}
        </div>

        <div className="font-mono text-[11px] text-slate-400">
          Source: AMFI Official Daily NAV (T+0 Close)
        </div>
      </div>
    </div>
  );
};
