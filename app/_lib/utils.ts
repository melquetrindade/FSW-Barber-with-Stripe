import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// ARQUIVO CRIADO POR ALGUM COMANDO (NÃO MEXE NELE)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
