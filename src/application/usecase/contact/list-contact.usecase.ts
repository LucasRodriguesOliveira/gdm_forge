import { ILoggerService } from 'src/domain/logger/logger.interface';
import {
  IContactRepository,
  QueryContactOptions,
} from 'src/domain/repository/contact-repository.interface';
import { ErrorResponse } from 'src/domain/types/error.interface';
import { Result } from 'src/domain/types/result';
import { PaginatedContact } from '../../../domain/repository/paginated-contact.result';
import { ErrorCode } from '../../../domain/types/error-code.enum';

export class ListContactUseCase {
  constructor(
    private readonly contactRepository: IContactRepository,
    private readonly logger: ILoggerService,
  ) {}

  public async run(
    query: QueryContactOptions,
  ): Promise<Result<PaginatedContact, ErrorResponse>> {
    try {
      const result = await this.contactRepository.findAll(query);

      return {
        value: result,
      };
    } catch (err) {
      this.logger.error(
        ListContactUseCase.name,
        `Failed to list contacts\nParams: ${JSON.stringify({ query })}`,
        err,
      );

      // unmapped error, for now, i shall log in hope a error occurs, so I can take some notes
      const b64Code = btoa(ListContactUseCase.name);

      return {
        error: {
          code: ErrorCode.UNEXPECTED,
          message: `gdm_forge:[${b64Code}]`,
        },
      };
    }
  }
}
