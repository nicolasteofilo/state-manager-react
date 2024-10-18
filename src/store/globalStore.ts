import { ITodo } from '../entities/ITodo';
import { IUser } from '../entities/IUser';

import { createStore } from './utils/createStore';

interface IGlobalStoreValue {
  user: IUser | null;
  todos: ITodo[];
  login(user: IUser | null): void;
  logout(): void;
  addTodo(title: string): void;
  toggleTodoDone(todoId: number): void;
  removeTodo(todoId: number): void;
}

export const globalStore = createStore<IGlobalStoreValue>((setState) => ({
  user: null,
  todos: [],
  login(user: IUser) {
    setState({
      user,
    });
  },
  logout: () => {
    setState({ user: null });
  },
  addTodo: (title: string) => {
    setState((prevState) => ({
      todos: prevState.todos.concat({
        id: Date.now(),
        author: prevState.user?.name ?? 'Convidado',
        title,
        done: false,
      }),
    }));
  },
  toggleTodoDone: (todoId) => {
    setState((prevState) => ({
      todos: prevState.todos.map((todo) =>
        todo.id === todoId ? { ...todo, done: !todo.done } : todo,
      ),
    }));
  },
  removeTodo: (todoId) => {
    setState((prevState) => ({
      todos: prevState.todos.filter((todo) => todo.id !== todoId),
    }));
  },
}));
