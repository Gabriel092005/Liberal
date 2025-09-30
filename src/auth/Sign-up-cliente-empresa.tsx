import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

type MunicipalityMap = {
  [province: string]: string[];
};

export function SignUpEmpresa() {
  const provinceMunicipalityMap: MunicipalityMap = {
    Luanda: [
      "Viana",
      "Cazenga",
      "Luanda",
      "Belas",
      "Kilamba Kiaxi",
      "Ícolo e Bengo",
      "Quissama",
      "Talatona",
      "Cacuaco",
    ],
    Bengo: ["Ambriz", "Dande", "Bula Atumba", "Nambuangongo", "Dembos", "Pango Aluquém"],
    Benguela: ["Benguela", "Baía Farta", "Balombo", "Bocoio", "Cubal", "Caimbambo", "Chongorói", "Ganda", "Lobito"],
    Bié: ["Andulo", "Camacupa", "Catabola", "Chinguar", "Chitembo", "Cuemba", "Cunhinga", "Nharea"],
    Cabinda: ["Belize", "Buco Zau", "Cabinda", "Cacongo"],
    Namibe: ["Bibala", "Camucuio", "Moçâmedes", "Tombwa", "Virei"],
  };

  // Controle de fases
  const [step, setStep] = useState(1);

  // Estados do formulário
  const [fullname, setFullname] = useState("");
  const [nif, setNif] = useState("");
  const [password, setPassword] = useState("");
  const [province, setProvince] = useState<string>("Luanda");
  const [municipalities, setMunicipalities] = useState<string[]>(provinceMunicipalityMap["Luanda"]);
  const [municipality, setMunicipality] = useState<string>("Viana");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleProvinceChange = (prov: string) => {
    setProvince(prov);
    setMunicipalities(provinceMunicipalityMap[prov] || []);
    setMunicipality(provinceMunicipalityMap[prov]?.[0] || "");
  };

  const variants = {
    enter: { x: 50, opacity: 0, scale: 0.95 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -50, opacity: 0, scale: 0.95 },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      fullname,
      nif,
      password,
      province,
      municipality,
      photo,
    });
    alert("Cadastro de empresa enviado com sucesso!");
  };

  return (
    <>
      <Helmet title="Sign Up Empresa" />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md flex flex-col items-center text-center gap-6"
        >
          {/* Header */}
          <div className="flex flex-col gap-1 -mt-40 lg:mt-0">
            <div className="flex fixed top-2  justify-between w-full">
              <Link to="/sign-up">
                <ChevronLeft className="text-blue-400 fixed" />
              </Link>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Sign Up Prestador de Serviços</h1>
            <p className="text-sm text-muted-foreground">
              Registre-se na plataforma como prestador de serviços e vamos trabalhar juntos.
            </p>
          </div>

          {/* Formulário em fases */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full text-left">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="font-semibold" htmlFor="fullname">
                      Nome do Prestador
                    </Label>
                    <Input
                      id="fullname"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Empresa/Individual"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold" htmlFor="nif">
                      NIF
                    </Label>
                    <Input
                      id="nif"
                      value={nif}
                      onChange={(e) => setNif(e.target.value)}
                      placeholder="Ex: 001**********"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold" htmlFor="password">
                      Palavra-Passe
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      required
                    />
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
<div>
  <Select>
     <SelectTrigger>
       <SelectValue placeholder="Selecione uma Categoria"/>
     </SelectTrigger>
     <SelectContent>
      <SelectItem value="COMPANY">Empresa</SelectItem>
      <SelectItem value="INDIVIDUAL">Individual</SelectItem>
     </SelectContent>
  </Select>
</div>

                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="font-semibold">Província</Label>
                    <Select value={province} onValueChange={handleProvinceChange}>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Selecione a província" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        {Object.keys(provinceMunicipalityMap).map((prov) => (
                          <SelectItem key={prov} value={prov}>
                            {prov}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Município</Label>
                    <Select value={municipality} onValueChange={setMunicipality}>
                      <SelectTrigger className="h-10 w-full">
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

                  <div className="space-y-2">
                    <Label className="font-semibold">Foto/Logotipo (opcional)</Label>
                    <Input
                      type="file"
                      onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
                      className="cursor-pointer"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(step - 1)}
                >
                  Voltar
                </Button>
              )}
              {step < 2 ? (
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setStep(step + 1)}
                >
                  Próximo
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Criar
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
