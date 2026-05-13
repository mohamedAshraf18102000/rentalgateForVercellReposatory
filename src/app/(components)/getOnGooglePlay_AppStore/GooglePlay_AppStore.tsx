import Image from "next/image";
import Link from "next/link";

const GooglePlay_AppStore = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center mt-10">
      <div className="flex gap-4 justify-center md:justify-start">
        <Link
          href="#"
          className="block w-[160px] lg:w-[180px] h-[52px] lg:h-[60px] hover:scale-105 transition-transform"
        >
          <Image
            src="/shared/Google.png"
            alt="Get it on Google Play"
            width={180}
            height={60}
            className="w-full h-full object-contain"
          />
        </Link>
        <Link
          href="#"
          className="block w-[160px] lg:w-[180px] h-[52px] lg:h-[60px] hover:scale-105 transition-transform"
        >
          <Image
            src="/shared/Apple.png"
            alt="Download on the App Store"
            width={180}
            height={60}
            className="w-full h-full object-contain"
          />
        </Link>
      </div>
    </div>
  );
};

export default GooglePlay_AppStore;
