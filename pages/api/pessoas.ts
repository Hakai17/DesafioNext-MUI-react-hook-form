import type { NextApiRequest, NextApiResponse } from 'next';

interface Pessoa {
  id: number;
  nome: string;
}

const pessoas: Pessoa[] = [
  { id: 1, nome: 'Carlos Silva Lima' },
  { id: 2, nome: 'Carlito Ramos Junior' },
  { id: 3, nome: 'Paulo Felipe Castro' },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<readonly Pessoa[]>
) {
  const searchTerm: string = req.query.searchTerm as string || '';
  const filteredPessoas = pessoas.filter((pessoa) =>
    pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  res.status(200).json(filteredPessoas);
}
