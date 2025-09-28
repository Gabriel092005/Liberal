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
import { provinceMunicipalityMap } from "@/data/province";

type MunicipalityMap = {
  [province: string]: string[];
};

export function SignUp() {
  const [step, setStep] = useState(1);

  // Estados do formulário
  const [fullname, setFullname] = useState("");
  const [nif, setNif] = useState("");
  const [province, setProvince] = useState<string>("Luanda");
  const [municipalities, setMunicipalities] = useState<string[]>(
    provinceMunicipalityMap["Luanda"]
  );
  const [municipality, setMunicipality] = useState<string>("Viana");
  const [category, setCategory] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);

  // Animações de transição entre passos
  const variants = {
    enter: { x: 50, opacity: 0, scale: 0.95 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -50, opacity: 0, scale: 0.95 },
  };

  const handleProvinceChange = (prov: string) => {
    setProvince(prov);
    setMunicipalities(provinceMunicipalityMap[prov] || []);
    setMunicipality(provinceMunicipalityMap[prov]?.[0] || "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      fullname,
      nif,
      province,
      municipality,
      category,
      photo,
    });
    alert("Cadastro enviado com sucesso!");
  };

  return (
    <>
      <Helmet title="Sign Up" />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
          {/* Cabeçalho */}
          <div className="flex flex-col gap-1 -mt-40 lg:mt-0">
             <Link to="/empresa">
                <span className="text-muted-foreground relative left-36 bottom-1 text-xs" >
                   skip
                </span>
              </Link>
            <div className="flex items-center justify-center">
             
              <h1 className="text-2xl font-semibold tracking-tight">Sign Up Clientes</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Se  já tiver um conta ativa podes simplesmente fazer <Link to='/sign-in' className="text-blue-300">login </Link>para ter acessar tua conta
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="w-full text-left">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Nome</Label>
                    <Input
                      id="fullname"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Nome (cliente / Empresa)"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="nif">NIF</Label>
                    <Input
                      id="nif"
                      value={nif}
                      onChange={(e) => setNif(e.target.value)}
                      placeholder="Número de Identificação Fiscal"
                      required
                    />
                  </div>

                     <div className="space-y-1">
                    <Label htmlFor="nif">Palavra-Passe</Label>
                    <Input
                      id="password"
                      onChange={(e) => setNif(e.target.value)}
                      placeholder="Palavra Passe"
                      type="password"
                      required
                    />
                  </div>

                      <div className="space-y-1">
                    <Label htmlFor="e-mail">Email</Label>
                    <Input
                      id="e-mail"
                      onChange={(e) => setNif(e.target.value)}
                      placeholder="exemplo@gmail.com"
                      required
                    />
                  </div>

                       <div className="space-y-1">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      onChange={(e) => setNif(e.target.value)}
                      placeholder="Ex : 938-xxx-xxx"
                      required
                    />
                  </div>

                  <Button
                    className="w-full"
                    type="button"
                    onClick={() => setStep(2)}
                  >
                    Próximo
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  {/* Província */}
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

                  {/* Categoria */}
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CI">Cliente Individual</SelectItem>
                        <SelectItem value="CC">Cliente Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Foto */}
                  <div className="space-y-2">
                    <Label htmlFor="foto">Foto/Logotipo (opcional)</Label>
                    <Input
                      id="foto"
                      type="file"
                      onChange={(e) =>
                        setPhoto(e.target.files ? e.target.files[0] : null)
                      }
                      className="cursor-pointer"
                    />
                  </div>

                    <div className="space-y-2">
                    <Label htmlFor="fullname">Nome do Representante Legal</Label>
                    <Input
                      id="fullname"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Nome do cliente / Empresa"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/2"
                      onClick={() => setStep(1)}
                    >
                      Voltar
                    </Button>
                    <Button className="w-1/2" type="submit">
                    Criar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </form>
        <span className="text-muted-foreground text-xs">Para registar-se na plataforma como cliente (individual/Empresa) de serviços clica em <Link to='/empresa' className="text-blue-300">skip.</Link></span>
        </div>
      </div>
    </>
  );
}
