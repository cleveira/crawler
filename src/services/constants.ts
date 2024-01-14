export const constants = {
  baseUrl: "https://www.bpsaude.com.br",
  querySearch: "/Transparencia/Home/PesquisaOrgao?termoPesquisado=",
  searchInput: "cliente de teste",
};

export const replaceValor = (valor: string): number => {
  const valorStr = valor
    .replace("R$", "")
    .replaceAll(" ", "")
    .replaceAll(".", "")
    .replaceAll(",", ".");
  return parseFloat(valorStr);
};

export const convertDate = (date: string): Date => {
  const [day, month, year] = date.split("/");
  return new Date(`${year}-${month}-${day}`);
};
