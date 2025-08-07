---
layout: notes
title: React Hooks by Codevolution
date: 2025-05-01
updated: 2025-07-22
description: Notes from the Codevolution course in YouTube.
category: Learning
---

## Introduction
- What are hooks?
	- Allow you to use react features without writing a class.
	- Hooks don't work inside classes.
- Why hooks?
	- Set 1
		- In JS, we need to understand how *this* keyword works.
		- In JS, we need to remember to bind event handlers in class components.
		- Classes don't minify very well.
		- With hooks we don't face these problems anymore because we are not working with classes.
	- Set 2
		- There is no way to reuse stateful component logic.
		- There is a need to share stateful logic without chaning component hierarchy.
	- Set 3
		- Code is not organised for complex scenarios.
		- Data fetching and event listeners end up in the same code block.
- Summary
	- Hooks were introduced in 16.8
	- Hooks avoid the confusion with the this keyword.
	- Hooks allow to reuse stateful logic.
	- Hooks organise logic inside a component into reusable units.

## useState
- Allows to use state within functional components.
- A simple counter

```js
function HookCounter() {
	// Array destructuring.
	const [count, setCount] = useState(0);

	return (
		<div>
			<button onClick={() => setCount(count + 1)}>
				Count {count}
			</button>
		</div>
	)
}

export default HookCounter;
```

- When the component renders a state variable is created and initialised with the default value.
- The default value is never used in rerenders.

### Rules of hooks
- Only call hooks at the top level.
- Don't call hooks inside loops, conditions, or nested functions.
- Only call hook from React functions. (Functional react components).

## useState with previous state
- A counter for incrementing, decrementing and resetting.

```js
function HookCounter() {
	const initialCount = 0;
	const [count, setCount] = useState(0);

	return (
		<div>
			Count: {count}
			<button onClick={() => setCount(initialCount)}>Reset</button>
			<button onClick={() => setCount(count + 1)}>
				Increment
			</button>
			<button onClick={() => setCount(count - 1)}>
				Increment
			</button>
		</div>
	)
}

export default HookCounter;
```

- Not the right way to increase value, it is not safe.
- Add a button to increment the value by 5

```js
const incrementFive = () => {
	setCount(prevCount => prevCount + 5);
}
```

- When we need to update a state value based on the previous value, pass a function that will set the new state value.

```js
function HookCounter() {
	const initialCount = 0;
	const [count, setCount] = useState(0);

	return (
		<div>
			Count: {count}
			<button onClick={() => setCount(initialCount)}>Reset</button>
			<button onClick={() => setCount(count + 1)}>
				Increment
			</button>
			<button onClick={() => setCount(count - 1)}>
				Increment
			</button>
			<button onClick={() => setCount(prevCount => prevCount + 5)}>
			Increment 5
			</button>
		</div>
	)
}

export default HookCounter;
```

- This approach is more safe because:
	- Since state updates are async, then setCount(count + 5) would use the current value of count at the time of rendering. Not necessarily the most recent value.
	- If multiple states updates are made, the first approach may end up using stale values.
- Functional updates ensure we are always using the most current state value.
- The second approach is preferred to state updates that depend on the previous value.

## useState with object

```js
function HookCounter() {
	const [name, setName] = useState({firstName: '', lastName: ''});

	return (
		<div>
			<form>
				<input type="text" value={name.firstName} onChange={e => setName({...name, firstName: e.target.value})/>
				<input type="text" value={name.lastName} onChange={e => setName({...name, lastName: e.target.value})/>
				<h2>First name: {name.firstName}</h2>
				<h2>Last name: {name.lastName}</h2>
			</form>
		</div>
	)
}

export default HookCounter;
```

- The default value is an object.
- A state variable can be string, number. boolean, object, or an array.
- Spread name and override what you need to.

## useState with array

```js
function HookCounter() {
	const [items, setItems] = useState([]);

	const addItems = () => {
		setItems([...items, {
			id: items.length,
			value: Math.floor(Marh.random() * 10) + 1
		}])
	}

	return (
		<div>
			<button onClick={addItem}>Add a number</button>
			<ul>
				{
					items.map(item => (
						<li key={item.di}>{item.value}</li>
					))
				}
			</ul>
		</div>
	)
}

export default HookCounter;
```

- The useState hook adds state to functional components.
- The useState hook returns an array with 2 elements, the current value and the setter for it.

## useEffect
- Let's us perform side effects in functional components.
- A replacement for componentDitMount, componentDidUpdate, and componentWillUnmount.

## useEffect after render

```js
function HookCounter() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		document.title = `${count} times`;
	});

	return (
		<div>
			Count: {count}
			<button onClick={() => setCount(prevCount => prevCount + 1)}>
				Click {count} times
			</button>
		</div>
	)
}

export default HookCounter;
```

