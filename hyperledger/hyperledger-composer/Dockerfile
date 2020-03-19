#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

FROM node:8-alpine

# Reset npm logging to default level.
ENV NPM_CONFIG_LOGLEVEL warn

# Install the latest version by default.

# Need to install extra dependencies for native modules.
RUN deluser --remove-home node && \
    addgroup -g 1000 composer && \
    adduser -u 1000 -G composer -s /bin/sh -D composer && \
    apk add --no-cache make gcc g++ python git libc6-compat bash && \
    su -c "npm config set prefix '/home/composer/.npm-global'" - composer && \
    su -c "npm install --production -g composer-cli@0.19 composer-rest-server@0.19 generator-hyperledger-composer@0.19 composer-playground@0.19 yo" - composer && \
    su -c "npm cache clean --force" - composer && \
    rm -rf /home/composer/.config /home/composer/.node-gyp /home/composer/.npm && \
    apk del make gcc g++ python git


# Run in the composer users home directory.
WORKDIR /home/composer

#COPY --chown=composer:composer . .

COPY . .

RUN chown composer:composer /home/composer -R && chmod 755 /home/composer -R 

# Run as the composer user ID.
USER composer

# Add global composer modules to the path.
ENV PATH /home/composer/.npm-global/bin:$PATH

#CMD ["/bin/sh", "/home/composer/run.sh"]
