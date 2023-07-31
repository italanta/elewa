SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.org_id') AS org_id,
  document_id AS assessment_question_id,

  -- Extract data from the options array as a table
  JSON_EXTRACT_SCALAR(options, '$.id') AS option_id,
  JSON_EXTRACT_SCALAR(options, '$.text') AS option_text,
  JSON_EXTRACT_SCALAR(options, '$.accuracy') AS option_accuracy,

FROM `elewa-conv-learning-prod.chiriku_clm_dev.assessmentQuestions_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.options')) AS options WITH OFFSET AS offset ORDER BY question_id, offset;
