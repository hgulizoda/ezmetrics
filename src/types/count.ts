export interface ICount {
  data: {
    all: number;
    pending: number;
    in_china_warehouse: number;
    to_china_border: number;
    in_transit: number;
    to_uzb_customs: number;
    in_customs: number;
    delivered: number;
  };
}
