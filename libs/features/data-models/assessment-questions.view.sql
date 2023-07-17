SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.org_id') AS org_id,
  document_id AS question_id,

  JSON_EXTRACT_SCALAR(data, '$.feedback.condition') AS feedback_condition,
  JSON_EXTRACT_SCALAR(data, '$.feedback.message') AS feedback_message,

  JSON_EXTRACT_SCALAR(data, '$.marks') AS marks,
  JSON_EXTRACT_SCALAR(data, '$.message') AS message,
  JSON_EXTRACT_SCALAR(data, '$.nextQuestionId') AS nextQuestionId,
  JSON_EXTRACT_SCALAR(data, '$.prevQuestionId') AS prevQuestionId,
  JSON_EXTRACT_SCALAR(data, '$.questionType') AS questionType,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

  -- Extract data from the options array as a table
  JSON_EXTRACT_SCALAR(options, '$.id') AS option_id,
  JSON_EXTRACT_SCALAR(options, '$.text') AS option_text,
  JSON_EXTRACT_SCALAR(options, '$.accuracy') AS option_accuracy,

FROM `elewa-conv-learning-prod.chiriku_clm_dev.assessmentQuestions_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.options')) AS options WITH OFFSET AS offset ORDER BY question_id, offset;
