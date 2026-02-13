import { useState } from "react";
import { getCropImage } from "@/utils/cropImages";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CropImageProps {
  cropName: string;
  imageUrl?: string | null;
  alt?: string;
  className?: string;
}

/**
 * Reusable crop image component with:
 * - Lazy loading via native loading="lazy"
 * - Skeleton placeholder while loading
 * - Fallback chain: provided URL → fuzzy-matched URL → default
 * - Broken-image recovery
 */
const CropImage = ({ cropName, imageUrl, alt, className }: CropImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const resolvedSrc = errored
    ? getCropImage(cropName)
    : imageUrl || getCropImage(cropName);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}
      <img
        src={resolvedSrc}
        alt={alt || cropName}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!errored) {
            setErrored(true);
            setLoaded(false);
          } else {
            // Even fallback failed, just show it
            setLoaded(true);
          }
        }}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export default CropImage;
