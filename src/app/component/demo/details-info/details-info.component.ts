import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../core/services/common.service'
@Component({
  selector: 'app-details-info',
  templateUrl: './details-info.component.html',
  styleUrls: ['./details-info.component.scss']
})
export class DetailsInfoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DetailsInfoComponent>,
    private commonServ: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit() {
  }
  onSubmit() {


    console.log("点击了提交按钮");
    this.dialogRef.close(true);
  }
  Configuration(id){
      let length=this.data.infoList.length;
      for(let i=0;i<length;i++){
          if(this.data['infoList'][i]['id']===id){
              this.data['infoList'][i]['isConfig']=false;
          }
      }
  }
  updata(id){
      let length=this.data.infoList.length;
      for(let i=0;i<length;i++){
          if(this.data['infoList'][i]['id']===id){
              //此处updata
              this.data['infoList'][i]['isConfig']=true;
          }
      }
  }
}
