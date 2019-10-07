<?php
/*
Plugin Name: Simple WordPress calendar
Plugin URI: https://github.com/tomas-hartman/wp-simple-calendar
Description: Nothing yet
Author: Tomas Hartman
Version: 0.1.0
Author URI: https://github.com/tomas-hartman/wp-simple-calendar
Text Domain: simple-wp-calendar
*/

add_filter('widget_text', 'do_shortcode'); // Allows the shortcode to work in text widgets.

/**
 * Init a data handling
 */
function swp_cal_post_type() {
	register_post_type( 'swp-cal-event',
		array(
			'labels' => array(
				'name' => 'Události',
				'singular_name' => 'Událost',
				'edit_item' => 'Upravit událost',
				'add_new_item' => 'Přidat novou událost'
			),
		'taxonomies' => array('category'),
		'menu_icon' => 'dashicons-calendar',
		'menu_position' => 23,
		'public' => true,
		'has_archive' => true,
		'exclude_from_search' => true,
		'rewrite' => array('slug' => 'event'), // nevím co znamená
		'supports' => array( 'title', 'editor' ), // nevím, co znamená
		)
	);
}
add_action( 'init', 'swp_cal_post_type' );

/**
 * Přehled událostí - sloupce a jejich nastavení
 */
function swp_cal_columns( $cols ) {
	$cols = array(
		'cb'			=>	'<input type="checkbox" />',
		'title'			=>	_x('Název události', 'simple-wp-calendar'),
		'event-date'	=>	__('Datum události', 'simple-wp-calendar'),
		'event-repeat'	=>	__('Opakování události', 'simple-wp-calendar'),
		'event-days'	=>	__('Trvání události', 'simple-wp-calendar'),
		'categories'	=>	__('Kategorie', 'simple-wp-calendar'),
	);
	return $cols;
}
add_filter( 'manage_swp-cal-event_posts_columns', 'swp_cal_columns' ); // wp si z manage_swp-cal-event_posts_columns parsuje typ lol

function swp_cal_columns_data( $column, $post_id ) {
    switch ( $column ) {
      case "event-date":
        $event_date = get_post_meta( $post_id, 'event-date', true);
        echo $event_date;
        break;
      case "event-repeat":
          $event_repeat = get_post_meta( $post_id, 'event-repeat', true);
          if($event_repeat == 1) {
              $event_repeat = __('Týdně', 'simple-wp-calendar');
          } elseif($event_repeat == 2) {
              $event_repeat = __('Měsíčně', 'simple-wp-calendar');
          } elseif($event_repeat == 3) {
              $event_repeat = __('Ročně', 'simple-wp-calendar');
          } else {
              $event_repeat = __('Jednorázová akce', 'simple-wp-calendar');
          }
          echo $event_repeat;
          break;
      case "event-days":
          $event_days = get_post_meta( $post_id, 'event-days', true);
          if(empty($event_days)) {
              $event_days = $event_days.__('1 den', 'simple-wp-calendar');
          } elseif($event_days == 1) {
              $event_days = $event_days.__(' den', 'simple-wp-calendar');
          } elseif($event_days > 1 && $event_days < 5) {
              $event_days = $event_days.__(' dny', 'simple-wp-calendar');
          } else {
            $event_days = $event_days.__(' dní', 'simple-wp-calendar');
          }
          echo $event_days;
          break;
    }
}
add_action( 'manage_posts_custom_column', 'swp_cal_columns_data', 10, 2 );

function swp_cal_sortable_columns( $columns ) {
	$cols['event-date'] = 'event-date';
	$cols['event-repeat'] = 'event-repeat';
	$cols['event-days'] = 'event-days';
	return $cols;
}
add_filter( 'manage_edit-swp-cal_sortable_columns', 'swp_cal_sortable_columns' );



/**
 * Admin & actions
 * ADD NEW, EDIT
 */
