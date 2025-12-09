export enum DistributorType {
  InternalAgent = 'InternalAgent',
  GeneralAgent = 'GeneralAgent',
  Broker = 'Broker',
  Bancassurance = 'Bancassurance'
}

export interface Distributor {
  id: string;
  code: string;
  name: string;
  type: DistributorType;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateDistributorRequest {
  name: string;
  type: DistributorType;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
}

export interface UpdateDistributorRequest extends CreateDistributorRequest {}

export interface DistributorSearchRequest {
  searchTerm?: string;
  type?: DistributorType;
  isActive?: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface DistributorSearchResponse {
  data: Distributor[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DistributorStats {
  total: number;
  active: number;
  inactive: number;
  byType: {
    internalAgent: number;
    generalAgent: number;
    broker: number;
    bancassurance: number;
  };
  recentDistributors: Array<{
    id: string;
    code: string;
    name: string;
    type: DistributorType;
    isActive: boolean;
    createdAt: Date;
  }>;
}
