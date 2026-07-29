import { Link } from '@inertiajs/react';
import React from 'react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null; // Only prev, next, and current page means no pagination needed

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 mt-4 fade-in">
            {links.map((link, index) => {
                const isPrevious = index === 0;
                const isNext = index === links.length - 1;
                let label = link.label;

                if (isPrevious) label = <i className="fa-solid fa-chevron-left text-[10px]"></i>;
                if (isNext) label = <i className="fa-solid fa-chevron-right text-[10px]"></i>;

                return link.url === null ? (
                    <div
                        key={index}
                        className="flex items-center justify-center min-w-[32px] h-8 px-2 text-xs font-semibold text-slate-300 bg-slate-50 border border-slate-100 rounded-lg cursor-not-allowed"
                    >
                        {label}
                    </div>
                ) : typeof label === 'string' ? (
                    <Link
                        key={index}
                        href={link.url}
                        className={`flex items-center justify-center min-w-[32px] h-8 px-2 text-xs font-bold rounded-lg transition-all ${
                            link.active
                                ? 'bg-kai-blue text-white shadow-md shadow-kai-blue/20 border border-kai-blue'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-kai-orange hover:border-kai-orange/30'
                        }`}
                        dangerouslySetInnerHTML={{ __html: label }}
                        preserveScroll
                        preserveState
                    />
                ) : (
                    <Link
                        key={index}
                        href={link.url}
                        className={`flex items-center justify-center min-w-[32px] h-8 px-2 text-xs font-bold rounded-lg transition-all ${
                            link.active
                                ? 'bg-kai-blue text-white shadow-md shadow-kai-blue/20 border border-kai-blue'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-kai-orange hover:border-kai-orange/30'
                        }`}
                        preserveScroll
                        preserveState
                    >
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}
