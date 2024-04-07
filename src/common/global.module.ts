import { Global, Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { SecurityContextProvider } from './providers/security-context.provider';

@Global()
@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    SecurityContextProvider,
  ],
  exports: [AsyncLocalStorage, SecurityContextProvider],
})
export class GlobalModule {}
