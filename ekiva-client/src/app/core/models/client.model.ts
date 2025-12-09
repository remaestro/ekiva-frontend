export enum ClientType {
  Individual = 'Individual',
  Company = 'Company'
}

export interface Client {
  id: string;
  referenceNumber: string;
  type: ClientType;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  
  // Individual fields
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: string;
  profession?: string;
  
  // Company fields
  companyName?: string;
  taxId?: string;
  tradeRegister?: string;
  contactPersonName?: string;
  
  fullName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateClientRequest {
  type: ClientType;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  
  // Individual fields
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: string;
  profession?: string;
  
  // Company fields
  companyName?: string;
  taxId?: string;
  tradeRegister?: string;
  contactPersonName?: string;
}

export interface UpdateClientRequest extends CreateClientRequest {}

export interface ClientSearchRequest {
  searchTerm?: string;
  type?: ClientType;
  city?: string;
  pageNumber: number;
  pageSize: number;
}

export interface ClientSearchResponse {
  data: Client[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ClientStats {
  total: number;
  individual: number;
  company: number;
  recentClients: Array<{
    id: string;
    referenceNumber: string;
    fullName: string;
    type: ClientType;
    createdAt: Date;
  }>;
}
