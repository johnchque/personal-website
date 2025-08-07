---
layout: notes
title: Full React Course by Nentninja
date: 2024-01-01
updated: 2024-01-01
description: Notes from the @NetNinja course in YouTube.
category: Learning
---
https://www.youtube.com/watch?v=j942wKiXFu8&list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d
## Create a React Application
```
npx create-react-app [name]
```
To create a local development server:
```
npm run start
```
It is the index.js file is taking the App component and it is rendering it to the dom inside the root element.
The folder node_modules has all the packages that need to be installed in order to run the project.
## Components
Are the building blocks of any react application. Every component will contain all the templates and logic for that piece of content.
The name of functions of React components have to start with a capital.
In React we use jsx which is similar to html. In jsx we don't use class because that is a reserved word in js.
At the end we always export our component function so we can use it in other values.
## Dynamic values in templates
We can create a variable inside a function before the return template.
```js
...
	const title = 'Welcome to the new blog';

    <div className="App">
      <div className='content'>
        <h1>{ title }</h1>
      </div>
    </div>
```
Numbers will be automatically converted to string in React. However, booleans and objects cannot be rendered.

## Multiple components 
In React the components are structured in a way that makes up a component tree.
The root component is the first one that gets rendered first in the html file. If we want to have more components we nest them into the root one.
For example:
```
- App.js
	- Navbar.js
	- Blogdetails.js
	- Sidebar.js
		- Categories.js
		- Tags.js
```
Stateless functional component.

A component can be an arrow function but it doesn't matter if they are not.
```js
const Navbar = () => {

return (
```

## Styles
Any css included in a root file, such as App.css will be applied to all the components that are in the browser at that time.

## Click events
We can define a function on a component:
```js
    const handleClick = () => {
        console.log('HELLO');
    }
```
And we can reference it on a button:
```jsx
            <button onClick={handleClick}>Click me</button>
```
It is important to remember that if the method is called like handleClick() then it will be invoked once the page is loaded. Instead, a reference without the brackets is needed.
To pass parameters, we can wrap the code inside an anonymous function:
```jsx
            <button onClick={() => {handleClick('John')}}>Click me</button>
```
The function will fire when the user clicks on that function. We are not invoking, we are just referencing it.
When we reference a function, it automatically gets as the first parameter the events object.
```js
    const handleClick = (e) => {
        console.log(e);
    }
```
```jsx
            <button onClick={(e) => {handleClick(e, 'John')}}>Click me</button>
```

