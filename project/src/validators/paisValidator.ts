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
        // this.logger.log(
        //     `Iniciando validação do país: ${pais} (convertido para inglês: ${paisIngles}).`
        // );

        try {
            const response = await axios.get(
                `https://restcountries.com/v3.1/name/${paisIngles}?fullText=true`
            );

            if (response.data && !response.data.erro) {
                // this.logger.log(
                //     `Validação bem-sucedida para o país: ${pais} (inglês: ${paisIngles}).`
                // );
                return true;
            } else {
                // this.logger.warn(
                //     `A API retornou uma resposta inválida para o país: ${paisIngles}.`
                // );
                return false;
            }
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(
                    `Erro ao validar o país ${paisIngles}: ${error.message}`,
                    error.stack
                );
            } else {
                this.logger.error(
                    `Erro desconhecido ao validar o país ${paisIngles}.`,
                    String(error)
                );
            }
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        const mensagem = 'O país informado não é válido.';
        this.logger.warn(mensagem);
        return mensagem;
    }
}
