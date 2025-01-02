import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    // Proveedor de credenciales
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Por favor, complete todos los campos.");
          }

          await connectDB();

          const userFound = await User.findOne({
            email: credentials.email,
          }).select("+password role fullname");

          if (!userFound) {
            throw new Error("El correo no está registrado.");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            userFound.password
          );
          if (!passwordMatch) {
            throw new Error("La contraseña es incorrecta.");
          }

          return {
            id: userFound._id.toString(),
            email: userFound.email,
            name: userFound.fullname,
            role: userFound.role,
          };
        } catch (error) {
          console.error("Error en la autorización:", error);
          throw new Error("Error interno del servidor.");
        }
      },
    }),

    // Proveedor de Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();

      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          user.role = existingUser.role;
          user.redirectTo =
            existingUser.role === "admin" ? "/dashboard" : "/home";
        } else {
          const newUser = await User.create({
            email: profile?.email,
            fullname: profile?.name,
            provider: "google",
            role: "user", // Rol predeterminado
            image: profile?.picture,
          });
          user.role = newUser.role;
          user.redirectTo = "/home";
        }
      } else {
        // Lógica para usuarios con credenciales
        const existingUser = await User.findById(user.id); // MongoDB ObjectId para credenciales
        if (existingUser) {
          user.role = existingUser.role;
          user.redirectTo =
            existingUser.role === "admin" ? "/dashboard" : "/home";
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Si el usuario es de Google, utiliza el ID del proveedor (sub)
        token.id =
          account?.provider === "google" ? user.id : user._id?.toString();
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.redirectTo = user.redirectTo || "/";
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as string,
      };

      // Valida que token.redirectTo sea una cadena antes de asignarlo
      session.redirectTo =
        typeof token.redirectTo === "string" ? token.redirectTo : undefined;

      return session;
    },
  },

  pages: {
    signIn: "/", // Página de inicio de sesión
    error: "/", // Maneja errores en la misma página
    signOut: "/", // Página de cierre de sesión
    // La página de carga es el callback temporal
    newUser: "/loading", // Redirige a una página intermedia
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
