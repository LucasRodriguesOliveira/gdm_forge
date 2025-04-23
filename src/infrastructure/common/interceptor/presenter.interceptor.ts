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

interface IPresenterOptions {
  paginated: boolean;
}

@Injectable()
export class PresenterInterceptor<T> implements NestInterceptor {
  constructor(
    private readonly presenterCls: ClassConstructor<T>,
    private readonly presenterKey: IPresenterResultKey,
    private readonly presenterOptions: IPresenterOptions = {
      paginated: false,
    },
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

        if (this?.presenterOptions.paginated) {
          return {
            value: {
              [this.presenterKey?.array]: plainToInstance(
                this.presenterCls,
                data.value[`${this.presenterKey.entity}s`],
              ),
              total: data.value['total'],
              page: data.value['page'],
              pageSize: data.value['pageSize'],
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
