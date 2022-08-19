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
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@wordpress/experiments';

const { registerExperimentalAPIs, getExperimentalAPIs } =
	__dangerousOptInToUnstableAPIsOnlyForCoreModules(
		'I know using unstable features means my plugin or theme will inevitably break on the next WordPress release.',
		'@wordpress/blocks'
	);

/**
 * Internal dependencies
 */
import { store } from './store';
export { store };
export * from './api';
export * from './deprecated';

import { __experimentalReapplyBlockTypeFilters } from './store/actions';
import {
	// eslint-disable-next-line camelcase
	unstable__bootstrapServerSideBlockDefinitions,
	__unstableGetInnerBlocksProps,
} from './api';

const { __experimentalPrivateDispatch } =
	getExperimentalAPIs( '@wordpress/data' );

registerExperimentalAPIs( {
	__unstableGetInnerBlocksProps,
	// eslint-disable-next-line camelcase
	unstable__bootstrapServerSideBlockDefinitions,

	__experimentalReapplyBlockTypeFilters: () => {
		__experimentalPrivateDispatch(
			store,
			__experimentalReapplyBlockTypeFilters()
		);
	},
} );
