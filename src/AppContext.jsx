import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const initialState = {
	count: 0,
	germanNouns: ['nnn']
};

function reducer(state, action) {
	const _state = { ...state };
	let item = null;
	let property = null;
	let value = null;
	let originalItem = null;
	switch (action.type) {
		case 'increaseCount':
			_state.count++;
			break;
		case 'decreaseCount':
			_state.count--;
			break;
		case 'loadGermanNouns':
			_state.germanNouns = action.payload;
			break;
		case 'toggleEditStatus':
			item = action.payload;
			item.isEditing = !item.isEditing;
			item.message = item.isEditing ? 'Editing item...' : '';
			break;
		case 'saveItem':
			item = action.payload;
			item.isEditing = false;
			item.message = '';
			break;
		case 'clearEditStatus':
			item = action.payload;
			originalItem = item.originalItem;
			item.isEditing = false;
			item.article = originalItem.article;
			item.singular = originalItem.singular;
			item.plural = originalItem.plural;
			item.message = '';
			break;
		case 'changeItemRowValue':
			item = action.payload.item;
			property = action.payload.property;
			value = action.payload.value;
			item[property] = value;
			break;

	}
	return _state;
}

export const AppProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		(async () => {
			const _germanNouns = ((await axios.get('http://localhost:4555/germanNouns')).data);
			_germanNouns.forEach(noun => {
				noun.isEditing = false;
				noun.message = '';
				noun.originalItem = { ...noun };
			})
			dispatch({ type: 'loadGermanNouns', payload: _germanNouns });
		})();
	}, []);

	return <AppContext.Provider value={{
		state,
		dispatch
	}}>{children}</AppContext.Provider>;
};
