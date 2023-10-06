#!/bin/bash
set -e

function build_package {
    cd $1
    yarn build
    cd ../..
}

yarn install
build_package packages/ui
build_package packages/client-auth
build_package packages/server-auth
build_package packages/form
build_package packages/engine
build_package packages/api
build_package packages/frontend