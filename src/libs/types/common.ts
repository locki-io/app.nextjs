export enum BlobDataType {
    TEXT,
    IMAGE,
    AUDIO,
    SVG,
    PDF,
    VIDEO,
    GLTF,
  }

export interface DataGridItemsOptions {
  header?: string;
  name?: string;
  getData?: (input: any) => any;
  customCell?: (handlers: any, input: any) => JSX.Element;
}