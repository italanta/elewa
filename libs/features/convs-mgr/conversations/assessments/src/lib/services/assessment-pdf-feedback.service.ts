import html2pdf from 'html2pdf.js';

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { switchMap, from, of, Observable, last, mergeMap, map } from 'rxjs';

import { AssessmentProgress, AssessmentStatusTypes } from '@app/model/convs-mgr/micro-app/assessments';
import { AssessmentMicroApp, MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';
import { FrontendEnvironment } from '@app/elements/base/frontend-env';
import { MicroAppManagementService } from '@app/state/convs-mgr/micro-app';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { FeedbackTemplateHTML } from '../utils/pdf/feedback-template';
import { QuestionsToHTML } from '../utils/pdf/questions-to-html';
import { PDFOutcomeMessage } from '../utils/pdf/score-outcome-text';
import { getOutcomeClass } from '../utils/pdf/get-outcome-class';

@Injectable({
  providedIn: 'root'
})
export class AssessmentFeedbackPDFService {

  constructor(private _afS$$: AngularFireStorage,
              private _http$: HttpClient, 
              private _microAppService: MicroAppManagementService,
              @Inject('ENVIRONMENT') private _env: FrontendEnvironment,) {

  }
  /** Returns a list of users that have attempted the assessment */
  generateAndUploadPDF(progress: AssessmentProgress, questions: AssessmentQuestion[], app: MicroAppStatus) {
    const fileName = `${progress.title} - ${new Date().toLocaleString()}.pdf`;
    const currentAttempt = progress.attempts[progress.attemptCount];

    const headerDetails = {
      assessmentTitle: progress.title || '',
      logoURL: app.config.orgLogoUrl || '',
      learnerName: app.endUserName,
      outcomeMessage: PDFOutcomeMessage(currentAttempt.outcome as AssessmentStatusTypes),
      score: currentAttempt.finalScorePercentage,
      outcomeClass: getOutcomeClass(currentAttempt.outcome as AssessmentStatusTypes)
    };

    const questionsHTML = QuestionsToHTML(questions, progress);

    const feedbackHTML = FeedbackTemplateHTML(headerDetails, questionsHTML);

    return from(this._generatePdf(feedbackHTML, progress.title))
    .pipe(switchMap((pdf)=> {
          const pdfPath =`orgs/${app.config.orgId}/end-users/${app.endUserId}/assessments/feedback-pdfs/${Date.now()}.pdf`;
          if(pdf) {
            return this.uploadFile(pdf, pdfPath)
          } else {
            return of(null)
          }
        }), switchMap((url)=> {
          if(url) {
            const config = app.config as AssessmentMicroApp;
            config.pdf = {
              url,
              name: fileName
            }

            app.config = config;

            return this._microAppService.updateApp(app);
          } else {
            return of(null)
          }
        }))
  }

  private async _generatePdf(htmlContent: string, title: string) {
    const container = document.getElementById(`draw-feedback`) as HTMLElement;
    container.innerHTML = htmlContent;

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${title} - ${new Date().toLocaleString()}.pdf`,
      image: { type: 'jpeg', quality: 2 },
      html2canvas: {
        scale: 2,
        logging: true,
        dpi: 96,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'cm',
        format: 'A4',
        orientation: 'portrait',
      },
      enableLinks: true
    };

    try {
      const blob = await html2pdf().set(options).from(container).toPdf().output('blob');
      // const blobUrl = URL.createObjectURL(blob);
      container.innerHTML = '';

      return blob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      container.innerHTML = '';
      throw error;
    }
  }

  uploadFile(file: File, filePath: string) {
    const taskRef = this._afS$$.ref(filePath);
    const task = taskRef.put(file);
    return <Observable<string>>task
    .snapshotChanges()
    .pipe(
      last(),
      mergeMap(
        () => {
          return taskRef.getDownloadURL().pipe(
            map((url) => {
              return url;
            })
          );
        }
      )
    );
  }
}
