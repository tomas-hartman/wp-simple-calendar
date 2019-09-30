<?php

add_filter('widget_text', 'do_shortcode');

/**
 * Pravděpodobně budu muset úplně kompletně přepsat, abych tomu rozuměl a dávalo mi to smysl
 */

/**
 * TBA
 */
function simple_wp_calendar_post_type() {
	register_post_type( 'simple_wp_calendar',
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
		'rewrite' => array('slug' => 'event'),
		'supports' => array( 'title', 'editor' ),
		)
	);
}
add_action( 'init', 'simple_wp_calendar_post_type' );

/**
 * TBA
 */
function simple_wp_calendar_columns( $cols ) {

	$cols = array(
		'cb'			=>	'<input type="checkbox" />',
		'title'			=>	_x('Název události', 'event-list-calendar'),
		'event-date'	=>	__('Datum události', 'event-list-calendar'),
		'event-repeat'	=>	__('Opakování události', 'event-list-calendar'),
		'event-days'	=>	__('Trvání události', 'event-list-calendar'),
		'categories'	=>	__('Kategorie', 'event-list-calendar'),
	);
	return $cols;
}
add_filter( 'manage_simple_wp_calendar_columns', 'simple_wp_calendar_columns' );

/**
 * TBA
 */
function simple_wp_calendar_columns_data($column, $post_id) {
    switch ( $column ) {
      case "event-date":
        $event_date = get_post_meta( $post_id, 'event-date', true);
        echo $event_date;
        break;
      case "event-repeat":
          $event_repeat = get_post_meta( $post_id, 'event-repeat', true);
          if($event_repeat == 1) {
              $event_repeat = __('Týdně', 'simple_wp_calendar');
          } elseif($event_repeat == 2) {
              $event_repeat = __('Měsíčně', 'simple_wp_calendar');
          } elseif($event_repeat == 3) {
              $event_repeat = __('Ročně', 'simple_wp_calendar');
          } else {
              $event_repeat = __('Jednorázová akce', 'simple_wp_calendar');
          }
          echo $event_repeat;
          break;
      case "event-days":
          $event_days = get_post_meta( $post_id, 'event-days', true);
          if(empty($event_days)) {
              $event_days = $event_days.__('1 den', 'simple_wp_calendar');
          } elseif($event_days == 1) {
              $event_days = $event_days.__(' den', 'simple_wp_calendar');
          } else {
              $event_days = $event_days.__(' dny', 'simple_wp_calendar');
          }
          echo $event_days;
          break;
    }
  }
add_action( 'manage_posts_custom_column', 'simple_wp_calendar_columns_data', 10, 2 );

/**
 * TBA
 */
function simple_wp_calendar_sortable_columns( $columns ) {
	$cols['event-date'] = 'event-date';
	$cols['event-repeat'] = 'event-repeat';
	$cols['event-days'] = 'event-days';
	return $cols;
}
add_filter( 'manage_edit-simple_wp_calendar_sortable_columns', 'simple_wp_calendar_sortable_columns' );

/**
 * Hlavní funkce pro výpis main kalendáře
 */
function simple_wp_calendar( $atts ) {
    return "hello";
}
add_shortcode('calendar', 'simple_wp_calendar');

/**
 * Druhá main funkce pro výpis menšího kalendáře
 */
function event_list_mini_cal() {
    return "hello2";
}
add_shortcode('mini-calendar', 'event_list_mini_cal');

/**
 * Main funkce pro výpis nadcházejících událostí
 */
function event_list_cal_list( $atts ) {
    return "hello3";
}
add_shortcode('upcoming-events', 'event_list_cal_list');

/**
 * Tohle vlastně nevím, co dělá
 */
function event_list_cal_above_content($content) {
	if ( is_singular( 'event-list-cal' ) ) {
		$post_custom = get_post_custom();
		$date_format = get_option( 'event_list_cal_single_date_format', get_option( 'date_format' ) );
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
		$event_data .= '<div class="event-list-cal-info"><div class="event-list-cal-singular-date"><b>'.__('Datum události: ', 'event-list-calendar').$event_date;
		if(isset($end_date)) {
			$event_data .= __(' až ', 'event-list-calendar').$end_date.'</b></div>';
		} else {
			$event_data .= '</b></div>';
		}
		if(isset($event_time)) {
			$event_data .= '<div class="event-list-cal-singular-time"><b>'.__('Čas události: ', 'event-list-calendar').$event_time.'</b></div>';
		}
		if(isset($event_repeat)) {
			$event_data .= '<div class="event-list-cal-singular-repeat"><b>'.__('Tato událost se opakuje: ', 'event-list-calendar').$event_repeat;
			if(isset($event_end)) {
				$event_data .= __(' do ', 'event-list-calendar').$event_end.'.</b></div>';
			} else {
				$event_data .= '.</b></div>';
			}
		}
		$event_data .= '</div>';
		$content = $event_data.$content;
	}
	return $content;
}
add_filter( 'the_content', 'event_list_cal_above_content' );

