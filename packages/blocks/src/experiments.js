/**
 * WordPress dependencies
 */
import {
	registerAccessToken,
	getExperimentalAPIs as _getExperimentalAPIs,
	registerExperimentalAPIs as _registerExperimentalAPIs,
} from '@wordpress/experiments';

export const ACCESS_TOKEN = {};
registerAccessToken( ACCESS_TOKEN, '@wordpress/blocks' );

export const registerExperimentalAPIs = _registerExperimentalAPIs.bind(
	null,
	ACCESS_TOKEN
);

export const getExperimentalAPIs = _getExperimentalAPIs.bind(
	null,
	ACCESS_TOKEN
);
