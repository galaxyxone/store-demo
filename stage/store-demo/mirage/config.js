import Response from 'ember-cli-mirage/response';

export default function() {
  this.timing = 400;

  this.post('process-transaction', (_, request) => {
    let body = JSON.parse(request.requestBody);
    if (body.token && body.productId && body.recipient) {
      return {};
    } else {
      let error = { 'error': { 'message': 'Invalid request parameters' } };
      return new Response(422, {'content-type': 'application/json'}, error);
    }
  });

  this.get('https://rinkeby-api.opensea.io/api/v1/assets/', () => {
    return '{"estimated_count":10,"assets":[{"token_id":"55814945981858209408216055174471030188817236238488871094512621317535357295377","image_url":"https://storage.googleapis.com/opensea-rinkeby/0x9a475653c42b51ec0f3f32efab79beebc82a3eed/55814945981858209408216055174471030188817236238488871094512621317535357295377.png","image_preview_url":"https://storage.googleapis.com/opensea-rinkeby/0x9a475653c42b51ec0f3f32efab79beebc82a3eed/55814945981858209408216055174471030188817236238488871094512621317535357295377.png","image_thumbnail_url":"https://storage.googleapis.com/opensea-rinkeby/0x9a475653c42b51ec0f3f32efab79beebc82a3eed-thumbnail/55814945981858209408216055174471030188817236238488871094512621317535357295377.png","image_original_url":"https://example-dapp-2.bitski.com/assets/character-3.png","name":"Pink Dude","description":"An example of an ERC-721 token","external_link":"https://example-dapp-2.bitski.com","asset_contract":{"address":"0x9a475653c42b51ec0f3f32efab79beebc82a3eed","name":"Bitski Example Dapp","symbol":"","image_url":null,"featured_image_url":null,"featured":false,"description":null,"external_link":null,"wiki_link":null,"stats":null,"traits":null,"hidden":true,"nft_version":"3.0","schema_name":"ERC721","display_data":{"images":["https://storage.googleapis.com/opensea-rinkeby/0x9a475653c42b51ec0f3f32efab79beebc82a3eed/55814945981858209408216055174471030188817236238488871094512621317535357295377.png"]},"short_description":null,"total_supply":null,"buyer_fee_basis_points":0,"seller_fee_basis_points":250},"owner":{"user":null,"profile_img_url":"https://storage.googleapis.com/opensea-static/opensea-profile/5.png","address":"0x75448F078C57dfEEa0A4ee75D59a329c796e60cC","config":""},"permalink":"https://rinkeby.opensea.io/assets/0x9a475653c42b51ec0f3f32efab79beebc82a3eed/55814945981858209408216055174471030188817236238488871094512621317535357295377","background_color":null,"auctions":null,"sell_orders":[],"traits":[],"last_sale":null,"num_sales":0,"top_bid":null,"current_price":null,"current_escrow_price":null,"listing_date":null,"is_presale":false}]}';
  });

  this.passthrough('/inventory/tokens.json');
  this.passthrough('https://checkout.stripe.com/*');
  this.passthrough('https://www.googleapis.com/*');
  this.passthrough('https://securetoken.googleapis.com/*');
  this.passthrough('https://storage.googleapis.com/*');
  this.passthrough('https://account.bitski.com/*');
  this.passthrough('https://api.bitski.com/*');
}
