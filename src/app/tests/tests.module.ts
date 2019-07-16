import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TestsRoutingModule } from 'src/app/tests/tests-routing.module';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';

@NgModule({
    declarations: [DragAndDropComponent],
    imports: [
        CommonModule,
        DragDropModule,
        TestsRoutingModule
    ]
})
export class TestsModule {
}
