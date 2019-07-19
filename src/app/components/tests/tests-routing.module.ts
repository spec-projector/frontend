import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DragAndDropComponent } from 'src/app/components/tests/drag-and-drop/drag-and-drop.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'drag-and-drop',
        pathMatch: 'full'
    },
    {
        path: 'drag-and-drop',
        component: DragAndDropComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestsRoutingModule {
}
