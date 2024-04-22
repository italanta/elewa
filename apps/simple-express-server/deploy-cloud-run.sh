#!/bin/bash

# Create repository first on Google Artifact Registry
## https://medium.com/@taylorhughes/how-to-deploy-an-existing-docker-container-project-to-google-cloud-run-with-the-minimum-amount-of-daca0b5978d8

# Authenticate to gcloud on your cli
## gcloud auth configure-docker us-east4-docker.pkg.dev

# NOTE: For cloud run you must expose port 8080 in your Dockerfile

export GCLOUD_PROJECT="your-project-name" 
# from Step 2.2 above:
export REPO="foo-repository"
# the region you chose when creating your repository
export REGION="us-east4"
# whatever you want to call this image:
export IMAGE="bar-project-image"

# use the region you chose above here in the URL:
export IMAGE_TAG=${REGION}-docker.pkg.dev/$GCLOUD_PROJECT/$REPO/$IMAGE

nx build simple-express-server

# Build with linux/amd64 as required by Google Cloud Run
docker buildx build --platform linux/amd64 -t ${IMAGE_TAG} -f ./apps/simple-express-server/Dockerfile .
docker push ${IMAGE_TAG}
gcloud run deploy simple-express-server --image ${IMAGE_TAG} --region=${REGION} --quiet --allow-unauthenticated