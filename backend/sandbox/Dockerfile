FROM oven/bun:latest

WORKDIR /app

# Install global dependencies
RUN bun install -g expo-cli

# Copy package.json
COPY ./app/package.json ./

# Install dependencies using bun
RUN bun install

# Copy the rest of the application
COPY ./app/ ./

# Expose ports for Expo web and Metro bundler
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081

# Command to start Expo web app
CMD ["bun", "run", "web"] 