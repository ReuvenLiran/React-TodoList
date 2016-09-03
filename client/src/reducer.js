import { List, Map } from 'immutable';
import io from 'socket.io-client';

const init = List([]);
const socket = io(`http://localhost:8080`);

socket.on('select', function (data) {
	  console.log(data.toString());
	});

export default function(todos=init, action){
  switch(action.type) {
    case 'ADD_TODO':
	return todos.push(Map(action.payload));	
    case 'TOGGLE_TODO':
    	return todos.map(t => {
	  if(t.get('id') === action.payload) {
	    return t.update('isDone', isDone => !isDone);
	  } else {
	    return t;
	  }
       });
    default:
	return todos;
  }
}
