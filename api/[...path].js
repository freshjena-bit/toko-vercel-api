const BACKEND =
  "https://clothingshop.ct.ws/wp-json/toko/v1";

const FRONTEND =
  "https://clothingshop.surge.sh";

export default async function handler(req, res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    FRONTEND
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Cart-Token"
  );

  res.setHeader(
    "Access-Control-Max-Age",
    "86400"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const path = Array.isArray(req.query.path)
      ? req.query.path.join("/")
      : "";

    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query)) {
      if (key === "path") continue;

      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)));
      } else if (value !== undefined) {
        params.append(key, String(value));
      }
    }

    const target =
      `${BACKEND}/${path}` +
      (params.toString()
        ? `?${params.toString()}`
        : "");

    const headers = {};

    if (req.headers["x-cart-token"]) {
      headers["X-Cart-Token"] =
        req.headers["x-cart-token"];
    }

    if (req.headers["content-type"]) {
      headers["Content-Type"] =
        req.headers["content-type"];
    }

    const options = {
      method: req.method,
      headers
    };

    if (
      req.method !== "GET" &&
      req.method !== "HEAD" &&
      req.method !== "OPTIONS"
    ) {
      if (req.body !== undefined) {
        options.body =
          typeof req.body === "string"
            ? req.body
            : JSON.stringify(req.body);
      }
    }

    const response = await fetch(target, options);

    const body = await response.text();

    const contentType =
      response.headers.get("content-type");

    if (contentType) {
      res.setHeader(
        "Content-Type",
        contentType
      );
    }

    return res
      .status(response.status)
      .send(body);

  } catch (error) {
    console.error(error);

    return res.status(502).json({
      success: false,
      error: "Gagal menghubungi WooCommerce",
      message: error.message
    });
  }
        }
