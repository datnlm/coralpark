import { CellType } from './cell-type';

export type Cell = {
  id: string;
  gardenId: string;
  coralCellTypeId: string;
  coralCellTypeName: string;
  type?: CellType;
  acreage: string;
  maxItem: string;
  quantity: string;
  status: string;
};
