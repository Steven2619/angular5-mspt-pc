import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent {

      constructor(
        public dialogRef: MatDialogRef<DeleteModalComponent>,
        // public DeleteDialogSer: DeleteDialogService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


}
