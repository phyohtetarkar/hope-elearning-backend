import { ConfigurableModuleBuilder } from '@nestjs/common';
import { FirebaseModuleOptions } from './firebase-module-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<FirebaseModuleOptions>().build();
