#!/bin/bash
# Wrapper to inject sensitive env vars into Terraform Plan

if [ -f "/home/zappro/antigravity-zero/.env" ]; then
  set -a
  source "/home/zappro/antigravity-zero/.env"
  set +a
else
  echo "❌ .env not found!"
  exit 1
fi

export TF_VAR_gemini_user_1="$GEMINI_USER_1"
export TF_VAR_gemini_pass_1="$GEMINI_PASS_1"
export TF_VAR_gemini_user_2="$GEMINI_USER_2"
export TF_VAR_gemini_pass_2="$GEMINI_PASS_2"

cd /home/zappro/antigravity-zero/infra/terraform || exit
terraform plan -input=false
