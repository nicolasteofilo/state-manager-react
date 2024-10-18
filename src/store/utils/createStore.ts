/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
type SetterFn<TPrevState> = (prevState: TPrevState) => Partial<TPrevState>;

export function createStore<TState extends Record<string, any>>(
  createState: (
    setState: (partialState: Partial<TState> | SetterFn<TState>) => void,
  ) => TState,
) {
  let state: TState;
  const listeners = new Set<() => void>();

  function notifyListeners() {
    listeners.forEach((listener) => listener());
  }

  function setState(partialState: Partial<TState> | SetterFn<TState>) {
    const newPartialState =
      typeof partialState === 'function' ? partialState(state) : partialState;

    state = {
      ...state,
      ...newPartialState,
    };

    notifyListeners();
  }

  function getState() {
    return state;
  }

  function getListeners() {
    return listeners;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function useStore<TReturnValue>(
    selector: (currentState: TState) => TReturnValue,
  ) {
    const [value, setValue] = useState(() => selector(state));

    useEffect(() => {
      const unsubscribeListener = subscribe(() => {
        const newValue = selector(state);

        if (value !== newValue) {
          setValue(newValue);
        }
      });

      return () => {
        unsubscribeListener();
      };
    }, [selector, value]);

    return value;
  }

  state = createState(setState);

  return { setState, getState, getListeners, subscribe, useStore };
}
