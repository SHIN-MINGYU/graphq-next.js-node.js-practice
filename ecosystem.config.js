module.exports = {
  apps: [
    {
      name: "the_forest_server", // pm2 name
      script: "./index.ts", // // app execute file path
      instances: 3, // cluster mode instance volume
      exec_mode: "cluster", // fork or cluster mode
      merge_logs: true, // if cluster mode, several clusters log merge
      autorestart: true, // if process failed, restart access
      node_args: "-r ts-node -r tsconfig-paths/register", // args for compiler
      /*    watch: true, // if file is changed, restart access */
      // max_memory_restart: "512M",
      watch: [
        "util",
        "index.ts",
        "type",
        "session",
        "schemas",
        "routes",
        "jwt",
        "graphql",
        "context",
      ],
      ignore_watch: ["node_modules", "uploads"],
      env: {
        // development env
        NODE_ENV: "development",
      },
      env_production: {
        // production env (can assign --env production option.)
        NODE_ENV: "production",
      },
    },
  ],
};
