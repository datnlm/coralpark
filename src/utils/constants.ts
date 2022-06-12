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
// import useLocales from '../hooks/useLocales';

// export type OptionStatus = {
//   id: any;
//   label: string;
// };

// export function Status() {
//   const { translate } = useLocales();
//   const status = [translate('status.deleted'), translate('status.available')];
//   return status;
// }
// // const status = ['Deleted', 'Available'];

// export function CoralStatus() {
//   const { translate } = useLocales();
//   const coralStatus = [
//     { id: 'EX', label: translate('status.coral.EX') },
//     { id: 'EW', label: translate('status.coral.EW') },
//     { id: 'CR', label: translate('status.coral.CR') },
//     { id: 'EN', label: translate('status.coral.EN') },
//     { id: 'VU', label: translate('status.coral.VU') },
//     { id: 'NT', label: translate('status.coral.NT') },
//     { id: 'LC', label: translate('status.coral.LC') },
//     { id: 'DD', label: translate('status.coral.DD') },
//     { id: 'NE', label: translate('status.coral.NE') },
//     { id: 'DE', label: translate('status.coral.DE') }
//   ];
//   return coralStatus;
// }
// // const optionsStatus = [
// //   { id: 'EX', name: 'Tuyệt chủng' },
// //   { id: 'EW', name: 'Tuyệt chủng trong tự nhiên' },
// //   { id: 'CR', name: 'Cực kỳ nguy cấp' },
// //   { id: 'EN', name: 'Nguy cấp' },
// //   { id: 'VU', name: 'Sắp nguy cấp' },
// //   { id: 'NT', name: 'Sắp bị đe doạ' },
// //   { id: 'CD', name: 'Phụ thuộc bảo tồn' },
// //   { id: 'LC', name: 'Ít quan tâm' },
// //   { id: 'DD', name: 'Thiếu dữ liệu' },
// //   { id: 'NE', name: 'Không được đánh giá' }
// // ];

// export function CoralLevelType() {
//   const { translate } = useLocales();
//   const coralLevelType = [
//     { id: '0', label: translate('status.coral_level_type.0') },
//     { id: '1', label: translate('status.coral_level_type.1') },
//     { id: '2', label: translate('status.coral_level_type.2') },
//     { id: '3', label: translate('status.coral_level_type.3') },
//     { id: '4', label: translate('status.coral_level_type.4') },
//     { id: '5', label: translate('status.coral_level_type.5') }
//   ];
//   return coralLevelType;
// }

// // ------------------------------------------------------------------

// export const statusOptions = Status().map((v, index) => ({
//   id: index,
//   label: v
// }));

// export const coralStatusOptions = CoralStatus().map((v: any) => ({
//   id: v.id,
//   label: v.label
// }));

// export const coralLevelTypeOptions = CoralLevelType().map((v: any) => ({
//   id: v.id,
//   label: v.label
// }));

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
  { id: '0', label: 'All' },
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
