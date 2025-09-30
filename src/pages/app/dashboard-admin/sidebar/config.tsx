import { ModeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { provinceMunicipalityMap } from "@/data/province";
import { Settings } from "lucide-react";
import { useState } from "react";


export function Config (){
   const [province, setProvince] = useState<string>("Luanda");
    const [municipalities, setMunicipalities] = useState<string[]>(
      provinceMunicipalityMap["Luanda"]
    );
    const [municipality, setMunicipality] = useState<string>("Viana");

    
  const handleProvinceChange = (prov: string) => {
    setProvince(prov);
    setMunicipalities(provinceMunicipalityMap[prov] || []);
    setMunicipality(provinceMunicipalityMap[prov]?.[0] || "");
  };
      return(
       <>
        <div className="flex flex-col h-full">
           <header className="flex mt-3 gap-36 justify-between ">
              <div className="flex items-center">
                <Settings/>
                 <span className="text-xl font-bold">
                     Configurações
                 </span>
              </div>
              <div>
               <ModeToggle/>
              </div>
           </header>
           <div className="flex flex-col my-3 gap-4">
               <div className="flex flex-col gap-2">
                  <Label>Nome</Label>
                  <Input type="text" placeholder="Nome"></Input>
               </div>
                <div className="flex flex-col gap-2">
                  <Label>Phone</Label>
                  <Input type="number" placeholder="Phone"></Input>
               </div>

                <div className="space-y-2">
                 <Label className="font-semibold">Profissão / Área de Atuação</Label>
                 <Select>
                   <SelectTrigger className="h-10 w-full">
                     <SelectValue placeholder="Selecione sua profissão" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="engenheiro">Engenheiro</SelectItem>
                     <SelectItem value="medico">Médico</SelectItem>
                     <SelectItem value="professor">Professor</SelectItem>
                     <SelectItem value="advogado">Advogado</SelectItem>
                     <SelectItem value="contabilista">Contabilista</SelectItem>
                     <SelectItem value="enfermeiro">Enfermeiro</SelectItem>
                     <SelectItem value="motorista">Motorista</SelectItem>
                     <SelectItem value="pedreiro">Pedreiro</SelectItem>
                     <SelectItem value="eletricista">Eletricista</SelectItem>
                     <SelectItem value="carpinteiro">Carpinteiro</SelectItem>
                     <SelectItem value="serralheiro">Serralheiro</SelectItem>
                     <SelectItem value="cozinheiro">Cozinheiro</SelectItem>
                     <SelectItem value="estudante">Estudante</SelectItem>
                     <SelectItem value="outro">Outro</SelectItem>
                   </SelectContent>
                 </Select>
               </div>

               <div className="space-y-2">
                                   <Label>Província</Label>
                                   <Select value={province} onValueChange={handleProvinceChange}>
                                     <SelectTrigger>
                                       <SelectValue placeholder="Selecione a província" />
                                     </SelectTrigger>
                                     <SelectContent>
                                       {Object.keys(provinceMunicipalityMap).map((prov) => (
                                         <SelectItem key={prov} value={prov}>
                                           {prov}
                                         </SelectItem>
                                       ))}
                                     </SelectContent>
                                   </Select>
                                 </div>
               
                                 {/* Município */}
                                 <div className="space-y-2">
                                   <Label>Município</Label>
                                   <Select value={municipality} onValueChange={setMunicipality}>
                                     <SelectTrigger>
                                       <SelectValue placeholder="Selecione o município" />
                                     </SelectTrigger>
                                     <SelectContent>
                                       {municipalities.map((mun) => (
                                         <SelectItem key={mun} value={mun}>
                                           {mun}
                                         </SelectItem>
                                       ))}
                                     </SelectContent>
                                   </Select>
                                 </div>
           </div>
        <div className="flex gap-2">
            <Button variant='default'>
              Salvar
          </Button>
        </div>
        </div>
       
       </>
      )
}