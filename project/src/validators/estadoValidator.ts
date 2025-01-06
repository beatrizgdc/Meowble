import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

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

    validate(value: string, args: ValidationArguments): boolean {
        const isValid = this.states.includes(value);
        return isValid;
    }

    defaultMessage(args: ValidationArguments): string {
        return 'O estado informado é inválido.';
    }
}
