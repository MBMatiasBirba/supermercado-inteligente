import axios from "axios";
import * as cheerio from "cheerio";

export interface Product {
  name: string;
  price: number;
  supermarket: string;
  url: string;
  image?: string;
}

export async function scrapeCoto(search: string): Promise<Product[]> {
  const query = encodeURIComponent(search);
  const url = `https://www.cotodigital3.com.ar/sitios/cdigi/busqueda/buscar/?keyword=${query}`;
  const results: Product[] = [];

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const $ = cheerio.load(data);

    $(".producto").each((_, el) => {

      const name = $(el).find(".descrip_full").text().trim();
      const priceText = $(el).find(".atg_store_newPrice").text().replace("$", "").replace(",", ".").trim();
      const price = parseFloat(priceText) || 0;
      const image = $(el).find("img.product-image").attr("src") || "";
      const link = "https://www.cotodigital3.com.ar" + ($(el).find("a").attr("href") || "");

      if (name && price > 0) {
        results.push({
          name,
          price,
          supermarket: "Coto",
          url: link,
          image,
        });
      }
    });

    return results;
  } catch (error) {
    console.error("Error scraping Coto:", error);
    return [];
  }
}
