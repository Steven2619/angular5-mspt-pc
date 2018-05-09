import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-log-error-detail',
  templateUrl: './log-error-detail.component.html',
  styleUrls: ['./log-error-detail.component.scss']
})
export class LogErrorDetailComponent implements OnInit {
  logErrorFormGroup: FormGroup
  constructor(
    public dialogRef: MatDialogRef<LogErrorDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    let desc = '';
    if (this.data.details.eventErrorCode !== '无'){
      desc = this.data.details.eventDescription;
    }else{
      desc = JSON.stringify(JSON.parse(this.data.details.eventDescription), null, 4);
    }
    desc = (desc == 'null') ? '无' : desc;
    this.logErrorFormGroup = new FormGroup ({
      eventRemoteIp: new FormControl(this.data.details.eventRemoteIp),
      eventErrorCode: new FormControl( this.data.details.eventErrorCode),
      eventDescription: new FormControl(desc)
    });
  }

}
