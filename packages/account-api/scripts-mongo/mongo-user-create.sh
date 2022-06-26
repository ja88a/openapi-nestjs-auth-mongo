#!/usr/bin/env bash
echo "Creating Mongo users..."
mongo admin --host localhost -u root -p root --eval "db.createUser({user: 'admin', pwd: '123456',roles: [{role: 'readWrite', db: 'sopenapi'}]});"
echo "Users created."