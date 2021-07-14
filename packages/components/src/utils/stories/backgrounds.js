/**
 * External dependencies
 */
import { css } from '@emotion/react';

/**
 * Internal dependencies
 */
import { useCx } from '../hooks';
import {
	SUPPORTED_COLORS,
	getBackgroundColor,
	getTextColorForBackgroundColor,
} from '../backgrounds';
import { Flex } from '../../flex';

export default {
	title: 'Components (Experimental)/Background Colors',
};

const Example = ( { color, isBold } ) => {
	const cx = useCx();

	const textColor = getTextColorForBackgroundColor( color, { isBold } );
	const bgColor = getBackgroundColor( color, { isBold } );

	const classes = cx(
		bgColor,
		textColor,
		css( {
			padding: '1em',
			borderRadius: '2px',
			borderColor: color,
			borderStyle: 'solid',
			borderWidth: '1px',
		} )
	);

	return <span className={ classes }>This is an example</span>;
};

export const _default = () => {
	return (
		<Flex>
			{ SUPPORTED_COLORS.map( ( color ) => (
				<Example color={ color } key={ color } />
			) ) }
			{ SUPPORTED_COLORS.map( ( color ) => (
				<Example color={ color } key={ color } isBold />
			) ) }
		</Flex>
	);
};
