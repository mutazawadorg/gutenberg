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

const ACCESS_TOKEN = {
	i_realize_my_code_will_break_in_a_few_months_once_the_experimental_apis_are_removed: true,
};
registerAccessToken( ACCESS_TOKEN, '@wordpress/core-data' );
registerExperimentalAPIs( ACCESS_TOKEN, {
	__experimentalFetchLinkSuggestions,
} );
