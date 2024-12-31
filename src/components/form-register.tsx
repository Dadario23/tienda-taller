"use client";

import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { registerSchema, RegisterInput } from "@/components/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [registerError, setRegisterError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setRegisterError(null); // Limpiamos errores previos

    if (data.password !== data.confirmPassword) {
      setRegisterError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const signupResponse = await axios.post("api/auth/signup", {
        email: data.email,
        fullname: data.fullname,
        password: data.password,
      });

      const res = await signIn("credentials", {
        email: signupResponse.data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        toast({
          title: "Usuario registrado correctamente!",
          description: "Iniciando sesion",
          action: <ToastAction altText="Try again">Cerrar</ToastAction>,
        });
        return router.push("/dashboard");
      }
      setRegisterError("Error al iniciar sesión después del registro.");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 409) {
          setRegisterError("Ya existe un usuario registrado con este correo.");
        } else {
          setRegisterError(
            error.response.data.message || "Error al registrar el usuario."
          );
        }
      } else {
        setRegisterError("Error de conexión al servidor.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crea una cuenta</CardTitle>
          <CardDescription>
            Inicia sesion con tu correo y contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              {/* Mensaje de error global */}
              {registerError && (
                <p className="text-red-500 text-center">{registerError}</p>
              )}

              {/* Campo de nombre completo */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre y Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de correo */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de contraseña */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirmación de contraseña */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirma la contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botón de registro */}
              <Button type="submit" className="w-full">
                Registrarse
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Enlace a la página de login */}
      <div className="text-center text-sm">
        Ya tienes una cuenta?{" "}
        <a href="/" className="underline underline-offset-4">
          Inicia sesión
        </a>
      </div>
    </div>
  );
}

export default RegisterPage;
