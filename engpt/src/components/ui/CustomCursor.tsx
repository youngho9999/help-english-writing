"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoveringText, setIsHoveringText] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [interactiveLabel, setInteractiveLabel] = useState("");
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;

      // 인터랙티브 요소 체크 (버튼, 링크 등)
      const interactive = target.closest('button, a, [role="button"]');
      if (interactive) {
        setIsHoveringInteractive(true);
        const text = interactive.textContent?.trim() || "Click";
        setInteractiveLabel(text.length > 10 ? "Click" : text);
        setIsHoveringText(false);
      }
      // 텍스트 요소 체크
      else if (
        target.tagName === "P" ||
        target.tagName === "H1" ||
        target.tagName === "H2" ||
        target.tagName === "H3" ||
        target.tagName === "SPAN" ||
        target.tagName === "LABEL"
      ) {
        setIsHoveringText(true);
        setIsHoveringInteractive(false);
      }
      // 텍스트 입력 영역 체크
      else if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        setIsHoveringInteractive(true);
        setInteractiveLabel("Type");
        setIsHoveringText(false);
      } else {
        setIsHoveringText(false);
        setIsHoveringInteractive(false);
      }
    };

    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }

        ::selection {
          background-color: rgba(0, 102, 255, 0.3);
        }
      `}</style>

      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div
          className={`cursor-dot ${
            isHoveringInteractive ? "interactive" : isHoveringText ? "text-hover" : ""
          }`}
        >
          {isHoveringInteractive && <span className="cursor-label">{interactiveLabel}</span>}
        </div>
      </div>
    </>
  );
}
