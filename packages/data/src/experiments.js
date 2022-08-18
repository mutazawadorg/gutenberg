/**
 * WordPress dependencies
 */
import {
	registerAccessToken,
	registerExperimentalAPIs as _registerExperimentalAPIs,
} from '@wordpress/experiments';

const ACCESS_TOKEN = {
	i_realize_my_code_will_break_in_a_few_months_once_the_experimental_apis_are_removed: true,
};
registerAccessToken( ACCESS_TOKEN, '@wordpress/data' );

export const registerExperimentalAPIs = _registerExperimentalAPIs.bind(
	null,
	ACCESS_TOKEN
);
