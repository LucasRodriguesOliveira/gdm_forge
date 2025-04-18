import { ILoggerService } from 'src/domain/logger/logger.interface';
import { Contact } from 'src/domain/model/contact.model';
import { IContactRepository } from 'src/domain/repository/contact-repository.interface';
import { ErrorResponse } from 'src/domain/types/error.interface';
import { Result } from 'src/domain/types/result';
import { ErrorCode } from '../../../domain/types/error-code.enum';

export class CreateContactUseCase {
  constructor(
    private readonly contactRepository: IContactRepository,
    private readonly logger: ILoggerService,
  ) {}

  public async run(
    contactData: Partial<Contact>,
  ): Promise<Result<Contact, ErrorResponse>> {
    try {
      const contactCreated = await this.contactRepository.insert(contactData);

      return {
        value: contactCreated,
      };
    } catch (err) {
      this.logger.error(
        CreateContactUseCase.name,
        `Failed to create contact\nParams: ${JSON.stringify(contactData)}`,
        err,
      );

      // unmapped error, for now, i shall log in hope a error occurs, so I can make some notes
      const b64Code = btoa(CreateContactUseCase.name);

      return {
        error: {
          code: ErrorCode.UNEXPECTED,
          message: `gdm_forge:[${b64Code}]`,
        },
      };
    }
  }
}
