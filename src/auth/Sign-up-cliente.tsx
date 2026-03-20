import { GetProfission } from "@/api/get-profissions";
import { signUp } from "@/api/sign-up";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { provinceMunicipalityMap } from "@/data/province";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Camera,
  CheckCircle2,
  CreditCard,
  Loader2,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SignUpFormData {
  nome: string;
  profissao: string;
  nif: string;
  celular: string;
  palavraPasse: string;
  provincia: string;
  municipio: string;
  role: string;
  termo_privacidade: boolean;
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const formVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.3 },
  }),
};

// ─── Reusable Field Components ────────────────────────────────────────────────

interface FieldWrapperProps {
  label: string;
  children: React.ReactNode;
  error?: boolean;
}

function FieldWrapper({ label, children, error }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <Label
        className={`text-[10px] font-black uppercase tracking-widest ml-1 ${
          error ? "text-red-500" : "text-zinc-500"
        }`}
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

// ─── Role Labels ──────────────────────────────────────────────────────────────

const ROLES = [
  { value: "PRESTADOR_INDIVIDUAL", label: "Prestador Individual" },
  { value: "PRESTADOR_COLECTIVO", label: "Prestador Colectivo" },
  { value: "CLIENTE_INDIVIDUAL", label: "Cliente Individual" },
  { value: "CLIENTE_COLECTIVO", label: "Cliente Colectivo" },
];

// ─── Step Fields Map ──────────────────────────────────────────────────────────

const STEP_FIELDS: Record<number, (keyof SignUpFormData)[]> = {
  1: ["nome", "profissao", "nif", "celular", "palavraPasse"],
  2: ["provincia", "municipio", "role"],
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function SignUp() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const navigate = useNavigate();

  const { data: profissao } = useQuery({
    queryKey: ["profissao"],
    queryFn: GetProfission,
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: { termo_privacidade: false },
  });

  const provinciaSelected = watch("provincia");

  const municipios = provinciaSelected
    ? provinceMunicipalityMap[provinciaSelected] ?? []
    : [];

  const { mutateAsync: registerUser, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Conta criada com sucesso! Bem-vindo.");
      navigate("/sign-in");
    },
    onError: () => toast.error("Erro ao registar. Verifique os dados e tente novamente."),
  });

  const nextStep = async () => {
    const fields = STEP_FIELDS[step];
    if (!fields) return;

    const isValid = await trigger(fields);
    if (!isValid) return;

    if (step === 2 && !photo) {
      toast.error("Selecione uma foto de perfil antes de continuar.");
      return;
    }

    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  async function handleRegisterUsers(data: SignUpFormData) {
  const { termo_privacidade, ...userData } = data;

  await registerUser({ 
    ...userData, 
    image_path: photo,
    // Forçamos o TypeScript a tratar a string como o tipo esperado
    role: userData.role as "PRESTADOR_INDIVIDUAL" | "PRESTADOR_COLECTIVO" | "CLIENTE_INDIVIDUAL" | "CLIENTE_COLECTIVO" | "ADMIN"
  });
}
  // ─── Input Class Helper ────────────────────────────────────────────────────

  const inputClass = (hasError: boolean) =>
    `h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl transition-colors ${
      hasError
        ? "border-red-500 bg-red-50/30 dark:bg-red-900/10"
        : "border-zinc-200 dark:border-zinc-800 focus-within:border-orange-400"
    }`;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Helmet title="Criar Conta | Liberal" />

      <div className="w-full max-w-[480px] space-y-6 relative -top-24">

        {/* Header */}
        <div className="text-center lg:text-left space-y-1">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tight dark:text-white"
          >
            Criar conta <span className="text-orange-500">grátis</span>
          </motion.h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Junte-se à maior rede de serviços de Angola.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  step >= s ? "bg-orange-500" : "bg-zinc-200 dark:bg-zinc-800"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex text-[9px] font-black uppercase tracking-widest text-zinc-400 -mt-4">
          <span className={`flex-1 ${step === 1 ? "text-orange-500" : ""}`}>Dados</span>
          <span className={`flex-1 text-center ${step === 2 ? "text-orange-500" : ""}`}>
            Localização
          </span>
          <span className={`flex-1 text-right ${step === 3 ? "text-orange-500" : ""}`}>
            Termos
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleRegisterUsers)} className="relative overflow-visible">
          <AnimatePresence mode="wait" custom={direction}>

            {/* ── STEP 1: Dados Pessoais ─────────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                {/* Nome */}
                <FieldWrapper label="Nome Completo / Empresa" error={!!errors.nome}>
                  <div className="relative group">
                    <User
                      className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                        errors.nome
                          ? "text-red-500"
                          : "text-zinc-400 group-focus-within:text-orange-500"
                      }`}
                    />
                    <Input
                      {...register("nome", { required: "O nome é obrigatório" })}
                      placeholder="Ex: João Manuel ou Liberal Lda"
                      className={`${inputClass(!!errors.nome)} pl-12`}
                    />
                  </div>
                  {errors.nome && (
                    <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.nome.message}</p>
                  )}
                </FieldWrapper>

                {/* Profissão */}
                <FieldWrapper label="Área de Atuação" error={!!errors.profissao}>
                  <Controller
                    name="profissao"
                    control={control}
                    rules={{ required: "Selecione a área de atuação" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className={`${inputClass(!!errors.profissao)} pl-12 relative`}
                        >
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                          <SelectValue placeholder="O que você faz?" />
                        </SelectTrigger>
                        <SelectContent>
                          {profissao?.profissao?.map((p: { titulo: string }) => (
                            <SelectItem key={p.titulo} value={p.titulo}>
                              {p.titulo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.profissao && (
                    <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.profissao.message}</p>
                  )}
                </FieldWrapper>

                {/* NIF + Telefone */}
                <div className="grid grid-cols-2 gap-4">
                  {/* NIF */}
                  <FieldWrapper label="NIF" error={!!errors.nif}>
                    <div className="relative group">
                      <CreditCard
                        className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                          errors.nif
                            ? "text-red-500"
                            : "text-zinc-400 group-focus-within:text-orange-500"
                        }`}
                      />
                      <Input
                        {...register("nif", {
                          required: "NIF obrigatório",
                          pattern: {
                            value: /^\d{9,14}$/,
                            message: "NIF inválido (9 a 14 dígitos)",
                          },
                        })}
                        placeholder="000000000"
                        maxLength={14}
                        className={`${inputClass(!!errors.nif)} pl-10 text-sm`}
                      />
                    </div>
                    {errors.nif && (
                      <p className="text-[10px] text-red-500 ml-1 mt-0.5 leading-tight">
                        {errors.nif.message}
                      </p>
                    )}
                  </FieldWrapper>

                  {/* Telefone */}
                  <FieldWrapper label="Telefone" error={!!errors.celular}>
                    <div className="relative group">
                      <Phone
                        className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                          errors.celular
                            ? "text-red-500"
                            : "text-zinc-400 group-focus-within:text-orange-500"
                        }`}
                      />
                      <Input
                        {...register("celular", {
                          required: "Telefone obrigatório",
                          pattern: {
                            value: /^9\d{8}$/,
                            message: "Deve começar com 9 e ter 9 dígitos",
                          },
                          maxLength: { value: 9, message: "Máximo 9 dígitos" },
                        })}
                        placeholder="9xx xxx xxx"
                        maxLength={9}
                        inputMode="numeric"
                        className={`${inputClass(!!errors.celular)} pl-10 text-sm`}
                      />
                    </div>
                    {errors.celular && (
                      <p className="text-[10px] text-red-500 ml-1 mt-0.5 leading-tight">
                        {errors.celular.message}
                      </p>
                    )}
                  </FieldWrapper>
                </div>

                {/* Palavra-Passe */}
                <FieldWrapper label="Palavra-Passe" error={!!errors.palavraPasse}>
                  <Input
                    type="password"
                    {...register("palavraPasse", {
                      required: "A palavra-passe é obrigatória",
                      minLength: {
                        value: 6,
                        message: "Mínimo de 6 caracteres",
                      },
                    })}
                    placeholder="••••••••"
                    className={inputClass(!!errors.palavraPasse)}
                  />
                  {errors.palavraPasse && (
                    <p className="text-xs text-red-500 ml-1 mt-0.5">
                      {errors.palavraPasse.message}
                    </p>
                  )}
                </FieldWrapper>

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full h-14 bg-zinc-900 dark:bg-white dark:text-black hover:bg-zinc-800 rounded-2xl font-bold group mt-2"
                >
                  Próximo Passo{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {/* ── STEP 2: Localização + Foto ─────────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                {/* Província + Município */}
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrapper label="Província" error={!!errors.provincia}>
                    <Controller
                      name="provincia"
                      control={control}
                      rules={{ required: "Selecione a província" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={inputClass(!!errors.provincia)}>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(provinceMunicipalityMap).map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Município" error={!!errors.municipio}>
                    <Controller
                      name="municipio"
                      control={control}
                      rules={{ required: "Selecione o município" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!provinciaSelected}
                        >
                          <SelectTrigger className={inputClass(!!errors.municipio)}>
                            <SelectValue
                              placeholder={
                                provinciaSelected ? "Selecione" : "Escolha a província"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {municipios.map((m: string) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FieldWrapper>
                </div>

                {/* Tipo de Conta */}
                <FieldWrapper label="Tipo de Conta" error={!!errors.role}>
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: "Selecione o tipo de conta" }}
                    render={({ field }) => (
                      <div
                        className={`grid grid-cols-2 gap-2 p-1.5 border-2 rounded-2xl transition-colors ${
                          errors.role
                            ? "border-red-500"
                            : "border-zinc-100 dark:border-zinc-800"
                        }`}
                      >
                        {ROLES.map(({ value, label }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => field.onChange(value)}
                            className={`p-3 text-[10px] font-bold rounded-xl border-2 transition-all ${
                              field.value === value
                                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                                : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-orange-300"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                  {errors.role && (
                    <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.role.message}</p>
                  )}
                </FieldWrapper>

                {/* Foto de Perfil */}
                <FieldWrapper label="Foto de Perfil ou Logo">
                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer transition-all hover:bg-orange-50/10 ${
                      photo
                        ? "border-orange-500 bg-orange-50/10"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    {photo ? (
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="Preview"
                        className="h-full w-full object-cover rounded-3xl"
                      />
                    ) : (
                      <>
                        <Camera className="h-8 w-8 mb-2 text-zinc-400" />
                        <p className="text-xs text-zinc-500 font-medium">
                          Clique para carregar
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">PNG, JPG até 5MB</p>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    />
                  </label>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="text-[10px] text-zinc-400 hover:text-red-500 transition-colors ml-1 mt-1"
                    >
                      Remover foto
                    </button>
                  )}
                </FieldWrapper>

                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="h-14 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 h-14 bg-zinc-900 dark:bg-white dark:text-black rounded-2xl font-bold group"
                  >
                    Próximo Passo{" "}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Termos ────────────────────────────────────────── */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 bg-orange-500/10 rounded-full">
                    <ShieldCheck className="h-8 w-8 text-orange-500" />
                  </div>
                  <h2 className="text-xl font-black italic uppercase tracking-tighter">
                    Termos e Privacidade
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4">
                    Leia atentamente as políticas da plataforma Liberal.
                  </p>
                </div>

                {/* Scroll de Termos */}
                <div
                  className={`h-56 overflow-y-auto p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border-2 transition-all shadow-inner ${
                    errors.termo_privacidade
                      ? "border-red-500"
                      : "border-zinc-100 dark:border-zinc-800"
                  }`}
                >
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-4 leading-relaxed">
                    <TermsSection title="1. IDENTIFICAÇÃO DA PLATAFORMA">
                      A LIBERAL é uma plataforma digital e marca pertencente à LISA HELP SECURITY,
                      PRESTAÇÃO DE SERVIÇOS, LDA., sociedade por quotas, regularmente constituída e
                      registada sob o n.º 31445-25/250829, pessoa colectiva de direito privado, nos
                      termos da legislação da República de Angola. A LIBERAL actua como: (1)
                      plataforma digital de intermediação de serviços profissionais; (2) ambiente
                      tecnológico para anúncios de serviços; (3) ferramenta de contacto entre
                      Clientes e Prestadores. A LIBERAL não presta directamente os serviços
                      anunciados, limitando-se a disponibilizar a infraestrutura tecnológica
                      necessária à intermediação.
                    </TermsSection>

                    <TermsSection title="2. ACEITAÇÃO DOS TERMOS">
                      O acesso e utilização da Plataforma implica a aceitação integral dos presentes
                      Termos e Condições. Quem não concordar com os presentes Termos deverá abster-se
                      de utilizar a Plataforma.
                    </TermsSection>

                    <TermsSection title="3. OBJECTO DOS SERVIÇOS">
                      A LIBERAL tem por objecto: a) Permitir que Clientes publiquem pedidos de serviços;
                      b) Possibilitar que Prestadores acedam a oportunidades de trabalho mediante uso de
                      créditos internos ("Moedas"); c) Facilitar o contacto directo entre Prestadores e
                      Clientes; d) Disponibilizar anúncios de serviços profissionais; e) Gerir um sistema
                      interno de créditos.
                    </TermsSection>

                    <TermsSection title="4. NATUREZA DA PLATAFORMA">
                      A LIBERAL actua exclusivamente como intermediária tecnológica. Não existe qualquer
                      relação laboral entre a LIBERAL e os Prestadores. Os contratos são celebrados
                      exclusivamente entre Cliente e Prestador. A LIBERAL não garante resultados,
                      qualidade, prazos ou valores dos serviços contratados.
                    </TermsSection>

                    <TermsSection title="5. CAPACIDADE PARA UTILIZAÇÃO">
                      Apenas podem utilizar a Plataforma pessoas singulares maiores de idade ou pessoas
                      colectivas legalmente constituídas. É proibida a utilização por menores. Cada
                      Utilizador pode manter apenas uma conta, vinculada a um único número de telefone,
                      e-mail ou NIF.
                    </TermsSection>

                    <TermsSection title="6. SISTEMA DE MOEDAS (CRÉDITOS INTERNOS)">
                      A LIBERAL utiliza um sistema interno de créditos denominado "Moedas". As Moedas
                      são pessoais e intransmissíveis, não são convertíveis em dinheiro e têm validade
                      definida conforme o plano adquirido.
                    </TermsSection>

                    <TermsSection title="7. CONTEÚDOS E SERVIÇOS PROIBIDOS">
                      É expressamente proibido: a) Anunciar serviços ilegais; b) Publicar conteúdos
                      ofensivos ou ilícitos; c) Utilizar a Plataforma para venda ou aluguer de bens;
                      d) Inserir contactos externos nos anúncios; e) Praticar fraude ou manipulação do
                      sistema.
                    </TermsSection>

                    <TermsSection title="8. REGISTO E CONTA DO UTILIZADOR">
                      O Utilizador é responsável pela veracidade dos dados fornecidos. O acesso à conta
                      é pessoal e intransmissível. É proibida a venda, cedência ou aluguer de contas.
                    </TermsSection>

                    <TermsSection title="9. SISTEMA DE AVALIAÇÕES">
                      Os Prestadores estão sujeitos a avaliações dos Clientes. A LIBERAL pode suspender
                      contas com avaliações negativas reiteradas. A LIBERAL não se responsabiliza pelo
                      conteúdo das avaliações.
                    </TermsSection>

                    <TermsSection title="10. OBRIGAÇÕES DOS UTILIZADORES">
                      Os Utilizadores obrigam-se a: a) Cumprir a legislação aplicável; b) Assumir todas
                      as obrigações fiscais, laborais e contratuais; c) Emitir ou exigir facturação nos
                      termos legais; d) Actuar de boa-fé nas negociações.
                    </TermsSection>

                    <TermsSection title="11. RESPONSABILIDADE DA PLATAFORMA">
                      A LIBERAL não se responsabiliza por: execução ou qualidade dos serviços; danos
                      decorrentes de negociações entre Utilizadores; falhas de internet ou sistemas;
                      conteúdos publicados por terceiros.
                    </TermsSection>

                    <TermsSection title="12. PROPRIEDADE INTELECTUAL">
                      Todos os direitos sobre a marca LIBERAL, logótipos, layout, sistemas, conteúdos e
                      software pertencem à LISA HELP SECURITY, LDA., sendo proibida a sua utilização sem
                      autorização expressa.
                    </TermsSection>

                    <TermsSection title="13. SANÇÕES">
                      A LIBERAL pode, a seu critério: advertir, suspender temporariamente ou excluir
                      definitivamente contas e cancelar anúncios e créditos, sem direito a indemnização.
                    </TermsSection>

                    <TermsSection title="14. INDEMNIZAÇÃO">
                      O Utilizador obriga-se a indemnizar a LIBERAL por quaisquer danos, custos ou
                      processos resultantes do uso indevido da Plataforma ou violação destes Termos.
                    </TermsSection>

                    <TermsSection title="15. DADOS PESSOAIS RECOLHIDOS">
                      A LIBERAL recolhe apenas os dados necessários ao funcionamento da plataforma,
                      incluindo: nome completo, contactos (telefone e e-mail), localização, endereço IP,
                      dados de perfil, dados da carteira digital e histórico de operações.
                    </TermsSection>

                    <TermsSection title="16. FINALIDADE DO TRATAMENTO">
                      Os dados são utilizados para criar e gerir contas, facilitar contacto entre
                      utilizadores, processar créditos e recargas, melhorar a experiência, prevenir
                      fraudes e cumprir obrigações legais. A LIBERAL não vende dados pessoais.
                    </TermsSection>

                    <TermsSection title="17. DIREITOS DO TITULAR DOS DADOS">
                      O Utilizador tem direito a: acesso e rectificação; eliminação (quando legalmente
                      possível); oposição ou limitação do tratamento; retirada do consentimento.
                    </TermsSection>

                    <TermsSection title="18. SEGURANÇA DA INFORMAÇÃO">
                      A LIBERAL adopta medidas técnicas e organizativas adequadas para proteger os dados
                      pessoais, incluindo controlo de acessos, criptografia e monitorização contínua.
                    </TermsSection>

                    <TermsSection title="19. COOKIES">
                      A Plataforma utiliza cookies para garantir funcionamento, melhorar a experiência e
                      analisar padrões de uso. O Utilizador pode gerir cookies no seu navegador.
                    </TermsSection>

                    <TermsSection title="20. ALTERAÇÕES AO DOCUMENTO">
                      Este documento pode ser alterado a qualquer momento. As alterações produzem efeitos
                      após 8 dias a contar da publicação na Plataforma.
                    </TermsSection>

                    <TermsSection title="21. LEI APLICÁVEL E FORUM">
                      O presente documento rege-se pelas leis da República de Angola. Fica eleito o Forum
                      da Comarca de Belas, com exclusão de qualquer outro.
                    </TermsSection>

                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-6 text-[9px] text-zinc-400 leading-relaxed italic">
                      <p>
                        © 2025 – LIBERAL | LISA HELP SECURITY, LDA. Luanda, Município do Camama,
                        Bairro Antigos Guerrilheiros, Rua e Casa s/n.º, próximo ao Supermercado
                        Deskontão. Contacto: 926 135 066. Todos os direitos reservados.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkbox de Aceitação */}
                <div
                  className={`flex items-start space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    errors.termo_privacidade
                      ? "border-red-500 bg-red-50/50 dark:bg-red-900/10"
                      : "border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
                  }`}
                >
                  <Controller
                    name="termo_privacidade"
                    control={control}
                    rules={{ required: "Deve aceitar os termos para continuar" }}
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5 border-orange-500 data-[state=checked]:bg-orange-500 rounded-md"
                      />
                    )}
                  />
                  <label
                    htmlFor="terms"
                    className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 cursor-pointer leading-tight"
                  >
                    Li e aceito integralmente os{" "}
                    <span className="text-orange-500">Termos de Uso</span> e a{" "}
                    <span className="text-orange-500">Política de Privacidade</span> da Liberal.
                  </label>
                </div>
                {errors.termo_privacidade && (
                  <p className="text-xs text-red-500 ml-1 -mt-3">
                    {errors.termo_privacidade.message}
                  </p>
                )}

                {/* Ações */}
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="h-14 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black italic uppercase tracking-tighter text-lg shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all"
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin h-6 w-6" />
                    ) : (
                      <span className="flex items-center gap-2">
                        Finalizar Registo <CheckCircle2 size={20} />
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="text-center text-sm text-zinc-500 pt-2">
          Já tem conta?{" "}
          <Link to="/sign-in" className="text-orange-500 font-bold hover:underline">
            Fazer Login
          </Link>
        </p>
      </div>
    </>
  );
}

// ─── Terms Section Helper Component ──────────────────────────────────────────

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1 text-[10px]">
        {title}
      </h4>
      <p className="leading-relaxed">{children}</p>
    </section>
  );
}