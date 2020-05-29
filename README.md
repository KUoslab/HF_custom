# Hyperledger Fabric을 활용한 코로나 환자 정보 관리 시스템 

## Contents

+ [Overview](#overview)
+ [Prerequisite](#prerequisite)
+ [Installation munual](#installation)
+ [Usage](#usage)
+ [Additional guide](#additional)

<a name="overview"></a>

## Overview
코로나19 바이러스가 전세계적으로 확산됨에 따라, 이에 대한 예방을 위go 코로나 확진자의 이동 동선 및 진료 정보를 관리하고 공유하는 것이 중요해졌다. 정부를 통한 확진자 이동경로 정보 공유는 확진 예방을 위해 활발한 반면, 치료제 개발 및 진료 방법에 관한 공유는 프라이버시 문제로 어려운 실정이다. 또한, 허위로 위조된 코로나 환자 정보를 유포시키는 웹사이트나 앱들이 출현하여 데이터의 신뢰성 문제가 발생하고 있다. 이러한 프라이버시 문제와 데이터의 신뢰성 문제를 해결하고 치료법 개발을 위한 확진자 정보 공유를 위해, 허가형 블록체인 분산원장 기술인 Hyperledger Fabric을 활용하여 코로나 확진자 정보 공유 시스템의 프로토 타입을 개발하였다. Hyperledger Fabric을 통해 허가받은 특정 병원 및 기관만이 확진자의 정보를 입력하고, 이를 네트워크에 참여하고 있는 다른 병원들과 공유할 수 있다.


## How it works

<img src="https://github.com/KUoslab/HF_custom/blob/master/img/howitworks.png" width="50%" height="50%">

1. 사용자가 웹페이지에 이름과 위치 정보 입력
2. 웹페이지 서버인 Node JS는 HLC(Hyperledger Composer) 의 REST 서버에 사용자가 입력한 정보를 전달
3. REST 서버는 HLC-API를 이용하여 HLF(Hyperledger Fabric) 네트워크에 transaction proposal를 제출
4. HLC는 transaction proposal을 피어 노드의 Ledger에 commit 한 후, commit 완료를 REST 서버에 알림 
5. REST 서버는 웹페이지 서버에 ledger에 commit 된 transaction 정보를 전송


<a name="prerequisite"></a>

## Prerequisite
+ Ubuntu 16.04 or 18.04
+ Docker (version 17.06 or higher)
	+ Fabric의 컴포넌트들은 기본적으로 Docker의 컨테이너를 사용하여 배포
	+ https://docs.docker.com/install/linux/docker-ce/ubuntu/ 를 참조


+ NVM (version 0.25)
	+ NVM은 Fabric과 웹페이지 서버에 사용되는 Node js의 버전관리 툴	

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

	+ node --version 를 입력하여 node version 8.7임을 확인
	+ npm --version 를 입력하여 npm version 5.6 임을 확인


+ MongoDB (version 4.2)
	+ 웹페이지에 환자 정보 표시를 위한 데이터 베이스 
	+ https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/ 를 참조


+ GoLang (version 1.13)
	+ Fabric과 Composer를 설치하기 위한 Google의 프로그래밍 언어 
	+ https://golang.org/doc/install 를 참조 
	+ Golang 설치 시, source, binary 파일들이 저장될 위치(GOPATH)를 $HOME/go, $HOME/go/bin으로 설정


+ Hyperledger Fabric (version 1.1)
	+ Fabric network를 동작시키기 위한 component 및 바이너리 파일 설치  
		``` shell
		mkdir -p $GOPATH/src/github.com
		cd $GOPATH/src/github.com 
		git clone https://github.com/hyperledger/fabric-samples.git
		cd fabric-samples
		curl -sSL https://bit.ly/2ysbOFE | bash -s  1.1.0
		```
	
+ Hyperledger Composer (version 0.19)
	+ Fabric과 연동하여 chaincode를 실행할 수 있는 REST server 제공 
		``` shell
		npm install -g composer-cli@0.19
		npm install -g composer-rest-server@0.19
		npm install -g generator-hyperledger-composer@0.19
		npm install -g composer-playground@0.19
		```
	
<a name="installation"></a>

## Installation manual (Single node version)
* Installation manual에서 제공하는 Fabric network은 2 Peer, 2 Orderer, 1 CA, 2 CouchDB로 구성되어 있고, 단일 서버에서만 동작함 
+ 코로나 환자 정보 관리 시스템 git repository 다운로드
	``` shell
	git clone https://github.com/KUoslab/HF_custom
	cd HF_custom
	```
 
+ Hyperledger Fabric network 실행
	+ Hyperledger-fabric 디렉토리에 5가지 스크립트 제공
		+ 단일 서버 버전에서만 동작하며, 분산 환경 구축에 사용할 시 정상적으로 동작하지 않음 (4. Additional guide 참조)
		+ 0_downloadFabric.sh: Fabric component 도커 이미지 다운로드 
		+ 1_generateGenesisblock.sh: Fabric network의 Genesis 블록 및 인증서 생성 
		+ 2_startFabric.sh: Fabric network 시동  및 peer nodes 채널 설정
		+ 3_createPeerAdminCard.sh: Fabric과 연동을 위한 Admin Card(인증서) 생성
		+ X_teardownFabric.sh: Fabric network 종료 및 삭제 

	+ 기존에 설정된 Fabric 네트워크를 사용할 경우 아래와 같이 실행 
		``` shell
		cd hyperledger/hyperledger-fabric
		./2_startFabric.sh
		```
		+ 실행 결과 확인(하나의 채널을 구성하여, Fabric components가 채널에 참여하는 것을 확인)
		<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results1.png" width="50%" height="50%">

+ Hyperledger Composer REST server 실행
	+ Composer의 Admin Card 발행하고 체인코드를 Fabric 채널에 입력
	+ Composer REST server 실행 
		``` shell
		cd ../hyperledger-composer
		./run-oslab.sh
		```

	+ 실행 결과 확인 (Admin Card 발급 및 체인코드 설치 확인)

	<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results2.png" width="50%" height="50%">

	+ Composer의 REST server 실행 확인 (http://localhost:5000) 

	<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results3.png" width="50%" height="50%">

+ 웹페이지 서버의 MongoDB server 실행 
	+ 웹페이지 서버에 출력될 환자 정보를 기록 및 조회할 수 있는 데이터 베이스 실행 
		``` shell
		cd ../../app/bin
		./db.sh
		```
	+ 실행 결과 확인 	

	<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results4.png" width="50%" height="50%">

+ Node js 웹페이지 서버 실행
	+ Node js의 express를 사용한 웹페이지 서버 실행 
	``` shell
	cd ../../app/bin
	./www 
	```
	+ 실행 결과 확인(http://localhost:3000)

	<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results5.png" width="50%" height="50%">

<a name="usage"></a>

## Usage
+ 동작하고 있는 환자 정보 입력 및 조회 페이지에 접속하여 환자 정보를 입력하고, Fabric에 정상적으로 commit 되는지를 확인
+ 웹페이지(http://localhost:3000) 에 접속하여 아래의 입력 창에 데이터를 입력하고 save 버튼을 클릭 

<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results6.png" width="50%" height="50%">

+ Node js 서버에 데이터가 정상적으로 입력되었는지 확인 
	+ tid: Fabric ledger에 등록된 transaction ID 값 
	+ pid: Patient ID으로, 입력 받은 환자 정보의 해시값
	+ cid: COVID-19 ID으로, 이동 경로와 비고의 해시값

	<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results7.png" width="50%" height="50%">

+ 웹페이지에 입력한 환자 정보가 출력되는지 확인 

<img src="https://github.com/KUoslab/HF_custom/blob/master/img/results8.png" width="50%" height="50%">

+ REST server(http://localhost:5000)로 접속하여 ledger에 commit 되었는지 확인

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
