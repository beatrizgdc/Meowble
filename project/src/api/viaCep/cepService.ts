import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CepService {
  constructor(private readonly httpService: HttpService) {}

  async validarCep(cep: string): Promise<boolean> {
    try {
      const response: AxiosResponse<any> = await lastValueFrom(this.httpService.get(`http://viacep.com.br/ws/${cep}/json/`));

      if (!response || response.data.erro) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao validar o CEP:', error);
      return false;
    }
  }
}