function swp_cal_above_content($content) {
	if ( is_singular( 'swp-cal-event' ) ) {
		$post_custom = get_post_custom();
		$date_format = get_option( 'swp_cal_single_date_format', get_option( 'date_format' ) );
		foreach($post_custom as $key => $value) {
			if($key == 'event-date') {
				$date = strtotime($value[0]);
				$event_date = date($date_format, $date);
			}
			if($key == 'event-days' && $value[0] > 1) {
				$end_date = date($date_format, strtotime('+ '.$value[0].' days', $date));
			}
			if($key == 'event-time' && !empty($value[0])) {
				$event_time = $value[0];
			}
			if($key == 'event-repeat' && $value[0] > 0) {
				switch($value[0]) {
					case 1:
						$event_repeat = 'weekly';
						break;
					case 2:
						$event_repeat = 'monthly';
						break;
					case 3:
						$event_repeat = 'yearly';
						break;
				}
			}
			if($key == 'event-end' && $value[0] != 0) {
				$event_end .= date($date_format, strtotime($value[0]));
			}
		}
		$event_data .= '<div class="swp-cal-info"><div class="swp-cal-singular-date"><b>'.__('Datum události: ', 'simple-wp-calendar').$event_date;
		if(isset($end_date)) {
			$event_data .= __(' až ', 'simple-wp-calendar').$end_date.'</b></div>';
		} else {
			$event_data .= '</b></div>';
		}
		if(isset($event_time)) {
			$event_data .= '<div class="swp-cal-singular-time"><b>'.__('Čas události: ', 'simple-wp-calendar').$event_time.'</b></div>';
		}
		if(isset($event_repeat)) {
			$event_data .= '<div class="swp-cal-singular-repeat"><b>'.__('Tato událost se opakuje: ', 'simple-wp-calendar').$event_repeat;
			if(isset($event_end)) {
				$event_data .= __(' do ', 'simple-wp-calendar').$event_end.'.</b></div>';
			} else {
				$event_data .= '.</b></div>';
			}
		}
		$event_data .= '</div>';
		$content = $event_data.$content;
	}
	return $content;
}
add_filter( 'the_content', 'swp_cal_above_content' );

/**
 * Add a edit view vlastnosti pro několikadenní a opakované události a pro nastavení data
 */
function swp_cal_metabox() {
	add_meta_box(
		'swp-cal-metabox',
		__( 'Datum události &amp; Čas', 'simple-wp-calendar' ),
		'swp_cal_add_metabox',
		'swp-cal-event',
		'normal',
		'core'
	);
	add_meta_box(
		'swp-cal-metabox-repeat',
		__( 'Volitelné: Několikadenní událost a opakování události ročně, týdně, měsíčně', 'simple-wp-calendar' ),
		'swp_cal_add_metabox_longer',
		'swp-cal-event',
		'normal',
		'core'
	);
}
add_action( 'add_meta_boxes', 'swp_cal_metabox' );

function swp_cal_add_metabox( $post ) {
	wp_nonce_field( basename( __FILE__ ), 'swp-cal-nonce' );

	$event_date = get_post_meta( $post->ID, 'event-date', true );
	$event_time = get_post_meta( $post->ID, 'event-time', true );

	if(empty($event_date)) {
		$event_date = date('Y-m-d', time());
	}

?>
	<div>
		<label for="swp-cal-event-date" style="width: 100px; display: inline-block;"><?php _e( 'Datum události *', 'simple-wp-calendar' ); ?></label>
		<input id="swp-cal-event-date" type="text" name="swp-cal-event-date" placeholder="YYYY-MM-DD" value="<?php echo $event_date; ?>">
	</div>
	<div style="padding-top: 1em;">
		<label for="swp-cal-event-time" style="width: 100px; display: inline-block;"><?php _e( 'Čas události', 'simple-wp-calendar' ); ?></label>
		<input id="swp-cal-event-time" type="text" name="swp-cal-event-time" placeholder="<?php _e( '13:00-14:30, celý den', 'simple-wp-calendar' ); ?>" value="<?php echo $event_time; ?>">
	</div>
<?php
}

