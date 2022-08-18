/**
 * WordPress dependencies
 */
import {
	registerAccessToken,
	registerExperimentalAPIs as _registerExperimentalAPIs,
} from '@wordpress/experiments';

export const ACCESS_TOKEN = {};
registerAccessToken( ACCESS_TOKEN, '@wordpress/data' );

export const registerExperimentalAPIs = _registerExperimentalAPIs.bind(
	null,
	ACCESS_TOKEN
);
