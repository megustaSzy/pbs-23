-- CreateTable
CREATE TABLE "Barang" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "harga" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL,
    "deskripsi" VARCHAR(50) NOT NULL,

    CONSTRAINT "Barang_pkey" PRIMARY KEY ("id")
);