function swp_cal_add_metabox_longer( $post ) {
	wp_nonce_field( basename( __FILE__ ), 'swp-cal-nonce' );

	$event_days = get_post_meta( $post->ID, 'event-days', true );
	$event_repeat = get_post_meta( $post->ID, 'event-repeat', true );
	$event_end = get_post_meta( $post->ID, 'event-end', true );
	
	$weekly = '';
	$monthly = '';
	$yearly = ' selected="selected"';
	
	if(empty($event_days)) {
		$event_days = 1;
	}

	if($event_repeat > 0) {
		$checked = ' checked="checked"';
		$event_schedule = $event_repeat;
		if($event_schedule == 1) {
			$weekly = ' selected="selected"';
			$yearly = '';
		} elseif($event_schedule == 2) {
			$monthly = ' selected="selected"';
			$yearly = '';
		}
	} else {
		$checked = '';
	}

	if(!$event_end) {
		$checked_2 = ' checked="checked"';
		$event_end = '';
		$end_display = ' display: none;';
	} else {
		$checked_2 = '';
	}
?>
	<div id="swp-cal-days-div">
		<label for="swp-cal-event-days" style="width: 100px; display: inline-block;"><?php _e( 'Dny trvání události', 'simple-wp-calendar' ); ?></label>
		<input id="swp-cal-event-days" type="number" name="swp-cal-event-days" min="1" max="31" value="<?php echo $event_days; ?>">
	</div>
	<div id="swp-cal-repeat-div" style="padding-top: 1em;">
		<label for="swp-cal-event-repeat" style="width: 100px; display: inline-block;"><?php _e( 'Opakovat událost?', 'simple-wp-calendar' ); ?></label>
		<input id="swp-cal-event-repeat" type="checkbox" name="swp-cal-event-repeat" value="1"<?php echo $checked; ?>>
		<div id="repeat-schedule" style="display: inline-block;">
			<label for="swp-cal-event-repeat-schedule" style="width: 100px; display: none;"><?php _e( 'Jak často', 'simple-wp-calendar' ); ?></label>
			<select id="swp-cal-event-repeat-schedule" name="swp-cal-event-repeat-schedule">
				<option value="1"<?php echo $weekly; ?>><?php _e( 'Týdně', 'simple-wp-calendar' ); ?></option>
				<option value="2"<?php echo $monthly; ?>><?php _e( 'Měsíčně', 'simple-wp-calendar' ); ?></option>
				<option value="3"<?php echo $yearly; ?>><?php _e( 'Ročně', 'simple-wp-calendar' ); ?></option>
			</select>
		</div>
		<div id="swp-cal-repeat-end-div" style="display: none;">
			<div id="swp-cal-event-repeat-end-div" style="padding-top: 1em;">
				<label for="swp-cal-event-end-checkbox" style="width: 100px; display: inline-block;"> <?php _e( 'Neomezeně dlouho?', 'simple-wp-calendar' ); ?></label>
				<input id="swp-cal-event-end-checkbox" type="checkbox" name="swp-cal-event-end-checkbox" value="1"<?php echo $checked_2; ?>>
			</div>
			<div id="swp-cal-event-repeat-end-date-div" style="padding-top: 1em;<?php echo $end_display; ?>">
				<label for="swp-cal-event-end" style="width: 100px; display: inline-block;"> <?php _e( 'Datum konce', 'simple-wp-calendar' ); ?></label>
				<input id="swp-cal-event-end" type="text" name="swp-cal-event-end" placeholder="YYYY-MM-DD" value="<?php echo $event_end; ?>">
			</div>
		</div>
	</div>
<?php
}

function swp_cal_meta( $post_id ) {

	if ( 'swp-cal-event' != $_POST['post_type'] ) {
		return;
	}

	$is_autosave = wp_is_post_autosave( $post_id );
	$is_revision = wp_is_post_revision( $post_id );
	$is_valid_nonce = ( isset( $_POST['swp-cal-nonce'] ) && ( wp_verify_nonce( $_POST['swp-cal-nonce'], basename( __FILE__ ) ) ) ) ? true : false;

	if ( $is_autosave || $is_revision || ! $is_valid_nonce ) {
		return;
	}

	if ( isset( $_POST['swp-cal-event-date'] ) ) {
		update_post_meta( $post_id, 'event-date', $_POST['swp-cal-event-date']  );
	}
	if ( isset( $_POST['swp-cal-event-time'] ) ) {
		update_post_meta( $post_id, 'event-time', $_POST['swp-cal-event-time'] );
	}
	if(($_POST['swp-cal-event-days'] > 1 && $_POST['swp-cal-event-days'] <= 31) || !isset($_POST['swp-cal-event-repeat'])) {

		update_post_meta( $post_id, 'event-days', $_POST['swp-cal-event-days'] );
		update_post_meta( $post_id, 'event-repeat', 0 );
		update_post_meta( $post_id, 'event-end', 0 );

	} else {

		if($_POST['swp-cal-event-repeat'] == 1) {

			update_post_meta( $post_id, 'event-days', 1 );
			update_post_meta( $post_id, 'event-repeat', $_POST['swp-cal-event-repeat-schedule'] );

			if(!isset($_POST['swp-cal-event-end-checkbox'])) {
				update_post_meta( $post_id, 'event-end', $_POST['swp-cal-event-end'] );
			} else {
				update_post_meta( $post_id, 'event-end', 0 );
			}

		}
	}
}
add_action( 'save_post', 'swp_cal_meta' );



