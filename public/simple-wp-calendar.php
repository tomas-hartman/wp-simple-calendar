<?php
/*
Plugin Name: WordPress calendar by Tomas Hartman
Plugin URI: https://github.com/tomas-hartman/wp-simple-calendar
Description: Inspired by discontinued Event List Calendar made by Ryan Fait, that I originally used for my project. Unlike the older one, this calendar's rendering module is based on pure javascript and tries to avoid jQuery. Invokes by shortcode: swp_cal_mini and swp_cal_list. Nothing more yet. Installation: If you ever used Event list calendar in the past, this plug-in automatically imports its data to be used with SWP Calendar. After activation of SWP Calendar, please, deactivate Event list calendar as there are known incompatibility issues.   
Author: Tomas Hartman
Version: 2.1-dev
Author URI: https://github.com/tomas-hartman/
Text Domain: simple-wp-calendar
*/

add_filter('widget_text', 'do_shortcode'); // Allows the shortcode to work in text widgets.

/**
 * Init a data handling
 */
function swp_cal_post_type() {
	register_post_type( 
    'swp-cal-event',
		[
			'labels' => [
				'name' => 'Události',
				'singular_name' => 'Událost',
				'edit_item' => 'Upravit událost',
				'add_new_item' => 'Přidat novou událost'
			],
      'description' => "Události kalendáře",
      'taxonomies' => ['category'],
      'menu_icon' => 'dashicons-calendar',
      'menu_position' => 23,
      'public' => true,
      'has_archive' => true,
      'exclude_from_search' => true,
      // 'show_in_rest' => true,
      'rest_base' => 'event',
      'rewrite' => [
        'slug' => 'event'
      ],
      'supports' => ['title', 'editor'],
    ]
	);
}
add_action( 'init', 'swp_cal_post_type' );

/**
 * Activation and migration from event-list-cal
 * https://wordpress.stackexchange.com/questions/97026/how-do-i-safely-change-the-name-of-a-custom-post-type
 */
