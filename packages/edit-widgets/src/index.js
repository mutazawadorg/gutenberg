/**
 * WordPress dependencies
 */
import {
	registerBlockType,
	setFreeformContentHandlerName,
} from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';
import { render, unmountComponentAtNode } from '@wordpress/element';
import { registerCoreBlocks } from '@wordpress/block-library';
import {
	registerLegacyWidgetBlock,
	registerLegacyWidgetVariations,
	registerWidgetGroupBlock,
} from '@wordpress/widgets';
import { store as preferencesStore } from '@wordpress/preferences';
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@wordpress/experiments';

/**
 * Internal dependencies
 */
import {
	ALLOW_REUSABLE_BLOCKS,
	ENABLE_EXPERIMENTAL_FSE_BLOCKS,
} from './constants';

const { getExperimentalAPIs } =
	__dangerousOptInToUnstableAPIsOnlyForCoreModules(
		'I know using unstable features means my plugin or theme will inevitably break on the next WordPress release.',
		'@wordpress/edit-widgets'
	);

const { __experimentalFetchLinkSuggestions: fetchLinkSuggestions } =
	getExperimentalAPIs( '@wordpress/core-data' );

const {
	__experimentalGetCoreBlocks,
	__experimentalRegisterExperimentalCoreBlocks,
} = getExperimentalAPIs( '@wordpress/block-library' );

const {
	__experimentalReapplyBlockTypeFilters,
	// eslint-disable-next-line camelcase
	unstable__bootstrapServerSideBlockDefinitions,
} = getExperimentalAPIs( '@wordpress/blocks' );

import './store';
import './filters';
import * as widgetArea from './blocks/widget-area';

import Layout from './components/layout';

const disabledBlocks = [
	'core/more',
	'core/freeform',
	'core/template-part',
	...( ALLOW_REUSABLE_BLOCKS ? [] : [ 'core/block' ] ),
];

/**
 * Reinitializes the editor after the user chooses to reboot the editor after
 * an unhandled error occurs, replacing previously mounted editor element using
 * an initial state from prior to the crash.
 *
 * @param {Element} target   DOM node in which editor is rendered.
 * @param {?Object} settings Editor settings object.
 */
export function reinitializeEditor( target, settings ) {
	unmountComponentAtNode( target );
	const reboot = reinitializeEditor.bind( null, target, settings );
	render(
		<Layout blockEditorSettings={ settings } onError={ reboot } />,
		target
	);
}

/**
 * Initializes the block editor in the widgets screen.
 *
 * @param {string} id       ID of the root element to render the screen in.
 * @param {Object} settings Block editor settings.
 */
export function initialize( id, settings ) {
	const target = document.getElementById( id );
	const reboot = reinitializeEditor.bind( null, target, settings );
	const coreBlocks = __experimentalGetCoreBlocks().filter( ( block ) => {
		return ! (
			disabledBlocks.includes( block.name ) ||
			block.name.startsWith( 'core/post' ) ||
			block.name.startsWith( 'core/query' ) ||
			block.name.startsWith( 'core/site' ) ||
			block.name.startsWith( 'core/navigation' )
		);
	} );

	dispatch( preferencesStore ).setDefaults( 'core/edit-widgets', {
		fixedToolbar: false,
		welcomeGuide: true,
		showBlockBreadcrumbs: true,
		themeStyles: true,
	} );

	__experimentalReapplyBlockTypeFilters();

	registerCoreBlocks( coreBlocks );
	registerLegacyWidgetBlock();
	if ( process.env.IS_GUTENBERG_PLUGIN ) {
		__experimentalRegisterExperimentalCoreBlocks( {
			enableFSEBlocks: ENABLE_EXPERIMENTAL_FSE_BLOCKS,
		} );
	}
	registerLegacyWidgetVariations( settings );
	registerBlock( widgetArea );
	registerWidgetGroupBlock();

	settings.__experimentalFetchLinkSuggestions = ( search, searchOptions ) =>
		fetchLinkSuggestions( search, searchOptions, settings );

	// As we are unregistering `core/freeform` to avoid the Classic block, we must
	// replace it with something as the default freeform content handler. Failure to
	// do this will result in errors in the default block parser.
	// see: https://github.com/WordPress/gutenberg/issues/33097
	setFreeformContentHandlerName( 'core/html' );
	render(
		<Layout blockEditorSettings={ settings } onError={ reboot } />,
		target
	);
}

/**
 * Function to register an individual block.
 *
 * @param {Object} block The block to be registered.
 *
 */
const registerBlock = ( block ) => {
	if ( ! block ) {
		return;
	}
	const { metadata, settings, name } = block;
	if ( metadata ) {
		unstable__bootstrapServerSideBlockDefinitions( { [ name ]: metadata } );
	}
	registerBlockType( name, settings );
};
