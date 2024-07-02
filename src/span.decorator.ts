import * as Sentry from '@sentry/nestjs';

export function GetSpanAsync(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      await Sentry.startSpan(
        {
          name: propertyKey,
        },
        async () => {
          try {
            return await originalMethod.apply(this, args);
          } catch (e) {
            Sentry.captureException(e);
          }
        },
      );
    };
    return descriptor;
  };
}
