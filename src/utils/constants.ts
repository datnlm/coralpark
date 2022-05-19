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

export type OptionStatus = {
  id: number;
  label: string;
};

const status = ['Deleted', 'Available'];

export const statusOptions = status.map((v, index) => ({
  id: index,
  label: v
}));
