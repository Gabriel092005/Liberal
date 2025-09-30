import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


export function SignIn() {
   const variants = {
    enter: { x: 50, opacity: 0, scale: 0.95 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -50, opacity: 0, scale: 0.95 },
  };

  return (
    <>
      <Helmet title="Login" />
 
      <div className="p-8">
        <div className="w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Acessar Painel</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe sua saúde pelo seu painel
            </p>
          </div>
          <form className="space-y-4" >
               <motion.div
                              key="step1"
                              variants={variants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              className="space-y-4"
                            >
            <div>
              <Label htmlFor="">Palavra Passe</Label>
              <Input placeholder="Palavra-Passe"></Input>
            </div>
              <div>
              <Label htmlFor="">E-mail</Label>
              <Input placeholder="exemplo@gmail.com"></Input>
            </div>
               <Link to='/'>
                <Button className="flex flex-1 w-full mt-4" variant='default'>Acessar</Button>
               </Link>
                          </motion.div>
                   
        
         
          </form>
          <span className="text-muted-foreground text-xs">Se ainda não tiver uma conta deve <Link className="border-b border-solid text-blue-400" to='/sign-up'>registar-se</Link> primeiro para poder navegar normalmente e obter oportunidades.</span>
        </div>
      </div>
    </>
  );
}

