import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './firebase.module-definition';

@Module({
  providers: [],
  exports: [],
})
export class FirebaseModule extends ConfigurableModuleClass {}