/**
 * @todo Udělám si vlastní datepicker na základě mého kalendáře, v plain JS.
 * Skript s ním přidám sem.
 * Vyřeší issue #2
 */
function swp_cal_admin_script_style( $hook ) {

	if ( 'post.php' == $hook || 'post-new.php' == $hook ) {
		wp_enqueue_script( 'events', plugin_dir_url(__FILE__) . 'assets/js/scripts.js', array( 'jquery', 'jquery-ui-datepicker' ), '0.1', true );
		wp_enqueue_style( 'jquery-ui-calendar', plugin_dir_url(__FILE__) . 'assets/css/jquery-ui.css', false, '1.11.1', 'all' );
	}
}
add_action( 'admin_enqueue_scripts', 'swp_cal_admin_script_style' );


/**
 * AJAX
 */

function swp_cal_scripts() {
	// wp_enqueue_script( 'script-name', plugin_dir_url(__FILE__).'assets/js/ajax.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'script-name', plugin_dir_url(__FILE__).'js/ajax.js', true );
	wp_localize_script( 'script-name', 'simpleWPCal', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ), 'security' => wp_create_nonce( 'simple-wp-calendar' ) ));
	// wp_localize_script( 'script-name', 'eventListCal', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ), 'security' => wp_create_nonce( 'event-list-cal' ) ));
	// wp_localize_script( 'script-name', 'eventListMiniCal', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ), 'security' => wp_create_nonce( 'event-list-mini-cal' ) ));
}
add_action( 'wp_enqueue_scripts', 'swp_cal_scripts' );


function swp_cal_callback() {
	check_ajax_referer( 'simple-wp-calendar', 'security' );
 
	// $cal_output = "";
	
	// $month = intval( $_POST["month"] );
	// $year = intval( $_POST["year"] );

	// $calendar_month = strtotime($year."-".$month."-01");
	// $current_month = 1;

	// if($year == date('Y', time()) && $month == date('m', time())) {
	// 	$current_month = 1;
	// } else {
	// 	$current_month = 0;
	// }	

	// $events = array();

	// $args = array(
	// 			'post_type'			=> 'swp-cal-event',
	// 			'posts_per_page'	=> -1,
	// 		);
	// $loop = new WP_Query( $args );
	
	// while ( $loop->have_posts() ) : $loop->the_post();
	// 	$event_date = get_post_custom_values('event-date');
	// 	$event_date = strtotime($event_date[0]);
	// 	$event_time = get_post_custom_values('event-time');
	// 	$event_time = $event_time[0];
	// 	$event_days = get_post_custom_values('event-days');
	// 	$event_days = $event_days[0];
	// 	$event_repeat = get_post_custom_values('event-repeat');
	// 	$event_repeat = $event_repeat[0];
	// 	$event_end = get_post_custom_values('event-end');
	// 	$event_end = $event_end[0];
	// 	if($event_repeat > 0) {
	// 		$event_repeat_schedule = $event_repeat;
	// 	} else {
	// 		$event_repeat_schedule = 0;
	// 	}
	// 	$events[] = "<a href=\"".get_permalink($loop->ID)."\">".get_the_title()."</a>==".$event_date."==".$event_time."==<a href=\"".get_permalink($loop->ID)."\">&nbsp;</a>".get_the_excerpt()."==".$event_days."==".$event_repeat_schedule."==".$event_end;
	// endwhile;

	$cal_output = "ahoj";

	// $cal_output .= "
	// 	<table class=\"event-list-cal\" id=\"".$month."-".$year."-full-".get_bloginfo('language')."\">
	// 		<thead>
	// 			<tr>";

	echo $cal_output;
	// printf($loop);

	die();
}
add_action( 'wp_ajax_swp-cal-event', 'swp_cal_callback' );
add_action( 'wp_ajax_nopriv_swp-cal-event', 'swp_cal_callback' );




/**
 * @todo Bude třeba předělat i pro ten malej kalendářík s výpisem událostí
 */
function swp_cal_mini() {    
    $output = '<div id="swp-cal-mini-main"></div>';

    return $output;
}
add_shortcode('mini-calendar', 'swp_cal_mini');

/**
 * Invoke styles and scripts
 */
function swp_cal_css() {
	echo '<link rel="stylesheet" href="'.plugin_dir_url(__FILE__).'css/style.css">';
}
add_action( 'wp_head', 'swp_cal_css' );

function swp_cal_javascript() {
	echo '<script type="text/javascript" src="'.plugin_dir_url(__FILE__).'js/script.js"></script>';
}
add_action( 'wp_footer', 'swp_cal_javascript' );

?>