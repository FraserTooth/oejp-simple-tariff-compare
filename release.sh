#!/bin/bash

# Exit on error
set -e

# Get version from package.json
VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')
TAG="v${VERSION}"

echo "📦 Building version ${VERSION}..."
bun run build

echo "🏷️ Creating git tag ${TAG}..."
git tag -d "${TAG}" 2>/dev/null || true
git tag -a "${TAG}" -m "Release ${VERSION}"

echo "🚀 Pushing tag to GitHub..."
git push origin "${TAG}" --force

echo "📤 Creating GitHub release with binary..."
gh release create "${TAG}" oejp-simple-tariff-compare --title "Release ${VERSION}" --generate-notes

echo "✅ Release ${VERSION} published on GitHub!"

