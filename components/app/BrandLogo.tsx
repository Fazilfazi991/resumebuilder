import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = "h-10 w-auto", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/resumi-logo.png"
      alt="Resumi"
      width={1576}
      height={499}
      priority={priority}
      className={className}
    />
  );
}
