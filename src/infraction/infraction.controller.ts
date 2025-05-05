import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InfractionService } from './infraction.service';
import { CreateInfractionDto } from './infraction-dto/createInfraction.dto';

@Controller('infraction')
export class InfractionController {
  constructor(private readonly infractionService: InfractionService) {}

  @Post()
  async create(@Body() createInfractionDto: CreateInfractionDto) {
    return this.infractionService.createInfraction(createInfractionDto);
  }

  @Post('simple')
  async createSimple(@Body() createInfractionDto: CreateInfractionDto) {
    return this.infractionService.createSimpleInfraction(createInfractionDto);
  }

  @Get()
  async findAll() {
    return this.infractionService.findAll();
  }

  @Get(':serie/:number')
  async findByPlate(
    @Param('serie') serie: string,
    @Param('number') number: string,
  ) {
    return this.infractionService.findByPlate(serie, number);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.infractionService.findByUserId(id);
  }
}
