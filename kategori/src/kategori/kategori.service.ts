import {
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
  // buat constructor untuk inject prisma service
  constructor(private readonly prisma: PrismaService) {}
  async create(createKategoriDto: CreateKategoriDto) {
    await this.prisma.kategori.create({
      data: {
        nama: createKategoriDto.nama,
      },
    });

    return {
      success: true,
      message: 'data kategori berhasil disimpan',
      metadata: {
        status: HttpStatus.CREATED,
      },
    };
  }

  async findAll() {
    const data = await this.prisma.kategori.findMany({
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        nama: true,
      },
    });

    if (data.length === 0) {
      // throw new HttpException(
      //   {
      //     success: false,
      //     message: 'data kategori tidak ditemukan',
      //     metadata: {
      //       status: HttpStatus.NOT_FOUND,
      //       total_data: data.length,
      //     },
      //   },
      //   HttpStatus.NOT_FOUND,
      // );
      throw new NotFoundException({
        success: false,
        message: 'data kategori tidak ditemukan',
        metadata: {
          status: HttpStatus.NOT_FOUND,
          total_data: data.length,
        },
      });
    }

    return {
      success: true,
      message: 'data berhasil ditemukan',
      metadata: {
        status: HttpStatus.OK,
        total_data: data.length,
      },
      data: data,
    };
  }

  async findOne(id: number) {
    const data = await this.prisma.kategori.findUnique({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'data berhasil ditemukan',
      metadata: {
        status: HttpStatus.OK,
      },
      data: data,
    };
  }

  update(id: number, updateKategoriDto: UpdateKategoriDto) {
    return `This action updates a #${id} kategori`;
  }

  remove(id: number) {
    return `This action removes a #${id} kategori`;
  }
}
