import { ILoggerService } from 'src/domain/logger/logger.interface';
import { Contact } from 'src/domain/model/contact.model';
import {
  IContactRepository,
  QueryContactOptions,
} from 'src/domain/repository/contact-repository.interface';
import { ErrorCode } from 'src/domain/types/error-code.enum';
import { ErrorResponse } from 'src/domain/types/error.interface';
import { Result } from 'src/domain/types/result';

export class ListContactUseCase {
  constructor(
    private readonly contactRepository: IContactRepository,
    private readonly logger: ILoggerService,
  ) {}

  public async run(
    query: QueryContactOptions,
  ): Promise<Result<Contact[], ErrorResponse>> {
    try {
      const contacts = await this.contactRepository.findAll(query);

      return {
        value: contacts,
      };
    } catch (err) {
      this.logger.error(
        ListContactUseCase.name,
        `Failed to list contacts\nParams: ${JSON.stringify({ query })}`,
        err,
      );

      // unmapped error, for now, i shall log in hope a error occurs, so I can make some notes
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
