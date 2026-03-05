import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { PrismaService } from '../prisma.service';
import { metadata } from 'reflect-metadata/no-conflict';

@Injectable()
export class KategoriService {
  // buat constructor untuk inject prisma service
  constructor(private readonly prisma: PrismaService) {}
  create(createKategoriDto: CreateKategoriDto) {
    return 'This action adds a new kategori';
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
      return {
        success: false,
        message: 'data tidak ditemukan',
        metadata: {
          status: HttpStatus.NOT_FOUND,
          total_data: data.length,
        },
        data: data,
      };
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

  findOne(id: number) {
    return `This action returns a #${id} kategori`;
  }

  update(id: number, updateKategoriDto: UpdateKategoriDto) {
    return `This action updates a #${id} kategori`;
  }

  remove(id: number) {
    return `This action removes a #${id} kategori`;
  }
}