- useEffect is executed after every render.
- We are asking react to execute the method we are passing as a parameter to run every time the component renders.
- It runs in every render and the first time.
- useEffect should be placed inside the component.

## Conditionally run effects

```js
function HookCounter() {
	const [count, setCount] = useState(0);
	const [name, setName] = useState("");

	useEffect(() => {
		console.log("Updating name value");
		document.title = `${count} times`;
	}, [count]);

	return (
		<div>
			<input type="text" value={name} onChange={e => setName(e.target.value)}></input>
			<button onClick={() => setCount(prevCount => prevCount + 1)}>
				Click {count} times
			</button>
		</div>
	)
}

export default HookCounter;
```

- In the array we need to watch for prop or state. If those changes then the effect will be executed.
- If we want to execute only when the count changes, we add it to the dependency.

## Run effects only once

```js
function HookCounter() {
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	const logMousePosition = e => {
		console.log('Mouse event');
		setX(e.clientX);
		setY(e.clientY);
	}

	useEffect(() => {
		console.log("useEffect called");
		window.addEventListener('mousemove', logMousePosition);
		// Add a cleanup to prevent memory leaks.
		return () => {
			window.removeEventListener('mousemove', logMousePosition);
		}
	}, []);

	return (
		<div>
			Hooks X {x} - Y {y}
		</div>
	)
}

export default HookCounter;
```

- With this, the effect does not depend or props or state. So no reason to call this effect on rerenders.
- This replaces componentDidMount.

## useEffect with cleanup
- Replaces componentDidMount from class components.

```js
function HookCounter() {
	const [display, setDisplay] = useState(true);

	return (
		<div>
			<button onClick={() => setDisplay(!display)}>Toggle display</button>
			{display && <hookMouse />}
		</div>
	)
}

export default HookCounter;
```

- Even when the component is removed, the component listener that belongs to the component is still listening and executing.
- *Warning: Can't perform a React state update on an unmounted component.*
- The returned function will be executed when the component will unmount.

```js
	...
	useEffect(() => {
		console.log("useEffect called");
		window.addEventListener('mousemove', logMousePosition);
		// Add a cleanup to prevent memory leaks.
		return () => {
			console.log("Component unmounting called");
			window.removeEventListener('mousemove', logMousePosition);
		}
	}, []);
	...
```

- The cleanup code can be cancelling subscriptions, timers, or removing event handlers.

## useEffect with incorrect dependency

```js
function HookCounter() {
	const [count, setCount] = useState(0);

	const tick = () => {
		setCount(count + 1)
	}

	useEffect(() => {
		const interval = setInterval(tick, 1000);
		return () => {
			clearInterval(interval);	
		}
	}, [mount])

	return (
		<div>
			{count}
		</div>
	)
}

export default HookCounter;
```

- Dependency array should be thought of as a way to let React know about everything the effect must watch for changes.
- With an empty array we told React to ignore watching for changes.
- With count as a dependency, we get the expected result.

```js
function HookCounter() {
	const [count, setCount] = useState(0);

	const tick = () => {
		setCount(prevCount => prevCount + 1)
	}

	useEffect(() => {
		const interval = setInterval(tick, 1000);
		return () => {
			clearInterval(interval);	
		}
	}, [])

	return (
		<div>
			{count}
		</div>
	)
}

export default HookCounter;
```

- Since setCount keeps track of the previous count value, we don't need count as a dependency of the effect.
- Sometimes we want to call a function inside useEffect.
- When we do that, we can forget that someProp is a dependency.

```js
function HookCounter() {
	const [count, setCount] = useState(0);

	const tick = () => {
		setCount(prevCount => prevCount + 1)
	}

	function doSomething() {
		console.log(someProp);
	}

	useEffect(() => {
		const interval = setInterval(tick, 1000);
		return () => {
			clearInterval(interval);	
		}
	}, [someProp])

	return (
		<div>
			{count}
		</div>
	)
}

export default HookCounter;
```

- When you need a function that needs to be called inside useEffect is better to define it INSIDE useEffect.
	- Actual issue is not with Closure, but with how states are managed by React. Closure means that the inner (child) function has access to the outer (parent) function's variables, even after the outer function has finished executing. Importantly, this access is through a reference, meaning the function should always have access to the latest values. Therefore, closure alone cannot be the reason why tick has access to stale values. In React, however, state is immutable. When the setter function (setCount) is called, React creates a new state value rather than modifying the existing one. In our example, we are never actually changing the value of the initial count state (the one captured by tick). Instead, React is creating a new state instance. As a result, even though closures ensure that functions retain a reference to variables, tick continues to reference the original state value from when it was first created. The actual issue is not that the value is stale, but that the reference itself is stale.

## Fetching data with useEffect

```
npm install axios
```

