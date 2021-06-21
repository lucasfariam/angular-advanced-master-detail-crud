import { InMemoryDbService } from "angular-in-memory-web-api"

import { Category } from "./pages/categories/shared/caterory.model"

 export class InMemoruDatabase implements InMemoryDbService {
     createDb(){
         const categories = [
             { id: 1, name: "Moradia", description: "Pagamento de aluguel" },
             { id: 2, name: "Saude", description: "Remedios e vitaminas" },
             { id: 3, name: "Lazer", description: "Saidas do fim de semana" },
             { id: 4, name: "Comida", description: "Alimentos do mes" },
             { id: 5, name: "Freelas", description: "Trabalho freelance" }
         ];
         return { categories }
     }
 }