#!/bin/bash

set -e

# -----------------------------------------------------------------------------
#  CONSTANTS
# -----------------------------------------------------------------------------

BUILD_DIRECTORY=_site/
ROBOTS_TXT_PATH=${BUILD_DIRECTORY}/robots.txt

# -----------------------------------------------------------------------------
#  FUNCTIONS & PROCEDURES
# -----------------------------------------------------------------------------

# Similar to Perl die
function die() {
    echo "$@" 1>&2 ; exit 1;
}

# Updates the robots.txt file to ensure that we do not have robots crawling our
# development site.
#
# Parameters:
# 1. robots_on: Whether or not to use robots
function set_robots {
  [ "$#" -eq 1 ] || die "1 arguments required, $# provided"
  local __robots_on=$1

  if [ "${__robots_on}" = "true" ]; then
    cat << EOF > ${ROBOTS_TXT_PATH}
# User-Agent: *
# Disallow: /
EOF
  else
    cat << EOF > ${ROBOTS_TXT_PATH}
User-Agent: *
Disallow: /
EOF
  fi
}

# Synchronises the contents of the build directory to S3 and removes anything
# that has been deleted from local.
#
# Parameters:
# 1. s3_bucket: The name of the S3 bucket to upload into
# 2. max_age: The maximum cache age for each object
function sync_site_contents {
    [ "$#" -eq 2 ] || die "2 arguments required, $# provided"
    local __s3_bucket=$1
    local __max_age=$2

    s3cmd sync --delete-removed -P -M -r ${BUILD_DIRECTORY} s3://${__s3_bucket}/ \
      --add-header="Cache-Control:max-age=${__max_age}" \
      --default-mime-type="text/html; charset=utf-8" \
      --guess-mime-type \
      --no-mime-magic
}

# -----------------------------------------------------------------------------
#  ARGUMENT PARSING
# -----------------------------------------------------------------------------

[ "$#" -eq 3 ] || die "3 arguments required, $# provided"

s3_bucket=${1}
max_age=${2}
robots_on=${3}

set_robots "${robots_on}"
sync_site_contents "${s3_bucket}" "${max_age}"
