import * as cheerio from "cheerio";
import { prisma } from "../lib/prisma";
import { constants, replaceValor } from "./constants";
import { detalhesPlanoComprasAnual } from "./detalhes-plano-compra-anual";

export async function planosComprasAnual({
  clienteId,
  url,
}: {
  clienteId: string;
  url: string;
}): Promise<void> {
  try {
    const response = await fetch(url);
    const data = await response.text();

    const $ = cheerio.load(data);

    const tableSelector = "#result-pesquisa table";

    const dadosPca = $(tableSelector)
      .map((_, elemento) => {
        const linhas = $(elemento).find("tbody tr");

        return linhas
          .map((_, linha) => {
            const colunas = $(linha).find("td");

            const href = $(colunas[5]).find("a").attr("href");
            const link = `${constants.baseUrl}${href}`;

            return {
              ano: $(colunas[0]).text().trim(),
              status: $(colunas[1]).text().trim(),
              identificacao: $(colunas[2]).text().trim(),
              valor: $(colunas[3]).text().trim(),
              itens: $(colunas[4]).text().trim(),
              link,
            };
          })
          .get();
      })
      .get();

    if (dadosPca.length !== 0) {
      await prisma.pca.deleteMany({
        where: {
          cliente_id: clienteId,
        },
      });
    }

    await Promise.all(
      dadosPca.map(async (dados) => {
        const pca = await prisma.pca.create({
          data: {
            ano: parseInt(dados.ano),
            status: dados.status,
            identificacao: dados.identificacao,
            valor: replaceValor(dados.valor),
            itens: parseInt(dados.itens),
            link: dados.link,
            cliente_id: clienteId,
          },
        });

        await detalhesPlanoComprasAnual({ pcaId: pca.id, url: pca.link });

        return;
      })
    );

    return;
  } catch (error) {
    throw new Error("Erro ao processar crawler - Planos Compras Anual", {
      cause: error,
    });
  }
}
