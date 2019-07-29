import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

@Component({
    selector: 'spec-drag-and-drop',
    templateUrl: './drag-and-drop.component.html',
    styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent {
    todo = [
        'Get to work',
        'Pick up groceries',
        'Go home',
        'Fall asleep'
    ];

    done = [
        'Get up',
        'Brush teeth',
        'Take a shower',
        'Check e-mail',
        'Walk dog'
    ];

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }
}