/**
 * TBA
 */
function event_list_cal_metabox() {
	add_meta_box(
		'event-list-cal-metabox',
		__( 'Datum události &amp; Čas', 'event-list-calendar' ),
		'event_list_cal_add_metabox',
		'event-list-cal',
		'normal',
		'core'
	);
	add_meta_box(
		'event-list-cal-metabox-repeat',
		__( 'Volitelné: Několikadenní událost a opakování události ročně, týdně, měsíčně', 'event-list-calendar' ),
		'event_list_cal_add_metabox1',
		'event-list-cal',
		'normal',
		'core'
	);
}
add_action( 'add_meta_boxes', 'event_list_cal_metabox' );

/**
 * TBA
 */
function event_list_cal_add_metabox( $post ) {

	wp_nonce_field( basename( __FILE__ ), 'event-list-cal-nonce' );

	$event_date = get_post_meta( $post->ID, 'event-date', true );
	$event_time = get_post_meta( $post->ID, 'event-time', true );

	if(empty($event_date)) {
		$event_date = date('Y-m-d', time());
	}

?>
	<div>
		<label for="event-list-cal-event-date" style="width: 100px; display: inline-block;"><?php _e( 'Datum události *', 'event-list-calendar' ); ?></label>
		<input id="event-list-cal-event-date" type="text" name="event-list-cal-event-date" placeholder="YYYY-MM-DD" value="<?php echo $event_date; ?>">
	</div>
	<div style="padding-top: 1em;">
		<label for="event-list-cal-event-time" style="width: 100px; display: inline-block;"><?php _e( 'Čas události', 'event-list-calendar' ); ?></label>
		<input id="event-list-cal-event-time" type="text" name="event-list-cal-event-time" placeholder="<?php _e( '1pm to 3:30pm, All Day...', 'event-list-calendar' ); ?>" value="<?php echo $event_time; ?>">
	</div>
<?php
}

/**
 * TBA
 */
function event_list_cal_add_metabox1( $post ) {
	wp_nonce_field( basename( __FILE__ ), 'event-list-cal-nonce' );

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
        <div id="event-list-cal-days-div">
            <label for="event-list-cal-event-days" style="width: 100px; display: inline-block;"><?php _e( 'Dny trvání události', 'event-list-calendar' ); ?></label>
            <input id="event-list-cal-event-days" type="number" name="event-list-cal-event-days" min="1" max="31" value="<?php echo $event_days; ?>">
        </div>
        <div id="event-list-cal-repeat-div" style="padding-top: 1em;">
            <label for="event-list-cal-event-repeat" style="width: 100px; display: inline-block;"><?php _e( 'Opakovat událost?', 'event-list-calendar' ); ?></label>
            <input id="event-list-cal-event-repeat" type="checkbox" name="event-list-cal-event-repeat" value="1"<?php echo $checked; ?>>
            <div id="repeat-schedule" style="display: inline-block;">
                <label for="event-list-cal-event-repeat-schedule" style="width: 100px; display: none;"><?php _e( 'Jak často', 'event-list-calendar' ); ?></label>
                <select id="event-list-cal-event-repeat-schedule" name="event-list-cal-event-repeat-schedule">
                    <option value="1"<?php echo $weekly; ?>><?php _e( 'Týdně', 'event-list-calendar' ); ?></option>
                    <option value="2"<?php echo $monthly; ?>><?php _e( 'Měsíčně', 'event-list-calendar' ); ?></option>
                    <option value="3"<?php echo $yearly; ?>><?php _e( 'Ročně', 'event-list-calendar' ); ?></option>
                </select>
            </div>
            <div id="event-list-cal-repeat-end-div" style="display: none;">
                <div id="event-list-cal-event-repeat-end-div" style="padding-top: 1em;">
                    <label for="event-list-cal-event-end-checkbox" style="width: 100px; display: inline-block;"> <?php _e( 'Navždy?', 'event-list-calendar' ); ?></label>
                    <input id="event-list-cal-event-end-checkbox" type="checkbox" name="event-list-cal-event-end-checkbox" value="1"<?php echo $checked_2; ?>>
                </div>
                <div id="event-list-cal-event-repeat-end-date-div" style="padding-top: 1em;<?php echo $end_display; ?>">
                    <label for="event-list-cal-event-end" style="width: 100px; display: inline-block;"> <?php _e( 'Datum konce', 'event-list-calendar' ); ?></label>
                    <input id="event-list-cal-event-end" type="text" name="event-list-cal-event-end" placeholder="YYYY-MM-DD" value="<?php echo $event_end; ?>">
                </div>
            </div>
        </div>
    <?php
}

// a další.

?>