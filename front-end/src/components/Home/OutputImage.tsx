"use client";

// import { FormDataTypes } from "@/types/formData.type";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Loader6Rectangular from "../Loaders/Loader6Reactangular";

interface PropTypes {
  imageSrc: string;
  loadingImage: boolean;
  handleClick: () => void;
  handleClear: () => void;
}

const OutputImage = ({
  imageSrc,
  loadingImage,
  handleClick,
  handleClear,
}: PropTypes) => {
  return (
    <>
      <div className="mt-4 p-4 bg-gold-high-end flex-col gap-5 flex items-center justify-center w-full">
        {!imageSrc && !loadingImage && (
          <button
            onClick={handleClick}
            className="uppercase p-4 bg-gold-abyss-end flex items-center justify-center h-10 hover:bg-gold-mid transition-all text-gold-mid hover:text-gold-abyss-end"
          >
            ✦ Generate Image
          </button>
        )}

        {imageSrc && (
          <>
            <button
              onClick={handleClear}
              className="uppercase p-4 bg-gold-abyss-end flex items-center justify-center h-10 hover:bg-gold-mid transition-all text-gold-mid hover:text-gold-abyss-end"
            >
              Clear Image
            </button>
            <div className="w-full min-h-[200px] overflow-hidden">
              <Image
                src={imageSrc}
                width={1000}
                height={1000}
                alt="Fiction cover"
                className="w-full h-full object-contain"
              />
            </div>
          </>
        )}

        {loadingImage && <Loader6Rectangular />}
      </div>
    </>
  );
};

export default OutputImage;
