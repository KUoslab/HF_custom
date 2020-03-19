#!/bin/bash

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

# Grab the current directory
DIR=`pwd`

if [ -z "${HL_COMPOSER_CLI}" ]; then
  HL_COMPOSER_CLI=$(which composer)
fi

echo
# check that the composer command exists at a version >v0.14
COMPOSER_VERSION=$("${HL_COMPOSER_CLI}" --version 2>/dev/null)
COMPOSER_RC=$?

if [ $COMPOSER_RC -eq 0 ]; then
    AWKRET=$(echo $COMPOSER_VERSION | awk -F. '{if ($2<15 || $2>20) print "1"; else print "0";}')
    if [ $AWKRET -eq 1 ]; then
        echo $COMPOSER_VERSION is not supported for this level of fabric. Please use version 0.19
        exit 1
    else
        echo Using composer-cli at $COMPOSER_VERSION
    fi
else
    echo 'Need to have composer-cli installed at version 0.19'
    exit 1
fi

PRIVATE_KEY="${DIR}"/composer/crypto-config/peerOrganizations/org.thefact.io/users/Admin@org.thefact.io/msp/keystore/c335a794cfa1ba4aa2e887950e219adbc69765b82220ff453622f536c9a6a134_sk
CERT="${DIR}"/composer/crypto-config/peerOrganizations/org.thefact.io/users/Admin@org.thefact.io/msp/signcerts/Admin@org.thefact.io-cert.pem

if "${HL_COMPOSER_CLI}" card list -n PeerAdmin@thefact > /dev/null; then
    "${HL_COMPOSER_CLI}" card delete -n PeerAdmin@thefact
fi
"${HL_COMPOSER_CLI}" card create -p ./card/connection.json -u PeerAdmin -c "${CERT}" -k "${PRIVATE_KEY}" -r PeerAdmin -r ChannelAdmin --file ./card/PeerAdmin@thefact.card
"${HL_COMPOSER_CLI}" card import --file ./card/PeerAdmin@thefact.card 

echo "Hyperledger Composer PeerAdmin card has been imported"
"${HL_COMPOSER_CLI}" card list

composer network install -c PeerAdmin@thefact -a thefact-io/thefact-io@0.0.2.bna

composer network start --networkName thefact-io --networkVersion 0.0.2 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@thefact 

composer card import --file admin@thefact-io.card 

composer-rest-server -c admin@thefact-io -n always -u true -w true