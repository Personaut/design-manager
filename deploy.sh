#!/bin/bash
# deploy.sh — Pull latest config from GitHub and deploy to OpenClaw
# Run this on the Lightsail instance to update Fable's configuration.
#
# Usage: ./deploy.sh
# Auto-deploy: Add to crontab for periodic pulls, or trigger via webhook.

set -e

REPO_DIR="/home/ubuntu/design-manager"
OPENCLAW_DIR="/home/ubuntu/.openclaw/workspace"
REPO_URL="https://github.com/Personaut/design-manager.git"
BRANCH="main"

echo "🎨 Fable Deploy — $(date)"

# Clone or pull the repo
if [ -d "$REPO_DIR" ]; then
    echo "Pulling latest from $BRANCH..."
    cd "$REPO_DIR"
    git fetch origin "$BRANCH"
    git reset --hard "origin/$BRANCH"
else
    echo "Cloning $REPO_URL..."
    git clone -b "$BRANCH" "$REPO_URL" "$REPO_DIR"
fi

# Sync workspace files (config + skills)
echo "Syncing workspace files..."
rsync -av --delete \
    "$REPO_DIR/openclaw/workspace/" \
    "$OPENCLAW_DIR/" \
    --exclude '.env' \
    --exclude 'memory/' \
    --exclude 'sessions/' \
    --exclude 'cacert.pem'

echo "Restarting gateway..."
openclaw gateway restart

echo "✅ Deploy complete — Fable is updated!"
echo ""
openclaw skills list 2>&1 | grep -E '(ready|workspace)'
