import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MockArrayPipe } from 'src/app/pipes/array';

@NgModule({
    declarations: [MockArrayPipe],
    imports: [
        CommonModule
    ],
    exports: [MockArrayPipe]
})
export class ArrayPipesModule {
}
