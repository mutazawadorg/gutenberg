/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getActiveFormat } from '../get-active-format';

/** @typedef {import('@wordpress/element').RefObject} RefObject */
/** @typedef {import('../register-format-type').RichTextFormatType} RichTextFormatType */
/** @typedef {import('../create').RichTextValue} RichTextValue */

/**
 * @typedef {Object} VirtualAnchorElement
 * @property {Function} getBoundingClientRect A function returning a DOMRect
 * @property {Document} ownerDocument         The element's ownerDocument
 */

/**
 * This hook, to be used in a format type's Edit component, returns the active
 * element that is formatted, or a virtual element for the selection range if
 * no format is active. The returned value is meant to be used for positioning
 * UI, e.g. by passing it to the `Popover` component.
 *
 * @param {Object}                 $1          Named parameters.
 * @param {RefObject<HTMLElement>} $1.ref      React ref of the element
 *                                             containing  the editable content.
 * @param {RichTextValue}          $1.value    Value to check for selection.
 * @param {RichTextFormatType}     $1.settings The format type's settings.
 *
 * @return {Element|VirtualAnchorElement|null|undefined} The active element or selection range.
 */
export function useAnchorRef( { ref, value, settings = {} } ) {
	const { tagName, className, name } = settings;
	const activeFormat = name ? getActiveFormat( value, name ) : undefined;

	return useMemo( () => {
		if ( ! ref.current ) return;
		const {
			ownerDocument: { defaultView },
		} = ref.current;
		const selection = defaultView.getSelection();

		if ( ! selection.rangeCount ) {
			return;
		}

		const range = selection.getRangeAt( 0 );

		if ( ! activeFormat ) {
			return {
				ownerDocument: range.startContainer.ownerDocument,
				getBoundingClientRect() {
					return range.getBoundingClientRect();
				},
			};
		}

		let element = range.startContainer;

		// If the caret is right before the element, select the next element.
		element = element.nextElementSibling || element;

		while ( element.nodeType !== element.ELEMENT_NODE ) {
			element = element.parentNode;
		}

		return element.closest(
			tagName + ( className ? '.' + className : '' )
		);
	}, [ activeFormat, value.start, value.end, tagName, className ] );
}
