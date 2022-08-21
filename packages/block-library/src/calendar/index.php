<?php
/**
 * Server-side rendering of the `core/calendar` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/calendar` block on server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the block content.
 */
function render_block_core_calendar( $attributes ) {
	global $monthnum, $year;

	// Calendar shouldn't be rendered
	// when there are no published posts on the site.
	if ( ! block_core_calendar_has_published_posts() ) {
		if ( is_user_logged_in() ) {
			return '<div>' . __( 'The calendar block is hidden because there are no published posts.' ) . '</div>';
		}
		return '';
	}

	$previous_monthnum = $monthnum;
	$previous_year     = $year;

	if ( isset( $attributes['month'] ) && isset( $attributes['year'] ) ) {
		$permalink_structure = get_option( 'permalink_structure' );
		if (
			str_contains( $permalink_structure, '%monthnum%' ) &&
			str_contains( $permalink_structure, '%year%' )
		) {
			// phpcs:ignore WordPress.WP.GlobalVariablesOverride.OverrideProhibited
			$monthnum = $attributes['month'];
			// phpcs:ignore WordPress.WP.GlobalVariablesOverride.OverrideProhibited
			$year = $attributes['year'];
		}
	}

	$inline_styles = styles_for_block_core_calendar( $attributes );
	$color_classes = get_color_classes_for_block_core_calendar( $attributes );

	$calendar = str_replace( '<table', '<table ' . $inline_styles, get_calendar( true, false ) );
	$calendar = str_replace( 'class="wp-calendar-table', 'class="wp-calendar-table ' . $color_classes, $calendar );

	$wrapper_attributes = get_block_wrapper_attributes();
	$output             = sprintf(
		'<div %1$s>%2$s</div>',
		$wrapper_attributes,
		$calendar
	);

	// phpcs:ignore WordPress.WP.GlobalVariablesOverride.OverrideProhibited
	$monthnum = $previous_monthnum;
	// phpcs:ignore WordPress.WP.GlobalVariablesOverride.OverrideProhibited
	$year = $previous_year;

	return $output;
}

/**
 * Registers the `core/calendar` block on server.
 */
function register_block_core_calendar() {
	register_block_type_from_metadata(
		__DIR__ . '/calendar',
		array(
			'render_callback' => 'render_block_core_calendar',
		)
	);
}

add_action( 'init', 'register_block_core_calendar' );

/**
 * Builds an array of inline styles for the calendar block.
 *
 * @param  array $attributes The block attributes.
 *
 * @return string Style HTML attribute.
 */
function styles_for_block_core_calendar( $attributes ) {
	$table_styles = array();

	// Add color styles.
	$has_text_color = ! empty( $attributes['style']['color']['text'] );
	if ( $has_text_color ) {
		$table_styles[] = sprintf( 'color: %s;', esc_attr( $attributes['style']['color']['text'] ) );
	}

	$has_background_color = ! empty( $attributes['style']['color']['background'] );
	if ( $has_background_color ) {
		$table_styles[] = sprintf( 'background-color: %s;', esc_attr( $attributes['style']['color']['background'] ) );
	}

	return ! empty( $table_styles ) ? sprintf( 'style="%s"', safecss_filter_attr( implode( ' ', $table_styles ) ) ) : '';
}

/**
 * Returns color classnames depending on whether there are named or custom text and background colors.
 *
 * @param array $attributes The block attributes.
 *
 * @return string The color classnames to be applied to the block elements.
 */
function get_color_classes_for_block_core_calendar( $attributes ) {
	$classnames = array();

	// Text color.
	$has_named_text_color  = ! empty( $attributes['textColor'] );
	$has_custom_text_color = ! empty( $attributes['style']['color']['text'] );
	if ( $has_named_text_color ) {
		$classnames[] = sprintf( 'has-text-color has-%s-color', $attributes['textColor'] );
	} elseif ( $has_custom_text_color ) {
		// If a custom 'textColor' was selected instead of a preset, still add the generic `has-text-color` class.
		$classnames[] = 'has-text-color';
	}

	// Background color.
	$has_named_background_color  = ! empty( $attributes['backgroundColor'] );
	$has_custom_background_color = ! empty( $attributes['style']['color']['background'] );
	if (
		$has_named_background_color ||
		$has_custom_background_color
	) {
		$classnames[] = 'has-background';
	}
	if ( $has_named_background_color ) {
		$classnames[] = sprintf( 'has-%s-background-color', $attributes['backgroundColor'] );
	}

	return implode( ' ', $classnames );
}

/**
 * Returns whether or not there are any published posts.
 *
 * Used to hide the calendar block when there are no published posts.
 * This compensates for a known Core bug: https://core.trac.wordpress.org/ticket/12016
 *
 * @return bool Has any published posts or not.
 */
function block_core_calendar_has_published_posts() {
	// Multisite already has an option that stores the count of the published posts.
	// Let's use that for multisites.
	if ( is_multisite() ) {
		return 0 < (int) get_option( 'post_count' );
	}

	// On single sites we try our own cached option first.
	$has_published_posts = get_option( 'wp_calendar_block_has_published_posts', null );
	if ( null !== $has_published_posts ) {
		return (bool) $has_published_posts;
	}

	// No cache hit, let's update the cache and return the cached value.
	return block_core_calendar_update_has_published_posts();
}

/**
 * Queries the database for any published post and saves
 * a flag whether any published post exists or not.
 *
 * @return bool Has any published posts or not.
 */
function block_core_calendar_update_has_published_posts() {
	global $wpdb;
	$has_published_posts = (bool) $wpdb->get_var( "SELECT 1 as test FROM {$wpdb->posts} WHERE post_type = 'post' AND post_status = 'publish' LIMIT 1" );
	update_option( 'wp_calendar_block_has_published_posts', $has_published_posts );
	return $has_published_posts;
}

// We only want to register these functions and actions when
// we are on single sites. On multi sites we use `post_count` option.
if ( ! is_multisite() ) {
	/**
	 * Handler for updating the has published posts flag when a post is deleted.
	 *
	 * @param int $post_id Deleted post ID.
	 */
	function block_core_calendar_update_has_published_post_on_delete( $post_id ) {
		$post = get_post( $post_id );

		if ( ! $post || 'publish' !== $post->post_status || 'post' !== $post->post_type ) {
			return;
		}

		block_core_calendar_update_has_published_posts();
	}

	/**
	 * Handler for updating the has published posts flag when a post status changes.
	 *
	 * @param string  $new_status The status the post is changing to.
	 * @param string  $old_status The status the post is changing from.
	 * @param WP_Post $post       Post object.
	 */
	function block_core_calendar_update_has_published_post_on_transition_post_status( $new_status, $old_status, $post ) {
		if ( $new_status === $old_status ) {
			return;
		}

		if ( 'post' !== get_post_type( $post ) ) {
			return;
		}

		if ( 'publish' !== $new_status && 'publish' !== $old_status ) {
			return;
		}

		block_core_calendar_update_has_published_posts();
	}

	add_action( 'delete_post', 'block_core_calendar_update_has_published_post_on_delete' );
	add_action( 'transition_post_status', 'block_core_calendar_update_has_published_post_on_transition_post_status', 10, 3 );
}
