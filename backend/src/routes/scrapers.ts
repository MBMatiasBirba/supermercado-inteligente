import { Router, Request, Response } from "express";
import { scrapeCarrefour } from "../scrapers/carrefour-puppeteer";
import { scrapeCoto } from "../scrapers/coto";


const router = Router();

router.get("/carrefour", (req: Request, res: Response): void => {
  const { q } = req.query;
  if (!q || typeof q !== "string") {
    res.status(400).json({ error: "Falta parámetro de búsqueda (?q=...)" });
    return;
  }

  scrapeCarrefour(q)
    .then((results) => res.json(results))
    .catch((error) => {
      console.error("Error interno:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    });
});


router.get("/coto", (req: Request, res: Response): void => {
  const { q } = req.query;
  if (!q || typeof q !== "string") {
    res.status(400).json({ error: "Falta parámetro de búsqueda (?q=...)" });
    return;
  }

  console.log("🚀 Llegó al endpoint de Coto con query:", q);

  scrapeCoto(q)
    .then((results) => res.json(results))
    .catch((error) => {
      console.error("Error en Coto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    });
});

export default router;
