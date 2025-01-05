import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ServicoDeLogger } from '../utils/logger/logger';

@Injectable()
@ValidatorConstraint({ async: false })
export class IsValidState implements ValidatorConstraintInterface {
    private readonly states = [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO',
    ];

    constructor(private readonly logger: ServicoDeLogger) {}

    validate(value: string, args: ValidationArguments): boolean {
        this.logger.log(`Validating state: ${value}`);
        const isValid = this.states.includes(value);
        this.logger.log(`Is valid: ${isValid}`);
        return isValid;
    }

    defaultMessage(args: ValidationArguments): string {
        return 'O estado informado é inválido.';
    }
}
