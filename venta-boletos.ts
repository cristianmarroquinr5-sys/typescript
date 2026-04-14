import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export interface Boleto {
  id: number;
  seccion: string;
  precio: number;
  disponible: boolean;
}

const boletos: Boleto[] = [
  { id: 1, seccion: "A", precio: 120, disponible: true },
  { id: 2, seccion: "B", precio: 90, disponible: true },
  { id: 3, seccion: "C", precio: 60, disponible: true },
  { id: 4, seccion: "A", precio: 120, disponible: true },
];

export const mostrarBoletosDisponibles = (): Boleto[] =>
  boletos.filter((boleto) => boleto.disponible);

export const comprarBoleto = (boletoId: number): boolean => {
  const boleto = boletos.find((item) => item.id === boletoId);

  if (!boleto || !boleto.disponible) {
    return false;
  }

  boleto.disponible = false;
  return true;
};

export const verBoletosVendidos = (): Boleto[] =>
  boletos.filter((boleto) => !boleto.disponible);

const prompt = readline.createInterface({ input, output });

export const menuVentaBoletos = async (): Promise<void> => {
  let opcion = "";

  while (opcion !== "4") {
    console.log("\n=== Venta de Boletos ===");
    console.log("1. Mostrar boletos disponibles");
    console.log("2. Comprar boleto");
    console.log("3. Ver boletos vendidos");
    console.log("4. Salir");

    opcion = await prompt.question("Seleccione una opción: ");

    switch (opcion) {
      case "1":
        console.table(mostrarBoletosDisponibles());
        break;
      case "2": {
        const id = Number(await prompt.question("ID de boleto a comprar: "));
        console.log(
          comprarBoleto(id)
            ? "Compra realizada correctamente."
            : "No se pudo comprar el boleto."
        );
        break;
      }
      case "3":
        console.table(verBoletosVendidos());
        break;
      case "4":
        console.log("Cerrando venta de boletos.");
        break;
      default:
        console.log("Opción inválida. Intente nuevamente.");
    }
  }

  await prompt.close();
};
