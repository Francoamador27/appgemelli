import { Suspense } from "react";
import PhotoUploadWizard from "@/components/bookings/PhotoUploadWizard";

export default function SubirFotosPage() {
  return (
    <Suspense fallback={null}>
      <PhotoUploadWizard />
    </Suspense>
  );
}
