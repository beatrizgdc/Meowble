import { ServicoDeLogger } from '../utils/logger/logger';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { paisesTraducoes } from '../utils/paisesTraducoes';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsValidCountry implements ValidatorConstraintInterface {
    constructor(private readonly logger: ServicoDeLogger) {}

    async validate(pais: string, args: ValidationArguments) {
        const paisIngles = paisesTraducoes[pais] || pais;
        try {
            const response = await axios.get(
                `https://restcountries.com/v3.1/name/${paisIngles}?fullText=true`
            );
            return response.data && !response.data.erro;
        } catch (error) {
            this.logger.error('Erro ao validar o país:', error);
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'O país informado não é válido.';
    }
}
