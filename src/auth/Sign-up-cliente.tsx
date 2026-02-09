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
  ShieldCheck,
  User
} from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const formVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)"
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.3 }
  })
};

export function SignUp() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<File | null>(null);

  const { data: profissao } = useQuery({
    queryKey: ['profissao'],
    queryFn: GetProfission
  });

  const { register, control, handleSubmit, trigger, formState: { errors } } = useForm<any>({
    defaultValues: { termo_privacidade: false }
  });

  const { mutateAsync: registerUser, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success('Conta criada com sucesso! Bem-vindo.');
      navigate("/sign-in");
    },
    onError: () => toast.error("Erro ao registrar. Verifique os dados.")
  });

  const nextStep = async () => {
    let fields: any[] = [];
    if (step === 1) fields = ['nome', 'profissao', 'nif', 'celular', 'palavraPasse'];
    if (step === 2) fields = ['provincia', 'municipio', 'role'];

    const isValid = await trigger(fields);
    if (isValid) {
      if (step === 2 && !photo) return toast.error("Selecione uma foto de perfil.");
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => { setDirection(-1); setStep((prev) => prev - 1); };

  async function handleRegisterUsers(data: any) {
    // Destruturação para isolar o termo_privacidade e NÃO enviá-lo ao backend
    const { termo_privacidade, ...userData } = data;
    await registerUser({ ...userData, image_path: photo });
  }

  return (
    <>
      <Helmet title="Criar Conta | Liberal" />
      
      <div className="w-full max-w-[480px] space-y-2 relative -top-24">
        <div className="text-center lg:text-left space-y-2">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black tracking-tight dark:text-white">
            Criar conta <span className="text-orange-500">grátis</span>
          </motion.h1>
          <p className="text-zinc-500 dark:text-zinc-400">Junte-se à maior rede de serviços de Angola.</p>
        </div>

        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit(handleRegisterUsers)} className="relative overflow-visible">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={formVariants} initial="enter" animate="center" exit="exit" className="space-y-1">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Nome Completo / Empresa</Label>
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${errors.nome ? 'text-red-500' : 'text-zinc-400 group-focus-within:text-orange-500'}`} />
                    <Input {...register('nome', { required: true })} placeholder="Ex: João Manuel ou Liberal Lda" className={`pl-12 h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.nome ? 'border-red-500 bg-red-50/50' : 'border-zinc-200 dark:border-zinc-800'}`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Área de Atuação</Label>
                  <Controller name="profissao" control={control} rules={{ required: true }} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={`h-14 pl-12 relative bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.profissao ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'}`}>
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <SelectValue placeholder="O que você faz?" />
                      </SelectTrigger>
                      <SelectContent>{profissao?.profissao?.map((p: any) => <SelectItem key={p.titulo} value={p.titulo}>{p.titulo}</SelectItem>)}</SelectContent>
                    </Select>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Telefone</Label>
  <Input 
    {...register('celular', { 
      required: "O telefone é obrigatório",
      pattern: {
        value: /^9\d{8}$/,
        message: "O telefone deve começar com 9 e ter 9 dígitos"
      },
      maxLength: {
        value: 9,
        message: "O telefone não pode ter mais de 9 dígitos"
      }
    })} 
    placeholder="9xx..." 
    className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.celular ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'}`} 
  />
  {errors.celular && (
    <span className="text-xs text-red-500 ml-1">{errors.celular.message as string}</span>
  )}
</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Palavra-Passe</Label>
                  <Input type="password" {...register('palavraPasse', { required: true, minLength: 6 })} placeholder="••••••••" className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.palavraPasse ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'}`} />
                </div>

                <Button type="button" onClick={nextStep} className="w-full h-14 bg-zinc-900 dark:bg-white dark:text-black hover:bg-zinc-800 rounded-2xl font-bold group">
                  Próximo Passo <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" custom={direction} variants={formVariants} initial="enter" animate="center" exit="exit" className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Província</Label>
                    <Controller name="provincia" control={control} rules={{ required: true }} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.provincia ? 'border-red-500' : 'border-zinc-200'}`}><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{Object.keys(provinceMunicipalityMap).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                      </Select>
                    )} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Município</Label>
                    <Controller name="municipio" control={control} rules={{ required: true }} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.municipio ? 'border-red-500' : 'border-zinc-200'}`}><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent><SelectItem value="Viana">Viana</SelectItem><SelectItem value="Belas">Belas</SelectItem></SelectContent>
                      </Select>
                    )} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1 text-center block">Tipo de Conta</Label>
                  <Controller name="role" control={control} rules={{ required: true }} render={({ field }) => (
                    <div className={`grid grid-cols-2 gap-2 p-1 border-2 rounded-2xl ${errors.role ? 'border-red-500' : 'border-transparent'}`}>
                      {["PRESTADOR_INDIVIDUAL", "PRESTADOR_COLECTIVO", "CLIENTE_INDIVIDUAL", "CLIENTE_COLECTIVO"].map((r) => (
                        <button key={r} type="button" onClick={() => field.onChange(r)} className={`p-3 text-[10px] font-bold rounded-xl border transition-all ${field.value === r ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}>
                          {r.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  )} />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1 text-center block">Foto de Perfil ou Logo</Label>
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer transition-colors ${photo ? 'border-orange-500 bg-orange-50/10' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50'}`}>
                    <Camera className={`h-8 w-8 mb-2 ${photo ? 'text-orange-500' : 'text-zinc-400'}`} />
                    <p className="text-xs text-zinc-500 font-medium">{photo ? photo.name : "Clique para carregar"}</p>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-6 rounded-2xl border-zinc-200"><ArrowLeft className="h-4 w-4" /></Button>
                  <Button type="button" onClick={nextStep} className="flex-1 h-14 bg-zinc-900 dark:bg-white dark:text-black rounded-2xl font-bold">Próximo Passo <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
             <motion.div key="step3" custom={direction} variants={formVariants} initial="enter" animate="center" exit="exit" className="space-y-5">
  <div className="flex flex-col items-center text-center space-y-2">
    <div className="p-3 bg-orange-500/10 rounded-full">
      <ShieldCheck className="h-8 w-8 text-orange-500" />
    </div>
    <h2 className="text-xl font-black italic uppercase tracking-tighter">Termos e Privacidade</h2>
    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4">
      Leia atentamente as políticas da plataforma Liberal.
    </p>
  </div>

  {/* Container de Termos com Scroll - Texto Oficial Adaptado */}
  <div className={`h-56 overflow-y-auto p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border-2 transition-all shadow-inner ${errors.termo_privacidade ? 'border-red-500' : 'border-zinc-100 dark:border-zinc-800'}`}>
    <div className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-4 leading-relaxed">
      
      <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">1.IDENTIFICAÇÃO DA PLATAFORMA</h4>
        <p>A LIBERAL é uma plataforma digital e marca pertencente à LISA HELP SECURITY, PRESTAÇÃO DE 
SERVIÇOS, LDA., sociedade por quotas, regularmente constituída e registada sob o n.º 31445-25/250829, 
pessoa colectiva de direito privado, nos termos da legislação da República de Angola
<p>
<ol className="list-decimal list-inside space-y-2 ml-1">
  <li><span className="font-bold text-zinc-800 dark:text-zinc-200">Plataforma digital</span> de intermediação de serviços profissionais;</li>
  <li><span className="font-bold text-zinc-800 dark:text-zinc-200">Ambiente tecnológico</span> para anúncios de serviços;</li>
  <li><span className="font-bold text-zinc-800 dark:text-zinc-200">Ferramenta de contacto</span> entre Clientes e Prestadores.</li>
</ol>
<p>
  A LIBERAL não presta directamente os serviços anunciados, limitando-se a disponibilizar a infraestrutura 
tecnológica necessária à intermediação.
</p>
</p>
</p>
      </section>

      <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">2. ACEITAÇÃO DOS TERMOS</h4>
        <p>
          <div className="space-y-2">
  <p className="font-bold">A LIBERAL actua como:</p>
  <ol className="list-decimal list-inside space-y-1 ml-1">
    <li><span className="font-bold text-zinc-800 dark:text-zinc-200">Plataforma digital</span> de intermediação de serviços profissionais;</li>
    <li><span className="font-bold text-zinc-800 dark:text-zinc-200">Ambiente tecnológico</span> para anúncios de serviços;</li>
    <li><span className="font-bold text-zinc-800 dark:text-zinc-200">Ferramenta de contacto</span> entre Clientes e Prestadores.</li>
  </ol>
</div>
        </p>
      </section>

      <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">3. OBJECTO DOS SERVIÇOS</h4>
        <p>A LIBERAL tem por objecto:
a) Permitir que Clientes publiquem pedidos de serviços e solicitem orçamentos;
b) Possibilitar que Prestadores acedam a oportunidades de trabalho mediante uso de créditos internos 
(“Moedas”);
c) Facilitar o contacto directo entre Prestadores e Clientes;
d) Disponibilizar anúncios de serviços profissionais;
e) Gerir um sistema interno de créditos para acesso a funcionalidades da Plataforma.
A LIBERAL não interfere na negociação, contratação, execução ou pagamento dos serviços acordados 
entre os Utilizadores</p>
      </section>

      <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">4. NATUREZA DA PLATAFORMA</h4>
        <p> A LIBERAL actua exclusivamente como intermediária tecnológica;
