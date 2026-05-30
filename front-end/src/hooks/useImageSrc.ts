"use client";
import { generateCover, generateCoverWithText } from "@/lib/api/generate";
import { FormDataTypes } from "@/types/formData.type";
import { Dispatch, SetStateAction, useState } from "react";
// import { useToast } from "./useToast";
import { FormDataSchema } from "@/lib/validation/formDataValidation";

interface PropTypes {
  formData: FormDataTypes;
  setErrors: Dispatch<SetStateAction<Record<string, string[]>>>;
  storyText: string;
  isWithText: "yes" | "no";
}

const useImageSrc = ({
  formData,
  setErrors,
  storyText,
  isWithText = "no",
}: PropTypes) => {
  const [coverImage, setCoverImage] = useState<string>("");
  const [loadingCover, setLoadingCover] = useState<boolean>(false);
  //   const { toast } = useToast();
  async function handleGenerateCover() {
    const result = FormDataSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);

      return;
    }

    console.log("Form data form image: ", formData);

    setLoadingCover(true);

    try {
      let image: string = "";

      if (isWithText === "yes") {
        image = await generateCover(formData);
      } else if (isWithText === "no") {
        image = await generateCoverWithText(formData, storyText);
      }

      setCoverImage(image);
    } catch (err) {
      console.log(err);
      //   toast("Failed generating image, please try again later.", "error");
    } finally {
      setLoadingCover(false);
    }
  }

  const handleClearImage = () => {
    setCoverImage("");
  };
  return {
    handleGenerateCover,
    coverImage,
    setCoverImage,
    loadingCover,
    handleClearImage,
  };
};

export default useImageSrc;
