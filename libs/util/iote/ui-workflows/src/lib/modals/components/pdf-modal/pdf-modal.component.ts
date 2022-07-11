import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Modal that loads a PDF for inspection
 */
@Component({
  selector: 'iote-pdf-modal',
  templateUrl: './pdf-modal.component.html',
  styleUrls: ['./pdf-modal.component.scss']
})
export class PDFModalComponent implements OnInit
{
  isLoaded = false;
  pdfUrl: SafeResourceUrl;

  constructor(private _dialogRef: MatDialogRef<PDFModalComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.pdfUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this._data.path);
    this.isLoaded = true;
  }

  exitModal(): void {
    this._dialogRef.close();
  }
}
