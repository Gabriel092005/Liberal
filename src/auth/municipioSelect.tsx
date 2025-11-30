import { Controller } from "react-hook-form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { provinceMunicipalityMap } from "@/data/province";


export function MunicipioSelect({ control, selectedProvince }: { control: any; selectedProvince?: string }) {
  return (
    <Controller
      control={control}
      name="municipio"
      render={({ field: { name, onChange, value } }) => (
        <Select value={value} onValueChange={onChange} name={name} disabled={!selectedProvince}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o município" />
          </SelectTrigger>

          <SelectContent>
            {selectedProvince && provinceMunicipalityMap[selectedProvince] ? (
              provinceMunicipalityMap[selectedProvince].map((municipio) => (
                <SelectItem key={municipio} value={municipio}>
                  {municipio}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="">
                Selecione uma província primeiro
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
    />
  )
}
