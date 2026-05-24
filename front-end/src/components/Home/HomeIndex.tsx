"use client";

import { useEffect, useRef, useState } from "react";
import SwitchThemeButton from "../custom-components/SwitchThemeButton";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ColorPicker } from "../custom-components/ColorPicker";
import { Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ToggleGroupCustom from "../custom-components/ToggleGroupCustom";
import { FormDataTypes } from "@/types/formData.type";
import { FormDataSchema } from "@/lib/validation/formDataValidation";
import getRandomColor from "@/lib/getRandomColor";
import { useMounted } from "@/hooks/useMounted";
import { HomeIndexSkeleton } from "./HomeIndexSkeleton";
import axios from "axios";
import { useToast } from "@/hooks/useToast";
import { axiosInstance } from "@/lib/axiosInstance";
import { generateFiction } from "@/lib/api/generate";
import { OutputCard } from "./OutputCard";
import AppSelect from "./AppSelect";
import useFetchCountries from "@/hooks/useFetchCountries";
import AppCountrySelect from "./AppCountrySelect";

const HomeIndex = () => {
  const [listColorPalette, setListColorPalette] = useState<string[]>([
    getRandomColor(),
    getRandomColor(),
  ]);
  const {
    countries: dataCountries,
    isLoading: isLoadingFetchCountry,
    error: errorFetchCountry,
  } = useFetchCountries();

  console.log("Data country: ", dataCountries);

  const mappedOptionCountris = dataCountries?.map((item) => ({
    label: item?.name?.common,
    value: item?.name?.common.toLowerCase().replace(" ", "_"),
  }));

  const { toast } = useToast();
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState<FormDataTypes>({
    antagonist_feel: "",
    atmosphere: [],
    genre_and_world: "",
    color_palette: [],
    one_secret_story_holds: "",
    opening_sentence: "",
    protagonist_feel: "",
    language: "",
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [color, setColor] = useState<string>(getRandomColor());
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (listColorPalette.length >= 6) return;
    setListColorPalette((prev) => [...prev, color]);
  }, [color]);

  useEffect(() => {
    setFormData({
      ...formData,
      color_palette: listColorPalette,
    });
  }, [listColorPalette]);

  useEffect(() => {
    setFormData({
      ...formData,
      atmosphere: selectedAtmosphere,
    });
  }, [selectedAtmosphere]);
  const handleRemoveColor = (color: string) => {
    const newColorPalette = listColorPalette.filter((item) => item !== color);

    setListColorPalette(newColorPalette);
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    Object.keys(errors).forEach((key) => {
      const timer = setTimeout(() => {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
      }, 6000);

      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [errors]);

  const handleGenerateSubmit = async (data: FormDataTypes) => {
    try {
      setLoading(true);
      const result = FormDataSchema.safeParse(data);

      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);

        return;
      }
      const validData = result.data;

      const payload = {
        opening_sentence: validData.opening_sentence,
        genre_and_world: validData.genre_and_world,
        protagonist_feel: validData.protagonist_feel,
        antagonist_feel: validData.antagonist_feel,
        color_palette: validData.color_palette,
        atmosphere: validData.atmosphere,
        one_secret_story_holds: validData.one_secret_story_holds,
      };

      await axiosInstance.post("/fiction", payload);
      toast("Data Sended", "success");
      console.log("Payload: ", payload);
    } catch (error) {
      console.log("Error: ", error);
      toast("Failed sending data", "error");
    } finally {
      setLoading(false);
    }
  };
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  // AbortController ref so we can cancel mid-stream if needed
  const abortRef = useRef<AbortController | null>(null);

  async function handleSubmit(data: FormDataTypes) {
    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setOutput("");
    setError("");
    setLoading(true);

    await generateFiction(
      data,
      (chunk) => setOutput((prev) => prev + chunk), // append each chunk
      () => setLoading(false), // onDone
      (msg) => {
        setError(msg);
        setLoading(false);
      },
      abortRef.current.signal,
    );
  }
  const mounted = useMounted();

  if (!mounted) return <HomeIndexSkeleton />;
  return (
    <div className="p-4 relative max-w-full sm:max-w-[60%] mx-auto">
      <div className="absolute right-4">
        <SwitchThemeButton />
      </div>
      <div className="flex flex-col gap-3 ">
        <p className="text-gold-mid font-medium font-mono uppercase tracking-wider text-sm">
          AI Fiction Studio
        </p>

        <div className="font-cormorant flex flex-col gap-1 text-6xl">
          <h4>Peak</h4>
          <h4 className="italic text-gold-mid">Fiction</h4>
        </div>
        <p className="text-gold-low-mid font-mono italic tracking-tighter">
          — Find Your Peak Of Fiction
        </p>
        <div className=" w-full h-0.5 rounded-xl bg-gold-abyss"></div>

        {/* Base Parameter */}
        <div className="mt-2 flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <label className="px-2 font-cormorant text-gold-abyss-end/60 font-bold tracking-wider uppercase text-[14px]">
              Opening sentence / premise
            </label>
            <Input
              onChange={(e) =>
                setFormData({
                  ...formData,
                  opening_sentence: e.target.value,
                })
              }
              placeholder="e.g. He walked under the rain that never stopped since his mother left..."
            />
            {errors.opening_sentence?.[0] && (
              <p className="text-red-500/50 ml-2 text-[12px]">
                {errors.opening_sentence[0]}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="px-2 font-cormorant text-gold-abyss-end/60 font-bold tracking-wider uppercase text-[14px]">
              Genre / World
            </label>
            <Input
              onChange={(e) =>
                setFormData({
                  ...formData,
                  genre_and_world: e.target.value,
                })
              }
              placeholder="e.g. gothic romance, solarpunk, magical realism, noir..."
            />
            {errors.genre_and_world?.[0] && (
              <p className="text-red-500/50 text-[12px] ml-2">
                {errors.genre_and_world[0]}
              </p>
            )}
          </div>
          <div className="flex w-full sm:flex-row flex-col justify-between gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label className="px-2 font-cormorant text-gold-abyss-end/60 font-bold tracking-wider uppercase text-[14px]">
                Protagonist feels like...
              </label>
              <Input
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    protagonist_feel: e.target.value,
                  })
                }
                placeholder="e.g. a bruised moon, wet matches..."
              />
              {errors.protagonist_feel?.[0] && (
                <p className="text-red-500/50 text-[12px] ml-2">
                  {errors.protagonist_feel[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="px-2 font-cormorant text-gold-abyss-end/60 font-bold tracking-wider uppercase text-[14px]">
                Antagonist / tension
              </label>
              <Input
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    antagonist_feel: e.target.value,
                  })
                }
                placeholder="e.g. her own reflection, the city's silence..."
              />
              {errors.antagonist_feel?.[0] && (
                <p className="text-red-500/50 text-[12px] ml-2">
                  {errors.antagonist_feel[0]}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <label className="px-2 font-cormorant text-gold-abyss-end/60 font-bold tracking-wider uppercase text-[14px]">
            story's origin language
          </label>
          {/* <AppSelect
            options={mappedOptionCountris}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                language: value,
              })
            }
            label="Select Language"
          /> */}

          <AppCountrySelect
            onChange={(e) =>
              setFormData({
                ...formData,
                language: e.name.common,
              })
            }
          />
        </div>
        {/* Color Palette */}
        <div className="mt-2">
          <div className="flex w-full justify-between items-center">
            <label className="px-2 font-cormorant text-gold-abyss-end/60 font-bold tracking-wider uppercase text-[14px]">
              Color palette of this world
            </label>
            <Button
              onClick={() =>
                setListColorPalette([
                  getRandomColor(),
                  getRandomColor(),
                  getRandomColor(),
                ])
              }
              className="text-[12px]  bg-gold-abyss-end/50 hover:bg-gold-abyss/70 transition-colors text-gold-high-end"
            >
              Refresh
            </Button>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-start w-full p-2">
            <AnimatePresence mode="popLayout">
              {listColorPalette.map((item, index) => (
                <motion.div
                  key={item}
                  layout
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ backgroundColor: item }}
                  className="w-10 h-8! relative shrink-0 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        suppressHydrationWarning
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => handleRemoveColor(item)}
                        className="p-2 rounded-full bg-gray-700 hover:bg-gray-500 transition-colors cursor-pointer absolute -right-2.5 -top-2.5 z-10"
                      >
                        <X size={8} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              <motion.div
                key="color-picker"
                layout
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ColorPicker
                  listCurrentColor={listColorPalette}
                  value={color}
                  onChange={setColor}
                  disabled={listColorPalette.length >= 6}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          {errors.color_palette?.[0] && (
            <p className="text-red-500/50 text-[12px] ml-2">
              {errors.color_palette[0]}
            </p>
          )}
        </div>

        {/* Mood / Atmosphere */}
        <div className="mt-2 max-w-full flex flex-col gap-1 break-all">
          <label className="px-2 font-cormorant text-gold-abyss-end/60 font-bold tracking-wider uppercase text-[14px]">
            Mood / Atmosphere
          </label>
          <ToggleGroupCustom
            selectedItem={selectedAtmosphere}
            setSelectedItem={setSelectedAtmosphere}
            className="flex gap-3 mt-2 flex-wrap items-center"
            type="multiple"
            listItem={
              [
                "melancholic",
                "ethereal",
                "sinister",
                "hopeful",
                "surreal",
                "tender",
                "defiant",
                "dreamlike",
                "eerie",
                "breathless",
              ] as string[]
            }
          />
          {errors.atmosphere?.[0] && (
            <p className="text-red-500/50 text-[12px] ml-2">
              {errors.atmosphere[0]}
            </p>
          )}
        </div>

        {/* More Parameter */}
        <div className="flex flex-col gap-1 mt-2">
          <label className="px-2 font-cormorant text-gold-abyss-end/60 font-bold tracking-wider uppercase text-[14px]">
            One secret this story holds
          </label>
          <Input
            onChange={(e) =>
              setFormData({
                ...formData,
                one_secret_story_holds: e.target.value,
              })
            }
            placeholder="e.g. the ending was always the beginning..."
          />
        </div>

        <OutputCard output={output} loading={loading} error={error} />
        <Button
          onClick={() => handleSubmit(formData)}
          disabled={loading}
          className="uppercase bg-gold-abyss-end flex items-center justify-center h-10 hover:bg-gold-mid transition-all text-gold-mid hover:text-gold-abyss-end"
        >
          {loading && <Loader2 size={20} className="animate-spin" />}✦ Generate
        </Button>
      </div>
    </div>
  );
};

export default HomeIndex;
