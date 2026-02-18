#!/bin/bash
# Stop hook — run TypeScript type check after Claude finishes coding
cd "$(dirname "$0")/../.." || exit
npx tsc --noEmit 2>&1 | tail -20
