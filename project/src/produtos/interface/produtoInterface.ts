export interface ProdutoDocument extends Document, Produto {}

export interface Produto {
    id: number;
    nomeProduto: string;
    descricaoProduto: string;
    precoProduto: number;
    createdAt: Date;
}
