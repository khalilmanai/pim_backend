import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user-schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Provide User model
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export UserService if needed in other modules
})
export class UserModule {}
