/**
 * WordPress dependencies
 */
import {
	activatePlugin,
	deactivatePlugin,
	createNewPost,
	createUser,
	deleteUser,
	clickBlockAppender,
	getEditedPostContent,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';

const userList = [
	{ userName: 'testuser', firstName: 'Jane', lastName: 'Doe' },
	{ userName: 'yourfather', firstName: 'Darth', lastName: 'Vader' },
	{ userName: 'mockingjay', firstName: 'Katniss', lastName: 'Everdeen' },
	{ userName: 'buddytheelf', firstName: 'Buddy', lastName: 'Elf' },
	{ userName: 'ringbearer', firstName: 'Frodo', lastName: 'Baggins' },
	{ userName: 'thebetterhobbit', firstName: 'Bilbo', lastName: 'Baggins' },
	{ userName: 'makeitso', firstName: 'Jean-Luc', lastName: 'Picard' },
];
describe( 'Autocomplete', () => {
	beforeAll( async () => {
		for ( const user of userList ) {
			await createUser( user.userName, {
				firstName: user.firstName,
				lastName: user.lastName,
			} );
		}
		await activatePlugin( 'gutenberg-test-autocompleter' );
	} );

	afterAll( async () => {
		for ( const user of userList ) {
			await deleteUser( user.userName );
		}
		await deactivatePlugin( 'gutenberg-test-autocompleter' );
	} );
	describe.each( [
		[ 'User Mention', 'mention' ],
		[ 'Custom Completer', 'option' ],
	] )( '%s', ( ...completerAndOptionType ) => {
		const [ , type ] = completerAndOptionType;

		beforeEach( async () => {
			await createNewPost();
		} );

		it( `should insert ${ type }`, async () => {
			// Set up test data for each case
			const testData = {};
			if ( type === 'mention' ) {
				testData.triggerString = 'I am @da';
				testData.optionPath = '//*[contains(text(),"Darth Vader")]';
				testData.snapshot = `
					"<!-- wp:paragraph -->
					<p>I am @yourfather.</p>
					<!-- /wp:paragraph -->"
					`;
			} else if ( type === 'option' ) {
				testData.triggerString = 'I like ~s';
				testData.optionPath = '[text()="🍓 Strawberry"]';
				testData.snapshot = `
					"<!-- wp:paragraph -->
					<p>I like 🍓.</p>
					<!-- /wp:paragraph -->"
					`;
			}

			await clickBlockAppender();
			await page.keyboard.type( testData.triggerString );
			await page.waitForXPath(
				`//button[@role="option"]${ testData.optionPath }`
			);
			await page.keyboard.press( 'Enter' );
			await page.keyboard.type( '.' );

			expect( await getEditedPostContent() ).toMatchInlineSnapshot(
				testData.snapshot
			);
		} );

		it( `should insert ${ type } between two other words`, async () => {
			const testData = {};
			if ( type === 'mention' ) {
				testData.triggerString = '@j';
				testData.optionPath = '//*[contains(text(),"Jane Doe")]';
				testData.snapshot = `
					"<!-- wp:paragraph -->
					<p>Stuck in the middle with @testuser you.</p>
					<!-- /wp:paragraph -->"
					`;
			} else if ( type === 'option' ) {
				testData.triggerString = 'a ~m';
				testData.optionPath = '[text()="🥭 Mango"]';
				testData.snapshot = `
					"<!-- wp:paragraph -->
					<p>Stuck in the middle with a 🥭 you.</p>
					<!-- /wp:paragraph -->"
					`;
			}

			await clickBlockAppender();
			await page.keyboard.type( 'Stuck in the middle with you.' );
			await pressKeyTimes( 'ArrowLeft', 'you.'.length );
			await page.keyboard.type( testData.triggerString );
			await page.waitForXPath(
				`//button[@role="option"]${ testData.optionPath }`
			);
			await page.keyboard.press( 'Enter' );
			await page.keyboard.type( ' ' );
			expect( await getEditedPostContent() ).toMatchInlineSnapshot(
				testData.snapshot
			);
		} );

		it( `should insert two subsequent ${ type }s`, async () => {
			const testData = {};
			if ( type === 'mention' ) {
				testData.firstTriggerString =
					'The two greatest hobbits, in order: @bi';
				testData.secondTriggerString = ' @fr';
				testData.firstOptionPath =
					'//*[contains(text(),"Bilbo Baggins")]';
				testData.secondOptionPath =
					'//*[contains(text(),"Frodo Baggins")]';
				testData.snapshot = `
					"<!-- wp:paragraph -->
					<p>The two greatest hobbits, in order: @thebetterhobbit @ringbearer.</p>
					<!-- /wp:paragraph -->"
					`;
			} else if ( type === 'option' ) {
				testData.firstTriggerString = 'An awesome combination: ~m';
				testData.secondTriggerString = ' ~b';
				testData.firstOptionPath = '[text()="🥭 Mango"]';
				testData.secondOptionPath = '[text()="🫐 Blueberry"]';
				testData.snapshot = `
					"<!-- wp:paragraph -->
					<p>An awesome combination: 🥭 🫐.</p>
					<!-- /wp:paragraph -->"
					`;
			}

			await clickBlockAppender();
			await page.keyboard.type( testData.firstTriggerString );
			await page.waitForXPath(
				`//button[@role="option"]${ testData.firstOptionPath }`
			);
			await page.keyboard.press( 'Enter' );
			await page.keyboard.type( testData.secondTriggerString );
			await page.waitForXPath(
				`//button[@role="option"]${ testData.secondOptionPath }`
			);
			await page.keyboard.press( 'Enter' );
			await page.keyboard.type( '.' );
			expect( await getEditedPostContent() ).toMatchInlineSnapshot(
				testData.snapshot
			);
		} );

		it( `should allow ${ type } selection via click event`, async () => {
			const testData = {};
			if ( type === 'mention' ) {
				testData.triggerString = '@';
				testData.optionPath =
					'//*[contains(text(),"Katniss Everdeen")]';
				testData.snapshot = `
					"<!-- wp:paragraph -->
					<p>@mockingjay</p>
					<!-- /wp:paragraph -->"
					`;
			} else if ( type === 'option' ) {
				testData.triggerString = '~';
				testData.optionPath = '[text()="🍓 Strawberry"]';
				testData.snapshot = `
					"<!-- wp:paragraph -->
					<p>🍓</p>
					<!-- /wp:paragraph -->"
					`;
			} else {
				[ testData.triggerString, testData.snapshot ] = undefined;
			}

			await clickBlockAppender();
			await page.keyboard.type( testData.triggerString );
			const strawberry = await page.waitForXPath(
				`//button[@role="option"]${ testData.optionPath }`
			);
			await strawberry.click();

			expect( await getEditedPostContent() ).toMatchInlineSnapshot(
				testData.snapshot
			);
		} );
	} );
} );
