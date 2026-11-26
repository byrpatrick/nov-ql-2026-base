import fs from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve(__dirname, "..");
const GLOBALS_CSS_PATH = path.join(SRC_DIR, "app", "globals.css");

function listCssFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listCssFiles(fullPath);
    return entry.name.endsWith(".css") ? [fullPath] : [];
  });
}

describe("Paleta de color base azul (base-color-theme)", () => {
  it("define las variables de la paleta azul en globals.css", () => {
    const globalsCss = fs.readFileSync(GLOBALS_CSS_PATH, "utf8");

    expect(globalsCss).toContain("--blue-50:");
    expect(globalsCss).toContain("--blue-100:");
    expect(globalsCss).toContain("--blue-200:");
    expect(globalsCss).toContain("--blue-500:");
    expect(globalsCss).toContain("--blue-600:");
    expect(globalsCss).toContain("--blue-700:");
  });

  it("no utiliza colores literales en ningún CSS Module fuera de globals.css", () => {
    const moduleCssFiles = listCssFiles(SRC_DIR).filter(
      (filePath) => filePath !== GLOBALS_CSS_PATH,
    );
    const literalColorPattern = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/;

    for (const filePath of moduleCssFiles) {
      const content = fs.readFileSync(filePath, "utf8");
      expect(content).not.toMatch(literalColorPattern);
    }
  });
});
