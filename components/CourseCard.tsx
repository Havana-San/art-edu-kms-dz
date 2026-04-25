import Link from 'next/link';
import { Clock, ChevronLeft, BookOpen } from 'lucide-react';

interface CourseCardProps {
  id:           string;
  title:        string;
  description:  string;
  level:        string;
  created_at?:  string;
  lessonsCount?: number;
  progress?:    number;  // 0-100
}

const LEVEL_COLOR: Record<string, string> = {
  '1AM': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  '2AM': 'bg-blue-500/10    text-blue-400    border-blue-500/30',
  '3AM': 'bg-amber-500/10   text-amber-400   border-amber-500/30',
  '4AM': 'bg-rose-500/10    text-rose-400    border-rose-500/30',
};

export default function CourseCard({
  id, title, description, level,
  created_at, lessonsCount, progress,
}: CourseCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-600/40 transition-all hover:scale-[1.01] flex flex-col group">

      {/* Level badge */}
      <span className={`inline-block self-start px-3 py-1 rounded-full text-xs font-bold border mb-4 ${
        LEVEL_COLOR[level] || 'bg-slate-700 text-slate-300 border-slate-600'
      }`}>
        {level}
      </span>

      {/* Title */}
      <h3 className="font-amiri text-xl font-bold text-white mb-2 leading-snug flex-1 group-hover:text-indigo-200 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
        {description}
      </p>

      {/* Progress bar (optional) */}
      {typeof progress === 'number' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>التقدم</span>
            <span className="text-indigo-400 font-bold">{progress}٪</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-indigo-500 to-indigo-400 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 text-slate-500 text-xs">
          {lessonsCount !== undefined && (
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {lessonsCount} درس
            </span>
          )}
          {created_at && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {new Date(created_at).toLocaleDateString('ar-DZ')}
            </span>
          )}
        </div>

        <Link
          href={`/courses/${id}`}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
        >
          عرض
          <ChevronLeft size={14} />
        </Link>
      </div>
    </div>
  );
}