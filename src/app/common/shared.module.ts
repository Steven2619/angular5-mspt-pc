import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatInputModule,
  MatSidenavModule,
  MatSelectModule,
  MatOptionModule,
  MatFormFieldModule,
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatChipsModule,
  MatTooltipModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatIconModule,
  MatMenuModule
  // MatMomentDateModule
} from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { ModalComponent } from './modal/modal.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { OperationWorkOrderComponent } from './operation-work-order/operation-work-order.component';
import { ChinesePipe } from './pipes/chinese.pipe';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { CommonModalComponent } from './common-modal/common-modal.component';
@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatSidenavModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatIconModule,
    MatMenuModule
  ],
  declarations: [
    HeaderComponent,
    ModalComponent,
    DeleteModalComponent,
    OperationWorkOrderComponent,
    ChinesePipe,
    UpdatePasswordComponent,
    CommonModalComponent,
  ],
  exports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    HeaderComponent,
    MatSidenavModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
    ModalComponent,
    DeleteModalComponent,
    MatRadioModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatIconModule,
    MatMenuModule
  ],
  entryComponents: [
    ModalComponent,
    DeleteModalComponent,
    OperationWorkOrderComponent,
    UpdatePasswordComponent,
    CommonModalComponent,
  ]
})
export class SharedModule { }
