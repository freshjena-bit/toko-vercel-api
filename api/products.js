export default async function handler(req, res) {
  try {
    const url =
      "https://clothingshop.ct.ws/wp-json/toko/v1/products?per_page=50";

    const response = await fetch(url);

    const text = await response.text();

    return res.status(200).json({
      vercel: "OK",
      backend_status: response.status,
      backend_response: text
    });

  } catch (error) {
    return res.status(500).json({
      vercel: "OK",
      backend_error: error.message
    });
  }
}
