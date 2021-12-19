import React, { useEffect, useRef, useState } from 'react';
import { map, Observable, share, shareReplay, Subscription, timer } from 'rxjs';

class MockAPIService {

    private static call$: Observable<string>;

    public static fetchAPIData() {
        if (!MockAPIService.call$) {
            MockAPIService.call$ = new Observable<string>((observer) => {
                console.log('Observer called')
                setTimeout(() => {
                    observer.next('MOCK DATA');
                    observer.complete();
                }, 5000)

                return (() => {
                    observer.complete();
                })
            }).pipe(shareReplay());
        }

        return MockAPIService.call$;
    }
}

const ShareComponent: React.FC = () => {

    // const stream1 = timer(1000, 1000).pipe(map((x) => `A${x}`));

    const [data, setData] = useState<string>('');

    const sub = useRef(new Subscription());

    const fetchData = () => {
        // sub.current = stream1.subscribe({
        //     next: (x) => {
        //         setData((s) => [...s, x]);
        //     },
        //     error: console.log
        // })
    }

    const makeCall = () => {
        MockAPIService.fetchAPIData()
            .subscribe({
                next: (v) => {
                    setData(v);
                    console.log('Call 1 : ', v);
                },
                error: console.log
            })
    }

    const makeCall2 = () => {
        MockAPIService.fetchAPIData()
            .subscribe({
                next: (v) => {
                    setData(v);
                    console.log('Call 2 : ', v);
                },
                error: console.log
            })
    }

    useEffect(() => {
        fetchData();
        return (() => {
            sub.current.unsubscribe();
        })
    }, [])

    return (
        <div>
            <h4>Share</h4>

            <div>
                <div>JSON DATA: {data}</div>
                <button onClick={makeCall}>Call data</button>
                <button onClick={makeCall2}>Call data 2</button>
            </div>
        </div>
    )
}


export default ShareComponent;