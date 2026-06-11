import { useEffect } from "react";

let lockCount = 0;
let savedStyles = null;

function lockBody() {
  if (lockCount === 0) {
    const scrollY = window.scrollY;

    savedStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      scrollY,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  }

  lockCount += 1;
}

function unlockBody() {
  lockCount -= 1;

  if (lockCount === 0 && savedStyles) {
    document.body.style.overflow = savedStyles.overflow;
    document.body.style.position = savedStyles.position;
    document.body.style.top = savedStyles.top;
    document.body.style.width = savedStyles.width;
    window.scrollTo(0, savedStyles.scrollY);
    savedStyles = null;
  }
}

/**
 * 모달·팝업이 열려 있을 때 배경(body) 스크롤을 잠급니다.
 * 여러 모달이 동시에 열려도 ref 카운트로 안전하게 처리합니다.
 */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) {
      return undefined;
    }

    lockBody();

    return () => {
      unlockBody();
    };
  }, [locked]);
}
