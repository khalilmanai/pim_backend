import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Infraction } from './schemas/infraction.schema';
import { CreateInfractionDto } from './dto/create-infraction.dto';
import { UpdateInfractionDto } from './dto/update-infraction.dto';

@Injectable()
export class InfractionService {
  constructor(
    @InjectModel(Infraction.name)
    private infractionModel: Model<Infraction>,
  ) {}

  async create(createInfractionDto: CreateInfractionDto): Promise<Infraction> {
    const createdInfraction = new this.infractionModel(createInfractionDto);
    return createdInfraction.save();
  }

  async findAll(): Promise<Infraction[]> {
    return this.infractionModel.find().exec();
  }

  async findOne(id: string): Promise<Infraction> {
    const infraction = await this.infractionModel.findById(id).exec();
    if (!infraction) {
      throw new NotFoundException('Infraction not found');
    }
    return infraction;
  }

  async update(
    id: string,
    updateInfractionDto: UpdateInfractionDto,
  ): Promise<Infraction> {
    const existingInfraction = await this.infractionModel
      .findByIdAndUpdate(id, updateInfractionDto, { new: true })
      .exec();
    if (!existingInfraction) {
      throw new NotFoundException('Infraction not found');
    }
    return existingInfraction;
  }

  async delete(id: string): Promise<void> {
    const result = await this.infractionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Infraction not found');
    }
  }

  async findAllByUser(userId: string): Promise<Infraction[]> {
    return this.infractionModel.find({ user: userId }).exec();
  }
  
  
}