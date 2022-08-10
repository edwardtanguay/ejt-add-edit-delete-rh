import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const initialState = {
	count: 0,
	germanNouns: ['nnn'],
	addItem: {
		article: '',
		singular: '',
		plural: '',
	},
	isAdding: false,
	addMessage: '',
};

function reducer(state, action) {
	const _state = { ...state };
	let item = null;
	let property = null;
	let value = null;
	let originalItem = null;
	let message = null;
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
		case 'handleFailedSaveItem':
			item = action.payload.item;
			message = action.payload.message;
			originalItem = item.originalItem;

			item.isEditing = false;
			item.article = originalItem.article;
			item.singular = originalItem.singular;
			item.plural = originalItem.plural;
			item.message = message;
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
		case 'beginAddingItem':
			_state.isAdding = true;
	}
	return _state;
}

export const AppProvider = ({ children }) => {
	const [state, dispatchCore] = useReducer(reducer, initialState);

	useEffect(() => {
		(async () => {
			const _germanNouns = (
				await axios.get('http://localhost:4555/germanNouns')
			).data;
			_germanNouns.forEach((noun) => {
				noun.isEditing = false;
				noun.message = '';
				noun.originalItem = { ...noun };
			});
			dispatchCore({ type: 'loadGermanNouns', payload: _germanNouns });
		})();
	}, []);

	const dispatch = async (action) => {
		const item = action.payload;
		const apiItem = {};
		if (item) {
			apiItem = {
				id: item.id,
				article: item.article,
				singular: item.singular,
				plural: item.plural,
			};
		}
		switch (action.type) {
			case 'saveItem':
				try {
					const response = await axios.put(
						`http://localhost:4555/germanNouns/${item.id}`,
						apiItem
					);
					if ([200, 201].includes(response.status)) {
						dispatchCore(action);
					} else {
						dispatchCore({
							type: 'handleFailedSaveItem',
							payload: {
								item,
								message: `error: ${response.status}`,
							},
						});
					}
				} catch (e) {
					dispatchCore({
						type: 'handleFailedSaveItem',
						payload: {
							item,
							message: `Error: API not available`,
						},
					});
				}
				break;
			default:
				dispatchCore(action);
				break;
		}
	};

	return (
		<AppContext.Provider
			value={{
				state,
				dispatch,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
