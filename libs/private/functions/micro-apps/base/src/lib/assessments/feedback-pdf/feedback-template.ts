export const FeedbackTemplateHTML = (headerDetails: any, questions: string) =>
`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      width: 90%;
      background: white;
      color: black;
      margin: 1rem;
    }
    .header-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: auto;
      text-align: center;
    }
    .company-logo {
      width: 3rem;
      height: fit-content;
    }
    .learner-name {
      font-size: small;
      color: #101010;
      font-weight: 300;
    }
    .assessment-name {
      font-size: larger;
      color: black;
      font-weight: bold;
    }
    .question-section {
      display: flex;
      flex-direction: column;
      align-content: flex-start;
      color: black;
      font-weight: normal;
    }
    .question-header {
      display: flex;
      justify-content: space-between;
    }

    .question-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .question-text {
      font-weight: bold;
    }
    .question-options {
      display: flex;
      flex-direction: column;

    }

    .option {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 0.5rem;
    }

    .option-details {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.4rem;
      margin: 0.1rem 0;
    }
    .feedback {
      padding-left: 0.4rem;
      padding-bottom: 0.2rem;
    }
  </style>
</head>
<body>

<div class="header-section">
  <div class="company-logo">
    <img src="${headerDetails.logoURL}"/>
  </div>
  <span class="learner-name">${headerDetails.learnerName}</span>
  <span class="assessment-name">${headerDetails.assessmentTitle}</span>
</div>

<br />
<br />
<br />

<div class="questions-section">
  <div class="questions">
    ${questions}
  </div>
</div>

</body>
</html>`