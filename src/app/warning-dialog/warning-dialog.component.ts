import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.css']
})
export class WarningDialogComponent {

  warning = "";
  constructor (
    public dialogRef: MatDialogRef<WarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: string
  ) {
    this.warning = data;
   }

  onClose(): void {
    this.dialogRef.close();
  }
}
