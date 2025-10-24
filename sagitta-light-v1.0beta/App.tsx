import React, { useState, useEffect, useRef, useCallback } from 'react';
import { diffChars } from 'diff';
import { Header } from './components/Header';
import { DiffPanel } from './components/DiffPanel';
import { type DiffResult } from './types';

const App: React.FC = () => {
    const [text1, setText1] = useState<string>('');
    const [text2, setText2] = useState<string>('');
    const [diff1, setDiff1] = useState<DiffResult>([]);
    const [diff2, setDiff2] = useState<DiffResult>([]);

    const input1Ref = useRef<HTMLTextAreaElement>(null);
    const input2Ref = useRef<HTMLTextAreaElement>(null);
    const output1Ref = useRef<HTMLDivElement>(null);
    const output2Ref = useRef<HTMLDivElement>(null);

    const isSyncing = useRef(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (text1 || text2) {
                const differences = diffChars(text1, text2);
                setDiff1(differences.filter(part => !part.added));
                setDiff2(differences.filter(part => !part.removed));
            } else {
                setDiff1([]);
                setDiff2([]);
            }
        }, 250);

        return () => {
            clearTimeout(handler);
        };
    }, [text1, text2]);

    const allPanelRefs = [input1Ref, input2Ref, output1Ref, output2Ref];
    const handleScroll = useCallback((scrolledPanelRef: React.RefObject<HTMLElement>) => (event: React.UIEvent<HTMLElement>) => {
        if (isSyncing.current) return;
        isSyncing.current = true;

        const { scrollTop, scrollLeft } = event.currentTarget;

        allPanelRefs.forEach(panelRef => {
            if (panelRef.current && panelRef.current !== scrolledPanelRef.current) {
                panelRef.current.scrollTop = scrollTop;
                panelRef.current.scrollLeft = scrollLeft;
            }
        });

        requestAnimationFrame(() => {
            isSyncing.current = false;
        });
    }, []);
    
    return (
        <div className="flex flex-col h-screen font-sans text-gray-100">
            <Header />
            <main className="flex-grow p-4 flex flex-row gap-4">
                {/* Column 1: Input 1 and Differences 1 */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 min-h-0">
                        <DiffPanel
                            type="input"
                            title="Input 1"
                            text={text1}
                            onTextChange={setText1}
                            panelRef={input1Ref}
                            onPanelScroll={handleScroll(input1Ref)}
                        />
                    </div>
                    <div className="flex-1 min-h-0">
                        <DiffPanel
                            type="output"
                            title="Differences 1"
                            diffResult={diff1}
                            panelRef={output1Ref}
                            onPanelScroll={handleScroll(output1Ref)}
                        />
                    </div>
                </div>
                {/* Column 2: Input 2 and Differences 2 */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 min-h-0">
                        <DiffPanel
                            type="input"
                            title="Input 2"
                            text={text2}
                            onTextChange={setText2}
                            panelRef={input2Ref}
                            onPanelScroll={handleScroll(input2Ref)}
                        />
                    </div>
                    <div className="flex-1 min-h-0">
                        <DiffPanel
                            type="output"
                            title="Differences 2"
                            diffResult={diff2}
                            panelRef={output2Ref}
                            onPanelScroll={handleScroll(output2Ref)}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
