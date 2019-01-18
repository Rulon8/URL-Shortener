class Api {
  
/* Sets the options for posting a URL to the API.
 */
  async postUrl(long_url) {
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url: long_url})
    };
    let apiResponse = await this.request('/url.json', options);
    return apiResponse;
  }

/* Sets the options for getting the top most used URLs
 * from the API.
 */
  async getTop() {
    let apiResponse = await this.request('/top.json');
    return apiResponse;
  }
  
/* Makes a call to the backend API to the indicated url
 * using the given request options.
 */
  async request(url, options) {
    let apiResponse = await fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Unknown error');
      }
    }).then((jsonResponse) => {
      return jsonResponse;
    }).catch((myError) => {
      return {errors: myError};
    });
    return apiResponse;
  }
}

export default Api;