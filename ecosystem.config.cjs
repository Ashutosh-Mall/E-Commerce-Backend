module.exports = {
  apps: [
    {
      name: "backend",
      script: "./dist/index.js",

      instances: "max",
      exec_mode: "cluster",

      watch: false,

      max_memory_restart: "500M",

      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      time: true
    },

    {
      name: "worker",
      script: "./dist/workers/email.worker.js",

      instances: 1,
      exec_mode: "fork",

      watch: false,

      max_memory_restart: "300M",

      error_file: "./logs/worker-error.log",
      out_file: "./logs/worker-out.log",
      time: true
    }
  ]
};