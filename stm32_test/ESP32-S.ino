#include <WiFi.h>      // 와이파이를 사용하기 위해
#include <WebServer.h> // 웹서버를 사용하기 위해
#include <HTTPClient.h>

// SSID & Password
const char *ssid = "NNX2-2.4G";
const char *password = "$@43skshslrtm";
bool autoMode = true;
const char* robotIP = "192.168.0.15";
String receivedData1 = "";
String receivedData2 = "";
const int bufferSize = 512; 

unsigned long startTime = 0;
WebServer server(80); // Object of WebServer(HTTP port, 80 is defult)

// 자동 모드
void onAuto(){
  autoMode = true;
  server.send(200, "text/plain", "AutoMode ON");
}

// 수동 모드
void offAuto(){
  autoMode = false;
  server.send(200, "text/plain", "AutoMode OFF");
}

void InitWebServer(){
    // 요청 처리 함수 등록
    server.on("/onauto", onAuto);
    server.on("/offauto", offAuto);
    server.begin();
}

//---------------------------------------------------------------
//---------------------------------------------------------------
void getPose(const char* IP) {
  // HTTPClient 객체 생성
  HTTPClient http;
  
  // HTTP 요청 URL 생성
  char url[bufferSize];
  snprintf(url, bufferSize, "http://%s/reeman/pose", IP);
  
  // HTTP 요청 초기화
  http.begin(url);

  // HTTP GET 요청 보내기
  int httpCode = http.GET();
  
  // 서버에서 응답을 받았다면
  if (httpCode > 0) {
    // HTTP 코드 200 => 응답 출력
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println(payload.c_str());
    }
  } else {
    // 연결 실패 시 오류 메시지
    Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  
  // HTTP 연결 종료
  http.end();
}


void getLaser(const char* IP) {
  // HTTPClient 객체 생성
  HTTPClient http;
  
  // HTTP 요청 URL 생성
  char url[bufferSize];
  snprintf(url, bufferSize, "http://%s/reeman/laser", IP);
  
  // HTTP 요청 초기화
  http.begin(url);

  // HTTP GET 요청 보내기
  int httpCode = http.GET();
  
  // 서버에서 응답을 받았다면
  if (httpCode > 0) {
    // HTTP 코드 200 => 응답 출력
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println(payload.c_str());
    }
  } else {
    // 연결 실패 시 오류 메시지
    Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  // HTTP 연결 종료
  http.end();
}

//---------------------------------------------------------------
//---------------------------------------------------------------

void setup(){                       // 실행시
    Serial.begin(115200); // 시리얼 통신 초기화(실행), 전송속도 설정
    Serial.println("ESP32 WEB Start");
    Serial.println(ssid);

    // WiFi 접속
    WiFi.begin(ssid, password);
    // 접속 완료 할때까지 재시도
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("접속시도중");
        delay(1000);
    }
    // WIFI에 접속이 된다면 IP번호 출력
    Serial.print("Wifi IP: ");
    Serial.println(WiFi.localIP());

    InitWebServer();

    Serial.println("HTTP server started");
    delay(3000);



  // UART1 초기화(RX: GPIO 16, TX: GPIO 17)
  Serial1.begin(115200, SERIAL_8N1, 16, 17);

  // UART2 초기화(RX: GPIO 18, TX: GPIO 19)
  Serial2.begin(115200, SERIAL_8N1, 18, 19);
}

//---------------------------------------------------------------
// 바퀴에 속도 데이터 전송
void sendBytes(const byte* sequence, size_t size) {
  for (size_t i = 0; i < size; ++i) {
    Serial2.write(sequence[i]);
  }
}
//---------------------------------------------------------------



void loop(){
  server.handleClient();
// --------------------------------------------
  if(autoMode){
    // UART1(본체)에서 데이터를 읽어서 모터로 전송
    while (Serial1.available()) {
      char data1 = Serial1.read();
      Serial2.write(data1);

      if (data1 == 0xD5) {
        if (receivedData1.length() >= 30) { // 속도만 받기 위함
          receivedData1.toUpperCase();
          Serial.println(receivedData1);
        }
        receivedData1 = "";
      }
      receivedData1 += String(data1, HEX);
      receivedData1 += String(" ");
    } 

    
    // UART2(모터)에서 데이터를 읽어서 본체로 전송
    while (Serial2.available()) {
      char data2 = Serial2.read();
      Serial1.write(data2);

      if (data2 == 0xD5) {
        receivedData2.toUpperCase();
        // Serial.println(receivedData2);
        receivedData2 = "";
        
      }
      receivedData2 += String(data2, HEX);
      receivedData2 += String(" ");
    } 

  
// --------------------------------------------
  }else{
// --------------------------------------------
    // 수동 회피
    byte Speed[] = {0xD5, 0x5D, 0xFE, 0x0A, 0x83, 0x20, 0x02, 0x0A, 0x49, 0x80, 0x0B, 0x49, 0x00, 0xD4};
    sendBytes(Speed, sizeof(Speed));
    delay(10);

    // UART1(본체)에서 데이터를 읽어서 모터로 전송
    while (Serial1.available()) {
      char data = Serial1.read();

      if (data == 0xD5) {
        receivedData1.toUpperCase();
        Serial.println(receivedData1);
        receivedData1 = "";
        
      }
      receivedData1 += String(data, HEX);
    }    
  }
// --------------------------------------------
  // 모터 외 로직
  getPose(robotIP);
  getLaser(robotIP);
  // Serial.println("timeCheck");
// --------------------------------------------
}



//---------------------------------------------------------------
//---------------------------------------------------------------
void setup_wifi() {
    // 먼저 WiFi 네트워크에 연결합니다.
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print("연결 시도중!");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}