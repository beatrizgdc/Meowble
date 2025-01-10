import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ServicoDeLogger } from '../utils/logger/logger';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsValidCep implements ValidatorConstraintInterface {
    constructor(private readonly logger: ServicoDeLogger) {}

    async validate(cep: string, args: ValidationArguments) {
        // this.logger.log(`Iniciando validação do CEP: ${cep}`);

        try {
            const response = await axios.get(
                `http://viacep.com.br/ws/${cep}/json/`
            );

            if (response.data && !response.data.erro) {
                // this.logger.log(`CEP válido: ${cep}`);
                return true;
            } else {
                this.logger.warn(`CEP inválido ou não encontrado: ${cep}`);
                return false;
            }
        } catch (error) {
            // this.logger.error(`Erro ao validar o CEP: ${cep}`, error);
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        this.logger.warn(
            `Mensagem de erro padrão sendo retornada para CEP inválido: ${args.value}`
        );
        return 'O CEP informado é inválido.';
    }
}
