/**
 * Internal dependencies
 */
import { registerExperimentalAPIs } from './experiments';

import {
	getBorderClassesAndStyles as __experimentalGetBorderClassesAndStyles,
	useBorderProps as __experimentalUseBorderProps,
	getColorClassesAndStyles as __experimentalGetColorClassesAndStyles,
	useColorProps as __experimentalUseColorProps,
	useCustomSides as __experimentalUseCustomSides,
	getSpacingClassesAndStyles as __experimentalGetSpacingClassesAndStyles,
	getGapCSSValue as __experimentalGetGapCSSValue,
} from './hooks';
export {
	__experimentalGetBorderClassesAndStyles,
	__experimentalUseBorderProps,
	__experimentalGetColorClassesAndStyles,
	__experimentalUseColorProps,
	__experimentalUseCustomSides,
	__experimentalGetSpacingClassesAndStyles,
	__experimentalGetGapCSSValue,
};
registerExperimentalAPIs( {
	__experimentalGetBorderClassesAndStyles,
	__experimentalUseBorderProps,
	__experimentalGetColorClassesAndStyles,
	__experimentalUseColorProps,
	__experimentalUseCustomSides,
	__experimentalGetSpacingClassesAndStyles,
	__experimentalGetGapCSSValue,
} );

export { useCachedTruthy } from './hooks';

export * from './components';
export * from './elements';
export * from './utils';
export { storeConfig, store } from './store';
export { SETTINGS_DEFAULTS } from './store/defaults';
