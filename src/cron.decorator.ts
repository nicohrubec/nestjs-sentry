import { Cron, CronExpression } from '@nestjs/schedule';
import * as Sentry from '@sentry/nestjs';
import { Logger } from '@nestjs/common';

export const SentryCron = (
  cronTime: string | CronExpression,
  monitorSlug: string,
): MethodDecorator => {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const checkInId = Sentry.captureCheckIn(
        {
          monitorSlug,
          status: 'in_progress',
        },
        {
          schedule: {
            type: 'crontab',
            value: cronTime,
          },
          checkinMargin: 1,
          maxRuntime: 1,
          timezone: 'America/Los_Angeles',
        },
      );

      try {
        await originalMethod.apply(this, args);

        // cron job successful
        Logger.log('Cron job was successful, sending to Sentry!');
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