b) Não existe qualquer relação laboral, societária ou de subordinação entre a LIBERAL e os Prestadores;
c) Os contratos são celebrados exclusivamente entre Cliente e Prestador; d) A LIBERAL não garante resultados, qualidade, prazos ou valores dos serviços contratados.</p>
      </section>

      <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">5.  CAPACIDADE PARA UTILIZAÇÃO</h4>
        <p>a) Apenas podem utilizar a Plataforma pessoas singulares maiores de idade ou pessoas colectivas legalmente constituídas;
b) É proibida a utilização por menores ou pessoas legalmente incapazes;
c) Cada Utilizador pode manter apenas uma conta, vinculada a um único número de telefone, e -m ail ou NIF.
A LIBERAL reserva -s e o direito de suspender ou eliminar contas duplicadas, falsas ou fraudulentas..</p>
      </section>

      
      <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">6.  SISTEMA DE MOEDAS (CRÉDITOS INTERNOS)</h4>
<p>
  A LIBERAL utiliza um sistema interno de créditos denominado “Moedas”;
As Moedas permitem, entre outros:
Acesso a contactos de Clientes;
Destaque de anúncios;
Activação de funcionalidades específicas;
As Moedas:
São pessoais e intransmissíveis;
Não são convertíveis em dinheiro;
Têm validade definida conforme o plano adquirido.
</p>
      </section>

            <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">7.  CONTEÚDOS E SERVIÇOS PROIBIDOS</h4>
