import Image from "next/image";

export function Hero() {
  return (
    <div className="fixed inset-0 z-0 bg-white dark:bg-black overflow-hidden transition-colors duration-500 ease-out" aria-hidden="true">
      <Image
        src="/atom.png"
        alt=""
        fill
        priority
        className="object-cover opacity-[0.32] dark:opacity-80 [filter:invert(1)_hue-rotate(180deg)] dark:[filter:none] [transition:filter_500ms_ease-out,opacity_500ms_ease-out]"
      />
    </div>
  );
}
