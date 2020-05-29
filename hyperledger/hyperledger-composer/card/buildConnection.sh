#!/bin/sh
# 
#   *********************************************************************************************************
#    Copyright 2020 Korea University 
# 
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
# 
#    http://www.apache.org/licenses/LICENSE-2.0
# 
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
#    *********************************************************************************************************
#    Developed by Kwanhoon Lee, Gyuwon Song, Stella team, Operating Systems Lab of Korea University
#    *********************************************************************************************************
# 
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 IP_ADDRESS" >&2
  exit 1
fi

cat << EOF > connection.json
{
    "name": "oslab",
    "x-type": "hlfv1",
    "version": "1.0.0",
    "client": {
        "organization": "Org",
        "connection": {
            "timeout": {
                "peer": {
                    "endorser": "300",
                    "eventHub": "300",
                    "eventReg": "300"
                },
                "orderer": "300"
            }
        }
    },
    "peers": {
        "peer0.org.thefact.io": {
            "url": "grpc://localhost:7051",
            "eventUrl": "grpc://localhost:7053"
        },"peer1.org.thefact.io": {
            "url": "grpc://localhost:8051",
            "eventUrl": "grpc://localhost:8053"
        }
    },
    "certificateAuthorities": {
        "ca.org.thefact.io": {
            "url": "http://localhost:7054",
            "caName": "ca.org.thefact.io"
        }
    },
    "orderers": {
        "orderer.thefact.io": {
            "url": "grpc://localhost:7050"
        }
    },
    "organizations": {
        "Org": {
            "mspid": "OrgMSP",
            "peers": [
                "peer0.org.thefact.io",
                "peer1.org.thefact.io"
                ],
            "certificateAuthorities": [
                "ca.org.thefact.io"
            ]
        }
    },
    "channels": {
        "composerchannel": {
            "orderers": [
                "orderer.thefact.io"
            ],
            "peers": {
                "peer0.org.thefact.io": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                },"peer1.org.thefact.io": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                }
            }
        }
    }
}
EOF

sed -i .bk "s/localhost/$1/" connection.json
rm connection.json.*