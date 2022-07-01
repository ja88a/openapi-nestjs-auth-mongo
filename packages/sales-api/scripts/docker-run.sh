#!/bin/bash
APPNAME="sopenapi-account"

CLEAN="clean"
RUN="start"
RUN_PROD="prod"
RESTART="rebuild"
STOP="stop"
MONGO="mongosh"
LOGS="logs"

if [ "$#" -eq 0 ] || [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "Usage: ./docker-run.sh [OPTIONS] COMMAND [arg...]"
    echo "       ./docker-run.sh [ -h | --help ]"
    echo ""
    echo "Options:"
    echo "  -h, --help    Prints usage."
    echo ""
    echo "Commands:"
    echo "  $RUN        - Build and Run $APPNAME related containers."
    echo "  $RESTART    - Stop, Clean, force re-Build and Run $APPNAME related containers."
    echo "  $STOP       - Stop $APPNAME related containers."
    echo "  $CLEAN      - Stop and Remove $APPNAME related containers."
    echo "  $RUN_PROD   - Build and Run the $APPNAME production container."
    echo "  $MONGO      - Access the MongoDB shell."
    echo "  $LOGS       - Show and follow logs of $APPNAME."
    exit
fi

clean() {
  stop_existing
  remove_stopped_containers
  remove_unused_volumes
}

run() {
  echo "Stopping existing containers..."
  stop_existing
  
  echo "Running Docker Compose..."
  docker compose up --build
}

build_run_prod () {
  docker image build -f ./prod/dockerfile --force-rm --label sopenapi-account-prod --tag sopenapi-account-prod:latest --compress .
  docker container create sopenapi-account-prod:latest
  docker container start sopenapi-account-prod:latest
}

restart() {
  echo "Cleaning up..."
  clean

  echo "Force containers rebuild & start"
  docker compose up --build --force-recreate --abort-on-container-exit
}

stop_existing() {
  MYAPP="$(docker ps --all --quiet --filter=name=$APPNAME)"
  REDIS="$(docker ps --all --quiet --filter=name=redis)"
  MONGO="$(docker ps --all --quiet --filter=name=mongodb)"

  if [ -n "$MYAPP" ]; then
    docker stop $MYAPP
  fi

  if [ -n "$REDIS" ]; then
    docker stop $REDIS
  fi

  if [ -n "$MONGO" ]; then
    docker stop $MONGO
  fi
}

remove_stopped_containers() {
  CONTAINERS="$(docker ps -a -f status=exited -q)"
	if [ ${#CONTAINERS} -gt 0 ]; then
		echo "Removing all stopped containers."
		docker rm $CONTAINERS
	else
		echo "There are no stopped containers to be removed."
	fi
}

remove_unused_volumes() {
  CONTAINERS="$(docker volume ls -qf dangling=true)"
	if [ ${#CONTAINERS} -gt 0 ]; then
		echo "Removing all unused volumes."
		docker volume rm $CONTAINERS
	else
		echo "There are no unused volumes to be removed."
	fi
}

mongo_shell() {
  docker exec -it mongodb mongosh
} 

logs_show() {
  docker logs $APPNAME --follow
}

if [ $1 = $CLEAN ]; then
  echo "Cleaning..."
	clean
	exit
fi

if [ $1 = $RUN ]; then
	run
	exit
fi

if [ $1 = $RESTART ]; then
  echo "Rebuild & start..."
	restart
	exit
fi

if [ $1 = $STOP ]; then
	stop_existing
	exit
fi

if [ $1 = $RUN_PROD ]; then
  build_run_prod
  exit;
fi

if [ $1 = $MONGO ]; then
	mongo_shell
	exit
fi

if [ $1 = $LOGS ]; then
	logs_show()
	exit
fi