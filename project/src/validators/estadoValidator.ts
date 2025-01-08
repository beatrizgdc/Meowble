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
        this.logger.log(`Iniciando validação para o estado: ${value}`);

        const isValid = this.states.includes(value);

        if (isValid) {
            // this.logger.log(
            //     `Validação bem-sucedida: o estado "${value}" é válido.`
            // );
        } else {
            this.logger.warn(
                `Validação falhou: o estado "${value}" é inválido.`
            );
        }

        return isValid;
    }

    defaultMessage(args: ValidationArguments): string {
        const message = 'O estado informado é inválido.';
        this.logger.warn(`Mensagem de erro retornada: ${message}`);
        return message;
    }
}
