//----------------------------------------------------------------------
// export enum Status {
//     EX = 'Tuyệt chủng',
//     EW = 'Tuyệt chủng trong tự nhiên',
//     CR = 'Cực kỳ nguy cấp',
//     EN = 'Nguy cấp',
//     VU = 'Sắp nguy cấp',
//     NT = 'Sắp bị đe doạ',
//     CD = 'Phụ thuộc bảo tồn',
//     LC = 'Ít quan tâm',
//     DD = 'Thiếu dữ liệu',
//     NE = 'Không được đánh giá'
//   }
// EX = Extinct
// EW = Extinct in the wild
// CR = Critically Endangered
// EN = Endangered
// VU = Vulnerable
// NT = Near Threatened
// LC = Least Concern
// DD = Data deficient
// NE = Not evaluated

export type OptionStatus = {
  id: any;
  label: string;
};

const status = ['Deleted', 'Available'];

export const coralStatus = [
  { id: 'EX', label: 'Extinct' },
  { id: 'EW', label: 'Extinct in the wild' },
  { id: 'CR', label: 'Critically Endangered' },
  { id: 'EN', label: 'Endangered' },
  { id: 'VU', label: 'Vulnerable' },
  { id: 'NT', label: 'Near Threatened' },
  { id: 'LC', label: 'Least Concern' },
  { id: 'DD', label: 'Data deficient' },
  { id: 'NE', label: 'Not evaluated' },
  { id: 'DE', label: 'Deleted' }
];
// const optionsStatus = [
//   { id: 'EX', name: 'Tuyệt chủng' },
//   { id: 'EW', name: 'Tuyệt chủng trong tự nhiên' },
//   { id: 'CR', name: 'Cực kỳ nguy cấp' },
//   { id: 'EN', name: 'Nguy cấp' },
//   { id: 'VU', name: 'Sắp nguy cấp' },
//   { id: 'NT', name: 'Sắp bị đe doạ' },
//   { id: 'CD', name: 'Phụ thuộc bảo tồn' },
//   { id: 'LC', name: 'Ít quan tâm' },
//   { id: 'DD', name: 'Thiếu dữ liệu' },
//   { id: 'NE', name: 'Không được đánh giá' }
// ];

export const coralLevelType = [
  { id: '1', label: 'Class' },
  { id: '2', label: 'Order' },
  { id: '3', label: 'Family' },
  { id: '4', label: 'Genus' },
  { id: '5', label: 'Species' }
];

// ------------------------------------------------------------------

export const statusOptions = status.map((v, index) => ({
  id: index,
  label: v
}));

export const coralStatusOptions = coralStatus.map((v: any) => ({
  id: v.id,
  label: v.label
}));

export const coralLevelTypeOptions = coralLevelType.map((v: any) => ({
  id: v.id,
  label: v.label
}));
