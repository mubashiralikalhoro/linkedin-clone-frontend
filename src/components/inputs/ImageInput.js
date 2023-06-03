import React, { useRef, useState, useEffect } from "react";
// third party
import Cropper from "react-easy-crop";
// import Slider from "@material-ui/core/Slider";
import ReactModal from "react-modal";
// local
import getCroppedImg from "@/util/cropImage";
import dataURLtoFile from "@/util/dataURLtoFile";
import useWindowSize from "@/hooks/useWindowSize";
import printLog from "@/util/printLog";
import { FaImage } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const ImageInput = ({
  notify = () => {},
  height,
  width,
  onChange = (e) => {
    printLog(e);
  },
  title,
  selectedImage = null,
  error = "",
  imageUrl = "",
  handleRemoveImage,
  required,
  aspectRatio = 4 / 3,
  canCrop = false,
  ...props
}) => {
  // ref
  const imageInputRef = useRef(null);

  // state
  const [image, setImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const size = useWindowSize();

  // functions

  const handleCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (height && width) {
          const img = new Image();
          img.onload = () => {
            if (img.naturalWidth < width || img.naturalHeight < height) {
              notify(
                "error",
                `Your upload size is ${img.naturalWidth}x${img.naturalHeight} and required size is ${width}x${height}.`
              );
              resetFileInput();
              return;
            }
            setImage(reader.result);
            if (canCrop) {
              setIsModelOpen(true);
            } else {
              setImageSelected(reader.result);
              onChange(event.target.files[0]);
            }
          };
          img.src = e.target.result;
        } else {
          if (canCrop) {
            setImage(reader.result);
            setIsModelOpen(true);
          } else {
            setImageSelected(reader.result);
            onChange(event.target.files[0]);
          }
        }
      };
      reader.readAsDataURL(event.target.files[0]);
      //   reader.addEventListener("load", () => {});
    }
  };

  const handleSave = async () => {
    let croppedImage = await getCroppedImg(image, croppedArea);
    let imageFile = dataURLtoFile(croppedImage);
    const saveFile = () => {
      onChange(imageFile);
      setImage(croppedImage);
      setImageSelected(croppedImage);
      setZoom(1);
      setIsModelOpen(false);
    };
    // after cropping image dimensions are changed
    // so we need to check if image dimensions are valid or not
    if (height && width) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (img.naturalWidth < width || img.naturalHeight < height) {
            notify(
              "error",
              `You cropped too much.Cropped size is ${img.naturalWidth}x${img.naturalHeight} and required size is ${width}x${height}.`
            );
          } else {
            saveFile();
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(imageFile);
    } else {
      saveFile();
    }
  };

  const handleNoCropping = async () => {
    let imageFile = dataURLtoFile(image);
    setImageSelected(image);
    onChange(imageFile);
    setZoom(1);
    setIsModelOpen(false);
  };

  const resetFileInput = () => {
    if (image != null) {
      setImage(null);
    } else {
      setImageSelected(image);
    }
    setIsModelOpen(false);
    setZoom(1);
    imageInputRef.current.value = null;
  };

  const customStylesWeb = {
    content: {
      width: (size.width > 1250 ? 1250 : size.width) * 0.8,
      height: size.height * 0.6 + 160,
      top: size.height * 0.2 - 80,
      left: (size.width - (size.width > 1250 ? 1250 : size.width) * 0.8) / 2,
    },
  };

  const customStylesTablet = {
    content: {
      width: size.width * 0.8,
      height: size.height * 0.6 + 160,
      top: size.height * 0.2 - 80,
      left: size.width * 0.1,
    },
  };

  const customStylesMobile = {
    content: {
      width: size.width * 0.9,
      height: size.width * 0.6 + 160,
      top: (size.height - size.width * 0.9) / 2,
      left: (size.width - size.width * 0.9) / 2,
      backgroundColor: "#1E2A3B",
    },
  };

  useEffect(() => {
    if (isModelOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "scroll";
    };
  }, [isModelOpen]);

  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key == "Escape") {
        // Prevent modal from closing when escape key is pressed
        modalRef.current.preventCloseOnEscape();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);
  return (
    <div className="w-full scrollbar-hide">
      <ReactModal
        className=""
        ariaHideApp={false}
        isOpen={isModelOpen}
        onRequestClose={() => {
          resetFileInput();
          setIsModelOpen(false);
        }}
        overlayClassName="bg-black"
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: size.isDesktop
            ? customStylesWeb.content
            : size.isMobile
            ? customStylesMobile.content
            : customStylesTablet.content,
        }}
        ref={modalRef}
      >
        {image && (
          <div className="bg-slate-800 overflow-hidden">
            <div
              className="w-[100%] relative"
              style={{
                height: size.isMobile
                  ? size.width * 0.6
                  : size.isTablet
                  ? size.height * 0.6
                  : size.height * 0.6,
              }}
            >
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={width && height ? width / height : aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            <div
              style={{
                height: 50,
              }}
              className="w-full md:w-[50%] mr-auto ml-auto mt-5 flex items-center text-xl gap-2"
            >
              <i
                className="fa-solid fa-magnifying-glass-minus"
                onClick={() => {
                  if (zoom > 1) {
                    setZoom((zoom) => zoom - 0.1);
                  }
                }}
              ></i>
              <input
                className="w-[100%]"
                type="range"
                value={zoom * 10 - 10}
                min="0"
                max="50"
                onChange={(e) => {
                  setZoom(1 + e.target.value / 10);
                }}
              />
              <i
                className="fa-solid fa-magnifying-glass-plus"
                onClick={() => {
                  if (zoom < 10) {
                    setZoom((zoom) => zoom + 0.1);
                  }
                }}
              ></i>
            </div>

            <div
              className={`flex gap-2 justify-center md:justify-end items-center mx-auto flex-wrap h-[60px] `}
            >
              <div
                className="font-bold text-[10px] md:text-sm cursor-pointer border-[2px] border-white h-fit rounded p-2 text-white w-20 flex justify-center hover:scale-110"
                onClick={resetFileInput}
              >
                CANCEL
              </div>
              <div
                className="font-bold text-[10px] md:text-sm cursor-pointer bg-white h-fit rounded p-2 text-slate-800 border-[2px] border-slate-800 hover:scale-110 flex justify-center"
                onClick={handleNoCropping}
              >
                {size.isMobile ? "NO CROPPING" : "CONTINUE WITHOUT CROPPING"}
              </div>
              <div
                className="font-bold text-[10px] md:text-sm cursor-pointer text-slate-800 h-fit rounded p-2 bg-white  flex justify-center border-[2px] hover:scale-110 border-slate-800"
                onClick={handleSave}
              >
                CONTINUE
              </div>
            </div>
          </div>
        )}

        {/* cropper cont end */}
      </ReactModal>
      <div className="relative w-full mb-3 ">
        <label
          className="uppercase text-white text-xs font-bold mb-2 flex"
          htmlFor="grid-password"
        >
          <div className="flex">
            {title}
            {width && height && (
              <div className="lowercase text-[8px] mx-1">
                {`recommend size ${width}x${height} `}
              </div>
            )}
          </div>
          {required ? " (" : ""}
          <div className="text-red-500">{required ? "*" : ""}</div>
          {required ? ")" : ""}
        </label>
        <div
          className={`min-h-[160px] py-1 bg-slate-800 border-slate-300 rounded flex flex-col border-[1px] ${
            error?.length > 0 ? "border-red-500" : ""
          }`}
        >
          {selectedImage !== null ? (
            <div className="w-ful mt-1 flex px-4 justify-end">
              <div
                className="bg-slate-800  cursor-pointer h-5 w-5 rounded-full flex items-center justify-center hover:scale-110"
                onClick={handleRemoveImage}
              >
                <RxCross2 />
              </div>
            </div>
          ) : imageSelected !== null ? (
            <div className="w-ful mt-1 flex px-4 justify-end">
              <div
                className="bg-slate-800  cursor-pointer h-5 w-5 rounded-full flex items-center justify-center hover:scale-110"
                onClick={resetFileInput}
              >
                <RxCross2 />
              </div>
            </div>
          ) : null}

          <div className="flex-1 flex items-center justify-center">
            {imageSelected ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="selected-image"
                src={imageSelected}
                height={100}
                width={200}
                className="flex-1 bg-inherit w-[200px] h-[120px] object-contain"
              />
            ) : (
              <FaImage className="text-3xl" />
            )}
          </div>
          <div className="flex items-center">
            <input
              ref={imageInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              type="file"
              className="border-0 px-3 py-2 text-white placeholder-slate-300 bg-slate-800 focus:outline-none rounded text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            />
          </div>
        </div>
        {error.length > 0 && <div className="text-red-500 mt-1">{error}</div>}
      </div>
    </div>
  );
};

export default ImageInput;
