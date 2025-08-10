# Makefile
.PHONY: build scan run clean

IMAGE_NAME := nextjs-app
TAG := latest

build:
	@echo "Building production image..."
	DOCKER_BUILDKIT=1 docker build -t $(IMAGE_NAME):$(TAG) .

scan: build
	@echo "Scanning for vulnerabilities..."
	@if command -v trivy >/dev/null 2>&1; then \
		trivy image --severity HIGH,CRITICAL $(IMAGE_NAME):$(TAG); \
	else \
		docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
		aquasec/trivy image --severity HIGH,CRITICAL $(IMAGE_NAME):$(TAG); \
	fi

run: build
	@echo "Starting container..."
	docker-compose up -d

clean:
	@echo "Cleaning up..."
	docker-compose down
	docker image prune -f

deploy: scan
	@echo "Ready for deployment"