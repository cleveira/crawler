-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('METERIAIS', 'SERVICOS');

-- CreateTable
CREATE TABLE "clientes" (
    "id" VARCHAR(50) NOT NULL,
    "cnpj" VARCHAR(20) NOT NULL,
    "razao_social" VARCHAR(250) NOT NULL,
    "qtde_pca" INTEGER NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pcas" (
    "id" VARCHAR(50) NOT NULL,
    "ano" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "identificacao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "itens" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "cliente_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "pcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumoplanos" (
    "id" VARCHAR(50) NOT NULL,
    "tipo" TEXT NOT NULL,
    "itens" INTEGER NOT NULL,
    "percentual_item" DOUBLE PRECISION NOT NULL,
    "valor_total" DOUBLE PRECISION NOT NULL,
    "percentual_valor" DOUBLE PRECISION NOT NULL,
    "pca_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "resumoplanos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalhesplanos" (
    "id" VARCHAR(50) NOT NULL,
    "tipo" "Tipo" NOT NULL,
    "uasg" TEXT,
    "numero_item" INTEGER NOT NULL,
    "codigo_item" TEXT,
    "descricao" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "unidade" TEXT NOT NULL,
    "valor_total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prioridade" TEXT NOT NULL,
    "data_desejada" DATE NOT NULL,
    "pca_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "detalhesplanos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cnpj_key" ON "clientes"("cnpj");

-- AddForeignKey
ALTER TABLE "pcas" ADD CONSTRAINT "pcas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumoplanos" ADD CONSTRAINT "resumoplanos_pca_id_fkey" FOREIGN KEY ("pca_id") REFERENCES "pcas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalhesplanos" ADD CONSTRAINT "detalhesplanos_pca_id_fkey" FOREIGN KEY ("pca_id") REFERENCES "pcas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
