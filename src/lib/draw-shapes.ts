import { random } from "./utils";
import SVG from "@svgdotjs/svg.js";

// let squareSize = 100;

export function drawCircle(
  draw: SVG.Container,
  x: number,
  y: number,
  foreground: string,
  background: string,
  squareSize: 100
) {
  // Create group element
  const group = draw.group().addClass("draw-circle");

  // Draw Background
  group.rect(squareSize, squareSize).fill(background).move(x, y);

  // Draw Foreground
  group.circle(squareSize).fill(foreground).move(x, y);
}

export function drawOppositeCircles(
  draw: SVG.Container,
  x: number,
  y: number,
  foreground: string,
  background: string,
  squareSize = 100
) {
  const group = draw.group().addClass("opposite-circles");
  const circleGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  const mask = draw.rect(squareSize, squareSize).fill("#fff").move(x, y);

  // Choose one of these options
  const offset = random([
    // top left + bottom right
    [0, 0, squareSize, squareSize],
    // top right + bottom left
    [0, squareSize, squareSize, 0],
  ]);

  // Use new offsets when placing circles
  circleGroup
    .circle(squareSize)
    .fill(foreground)
    .center(x + offset[0], y + offset[1]);

  circleGroup
    .circle(squareSize)
    .fill(foreground)
    .center(x + offset[2], y + offset[3]);

  circleGroup.maskWith(mask);
  group.add(circleGroup);
}
