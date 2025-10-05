"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [interactiveLabel, setInteractiveLabel] = useState("");
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;

      // textarea (영어로 작문하세요) 체크
      if (target.tagName === "TEXTAREA" && target.id === "answer") {
        setIsHoveringInteractive(true);
        setInteractiveLabel("Type");
      }
      // 제출하기 버튼 체크
      else if (target.closest("button")) {
        const button = target.closest("button") as HTMLButtonElement;
        const buttonText = button.textContent?.trim() || "";

        // 제출하기 또는 평가 중... 버튼인 경우에만 호버 효과 적용
        if (buttonText === "제출하기" || buttonText === "평가 중...") {
          setIsHoveringInteractive(true);
          setInteractiveLabel(buttonText === "평가 중..." ? "Wait" : "Click");
        } else {
          setIsHoveringInteractive(false);
        }
      } else {
        setIsHoveringInteractive(false);
      }
    };

    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className={`cursor-dot ${isHoveringInteractive ? "interactive" : ""}`}>
          {isHoveringInteractive && <span className="cursor-label">{interactiveLabel}</span>}
        </div>
      </div>
    </>
  );
}
