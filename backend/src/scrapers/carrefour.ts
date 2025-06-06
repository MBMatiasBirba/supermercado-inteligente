
import axios from "axios";
import * as cheerio from "cheerio";

export interface Product {
  name: string;
  price: number;
  supermarket: string;
  url: string;
  image?: string;
}

export async function scrapeCarrefour(search: string): Promise<Product[]> {
  const query = encodeURIComponent(search);
  const url = `https://www.carrefour.com.ar/buscar?text=${query}`;
  const results: Product[] = [];

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $("a.product-card").each((_, el: cheerio.Element) => {
      const name = $(el).find(".product-card__title").text().trim();
      const priceText = $(el).find(".product-card__price--best").text().replace("$", "").replace(",", ".");
      const price = parseFloat(priceText) || 0;
      const link = "https://www.carrefour.com.ar" + ($(el).attr("href") || "");
      const image = $(el).find("img").attr("src") || "";

      if (name && price > 0) {
        results.push({
          name,
          price,
          supermarket: "Carrefour",
          url: link,
          image,
        });
      }
    });

    return results;
  } catch (error) {
    console.error("Error scraping Carrefour:", error);
    return [];
  }
}
