import {create} from 'zustand';

/**
 * Shared counter store for the Super App.
 *
 * This module is registered as a Module Federation `singleton` shared module,
 * so every mini-app that imports it reuses the *same* store instance at
 * runtime — giving them one synchronized counter state across the federation.
 */
export const useCounterStore = create(set => ({
  count: 0,
  increment: () => set(state => ({count: state.count + 1})),
  decrement: () => set(state => ({count: state.count - 1})),
  reset: () => set({count: 0}),
}));
