import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './firebase.module-definition';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule extends ConfigurableModuleClass {}
