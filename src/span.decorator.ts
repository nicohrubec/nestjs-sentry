import { Logger } from '@nestjs/common';

export function GetSpan(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        throw error;
      } finally {
        const endTime = Date.now();
        const executionTime = endTime - startTime;
        Logger.log(
          `Method ${propertyKey} execution time: ${executionTime}ms`,
          target.constructor.name,
        );
      }
    };
    return descriptor;
  };
}
