export interface AppSlider {
  id: number;
  title: string;
  subtitle: string;
  pictureUrl: string;
  buttonLink: string;
}

export interface SliderParams {
  orderBy: string;
  pageNumber: number;
  pageSize: number;
}
