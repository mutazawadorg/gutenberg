/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import {
	AlignmentControl,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { store as editorStore } from '@wordpress/editor';
// eslint-disable-next-line no-unused-vars
import { __, _x } from '@wordpress/i18n';
import { count as wordCount } from '@wordpress/wordcount';

/**
 * Average reading rate - based on average taken from
 * https://irisreading.com/average-reading-speed-in-various-languages/
 * (Characters/minute used for Chinese rather than words).
 *
 * @type {number} A rough estimate of the average reading rate across multiple languages.
 */
const AVERAGE_READING_RATE = 189;

function PostTimeToReadEdit( { attributes, setAttributes } ) {
	const { textAlign } = attributes;

	const content = useSelect(
		( select ) => select( editorStore ).getEditedPostAttribute( 'content' ),
		[]
	);

	/*
	 * translators: If your word count is based on single characters (e.g. East Asian characters),
	 * enter 'characters_excluding_spaces' or 'characters_including_spaces'. Otherwise, enter 'words'.
	 * Do not translate into your own language.
	 */
	const wordCountType = _x( 'words', 'Word count type. Do not translate!' );
	// eslint-disable-next-line no-unused-vars
	const minutesToRead = Math.round(
		wordCount( content, wordCountType ) / AVERAGE_READING_RATE
	);

	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<div { ...blockProps }>Post Time To Read</div>
		</>
	);
}

export default PostTimeToReadEdit;
