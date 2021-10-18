import Service from '@ember/service';
import ENV from '../config/environment';

export default class OpenseaService extends Service {
  async getAssets(account) {
    const url = `https://rinkeby-api.opensea.io/api/v1/assets/?owner=${account}&limit=100`;
    let response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': ENV.openseaApiKey,
      }
    });
    let json = await response.json();

    return json.assets;
  }

  urlForAsset(asset) {
    const baseUrl = asset.network === 'rinkeby' ? 'https://rinkeby.opensea.io' : 'https://opensea.io';
    return `${baseUrl}/assets/${asset.asset_contract.address}/${asset.token_id}`;
  }
}
