export interface VehicleMake {
  id: string;
  code: string;
  name: string;
  models: VehicleModel[];
}

export interface VehicleModel {
  id: string;
  code: string;
  name: string;
  makeId: string;
  makeName: string;
}

export interface VehicleCategory {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

export interface ProfessionalCategory {
  id: string;
  code: string;
  name: string;
  discountPercentage: number;
}
