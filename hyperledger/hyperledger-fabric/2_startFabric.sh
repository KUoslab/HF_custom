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

# Exit on first error, print all commands.
set -ev

#Detect architecture
ARCH=`uname -m`

# Grab the current directory
# DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIR=`pwd`

#

ARCH=$ARCH docker-compose -f "${DIR}"/fabric/docker-compose.yml down
ARCH=$ARCH docker-compose -f "${DIR}"/fabric/docker-compose.yml up -d

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
# echo ${FABRIC_START_TIMEOUT}
# sleep ${FABRIC_START_TIMEOUT}


# Create the channel for peer0
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org.thefact.io/msp" peer0.org.thefact.io peer channel create -o orderer.thefact.io:7050 -c fabricchannel -f /etc/hyperledger/configtx/fabric-channel.tx
sleep 10
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org.thefact.io/msp" peer0.org.thefact.io peer channel join -b fabricchannel.block
sleep 3
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org.thefact.io/msp" peer0.org.thefact.io peer channel list

# Join peer1.org.thefact.io to the channel.
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org.thefact.io/msp" peer1.org.thefact.io peer channel fetch config -o orderer.thefact.io:7050 -c fabricchannel
sleep 10
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org.thefact.io/msp" peer1.org.thefact.io peer channel join -b fabricchannel_config.block
sleep 3
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org.thefact.io/msp" peer1.org.thefact.io peer channel list

# fabric-rest-server
#docker run -d --name fabric --network fabric_default -p 3000:3000 hyperledger/fabric:0.19