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

/* colors taken from https://unpkg.com/nice-color-palettes@3.0.0/500.json */
import niceColorPalette from "../lib/color-data/ncp-500.json";

const GridGenerator = () => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const [colors] = useState<[]>(niceColorPalette as []);
  const [numRows, setNumRows] = useState(random(4, 8, true));
  const [numCols, setNumCols] = useState(random(4, 8, true));
  const [colorPalette, setColorPalette] = useState<string[]>(
    random(niceColorPalette as [])
  );
  const [squareSize] = useState(100);

  let draw: SVG.Svg;

  const blockStyleOptions = [
    drawCross,
    // drawHalfSquare,
    drawDiagonalSquare,
    drawCircle,
    drawQuarterCircle,
    drawOppositeCircles,
    // drawLetterBlock,
  ];

  const generateNewGrid = () => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      setNumRows(random(4, 8, true));
      setNumCols(random(4, 8, true));
      setColorPalette(random(colors));
      drawGrid();
    }
  };

  const drawGrid = () => {
    const bg = tinycolor(colorPalette[0]).desaturate(10).toString();

    gsap.to(".container", {
      background: bg,
      duration: 0.5,
    });

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
      { opacity: 0, scale: 0.2 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
    );
  };

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

    const prevSquareSize = squareSize;

    // Random multiplier (2 or 3 squares)
    const multiplier = random([2, 3]);
    // Make squareSize bigger
    const bigSquare = multiplier * 100;

    // Random X,Y position
    const xPos = random(0, numRows - multiplier, true) * prevSquareSize;
    const yPos = random(0, numCols - multiplier, true) * prevSquareSize;

    // Get random square style
    const blockStyle = random(blockStyleOptions);
    blockStyle(draw, xPos, yPos, foreground, background, bigSquare);
  }

  function getTwoColors(colors: string[]) {
    const colorList = [...colors];
    const colorIndex = random(0, colorList.length - 1, true);
    const background = colorList[colorIndex];
    // Remove that color from the options
    colorList.splice(colorIndex, 1);
    // Set the foreground to any other color in the array
    const foreground = random(colorList);

    return { foreground, background };
  }

  useEffect(() => {
    generateNewGrid();
  }, []);

  const handleCopy = async () => {
    const svgElement = containerRef.current?.querySelector("svg");

    try {
      if (!svgElement) {
        throw new Error("SVG element not found");
      }
      const svgContent = new XMLSerializer().serializeToString(svgElement);
      await navigator.clipboard.writeText(svgContent);
      toast.success("Copied to clipboard");
    } catch (error: any) {
      console.error(error);
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
        onClick={generateNewGrid}>
        Regenerate
      </button>
      <button
        className="button"
        style={{ left: 0 }}
        aria-label="Regenerate"
        type="button"
        onClick={handleDownload}>
        Download SVG
      </button>
      <button
        className="button"
        aria-label="Regenerate"
        type="button"
        style={{ left: "50%", transform: "translateX(-50%)" }}
        onClick={handleCopy}>
        Copy SVG
      </button>
    </>
  );
};

export default GridGenerator;
