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
      try {
        await connectDB();

        console.log("SignIn Callback - Incoming User:", user);
        console.log("SignIn Callback - Account Provider:", account?.provider);
        console.log("SignIn Callback - Profile Data:", profile);

        if (account?.provider === "credentials") {
          // Completa los datos del usuario al usar credenciales
          const existingUser = await User.findById(user.id); // Busca por ID ya que viene del token
          if (existingUser) {
            console.log("SignIn Callback - Existing User Found:", existingUser);
            user.email = existingUser.email;
            user.name = existingUser.fullname;
            user.role = existingUser.role;
            user.redirectTo =
              existingUser.role === "user" ? "/home" : "/dashboard";
          }
        }

        console.log("SignIn Callback - Final User Data:", user);
        return true;
      } catch (error) {
        console.error("SignIn Callback - Error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.redirectTo = user.redirectTo || "/"; // Establece un valor predeterminado
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Token:", token); // <-- Log para inspeccionar token
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as string,
      };

      // Valida que token.redirectTo sea una cadena antes de asignarlo
      session.redirectTo =
        typeof token.redirectTo === "string" ? token.redirectTo : undefined;
      console.log("Session Callback - Session:", session);
      return session;
    },
  },

  pages: {
    signIn: "/",
    error: "/",
    signOut: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
