/*
Object.entries(window.wp)
    .map(([name, module])=>{
        const experiments = [];
        for(const key in module) {
            if(key.startsWith("__experimental")) {
                experiments.push(key);
            }
        }
        return [name, experiments];
    })
    .filter(([name, module]) => module.length)
 */
const CORE_MODULES_USING_EXPERIMENTS = [
	'@wordpress/data',
	'@wordpress/block-editor',
	'@wordpress/block-library',
	'@wordpress/blocks',
	'@wordpress/components',
	'@wordpress/core-data',
	'@wordpress/date',
	'@wordpress/edit-post',
	'@wordpress/edit-site',
	'@wordpress/edit-widgets',
	'@wordpress/rich-text',
];

const accessTokens = [];
const registeredExperiments = {};

export function registerAccessToken( accessToken, packageName ) {
	if ( ! CORE_MODULES_USING_EXPERIMENTS.includes( packageName ) ) {
		throw new Error(
			`Cannot register non-gutenberg package ${ packageName }.`
		);
	}
	if ( packageName in registeredExperiments ) {
		throw new Error( `Package ${ packageName } is already registered.` );
	}
	accessTokens.push( accessToken );
	registeredExperiments[ packageName ] = { experiments: {}, accessToken };
}

export function registerExperimentalAPIs( accessToken, experiments ) {
	const registeredEntry = Object.entries( registeredExperiments ).find(
		( [ , details ] ) => details.accessToken === accessToken
	);
	if ( ! registeredEntry ) {
		throw new Error( `Invalid access token.` );
	}
	const packageName = registeredEntry[ 0 ];
	registeredExperiments[ packageName ].experiments = {
		...registeredExperiments[ packageName ].experiments,
		...experiments,
	};
}

export function getExperimentalAPIs( accessToken, packageName ) {
	if ( ! ( packageName in registeredExperiments ) ) {
		throw new Error( `Module ${ packageName } is not registered yet.` );
	}
	if ( ! accessTokens.includes( accessToken ) ) {
		throw new Error(
			`The access token passed to get experiments from the package ${ packageName } is not registered.`
		);
	}
	return registeredExperiments[ packageName ].experiments;
}
