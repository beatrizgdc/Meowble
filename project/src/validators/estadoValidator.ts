import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ async: false }) // Você pode alterar para true se houver validação assíncrona
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
        console.log(`Validating state: ${value}`); // Log para depuração
        const isValid = this.states.includes(value);
        console.log(`Is valid: ${isValid}`); // Log para depuração
        return isValid;
    }

    defaultMessage(args: ValidationArguments): string {
        return 'O estado informado é inválido.'; // Mensagem de erro padrão
    }
}
