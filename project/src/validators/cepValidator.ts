import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsValidCep implements ValidatorConstraintInterface {
    async validate(cep: string, args: ValidationArguments) {
        try {
            const response = await axios.get(
                `http://viacep.com.br/ws/${cep}/json/`
            );
            return response.data && !response.data.erro;
        } catch (error) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'O CEP informado é inválido.';
    }
}
