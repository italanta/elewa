SELECT
  JSON_EXTRACT_SCALAR(path_params, '$.org_id') AS org_id,
  document_id AS id,

  JSON_EXTRACT_SCALAR(data, '$.name') AS name,
  JSON_EXTRACT_SCALAR(data, '$.description') AS description,
  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

FROM `elewa-conv-learning-prod.chiriku_clm_dev.stories_raw_latest`
