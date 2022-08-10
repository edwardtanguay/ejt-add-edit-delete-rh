import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { GermanNounFormRow } from './GermanNounFormRow';

export const AddItemBox = () => {
	const { state, dispatch } = useContext(AppContext);

	const item = {
		article: state.addItem.article,
		singular: state.addItem.singular,
		plural: state.addItem.plural,
	};

	return (
		<>
			{state.isAdding === true && (
				<fieldset className="germanNoun">
					<legend>ADD ITEM</legend>

					<GermanNounFormRow
						item={item}
						label="Article"
						variable="article"
						adding={true}
					/>

					<GermanNounFormRow
						item={item}
						label="Singular"
						variable="singular"
						adding={true}
					/>

					<GermanNounFormRow
						item={item}
						label="Plural"
						variable="plural"
						adding={true}
					/>

					<div className="buttonRow">
						<div className="message">{state.addMessage}</div>
						<div className="buttonArea">
							<button
								onClick={() =>
									dispatch({ type: 'clearAddingItem' })
								}
							>
								Clear
							</button>
							<button
								onClick={(e) =>
									actionManager({
										type: 'saveItemAdding',
										payload: {
											itemType: 'germanNouns',
											id: item.id,
											item: {
												article: item.article,
												singular: item.singular,
												plural: item.plural,
											},
										},
									})
								}
							>
								Save
							</button>
						</div>
					</div>
				</fieldset>
			)}
		</>
	);
};
