/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "ainsley/macro" {
  import { Ainsley } from "ainsley";

  export default (filePath: string) => Ainsley;
}
