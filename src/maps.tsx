import React, { useEffect, useRef, useState } from 'react';
import { concat, concatMap, delay, map, merge, mergeMap, Observable, Subscription, switchMap, take, timer } from 'rxjs';

const MapsComponent: React.FC = () => {
    const firstStream = timer(1000, 2000).pipe(map((x) => `A${x}`), take(3));
    const secondStream = timer(1000, 2000).pipe(delay(1000), map((x) => `B${x}`), take(3));

    const [firstData, setFirstData] = useState<string[]>([]);
    const [secondData, setSecondData] = useState<string[]>([]);
    const [concatData, setConcatData] = useState<string[]>([]);
    const [mergeData, setMergeData] = useState<string[]>([]);
    const [manualConcatMap, setManualConcatMap] = useState<string[]>([]);
    const [manualMergeMap, setManualMergeMap] = useState<string[]>([]);
    const [concatMapData, setConcatMapData] = useState<string[]>([]);
    const [mergeMapData, setMergeMapData] = useState<string[]>([]);
    const [switchMapData, setSwitchMapData] = useState<string[]>([]);

    const sub1 = useRef(new Subscription());
    const sub2 = useRef(new Subscription());
    const concatSub = useRef(new Subscription());
    const mergeSub = useRef(new Subscription());
    const manualConcatMapSub = useRef(new Subscription());
    const concatMapSub = useRef(new Subscription());
    const manualMergeMapSub = useRef(new Subscription());
    const mergeMapSub = useRef(new Subscription());
    const switchMapSub = useRef(new Subscription());


    const getSecondByFirst = (data: string): Observable<string> => {
        return secondStream.pipe(map((v) => `${data}-${v}`))
    }

    const startConcat = () => {
        const call$ = concat(firstStream, secondStream);
        concatSub.current = call$.subscribe({
            next: (v) => setConcatData((s) => [...s, v]),
            error: console.log
        })
    }

    const startMerge = () => {
        const call$ = merge(firstStream, secondStream);
        mergeSub.current = call$.subscribe({
            next: (v) => setMergeData((s) => [...s, v]),
            error: console.log
        })
    }

    const startManualConcatMap = () => {
        let resultFirst: string[] = [];
        manualConcatMapSub.current = firstStream.subscribe({
            next: (v) => {
                resultFirst.push(v);
            },
            complete: () => {
                const secondCall$ = concat(...resultFirst.map(getSecondByFirst));
                manualConcatMapSub.current = secondCall$.subscribe({
                    next: (v) => setManualConcatMap((s) => [...s, v]),
                    error: console.log
                })
            }
        })
    }

    const startConcatMap = () => {
        const call$ = firstStream.pipe(concatMap(getSecondByFirst));
        concatMapSub.current = call$.subscribe({
            next: (v) => setConcatMapData((s) => [...s, v]),
            error: console.log
        })
    }

    const startMergeMap = () => {
        const call$ = firstStream.pipe(mergeMap(getSecondByFirst));
        mergeMapSub.current = call$.subscribe({
            next: (v) => setMergeMapData((s) => [...s, v]),
            error: console.log
        })
    }

    const startSwitchMap = () => {
        const call$ = firstStream.pipe(switchMap(getSecondByFirst));
        switchMapSub.current = call$.subscribe({
            next: (v) => setSwitchMapData((s) => [...s, v]),
            error: console.log
        })
    }

    const startAction = () => {
        sub1.current = firstStream
            .subscribe({
                next: (v) => setFirstData((s) => [...s, v]),
                error: console.log
            })

        sub2.current = secondStream
            .subscribe({
                next: (v) => setSecondData((s) => [...s, v]),
                error: console.log
            })
        startConcat();
        startMerge();
        startManualConcatMap();
        startConcatMap();
        startMergeMap();
        startSwitchMap();
    }

    const clearAction = () => {
        setFirstData([]);
        setSecondData([]);
        setConcatData([]);
        setMergeData([]);
        setManualConcatMap([]);
        setConcatMapData([]);
        setManualMergeMap([]);
        setMergeMapData([]);
        setSwitchMapData([]);
    }

    const stopAction = () => {
        sub1.current.unsubscribe();
        sub2.current.unsubscribe();
        concatSub.current.unsubscribe();
        mergeSub.current.unsubscribe();
        manualMergeMapSub.current.unsubscribe();
        manualConcatMapSub.current.unsubscribe();
        concatMapSub.current.unsubscribe();
        mergeMapSub.current.unsubscribe();
        switchMapSub.current.unsubscribe();
    }

    useEffect(() => {

        return () => {
            stopAction();
        }
    }, [])

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>First Call&nbsp;</h3>
                <h4 style={{ color: 'green' }}>
                    {
                        firstData.map((v) => `${v} : `)
                    }
                </h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Second call&nbsp;</h3>
                <h4 style={{ color: 'skyblue' }}>
                    {
                        secondData.map((v) => `${v} : `)
                    }
                </h4>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Concat Data&nbsp;</h3>
                <h4 style={{ color: 'red' }}>
                    {
                        concatData.map((v) => `${v} : `)
                    }
                </h4>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Merge Data&nbsp;</h3>
                <h4 style={{ color: 'brown' }}>
                    {
                        mergeData.map((v) => `${v} : `)
                    }
                </h4>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Manual Concat Map&nbsp;</h3>
                <h4 style={{ color: 'purple' }}>
                    {
                        manualConcatMap.map((v) => `${v} : `)
                    }
                </h4>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Concat Map&nbsp;</h3>
                <h4 style={{ color: 'pink' }}>
                    {
                        concatMapData.map((v) => `${v} : `)
                    }
                </h4>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Merge Map&nbsp;</h3>
                <h4 style={{ color: 'teal' }}>
                    {
                        mergeMapData.map((v) => `${v} : `)
                    }
                </h4>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Switch Map&nbsp;</h3>
                <h4 style={{ color: 'orange' }}>
                    {
                        switchMapData.map((v) => `${v} : `)
                    }
                </h4>
            </div>
            <div>
                <button onClick={startAction}>Start</button>
                <button onClick={stopAction}>Stop</button>
                <button onClick={clearAction}>Clear</button>
            </div>
        </div>
    )
}

export default MapsComponent;