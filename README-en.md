# COVID-19 patient information management system using Hyperledger Fabric

## Contents

+ [Overview](#overview)
+ [Prerequisite](#prerequisite)
+ [Installation munual](#installation)
+ [Usage](#usage)
+ [Additional guide](#additional)

<a name="overview"></a>

## Overview
As the COVID-19 virus spreads around the world, it has become important to manage and share the movement and medical information of confirmed COVID-19 patients to prevent it. While the sharing of travel route information of confirmed patients through the government is active to prevent confirmed cases, it is difficult to develop treatments and share treatment methods due to privacy issues. In addition, websites or apps that disseminate fake corona patient information have emerged, causing data reliability problems. In order to solve these privacy and data reliability problems and to share confirmed patient information for treatment development, a prototype of a corona confirmed patient information sharing system was developed using Hyperledger Fabric, a permissioned blockchain distributed ledger technology. Only specific hospitals and institutions authorized through Hyperledger Fabric can enter confirmed patient information and share it with other hospitals participating in the network.

## How it works

<img src="https://github.com/KUoslab/HF_custom/blob/master/img/howitworks.png" width="50%" height="50%">

1. User enters name and location information on web page
2. Node JS, a web page server, delivers information entered by the user to the REST server of HLC (Hyperledger Composer)
3. REST server submits transaction proposal to HLF (Hyperledger Fabric) network using HLC-API
4. After HLC commits the transaction proposal to the ledger of the peer node, the completion of the commit is notified to the REST server. 
5. The REST server transmits the transaction information committed to the ledger to the web page server.


<a name="prerequisite"></a>

## Prerequisite
+ Ubuntu 16.04 or 18.04
+ Docker (version 17.06 or higher)
	+ Components of Fabric are basically deployed using Docker containers.
	+ See https://docs.docker.com/install/linux/docker-ce/ubuntu/


+ NVM (version 0.25)
	+ NVM is a version management tool for Node js used in Fabric and web page servers.

		``` shell
		cd $HOME
		sudo apt-get install build-essential libssl-dev
		curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash 
		source ~/.profile
		```
+ NodeJS & NPM

	``` shell
	nvm install v8
	```

	+ Type node --version to confirm node version 8.7
	+ Type npm --version to confirm npm version 5.6


+ MongoDB (version 4.2)
	+ Database for displaying patient information on web pages
	+ See https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/


+ GoLang (version 1.13)
	+ Google's programming language for installing Fabric and Composer
	+ See https://golang.org/doc/install 
	+ When installing Golang, set the location (GOPATH) where source and binary files will be saved to $HOME/go, $HOME/go/bin


+ Hyperledger Fabric (version 1.1)
	+ Install components and binary files to operate Fabric network
		``` shell
		mkdir -p $GOPATH/src/github.com
		cd $GOPATH/src/github.com 
		git clone https://github.com/hyperledger/fabric-samples.git
		cd fabric-samples
		curl -sSL https://bit.ly/2ysbOFE | bash -s  1.1.0
		```
	
+ Hyperledger Composer (version 0.19)
	+ Provides a REST server that can run chaincode in conjunction with Fabric
		``` shell
		npm install -g composer-cli@0.19
		npm install -g composer-rest-server@0.19
		npm install -g generator-hyperledger-composer@0.19
		npm install -g composer-playground@0.19
		```
	
<a name="installation"></a>

## Installation manual (Single node version)
* The fabric network provided in the installation manual consists of 2 peers, 2 orderers, 1 CA, and 2 CouchDB, and operates only on a single server.
+ Corona patient information management system git repository download
	``` shell
	git clone https://github.com/KUoslab/HF_custom
	cd HF_custom
	```
 
+ Run Hyperledger Fabric network
	+ Provide 5 scripts in hyperledger-fabric directory
		+ It works only in a single server version, and when used in a distributed system, modify the script by referring to the 4. Additional guide.
		+ 0_downloadFabric.sh: Download Fabric component docker image
		+ 1_generateGenesisblock.sh: Generate Genesis block and certificate of Fabric network 
		+ 2_startFabric.sh: Start Fabric network and configure peer nodes channel
		+ 3_createPeerAdminCard.sh: Create Admin Card (certificate) for integration with Fabric
		+ X_teardownFabric.sh: Shut down and delete Fabric network 

	+ Execute as below when using an existing Fabric network
		``` shell
		cd hyperledger/hyperledger-fabric
		./2_startFabric.sh
		```
		+ Check execution results (construct one channel and check that Fabric components participate in the channel)
		<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results1.png" width="50%" height="50%">

+ Run Hyperledger Composer REST server
	+ Issue Composer's Admin Card and enter the chaincode into the Fabric channel
	+ Run Composer REST server
		``` shell
		cd ../hyperledger-composer
		./run-oslab.sh
		```

	+ Check the result (Issuance of Admin Card and chaincode installation)

	<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results2.png" width="50%" height="50%">

	+ Check Composer's REST server is running (http://localhost:5000)

	<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results3.png" width="50%" height="50%">

+ Run MongoDB server of web page server
	+ Execute a database that can record and search patient information to be output on the web page server
		``` shell
		cd ../../app/bin
		./db.sh
		```
	+ Check the result

	<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results4.png" width="50%" height="50%">

+ Run Node js web page server
	+ Run a web page server using node js express
	``` shell
	cd ../../app/bin
	./www 
	```
	+ Check the result (http://localhost:3000)

	<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results5.png" width="50%" height="50%">

<a name="usage"></a>

## Usage
+ Access the operating patient information input and inquiry page, enter patient information, and check if it is successfully committed to the fabric.
+ Connect to the web page (http://localhost:3000), enter data in the input window below, and click the save button. 

<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results6.png" width="50%" height="50%">

+ Check if data is properly entered in Node js server
	+ tid: Transaction ID value registered in Fabric ledger
	+ pid: Patient ID, hash value of input patient information
	+ cid: COVID-19 ID, hash value of route and note

	<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results7.png" width="50%" height="50%">

+ Check if the patient information entered on the web page is printed

<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results8.png" width="50%" height="50%">

+ Connect to the REST server (http://localhost:5000) and check if the ledger has been committed.

<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results9.png" width="50%" height="50%">

<a name="additional"></a>

## Additional guide (Distributed version)

+ Build a new Hyperledger Fabric network 
	+ To build a fabric network in a distributed system 
		1. Change and initialize fabric network settings,
		2. Issue new encryption keys for added nodes,
		3. Create a new Genesis block,
		4. Change the settings of individual nodes in the fabric (IP address and encryption key address, etc.),
		5. Create Fabric network channel and all nodes' participation in the channel must be set.

+ Modify crypto-config.yaml file
	+ The crypto-config.yaml file is a file that defines orderer and peer organizations participating in the Fabric network. It generates a new encryption key based on the contents declared in crpyto-config.yaml
	+ To build a distributed system, the number of Organization, Peer, and Orderer nodes must be defined in the file.
		+ OrdererOrgs: Defines the organization that manages the Ordering Service Node (sets the name and domain of the orderer node)
		+ PeerOrgs: Defines the organization that manages peer nodes (sets the name and domain of peer nodes)
		+ *Template: Defines the number of peer nodes (* To set up multiple peer nodes and build a distributed system, this option must be adjusted)
		+ Users: Defines the number of users who can request transaction proposals to fabric nodes.

+ Modify configtx.yaml file
	+ The configtx.yaml file is a file that defines profiles for organizations, ordering services (Solo, Kafka and Raft), and channels, and creates a new Genesis block based on the contents declared in configtx.yaml.
	+ To modify this file, the location information of the encryption key generated based on the crpyto-config.yaml file is required.
		+ Organizations: sets properties related to organization
		+ Org: defines meta information about the organization
		+ Name, ID: Set the organization name and ID
		+ **MSPDir: Set the location of the encryption key file of the Membership Service Provider (MSP)
			+ When a new encryption key is created, the location of the encryption key file must be modified.
			+ ex) crypto-config/[Organization name]/[Domain]/msp
		+ Policies: Set the read/write policies of the orderer organization.
		+ AnchorPeers: Set the location of peers that perform endorsement (** When increasing the number of peers or organizations, the location must be set)
		+ Host: AnchorPeer node's domain or IP address
		+ Port: AnchorPeer node's Port number
		+ Orderer: sets properties related to ordering service node
		+ Define OrdererType, Addresses, BatchTime, BatchSize

	+ Generate encryption key and Genesis block
		+ Generate a encryption key for a new Fabric organization based on the crypto-config.yaml file
			``` shell
			cd hyperledger-fabric/fabric/
			cryptogen generate --config=./config.yaml	
			```
		+ Create a new Genesis block based on the configtx.yaml file
			``` shell
			configtxgen -profile [profile name] -channelID [channel name] -outputBlock ./[block name.block] -outputCreateChannelTx ./[channel filename.tx] 
			```

+ Modify Fabric component docker file
	+ When adding peer and orderer nodes, the docker-compose.yaml file must be modified to define the property information of individual nodes. * When building a distributed system, .yaml files for peer and orderer nodes are must exist in each of servers.
		+ ex) org1_peer0.yaml, org1_peer1.yaml, org2_peer0.yaml …

	+ CA.yaml 
		+ A node that checks the channel participation of fabric nodes, admin authority, etc.
		+ things that must be modified :
			+ Modify node name
				* The container name must not be duplicated, and it must be changed to the domain name set in the Fabric network.
					- container_name: ca.[domain name]


			+ Modify encryption key path
				* If the name and domain of the organization are modified, modify the corresponding path.
				volumes:
				- ./crypto-config/[Organization name]/[domain name]/ca/:/etc/hyperledger/fabric-ca-server-config

			+ Set the CA Node's Encryption Key
				* Change the name of the newly created encryption key file (the name of the encryption key file is changed when the fabric network is changed, so the corresponding path must be modified)
				environment: 
				- FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/[KEYFILE_NAME]

			+ Change command to be executed by CA node
				* The KEYFILE name must be changed in the command, and the ID and password of the ADMIN account must be changed.
				- command: sh -c ‘fabric-ca-server start --ca.certfile /etc/hyperledger/fabric-ca-server-config/ca.[domain name] --ca.keyfile /etc/hyperledger/fabric-ca-server-config/[KEYFILE NAME] -b [admin ID]:[admin PW] -d’


	+ Peer[number].yaml
		+ A node that manages request for the transaction proposal guarantee and ledger 
		+ things that must be modified :
			+ Modify node name
				* The container name must not be duplicated, and it must be changed to the domain name set in the Fabric network.
				- container_name: peer[number].[domain name]
			+ Modify node's IP address
				* When building a distributed system, the IP address of each peer node must be modified (default is 0.0.0.0:7051)
				- CORE_PEER_ADDRESS=[IP Address]:[Port number]

			+ Modify encryption key path
				* If the name and domain of the organization are modified, the corresponding path must be modified.
				volumes:
				- ./crypto-config/[Organization name]/[domain name]/[peer container name]/msp:/etc/hyperledger/peer/msp 
				- ./crypto-config/[Organization name]/[domain name]/[peer container name]/users:/etc/hyperledger/msp/users

	+ Orderer[number].yaml
		+ A node that determines the order of transactions entering the fabric network and creates a new block
		+ things that must be modified :
			+ Modify node name
				* The container name must not be duplicated, and it must be changed to the domain name set in the Fabric network.
				- container_name: orderer[number].[domain name]

			+ Change the file name of the genesis block
				* Change the file name of the newly created genesis block
				enviroment:
				- ORDERER_GENERAL_GENESISFILE=/etc/hyperledger/configtx/[genesis block filename]


			+ Modify encryption key path
				* If the name and domain of the organization are modified, the corresponding path must be modified.
				volumes:
				- ./crypto-config/[Organization name]/[domain name]/orderers/orderer.[domain name]/msp:/etc/hyperledger/msp/orderer/msp


			+ Modify node's IP address
				* When building a distributed system, the IP address of each orderer node must be modified (default is 0.0.0.0:7050)
				- ORDERER_GENERAL_LISTENADDRESS=[IP Address]
				- ORDERER_GENERAL_LISTENPORT=[Port number]

+ Fabric network channel creation and node participation in the channel
	+ In order for the fabric network to operate, at least one channel must be exist, and all nodes must participate in the channel.
	* When building a distributed system, the command line must be entered individually so that all nodes can participate in the channel.

	+ Create channel.tx file
		+ Create channel.tx file using configtxgen

		``` shell
		export CHANNEL_NAME=[channel name] 
		configtxgen -profile [channel profile] -outputAnchorPeersUpdate -outputCreate ChannelTx ./channel-artifacts/channel.tx -channelID [channel name]
		```

	+ Define channel properties and update AnchorPeer based on configtx.yaml file
		* For all newly added organizations and AnchorPeers, the command line below must be modified and entered (ex. Org1MSPanchors.tx, Org2MSPachors.tx)

		``` shell
		configtxgen -profile [channel Profile] -channelID [channel name] -outputAchorPeersUPdate ./channel-artifacts/Org1MSPanchors.tx -asOrg1MSP
		```

+ Run Fabric component 
	+ Enter the following command line individually for all configured nodes
	* When building a distributed system, enter the command line below to run Fabric components to be used on individual servers.

	``` shell
	docker-compose -f [fabric-component filename(ex. peer0.yaml)] up -d 
	```

+ Fabric network channel creation 
	+ Create a new channel by entering the following command line in the container of the channel's AnchorPeer node
	* channel name should be the same channel name as when creating the genesis block earlier
	``` shell
	docker exec -e peer[number].[domain name] peer channel create -o orderer.[IP Address]:7050 -c [channel name] -f /etc/hyperledger/[channel file name]
	```

+ channel Joining of peer node
	* Chaincode installation is possible only when all nodes in the Fabric network have participated in the channel.
	``` shell
	docker exec -e peer[number].[domain name] peer channel join -b [fabric genesisblock filename] -c [channel name]
	```

+ Build a new Hyperledger Composer REST server
	+ Modify the address reference configuration file of nodes to link up Fabric network with composer
	* When building a distributed system, the IP addresses of nodes running on individual servers must be changed.

	``` shell
	vi ../hyperledger-composer/card/connection.json
	“peers”: {
			“peer[number].[domain name]” :{
				“url”: “grpc://[IP Address]:[Port number],
				“eventUrl”: “grpc://[IP Address]:[Port number],
			}
		},
	“orderers”:{ 
	…},
	```

+ Certificate input and chaincode installation for using Fabric network using Composer
	``` shell
		export PRIVATE_KEY=”../hyperledger-fabric/fabric/crypto-config/[domain name]/users/Admin@[domain 
		name]/msp/keystore/[private keyname]”
		export CERT=”../hyperledger-fabric/fabric/crypto-config/[domain name]/users/msp/signcerts/Admin@[domain name].pem”
		composer network install composer card create -p ./card/connection.json -u PeerAdmin -c ${CERT} -k ${PRIVATE_KEY} -r PeerAdmin -r ChannelAdmin --file ./card/PeerAdmin@[domain name].card
		composer card import --file ./card/PeerAdmin@[domain name].card
		composer network install -c PeerAdmin@[domain name] -a oslab@0.0.1bna (*bna file is chaincode file)
		composer network start --networkName oslab --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret [admin password written in CA.yaml file] --card PeerAdmin@[domain name]
		composer card import --file admin@[domain name].card
	```

+ Run Composer REST server
	``` shell
	composer-rest-server -c admin@[domain name] -n always -u true -w true -p [port number]
	```
