/**
 * WordPress dependencies
 */
import {
	registerAccessToken,
	registerExperimentalAPIs as _registerExperimentalAPIs,
} from '@wordpress/experiments';

/**
 * Internal dependencies
 */
const ACCESS_TOKEN = {};
registerAccessToken( ACCESS_TOKEN, '@wordpress/block-library' );

export const registerExperimentalAPIs = _registerExperimentalAPIs.bind(
	null,
	ACCESS_TOKEN
);
