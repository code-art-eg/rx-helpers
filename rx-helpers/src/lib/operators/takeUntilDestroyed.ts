import { OnDestroy } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const DESTROY_SUBJECT_SYMBOL = Symbol();
const DECORATOR_APPLIED_SYMBOL = Symbol();

interface InstanceWithTakeUntilDestroy extends OnDestroy {
  [DESTROY_SUBJECT_SYMBOL]?: Subject<number>;
}

interface FunctionWithDecorator extends Function {
  [DECORATOR_APPLIED_SYMBOL]?: boolean;
}

interface ComponentDefinition {
  onDestroy: (() => void) | null;
}

interface ComponentType extends FunctionWithDecorator {
  ɵcmp: ComponentDefinition;
}

type DirectiveDefinition = ComponentDefinition;
type PipeDefinition = ComponentDefinition;

interface ComponentType extends FunctionWithDecorator {
  ɵcmp: ComponentDefinition;
}

interface DirectiveType extends FunctionWithDecorator {
  ɵdir: DirectiveDefinition;
}

interface ProviderType extends FunctionWithDecorator {
  ɵprov: any;
}

interface PipeType extends FunctionWithDecorator {
  ɵpipe: DirectiveDefinition;
}

function isComponentType(type: FunctionWithDecorator): type is ComponentType {
  return type && !!(type as ComponentType).ɵcmp;
}

function isDirectiveType(type: FunctionWithDecorator): type is DirectiveType {
  return type && !!(type as DirectiveType).ɵdir;
}

function isPipeType(type: FunctionWithDecorator): type is PipeType {
  return type && !!(type as PipeType).ɵpipe;
}

function isProviderType(type: FunctionWithDecorator): type is ProviderType {
  return type && !!(type as ProviderType).ɵprov;
}

type HookableDefinition = (ComponentDefinition | DirectiveDefinition | PipeDefinition);

function doOnDestroy(this: InstanceWithTakeUntilDestroy) {
  const subject = this[DESTROY_SUBJECT_SYMBOL];
  if (subject) {
    subject.next(0);
    subject.complete();
    this[DESTROY_SUBJECT_SYMBOL] = undefined;
  }
}

function applyOnDestroyHook(def: HookableDefinition, handler: (this: InstanceWithTakeUntilDestroy) => void) {
  const oldOnDestroy = def.onDestroy;
  def.onDestroy = function(this: InstanceWithTakeUntilDestroy): void {
    if (oldOnDestroy) {
      oldOnDestroy.apply(this);
    }
    handler.apply(this);
  };
}

function applyOnDestroyToProvider(def: FunctionWithDecorator, handler: (this: InstanceWithTakeUntilDestroy) => void) {
  const oldOnDestroy = def.prototype.ngOnDestroy;
  def.prototype.ngOnDestroy = function(this: InstanceWithTakeUntilDestroy, ...args: []): void {
    if (oldOnDestroy) {
      oldOnDestroy.apply(this, args);
    }
    handler.apply(this);
  };
}

function applyOnDestroyToInstance(instance: InstanceWithTakeUntilDestroy): void {
  if (!instance[DESTROY_SUBJECT_SYMBOL]) {
    instance[DESTROY_SUBJECT_SYMBOL] = new Subject<number>();
    const constructor = instance.constructor as FunctionWithDecorator;
    if (typeof constructor === 'function') {
      if (constructor[DECORATOR_APPLIED_SYMBOL]) {
        return;
      }
      if (isPipeType(constructor)
        || isComponentType(constructor)
        || isDirectiveType(constructor)
        || isProviderType(constructor)) {
        throw new Error(`To use ${
            takeUntilDestroyed.name
          } with Components, Pipes, Directives and Services add the @${
          TakeUntilDestroyed.name
          }.`
        );
      }
    }

    if (typeof instance.ngOnDestroy !== 'function') {
      throw new Error(`${
          takeUntilDestroyed.name
        } can only be applied to Components, Pipes, Directives and Services with @Injectable decorator or `
        + ` to object instance implementing OnDestroy interface.`
      );
    }
    const oldOnDestroy = instance.ngOnDestroy;
    instance.ngOnDestroy = function(this: InstanceWithTakeUntilDestroy, ...args) {
      oldOnDestroy.apply(instance, args);
      doOnDestroy.apply(this);
    };
  }
}

function applyOnDestroyToClass(target: FunctionWithDecorator): void {
  if (isComponentType(target)) {
    applyOnDestroyToProvider(target, doOnDestroy);
  } else if (isDirectiveType(target)) {
    applyOnDestroyToProvider(target, doOnDestroy);
  } else if (isPipeType(target)) {
    applyOnDestroyHook(target.ɵpipe, doOnDestroy);
  } else {
    applyOnDestroyToProvider(target, doOnDestroy);
  }
  target[DECORATOR_APPLIED_SYMBOL] = true;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function TakeUntilDestroyed(): ClassDecorator {
  return applyOnDestroyToClass;
}

export function takeUntilDestroyed<T>(instance: any): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    const c = instance as InstanceWithTakeUntilDestroy;
    // const c = (component as any) as ComponentWithTakeUntilDestroy;
    applyOnDestroyToInstance(c);
    return source.pipe(takeUntil(c[DESTROY_SUBJECT_SYMBOL] as Subject<number>));
  };
}
