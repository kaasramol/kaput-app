#!/bin/bash
# PreToolUse hook (Bash) — block destructive commands
COMMAND="$1"
if echo "$COMMAND" | grep -qiE 'rm -rf /|DROP TABLE|git push --force|git push -f'; then
  echo "BLOCKED: Destructive command detected"
  exit 1
fi
