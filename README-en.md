# Corona patient information management system using Hyperledger Fabric

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
		+ It works only in a single server version, and when used in a distributed environment, modify the script by referring to the 4. Additional guide.
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
	+ Fabric network를 분산 환경에 구축하는 하기 위해서 
		1. Fabric network의 설정을 변경 및 초기화,
		2. 추가된 노드들의 새로운 암호화 키 발급,
		3. 새로운 Genesis block 생성, 
		4. Fabric의 개별 node의 설정(IP 주소 및 암호화 키 주소 등) 변경,
		5. Fabric network 채널 생성 및 모든 노드의 채널 참여를 설정해야 함 


+ crypto-config.yaml 파일 수정 
	+ crypto-config.yaml 파일은 Fabric network에 참여하는 Orderer, Peer 조직을 정의하는 파일로, crpyto-config.yaml 에 선언된 내용을 바탕으로 새로운 암호화 키를 생성함 
	+ 분산 환경을 구축하기 위해서, 해당 파일에서 Organization, Peer, Orderer 노드의 수를 정의해야 함 
		+ OrdererOrgs: Ordering Service Node를 관리하는 조직을 정의(Orderer 노드의 이름, 도메인을 설정함)
		+ PeerOrgs: Peer 노드를 관리하는 조직을 정의(Peer 노드의 이름, 도메인을 설정함)
		+ *Template: Peer 노드의 수를 정의(* 다수의 Peer 노드를 설정하고 분산 환경을 구축하기 위해서는 해당 옵션을 조절해야 함)
		+ Users: Fabric 노드에 transaction proposal 요청이 가능한 유저의 수를 정의 

+ configtx.yaml 파일 수정 
	+ configtx.yaml 파일은 조직, Ordering service(Solo, Kafka and Raft), Channel에 관한 Profile을 정의하는 파일로, configtx.yaml 에 선언된 내용을 바탕으로 새로운 Genesis block을 생성함 
	+ 해당 파일을 수정하기 위해서는 crpyto-config.yaml 파일을 바탕으로 생성된 암호화 키의 위치 정보가 필요함 
		+ Organizations: 조직 관련 속성을 설정함 
		+ Org: 조직에 관한 메타 정보를 정의
		+ Name, ID: 조직의 이름과 ID를 설정
		+ **MSPDir: MSP(Membership Service Provider)의 암호화 키 파일의 위치를 설정 
			+ 새로운 암호화 키를 생성했을 경우, 암호화 키 파일의 주소를 수정해야 함 
			+ ex) crypto-config/[Organization name]/[Domain]/msp
		+ Policies: Orderer 조직의 읽기/쓰기에 관한 정책을 설정 
		+ AnchorPeers: Endorsement 를 수행하는 Peer의 주소를 설정(** Peer의 수를 증가시키거나, 조직의 수를 증가시킬 경우 해당 경로를 설정해야 함) 
		+ Host: AnchorPeer 노드의 도메인 혹은 IP address 
		+ Port: AnchorPeer 노드의 Port number
		+ Orderer: Ordering service node 관련 속성을 설정함 
		+ OrdererType, Addresses, BatchTime, BatchSize 를 정의 

	+ 암호화 키 및 Genesis block 생성 
		+ crypto-config.yaml 파일을 바탕으로 새로운 Fabric 조직의 암호화 키를 생성 
			``` shell
			cd hyperledger-fabric/fabric/
			cryptogen generate --config=./config.yaml	
			```
		+ configtx.yaml 파일을 바탕으로 새로운 Genesis block 생성 
			``` shell
			configtxgen -profile [profile name] -channelID [channel name] -outputBlock ./[block name.block] -outputCreateChannelTx ./[channel filename.tx] 
			```

