"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginSchema, LoginInput } from "@/components/schema";

// Importamos componentes de diseño
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
import { ToastAction } from "./ui/toast";
import { useToast } from "@/hooks/use-toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { toast } = useToast();

  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  // Configuración de React Hook Form con Zod
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoginError(null);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.ok) {
      // Verifica y redirige según el rol
      const session = await fetch("/api/auth/session").then((res) =>
        res.json()
      );

      if (session?.redirectTo) {
        router.push(session.redirectTo);
      } else {
        toast({
          title: "Error de redirección",
          description: "No se pudo determinar la página de redirección.",
          variant: "destructive",
        });
      }
    } else {
      setLoginError("El correo o la contraseña son incorrectos.");
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Inicia sesión con tu cuenta de Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              {/* Botón para Login con Google */}
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn("google")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Inicia sesión con Google
                </Button>
              </div>

              {/* Separador */}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  O continua con
                </span>
              </div>

              {/* Campos de Formulario */}
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe@email.com"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Password</FormLabel>
                        <a
                          href="#"
                          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                        >
                          Olvidaste tu contraseña?
                        </a>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>

              {/* Enlace de registro */}
              <div className="text-center text-sm">
                No tienes una cuenta?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Regístrate
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Mensaje adicional */}
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

/* 

<Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    const res = await signIn("google", {
                      redirect: true,
                      callbackUrl: "/home",
                    });

                    if (res?.ok) {
                      const session = await fetch("/api/auth/session").then(
                        (res) => res.json()
                      );
                      router.push(session?.redirectTo || "/");
                    } else {
                      toast({
                        title: "No se pudo iniciar sesión",
                        description: "Verifica tus credenciales de Google.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Inicia sesión con Google
                </Button>

*/
