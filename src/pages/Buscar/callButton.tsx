import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface CallButtonProps {
  phoneNumber: string;
}

export function CallButton({ phoneNumber }: CallButtonProps) {
  return (
    <a href={`tel:${phoneNumber}`} className="no-underline">
      <Button className="flex items-center gap-2">
        <Phone size={18} />
        Ligar
      </Button>
    </a>
  );
}
