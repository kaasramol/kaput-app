#!/bin/bash
# PostToolUse hook (Write|Edit) — format edited file with prettier
FILE="$CLAUDE_FILE_PATH"
if [ -n "$FILE" ] && [[ "$FILE" == *.ts || "$FILE" == *.tsx || "$FILE" == *.css || "$FILE" == *.json ]]; then
  npx prettier --write "$FILE" 2>/dev/null
fi
