SELECT 
  JSON_EXTRACT_SCALAR(path_params, '$.org_id') AS org_id,
  document_id AS cursor_id,

  -- Extract data from the eventsStack array as a table
  JSON_EXTRACT_SCALAR(events, '$.isMilestone') AS event_is_milestone,
  JSON_EXTRACT_SCALAR(events, '$.name') AS event_name,
  JSON_EXTRACT(events, '$.payload') AS event_payload, -- This extracts the entire payload JSON object
  JSON_EXTRACT_SCALAR(events, '$.uid') AS event_uid,

FROM `elewa-conv-learning-prod.chiriku_clm_dev.cursor_raw_latest`,
UNNEST(JSON_EXTRACT_ARRAY(data, '$.eventsStack')) AS events WITH OFFSET offset
ORDER BY cursor_id, offset
