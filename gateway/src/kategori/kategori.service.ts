import { Injectable } from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import axios from 'axios';

export interface Kategori {
  id: number;
  nama: string;
  nama_filter: string;
}

@Injectable()
export class KategoriService {
  private readonly base_url = 'http://localhost:3001/api/kategori';
  create(createKategoriDto: CreateKategoriDto) {
    return 'This action adds a new kategori';
  }

  async findAll(): Promise<Kategori[]> {
    const response = await axios.get<Kategori[]>(`${this.base_url}`);
    return response.data;
  }

  async findOne(id: number): Promise<Kategori[]> {
    const response = await axios.get<Kategori[]>(`${this.base_url}/${+id}`);
    return response.data;
  }

  update(id: number, updateKategoriDto: UpdateKategoriDto) {
    return `This action updates a #${id} kategori`;
  }

  remove(id: number) {
    return `This action removes a #${id} kategori`;
  }
}
