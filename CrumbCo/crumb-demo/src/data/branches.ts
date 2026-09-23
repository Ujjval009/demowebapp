import type { Branch } from '../types';

export const branches: Branch[] = [
  { id: 'b1', name: 'Anna Nagar', revenueMtd: 842000, royalty: 42100, compliance: 'Up to date' },
  { id: 'b2', name: 'T. Nagar', revenueMtd: 610500, royalty: 30525, compliance: 'Up to date' },
  { id: 'b3', name: 'RS Puram', revenueMtd: 498200, royalty: 24910, compliance: 'Audit due' },
  { id: 'b4', name: 'Gandhipuram', revenueMtd: 534000, royalty: 26700, compliance: 'Up to date' },
  { id: 'b5', name: 'Peelamedu', revenueMtd: 389400, royalty: 19470, compliance: 'Up to date' },
];

export const branchNames = branches.map((b) => b.name);