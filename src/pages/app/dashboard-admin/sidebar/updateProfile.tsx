import { UpdatePhoto } from "@/api/update-profile-photo";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { Camera, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";



export function UpdateProfile({imageSrc}:{imageSrc:string|undefined}){
     const [selectedFile, setSelectedFile] = useState<File | null>(null);
       const [preview, setPreview] = useState<string | null>(null);
        const { mutateAsync: changeProfilePhoto } = useMutation({
    mutationFn: UpdatePhoto,
  });

     
     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setSelectedFile(file);
          setPreview(URL.createObjectURL(file));
        }
      };
     const handleSave = () => {
        if (!selectedFile) return;
        changeProfilePhoto({
          image_path: selectedFile,
        });
        console.log("Nova imagem:", selectedFile);
      };
       imageSrc=
          preview ||
          (imageSrc
            ? `${imageSrc}`
            : "https://i.pravatar.cc/150?u=placeholder");
     return(
         <DialogContent className="max-w-md">
                            {/* <ModeToggle></ModeToggle> */}
                            <DialogHeader>
                              <DialogTitle>Editar Foto de Perfil</DialogTitle>
                            </DialogHeader>
        
                            <div className="flex flex-col items-center gap-5 py-4">
                              <div className="relative">
                                <img
                                  src={imageSrc}
                                  alt="Preview"
                                  className="w-40 h-40 rounded-full object-cover ring-4 ring-orange-400 shadow-lg"
                                />
                                <label
                                  htmlFor="file-upload"
                                  className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 p-2 rounded-full cursor-pointer shadow-md transition"
                                >
                                  <Camera className="w-4 h-4 text-white" />
                                </label>
                                <input
                                  id="file-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleFileChange}
                                />
                              </div>
                              <p className="text-sm text-gray-500">
                                Clique no ícone da câmera para escolher uma nova foto.
                              </p>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleSave}>Editar</Button>
                            </DialogFooter>
                               <Button className="flex items-center justify-center" variant='ghost' >
                            <Link className="flex items-center" to='/config-prestadores'>
                              <Settings></Settings>
                              <span> Definições</span>
                            </Link>
                            </Button>
                              <Button className="text-red-500" variant='ghost'>
                              <LogOut></LogOut>
                              Sair
                            </Button>
                          </DialogContent>
     )
}