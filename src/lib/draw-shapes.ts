import { random } from "./utils";
import SVG from "@svgdotjs/svg.js";

// let squareSize = 100;

export function drawCircle(
  draw: SVG.Svg,
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
  draw: SVG.Svg,
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

export function drawCross(
  draw: SVG.Svg,
  x: number,
  y: number,
  foreground: string,
  background: string,
  squareSize: number
) {
  const group = draw.group().addClass("draw-cross");
  const crossGroup = draw.group();
  // Draw Background
  group.rect(squareSize, squareSize).fill(background).move(x, y);

  // Draw Foreground
  crossGroup
    .rect(squareSize / 1.5, squareSize / 5)
    .fill(foreground)
    .center(x + squareSize / 2, y + squareSize / 2);

  crossGroup
    .rect(squareSize / 1.5, squareSize / 5)
    .fill(foreground)
    .center(x + squareSize / 2, y + squareSize / 2)
    .transform({ rotate: 90 });

  if (Math.random() < 0.4) {
    crossGroup.transform({ rotate: 45, origin: "center center" });
  }
}

export function drawQuarterCircle(
  draw: SVG.Svg,
  x: number,
  y: number,
  foreground: string,
  background: string,
  squareSize: number
) {
  const group = draw.group().addClass("quarter-circle");
  const circleGroup = draw.group();

  // Draw Background
  group.rect(squareSize, squareSize).fill(background).move(x, y);

  const mask = draw.rect(squareSize, squareSize).fill("#fff").move(x, y);

  const xOffset = squareSize * random([0, 1], undefined, true);
  const yOffset = squareSize * random([0, 1], undefined, true);
  // Draw Foreground
  circleGroup
    .circle(squareSize * 2)
    .fill(foreground)
    .center(x + xOffset, y + yOffset);

  if (Math.random() < 0.6) {
    circleGroup
      .circle(squareSize)
      .fill(background)
      .center(x + xOffset, y + yOffset);
  }

  circleGroup.maskWith(mask);
  group.add(circleGroup);
}

export function drawDiagonalSquare(
  draw: SVG.Svg,
  x: number,
  y: number,
  foreground: string,
  background: string,
  squareSize: number
) {
  const group = draw.group().addClass("diagonal-square");

  // Draw Background
  group.rect(squareSize, squareSize).fill(background).move(x, y);

  // Draw Foreground

  let polygon;
  if (Math.random() > 0.5) {
    polygon = group.polygon(
      `${x},${y} ${x},${y + squareSize}, ${x + squareSize},${y}`
    );
  } else {
    polygon = group.polygon(
      `${x},${y} ${x + squareSize},${y} ${x + squareSize},${y + squareSize}`
    );
  }

  polygon.fill(foreground);
}
