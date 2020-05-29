# Hyperledger Fabric을 활용한 코로나 환자 정보 관리 시스템 

## Contents

+ [Overview](#overview)
+ [Prerequisite](#prerequisite)
+ [Installation munual](#installation)
+ [Additional guide](#additional)
+ [Usage](#usage)

<a name="overview"></a>
코로나19 바이러스가 전세계적으로 확산됨에 따라, 이에 대한 예방을 위go 코로나 확진자의 이동 동선 및 진료 정보를 관리하고 공유하는 것이 중요해졌다. 정부를 통한 확진자 이동경로 정보 공유는 확진 예방을 위해 활발한 반면, 치료제 개발 및 진료 방법에 관한 공유는 프라이버시 문제로 어려운 실정이다. 또한, 허위로 위조된 코로나 환자 정보를 유포시키는 웹사이트나 앱들이 출현하여 데이터의 신뢰성 문제가 발생하고 있다. 이러한 프라이버시 문제와 데이터의 신뢰성 문제를 해결하고 치료법 개발을 위한 확진자 정보 공유를 위해, 허가형 블록체인 분산원장 기술인 Hyperledger Fabric을 활용하여 코로나 확진자 정보 공유 시스템의 프로토 타입을 개발하였다. Hyperledger Fabric을 통해 허가받은 특정 병원 및 기관만이 확진자의 정보를 입력하고, 이를 네트워크에 참여하고 있는 다른 병원들과 공유할 수 있다.


사용자가 웹페이지에 이름과 위치 정보 입력
웹페이지 서버인 Node JS는 HLC(Hyperledger Composer) 의 REST 서버에 사용자가 입력한 정보를 전달
REST 서버는 HLC-API를 이용하여 HLF(Hyperledger Fabric) 네트워크에 transaction proposal를 제출
HLC는 transaction proposal을 피어 노드의 Ledger에 commit 한 후, commit 완료를 REST 서버에 알림 
REST 서버는 웹페이지 서버에 ledger에 commit 된 transaction 정보를 전송

# Start Fabric network
1. cd hyperledger/hyperledger-fabric
2. ./2_startFabric.sh

# Start Composer
1. cd hyperledger/hyperledger-composer
2. ./run.sh

# Start Webserver 
1. cd app/bin
2. ./db.sh
3. ./www
