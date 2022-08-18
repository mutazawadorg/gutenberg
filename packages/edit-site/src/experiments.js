/**
 * WordPress dependencies
 */
import {
	registerAccessToken,
	getExperimentalAPIs as _getExperimentalAPIs,
} from '@wordpress/experiments';

/**
 * Internal dependencies
 */
const ACCESS_TOKEN = {};
registerAccessToken( ACCESS_TOKEN, '@wordpress/edit-site' );

export const getExperimentalAPIs = _getExperimentalAPIs.bind(
	null,
	ACCESS_TOKEN
);
