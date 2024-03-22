SELECT 
  JSON_EXTRACT_SCALAR(path_params, '$.org_id') AS org_id,
  document_id AS cursor_id,

  -- Extract data from the assessmentStack array as a table
  JSON_EXTRACT_SCALAR(assessments, '$.assessmentId') AS assessment_id,
  JSON_EXTRACT_SCALAR(assessments, '$.average') AS assessment_average,
  JSON_EXTRACT_SCALAR(assessments, '$.fail') AS assessment_fail,
  JSON_EXTRACT_SCALAR(assessments, '$.maxScore') AS assessment_max_score,
  JSON_EXTRACT_SCALAR(assessments, '$.pass') AS assessment_pass,
  JSON_EXTRACT_SCALAR(assessments, '$.score') AS assessment_score,

FROM `elewa-conv-learning-prod.chiriku_clm_dev.cursor_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.assessmentStack')) AS assessments WITH OFFSET offset
ORDER BY cursor_id, offset;
