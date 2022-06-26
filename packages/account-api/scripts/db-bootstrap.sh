#!/bin/bash
#npx nest start --entryFile cli
#nestjs-command insert:setting
echo Init the DB with settings, auth, users, roles and permissions
node dist/cli.js insert:setting
node dist/cli.js insert:authapis
node dist/cli.js insert:permission
node dist/cli.js insert:role
node dist/cli.js insert:user

