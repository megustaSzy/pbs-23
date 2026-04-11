import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBarangDto } from './dto/create-barang.dto';
import { UpdateBarangDto } from './dto/update-barang.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BarangService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createBarangDto: CreateBarangDto) {
    if (!createBarangDto) {
      throw new HttpException(
        'Data Tidak Boleh Kosong',
        HttpStatus.BAD_REQUEST,
      );
    }

    const exist = await this.prisma.barang.findFirst({
      where: {
        kode: createBarangDto.kode,
      },
    });

    if (exist) {
      throw new ConflictException({
        success: false,
        message: 'Data Barang Berhasil Ditambahkan',
        metadata: {
          status: HttpStatus.CONFLICT,
        },
      });
    }

    const data = await this.prisma.barang.create({
      data: createBarangDto,
    });

    return {
      success: true,
      message: '',
      data: data,
      metadata: {
        status: HttpStatus.CREATED,
      },
    };
  }

  async findAll() {
    const data = await this.prisma.barang.findMany();

    if (data.length === 0) {
      throw new NotFoundException({
        success: false,
        message: process.env.NOT_FOUND_BARANG,
        metadata: {
          status: HttpStatus.NOT_FOUND,
          total_data: data.length,
        },
      });
    }

    return {
      success: true,
      message: 'Data Barang Tidak Ditemukan',
      metadata: {
        status: HttpStatus.OK,
        total_data: data.length,
      },
      data: data,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} barang`;
  }

  update(id: number, updateBarangDto: UpdateBarangDto) {
    return `This action updates a #${id} barang`;
  }

  remove(id: number) {
    return `This action removes a #${id} barang`;
  }
}
