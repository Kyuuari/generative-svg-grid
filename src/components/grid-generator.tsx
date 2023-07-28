import { useEffect, useRef } from "react";
import { SVG } from "@svgdotjs/svg.js";
import { random } from "../lib/utils";
import tinycolor from "tinycolor2";
import gsap from "gsap";
import { drawCircle, drawOppositeCircles } from "../lib/draw-shapes";

const GridGenerator = () => {
  const containerRef = useRef<HTMLDivElement>(null!);
  let draw: any,
    squareSize: number,
    numRows: number,
    numCols: number,
    colors: string[],
    colorPalette: string[];

  /*
  Create New Piece
  */

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

    // Make Lighter version
    // const bgInner = tinycolor(bg).lighten(10).toString();
    // And darker version
    // const bgOuter = tinycolor(bg).darken(10).toString();

    // Set to CSS Custom Properties
    gsap.to(".container", {
      background: bg,
      duration: 0.5,
    });

    // Create parent SVG
    draw = SVG()
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

  function generateLittleBlock(draw: typeof SVG, i: number, j: number) {
    const { foreground, background } = getTwoColors(colorPalette);
    const blockStyleOptions = [drawCircle, drawOppositeCircles];

    const xPos = i * squareSize;
    const yPos = j * squareSize;
    const blockStyle = random(blockStyleOptions);

    blockStyle(draw, xPos, yPos, foreground, background, squareSize);
  }

  function generateBigBlock(draw: typeof SVG) {
    const { foreground, background } = getTwoColors(colorPalette);

    // Removed the Dots option because it
    // didn't look good big
    const blockStyleOptions = [
      // drawCross,
      // drawHalfSquare,
      // drawDiagonalSquare,
      drawCircle,
      // drawQuarterCircle,
      drawOppositeCircles,
      // drawLetterBlock,
    ];

    let prevSquareSize = squareSize;

    // Random multiplier (2 or 3 squares)
    const multiplier = random([2, 3]);
    // Make squareSize bigger
    squareSize = multiplier * 100;

    // Random X position
    const xPos = random(0, numRows - multiplier, true) * prevSquareSize;
    // Random Y position
    const yPos = random(0, numCols - multiplier, true) * prevSquareSize;

    // Get random square style
    const blockStyle = random(blockStyleOptions);
    blockStyle(draw, xPos, yPos, foreground, background, squareSize);

    // Reset squareSize
    squareSize = prevSquareSize;
  }

  function getTwoColors(colors: string[]) {
    let colorList = [...colors];
    // Get random index for this array of colors
    const colorIndex = random(0, colorList.length - 1, true);
    // Set the background to the color at that array
    const background = colorList[colorIndex];
    // Remove that color from the options
    colorList.splice(colorIndex, 1);
    // Set the foreground to any other color in the array
    const foreground = random(colorList);

    return { foreground, background };
  }

  useEffect(() => {
    init();
  }, []);

  async function init() {
    colors = await fetch(
      "https://unpkg.com/nice-color-palettes@3.0.0/100.json"
    ).then((response) => response.json());
    generateNewGrid();
  }

  return (
    <>
      <div ref={containerRef} className="container"></div>
      <button
        className="button"
        aria-label="Regenerate"
        type="button"
        onClick={generateNewGrid}
      >
        <span>Regenerate</span>
      </button>
    </>
  );
};

export default GridGenerator;
