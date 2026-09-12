<?php
/**
 * Plugin Name: DEWAX: polskie tłumaczenie WooCommerce (obejście)
 * Description: WooCommerce 6.6.2 na tym WordPressie nie wczytuje pliku tłumaczenia z wp-content/languages/plugins. Ten plik wymusza wczytanie. Diagnoza: /?diagnoza-tlumaczen=1 (tylko zalogowany administrator). Usunąć po aktualizacji WooCommerce.
 * Author: DEWAX / Claude Code, 12.09.2026
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
add_action( 'init', 'dewax_wymus_tlumaczenie_woocommerce', 1 );
function dewax_wymus_tlumaczenie_woocommerce() {
    $locale     = function_exists( 'determine_locale' ) ? determine_locale() : get_locale();
    $plik       = WP_LANG_DIR . '/plugins/woocommerce-' . $locale . '.mo';
    $test_przed = __( 'Add to cart', 'woocommerce' );
    $wymuszono  = false;
    if ( 'Add to cart' === $test_przed && is_readable( $plik ) ) {
        $wymuszono = load_textdomain( 'woocommerce', $plik, $locale );
    }
    if ( isset( $_GET['diagnoza-tlumaczen'] ) && current_user_can( 'manage_options' ) ) {
        global $wp_filter;
        $dane = array(
            'locale'                => $locale,
            'WP_LANG_DIR'           => WP_LANG_DIR,
            'plik'                  => $plik,
            'plik_czytelny'         => is_readable( $plik ),
            'test_przed'            => $test_przed,
            'wymuszono'             => $wymuszono,
            'test_po'               => __( 'Add to cart', 'woocommerce' ),
            'domena_zaladowana'     => is_textdomain_loaded( 'woocommerce' ),
            'filtry_plugin_locale'  => isset( $wp_filter['plugin_locale'] ) ? count( $wp_filter['plugin_locale']->callbacks ) : 0,
            'filtry_override'       => isset( $wp_filter['override_load_textdomain'] ) ? count( $wp_filter['override_load_textdomain']->callbacks ) : 0,
            'filtry_mofile'         => isset( $wp_filter['load_textdomain_mofile'] ) ? count( $wp_filter['load_textdomain_mofile']->callbacks ) : 0,
            'wp'                    => get_bloginfo( 'version' ),
            'wc'                    => defined( 'WC_VERSION' ) ? WC_VERSION : '-',
        );
        header( 'Content-Type: application/json; charset=utf-8' );
        echo wp_json_encode( $dane );
        exit;
    }
}
