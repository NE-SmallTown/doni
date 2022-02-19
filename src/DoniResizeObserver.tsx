import React, { ReactNode, useEffect, useRef, useState } from 'react';

import './DoniResizeObserver.scss';

interface ResizeObserverProps {
    children?: ReactNode;
    onSize: ObserveCallback;
}

export interface SizeInfo {
    width: number;
    height: number;
}

type ObserveCallback = (sizeInfo: SizeInfo) => void;

const doniResizeObserver = (() => {
    const callbacksMap = new Map<Element, ObserveCallback[]>();

    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            const sizeInfo = entry.contentRect;
            const callbacks = callbacksMap.get(entry.target);

            if (callbacks) {
                callbacks.forEach(callback => callback({
                    width: sizeInfo.width,
                    height: sizeInfo.height,
                }));
            }
        }
    });

    return {
        observe: (dom: HTMLElement, callback: ObserveCallback) => {
            if (callbacksMap.get(dom)) {
                callbacksMap.set(dom, callbacksMap.get(dom)!.concat(callback));
            } else {
                callbacksMap.set(dom, [ callback ]);
            }
        },
        unobserve: (dom: HTMLElement) => {
            observer.unobserve(dom);
        },
    };
})();

// 先用一个空的 div 来获取宽度，渲染之后就改成 ResizeObserver 来获取宽度
const DoniResizeObserver = function DoniResizeObserver(props: ResizeObserverProps) {
    const { children, onSize } = props;

    const [ isFirstMeasured, setIsFirstMeasured ] = useState(false);

    const helperDIVRef = useRef<HTMLTableSectionElement>(null!);
    const initialHelperDIVRef = useRef<HTMLTableSectionElement>(null!);

    useEffect(() => {
        const { width, height } = initialHelperDIVRef.current.getBoundingClientRect();
        const info = {
            width,
            height,
        };

        onSize(info);
        setIsFirstMeasured(true);
    }, []);

    useEffect(() => {
        if (helperDIVRef.current) {
            doniResizeObserver.observe(helperDIVRef.current, sizeInfo => {
                onSize(sizeInfo);
            });
        }

        return () => {
            helperDIVRef.current && doniResizeObserver.unobserve(helperDIVRef.current);
        };
    }, [ helperDIVRef.current ]);

    if (!isFirstMeasured) {
        return (
          <div className='resize-helper-div' ref={ initialHelperDIVRef } />
        );
    }

    return (
        <>
            <div className='resize-helper-div' ref={ helperDIVRef } />

            { children && React.Children.only(children) }
        </>
    );
};

export default DoniResizeObserver;