<p>
É expressamente proibido: a) Anunciar serviços ilegais ou contrários à lei angolana;
b) Publicar conteúdos ofensivos, discriminatórios ou ilícitos;
c) Utilizar a Plataforma para venda ou aluguer de bens;
d) Inserir contactos externos nos anúncios;
e) Praticar fraude, manipulação do sistema ou actos abusivos.
A LIBERAL poderá remover conteúdos e suspender contas sem aviso prévio.
</p>
      </section>


            <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">8.  REGISTO E CONTA DO UTILIZADOR</h4>
<p>
  a) O Utilizador é responsável pela veracidade dos dados fornecidos;
b) A LIBERAL pode solicitar documentos adicionais para validação;
c) O acesso à conta é pessoal e intransmissível;
d) O Utilizador é responsável por todas as actividades realizadas na sua conta;
e) É proibida a venda, cedência ou aluguer de contas.
</p>
      </section>

               <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">9. SISTEMA DE AVALIAÇÕES</h4>
<p>
a) Os Prestadores estão sujeitos a avaliações dos Clientes;
b) As avaliações reflectem opiniões pessoais dos Utilizadores;
c) A LIBERAL pode suspender contas com avaliações negativas reiteradas;
d) A LIBERAL não se responsabiliza pelo conteúdo das avaliações.
</p>
      </section>     

                     <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">10.  OBRIGAÇÕES DOS UTILIZADORES</h4>
<p>
Os Utilizadores obrigam-se a: 
a) Cumprir a legislação aplicável;
b) Assumir todas as obrigações fiscais, laborais e contratuais;
c) Emitir ou exigir facturação nos termos legais;
d) Actuar de boa -f é nas negociações.
</p>
      </section>    

                           <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">11.   RESPONSABILIDADE DA PLATAFORMA</h4>
<p>
A LIBERAL não se responsabiliza por:
Execução ou qualidade dos serviços;
Danos decorrentes de negociações entre Utilizadores;
Falhas de internet, sistemas ou dispositivos do Utilizador;
Conteúdos publicados por terceiros.
</p>
      </section>       

                                <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">12.  PROPRIEDADE INTELECTUAL</h4>
<p>
Todos os direitos sobre a marca LIBERAL, logótipos, layout, sistemas, conteúdos e software pertencem à LISA HELP SECURITY, LDA., sendo proibida a sua utilização sem autorização expressa.
</p>
      </section>  

                                     <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">13.  SANÇÕES</h4>
<p>
    A LIBERAL pode, a seu critério:
Advertir;
Suspender temporariamente;
Excluir definitivamente contas;
Cancelar anúncios e créditos,
sem direito a indemnização.
</p>
      </section>    

                                        <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">14.  INDEMNIZAÇÃO</h4>
<p>
   O Utilizador obriga -s e a indemnizar a LIBERAL por quaisquer danos, custos ou processos resultantes do uso indevido da Plataforma ou violação destes Termos.
</p>
      </section>    


                                           <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">15.  DADOS PESSOAIS RECOLHIDOS</h4>
