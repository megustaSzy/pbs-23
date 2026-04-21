import { Injectable } from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import axios from 'axios';
import { kategoriApi } from '../common/instances/kategori.instance';

// export agar bisa dipakai controller
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
    // return `there`;
    const response = await axios.get<Kategori[]>(`${this.base_url}`);
    return response.data;
  }

  async findOne(id: number): Promise<Kategori> {
    // return `there`;
    const response = await kategoriApi.get<Kategori>(`/${id}`);
    return response.data;
  }

  update(id: number, updateKategoriDto: UpdateKategoriDto) {
    return `This action updates a #${id} kategori`;
  }

  async remove(id: number) {
    const deleteId = await axios.delete<Kategori>(`${this.base_url}/${id}`);
    return deleteId;
  }
}
