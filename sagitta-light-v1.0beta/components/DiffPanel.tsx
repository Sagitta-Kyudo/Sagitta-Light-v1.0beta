import React from 'react';
import { type DiffResult, type PanelType } from '../types';

const DiffRenderer: React.FC<{ diffResult: DiffResult }> = React.memo(({ diffResult }) => {
    return (
        <>
            {diffResult.map((part, index) => {
                const spanClass = part.added
                    ? 'bg-diff-add-dark text-diff-text-add-dark'
                    : part.removed
                    ? 'bg-diff-remove-dark text-diff-text-remove-dark'
                    : '';
                return (
                    <span key={index} className={spanClass}>
                        {part.value}
                    </span>
                );
            })}
        </>
    );
});

interface PanelProps {
    title: string;
    type: PanelType;
    panelRef: React.RefObject<HTMLTextAreaElement | HTMLDivElement>;
    onPanelScroll: React.UIEventHandler<HTMLElement>;
    text?: string;
    onTextChange?: (value: string) => void;
    diffResult?: DiffResult;
}

export const DiffPanel: React.FC<PanelProps> = ({
    title,
    type,
    panelRef,
    onPanelScroll,
    text,
    onTextChange,
    diffResult,
}) => {
    return (
        <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm rounded-lg border border-indigo-500/30 overflow-hidden shadow-lg shadow-black/20">
            <h2 className="text-lg font-semibold p-3 border-b border-indigo-500/30 text-cyan-300">{title}</h2>
            <div className="flex-grow relative">
                {type === 'input' && (
                    <textarea
                        ref={panelRef as React.RefObject<HTMLTextAreaElement>}
                        onScroll={onPanelScroll}
                        value={text}
                        onChange={(e) => onTextChange?.(e.target.value)}
                        placeholder={`Paste content here...`}
                        className="absolute inset-0 w-full h-full p-3 resize-none focus:outline-none bg-black/30 text-gray-200 font-mono text-sm leading-relaxed focus:ring-1 focus:ring-cyan-400"
                        aria-label={title}
                    />
                )}
                {type === 'output' && (
                    <div
                        ref={panelRef as React.RefObject<HTMLDivElement>}
                        onScroll={onPanelScroll}
                        className="absolute inset-0 w-full h-full p-3 overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-gray-300"
                        aria-label={title}
                    >
                       {diffResult && <DiffRenderer diffResult={diffResult} />}
                    </div>
                )}
            </div>
        </div>
    );
};
