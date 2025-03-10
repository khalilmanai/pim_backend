import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId, Types } from 'mongoose';
import { Vehicule } from './vehicule-schemas/vehicule.schema';

@Injectable()
export class VehiculeService {
  constructor(
    @InjectModel(Vehicule.name) private readonly vehiculeModel: Model<Vehicule>,
  ) {}

  /**
   * Create a new vehicle.
   * @param createVehiculeDto - Object containing vehicle properties.
   * @returns The saved vehicle document.
   */
  async createVehicule(createVehiculeDto: any): Promise<Vehicule> {
    const createdVehicule = new this.vehiculeModel(createVehiculeDto);
    return createdVehicule.save();
  }

  /**
   * Retrieve all vehicles.
   * @returns Array of vehicle documents with populated owner details.
   */
  async getAllVehicules(): Promise<Vehicule[]> {
    return this.vehiculeModel.find().populate('owner').exec();
  }

  /**
   * Retrieve a vehicle by its ID.
   * @param id - The vehicle's ObjectId.
   * @returns The vehicle document.
   * @throws NotFoundException if the vehicle is not found.
   */
  async getVehiculeById(id: string): Promise<Vehicule> {
    const vehicule = await this.vehiculeModel
      .findById(id)
      .populate('owner')
      .exec();
    if (!vehicule) {
      throw new NotFoundException(`Vehicule with id ${id} not found`);
    }
    return vehicule;
  }

  /**
   * Update a vehicle by its ID.
   * @param id - The vehicle's ObjectId.
   * @param updateVehiculeDto - Object containing updated properties.
   * @returns The updated vehicle document.
   * @throws NotFoundException if the vehicle is not found.
   */
  async updateVehicule(id: string, updateVehiculeDto: any): Promise<Vehicule> {
    const updatedVehicule = await this.vehiculeModel
      .findByIdAndUpdate(id, updateVehiculeDto, { new: true })
      .exec();
    if (!updatedVehicule) {
      throw new NotFoundException(`Vehicule with id ${id} not found`);
    }
    return updatedVehicule;
  }

  /**
   * Delete a vehicle by its ID.
   * @param id - The vehicle's ObjectId.
   * @returns A message confirming deletion.
   * @throws NotFoundException if the vehicle is not found.
   */
  async deleteVehicule(id: string): Promise<any> {
    const deletedVehicule = await this.vehiculeModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedVehicule) {
      throw new NotFoundException(`Vehicule with id ${id} not found`);
    }
    return { message: 'Vehicule deleted successfully' };
  }

  /**
   * Retrieve a vehicle by its plate number.
   * @param plate - The unique plate number.
   * @returns The vehicle document.
   * @throws NotFoundException if the vehicle is not found.
   */
  async getCarByPlateNumber(plate: string): Promise<Vehicule> {
    const vehicule = await this.vehiculeModel
      .findOne({ plateNumber: plate })
      .populate('owner')
      .exec();
    if (!vehicule) {
      throw new NotFoundException(
        `Vehicule with plate number ${plate} not found`,
      );
    }
    return vehicule;
  }

  /**
   * Retrieve the owner of a vehicle by its plate number.
   * @param plate - The vehicle's plate number.
   * @returns The owner details from the vehicle document.
   * @throws NotFoundException if the vehicle is not found.
   */
  async getCarOwnerByPlateNumber(plate: string): Promise<any> {
    const vehicule = await this.vehiculeModel
      .findOne({ plateNumber: plate })
      .populate('owner')
      .exec();
    if (!vehicule) {
      throw new NotFoundException(
        `Vehicule with plate number ${plate} not found`,
      );
    }
    return vehicule.owner;
  }

  /**
   * Update the owner of a vehicle by its plate number.
   * @param plate - The vehicle's plate number.
   * @param newOwnerId - The new owner's ObjectId.
   * @returns The updated vehicle document with the new owner.
   * @throws NotFoundException if the vehicle is not found.
   */

  async updateCarOwner(plate: string, newOwnerId: string): Promise<Vehicule> {
    const vehicule = await this.vehiculeModel
      .findOneAndUpdate(
        { plateNumber: plate },
        { owner: new Types.ObjectId(newOwnerId) }, // Convert string to ObjectId
        { new: true },
      )
      .populate('owner')
      .exec();

    if (!vehicule) {
      throw new NotFoundException(
        `Vehicule with plate number ${plate} not found`,
      );
    }
    return vehicule;
  }

  async findByPlateSerieAndNumber(
    serie: string,
    number: string,
  ): Promise<Vehicule> {
    return this.vehiculeModel
      .findOne({ plateSerie: serie, plateNumber: number })
      .exec();
  }

  async findByUser(userId: string): Promise<Vehicule[]> {
    return this.vehiculeModel.find({ owner: userId }).exec();
  }
}
