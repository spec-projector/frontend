import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {MapPipe, MockArrayPipe} from 'src/pipes/array/array';

@NgModule({
    declarations: [
      MockArrayPipe,
      MapPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
      MockArrayPipe,
      MapPipe
    ]
})
export class ArrayPipesModule {
}
