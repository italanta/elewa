SELECT
  id AS id,

  JSON_EXTRACT_SCALAR(data, '$.name') AS name,
  
  TIMESTAMP_SECONDS(CAST(JSON_EXTRACT(data, '$.createdOn._seconds') as INT64)) AS created_on

-- Export organisations coll to BigQuery
FROM `elewa-conv-learning-prod.chiriku_clm_dev.organisations_raw_latest`
