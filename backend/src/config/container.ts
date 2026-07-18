import 'reflect-metadata';
import { container, InjectionToken } from 'tsyringe';

// This container acts as the composition root for infrastructure-only dependencies.
// The design follows the Dependency Inversion Principle because higher-level modules depend on abstractions rather than concrete implementations.
// Future services and repositories can be registered here without changing business modules.

export const DI_TOKENS = {
  Logger: Symbol('Logger'),
  Env: Symbol('Env'),
} as const;

container.register(DI_TOKENS.Logger, {
  useValue: console,
});

export const appContainer = container;

export const resolveDependency = <T>(token: InjectionToken<T>) => appContainer.resolve(token);
