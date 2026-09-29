const BACKEND =
    "https://clothingshop.ct.ws/wp-json/toko/v1";

const FRONTEND =
    "https://clothingshop.surge.sh";

export default async function handler(req, res) {

    // CORS
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

    res.setHeader(
        "Vary",
        "Origin"
    );

    // Preflight
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    try {

        const path = Array.isArray(req.query.path)
            ? req.query.path.join("/")
            : "";

        const query = new URLSearchParams();

        for (const [key, value] of Object.entries(req.query)) {
            if (key === "path") continue;

            if (Array.isArray(value)) {
                for (const v of value) {
                    query.append(key, String(v));
                }
            } else if (value !== undefined) {
                query.append(key, String(value));
            }
        }

        const target =
            `${BACKEND}/${path}` +
            (query.toString()
                ? `?${query.toString()}`
                : "");

        const headers = {};

        // Forward token cart
        if (req.headers["x-cart-token"]) {
            headers["X-Cart-Token"] =
                req.headers["x-cart-token"];
        }

        // Forward content type
        if (req.headers["content-type"]) {
            headers["Content-Type"] =
                req.headers["content-type"];
        }

        const options = {
            method: req.method,
            headers,
        };

        // Body untuk POST / PUT / DELETE
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

        const response =
            await fetch(target, options);

        const text =
            await response.text();

        res.status(response.status);

        // Pertahankan content type backend
        const contentType =
            response.headers.get("content-type");

        if (contentType) {
            res.setHeader(
                "Content-Type",
                contentType
            );
        }

        return res.send(text);

    } catch (error) {

        console.error(error);

        return res.status(502).json({
            success: false,
            error: "Gagal menghubungi WooCommerce",
            message: error.message
        });
    }
      }
