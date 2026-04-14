import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export interface Cuenta {
  id: number;
  titular: string;
  saldo: number;
}

const cuentas: Cuenta[] = [
  { id: 1, titular: "Ana Pérez", saldo: 450.5 },
  { id: 2, titular: "Luis Gómez", saldo: 1200 },
  { id: 3, titular: "Marta Ruiz", saldo: 300.25 },
];

export const consultarSaldo = (cuentaId: number): number | null => {
  const cuenta = cuentas.find((item) => item.id === cuentaId);
  return cuenta ? cuenta.saldo : null;
};

export const retirarDinero = (cuentaId: number, monto: number): boolean => {
  const cuenta = cuentas.find((item) => item.id === cuentaId);

  if (!cuenta || monto <= 0 || monto > cuenta.saldo) {
    return false;
  }

  cuenta.saldo -= monto;
  return true;
};

export const depositarDinero = (cuentaId: number, monto: number): boolean => {
  const cuenta = cuentas.find((item) => item.id === cuentaId);

  if (!cuenta || monto <= 0) {
    return false;
  }

  cuenta.saldo += monto;
  return true;
};

export const transferir = (
  cuentaOrigenId: number,
  cuentaDestinoId: number,
  monto: number
): boolean => {
  const origen = cuentas.find((item) => item.id === cuentaOrigenId);
  const destino = cuentas.find((item) => item.id === cuentaDestinoId);

  if (!origen || !destino || monto <= 0 || monto > origen.saldo) {
    return false;
  }

  origen.saldo -= monto;
  destino.saldo += monto;
  return true;
};

const prompt = readline.createInterface({ input, output });

export const menuCajeroAutomatico = async (): Promise<void> => {
  let opcion = "";

  while (opcion !== "5") {
    console.log("\n=== Cajero Automático ===");
    console.log("1. Consultar saldo");
    console.log("2. Retirar dinero");
    console.log("3. Depositar dinero");
    console.log("4. Transferir entre cuentas");
    console.log("5. Salir");

    opcion = await prompt.question("Seleccione una opción: ");

    switch (opcion) {
      case "1": {
        const id = Number(await prompt.question("ID de cuenta: "));
        const saldo = consultarSaldo(id);
        if (saldo === null) {
          console.log("Cuenta no encontrada.");
        } else {
          console.log(`Saldo disponible: $${saldo.toFixed(2)}`);
        }
        break;
      }
      case "2": {
        const id = Number(await prompt.question("ID de cuenta: "));
        const monto = Number(await prompt.question("Monto a retirar: "));
        console.log(
          retirarDinero(id, monto)
            ? "Retiro exitoso."
            : "No se pudo realizar el retiro."
        );
        break;
      }
      case "3": {
        const id = Number(await prompt.question("ID de cuenta: "));
        const monto = Number(await prompt.question("Monto a depositar: "));
        console.log(
          depositarDinero(id, monto)
            ? "Depósito exitoso."
            : "No se pudo realizar el depósito."
        );
        break;
      }
      case "4": {
        const origenId = Number(await prompt.question("Cuenta origen ID: "));
        const destinoId = Number(await prompt.question("Cuenta destino ID: "));
        const monto = Number(await prompt.question("Monto a transferir: "));
        console.log(
          transferir(origenId, destinoId, monto)
            ? "Transferencia completada."
            : "No se pudo realizar la transferencia."
        );
        break;
      }
      case "5":
        console.log("Cerrando cajero automático.");
        break;
      default:
        console.log("Opción inválida. Intente nuevamente.");
    }
  }

  await prompt.close();
};
