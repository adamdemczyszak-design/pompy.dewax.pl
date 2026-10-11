<?php
/**
 * Plugin Name: DEWAX: przeniesienie jednego produktu do kosza (jednorazowe)
 * Description: Wgrywany przez workflow sklep.yml (tryb kosz) z losowym tokenem, uruchamiany raz adresem /?dewax-kosz=TOKEN, potem usuwany przez FTP. Przenosi produkt o podanym ID do kosza WooCommerce (nie kasuje na stałe; da się przywrócić w panelu: Produkty -> Kosz). Decyzja Adama z 11.10.2026: usunąć "Żywica poliuretanowa PP-19".
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
add_action( 'init', 'dewax_kosz_produktu', 1 );
function dewax_kosz_produktu() {
    $TOKEN = '%%TOKEN%%';
    $ID    = (int) '%%ID%%';
    $NAZWA = '%%NAZWA%%'; // fragment nazwy, zabezpieczenie przed pomyłką ID
    if ( ! isset( $_GET['dewax-kosz'] ) ) {
        return;
    }
    header( 'Content-Type: application/json; charset=utf-8' );
    if ( ! hash_equals( $TOKEN, (string) $_GET['dewax-kosz'] ) ) {
        http_response_code( 403 );
        echo '{"ok":false,"blad":"token"}';
        exit;
    }
    $post = get_post( $ID );
    if ( ! $post || 'product' !== $post->post_type ) {
        echo wp_json_encode( array( 'ok' => false, 'blad' => 'brak produktu o tym ID', 'id' => $ID ) );
        exit;
    }
    if ( false === mb_stripos( $post->post_title, $NAZWA ) ) {
        echo wp_json_encode( array( 'ok' => false, 'blad' => 'nazwa nie pasuje, nic nie ruszam', 'id' => $ID, 'tytul' => $post->post_title ) );
        exit;
    }
    if ( 'trash' === $post->post_status ) {
        echo wp_json_encode( array( 'ok' => true, 'uwaga' => 'juz w koszu', 'id' => $ID, 'tytul' => $post->post_title ) );
        exit;
    }
    $wynik = wp_trash_post( $ID ); // WooCommerce sam przenosi do kosza takze warianty
    $po    = get_post( $ID );
    echo wp_json_encode( array(
        'ok'     => (bool) $wynik,
        'id'     => $ID,
        'tytul'  => $post->post_title,
        'status' => $po ? $po->post_status : null,
        'strona' => get_permalink( $ID ),
    ) );
    exit;
}
