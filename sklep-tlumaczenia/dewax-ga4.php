<?php
/**
 * Plugin Name: DEWAX: Google Analytics 4 w sklepie (gtag, zgoda na cookies, zdarzenie zakupu)
 * Description: Ten sam pomiar co na dewax.pl/multilan. Identyfikator w stałej DEWAX_GA4_ID (pusty = wyłączone). Zgoda zapisywana w localStorage (multilan_cookies), wspólna nazwa klucza ze stroną Multilan. Zdarzenie purchase na stronie podziękowania po zamówieniu.
 * Author: DEWAX / Claude Code, 12.09.2026
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
if ( ! defined( 'DEWAX_GA4_ID' ) ) {
    define( 'DEWAX_GA4_ID', '' ); // wpisać identyfikator strumienia GA4, np. G-XXXXXXXXXX
}

add_action( 'wp_head', 'dewax_ga4_head', 1 );
function dewax_ga4_head() {
    if ( '' === DEWAX_GA4_ID || is_admin() ) {
        return;
    }
    $id = esc_js( DEWAX_GA4_ID );
    ?>
<script>
(function(){
  var ID='<?php echo $id; ?>', KLUCZ='multilan_cookies';
  function zgoda(){ try { return localStorage.getItem(KLUCZ); } catch(e){ return null; } }
  function zapisz(v){ try { localStorage.setItem(KLUCZ, v); } catch(e){} }
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  var zaladowano=false;
  function laduj(){ if(zaladowano) return; zaladowano=true; var s=document.createElement('script'); s.async=true; s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(ID); document.head.appendChild(s); }
  gtag('consent','default',{ analytics_storage: zgoda()==='tak' ? 'granted' : 'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied' });
  gtag('js', new Date());
  gtag('config', ID, { linker: { domains: ['dewax.pl','sklep.dewax.pl'] }, send_page_view: true });
  if (zgoda()==='tak') laduj();
  window.mlEv = function(nazwa, p){ gtag('event', nazwa, p||{}); };
  window.dewaxCookies = { zgoda: zgoda, zapisz: zapisz, laduj: laduj, gtag: gtag };
})();
</script>
    <?php
}

add_action( 'wp_footer', 'dewax_ga4_baner', 99 );
function dewax_ga4_baner() {
    if ( '' === DEWAX_GA4_ID || is_admin() ) {
        return;
    }
    $polityka = esc_url( home_url( '/polityka-prywatnosci/' ) );
    ?>
<div id="dewax-cookies" hidden role="dialog" aria-live="polite" aria-label="Zgoda na cookies" style="position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;background:#fff;border:1px solid #DDDDDD;box-shadow:0 6px 24px rgba(10,0,43,.14);padding:18px 20px;max-width:900px;margin:0 auto;font-family:'Open Sans',sans-serif;color:#2B2B2B;display:none">
  <div style="display:flex;flex-wrap:wrap;gap:16px 24px;align-items:center;justify-content:space-between">
    <div style="flex:1 1 320px"><b>Cookies i statystyki</b><p style="margin:4px 0 0;font-size:14px;color:#666">Liczymy wejścia i zamówienia w Google Analytics, żeby wiedzieć, co w sklepie działa. Cookies statystyczne włączamy tylko za Twoją zgodą. <a href="<?php echo $polityka; ?>" style="color:#17006B">Polityka prywatności</a>.</p></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button type="button" id="dewax-cookies-tak" style="background:#17006B;color:#fff;border:0;border-radius:8px;padding:11px 18px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;font-size:13px;cursor:pointer">Zgadzam się</button>
      <button type="button" id="dewax-cookies-nie" style="background:transparent;color:#2B2B2B;border:2px solid #DDDDDD;border-radius:8px;padding:11px 18px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;font-size:13px;cursor:pointer">Tylko niezbędne</button>
    </div>
  </div>
</div>
<script>
(function(){
  var c = window.dewaxCookies; if (!c) return;
  var b = document.getElementById('dewax-cookies'); if (!b || c.zgoda() !== null) return;
  b.hidden = false; b.style.display = 'block';
  document.getElementById('dewax-cookies-tak').addEventListener('click', function(){ c.zapisz('tak'); c.gtag('consent','update',{analytics_storage:'granted'}); c.laduj(); b.style.display='none'; });
  document.getElementById('dewax-cookies-nie').addEventListener('click', function(){ c.zapisz('nie'); b.style.display='none'; });
})();
</script>
    <?php
}

add_action( 'woocommerce_thankyou', 'dewax_ga4_zakup', 20 );
function dewax_ga4_zakup( $order_id ) {
    if ( '' === DEWAX_GA4_ID || ! function_exists( 'wc_get_order' ) ) {
        return;
    }
    $order = wc_get_order( $order_id );
    if ( ! $order || $order->get_meta( '_dewax_ga4_wyslano' ) ) {
        return;
    }
    $items = array();
    foreach ( $order->get_items() as $item ) {
        $product = $item->get_product();
        $items[] = array(
            'item_id'   => $product ? ( $product->get_sku() ?: (string) $product->get_id() ) : (string) $item->get_product_id(),
            'item_name' => $item->get_name(),
            'quantity'  => (int) $item->get_quantity(),
            'price'     => $item->get_quantity() ? round( (float) $item->get_total() / $item->get_quantity(), 2 ) : 0,
        );
    }
    $dane = array(
        'transaction_id' => (string) $order->get_order_number(),
        'value'          => (float) $order->get_total(),
        'currency'       => $order->get_currency(),
        'shipping'       => (float) $order->get_shipping_total(),
        'tax'            => (float) $order->get_total_tax(),
        'items'          => $items,
    );
    echo '<script>window.mlEv && window.mlEv("purchase", ' . wp_json_encode( $dane ) . ');</script>';
    $order->update_meta_data( '_dewax_ga4_wyslano', 1 );
    $order->save();
}
