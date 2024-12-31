import NextAuth, { DefaultProfile } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
    };
    provider: string; // Este campo está bien definido
    redirectTo?: string; // Asegúrate de que también sea opcional
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
    redirectTo?: string; // Agrega la propiedad redirectTo
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    redirectTo?: string; // Debe ser opcional
  }

  // Extiende el tipo Profile para incluir la propiedad `picture`
  interface Profile extends DefaultProfile {
    picture?: string;
  }
}
