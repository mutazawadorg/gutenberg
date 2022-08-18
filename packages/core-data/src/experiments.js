/**
 * WordPress dependencies
 */
import {
	registerAccessToken,
	registerExperimentalAPIs,
} from '@wordpress/experiments';

/**
 * Internal dependencies
 */
import { __experimentalFetchLinkSuggestions } from './fetch';

const ACCESS_TOKEN = {};
registerAccessToken( ACCESS_TOKEN, '@wordpress/core-data' );
registerExperimentalAPIs( ACCESS_TOKEN, {
	__experimentalFetchLinkSuggestions,
} );
