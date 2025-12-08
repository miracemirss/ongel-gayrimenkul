import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FooterService } from './footer.service';
import { FooterController } from './footer.controller';
import { FooterLink } from './entities/footer-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FooterLink])],
  controllers: [FooterController],
  providers: [FooterService],
  exports: [FooterService],
})
export class FooterModule {}

