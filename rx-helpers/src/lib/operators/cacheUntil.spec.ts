import { Observable, Subject } from 'rxjs';
import { cacheUntil } from './cacheUntil';
import { first } from 'rxjs/operators';

const currentTime = new Observable<Date>((observer) => {
  observer.next(new Date());
  observer.complete();
  return {
    unsubscribe: () => { },
  };
});

describe('cacheUntil', () => {

  it('caches date for current time without emitting on subject', () => {
    const s$ = new Subject();
    const obs = currentTime.pipe(cacheUntil(s$));
    let d: Date | null = null;
    obs.pipe(first()).subscribe((v) => {
      d = v;
    });

    s$.complete();

    expect(d).toBeTruthy();
  });

  it('completes only when subject completes', () => {
    const s$ = new Subject();
    const obs = currentTime.pipe(cacheUntil(s$));
    let d: Date | null = null;
    let complete = false;
    const sub = obs.subscribe((v) => {
      d = v;
    }, () => { }, () => complete = true);


    expect(complete).toBeFalsy();
    s$.complete();
    expect(complete).toBeTruthy();
    sub.unsubscribe();
  });

  it('picks new value when subject emits', () => {
    const s$ = new Subject<number>();
    const obs = currentTime.pipe(cacheUntil(s$));
    let d: Date | null = null;
    const sub = obs.subscribe((v) => {
      d = v;
    });

    const d1 = d;
    s$.next(0);
    const d2 = d;
    expect(d1).toBeTruthy();
    expect(d2).toBeTruthy();
    expect(d1 === d2).toBe(false);

    s$.complete();
    sub.unsubscribe();
  });

  it('caches values', () => {
    const s$ = new Subject<number>();
    const obs = currentTime.pipe(cacheUntil(s$));
    let d1: Date | null = null;
    const sub1 = obs.subscribe((v) => {
      d1 = v;
    });

    let d2: Date | null = null;
    const sub2 = obs.subscribe((v) => {
      d2 = v;
    });

    expect(d1).toBeTruthy();
    expect(d2).toBeTruthy();
    expect(d1 === d2).toBe(true);

    sub1.unsubscribe();
    sub2.unsubscribe();
    s$.complete();
  });
});
