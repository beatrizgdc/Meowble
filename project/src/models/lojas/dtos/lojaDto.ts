import { IsString, IsBoolean, IsNumber, IsNotEmpty, Matches, IsIn } from 'class-validator';

export class CreateLojaDto {
  @IsNotEmpty({ message: 'O nome da loja é um campo obrigatório.' })
  @IsString({ message: 'O nome da loja deve ser uma string.' })
  lojaNome!: string;

  @IsNotEmpty({ message: 'O tipo da loja é um campo  obrigatório.' })
  @IsString({ message: 'O tipo da esta inválido.' })
  @IsIn(['LOJA', 'PDV'], { message: 'O tipo da loja deve ser "LOJA" ou "PDV".' })
  lojaTipo!: string;

  @IsNotEmpty({ message: 'O campo de disponibilidade de estoque deve estar preenchido' })
  @IsBoolean({ message: 'O campo disponível no estoque deve ser preenchido com "true" ou "false".' })
  disponivelNoEstoque!: boolean;

  @IsNotEmpty({ message: 'O Tempo de preparo é um campo obrigatório.' })
  @IsNumber({}, { message: 'O tempo de preparo deve ser um número (dias).' })
  tempoDePreparo!: number;

  @IsNotEmpty({ message: 'A latitude da loja é um campo obrigatório.' })
  @IsString({ message: 'A latitude deve ser uma coordenada válida entre -90 e 90.' })
  @Matches(/^(\+|-)?(?:90(?:\.0+)?|\d(?:\.\d+)?|\d{1,2}(?:\.\d+)?|(?:0?\d{1,2}|1[0-7]\d)(?:\.\d+))$/, { message: 'A latitude deve ser uma coordenada válida entre -90 e 90.' })
  latitude!: string;

  @IsNotEmpty({ message: 'A longitude da loja é um campo obrigatório.' })
  @IsString({ message: 'A latitude deve ser uma coordenada válida entre -90 e 90.' })
  @Matches(/^(\+|-)?(?:180(?:\.0+)?|\d(?:\.\d+)?|\d{1,2}(?:\.\d+)?|(?:0?\d{1,2}|1[0-7]\d)(?:\.\d+))$/, { message: 'A longitude deve ser uma coordenada válida entre -180 e 180.' })
  longitude!: string;

  @IsNotEmpty({ message: 'O código postal da loja é um campo obrigatório.' })
  @IsString({ message: 'O código postal deve estar no formato 99999-999.' })
  @Matches(/^[0-9]{5}-[0-9]{3}$/, { message: 'O código postal deve estar no formato 99999-999.' })
  codigoPostal!: string;

  @IsNumber({}, { message: 'O número deve ser um número.' })
  numero?: number;

  @IsNotEmpty({ message: 'O país da loja é um campo obrigatório.' })
  @IsString({ message: 'O país deve ser uma string.' })
  pais!: string;

  @IsString({ message: 'O telefone da loja deve ser uma string.' })
  lojaTelefone?: string;
}
