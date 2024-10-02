export const FeedbackTemplateHTML = (headerDetails: any, questions: string) =>
`<!DOCTYPE html>
<html>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: "Roboto", sans-serif;
      background: white;
      color: black;
      font-weight: normal;
      font-style: normal;
      margin: 0;
      padding: 0;
    }
    
    .header-section {
      background: rgba(31, 122, 140, 0.35);
      padding: 0.8rem;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      text-align: center;
      margin: auto;
      width: 100%;
    }
    
    .header-details {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      width: 30%;
      min-width: fit-content;
      align-self: center;
      margin-right: -1rem;
    }

    .uploaded-media {
      max-width: 50%;
    }

    .fail {
      color: #E02222;
    }
      
    .pass {
      color:  #1F7A8C;;
    }

    .company-logo {
      display: flex;
      width: 25%;
      align-self: center;
      margin-left: -1rem;
    }

    .company-logo > img {
      max-width: 100%;
      height: auto;
    }

    .learner-name {
      color: #101010;
    }

    .assessment-name {
      width: 100%;
      text-align: center;
      font-size: larger;
      color: black;
      font-weight: bold;
    }
    .questions-section {
      padding: 1rem;
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

    .correct {
      accent-color:#1F7A8C;
      color:#1F7A8C;
    }

    .wrong {
      accent-color: #E02222;
      color: #E02222;
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
  <div class="header-details">
    <span class="outcome">${headerDetails.outcomeMessage}</span>
    <span class="learner-name">${headerDetails.learnerName}</span>
    <div class="assessment-grade"> Grade Received: <span class="grade ${headerDetails.outcomeClass}">${headerDetails.score}%</span> </div>
  </div>
</div>

<br />
<br />

<div class="assessment-name">
  <span>${headerDetails.assessmentTitle}</span>
</div>

<br />
<br />

<div class="questions-section">
  <div class="questions">
    ${questions}
  </div>
</div>

</body>
</html>`