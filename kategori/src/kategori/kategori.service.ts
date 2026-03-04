import { Injectable } from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class KategoriService {
  // buat constructor untuk inject prisma service
  constructor(private readonly prisma: PrismaService) {}
  create(createKategoriDto: CreateKategoriDto) {
    return 'This action adds a new kategori';
  }

  findAll() {
    return `Raditya Ahmad`;
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
