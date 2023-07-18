SELECT 
  JSON_EXTRACT_SCALAR(path_params, '$.org_id') AS org_id,
  document_id AS id,

  JSON_EXTRACT_SCALAR(data, '$.position.blockId') AS block_id,
  JSON_EXTRACT_SCALAR(data, '$.position.storyId') AS story_id,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') AS INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') AS INT64)) AS updated_on

FROM `elewa-conv-learning-prod.chiriku_clm_dev.cursor_raw_latest`
