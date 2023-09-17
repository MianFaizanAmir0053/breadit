import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { uploadFiles } = generateReactHelpers<OurFileRouter>();

// import { generateComponents } from "@uploadthing/react";

// import type { OurFileRouter } from "@/app/api/uploadthing/core";

// export const { UploadButton, UploadDropzone, Uploader } =
//   generateComponents<OurFileRouter>();
