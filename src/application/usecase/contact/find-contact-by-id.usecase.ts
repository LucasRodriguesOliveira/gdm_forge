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

  public async run(
    contactId: Contact['_id'],
    userId: string,
  ): Promise<Result<Contact, ErrorResponse>> {
    try {
      const contact = await this.contactRepository.findById(contactId, userId);

      return {
        value: contact,
      };
    } catch (err) {
      this.logger.error(
        FindContactByIdUseCase.name,
        `Failed to find contact\nParams: ${JSON.stringify({ contactId })}`,
        err,
      );
      const b64Code = btoa(FindContactByIdUseCase.name);

      return {
        error: {
          code: ErrorCode.NOT_FOUND,
          message: `gdm_forge:[${b64Code}]`,
        },
      };
    }
  }
}
