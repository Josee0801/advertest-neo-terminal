process.env.CI = "true";
process.argv = [process.execPath, "scripts/run-framework.mjs", "build"];
await import("./run-framework.mjs");
