import { Cron, CronExpression } from '@nestjs/schedule';
import * as Sentry from '@sentry/node';

export const SentryCron = (
  cronTime: string | CronExpression,
  monitorSlug: string,
): MethodDecorator => {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const checkInId = Sentry.captureCheckIn({
        monitorSlug,
        status: 'in_progress',
      });

      try {
        await originalMethod.apply(this, args);

        // cron job successful
        Sentry.captureCheckIn({
          checkInId,
          monitorSlug,
          status: 'ok',
        });
      } catch (error) {
        // cron job failed
        Sentry.captureCheckIn({
          checkInId,
          monitorSlug,
          status: 'error',
        });
        throw error;
      }
    };

    // apply native nest cron decorator with instrumented method
    Cron(cronTime)(target, propertyKey, descriptor);
  };
};
