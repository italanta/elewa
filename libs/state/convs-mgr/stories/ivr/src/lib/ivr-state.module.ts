import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IvrService } from './services/ivr.service';


@NgModule({
  imports: [RouterModule],
  providers: []
})
export class IvrStateModule
{
  static forRoot(): ModuleWithProviders<IvrStateModule>
  {
    return {
      ngModule: IvrStateModule,
      providers: [
        IvrService
      ]    };
  }
}
