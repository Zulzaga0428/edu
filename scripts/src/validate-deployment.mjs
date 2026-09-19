import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";

const frontendOrigin = "https://chat247.chat";
const unrelatedOrigin = "https://example.com";
const validationMode = process.env.DEPLOYMENT_VALIDATION_MODE?.trim() || "full";

function fail(message) {
  throw new Error(`Deployment validation failed: ${message}`);
}

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} exited with status ${result.status}.`);
  }
}

function validateProductionEnvironment() {
  if (!["full", "frontend"].includes(validationMode)) {
    fail('DEPLOYMENT_VALIDATION_MODE must be either "full" or "frontend".');
  }

  const rawApiUrl = process.env.VITE_API_URL?.trim();

  if (!rawApiUrl) {
    fail("VITE_API_URL is required.");
  }

  let apiUrl;
  try {
    apiUrl = new URL(rawApiUrl);
  } catch {
    fail("VITE_API_URL must be a valid absolute URL.");
  }

  if (apiUrl.protocol !== "https:") {
    fail("VITE_API_URL must use HTTPS.");
  }

  if (apiUrl.search || apiUrl.hash) {
    fail("VITE_API_URL must not contain a query string or fragment.");
  }

  if (validationMode === "full") {
    const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
      .split(",")
      .map((origin) => origin.trim().replace(/\/+$/, ""))
      .filter(Boolean);

    if (!allowedOrigins.includes(frontendOrigin)) {
      fail(`CORS_ORIGINS must include ${frontendOrigin}.`);
    }
  }

  return rawApiUrl.replace(/\/+$/, "");
}

async function getAvailablePort() {
  return await new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => {
        if (error) {
          reject(error);
        } else if (port === null) {
          reject(new Error("Could not allocate a validation port."));
        } else {
          resolve(port);
        }
      });
    });
  });
}

async function waitForLocalHealth(baseUrl, apiProcess) {
  const deadline = Date.now() + 15_000;

  while (Date.now() < deadline) {
    if (apiProcess.exitCode !== null) {
      fail(`API exited before becoming healthy (status ${apiProcess.exitCode}).`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/healthz`);
      if (response.status === 200) {
        return;
      }
    } catch {
      // The server may still be starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  fail("/api/healthz did not return 200 within 15 seconds.");
}

async function checkHealth(baseUrl, label) {
  let response;
  try {
    response = await fetch(`${baseUrl}/api/healthz`);
  } catch (error) {
    fail(`${label} /api/healthz could not be reached: ${error.message}`);
  }

  if (response.status !== 200) {
    fail(`${label} /api/healthz returned ${response.status}, expected 200.`);
  }
}

async function checkCors(baseUrl, label) {
  let allowedResponse;
  try {
    allowedResponse = await fetch(`${baseUrl}/api/healthz`, {
      method: "OPTIONS",
      headers: {
        Origin: frontendOrigin,
        "Access-Control-Request-Method": "GET",
      },
    });
  } catch (error) {
    fail(`${label} allowed CORS preflight could not be completed: ${error.message}`);
  }

  if (!allowedResponse.ok) {
    fail(`${label} allowed CORS preflight returned ${allowedResponse.status}.`);
  }

  if (allowedResponse.headers.get("access-control-allow-origin") !== frontendOrigin) {
    fail(`${label} allowed CORS preflight did not return the frontend origin.`);
  }

  let rejectedResponse;
  try {
    rejectedResponse = await fetch(`${baseUrl}/api/healthz`, {
      method: "OPTIONS",
      headers: {
        Origin: unrelatedOrigin,
        "Access-Control-Request-Method": "GET",
      },
    });
  } catch (error) {
    fail(`${label} rejected-origin CORS preflight failed unexpectedly: ${error.message}`);
  }

  if (
    rejectedResponse.ok ||
    rejectedResponse.headers.has("access-control-allow-origin")
  ) {
    fail(`${label} did not reject an unrelated CORS origin.`);
  }
}

const productionApiUrl = validateProductionEnvironment();

run("pnpm", ["run", "build:zulzaga-edu"], {
  ...process.env,
  NODE_ENV: "production",
});

if (validationMode === "frontend") {
  await checkHealth(productionApiUrl, "Production API");
  await checkCors(productionApiUrl, "Production API");
  process.stdout.write("Deployment validation passed.\n");
} else {
  run("pnpm", ["run", "migrate:api"]);
  run("pnpm", ["run", "build:api"]);

  const port = await getAvailablePort();
  const apiProcess = spawn("pnpm", ["run", "start:api"], {
    detached: true,
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
    },
    stdio: "inherit",
  });

  try {
    const localApiUrl = `http://127.0.0.1:${port}`;
    await waitForLocalHealth(localApiUrl, apiProcess);
    await checkCors(localApiUrl, "Local API");

    await checkHealth(productionApiUrl, "Production API");
    await checkCors(productionApiUrl, "Production API");
    process.stdout.write("Deployment validation passed.\n");
  } finally {
    if (apiProcess.pid) {
      try {
        process.kill(-apiProcess.pid, "SIGTERM");
      } catch (error) {
        if (error.code !== "ESRCH") {
          throw error;
        }
      }
    }
  }
}