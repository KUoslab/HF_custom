#!/bin/sh
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 IP_ADDRESS" >&2
  exit 1
fi

cat << EOF > connection.json
{
    "name": "thefact",
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