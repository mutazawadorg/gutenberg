/**
 * WordPress dependencies
 */
import { createRegistry, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import useNavigationMenu from '../use-navigation-menu';

function createRegistryWithStores() {
	// Create a registry and register used stores.
	const registry = createRegistry();
	registry.register( coreStore );

	const navigationConfig = {
		kind: 'postType',
		name: 'wp_navigation',
		baseURL: '/wp/v2/navigation',
		rawAttributes: [ 'title', 'excerpt', 'content' ],
	};
	// Register post type entity.
	registry.dispatch( coreStore ).addEntities( [ navigationConfig ] );
	return registry;
}

jest.mock( '@wordpress/data/src/components/use-select', () => {
	// This allows us to tweak the returned value on each test.
	const mock = jest.fn();
	return mock;
} );

function resolveRecords( registry, menus ) {
	const dispatch = registry.dispatch( coreStore );
	dispatch.startResolution( 'getEntityRecords', [
		'postType',
		'wp_navigation',
		{ per_page: -1, status: 'publish' },
	] );
	dispatch.finishResolution( 'getEntityRecords', [
		'postType',
		'wp_navigation',
		{ per_page: -1, status: 'publish' },
	] );
	dispatch.receiveEntityRecords( 'postType', 'wp_navigation', menus, {
		per_page: -1,
		status: 'publish',
	} );
}

function resolveReadPermission( registry, allowed ) {
	const dispatch = registry.dispatch( coreStore );
	dispatch.receiveUserPermission( 'create/navigation', allowed );
	dispatch.startResolution( 'canUser', [ 'read', 'navigation' ] );
	dispatch.finishResolution( 'canUser', [ 'read', 'navigation' ] );
}

function resolveReadRecordPermission( registry, ref, allowed ) {
	const dispatch = registry.dispatch( coreStore );
	dispatch.receiveUserPermission( 'create/navigation', allowed );
	dispatch.startResolution( 'canUser', [ 'read', 'navigation', ref ] );
	dispatch.finishResolution( 'canUser', [ 'read', 'navigation', ref ] );
}

function resolveCreatePermission( registry, allowed ) {
	const dispatch = registry.dispatch( coreStore );
	dispatch.receiveUserPermission( 'create/navigation', allowed );
	dispatch.startResolution( 'canUser', [ 'create', 'navigation' ] );
	dispatch.finishResolution( 'canUser', [ 'create', 'navigation' ] );
}

function resolveUpdatePermission( registry, ref, allowed ) {
	const dispatch = registry.dispatch( coreStore );
	dispatch.receiveUserPermission( `update/navigation/${ ref }`, allowed );
	dispatch.startResolution( 'canUser', [ 'update', 'navigation', ref ] );
	dispatch.finishResolution( 'canUser', [ 'update', 'navigation', ref ] );
}

function resolveDeletePermission( registry, ref, allowed ) {
	const dispatch = registry.dispatch( coreStore );
	dispatch.receiveUserPermission( `delete/navigation/${ ref }`, allowed );
	dispatch.startResolution( 'canUser', [ 'delete', 'navigation', ref ] );
	dispatch.finishResolution( 'canUser', [ 'delete', 'navigation', ref ] );
}

describe( 'useNavigationMenus', () => {
	const navigationMenu1 = { id: 1, title: 'Menu 1', status: 'publish' };
	const navigationMenu2 = { id: 2, title: 'Menu 2', status: 'publish' };
	const navigationMenu3 = { id: 3, title: 'Menu 3', status: 'publish' };
	const navigationMenus = [
		navigationMenu1,
		navigationMenu2,
		navigationMenu3,
	];

	let registry;
	beforeEach( () => {
		registry = createRegistryWithStores();
		useSelect.mockImplementation( ( fn ) => fn( registry.select ) );
	} );

	it( 'Should return no information when no data is resolved', () => {
		expect( useNavigationMenu() ).toEqual( {
			navigationMenus: null,
			navigationMenu: undefined,
			canSwitchNavigationMenu: false,
			canUserCreateNavigationMenu: false,
			canUserDeleteNavigationMenu: undefined,
			canUserUpdateNavigationMenu: undefined,
			hasResolvedCanUserCreateNavigationMenu: false,
			hasResolvedCanUserDeleteNavigationMenu: undefined,
			hasResolvedCanUserUpdateNavigationMenu: undefined,
			hasResolvedNavigationMenus: false,
			isNavigationMenuMissing: true,
			isNavigationMenuResolved: false,
			isResolvingCanUserCreateNavigationMenu: false,
			isResolvingNavigationMenus: false,
		} );
	} );

	it( 'Should return information about all menus when the ref is missing', () => {
		resolveRecords( registry, navigationMenus );
		resolveCreatePermission( registry, true );
		resolveReadPermission( registry, true );
		expect( useNavigationMenu() ).toEqual( {
			navigationMenus,
			navigationMenu: undefined,
			canSwitchNavigationMenu: true,
			canUserCreateNavigationMenu: true,
			canUserDeleteNavigationMenu: undefined,
			canUserUpdateNavigationMenu: undefined,
			hasResolvedCanUserCreateNavigationMenu: true,
			hasResolvedCanUserDeleteNavigationMenu: undefined,
			hasResolvedCanUserUpdateNavigationMenu: undefined,
			hasResolvedNavigationMenus: true,
			isNavigationMenuMissing: true,
			isNavigationMenuResolved: false,
			isResolvingCanUserCreateNavigationMenu: false,
			isResolvingNavigationMenus: false,
		} );
	} );

	it( 'Should return information about a specific menu when ref is given', () => {
		resolveRecords( registry, navigationMenus );
		expect( useNavigationMenu( 1 ) ).toEqual( {
			navigationMenu: navigationMenu1,
			navigationMenus,
			canSwitchNavigationMenu: true,
			canUserCreateNavigationMenu: false,
			canUserDeleteNavigationMenu: false,
			canUserUpdateNavigationMenu: false,
			hasResolvedCanUserCreateNavigationMenu: false,
			hasResolvedCanUserDeleteNavigationMenu: false,
			hasResolvedCanUserUpdateNavigationMenu: false,
			hasResolvedNavigationMenus: true,
			isNavigationMenuMissing: false,
			isNavigationMenuResolved: false,
			isResolvingCanUserCreateNavigationMenu: false,
			isResolvingNavigationMenus: false,
		} );
	} );

	it( 'Should return null for the menu when menu status is "draft"', () => {
		const navigationMenuDraft = { id: 4, title: 'Menu 3', status: 'draft' };
		const testMenus = [ ...navigationMenus, navigationMenuDraft ];
		resolveRecords( registry, testMenus );
		expect( useNavigationMenu( 4 ) ).toEqual( {
			navigationMenu: null,
			navigationMenus: testMenus,
			canSwitchNavigationMenu: true,
			canUserCreateNavigationMenu: false,
			canUserDeleteNavigationMenu: false,
			canUserUpdateNavigationMenu: false,
			hasResolvedCanUserCreateNavigationMenu: false,
			hasResolvedCanUserDeleteNavigationMenu: false,
			hasResolvedCanUserUpdateNavigationMenu: false,
			hasResolvedNavigationMenus: true,
			isNavigationMenuMissing: false,
			isNavigationMenuResolved: false,
			isResolvingCanUserCreateNavigationMenu: false,
			isResolvingNavigationMenus: false,
		} );
	} );

	it( 'Should return correct permissions (create, update)', () => {
		resolveRecords( registry, navigationMenus );
		resolveCreatePermission( registry, true );
		resolveReadRecordPermission( registry, 1, true );
		resolveUpdatePermission( registry, 1, true );
		resolveDeletePermission( registry, 1, false );
		expect( useNavigationMenu( 1 ) ).toEqual( {
			navigationMenu: navigationMenu1,
			navigationMenus,
			canSwitchNavigationMenu: true,
			canUserCreateNavigationMenu: true,
			canUserDeleteNavigationMenu: false,
			canUserUpdateNavigationMenu: true,
			hasResolvedCanUserCreateNavigationMenu: true,
			hasResolvedCanUserDeleteNavigationMenu: true,
			hasResolvedCanUserUpdateNavigationMenu: true,
			hasResolvedNavigationMenus: true,
			isNavigationMenuMissing: false,
			isNavigationMenuResolved: false,
			isResolvingCanUserCreateNavigationMenu: false,
			isResolvingNavigationMenus: false,
		} );
	} );

	it( 'Should return correct permissions (delete only)', () => {
		resolveRecords( registry, navigationMenus );
		resolveCreatePermission( registry, false );
		resolveReadRecordPermission( registry, 1, false );
		resolveUpdatePermission( registry, 1, false );
		resolveDeletePermission( registry, 1, true );
		expect( useNavigationMenu( 1 ) ).toEqual( {
			navigationMenu: navigationMenu1,
			navigationMenus,
			canSwitchNavigationMenu: true,
			canUserCreateNavigationMenu: false,
			canUserDeleteNavigationMenu: true,
			canUserUpdateNavigationMenu: false,
			hasResolvedCanUserCreateNavigationMenu: true,
			hasResolvedCanUserDeleteNavigationMenu: true,
			hasResolvedCanUserUpdateNavigationMenu: true,
			hasResolvedNavigationMenus: true,
			isNavigationMenuMissing: false,
			isNavigationMenuResolved: false,
			isResolvingCanUserCreateNavigationMenu: false,
			isResolvingNavigationMenus: false,
		} );
	} );

	it( 'Should return correct permissions (no permissions)', () => {
		const requestedMenu = navigationMenu1;
		// Note the "delete" permission is resolved for menu 2, but we're requesting
		// the details of menu 1.
		resolveDeletePermission( registry, navigationMenu2, true );
		resolveRecords( registry, navigationMenus );

		expect( useNavigationMenu( requestedMenu.id ) ).toEqual( {
			navigationMenu: requestedMenu,
			navigationMenus,
			canSwitchNavigationMenu: true,
			canUserCreateNavigationMenu: false,
			canUserDeleteNavigationMenu: false,
			canUserUpdateNavigationMenu: false,
			hasResolvedCanUserCreateNavigationMenu: false,
			hasResolvedCanUserDeleteNavigationMenu: false,
			hasResolvedCanUserUpdateNavigationMenu: false,
			hasResolvedNavigationMenus: true,
			isNavigationMenuMissing: false,
			isNavigationMenuResolved: false,
			isResolvingCanUserCreateNavigationMenu: false,
			isResolvingNavigationMenus: false,
		} );
	} );
} );