## Using State (useState hook)
State refers to the data that is being used in the component at that time.
If we want to have a button that updates text on a component. We can create a variable:
```js
let name = "John";
```
And we can print it on the component as a variable:
```jsx
		<p>{ name }</p>
```
If the handleClick function of the button needs to update what is printed on screen, just changing the value for the variable name will not update the component, it will only change the value of the variable.
The variable would be then not reactive. When the value changes it does not trigger the react to rerender the component.
To make this work, we have to make the value reactive. For that we need to use a hook. 
The useState hook gives us a way to make a reactive value and change it whenever we want.
To define that we use the following:
```js
const [name, setName] = useState("John");
```
Where useState is the hook, John is the default value.
The two values that the hook returns are:
name, the initial name.
setName, a function we can use to change that value. When we use this function to change the value, that triggers react to rerender the component.
## Outputting lists
The map method cycles over an array and can do something with every element.
When we output a list using the map method, each root element in the template we return must have a key property. The key is something that react uses to keep track of each item in the dom. If it needs to change it, react can know which one is changing.
```js
            { blogs.map((blog) => (
                <div className="blog-preview" key={ blog.id }>
                    <h2>{ blog.title }</h2>
                    <p>Written by { blog.author }</p>
                </div>
            ))}
```
## Props
Pass data from one component to another.
Using props make a component be more reusable. It allows to use the same data in the home component.
```js
<BlogList blogs={ blogs } />
```
Where blogs is the prop with the dynamic value of a list of blogs.
Then we get access to the props argument in the child component:
```js
const BlogList = (props) => {
    const blogs = props.blogs;
    ...
```
We can also destructure the props to say what properties we want from it:
```js
const BlogList = ({ blogs, title }) => {
```
## Reusing components
```js
            <BlogList blogs={ blogs.filter((blog) => blog.author === 'yoshi') } title="yoshi's"/>
```
If it returns true, it keeps it in the array, if false it filters it out.
## Functions as Props
If I want to delete the blog posts.
The method to remove an entry would not be in the blogList itself and instead at the Home component. That is because that is where the state is and we should not directly modify the blogs prompt in the blogList component.
Instead, we need to use setBlogs in the Home component to update the state. So we can interact with the data directly.
Given this is the method to delete an entry that is defined in the home component where the state is defined.
```js
    const handleDelete = (id) => {
        const newBlogs = blogs.filter(blog => blog.id !== id);
        setBlogs(newBlogs);
    }
```
We can pass the function as a props to the component: 
```jsx
            <BlogList blogs={ blogs } title="All blogs" handleDelete={ handleDelete }/>
```
And the child component can use it in the following way:
```jsx
                    <button onClick={() => handleDelete(blog.id)}>Delete</button>
```
## useEffect Hook
Runs a function every render of the component.
It doesn't return anything. We need to pass as argument a function that will run every time there is a render. If we, for example, change the data, the useEffect will run.
We can also access the state from the effect hook.
```js
    useEffect(() => {
        console.log('use effect ran.');
        console.log(blogs);
    });
```
## Dependencies
The dependency array is a second argument we pass to the useEffect hook. An empty array ensures that that hook runs only after the first render.
Real dependencies would be defining state values inside the array that will trigger the hook.
```js
    useEffect(() => {
        console.log('use effect ran.');
        console.log(name);
    }, [name]);
```
## Using JSON Server
```sh
npx json-server --watch data/db.json --port 8000
```
## Fetching data with useEffect
SInce the dependency array is empty, we can fetch the data through the useEffect hook.
We first set the default value of the blogs as null.
```js
    const [blogs, setBlogs] = useState(null)
```
Then inside the component, we fetch the data using useEffect
```js
    useEffect(() => {
        fetch('http://localhost:8000/blogs')
        .then(res => {
            return res.json()
        })
        .then(data => {
            setBlogs(data);
        })
    }, []);
```
The fetch function return a promise so we can bind a then method. Once the first promise of the fetch has resolved, it will fire a function. Once we have the data back, we get a response object that is not the data.
To get the data we return res.json();
When we return the first then, we get another promise. We can add another then that adds a function that runs once the first then is complete. 
To prevent an infinite loop, the dependency array should be set as other than blogs, in this example.
If there is an error in build time because the variable blogs is not yet set, then we can use js.
```jsx
            {blogs && <BlogList blogs={ blogs } title="All blogs" handleDelete={ handleDelete }/>}
```
This is conditional template. Logical AND evaluates first the left side, if it is false then it just skips the rest. If it is true then evaluates the rest.
## Conditional loading message
Creating a loading data for the user so they know something is being load.
We can create a new state called isPending.
```js
    const [isPending, setIsPending] = useState(true);
```
Then we can have another conditional template in the following way:
```jsx
            {isPending && <div>Loading</div>}
```
Which means that as long as isPending is true, we show Loading.
However, as we want this to be only be displayed while the data is being loaded. Once the data is returned, we can set this as false.
```js
...
            .then(data => {
                setBlogs(data);
                setIsPending(false);
            })
```
## Handling fetch errors
An error could be an error of the server.
After the last then, we add a catch call. It catches all networks errors.
If the server sends and error back or if the endpoint does not exists, then the catch method will not catch those errors when using the fetch API. Because we are still reaching the server and get a response back. In that case, we have to check the response object.
If response.ok is false then we want to throw an error.
```js
            .then(res => {
                console.log(res);
                if (!res.ok) {
                    throw Error('Could not fetch the data for that resource');
                }
                return res.json()
            })
```
We want to put the error in a state so we can output it in the browser.
```js
    const [error, setError] = useState(null);
```
And update the state on the catch function.
```js
            .catch(err => {
                setIsPending(false);
                setError(err.message)
            })
```
So we can display it on the component's output with a conditional statement.
```js
            {error && <div>{ error }</div>}
```
## Making a custom hook
If we want to do the same thing in a different component we would need to do the same in a different component. If we can use all that code again that would be better.
We can externalise the logic in a file, we are creating a custom hook in react.
Custom hooks in react have to start with the word use otherwise they won't work.
We place all the useEffect method from the component into this new hook:
```js
import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url)
```
We also need to export the function at the end of the file
```js
export default useFetch;
```
At the bottom of the useFetch function we can return the values that we have. We return an object and place three values.
```js
    return { data, isPending, error }
```
As the url is the parameter for the useFetch function, we also have to set it as dependency to the hook. So whenever the url changes, the function will re run to get the data from that endpoint.
Then we import this hook into the Home component.
```js
    const { data: blogs, isPending, error } = useFetch('http://localhost:8000/blogs')
```
This makes the fetch data much more reusable.
## The react router
In non-react websites, the server returns an html file when the browser makes a request.
In react, there is an initial request. The server returns the js bundle (the compiled js files). Then react can take total control. The index file is almost empty and react injects the content.
The component is dinamically injected. There is less requests to the server and the website feels faster.
For that we need react router.
Let's import the BrowserRouter in the App root component.
```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
```
Now we surround our app with the Router component so all children components have access to the router. And then we decide where we want the content to go.
The Switch component ensures that only one route shows at a given time.
Then we define the routes in a list with the url in the path property. We place then the component we want to show when we access that route.
```jsx
    <Router>
      <div className="App">
        <Navbar />
        <div className='content'>
          <Routes>
            <Route path='/' element={<Home/>}>
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
```
Since react router dom 6, we use Routes instead of Switch.
## Exact match routes
By default react-router-dom 6 matches the routes exactly.
## Route Links
While React should prevent of making a new request for every link that is clicked, current setup is not doing that yet. To fix it we need to use route links.
Built in the Link component is added a functionality to prevent sending requests to the server.
## useEffect Cleanup
If we switch from one page to another, we might cause an error since the fetch may be still running on the background and be trying to update the home component, even when the home component is no longer on screen. To fix the issue we place the cleanup function and we return it at the end of the useEffect. When the component that uses that hook unmounts it runs that cleanup function.
When the cleanup function is run, we want to stop the fetch. To do that we will so an abort controller. 
We can associate the abortcontroller with a specific fetch request and we can use it to stop it.
```js
...
    useEffect(() => {
        const abortCont = new AbortController();

        fetch(url, { signal: abortCont.signal })
            .then(res => {
            ...
```
Where the signal as second parameter of the fetch function is associating the abort controller.
In newer versions of react: "Basically from what I've read is, they are saying we don't have to use the useEffect Cleanup because the React.StrictMode is handling the function for us." from @DragonwingZify in YouTube.
```js
        return () => abortCont.abort();
    }, [url]);
```
>U don't need cleanup anymore for react router v6, it's handled by itself using the new routing method i.e component routing