+ Fabric component docker 파일 수정 
	+ Peer, Orderer 노드를 추가할 경우, docker-compose.yaml 파일을 수정하여 개별 노드의 속성 정보를 정의해야 하며, * 분산 환경을 구축할 경우, 각 서버 안에 Peer, Orderer 노드에 관한 .yaml 파일이 개별적으로 존재해야 함
		+ ex) org1_peer0.yaml, org1_peer1.yaml, org2_peer0.yaml …

	+ CA.yaml 
		+ Fabric node들의 채널 참여, Admin 권한 등에 관한 확인을 수행하는 노드 
		+ 수정해야 할 부분 
			+ node의 이름 수정 
				* container name이 중복되어서는 안되며, Fabric network에 설정한 domain name으로 변경  
					- container_name: ca.[domain name]


			+ 암호화 키 path 수정 
				* 조직의 이름 및 도메인을 수정하였을 경우, 해당 path를 수정
				volumes:
				- ./crypto-config/[Organization name]/[domain name]/ca/:/etc/hyperledger/fabric-ca-server-config

			+ CA 노드의 암호화 키 설정 
				* 새롭게 생성된 암호화 키 파일 이름을 변경(Fabric network 변경시 암호화 키 파일의 이름이 변경되므로 해당 path를 수정해야 함) 
				environment: 
				- FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/[KEYFILE_NAME]

			+ CA 노드가 수행할 command 변경 
				* 명령어에 KEYFILE 이름을 변경해야 하며, ADMIN 계정의 아이디와 비밀번호를 변경해야 함 
				- command: sh -c ‘fabric-ca-server start --ca.certfile /etc/hyperledger/fabric-ca-server-config/ca.[domain name] --ca.keyfile /etc/hyperledger/fabric-ca-server-config/[KEYFILE NAME] -b [admin ID]:[admin PW] -d’


	+ Peer[number].yaml
		+ Fabric network에 요청 받은 Transaction proposal의 보증 및 ledger를 관리하는 노드 
		+ 수정해야 할 부분 
			+ node의 이름 수정
				* container name이 중복되어서는 안되며, Fabric network에 설정한 domain name과 설정한 조직에 따라 이름을 수정해야 함 
				- container_name: peer[number].[domain name]
			+ node의 IP address 수정 
				* 분산환경을 구축할 시, 개별 Peer 노드의 IP Address를 수정해야 함 (기본적으로 0.0.0.0:7051 사용)
				- CORE_PEER_ADDRESS=[IP Address]:[Port number]

			+ 암호화 키 path 수정 
				* 조직의 이름 및 도메인을 수정하였을 경우, 해당 path를 수정
				volumes:
				- ./crypto-config/[Organization name]/[domain name]/[peer container name]/msp:/etc/hyperledger/peer/msp 
				- ./crypto-config/[Organization name]/[domain name]/[peer container name]/users:/etc/hyperledger/msp/users

	+ Orderer[number].yaml
		+ Fabric network에 들어온 Transaction의 순서를 결정하고, 새로운 블록을 생성하는 노드 
		+ 수정해야 할 부분 
			+ node의 이름 수정
				* container name이 중복되어서는 안되며, Fabric network에 설정한 domain name과 설정한 조직에 따라 이름을 수정해야 함 
				- container_name: orderer[number].[domain name]

			+ genesis block의 파일이름 변경 
				* 새로 생성한 genesis block의 파일이름 변경
				enviroment:
				- ORDERER_GENERAL_GENESISFILE=/etc/hyperledger/configtx/[genesis block filename]


			+ 암호화 키 path 수정 
				* 조직의 이름 및 도메인을 수정하였을 경우, 해당 path를 수정
				volumes:
				- ./crypto-config/[Organization name]/[domain name]/orderers/orderer.[domain name]/msp:/etc/hyperledger/msp/orderer/msp


			+ node의 IP address 및 Port number 수정 
				* 분산환경을 구축할 시, 개별 Orderer 노드의 IP Address를 수정해야 함 (기본적으로 IP address 0.0.0.0, Port 7050 사용)
				- ORDERER_GENERAL_LISTENADDRESS=[IP Address]
				- ORDERER_GENERAL_LISTENPORT=[Port number]

