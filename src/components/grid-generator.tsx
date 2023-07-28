import { useEffect, useRef, useState } from "react";
import SVG, { SVG as s } from "@svgdotjs/svg.js";
import { random } from "../lib/utils";
import tinycolor from "tinycolor2";
import gsap from "gsap";
import {
  drawCircle,
  drawCross,
  drawDiagonalSquare,
  drawOppositeCircles,
  drawQuarterCircle,
} from "../lib/draw-shapes";
import toast from "react-hot-toast";

const GridGenerator = () => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const [colors, setColors] = useState<[]>([]);

  let draw: SVG.Svg,
    squareSize: number,
    numRows: number,
    numCols: number,
    colorPalette: string[];

  const blockStyleOptions = [
    drawCross,
    // drawHalfSquare,
    drawDiagonalSquare,
    drawCircle,
    drawQuarterCircle,
    drawOppositeCircles,
    // drawLetterBlock,
  ];

  function generateNewGrid() {
    // Remove SVG
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      drawGrid();
    }
  }

  async function drawGrid() {
    // Set Random Palette
    colorPalette = random(colors);

    // Set Variables
    squareSize = 100;
    numRows = random(4, 8, true);
    numCols = random(4, 8, true);

    // Set background color
    const bg = tinycolor(colorPalette[0]).desaturate(10).toString();

    // Set to CSS Custom Properties
    gsap.to(".container", {
      background: bg,
      duration: 0.5,
    });

    // Create parent SVG
    draw = s()
      .addTo(containerRef.current)
      .size("100%", "100%")
      .viewbox(`0 0 ${numRows * squareSize} ${numCols * squareSize}`);

    // Create Grid
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        generateLittleBlock(draw, i, j);
      }
    }

    generateBigBlock(draw);

    gsap.fromTo(
      ".container > svg",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
    );
  }

  function generateLittleBlock(draw: SVG.Svg, i: number, j: number) {
    const { foreground, background } = getTwoColors(colorPalette);

    //uncomment if you want specific shapes in littleblock
    // const blockStyleOptions = [
    //   drawCross,
    //   // drawHalfSquare,
    //   // drawDiagonalSquare,
    //   drawCircle,
    //   // drawQuarterCircle,
    //   drawOppositeCircles,
    //   // drawLetterBlock,
    // ];

    const xPos = i * squareSize;
    const yPos = j * squareSize;
    const blockStyle = random(blockStyleOptions);

    blockStyle(draw, xPos, yPos, foreground, background, squareSize);
  }

  function generateBigBlock(draw: SVG.Svg) {
    const { foreground, background } = getTwoColors(colorPalette);

    //uncomment if you want specific shapes in bigblock
    // const blockStyleOptions = [
    //   drawCross,
    //   // drawHalfSquare,
    //   // drawDiagonalSquare,
    //   drawCircle,
    //   // drawQuarterCircle,
    //   drawOppositeCircles,
    //   // drawLetterBlock,
    // ];

    let prevSquareSize = squareSize;

    // Random multiplier (2 or 3 squares)
    const multiplier = random([2, 3]);
    // Make squareSize bigger
    squareSize = multiplier * 100;

    // Random X,Y position
    const xPos = random(0, numRows - multiplier, true) * prevSquareSize;
    const yPos = random(0, numCols - multiplier, true) * prevSquareSize;

    // Get random square style
    const blockStyle = random(blockStyleOptions);
    blockStyle(draw, xPos, yPos, foreground, background, squareSize);

    // Reset squareSize
    squareSize = prevSquareSize;
  }

  function getTwoColors(colors: string[]) {
    let colorList = [...colors];
    const colorIndex = random(0, colorList.length - 1, true);
    const background = colorList[colorIndex];
    // Remove that color from the options
    colorList.splice(colorIndex, 1);
    // Set the foreground to any other color in the array
    const foreground = random(colorList);

    return { foreground, background };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://unpkg.com/nice-color-palettes@3.0.0/500.json"
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setColors(data as []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (colors.length > 0) {
      generateNewGrid();
    }
  }, [colors]);

  // async function init() {
  //   colors = await fetch(
  //     "https://unpkg.com/nice-color-palettes@3.0.0/500.json"
  //   ).then((response) => response.json());
  //   generateNewGrid();
  // }

  const handleCopy = async () => {
    const svgElement = containerRef.current?.querySelector("svg");

    try {
      if (!svgElement) {
        throw new Error("SVG element not found");
      }

      const svgContent = new XMLSerializer().serializeToString(svgElement);
      await navigator.clipboard.writeText(svgContent);

      // Ensure the toast library is set up correctly to display success messages
      toast.success("Copied to clipboard");
    } catch (error: any) {
      console.error(error);

      // Check for specific error types and display relevant messages
      if (error.name === "SecurityError") {
        toast.error("Clipboard access is not allowed in this context");
      } else {
        toast.error("Failed to copy SVG to clipboard");
      }
    }
  };

  const handleDownload = () => {
    const svgElement = containerRef.current?.querySelector("svg");

    try {
      if (!svgElement) {
        throw new Error("SVG element not found");
      }

      const svgContent = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgContent], { type: "image/svg+xml" });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "grid.svg";
      a.click();

      // Clean up the URL object after download
      URL.revokeObjectURL(url);

      toast.success("SVG file downloaded successfully");
    } catch (error: any) {
      console.error(error);

      // Check for specific error types and display relevant messages
      if (error.name === "SecurityError") {
        toast.error("Download is blocked by your browser's security settings");
      } else {
        toast.error("Failed to download SVG file");
      }
    }
  };

  return (
    <>
      <div ref={containerRef} className="container"></div>
      <button
        className="button"
        style={{ right: 0 }}
        aria-label="Regenerate"
        type="button"
        onClick={generateNewGrid}
      >
        Regenerate
      </button>
      <button
        className="button"
        style={{ left: 0 }}
        aria-label="Regenerate"
        type="button"
        onClick={handleDownload}
      >
        Download SVG
      </button>
      <button
        className="button"
        aria-label="Regenerate"
        type="button"
        style={{ left: "50%", transform: "translateX(-50%)" }}
        onClick={handleCopy}
      >
        Copy SVG
      </button>
    </>
  );
};

export default GridGenerator;
