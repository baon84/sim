import React, { useMemo } from 'react';

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  showText?: boolean;
  className?: string;
}

/**
 * Deterministic Code-128 inspired SVG Barcode renderer
 * Creates crisp, professional, scalable vector barcodes
 */
export const BarcodeSVG: React.FC<BarcodeProps> = ({
  value,
  width = 240,
  height = 70,
  showText = true,
  className = ''
}) => {
  // Generate consistent bar widths and spaces based on characters in `value`
  const bars = useMemo(() => {
    const cleanVal = (value || '0000000000').trim();
    const result: { width: number; isBar: boolean }[] = [];

    // Quiet zone & Start guard (narrow-wide-narrow-narrow)
    result.push({ width: 3, isBar: true });
    result.push({ width: 2, isBar: false });
    result.push({ width: 4, isBar: true });
    result.push({ width: 1, isBar: false });

    for (let i = 0; i < cleanVal.length; i++) {
      const charCode = cleanVal.charCodeAt(i);
      // Generate 4-6 bar/space modules per character
      const p1 = (charCode % 4) + 1;
      const p2 = ((charCode >> 1) % 3) + 1;
      const p3 = ((charCode >> 2) % 4) + 1;
      const p4 = ((charCode >> 3) % 2) + 1;

      result.push({ width: p1, isBar: true });
      result.push({ width: p2, isBar: false });
      result.push({ width: p3, isBar: true });
      result.push({ width: p4, isBar: false });
    }

    // Stop guard & final termination bar
    result.push({ width: 4, isBar: true });
    result.push({ width: 2, isBar: false });
    result.push({ width: 2, isBar: true });
    result.push({ width: 3, isBar: true });

    return result;
  }, [value]);

  const totalUnits = useMemo(() => {
    return bars.reduce((acc, curr) => acc + curr.width, 0);
  }, [bars]);

  const barHeight = showText ? height - 18 : height;

  let currentX = 0;

  return (
    <div className={`inline-flex flex-col items-center bg-white p-2 rounded ${className}`}>
      <svg
        viewBox={`0 0 ${totalUnits} ${height}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {bars.map((bar, idx) => {
          const x = currentX;
          currentX += bar.width;
          if (!bar.isBar) return null;
          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={bar.width}
              height={barHeight}
              fill="#0f172a"
            />
          );
        })}
      </svg>
      {showText && (
        <span className="font-mono text-xs tracking-[0.25em] text-slate-800 font-semibold mt-1">
          *{value}*
        </span>
      )}
    </div>
  );
};

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Vector 2D QR Code style renderer with position detection patterns
 */
export const QRCodeSVG: React.FC<QRCodeProps> = ({
  value,
  size = 120,
  className = ''
}) => {
  const gridSize = 21; // Standard QR Version 1 grid

  const grid = useMemo(() => {
    const matrix: boolean[][] = Array(gridSize)
      .fill(false)
      .map(() => Array(gridSize).fill(false));

    // Fill standard 3 corner finder patterns (7x7 outer border, 3x3 inner square)
    const placeFinder = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[startY + r][startX + c] = true;
          }
        }
      }
    };

    placeFinder(0, 0);
    placeFinder(gridSize - 7, 0);
    placeFinder(0, gridSize - 7);

    // Timing patterns
    for (let i = 8; i < gridSize - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Seed data modules from value string
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip finder areas
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= gridSize - 8) ||
          (r >= gridSize - 8 && c < 8) ||
          r === 6 ||
          c === 6
        ) {
          continue;
        }

        const pseudoBit = ((hash ^ (r * 31 + c * 17)) >>> ((r + c) % 16)) & 1;
        matrix[r][c] = pseudoBit === 1;
      }
    }

    return matrix;
  }, [value, gridSize]);

  return (
    <div className={`inline-block bg-white p-2 rounded-lg border border-slate-200 shadow-sm ${className}`}>
      <svg
        viewBox={`0 0 ${gridSize} ${gridSize}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {grid.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width={1}
                height={1}
                fill="#0f172a"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
