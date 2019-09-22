import {NgModule} from '@angular/core';
import {FieldTouchedHasErrorPipe} from 'src/app/pipes/forms/field-has-error';

@NgModule({
  declarations: [FieldTouchedHasErrorPipe],
  exports: [FieldTouchedHasErrorPipe]
})
export class FormPipesModule {

}
