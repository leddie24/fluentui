import { makeStyles } from '@griffel/react';

export const useAnimatedNumberStyles = makeStyles({
  root: {
    display: 'inline-flex',
  },

  digitSlot: {
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
  },

  previousDigit: {
    position: 'absolute',
    inset: '0',
    transform: 'translateY(0)',
    opacity: 1,
    transitionProperty: 'transform, opacity',
    transitionDuration: '75ms',
    transitionTimingFunction: 'cubic-bezier(0.9, 0.1, 1, 0.2)',
  },

  previousDigitAnimateOutUp: {
    transform: 'translateY(-100%)',
    opacity: 0,
  },

  previousDigitAnimateOutDown: {
    transform: 'translateY(100%)',
    opacity: 0,
  },

  currentDigit: {
    display: 'inline-block',
    transform: 'translateY(0)',
    opacity: 1,
  },

  currentDigitInitialUp: {
    transform: 'translateY(100%)',
    opacity: 0,
  },

  currentDigitInitialDown: {
    transform: 'translateY(-100%)',
    opacity: 0,
  },

  // Current digit animating in
  currentDigitAnimateIn: {
    transform: 'translateY(0)',
    opacity: 1,
    transitionProperty: 'transform, opacity',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
  },
});
