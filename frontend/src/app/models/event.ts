export interface Address {
  street: string;
  city: string;
  governorate: string;
  zipcode: string;
}

export interface Event {

    id:number;
    titre:string;
    description:string;
    date:Date;
    lieu:string;
    prix:number;
    organisateurId:number;
    imageUrl:string;
    nbPlaces:number;
    nbrLikes:number;
    domaines?: string[];
    detailedAddress?: Address;


} 
