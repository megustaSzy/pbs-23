import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { PrismaService } from '../prisma.service';
import { notExistKategori } from '../common/utils/notExistKategori';
import { checkConflictKategori } from '../common/utils/checkConflictKategori';
import { badResponseKategori } from '../common/utils/badResponseKategori';

@Injectable()
export class KategoriService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKategoriDto: CreateKategoriDto) {
    // [PERBAIKAN 1]: Tambahkan ini agar tidak crash (TypeError) saat data kosong
    if (!createKategoriDto || !createKategoriDto.nama) {
      throw new HttpException(
        'Nama Kategori tidak boleh kosong',
        HttpStatus.BAD_REQUEST,
      );
    }

    // panggil fungsi conflict kategori
    const nama_filter = await checkConflictKategori(
      this.prisma.kategori,
      process.env.FAILED_SAVE!,
      createKategoriDto.nama,
    );

    // Jika nama kategori belum ada

    // Simpan data kategori ke database
    const data = await this.prisma.kategori.create({
      data: {
        nama: createKategoriDto.nama,
        nama_filter: nama_filter,
      },
    });

    // Mengembalikan response sukses (Hanya satu return yang dieksekusi)
    return {
      success: true,
      message: process.env.SUCCESS_SAVE,
      data: data, // Sertakan data yang baru dibuat
      metadata: {
        status: HttpStatus.CREATED,
      },
    };
  }

  // Fungsi findAll sekarang berada di luar (bukan di dalam) fungsi lain
  async findAll() {
    const data = await this.prisma.kategori.findMany();

    if (data.length !== 0) {
      throw new NotFoundException({
        success: false,
        message: process.env.NOT_FOUND_SAVE,
        metadata: {
          status: HttpStatus.NOT_FOUND,
          total_data: data.length,
        },
      });
    }

    return {
      success: true,
      message: process.env.FOUND_SAVE,
      metadata: {
        status: HttpStatus.OK,
        total_data: data.length,
      },
      data: data,
    };
  }
  // fungsi detail data
  async findOne(id: number) {
    try {
      const data = await notExistKategori(
        this.prisma.kategori,
        id,
        process.env.NOT_FOUND_SAVE!,
      );

      return {
        success: true,
        message: process.env.FOUND_SAVE,
        metadata: {
          status: HttpStatus.OK,
        },
        data: data,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return badResponseKategori(process.env.BAD_REQUEST_SAVE!);
    }
  }

  async update(id: number, updateKategoriDto: UpdateKategoriDto) {
    try {
      await notExistKategori(
        this.prisma.kategori,
        id,
        process.env.NOT_FOUND_SAVE!,
      );

      const nama_filter = await checkConflictKategori(
        this.prisma.kategori,
        process.env.FAILED_SAVE!,
        updateKategoriDto.nama ?? '',
        id,
      );

      if (nama_filter)
        await this.prisma.kategori.update({
          where: { id },
          data: {
            nama: updateKategoriDto.nama,
            nama_filter: nama_filter,
          },
        });

      return {
        success: true,
        message: process.env.UPDATE_SAVE,
        metadata: {
          status: HttpStatus.OK,
        },
      };
    } catch (error) {
      // if (
      //   error instanceof NotFoundException ||
      //   error instanceof ConflictException
      // ) {
      //   throw error;
      // }
      // // if (error instanceof ConflictException) {
      // //   throw error;
      // // }
      if (error instanceof HttpException) {
        throw error;
      }

      return badResponseKategori(process.env.BAD_REQUEST_SAVE!);
    }
  }

  async remove(id: number) {
    // return `This action removes a #${id} kategori`;
    try {
      await notExistKategori(
        this.prisma.kategori,
        id,
        'Data Kategori Tidak Ditemukan',
      );

      // hapus
      await this.prisma.kategori.delete({
        where: {
          id,
        },
      });

      // jika kategori ditemukan
      return {
        success: true,
        message: 'Data Kategori Berhasil dihapus',
        metadata: {
          status: HttpStatus.OK,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return badResponseKategori(process.env.BAD_REQUEST_SAVE!);
    }
  }
}

// NULLISH DAN FALSY
