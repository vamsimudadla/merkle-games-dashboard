#!/bin/sh

echo "🧪 Running sanity check tests..."

# Wait for the application to be fully ready
echo "⏳ Waiting for application to be ready..."
sleep 5

# Function to check if server is responding
check_server() {
    for i in 1 2 3 4 5; do
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            echo "✅ Server is responding"
            return 0
        fi
        echo "⏳ Attempt $i/5: Server not ready, waiting..."
        sleep 3
    done
    echo "❌ Server failed to start properly"
    return 1
}

# Check if server is ready
if ! check_server; then
    echo "❌ Sanity check failed: Server not responding"
    exit 1
fi

echo "🔍 Running REST API tests..."
npm run test:rest

if [ $? -ne 0 ]; then
    echo "❌ REST API tests failed!"
    exit 1
fi

echo "🔍 Running GraphQL tests..."
npm run test:graphql

if [ $? -ne 0 ]; then
    echo "❌ GraphQL tests failed!"
    exit 1
fi

echo "✅ All sanity checks passed! 🎉"
echo ""
echo "📊 API Endpoints Ready:"
echo "  🌐 REST API: http://localhost:8000/api/v1"
echo "  ⚡ GraphQL: http://localhost:8000/graphql"
echo "  📖 API Docs: http://localhost:8000/api-docs"
echo "  🛠️  GraphQL Sandbox: http://localhost:8000/graphql-sandbox"