import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

const productos: Producto[] = [
  { id: 1, nombre: "Camisa", precio: 25.99, categoria: "Ropa" },
  { id: 2, nombre: "Pantalón", precio: 45.5, categoria: "Ropa" },
  { id: 3, nombre: "Auriculares", precio: 75, categoria: "Electrónica" },
  { id: 4, nombre: "Libro", precio: 18.9, categoria: "Hogar" },
];

const carrito: Producto[] = [];

export const listarProductos = (): Producto[] => [...productos];

export const buscarPorCategoria = (categoria: string): Producto[] =>
  productos.filter(
    (producto) => producto.categoria.toLowerCase() === categoria.toLowerCase()
  );

export const agregarAlCarrito = (productoId: number): boolean => {
  const producto = productos.find((item) => item.id === productoId);

  if (!producto) {
    return false;
  }

  carrito.push(producto);
  return true;
};

export const quitarDelCarrito = (productoId: number): boolean => {
  const indice = carrito.findIndex((item) => item.id === productoId);

  if (indice < 0) {
    return false;
  }

  carrito.splice(indice, 1);
  return true;
};

export const verCarrito = (): Producto[] => [...carrito];

export const calcularTotal = (): number =>
  carrito.reduce((total, producto) => total + producto.precio, 0);

const prompt = readline.createInterface({ input, output });

export const menuCarrito = async (): Promise<void> => {
  let opcion = "";

  while (opcion !== "6") {
    console.log("\n=== Carrito de Compra ===");
    console.log("1. Listar productos");
    console.log("2. Buscar por categoría");
    console.log("3. Agregar al carrito");
    console.log("4. Quitar del carrito");
    console.log("5. Ver carrito y total");
    console.log("6. Salir");

    opcion = await prompt.question("Seleccione una opción: ");

    switch (opcion) {
      case "1":
        console.table(listarProductos());
        break;
      case "2": {
        const categoria = await prompt.question("Ingrese la categoría: ");
        console.table(buscarPorCategoria(categoria));
        break;
      }
      case "3": {
        const id = Number(await prompt.question("ID de producto a agregar: "));
        console.log(
          agregarAlCarrito(id)
            ? "Producto agregado al carrito."
            : "Producto no encontrado."
        );
        break;
      }
      case "4": {
        const id = Number(await prompt.question("ID de producto a quitar: "));
        console.log(
          quitarDelCarrito(id)
            ? "Producto eliminado del carrito."
            : "Producto no se encontró en el carrito."
        );
        break;
      }
      case "5":
        console.table(verCarrito());
        console.log(`Total: $${calcularTotal().toFixed(2)}`);
        break;
      case "6":
        console.log("Saliendo del carrito.");
        break;
      default:
        console.log("Opción inválida. Intente nuevamente.");
    }
  }

  await prompt.close();
};
