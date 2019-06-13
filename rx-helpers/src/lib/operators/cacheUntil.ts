import { Observable, MonoTypeOperatorFunction, defer } from 'rxjs';
import { startWith, switchMap, shareReplay } from 'rxjs/operators';

export function cacheUntil<T>(observable: Observable<any>): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    return observable.pipe(
      startWith(0),
      switchMap(() => defer(() => source)),
      shareReplay(1),
    );
  };
}
