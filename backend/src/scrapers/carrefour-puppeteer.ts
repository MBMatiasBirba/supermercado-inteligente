
import puppeteer from "puppeteer";

export interface Product {
  name: string;
  price: number;
  supermarket: string;
  url: string;
  image?: string;
}

export async function scrapeCarrefour(search: string): Promise<Product[]> {
const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const query = encodeURIComponent(search);
  const url = `https://www.carrefour.com.ar/buscar?text=${query}`;
  const results: Product[] = [];

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("a.product-card", { timeout: 8000 });

    const products = await page.$$eval("a.product-card", (cards) => {
      return cards.map((card) => {
        const name = card.querySelector(".product-card__title")?.textContent?.trim() || "";
        const priceText = card.querySelector(".product-card__price--best")?.textContent?.replace("$", "").replace(",", ".") || "0";
        const price = parseFloat(priceText) || 0;
        const link = "https://www.carrefour.com.ar" + (card.getAttribute("href") || "");
        const image = card.querySelector("img")?.getAttribute("src") || "";

        return {
          name,
          price,
          supermarket: "Carrefour",
          url: link,
          image,
        };
      });
    });

    for (const product of products) {
      if (product.name && product.price > 0) {
        results.push(product);
      }
    }
  } catch (error) {
    console.error("Error scraping Carrefour con Puppeteer:", error);
  } finally {
    await browser.close();
  }

  return results;
}
