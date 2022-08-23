const CORE_MODULES_USING_EXPERIMENTS = [
	'@wordpress/data',
	'@wordpress/block-editor',
	'@wordpress/block-library',
	'@wordpress/blocks',
	'@wordpress/core-data',
	'@wordpress/date',
	'@wordpress/edit-site',
	'@wordpress/edit-widgets',
];

const registeredExperiments = {};
const requiredConsent =
	'I know using unstable features means my plugin or theme will inevitably break on the next WordPress release.';

export const __dangerousOptInToUnstableAPIsOnlyForCoreModules = (
	consent,
	moduleName
) => {
	if ( ! CORE_MODULES_USING_EXPERIMENTS.includes( moduleName ) ) {
		throw new Error(
			`You tried to opt-in to unstable APIs as a module "${ moduleName }". ` +
				'This feature is only for JavaScript modules shipped with WordPress core. ' +
				'Please do not use it in plugins and themes as the unstable APIs will be removed ' +
				'without a warning. If you ignore this error and depend on unstable features, ' +
				'your product will inevitably break on one of the next WordPress releases.'
		);
	}
	if ( moduleName in registeredExperiments ) {
		throw new Error(
			`You tried to opt-in to unstable APIs as a module "${ moduleName }" which is already registered. ` +
				'This feature is only for JavaScript modules shipped with WordPress core. ' +
				'Please do not use it in plugins and themes as the unstable APIs will be removed ' +
				'without a warning. If you ignore this error and depend on unstable features, ' +
				'your product will inevitably break on the next WordPress release.'
		);
	}
	if ( consent !== requiredConsent ) {
		throw new Error(
			`You tried to opt-in to unstable APIs without confirming you know the consequences. ` +
				'This feature is only for JavaScript modules shipped with WordPress core. ' +
				'Please do not use it in plugins and themes as the unstable APIs will removed ' +
				'without a warning. If you ignore this error and depend on unstable features, ' +
				'your product will inevitably break on the next WordPress release.'
		);
	}
	registeredExperiments[ moduleName ] = {};
	return {
		registerExperimentalAPIs: ( experiments ) => {
			registeredExperiments[ moduleName ] = {
				...registeredExperiments[ moduleName ],
				...experiments,
			};
		},
		getExperimentalAPIs: ( targetModuleName ) => {
			if ( ! ( targetModuleName in registeredExperiments ) ) {
				throw new Error(
					`Module ${ targetModuleName } is not registered yet.`
				);
			}
			return registeredExperiments[ targetModuleName ];
		},
	};
};