By @neoz225 on YouTube.
## Router parameters
useParams allow us to have parameters straight from the url. To access it we use the same name we defined in the route.
For instance, in the App root element, we set the route like:
```jsx
            <Route path='/blogs/:id' element={<BlogDetails/>}></Route>
```
And in the element BlogDetails we access to the parameter like:
```js
    const { id } = useParams();
```
## Reusing custom hooks
We can reuse the useFetch hook to load the details of a blog.
```js
    const { data: blog, error, isPending } = useFetch('http://localhost:8000/blogs/' + id);
```
That way we are loading the specific details of one blog entry.
Then we just need to print it out in a BlogDetails component.
```jsx
        <div className="blog-details">
            { isPending && <div>Loading.</div>}
            { error && <div>{ error }</div>}
            { blog && (
                <article>
                    <h2>{ blog.title }</h2>
                    <p>Written by {blog.author }</p>
                    <div>{blog.body}</div>
                </article>
            )}
        </div>
```
## Controlled inputs
Are a way in react to setting up input fields so we can track their values.
If the state changes, the updates the value of the field we see.
We need to create states so we can do something with that data later on.
If we set up the state like this:
```js
const [title, setTitle] = useState('hello');
```
And we associate it with the input like this:
```jsx
                <input
                  type="text"
                  required
                  value={title}
                />
```
But that will not allow us to change the value of the input because it is always showing the default value of the state. To fix that, we add the onChange method to the input field.
```jsx
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
```
## Submit events
To do that, we can handle the submit action from the form by creating a function that receives the event object.
```js
    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = { title, body, author }
        console.log(blog);
    }
```
And we set that function as the action for the submit of the form:
```jsx
            <form onSubmit={handleSubmit}>
```
## Making a POST Request
We do a fetch in the submit where we use the endpoint as first argument and a second argument where we define what method we are using, this case POST.
Since the fetch is async, and it returns a promise, we can add a then method that fires a function when it is complete.
```js
        const blog = { title, body, author }
        fetch('http://localhost:8000/blogs', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(blog)
        }).then(() => {
            console.log("New blog added.")
        })
```
That will create a new blog.
If we want to make the button to show a different text when the button is pressed and we are waiting for the promise to finish, we can do the following.
Create a new state isPending that is faulse by default because we only run the submit after pressing a button.
```js
    const [isPending, setIsPending] = useState(false);
```
Then we set isPending as true within the handleSubmit before the fetch and false again once the promise has been completed.
Then we can also change the rendered button using this new state.
```jsx
                {!isPending && <button>Add Blog</button>}
                {isPending && <button disabled>Adding Blog</button>}
```
## Programmatic redirects
We can use the hook useHistory that allows us to go back and forth like the navigation buttons on the browser.
In react router dom v6, the useHistory hook has been replaced by useNavigate. It is used in the following way.
First, define it as a const within the component.
```js
    const navigate = useNavigate();
```
So we can redirect to any route using that method.
```js
            navigate('/');
```
## Deleting blogs
We use a method for handling the clicking of the delete button on the BlogDetails component:
```js
    const handleClick = () => {
        fetch('http://localhost:8000/blogs/' + blog.id, {
            method: 'DELETE'
        }).then(() => {
            navigate('/');
        })
    }
```
That is referenced in the button element.
```jsx
<button onClick={handleClick}>Delete</button>
```
## Not Found Pages
Create a new component called NotFound and reference it in the App root component.
```jsx
<Route path='*' element={<NotFound/>}></Route>
```
The asterisk shows that this will match all routes. This route should be defined at the end of the list of routes.