```js
function DataFetching() {

	const [posts, setPosts] = useState([]);

	useEffect(() => {
		axios.get('url...')
			.then(res => {
				console.log(res);
				setPosts(res.data);
			})
			.catch(err => {
				console.log(err);
			})
	}, [])
	return (
		<div>
			<ul>
				{
					posts.map(post => (
						<li key={post.id}>{post.title}</li>
					))
				}
			</ul>
		</div>
	)
}

export default HookCounter;
```

How to fetch individual posts?

```js
function DataFetching() {

	const [post, setPost] = useState({});
	const [id, setId] = useState(1);

	useEffect(() => {
		axios.get(`/posts/${id}`)
			.then(res => {
				console.log(res);
				setPost(res.data);
			})
			.catch(err => {
				console.log(err);
			})
	}, [id])

	return (
		<div>
			<input type="text" value={id} onChange={e => setId(e.target.value)}/>
			<div>{post.title}</div>
		</div>
	)
}

export default HookCounter;
```

How to trigger a request on a button click?

```js
function DataFetching() {

	const [post, setPost] = useState({});
	const [id, setId] = useState(1);
	const [idFromButtonClick, setIdFromButtonClick] = useState(1);

	const handleClick = () => {
		setIdFromButtonClick(id);
	}

	useEffect(() => {
		axios.get(`/posts/${idFromButtonClick}`)
			.then(res => {
				console.log(res);
				setPost(res.data);
			})
			.catch(err => {
				console.log(err);
			})
	}, [idFromButtonClick])

	return (
		<div>
			<input type="text" value={id} onChange={e => setId(e.target.value)}/>
			<button type="button" onClick={handleClick}>Fetch post</button>
			<div>{post.title}</div>
		</div>
	)
}

export default HookCounter;
```

## useContext
https://www.youtube.com/watch?v=CI7EYWmRDJE&list=PLC3y8-rFHvwisvxhZ135pogtX7_Oe3Q3A&index=15

- In a react application with a lot of components with different levels.
- The requirement would be that the deep nested components need to show the username.
- To do so we would pass down the state as a prop.
- Context provides a way to pass data through the component tree without having to pass manually props to all levels.
- There are 3 steps to implement Context.
- 1. Implement it in the App component.

```js
// App.js
export const UserContext = React.createContext();
```


- Second step is to provide this context with a value.
	- This provider must wrap the children components for the value to be available.

```ts
// App.js
<UserContext.Provider value={"John"}>
	<ComponentExample />
</UserContext.Provider>
```

- 3. The third step is to consume the context value.
	- We have to make use of the render props pattern.
	- The context provides use with the username.

```ts
// ComponentExample.js
import {UserContext} from "../App";

function ComponentExample() {
	return (
		<div>
			<UserContext.Consumer>
				{
					user => {
						return <div>User: {user}</div>
					}
				}
			</UserContext.Consumer>
		</div>
	)
}
```

- What happens with more Context values.

```ts
// App.js
<UserContext.Provider value={"John"}>
	<ChannelContext.Provider value={"Example"}>
		<ComponentExample />
	</ChannelContext.Provider>
</UserContext.Provider>
```

```ts
// ComponentExample.js
import {UserContext} from "../App";
import {ChannelContext} from "../App";

function ComponentExample() {
	return (
		<div>
			<UserContext.Consumer>
				{
					user => {
						return (
							<ChannelContext.Consumer>
								{
									channel => {
										return <div>User: {user}, {channel}</div>
									}
								}
							</ChannelContext.Consumer>
						)
					}
				}
			</UserContext.Consumer>
		</div>
	)
}
```

- What is a better way to consume these values? The useContext hook.
- The first 2 steps remain the same. The hook only makes it easier to consumer the context values.

```ts
// ComponentExample.js
import React, {useContext} from "react";
import {UserContext, ChannelContext} from "../App";

function ComponentExample() {

	const user = useContext(UserContext);
	const channel = useContext(ChannelContext);

	return (
		<div>
			{user} - {channel}
		</div>
	)
}
```

## useReducer
- It is a hook used for state management. It is an alternative to useState.
- useReduce was used to build useState. It is more primitive.
- Reducers
	- Let's say we have an array of 4 elements.
	- Then we have a reducer that gets 2 parameters and sums them both.
	- A reducer gets 2 parameters, does some operation and returns them as a single value.
	- useReducer(reducer, initialState);
- Let's implement a counter.

```ts
function App() {
	return <div className="App">
	</div>
}
```

```ts
// CounterOne.ts

const initialState = 0;
const reducer (state, action) => {
	
	return newState;
}

function CounterOne() {
	useReducer(reducer, initialState);
	return (
		<div>
			<button>Increment</button>
			<button>Decrement</button>
			<button>Reset</button>
		</div>
	)
}
```

- Action is an instruction to the reducer function.