SELECT 
  JSON_EXTRACT_SCALAR(path_params, '$.org_id') AS org_id,
  document_id AS id,

  JSON_EXTRACT_SCALAR(data, '$.position.blockId') AS block_id,
  JSON_EXTRACT_SCALAR(data, '$.position.storyId') AS story_id,

  -- Extract data from the eventsStack array as a table
  JSON_EXTRACT_SCALAR(events, '$.isMilestone') AS event_is_milestone,
  JSON_EXTRACT_SCALAR(events, '$.name') AS event_name,
  JSON_EXTRACT(events, '$.payload') AS event_payload, -- This extracts the entire payload JSON object
  JSON_EXTRACT_SCALAR(events, '$.uid') AS event_uid,

  -- Extract data from the assessmentStack array as a table
  JSON_EXTRACT_SCALAR(assessments, '$.assessmentId') AS assessment_id,
  JSON_EXTRACT_SCALAR(assessments, '$.average') AS assessment_average,
  JSON_EXTRACT_SCALAR(assessments, '$.fail') AS assessment_fail,
  JSON_EXTRACT_SCALAR(assessments, '$.maxScore') AS assessment_max_score,
  JSON_EXTRACT_SCALAR(assessments, '$.pass') AS assessment_pass,
  JSON_EXTRACT_SCALAR(assessments, '$.score') AS assessment_score,

  JSON_EXTRACT_SCALAR(data, '$.createdBy') AS created_by,

  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') AS INT64)) AS created_on,
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.updatedOn._seconds') AS INT64)) AS updated_on

FROM `elewa-conv-learning-prod.chiriku_clm_dev.cursor_raw_latest`
LEFT JOIN UNNEST(JSON_EXTRACT_ARRAY(data, '$.eventsStack')) AS events WITH OFFSET event_offset
LEFT JOIN UNNEST(JSON_EXTRACT_ARRAY(data, '$.assessmentStack')) AS assessments WITH OFFSET assessment_offset
ON event_offset = assessment_offset
ORDER BY id, event_offset, assessment_offset;
