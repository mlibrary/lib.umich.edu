/**
 * Hours Store - Manages week offset state for hours display
 * Uses nanostores for framework-agnostic state management
 */
import { atom } from 'nanostores';

// Week offset from current week (0 = current week, 1 = next week, -1 = previous week)
export const weekOffset = atom<number>(0);

// Actions to update the week offset
export function setWeekOffset(offset: number) {
  weekOffset.set(offset);
}

export function incrementWeekOffset() {
  weekOffset.set(weekOffset.get() + 1);
}

export function decrementWeekOffset() {
  weekOffset.set(weekOffset.get() - 1);
}

export function resetWeekOffset() {
  weekOffset.set(0);
}
