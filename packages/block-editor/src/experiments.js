/**
 * WordPress dependencies
 */
import {
	registerAccessToken,
	getExperimentalAPIs as _getExperimentalAPIs,
	registerExperimentalAPIs as _registerExperimentalAPIs,
} from '@wordpress/experiments';

/**
 * Internal dependencies
 */
const ACCESS_TOKEN = {
	i_realize_my_code_will_break_in_a_few_months_once_the_experimental_apis_are_removed: true,
};
registerAccessToken( ACCESS_TOKEN, '@wordpress/block-editor' );

export const registerExperimentalAPIs = _registerExperimentalAPIs.bind(
	null,
	ACCESS_TOKEN
);

export const getExperimentalAPIs = _getExperimentalAPIs.bind(
	null,
	ACCESS_TOKEN
);
