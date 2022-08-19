<?php
/**
 * Server-side rendering of the `core/post-time-to-read` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/post-time-to-read` block on the server.
 *
 * @param  array    $attributes Block attributes.
 * @param  string   $content    Block default content.
 * @param  WP_Block $block      Block instance.
 * @return string Returns the rendered post author name block.
 */
function render_block_core_post_time_to_read( $attributes, $content, $block ) {
	if ( ! isset( $block->context['postId'] ) ) {
		return '';
	}

	$align_class_name = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $align_class_name ) );

	return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, 'Post time to read' );
}

/**
 * Registers the `core/post-time-to-read` block on the server.
 */
function register_block_core_post_time_to_read() {
	register_block_type_from_metadata(
		__DIR__ . '/post-time-to-read',
		array(
			'render_callback' => 'render_block_core_post_time_to_read',
		)
	);
}
add_action( 'init', 'register_block_core_post_time_to_read' );
