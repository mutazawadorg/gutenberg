// A "block" is the abstract term used to describe units of markup that,
// when composed together, form the content or layout of a page.
// The API for blocks is exposed via `wp.blocks`.
//
// Supported blocks are registered by calling `registerBlockType`. Once registered,
// the block is made available as an option to the editor interface.
//
// Blocks are inferred from the HTML source of a post through a parsing mechanism
// and then stored as objects in state, from which it is then rendered for editing.

/**
 * WordPress dependencies
 */
import {
	registerAccessToken,
	registerExperimentalAPIs,
	getExperimentalAPIs
} from '@wordpress/experiments';

const ACCESS_TOKEN = {
	i_realize_my_code_will_break_in_a_few_months_once_the_experimental_apis_are_removed: true,
};
registerAccessToken( ACCESS_TOKEN, '@wordpress/blocks' );

import { store } from './store';
export { store };
export * from './api';
export * from './deprecated';

import { __experimentalReapplyBlockTypeFilters } from './store/actions';
import {
	unstable__bootstrapServerSideBlockDefinitions,
	__unstableGetInnerBlocksProps,
} from './api';

const { __experimentalPrivateDispatch } =
	getExperimentalAPIs( ACCESS_TOKEN, '@wordpress/data' );

registerExperimentalAPIs( ACCESS_TOKEN, {
	__unstableGetInnerBlocksProps,
	unstable__bootstrapServerSideBlockDefinitions,

	__experimentalReapplyBlockTypeFilters: () => {
		__experimentalPrivateDispatch(
			store,
			__experimentalReapplyBlockTypeFilters()
		);
	},
} );
