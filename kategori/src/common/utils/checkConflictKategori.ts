import { ConflictException, HttpStatus } from '@nestjs/common';
import { CreateKategoriDto } from '../../kategori/dto/create-kategori.dto';
import { PrismaService } from '../../prisma.service';

// fungsi check conflict kategori
export const checkConflictKategori = async (
  prisma: PrismaService['kategori'],
  message: string,
  nama: string,
  id?: number,
) => {
  const nama_filter = nama.replace(/\s/g, '').toLowerCase().trim();

  // [PERBAIKAN 2]: Ambil semua data, lalu hilangkan spasi pada data database
  // untuk dicocokkan dengan nama_filter inputan user
  const exist = await prisma.findFirst({
    where: {
      nama_filter: nama_filter,
      // spread operator
      ...(id ? { NOT: { id: id } } : undefined),
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

  return nama_filter;
};
