import servico1 from '@/assets/IMG-20250928-WA0054.jpg'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

export function Electricidade() {
  return (
    <div className="relative -mx-10  w-[40rem] h-56 md:h-72 lg:h-96">
      {/* Imagem de capa */}
      <img
        className="w-full h-full object-cover"
        src={servico1}
        alt="Madeira e Oficios"
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Texto centralizado */}
      <div className="absolute inset-0 flex items-center  right-56 justify-center">
        <h2 className="text-white text-xl font-bold">Eletricidade & Manuntencão</h2>
       
      </div>
       <div className='flex flex-col relative right-32 gap-3 mt-3 e justify-center items-center'>
          <div className='flex items-center justify-between gap-36'>
                 <Button variant='outline' className='w-80 flex'>
                    <span className='text-orange-600'>Electricista</span>
                 <ChevronRight className='text-orange-600'/>
                 </Button>
          </div>
           <div className='flex items-center justify-between gap-36'>
                 <Button variant='outline' className='w-80 flex'>
                    <span className='text-orange-600'>Radiotécnico</span>
                 <ChevronRight className='text-orange-600'/>
                 </Button>
          </div>
           <div className='flex items-center justify-between gap-36'>
                 <Button variant='outline' className='w-80 flex'>
                    <span className='text-orange-600'>Técnico de Frio & Climatização</span>
                 <ChevronRight className='text-orange-600'/>
                 </Button>
          </div>
        </div>
    </div>
  )
}
