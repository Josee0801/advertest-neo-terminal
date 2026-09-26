process.env.CI = "true";
process.argv = [process.execPath, "scripts/run-framework.mjs", "dev"];
await import("./run-framework.mjs");
