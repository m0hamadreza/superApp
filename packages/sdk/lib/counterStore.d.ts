export type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export declare function useCounterStore(): CounterState;
export declare function useCounterStore<T>(
  selector: (state: CounterState) => T,
): T;