<p>
  A LIBERAL recolhe apenas os dados necessários ao funcionamento da plataforma, incluindo:
Nome completo;
Contactos (telefone e e-mail);
Localização;
Endereço IP;
Dados de perfil;
Dados da carteira digital e histórico de operações;
Dados técnicos de acesso e utilização.
</p>
      </section>  



                                           <section>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">16.  FINALIDADE DO TRATAMENTO</h4>
<p>
Os dados são utilizados para:
Criar e gerir contas;
Facilitar contacto entre utilizadores;
Processar créditos e recargas;
Melhorar a experiência do utilizador;
Prevenir fraudes;
Cumprir obrigações legais.
A LIBERAL não vende dados pessoais.
Os dados poderão ser partilhados apenas:
Com parceiros tecnológicos;
Para cumprimento de obrigações legais;
Mediante consentimento do titular.
</p>
      </section>  


 
      {/* 17. DIREITOS DO TITULAR DOS DADOS */}
<section>
  <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">17. DIREITOS DO TITULAR DOS DADOS</h4>
  <div className="space-y-1">
    <p>O Utilizador tem direito a:</p>
    <ul className="list-disc list-inside ml-2">
      <li>Acesso e Rectificação;</li>
      <li>Eliminação (quando legalmente possível);</li>
      <li>Oposição ou limitação do tratamento;</li>
      <li>Retirada do consentimento.</li>
    </ul>
  </div>
</section>

{/* 20. SEGURANÇA DA INFORMAÇÃO */}
<section>
  <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">18. SEGURANÇA DA INFORMAÇÃO</h4>
  <p>
    A LIBERAL adopta medidas técnicas e organizativas adequadas para proteger os dados pessoais, incluindo 
    controlo de acessos, criptografia e monitorização contínua.
  </p>
</section>

{/* 21. COOKIES */}
<section>
  <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">19. COOKIES</h4>
  <p>
    A Plataforma utiliza cookies para garantir funcionamento, melhorar a experiência e analisar padrões de uso. 
    O Utilizador pode gerir cookies no seu navegador.
  </p>
</section>

{/* 22. ALTERAÇÕES AO DOCUMENTO */}
<section>
  <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">20. ALTERAÇÕES AO DOCUMENTO</h4>
  <p>
    Este documento pode ser alterado a qualquer momento. As alterações produzem efeitos após 8 dias a contar 
    da publicação na Plataforma.
  </p>
</section>

{/* 23. LEI APLICÁVEL E FORUM */}
<section>
  <h4 className="font-black text-zinc-900 dark:text-white uppercase mb-1">21. LEI APLICÁVEL E FORUM</h4>
  <p>
    O presente documento rege-se pelas leis da República de Angola. Fica eleito o Forum da Comarca de Belas, 
    com exclusão de qualquer outro.
  </p>
</section>

{/* RODAPÉ JURÍDICO / COPYRIGHT */}
<div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-6 text-[9px] text-zinc-400 leading-relaxed italic">
  <p>
    © 2025 – LIBERAL | LISA HELP SECURITY, LDA. Luanda, Município do Camama, Bairro Antigos 
    Guerrilheiros, Rua e Casa s/n.º, próximo ao Supermercado Deskontão. 
    <br />
    Contacto: 926 135 066. Todos os direitos reservados.
  </p>
</div>
    </div>
  </div>

  {/* Checkbox de Aceitação */}
  <div className={`flex items-start space-x-3 p-4 rounded-2xl border-2 transition-all ${errors.termo_privacidade ? 'border-red-500 bg-red-50/50' : 'border-transparent bg-zinc-50/50 dark:bg-zinc-900/50'}`}>
    <Controller 
      name="termo_privacidade" 
      control={control} 
      rules={{ required: true }} 
      render={({ field }) => (
        <Checkbox 
          id="terms" 
          checked={field.value} 
          onCheckedChange={field.onChange} 
          className="mt-1 border-orange-500 data-[state=checked]:bg-orange-500 rounded-md" 
        />
      )} 
    />
    <label htmlFor="terms" className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 cursor-pointer leading-tight">
      Li e aceito integralmente os <span className="text-orange-500">Termos de Uso</span> e a <span className="text-orange-500">Política de Privacidade</span> da Liberal.
    </label>
  </div>

  {/* Ações */}
  <div className="flex gap-3 pt-2">
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
        <span className="flex items-center gap-2">Finalizar Registo <CheckCircle2 size={20} /></span>
      )}
    </Button>
  </div>
</motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="text-center text-sm text-zinc-500 pt-4">
          Já tem conta? <Link to="/sign-in" className="text-orange-500 font-bold hover:underline">Fazer Login</Link>
        </p>
      </div>
    </>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);