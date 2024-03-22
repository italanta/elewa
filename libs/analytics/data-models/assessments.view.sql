SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.org_id') AS org_id,
  document_id AS id,

  JSON_EXTRACT_SCALAR(data, '$.configs.feedback') AS config_feedback,
  JSON_EXTRACT_SCALAR(data, '$.configs.userAttempts') AS config_userAttempts,

  JSON_EXTRACT_SCALAR(data, '$.name') AS name,
  JSON_EXTRACT_SCALAR(data, '$.title') AS title,
  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

FROM `elewa-conv-learning-prod.chiriku_clm_dev.assessments_raw_latest`
