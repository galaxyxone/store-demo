# This file is executed when the server container is run and interpolates ENV variables into the config files below.

inject_env_vars() {
	## Replace only specified environment variables in specified file.
	envsubst '${API_URL}' < ${NGINX_DEFAULT_CONF_PATH}/$1 > output.conf
	mv output.conf ${NGINX_DEFAULT_CONF_PATH}/$1
}

if [ -z "$API_URL" ]; then
    export API_URL=https://stripe-wine-demo-api.bitski.com
    echo "Using default API URL ${API_URL}"
else
    echo "Using user defined API URL: ${API_URL}"
fi

inject_env_vars "nginx.conf"
