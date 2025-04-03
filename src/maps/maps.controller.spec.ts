import { Test, TestingModule } from '@nestjs/testing';
import { MapsController } from './maps.controller'; 
import { MapsService } from './maps.service'; 
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('MapsController', () => { 
  let controller: MapsController; 
  let service: MapsService; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      controllers: [MapsController], 
      providers: [MapsService], 
    }).compile();

    controller = module.get<MapsController>(MapsController); 
    service = module.get<MapsService>(MapsService); 
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
