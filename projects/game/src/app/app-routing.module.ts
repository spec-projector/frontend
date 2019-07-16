import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KanbanResolver } from 'projects/game/src/app/kanban/kanban.resolver';
import { KanbanComponent } from 'projects/game/src/app/kanban/kanban.component';

const routes: Routes = [
    {
        path: 'kanban/:id/:kanban',
        resolve: {kanban: KanbanResolver},
        component: KanbanComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        paramsInheritanceStrategy: 'always',
        relativeLinkResolution: 'corrected'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
