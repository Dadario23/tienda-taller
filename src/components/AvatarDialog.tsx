import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarDialog({
  avatar,
  onAvatarChange,
}: {
  avatar: string;
  onAvatarChange: (newAvatar: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [localAvatar, setLocalAvatar] = useState(avatar);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        //toast({ title: "Invalid file format", description: "Please upload a JPG or PNG image." });
        alert("Invalid file format Please upload a JPG or PNG image.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLocalAvatar(result);
        onAvatarChange(result);
      };
      reader.onerror = () => {
        //toast({ title: "Error", description: "Failed to load the image." });
        alert("Failed to load the image.");
      };
      reader.readAsDataURL(file);
    }
  }

  function handleUrlChange() {
    const urlPattern = /(https?:\/\/.*\.(?:png|jpg|jpeg))/i;
    if (!urlPattern.test(imageUrl)) {
      // toast({ title: "Invalid URL", description: "Please enter a valid image URL ending with .jpg, .jpeg, or .png" });
      alert("Please enter a valid image URL ending with .jpg, .jpeg, or .png");
      return;
    }

    setLocalAvatar(imageUrl);
    onAvatarChange(imageUrl);
    setImageUrl("");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Avatar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Avatar</DialogTitle>
          <DialogDescription>
            Upload an image from your device or enter a URL to use as your
            avatar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {/* Previsualización del avatar */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={localAvatar} />
            <AvatarFallback className="text-2xl">U</AvatarFallback>
          </Avatar>

          {/* Input para enlace de imagen */}
          <div className="w-full">
            <Input
              type="url"
              placeholder="Enter image URL (.jpg, .jpeg, .png)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button
              className="mt-2 w-full"
              onClick={handleUrlChange}
              disabled={!imageUrl}
            >
              Use URL
            </Button>
          </div>

          {/* Input para archivo local */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="avatar">Seleccione una imagen</Label>
            <Input
              id="avatar"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
