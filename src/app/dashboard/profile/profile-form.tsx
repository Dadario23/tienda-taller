"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";

import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/registry/new-york/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form";
import { Input } from "@/registry/new-york/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";
import { AvatarDialog } from "@/components/AvatarDialog";
import { FormDescription } from "@/components/ui/form";

const profileFormSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: "fullname must be at least 2 characters." })
    .max(30, { message: "fullname must not be longer than 30 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  country: z.string().min(2, { message: "Country is required." }),
  state: z.string().min(2, { message: "State/Province is required." }),
  locality: z.string().min(2, { message: "Locality is required." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  postalcode: z
    .string()
    .regex(/^\d{4,6}$/, { message: "Invalid postal code." }),
  whatsapp: z
    .string()
    .regex(/^\+?\d{10,15}$/, { message: "Invalid WhatsApp number." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({
  user,
}: {
  user: ProfileFormValues & { avatar: string; _id: string };
}) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user,
    mode: "onChange",
  });

  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(user.country || "");
  const [selectedState, setSelectedState] = useState(user.state || "");
  const [avatar, setAvatar] = useState(user.avatar);

  // Simular una API para cargar países, estados y localidades
  const fetchCountries = async () => {
    return ["USA", "Canada", "Mexico"];
  };

  const fetchStates = async (country: string) => {
    const data: Record<string, string[]> = {
      USA: ["California", "Texas", "New York"],
      Canada: ["Ontario", "Quebec", "British Columbia"],
      Mexico: ["Jalisco", "Nuevo León", "Yucatán"],
    };
    return data[country] || [];
  };

  const fetchLocalities = async (state: string) => {
    const data: Record<string, string[]> = {
      California: ["Los Angeles", "San Francisco", "San Diego"],
      Texas: ["Austin", "Houston", "Dallas"],
      Ontario: ["Toronto", "Ottawa", "Hamilton"],
      Jalisco: ["Guadalajara", "Puerto Vallarta", "Zapopan"],
    };
    return data[state] || [];
  };

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry).then(setStates);
      setSelectedState("");
      setLocalities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      fetchLocalities(selectedState).then(setLocalities);
    }
  }, [selectedState]);

  /* function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile updated successfully!",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  } */

  async function onSubmit(data: ProfileFormValues) {
    console.log("Data being sent:", data); // Verifica si `postalCode` está presente
    try {
      const response = await fetch("/api/users/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id, // Incluye el ID del usuario
          ...data, // Los datos del formulario
          avatar, // Avatar actualizado
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error updating profile",
          description: errorData.error || "Something went wrong.",
          variant: "destructive",
        });
        return;
      }

      const result = await response.json();
      toast({
        title: "Profile updated successfully!",
        description: "The user's profile has been updated.",
      });
      console.log("Updated user:", result.user);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again later.",
        variant: "destructive",
      });
    }
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Inputs y Avatar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex-1 space-y-4">
            {/* Campo: fullname */}
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre y Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Your fullname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-2xl">U</AvatarFallback>
            </Avatar>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <AvatarDialog avatar={avatar} onAvatarChange={setAvatar} />
            </label>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {/* Campo: WhatsApp */}
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Whatsapp</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormDescription>
                  Add your WhatsApp number for better customer support.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Your address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo: Código postal */}
          <FormField
            control={form.control}
            name="postalcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* País, Estado/Provincia y Localidad */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCountry(value);
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedState(value);
                    }}
                    defaultValue={field.value}
                    disabled={!selectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localidad</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedState}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your locality" />
                    </SelectTrigger>
                    <SelectContent>
                      {localities.map((locality) => (
                        <SelectItem key={locality} value={locality}>
                          {locality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Update Profile</Button>
      </form>
    </Form>
  );
}
