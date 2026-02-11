'use client';

import * as React from 'react';
import { mergeClasses } from '@griffel/react';
import { useFluent_unstable as useFluent } from '@fluentui/react-shared-contexts';
import { useAnimatedNumberStyles } from './AnimatedNumber.styles';

interface DigitSlotProps {
  currentDigit: string;
  previousDigit: string | null;
  isAnimating: boolean;
  direction: 'up' | 'down';
  targetWindow: Window | undefined;
}

const DigitSlot: React.FC<DigitSlotProps> = ({ currentDigit, previousDigit, isAnimating, direction, targetWindow }) => {
  const [showPrevious, setShowPrevious] = React.useState(false);
  const [animateOut, setAnimateOut] = React.useState(false);
  const [animateIn, setAnimateIn] = React.useState(false);
  const styles = useAnimatedNumberStyles();

  React.useEffect(() => {
    if (isAnimating && previousDigit !== null && targetWindow) {
      setShowPrevious(true);
      setAnimateOut(false);
      setAnimateIn(false);

      targetWindow.requestAnimationFrame(() => {
        targetWindow.requestAnimationFrame(() => {
          setAnimateOut(true);

          targetWindow.setTimeout(() => {
            setAnimateIn(true);

            targetWindow.setTimeout(() => {
              setShowPrevious(false);
              setAnimateOut(false);
              setAnimateIn(false);
            }, 225);
          }, 75);
        });
      });
    }
  }, [isAnimating, previousDigit, targetWindow]);

  const previousDigitClassName = mergeClasses(
    styles.previousDigit,
    animateOut && direction === 'up' && styles.previousDigitAnimateOutUp,
    animateOut && direction === 'down' && styles.previousDigitAnimateOutDown,
  );

  const currentDigitClassName = mergeClasses(
    styles.currentDigit,
    // Initial position when animating (before transition starts)
    !animateIn && isAnimating && direction === 'up' && styles.currentDigitInitialUp,
    !animateIn && isAnimating && direction === 'down' && styles.currentDigitInitialDown,
    // Animate in
    animateIn && styles.currentDigitAnimateIn,
  );

  return (
    <span className={styles.digitSlot}>
      {showPrevious && previousDigit !== null && <span className={previousDigitClassName}>{previousDigit}</span>}
      <span className={currentDigitClassName}>{currentDigit}</span>
    </span>
  );
};

interface AnimatedNumberProps {
  value: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const { targetDocument } = useFluent();
  const targetWindow = targetDocument?.defaultView;

  const [currentValue, setCurrentValue] = React.useState(value.toString());
  const [previousValue, setPreviousValue] = React.useState<string | null>(null);
  const [animatingIndices, setAnimatingIndices] = React.useState<Set<number>>(new Set());
  const [direction, setDirection] = React.useState<'up' | 'down'>('up');
  const prevValueRef = React.useRef(value);
  const styles = useAnimatedNumberStyles();

  React.useEffect(() => {
    if (value === prevValueRef.current) {
      return;
    }

    const prevStr = prevValueRef.current.toString();
    const nextStr = value.toString();
    const newDirection = value > prevValueRef.current ? 'up' : 'down';
    setDirection(newDirection);

    const maxLength = Math.max(prevStr.length, nextStr.length);
    const paddedPrev = prevStr.padStart(maxLength, ' ');
    const paddedNext = nextStr.padStart(maxLength, ' ');

    const indicesToAnimate = new Set<number>();
    for (let i = 0; i < maxLength; i++) {
      if (paddedPrev[i] !== paddedNext[i]) {
        indicesToAnimate.add(i);
      }
    }

    setPreviousValue(currentValue);
    setCurrentValue(nextStr);
    setAnimatingIndices(indicesToAnimate);

    targetWindow?.setTimeout(() => {
      setAnimatingIndices(new Set());
      setPreviousValue(null);
    }, 300);

    prevValueRef.current = value;
  }, [value, currentValue, targetWindow]);

  const currentChars = currentValue.split('');
  const previousChars = previousValue?.split('') || [];

  const maxLength = Math.max(currentChars.length, previousChars.length);
  const displayLength = currentChars.length;

  return (
    <span className={styles.root}>
      {currentChars.map((char, index) => {
        const adjustedIndex = maxLength - displayLength + index;
        const prevChar = previousChars[adjustedIndex] !== ' ' ? previousChars[adjustedIndex] : null;

        return (
          <DigitSlot
            key={index}
            currentDigit={char}
            previousDigit={prevChar}
            isAnimating={animatingIndices.has(adjustedIndex)}
            direction={direction}
            targetWindow={targetWindow ?? undefined}
          />
        );
      })}
    </span>
  );
};