+ Fabric network 채널 생성 및 노드의 채널 참여 
	+ Fabric network 가 동작하기 위해서는 하나 이상의 채널이 생성되어 있어야 하며, 모든 노드들은 반드시 채널에 참여해야 함
	* 분산 환경 구축 시, 모든 노드가 채널에 참여할 수 있도록 개별적으로 command line을 입력하여야 함

	+ channel.tx 파일 생성 
		+ configtxgen을 이용한 channel.tx 파일 생성 

		``` shell
		export CHANNEL_NAME=[channel name] 
		configtxgen -profile [channel profile] -outputAnchorPeersUpdate -outputCreate ChannelTx ./channel-artifacts/channel.tx -channelID [channel name]
		```

	+ configtx.yaml 파일을 바탕으로 채널 속성 정의 및 AnchorPeer 업데이트 
		* 새롭게 추가된 모든 조직 및 AnchorPeer에 대해서 아래의 커맨드 라인을 변경하여 입력해야 함 (ex. Org1MSPanchors.tx, Org2MSPachors.tx)

		``` shell
		configtxgen -profile [channel Profile] -channelID [channel name] -outputAchorPeersUPdate ./channel-artifacts/Org1MSPanchors.tx -asOrg1MSP
		```

+ Fabric component 실행 
	+ 설정한 모든 노드에 대하여 개별적으로 아래의 커맨드 라인을 입력
	* 분산 환경 구축 시, 개별 서버에 사용될 Fabric component를 실행하기 위하여 아래의 커맨드 라인을 입력 

	``` shell
	docker-compose -f [fabric-component filename(ex. peer0.yaml)] up -d 
	```

+ Fabric network의 channel 생성 
	+ 채널의 AnchorPeer 노드의 container에 아래와 같이 커맨드 라인을 입력하여 새로운 채널 생성
	* channel name은 이전에 genesis block을 생성할 때와 동일한 채널 이름이어야 함 
	``` shell
	docker exec -e peer[number].[domain name] peer channel create -o orderer.[IP Address]:7050 -c [channel name] -f /etc/hyperledger/[channel file name]
	```

+ Peer 노드의 channel 참여 
	* Fabric network의 모든 노드가 channel에 참여한 상태여야 체인코드 Installation이 가능함 
	``` shell
	docker exec -e peer[number].[domain name] peer channel join -b [fabric genesisblock filename] -c [channel name]
	```

+ Build a new Hyperledger Composer REST server
	+ Fabric network와 composer 연동을 위한 노드들의 주소 참조 설정파일 수정 
	* 분산 환경 구축 시, 개별 서버에 동작하고 있는 노드들의 IP Address를 변경해야 함

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

+ Composer를 이용한 Fabric network 사용을 위한 인증서 입력 및 chaincode installation
	``` shell
		export PRIVATE_KEY=”../hyperledger-fabric/fabric/crypto-config/[domain name]/users/Admin@[domain 
		name]/msp/keystore/[private keyname]”
		export CERT=”../hyperledger-fabric/fabric/crypto-config/[domain name]/users/msp/signcerts/Admin@[domain name].pem”
		composer network install composer card create -p ./card/connection.json -u PeerAdmin -c ${CERT} -k ${PRIVATE_KEY} -r PeerAdmin -r ChannelAdmin --file ./card/PeerAdmin@[domain name].card
		composer card import --file ./card/PeerAdmin@[domain name].card
		composer network install -c PeerAdmin@[domain name] -a oslab@0.0.1bna (*bna 파일은 chaincode 파일)
		composer network start --networkName oslab --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret [CA.yaml 파일에 기록한 admin password] --card PeerAdmin@[domain name]
		composer card import --file admin@[domain name].card
	```

+ Composer REST server 실행 
	``` shell
	composer-rest-server -c admin@[domain name] -n always -u true -w true -p [port number]
	```