function swp_cal_initial_import () 
{
	$args = [
    'post_type' => 'event-list-cal',
		'posts_per_page' => -1
  ];

	$loop = new WP_Query( $args );

	if($loop->post_count < 1) return;

	global $wpdb;
	$old_post_types = [
    'event-list-cal' => 'swp-cal-event'
  ];

	foreach ($old_post_types as $old_type=>$type) {
		$wpdb->query( $wpdb->prepare( "UPDATE {$wpdb->posts} SET post_type = REPLACE(post_type, %s, %s) 
							 WHERE post_type LIKE %s", $old_type, $type, $old_type ) );
		$wpdb->query( $wpdb->prepare( "UPDATE {$wpdb->posts} SET guid = REPLACE(guid, %s, %s) 
							 WHERE guid LIKE %s", "post_type={$old_type}", "post_type={$type}", "%post_type={$type}%" ) );
		$wpdb->query( $wpdb->prepare( "UPDATE {$wpdb->posts} SET guid = REPLACE(guid, %s, %s) 
							 WHERE guid LIKE %s", "/{$old_type}/", "/{$type}/", "%/{$old_type}/%" ) );
	}
	
	swp_cal_post_type();
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, "swp_cal_initial_import" );

/**
 * Přehled událostí - sloupce a jejich nastavení
 */
function swp_cal_columns( $cols ) 
{
	$cols = [
    'cb'					=>	'<input type="checkbox" />',
		'title'					=>	_x('Název události', 'simple-wp-calendar'),
		'event-date'			=>	__('Datum události', 'simple-wp-calendar'),
		'event-end'				=>	__('Konec události', 'simple-wp-calendar'),
		'event-repeat'			=>	__('Opakování události', 'simple-wp-calendar'),
		'event-days'			=>	__('Trvání události', 'simple-wp-calendar'),
		// 'event-repetition-end'	=>	__('Konec opakování události', 'simple-wp-calendar'),
		'categories'			=>	__('Kategorie', 'simple-wp-calendar'),
  ];

	return $cols;
}
add_filter( 'manage_swp-cal-event_posts_columns', 'swp_cal_columns' ); // wp si z manage_swp-cal-event_posts_columns parsuje typ lol

function swp_cal_columns_data( $column, $post_id ) 
{
	if(get_post_type($post_id) != "swp-cal-event")
  {
		return;
	}

  switch ( $column ) 
  {
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

    case "event-end":
      $event_end = get_post_meta( $post_id, 'event-end', true);
      echo $event_end;
      break;

    case "event-repetition-end":
      $event_repetition_end = get_post_meta( $post_id, 'event-repetition-end', true);
      echo $event_repetition_end;
      break;
  }
}
add_action( 'manage_posts_custom_column', 'swp_cal_columns_data', 10, 2 );

function swp_cal_sortable_columns( $cols ) {
	$cols['title'] = 'title';
	$cols['event-date'] = 'event-date';
	$cols['event-repeat'] = 'event-repeat';
	$cols['event-days'] = 'event-days';
	$cols['event-end'] = 'event-end';
	// $cols['event-repetition-end'] = 'event-repetition-end';
	return $cols;
}
add_filter( 'manage_edit-swp-cal-event_sortable_columns', 'swp_cal_sortable_columns' );

/**
 * Admin & actions
 * ADD NEW, EDIT
 */
function swp_cal_above_content($content) 
{
	if ( is_singular( 'swp-cal-event' ) ) 
  {
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
			if($key == 'event-end' && $value[0] == 0) {
				$date = strtotime($value[0]);
				$event_end = date($date_format, $date);
			}
		}

		$event_data = '<div class="swp-cal-info"><div class="swp-cal-singular-date"><b>'.__('Datum události: ', 'simple-wp-calendar').$event_date;
		
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
function swp_cal_metabox() 
{
	add_meta_box(
		'swp-cal-metabox',
		__( 'Datum události &amp; čas', 'simple-wp-calendar' ),
		'swp_cal_add_metabox',
		'swp-cal-event',
		'normal',
		'core'
	);

	add_meta_box(
		'swp-cal-metabox-repeat',
		__( 'Volitelné: Opakovaná událost - ročně, týdně, měsíčně', 'simple-wp-calendar' ),
		'swp_cal_add_metabox_longer',
		'swp-cal-event',
		'normal',
		'core'
	);
}
add_action( 'add_meta_boxes', 'swp_cal_metabox' );

function swp_cal_add_metabox( $post ) 
{
  wp_nonce_field( basename( __FILE__ ), 'swp-cal-nonce' );

  $event_date = get_post_meta( $post->ID, 'event-date', true );
	$event_time = get_post_meta( $post->ID, 'event-time', true );
	$event_end = get_post_meta( $post->ID, 'event-end', true);
	$event_days = get_post_meta( $post->ID, 'event-days', true);

  $metaData = [
    "eventDate" => $event_date,
    "eventTime" => $event_time,
    "eventEnd" => $event_end,
    "eventDays" => (int) $event_days
  ];
  $metaData = json_encode($metaData);

  echo "
    <div id='validate'><ul></ul></div>
    <div class='swpc-admin-general' data-meta=$metaData></div>
  ";
}

function swp_cal_add_metabox_longer( $post ) 
{
  wp_nonce_field( basename( __FILE__ ), 'swp-cal-nonce' );

  $event_repeat = get_post_meta( $post->ID, 'event-repeat', true );

  $metaData = [
    "eventRepeat" => (int) $event_repeat,
  ];
  $metaData = json_encode($metaData);

  echo "<div class='swpc-admin-repetition' data-meta=$metaData></div>";
}

function swp_cal_meta_save( $post_id ) 
{
	if ( $_POST['post_type'] != 'swp-cal-event' ) { // event-list-cal: toto bude potřeba upravit
		return;
	}

	$is_autosave = wp_is_post_autosave( $post_id );
	$is_revision = wp_is_post_revision( $post_id );
	$is_valid_nonce = ( isset( $_POST['swp-cal-nonce'] ) && ( wp_verify_nonce( $_POST['swp-cal-nonce'], basename( __FILE__ ) ) ) ) ? true : false;

	if ( $is_autosave || $is_revision || ! $is_valid_nonce ) {
		return;
	}

	if ( isset( $_POST['swp-cal-event-date'] ) ) {
    update_post_meta( $post_id, 'event-date', $_POST['swp-cal-event-date']);
	}
  if ( isset( $_POST['swp-cal-event-time'] ) ) {
    update_post_meta( $post_id, 'event-time', $_POST['swp-cal-event-time']);
  } 
	
	if ( isset( $_POST['swp-cal-event-date'] ) && isset( $_POST['swp-cal-event-date-end'] ) && $_POST['swp-cal-event-date-end'] != 0 ) {
		// PHP 5.3+
		$first = new DateTime($_POST['swp-cal-event-date']);
		$second = new DateTime($_POST['swp-cal-event-date-end']);
		$days = $second->diff($first)->format("%a");

		update_post_meta( $post_id, 'event-end', $_POST['swp-cal-event-date-end'] );
		update_post_meta( $post_id, 'event-repetition-end', $_POST['swp-cal-event-date-end'] );
		update_post_meta( $post_id, 'event-days', $days + 1 ); // +1 proto, aby jednodenní akce neměla délku "0 dní"; včetně 1. dne
	} else if ($_POST['swp-cal-event-date-end'] == 0) {
		update_post_meta( $post_id, 'event-end', null );
		update_post_meta( $post_id, 'event-repetition-end', null );
		update_post_meta( $post_id, 'event-days', 1 );
	}
	
	if(!isset($_POST['swp-cal-event-repeat'])) {
		update_post_meta( $post_id, 'event-repeat', 0 );
	} else {
		if($_POST['swp-cal-event-repeat'] == 1) {

			update_post_meta( $post_id, 'event-repeat', (int) $_POST['swp-cal-event-repeat-schedule'] );

			if(isset($_POST['swp-cal-event-date-end']) && $_POST['swp-cal-event-date-end'] != 0 ) {
				$first = new DateTime($_POST['swp-cal-event-date']);
				$second = new DateTime($_POST['swp-cal-event-date-end']);
				$days = $second->diff($first)->format("%a");

				update_post_meta( $post_id, 'event-days', $days + 1  );
				update_post_meta( $post_id, 'event-repetition-end', $_POST['swp-cal-event-date-end'] );
			} else {
				update_post_meta( $post_id, 'event-days', 1 );
				update_post_meta( $post_id, 'event-repetition-end', null );
			}

		}
	}
}
add_action( 'save_post', 'swp_cal_meta_save' );

/** @todo admin */
function swp_cal_admin_script_style( $hook ) 
{
	if ( 'post.php' == $hook || 'post-new.php' == $hook ) {
		wp_enqueue_script( 'simpleWPCalScript', plugin_dir_url(__FILE__).'js/chunk-vendors.js', [], '1.0.0', true );
		wp_enqueue_script( 'simpleWPCalScriptAdmin', plugin_dir_url(__FILE__).'js/admin.js', [], '1.0.0', true );
		wp_enqueue_style( 'style', plugin_dir_url(__FILE__).'css/admin.css');
	}
}
add_action( 'admin_enqueue_scripts', 'swp_cal_admin_script_style' );

/**
 * Invoke styles and scripts
 */
function swp_cal_css() 
{
  $element = '<link rel="stylesheet" href="'.plugin_dir_url(__FILE__).'css/public.css">';
	echo $element;
}
add_action( 'wp_head', 'swp_cal_css' );

/**
 * Frontend
 */

function swp_cal_scripts() 
{
  wp_enqueue_script('simpleWPCalScriptChunks', plugin_dir_url(__FILE__).'js/chunk-vendors.js', [], '1.0.0', true);

  // loads in header
	wp_enqueue_script('simpleWPCalScriptApp', plugin_dir_url(__FILE__).'js/public.js', [], '1.0.0', true);

	wp_localize_script(
    'simpleWPCalScriptApp', 
    'simpleWPCal', 
    [
      'ajaxurl' => admin_url( 'admin-ajax.php' ), 
      'security' => wp_create_nonce( 'simple-wp-calendar' )
    ] 
  );
}
add_action( 'wp_enqueue_scripts', 'swp_cal_scripts' );


/** REST API */

function swp_cal_json() 
{
	// check_ajax_referer( 'simple-wp-calendar', 'security' );

	$args = [
    'post_type' => 'swp-cal-event', // Takhle se to jmenuje správně
		'posts_per_page' => -1,
  ];
	$loop = new WP_Query( $args );
	$events = array();

	while ( $loop->have_posts() ) : $loop->the_post();
    $event = new \stdClass;
		
		$title = html_entity_decode(get_the_title());
		$permalink = get_permalink($loop->ID);
		$eventDate = get_post_custom_values('event-date')[0];
		$eventTime = get_post_custom_values('event-time')[0];
		$eventDays = (int) get_post_custom_values('event-days')[0];
		$eventRepeat = (int) get_post_custom_values('event-repeat')[0];
		$eventEnd = get_post_custom_values('event-end')[0];
		$eventRepetitionEnd = get_post_custom_values('event-repetition-end')[0];
    $excerpt = get_the_excerpt();
    $categories = get_the_category();

    $eventRepeatSchedule = 0;

    if($eventRepeat > 0) {
      $eventRepeatSchedule = $eventRepeat[0];
    }

    $event->title = $title;
    $event->permalink = $permalink;
    $event->eventDate = $eventDate;
    $event->eventTime = $eventTime;
    $event->eventDays = $eventDays;
    $event->eventRepeat = $eventRepeat;
    $event->eventEnd = $eventEnd;
    $event->eventRepetitionEnd = $eventRepetitionEnd;
    $event->excerpt = $excerpt;
    $event->eventRepeatSchedule = $eventRepeatSchedule;
    $event->categories = $categories;
    
    array_push($events, $event);
	endwhile;

	return $events;
}

/**
 * This function is where we register our routes for our example endpoint.
 */
function swp_cal_register_route() 
{
  register_rest_route(
    'swpc/v1', 
    '/events', 
    [
      // By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
      'methods'  => WP_REST_Server::READABLE,
      // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
      'callback' => 'swp_cal_json',
    ] 
  );
}
add_action( 'rest_api_init', 'swp_cal_register_route' );

/* class SWPCalEvent {
	private $options;

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_plugin_pages_swp' ) );
		add_action( 'admin_init', array( $this, 'page_init_swp' ) );
	}

	public function add_plugin_pages_swp() {

		add_submenu_page(
			'edit.php?post_type=swp-cal-event',
			'Nastavení bgbg',
			'O plugssssinu',
			'swp_manage_options',
			'about',
			array( $this, 'swp_create_about_page' )
		);
		add_submenu_page(
			'edit.php?post_type=swp-cal-event',
			'Nastavení bgbg',
			'Nastavení bgbg',
			'swp_manage_options',
			'settings',
			array( $this, 'swp_create_settings_page' )
		);
	}

	public function page_init_swp() {

		register_setting(
			'swp-cal-settings', // Option group
			'swp-cal-settings', // Option name
			array( $this, 'sanitize' ) // Sanitize
		);

		add_settings_section(
			'event_list_cal_date_format_section', // ID
			'Nastavení formátu data', // Title
			array( $this, 'print_date_info' ), // Callback
			'swp-cal-settings' // Page
		);

		add_settings_field(
			'event_list_cal_upcoming_date_format', // ID
			'Datum nadcházejících událostí', // Title 
			array( $this, 'event_list_cal_upcoming_date_format_callback' ), // Callback
			'swp-cal-settings', // Page
			'swp_event_list_cal_date_format_section' // Section		   
		);

		add_settings_field(
			'event_list_cal_single_date_format', 
			'Formát stránky s jednotlivými akcemi', 
			array( $this, 'event_list_cal_single_date_format_callback' ), 
			'swp-cal-settings', 
			'swp_event_list_cal_date_format_section'
		);

		add_settings_section(
			'swp_event_list_cal_theme_section', // ID
			'Vzhled kalendáře', // Title
			array( $this, 'print_theme_info' ), // Callback
			'swp-cal-settings' // Page
		);

		add_settings_field(
			'swp_event_list_cal_theme', // ID
			'Zvolte téma', // Title 
			array( $this, 'event_list_cal_theme_callback' ), // Callback
			'swp-cal-settings', // Page
			'swp_event_list_cal_theme_section' // Section		   
		);

	}
}

if( is_admin() ) {
	$my_settings = new SWPCalEvent();
} */


function swp_cal_mini() 
{
  $output = '<div class="swpc"></div>';
  return $output;
}
add_shortcode('swpc-calendar', 'swp_cal_mini');

function swp_cal_list($atts) 
{    
  $length = 0; // default

  if(isset($atts["length"])) {
    $length = $atts["length"];
  }

	$output = "<div class='swpc-list' data-length='$length'></div>";

  return $output;
}
add_shortcode('swpc-list', 'swp_cal_list');

?>