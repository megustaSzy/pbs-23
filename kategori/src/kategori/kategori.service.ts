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

    // Buat variabel untuk filter nama
    const nama_filter = createKategoriDto.nama
      .replace(/\s/g, '')
      .toLowerCase()
      .trim();

    // Cek Apakah nama kategori sudah ada di database?
    // ganti nama jadi nama_filter

    // [PERBAIKAN 2]: Ambil semua data, lalu hilangkan spasi pada data database
    // untuk dicocokkan dengan nama_filter inputan user
    const allKategori = await this.prisma.kategori.findMany();
    const exist = allKategori.find(
      (kategori) =>
        kategori.nama.replace(/\s/g, '').toLowerCase() === nama_filter,
    );

    // Jika nama kategori sudah ada
    if (exist) {
      throw new ConflictException({
        success: false,
        message: 'Data Kategori Gagal Disimpan! (Nama Kategori Sudah Ada)',
        metadata: {
          status: HttpStatus.CONFLICT,
        },
      });
    }

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
      message: 'Data Kategori Berhasil Disimpan',
      data: data, // Sertakan data yang baru dibuat
      metadata: {
        status: HttpStatus.CREATED,
      },
    };
  }

  // Fungsi findAll sekarang berada di luar (bukan di dalam) fungsi lain
  async findAll() {
    const data = await this.prisma.kategori.findMany();

    if (data.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Data Kategori Tidak Ditemukan',
        metadata: {
          status: HttpStatus.NOT_FOUND,
          total_data: data.length,
        },
      });
    }

    return {
      success: true,
      message: 'Data Kategori Ditemukan',
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
      const data = await this.prisma.kategori.findUnique({
        where: {
          id: id,
        },
      });

      if (!data) {
        throw new NotFoundException({
          success: false,
          message: 'Data Kategori Tidak Ditemukan',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

      return {
        success: true,
        message: 'Data Kategori Ditemukan',
        metadata: {
          status: HttpStatus.OK,
        },
        data: data,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'Parameter Harus Angka',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  async update(id: number, updateKategoriDto: UpdateKategoriDto) {
    try {
      const data = await this.prisma.kategori.findUnique({
        where: { id },
      });

      if (!data) {
        throw new NotFoundException({
          success: false,
          message: 'Data Kategori Tidak Ditemukan',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

      const nama_filter = (updateKategoriDto.nama || '')
        .replace(/\s/g, '')
        .toLowerCase()
        .trim();

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
        message: 'Data Kategori Berhasil Diperbarui',
        metadata: {
          status: HttpStatus.OK,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'Parameter Harus Angka',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  async remove(id: number) {
    // return `This action removes a #${id} kategori`;
    try {
      const data = await this.prisma.kategori.findUnique({
        where: {
          id: id,
        },
      });

      if (!data) {
        throw new NotFoundException({
          success: false,
          message: 'Data Kategori Tidak Ditemukan',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

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
      throw new BadRequestException({
        success: false,
        message: 'Parameter Harus Angka',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }
}
