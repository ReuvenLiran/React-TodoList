import React from 'react';
import io from 'socket.io-client';

import { List, Map } from 'immutable';


export function Todo(props) {
   const { todo } = props;
   if(todo.isDone) {
	return <strike>{todo.text}</strike>;
   } else {
 	return <span>{todo.text}</span>;
   }
}

export function TodoList(props) {
  const { todos, toggleTodo, addTodo } = props;
  
	const onSubmit = (event) => {
		const input = event.target;
		const text  = input.value;
		const isEnterKey = ( event.which == 13 );
		const isLongEnough = text.length > 0;
		//const socket = io.connect('${location.protocol}');
		const socket = io(`http://localhost:8080`);

		if(isEnterKey && isLongEnough) {
		
			input.value	= '';
			addTodo(text);
			
			if(todos.last() != null) {
				socket.emit('todo', todos.last());
			} 
	
		}
	};
	
       // socket.emit('todo', todos.map(t => t.get('id')));
	//socket.emit('todo', List.isList(todos));

	const toggleClick = id => event => toggleTodo(id);
	
	return (
	<div className='todo'>
	  <input type='text' className='todo__entry' 
		 placeholder='Add todo' onKeyDown={onSubmit} />
	  <ul className='todo__list'>
	    {todos.map(t => (
		<li key={t.get('id')} className='todo__item'
			 onClick={toggleClick(t.get('id'))}>
			<Todo todo={t.toJS()} />
		</li>
	    ))}
	</ul>
     </div> 
   );
}
 
