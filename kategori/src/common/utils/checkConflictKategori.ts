import { ConflictException, HttpStatus } from '@nestjs/common';
import { CreateKategoriDto } from '../../kategori/dto/create-kategori.dto';
import { PrismaService } from '../../prisma.service';

// fungsi check conflict kategori
export const checkDuplikasiConflict = async (
  prisma: PrismaService['kategori'],
  id: number,
  message: string,
  nama: string,
) => {
  const nama_filter = nama.replace(/\s/g, '').toLowerCase().trim();

  // [PERBAIKAN 2]: Ambil semua data, lalu hilangkan spasi pada data database
  // untuk dicocokkan dengan nama_filter inputan user
  const exist = await prisma.findFirst({
    where: {
      NOT: {
        id,
      },
      nama_filter: nama_filter,
    },
  });

  // Jika nama kategori sudah ada
  if (exist) {
    throw new ConflictException({
      success: false,
      message: message,
      metadata: {
        status: HttpStatus.CONFLICT,
      },
    });
  }
};
