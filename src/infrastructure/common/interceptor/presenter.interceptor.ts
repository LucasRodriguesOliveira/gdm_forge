import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { ErrorResponse } from 'src/domain/types/error.interface';
import { Result } from 'src/domain/types/result';

interface IPresenterResultKey {
  entity: string;
  array?: string;
}

@Injectable()
export class PresenterInterceptor<T> implements NestInterceptor {
  constructor(
    private readonly presenterCls: ClassConstructor<T>,
    private readonly presenterKey: IPresenterResultKey,
  ) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<Result<T | T[], ErrorResponse>>,
  ): Observable<
    Result<Record<string, T> | Record<string, T[]>, ErrorResponse>
  > {
    return next.handle().pipe(
      map((data) => {
        if (data?.error) {
          return {
            error: data.error,
          };
        }

        if (Array.isArray(data.value)) {
          const key =
            this.presenterKey?.array ?? `${this.presenterKey.entity}s`;

          return {
            value: {
              [key]: plainToInstance(this.presenterCls, data.value),
            },
          };
        }

        return {
          value: {
            [this.presenterKey.entity]: plainToInstance(
              this.presenterCls,
              data.value,
            ),
          },
        };
      }),
    );
  }
}
