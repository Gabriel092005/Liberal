import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export function Historico(){
     return(
      <Table>
                      <TableHeader>
                        <TableRow>
                            <TableHead>Realizado Há</TableHead>
                            <TableHead>Catégoria</TableHead>
                            <TableHead>Quantia</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                          <TableRow>
                            <TableCell>20min</TableCell>
                            <TableCell>Crédito</TableCell>
                            <TableCell className="text-green-400">+1000.00kz</TableCell>
                          </TableRow>
                           <TableRow>
                            <TableCell>1min</TableCell>
                            <TableCell>Crédito</TableCell>
                            <TableCell className="text-red-400">-1000.00kz</TableCell>
                          </TableRow>
                           <TableRow>
                            <TableCell>1min</TableCell>
                            <TableCell>Crédito</TableCell>
                            <TableCell className="text-green-400">+1000.00kz</TableCell>
                          </TableRow>
                           <TableRow>
                            <TableCell>1min</TableCell>
                            <TableCell>Débito</TableCell>
                            <TableCell className="text-red-400">-1000.00kz</TableCell>
                          </TableRow>
                      </TableBody>
                  </Table>
     )
}