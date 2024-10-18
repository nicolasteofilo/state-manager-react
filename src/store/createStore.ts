type SetterFn<TPrevState> = (prevState: TPrevState) => Partial<TPrevState>;

export function createStore<TState>(initialState: TState) {
  let state: TState;

  function setState(partialState: Partial<TState> | SetterFn<TState>) {
    const newPartialState =
      typeof partialState === 'function' ? partialState(state) : partialState;

    state = {
      ...state,
      ...newPartialState,
    };
  }

  function getState() {
    return state;
  }

  state = initialState;

  return { setState, getState };
}

const store = createStore({ userName: 'Nicolas Castro', active: false });

console.log(store.getState());

store.setState({ userName: 'Nicolas' });
store.setState((prevState) => ({ active: !prevState.active }));

console.log(store.getState());
