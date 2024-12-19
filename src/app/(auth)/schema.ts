import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Debe ser un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Tipos derivados del esquema para TypeScript
export type FormData = z.infer<typeof formSchema>;
