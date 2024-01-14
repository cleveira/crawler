import * as cheerio from "cheerio";
import { prisma } from "../lib/prisma";
import { constants, convertDate, replaceValor } from "./constants";

const Categoria = {
  Materiais: 1,
  Servicos: 2,
};

export async function detalhesPlanoComprasAnual({
  pcaId,
  url,
}: {
  pcaId: string;
  url: string;
}): Promise<void> {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const idPCA = $("#IdPCA").val() as string;

    const resumoTable = $('span:contains("Resumo do Plano")')
      .parent()
      .find("table");

    resumoTable.find("tbody tr").each(async (_index, rowElement) => {
      const row: string[] = [];
      $(rowElement)
        .find("td")
        .each((_i, cellElement) => {
          row.push($(cellElement).text().trim());
        });

      await prisma.resumoPlano.create({
        data: {
          tipo: row[0],
          itens: parseInt(row[1]),
          percentual_item: replaceValor(row[2]),
          valor_total: replaceValor(row[3]),
          percentual_valor: replaceValor(row[4]),
          pca_id: pcaId,
        },
      });
    });

    const footerRow: string[] = [];
    resumoTable.find("tfoot tr td").each((_i, cellElement) => {
      footerRow.push($(cellElement).text().trim());
    });

    await prisma.resumoPlano.create({
      data: {
        tipo: footerRow[0],
        itens: parseInt(footerRow[1]),
        percentual_item: replaceValor(footerRow[2]),
        valor_total: replaceValor(footerRow[3]),
        percentual_valor: replaceValor(footerRow[4]),
        pca_id: pcaId,
      },
    });

    const numberOfPagesElement = $(
      "#itens-categoria-1 > div > div.paginacao > ul > li.next.PagedList-skipToLast"
    );

    const pagina = numberOfPagesElement.find("a").attr("href");
    const totalPaginas = parseInt(pagina ?? "1");

    await getItensCategoria({
      categoria: Categoria.Materiais,
      idPCA,
      totalPaginas,
      pcaId,
    });

    await getItensCategoria({
      categoria: Categoria.Servicos,
      idPCA,
      totalPaginas,
      pcaId,
    });

    return;
  } catch (error) {
    throw new Error(
      "Erro ao processar crawler - Detalhes Planos Compras Anual",
      {
        cause: error,
      }
    );
  }
}

async function getItensCategoria({
  pcaId,
  idPCA,
  categoria,
  totalPaginas,
}: {
  pcaId: string;
  idPCA: string;
  categoria: number;
  totalPaginas: number;
}): Promise<void> {
  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    const url = `${constants.baseUrl}/PCA/GetItensCategoria?idPCA=${idPCA}&categoria=${categoria}&pagina=${pagina}`;
    const response = await fetch(url, { method: "POST" });
    const html = await response.text();
    const $ = cheerio.load(html);

    $("table tbody tr").each(async (_index, rowElement) => {
      const columns = $(rowElement).find("td");

      const rowData = {
        UASG: columns.eq(0).text().trim(),
        ItemNumber: columns.eq(1).text().trim(),
        ItemCode: columns.eq(2).text().trim(),
        Description: columns.eq(3).text().trim(),
        Quantity: columns.eq(4).text().trim(),
        Unit: columns.eq(5).text().trim(),
        TotalValue: replaceValor(columns.eq(6).text().trim()),
        Priority: columns.eq(7).text().trim(),
        DesiredDate: columns.eq(8).text().trim(),
      };

      await prisma.detalhesPlano.create({
        data: {
          tipo: categoria === 1 ? "METERIAIS" : "SERVICOS",
          pca_id: pcaId,
          uasg: rowData.UASG,
          numero_item: parseInt(rowData.ItemNumber),
          codigo_item: rowData.ItemCode,
          descricao: rowData.Description,
          quantidade: parseInt(rowData.Quantity.replaceAll(".", "")),
          unidade: rowData.Unit,
          valor_total: rowData.TotalValue,
          prioridade: rowData.Priority,
          data_desejada: convertDate(rowData.DesiredDate),
        },
      });
    });
  }
}
