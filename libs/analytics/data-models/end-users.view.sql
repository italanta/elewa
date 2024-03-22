SELECT
  id AS id,
  
  JSON_EXTRACT_SCALAR(path_params, '$.org_id') AS org_id,

  -- Name needs to be ported to this collection 
  JSON_EXTRACT_SCALAR(data, '$.name') AS name,

  JSON_EXTRACT_SCALAR(data, '$.phoneNumber') AS phoneNumber,
  JSON_EXTRACT_SCALAR(data, '$.status') AS status,
  -- JSON_EXTRACT(data, '$.isConversationComplete') AS isConversationComplete,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') as INT64)) AS updated_on,

FROM `elewa-conv-learning-prod.chiriku_clm_dev.endUsers_raw_latest`
