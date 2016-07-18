#!/bin/bash
set -e

export TEST_FLAGS="--color --growl --verbose"

if [ "$1" = 'app' ]; then
    exec ./node_modules/.bin/babel-node app/index.js $2
fi

if [ "$1" = 'test' ]; then
    exec ./node_modules/.bin/babel-node spec/run.js $TEST_FLAGS spec/
fi

exec "$@"
