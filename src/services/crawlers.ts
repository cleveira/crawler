import * as cheerio from "cheerio";
import { prisma } from "../lib/prisma";
import { planosComprasAnual } from "./planos-compras-anual";
import { constants } from "./constants";

export async function loadWebPage(): Promise<void> {
  const url = `${constants.baseUrl}${constants.querySearch}${constants.searchInput}`;
  const response = await fetch(url, { method: "POST" });
  const data = await response.json();
  const listaClientes = data.Html;

  const $ = cheerio.load(listaClientes);

  $("table").each(async (_, elemento) => {
    try {
      const clienteEletemento = $(elemento);
      const cnpj = clienteEletemento.find("td").eq(0).text().trim();
      const nome = clienteEletemento.find("td").eq(1).text().trim();
      const pca = clienteEletemento.find("td").eq(2);
      const qtde = pca.text().trim();
      const href = pca.find("a").attr("href");
      const link = `${constants.baseUrl}${href}`;

      const clienteExists = await prisma.cliente.findFirst({
        where: { cnpj },
      });

      let clienteId = clienteExists?.id ?? "";

      if (!clienteExists) {
        const clienteCreate = await prisma.cliente.create({
          data: {
            cnpj: cnpj,
            razao_social: nome,
            qtde_pca: parseInt(qtde, 0),
            link,
          },
        });
        clienteId = clienteCreate.id;
      }

      return await planosComprasAnual({
        clienteId,
        url: link,
      });
    } catch (error) {
      throw new Error("Erro ao processar crawler", { cause: error });
    }
  });
}
