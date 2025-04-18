import { ILoggerService } from 'src/domain/logger/logger.interface';
import { Contact } from 'src/domain/model/contact.model';
import { IContactRepository } from 'src/domain/repository/contact-repository.interface';
import { ErrorCode } from 'src/domain/types/error-code.enum';
import { ErrorResponse } from 'src/domain/types/error.interface';
import { Result } from 'src/domain/types/result';

export class FindContactByIdUseCase {
  constructor(
    private readonly contactRepository: IContactRepository,
    private readonly logger: ILoggerService,
  ) {}

  public async run(contactId: number): Promise<Result<Contact, ErrorResponse>> {
    try {
      const contact = await this.contactRepository.findById(contactId);

      return {
        value: contact,
      };
    } catch (err) {
      this.logger.error(
        FindContactByIdUseCase.name,
        `Failed to find contact\nParams: ${JSON.stringify({ contactId })}`,
        err,
      );

      // unmapped error, for now, i shall log in hope a error occurs, so I can make some notes
      const b64Code = btoa(FindContactByIdUseCase.name);

      return {
        error: {
          code: ErrorCode.UNEXPECTED,
          message: `gdm_forge:[${b64Code}]`,
        },
      };
    }
  }
}
